#ifndef GODOT_JS_RUNTIME_RUNTIME_INFO_HPP
#define GODOT_JS_RUNTIME_RUNTIME_INFO_HPP

#include <atomic>

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
	bool is_initialized() const;
};

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_RUNTIME_INFO_HPP
