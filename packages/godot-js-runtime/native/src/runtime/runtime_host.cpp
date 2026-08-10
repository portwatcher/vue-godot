#include "godot_js_runtime/runtime/runtime_host.hpp"

#include <algorithm>
#include <atomic>
#include <chrono>
#include <cstring>
#include <regex>
#include <unordered_map>
#include <utility>

#include "godot_js_runtime/runtime/module_resolver.hpp"
#include "godot_js_runtime/runtime/runtime_module_provider.hpp"
#include "godot_js_runtime/runtime/script_metadata_key.hpp"
#include "godot_js_runtime/runtime/scoped_js_value.hpp"
#include "godot_js_runtime/runtime/source_map.hpp"
#include "godot_js_runtime/version.hpp"
#include "quickjs.h"

namespace godot_js_runtime {

namespace {

std::atomic_size_t live_runtimes = 0;

bool has_suffix(const std::string &value, const std::string &suffix) {
	return value.size() >= suffix.size() &&
			value.compare(value.size() - suffix.size(), suffix.size(), suffix) == 0;
}

struct StackLocation {
	std::string source;
	int line = 0;
	int column = 0;
};

std::optional<StackLocation> first_stack_location(const std::string &stack) {
	static const std::regex pattern(R"((res://[^\s\)]+):(\d+):(\d+))");
	std::smatch match;
	if (!std::regex_search(stack, match, pattern)) {
		return std::nullopt;
	}
	return StackLocation{
		match[1].str(),
		std::stoi(match[2].str()),
		std::stoi(match[3].str()),
	};
}

using ScopedValue = ScopedJSValue;

} // namespace

struct RuntimeHost::Impl {
	class ExecutionGuard {
	public:
		explicit ExecutionGuard(Impl &host) : host(host), owner(host.begin_execution()) {
		}

		~ExecutionGuard() {
			if (owner) {
				host.end_execution();
			}
		}

	private:
		Impl &host;
		bool owner;
	};

	class SourceGuard {
	public:
		SourceGuard(Impl &host, std::string source) :
				host(host), previous(std::move(host.current_source)) {
			host.current_source = std::move(source);
		}

		~SourceGuard() {
			host.current_source = std::move(previous);
		}

	private:
		Impl &host;
		std::string previous;
	};

	ResourceProvider &resource_provider;
	ConsoleSink &console_sink;
	RuntimeOptions options;
	RuntimeModuleProvider *module_provider;
	std::vector<std::string> enabled_features;
	JSRuntime *runtime = nullptr;
	JSContext *context = nullptr;
	std::string runtime_info;
	std::unordered_map<std::string, JSValue> commonjs_cache;
	std::unordered_map<std::string, std::string> resource_module_sources;
	SourceMapRegistry source_maps;
	std::string current_source = "<runtime>";
	std::atomic_bool interrupt_requested = false;
	bool execution_active = false;
	std::chrono::steady_clock::time_point execution_deadline;
	std::chrono::steady_clock::time_point next_interrupt_check;
	std::string startup_error;

	Impl(
			ResourceProvider &resource_provider,
			ConsoleSink &console_sink,
			RuntimeOptions options,
			RuntimeModuleProvider *module_provider) :
			resource_provider(resource_provider),
			console_sink(console_sink),
			options(options),
			module_provider(module_provider),
			enabled_features(runtime_feature_names()),
			runtime_info(std::string(PRODUCT_NAME) + " " + VERSION) {
		if (module_provider != nullptr) {
			for (const std::string &feature : module_provider->feature_names()) {
				if (std::find(enabled_features.begin(), enabled_features.end(), feature) ==
						enabled_features.end()) {
					enabled_features.push_back(feature);
				}
			}
			std::sort(enabled_features.begin(), enabled_features.end());
		}
		if (options.memory_limit_bytes == 0 || options.stack_limit_bytes == 0) {
			startup_error = "Runtime memory and stack limits must be greater than zero";
			return;
		}
		if (options.max_jobs_per_pump == 0) {
			startup_error = "Runtime Promise job limit must be greater than zero";
			return;
		}

		runtime = JS_NewRuntime();
		if (runtime == nullptr) {
			startup_error = "QuickJS-ng runtime allocation failed";
			return;
		}
		JS_SetRuntimeInfo(runtime, runtime_info.c_str());
		if (options.abort_on_leaks) {
			JS_SetDumpFlags(runtime, JS_ABORT_ON_LEAKS);
		}
		JS_SetMemoryLimit(runtime, options.memory_limit_bytes);
		JS_SetMaxStackSize(runtime, options.stack_limit_bytes);
		JS_SetCanBlock(runtime, false);
		JS_SetRuntimeOpaque(runtime, this);
		JS_SetInterruptHandler(runtime, interrupt_handler, this);
		JS_SetHostPromiseRejectionTracker(
				runtime,
				promise_rejection_tracker,
				this);
		JS_SetModuleLoaderFunc(runtime, module_normalizer, module_loader, this);

		context = JS_NewContext(runtime);
		if (context == nullptr) {
			JS_SetRuntimeOpaque(runtime, nullptr);
			JS_FreeRuntime(runtime);
			runtime = nullptr;
			startup_error = "QuickJS-ng context allocation failed within the configured memory limit";
			return;
		}
		JS_SetContextOpaque(context, this);
		live_runtimes.fetch_add(1, std::memory_order_acq_rel);

		if (!install_console()) {
			const JavaScriptException exception = capture_exception(context);
			startup_error = "Could not install JavaScript console: " + format_exception(exception);
			shutdown();
			return;
		}
		if (module_provider != nullptr) {
			std::string provider_error;
			if (!module_provider->install(context, provider_error)) {
				if (provider_error.empty()) {
					const JavaScriptException exception = capture_exception(context);
					provider_error = format_exception(exception);
				}
				startup_error = "Could not install runtime module provider: " + provider_error;
				shutdown();
			}
		}
	}

	~Impl() {
		shutdown();
	}

	void emit(ConsoleLevel level, const std::string &source, const std::string &text) noexcept {
		console_sink.write({ level, source, text });
	}

	bool begin_execution() {
		if (execution_active) {
			return false;
		}
		execution_active = true;
		next_interrupt_check = std::chrono::steady_clock::now();
		if (options.execution_timeout_milliseconds > 0) {
			execution_deadline = next_interrupt_check +
					std::chrono::milliseconds(options.execution_timeout_milliseconds);
		}
		return true;
	}

	void end_execution() {
		execution_active = false;
		interrupt_requested.store(false, std::memory_order_release);
	}

	static int interrupt_handler(JSRuntime *, void *opaque) {
		Impl *host = static_cast<Impl *>(opaque);
		if (host == nullptr) {
			return 1;
		}
		if (host->interrupt_requested.load(std::memory_order_acquire)) {
			return 1;
		}
		if (!host->execution_active ||
				host->options.execution_timeout_milliseconds == 0) {
			return 0;
		}
		const auto now = std::chrono::steady_clock::now();
		if (now < host->next_interrupt_check) {
			return 0;
		}
		host->next_interrupt_check = now + std::chrono::milliseconds(
				host->options.interrupt_interval_milliseconds);
		return now >= host->execution_deadline ? 1 : 0;
	}

	static void promise_rejection_tracker(
			JSContext *context,
			JSValueConst,
			JSValueConst reason,
			bool is_handled,
			void *opaque) {
		if (is_handled) {
			return;
		}
		Impl *host = static_cast<Impl *>(opaque);
		if (host == nullptr) {
			return;
		}
		const std::string message = host->value_to_string(context, reason);
		host->emit(
				ConsoleLevel::ERROR,
				host->source_from_current_stack(context),
				"Unhandled Promise rejection: " + message);
	}

	static char *module_normalizer(
			JSContext *context,
			const char *base_name,
			const char *module_name,
			void *opaque) {
		Impl *host = static_cast<Impl *>(opaque);
		if (host == nullptr) {
			JS_ThrowInternalError(context, "JavaScript runtime host is unavailable");
			return nullptr;
		}
		const std::string requested = module_name == nullptr
				? std::string()
				: std::string(module_name);
		if (requested == "godot-js" || requested == "godot-jsb" ||
				(host->module_provider != nullptr &&
						host->module_provider->supports_module(requested))) {
			char *normalized = static_cast<char *>(js_malloc(context, requested.size() + 1));
			if (normalized == nullptr) {
				return nullptr;
			}
			std::memcpy(normalized, requested.c_str(), requested.size() + 1);
			return normalized;
		}
		const ModuleResolution resolution = resolve_module(
				base_name == nullptr ? std::string() : std::string(base_name),
				module_name == nullptr ? std::string() : std::string(module_name),
				ModuleKind::ES_MODULE,
				[host](const std::string &path) {
					return host->resource_provider.exists(path);
				});
		if (!resolution.ok) {
			JS_ThrowReferenceError(context, "%s", resolution.error.c_str());
			return nullptr;
		}
		char *normalized = static_cast<char *>(js_malloc(context, resolution.path.size() + 1));
		if (normalized == nullptr) {
			return nullptr;
		}
		std::memcpy(normalized, resolution.path.c_str(), resolution.path.size() + 1);
		return normalized;
	}

	static JSModuleDef *module_loader(
			JSContext *context,
			const char *module_name,
			void *opaque) {
		Impl *host = static_cast<Impl *>(opaque);
		if (host == nullptr || module_name == nullptr) {
			JS_ThrowInternalError(context, "JavaScript runtime module loader is unavailable");
			return nullptr;
		}
		const std::string path(module_name);
		if (path == "godot-js") {
			return create_runtime_module(context, path);
		}
		if (path == "godot-jsb") {
			return create_compatibility_module(context, path);
		}
		if (host->module_provider != nullptr &&
				host->module_provider->supports_module(path)) {
			return host->module_provider->load_es_module(context, path);
		}
		return host->load_es_module(context, path);
	}

	static int json_module_init(JSContext *context, JSModuleDef *module) {
		JSValue value = JS_GetModulePrivateValue(context, module);
		return JS_SetModuleExport(context, module, "default", value);
	}

	static JSValue js_runtime_version(
			JSContext *context,
			JSValueConst,
			int,
			JSValueConst *) {
		return JS_NewString(context, VERSION);
	}

	static JSValue js_quickjs_version(
			JSContext *context,
			JSValueConst,
			int,
			JSValueConst *) {
		return JS_NewString(context, JS_GetVersion());
	}

	static JSValue js_runtime_features(
			JSContext *context,
			JSValueConst,
			int,
			JSValueConst *) {
		JSValue features = JS_NewArray(context);
		if (JS_IsException(features)) {
			return features;
		}
		Impl *host = static_cast<Impl *>(JS_GetContextOpaque(context));
		const std::vector<std::string> &names = host == nullptr
				? runtime_feature_names()
				: host->enabled_features;
		for (std::size_t index = 0; index < names.size(); ++index) {
			if (JS_SetPropertyUint32(
						context,
						features,
						static_cast<std::uint32_t>(index),
						JS_NewString(context, names[index].c_str())) < 0) {
				JS_FreeValue(context, features);
				return JS_EXCEPTION;
			}
		}
		return features;
	}

	static JSValue js_has_feature(
			JSContext *context,
			JSValueConst,
			int argument_count,
			JSValueConst *arguments) {
		if (argument_count < 1) {
			return JS_NewBool(context, false);
		}
		const char *feature = JS_ToCString(context, arguments[0]);
		if (feature == nullptr) {
			return JS_EXCEPTION;
		}
		Impl *host = static_cast<Impl *>(JS_GetContextOpaque(context));
		const std::vector<std::string> &features = host == nullptr
				? runtime_feature_names()
				: host->enabled_features;
		const bool present = std::find(features.begin(), features.end(), feature) != features.end();
		JS_FreeCString(context, feature);
		return JS_NewBool(context, present);
	}

	static JSValue js_collect_garbage(
			JSContext *context,
			JSValueConst,
			int,
			JSValueConst *) {
		Impl *host = static_cast<Impl *>(JS_GetContextOpaque(context));
		if (host == nullptr || host->runtime == nullptr) {
			return JS_ThrowInternalError(context, "JavaScript runtime host is unavailable");
		}
		JS_RunGC(host->runtime);
		if (host->module_provider != nullptr) {
			host->module_provider->after_garbage_collection(context);
		}
		return JS_UNDEFINED;
	}

	static JSValue js_define_script(
			JSContext *context,
			JSValueConst,
			int argument_count,
			JSValueConst *arguments) {
		if (argument_count < 2 || !JS_IsConstructor(context, arguments[0]) ||
				!JS_IsObject(arguments[1])) {
			return JS_ThrowTypeError(
					context,
					"defineScript() expects a Godot script class and metadata object");
		}
		if (JS_FreezeObject(context, arguments[1]) < 0) {
			return JS_EXCEPTION;
		}
		const JSAtom atom = script_metadata_atom(context);
		if (atom == JS_ATOM_NULL) {
			return JS_EXCEPTION;
		}
		const int status = JS_DefinePropertyValue(
				context,
				arguments[0],
				atom,
				JS_DupValue(context, arguments[1]),
				0);
		JS_FreeAtom(context, atom);
		return status < 0
				? JS_EXCEPTION
				: JS_DupValue(context, arguments[0]);
	}

	static JSValue js_get_script_metadata(
			JSContext *context,
			JSValueConst,
			int argument_count,
			JSValueConst *arguments) {
		if (argument_count < 1 ||
				(!JS_IsObject(arguments[0]) && !JS_IsFunction(context, arguments[0]))) {
			return JS_UNDEFINED;
		}
		const JSAtom atom = script_metadata_atom(context);
		if (atom == JS_ATOM_NULL) {
			return JS_EXCEPTION;
		}
		JSValue metadata = JS_GetProperty(context, arguments[0], atom);
		JS_FreeAtom(context, atom);
		return metadata;
	}

	static JSValue js_compatibility_callable(
			JSContext *context,
			JSValueConst,
			int argument_count,
			JSValueConst *arguments) {
		Impl *host = static_cast<Impl *>(JS_GetContextOpaque(context));
		if (host == nullptr || host->module_provider == nullptr) {
			return JS_ThrowInternalError(
					context,
					"godot-jsb.callable requires the Godot binding module");
		}
		ScopedValue godot_module(
				context,
				host->module_provider->load_commonjs_module(context, "godot"));
		if (JS_IsException(godot_module.get())) {
			return JS_EXCEPTION;
		}
		ScopedValue callable(
				context,
				JS_GetPropertyStr(context, godot_module.get(), "Callable"));
		ScopedValue create(
				context,
				JS_GetPropertyStr(context, callable.get(), "create"));
		if (!JS_IsFunction(context, create.get())) {
			return JS_ThrowInternalError(
					context,
					"Godot Callable.create is unavailable");
		}
		return JS_Call(
				context,
				create.get(),
				callable.get(),
				argument_count,
				arguments);
	}

	static JSValue js_compatibility_to_array_buffer(
			JSContext *context,
			JSValueConst,
			int argument_count,
			JSValueConst *arguments) {
		if (argument_count < 1) {
			return JS_ThrowTypeError(
					context,
					"godot-jsb.to_array_buffer expects a PackedByteArray");
		}
		ScopedValue method(
				context,
				JS_GetPropertyStr(context, arguments[0], "to_array_buffer"));
		if (!JS_IsFunction(context, method.get())) {
			return JS_ThrowTypeError(
					context,
					"godot-jsb.to_array_buffer expects a PackedByteArray");
		}
		return JS_Call(context, method.get(), arguments[0], 0, nullptr);
	}

	static int compatibility_module_init(JSContext *context, JSModuleDef *module) {
		if (JS_SetModuleExport(
					context,
					module,
					"callable",
					JS_NewCFunction(
							context,
							js_compatibility_callable,
							"callable",
							2)) < 0 ||
				JS_SetModuleExport(
						context,
						module,
						"to_array_buffer",
						JS_NewCFunction(
								context,
								js_compatibility_to_array_buffer,
								"to_array_buffer",
								1)) < 0 ||
				JS_SetModuleExport(
						context,
						module,
						"version",
						JS_NewString(context, VERSION)) < 0) {
			return -1;
		}
		return JS_SetModuleExport(
				context,
				module,
				"impl",
				JS_NewString(context, "QuickJS-ng"));
	}

	static JSModuleDef *create_compatibility_module(
			JSContext *context,
			const std::string &module_name) {
		JSModuleDef *module = JS_NewCModule(
				context,
				module_name.c_str(),
				compatibility_module_init);
		if (module == nullptr) {
			return nullptr;
		}
		for (const char *name : {
					 "callable",
					 "to_array_buffer",
					 "version",
					 "impl",
			 }) {
			if (JS_AddModuleExport(context, module, name) < 0) {
				return nullptr;
			}
		}
		return module;
	}

	static JSValue compatibility_module_object(JSContext *context) {
		JSValue object = JS_NewObject(context);
		if (JS_IsException(object)) {
			return object;
		}
		if (JS_SetPropertyStr(
					context,
					object,
					"callable",
					JS_NewCFunction(
							context,
							js_compatibility_callable,
							"callable",
							2)) < 0 ||
				JS_SetPropertyStr(
						context,
						object,
						"to_array_buffer",
						JS_NewCFunction(
								context,
								js_compatibility_to_array_buffer,
								"to_array_buffer",
								1)) < 0 ||
				JS_SetPropertyStr(
						context,
						object,
						"version",
						JS_NewString(context, VERSION)) < 0 ||
				JS_SetPropertyStr(
						context,
						object,
						"impl",
						JS_NewString(context, "QuickJS-ng")) < 0) {
			JS_FreeValue(context, object);
			return JS_EXCEPTION;
		}
		return object;
	}

	static int runtime_module_init(JSContext *context, JSModuleDef *module) {
		if (JS_SetModuleExport(
					context,
					module,
					"runtimeVersion",
					JS_NewCFunction(context, js_runtime_version, "runtimeVersion", 0)) < 0) {
			return -1;
		}
		if (JS_SetModuleExport(
					context,
					module,
					"quickJSVersion",
					JS_NewCFunction(context, js_quickjs_version, "quickJSVersion", 0)) < 0) {
			return -1;
		}
		if (JS_SetModuleExport(
					context,
					module,
					"runtimeFeatures",
					JS_NewCFunction(context, js_runtime_features, "runtimeFeatures", 0)) < 0) {
			return -1;
		}
		if (JS_SetModuleExport(
					context,
					module,
					"collectGarbage",
					JS_NewCFunction(context, js_collect_garbage, "collectGarbage", 0)) < 0) {
			return -1;
		}
		if (JS_SetModuleExport(
					context,
					module,
					"defineScript",
					JS_NewCFunction(context, js_define_script, "defineScript", 2)) < 0) {
			return -1;
		}
		if (JS_SetModuleExport(
					context,
					module,
					"getScriptMetadata",
					JS_NewCFunction(context, js_get_script_metadata, "getScriptMetadata", 1)) < 0) {
			return -1;
		}
		return JS_SetModuleExport(
				context,
				module,
				"hasFeature",
				JS_NewCFunction(context, js_has_feature, "hasFeature", 1));
	}

	static JSModuleDef *create_runtime_module(
			JSContext *context,
			const std::string &module_name) {
		JSModuleDef *module = JS_NewCModule(context, module_name.c_str(), runtime_module_init);
		if (module == nullptr) {
			return nullptr;
		}
		for (const char *name : {
					 "runtimeVersion",
					 "quickJSVersion",
					 "runtimeFeatures",
					 "collectGarbage",
					 "hasFeature",
					 "defineScript",
					 "getScriptMetadata",
			 }) {
			if (JS_AddModuleExport(context, module, name) < 0) {
				return nullptr;
			}
		}
		return module;
	}

	static JSValue runtime_module_object(JSContext *context) {
		JSValue object = JS_NewObject(context);
		if (JS_IsException(object)) {
			return object;
		}
		const struct {
			const char *name;
			JSCFunction *function;
			int length;
		} functions[] = {
			{ "runtimeVersion", js_runtime_version, 0 },
			{ "quickJSVersion", js_quickjs_version, 0 },
			{ "runtimeFeatures", js_runtime_features, 0 },
			{ "collectGarbage", js_collect_garbage, 0 },
			{ "hasFeature", js_has_feature, 1 },
			{ "defineScript", js_define_script, 2 },
			{ "getScriptMetadata", js_get_script_metadata, 1 },
		};
		for (const auto &function : functions) {
			if (JS_SetPropertyStr(
						context,
						object,
						function.name,
						JS_NewCFunction(
								context,
								function.function,
								function.name,
								function.length)) < 0) {
				JS_FreeValue(context, object);
				return JS_EXCEPTION;
			}
		}
		return object;
	}

	static JSValue console_callback(
			JSContext *context,
			JSValueConst,
			int argument_count,
			JSValueConst *arguments,
			int magic) {
		Impl *host = static_cast<Impl *>(JS_GetContextOpaque(context));
		if (host == nullptr) {
			return JS_UNDEFINED;
		}
		std::string text;
		for (int index = 0; index < argument_count; ++index) {
			if (index > 0) {
				text += ' ';
			}
			text += host->value_to_string(context, arguments[index]);
		}
		const ConsoleLevel levels[] = {
			ConsoleLevel::DEBUG,
			ConsoleLevel::LOG,
			ConsoleLevel::INFO,
			ConsoleLevel::WARNING,
			ConsoleLevel::ERROR,
		};
		const int safe_magic = magic >= 0 && magic < 5 ? magic : 1;
		host->emit(
				levels[safe_magic],
				host->source_from_current_stack(context),
				text);
		return JS_UNDEFINED;
	}

	bool install_console() {
		ScopedValue global(context, JS_GetGlobalObject(context));
		ScopedValue console(context, JS_NewObject(context));
		if (JS_IsException(global.get()) || JS_IsException(console.get())) {
			return false;
		}
		const char *names[] = { "debug", "log", "info", "warn", "error" };
		for (int index = 0; index < 5; ++index) {
			if (JS_SetPropertyStr(
						context,
						console.get(),
						names[index],
						JS_NewCFunctionMagic(
								context,
								console_callback,
								names[index],
								1,
								JS_CFUNC_generic_magic,
								index)) < 0) {
				return false;
			}
		}
		return JS_SetPropertyStr(
					   context,
					   global.get(),
					   "console",
					   console.release()) >= 0;
	}

	std::string value_to_string(JSContext *value_context, JSValueConst value) {
		const char *characters = JS_ToCString(value_context, value);
		if (characters == nullptr) {
			ScopedValue conversion_exception(value_context, JS_GetException(value_context));
			return "<unprintable>";
		}
		std::string result(characters);
		JS_FreeCString(value_context, characters);
		return result;
	}

	std::string property_string(
			JSContext *value_context,
			JSValueConst object,
			const char *name) {
		ScopedValue value(value_context, JS_GetPropertyStr(value_context, object, name));
		if (JS_IsException(value.get()) || JS_IsUndefined(value.get()) ||
				JS_IsNull(value.get())) {
			if (JS_IsException(value.get())) {
				ScopedValue property_exception(value_context, JS_GetException(value_context));
			}
			return {};
		}
		return value_to_string(value_context, value.get());
	}

	int property_integer(
			JSContext *value_context,
			JSValueConst object,
			const char *name) {
		ScopedValue value(value_context, JS_GetPropertyStr(value_context, object, name));
		if (JS_IsException(value.get()) || JS_IsUndefined(value.get()) ||
				JS_IsNull(value.get())) {
			if (JS_IsException(value.get())) {
				ScopedValue property_exception(value_context, JS_GetException(value_context));
			}
			return 0;
		}
		std::int32_t integer = 0;
		if (JS_ToInt32(value_context, &integer, value.get()) < 0) {
			ScopedValue conversion_exception(value_context, JS_GetException(value_context));
			return 0;
		}
		return integer;
	}

	std::string source_from_current_stack(JSContext *value_context) {
		ScopedValue error(value_context, JS_NewError(value_context));
		if (!JS_IsException(error.get())) {
			const std::string stack = property_string(value_context, error.get(), "stack");
			const std::optional<StackLocation> location = first_stack_location(stack);
			if (location.has_value()) {
				return location->source + ":" + std::to_string(location->line);
			}
		}
		return current_source;
	}

	JavaScriptException capture_exception(JSContext *error_context) {
		ScopedValue exception(error_context, JS_GetException(error_context));
		JavaScriptException converted;
		converted.name = property_string(error_context, exception.get(), "name");
		converted.message = property_string(error_context, exception.get(), "message");
		converted.stack = property_string(error_context, exception.get(), "stack");
		converted.source = property_string(error_context, exception.get(), "fileName");
		converted.line = property_integer(error_context, exception.get(), "lineNumber");
		converted.column = property_integer(error_context, exception.get(), "columnNumber");
		if (converted.message.empty()) {
			converted.message = value_to_string(error_context, exception.get());
		}
		if (converted.name.empty()) {
			converted.name = "Error";
		}
		const std::optional<StackLocation> location = first_stack_location(converted.stack);
		if (converted.source.empty() && location.has_value()) {
			converted.source = location->source;
		}
		if (converted.line <= 0 && location.has_value()) {
			converted.line = location->line;
		}
		if (converted.column <= 0 && location.has_value()) {
			converted.column = location->column;
		}
		if (!converted.source.empty() && converted.line > 0 && converted.column > 0) {
			const std::optional<SourcePosition> original = source_maps.original_position(
					converted.source,
					converted.line,
					converted.column);
			if (original.has_value()) {
				converted.source = original->source;
				converted.line = original->line;
				converted.column = original->column;
				converted.source_mapped = true;
			}
		}
		converted.stack = source_maps.remap_stack(converted.stack);
		return converted;
	}

	EvaluationResult exception_result(JSContext *error_context) {
		EvaluationResult result;
		result.exception = capture_exception(error_context);
		return result;
	}

	EvaluationResult host_error(
			const std::string &message,
			const std::string &name = "RuntimeError",
			const std::string &source = {}) const {
		EvaluationResult result;
		result.exception = JavaScriptException{ name, message, {}, source, 0, 0, false };
		return result;
	}

	EvaluationResult success(JSValueConst value) {
		EvaluationResult result;
		result.ok = true;
		result.value = value_to_string(context, value);
		return result;
	}

	void register_source_map(
			const std::string &generated_path,
			const std::string &source) {
		const std::optional<std::string> source_mapping_url = find_source_mapping_url(source);
		if (!source_mapping_url.has_value()) {
			return;
		}
		if (source_mapping_url->rfind("data:", 0) == 0) {
			emit(
					ConsoleLevel::WARNING,
					generated_path,
					"Inline source maps are not supported; using generated JavaScript locations");
			return;
		}
		std::string specifier = *source_mapping_url;
		if (!is_resource_path(specifier) &&
				!specifier.empty() && specifier.front() != '/') {
			specifier = "./" + specifier;
		}
		const ModuleResolution map_path = normalize_resource_path(generated_path, specifier);
		if (!map_path.ok) {
			emit(ConsoleLevel::WARNING, generated_path, map_path.error);
			return;
		}
		std::string map_json;
		std::string read_error;
		if (!resource_provider.read_text(map_path.path, map_json, read_error)) {
			emit(
					ConsoleLevel::WARNING,
					generated_path,
					"Could not read source map '" + map_path.path + "': " + read_error);
			return;
		}
		std::string parse_error;
		if (!source_maps.register_map(generated_path, map_json, parse_error)) {
			emit(
					ConsoleLevel::WARNING,
					generated_path,
					"Could not parse source map '" + map_path.path + "': " + parse_error);
		}
	}

	void observe_resource_module(
			const std::string &path,
			const std::string &source) {
		resource_module_sources.insert_or_assign(path, source);
	}

	std::vector<std::string> consume_changed_resource_module_paths() {
		std::vector<std::string> changed_paths;
		for (auto &[path, observed_source] : resource_module_sources) {
			std::string source;
			std::string read_error;
			if (!resource_provider.read_text(path, source, read_error) ||
					source == observed_source) {
				continue;
			}
			observed_source = std::move(source);
			changed_paths.push_back(path);
		}
		std::sort(changed_paths.begin(), changed_paths.end());
		return changed_paths;
	}

	JSModuleDef *load_es_module(JSContext *module_context, const std::string &path) {
		std::string source;
		std::string read_error;
		if (!resource_provider.read_text(path, source, read_error)) {
			JS_ThrowReferenceError(
					module_context,
					"Could not read module '%s': %s",
					path.c_str(),
					read_error.c_str());
			return nullptr;
		}
		observe_resource_module(path, source);
		if (has_suffix(path, ".json")) {
			ScopedValue parsed(
					module_context,
					JS_ParseJSON(module_context, source.c_str(), source.size(), path.c_str()));
			if (JS_IsException(parsed.get())) {
				return nullptr;
			}
			JSModuleDef *module = JS_NewCModule(module_context, path.c_str(), json_module_init);
			if (module == nullptr || JS_AddModuleExport(module_context, module, "default") < 0) {
				return nullptr;
			}
			if (JS_SetModulePrivateValue(module_context, module, parsed.release()) < 0) {
				return nullptr;
			}
			return module;
		}

		register_source_map(path, source);
		ScopedValue compiled(
				module_context,
				JS_Eval(
						module_context,
						source.c_str(),
						source.size(),
						path.c_str(),
						JS_EVAL_TYPE_MODULE | JS_EVAL_FLAG_COMPILE_ONLY));
		if (JS_IsException(compiled.get())) {
			return nullptr;
		}
		if (!JS_IsModule(compiled.get())) {
			JS_ThrowInternalError(module_context, "Compiled module has an unexpected value type");
			return nullptr;
		}
		JSModuleDef *module = static_cast<JSModuleDef *>(JS_VALUE_GET_PTR(compiled.get()));
		return module;
	}

	static JSValue commonjs_require_callback(
			JSContext *context,
			JSValueConst,
			int argument_count,
			JSValueConst *arguments,
			int,
			JSValueConst *function_data) {
		Impl *host = static_cast<Impl *>(JS_GetContextOpaque(context));
		if (host == nullptr) {
			return JS_ThrowInternalError(context, "CommonJS require state is unavailable");
		}
		if (argument_count < 1) {
			return JS_ThrowTypeError(context, "require() expects a module specifier");
		}
		const char *specifier = JS_ToCString(context, arguments[0]);
		if (specifier == nullptr) {
			return JS_EXCEPTION;
		}
		const char *base_path = JS_ToCString(context, function_data[0]);
		if (base_path == nullptr) {
			JS_FreeCString(context, specifier);
			return JS_EXCEPTION;
		}
		const std::string module_name(specifier);
		const std::string module_base(base_path);
		JS_FreeCString(context, specifier);
		JS_FreeCString(context, base_path);
		return host->require_module(context, module_base, module_name);
	}

	JSValue create_require(JSContext *require_context, const std::string &base_path) {
		ScopedValue base(require_context, JS_NewString(require_context, base_path.c_str()));
		if (JS_IsException(base.get())) {
			return JS_EXCEPTION;
		}
		JSValueConst function_data[] = { base.get() };
		return JS_NewCFunctionData2(
				require_context,
				commonjs_require_callback,
				"require",
				1,
				0,
				1,
				function_data);
	}

	JSValue require_module(
			JSContext *require_context,
			const std::string &base_path,
			const std::string &specifier) {
		if (specifier == "godot-js") {
			return runtime_module_object(require_context);
		}
		if (specifier == "godot-jsb") {
			return compatibility_module_object(require_context);
		}
		if (module_provider != nullptr && module_provider->supports_module(specifier)) {
			return module_provider->load_commonjs_module(require_context, specifier);
		}
		const ModuleResolution resolution = resolve_module(
				base_path,
				specifier,
				ModuleKind::COMMONJS,
				[this](const std::string &path) {
					return resource_provider.exists(path);
				});
		if (!resolution.ok) {
			return JS_ThrowReferenceError(require_context, "%s", resolution.error.c_str());
		}
		if (resolution.virtual_module) {
			return runtime_module_object(require_context);
		}
		return load_commonjs(require_context, resolution.path);
	}

	JSValue load_commonjs(JSContext *require_context, const std::string &path) {
		const auto cached = commonjs_cache.find(path);
		if (cached != commonjs_cache.end()) {
			return JS_GetPropertyStr(require_context, cached->second, "exports");
		}
		if (has_suffix(path, ".mjs")) {
			return JS_ThrowTypeError(
					require_context,
					"CommonJS require() cannot load ES module '%s'",
					path.c_str());
		}

		std::string source;
		std::string read_error;
		if (!resource_provider.read_text(path, source, read_error)) {
			return JS_ThrowReferenceError(
					require_context,
					"Could not read CommonJS module '%s': %s",
					path.c_str(),
					read_error.c_str());
		}
		observe_resource_module(path, source);
		if (has_suffix(path, ".json")) {
			ScopedValue parsed(
					require_context,
					JS_ParseJSON(require_context, source.c_str(), source.size(), path.c_str()));
			if (JS_IsException(parsed.get())) {
				return JS_EXCEPTION;
			}
			ScopedValue module(require_context, JS_NewObject(require_context));
			if (JS_IsException(module.get()) ||
					JS_SetPropertyStr(
							require_context,
							module.get(),
							"exports",
							JS_DupValue(require_context, parsed.get())) < 0) {
				return JS_EXCEPTION;
			}
			commonjs_cache.emplace(path, JS_DupValue(require_context, module.get()));
			return parsed.release();
		}

		register_source_map(path, source);
		const std::string wrapped_source =
				"(function (exports, require, module, __filename, __dirname) {" +
				source + "\n})";
		ScopedValue wrapper(
				require_context,
				JS_Eval(
						require_context,
						wrapped_source.c_str(),
						wrapped_source.size(),
						path.c_str(),
						JS_EVAL_TYPE_GLOBAL | JS_EVAL_FLAG_BACKTRACE_BARRIER));
		if (JS_IsException(wrapper.get())) {
			return JS_EXCEPTION;
		}

		ScopedValue module(require_context, JS_NewObject(require_context));
		ScopedValue exports(require_context, JS_NewObject(require_context));
		if (JS_IsException(module.get()) || JS_IsException(exports.get()) ||
				JS_SetPropertyStr(
						require_context,
						module.get(),
						"exports",
						JS_DupValue(require_context, exports.get())) < 0) {
			return JS_EXCEPTION;
		}
		commonjs_cache.emplace(path, JS_DupValue(require_context, module.get()));

		ScopedValue require_function(require_context, create_require(require_context, path));
		ScopedValue filename(require_context, JS_NewString(require_context, path.c_str()));
		const std::string directory = resource_directory(path);
		ScopedValue dirname(require_context, JS_NewString(require_context, directory.c_str()));
		if (JS_IsException(require_function.get()) || JS_IsException(filename.get()) ||
				JS_IsException(dirname.get())) {
			remove_commonjs_cache_entry(path);
			return JS_EXCEPTION;
		}

		JSValueConst arguments[] = {
			exports.get(),
			require_function.get(),
			module.get(),
			filename.get(),
			dirname.get(),
		};
		SourceGuard source_guard(*this, path);
		ScopedValue call_result(
				require_context,
				JS_Call(
						require_context,
						wrapper.get(),
						exports.get(),
						5,
						arguments));
		if (JS_IsException(call_result.get())) {
			remove_commonjs_cache_entry(path);
			return JS_EXCEPTION;
		}
		return JS_GetPropertyStr(require_context, module.get(), "exports");
	}

	void remove_commonjs_cache_entry(const std::string &path) {
		const auto iterator = commonjs_cache.find(path);
		if (iterator == commonjs_cache.end()) {
			return;
		}
		JS_FreeValue(context, iterator->second);
		commonjs_cache.erase(iterator);
	}

	ModuleResolution resolve_entry(const std::string &entry_path, ModuleKind kind) {
		if (!is_resource_path(entry_path)) {
			return { false, false, {}, "Runtime entry path must use res://: " + entry_path };
		}
		return resolve_module(
				"res://__entry__.js",
				entry_path,
				kind,
				[this](const std::string &path) {
					return resource_provider.exists(path);
				});
	}

	EvaluationResult evaluate_script(
			const std::string &source,
			const std::string &source_path) {
		if (context == nullptr) {
			return host_error("JavaScript runtime has been shut down");
		}
		register_source_map(source_path, source);
		ExecutionGuard execution_guard(*this);
		SourceGuard source_guard(*this, source_path);
		ScopedValue value(
				context,
				JS_Eval(
						context,
						source.c_str(),
						source.size(),
						source_path.c_str(),
						JS_EVAL_TYPE_GLOBAL | JS_EVAL_FLAG_BACKTRACE_BARRIER));
		return JS_IsException(value.get()) ? exception_result(context) : success(value.get());
	}

	EvaluationResult validate_syntax(
			const std::string &source,
			const std::string &source_path,
			bool module) {
		if (context == nullptr) {
			return host_error("JavaScript runtime has been shut down");
		}
		ExecutionGuard execution_guard(*this);
		SourceGuard source_guard(*this, source_path);
		const int flags = (module ? JS_EVAL_TYPE_MODULE : JS_EVAL_TYPE_GLOBAL) |
				JS_EVAL_FLAG_COMPILE_ONLY | JS_EVAL_FLAG_BACKTRACE_BARRIER;
		ScopedValue compiled(
				context,
				JS_Eval(
						context,
						source.c_str(),
						source.size(),
						source_path.c_str(),
						flags));
		if (JS_IsException(compiled.get())) {
			return exception_result(context);
		}
		EvaluationResult result;
		result.ok = true;
		result.value = "valid";
		return result;
	}

	EvaluationResult evaluate_module(const std::string &entry_path) {
		if (context == nullptr) {
			return host_error("JavaScript runtime has been shut down");
		}
		const ModuleResolution entry = resolve_entry(entry_path, ModuleKind::ES_MODULE);
		if (!entry.ok || entry.virtual_module) {
			return host_error(
					entry.ok ? "A virtual module cannot be used as the runtime entry" : entry.error,
					"ModuleResolutionError",
					entry_path);
		}
		if (has_suffix(entry.path, ".json")) {
			return host_error(
					"A JSON module cannot be used as the runtime entry",
					"ModuleTypeError",
					entry.path);
		}
		std::string source;
		std::string read_error;
		if (!resource_provider.read_text(entry.path, source, read_error)) {
			return host_error(read_error, "ModuleReadError", entry.path);
		}
		observe_resource_module(entry.path, source);

		register_source_map(entry.path, source);
		ExecutionGuard execution_guard(*this);
		SourceGuard source_guard(*this, entry.path);
		ScopedValue compiled(
				context,
				JS_Eval(
						context,
						source.c_str(),
						source.size(),
						entry.path.c_str(),
						JS_EVAL_TYPE_MODULE | JS_EVAL_FLAG_COMPILE_ONLY));
		if (JS_IsException(compiled.get())) {
			return exception_result(context);
		}
		if (!JS_IsModule(compiled.get())) {
			return host_error("Compiled entry is not an ES module", "ModuleTypeError", entry.path);
		}

		JSModuleDef *module = static_cast<JSModuleDef *>(JS_VALUE_GET_PTR(compiled.get()));
		ScopedValue import_meta(context, JS_GetImportMeta(context, module));
		if (!JS_IsException(import_meta.get())) {
			JS_SetPropertyStr(
					context,
					import_meta.get(),
					"url",
					JS_NewString(context, entry.path.c_str()));
			JS_SetPropertyStr(
					context,
					import_meta.get(),
					"main",
					JS_NewBool(context, true));
		}
		ScopedValue value(context, JS_EvalFunction(context, compiled.release()));
		return JS_IsException(value.get()) ? exception_result(context) : success(value.get());
	}

	EvaluationResult evaluate_module_default(
			const std::string &entry_path,
			JSValue &default_export) {
		default_export = JS_UNDEFINED;
		if (context == nullptr) {
			return host_error("JavaScript runtime has been shut down");
		}
		const ModuleResolution entry = resolve_entry(entry_path, ModuleKind::ES_MODULE);
		if (!entry.ok || entry.virtual_module) {
			return host_error(
					entry.ok ? "A virtual module cannot be used as the runtime entry" : entry.error,
					"ModuleResolutionError",
					entry_path);
		}
		if (has_suffix(entry.path, ".json")) {
			return host_error(
					"A JSON module cannot be used as the runtime entry",
					"ModuleTypeError",
					entry.path);
		}
		std::string source;
		std::string read_error;
		if (!resource_provider.read_text(entry.path, source, read_error)) {
			return host_error(read_error, "ModuleReadError", entry.path);
		}
		observe_resource_module(entry.path, source);

		register_source_map(entry.path, source);
		ExecutionGuard execution_guard(*this);
		SourceGuard source_guard(*this, entry.path);
		ScopedValue compiled(
				context,
				JS_Eval(
						context,
						source.c_str(),
						source.size(),
						entry.path.c_str(),
						JS_EVAL_TYPE_MODULE | JS_EVAL_FLAG_COMPILE_ONLY));
		if (JS_IsException(compiled.get())) {
			return exception_result(context);
		}
		if (!JS_IsModule(compiled.get())) {
			return host_error("Compiled entry is not an ES module", "ModuleTypeError", entry.path);
		}

		JSModuleDef *module = static_cast<JSModuleDef *>(JS_VALUE_GET_PTR(compiled.get()));
		ScopedValue import_meta(context, JS_GetImportMeta(context, module));
		if (!JS_IsException(import_meta.get())) {
			JS_SetPropertyStr(
					context,
					import_meta.get(),
					"url",
					JS_NewString(context, entry.path.c_str()));
			JS_SetPropertyStr(
					context,
					import_meta.get(),
					"main",
					JS_NewBool(context, true));
		}
		ScopedValue evaluation(context, JS_EvalFunction(context, compiled.release()));
		if (JS_IsException(evaluation.get())) {
			return exception_result(context);
		}
		ScopedValue module_namespace(context, JS_GetModuleNamespace(context, module));
		if (JS_IsException(module_namespace.get())) {
			return exception_result(context);
		}
		ScopedValue exported(
				context,
				JS_GetPropertyStr(context, module_namespace.get(), "default"));
		if (JS_IsException(exported.get())) {
			return exception_result(context);
		}
		default_export = exported.release();
		EvaluationResult result;
		result.ok = true;
		result.value = "default";
		return result;
	}

	EvaluationResult evaluate_commonjs(const std::string &entry_path) {
		if (context == nullptr) {
			return host_error("JavaScript runtime has been shut down");
		}
		const ModuleResolution entry = resolve_entry(entry_path, ModuleKind::COMMONJS);
		if (!entry.ok || entry.virtual_module) {
			return host_error(
					entry.ok ? "A virtual module cannot be used as the runtime entry" : entry.error,
					"ModuleResolutionError",
					entry_path);
		}
		ExecutionGuard execution_guard(*this);
		SourceGuard source_guard(*this, entry.path);
		ScopedValue value(context, load_commonjs(context, entry.path));
		return JS_IsException(value.get()) ? exception_result(context) : success(value.get());
	}

	EvaluationResult evaluate_commonjs_default(
			const std::string &entry_path,
			JSValue &default_export) {
		default_export = JS_UNDEFINED;
		if (context == nullptr) {
			return host_error("JavaScript runtime has been shut down");
		}
		const ModuleResolution entry = resolve_entry(entry_path, ModuleKind::COMMONJS);
		if (!entry.ok || entry.virtual_module) {
			return host_error(
					entry.ok ? "A virtual module cannot be used as the runtime entry" : entry.error,
					"ModuleResolutionError",
					entry_path);
		}
		ExecutionGuard execution_guard(*this);
		SourceGuard source_guard(*this, entry.path);
		ScopedValue exports(context, load_commonjs(context, entry.path));
		if (JS_IsException(exports.get())) {
			return exception_result(context);
		}
		if (JS_IsFunction(context, exports.get())) {
			default_export = exports.release();
		} else {
			ScopedValue exported(
					context,
					JS_GetPropertyStr(context, exports.get(), "default"));
			if (JS_IsException(exported.get())) {
				return exception_result(context);
			}
			default_export = exported.release();
		}
		EvaluationResult result;
		result.ok = true;
		result.value = "default";
		return result;
	}

	EvaluationResult run_javascript_operation(
			const std::string &source_path,
			const JavaScriptOperation &operation,
			JSValue *result_value) {
		if (context == nullptr) {
			return host_error("JavaScript runtime has been shut down");
		}
		ExecutionGuard execution_guard(*this);
		SourceGuard source_guard(*this, source_path);
		ScopedValue value(context, operation(context));
		if (JS_IsException(value.get())) {
			return exception_result(context);
		}
		if (result_value != nullptr) {
			*result_value = value.release();
		}
		EvaluationResult result;
		result.ok = true;
		result.value = "ok";
		return result;
	}

	EvaluationResult pump_jobs() {
		if (context == nullptr || runtime == nullptr) {
			return host_error("JavaScript runtime has been shut down");
		}
		ExecutionGuard execution_guard(*this);
		EvaluationResult result;
		result.ok = true;
		while (JS_IsJobPending(runtime) && result.jobs_executed < options.max_jobs_per_pump) {
			JSContext *job_context = nullptr;
			const int status = JS_ExecutePendingJob(runtime, &job_context);
			if (status < 0) {
				EvaluationResult failed = exception_result(
						job_context == nullptr ? context : job_context);
				failed.jobs_executed = result.jobs_executed;
				return failed;
			}
			++result.jobs_executed;
		}
		if (JS_IsJobPending(runtime)) {
			EvaluationResult failed = host_error(
					"Promise job limit exceeded before the queue drained",
					"RuntimeLimitError",
					current_source);
			failed.jobs_executed = result.jobs_executed;
			return failed;
		}
		result.value = std::to_string(result.jobs_executed);
		return result;
	}

	void shutdown() {
		if (runtime == nullptr) {
			return;
		}
		if (context != nullptr) {
			if (module_provider != nullptr) {
				module_provider->shutdown(context);
			}
			for (auto &entry : commonjs_cache) {
				JS_FreeValue(context, entry.second);
			}
			commonjs_cache.clear();
			source_maps.clear();
			JS_SetContextOpaque(context, nullptr);
			JS_FreeContext(context);
			context = nullptr;
		}
		JS_RunGC(runtime);
		JS_SetRuntimeOpaque(runtime, nullptr);
		JS_FreeRuntime(runtime);
		runtime = nullptr;
		live_runtimes.fetch_sub(1, std::memory_order_acq_rel);
	}
};

std::string format_exception(const JavaScriptException &exception) {
	std::string formatted = exception.name.empty() ? "Error" : exception.name;
	if (!exception.message.empty()) {
		formatted += ": " + exception.message;
	}
	if (!exception.source.empty()) {
		formatted += " (" + exception.source;
		if (exception.line > 0) {
			formatted += ":" + std::to_string(exception.line);
			if (exception.column > 0) {
				formatted += ":" + std::to_string(exception.column);
			}
		}
		formatted += ")";
	}
	if (!exception.stack.empty()) {
		formatted += "\n" + exception.stack;
	}
	return formatted;
}

RuntimeHost::RuntimeHost(
		ResourceProvider &resource_provider,
		ConsoleSink &console_sink,
		RuntimeOptions options,
		RuntimeModuleProvider *module_provider) :
		impl(std::make_unique<Impl>(
				resource_provider,
				console_sink,
				options,
				module_provider)) {
}

RuntimeHost::~RuntimeHost() = default;
RuntimeHost::RuntimeHost(RuntimeHost &&) noexcept = default;
RuntimeHost &RuntimeHost::operator=(RuntimeHost &&) noexcept = default;

EvaluationResult RuntimeHost::evaluate_script(
		const std::string &source,
		const std::string &source_path) {
	return impl == nullptr
			? EvaluationResult{
				  false,
				  {},
				  JavaScriptException{ "RuntimeError", "Runtime host was moved", {}, {}, 0, 0, false },
				  0,
			  }
			: impl->evaluate_script(source, source_path);
}

EvaluationResult RuntimeHost::validate_syntax(
		const std::string &source,
		const std::string &source_path,
		bool module) {
	return impl == nullptr
			? EvaluationResult{
				  false,
				  {},
				  JavaScriptException{ "RuntimeError", "Runtime host was moved", {}, {}, 0, 0, false },
				  0,
			  }
			: impl->validate_syntax(source, source_path, module);
}

EvaluationResult RuntimeHost::evaluate_module(const std::string &entry_path) {
	return impl == nullptr
			? EvaluationResult{
				  false,
				  {},
				  JavaScriptException{ "RuntimeError", "Runtime host was moved", {}, {}, 0, 0, false },
				  0,
			  }
			: impl->evaluate_module(entry_path);
}

EvaluationResult RuntimeHost::evaluate_commonjs(const std::string &entry_path) {
	return impl == nullptr
			? EvaluationResult{
				  false,
				  {},
				  JavaScriptException{ "RuntimeError", "Runtime host was moved", {}, {}, 0, 0, false },
				  0,
			  }
			: impl->evaluate_commonjs(entry_path);
}

EvaluationResult RuntimeHost::evaluate_module_default(
		const std::string &entry_path,
		JSValue &default_export) {
	default_export = JS_UNDEFINED;
	return impl == nullptr
			? EvaluationResult{
				  false,
				  {},
				  JavaScriptException{ "RuntimeError", "Runtime host was moved", {}, {}, 0, 0, false },
				  0,
			  }
			: impl->evaluate_module_default(entry_path, default_export);
}

EvaluationResult RuntimeHost::evaluate_commonjs_default(
		const std::string &entry_path,
		JSValue &default_export) {
	default_export = JS_UNDEFINED;
	return impl == nullptr
			? EvaluationResult{
				  false,
				  {},
				  JavaScriptException{ "RuntimeError", "Runtime host was moved", {}, {}, 0, 0, false },
				  0,
			  }
			: impl->evaluate_commonjs_default(entry_path, default_export);
}

EvaluationResult RuntimeHost::run_javascript_operation(
		const std::string &source_path,
		const JavaScriptOperation &operation,
		JSValue *result) {
	if (result != nullptr) {
		*result = JS_UNDEFINED;
	}
	return impl == nullptr
			? EvaluationResult{
				  false,
				  {},
				  JavaScriptException{ "RuntimeError", "Runtime host was moved", {}, {}, 0, 0, false },
				  0,
			  }
			: impl->run_javascript_operation(source_path, operation, result);
}

EvaluationResult RuntimeHost::pump_jobs() {
	return impl == nullptr
			? EvaluationResult{
				  false,
				  {},
				  JavaScriptException{ "RuntimeError", "Runtime host was moved", {}, {}, 0, 0, false },
				  0,
			  }
			: impl->pump_jobs();
}

std::vector<std::string> RuntimeHost::consume_changed_resource_module_paths() {
	return impl == nullptr
			? std::vector<std::string>{}
			: impl->consume_changed_resource_module_paths();
}

void RuntimeHost::request_interrupt() {
	if (impl != nullptr) {
		impl->interrupt_requested.store(true, std::memory_order_release);
	}
}

void RuntimeHost::collect_garbage() {
	if (impl != nullptr && impl->runtime != nullptr) {
		JS_RunGC(impl->runtime);
		if (impl->module_provider != nullptr && impl->context != nullptr) {
			impl->module_provider->after_garbage_collection(impl->context);
		}
	}
}

std::size_t RuntimeHost::memory_usage_bytes() const {
	if (impl == nullptr || impl->runtime == nullptr) {
		return 0;
	}
	JSMemoryUsage usage{};
	JS_ComputeMemoryUsage(impl->runtime, &usage);
	return usage.malloc_size <= 0 ? 0 : static_cast<std::size_t>(usage.malloc_size);
}

void RuntimeHost::shutdown() {
	if (impl != nullptr) {
		impl->shutdown();
	}
}

bool RuntimeHost::is_running() const {
	return impl != nullptr && impl->runtime != nullptr && impl->context != nullptr;
}

bool RuntimeHost::is_executing() const {
	return impl != nullptr && impl->execution_active;
}

std::string RuntimeHost::initialization_error() const {
	return impl == nullptr ? std::string("Runtime host was moved") : impl->startup_error;
}

JSContext *RuntimeHost::javascript_context() const noexcept {
	return impl == nullptr ? nullptr : impl->context;
}

std::size_t RuntimeHost::live_runtime_count() {
	return live_runtimes.load(std::memory_order_acquire);
}

std::string RuntimeHost::runtime_version() {
	return VERSION;
}

std::string RuntimeHost::quickjs_version() {
	return JS_GetVersion();
}

const std::vector<std::string> &RuntimeHost::runtime_features() {
	return runtime_feature_names();
}

} // namespace godot_js_runtime
