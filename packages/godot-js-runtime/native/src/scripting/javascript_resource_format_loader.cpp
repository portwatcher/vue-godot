#include "godot_js_runtime/scripting/javascript_resource_format_loader.hpp"

#include <string>

#include <godot_cpp/classes/gd_script.hpp>
#include <godot_cpp/variant/utility_functions.hpp>

#include "godot_js_runtime/runtime/godot_environment.hpp"
#include "godot_js_runtime/runtime/runtime_host.hpp"

namespace godot_js_runtime {

namespace {

constexpr char PHASE_TWO_SCRIPT[] = R"GDSCRIPT(extends Node

const RUNTIME_RELOAD_CYCLES := 8
const EDITOR_PLAY_MARKER := "user://godot-js-runtime-editor-play.log"

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
	if runtime_info.get_live_runtime_count() != 0:
		push_error("QuickJS runtime instance leaked after module evaluation")
		get_tree().quit(1)
		return
	for iteration in range(RUNTIME_RELOAD_CYCLES):
		var loop_script = ResourceLoader.load(
			"res://loop.mjs",
			"Script",
			ResourceLoader.CACHE_MODE_IGNORE,
		)
		if loop_script == null:
			push_error("Runtime reload loop could not load iteration %d" % iteration)
			get_tree().quit(1)
			return
		loop_script = null
		if runtime_info.get_live_runtime_count() != 0:
			push_error("QuickJS runtime leaked during reload iteration %d" % iteration)
			get_tree().quit(1)
			return
	var marker_file = FileAccess.open(EDITOR_PLAY_MARKER, FileAccess.READ_WRITE)
	if marker_file == null:
		marker_file = FileAccess.open(EDITOR_PLAY_MARKER, FileAccess.WRITE_READ)
	if marker_file == null:
		push_error("Could not open the editor play completion marker")
		get_tree().quit(1)
		return
	marker_file.seek_end()
	marker_file.store_line("ready")
	marker_file = null
	print("[godot-js-runtime] PHASE2_RELOAD_LOOP PASS")
	print("[godot-js-runtime] PHASE2_SCRIPT_READY PASS")
	get_tree().quit(0)
)GDSCRIPT";

bool has_javascript_extension(const godot::String &path) {
	const godot::String extension = path.get_extension().to_lower();
	return extension == "js" || extension == "mjs" || extension == "cjs";
}

std::string standard_string(const godot::String &value) {
	const godot::CharString utf8 = value.utf8();
	return std::string(utf8.get_data(), static_cast<std::size_t>(utf8.length()));
}

bool report_failure(
		const std::string &operation,
		const EvaluationResult &result) {
	if (result.ok) {
		return false;
	}
	const std::string detail = result.exception.has_value()
			? format_exception(*result.exception)
			: std::string("Unknown JavaScript runtime failure");
	godot::UtilityFunctions::push_error(
			godot::String::utf8((operation + ": " + detail).c_str()));
	return true;
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
	const std::string resource_path = standard_string(path);

	GodotResourceProvider resources;
	GodotConsoleSink console;
	{
		RuntimeHost runtime(resources, console);
		if (!runtime.is_running()) {
			godot::UtilityFunctions::push_error(
					"Godot JavaScript Runtime could not start QuickJS-ng for ",
					path,
					": ",
					godot::String::utf8(runtime.initialization_error().c_str()));
			return godot::Variant();
		}
		godot::UtilityFunctions::print(
				"[godot-js-runtime] RUNTIME_STARTED live=",
				static_cast<int64_t>(RuntimeHost::live_runtime_count()));
		const EvaluationResult evaluation = path.get_extension().to_lower() == "mjs"
				? runtime.evaluate_module(resource_path)
				: runtime.evaluate_commonjs(resource_path);
		if (report_failure("JavaScript module evaluation failed", evaluation)) {
			return godot::Variant();
		}
		const EvaluationResult jobs = runtime.pump_jobs();
		if (report_failure("JavaScript Promise job drain failed", jobs)) {
			return godot::Variant();
		}
		godot::UtilityFunctions::print(
				"[godot-js-runtime] PROMISE_JOBS_DRAINED count=",
				static_cast<int64_t>(jobs.jobs_executed));
	}
	godot::UtilityFunctions::print(
			"[godot-js-runtime] RUNTIME_STOPPED live=",
			static_cast<int64_t>(RuntimeHost::live_runtime_count()));

	godot::Ref<godot::GDScript> script;
	script.instantiate();
	script->set_source_code(PHASE_TWO_SCRIPT);
	const godot::Error reload_error = script->reload();
	if (reload_error != godot::OK) {
		godot::UtilityFunctions::push_error(
				"Godot JavaScript Runtime phase-two loader could not create its probe script for ",
				path,
				" (error ",
				static_cast<int64_t>(reload_error),
				")");
		return godot::Variant();
	}
	godot::UtilityFunctions::print(
			"[godot-js-runtime] phase-two loader evaluated ", path);
	return script;
}

} // namespace godot_js_runtime
