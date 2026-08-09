#include "godot_js_runtime/scripting/javascript_project_runtime.hpp"

#include <algorithm>
#include <cctype>
#include <cstdint>
#include <limits>
#include <optional>
#include <sstream>
#include <string>
#include <thread>
#include <unordered_map>
#include <utility>
#include <vector>

#include <godot_cpp/godot.hpp>
#include <godot_cpp/variant/array.hpp>
#include <godot_cpp/variant/utility_functions.hpp>

#include "godot_js_runtime/modules/godot_binding.hpp"
#include "godot_js_runtime/runtime/godot_environment.hpp"
#include "godot_js_runtime/runtime/runtime_host.hpp"
#include "godot_js_runtime/runtime/runtime_project_settings.hpp"
#include "godot_js_runtime/runtime/scoped_js_value.hpp"
#include "godot_js_runtime/runtime/script_metadata_key.hpp"
#include "godot_js_runtime/scripting/javascript_script.hpp"
#include "godot_js_runtime/scripting/javascript_script_instance.hpp"

namespace godot_js_runtime {

namespace {

std::string standard_string(const godot::String &value) {
	const godot::CharString utf8 = value.utf8();
	return std::string(utf8.get_data(), static_cast<std::size_t>(utf8.length()));
}

std::string standard_string(const godot::StringName &value) {
	return standard_string(static_cast<godot::String>(value));
}

godot::String godot_string(const std::string &value) {
	return godot::String::utf8(value.c_str(), static_cast<std::int64_t>(value.size()));
}

std::string evaluation_error(const EvaluationResult &result) {
	return result.exception.has_value()
			? format_exception(*result.exception)
			: std::string("Unknown JavaScript runtime failure");
}

bool javascript_string(
		JSContext *context,
		JSValueConst value,
		std::string &result,
		std::string &error) {
	if (!JS_IsString(value)) {
		error = "expected a string";
		return false;
	}
	std::size_t length = 0;
	const char *characters = JS_ToCStringLen(context, &length, value);
	if (characters == nullptr) {
		error = "could not decode a JavaScript string";
		return false;
	}
	result.assign(characters, length);
	JS_FreeCString(context, characters);
	return true;
}

bool own_string_keys(
		JSContext *context,
		JSValueConst object,
		std::vector<std::string> &keys,
		std::string &error) {
	JSPropertyEnum *properties = nullptr;
	std::uint32_t count = 0;
	if (JS_GetOwnPropertyNames(
				context,
				&properties,
				&count,
				object,
				JS_GPN_STRING_MASK) < 0) {
		error = "could not enumerate metadata properties";
		return false;
	}
	keys.reserve(keys.size() + count);
	for (std::uint32_t index = 0; index < count; ++index) {
		const char *name = JS_AtomToCString(context, properties[index].atom);
		if (name == nullptr) {
			JS_FreePropertyEnum(context, properties, count);
			error = "could not decode a metadata property name";
			return false;
		}
		keys.emplace_back(name);
		JS_FreeCString(context, name);
	}
	JS_FreePropertyEnum(context, properties, count);
	std::sort(keys.begin(), keys.end());
	return true;
}

struct PropertyTypeDescriptor {
	godot::Variant::Type type = godot::Variant::NIL;
	std::string binding_type = "Variant";
	godot::StringName class_name;
};

std::optional<PropertyTypeDescriptor> property_type_descriptor(
		const std::string &type_name) {
	static const std::unordered_map<std::string, PropertyTypeDescriptor> types{
		{ "nil", { godot::Variant::NIL, "Variant", {} } },
		{ "variant", { godot::Variant::NIL, "Variant", {} } },
		{ "bool", { godot::Variant::BOOL, "bool", {} } },
		{ "int", { godot::Variant::INT, "int", {} } },
		{ "float", { godot::Variant::FLOAT, "float", {} } },
		{ "string", { godot::Variant::STRING, "String", {} } },
		{ "string_name", { godot::Variant::STRING_NAME, "StringName", {} } },
		{ "node_path", { godot::Variant::NODE_PATH, "NodePath", {} } },
		{ "vector2", { godot::Variant::VECTOR2, "Vector2", {} } },
		{ "vector2i", { godot::Variant::VECTOR2I, "Vector2i", {} } },
		{ "rect2", { godot::Variant::RECT2, "Rect2", {} } },
		{ "rect2i", { godot::Variant::RECT2I, "Rect2i", {} } },
		{ "vector3", { godot::Variant::VECTOR3, "Vector3", {} } },
		{ "vector3i", { godot::Variant::VECTOR3I, "Vector3i", {} } },
		{ "transform2d", { godot::Variant::TRANSFORM2D, "Transform2D", {} } },
		{ "vector4", { godot::Variant::VECTOR4, "Vector4", {} } },
		{ "vector4i", { godot::Variant::VECTOR4I, "Vector4i", {} } },
		{ "plane", { godot::Variant::PLANE, "Plane", {} } },
		{ "quaternion", { godot::Variant::QUATERNION, "Quaternion", {} } },
		{ "aabb", { godot::Variant::AABB, "AABB", {} } },
		{ "basis", { godot::Variant::BASIS, "Basis", {} } },
		{ "transform3d", { godot::Variant::TRANSFORM3D, "Transform3D", {} } },
		{ "projection", { godot::Variant::PROJECTION, "Projection", {} } },
		{ "color", { godot::Variant::COLOR, "Color", {} } },
		{ "object", { godot::Variant::OBJECT, "Object", godot::StringName("Object") } },
		{ "callable", { godot::Variant::CALLABLE, "Callable", {} } },
		{ "signal", { godot::Variant::SIGNAL, "Signal", {} } },
		{ "dictionary", { godot::Variant::DICTIONARY, "Dictionary", {} } },
		{ "array", { godot::Variant::ARRAY, "Array", {} } },
		{ "packed_byte_array", { godot::Variant::PACKED_BYTE_ARRAY, "PackedByteArray", {} } },
		{ "packed_int32_array", { godot::Variant::PACKED_INT32_ARRAY, "PackedInt32Array", {} } },
		{ "packed_int64_array", { godot::Variant::PACKED_INT64_ARRAY, "PackedInt64Array", {} } },
		{ "packed_float32_array", { godot::Variant::PACKED_FLOAT32_ARRAY, "PackedFloat32Array", {} } },
		{ "packed_float64_array", { godot::Variant::PACKED_FLOAT64_ARRAY, "PackedFloat64Array", {} } },
		{ "packed_string_array", { godot::Variant::PACKED_STRING_ARRAY, "PackedStringArray", {} } },
		{ "packed_vector2_array", { godot::Variant::PACKED_VECTOR2_ARRAY, "PackedVector2Array", {} } },
		{ "packed_vector3_array", { godot::Variant::PACKED_VECTOR3_ARRAY, "PackedVector3Array", {} } },
		{ "packed_color_array", { godot::Variant::PACKED_COLOR_ARRAY, "PackedColorArray", {} } },
		{ "packed_vector4_array", { godot::Variant::PACKED_VECTOR4_ARRAY, "PackedVector4Array", {} } },
	};
	std::string normalized = type_name;
	std::transform(
			normalized.begin(),
			normalized.end(),
			normalized.begin(),
			[](unsigned char character) {
				return static_cast<char>(std::tolower(character));
			});
	const auto known = types.find(normalized);
	if (known != types.end()) {
		return known->second;
	}
	godot::StringName class_name(godot_string(type_name));
	if (godot::internal::gdextension_interface_classdb_get_class_tag(
				class_name._native_ptr()) != nullptr) {
		return PropertyTypeDescriptor{
			godot::Variant::OBJECT,
			type_name,
			class_name,
		};
	}
	return std::nullopt;
}

bool read_number(
		JSContext *context,
		JSValueConst value,
		double &number,
		std::string &error) {
	if (!JS_IsNumber(value) || JS_ToFloat64(context, &number, value) < 0) {
		error = "range hint values must be numbers";
		return false;
	}
	return true;
}

std::string format_number(double value) {
	std::ostringstream stream;
	stream.precision(std::numeric_limits<double>::max_digits10);
	stream << value;
	return stream.str();
}

bool apply_property_hint(
		JSContext *context,
		JSValueConst descriptor,
		godot::PropertyInfo &property,
		std::string &error) {
	ScopedJSValue hint(context, JS_GetPropertyStr(context, descriptor, "hint"));
	if (JS_IsException(hint.get())) {
		error = "could not read property hint metadata";
		return false;
	}
	if (JS_IsUndefined(hint.get())) {
		return true;
	}
	if (!JS_IsObject(hint.get())) {
		error = "property hint must be an object";
		return false;
	}
	ScopedJSValue range(context, JS_GetPropertyStr(context, hint.get(), "range"));
	if (JS_IsException(range.get())) {
		error = "could not read range hint metadata";
		return false;
	}
	if (!JS_IsUndefined(range.get())) {
		int64_t length = 0;
		if (!JS_IsArray(range.get()) || JS_GetLength(context, range.get(), &length) < 0 ||
				(length != 2 && length != 3)) {
			error = "range hint must contain [minimum, maximum] or [minimum, maximum, step]";
			return false;
		}
		double minimum = 0;
		double maximum = 0;
		double step = 1;
		ScopedJSValue minimum_value(context, JS_GetPropertyUint32(context, range.get(), 0));
		ScopedJSValue maximum_value(context, JS_GetPropertyUint32(context, range.get(), 1));
		ScopedJSValue step_value(
				context,
				length == 3
						? JS_GetPropertyUint32(context, range.get(), 2)
						: JS_NewInt32(context, 1));
		if (!read_number(context, minimum_value.get(), minimum, error) ||
				!read_number(context, maximum_value.get(), maximum, error) ||
				!read_number(context, step_value.get(), step, error)) {
			return false;
		}
		property.hint = godot::PROPERTY_HINT_RANGE;
		property.hint_string = godot_string(
				format_number(minimum) + "," + format_number(maximum) + "," +
				format_number(step));
		return true;
	}
	ScopedJSValue enum_values(context, JS_GetPropertyStr(context, hint.get(), "enum"));
	if (JS_IsException(enum_values.get())) {
		error = "could not read enum hint metadata";
		return false;
	}
	if (!JS_IsUndefined(enum_values.get())) {
		int64_t length = 0;
		if (!JS_IsArray(enum_values.get()) ||
				JS_GetLength(context, enum_values.get(), &length) < 0) {
			error = "enum hint must be an array of strings";
			return false;
		}
		std::string joined;
		for (int64_t index = 0; index < length; ++index) {
			ScopedJSValue item(
					context,
					JS_GetPropertyUint32(
							context,
							enum_values.get(),
							static_cast<std::uint32_t>(index)));
			std::string text;
			if (!javascript_string(context, item.get(), text, error)) {
				error = "enum hint values must be strings";
				return false;
			}
			if (!joined.empty()) {
				joined += ',';
			}
			joined += text;
		}
		property.hint = godot::PROPERTY_HINT_ENUM;
		property.hint_string = godot_string(joined);
	}
	return true;
}

} // namespace

struct JavaScriptProjectRuntime::Impl {
	struct ScriptRecord {
		JSValue constructor = JS_UNDEFINED;
	};

	struct InstanceRecord {
		JSValue value = JS_UNDEFINED;
	};

	using PropertyState = std::vector<std::pair<godot::StringName, godot::Variant>>;

	GodotResourceProvider resources;
	GodotConsoleSink console;
	std::unique_ptr<GodotBinding> binding;
	std::unique_ptr<RuntimeHost> host;
	std::unordered_map<JavaScriptScript *, ScriptRecord> scripts;
	std::unordered_map<JavaScriptScriptInstance *, InstanceRecord> instances;
	std::thread::id owner_thread = std::this_thread::get_id();
	std::optional<bool> pending_reload_keep_state;
	bool stopping = false;

	bool on_owner_thread() const {
		return std::this_thread::get_id() == owner_thread;
	}

	void report(const godot::String &path, const std::string &operation, const std::string &detail) const {
		godot::UtilityFunctions::push_error(
				"JavaScript ",
				godot_string(operation),
				" failed for ",
				path,
				": ",
				godot_string(detail));
	}

	bool start() {
		if (host != nullptr && host->is_running()) {
			return true;
		}
		binding = std::make_unique<GodotBinding>(console);
		host = std::make_unique<RuntimeHost>(
				resources,
				console,
				runtime_options_from_project_settings(),
				binding.get());
		if (!host->is_running()) {
			const std::string detail = host->initialization_error();
			host.reset();
			binding.reset();
			report("<project>", "runtime startup", detail);
			return false;
		}
		godot::UtilityFunctions::print(
				"[godot-js-runtime] PROJECT_RUNTIME_STARTED live=",
				static_cast<int64_t>(RuntimeHost::live_runtime_count()));
		return true;
	}

	void free_value(JSValue &value) {
		if (host != nullptr && host->javascript_context() != nullptr &&
				!JS_IsUndefined(value)) {
			JS_FreeValue(host->javascript_context(), value);
		}
		value = JS_UNDEFINED;
	}

	void release_javascript_values() {
		for (auto &entry : instances) {
			free_value(entry.second.value);
		}
		for (auto &entry : scripts) {
			free_value(entry.second.constructor);
		}
	}

	void stop_context() {
		release_javascript_values();
		if (host != nullptr) {
			host->shutdown();
			host.reset();
		}
		binding.reset();
		godot::UtilityFunctions::print(
				"[godot-js-runtime] PROJECT_RUNTIME_STOPPED live=",
				static_cast<int64_t>(RuntimeHost::live_runtime_count()));
	}

	bool prepare_script_source(JavaScriptScript &script, std::string &error) {
		const std::string path = standard_string(script.source_path());
		if (script.has_source_changes()) {
			resources.set_text_override(
					path,
					standard_string(script._get_source_code()));
			return true;
		}
		resources.clear_text_override(path);
		std::string source;
		if (!resources.read_text(path, source, error)) {
			return false;
		}
		script.set_loaded_source_code(godot_string(source));
		return true;
	}

	bool reflect_methods(
			JSContext *context,
			JSValueConst script_class,
			JavaScriptScriptMetadata &metadata,
			std::string &error) {
		ScopedJSValue prototype(
				context,
				JS_GetPropertyStr(context, script_class, "prototype"));
		if (JS_IsException(prototype.get())) {
			error = "could not read script class prototype";
			return false;
		}
		std::unordered_map<std::string, bool> seen;
		while (JS_IsObject(prototype.get()) &&
				!binding->is_godot_class_prototype(prototype.get())) {
			std::vector<std::string> names;
			if (!own_string_keys(context, prototype.get(), names, error)) {
				return false;
			}
			for (const std::string &name : names) {
				if (name == "constructor" || seen.count(name) > 0) {
					continue;
				}
				seen.emplace(name, true);
				ScopedJSValue value(
						context,
						JS_GetPropertyStr(context, prototype.get(), name.c_str()));
				if (JS_IsException(value.get())) {
					error = "could not inspect script method '" + name + "'";
					return false;
				}
				if (!JS_IsFunction(context, value.get())) {
					continue;
				}
				ScopedJSValue length_value(
						context,
						JS_GetPropertyStr(context, value.get(), "length"));
				int32_t argument_count = 0;
				if (JS_IsException(length_value.get()) ||
						JS_ToInt32(context, &argument_count, length_value.get()) < 0) {
					error = "could not inspect argument count for script method '" + name + "'";
					return false;
				}
				argument_count = std::clamp(argument_count, 0, 64);
				godot::MethodInfo method(godot::StringName(godot_string(name)));
				method.return_val = godot::PropertyInfo(godot::Variant::NIL, {});
				for (int32_t index = 0; index < argument_count; ++index) {
					method.arguments.emplace_back(
							godot::Variant::NIL,
							godot::StringName("arg" + godot::String::num_int64(index)));
				}
				metadata.methods.push_back({ std::move(method), argument_count });
			}
			ScopedJSValue parent(context, JS_GetPrototype(context, prototype.get()));
			if (JS_IsException(parent.get())) {
				error = "could not traverse script class prototype chain";
				return false;
			}
			prototype = std::move(parent);
		}
		std::sort(
				metadata.methods.begin(),
				metadata.methods.end(),
				[](const JavaScriptMethodDefinition &left, const JavaScriptMethodDefinition &right) {
					return left.info.name < right.info.name;
				});
		return true;
	}

	bool parse_properties(
			JSContext *context,
			JSValueConst metadata_value,
			JavaScriptScriptMetadata &metadata,
			std::string &error) {
		ScopedJSValue properties(
				context,
				JS_GetPropertyStr(context, metadata_value, "properties"));
		if (JS_IsException(properties.get())) {
			error = "could not read script property metadata";
			return false;
		}
		if (JS_IsUndefined(properties.get())) {
			return true;
		}
		if (!JS_IsObject(properties.get())) {
			error = "script metadata 'properties' must be an object";
			return false;
		}
		std::vector<std::string> names;
		if (!own_string_keys(context, properties.get(), names, error)) {
			return false;
		}
		for (const std::string &name : names) {
			ScopedJSValue descriptor(
					context,
					JS_GetPropertyStr(context, properties.get(), name.c_str()));
			if (JS_IsException(descriptor.get()) || !JS_IsObject(descriptor.get())) {
				error = "property metadata for '" + name + "' must be an object";
				return false;
			}
			ScopedJSValue type_value(
					context,
					JS_GetPropertyStr(context, descriptor.get(), "type"));
			std::string type_name;
			if (JS_IsException(type_value.get()) ||
					!javascript_string(context, type_value.get(), type_name, error)) {
				error = "property '" + name + "' requires a string 'type'";
				return false;
			}
			const std::optional<PropertyTypeDescriptor> type =
					property_type_descriptor(type_name);
			if (!type.has_value()) {
				error = "property '" + name + "' uses unknown Godot type '" + type_name + "'";
				return false;
			}
			JavaScriptPropertyDefinition property;
			property.info = godot::PropertyInfo(
					type->type,
					godot::StringName(godot_string(name)),
					godot::PROPERTY_HINT_NONE,
					{},
					godot::PROPERTY_USAGE_DEFAULT,
					type->class_name);
			property.javascript_type = type->binding_type;
			if (!apply_property_hint(context, descriptor.get(), property.info, error)) {
				error = "property '" + name + "': " + error;
				return false;
			}
			const JSAtom default_atom = JS_NewAtom(context, "default");
			const int has_default = JS_HasProperty(context, descriptor.get(), default_atom);
			if (has_default < 0) {
				JS_FreeAtom(context, default_atom);
				error = "could not inspect default value for property '" + name + "'";
				return false;
			}
			if (has_default > 0) {
				ScopedJSValue default_value(
						context,
						JS_GetProperty(context, descriptor.get(), default_atom));
				if (JS_IsException(default_value.get()) ||
						!binding->javascript_to_variant(
								default_value.get(),
								property.javascript_type,
								property.default_value,
								error)) {
					JS_FreeAtom(context, default_atom);
					error = "property '" + name + "' has an invalid default: " + error;
					return false;
				}
				property.has_default = true;
			}
			JS_FreeAtom(context, default_atom);
			metadata.properties.push_back(std::move(property));
		}
		return true;
	}

	bool parse_signals(
			JSContext *context,
			JSValueConst metadata_value,
			JavaScriptScriptMetadata &metadata,
			std::string &error) {
		ScopedJSValue signals(context, JS_GetPropertyStr(context, metadata_value, "signals"));
		if (JS_IsException(signals.get())) {
			error = "could not read script signal metadata";
			return false;
		}
		if (JS_IsUndefined(signals.get())) {
			return true;
		}
		if (!JS_IsObject(signals.get())) {
			error = "script metadata 'signals' must be an object";
			return false;
		}
		std::vector<std::string> names;
		if (!own_string_keys(context, signals.get(), names, error)) {
			return false;
		}
		for (const std::string &name : names) {
			ScopedJSValue arguments(
					context,
					JS_GetPropertyStr(context, signals.get(), name.c_str()));
			int64_t length = 0;
			if (JS_IsException(arguments.get()) || !JS_IsArray(arguments.get()) ||
					JS_GetLength(context, arguments.get(), &length) < 0) {
				error = "signal '" + name + "' must be an array of argument descriptors";
				return false;
			}
			godot::MethodInfo signal(godot::StringName(godot_string(name)));
			for (int64_t index = 0; index < length; ++index) {
				ScopedJSValue argument(
						context,
						JS_GetPropertyUint32(
								context,
								arguments.get(),
								static_cast<std::uint32_t>(index)));
				if (JS_IsException(argument.get()) || !JS_IsObject(argument.get())) {
					error = "signal '" + name + "' argument metadata must be an object";
					return false;
				}
				ScopedJSValue argument_name(
						context,
						JS_GetPropertyStr(context, argument.get(), "name"));
				ScopedJSValue argument_type(
						context,
						JS_GetPropertyStr(context, argument.get(), "type"));
				std::string argument_name_text;
				std::string argument_type_text;
				if (!javascript_string(context, argument_name.get(), argument_name_text, error) ||
						!javascript_string(context, argument_type.get(), argument_type_text, error)) {
					error = "signal '" + name + "' arguments require string name and type";
					return false;
				}
				const std::optional<PropertyTypeDescriptor> type =
						property_type_descriptor(argument_type_text);
				if (!type.has_value()) {
					error = "signal '" + name + "' uses unknown Godot type '" +
							argument_type_text + "'";
					return false;
				}
				signal.arguments.emplace_back(
						type->type,
						godot::StringName(godot_string(argument_name_text)),
						godot::PROPERTY_HINT_NONE,
						godot::String(),
						godot::PROPERTY_USAGE_DEFAULT,
						type->class_name);
			}
			metadata.signals.push_back(std::move(signal));
		}
		return true;
	}

	bool parse_metadata(
			JSContext *context,
			JSValueConst script_class,
			JavaScriptScriptMetadata &metadata,
			std::string &error) {
		std::string base_class;
		if (!binding->script_base_class(script_class, base_class, error)) {
			return false;
		}
		metadata.base_class = godot::StringName(godot_string(base_class));
		if (!reflect_methods(context, script_class, metadata, error)) {
			return false;
		}
		const JSAtom atom = script_metadata_atom(context);
		if (atom == JS_ATOM_NULL) {
			error = "could not resolve canonical script metadata symbol";
			return false;
		}
		ScopedJSValue metadata_value(context, JS_GetProperty(context, script_class, atom));
		JS_FreeAtom(context, atom);
		if (JS_IsException(metadata_value.get())) {
			error = "could not read canonical script metadata";
			return false;
		}
		if (JS_IsUndefined(metadata_value.get())) {
			return true;
		}
		if (!JS_IsObject(metadata_value.get())) {
			error = "canonical script metadata must be an object";
			return false;
		}
		if (!parse_properties(context, metadata_value.get(), metadata, error) ||
				!parse_signals(context, metadata_value.get(), metadata, error)) {
			return false;
		}
		ScopedJSValue tool(context, JS_GetPropertyStr(context, metadata_value.get(), "tool"));
		if (JS_IsException(tool.get())) {
			error = "could not read script tool metadata";
			return false;
		}
		if (!JS_IsUndefined(tool.get())) {
			if (!JS_IsBool(tool.get())) {
				error = "script metadata 'tool' must be a boolean";
				return false;
			}
			metadata.tool = JS_ToBool(context, tool.get()) != 0;
		}
		ScopedJSValue rpc(context, JS_GetPropertyStr(context, metadata_value.get(), "rpc"));
		if (JS_IsException(rpc.get())) {
			error = "could not read script RPC metadata";
			return false;
		}
		if (!JS_IsUndefined(rpc.get())) {
			godot::Variant converted;
			if (!binding->javascript_to_variant(
						rpc.get(),
						"Dictionary",
						converted,
						error) ||
					converted.get_type() != godot::Variant::DICTIONARY) {
				error = "script RPC metadata must be a Variant-compatible object: " + error;
				return false;
			}
			metadata.rpc_config = converted;
		}
		return true;
	}

	bool load_record(JavaScriptScript &script, ScriptRecord &record) {
		if (!start()) {
			script.mark_invalid("QuickJS-ng project runtime could not start");
			return false;
		}
		const std::string path = standard_string(script.source_path());
		if (path.empty() || path.rfind("res://", 0) != 0) {
			script.mark_invalid("script path must use res:// before evaluation");
			return false;
		}
		std::string source_error;
		if (!prepare_script_source(script, source_error)) {
			script.mark_invalid(godot_string(source_error));
			report(script.source_path(), "source read", source_error);
			return false;
		}
		free_value(record.constructor);
		JSValue script_class = JS_UNDEFINED;
		const std::string extension = standard_string(script.source_path().get_extension().to_lower());
		const EvaluationResult evaluation = extension == "cjs"
				? host->evaluate_commonjs_default(path, script_class)
				: host->evaluate_module_default(path, script_class);
		if (!evaluation.ok) {
			const std::string detail = evaluation_error(evaluation);
			script.mark_invalid(godot_string(detail));
			report(script.source_path(), "module evaluation", detail);
			return false;
		}
		const EvaluationResult jobs = host->pump_jobs();
		if (!jobs.ok) {
			const std::string detail = evaluation_error(jobs);
			JS_FreeValue(host->javascript_context(), script_class);
			script.mark_invalid(godot_string(detail));
			report(script.source_path(), "Promise job drain", detail);
			return false;
		}
		JavaScriptScriptMetadata metadata;
		std::string metadata_error;
		const EvaluationResult reflection = host->run_javascript_operation(
				path,
				[this, script_class, &metadata, &metadata_error](JSContext *context) {
					if (!parse_metadata(context, script_class, metadata, metadata_error)) {
						return JS_ThrowTypeError(context, "%s", metadata_error.c_str());
					}
					return JS_UNDEFINED;
				});
		if (!reflection.ok) {
			const std::string detail = metadata_error.empty()
					? evaluation_error(reflection)
					: metadata_error;
			JS_FreeValue(host->javascript_context(), script_class);
			script.mark_invalid(godot_string(detail));
			report(script.source_path(), "default export validation", detail);
			return false;
		}
		record.constructor = script_class;
		script.replace_metadata(std::move(metadata));
		godot::UtilityFunctions::print(
				"[godot-js-runtime] SCRIPT_LOADED ",
				script.source_path(),
				" base=",
				script.metadata().base_class);
		return true;
	}

	bool construct_instance(JavaScriptScriptInstance &instance) {
		const auto script_record = scripts.find(instance.script());
		const auto instance_record = instances.find(&instance);
		if (script_record == scripts.end() || instance_record == instances.end() ||
				JS_IsUndefined(script_record->second.constructor) || !start()) {
			return false;
		}
		GDExtensionObjectPtr owner =
				godot::internal::gdextension_interface_object_get_instance_from_id(
						instance.owner_id());
		if (owner == nullptr) {
			return false;
		}
		free_value(instance_record->second.value);
		JSValue value = JS_UNDEFINED;
		const std::string path = standard_string(instance.script()->source_path());
		std::string initialization_error;
		const EvaluationResult construction = host->run_javascript_operation(
				path,
				[this, &instance, owner, constructor = script_record->second.constructor,
						&initialization_error](JSContext *context) {
					JSValue object = binding->construct_script_instance(
							constructor,
							owner,
							instance.owner_id());
					if (JS_IsException(object)) {
						return object;
					}
					for (const JavaScriptPropertyDefinition &property :
							instance.script()->metadata().properties) {
						if (!property.has_default) {
							continue;
						}
						const std::string name = standard_string(property.info.name);
						ScopedJSValue current(
								context,
								JS_GetPropertyStr(context, object, name.c_str()));
						if (JS_IsException(current.get())) {
							JS_FreeValue(context, object);
							return JS_EXCEPTION;
						}
						if (!JS_IsUndefined(current.get())) {
							continue;
						}
						JSValue converted = binding->variant_to_javascript(property.default_value);
						if (JS_IsException(converted) ||
								JS_SetPropertyStr(context, object, name.c_str(), converted) < 0) {
							JS_FreeValue(context, object);
							initialization_error = "could not apply default for property '" + name + "'";
							return JS_EXCEPTION;
						}
					}
					return object;
				},
				&value);
		if (!construction.ok) {
			const std::string detail = initialization_error.empty()
					? evaluation_error(construction)
					: initialization_error;
			report(instance.script()->source_path(), "instance construction", detail);
			return false;
		}
		instance_record->second.value = value;
		return true;
	}

	bool set_property(
			JavaScriptScriptInstance &instance,
			const godot::StringName &name,
			const godot::Variant &value) {
		const auto record = instances.find(&instance);
		if (record == instances.end() || JS_IsUndefined(record->second.value) ||
				!instance.is_active() || host == nullptr) {
			return false;
		}
		const std::string property_name = standard_string(name);
		const EvaluationResult operation = host->run_javascript_operation(
				standard_string(instance.script()->source_path()),
				[this, object = record->second.value, &value, &property_name](JSContext *context) {
					JSValue converted = binding->variant_to_javascript(value);
					if (JS_IsException(converted)) {
						return JS_EXCEPTION;
					}
					return JS_SetPropertyStr(context, object, property_name.c_str(), converted) < 0
							? JS_EXCEPTION
							: JS_UNDEFINED;
				});
		if (!operation.ok) {
			report(instance.script()->source_path(), "property set", evaluation_error(operation));
		}
		return operation.ok;
	}

	bool get_property(
			JavaScriptScriptInstance &instance,
			const godot::StringName &name,
			godot::Variant &result) {
		const auto record = instances.find(&instance);
		const JavaScriptPropertyDefinition *definition = instance.script()->find_property(name);
		if (record == instances.end() || definition == nullptr ||
				JS_IsUndefined(record->second.value) || !instance.is_active() || host == nullptr) {
			return false;
		}
		const std::string property_name = standard_string(name);
		std::string conversion_error;
		const EvaluationResult operation = host->run_javascript_operation(
				standard_string(instance.script()->source_path()),
				[this, object = record->second.value, &property_name, definition, &result,
						&conversion_error](JSContext *context) {
					ScopedJSValue value(
							context,
							JS_GetPropertyStr(context, object, property_name.c_str()));
					if (JS_IsException(value.get())) {
						return JS_EXCEPTION;
					}
					if (!binding->javascript_to_variant(
								value.get(),
								definition->javascript_type,
								result,
								conversion_error)) {
						return JS_ThrowTypeError(context, "%s", conversion_error.c_str());
					}
					return JS_UNDEFINED;
				});
		if (!operation.ok) {
			report(instance.script()->source_path(), "property get", evaluation_error(operation));
		}
		return operation.ok;
	}

	bool call_method(
			JavaScriptScriptInstance &instance,
			const godot::StringName &method,
			const godot::Variant *const *arguments,
			int argument_count,
			godot::Variant &result,
			GDExtensionCallError &error) {
			error = {};
		const auto record = instances.find(&instance);
		if (instance.script()->find_method(method) == nullptr) {
			error.error = GDEXTENSION_CALL_ERROR_INVALID_METHOD;
			return false;
		}
		if (record == instances.end() || JS_IsUndefined(record->second.value) ||
				!instance.is_active() || host == nullptr) {
			error.error = GDEXTENSION_CALL_ERROR_INSTANCE_IS_NULL;
			return false;
		}
		const std::string method_name = standard_string(method);
		std::string conversion_error;
		const EvaluationResult operation = host->run_javascript_operation(
				standard_string(instance.script()->source_path()),
				[this, object = record->second.value, &method_name, arguments, argument_count,
						&result, &conversion_error](JSContext *context) {
					ScopedJSValue function(
							context,
							JS_GetPropertyStr(context, object, method_name.c_str()));
					if (JS_IsException(function.get())) {
						return JS_EXCEPTION;
					}
					if (!JS_IsFunction(context, function.get())) {
						return JS_ThrowTypeError(
								context,
								"JavaScript script has no method '%s'",
								method_name.c_str());
					}
					std::vector<JSValue> converted_arguments;
					converted_arguments.reserve(static_cast<std::size_t>(argument_count));
					for (int index = 0; index < argument_count; ++index) {
						JSValue converted = binding->variant_to_javascript(*arguments[index]);
						if (JS_IsException(converted)) {
							for (JSValue value : converted_arguments) {
								JS_FreeValue(context, value);
							}
							return JS_EXCEPTION;
						}
						converted_arguments.push_back(converted);
					}
					ScopedJSValue return_value(
							context,
							JS_Call(
									context,
									function.get(),
									object,
									argument_count,
									converted_arguments.data()));
					for (JSValue value : converted_arguments) {
						JS_FreeValue(context, value);
					}
					if (JS_IsException(return_value.get())) {
						return JS_EXCEPTION;
					}
					if (!binding->javascript_to_variant(
								return_value.get(),
								"Variant",
								result,
								conversion_error)) {
						return JS_ThrowTypeError(context, "%s", conversion_error.c_str());
					}
					return JS_UNDEFINED;
				});
		if (!operation.ok) {
			error.error = GDEXTENSION_CALL_ERROR_INVALID_METHOD;
			report(
					instance.script()->source_path(),
					"method '" + method_name + "'",
					evaluation_error(operation));
			return false;
		}
		error.error = GDEXTENSION_CALL_OK;
		return true;
	}

	void invalidate(JavaScriptScriptInstance &instance) {
		const auto found = instances.find(&instance);
		if (found != instances.end()) {
			free_value(found->second.value);
		}
	}

	void reload_all(bool keep_state) {
		if (stopping || !on_owner_thread()) {
			return;
		}
		if (host != nullptr && host->is_executing()) {
			pending_reload_keep_state = pending_reload_keep_state.has_value()
					? *pending_reload_keep_state && keep_state
					: keep_state;
			godot::UtilityFunctions::print(
					"[godot-js-runtime] RELOAD_DEFERRED keep_state=",
					*pending_reload_keep_state);
			return;
		}
		pending_reload_keep_state.reset();
		std::unordered_map<JavaScriptScriptInstance *, PropertyState> saved_states;
		if (keep_state) {
			for (auto &entry : instances) {
				JavaScriptScriptInstance *instance = entry.first;
				if (!instance->is_active()) {
					continue;
				}
				PropertyState state;
				for (const JavaScriptPropertyDefinition &property :
						instance->script()->metadata().properties) {
					godot::Variant value;
					if (get_property(*instance, property.info.name, value)) {
						state.emplace_back(property.info.name, value);
					}
				}
				saved_states.emplace(instance, std::move(state));
			}
		}

		stop_context();
		if (!start()) {
			return;
		}
		std::vector<JavaScriptScript *> ordered_scripts;
		ordered_scripts.reserve(scripts.size());
		for (const auto &entry : scripts) {
			ordered_scripts.push_back(entry.first);
		}
		std::sort(
				ordered_scripts.begin(),
				ordered_scripts.end(),
				[](const JavaScriptScript *left, const JavaScriptScript *right) {
					return left->source_path() < right->source_path();
				});
		for (JavaScriptScript *script : ordered_scripts) {
			load_record(*script, scripts[script]);
		}
		for (auto &entry : instances) {
			JavaScriptScriptInstance *instance = entry.first;
			if (instance->is_active() &&
					godot::internal::gdextension_interface_object_get_instance_from_id(
							instance->owner_id()) != nullptr) {
				construct_instance(*instance);
			}
		}
		if (keep_state) {
			for (auto &entry : saved_states) {
				JavaScriptScriptInstance *instance = entry.first;
				if (!instance->is_active()) {
					continue;
				}
				for (const auto &property : entry.second) {
					const JavaScriptPropertyDefinition *definition =
							instance->script()->find_property(property.first);
					if (definition != nullptr &&
							(property.second.get_type() == definition->info.type ||
									godot::Variant::can_convert_strict(
											property.second.get_type(),
											definition->info.type))) {
						set_property(*instance, property.first, property.second);
					}
				}
			}
		}
		godot::UtilityFunctions::print(
				keep_state
						? "[godot-js-runtime] SOFT_RELOAD_COMPLETE"
						: "[godot-js-runtime] HARD_RELOAD_COMPLETE");
	}

	void apply_pending_reload() {
		if (!pending_reload_keep_state.has_value() || stopping ||
				(host != nullptr && host->is_executing())) {
			return;
		}
		const bool keep_state = *pending_reload_keep_state;
		pending_reload_keep_state.reset();
		reload_all(keep_state);
	}
};

JavaScriptProjectRuntime::JavaScriptProjectRuntime() : impl(std::make_unique<Impl>()) {
	impl->start();
}

JavaScriptProjectRuntime::~JavaScriptProjectRuntime() {
	shutdown();
}

godot::Error JavaScriptProjectRuntime::load_script(
		JavaScriptScript &script,
		bool keep_state) {
	if (impl == nullptr || !impl->on_owner_thread() || impl->stopping) {
		script.mark_invalid("scripts may only load on the owning Godot thread");
		return godot::ERR_BUSY;
	}
	const auto existing = impl->scripts.find(&script);
	if (existing != impl->scripts.end()) {
		impl->reload_all(keep_state);
		return script._is_valid() ? godot::OK : godot::ERR_PARSE_ERROR;
	}
	auto [record, inserted] = impl->scripts.emplace(&script, Impl::ScriptRecord{});
	(void)inserted;
	if (!impl->load_record(script, record->second)) {
		return godot::ERR_PARSE_ERROR;
	}
	return godot::OK;
}

void JavaScriptProjectRuntime::forget_script(JavaScriptScript &script) noexcept {
	if (impl == nullptr) {
		return;
	}
	for (auto iterator = impl->instances.begin(); iterator != impl->instances.end();) {
		if (iterator->first->script() == &script) {
			impl->free_value(iterator->second.value);
			iterator->first->deactivate();
			iterator = impl->instances.erase(iterator);
		} else {
			++iterator;
		}
	}
	const auto record = impl->scripts.find(&script);
	if (record != impl->scripts.end()) {
		impl->free_value(record->second.constructor);
		impl->scripts.erase(record);
	}
	impl->resources.clear_text_override(standard_string(script.source_path()));
}

bool JavaScriptProjectRuntime::register_instance(JavaScriptScriptInstance &instance) {
	if (impl == nullptr || !impl->on_owner_thread() || impl->stopping ||
			impl->instances.count(&instance) > 0) {
		return false;
	}
	impl->instances.emplace(&instance, Impl::InstanceRecord{});
	if (!impl->construct_instance(instance)) {
		impl->instances.erase(&instance);
		return false;
	}
	return true;
}

void JavaScriptProjectRuntime::forget_instance(JavaScriptScriptInstance &instance) noexcept {
	if (impl == nullptr) {
		return;
	}
	const auto found = impl->instances.find(&instance);
	if (found != impl->instances.end()) {
		impl->free_value(found->second.value);
		impl->instances.erase(found);
	}
}

bool JavaScriptProjectRuntime::has_instance(
		const JavaScriptScript &script,
		std::uint64_t owner_id) const {
	if (impl == nullptr) {
		return false;
	}
	return std::any_of(
			impl->instances.begin(),
			impl->instances.end(),
			[&script, owner_id](const auto &entry) {
				return entry.first->script() == &script &&
						entry.first->owner_id() == owner_id && entry.first->is_active();
			});
}

bool JavaScriptProjectRuntime::set_property(
		JavaScriptScriptInstance &instance,
		const godot::StringName &name,
		const godot::Variant &value) {
	return impl != nullptr && impl->set_property(instance, name, value);
}

bool JavaScriptProjectRuntime::get_property(
		JavaScriptScriptInstance &instance,
		const godot::StringName &name,
		godot::Variant &result) {
	return impl != nullptr && impl->get_property(instance, name, result);
}

bool JavaScriptProjectRuntime::call_method(
		JavaScriptScriptInstance &instance,
		const godot::StringName &method,
		const godot::Variant *const *arguments,
		int argument_count,
		godot::Variant &result,
		GDExtensionCallError &error) {
	if (impl == nullptr) {
		error = {};
		error.error = GDEXTENSION_CALL_ERROR_INSTANCE_IS_NULL;
		return false;
	}
	return impl->call_method(
			instance,
			method,
			arguments,
			argument_count,
			result,
			error);
}

void JavaScriptProjectRuntime::notification(
		JavaScriptScriptInstance &instance,
		int32_t what,
		bool reversed) {
	(void)reversed;
	if (impl == nullptr) {
		return;
	}
	if (instance.script()->find_method("_notification") != nullptr) {
		godot::Variant argument = what;
		const godot::Variant *arguments[] = { &argument };
		godot::Variant result;
		GDExtensionCallError error{};
		impl->call_method(
				instance,
				"_notification",
				arguments,
				1,
				result,
				error);
	}
	if (what == 1) {
		invalidate_instance(instance);
	}
}

void JavaScriptProjectRuntime::invalidate_instance(
		JavaScriptScriptInstance &instance) noexcept {
	if (impl != nullptr) {
		impl->invalidate(instance);
	}
	instance.deactivate();
}

void JavaScriptProjectRuntime::reload_all(bool keep_state) {
	if (impl != nullptr) {
		impl->reload_all(keep_state);
	}
}

void JavaScriptProjectRuntime::pump_jobs() {
	if (impl == nullptr || impl->stopping) {
		return;
	}
	impl->apply_pending_reload();
	if (impl->host == nullptr) {
		return;
	}
	const EvaluationResult result = impl->host->pump_jobs();
	if (!result.ok) {
		impl->report("<project>", "Promise job drain", evaluation_error(result));
	}
	impl->apply_pending_reload();
}

void JavaScriptProjectRuntime::shutdown() noexcept {
	if (impl == nullptr || impl->stopping) {
		return;
	}
	impl->stopping = true;
	for (auto &entry : impl->instances) {
		entry.first->deactivate();
	}
	impl->stop_context();
	impl->instances.clear();
	impl->scripts.clear();
}

bool JavaScriptProjectRuntime::is_running() const {
	return impl != nullptr && impl->host != nullptr && impl->host->is_running() &&
			!impl->stopping;
}

} // namespace godot_js_runtime
