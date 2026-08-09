#include "godot_js_runtime/scripting/javascript_script_path.hpp"

namespace godot_js_runtime {

bool has_javascript_script_extension(const godot::String &path) {
	const godot::String extension = path.get_extension().to_lower();
	return extension == "js" || extension == "mjs" || extension == "cjs";
}

godot::PackedStringArray javascript_script_extensions() {
	godot::PackedStringArray extensions;
	extensions.push_back("js");
	extensions.push_back("mjs");
	extensions.push_back("cjs");
	return extensions;
}

} // namespace godot_js_runtime
