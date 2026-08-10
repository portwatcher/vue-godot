#include "godot_js_runtime/runtime/godot_environment.hpp"

#include <utility>

#include <godot_cpp/classes/file_access.hpp>
#include <godot_cpp/variant/string.hpp>
#include <godot_cpp/variant/utility_functions.hpp>

#include "godot_js_runtime/runtime/string_conversion.hpp"

namespace godot_js_runtime {

namespace {

const char *console_level_name(ConsoleLevel level) {
	switch (level) {
		case ConsoleLevel::DEBUG:
			return "debug";
		case ConsoleLevel::LOG:
			return "log";
		case ConsoleLevel::INFO:
			return "info";
		case ConsoleLevel::WARNING:
			return "warn";
		case ConsoleLevel::ERROR:
			return "error";
	}
	return "log";
}

} // namespace

void GodotResourceProvider::set_text_override(
		std::string path,
		std::string contents) {
	text_overrides.insert_or_assign(std::move(path), std::move(contents));
}

void GodotResourceProvider::clear_text_override(const std::string &path) {
	text_overrides.erase(path);
}

void GodotResourceProvider::clear_text_overrides() {
	text_overrides.clear();
}

bool GodotResourceProvider::exists(const std::string &path) const noexcept {
	return text_overrides.count(path) > 0 ||
			godot::FileAccess::file_exists(godot_string(path));
}

bool GodotResourceProvider::read_text(
		const std::string &path,
		std::string &contents,
		std::string &error) const noexcept {
	const auto overridden = text_overrides.find(path);
	if (overridden != text_overrides.end()) {
		contents = overridden->second;
		return true;
	}
	const godot::String godot_path = godot_string(path);
	godot::Ref<godot::FileAccess> file = godot::FileAccess::open(
			godot_path,
			godot::FileAccess::READ);
	if (file.is_null()) {
		error = "Godot FileAccess could not open " + path;
		return false;
	}
	contents = standard_string(file->get_as_text());
	const godot::Error file_error = file->get_error();
	if (file_error != godot::OK && file_error != godot::ERR_FILE_EOF) {
		error = "Godot FileAccess failed while reading " + path +
				" (error " + std::to_string(static_cast<int>(file_error)) + ")";
		return false;
	}
	return true;
}

void GodotConsoleSink::write(const ConsoleMessage &message) noexcept {
	const godot::String formatted = godot_string(
			"[godot-js-runtime][console." +
			std::string(console_level_name(message.level)) + "][" + message.source +
			"] " + message.text);
	switch (message.level) {
		case ConsoleLevel::ERROR:
			godot::UtilityFunctions::push_error(formatted);
			break;
		case ConsoleLevel::WARNING:
			godot::UtilityFunctions::push_warning(formatted);
			break;
		case ConsoleLevel::DEBUG:
			godot::UtilityFunctions::print_verbose(formatted);
			break;
		case ConsoleLevel::LOG:
		case ConsoleLevel::INFO:
			godot::UtilityFunctions::print(formatted);
			break;
	}
}

} // namespace godot_js_runtime
