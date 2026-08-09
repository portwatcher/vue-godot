#ifndef GODOT_JS_RUNTIME_RUNTIME_HOST_HPP
#define GODOT_JS_RUNTIME_RUNTIME_HOST_HPP

#include <cstddef>
#include <cstdint>
#include <functional>
#include <memory>
#include <optional>
#include <string>
#include <vector>

#include "godot_js_runtime/runtime/resource_provider.hpp"
#include "quickjs.h"

namespace godot_js_runtime {

class RuntimeModuleProvider;

struct RuntimeOptions {
	std::size_t memory_limit_bytes = 64 * 1024 * 1024;
	std::size_t stack_limit_bytes = 1024 * 1024;
	std::uint64_t interrupt_interval_milliseconds = 1;
	std::uint64_t execution_timeout_milliseconds = 1000;
	std::size_t max_jobs_per_pump = 10000;
	bool abort_on_leaks = false;
};

struct JavaScriptException {
	std::string name;
	std::string message;
	std::string stack;
	std::string source;
	int line = 0;
	int column = 0;
	bool source_mapped = false;
};

struct EvaluationResult {
	bool ok = false;
	std::string value;
	std::optional<JavaScriptException> exception;
	std::size_t jobs_executed = 0;
};

using JavaScriptOperation = std::function<JSValue(JSContext *)>;

std::string format_exception(const JavaScriptException &exception);

class RuntimeHost {
public:
	RuntimeHost(
			ResourceProvider &resource_provider,
			ConsoleSink &console_sink,
			RuntimeOptions options = {},
			RuntimeModuleProvider *module_provider = nullptr);
	~RuntimeHost();

	RuntimeHost(const RuntimeHost &) = delete;
	RuntimeHost &operator=(const RuntimeHost &) = delete;
	RuntimeHost(RuntimeHost &&) noexcept;
	RuntimeHost &operator=(RuntimeHost &&) noexcept;

	EvaluationResult evaluate_script(
			const std::string &source,
			const std::string &source_path = "res://eval.js");
	EvaluationResult evaluate_module(const std::string &entry_path);
	EvaluationResult evaluate_commonjs(const std::string &entry_path);
	EvaluationResult evaluate_module_default(
			const std::string &entry_path,
			JSValue &default_export);
	EvaluationResult evaluate_commonjs_default(
			const std::string &entry_path,
			JSValue &default_export);
	EvaluationResult run_javascript_operation(
			const std::string &source_path,
			const JavaScriptOperation &operation,
			JSValue *result = nullptr);
	EvaluationResult pump_jobs();

	void request_interrupt();
	void collect_garbage();
	std::size_t memory_usage_bytes() const;
	void shutdown();
	bool is_running() const;
	bool is_executing() const;
	std::string initialization_error() const;
	JSContext *javascript_context() const noexcept;

	static std::size_t live_runtime_count();
	static std::string runtime_version();
	static std::string quickjs_version();
	static const std::vector<std::string> &runtime_features();

private:
	struct Impl;
	std::unique_ptr<Impl> impl;
};

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_RUNTIME_HOST_HPP
