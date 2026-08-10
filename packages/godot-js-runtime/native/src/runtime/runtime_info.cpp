#include "godot_js_runtime/runtime/runtime_info.hpp"

#include <godot_cpp/core/class_db.hpp>
#include <godot_cpp/classes/script.hpp>

#include "godot_js_runtime/modules/godot_binding.hpp"
#include "godot_js_runtime/runtime/runtime_host.hpp"
#include "godot_js_runtime/scripting/javascript_language.hpp"
#include "godot_js_runtime/scripting/javascript_project_runtime.hpp"
#include "godot_js_runtime/version.hpp"

namespace godot_js_runtime {

void GodotJavaScriptRuntimeInfo::_bind_methods() {
	godot::ClassDB::bind_method(
			godot::D_METHOD("get_product_name"),
			&GodotJavaScriptRuntimeInfo::get_product_name);
	godot::ClassDB::bind_method(
			godot::D_METHOD("get_package_name"),
			&GodotJavaScriptRuntimeInfo::get_package_name);
	godot::ClassDB::bind_method(
			godot::D_METHOD("get_runtime_version"),
			&GodotJavaScriptRuntimeInfo::get_runtime_version);
	godot::ClassDB::bind_method(
			godot::D_METHOD("get_minimum_godot_version"),
			&GodotJavaScriptRuntimeInfo::get_minimum_godot_version);
	godot::ClassDB::bind_method(
			godot::D_METHOD("get_live_runtime_count"),
			&GodotJavaScriptRuntimeInfo::get_live_runtime_count);
	godot::ClassDB::bind_method(
			godot::D_METHOD("get_live_wrapper_count"),
			&GodotJavaScriptRuntimeInfo::get_live_wrapper_count);
	godot::ClassDB::bind_method(
			godot::D_METHOD("get_live_callback_root_count"),
			&GodotJavaScriptRuntimeInfo::get_live_callback_root_count);
	godot::ClassDB::bind_method(
			godot::D_METHOD("get_memory_usage_bytes"),
			&GodotJavaScriptRuntimeInfo::get_memory_usage_bytes);
	godot::ClassDB::bind_method(
			godot::D_METHOD("get_initialization_time_usec"),
			&GodotJavaScriptRuntimeInfo::get_initialization_time_usec);
	godot::ClassDB::bind_method(
			godot::D_METHOD("get_first_module_evaluation_time_usec"),
			&GodotJavaScriptRuntimeInfo::get_first_module_evaluation_time_usec);
	godot::ClassDB::bind_method(
			godot::D_METHOD("collect_garbage"),
			&GodotJavaScriptRuntimeInfo::collect_garbage);
	godot::ClassDB::bind_method(
			godot::D_METHOD("is_initialized"),
			&GodotJavaScriptRuntimeInfo::is_initialized);
}

void GodotJavaScriptRuntimeInfo::set_initialized(bool value) {
	initialized.store(value, std::memory_order_release);
}

godot::String GodotJavaScriptRuntimeInfo::get_product_name() const {
	return PRODUCT_NAME;
}

godot::String GodotJavaScriptRuntimeInfo::get_package_name() const {
	return PACKAGE_NAME;
}

godot::String GodotJavaScriptRuntimeInfo::get_runtime_version() const {
	return VERSION;
}

godot::String GodotJavaScriptRuntimeInfo::get_minimum_godot_version() const {
	return MINIMUM_GODOT_VERSION;
}

int64_t GodotJavaScriptRuntimeInfo::get_live_runtime_count() const {
	return static_cast<int64_t>(RuntimeHost::live_runtime_count());
}

int64_t GodotJavaScriptRuntimeInfo::get_live_wrapper_count() const {
	return static_cast<int64_t>(GodotBinding::live_wrapper_count());
}

int64_t GodotJavaScriptRuntimeInfo::get_live_callback_root_count() const {
	return static_cast<int64_t>(GodotBinding::live_callback_root_count());
}

int64_t GodotJavaScriptRuntimeInfo::get_memory_usage_bytes() const {
	JavaScriptLanguage *language = JavaScriptLanguage::get_singleton();
	JavaScriptProjectRuntime *runtime = language == nullptr
			? nullptr
			: language->project_runtime();
	return runtime == nullptr
			? 0
			: static_cast<int64_t>(runtime->memory_usage_bytes());
}

int64_t GodotJavaScriptRuntimeInfo::get_initialization_time_usec() const {
	JavaScriptLanguage *language = JavaScriptLanguage::get_singleton();
	JavaScriptProjectRuntime *runtime = language == nullptr
			? nullptr
			: language->project_runtime();
	return runtime == nullptr
			? 0
			: static_cast<int64_t>(runtime->initialization_time_microseconds());
}

int64_t GodotJavaScriptRuntimeInfo::get_first_module_evaluation_time_usec() const {
	JavaScriptLanguage *language = JavaScriptLanguage::get_singleton();
	JavaScriptProjectRuntime *runtime = language == nullptr
			? nullptr
			: language->project_runtime();
	return runtime == nullptr
			? 0
			: static_cast<int64_t>(
					runtime->first_module_evaluation_time_microseconds());
}

void GodotJavaScriptRuntimeInfo::collect_garbage() const {
	JavaScriptLanguage *language = JavaScriptLanguage::get_singleton();
	JavaScriptProjectRuntime *runtime = language == nullptr
			? nullptr
			: language->project_runtime();
	if (runtime != nullptr) {
		runtime->collect_garbage();
	}
}

bool GodotJavaScriptRuntimeInfo::is_initialized() const {
	return initialized.load(std::memory_order_acquire);
}

} // namespace godot_js_runtime
