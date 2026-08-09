#include <gdextension_interface.h>

#include <godot_cpp/classes/engine.hpp>
#include <godot_cpp/classes/resource_loader.hpp>
#include <godot_cpp/classes/resource_saver.hpp>
#include <godot_cpp/core/class_db.hpp>
#include <godot_cpp/core/memory.hpp>
#include <godot_cpp/godot.hpp>
#include <godot_cpp/variant/utility_functions.hpp>

#include "godot_js_runtime/runtime/runtime_info.hpp"
#include "godot_js_runtime/runtime/runtime_project_settings.hpp"
#include "godot_js_runtime/scripting/javascript_language.hpp"
#include "godot_js_runtime/scripting/javascript_resource_format_loader.hpp"
#include "godot_js_runtime/scripting/javascript_resource_format_saver.hpp"
#include "godot_js_runtime/scripting/javascript_script.hpp"
#include "godot_js_runtime/version.hpp"

namespace godot_js_runtime {

namespace {

godot::Ref<JavaScriptResourceFormatLoader> javascript_loader;
godot::Ref<JavaScriptResourceFormatSaver> javascript_saver;
JavaScriptLanguage *javascript_language = nullptr;
bool javascript_loader_registered = false;
bool javascript_saver_registered = false;
bool javascript_language_registered = false;

} // namespace

void initialize_runtime(godot::ModuleInitializationLevel level) {
	if (level != godot::MODULE_INITIALIZATION_LEVEL_SCENE) {
		return;
	}

	GDREGISTER_CLASS(GodotJavaScriptRuntimeInfo);

	GDREGISTER_INTERNAL_CLASS(JavaScriptLanguage);
	GDREGISTER_INTERNAL_CLASS(JavaScriptScript);
	GDREGISTER_INTERNAL_CLASS(JavaScriptResourceFormatLoader);
	GDREGISTER_INTERNAL_CLASS(JavaScriptResourceFormatSaver);
	register_runtime_project_settings();

	javascript_language = memnew(JavaScriptLanguage);
	const godot::Error language_error =
			godot::Engine::get_singleton()->register_script_language(
					javascript_language);
	if (language_error != godot::OK) {
		godot::UtilityFunctions::push_error(
				"Godot JavaScript Runtime could not register its script language (error ",
				static_cast<int64_t>(language_error),
				")");
		memdelete(javascript_language);
		javascript_language = nullptr;
		return;
	}
	javascript_language_registered = true;

	javascript_loader.instantiate();
	godot::ResourceLoader::get_singleton()->add_resource_format_loader(
			javascript_loader,
			true);
	javascript_loader_registered = true;
	javascript_saver.instantiate();
	godot::ResourceSaver::get_singleton()->add_resource_format_saver(
			javascript_saver,
			true);
	javascript_saver_registered = true;
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
	if (javascript_saver_registered && javascript_saver.is_valid() &&
			godot::ResourceSaver::get_singleton() != nullptr) {
		godot::ResourceSaver::get_singleton()->remove_resource_format_saver(
				javascript_saver);
		javascript_saver.unref();
		javascript_saver_registered = false;
	}
	if (javascript_loader_registered && javascript_loader.is_valid() &&
			godot::ResourceLoader::get_singleton() != nullptr) {
		godot::ResourceLoader::get_singleton()->remove_resource_format_loader(
				javascript_loader);
		javascript_loader.unref();
		javascript_loader_registered = false;
	}
	if (javascript_language_registered && javascript_language != nullptr &&
			godot::Engine::get_singleton() != nullptr) {
		const godot::Error language_error =
				godot::Engine::get_singleton()->unregister_script_language(
						javascript_language);
		if (language_error != godot::OK) {
			godot::UtilityFunctions::push_error(
					"Godot JavaScript Runtime could not unregister its script language (error ",
					static_cast<int64_t>(language_error),
					")");
		}
		javascript_language_registered = false;
	}
	if (javascript_language != nullptr) {
		memdelete(javascript_language);
		javascript_language = nullptr;
	}
	godot::UtilityFunctions::print(
			"[godot-js-runtime] TERMINATED ", VERSION,
			" with script language and resource handlers removed");
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
