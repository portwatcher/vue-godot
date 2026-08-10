#include "godot_js_runtime/runtime/module_resolver.hpp"

#include <algorithm>
#include <sstream>

namespace godot_js_runtime {

namespace {

constexpr char RESOURCE_PREFIX[] = "res://";
constexpr char RUNTIME_MODULE[] = "godot-js";
constexpr char COMPATIBILITY_MODULE[] = "godot-jsb";

bool has_scheme(const std::string &path) {
	return path.find("://") != std::string::npos;
}

bool has_extension(const std::string &path) {
	const std::size_t slash = path.find_last_of('/');
	const std::size_t dot = path.find_last_of('.');
	return dot != std::string::npos &&
			(slash == std::string::npos || dot > slash + 1);
}

std::vector<std::string> candidates_for(
		const std::string &path,
		ModuleKind kind) {
	std::vector<std::string> candidates = { path };
	if (has_extension(path)) {
		return candidates;
	}

	const std::vector<std::string> extensions = kind == ModuleKind::ES_MODULE
			? std::vector<std::string>{ ".mjs", ".js", ".json" }
			: std::vector<std::string>{ ".cjs", ".js", ".json" };
	for (const std::string &extension : extensions) {
		candidates.push_back(path + extension);
	}
	for (const std::string &extension : extensions) {
		candidates.push_back(path + "/index" + extension);
	}
	return candidates;
}

} // namespace

bool is_resource_path(const std::string &path) {
	return path.rfind(RESOURCE_PREFIX, 0) == 0;
}

std::string resource_directory(const std::string &path) {
	if (!is_resource_path(path)) {
		return {};
	}
	const std::size_t slash = path.find_last_of('/');
	if (slash == std::string::npos || slash < sizeof(RESOURCE_PREFIX) - 1) {
		return RESOURCE_PREFIX;
	}
	return path.substr(0, slash);
}

ModuleResolution normalize_resource_path(
		const std::string &base_path,
		const std::string &specifier) {
	if (specifier.empty()) {
		return { false, false, {}, "Module specifier is empty" };
	}
	if (specifier == RUNTIME_MODULE || specifier == COMPATIBILITY_MODULE) {
		return { true, true, specifier, {} };
	}
	if (specifier.find('\\') != std::string::npos) {
		return { false, false, {}, "Backslashes are not allowed in resource module paths" };
	}
	if (specifier.find('?') != std::string::npos ||
			specifier.find('#') != std::string::npos) {
		return { false, false, {}, "Query strings and fragments are not supported in resource module paths" };
	}
	if (has_scheme(specifier) && !is_resource_path(specifier)) {
		return { false, false, {}, "Only res:// module URLs are supported: " + specifier };
	}

	std::string unresolved;
	if (is_resource_path(specifier)) {
		unresolved = specifier.substr(sizeof(RESOURCE_PREFIX) - 1);
	} else if (!specifier.empty() && specifier.front() == '/') {
		unresolved = specifier.substr(1);
	} else if (specifier.rfind("./", 0) == 0 ||
			specifier.rfind("../", 0) == 0 || specifier == "." ||
			specifier == "..") {
		if (!is_resource_path(base_path)) {
			return { false, false, {}, "Relative module specifier has no res:// base: " + specifier };
		}
		const std::string base_directory = resource_directory(base_path);
		unresolved = base_directory.substr(sizeof(RESOURCE_PREFIX) - 1);
		if (!unresolved.empty()) {
			unresolved += '/';
		}
		unresolved += specifier;
	} else {
		return { false, false, {}, "Unsupported bare module specifier: " + specifier };
	}

	std::vector<std::string> parts;
	std::stringstream stream(unresolved);
	std::string part;
	while (std::getline(stream, part, '/')) {
		if (part.empty() || part == ".") {
			continue;
		}
		if (part == "..") {
			if (parts.empty()) {
				return { false, false, {}, "Module path escapes the res:// root: " + specifier };
			}
			parts.pop_back();
			continue;
		}
		parts.push_back(part);
	}

	std::string normalized = RESOURCE_PREFIX;
	for (std::size_t index = 0; index < parts.size(); ++index) {
		if (index > 0) {
			normalized += '/';
		}
		normalized += parts[index];
	}
	return { true, false, normalized, {} };
}

ModuleResolution resolve_module(
		const std::string &base_path,
		const std::string &specifier,
		ModuleKind kind,
		const ResourceExists &exists) {
	ModuleResolution normalized = normalize_resource_path(base_path, specifier);
	if (!normalized.ok || normalized.virtual_module) {
		return normalized;
	}

	for (const std::string &candidate : candidates_for(normalized.path, kind)) {
		if (exists(candidate)) {
			return { true, false, candidate, {} };
		}
	}
	return {
		false,
		false,
		{},
		"Cannot resolve module '" + specifier + "' from '" + base_path + "'",
	};
}

const std::vector<std::string> &runtime_feature_names() {
	static const std::vector<std::string> features = {
		"commonjs",
		"esm",
		"json-modules",
		"promise-jobs",
		"quickjs-ng",
		"resource-modules",
		"source-maps",
	};
	return features;
}

} // namespace godot_js_runtime
