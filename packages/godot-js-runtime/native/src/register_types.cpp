#include <gdextension_interface.h>

#include <godot_cpp/classes/engine.hpp>
#include <godot_cpp/classes/resource_loader.hpp>
#include <godot_cpp/core/class_db.hpp>
#include <godot_cpp/godot.hpp>
#include <godot_cpp/variant/utility_functions.hpp>

#include "godot_js_runtime/runtime/runtime_info.hpp"
#include "godot_js_runtime/scripting/javascript_resource_format_loader.hpp"
#include "godot_js_runtime/version.hpp"

namespace godot_js_runtime {

namespace {

godot::Ref<JavaScriptResourceFormatLoader> javascript_loader;
bool javascript_loader_registered = false;

} // namespace

void initialize_runtime(godot::ModuleInitializationLevel level) {
	if (level != godot::MODULE_INITIALIZATION_LEVEL_SCENE) {
		return;
	}

	GDREGISTER_CLASS(GodotJavaScriptRuntimeInfo);

	if (!godot::Engine::get_singleton()->is_editor_hint()) {
		GDREGISTER_INTERNAL_CLASS(JavaScriptResourceFormatLoader);
		javascript_loader.instantiate();
		godot::ResourceLoader::get_singleton()->add_resource_format_loader(
				javascript_loader,
				true);
		javascript_loader_registered = true;
	} else {
		godot::UtilityFunctions::print(
				"[godot-js-runtime] phase-one script loader deferred in editor mode");
	}
	GodotJavaScriptRuntimeInfo::set_initialized(true);
	godot::UtilityFunctions::print(
			"[godot-js-runtime] INITIALIZED ", VERSION,
			" at scene initialization level");
}

void uninitialize_runtime(godot::ModuleInitializationLevel level) {
	if (level != godot::MODULE_INITIALIZATION_LEVEL_SCENE) {
		return;
	}

	GodotJavaScriptRuntimeInfo::set_initialized(false);
	if (javascript_loader_registered && javascript_loader.is_valid() &&
			godot::ResourceLoader::get_singleton() != nullptr) {
		godot::ResourceLoader::get_singleton()->remove_resource_format_loader(
				javascript_loader);
		javascript_loader.unref();
		javascript_loader_registered = false;
	}
	godot::UtilityFunctions::print(
			"[godot-js-runtime] TERMINATED ", VERSION,
			" with resource loader removed");
}

} // namespace godot_js_runtime

extern "C" {

GDExtensionBool GDE_EXPORT godot_js_runtime_library_init(
		GDExtensionInterfaceGetProcAddress get_proc_address,
		GDExtensionClassLibraryPtr library,
		GDExtensionInitialization *initialization) {
	godot::GDExtensionBinding::InitObject init(
			get_proc_address,
			library,
			initialization);
	init.register_initializer(godot_js_runtime::initialize_runtime);
	init.register_terminator(godot_js_runtime::uninitialize_runtime);
	init.set_minimum_library_initialization_level(
			godot::MODULE_INITIALIZATION_LEVEL_SCENE);
	return init.init();
}

}
