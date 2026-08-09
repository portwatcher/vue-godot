#include "godot_js_runtime/scripting/javascript_script.hpp"

#include <algorithm>

#include <godot_cpp/classes/engine.hpp>
#include <godot_cpp/godot.hpp>
#include <godot_cpp/variant/array.hpp>
#include <godot_cpp/variant/utility_functions.hpp>

#include "godot_js_runtime/scripting/javascript_language.hpp"
#include "godot_js_runtime/scripting/javascript_project_runtime.hpp"
#include "godot_js_runtime/scripting/javascript_script_instance.hpp"

namespace godot_js_runtime {

void JavaScriptScript::_bind_methods() {
}

JavaScriptScript::~JavaScriptScript() {
	if (JavaScriptLanguage *language = JavaScriptLanguage::get_singleton()) {
		if (JavaScriptProjectRuntime *runtime = language->project_runtime()) {
			runtime->forget_script(*this);
		}
	}
}

void JavaScriptScript::set_source_path(const godot::String &path) {
	script_path = path;
}

void JavaScriptScript::set_loaded_source_code(const godot::String &code) {
	script_source = code;
	source_changed = false;
}

void JavaScriptScript::mark_source_saved() {
	source_changed = false;
}

const godot::String &JavaScriptScript::source_path() const {
	return script_path;
}

bool JavaScriptScript::has_source_changes() const {
	return source_changed;
}

const JavaScriptScriptMetadata &JavaScriptScript::metadata() const {
	return script_metadata;
}

const JavaScriptPropertyDefinition *JavaScriptScript::find_property(
		const godot::StringName &name) const {
	const auto found = std::find_if(
			script_metadata.properties.begin(),
			script_metadata.properties.end(),
			[&name](const JavaScriptPropertyDefinition &property) {
				return property.info.name == name;
			});
	return found == script_metadata.properties.end() ? nullptr : &*found;
}

const JavaScriptMethodDefinition *JavaScriptScript::find_method(
		const godot::StringName &name) const {
	const auto found = std::find_if(
			script_metadata.methods.begin(),
			script_metadata.methods.end(),
			[&name](const JavaScriptMethodDefinition &method) {
				return method.info.name == name;
			});
	return found == script_metadata.methods.end() ? nullptr : &*found;
}

bool JavaScriptScript::_editor_can_reload_from_file() {
	return true;
}

void JavaScriptScript::_placeholder_erased(void *placeholder) {
	placeholders.erase(
			std::remove(placeholders.begin(), placeholders.end(), placeholder),
			placeholders.end());
}

bool JavaScriptScript::_can_instantiate() const {
	const godot::Engine *engine = godot::Engine::get_singleton();
	return valid &&
			(engine == nullptr || !engine->is_editor_hint() || script_metadata.tool);
}

godot::Ref<godot::Script> JavaScriptScript::_get_base_script() const {
	return {};
}

godot::StringName JavaScriptScript::_get_global_name() const {
	return {};
}

bool JavaScriptScript::_inherits_script(const godot::Ref<godot::Script> &) const {
	return false;
}

godot::StringName JavaScriptScript::_get_instance_base_type() const {
	return script_metadata.base_class;
}

void *JavaScriptScript::_instance_create(godot::Object *for_object) const {
	if (!valid || for_object == nullptr) {
		return nullptr;
	}
	if (!for_object->is_class(static_cast<godot::String>(script_metadata.base_class))) {
		godot::UtilityFunctions::push_error(
				"JavaScript script ",
				script_path,
				" requires base ",
				script_metadata.base_class,
				" but was attached to ",
				for_object->get_class());
		return nullptr;
	}
	return JavaScriptScriptInstance::create(
			const_cast<JavaScriptScript *>(this),
			for_object->_owner,
			for_object->get_instance_id());
}

void *JavaScriptScript::_placeholder_instance_create(godot::Object *for_object) const {
	JavaScriptLanguage *language = JavaScriptLanguage::get_singleton();
	if (language == nullptr || for_object == nullptr ||
			godot::internal::gdextension_interface_placeholder_script_instance_create == nullptr) {
		return nullptr;
	}
	void *placeholder =
			godot::internal::gdextension_interface_placeholder_script_instance_create(
					language->_owner,
					_owner,
					for_object->_owner);
	if (placeholder != nullptr) {
		placeholders.push_back(placeholder);
		refresh_placeholders();
	}
	return placeholder;
}

bool JavaScriptScript::_instance_has(godot::Object *object) const {
	JavaScriptLanguage *language = JavaScriptLanguage::get_singleton();
	JavaScriptProjectRuntime *runtime = language == nullptr
			? nullptr
			: language->project_runtime();
	return runtime != nullptr && object != nullptr &&
			runtime->has_instance(*this, object->get_instance_id());
}

bool JavaScriptScript::_has_source_code() const {
	return true;
}

godot::String JavaScriptScript::_get_source_code() const {
	return script_source;
}

void JavaScriptScript::_set_source_code(const godot::String &code) {
	script_source = code;
	source_changed = true;
}

godot::Error JavaScriptScript::_reload(bool keep_state) {
	JavaScriptLanguage *language = JavaScriptLanguage::get_singleton();
	JavaScriptProjectRuntime *runtime = language == nullptr
			? nullptr
			: language->project_runtime();
	if (runtime == nullptr) {
		mark_invalid("JavaScript language runtime is unavailable");
		return godot::ERR_UNAVAILABLE;
	}
	return runtime->load_script(*this, keep_state);
}

godot::StringName JavaScriptScript::_get_doc_class_name() const {
	return godot::StringName(script_path.get_file().get_basename());
}

godot::TypedArray<godot::Dictionary> JavaScriptScript::_get_documentation() const {
	return {};
}

godot::String JavaScriptScript::_get_class_icon_path() const {
	return {};
}

bool JavaScriptScript::_has_method(const godot::StringName &method) const {
	return find_method(method) != nullptr;
}

bool JavaScriptScript::_has_static_method(const godot::StringName &) const {
	return false;
}

godot::Variant JavaScriptScript::_get_script_method_argument_count(
		const godot::StringName &method) const {
	const JavaScriptMethodDefinition *definition = find_method(method);
	return definition == nullptr ? godot::Variant() : godot::Variant(definition->argument_count);
}

godot::Dictionary JavaScriptScript::_get_method_info(
		const godot::StringName &method) const {
	const JavaScriptMethodDefinition *definition = find_method(method);
	return definition == nullptr
			? godot::Dictionary()
			: static_cast<godot::Dictionary>(definition->info);
}

bool JavaScriptScript::_is_tool() const {
	return script_metadata.tool;
}

bool JavaScriptScript::_is_valid() const {
	return valid;
}

bool JavaScriptScript::_is_abstract() const {
	return false;
}

godot::ScriptLanguage *JavaScriptScript::_get_language() const {
	return JavaScriptLanguage::get_singleton();
}

bool JavaScriptScript::_has_script_signal(const godot::StringName &signal) const {
	return std::any_of(
			script_metadata.signals.begin(),
			script_metadata.signals.end(),
			[&signal](const godot::MethodInfo &definition) {
				return definition.name == signal;
			});
}

godot::TypedArray<godot::Dictionary> JavaScriptScript::_get_script_signal_list() const {
	godot::TypedArray<godot::Dictionary> signals;
	for (const godot::MethodInfo &signal : script_metadata.signals) {
		signals.push_back(static_cast<godot::Dictionary>(signal));
	}
	return signals;
}

bool JavaScriptScript::_has_property_default_value(
		const godot::StringName &property) const {
	const JavaScriptPropertyDefinition *definition = find_property(property);
	return definition != nullptr && definition->has_default;
}

godot::Variant JavaScriptScript::_get_property_default_value(
		const godot::StringName &property) const {
	const JavaScriptPropertyDefinition *definition = find_property(property);
	return definition == nullptr || !definition->has_default
			? godot::Variant()
			: definition->default_value;
}

void JavaScriptScript::_update_exports() {
	refresh_placeholders();
}

godot::TypedArray<godot::Dictionary> JavaScriptScript::_get_script_method_list() const {
	godot::TypedArray<godot::Dictionary> methods;
	for (const JavaScriptMethodDefinition &method : script_metadata.methods) {
		methods.push_back(static_cast<godot::Dictionary>(method.info));
	}
	return methods;
}

godot::TypedArray<godot::Dictionary> JavaScriptScript::_get_script_property_list() const {
	godot::TypedArray<godot::Dictionary> properties;
	for (const JavaScriptPropertyDefinition &property : script_metadata.properties) {
		properties.push_back(static_cast<godot::Dictionary>(property.info));
	}
	return properties;
}

int32_t JavaScriptScript::_get_member_line(const godot::StringName &) const {
	return -1;
}

godot::Dictionary JavaScriptScript::_get_constants() const {
	return {};
}

godot::TypedArray<godot::StringName> JavaScriptScript::_get_members() const {
	godot::TypedArray<godot::StringName> members;
	for (const JavaScriptPropertyDefinition &property : script_metadata.properties) {
		members.push_back(property.info.name);
	}
	for (const JavaScriptMethodDefinition &method : script_metadata.methods) {
		members.push_back(method.info.name);
	}
	return members;
}

bool JavaScriptScript::_is_placeholder_fallback_enabled() const {
	return true;
}

godot::Variant JavaScriptScript::_get_rpc_config() const {
	return script_metadata.rpc_config;
}

void JavaScriptScript::replace_metadata(JavaScriptScriptMetadata metadata) {
	script_metadata = std::move(metadata);
	load_error = godot::String();
	valid = true;
	refresh_placeholders();
}

void JavaScriptScript::mark_invalid(const godot::String &message) {
	load_error = message;
	valid = false;
	godot::UtilityFunctions::push_error(
			"JavaScript script ",
			script_path.is_empty() ? godot::String("<unsaved>") : script_path,
			": ",
			message);
}

void JavaScriptScript::refresh_placeholders() const {
	if (godot::internal::gdextension_interface_placeholder_script_instance_update == nullptr ||
			placeholders.empty()) {
		return;
	}
	godot::Array properties;
	godot::Dictionary defaults;
	for (const JavaScriptPropertyDefinition &property : script_metadata.properties) {
		properties.push_back(static_cast<godot::Dictionary>(property.info));
		if (property.has_default) {
			defaults[property.info.name] = property.default_value;
		}
	}
	for (void *placeholder : placeholders) {
		godot::internal::gdextension_interface_placeholder_script_instance_update(
				placeholder,
				properties._native_ptr(),
				defaults._native_ptr());
	}
}

} // namespace godot_js_runtime
