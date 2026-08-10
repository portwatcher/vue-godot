#ifndef GODOT_JS_RUNTIME_RUNTIME_PROJECT_SETTINGS_HPP
#define GODOT_JS_RUNTIME_RUNTIME_PROJECT_SETTINGS_HPP

#include "godot_js_runtime/runtime/runtime_host.hpp"

namespace godot_js_runtime {

namespace runtime_project_setting {

inline constexpr char MEMORY_LIMIT_MB[] =
		"godotjs/runtime/memory_limit_mb";
inline constexpr char MAXIMUM_STACK_SIZE_KB[] =
		"godotjs/runtime/maximum_stack_size_kb";
inline constexpr char INTERRUPT_INTERVAL_MILLISECONDS[] =
		"godotjs/runtime/interrupt_interval_milliseconds";
inline constexpr char EXECUTION_TIMEOUT_MILLISECONDS[] =
		"godotjs/runtime/execution_timeout_milliseconds";
inline constexpr char MAXIMUM_PROMISE_JOBS_PER_FRAME[] =
		"godotjs/runtime/maximum_promise_jobs_per_frame";

} // namespace runtime_project_setting

void register_runtime_project_settings();
RuntimeOptions runtime_options_from_project_settings();

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_RUNTIME_PROJECT_SETTINGS_HPP
