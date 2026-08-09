#ifndef GODOT_JS_RUNTIME_JAVASCRIPT_RESOURCE_FORMAT_LOADER_HPP
#define GODOT_JS_RUNTIME_JAVASCRIPT_RESOURCE_FORMAT_LOADER_HPP

#include <cstdint>

#include <godot_cpp/classes/resource_format_loader.hpp>
#include <godot_cpp/variant/packed_string_array.hpp>
#include <godot_cpp/variant/string.hpp>
#include <godot_cpp/variant/string_name.hpp>
#include <godot_cpp/variant/variant.hpp>

namespace godot_js_runtime {

class JavaScriptResourceFormatLoader : public godot::ResourceFormatLoader {
	GDCLASS(JavaScriptResourceFormatLoader, godot::ResourceFormatLoader)

protected:
	static void _bind_methods();

public:
	[[nodiscard]] godot::PackedStringArray _get_recognized_extensions() const override;
	[[nodiscard]] bool _recognize_path(
			const godot::String &path,
			const godot::StringName &type) const override;
	[[nodiscard]] bool _handles_type(const godot::StringName &type) const override;
	[[nodiscard]] godot::String _get_resource_type(
			const godot::String &path) const override;
	[[nodiscard]] godot::Variant _load(
			const godot::String &path,
			const godot::String &original_path,
			bool use_sub_threads,
			int32_t cache_mode) const override;
};

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_JAVASCRIPT_RESOURCE_FORMAT_LOADER_HPP
