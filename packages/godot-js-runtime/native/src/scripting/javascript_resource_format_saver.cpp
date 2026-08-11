#include "godot_js_runtime/scripting/javascript_resource_format_saver.hpp"

#include <godot_cpp/classes/file_access.hpp>

#include "godot_js_runtime/scripting/javascript_script.hpp"
#include "godot_js_runtime/scripting/javascript_script_path.hpp"

namespace godot_js_runtime {

void JavaScriptResourceFormatSaver::_bind_methods() {
}

godot::Error JavaScriptResourceFormatSaver::_save(
		const godot::Ref<godot::Resource> &resource,
		const godot::String &path,
		uint32_t flags) {
	(void)flags;
	const godot::Ref<JavaScriptScript> script = resource;
	if (script.is_null() || !has_javascript_script_extension(path)) {
		return godot::ERR_INVALID_PARAMETER;
	}
	godot::Ref<godot::FileAccess> file = godot::FileAccess::open(
			path,
			godot::FileAccess::WRITE);
	if (file.is_null()) {
		return godot::FileAccess::get_open_error();
	}
	file->store_string(script->_get_source_code());
	const godot::Error error = file->get_error();
	if (error == godot::OK) {
		script->set_source_path(path);
		script->mark_source_saved();
	}
	return error;
}

bool JavaScriptResourceFormatSaver::_recognize(
		const godot::Ref<godot::Resource> &resource) const {
	const godot::Ref<JavaScriptScript> script = resource;
	return script.is_valid();
}

godot::PackedStringArray JavaScriptResourceFormatSaver::_get_recognized_extensions(
		const godot::Ref<godot::Resource> &resource) const {
	godot::PackedStringArray extensions;
	if (_recognize(resource)) {
		return javascript_script_extensions();
	}
	return extensions;
}

bool JavaScriptResourceFormatSaver::_recognize_path(
		const godot::Ref<godot::Resource> &resource,
		const godot::String &path) const {
	return _recognize(resource) && has_javascript_script_extension(path);
}

} // namespace godot_js_runtime
