#ifndef GODOT_JS_RUNTIME_JAVASCRIPT_PROJECT_RUNTIME_HPP
#define GODOT_JS_RUNTIME_JAVASCRIPT_PROJECT_RUNTIME_HPP

#include <cstddef>
#include <cstdint>
#include <memory>
#include <string>

#include <gdextension_interface.h>
#include <godot_cpp/classes/global_constants.hpp>
#include <godot_cpp/variant/string_name.hpp>
#include <godot_cpp/variant/variant.hpp>

namespace godot_js_runtime {

class JavaScriptScript;
class JavaScriptScriptInstance;
struct EvaluationResult;

class JavaScriptProjectRuntime {
public:
	JavaScriptProjectRuntime();
	~JavaScriptProjectRuntime();

	JavaScriptProjectRuntime(const JavaScriptProjectRuntime &) = delete;
	JavaScriptProjectRuntime &operator=(const JavaScriptProjectRuntime &) = delete;

	godot::Error load_script(JavaScriptScript &script, bool keep_state);
	void forget_script(JavaScriptScript &script) noexcept;
	bool register_instance(JavaScriptScriptInstance &instance);
	void forget_instance(JavaScriptScriptInstance &instance) noexcept;
	bool has_instance(const JavaScriptScript &script, std::uint64_t owner_id) const;
	bool set_property(
			JavaScriptScriptInstance &instance,
			const godot::StringName &name,
			const godot::Variant &value);
	bool get_property(
			JavaScriptScriptInstance &instance,
			const godot::StringName &name,
			godot::Variant &result);
	bool call_method(
			JavaScriptScriptInstance &instance,
			const godot::StringName &method,
			const godot::Variant *const *arguments,
			int argument_count,
			godot::Variant &result,
			GDExtensionCallError &error);
	void notification(
			JavaScriptScriptInstance &instance,
			int32_t what,
			bool reversed);
	void invalidate_instance(JavaScriptScriptInstance &instance) noexcept;
	void reload_all(bool keep_state);
	EvaluationResult validate_source(
			const std::string &source,
			const std::string &path,
			bool module);
	void poll_file_changes();
	void pump_jobs();
	void shutdown() noexcept;
	bool is_running() const;
	std::size_t memory_usage_bytes() const;
	std::uint64_t initialization_time_microseconds() const;
	std::uint64_t first_module_evaluation_time_microseconds() const;
	void collect_garbage();

private:
	struct Impl;
	std::unique_ptr<Impl> impl;
};

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_JAVASCRIPT_PROJECT_RUNTIME_HPP
