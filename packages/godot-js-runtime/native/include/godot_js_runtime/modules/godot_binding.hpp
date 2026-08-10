#ifndef GODOT_JS_RUNTIME_GODOT_BINDING_HPP
#define GODOT_JS_RUNTIME_GODOT_BINDING_HPP

#include <cstddef>
#include <cstdint>
#include <memory>
#include <string>
#include <vector>

#include <gdextension_interface.h>

#include "godot_js_runtime/runtime/resource_provider.hpp"
#include "godot_js_runtime/runtime/runtime_module_provider.hpp"

namespace godot {
class Variant;
} // namespace godot

namespace godot_js_runtime {

class GodotBinding final : public RuntimeModuleProvider {
public:
	explicit GodotBinding(ConsoleSink &console_sink);
	~GodotBinding() override;

	GodotBinding(const GodotBinding &) = delete;
	GodotBinding &operator=(const GodotBinding &) = delete;

	bool supports_module(const std::string &specifier) const noexcept override;
	bool install(JSContext *context, std::string &error) override;
	JSModuleDef *load_es_module(
			JSContext *context,
			const std::string &specifier) override;
	JSValue load_commonjs_module(
			JSContext *context,
			const std::string &specifier) override;
	void after_garbage_collection(JSContext *context) noexcept override;
	void shutdown(JSContext *context) noexcept override;
	const std::vector<std::string> &feature_names() const noexcept override;

	JSValue construct_script_instance(
			JSValueConst script_class,
			GDExtensionObjectPtr owner,
			std::uint64_t owner_id);
	JSValue variant_to_javascript(const godot::Variant &value);
	bool javascript_to_variant(
			JSValueConst value,
			const std::string &expected_type,
			godot::Variant &result,
			std::string &error);
	bool script_base_class(
			JSValueConst script_class,
			std::string &base_class,
			std::string &error) const;
	bool is_godot_class_prototype(JSValueConst value) const;

	static std::size_t live_wrapper_count();
	static std::size_t live_callback_root_count();

private:
	struct Impl;
	std::unique_ptr<Impl> impl;
};

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_GODOT_BINDING_HPP
