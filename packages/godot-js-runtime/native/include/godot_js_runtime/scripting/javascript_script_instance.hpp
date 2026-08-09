#ifndef GODOT_JS_RUNTIME_JAVASCRIPT_SCRIPT_INSTANCE_HPP
#define GODOT_JS_RUNTIME_JAVASCRIPT_SCRIPT_INSTANCE_HPP

#include <cstdint>

#include <gdextension_interface.h>
#include <godot_cpp/classes/ref.hpp>

namespace godot_js_runtime {

class JavaScriptProjectRuntime;
class JavaScriptScript;

class JavaScriptScriptInstance {
public:
	JavaScriptScriptInstance(
			JavaScriptScript *script,
			GDExtensionObjectPtr owner,
			std::uint64_t owner_id);
	~JavaScriptScriptInstance();

	JavaScriptScriptInstance(const JavaScriptScriptInstance &) = delete;
	JavaScriptScriptInstance &operator=(const JavaScriptScriptInstance &) = delete;

	static void *create(JavaScriptScript *script, GDExtensionObjectPtr owner, std::uint64_t owner_id);

	JavaScriptScript *script() const;
	GDExtensionObjectPtr owner() const;
	std::uint64_t owner_id() const;
	bool is_active() const;
	void deactivate();

private:
	static GDExtensionBool set_property(
			GDExtensionScriptInstanceDataPtr instance,
			GDExtensionConstStringNamePtr name,
			GDExtensionConstVariantPtr value);
	static GDExtensionBool get_property(
			GDExtensionScriptInstanceDataPtr instance,
			GDExtensionConstStringNamePtr name,
			GDExtensionVariantPtr result);
	static const GDExtensionPropertyInfo *get_property_list(
			GDExtensionScriptInstanceDataPtr instance,
			uint32_t *count);
	static void free_property_list(
			GDExtensionScriptInstanceDataPtr instance,
			const GDExtensionPropertyInfo *list,
			uint32_t count);
	static GDExtensionBool property_can_revert(
			GDExtensionScriptInstanceDataPtr instance,
			GDExtensionConstStringNamePtr name);
	static GDExtensionBool property_get_revert(
			GDExtensionScriptInstanceDataPtr instance,
			GDExtensionConstStringNamePtr name,
			GDExtensionVariantPtr result);
	static GDExtensionObjectPtr get_owner(GDExtensionScriptInstanceDataPtr instance);
	static void get_property_state(
			GDExtensionScriptInstanceDataPtr instance,
			GDExtensionScriptInstancePropertyStateAdd add,
			void *userdata);
	static const GDExtensionMethodInfo *get_method_list(
			GDExtensionScriptInstanceDataPtr instance,
			uint32_t *count);
	static void free_method_list(
			GDExtensionScriptInstanceDataPtr instance,
			const GDExtensionMethodInfo *list,
			uint32_t count);
	static GDExtensionVariantType get_property_type(
			GDExtensionScriptInstanceDataPtr instance,
			GDExtensionConstStringNamePtr name,
			GDExtensionBool *valid);
	static GDExtensionBool has_method(
			GDExtensionScriptInstanceDataPtr instance,
			GDExtensionConstStringNamePtr name);
	static GDExtensionInt get_method_argument_count(
			GDExtensionScriptInstanceDataPtr instance,
			GDExtensionConstStringNamePtr name,
			GDExtensionBool *valid);
	static void call(
			GDExtensionScriptInstanceDataPtr instance,
			GDExtensionConstStringNamePtr method,
			const GDExtensionConstVariantPtr *arguments,
			GDExtensionInt argument_count,
			GDExtensionVariantPtr result,
			GDExtensionCallError *error);
	static void notification(
			GDExtensionScriptInstanceDataPtr instance,
			int32_t what,
			GDExtensionBool reversed);
	static void to_string(
			GDExtensionScriptInstanceDataPtr instance,
			GDExtensionBool *valid,
			GDExtensionStringPtr result);
	static void refcount_incremented(GDExtensionScriptInstanceDataPtr instance);
	static GDExtensionBool refcount_decremented(
			GDExtensionScriptInstanceDataPtr instance);
	static GDExtensionObjectPtr get_script(GDExtensionScriptInstanceDataPtr instance);
	static GDExtensionBool is_placeholder(GDExtensionScriptInstanceDataPtr instance);
	static GDExtensionScriptLanguagePtr get_language(
			GDExtensionScriptInstanceDataPtr instance);
	static void free_instance(GDExtensionScriptInstanceDataPtr instance);

	static const GDExtensionScriptInstanceInfo3 INSTANCE_INFO;

	godot::Ref<JavaScriptScript> script_resource;
	GDExtensionObjectPtr owner_pointer = nullptr;
	std::uint64_t owner_instance_id = 0;
	bool active = true;
};

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_JAVASCRIPT_SCRIPT_INSTANCE_HPP
