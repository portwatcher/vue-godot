#ifndef GODOT_JS_RUNTIME_MODULE_FORMAT_HPP
#define GODOT_JS_RUNTIME_MODULE_FORMAT_HPP

#include <string>
#include <string_view>

namespace godot_js_runtime {

inline constexpr std::string_view COMMONJS_BUNDLE_BANNER =
		"/*! godotjs:format=commonjs */";

enum class JavaScriptModuleFormat {
	ES_MODULE,
	COMMONJS,
};

JavaScriptModuleFormat detect_javascript_module_format(
		const std::string &resource_path,
		const std::string &source);

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_MODULE_FORMAT_HPP
