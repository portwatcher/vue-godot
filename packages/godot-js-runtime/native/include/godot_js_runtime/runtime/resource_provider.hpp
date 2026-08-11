#ifndef GODOT_JS_RUNTIME_RESOURCE_PROVIDER_HPP
#define GODOT_JS_RUNTIME_RESOURCE_PROVIDER_HPP

#include <string>

namespace godot_js_runtime {

class ResourceProvider {
public:
	virtual ~ResourceProvider() = default;

	virtual bool exists(const std::string &path) const noexcept = 0;
	virtual bool read_text(
			const std::string &path,
			std::string &contents,
			std::string &error) const noexcept = 0;
};

enum class ConsoleLevel {
	DEBUG,
	LOG,
	INFO,
	WARNING,
	ERROR,
};

struct ConsoleMessage {
	ConsoleLevel level = ConsoleLevel::LOG;
	std::string source;
	std::string text;
};

class ConsoleSink {
public:
	virtual ~ConsoleSink() = default;
	virtual void write(const ConsoleMessage &message) noexcept = 0;
};

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_RESOURCE_PROVIDER_HPP
