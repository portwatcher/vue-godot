#include "godot_js_runtime/runtime/runtime_project_settings.hpp"

#include <algorithm>
#include <cstdint>
#include <string>

#include <godot_cpp/classes/project_settings.hpp>
#include <godot_cpp/core/property_info.hpp>
#include <godot_cpp/variant/dictionary.hpp>
#include <godot_cpp/variant/utility_functions.hpp>

namespace godot_js_runtime {

namespace {

struct IntegerSetting {
	const char *name;
	std::int64_t default_value;
	std::int64_t minimum;
	std::int64_t maximum;
	const char *suffix;
};

constexpr IntegerSetting SETTINGS[] = {
	{ runtime_project_setting::MEMORY_LIMIT_MB, 128, 16, 4096, " MB" },
	{ runtime_project_setting::MAXIMUM_STACK_SIZE_KB, 1024, 256, 16384, " KB" },
	{ runtime_project_setting::INTERRUPT_INTERVAL_MILLISECONDS, 1, 0, 1000, " ms" },
	{ runtime_project_setting::EXECUTION_TIMEOUT_MILLISECONDS, 5000, 0, 600000, " ms" },
	{ runtime_project_setting::MAXIMUM_PROMISE_JOBS_PER_FRAME, 10000, 1, 1000000, "" },
};

const IntegerSetting &setting_definition(const char *name) {
	const auto found = std::find_if(
			std::begin(SETTINGS),
			std::end(SETTINGS),
			[name](const IntegerSetting &setting) {
				return std::string(setting.name) == name;
			});
	return found == std::end(SETTINGS) ? SETTINGS[0] : *found;
}

std::int64_t read_setting(
		godot::ProjectSettings *settings,
		const IntegerSetting &definition) {
	if (settings == nullptr) {
		return definition.default_value;
	}
	const godot::Variant value = settings->get_setting(
			definition.name,
			definition.default_value);
	if (value.get_type() != godot::Variant::INT) {
		godot::UtilityFunctions::push_warning(
				"GodotJS ignored non-integer project setting ",
				definition.name,
				" and used ",
				definition.default_value);
		return definition.default_value;
	}
	const std::int64_t converted = value;
	if (converted < definition.minimum || converted > definition.maximum) {
		godot::UtilityFunctions::push_warning(
				"GodotJS ignored out-of-range project setting ",
				definition.name,
				"=",
				converted,
				" and used ",
				definition.default_value);
		return definition.default_value;
	}
	return converted;
}

} // namespace

void register_runtime_project_settings() {
	godot::ProjectSettings *settings = godot::ProjectSettings::get_singleton();
	if (settings == nullptr) {
		return;
	}
	for (const IntegerSetting &definition : SETTINGS) {
		if (!settings->has_setting(definition.name)) {
			settings->set_setting(definition.name, definition.default_value);
		}
		settings->set_initial_value(definition.name, definition.default_value);
		settings->set_as_basic(definition.name, true);
		godot::Dictionary property;
		property["name"] = definition.name;
		property["type"] = godot::Variant::INT;
		property["hint"] = godot::PROPERTY_HINT_RANGE;
		property["hint_string"] =
				godot::String::num_int64(definition.minimum) + "," +
				godot::String::num_int64(definition.maximum) + ",1" +
				definition.suffix;
		settings->add_property_info(property);
	}
}

RuntimeOptions runtime_options_from_project_settings() {
	godot::ProjectSettings *settings = godot::ProjectSettings::get_singleton();
	RuntimeOptions options;
	const std::uint64_t memory_limit_mb = static_cast<std::uint64_t>(read_setting(
			settings,
			setting_definition(runtime_project_setting::MEMORY_LIMIT_MB)));
	const std::uint64_t stack_limit_kb = static_cast<std::uint64_t>(read_setting(
			settings,
			setting_definition(runtime_project_setting::MAXIMUM_STACK_SIZE_KB)));
	options.memory_limit_bytes = static_cast<std::size_t>(memory_limit_mb * 1024U * 1024U);
	options.stack_limit_bytes = static_cast<std::size_t>(stack_limit_kb * 1024U);
	options.interrupt_interval_milliseconds = static_cast<std::uint64_t>(read_setting(
			settings,
			setting_definition(runtime_project_setting::INTERRUPT_INTERVAL_MILLISECONDS)));
	options.execution_timeout_milliseconds = static_cast<std::uint64_t>(read_setting(
			settings,
			setting_definition(runtime_project_setting::EXECUTION_TIMEOUT_MILLISECONDS)));
	options.max_jobs_per_pump = static_cast<std::size_t>(read_setting(
			settings,
			setting_definition(runtime_project_setting::MAXIMUM_PROMISE_JOBS_PER_FRAME)));
	return options;
}

} // namespace godot_js_runtime
