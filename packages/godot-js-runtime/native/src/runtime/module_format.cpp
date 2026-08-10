#include "godot_js_runtime/runtime/module_format.hpp"

#include <algorithm>
#include <cctype>

namespace godot_js_runtime {

namespace {

std::string lowercase_extension(const std::string &resource_path) {
	const std::size_t slash = resource_path.find_last_of('/');
	const std::size_t dot = resource_path.find_last_of('.');
	if (dot == std::string::npos ||
			(slash != std::string::npos && dot < slash)) {
		return {};
	}
	std::string extension = resource_path.substr(dot + 1);
	std::transform(
			extension.begin(),
			extension.end(),
			extension.begin(),
			[](unsigned char character) {
				return static_cast<char>(std::tolower(character));
			});
	return extension;
}

bool starts_with_commonjs_banner(const std::string &source) {
	std::size_t offset = source.compare(0, 3, "\xEF\xBB\xBF") == 0 ? 3 : 0;
	const auto skip_whitespace = [&source, &offset]() {
		while (offset < source.size() &&
				std::isspace(static_cast<unsigned char>(source[offset])) != 0) {
			++offset;
		}
	};
	skip_whitespace();
	for (const std::string_view directive : {
			 std::string_view("\"use strict\";"),
			 std::string_view("'use strict';"),
	 }) {
		if (source.compare(offset, directive.size(), directive) == 0) {
			offset += directive.size();
			skip_whitespace();
			break;
		}
	}
	return source.compare(
				offset,
				COMMONJS_BUNDLE_BANNER.size(),
				COMMONJS_BUNDLE_BANNER) == 0;
}

} // namespace

JavaScriptModuleFormat detect_javascript_module_format(
		const std::string &resource_path,
		const std::string &source) {
	const std::string extension = lowercase_extension(resource_path);
	if (extension == "cjs") {
		return JavaScriptModuleFormat::COMMONJS;
	}
	if (extension == "js" && starts_with_commonjs_banner(source)) {
		return JavaScriptModuleFormat::COMMONJS;
	}
	return JavaScriptModuleFormat::ES_MODULE;
}

} // namespace godot_js_runtime
