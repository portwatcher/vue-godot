#include "godot_js_runtime/scripting/javascript_language.hpp"

#include <algorithm>
#include <regex>
#include <string>
#include <unordered_set>
#include <utility>

#include <godot_cpp/classes/engine.hpp>
#include <godot_cpp/core/class_db.hpp>
#include <godot_cpp/core/memory.hpp>
#include <godot_cpp/variant/array.hpp>
#include <godot_cpp/variant/dictionary.hpp>
#include <godot_cpp/variant/packed_int32_array.hpp>
#include <godot_cpp/variant/packed_string_array.hpp>

#include "godot_js_runtime/runtime/runtime_host.hpp"
#include "godot_js_runtime/runtime/module_format.hpp"
#include "godot_js_runtime/runtime/string_conversion.hpp"
#include "godot_js_runtime/scripting/javascript_project_runtime.hpp"
#include "godot_js_runtime/scripting/javascript_script.hpp"
#include "godot_js_runtime/scripting/javascript_script_path.hpp"

namespace godot_js_runtime {

namespace {

constexpr char DEFAULT_TEMPLATE[] = R"JS(import { _BASE_ } from 'godot'

export default class _CLASS_ extends _BASE_ {
  _ready() {
  }
}
)JS";

constexpr char EMPTY_TEMPLATE[] = R"JS(import { _BASE_ } from 'godot'

export default class _CLASS_ extends _BASE_ {
}
)JS";

godot::PackedStringArray function_names(const godot::String &source) {
	static const std::regex function_pattern(
			R"((?:^|\n)\s*(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][A-Za-z0-9_$]*))");
	static const std::regex method_pattern(
			R"((?:^|\n)\s*(?:async\s+)?([A-Za-z_$][A-Za-z0-9_$]*)\s*\([^\n]*\)\s*\{)");
	static const std::unordered_set<std::string> excluded = {
		"catch", "constructor", "for", "if", "switch", "while",
	};
	const std::string text = standard_string(source);
	std::unordered_set<std::string> seen;
	godot::PackedStringArray names;
	for (const std::regex *pattern : { &function_pattern, &method_pattern }) {
		for (std::sregex_iterator iterator(text.begin(), text.end(), *pattern), end;
				iterator != end;
				++iterator) {
			const std::string name = (*iterator)[1].str();
			if (excluded.count(name) == 0 && seen.emplace(name).second) {
				const auto name_position = text.begin() + (*iterator).position(1);
				const std::size_t line = static_cast<std::size_t>(
						std::count(text.begin(), name_position, '\n') + 1);
				names.push_back(godot_string(
						name + ":" + std::to_string(line)));
			}
		}
	}
	return names;
}

godot::PackedInt32Array safe_source_lines(const godot::String &source) {
	godot::PackedInt32Array safe_lines;
	const godot::PackedStringArray lines = source.split("\n");
	for (int64_t index = 0; index < lines.size(); ++index) {
		const godot::String stripped = lines[index].strip_edges();
		if (!stripped.is_empty() && stripped != "{" && stripped != "}" &&
				!stripped.begins_with("//")) {
			safe_lines.push_back(static_cast<int32_t>(index + 1));
		}
	}
	return safe_lines;
}

godot::Dictionary built_in_template(
		const godot::StringName &base_class,
		const godot::String &name,
		const godot::String &description,
		const godot::String &content,
		const godot::String &id) {
	godot::Dictionary script_template;
	script_template["inherit"] = base_class;
	script_template["name"] = name;
	script_template["description"] = description;
	script_template["content"] = content;
	script_template["id"] = id;
	script_template["origin"] = 0;
	return script_template;
}

} // namespace

JavaScriptLanguage *JavaScriptLanguage::singleton = nullptr;

void JavaScriptLanguage::_bind_methods() {
	godot::ClassDB::bind_method(
			godot::D_METHOD("get_language_name"),
			&JavaScriptLanguage::_get_name);
	godot::ClassDB::bind_method(
			godot::D_METHOD(
					"validate_source",
					"source",
					"path",
					"validate_functions",
					"validate_errors",
					"validate_warnings",
					"validate_safe_lines"),
			&JavaScriptLanguage::_validate);
	godot::ClassDB::bind_method(
			godot::D_METHOD("get_script_templates", "base_class"),
			&JavaScriptLanguage::_get_built_in_templates);
	godot::ClassDB::bind_method(
			godot::D_METHOD(
					"make_script_template",
					"content",
					"class_name",
					"base_class"),
			&JavaScriptLanguage::_make_template);
	godot::ClassDB::bind_method(
			godot::D_METHOD("get_script_extensions"),
			&JavaScriptLanguage::_get_recognized_extensions);
	godot::ClassDB::bind_method(
			godot::D_METHOD("overrides_external_editor"),
			&JavaScriptLanguage::_overrides_external_editor);
	godot::ClassDB::bind_method(
			godot::D_METHOD("get_last_error"),
			&JavaScriptLanguage::_debug_get_error);
	godot::ClassDB::bind_method(
			godot::D_METHOD("get_current_stack_info"),
			&JavaScriptLanguage::_debug_get_current_stack_info);
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

void JavaScriptLanguage::record_exception(const JavaScriptException &exception) {
	debug_error = godot_string(format_exception(exception));
	debug_frames.clear();
	DebugFrame frame;
	frame.source = godot_string(exception.source);
	frame.function = exception.name.empty()
			? godot::String("<module>")
			: godot_string(exception.name);
	frame.line = exception.line > 0 ? exception.line : -1;
	debug_frames.push_back(std::move(frame));
}

void JavaScriptLanguage::clear_debug_error() {
	debug_error = godot::String();
	debug_frames.clear();
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
	const godot::String safe_class = class_name.is_empty() ? "NewScript" : class_name;
	const godot::String safe_base = base_class_name.is_empty() ? "Node" : base_class_name;
	const godot::String content = script_template.is_empty()
			? godot::String(DEFAULT_TEMPLATE)
			: script_template;
	script->_set_source_code(
			content.replace("_CLASS_", safe_class).replace("_BASE_", safe_base));
	return script;
}

godot::TypedArray<godot::Dictionary> JavaScriptLanguage::_get_built_in_templates(
		const godot::StringName &object) const {
	godot::TypedArray<godot::Dictionary> templates;
	templates.push_back(built_in_template(
			object,
			"Default",
			"JavaScript class with a ready callback",
			DEFAULT_TEMPLATE,
			"default"));
	templates.push_back(built_in_template(
			object,
			"Empty",
			"JavaScript class without callbacks",
			EMPTY_TEMPLATE,
			"empty"));
	return templates;
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
	godot::Dictionary result;
	if (validate_functions) {
		result["functions"] = function_names(script);
	}
	if (validate_warnings) {
		result["warnings"] = godot::Array();
	}

	EvaluationResult validation;
	if (script.strip_edges().is_empty()) {
		validation.exception = JavaScriptException{
			"SyntaxError",
			"JavaScript source is empty",
			{},
			standard_string(path),
			1,
			1,
			false,
		};
	} else {
		JavaScriptLanguage *language = const_cast<JavaScriptLanguage *>(this);
		JavaScriptProjectRuntime *project = language->project_runtime();
		validation = project == nullptr
				? EvaluationResult{
					  false,
					  {},
					  JavaScriptException{
						  "RuntimeError",
						  "JavaScript project runtime is unavailable",
						  {},
						  standard_string(path),
						  1,
						  1,
						  false,
					  },
					  0,
				  }
				: project->validate_source(
						standard_string(script),
						standard_string(path.is_empty() ? godot::String("res://untitled.js") : path),
						detect_javascript_module_format(
								standard_string(path.is_empty() ? godot::String("res://untitled.js") : path),
								standard_string(script)) == JavaScriptModuleFormat::ES_MODULE);
	}
	result["valid"] = validation.ok;
	if (validation.ok) {
		const_cast<JavaScriptLanguage *>(this)->clear_debug_error();
		if (validate_safe_lines) {
			result["safe_lines"] = safe_source_lines(script);
		}
	} else if (validation.exception.has_value()) {
		const JavaScriptException &exception = *validation.exception;
		const_cast<JavaScriptLanguage *>(this)->record_exception(exception);
		if (validate_errors) {
			godot::Array errors;
			godot::Dictionary error;
			error["line"] = std::max(1, exception.line);
			error["column"] = std::max(1, exception.column);
			error["message"] = godot_string(
					exception.name +
					(exception.message.empty() ? std::string() : ": " + exception.message));
			error["path"] = godot_string(
					exception.source.empty() ? standard_string(path) : exception.source);
			errors.push_back(error);
			result["errors"] = errors;
		}
		if (validate_safe_lines) {
			result["safe_lines"] = godot::PackedInt32Array();
		}
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
	return debug_error;
}

int32_t JavaScriptLanguage::_debug_get_stack_level_count() const {
	return static_cast<int32_t>(debug_frames.size());
}

int32_t JavaScriptLanguage::_debug_get_stack_level_line(int32_t level) const {
	return level >= 0 && level < static_cast<int32_t>(debug_frames.size())
			? debug_frames[static_cast<std::size_t>(level)].line
			: -1;
}

godot::String JavaScriptLanguage::_debug_get_stack_level_function(int32_t level) const {
	return level >= 0 && level < static_cast<int32_t>(debug_frames.size())
			? debug_frames[static_cast<std::size_t>(level)].function
			: godot::String();
}

godot::String JavaScriptLanguage::_debug_get_stack_level_source(int32_t level) const {
	return level >= 0 && level < static_cast<int32_t>(debug_frames.size())
			? debug_frames[static_cast<std::size_t>(level)].source
			: godot::String();
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
	godot::TypedArray<godot::Dictionary> stack;
	for (const DebugFrame &frame : debug_frames) {
		godot::Dictionary entry;
		entry["file"] = frame.source;
		entry["func"] = frame.function;
		entry["line"] = frame.line;
		stack.push_back(entry);
	}
	return stack;
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
		const godot::Engine *engine = godot::Engine::get_singleton();
		if (engine != nullptr && engine->is_editor_hint()) {
			project->poll_file_changes();
		}
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
