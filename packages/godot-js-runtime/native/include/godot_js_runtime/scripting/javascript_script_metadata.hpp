#ifndef GODOT_JS_RUNTIME_JAVASCRIPT_SCRIPT_METADATA_HPP
#define GODOT_JS_RUNTIME_JAVASCRIPT_SCRIPT_METADATA_HPP

#include <string>
#include <vector>

#include <godot_cpp/core/object.hpp>
#include <godot_cpp/core/property_info.hpp>
#include <godot_cpp/variant/dictionary.hpp>
#include <godot_cpp/variant/string_name.hpp>
#include <godot_cpp/variant/variant.hpp>

namespace godot_js_runtime {

struct JavaScriptPropertyDefinition {
	godot::PropertyInfo info;
	std::string javascript_type;
	godot::Variant default_value;
	bool has_default = false;
};

struct JavaScriptMethodDefinition {
	godot::MethodInfo info;
	int argument_count = 0;
};

struct JavaScriptScriptMetadata {
	godot::StringName base_class;
	std::vector<JavaScriptPropertyDefinition> properties;
	std::vector<JavaScriptMethodDefinition> methods;
	std::vector<godot::MethodInfo> signals;
	godot::Dictionary rpc_config;
	bool tool = false;
};

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_JAVASCRIPT_SCRIPT_METADATA_HPP
