#ifndef GODOT_JS_RUNTIME_JAVASCRIPT_RESOURCE_FORMAT_SAVER_HPP
#define GODOT_JS_RUNTIME_JAVASCRIPT_RESOURCE_FORMAT_SAVER_HPP

#include <godot_cpp/classes/resource_format_saver.hpp>

namespace godot_js_runtime {

class JavaScriptResourceFormatSaver : public godot::ResourceFormatSaver {
	GDCLASS(JavaScriptResourceFormatSaver, godot::ResourceFormatSaver)

public:
	godot::Error _save(
			const godot::Ref<godot::Resource> &resource,
			const godot::String &path,
			uint32_t flags) override;
	bool _recognize(const godot::Ref<godot::Resource> &resource) const override;
	godot::PackedStringArray _get_recognized_extensions(
			const godot::Ref<godot::Resource> &resource) const override;
	bool _recognize_path(
			const godot::Ref<godot::Resource> &resource,
			const godot::String &path) const override;

protected:
	static void _bind_methods();
};

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_JAVASCRIPT_RESOURCE_FORMAT_SAVER_HPP
