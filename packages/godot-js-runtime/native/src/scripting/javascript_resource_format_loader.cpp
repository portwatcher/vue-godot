#include "godot_js_runtime/scripting/javascript_resource_format_loader.hpp"

#include <godot_cpp/classes/gd_script.hpp>
#include <godot_cpp/variant/utility_functions.hpp>

namespace godot_js_runtime {

namespace {

constexpr char PHASE_ONE_SCRIPT[] = R"GDSCRIPT(extends Node

func _ready() -> void:
	var runtime_info = GodotJavaScriptRuntimeInfo.new()
	if runtime_info.get_product_name() != "Godot JavaScript Runtime":
		push_error("Unexpected runtime product name")
		get_tree().quit(1)
		return
	if runtime_info.get_runtime_version() != "0.0.0-development":
		push_error("Unexpected runtime version")
		get_tree().quit(1)
		return
	if runtime_info.get_minimum_godot_version() != "4.4":
		push_error("Unexpected minimum Godot version")
		get_tree().quit(1)
		return
	if not runtime_info.is_initialized():
		push_error("Runtime did not report initialized state")
		get_tree().quit(1)
		return
	print("[godot-js-runtime] PHASE1_SCRIPT_READY PASS")
	get_tree().quit(0)
)GDSCRIPT";

bool has_javascript_extension(const godot::String &path) {
	const godot::String extension = path.get_extension().to_lower();
	return extension == "js" || extension == "mjs" || extension == "cjs";
}

} // namespace

void JavaScriptResourceFormatLoader::_bind_methods() {
}

godot::PackedStringArray JavaScriptResourceFormatLoader::_get_recognized_extensions() const {
	godot::PackedStringArray extensions;
	extensions.push_back("js");
	extensions.push_back("mjs");
	extensions.push_back("cjs");
	return extensions;
}

bool JavaScriptResourceFormatLoader::_recognize_path(
		const godot::String &path,
		const godot::StringName &type) const {
	return has_javascript_extension(path) &&
			(type.is_empty() || type == godot::StringName("Script"));
}

bool JavaScriptResourceFormatLoader::_handles_type(
		const godot::StringName &type) const {
	return type == godot::StringName("Script");
}

godot::String JavaScriptResourceFormatLoader::_get_resource_type(
		const godot::String &path) const {
	return has_javascript_extension(path) ? godot::String("Script") : godot::String();
}

godot::Variant JavaScriptResourceFormatLoader::_load(
		const godot::String &path,
		const godot::String &original_path,
		bool use_sub_threads,
		int32_t cache_mode) const {
	(void)original_path;
	(void)use_sub_threads;
	(void)cache_mode;

	godot::Ref<godot::GDScript> script;
	script.instantiate();
	script->set_source_code(PHASE_ONE_SCRIPT);
	const godot::Error reload_error = script->reload();
	if (reload_error != godot::OK) {
		godot::UtilityFunctions::push_error(
				"Godot JavaScript Runtime phase-one loader could not create its probe script for ",
				path,
				" (error ",
				static_cast<int64_t>(reload_error),
				")");
		return godot::Variant();
	}
	script->set_path(path);
	godot::UtilityFunctions::print(
			"[godot-js-runtime] phase-one loader resolved ", path);
	return script;
}

} // namespace godot_js_runtime
