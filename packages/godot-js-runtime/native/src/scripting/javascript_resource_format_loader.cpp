#include "godot_js_runtime/scripting/javascript_resource_format_loader.hpp"

#include <string>

#include <godot_cpp/variant/utility_functions.hpp>

#include "godot_js_runtime/runtime/godot_environment.hpp"
#include "godot_js_runtime/scripting/javascript_script.hpp"
#include "godot_js_runtime/scripting/javascript_script_path.hpp"

namespace godot_js_runtime {

namespace {

std::string standard_string(const godot::String &value) {
	const godot::CharString utf8 = value.utf8();
	return std::string(utf8.get_data(), static_cast<std::size_t>(utf8.length()));
}

} // namespace

void JavaScriptResourceFormatLoader::_bind_methods() {
}

godot::PackedStringArray JavaScriptResourceFormatLoader::_get_recognized_extensions() const {
	return javascript_script_extensions();
}

bool JavaScriptResourceFormatLoader::_recognize_path(
		const godot::String &path,
		const godot::StringName &type) const {
	return has_javascript_script_extension(path) &&
			(type.is_empty() || type == godot::StringName("Script") ||
					type == godot::StringName("JavaScriptScript"));
}

bool JavaScriptResourceFormatLoader::_handles_type(
		const godot::StringName &type) const {
	return type == godot::StringName("Script") ||
			type == godot::StringName("JavaScriptScript");
}

godot::String JavaScriptResourceFormatLoader::_get_resource_type(
		const godot::String &path) const {
	return has_javascript_script_extension(path) ? godot::String("Script") : godot::String();
}

godot::Variant JavaScriptResourceFormatLoader::_load(
		const godot::String &path,
		const godot::String &original_path,
		bool use_sub_threads,
		int32_t cache_mode) const {
	(void)original_path;
	(void)use_sub_threads;
	(void)cache_mode;
	GodotResourceProvider resources;
	std::string source;
	std::string error;
	if (!resources.read_text(standard_string(path), source, error)) {
		godot::UtilityFunctions::push_error(
				"JavaScript resource loader could not read ",
				path,
				": ",
				godot::String::utf8(error.c_str()));
		return {};
	}
	godot::Ref<JavaScriptScript> script;
	script.instantiate();
	script->set_source_path(path);
	script->set_loaded_source_code(
			godot::String::utf8(source.c_str(), static_cast<std::int64_t>(source.size())));
	const godot::Error reload_error = script->_reload(false);
	if (reload_error != godot::OK) {
		return {};
	}
	return script;
}

} // namespace godot_js_runtime
