#include "godot_js_runtime/modules/godot_binding.hpp"

#include <algorithm>
#include <atomic>
#include <cmath>
#include <cstddef>
#include <cstdint>
#include <cstdlib>
#include <cstring>
#include <limits>
#include <memory>
#include <mutex>
#include <optional>
#include <string>
#include <thread>
#include <unordered_map>
#include <utility>
#include <vector>

#include <godot_cpp/classes/object.hpp>
#include <godot_cpp/core/class_db.hpp>
#include <godot_cpp/core/memory.hpp>
#include <godot_cpp/core/object_id.hpp>
#include <godot_cpp/godot.hpp>
#include <godot_cpp/variant/array.hpp>
#include <godot_cpp/variant/callable.hpp>
#include <godot_cpp/variant/callable_custom.hpp>
#include <godot_cpp/variant/dictionary.hpp>
#include <godot_cpp/variant/node_path.hpp>
#include <godot_cpp/variant/packed_byte_array.hpp>
#include <godot_cpp/variant/packed_color_array.hpp>
#include <godot_cpp/variant/packed_float32_array.hpp>
#include <godot_cpp/variant/packed_float64_array.hpp>
#include <godot_cpp/variant/packed_int32_array.hpp>
#include <godot_cpp/variant/packed_int64_array.hpp>
#include <godot_cpp/variant/packed_string_array.hpp>
#include <godot_cpp/variant/packed_vector2_array.hpp>
#include <godot_cpp/variant/packed_vector3_array.hpp>
#include <godot_cpp/variant/packed_vector4_array.hpp>
#include <godot_cpp/variant/rid.hpp>
#include <godot_cpp/variant/signal.hpp>
#include <godot_cpp/variant/string.hpp>
#include <godot_cpp/variant/string_name.hpp>
#include <godot_cpp/variant/utility_functions.hpp>
#include <godot_cpp/variant/variant.hpp>

#include "godot_js_runtime/generated/binding_metadata.gen.hpp"
#include "godot_js_runtime/generated/utility_dispatch.gen.hpp"
#include "godot_js_runtime/runtime/scoped_js_value.hpp"
#include "godot_js_runtime/runtime/string_conversion.hpp"
#include "quickjs.h"

namespace godot_js_runtime {

namespace {

constexpr std::uint32_t METHOD_STATIC = 1U;
constexpr std::uint32_t METHOD_VARARG = 2U;
constexpr std::uint32_t METHOD_VIRTUAL = 4U;
constexpr std::uint32_t NO_INDEX = std::numeric_limits<std::uint32_t>::max();
constexpr std::int64_t MAX_SAFE_JAVASCRIPT_INTEGER = 9007199254740991LL;
constexpr std::size_t MAX_CONVERSION_DEPTH = 64U;

std::atomic_size_t live_wrappers = 0;
std::atomic_size_t live_callback_roots = 0;
std::atomic_uint64_t next_callback_serial = 1;

JSValue javascript_string(JSContext *context, const godot::String &value) {
	const godot::CharString utf8 = value.utf8();
	return JS_NewStringLen(
			context,
			utf8.get_data(),
			static_cast<std::size_t>(utf8.length()));
}

JSValue javascript_integer(JSContext *context, std::int64_t value) {
	if (value >= -MAX_SAFE_JAVASCRIPT_INTEGER && value <= MAX_SAFE_JAVASCRIPT_INTEGER) {
		return JS_NewInt64(context, value);
	}
	return JS_NewBigInt64(context, value);
}

const char *call_error_name(GDExtensionCallErrorType error) {
	switch (error) {
		case GDEXTENSION_CALL_OK:
			return "ok";
		case GDEXTENSION_CALL_ERROR_INVALID_METHOD:
			return "invalid method";
		case GDEXTENSION_CALL_ERROR_INVALID_ARGUMENT:
			return "invalid argument";
		case GDEXTENSION_CALL_ERROR_TOO_MANY_ARGUMENTS:
			return "too many arguments";
		case GDEXTENSION_CALL_ERROR_TOO_FEW_ARGUMENTS:
			return "too few arguments";
		case GDEXTENSION_CALL_ERROR_INSTANCE_IS_NULL:
			return "instance is null";
		case GDEXTENSION_CALL_ERROR_METHOD_NOT_CONST:
			return "method is not const";
	}
	return "unknown call error";
}

bool starts_with(const std::string &value, const char *prefix) {
	const std::size_t prefix_length = std::strlen(prefix);
	return value.size() >= prefix_length &&
			value.compare(0, prefix_length, prefix) == 0;
}

bool is_packed_variant_type(godot::Variant::Type type) {
	return type >= godot::Variant::PACKED_BYTE_ARRAY &&
			type <= godot::Variant::PACKED_VECTOR4_ARRAY;
}

} // namespace

struct GodotBinding::Impl {
	struct WrapperPayload;
	struct CallbackRoot;

	struct WeakObjectEntry {
		JSValue weak_reference = JS_UNDEFINED;
		std::uint64_t serial = 0;
	};

	struct DeferredObjectEntry {
		std::uint64_t object_id = 0;
		std::uint64_t serial = 0;
	};

	struct WeakContainerEntry {
		JSValue weak_reference = JS_UNDEFINED;
		std::uint64_t serial = 0;
	};

	struct SignalConnection {
		godot::Signal signal;
		godot::Callable callable;
	};

	struct WrapperPayload {
		Impl *binding = nullptr;
		godot::Variant value;
		std::uint32_t builtin_index = NO_INDEX;
		std::uint32_t class_index = NO_INDEX;
		std::uint64_t object_id = 0;
		std::uint64_t serial = 0;

		bool is_object() const {
			return object_id != 0;
		}
	};

	class JavaScriptCallable final : public godot::CallableCustom {
	public:
		explicit JavaScriptCallable(std::shared_ptr<CallbackRoot> root) : root(std::move(root)) {
		}

		~JavaScriptCallable() override;

		std::uint32_t hash() const override;
		godot::String get_as_text() const override;
		CompareEqualFunc get_compare_equal_func() const override;
		CompareLessFunc get_compare_less_func() const override;
		bool is_valid() const override;
		godot::ObjectID get_object() const override;
		int get_argument_count(bool &valid) const override;
		void call(
				const godot::Variant **arguments,
				int argument_count,
				godot::Variant &return_value,
				GDExtensionCallError &call_error) const override;

	private:
		static bool equal(
				const godot::CallableCustom *left,
				const godot::CallableCustom *right);
		static bool less(
				const godot::CallableCustom *left,
				const godot::CallableCustom *right);

		std::shared_ptr<CallbackRoot> root;
	};

	struct CallbackRoot {
		Impl *binding = nullptr;
		JSValue target = JS_UNDEFINED;
		JSValue function = JS_UNDEFINED;
		std::uint64_t serial = 0;
		std::uint64_t target_object_id = 0;
		int argument_count = 0;
		bool active = true;

		void release(JSContext *release_context) {
			if (!active) {
				return;
			}
			active = false;
			if (release_context != nullptr) {
				JS_FreeValue(release_context, target);
				JS_FreeValue(release_context, function);
			}
			target = JS_UNDEFINED;
			function = JS_UNDEFINED;
			binding = nullptr;
			live_callback_roots.fetch_sub(1, std::memory_order_acq_rel);
		}
	};

	ConsoleSink &console_sink;
	JSContext *context = nullptr;
	JSRuntime *runtime = nullptr;
	JSClassID object_class_id = 0;
	std::vector<JSClassID> builtin_class_ids;
	std::unordered_map<JSClassID, std::uint32_t> builtin_index_by_class_id;
	std::vector<JSValue> class_prototypes;
	std::vector<JSValue> class_constructors;
	std::vector<JSValue> builtin_prototypes;
	std::vector<JSValue> builtin_constructors;
	std::unordered_map<std::string, std::uint32_t> class_index_by_name;
	std::unordered_map<std::string, std::uint32_t> builtin_index_by_name;
	std::vector<std::int32_t> builtin_index_by_variant_type;
	std::unordered_map<std::uint64_t, WeakObjectEntry> object_wrappers;
	std::vector<WeakContainerEntry> container_wrappers;
	std::vector<DeferredObjectEntry> deferred_object_entries;
	std::vector<std::weak_ptr<CallbackRoot>> callback_roots;
	std::vector<std::shared_ptr<CallbackRoot>> deferred_callback_releases;
	std::vector<SignalConnection> signal_connections;
	JSValue weak_reference_constructor = JS_UNDEFINED;
	JSValue module_object = JS_UNDEFINED;
	std::uint64_t next_wrapper_serial = 1;
	bool installed = false;
	bool shutting_down = false;
	bool in_wrapper_finalizer = false;
	std::optional<bool> editor_hint_cache;
	std::thread::id owner_thread;
	GDExtensionObjectPtr pending_script_owner = nullptr;
	bool pending_script_owner_consumed = false;

	explicit Impl(ConsoleSink &console_sink) : console_sink(console_sink) {
		builtin_index_by_variant_type.assign(
				static_cast<std::size_t>(godot::Variant::VARIANT_MAX),
				-1);
		for (std::uint32_t index = 0; index < generated::CLASSES_COUNT; ++index) {
			class_index_by_name.emplace(generated::CLASSES[index].name, index);
		}
		for (std::uint32_t index = 0; index < generated::BUILTINS_COUNT; ++index) {
			const generated::BindingBuiltin &builtin = generated::BUILTINS[index];
			builtin_index_by_name.emplace(builtin.name, index);
			if (builtin.variant_type < builtin_index_by_variant_type.size()) {
				builtin_index_by_variant_type[builtin.variant_type] =
						static_cast<std::int32_t>(index);
			}
		}
	}

	static std::mutex context_bindings_mutex;
	static std::unordered_map<JSContext *, Impl *> context_bindings;

	static Impl *from_context(JSContext *lookup_context) {
		std::lock_guard<std::mutex> lock(context_bindings_mutex);
		const auto iterator = context_bindings.find(lookup_context);
		return iterator == context_bindings.end() ? nullptr : iterator->second;
	}

	static void register_context(JSContext *binding_context, Impl *binding) {
		std::lock_guard<std::mutex> lock(context_bindings_mutex);
		context_bindings.emplace(binding_context, binding);
	}

	static void unregister_context(JSContext *binding_context) {
		std::lock_guard<std::mutex> lock(context_bindings_mutex);
		context_bindings.erase(binding_context);
	}

	static void object_finalizer(JSRuntime *, JSValueConst value) {
		JSClassID class_id = 0;
		WrapperPayload *payload = static_cast<WrapperPayload *>(
				JS_GetAnyOpaque(value, &class_id));
		if (payload == nullptr) {
			return;
		}
		Impl *binding = payload->binding;
		if (binding != nullptr) {
			binding->in_wrapper_finalizer = true;
			if (!binding->shutting_down && payload->object_id != 0) {
				binding->deferred_object_entries.push_back(
						{ payload->object_id, payload->serial });
			}
		}
		delete payload;
		live_wrappers.fetch_sub(1, std::memory_order_acq_rel);
		if (binding != nullptr) {
			binding->in_wrapper_finalizer = false;
		}
	}

	static void variant_finalizer(JSRuntime *, JSValueConst value) {
		JSClassID class_id = 0;
		WrapperPayload *payload = static_cast<WrapperPayload *>(
				JS_GetAnyOpaque(value, &class_id));
		if (payload == nullptr) {
			return;
		}
		Impl *binding = payload->binding;
		if (binding != nullptr) {
			binding->in_wrapper_finalizer = true;
		}
		delete payload;
		live_wrappers.fetch_sub(1, std::memory_order_acq_rel);
		if (binding != nullptr) {
			binding->in_wrapper_finalizer = false;
		}
	}

	std::string exception_text(JSContext *exception_context) const {
		ScopedJSValue exception(exception_context, JS_GetException(exception_context));
		const char *characters = JS_ToCString(exception_context, exception.get());
		if (characters == nullptr) {
			ScopedJSValue conversion_exception(
					exception_context,
					JS_GetException(exception_context));
			return "unknown JavaScript exception";
		}
		const std::string result(characters);
		JS_FreeCString(exception_context, characters);
		return result;
	}

	void clear_exception(JSContext *exception_context) const {
		if (JS_HasException(exception_context)) {
			ScopedJSValue exception(exception_context, JS_GetException(exception_context));
		}
	}

	std::string describe_value(JSContext *value_context, JSValueConst value) const {
		if (JS_IsUndefined(value)) {
			return "undefined";
		}
		if (JS_IsNull(value)) {
			return "null";
		}
		if (JS_IsBool(value)) {
			return "boolean";
		}
		if (JS_IsNumber(value)) {
			return "number";
		}
		if (JS_IsBigInt(value)) {
			return "bigint";
		}
		if (JS_IsString(value)) {
			return "string";
		}
		if (JS_IsFunction(value_context, value)) {
			return "function";
		}
		if (JS_IsArray(value)) {
			return "Array";
		}
		if (JS_GetTypedArrayType(value) >= 0) {
			return "TypedArray";
		}
		if (JS_IsObject(value)) {
			WrapperPayload *payload = wrapper_payload(value);
			if (payload != nullptr) {
				if (payload->is_object()) {
					return payload->class_index < generated::CLASSES_COUNT
							? generated::CLASSES[payload->class_index].name
							: "Godot Object";
				}
				if (payload->builtin_index < generated::BUILTINS_COUNT) {
					return generated::BUILTINS[payload->builtin_index].name;
				}
			}
			return "object";
		}
		return "unknown";
	}

	WrapperPayload *wrapper_payload(JSValueConst value) const {
		if (!JS_IsObject(value)) {
			return nullptr;
		}
		const JSClassID class_id = JS_GetClassID(value);
		if (class_id == object_class_id) {
			return static_cast<WrapperPayload *>(JS_GetOpaque(value, object_class_id));
		}
		const auto iterator = builtin_index_by_class_id.find(class_id);
		if (iterator == builtin_index_by_class_id.end()) {
			return nullptr;
		}
		return static_cast<WrapperPayload *>(JS_GetOpaque(value, class_id));
	}

	GDExtensionObjectPtr validated_object(
			JSContext *call_context,
			JSValueConst value,
			const char *operation) const {
		WrapperPayload *payload = wrapper_payload(value);
		if (payload == nullptr || !payload->is_object()) {
			JS_ThrowTypeError(
					call_context,
					"%s requires a Godot Object receiver; received %s",
					operation,
					describe_value(call_context, value).c_str());
			return nullptr;
		}
		GDExtensionObjectPtr object =
				godot::internal::gdextension_interface_object_get_instance_from_id(
						payload->object_id);
		if (object == nullptr) {
			JS_ThrowReferenceError(
					call_context,
					"%s cannot use freed Godot object %llu",
					operation,
					static_cast<unsigned long long>(payload->object_id));
			return nullptr;
		}
		return object;
	}

	bool object_is_class(
			GDExtensionObjectPtr object,
			const char *class_name) const {
		if (object == nullptr) {
			return false;
		}
		godot::StringName name(class_name);
		void *class_tag =
				godot::internal::gdextension_interface_classdb_get_class_tag(
						name._native_ptr());
		return class_tag != nullptr &&
				godot::internal::gdextension_interface_object_cast_to(
						object,
						class_tag) != nullptr;
	}

	std::size_t class_depth(std::uint32_t class_index) const {
		std::size_t depth = 0;
		while (class_index < generated::CLASSES_COUNT) {
			const char *parent = generated::CLASSES[class_index].inherits;
			if (parent == nullptr || parent[0] == '\0') {
				break;
			}
			const auto parent_index = class_index_by_name.find(parent);
			if (parent_index == class_index_by_name.end()) {
				break;
			}
			class_index = parent_index->second;
			++depth;
		}
		return depth;
	}

	std::optional<std::uint32_t> class_index_for_object(
			GDExtensionObjectPtr object) const {
		if (object == nullptr) {
			return std::nullopt;
		}
		godot::StringName runtime_class_name;
		if (!godot::internal::gdextension_interface_object_get_class_name(
					object,
					godot::internal::library,
					runtime_class_name._native_ptr())) {
			return std::nullopt;
		}
		const std::string class_name = standard_string(
				static_cast<godot::String>(runtime_class_name));
		const auto exact = class_index_by_name.find(class_name);
		if (exact != class_index_by_name.end()) {
			return exact->second;
		}
		std::optional<std::uint32_t> closest;
		std::size_t closest_depth = 0;
		for (const auto &entry : class_index_by_name) {
			if (object_is_class(object, entry.first.c_str())) {
				const std::size_t depth = class_depth(entry.second);
				if (!closest.has_value() || depth > closest_depth) {
					closest = entry.second;
					closest_depth = depth;
				}
			}
		}
		return closest;
	}

	godot::Variant object_variant(GDExtensionObjectPtr object) const {
		alignas(godot::Variant) std::byte storage[sizeof(godot::Variant)]{};
		GDExtensionVariantFromTypeConstructorFunc constructor =
				godot::internal::gdextension_interface_get_variant_from_type_constructor(
						GDEXTENSION_VARIANT_TYPE_OBJECT);
		constructor(storage, &object);
		godot::Variant result(
				reinterpret_cast<GDExtensionConstVariantPtr>(storage));
		godot::internal::gdextension_interface_variant_destroy(storage);
		return result;
	}

	JSValue dereference_weak_reference(JSValueConst weak_reference) {
		ScopedJSValue dereference(
				context,
				JS_GetPropertyStr(context, weak_reference, "deref"));
		if (JS_IsException(dereference.get())) {
			return JS_EXCEPTION;
		}
		return JS_Call(context, dereference.get(), weak_reference, 0, nullptr);
	}

	JSValue wrap_object(
			const godot::Variant &value,
			JSValueConst prototype_override = JS_UNDEFINED) {
		const std::uint64_t object_id =
				godot::internal::gdextension_interface_variant_get_object_instance_id(
						value._native_ptr());
		GDExtensionObjectPtr object =
				godot::internal::gdextension_interface_object_get_instance_from_id(object_id);
		if (object == nullptr) {
			return JS_NULL;
		}
		const auto cached = object_wrappers.find(object_id);
		if (cached != object_wrappers.end()) {
			ScopedJSValue existing(
					context,
					dereference_weak_reference(cached->second.weak_reference));
			if (JS_IsException(existing.get())) {
				return JS_EXCEPTION;
			}
			if (!JS_IsUndefined(existing.get())) {
				if (!JS_IsUndefined(prototype_override) &&
						JS_SetPrototype(context, existing.get(), prototype_override) < 0) {
					return JS_EXCEPTION;
				}
				return existing.release();
			}
			JS_FreeValue(context, cached->second.weak_reference);
			object_wrappers.erase(cached);
		}

		const std::optional<std::uint32_t> class_index = class_index_for_object(object);
		const auto object_class = class_index_by_name.find("Object");
		const std::uint32_t resolved_class_index = class_index.value_or(
				object_class == class_index_by_name.end() ? NO_INDEX : object_class->second);
		JSValue prototype = !JS_IsUndefined(prototype_override)
				? prototype_override
				: resolved_class_index < class_prototypes.size()
				? class_prototypes[resolved_class_index]
				: JS_UNDEFINED;
		JSValue wrapper = JS_NewObjectProtoClass(context, prototype, object_class_id);
		if (JS_IsException(wrapper)) {
			return wrapper;
		}
		const std::uint64_t serial = next_wrapper_serial++;
		auto *payload = new WrapperPayload{
			this,
			value,
			NO_INDEX,
			resolved_class_index,
			object_id,
			serial,
		};
		JS_SetOpaque(wrapper, payload);
		live_wrappers.fetch_add(1, std::memory_order_acq_rel);

		JSValueConst arguments[] = { wrapper };
		ScopedJSValue weak_reference(
				context,
				JS_CallConstructor(
						context,
						weak_reference_constructor,
						1,
						arguments));
		if (JS_IsException(weak_reference.get())) {
			JS_FreeValue(context, wrapper);
			return JS_EXCEPTION;
		}
		object_wrappers.emplace(
				object_id,
				WeakObjectEntry{ weak_reference.release(), serial });
		return wrapper;
	}

	JSValue wrap_builtin(const godot::Variant &value, std::uint32_t builtin_index) {
		if (builtin_index >= builtin_class_ids.size() ||
				builtin_index >= builtin_prototypes.size()) {
			return JS_ThrowInternalError(context, "Godot builtin wrapper metadata is invalid");
		}
		const bool identity_container = value.get_type() == godot::Variant::ARRAY ||
				value.get_type() == godot::Variant::DICTIONARY;
		if (identity_container) {
			for (auto iterator = container_wrappers.begin();
					iterator != container_wrappers.end();) {
				ScopedJSValue existing(
						context,
						dereference_weak_reference(iterator->weak_reference));
				if (JS_IsException(existing.get())) {
					return JS_EXCEPTION;
				}
				if (JS_IsUndefined(existing.get())) {
					JS_FreeValue(context, iterator->weak_reference);
					iterator = container_wrappers.erase(iterator);
					continue;
				}
				WrapperPayload *existing_payload = wrapper_payload(existing.get());
				if (existing_payload != nullptr &&
						godot::UtilityFunctions::is_same(existing_payload->value, value)) {
					return existing.release();
				}
				++iterator;
			}
		}
		JSValue wrapper = JS_NewObjectProtoClass(
				context,
				builtin_prototypes[builtin_index],
				builtin_class_ids[builtin_index]);
		if (JS_IsException(wrapper)) {
			return wrapper;
		}
		const std::uint64_t serial = identity_container ? next_wrapper_serial++ : 0;
		auto *payload = new WrapperPayload{
			this,
			value,
			builtin_index,
			NO_INDEX,
			0,
			serial,
		};
		JS_SetOpaque(wrapper, payload);
		live_wrappers.fetch_add(1, std::memory_order_acq_rel);
		if (identity_container) {
			JSValueConst arguments[] = { wrapper };
			ScopedJSValue weak_reference(
					context,
					JS_CallConstructor(
							context,
							weak_reference_constructor,
							1,
							arguments));
			if (JS_IsException(weak_reference.get())) {
				JS_FreeValue(context, wrapper);
				return JS_EXCEPTION;
			}
			container_wrappers.push_back(
					{ weak_reference.release(), serial });
		}
		const godot::Variant::Type type = value.get_type();
		if (type == godot::Variant::STRING_NAME || type == godot::Variant::NODE_PATH ||
				type == godot::Variant::RID) {
			if (JS_FreezeObject(context, wrapper) < 0) {
				JS_FreeValue(context, wrapper);
				return JS_EXCEPTION;
			}
		}
		return wrapper;
	}

	JSValue from_variant(const godot::Variant &value) {
		const godot::Variant::Type type = value.get_type();
		switch (type) {
			case godot::Variant::NIL:
				return JS_NULL;
			case godot::Variant::BOOL:
				return JS_NewBool(context, static_cast<bool>(value));
			case godot::Variant::INT:
				return javascript_integer(context, static_cast<std::int64_t>(value));
			case godot::Variant::FLOAT:
				return JS_NewFloat64(context, static_cast<double>(value));
			case godot::Variant::STRING:
				return javascript_string(context, static_cast<godot::String>(value));
			case godot::Variant::OBJECT:
				return wrap_object(value);
			default:
				break;
		}
		const std::size_t type_index = static_cast<std::size_t>(type);
		if (type_index >= builtin_index_by_variant_type.size() ||
				builtin_index_by_variant_type[type_index] < 0) {
			return JS_ThrowInternalError(
					context,
					"Godot Variant type %d has no generated JavaScript wrapper",
					static_cast<int>(type));
		}
		return wrap_builtin(
				value,
				static_cast<std::uint32_t>(builtin_index_by_variant_type[type_index]));
	}

	bool construct_variant(
			godot::Variant::Type type,
			const std::vector<godot::Variant> &arguments,
			godot::Variant &result,
			std::string &error) const {
		std::vector<const godot::Variant *> argument_pointers;
		argument_pointers.reserve(arguments.size());
		for (const godot::Variant &argument : arguments) {
			argument_pointers.push_back(&argument);
		}
		GDExtensionCallError call_error{};
		alignas(godot::Variant) std::byte storage[sizeof(godot::Variant)]{};
		godot::internal::gdextension_interface_variant_construct(
				static_cast<GDExtensionVariantType>(type),
				storage,
				reinterpret_cast<GDExtensionConstVariantPtr *>(argument_pointers.data()),
				static_cast<std::int32_t>(argument_pointers.size()),
				&call_error);
		if (call_error.error == GDEXTENSION_CALL_OK) {
			result = godot::Variant(
					reinterpret_cast<GDExtensionConstVariantPtr>(storage));
			godot::internal::gdextension_interface_variant_destroy(storage);
			return true;
		}
		godot::internal::gdextension_interface_variant_destroy(storage);
		error = std::string(call_error_name(call_error.error)) +
				" (argument=" + std::to_string(call_error.argument) +
				", expected_variant_type=" + std::to_string(call_error.expected) + ")";
		return false;
	}

	bool javascript_string_value(
			JSContext *conversion_context,
			JSValueConst value,
			godot::String &result,
			std::string &error) const {
		if (!JS_IsString(value)) {
			error = "expected string; received " + describe_value(conversion_context, value);
			return false;
		}
		std::size_t length = 0;
		const char *characters = JS_ToCStringLen(conversion_context, &length, value);
		if (characters == nullptr) {
			error = exception_text(conversion_context);
			return false;
		}
		result = godot::String::utf8(characters, static_cast<std::int64_t>(length));
		JS_FreeCString(conversion_context, characters);
		return true;
	}

	bool number_to_integer(
			JSContext *conversion_context,
			JSValueConst value,
			std::int64_t &result,
			std::string &error) const {
		if (JS_IsBigInt(value)) {
			if (JS_ToBigInt64(conversion_context, &result, value) < 0) {
				error = exception_text(conversion_context);
				return false;
			}
			return true;
		}
		if (!JS_IsNumber(value)) {
			error = "expected integral number or bigint; received " +
					describe_value(conversion_context, value);
			return false;
		}
		double numeric = 0;
		if (JS_ToFloat64(conversion_context, &numeric, value) < 0) {
			error = exception_text(conversion_context);
			return false;
		}
		if (!std::isfinite(numeric) || std::trunc(numeric) != numeric ||
				numeric < static_cast<double>(std::numeric_limits<std::int64_t>::min()) ||
				numeric > static_cast<double>(std::numeric_limits<std::int64_t>::max())) {
			error = "expected finite signed 64-bit integer; received number";
			return false;
		}
		result = static_cast<std::int64_t>(numeric);
		return true;
	}

	bool convert_javascript_array(
			JSContext *conversion_context,
			JSValueConst value,
			godot::Array &result,
			std::string &error,
			std::size_t depth) {
		if (!JS_IsArray(value) && JS_GetTypedArrayType(value) < 0) {
			error = "expected Array or TypedArray; received " +
					describe_value(conversion_context, value);
			return false;
		}
		std::int64_t length = 0;
		if (JS_GetLength(conversion_context, value, &length) < 0) {
			error = exception_text(conversion_context);
			return false;
		}
		if (length < 0 || length > std::numeric_limits<std::int32_t>::max()) {
			error = "JavaScript array length exceeds the Godot Array limit";
			return false;
		}
		result.resize(length);
		for (std::int64_t index = 0; index < length; ++index) {
			ScopedJSValue item(
					conversion_context,
					JS_GetPropertyUint32(
							conversion_context,
							value,
							static_cast<std::uint32_t>(index)));
			if (JS_IsException(item.get())) {
				error = exception_text(conversion_context);
				return false;
			}
			godot::Variant converted;
			if (!to_variant(
						conversion_context,
						item.get(),
						"Variant",
						converted,
						error,
						depth + 1)) {
				error = "array element " + std::to_string(index) + ": " + error;
				return false;
			}
			result[index] = converted;
		}
		return true;
	}

	bool convert_javascript_dictionary(
			JSContext *conversion_context,
			JSValueConst value,
			godot::Dictionary &result,
			std::string &error,
			std::size_t depth) {
		if (!JS_IsObject(value) || JS_IsArray(value) || JS_IsFunction(conversion_context, value) ||
				JS_GetTypedArrayType(value) >= 0 || wrapper_payload(value) != nullptr) {
			error = "expected plain object; received " + describe_value(conversion_context, value);
			return false;
		}
		JSPropertyEnum *properties = nullptr;
		std::uint32_t property_count = 0;
		if (JS_GetOwnPropertyNames(
					conversion_context,
					&properties,
					&property_count,
					value,
					JS_GPN_STRING_MASK | JS_GPN_ENUM_ONLY) < 0) {
			error = exception_text(conversion_context);
			return false;
		}
		const auto release_properties = [&]() {
			for (std::uint32_t index = 0; index < property_count; ++index) {
				JS_FreeAtom(conversion_context, properties[index].atom);
			}
			js_free(conversion_context, properties);
			properties = nullptr;
		};
		for (std::uint32_t index = 0; index < property_count; ++index) {
			std::size_t key_length = 0;
			const char *key = JS_AtomToCStringLen(
					conversion_context,
					&key_length,
					properties[index].atom);
			if (key == nullptr) {
				release_properties();
				error = exception_text(conversion_context);
				return false;
			}
			const std::string key_string(key, key_length);
			JS_FreeCString(conversion_context, key);
			ScopedJSValue item(
					conversion_context,
					JS_GetProperty(
							conversion_context,
							value,
							properties[index].atom));
			if (JS_IsException(item.get())) {
				release_properties();
				error = exception_text(conversion_context);
				return false;
			}
			godot::Variant converted;
			if (!to_variant(
						conversion_context,
						item.get(),
						"Variant",
						converted,
						error,
						depth + 1)) {
				release_properties();
				error = "dictionary property '" + key_string + "': " + error;
				return false;
			}
			result[godot_string(key_string)] = converted;
		}
		release_properties();
		return true;
	}

	std::shared_ptr<CallbackRoot> create_callback_root(
			JSContext *conversion_context,
			JSValueConst target,
			JSValueConst function,
			std::uint64_t target_object_id) {
		int function_length = 0;
		ScopedJSValue length_value(
				conversion_context,
				JS_GetPropertyStr(conversion_context, function, "length"));
		if (!JS_IsException(length_value.get())) {
			std::int32_t converted_length = 0;
			if (JS_ToInt32(conversion_context, &converted_length, length_value.get()) >= 0) {
				function_length = std::max(0, converted_length);
			} else {
				clear_exception(conversion_context);
			}
		}
		auto root = std::make_shared<CallbackRoot>();
		root->binding = this;
		root->target = JS_DupValue(conversion_context, target);
		root->function = JS_DupValue(conversion_context, function);
		root->serial = next_callback_serial.fetch_add(1, std::memory_order_relaxed);
		root->target_object_id = target_object_id;
		root->argument_count = function_length;
		callback_roots.emplace_back(root);
		live_callback_roots.fetch_add(1, std::memory_order_acq_rel);
		return root;
	}

	bool javascript_callable(
			JSContext *conversion_context,
			JSValueConst value,
			godot::Variant &result,
			std::string &error) {
		WrapperPayload *payload = wrapper_payload(value);
		if (payload != nullptr &&
				payload->value.get_type() == godot::Variant::CALLABLE) {
			result = payload->value;
			return true;
		}
		if (!JS_IsFunction(conversion_context, value)) {
			error = "expected Callable wrapper or JavaScript function; received " +
					describe_value(conversion_context, value);
			return false;
		}
		std::shared_ptr<CallbackRoot> root = create_callback_root(
				conversion_context,
				JS_UNDEFINED,
				value,
				0);
		result = godot::Callable(memnew(JavaScriptCallable(std::move(root))));
		return true;
	}

	bool to_variant(
			JSContext *conversion_context,
			JSValueConst value,
			const std::string &expected_type,
			godot::Variant &result,
			std::string &error,
			std::size_t depth = 0) {
		if (depth > MAX_CONVERSION_DEPTH) {
			error = "Variant conversion exceeded the maximum nesting depth of 64";
			return false;
		}
		WrapperPayload *payload = wrapper_payload(value);
		if (payload != nullptr) {
			GDExtensionObjectPtr object = payload->is_object()
					? godot::internal::gdextension_interface_object_get_instance_from_id(
							  payload->object_id)
					: nullptr;
			if (payload->is_object() && object == nullptr) {
				error = "Godot object wrapper refers to an object that has already been freed";
				return false;
			}
			if (expected_type == "Variant" || expected_type.empty()) {
				result = payload->value;
				return true;
			}
			if (expected_type == "Object" || class_index_by_name.count(expected_type) > 0) {
				if (!payload->is_object()) {
					error = "expected " + expected_type + "; received " +
							describe_value(conversion_context, value);
					return false;
				}
				if (expected_type != "Object" &&
						!object_is_class(object, expected_type.c_str())) {
					error = "expected " + expected_type + "; received " +
							describe_value(conversion_context, value);
					return false;
				}
				result = payload->value;
				return true;
			}
			const auto builtin = builtin_index_by_name.find(expected_type);
			if (builtin != builtin_index_by_name.end()) {
				const godot::Variant::Type expected_variant_type =
						static_cast<godot::Variant::Type>(
								generated::BUILTINS[builtin->second].variant_type);
				if (payload->value.get_type() == expected_variant_type) {
					result = payload->value;
					return true;
				}
				if (godot::Variant::can_convert_strict(
							payload->value.get_type(),
							expected_variant_type)) {
					std::vector<godot::Variant> arguments{ payload->value };
					return construct_variant(expected_variant_type, arguments, result, error);
				}
			}
			error = "expected " + expected_type + "; received " +
					describe_value(conversion_context, value);
			return false;
		}

		if (expected_type == "Variant" || expected_type.empty()) {
			if (JS_IsUndefined(value) || JS_IsNull(value)) {
				result = godot::Variant();
				return true;
			}
			if (JS_IsBool(value)) {
				result = static_cast<bool>(JS_ToBool(conversion_context, value));
				return true;
			}
			if (JS_IsBigInt(value)) {
				std::int64_t integer = 0;
				if (!number_to_integer(conversion_context, value, integer, error)) {
					return false;
				}
				result = integer;
				return true;
			}
			if (JS_IsNumber(value)) {
				double numeric = 0;
				if (JS_ToFloat64(conversion_context, &numeric, value) < 0) {
					error = exception_text(conversion_context);
					return false;
				}
				if (std::isfinite(numeric) && std::trunc(numeric) == numeric &&
						numeric >= static_cast<double>(std::numeric_limits<std::int64_t>::min()) &&
						numeric <= static_cast<double>(std::numeric_limits<std::int64_t>::max())) {
					result = static_cast<std::int64_t>(numeric);
				} else {
					result = numeric;
				}
				return true;
			}
			if (JS_IsString(value)) {
				godot::String converted;
				if (!javascript_string_value(
							conversion_context,
							value,
							converted,
							error)) {
					return false;
				}
				result = converted;
				return true;
			}
			if (JS_IsFunction(conversion_context, value)) {
				return javascript_callable(conversion_context, value, result, error);
			}
			if (JS_IsArray(value) || JS_GetTypedArrayType(value) >= 0) {
				godot::Array converted;
				if (!convert_javascript_array(
							conversion_context,
							value,
							converted,
							error,
							depth)) {
					return false;
				}
				result = converted;
				return true;
			}
			if (JS_IsObject(value)) {
				godot::Dictionary converted;
				if (!convert_javascript_dictionary(
							conversion_context,
							value,
							converted,
							error,
							depth)) {
					return false;
				}
				result = converted;
				return true;
			}
			error = "unsupported JavaScript value for Variant conversion";
			return false;
		}

		if (expected_type == "bool") {
			if (!JS_IsBool(value)) {
				error = "expected bool; received " + describe_value(conversion_context, value);
				return false;
			}
			result = static_cast<bool>(JS_ToBool(conversion_context, value));
			return true;
		}
		if (expected_type == "int" || starts_with(expected_type, "enum::") ||
				starts_with(expected_type, "bitfield::")) {
			std::int64_t integer = 0;
			if (!number_to_integer(conversion_context, value, integer, error)) {
				return false;
			}
			result = integer;
			return true;
		}
		if (expected_type == "float") {
			if (!JS_IsNumber(value) && !JS_IsBigInt(value)) {
				error = "expected float; received " + describe_value(conversion_context, value);
				return false;
			}
			double numeric = 0;
			if (JS_ToFloat64(conversion_context, &numeric, value) < 0) {
				error = exception_text(conversion_context);
				return false;
			}
			result = numeric;
			return true;
		}
		if (expected_type == "String") {
			godot::String converted;
			if (!javascript_string_value(
						conversion_context,
						value,
						converted,
						error)) {
				return false;
			}
			result = converted;
			return true;
		}
		if (expected_type == "StringName" || expected_type == "NodePath") {
			godot::String converted;
			if (!javascript_string_value(
						conversion_context,
						value,
						converted,
						error)) {
				return false;
			}
			result = expected_type == "StringName"
					? godot::Variant(godot::StringName(converted))
					: godot::Variant(godot::NodePath(converted));
			return true;
		}
		if (expected_type == "Callable") {
			return javascript_callable(conversion_context, value, result, error);
		}
		if (expected_type == "Array" || starts_with(expected_type, "typedarray::")) {
			godot::Array converted;
			if (!convert_javascript_array(
						conversion_context,
						value,
						converted,
						error,
						depth)) {
				return false;
			}
			result = converted;
			return true;
		}
		if (expected_type == "Dictionary") {
			godot::Dictionary converted;
			if (!convert_javascript_dictionary(
						conversion_context,
						value,
						converted,
						error,
						depth)) {
				return false;
			}
			result = converted;
			return true;
		}
		if (expected_type == "Object" || class_index_by_name.count(expected_type) > 0) {
			if (JS_IsNull(value) || JS_IsUndefined(value)) {
				result = godot::Variant();
				return true;
			}
			error = "expected " + expected_type + " object wrapper; received " +
					describe_value(conversion_context, value);
			return false;
		}

		const auto builtin = builtin_index_by_name.find(expected_type);
		if (builtin != builtin_index_by_name.end()) {
			const godot::Variant::Type target_type = static_cast<godot::Variant::Type>(
					generated::BUILTINS[builtin->second].variant_type);
			if (is_packed_variant_type(target_type) &&
					(JS_IsArray(value) || JS_GetTypedArrayType(value) >= 0)) {
				godot::Array converted;
				if (!convert_javascript_array(
							conversion_context,
							value,
							converted,
							error,
							depth)) {
					return false;
				}
				return construct_variant(
						target_type,
						std::vector<godot::Variant>{ converted },
						result,
						error);
			}
		}

		error = "unsupported conversion to " + expected_type + " from " +
				describe_value(conversion_context, value);
		return false;
	}

	bool validate_arity(
			JSContext *call_context,
			const generated::BindingMethod &method,
			int argument_count,
			const std::string &owner_name) const {
		const bool vararg = (method.flags & METHOD_VARARG) != 0;
		if (argument_count < static_cast<int>(method.required_arguments_count) ||
				(!vararg && argument_count > static_cast<int>(method.arguments_count))) {
			JS_ThrowTypeError(
					call_context,
					"%s.%s expects %u..%s argument(s); received %d",
					owner_name.c_str(),
					method.name,
					static_cast<unsigned>(method.required_arguments_count),
					vararg ? "unbounded" : std::to_string(method.arguments_count).c_str(),
					argument_count);
			return false;
		}
		return true;
	}

	bool convert_method_arguments(
			JSContext *call_context,
			const generated::BindingMethod &method,
			int argument_count,
			JSValueConst *arguments,
			const std::string &owner_name,
			std::vector<godot::Variant> &converted) {
		converted.reserve(static_cast<std::size_t>(argument_count));
		for (int index = 0; index < argument_count; ++index) {
			const std::string expected = index < method.arguments_count
					? generated::ARGUMENTS[method.arguments_offset + index].type
					: "Variant";
			godot::Variant value;
			std::string error;
			if (!to_variant(call_context, arguments[index], expected, value, error)) {
				clear_exception(call_context);
				JS_ThrowTypeError(
						call_context,
						"%s.%s argument %d ('%s') expected %s; received %s: %s",
						owner_name.c_str(),
						method.name,
						index,
						index < method.arguments_count
								? generated::ARGUMENTS[method.arguments_offset + index].name
								: "vararg",
						expected.c_str(),
						describe_value(call_context, arguments[index]).c_str(),
						error.c_str());
				return false;
			}
			converted.push_back(std::move(value));
		}
		return true;
	}

	JSValue throw_godot_call_error(
			JSContext *call_context,
			const std::string &owner_name,
			const char *method_name,
			const GDExtensionCallError &call_error) const {
		return JS_ThrowTypeError(
				call_context,
				"Godot call %s.%s failed: %s (code=%d, argument=%d, expected_variant_type=%d)",
				owner_name.c_str(),
				method_name,
				call_error_name(call_error.error),
				static_cast<int>(call_error.error),
				call_error.argument,
				call_error.expected);
	}

	JSValue call_class_method(
			JSContext *call_context,
			JSValueConst this_value,
			const generated::BindingMethod &method,
			int argument_count,
			JSValueConst *arguments) {
		const generated::BindingClass &owner = generated::CLASSES[method.owner_index];
		const std::string owner_name(owner.name);
		if (!validate_arity(call_context, method, argument_count, owner_name)) {
			return JS_EXCEPTION;
		}
		std::vector<godot::Variant> converted;
		if (!convert_method_arguments(
					call_context,
					method,
					argument_count,
					arguments,
					owner_name,
					converted)) {
			return JS_EXCEPTION;
		}
		std::vector<const godot::Variant *> argument_pointers;
		argument_pointers.reserve(converted.size());
		for (const godot::Variant &argument : converted) {
			argument_pointers.push_back(&argument);
		}

		const godot::StringName class_name(owner.name);
		const godot::StringName method_name(method.name);
		godot::Variant result;
		GDExtensionCallError call_error{};
		GDExtensionObjectPtr object = nullptr;
		const bool is_static = (method.flags & METHOD_STATIC) != 0;
		if (!is_static) {
			object = validated_object(call_context, this_value, method.name);
			if (object == nullptr) {
				return JS_EXCEPTION;
			}
		}

		GDExtensionMethodBindPtr method_bind =
				godot::internal::gdextension_interface_classdb_get_method_bind(
						class_name._native_ptr(),
						method_name._native_ptr(),
						method.hash);
		if (method_bind != nullptr && (method.flags & METHOD_VIRTUAL) == 0) {
			godot::internal::gdextension_interface_object_method_bind_call(
					method_bind,
					is_static ? nullptr : object,
					reinterpret_cast<GDExtensionConstVariantPtr *>(argument_pointers.data()),
					static_cast<GDExtensionInt>(argument_pointers.size()),
					result._native_ptr(),
					&call_error);
		} else if (is_static) {
			godot::StringName class_db_name("ClassDB");
			GDExtensionObjectPtr class_db_owner =
					godot::internal::gdextension_interface_global_get_singleton(
							class_db_name._native_ptr());
			if (class_db_owner == nullptr) {
				return JS_ThrowInternalError(
						call_context,
						"Godot ClassDB is unavailable for compatible static call %s.%s",
						owner.name,
						method.name);
			}
			std::vector<godot::Variant> fallback_arguments;
			fallback_arguments.reserve(converted.size() + 2U);
			fallback_arguments.emplace_back(class_name);
			fallback_arguments.emplace_back(method_name);
			fallback_arguments.insert(
					fallback_arguments.end(),
					converted.begin(),
					converted.end());
			std::vector<const godot::Variant *> fallback_pointers;
			fallback_pointers.reserve(fallback_arguments.size());
			for (const godot::Variant &argument : fallback_arguments) {
				fallback_pointers.push_back(&argument);
			}
			godot::Variant class_db = object_variant(class_db_owner);
			class_db.callp(
					godot::StringName("class_call_static"),
					fallback_pointers.data(),
					static_cast<int>(fallback_pointers.size()),
					result,
					call_error);
		} else {
			WrapperPayload *payload = wrapper_payload(this_value);
			payload->value.callp(
					method_name,
					argument_pointers.data(),
					static_cast<int>(argument_pointers.size()),
					result,
					call_error);
		}
		if (call_error.error != GDEXTENSION_CALL_OK) {
			return throw_godot_call_error(
					call_context,
					owner_name,
					method.name,
					call_error);
		}
		return from_variant(result);
	}

	JSValue call_builtin_method(
			JSContext *call_context,
			JSValueConst this_value,
			const generated::BindingMethod &method,
			int argument_count,
			JSValueConst *arguments) {
		const generated::BindingBuiltin &owner = generated::BUILTINS[method.owner_index];
		const std::string owner_name(owner.name);
		if (!validate_arity(call_context, method, argument_count, owner_name)) {
			return JS_EXCEPTION;
		}
		std::vector<godot::Variant> converted;
		if (!convert_method_arguments(
					call_context,
					method,
					argument_count,
					arguments,
					owner_name,
					converted)) {
			return JS_EXCEPTION;
		}
		std::vector<const godot::Variant *> argument_pointers;
		argument_pointers.reserve(converted.size());
		for (const godot::Variant &argument : converted) {
			argument_pointers.push_back(&argument);
		}
		godot::Variant result;
		GDExtensionCallError call_error{};
		WrapperPayload *payload = nullptr;
		if ((method.flags & METHOD_STATIC) != 0) {
			godot::Variant::callp_static(
					static_cast<godot::Variant::Type>(owner.variant_type),
					godot::StringName(method.name),
					argument_pointers.data(),
					static_cast<int>(argument_pointers.size()),
					result,
					call_error);
		} else {
			payload = wrapper_payload(this_value);
			if (payload == nullptr || payload->builtin_index != method.owner_index) {
				return JS_ThrowTypeError(
						call_context,
						"%s.%s requires a %s receiver; received %s",
						owner.name,
						method.name,
						owner.name,
						describe_value(call_context, this_value).c_str());
			}
			payload->value.callp(
					godot::StringName(method.name),
					argument_pointers.data(),
					static_cast<int>(argument_pointers.size()),
					result,
					call_error);
		}
		if (call_error.error != GDEXTENSION_CALL_OK) {
			return throw_godot_call_error(
					call_context,
					owner_name,
					method.name,
					call_error);
		}
		if (payload != nullptr &&
				payload->value.get_type() == godot::Variant::SIGNAL &&
				!converted.empty() &&
				converted[0].get_type() == godot::Variant::CALLABLE) {
			const godot::Signal signal = payload->value;
			const godot::Callable callable = converted[0];
			if (std::strcmp(method.name, "connect") == 0 &&
					result.get_type() == godot::Variant::INT &&
					static_cast<std::int64_t>(result) == godot::OK) {
				signal_connections.push_back({ signal, callable });
			} else if (std::strcmp(method.name, "disconnect") == 0) {
				const auto connection = std::find_if(
						signal_connections.begin(),
						signal_connections.end(),
						[&](const SignalConnection &entry) {
							return entry.signal == signal && entry.callable == callable;
						});
				if (connection != signal_connections.end()) {
					signal_connections.erase(connection);
				}
			}
		}
		prune_signal_connections();
		return from_variant(result);
	}

	void prune_signal_connections() {
		signal_connections.erase(
				std::remove_if(
						signal_connections.begin(),
						signal_connections.end(),
						[](const SignalConnection &entry) {
							return entry.signal.is_null() ||
									!entry.signal.is_connected(entry.callable);
						}),
				signal_connections.end());
	}

	void disconnect_signal_connections() noexcept {
		for (SignalConnection &entry : signal_connections) {
			if (!entry.signal.is_null() && entry.signal.is_connected(entry.callable)) {
				entry.signal.disconnect(entry.callable);
			}
		}
		signal_connections.clear();
	}

	JSValue call_utility(
			JSContext *call_context,
			std::uint32_t utility_index,
			int argument_count,
			JSValueConst *arguments) {
		if (utility_index >= generated::UTILITIES_COUNT) {
			return JS_ThrowInternalError(call_context, "Generated utility index is invalid");
		}
		const generated::BindingUtility &utility = generated::UTILITIES[utility_index];
		const generated::BindingMethod &method = generated::METHODS[utility.method_index];
		if (!validate_arity(call_context, method, argument_count, "godot")) {
			return JS_EXCEPTION;
		}
		if (std::strcmp(utility.name, "is_instance_valid") == 0 &&
				argument_count == 1) {
			WrapperPayload *payload = wrapper_payload(arguments[0]);
			if (payload != nullptr && payload->is_object()) {
				return JS_NewBool(
						call_context,
						godot::internal::gdextension_interface_object_get_instance_from_id(
								payload->object_id) != nullptr);
			}
		}
		std::vector<godot::Variant> converted;
		if (!convert_method_arguments(
					call_context,
					method,
					argument_count,
					arguments,
					"godot",
					converted)) {
			return JS_EXCEPTION;
		}
		const generated::UtilityCallResult result =
				generated::call_utility(utility_index, converted);
		if (!result.ok) {
			return JS_ThrowTypeError(
					call_context,
					"Godot utility godot.%s failed: %s",
					utility.name,
					result.error.c_str());
		}
		return from_variant(result.value);
	}

	static bool function_data_index(
			JSContext *call_context,
			JSValueConst *function_data,
			std::uint32_t &index) {
		std::int32_t converted = 0;
		if (JS_ToInt32(call_context, &converted, function_data[0]) < 0 || converted < 0) {
			return false;
		}
		index = static_cast<std::uint32_t>(converted);
		return true;
	}

	static JSValue js_method(
			JSContext *call_context,
			JSValueConst this_value,
			int argument_count,
			JSValueConst *arguments,
			int,
			JSValueConst *function_data) {
		Impl *binding = from_context(call_context);
		std::uint32_t method_index = 0;
		if (binding == nullptr ||
				!function_data_index(call_context, function_data, method_index) ||
				method_index >= generated::METHODS_COUNT) {
			return JS_ThrowInternalError(call_context, "Generated Godot method state is unavailable");
		}
		const generated::BindingMethod &method = generated::METHODS[method_index];
		if (method.owner_kind == generated::BindingOwnerKind::CLASS) {
			return binding->call_class_method(
					call_context,
					this_value,
					method,
					argument_count,
					arguments);
		}
		if (method.owner_kind == generated::BindingOwnerKind::BUILTIN) {
			return binding->call_builtin_method(
					call_context,
					this_value,
					method,
					argument_count,
					arguments);
		}
		return JS_ThrowInternalError(call_context, "Utility method used the wrong callback");
	}

	static JSValue js_utility(
			JSContext *call_context,
			JSValueConst,
			int argument_count,
			JSValueConst *arguments,
			int,
			JSValueConst *function_data) {
		Impl *binding = from_context(call_context);
		std::uint32_t utility_index = 0;
		if (binding == nullptr ||
				!function_data_index(call_context, function_data, utility_index)) {
			return JS_ThrowInternalError(call_context, "Generated Godot utility state is unavailable");
		}
		return binding->call_utility(
				call_context,
				utility_index,
				argument_count,
				arguments);
	}

	static JSValue js_class_constructor(
			JSContext *call_context,
			JSValueConst new_target,
			int argument_count,
			JSValueConst *,
			int,
			JSValueConst *function_data) {
		Impl *binding = from_context(call_context);
		std::uint32_t class_index = 0;
		if (binding == nullptr ||
				!function_data_index(call_context, function_data, class_index) ||
				class_index >= generated::CLASSES_COUNT) {
			return JS_ThrowInternalError(call_context, "Generated Godot class state is unavailable");
		}
		const generated::BindingClass &binding_class = generated::CLASSES[class_index];
		if (!binding_class.is_instantiable) {
			return JS_ThrowTypeError(
					call_context,
					"Godot class %s is not instantiable",
					binding_class.name);
		}
		if (argument_count != 0) {
			return JS_ThrowTypeError(
					call_context,
					"Godot class %s constructor expects 0 arguments; received %d",
					binding_class.name,
					argument_count);
		}
		ScopedJSValue prototype(
				call_context,
				JS_IsObject(new_target)
						? JS_GetPropertyStr(call_context, new_target, "prototype")
						: JS_UNDEFINED);
		if (JS_IsException(prototype.get())) {
			return JS_EXCEPTION;
		}

		GDExtensionObjectPtr owner = nullptr;
		bool owns_constructed_object = false;
		if (binding->pending_script_owner != nullptr &&
				!binding->pending_script_owner_consumed) {
			owner = binding->pending_script_owner;
			if (!binding->object_is_class(owner, binding_class.name)) {
				return JS_ThrowTypeError(
						call_context,
						"JavaScript script base %s is incompatible with its attached Godot object",
						binding_class.name);
			}
			binding->pending_script_owner_consumed = true;
		} else {
			godot::StringName class_name(binding_class.name);
			owner = godot::internal::gdextension_interface_classdb_construct_object2(
					class_name._native_ptr());
			owns_constructed_object = owner != nullptr;
		}
		if (owner == nullptr) {
			return JS_ThrowInternalError(
					call_context,
					"Godot ClassDB could not construct %s",
					binding_class.name);
		}
		godot::Variant object_value = binding->object_variant(owner);
		JSValue wrapper = binding->wrap_object(object_value, prototype.get());
		if (JS_IsException(wrapper) && owns_constructed_object &&
				!binding_class.is_refcounted) {
			godot::internal::gdextension_interface_object_destroy(owner);
		}
		return wrapper;
	}

	JSValue construct_script_instance(
			JSValueConst script_class,
			GDExtensionObjectPtr owner,
			std::uint64_t owner_id) {
		if (context == nullptr) {
			return JS_EXCEPTION;
		}
		if (owner == nullptr || owner_id == 0) {
			return JS_ThrowInternalError(context, "JavaScript script construction has no live owner");
		}
		if (!JS_IsConstructor(context, script_class)) {
			return JS_ThrowTypeError(context, "JavaScript script default export must be a class constructor");
		}
		if (pending_script_owner != nullptr) {
			return JS_ThrowInternalError(context, "JavaScript script construction is already active");
		}
		pending_script_owner = owner;
		pending_script_owner_consumed = false;
		JSValue instance = JS_CallConstructor(context, script_class, 0, nullptr);
		const bool consumed = pending_script_owner_consumed;
		pending_script_owner = nullptr;
		pending_script_owner_consumed = false;
		if (JS_IsException(instance)) {
			return instance;
		}
		if (!consumed) {
			JS_FreeValue(context, instance);
			return JS_ThrowTypeError(
					context,
					"JavaScript script class did not initialize a generated Godot base class");
		}
		WrapperPayload *payload = wrapper_payload(instance);
		if (payload == nullptr || !payload->is_object() ||
				payload->object_id != owner_id) {
			JS_FreeValue(context, instance);
			return JS_ThrowTypeError(
					context,
					"JavaScript script constructor returned an object other than its attached Godot owner");
		}
		return instance;
	}

	bool script_base_class(
			JSValueConst script_class,
			std::string &base_class,
			std::string &error) const {
		base_class.clear();
		if (context == nullptr || !JS_IsConstructor(context, script_class)) {
			error = "default export must be a JavaScript class extending a generated Godot class";
			return false;
		}
		ScopedJSValue prototype(
				context,
				JS_GetPropertyStr(context, script_class, "prototype"));
		if (JS_IsException(prototype.get())) {
			error = exception_text(context);
			return false;
		}
		while (JS_IsObject(prototype.get())) {
			for (std::uint32_t index = 0; index < class_prototypes.size(); ++index) {
				if (!JS_IsUndefined(class_prototypes[index]) &&
						JS_IsStrictEqual(context, prototype.get(), class_prototypes[index])) {
					base_class = generated::CLASSES[index].name;
					return true;
				}
			}
			ScopedJSValue parent(context, JS_GetPrototype(context, prototype.get()));
			if (JS_IsException(parent.get())) {
				error = exception_text(context);
				return false;
			}
			prototype = std::move(parent);
		}
		error = "default export does not extend a generated Godot class";
		return false;
	}

	bool is_godot_class_prototype(JSValueConst value) const {
		if (context == nullptr || !JS_IsObject(value)) {
			return false;
		}
		return std::any_of(
				class_prototypes.begin(),
				class_prototypes.end(),
				[this, value](JSValueConst prototype) {
					return !JS_IsUndefined(prototype) &&
							JS_IsStrictEqual(context, value, prototype);
				});
	}

	static JSValue js_builtin_constructor(
			JSContext *call_context,
			JSValueConst,
			int argument_count,
			JSValueConst *arguments,
			int,
			JSValueConst *function_data) {
		Impl *binding = from_context(call_context);
		std::uint32_t builtin_index = 0;
		if (binding == nullptr ||
				!function_data_index(call_context, function_data, builtin_index) ||
				builtin_index >= generated::BUILTINS_COUNT) {
			return JS_ThrowInternalError(call_context, "Generated Godot builtin state is unavailable");
		}
		const generated::BindingBuiltin &builtin = generated::BUILTINS[builtin_index];

		if (std::strcmp(builtin.name, "Array") == 0 && argument_count == 1 &&
				(JS_IsArray(arguments[0]) || JS_GetTypedArrayType(arguments[0]) >= 0)) {
			godot::Array converted;
			std::string error;
			if (!binding->convert_javascript_array(
						call_context,
						arguments[0],
						converted,
						error,
						0)) {
				binding->clear_exception(call_context);
				return JS_ThrowTypeError(
						call_context,
						"Array constructor conversion failed: %s",
						error.c_str());
			}
			return binding->from_variant(godot::Variant(converted));
		}
		if (std::strcmp(builtin.name, "Dictionary") == 0 && argument_count == 1 &&
				JS_IsObject(arguments[0]) && !JS_IsArray(arguments[0])) {
			godot::Dictionary converted;
			std::string error;
			if (!binding->convert_javascript_dictionary(
						call_context,
						arguments[0],
						converted,
						error,
						0)) {
				binding->clear_exception(call_context);
				return JS_ThrowTypeError(
						call_context,
						"Dictionary constructor conversion failed: %s",
						error.c_str());
			}
			return binding->from_variant(godot::Variant(converted));
		}

		if (std::strcmp(builtin.name, "Callable") == 0 && argument_count >= 1) {
			if (argument_count == 1) {
				godot::Variant callable;
				std::string error;
				if (!binding->javascript_callable(
							call_context,
							arguments[0],
							callable,
							error)) {
					binding->clear_exception(call_context);
					return JS_ThrowTypeError(
							call_context,
							"Callable constructor expected a Callable or function: %s",
							error.c_str());
				}
				return binding->from_variant(callable);
			}
			return JS_ThrowTypeError(
					call_context,
					"Callable constructor expects 0 or 1 argument; use Callable.create(target?, function)");
		}

		const generated::BindingConstructor *matched = nullptr;
		std::vector<godot::Variant> converted;
		std::string first_conversion_error;
		bool accepted_arity = false;
		for (int match_pass = 0; match_pass < 2 && matched == nullptr; ++match_pass) {
			for (std::uint32_t offset = 0; offset < builtin.constructors_count; ++offset) {
				const generated::BindingConstructor &candidate =
						generated::CONSTRUCTORS[builtin.constructors_offset + offset];
				const bool exact_arity =
						candidate.arguments_count == static_cast<std::uint16_t>(argument_count);
				if ((match_pass == 0) != exact_arity ||
						argument_count < candidate.required_arguments_count ||
						argument_count > candidate.arguments_count) {
					continue;
				}
				accepted_arity = true;
				std::vector<godot::Variant> candidate_arguments;
				candidate_arguments.reserve(static_cast<std::size_t>(argument_count));
				bool conversion_ok = true;
				for (int index = 0; index < argument_count; ++index) {
					const generated::BindingArgument &argument =
							generated::ARGUMENTS[candidate.arguments_offset + index];
					godot::Variant converted_argument;
					std::string error;
					if (!binding->to_variant(
								call_context,
								arguments[index],
								argument.type,
								converted_argument,
								error)) {
						binding->clear_exception(call_context);
						if (first_conversion_error.empty()) {
							first_conversion_error =
									"argument " + std::to_string(index) + " ('" +
									argument.name + "') expected " + argument.type +
									"; received " +
									binding->describe_value(call_context, arguments[index]) +
									": " + error;
						}
						conversion_ok = false;
						break;
					}
					candidate_arguments.push_back(std::move(converted_argument));
				}
				if (conversion_ok) {
					matched = &candidate;
					converted = std::move(candidate_arguments);
					break;
				}
			}
		}
		if (!accepted_arity) {
			return JS_ThrowTypeError(
					call_context,
					"%s constructor has no overload accepting %d argument(s)",
					builtin.name,
					argument_count);
		}
		if (matched == nullptr) {
			return JS_ThrowTypeError(
					call_context,
					"%s constructor arguments did not match any overload: %s",
					builtin.name,
					first_conversion_error.c_str());
		}
		godot::Variant result;
		std::string construct_error;
		const godot::Variant::Type target_type =
				static_cast<godot::Variant::Type>(builtin.variant_type);
		if (converted.size() == 1 && converted[0].get_type() == target_type) {
			result = converted[0];
		} else if (!binding->construct_variant(
						   target_type,
						   converted,
						   result,
						   construct_error)) {
			return JS_ThrowTypeError(
					call_context,
					"%s constructor failed: %s",
					builtin.name,
					construct_error.c_str());
		}
		return binding->from_variant(result);
	}

	static JSValue js_property_getter(
			JSContext *call_context,
			JSValueConst this_value,
			int,
			JSValueConst *,
			int,
			JSValueConst *function_data) {
		Impl *binding = from_context(call_context);
		std::uint32_t property_index = 0;
		if (binding == nullptr ||
				!function_data_index(call_context, function_data, property_index) ||
				property_index >= generated::PROPERTIES_COUNT) {
			return JS_ThrowInternalError(call_context, "Generated Godot property state is unavailable");
		}
		const generated::BindingProperty &property = generated::PROPERTIES[property_index];
		WrapperPayload *payload = binding->wrapper_payload(this_value);
		GDExtensionObjectPtr object = binding->validated_object(
				call_context,
				this_value,
				property.name);
		if (payload == nullptr || object == nullptr) {
			return JS_EXCEPTION;
		}
		bool valid = false;
		godot::Variant result = payload->value.get_named(
				godot::StringName(property.name),
				valid);
		if (!valid) {
			return JS_ThrowTypeError(
					call_context,
					"Godot property %s.%s could not be read (expected %s)",
					generated::CLASSES[property.owner_index].name,
					property.name,
					property.type);
		}
		return binding->from_variant(result);
	}

	static JSValue js_property_setter(
			JSContext *call_context,
			JSValueConst this_value,
			int argument_count,
			JSValueConst *arguments,
			int,
			JSValueConst *function_data) {
		Impl *binding = from_context(call_context);
		std::uint32_t property_index = 0;
		if (binding == nullptr || argument_count < 1 ||
				!function_data_index(call_context, function_data, property_index) ||
				property_index >= generated::PROPERTIES_COUNT) {
			return JS_ThrowInternalError(call_context, "Generated Godot property state is unavailable");
		}
		const generated::BindingProperty &property = generated::PROPERTIES[property_index];
		WrapperPayload *payload = binding->wrapper_payload(this_value);
		GDExtensionObjectPtr object = binding->validated_object(
				call_context,
				this_value,
				property.name);
		if (payload == nullptr || object == nullptr) {
			return JS_EXCEPTION;
		}
		godot::Variant converted;
		std::string error;
		if (!binding->to_variant(
					call_context,
					arguments[0],
					property.type,
					converted,
					error)) {
			binding->clear_exception(call_context);
			return JS_ThrowTypeError(
					call_context,
					"Godot property %s.%s expected %s; received %s: %s",
					generated::CLASSES[property.owner_index].name,
					property.name,
					property.type,
					binding->describe_value(call_context, arguments[0]).c_str(),
					error.c_str());
		}
		bool valid = false;
		payload->value.set_named(godot::StringName(property.name), converted, valid);
		if (!valid) {
			return JS_ThrowTypeError(
					call_context,
					"Godot property %s.%s rejected the assigned %s value",
					generated::CLASSES[property.owner_index].name,
					property.name,
					property.type);
		}
		return JS_UNDEFINED;
	}

	static JSValue js_builtin_member_getter(
			JSContext *call_context,
			JSValueConst this_value,
			int,
			JSValueConst *,
			int,
			JSValueConst *function_data) {
		Impl *binding = from_context(call_context);
		std::uint32_t member_index = 0;
		if (binding == nullptr ||
				!function_data_index(call_context, function_data, member_index) ||
				member_index >= generated::BUILTIN_MEMBERS_COUNT) {
			return JS_ThrowInternalError(call_context, "Generated builtin member state is unavailable");
		}
		const generated::BindingBuiltinMember &member =
				generated::BUILTIN_MEMBERS[member_index];
		WrapperPayload *payload = binding->wrapper_payload(this_value);
		if (payload == nullptr || payload->builtin_index != member.owner_index) {
			return JS_ThrowTypeError(
					call_context,
					"Godot builtin member %s.%s requires a %s receiver",
					generated::BUILTINS[member.owner_index].name,
					member.name,
					generated::BUILTINS[member.owner_index].name);
		}
		bool valid = false;
		godot::Variant result = payload->value.get_named(
				godot::StringName(member.name),
				valid);
		if (!valid) {
			return JS_ThrowTypeError(
					call_context,
					"Godot builtin member %s.%s could not be read",
					generated::BUILTINS[member.owner_index].name,
					member.name);
		}
		return binding->from_variant(result);
	}

	static JSValue js_builtin_member_setter(
			JSContext *call_context,
			JSValueConst this_value,
			int argument_count,
			JSValueConst *arguments,
			int,
			JSValueConst *function_data) {
		Impl *binding = from_context(call_context);
		std::uint32_t member_index = 0;
		if (binding == nullptr || argument_count < 1 ||
				!function_data_index(call_context, function_data, member_index) ||
				member_index >= generated::BUILTIN_MEMBERS_COUNT) {
			return JS_ThrowInternalError(call_context, "Generated builtin member state is unavailable");
		}
		const generated::BindingBuiltinMember &member =
				generated::BUILTIN_MEMBERS[member_index];
		WrapperPayload *payload = binding->wrapper_payload(this_value);
		if (payload == nullptr || payload->builtin_index != member.owner_index) {
			return JS_ThrowTypeError(
					call_context,
					"Godot builtin member %s.%s requires a %s receiver",
					generated::BUILTINS[member.owner_index].name,
					member.name,
					generated::BUILTINS[member.owner_index].name);
		}
		godot::Variant converted;
		std::string error;
		if (!binding->to_variant(
					call_context,
					arguments[0],
					member.type,
					converted,
					error)) {
			binding->clear_exception(call_context);
			return JS_ThrowTypeError(
					call_context,
					"Godot builtin member %s.%s expected %s; received %s: %s",
					generated::BUILTINS[member.owner_index].name,
					member.name,
					member.type,
					binding->describe_value(call_context, arguments[0]).c_str(),
					error.c_str());
		}
		bool valid = false;
		payload->value.set_named(godot::StringName(member.name), converted, valid);
		if (!valid) {
			return JS_ThrowTypeError(
					call_context,
					"Godot builtin member %s.%s is read-only or rejected the value",
					generated::BUILTINS[member.owner_index].name,
					member.name);
		}
		return JS_UNDEFINED;
	}

	static bool atom_index(
			JSContext *call_context,
			JSAtom atom,
			std::uint32_t &index) {
		std::size_t length = 0;
		const char *characters = JS_AtomToCStringLen(call_context, &length, atom);
		if (characters == nullptr) {
			return false;
		}
		if (length == 0) {
			JS_FreeCString(call_context, characters);
			return false;
		}
		std::uint64_t converted = 0;
		for (std::size_t offset = 0; offset < length; ++offset) {
			if (characters[offset] < '0' || characters[offset] > '9') {
				JS_FreeCString(call_context, characters);
				return false;
			}
			const std::uint64_t digit =
					static_cast<std::uint64_t>(characters[offset] - '0');
			if (converted >
					(std::numeric_limits<std::uint32_t>::max() - digit) / 10U) {
				JS_FreeCString(call_context, characters);
				return false;
			}
			converted = converted * 10U + digit;
		}
		JS_FreeCString(call_context, characters);
		index = static_cast<std::uint32_t>(converted);
		return true;
	}

	static std::optional<std::string> atom_string(
			JSContext *call_context,
			JSAtom atom) {
		std::size_t length = 0;
		const char *characters = JS_AtomToCStringLen(call_context, &length, atom);
		if (characters == nullptr) {
			return std::nullopt;
		}
		std::string result(characters, length);
		JS_FreeCString(call_context, characters);
		return result;
	}

	static int variant_get_own_property(
			JSContext *call_context,
			JSPropertyDescriptor *descriptor,
			JSValueConst object,
			JSAtom property) {
		Impl *binding = from_context(call_context);
		WrapperPayload *payload = binding == nullptr
				? nullptr
				: binding->wrapper_payload(object);
		if (payload == nullptr || payload->builtin_index >= generated::BUILTINS_COUNT) {
			return 0;
		}
		const generated::BindingBuiltin &builtin =
				generated::BUILTINS[payload->builtin_index];
		godot::Variant result;
		bool found = false;
		std::uint32_t index = 0;
		if (payload->value.get_type() == godot::Variant::DICTIONARY) {
			const std::optional<std::string> key = atom_string(call_context, property);
			if (!key.has_value()) {
				return JS_HasException(call_context) ? -1 : 0;
			}
			const godot::Variant godot_key(godot_string(*key));
			const godot::Dictionary dictionary = payload->value;
			if (dictionary.has(godot_key)) {
				bool valid = false;
				result = payload->value.get_keyed(godot_key, valid);
				found = valid;
			}
		} else if (builtin.indexing_return_type[0] != '\0' &&
				atom_index(call_context, property, index)) {
			bool valid = false;
			bool out_of_bounds = false;
			result = payload->value.get_indexed(
					static_cast<std::int64_t>(index),
					valid,
					out_of_bounds);
			found = valid && !out_of_bounds;
		}
		if (!found) {
			return 0;
		}
		if (descriptor != nullptr) {
			descriptor->flags =
					JS_PROP_ENUMERABLE | JS_PROP_WRITABLE | JS_PROP_CONFIGURABLE;
			descriptor->value = binding->from_variant(result);
			descriptor->getter = JS_UNDEFINED;
			descriptor->setter = JS_UNDEFINED;
			if (JS_IsException(descriptor->value)) {
				return -1;
			}
		}
		return 1;
	}

	static int variant_get_own_property_names(
			JSContext *call_context,
			JSPropertyEnum **property_table,
			std::uint32_t *property_count,
			JSValueConst object) {
		Impl *binding = from_context(call_context);
		WrapperPayload *payload = binding == nullptr
				? nullptr
				: binding->wrapper_payload(object);
		if (payload == nullptr) {
			*property_table = nullptr;
			*property_count = 0;
			return 0;
		}
		std::vector<JSAtom> atoms;
		const generated::BindingBuiltin &builtin =
				generated::BUILTINS[payload->builtin_index];
		if (payload->value.get_type() == godot::Variant::DICTIONARY) {
			const godot::Dictionary dictionary = payload->value;
			const godot::Array keys = dictionary.keys();
			atoms.reserve(static_cast<std::size_t>(keys.size()));
			for (std::int64_t index = 0; index < keys.size(); ++index) {
				if (keys[index].get_type() == godot::Variant::STRING) {
					const std::string key = standard_string(
							static_cast<godot::String>(keys[index]));
					atoms.push_back(JS_NewAtomLen(call_context, key.c_str(), key.size()));
				} else if (keys[index].get_type() == godot::Variant::STRING_NAME) {
					const std::string key = standard_string(static_cast<godot::String>(
							static_cast<godot::StringName>(keys[index])));
					atoms.push_back(JS_NewAtomLen(call_context, key.c_str(), key.size()));
				}
			}
		} else if (builtin.indexing_return_type[0] != '\0') {
			godot::Variant size;
			GDExtensionCallError call_error{};
			payload->value.callp(
					godot::StringName("size"),
					nullptr,
					0,
					size,
					call_error);
			if (call_error.error == GDEXTENSION_CALL_OK) {
				const std::int64_t count = size;
				if (count > 0 &&
						count <= static_cast<std::int64_t>(
										 std::numeric_limits<std::uint32_t>::max())) {
					atoms.reserve(static_cast<std::size_t>(count));
					for (std::uint32_t index = 0; index < static_cast<std::uint32_t>(count); ++index) {
						atoms.push_back(JS_NewAtomUInt32(call_context, index));
					}
				}
			}
		}
		if (atoms.empty()) {
			*property_table = nullptr;
			*property_count = 0;
			return 0;
		}
		auto *result = static_cast<JSPropertyEnum *>(
				js_malloc(call_context, atoms.size() * sizeof(JSPropertyEnum)));
		if (result == nullptr) {
			for (JSAtom atom : atoms) {
				JS_FreeAtom(call_context, atom);
			}
			return -1;
		}
		for (std::size_t index = 0; index < atoms.size(); ++index) {
			result[index].atom = atoms[index];
			result[index].is_enumerable = true;
		}
		*property_table = result;
		*property_count = static_cast<std::uint32_t>(atoms.size());
		return 0;
	}

	static int variant_define_own_property(
			JSContext *call_context,
			JSValueConst object,
			JSAtom property,
			JSValueConst value,
			JSValueConst getter,
			JSValueConst setter,
			int flags) {
		Impl *binding = from_context(call_context);
		WrapperPayload *payload = binding == nullptr
				? nullptr
				: binding->wrapper_payload(object);
		if (payload == nullptr || payload->builtin_index >= generated::BUILTINS_COUNT) {
			return 0;
		}
		const generated::BindingBuiltin &builtin =
				generated::BUILTINS[payload->builtin_index];
		std::uint32_t index = 0;
		const bool keyed = payload->value.get_type() == godot::Variant::DICTIONARY;
		const bool indexed = !keyed && builtin.indexing_return_type[0] != '\0' &&
				atom_index(call_context, property, index);
		if (indexed || keyed) {
			if ((flags & (JS_PROP_HAS_GET | JS_PROP_HAS_SET)) != 0 ||
					!JS_IsUndefined(getter) || !JS_IsUndefined(setter)) {
				JS_ThrowTypeError(
						call_context,
						"Godot indexed and keyed values cannot be JavaScript accessors");
				return -1;
			}
			godot::Variant converted;
			std::string error;
			const std::string expected = indexed
					? std::string(builtin.indexing_return_type)
					: std::string("Variant");
			if (!binding->to_variant(
						call_context,
						value,
						expected,
						converted,
						error)) {
				binding->clear_exception(call_context);
				JS_ThrowTypeError(
						call_context,
						"Godot %s assignment expected %s; received %s: %s",
						indexed ? "indexed" : "keyed",
						expected.c_str(),
						binding->describe_value(call_context, value).c_str(),
						error.c_str());
				return -1;
			}
			if (indexed) {
				bool valid = false;
				bool out_of_bounds = false;
				payload->value.set_indexed(
						static_cast<std::int64_t>(index),
						converted,
						valid,
						out_of_bounds);
				if (!valid || out_of_bounds) {
					JS_ThrowRangeError(
							call_context,
							"Godot %s index %u is out of bounds or read-only",
							builtin.name,
							index);
					return -1;
				}
			} else {
				const std::optional<std::string> key = atom_string(call_context, property);
				if (!key.has_value()) {
					return -1;
				}
				bool valid = false;
				payload->value.set_keyed(
						godot::Variant(godot_string(*key)),
						converted,
						valid);
				if (!valid) {
					JS_ThrowTypeError(
							call_context,
							"Godot Dictionary rejected key '%s'",
							key->c_str());
					return -1;
				}
			}
			return 1;
		}
		return JS_DefineProperty(
				call_context,
				object,
				property,
				value,
				getter,
				setter,
				flags | JS_PROP_NO_EXOTIC);
	}

	static JSValue js_signal_getter(
			JSContext *call_context,
			JSValueConst this_value,
			int,
			JSValueConst *,
			int,
			JSValueConst *function_data) {
		Impl *binding = from_context(call_context);
		std::uint32_t signal_index = 0;
		if (binding == nullptr ||
				!function_data_index(call_context, function_data, signal_index) ||
				signal_index >= generated::SIGNALS_COUNT) {
			return JS_ThrowInternalError(call_context, "Generated Godot signal state is unavailable");
		}
		const generated::BindingSignal &signal = generated::SIGNALS[signal_index];
		GDExtensionObjectPtr object = binding->validated_object(
				call_context,
				this_value,
				signal.name);
		if (object == nullptr) {
			return JS_EXCEPTION;
		}
		WrapperPayload *payload = binding->wrapper_payload(this_value);
		godot::Variant signal_value;
		std::string error;
		if (payload == nullptr ||
				!binding->construct_variant(
						godot::Variant::SIGNAL,
						{ payload->value, godot::StringName(signal.name) },
						signal_value,
						error)) {
			return JS_ThrowInternalError(
					call_context,
					"Could not construct Godot signal %s.%s: %s",
					generated::CLASSES[signal.owner_index].name,
					signal.name,
					error.c_str());
		}
		return binding->from_variant(signal_value);
	}

	static JSValue js_object_free(
			JSContext *call_context,
			JSValueConst this_value,
			int,
			JSValueConst *) {
		Impl *binding = from_context(call_context);
		if (binding == nullptr) {
			return JS_ThrowInternalError(call_context, "Godot binding state is unavailable");
		}
		WrapperPayload *payload = binding->wrapper_payload(this_value);
		GDExtensionObjectPtr object =
				binding->validated_object(call_context, this_value, "Object.free");
		if (object == nullptr || payload == nullptr) {
			return JS_EXCEPTION;
		}
		if (binding->object_is_class(object, "RefCounted")) {
			return JS_ThrowTypeError(
					call_context,
					"Object.free cannot manually destroy RefCounted instance %llu",
					static_cast<unsigned long long>(payload->object_id));
		}
		const std::uint64_t object_id = payload->object_id;
		payload->value.clear();
		godot::internal::gdextension_interface_object_destroy(object);
		const auto cached = binding->object_wrappers.find(object_id);
		if (cached != binding->object_wrappers.end()) {
			JS_FreeValue(call_context, cached->second.weak_reference);
			binding->object_wrappers.erase(cached);
		}
		return JS_UNDEFINED;
	}

	static JSValue js_wrapper_to_string(
			JSContext *call_context,
			JSValueConst this_value,
			int,
			JSValueConst *) {
		Impl *binding = from_context(call_context);
		if (binding == nullptr) {
			return JS_ThrowInternalError(call_context, "Godot binding state is unavailable");
		}
		WrapperPayload *payload = binding->wrapper_payload(this_value);
		if (payload == nullptr) {
			return JS_ThrowTypeError(call_context, "toString requires a Godot wrapper receiver");
		}
		godot::String text;
		switch (payload->value.get_type()) {
			case godot::Variant::STRING_NAME:
				text = static_cast<godot::String>(
						static_cast<godot::StringName>(payload->value));
				break;
			case godot::Variant::NODE_PATH:
				text = static_cast<godot::String>(
						static_cast<godot::NodePath>(payload->value));
				break;
			default:
				text = payload->value.stringify();
				break;
		}
		return javascript_string(call_context, text);
	}

	static JSValue js_callable_create(
			JSContext *call_context,
			JSValueConst,
			int argument_count,
			JSValueConst *arguments) {
		Impl *binding = from_context(call_context);
		if (binding == nullptr) {
			return JS_ThrowInternalError(call_context, "Godot binding state is unavailable");
		}
		JSValueConst target = JS_UNDEFINED;
		JSValueConst function = JS_UNDEFINED;
		std::uint64_t target_object_id = 0;
		if (argument_count == 1 && JS_IsFunction(call_context, arguments[0])) {
			function = arguments[0];
		} else if (argument_count == 2 && JS_IsFunction(call_context, arguments[1])) {
			target = arguments[0];
			function = arguments[1];
			WrapperPayload *target_payload = binding->wrapper_payload(target);
			if (target_payload != nullptr && target_payload->is_object()) {
				if (godot::internal::gdextension_interface_object_get_instance_from_id(
							target_payload->object_id) == nullptr) {
					return JS_ThrowReferenceError(
							call_context,
							"Callable.create target is a freed Godot object");
				}
				target_object_id = target_payload->object_id;
			}
		} else {
			return JS_ThrowTypeError(
					call_context,
					"Callable.create expects (function) or (target, function); received %d argument(s)",
					argument_count);
		}
		std::shared_ptr<CallbackRoot> root = binding->create_callback_root(
				call_context,
				target,
				function,
				target_object_id);
		return binding->from_variant(
				godot::Callable(memnew(JavaScriptCallable(std::move(root)))));
	}

	static JSValue js_signal_as_promise(
			JSContext *call_context,
			JSValueConst this_value,
			int,
			JSValueConst *) {
		Impl *binding = from_context(call_context);
		WrapperPayload *payload = binding == nullptr
				? nullptr
				: binding->wrapper_payload(this_value);
		if (payload == nullptr ||
				payload->value.get_type() != godot::Variant::SIGNAL) {
			return JS_ThrowTypeError(
					call_context,
					"Signal.as_promise requires a Signal receiver");
		}

		JSValue resolving_functions[2] = { JS_UNDEFINED, JS_UNDEFINED };
		ScopedJSValue promise(
				call_context,
				JS_NewPromiseCapability(call_context, resolving_functions));
		ScopedJSValue resolve(call_context, resolving_functions[0]);
		ScopedJSValue reject(call_context, resolving_functions[1]);
		if (JS_IsException(promise.get())) {
			return JS_EXCEPTION;
		}

		std::shared_ptr<CallbackRoot> root = binding->create_callback_root(
				call_context,
				JS_UNDEFINED,
				resolve.get(),
				0);
		// Promise resolve accepts one value, but a zero-argument Godot signal must
		// still be allowed to connect. Extra signal arguments are forwarded and
		// Promise resolution deliberately consumes only the first one.
		root->argument_count = 0;
		godot::Callable callable(memnew(JavaScriptCallable(std::move(root))));
		godot::Signal signal = payload->value;
		const int64_t result = signal.connect(
				callable,
				godot::Object::CONNECT_ONE_SHOT);
		if (result != godot::OK) {
			return JS_ThrowInternalError(
					call_context,
					"Signal.as_promise could not create a one-shot connection (error %lld)",
					static_cast<long long>(result));
		}
		binding->signal_connections.push_back({ signal, callable });
		return promise.release();
	}

	static JSValue js_packed_to_array_buffer(
			JSContext *call_context,
			JSValueConst this_value,
			int,
			JSValueConst *) {
		Impl *binding = from_context(call_context);
		WrapperPayload *payload = binding == nullptr
				? nullptr
				: binding->wrapper_payload(this_value);
		if (payload == nullptr ||
				payload->value.get_type() != godot::Variant::PACKED_BYTE_ARRAY) {
			return JS_ThrowTypeError(
					call_context,
					"PackedByteArray.to_array_buffer requires a PackedByteArray receiver");
		}
		const godot::PackedByteArray bytes = payload->value;
		return JS_NewArrayBufferCopy(
				call_context,
				bytes.ptr(),
				static_cast<std::size_t>(bytes.size()));
	}

	template <typename PackedType, typename ElementType>
	JSValue typed_array_copy(
			JSContext *call_context,
			const godot::Variant &value,
			JSTypedArrayEnum typed_array_type) {
		const PackedType packed = value;
		const std::size_t byte_count =
				static_cast<std::size_t>(packed.size()) * sizeof(ElementType);
		ScopedJSValue buffer(
				call_context,
				JS_NewArrayBufferCopy(
						call_context,
						reinterpret_cast<const std::uint8_t *>(packed.ptr()),
						byte_count));
		if (JS_IsException(buffer.get())) {
			return JS_EXCEPTION;
		}
		JSValueConst arguments[] = { buffer.get() };
		return JS_NewTypedArray(call_context, 1, arguments, typed_array_type);
	}

	JSValue packed_to_typed_array(
			JSContext *call_context,
			const godot::Variant &value) {
		switch (value.get_type()) {
			case godot::Variant::PACKED_BYTE_ARRAY: {
				const godot::PackedByteArray packed = value;
				return JS_NewUint8ArrayCopy(
						call_context,
						packed.ptr(),
						static_cast<std::size_t>(packed.size()));
			}
			case godot::Variant::PACKED_INT32_ARRAY:
				return typed_array_copy<godot::PackedInt32Array, std::int32_t>(
						call_context,
						value,
						JS_TYPED_ARRAY_INT32);
			case godot::Variant::PACKED_INT64_ARRAY:
				return typed_array_copy<godot::PackedInt64Array, std::int64_t>(
						call_context,
						value,
						JS_TYPED_ARRAY_BIG_INT64);
			case godot::Variant::PACKED_FLOAT32_ARRAY:
				return typed_array_copy<godot::PackedFloat32Array, float>(
						call_context,
						value,
						JS_TYPED_ARRAY_FLOAT32);
			case godot::Variant::PACKED_FLOAT64_ARRAY:
				return typed_array_copy<godot::PackedFloat64Array, double>(
						call_context,
						value,
						JS_TYPED_ARRAY_FLOAT64);
			default:
				break;
		}

		godot::Variant elements_variant;
		std::string error;
		if (!construct_variant(
					godot::Variant::ARRAY,
					std::vector<godot::Variant>{ value },
					elements_variant,
					error)) {
			return JS_ThrowTypeError(
					call_context,
					"Packed array copy conversion failed: %s",
					error.c_str());
		}
		const godot::Array elements = elements_variant;
		JSValue result = JS_NewArray(call_context);
		if (JS_IsException(result)) {
			return result;
		}
		for (std::int64_t index = 0; index < elements.size(); ++index) {
			if (JS_SetPropertyUint32(
						call_context,
						result,
						static_cast<std::uint32_t>(index),
						from_variant(elements[index])) < 0) {
				JS_FreeValue(call_context, result);
				return JS_EXCEPTION;
			}
		}
		return result;
	}

	static JSValue js_packed_to_typed_array(
			JSContext *call_context,
			JSValueConst this_value,
			int,
			JSValueConst *) {
		Impl *binding = from_context(call_context);
		WrapperPayload *payload = binding == nullptr
				? nullptr
				: binding->wrapper_payload(this_value);
		if (payload == nullptr || !is_packed_variant_type(payload->value.get_type())) {
			return JS_ThrowTypeError(
					call_context,
					"toTypedArray requires a packed Godot array receiver");
		}
		return binding->packed_to_typed_array(call_context, payload->value);
	}

	static JSValue js_class_is_instance(
			JSContext *call_context,
			JSValueConst,
			int argument_count,
			JSValueConst *arguments,
			int,
			JSValueConst *function_data) {
		Impl *binding = from_context(call_context);
		std::uint32_t class_index = 0;
		if (binding == nullptr || argument_count < 1 ||
				!function_data_index(call_context, function_data, class_index) ||
				class_index >= generated::CLASSES_COUNT) {
			return JS_NewBool(call_context, false);
		}
		WrapperPayload *payload = binding->wrapper_payload(arguments[0]);
		GDExtensionObjectPtr object = payload == nullptr || !payload->is_object()
				? nullptr
				: godot::internal::gdextension_interface_object_get_instance_from_id(
						  payload->object_id);
		return JS_NewBool(
				call_context,
				object != nullptr &&
						binding->object_is_class(
								object,
								generated::CLASSES[class_index].name));
	}

	static JSValue js_builtin_is_instance(
			JSContext *call_context,
			JSValueConst,
			int argument_count,
			JSValueConst *arguments,
			int,
			JSValueConst *function_data) {
		Impl *binding = from_context(call_context);
		std::uint32_t builtin_index = 0;
		if (binding == nullptr || argument_count < 1 ||
				!function_data_index(call_context, function_data, builtin_index)) {
			return JS_NewBool(call_context, false);
		}
		WrapperPayload *payload = binding->wrapper_payload(arguments[0]);
		return JS_NewBool(
				call_context,
				payload != nullptr && payload->builtin_index == builtin_index);
	}

	JSValue indexed_function(
			JSCFunctionData *callback,
			const char *name,
			int length,
			std::uint32_t index) const {
		ScopedJSValue data(context, JS_NewInt64(context, index));
		if (JS_IsException(data.get())) {
			return JS_EXCEPTION;
		}
		JSValueConst function_data[] = { data.get() };
		return JS_NewCFunctionData2(
				context,
				callback,
				name,
				length,
				0,
				1,
				function_data);
	}

	bool define_data_function(
			JSValueConst target,
			const char *name,
			JSCFunctionData *callback,
			int length,
			std::uint32_t index) const {
		return JS_SetPropertyStr(
					   context,
					   target,
					   name,
					   indexed_function(callback, name, length, index)) >= 0;
	}

	bool define_indexed_accessor(
			JSValueConst prototype,
			const char *name,
			JSCFunctionData *getter_callback,
			JSCFunctionData *setter_callback,
			std::uint32_t index) const {
		ScopedJSValue getter(
				context,
				indexed_function(getter_callback, name, 0, index));
		ScopedJSValue setter(
				context,
				setter_callback == nullptr
						? JS_UNDEFINED
						: indexed_function(setter_callback, name, 1, index));
		if (JS_IsException(getter.get()) || JS_IsException(setter.get())) {
			return false;
		}
		const JSAtom atom = JS_NewAtom(context, name);
		if (atom == JS_ATOM_NULL) {
			return false;
		}
		const int status = JS_DefinePropertyGetSet(
				context,
				prototype,
				atom,
				getter.release(),
				setter.release(),
				JS_PROP_ENUMERABLE | JS_PROP_CONFIGURABLE);
		JS_FreeAtom(context, atom);
		return status >= 0;
	}

	JSValue enum_object(const generated::BindingEnum &binding_enum) const {
		JSValue object = JS_NewObject(context);
		if (JS_IsException(object)) {
			return object;
		}
		for (std::uint32_t offset = 0; offset < binding_enum.values_count; ++offset) {
			const generated::BindingEnumValue &value =
					generated::ENUM_VALUES[binding_enum.values_offset + offset];
			if (JS_SetPropertyStr(
						context,
						object,
						value.name,
						javascript_integer(context, value.value)) < 0) {
				JS_FreeValue(context, object);
				return JS_EXCEPTION;
			}
		}
		if (JS_FreezeObject(context, object) < 0) {
			JS_FreeValue(context, object);
			return JS_EXCEPTION;
		}
		return object;
	}

	bool define_enums(
			JSValueConst target,
			std::uint32_t enums_offset,
			std::uint32_t enums_count) const {
		for (std::uint32_t offset = 0; offset < enums_count; ++offset) {
			const generated::BindingEnum &binding_enum =
					generated::ENUMS[enums_offset + offset];
			std::string name(binding_enum.name);
			const std::size_t separator = name.rfind('.');
			if (separator != std::string::npos) {
				name = name.substr(separator + 1);
			}
			if (JS_SetPropertyStr(
						context,
						target,
						name.c_str(),
						enum_object(binding_enum)) < 0) {
				return false;
			}
		}
		return true;
	}

	bool build_class(std::uint32_t class_index, std::vector<bool> &building) {
		if (!JS_IsUndefined(class_prototypes[class_index])) {
			return true;
		}
		if (building[class_index]) {
			JS_ThrowInternalError(
					context,
					"Generated Godot class inheritance contains a cycle at %s",
					generated::CLASSES[class_index].name);
			return false;
		}
		building[class_index] = true;
		const generated::BindingClass &binding_class = generated::CLASSES[class_index];
		JSValue parent_prototype = JS_NULL;
		if (binding_class.inherits != nullptr && binding_class.inherits[0] != '\0') {
			const auto parent = class_index_by_name.find(binding_class.inherits);
			if (parent == class_index_by_name.end() || !build_class(parent->second, building)) {
				return false;
			}
			parent_prototype = class_prototypes[parent->second];
		}
		ScopedJSValue prototype(context, JS_NewObjectProto(context, parent_prototype));
		if (JS_IsException(prototype.get())) {
			return false;
		}
		for (std::uint32_t offset = 0; offset < binding_class.methods_count; ++offset) {
			const std::uint32_t method_index = binding_class.methods_offset + offset;
			const generated::BindingMethod &method = generated::METHODS[method_index];
			if ((method.flags & METHOD_STATIC) == 0 &&
					!define_data_function(
							prototype.get(),
							method.name,
							js_method,
							method.required_arguments_count,
							method_index)) {
				return false;
			}
		}
		for (std::uint32_t offset = 0; offset < binding_class.properties_count; ++offset) {
			const std::uint32_t property_index = binding_class.properties_offset + offset;
			const generated::BindingProperty &property = generated::PROPERTIES[property_index];
			if (!define_indexed_accessor(
						prototype.get(),
						property.name,
						js_property_getter,
						property.setter != nullptr && property.setter[0] != '\0'
								? js_property_setter
								: nullptr,
						property_index)) {
				return false;
			}
		}
		for (std::uint32_t offset = 0; offset < binding_class.signals_count; ++offset) {
			const std::uint32_t signal_index = binding_class.signals_offset + offset;
			const generated::BindingSignal &signal = generated::SIGNALS[signal_index];
			if (!define_indexed_accessor(
						prototype.get(),
						signal.name,
						js_signal_getter,
						nullptr,
						signal_index)) {
				return false;
			}
		}
		if (std::strcmp(binding_class.name, "Object") == 0) {
			if (JS_SetPropertyStr(
						context,
						prototype.get(),
						"free",
						JS_NewCFunction(context, js_object_free, "free", 0)) < 0) {
				return false;
			}
		}
		if (JS_SetPropertyStr(
					context,
					prototype.get(),
					"toString",
					JS_NewCFunction(context, js_wrapper_to_string, "toString", 0)) < 0) {
			return false;
		}

		ScopedJSValue constructor(
				context,
				indexed_function(
						js_class_constructor,
						binding_class.name,
						0,
						class_index));
		if (JS_IsException(constructor.get())) {
			return false;
		}
		if (!define_data_function(
					constructor.get(),
					"is_instance",
					js_class_is_instance,
					1,
					class_index)) {
			return false;
		}
		for (std::uint32_t offset = 0; offset < binding_class.methods_count; ++offset) {
			const std::uint32_t method_index = binding_class.methods_offset + offset;
			const generated::BindingMethod &method = generated::METHODS[method_index];
			if ((method.flags & METHOD_STATIC) != 0 &&
					!define_data_function(
							constructor.get(),
							method.name,
							js_method,
							method.required_arguments_count,
							method_index)) {
				return false;
			}
		}
		for (std::uint32_t offset = 0; offset < binding_class.constants_count; ++offset) {
			const generated::BindingConstant &constant =
					generated::CONSTANTS[binding_class.constants_offset + offset];
			if (JS_SetPropertyStr(
						context,
						constructor.get(),
						constant.name,
						javascript_integer(context, constant.value)) < 0) {
				return false;
			}
		}
		if (!define_enums(
					constructor.get(),
					binding_class.enums_offset,
					binding_class.enums_count)) {
			return false;
		}
		if (JS_SetConstructor(context, constructor.get(), prototype.get()) < 0) {
			return false;
		}
		if (!JS_SetConstructorBit(context, constructor.get(), true)) {
			JS_ThrowInternalError(
					context,
					"QuickJS-ng could not mark %s as a constructor",
					binding_class.name);
			return false;
		}
		class_prototypes[class_index] = prototype.release();
		class_constructors[class_index] = constructor.release();
		building[class_index] = false;
		return true;
	}

	bool build_builtin(std::uint32_t builtin_index) {
		const generated::BindingBuiltin &builtin = generated::BUILTINS[builtin_index];
		ScopedJSValue prototype(context, JS_NewObject(context));
		if (JS_IsException(prototype.get())) {
			return false;
		}
		for (std::uint32_t offset = 0; offset < builtin.methods_count; ++offset) {
			const std::uint32_t method_index = builtin.methods_offset + offset;
			const generated::BindingMethod &method = generated::METHODS[method_index];
			if ((method.flags & METHOD_STATIC) == 0 &&
					!define_data_function(
							prototype.get(),
							method.name,
							js_method,
							method.required_arguments_count,
							method_index)) {
				return false;
			}
		}
		for (std::uint32_t offset = 0; offset < builtin.members_count; ++offset) {
			const std::uint32_t member_index = builtin.members_offset + offset;
			const generated::BindingBuiltinMember &member =
					generated::BUILTIN_MEMBERS[member_index];
			if (!define_indexed_accessor(
						prototype.get(),
						member.name,
						js_builtin_member_getter,
						js_builtin_member_setter,
						member_index)) {
				return false;
			}
		}
		if (JS_SetPropertyStr(
					context,
					prototype.get(),
					"toString",
					JS_NewCFunction(context, js_wrapper_to_string, "toString", 0)) < 0) {
			return false;
		}
		if (is_packed_variant_type(
					static_cast<godot::Variant::Type>(builtin.variant_type))) {
			if (JS_SetPropertyStr(
						context,
						prototype.get(),
						"toTypedArray",
						JS_NewCFunction(
								context,
								js_packed_to_typed_array,
								"toTypedArray",
								0)) < 0) {
				return false;
			}
		}
		if (std::strcmp(builtin.name, "PackedByteArray") == 0 &&
				JS_SetPropertyStr(
						context,
						prototype.get(),
						"to_array_buffer",
						JS_NewCFunction(
								context,
								js_packed_to_array_buffer,
								"to_array_buffer",
								0)) < 0) {
			return false;
		}
		if (std::strcmp(builtin.name, "Signal") == 0 &&
				JS_SetPropertyStr(
						context,
						prototype.get(),
						"as_promise",
						JS_NewCFunction(
								context,
								js_signal_as_promise,
								"as_promise",
								0)) < 0) {
			return false;
		}

		ScopedJSValue constructor(
				context,
				indexed_function(
						js_builtin_constructor,
						builtin.name,
						0,
						builtin_index));
		if (JS_IsException(constructor.get())) {
			return false;
		}
		if (!define_data_function(
					constructor.get(),
					"is_instance",
					js_builtin_is_instance,
					1,
					builtin_index)) {
			return false;
		}
		for (std::uint32_t offset = 0; offset < builtin.methods_count; ++offset) {
			const std::uint32_t method_index = builtin.methods_offset + offset;
			const generated::BindingMethod &method = generated::METHODS[method_index];
			if ((method.flags & METHOD_STATIC) != 0 &&
					!define_data_function(
							constructor.get(),
							method.name,
							js_method,
							method.required_arguments_count,
							method_index)) {
				return false;
			}
		}
		if (std::strcmp(builtin.name, "Callable") == 0 &&
				JS_SetPropertyStr(
						context,
						constructor.get(),
						"create",
						JS_NewCFunction(
								context,
								js_callable_create,
								"create",
								2)) < 0) {
			return false;
		}
		for (std::uint32_t offset = 0; offset < builtin.constants_count; ++offset) {
			const generated::BindingBuiltinConstant &constant =
					generated::BUILTIN_CONSTANTS[builtin.constants_offset + offset];
			godot::Variant value;
			godot::StringName constant_name(constant.name);
			godot::internal::gdextension_interface_variant_get_constant_value(
					static_cast<GDExtensionVariantType>(builtin.variant_type),
					constant_name._native_ptr(),
					value._native_ptr());
			if (JS_SetPropertyStr(
						context,
						constructor.get(),
						constant.name,
						from_variant(value)) < 0) {
				return false;
			}
		}
		if (!define_enums(
					constructor.get(),
					builtin.enums_offset,
					builtin.enums_count)) {
			return false;
		}
		if (JS_SetConstructor(context, constructor.get(), prototype.get()) < 0) {
			return false;
		}
		if (!JS_SetConstructorBit(context, constructor.get(), true)) {
			JS_ThrowInternalError(
					context,
					"QuickJS-ng could not mark %s as a constructor",
					builtin.name);
			return false;
		}
		JS_SetClassProto(
				context,
				builtin_class_ids[builtin_index],
				JS_DupValue(context, prototype.get()));
		builtin_prototypes[builtin_index] = prototype.release();
		builtin_constructors[builtin_index] = constructor.release();
		return true;
	}

	bool is_editor_runtime() {
		if (editor_hint_cache.has_value()) {
			return *editor_hint_cache;
		}
		godot::StringName engine_name("Engine");
		GDExtensionObjectPtr owner =
				godot::internal::gdextension_interface_global_get_singleton(
						engine_name._native_ptr());
		if (owner == nullptr) {
			editor_hint_cache = false;
			return false;
		}
		godot::Variant engine = object_variant(owner);
		godot::Variant result;
		GDExtensionCallError call_error{};
		engine.callp(
				godot::StringName("is_editor_hint"),
				nullptr,
				0,
				result,
				call_error);
		editor_hint_cache = call_error.error == GDEXTENSION_CALL_OK &&
				static_cast<bool>(result);
		return *editor_hint_cache;
	}

	JSValue singleton_object(std::uint32_t singleton_index) {
		const generated::BindingSingleton &singleton = generated::SINGLETONS[singleton_index];
		if (singleton.class_index >= 0 &&
				std::strcmp(
						generated::CLASSES[singleton.class_index].api_type,
						"editor") == 0 &&
				!is_editor_runtime()) {
			return JS_NULL;
		}
		godot::StringName singleton_name(singleton.name);
		GDExtensionObjectPtr owner =
				godot::internal::gdextension_interface_global_get_singleton(
						singleton_name._native_ptr());
		if (owner == nullptr) {
			return JS_ThrowInternalError(
					context,
					"Godot singleton %s is unavailable",
					singleton.name);
		}
		JSValue wrapper = wrap_object(object_variant(owner));
		if (JS_IsException(wrapper) || singleton.class_index < 0 ||
				singleton.class_index >= static_cast<std::int32_t>(class_constructors.size())) {
			return wrapper;
		}
		const generated::BindingClass &binding_class =
				generated::CLASSES[singleton.class_index];
		JSValue constructor = class_constructors[singleton.class_index];
		for (std::uint32_t offset = 0; offset < binding_class.constants_count; ++offset) {
			const generated::BindingConstant &constant =
					generated::CONSTANTS[binding_class.constants_offset + offset];
			ScopedJSValue value(context, JS_GetPropertyStr(context, constructor, constant.name));
			if (JS_IsException(value.get()) ||
					JS_SetPropertyStr(
							context,
							wrapper,
							constant.name,
							value.release()) < 0) {
				JS_FreeValue(context, wrapper);
				return JS_EXCEPTION;
			}
		}
		for (std::uint32_t offset = 0; offset < binding_class.enums_count; ++offset) {
			const generated::BindingEnum &binding_enum =
					generated::ENUMS[binding_class.enums_offset + offset];
			std::string enum_name(binding_enum.name);
			const std::size_t separator = enum_name.rfind('.');
			if (separator != std::string::npos) {
				enum_name = enum_name.substr(separator + 1);
			}
			ScopedJSValue value(
					context,
					JS_GetPropertyStr(context, constructor, enum_name.c_str()));
			if (JS_IsException(value.get()) ||
					JS_SetPropertyStr(
							context,
							wrapper,
							enum_name.c_str(),
							value.release()) < 0) {
				JS_FreeValue(context, wrapper);
				return JS_EXCEPTION;
			}
		}
		return wrapper;
	}

	JSValue variant_namespace() const {
		JSValue object = JS_NewObject(context);
		if (JS_IsException(object)) {
			return object;
		}
		for (std::uint32_t index = generated::GLOBAL_ENUMS_OFFSET;
				index < generated::ENUMS_COUNT;
				++index) {
			const generated::BindingEnum &binding_enum = generated::ENUMS[index];
			const std::string name(binding_enum.name);
			if (!starts_with(name, "Variant.")) {
				continue;
			}
			if (JS_SetPropertyStr(
						context,
						object,
						name.substr(std::strlen("Variant.")).c_str(),
						enum_object(binding_enum)) < 0) {
				JS_FreeValue(context, object);
				return JS_EXCEPTION;
			}
		}
		if (JS_FreezeObject(context, object) < 0) {
			JS_FreeValue(context, object);
			return JS_EXCEPTION;
		}
		return object;
	}

	bool create_module_object() {
		ScopedJSValue object(context, JS_NewObject(context));
		if (JS_IsException(object.get())) {
			return false;
		}
		for (std::uint32_t index = 0; index < generated::EXPORTS_COUNT; ++index) {
			const generated::BindingExport &binding_export = generated::EXPORTS[index];
			JSValue value = JS_UNDEFINED;
			switch (binding_export.kind) {
				case generated::BindingExportKind::CLASS:
					value = JS_DupValue(context, class_constructors[binding_export.index]);
					break;
				case generated::BindingExportKind::SINGLETON:
					value = singleton_object(binding_export.index);
					break;
				case generated::BindingExportKind::BUILTIN:
					value = JS_DupValue(context, builtin_constructors[binding_export.index]);
					break;
				case generated::BindingExportKind::UTILITY: {
					const generated::BindingUtility &utility =
							generated::UTILITIES[binding_export.index];
					const generated::BindingMethod &method =
							generated::METHODS[utility.method_index];
					value = indexed_function(
							js_utility,
							utility.name,
							method.required_arguments_count,
							binding_export.index);
					break;
				}
				case generated::BindingExportKind::GLOBAL_ENUM:
					value = enum_object(generated::ENUMS[binding_export.index]);
					break;
				case generated::BindingExportKind::ENUM_NAMESPACE:
					value = variant_namespace();
					break;
			}
			if (JS_IsException(value) ||
					JS_SetPropertyStr(
							context,
							object.get(),
							binding_export.name,
							value) < 0) {
				if (!JS_IsException(value)) {
					JS_FreeValue(context, value);
				}
				return false;
			}
		}
		module_object = object.release();
		return true;
	}

	bool install(JSContext *install_context, std::string &error) {
		if (installed) {
			error = "Godot binding was installed more than once";
			return false;
		}
		context = install_context;
		runtime = JS_GetRuntime(context);
		owner_thread = std::this_thread::get_id();
		shutting_down = false;
		editor_hint_cache.reset();
		register_context(context, this);

		ScopedJSValue global(context, JS_GetGlobalObject(context));
		weak_reference_constructor = JS_GetPropertyStr(context, global.get(), "WeakRef");
		if (JS_IsException(global.get()) || JS_IsException(weak_reference_constructor) ||
				!JS_IsFunction(context, weak_reference_constructor)) {
			error = "QuickJS-ng WeakRef support is required for stable Godot object identity";
			clear_exception(context);
			return false;
		}

		object_class_id = JS_NewClassID(runtime, &object_class_id);
		JSClassDef object_class_definition{};
		object_class_definition.class_name = "GodotObject";
		object_class_definition.finalizer = object_finalizer;
		if (JS_NewClass(runtime, object_class_id, &object_class_definition) < 0) {
			error = "QuickJS-ng could not register the Godot Object wrapper class";
			return false;
		}

		builtin_class_ids.resize(generated::BUILTINS_COUNT);
		class_prototypes.assign(generated::CLASSES_COUNT, JS_UNDEFINED);
		class_constructors.assign(generated::CLASSES_COUNT, JS_UNDEFINED);
		builtin_prototypes.assign(generated::BUILTINS_COUNT, JS_UNDEFINED);
		builtin_constructors.assign(generated::BUILTINS_COUNT, JS_UNDEFINED);
		for (std::uint32_t index = 0; index < generated::BUILTINS_COUNT; ++index) {
			JSClassID class_id = 0;
			class_id = JS_NewClassID(runtime, &class_id);
			static JSClassExoticMethods variant_exotic_methods{
				variant_get_own_property,
				variant_get_own_property_names,
				nullptr,
				variant_define_own_property,
				nullptr,
				nullptr,
				nullptr,
			};
			JSClassDef variant_class{};
			variant_class.class_name = "GodotVariant";
			variant_class.finalizer = variant_finalizer;
			variant_class.exotic = &variant_exotic_methods;
			if (JS_NewClass(runtime, class_id, &variant_class) < 0) {
				error = "QuickJS-ng could not register a Godot Variant wrapper class";
				return false;
			}
			builtin_class_ids[index] = class_id;
			builtin_index_by_class_id.emplace(class_id, index);
		}

		std::vector<bool> building(generated::CLASSES_COUNT, false);
		for (std::uint32_t index = 0; index < generated::CLASSES_COUNT; ++index) {
			if (!build_class(index, building)) {
				error = "Could not build generated Godot class " +
						std::string(generated::CLASSES[index].name) + ": " +
						exception_text(context);
				return false;
			}
		}
		const auto object_class = class_index_by_name.find("Object");
		if (object_class == class_index_by_name.end()) {
			error = "Generated Godot metadata does not contain Object";
			return false;
		}
		JS_SetClassProto(
				context,
				object_class_id,
				JS_DupValue(context, class_prototypes[object_class->second]));

		for (std::uint32_t index = 0; index < generated::BUILTINS_COUNT; ++index) {
			if (!build_builtin(index)) {
				error = "Could not build generated Godot builtin " +
						std::string(generated::BUILTINS[index].name) + ": " +
						exception_text(context);
				return false;
			}
		}
		if (!create_module_object()) {
			error = "Could not construct the generated godot module: " +
					exception_text(context);
			return false;
		}
		installed = true;
		return true;
	}

	static int es_module_init(JSContext *module_context, JSModuleDef *module) {
		Impl *binding = from_context(module_context);
		if (binding == nullptr || JS_IsUndefined(binding->module_object)) {
			JS_ThrowInternalError(module_context, "Godot module state is unavailable");
			return -1;
		}
		for (std::uint32_t index = 0; index < generated::EXPORTS_COUNT; ++index) {
			const char *name = generated::EXPORTS[index].name;
			JSValue value = JS_GetPropertyStr(module_context, binding->module_object, name);
			if (JS_IsException(value) ||
					JS_SetModuleExport(module_context, module, name, value) < 0) {
				if (!JS_IsException(value)) {
					JS_FreeValue(module_context, value);
				}
				return -1;
			}
		}
		return 0;
	}

	JSModuleDef *load_es_module(JSContext *module_context) {
		JSModuleDef *module = JS_NewCModule(module_context, "godot", es_module_init);
		if (module == nullptr) {
			return nullptr;
		}
		for (std::uint32_t index = 0; index < generated::EXPORTS_COUNT; ++index) {
			if (JS_AddModuleExport(
						module_context,
						module,
						generated::EXPORTS[index].name) < 0) {
				return nullptr;
			}
		}
		return module;
	}

	void callback_destroyed(const std::shared_ptr<CallbackRoot> &root) {
		if (root == nullptr || !root->active) {
			return;
		}
		if (in_wrapper_finalizer) {
			deferred_callback_releases.push_back(root);
			return;
		}
		root->release(context);
	}

	void after_garbage_collection() noexcept {
		if (context == nullptr) {
			return;
		}
		for (const DeferredObjectEntry &entry : deferred_object_entries) {
			const auto iterator = object_wrappers.find(entry.object_id);
			if (iterator != object_wrappers.end() &&
					iterator->second.serial == entry.serial) {
				JS_FreeValue(context, iterator->second.weak_reference);
				object_wrappers.erase(iterator);
			}
		}
		deferred_object_entries.clear();
		prune_signal_connections();
		for (auto iterator = container_wrappers.begin();
				iterator != container_wrappers.end();) {
			ScopedJSValue existing(
					context,
					dereference_weak_reference(iterator->weak_reference));
			if (JS_IsException(existing.get())) {
				clear_exception(context);
				++iterator;
				continue;
			}
			if (JS_IsUndefined(existing.get())) {
				JS_FreeValue(context, iterator->weak_reference);
				iterator = container_wrappers.erase(iterator);
			} else {
				++iterator;
			}
		}
		for (const std::shared_ptr<CallbackRoot> &root : deferred_callback_releases) {
			root->release(context);
		}
		deferred_callback_releases.clear();
		callback_roots.erase(
				std::remove_if(
						callback_roots.begin(),
						callback_roots.end(),
						[](const std::weak_ptr<CallbackRoot> &root) {
							const std::shared_ptr<CallbackRoot> locked = root.lock();
							return locked == nullptr || !locked->active;
						}),
				callback_roots.end());
	}

	void shutdown(JSContext *shutdown_context) noexcept {
		if (context == nullptr) {
			return;
		}
		shutting_down = true;
		disconnect_signal_connections();
		for (const std::weak_ptr<CallbackRoot> &weak_root : callback_roots) {
			const std::shared_ptr<CallbackRoot> root = weak_root.lock();
			if (root != nullptr) {
				root->release(shutdown_context);
			}
		}
		callback_roots.clear();
		for (const std::shared_ptr<CallbackRoot> &root : deferred_callback_releases) {
			root->release(shutdown_context);
		}
		deferred_callback_releases.clear();
		for (auto &entry : object_wrappers) {
			JS_FreeValue(shutdown_context, entry.second.weak_reference);
		}
		object_wrappers.clear();
		for (WeakContainerEntry &entry : container_wrappers) {
			JS_FreeValue(shutdown_context, entry.weak_reference);
		}
		container_wrappers.clear();
		deferred_object_entries.clear();

		JS_FreeValue(shutdown_context, module_object);
		module_object = JS_UNDEFINED;
		for (JSValue &value : class_constructors) {
			JS_FreeValue(shutdown_context, value);
			value = JS_UNDEFINED;
		}
		for (JSValue &value : class_prototypes) {
			JS_FreeValue(shutdown_context, value);
			value = JS_UNDEFINED;
		}
		for (JSValue &value : builtin_constructors) {
			JS_FreeValue(shutdown_context, value);
			value = JS_UNDEFINED;
		}
		for (JSValue &value : builtin_prototypes) {
			JS_FreeValue(shutdown_context, value);
			value = JS_UNDEFINED;
		}
		JS_FreeValue(shutdown_context, weak_reference_constructor);
		weak_reference_constructor = JS_UNDEFINED;
		unregister_context(context);
		context = nullptr;
		runtime = nullptr;
		installed = false;
	}
};

std::mutex GodotBinding::Impl::context_bindings_mutex;
std::unordered_map<JSContext *, GodotBinding::Impl *>
		GodotBinding::Impl::context_bindings;

GodotBinding::Impl::JavaScriptCallable::~JavaScriptCallable() {
	if (root != nullptr && root->binding != nullptr) {
		root->binding->callback_destroyed(root);
	}
}

std::uint32_t GodotBinding::Impl::JavaScriptCallable::hash() const {
	const std::uint64_t serial = root == nullptr ? 0 : root->serial;
	return static_cast<std::uint32_t>(serial ^ (serial >> 32U));
}

godot::String GodotBinding::Impl::JavaScriptCallable::get_as_text() const {
	return godot::String("JavaScriptCallable#") +
			godot::String::num_int64(root == nullptr ? 0 : root->serial);
}

godot::CallableCustom::CompareEqualFunc
GodotBinding::Impl::JavaScriptCallable::get_compare_equal_func() const {
	return equal;
}

godot::CallableCustom::CompareLessFunc
GodotBinding::Impl::JavaScriptCallable::get_compare_less_func() const {
	return less;
}

bool GodotBinding::Impl::JavaScriptCallable::is_valid() const {
	return root != nullptr && root->active && root->binding != nullptr &&
			root->binding->context != nullptr &&
			(root->target_object_id == 0 ||
					godot::internal::gdextension_interface_object_get_instance_from_id(
							root->target_object_id) != nullptr);
}

godot::ObjectID GodotBinding::Impl::JavaScriptCallable::get_object() const {
	return godot::ObjectID(root == nullptr ? 0 : root->target_object_id);
}

int GodotBinding::Impl::JavaScriptCallable::get_argument_count(bool &valid) const {
	valid = root != nullptr && root->active;
	return root == nullptr ? 0 : root->argument_count;
}

void GodotBinding::Impl::JavaScriptCallable::call(
		const godot::Variant **arguments,
		int argument_count,
		godot::Variant &return_value,
		GDExtensionCallError &call_error) const {
	call_error = {};
	if (!is_valid()) {
		call_error.error = GDEXTENSION_CALL_ERROR_INSTANCE_IS_NULL;
		return;
	}
	Impl *binding = root->binding;
	if (std::this_thread::get_id() != binding->owner_thread) {
		binding->console_sink.write(
				{ ConsoleLevel::ERROR,
						"<godot-callback>",
						"Rejected JavaScript callback on a thread other than its owning runtime thread" });
		call_error.error = GDEXTENSION_CALL_ERROR_INVALID_METHOD;
		return;
	}
	std::vector<JSValue> javascript_arguments;
	javascript_arguments.reserve(static_cast<std::size_t>(argument_count));
	for (int index = 0; index < argument_count; ++index) {
		JSValue converted = binding->from_variant(*arguments[index]);
		if (JS_IsException(converted)) {
			for (JSValue value : javascript_arguments) {
				JS_FreeValue(binding->context, value);
			}
			const std::string message = binding->exception_text(binding->context);
			binding->console_sink.write(
					{ ConsoleLevel::ERROR,
							"<godot-callback>",
							"Could not convert callback argument " + std::to_string(index) +
									": " + message });
			call_error.error = GDEXTENSION_CALL_ERROR_INVALID_ARGUMENT;
			call_error.argument = index;
			return;
		}
		javascript_arguments.push_back(converted);
	}
	ScopedJSValue result(
			binding->context,
			JS_Call(
					binding->context,
					root->function,
					root->target,
					argument_count,
					javascript_arguments.data()));
	for (JSValue value : javascript_arguments) {
		JS_FreeValue(binding->context, value);
	}
	if (JS_IsException(result.get())) {
		const std::string message = binding->exception_text(binding->context);
		binding->console_sink.write(
				{ ConsoleLevel::ERROR,
						"<godot-callback>",
						"JavaScript exception crossed a Godot callback boundary: " + message });
		call_error.error = GDEXTENSION_CALL_ERROR_INVALID_METHOD;
		return;
	}
	std::string conversion_error;
	if (!binding->to_variant(
				binding->context,
				result.get(),
				"Variant",
				return_value,
				conversion_error)) {
		binding->clear_exception(binding->context);
		binding->console_sink.write(
				{ ConsoleLevel::ERROR,
						"<godot-callback>",
						"Could not convert JavaScript callback result to Variant: " +
								conversion_error });
		call_error.error = GDEXTENSION_CALL_ERROR_INVALID_ARGUMENT;
		call_error.argument = -1;
	}
}

bool GodotBinding::Impl::JavaScriptCallable::equal(
		const godot::CallableCustom *left,
		const godot::CallableCustom *right) {
	const auto *left_callable = static_cast<const JavaScriptCallable *>(left);
	const auto *right_callable = static_cast<const JavaScriptCallable *>(right);
	return left_callable->root != nullptr && right_callable->root != nullptr &&
			left_callable->root->serial == right_callable->root->serial;
}

bool GodotBinding::Impl::JavaScriptCallable::less(
		const godot::CallableCustom *left,
		const godot::CallableCustom *right) {
	const auto *left_callable = static_cast<const JavaScriptCallable *>(left);
	const auto *right_callable = static_cast<const JavaScriptCallable *>(right);
	const std::uint64_t left_serial = left_callable->root == nullptr
			? 0
			: left_callable->root->serial;
	const std::uint64_t right_serial = right_callable->root == nullptr
			? 0
			: right_callable->root->serial;
	return left_serial < right_serial;
}

GodotBinding::GodotBinding(ConsoleSink &console_sink) :
		impl(std::make_unique<Impl>(console_sink)) {
}

GodotBinding::~GodotBinding() = default;

bool GodotBinding::supports_module(const std::string &specifier) const noexcept {
	return specifier == "godot";
}

bool GodotBinding::install(JSContext *context, std::string &error) {
	return impl->install(context, error);
}

JSModuleDef *GodotBinding::load_es_module(
		JSContext *context,
		const std::string &specifier) {
	if (specifier != "godot") {
		JS_ThrowReferenceError(context, "Unknown Godot binding module '%s'", specifier.c_str());
		return nullptr;
	}
	return impl->load_es_module(context);
}

JSValue GodotBinding::load_commonjs_module(
		JSContext *context,
		const std::string &specifier) {
	if (specifier != "godot") {
		return JS_ThrowReferenceError(
				context,
				"Unknown Godot binding module '%s'",
				specifier.c_str());
	}
	return JS_DupValue(context, impl->module_object);
}

void GodotBinding::after_garbage_collection(JSContext *) noexcept {
	impl->after_garbage_collection();
}

void GodotBinding::shutdown(JSContext *context) noexcept {
	impl->shutdown(context);
}

JSValue GodotBinding::construct_script_instance(
		JSValueConst script_class,
		GDExtensionObjectPtr owner,
		std::uint64_t owner_id) {
	return impl == nullptr
			? JS_EXCEPTION
			: impl->construct_script_instance(script_class, owner, owner_id);
}

JSValue GodotBinding::variant_to_javascript(const godot::Variant &value) {
	return impl == nullptr ? JS_EXCEPTION : impl->from_variant(value);
}

bool GodotBinding::javascript_to_variant(
		JSValueConst value,
		const std::string &expected_type,
		godot::Variant &result,
		std::string &error) {
	if (impl == nullptr || impl->context == nullptr) {
		error = "Godot binding is not installed";
		return false;
	}
	return impl->to_variant(
			impl->context,
			value,
			expected_type,
			result,
			error);
}

bool GodotBinding::script_base_class(
		JSValueConst script_class,
		std::string &base_class,
		std::string &error) const {
	if (impl == nullptr) {
		error = "Godot binding is unavailable";
		return false;
	}
	return impl->script_base_class(script_class, base_class, error);
}

bool GodotBinding::is_godot_class_prototype(JSValueConst value) const {
	return impl != nullptr && impl->is_godot_class_prototype(value);
}

const std::vector<std::string> &GodotBinding::feature_names() const noexcept {
	static const std::vector<std::string> names{
		"godot-binding",
		"godot-variant-bridge",
	};
	return names;
}

std::size_t GodotBinding::live_wrapper_count() {
	return live_wrappers.load(std::memory_order_acquire);
}

std::size_t GodotBinding::live_callback_root_count() {
	return live_callback_roots.load(std::memory_order_acquire);
}

} // namespace godot_js_runtime
