#ifndef GODOT_JS_RUNTIME_GODOT_ENVIRONMENT_HPP
#define GODOT_JS_RUNTIME_GODOT_ENVIRONMENT_HPP

#include "godot_js_runtime/runtime/resource_provider.hpp"

namespace godot_js_runtime {

class GodotResourceProvider final : public ResourceProvider {
public:
	bool exists(const std::string &path) const noexcept override;
	bool read_text(
			const std::string &path,
			std::string &contents,
			std::string &error) const noexcept override;
};

class GodotConsoleSink final : public ConsoleSink {
public:
	void write(const ConsoleMessage &message) noexcept override;
};

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_GODOT_ENVIRONMENT_HPP
