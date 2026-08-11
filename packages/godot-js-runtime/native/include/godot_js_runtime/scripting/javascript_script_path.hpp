#ifndef GODOT_JS_RUNTIME_JAVASCRIPT_SCRIPT_PATH_HPP
#define GODOT_JS_RUNTIME_JAVASCRIPT_SCRIPT_PATH_HPP

#include <godot_cpp/variant/packed_string_array.hpp>
#include <godot_cpp/variant/string.hpp>

namespace godot_js_runtime {

bool has_javascript_script_extension(const godot::String &path);
godot::PackedStringArray javascript_script_extensions();

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_JAVASCRIPT_SCRIPT_PATH_HPP
