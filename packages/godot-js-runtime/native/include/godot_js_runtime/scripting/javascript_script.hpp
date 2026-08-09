#ifndef GODOT_JS_RUNTIME_JAVASCRIPT_SCRIPT_HPP
#define GODOT_JS_RUNTIME_JAVASCRIPT_SCRIPT_HPP

#include <vector>

#include <godot_cpp/classes/script_language.hpp>
#include <godot_cpp/classes/script_extension.hpp>
#include <godot_cpp/variant/string.hpp>

#include "godot_js_runtime/scripting/javascript_script_metadata.hpp"

namespace godot_js_runtime {

class JavaScriptProjectRuntime;

class JavaScriptScript : public godot::ScriptExtension {
	GDCLASS(JavaScriptScript, godot::ScriptExtension)

public:
	JavaScriptScript() = default;
	~JavaScriptScript() override;

	void set_source_path(const godot::String &path);
	void set_loaded_source_code(const godot::String &code);
	void mark_source_saved();
	const godot::String &source_path() const;
	bool has_source_changes() const;
	const JavaScriptScriptMetadata &metadata() const;
	const JavaScriptPropertyDefinition *find_property(
			const godot::StringName &name) const;
	const JavaScriptMethodDefinition *find_method(
			const godot::StringName &name) const;
	void replace_metadata(JavaScriptScriptMetadata metadata);
	void mark_invalid(const godot::String &message);

	bool _editor_can_reload_from_file() override;
	void _placeholder_erased(void *placeholder) override;
	bool _can_instantiate() const override;
	godot::Ref<godot::Script> _get_base_script() const override;
	godot::StringName _get_global_name() const override;
	bool _inherits_script(const godot::Ref<godot::Script> &script) const override;
	godot::StringName _get_instance_base_type() const override;
	void *_instance_create(godot::Object *for_object) const override;
	void *_placeholder_instance_create(godot::Object *for_object) const override;
	bool _instance_has(godot::Object *object) const override;
	bool _has_source_code() const override;
	godot::String _get_source_code() const override;
	void _set_source_code(const godot::String &code) override;
	godot::Error _reload(bool keep_state) override;
	godot::StringName _get_doc_class_name() const override;
	godot::TypedArray<godot::Dictionary> _get_documentation() const override;
	godot::String _get_class_icon_path() const override;
	bool _has_method(const godot::StringName &method) const override;
	bool _has_static_method(const godot::StringName &method) const override;
	godot::Variant _get_script_method_argument_count(
			const godot::StringName &method) const override;
	godot::Dictionary _get_method_info(const godot::StringName &method) const override;
	bool _is_tool() const override;
	bool _is_valid() const override;
	bool _is_abstract() const override;
	godot::ScriptLanguage *_get_language() const override;
	bool _has_script_signal(const godot::StringName &signal) const override;
	godot::TypedArray<godot::Dictionary> _get_script_signal_list() const override;
	bool _has_property_default_value(
			const godot::StringName &property) const override;
	godot::Variant _get_property_default_value(
			const godot::StringName &property) const override;
	void _update_exports() override;
	godot::TypedArray<godot::Dictionary> _get_script_method_list() const override;
	godot::TypedArray<godot::Dictionary> _get_script_property_list() const override;
	int32_t _get_member_line(const godot::StringName &member) const override;
	godot::Dictionary _get_constants() const override;
	godot::TypedArray<godot::StringName> _get_members() const override;
	bool _is_placeholder_fallback_enabled() const override;
	godot::Variant _get_rpc_config() const override;

protected:
	static void _bind_methods();

private:
	friend class JavaScriptProjectRuntime;

	void refresh_placeholders() const;

	godot::String script_source;
	godot::String script_path;
	godot::String load_error;
	JavaScriptScriptMetadata script_metadata;
	mutable std::vector<void *> placeholders;
	bool source_changed = false;
	bool valid = false;
};

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_JAVASCRIPT_SCRIPT_HPP
