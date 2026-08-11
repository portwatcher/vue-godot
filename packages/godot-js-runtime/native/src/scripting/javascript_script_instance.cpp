#include "godot_js_runtime/scripting/javascript_script_instance.hpp"

#include <cstring>
#include <vector>

#include <godot_cpp/core/memory.hpp>
#include <godot_cpp/godot.hpp>
#include <godot_cpp/variant/string.hpp>
#include <godot_cpp/variant/string_name.hpp>
#include <godot_cpp/variant/variant.hpp>

#include "godot_js_runtime/scripting/javascript_language.hpp"
#include "godot_js_runtime/scripting/javascript_project_runtime.hpp"
#include "godot_js_runtime/scripting/javascript_script.hpp"

namespace godot_js_runtime {

namespace {

JavaScriptScriptInstance *instance_data(GDExtensionScriptInstanceDataPtr instance) {
	return static_cast<JavaScriptScriptInstance *>(instance);
}

JavaScriptProjectRuntime *project_runtime() {
	JavaScriptLanguage *language = JavaScriptLanguage::get_singleton();
	return language == nullptr ? nullptr : language->project_runtime();
}

} // namespace

const GDExtensionScriptInstanceInfo3 JavaScriptScriptInstance::INSTANCE_INFO{
	set_property,
	get_property,
	get_property_list,
	free_property_list,
	nullptr,
	property_can_revert,
	property_get_revert,
	get_owner,
	get_property_state,
	get_method_list,
	free_method_list,
	get_property_type,
	nullptr,
	has_method,
	get_method_argument_count,
	call,
	notification,
	to_string,
	refcount_incremented,
	refcount_decremented,
	get_script,
	is_placeholder,
	nullptr,
	nullptr,
	get_language,
	free_instance,
};

JavaScriptScriptInstance::JavaScriptScriptInstance(
		JavaScriptScript *script,
		GDExtensionObjectPtr owner,
		std::uint64_t owner_id) :
		script_resource(script),
		owner_pointer(owner),
		owner_instance_id(owner_id) {
}

JavaScriptScriptInstance::~JavaScriptScriptInstance() {
	if (JavaScriptProjectRuntime *runtime = project_runtime()) {
		runtime->forget_instance(*this);
	}
}

void *JavaScriptScriptInstance::create(
		JavaScriptScript *script,
		GDExtensionObjectPtr owner,
		std::uint64_t owner_id) {
	JavaScriptProjectRuntime *runtime = project_runtime();
	if (script == nullptr || owner == nullptr || owner_id == 0 || runtime == nullptr ||
			godot::internal::gdextension_interface_script_instance_create3 == nullptr) {
		return nullptr;
	}
	auto *instance = new JavaScriptScriptInstance(script, owner, owner_id);
	if (!runtime->register_instance(*instance)) {
		delete instance;
		return nullptr;
	}
	void *script_instance = godot::internal::gdextension_interface_script_instance_create3(
			&INSTANCE_INFO,
			instance);
	if (script_instance == nullptr) {
		runtime->forget_instance(*instance);
		delete instance;
	}
	return script_instance;
}

JavaScriptScript *JavaScriptScriptInstance::script() const {
	return script_resource.ptr();
}

GDExtensionObjectPtr JavaScriptScriptInstance::owner() const {
	return owner_pointer;
}

std::uint64_t JavaScriptScriptInstance::owner_id() const {
	return owner_instance_id;
}

bool JavaScriptScriptInstance::is_active() const {
	return active;
}

void JavaScriptScriptInstance::deactivate() {
	active = false;
	owner_pointer = nullptr;
}

GDExtensionBool JavaScriptScriptInstance::set_property(
		GDExtensionScriptInstanceDataPtr instance,
		GDExtensionConstStringNamePtr name,
		GDExtensionConstVariantPtr value) {
	JavaScriptScriptInstance *data = instance_data(instance);
	JavaScriptProjectRuntime *runtime = project_runtime();
	return data != nullptr && runtime != nullptr && data->is_active() &&
			runtime->set_property(
					*data,
					*reinterpret_cast<const godot::StringName *>(name),
					*reinterpret_cast<const godot::Variant *>(value));
}

GDExtensionBool JavaScriptScriptInstance::get_property(
		GDExtensionScriptInstanceDataPtr instance,
		GDExtensionConstStringNamePtr name,
		GDExtensionVariantPtr result) {
	JavaScriptScriptInstance *data = instance_data(instance);
	JavaScriptProjectRuntime *runtime = project_runtime();
	if (data == nullptr || runtime == nullptr || !data->is_active()) {
		return false;
	}
	godot::Variant value;
	if (!runtime->get_property(
				*data,
				*reinterpret_cast<const godot::StringName *>(name),
				value)) {
		return false;
	}
	*reinterpret_cast<godot::Variant *>(result) = value;
	return true;
}

const GDExtensionPropertyInfo *JavaScriptScriptInstance::get_property_list(
		GDExtensionScriptInstanceDataPtr instance,
		uint32_t *count) {
	JavaScriptScriptInstance *data = instance_data(instance);
	if (data == nullptr || data->script() == nullptr || count == nullptr) {
		return nullptr;
	}
	const auto &properties = data->script()->metadata().properties;
	*count = static_cast<uint32_t>(properties.size());
	if (properties.empty()) {
		return nullptr;
	}
	auto *result = static_cast<GDExtensionPropertyInfo *>(
			memalloc(sizeof(GDExtensionPropertyInfo) * properties.size()));
	for (std::size_t index = 0; index < properties.size(); ++index) {
		result[index] = properties[index].info._to_gdextension();
	}
	return result;
}

void JavaScriptScriptInstance::free_property_list(
		GDExtensionScriptInstanceDataPtr,
		const GDExtensionPropertyInfo *list,
		uint32_t) {
	if (list != nullptr) {
		memfree(const_cast<GDExtensionPropertyInfo *>(list));
	}
}

GDExtensionBool JavaScriptScriptInstance::property_can_revert(
		GDExtensionScriptInstanceDataPtr instance,
		GDExtensionConstStringNamePtr name) {
	JavaScriptScriptInstance *data = instance_data(instance);
	const JavaScriptPropertyDefinition *property = data == nullptr || data->script() == nullptr
			? nullptr
			: data->script()->find_property(*reinterpret_cast<const godot::StringName *>(name));
	return property != nullptr && property->has_default;
}

GDExtensionBool JavaScriptScriptInstance::property_get_revert(
		GDExtensionScriptInstanceDataPtr instance,
		GDExtensionConstStringNamePtr name,
		GDExtensionVariantPtr result) {
	JavaScriptScriptInstance *data = instance_data(instance);
	const JavaScriptPropertyDefinition *property = data == nullptr || data->script() == nullptr
			? nullptr
			: data->script()->find_property(*reinterpret_cast<const godot::StringName *>(name));
	if (property == nullptr || !property->has_default) {
		return false;
	}
	*reinterpret_cast<godot::Variant *>(result) = property->default_value;
	return true;
}

GDExtensionObjectPtr JavaScriptScriptInstance::get_owner(
		GDExtensionScriptInstanceDataPtr instance) {
	JavaScriptScriptInstance *data = instance_data(instance);
	return data == nullptr || !data->is_active() ? nullptr : data->owner();
}

void JavaScriptScriptInstance::get_property_state(
		GDExtensionScriptInstanceDataPtr instance,
		GDExtensionScriptInstancePropertyStateAdd add,
		void *userdata) {
	JavaScriptScriptInstance *data = instance_data(instance);
	JavaScriptProjectRuntime *runtime = project_runtime();
	if (data == nullptr || runtime == nullptr || add == nullptr || !data->is_active()) {
		return;
	}
	for (const JavaScriptPropertyDefinition &property : data->script()->metadata().properties) {
		godot::Variant value;
		if (runtime->get_property(*data, property.info.name, value)) {
			add(property.info.name._native_ptr(), value._native_ptr(), userdata);
		}
	}
}

const GDExtensionMethodInfo *JavaScriptScriptInstance::get_method_list(
		GDExtensionScriptInstanceDataPtr instance,
		uint32_t *count) {
	JavaScriptScriptInstance *data = instance_data(instance);
	if (data == nullptr || data->script() == nullptr || count == nullptr) {
		return nullptr;
	}
	const auto &methods = data->script()->metadata().methods;
	*count = static_cast<uint32_t>(methods.size());
	if (methods.empty()) {
		return nullptr;
	}
	auto *result = static_cast<GDExtensionMethodInfo *>(
			memalloc(sizeof(GDExtensionMethodInfo) * methods.size()));
	std::memset(result, 0, sizeof(GDExtensionMethodInfo) * methods.size());
	for (std::size_t index = 0; index < methods.size(); ++index) {
		const godot::MethodInfo &method = methods[index].info;
		result[index].name = method.name._native_ptr();
		result[index].return_value = method.return_val._to_gdextension();
		result[index].flags = method.flags;
		result[index].id = method.id;
		result[index].argument_count = static_cast<uint32_t>(method.arguments.size());
		if (!method.arguments.empty()) {
			result[index].arguments = static_cast<GDExtensionPropertyInfo *>(
					memalloc(sizeof(GDExtensionPropertyInfo) * method.arguments.size()));
			for (std::size_t argument = 0; argument < method.arguments.size(); ++argument) {
				result[index].arguments[argument] =
						method.arguments[argument]._to_gdextension();
			}
		}
	}
	return result;
}

void JavaScriptScriptInstance::free_method_list(
		GDExtensionScriptInstanceDataPtr,
		const GDExtensionMethodInfo *list,
		uint32_t count) {
	if (list == nullptr) {
		return;
	}
	auto *mutable_list = const_cast<GDExtensionMethodInfo *>(list);
	for (uint32_t index = 0; index < count; ++index) {
		if (mutable_list[index].arguments != nullptr) {
			memfree(mutable_list[index].arguments);
		}
	}
	memfree(mutable_list);
}

GDExtensionVariantType JavaScriptScriptInstance::get_property_type(
		GDExtensionScriptInstanceDataPtr instance,
		GDExtensionConstStringNamePtr name,
		GDExtensionBool *valid) {
	JavaScriptScriptInstance *data = instance_data(instance);
	const JavaScriptPropertyDefinition *property = data == nullptr || data->script() == nullptr
			? nullptr
			: data->script()->find_property(*reinterpret_cast<const godot::StringName *>(name));
	if (valid != nullptr) {
		*valid = property != nullptr;
	}
	return property == nullptr
			? GDEXTENSION_VARIANT_TYPE_NIL
			: static_cast<GDExtensionVariantType>(property->info.type);
}

GDExtensionBool JavaScriptScriptInstance::has_method(
		GDExtensionScriptInstanceDataPtr instance,
		GDExtensionConstStringNamePtr name) {
	JavaScriptScriptInstance *data = instance_data(instance);
	return data != nullptr && data->script() != nullptr && data->is_active() &&
			data->script()->find_method(*reinterpret_cast<const godot::StringName *>(name)) != nullptr;
}

GDExtensionInt JavaScriptScriptInstance::get_method_argument_count(
		GDExtensionScriptInstanceDataPtr instance,
		GDExtensionConstStringNamePtr name,
		GDExtensionBool *valid) {
	JavaScriptScriptInstance *data = instance_data(instance);
	const JavaScriptMethodDefinition *method = data == nullptr || data->script() == nullptr
			? nullptr
			: data->script()->find_method(*reinterpret_cast<const godot::StringName *>(name));
	if (valid != nullptr) {
		*valid = method != nullptr;
	}
	return method == nullptr ? 0 : method->argument_count;
}

void JavaScriptScriptInstance::call(
		GDExtensionScriptInstanceDataPtr instance,
		GDExtensionConstStringNamePtr method,
		const GDExtensionConstVariantPtr *arguments,
		GDExtensionInt argument_count,
		GDExtensionVariantPtr result,
		GDExtensionCallError *error) {
	JavaScriptScriptInstance *data = instance_data(instance);
	JavaScriptProjectRuntime *runtime = project_runtime();
	if (error == nullptr) {
		return;
	}
	*error = {};
	if (data == nullptr || runtime == nullptr || !data->is_active()) {
		error->error = GDEXTENSION_CALL_ERROR_INSTANCE_IS_NULL;
		return;
	}
	std::vector<const godot::Variant *> converted_arguments;
	converted_arguments.reserve(static_cast<std::size_t>(argument_count));
	for (GDExtensionInt index = 0; index < argument_count; ++index) {
		converted_arguments.push_back(
				reinterpret_cast<const godot::Variant *>(arguments[index]));
	}
	godot::Variant return_value;
	runtime->call_method(
			*data,
			*reinterpret_cast<const godot::StringName *>(method),
			converted_arguments.data(),
			static_cast<int>(argument_count),
			return_value,
			*error);
	*reinterpret_cast<godot::Variant *>(result) = return_value;
}

void JavaScriptScriptInstance::notification(
		GDExtensionScriptInstanceDataPtr instance,
		int32_t what,
		GDExtensionBool reversed) {
	JavaScriptScriptInstance *data = instance_data(instance);
	JavaScriptProjectRuntime *runtime = project_runtime();
	if (data != nullptr && runtime != nullptr && data->is_active()) {
		runtime->notification(*data, what, reversed != 0);
	}
}

void JavaScriptScriptInstance::to_string(
		GDExtensionScriptInstanceDataPtr instance,
		GDExtensionBool *valid,
		GDExtensionStringPtr result) {
	JavaScriptScriptInstance *data = instance_data(instance);
	if (valid != nullptr) {
		*valid = data != nullptr;
	}
	if (result != nullptr) {
		*reinterpret_cast<godot::String *>(result) = data == nullptr
				? godot::String("<invalid JavaScript script instance>")
				: godot::String("<JavaScript script instance #") +
						godot::String::num_uint64(data->owner_id()) + ">";
	}
}

void JavaScriptScriptInstance::refcount_incremented(GDExtensionScriptInstanceDataPtr) {
}

GDExtensionBool JavaScriptScriptInstance::refcount_decremented(
		GDExtensionScriptInstanceDataPtr) {
	return false;
}

GDExtensionObjectPtr JavaScriptScriptInstance::get_script(
		GDExtensionScriptInstanceDataPtr instance) {
	JavaScriptScriptInstance *data = instance_data(instance);
	return data == nullptr || data->script() == nullptr ? nullptr : data->script()->_owner;
}

GDExtensionBool JavaScriptScriptInstance::is_placeholder(
		GDExtensionScriptInstanceDataPtr) {
	return false;
}

GDExtensionScriptLanguagePtr JavaScriptScriptInstance::get_language(
		GDExtensionScriptInstanceDataPtr) {
	JavaScriptLanguage *language = JavaScriptLanguage::get_singleton();
	return language == nullptr ? nullptr : language->_owner;
}

void JavaScriptScriptInstance::free_instance(
		GDExtensionScriptInstanceDataPtr instance) {
	delete instance_data(instance);
}

} // namespace godot_js_runtime
