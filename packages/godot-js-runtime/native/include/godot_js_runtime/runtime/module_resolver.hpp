#ifndef GODOT_JS_RUNTIME_MODULE_RESOLVER_HPP
#define GODOT_JS_RUNTIME_MODULE_RESOLVER_HPP

#include <functional>
#include <string>
#include <vector>

namespace godot_js_runtime {

enum class ModuleKind {
	ES_MODULE,
	COMMONJS,
};

struct ModuleResolution {
	bool ok = false;
	bool virtual_module = false;
	std::string path;
	std::string error;
};

using ResourceExists = std::function<bool(const std::string &)>;

bool is_resource_path(const std::string &path);
std::string resource_directory(const std::string &path);
ModuleResolution normalize_resource_path(
		const std::string &base_path,
		const std::string &specifier);
ModuleResolution resolve_module(
		const std::string &base_path,
		const std::string &specifier,
		ModuleKind kind,
		const ResourceExists &exists);
const std::vector<std::string> &runtime_feature_names();

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_MODULE_RESOLVER_HPP
