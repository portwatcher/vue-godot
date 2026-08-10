#ifndef GODOT_JS_RUNTIME_JAVASCRIPT_LANGUAGE_HPP
#define GODOT_JS_RUNTIME_JAVASCRIPT_LANGUAGE_HPP

#include <memory>
#include <vector>

#include <godot_cpp/classes/script_language_extension.hpp>

namespace godot_js_runtime {

class JavaScriptProjectRuntime;
struct JavaScriptException;

class JavaScriptLanguage : public godot::ScriptLanguageExtension {
	GDCLASS(JavaScriptLanguage, godot::ScriptLanguageExtension)

public:
	JavaScriptLanguage();
	~JavaScriptLanguage() override;

	static JavaScriptLanguage *get_singleton();
	JavaScriptProjectRuntime *project_runtime();
	void record_exception(const JavaScriptException &exception);
	void clear_debug_error();

	godot::String _get_name() const override;
	void _init() override;
	godot::String _get_type() const override;
	godot::String _get_extension() const override;
	void _finish() override;
	godot::PackedStringArray _get_reserved_words() const override;
	bool _is_control_flow_keyword(const godot::String &keyword) const override;
	godot::PackedStringArray _get_comment_delimiters() const override;
	godot::PackedStringArray _get_doc_comment_delimiters() const override;
	godot::PackedStringArray _get_string_delimiters() const override;
	godot::Ref<godot::Script> _make_template(
			const godot::String &script_template,
			const godot::String &class_name,
			const godot::String &base_class_name) const override;
	godot::TypedArray<godot::Dictionary> _get_built_in_templates(
			const godot::StringName &object) const override;
	bool _is_using_templates() override;
	godot::Dictionary _validate(
			const godot::String &script,
			const godot::String &path,
			bool validate_functions,
			bool validate_errors,
			bool validate_warnings,
			bool validate_safe_lines) const override;
	godot::String _validate_path(const godot::String &path) const override;
	godot::Object *_create_script() const override;
	bool _has_named_classes() const override;
	bool _supports_builtin_mode() const override;
	bool _supports_documentation() const override;
	bool _can_inherit_from_file() const override;
	int32_t _find_function(
			const godot::String &function,
			const godot::String &code) const override;
	godot::String _make_function(
			const godot::String &class_name,
			const godot::String &function_name,
			const godot::PackedStringArray &function_args) const override;
	bool _can_make_function() const override;
	godot::Error _open_in_external_editor(
			const godot::Ref<godot::Script> &script,
			int32_t line,
			int32_t column) override;
	bool _overrides_external_editor() override;
	godot::ScriptLanguage::ScriptNameCasing _preferred_file_name_casing() const override;
	godot::Dictionary _complete_code(
			const godot::String &code,
			const godot::String &path,
			godot::Object *owner) const override;
	godot::Dictionary _lookup_code(
			const godot::String &code,
			const godot::String &symbol,
			const godot::String &path,
			godot::Object *owner) const override;
	godot::String _auto_indent_code(
			const godot::String &code,
			int32_t from_line,
			int32_t to_line) const override;
	void _add_global_constant(
			const godot::StringName &name,
			const godot::Variant &value) override;
	void _add_named_global_constant(
			const godot::StringName &name,
			const godot::Variant &value) override;
	void _remove_named_global_constant(const godot::StringName &name) override;
	void _thread_enter() override;
	void _thread_exit() override;
	godot::String _debug_get_error() const override;
	int32_t _debug_get_stack_level_count() const override;
	int32_t _debug_get_stack_level_line(int32_t level) const override;
	godot::String _debug_get_stack_level_function(int32_t level) const override;
	godot::String _debug_get_stack_level_source(int32_t level) const override;
	godot::Dictionary _debug_get_stack_level_locals(
			int32_t level,
			int32_t max_subitems,
			int32_t max_depth) override;
	godot::Dictionary _debug_get_stack_level_members(
			int32_t level,
			int32_t max_subitems,
			int32_t max_depth) override;
	void *_debug_get_stack_level_instance(int32_t level) override;
	godot::Dictionary _debug_get_globals(
			int32_t max_subitems,
			int32_t max_depth) override;
	godot::String _debug_parse_stack_level_expression(
			int32_t level,
			const godot::String &expression,
			int32_t max_subitems,
			int32_t max_depth) override;
	godot::TypedArray<godot::Dictionary> _debug_get_current_stack_info() override;
	void _reload_all_scripts() override;
	void _reload_scripts(const godot::Array &scripts, bool soft_reload) override;
	void _reload_tool_script(
			const godot::Ref<godot::Script> &script,
			bool soft_reload) override;
	godot::PackedStringArray _get_recognized_extensions() const override;
	godot::TypedArray<godot::Dictionary> _get_public_functions() const override;
	godot::Dictionary _get_public_constants() const override;
	godot::TypedArray<godot::Dictionary> _get_public_annotations() const override;
	void _profiling_start() override;
	void _profiling_stop() override;
	void _profiling_set_save_native_calls(bool enable) override;
	void _frame() override;
	bool _handles_global_class_type(const godot::String &type) const override;
	godot::Dictionary _get_global_class_name(const godot::String &path) const override;

protected:
	static void _bind_methods();

private:
	struct DebugFrame {
		godot::String source;
		godot::String function;
		int32_t line = -1;
	};

	static JavaScriptLanguage *singleton;
	std::unique_ptr<JavaScriptProjectRuntime> runtime;
	godot::String debug_error;
	std::vector<DebugFrame> debug_frames;
	bool finished = false;
};

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_JAVASCRIPT_LANGUAGE_HPP
