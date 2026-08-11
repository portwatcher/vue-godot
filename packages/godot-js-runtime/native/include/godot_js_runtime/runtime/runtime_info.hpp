#ifndef GODOT_JS_RUNTIME_RUNTIME_INFO_HPP
#define GODOT_JS_RUNTIME_RUNTIME_INFO_HPP

#include <atomic>
#include <cstdint>

#include <godot_cpp/classes/ref_counted.hpp>
#include <godot_cpp/variant/string.hpp>

namespace godot_js_runtime {

class GodotJavaScriptRuntimeInfo : public godot::RefCounted {
	GDCLASS(GodotJavaScriptRuntimeInfo, godot::RefCounted)

private:
	inline static std::atomic_bool initialized = false;

protected:
	static void _bind_methods();

public:
	static void set_initialized(bool value);

	godot::String get_product_name() const;
	godot::String get_package_name() const;
	godot::String get_runtime_version() const;
	godot::String get_minimum_godot_version() const;
	int64_t get_live_runtime_count() const;
	int64_t get_live_wrapper_count() const;
	int64_t get_live_callback_root_count() const;
	int64_t get_memory_usage_bytes() const;
	int64_t get_initialization_time_usec() const;
	int64_t get_first_module_evaluation_time_usec() const;
	void collect_garbage() const;
	bool is_initialized() const;
};

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_RUNTIME_INFO_HPP
