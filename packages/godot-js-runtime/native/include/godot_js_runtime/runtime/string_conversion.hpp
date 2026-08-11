#ifndef GODOT_JS_RUNTIME_STRING_CONVERSION_HPP
#define GODOT_JS_RUNTIME_STRING_CONVERSION_HPP

#include <cstddef>
#include <cstdint>
#include <string>

#include <godot_cpp/variant/string.hpp>
#include <godot_cpp/variant/string_name.hpp>

namespace godot_js_runtime {

inline std::string standard_string(const godot::String &value) {
	const godot::CharString utf8 = value.utf8();
	return std::string(utf8.get_data(), static_cast<std::size_t>(utf8.length()));
}

inline std::string standard_string(const godot::StringName &value) {
	return standard_string(static_cast<godot::String>(value));
}

inline godot::String godot_string(const std::string &value) {
	return godot::String::utf8(
			value.c_str(),
			static_cast<std::int64_t>(value.size()));
}

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_STRING_CONVERSION_HPP
