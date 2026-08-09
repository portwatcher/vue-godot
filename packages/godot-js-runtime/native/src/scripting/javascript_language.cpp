#include "godot_js_runtime/scripting/javascript_language.hpp"

#include <godot_cpp/core/memory.hpp>
#include <godot_cpp/variant/array.hpp>
#include <godot_cpp/variant/dictionary.hpp>
#include <godot_cpp/variant/packed_string_array.hpp>

#include "godot_js_runtime/scripting/javascript_project_runtime.hpp"
#include "godot_js_runtime/scripting/javascript_script.hpp"
#include "godot_js_runtime/scripting/javascript_script_path.hpp"

namespace godot_js_runtime {

JavaScriptLanguage *JavaScriptLanguage::singleton = nullptr;

void JavaScriptLanguage::_bind_methods() {
}

JavaScriptLanguage::JavaScriptLanguage() {
	singleton = this;
}

JavaScriptLanguage::~JavaScriptLanguage() {
	_finish();
	if (singleton == this) {
		singleton = nullptr;
	}
}

JavaScriptLanguage *JavaScriptLanguage::get_singleton() {
	return singleton;
}

JavaScriptProjectRuntime *JavaScriptLanguage::project_runtime() {
	if (runtime == nullptr && !finished) {
		runtime = std::make_unique<JavaScriptProjectRuntime>();
	}
	return runtime.get();
}

godot::String JavaScriptLanguage::_get_name() const {
	return "JavaScript";
}

void JavaScriptLanguage::_init() {
	finished = false;
	if (runtime == nullptr) {
		runtime = std::make_unique<JavaScriptProjectRuntime>();
	}
}

godot::String JavaScriptLanguage::_get_type() const {
	return "JavaScript";
}

godot::String JavaScriptLanguage::_get_extension() const {
	return "js";
}

void JavaScriptLanguage::_finish() {
	if (finished) {
		return;
	}
	finished = true;
	if (runtime != nullptr) {
		runtime->shutdown();
		runtime.reset();
	}
}

godot::PackedStringArray JavaScriptLanguage::_get_reserved_words() const {
	godot::PackedStringArray words;
	for (const char *word : {
			 "break", "case", "catch", "class", "const", "continue", "debugger",
			 "default", "delete", "do", "else", "export", "extends", "finally",
			 "for", "function", "if", "import", "in", "instanceof", "let", "new",
			 "return", "super", "switch", "this", "throw", "try", "typeof", "var",
			 "void", "while", "with", "yield",
		 }) {
		words.push_back(word);
	}
	return words;
}

bool JavaScriptLanguage::_is_control_flow_keyword(const godot::String &keyword) const {
	return keyword == "break" || keyword == "case" || keyword == "catch" ||
			keyword == "continue" || keyword == "do" || keyword == "else" ||
			keyword == "finally" || keyword == "for" || keyword == "if" ||
			keyword == "return" || keyword == "switch" || keyword == "throw" ||
			keyword == "try" || keyword == "while" || keyword == "yield";
}

godot::PackedStringArray JavaScriptLanguage::_get_comment_delimiters() const {
	godot::PackedStringArray delimiters;
	delimiters.push_back("//");
	delimiters.push_back("/* */");
	return delimiters;
}

godot::PackedStringArray JavaScriptLanguage::_get_doc_comment_delimiters() const {
	godot::PackedStringArray delimiters;
	delimiters.push_back("/** */");
	return delimiters;
}

godot::PackedStringArray JavaScriptLanguage::_get_string_delimiters() const {
	godot::PackedStringArray delimiters;
	delimiters.push_back("' '");
	delimiters.push_back("\" \"");
	delimiters.push_back("` `");
	return delimiters;
}

godot::Ref<godot::Script> JavaScriptLanguage::_make_template(
		const godot::String &script_template,
		const godot::String &class_name,
		const godot::String &base_class_name) const {
	godot::Ref<JavaScriptScript> script;
	script.instantiate();
	if (!script_template.is_empty()) {
		script->_set_source_code(script_template);
		return script;
	}
	const godot::String safe_class = class_name.is_empty() ? "NewScript" : class_name;
	const godot::String safe_base = base_class_name.is_empty() ? "Node" : base_class_name;
	script->_set_source_code(
			"import { " + safe_base + " } from 'godot'\n\n" +
			"export default class " + safe_class + " extends " + safe_base + " {\n" +
			"  _ready() {\n" +
			"  }\n" +
			"}\n");
	return script;
}

godot::TypedArray<godot::Dictionary> JavaScriptLanguage::_get_built_in_templates(
		const godot::StringName &) const {
	return {};
}

bool JavaScriptLanguage::_is_using_templates() {
	return true;
}

godot::Dictionary JavaScriptLanguage::_validate(
		const godot::String &script,
		const godot::String &path,
		bool validate_functions,
		bool validate_errors,
		bool validate_warnings,
		bool validate_safe_lines) const {
	(void)path;
	(void)validate_functions;
	(void)validate_warnings;
	(void)validate_safe_lines;
	godot::Dictionary result;
	const bool valid_script = !script.strip_edges().is_empty();
	result["valid"] = valid_script;
	if (!valid_script && validate_errors) {
		godot::Array errors;
		godot::Dictionary error;
		error["line"] = 1;
		error["column"] = 1;
		error["message"] = "JavaScript source is empty";
		errors.push_back(error);
		result["errors"] = errors;
	}
	return result;
}

godot::String JavaScriptLanguage::_validate_path(const godot::String &path) const {
	return has_javascript_script_extension(path)
			? godot::String()
			: godot::String("JavaScript scripts must use .js, .mjs, or .cjs");
}

godot::Object *JavaScriptLanguage::_create_script() const {
	return memnew(JavaScriptScript);
}

bool JavaScriptLanguage::_has_named_classes() const {
	return false;
}

bool JavaScriptLanguage::_supports_builtin_mode() const {
	return false;
}

bool JavaScriptLanguage::_supports_documentation() const {
	return false;
}

bool JavaScriptLanguage::_can_inherit_from_file() const {
	return false;
}

int32_t JavaScriptLanguage::_find_function(
		const godot::String &function,
		const godot::String &code) const {
	const int64_t offset = code.find(function + godot::String("("));
	return offset < 0 ? -1 : static_cast<int32_t>(code.substr(0, offset).count("\n"));
}

godot::String JavaScriptLanguage::_make_function(
		const godot::String &,
		const godot::String &function_name,
		const godot::PackedStringArray &function_args) const {
	return function_name + godot::String("(") +
			godot::String(", ").join(function_args) + godot::String(") {\n}\n");
}

bool JavaScriptLanguage::_can_make_function() const {
	return true;
}

godot::Error JavaScriptLanguage::_open_in_external_editor(
		const godot::Ref<godot::Script> &,
		int32_t,
		int32_t) {
	return godot::ERR_UNAVAILABLE;
}

bool JavaScriptLanguage::_overrides_external_editor() {
	return false;
}

godot::ScriptLanguage::ScriptNameCasing JavaScriptLanguage::_preferred_file_name_casing() const {
	return godot::ScriptLanguage::SCRIPT_NAME_CASING_SNAKE_CASE;
}

godot::Dictionary JavaScriptLanguage::_complete_code(
		const godot::String &,
		const godot::String &,
		godot::Object *) const {
	godot::Dictionary result;
	result["result"] = godot::ERR_UNAVAILABLE;
	result["force"] = false;
	result["call_hint"] = "";
	result["options"] = godot::Array();
	return result;
}

godot::Dictionary JavaScriptLanguage::_lookup_code(
		const godot::String &,
		const godot::String &,
		const godot::String &,
		godot::Object *) const {
	godot::Dictionary result;
	result["result"] = godot::ERR_UNAVAILABLE;
	result["type"] = LOOKUP_RESULT_SCRIPT_LOCATION;
	return result;
}

godot::String JavaScriptLanguage::_auto_indent_code(
		const godot::String &code,
		int32_t,
		int32_t) const {
	return code;
}

void JavaScriptLanguage::_add_global_constant(
		const godot::StringName &,
		const godot::Variant &) {
}

void JavaScriptLanguage::_add_named_global_constant(
		const godot::StringName &,
		const godot::Variant &) {
}

void JavaScriptLanguage::_remove_named_global_constant(const godot::StringName &) {
}

void JavaScriptLanguage::_thread_enter() {
}

void JavaScriptLanguage::_thread_exit() {
}

godot::String JavaScriptLanguage::_debug_get_error() const {
	return {};
}

int32_t JavaScriptLanguage::_debug_get_stack_level_count() const {
	return 0;
}

int32_t JavaScriptLanguage::_debug_get_stack_level_line(int32_t) const {
	return -1;
}

godot::String JavaScriptLanguage::_debug_get_stack_level_function(int32_t) const {
	return {};
}

godot::String JavaScriptLanguage::_debug_get_stack_level_source(int32_t) const {
	return {};
}

godot::Dictionary JavaScriptLanguage::_debug_get_stack_level_locals(
		int32_t,
		int32_t,
		int32_t) {
	return {};
}

godot::Dictionary JavaScriptLanguage::_debug_get_stack_level_members(
		int32_t,
		int32_t,
		int32_t) {
	return {};
}

void *JavaScriptLanguage::_debug_get_stack_level_instance(int32_t) {
	return nullptr;
}

godot::Dictionary JavaScriptLanguage::_debug_get_globals(int32_t, int32_t) {
	return {};
}

godot::String JavaScriptLanguage::_debug_parse_stack_level_expression(
		int32_t,
		const godot::String &,
		int32_t,
		int32_t) {
	return {};
}

godot::TypedArray<godot::Dictionary> JavaScriptLanguage::_debug_get_current_stack_info() {
	return {};
}

void JavaScriptLanguage::_reload_all_scripts() {
	if (JavaScriptProjectRuntime *project = project_runtime()) {
		project->reload_all(false);
	}
}

void JavaScriptLanguage::_reload_scripts(const godot::Array &, bool soft_reload) {
	if (JavaScriptProjectRuntime *project = project_runtime()) {
		project->reload_all(soft_reload);
	}
}

void JavaScriptLanguage::_reload_tool_script(
		const godot::Ref<godot::Script> &,
		bool soft_reload) {
	if (JavaScriptProjectRuntime *project = project_runtime()) {
		project->reload_all(soft_reload);
	}
}

godot::PackedStringArray JavaScriptLanguage::_get_recognized_extensions() const {
	return javascript_script_extensions();
}

godot::TypedArray<godot::Dictionary> JavaScriptLanguage::_get_public_functions() const {
	return {};
}

godot::Dictionary JavaScriptLanguage::_get_public_constants() const {
	return {};
}

godot::TypedArray<godot::Dictionary> JavaScriptLanguage::_get_public_annotations() const {
	return {};
}

void JavaScriptLanguage::_profiling_start() {
}

void JavaScriptLanguage::_profiling_stop() {
}

void JavaScriptLanguage::_profiling_set_save_native_calls(bool) {
}

void JavaScriptLanguage::_frame() {
	if (JavaScriptProjectRuntime *project = project_runtime()) {
		project->pump_jobs();
	}
}

bool JavaScriptLanguage::_handles_global_class_type(const godot::String &) const {
	return false;
}

godot::Dictionary JavaScriptLanguage::_get_global_class_name(const godot::String &) const {
	return {};
}

} // namespace godot_js_runtime
