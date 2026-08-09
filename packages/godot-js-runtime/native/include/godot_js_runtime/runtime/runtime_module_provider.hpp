#ifndef GODOT_JS_RUNTIME_RUNTIME_MODULE_PROVIDER_HPP
#define GODOT_JS_RUNTIME_RUNTIME_MODULE_PROVIDER_HPP

#include <string>
#include <vector>

#include "quickjs.h"

namespace godot_js_runtime {

// A provider is owned by the caller and must outlive the RuntimeHost using it.
// It may expose native-backed virtual modules without coupling the core host to
// Godot or another embedding API.
class RuntimeModuleProvider {
public:
	virtual ~RuntimeModuleProvider() = default;

	virtual bool supports_module(const std::string &specifier) const noexcept = 0;
	virtual bool install(JSContext *context, std::string &error) = 0;
	virtual JSModuleDef *load_es_module(
			JSContext *context,
			const std::string &specifier) = 0;
	virtual JSValue load_commonjs_module(
			JSContext *context,
			const std::string &specifier) = 0;
	virtual void after_garbage_collection(JSContext *) noexcept {
	}
	virtual void shutdown(JSContext *context) noexcept = 0;
	virtual const std::vector<std::string> &feature_names() const noexcept = 0;
};

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_RUNTIME_MODULE_PROVIDER_HPP
