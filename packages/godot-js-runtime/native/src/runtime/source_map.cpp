#include "godot_js_runtime/runtime/source_map.hpp"

#include <algorithm>
#include <cctype>
#include <cstdlib>
#include <map>
#include <regex>
#include <sstream>
#include <utility>

#include "godot_js_runtime/runtime/module_resolver.hpp"

namespace godot_js_runtime {

namespace {

struct JsonValue {
	enum class Type {
		NIL,
		BOOLEAN,
		NUMBER,
		STRING,
		ARRAY,
		OBJECT,
	};

	Type type = Type::NIL;
	bool boolean = false;
	double number = 0.0;
	std::string string;
	std::vector<JsonValue> array;
	std::map<std::string, JsonValue> object;
};

class JsonParser {
public:
	explicit JsonParser(const std::string &input) : input(input) {
	}

	bool parse(JsonValue &value, std::string &error) {
		skip_whitespace();
		if (!parse_value(value, error)) {
			return false;
		}
		skip_whitespace();
		if (position != input.size()) {
			error = "Unexpected trailing JSON data at byte " + std::to_string(position);
			return false;
		}
		return true;
	}

private:
	const std::string &input;
	std::size_t position = 0;

	void skip_whitespace() {
		while (position < input.size() &&
				std::isspace(static_cast<unsigned char>(input[position])) != 0) {
			++position;
		}
	}

	bool consume(char expected) {
		if (position >= input.size() || input[position] != expected) {
			return false;
		}
		++position;
		return true;
	}

	bool parse_value(JsonValue &value, std::string &error) {
		skip_whitespace();
		if (position >= input.size()) {
			error = "Unexpected end of JSON input";
			return false;
		}
		switch (input[position]) {
			case '{':
				return parse_object(value, error);
			case '[':
				return parse_array(value, error);
			case '"':
				value.type = JsonValue::Type::STRING;
				return parse_string(value.string, error);
			case 't':
				return parse_literal("true", JsonValue::Type::BOOLEAN, value, error, true);
			case 'f':
				return parse_literal("false", JsonValue::Type::BOOLEAN, value, error, false);
			case 'n':
				return parse_literal("null", JsonValue::Type::NIL, value, error, false);
			default:
				return parse_number(value, error);
		}
	}

	bool parse_object(JsonValue &value, std::string &error) {
		consume('{');
		value.type = JsonValue::Type::OBJECT;
		skip_whitespace();
		if (consume('}')) {
			return true;
		}
		while (true) {
			std::string key;
			if (!parse_string(key, error)) {
				return false;
			}
			skip_whitespace();
			if (!consume(':')) {
				error = "Expected ':' after JSON object key at byte " + std::to_string(position);
				return false;
			}
			JsonValue child;
			if (!parse_value(child, error)) {
				return false;
			}
			value.object.emplace(std::move(key), std::move(child));
			skip_whitespace();
			if (consume('}')) {
				return true;
			}
			if (!consume(',')) {
				error = "Expected ',' in JSON object at byte " + std::to_string(position);
				return false;
			}
			skip_whitespace();
		}
	}

	bool parse_array(JsonValue &value, std::string &error) {
		consume('[');
		value.type = JsonValue::Type::ARRAY;
		skip_whitespace();
		if (consume(']')) {
			return true;
		}
		while (true) {
			JsonValue child;
			if (!parse_value(child, error)) {
				return false;
			}
			value.array.push_back(std::move(child));
			skip_whitespace();
			if (consume(']')) {
				return true;
			}
			if (!consume(',')) {
				error = "Expected ',' in JSON array at byte " + std::to_string(position);
				return false;
			}
		}
	}

	static void append_utf8(std::string &output, unsigned int codepoint) {
		if (codepoint <= 0x7f) {
			output.push_back(static_cast<char>(codepoint));
		} else if (codepoint <= 0x7ff) {
			output.push_back(static_cast<char>(0xc0 | (codepoint >> 6)));
			output.push_back(static_cast<char>(0x80 | (codepoint & 0x3f)));
		} else {
			output.push_back(static_cast<char>(0xe0 | (codepoint >> 12)));
			output.push_back(static_cast<char>(0x80 | ((codepoint >> 6) & 0x3f)));
			output.push_back(static_cast<char>(0x80 | (codepoint & 0x3f)));
		}
	}

	bool parse_string(std::string &output, std::string &error) {
		if (!consume('"')) {
			error = "Expected JSON string at byte " + std::to_string(position);
			return false;
		}
		while (position < input.size()) {
			const char character = input[position++];
			if (character == '"') {
				return true;
			}
			if (character != '\\') {
				if (static_cast<unsigned char>(character) < 0x20) {
					error = "Unescaped control character in JSON string";
					return false;
				}
				output.push_back(character);
				continue;
			}
			if (position >= input.size()) {
				error = "Incomplete JSON escape sequence";
				return false;
			}
			const char escaped = input[position++];
			switch (escaped) {
				case '"':
				case '\\':
				case '/':
					output.push_back(escaped);
					break;
				case 'b':
					output.push_back('\b');
					break;
				case 'f':
					output.push_back('\f');
					break;
				case 'n':
					output.push_back('\n');
					break;
				case 'r':
					output.push_back('\r');
					break;
				case 't':
					output.push_back('\t');
					break;
				case 'u': {
					if (position + 4 > input.size()) {
						error = "Incomplete JSON Unicode escape";
						return false;
					}
					unsigned int codepoint = 0;
					for (int index = 0; index < 4; ++index) {
						const char digit = input[position++];
						codepoint <<= 4;
						if (digit >= '0' && digit <= '9') {
							codepoint += static_cast<unsigned int>(digit - '0');
						} else if (digit >= 'a' && digit <= 'f') {
							codepoint += static_cast<unsigned int>(digit - 'a' + 10);
						} else if (digit >= 'A' && digit <= 'F') {
							codepoint += static_cast<unsigned int>(digit - 'A' + 10);
						} else {
							error = "Invalid JSON Unicode escape";
							return false;
						}
					}
					append_utf8(output, codepoint);
					break;
				}
				default:
					error = "Invalid JSON escape sequence";
					return false;
			}
		}
		error = "Unterminated JSON string";
		return false;
	}

	bool parse_literal(
			const std::string &literal,
			JsonValue::Type type,
			JsonValue &value,
			std::string &error,
			bool boolean) {
		if (input.compare(position, literal.size(), literal) != 0) {
			error = "Invalid JSON token at byte " + std::to_string(position);
			return false;
		}
		position += literal.size();
		value.type = type;
		value.boolean = boolean;
		return true;
	}

	bool parse_number(JsonValue &value, std::string &error) {
		const char *start = input.c_str() + position;
		char *end = nullptr;
		const double number = std::strtod(start, &end);
		if (end == start) {
			error = "Invalid JSON number at byte " + std::to_string(position);
			return false;
		}
		position += static_cast<std::size_t>(end - start);
		value.type = JsonValue::Type::NUMBER;
		value.number = number;
		return true;
	}
};

const JsonValue *object_value(const JsonValue &object, const std::string &key) {
	const auto iterator = object.object.find(key);
	return iterator == object.object.end() ? nullptr : &iterator->second;
}

bool string_array(
		const JsonValue *value,
		std::vector<std::string> &output,
		const std::string &field,
		std::string &error) {
	if (value == nullptr || value->type != JsonValue::Type::ARRAY) {
		error = "Source map field '" + field + "' must be an array";
		return false;
	}
	for (const JsonValue &entry : value->array) {
		if (entry.type != JsonValue::Type::STRING) {
			error = "Source map field '" + field + "' must contain only strings";
			return false;
		}
		output.push_back(entry.string);
	}
	return true;
}

int base64_value(char character) {
	if (character >= 'A' && character <= 'Z') {
		return character - 'A';
	}
	if (character >= 'a' && character <= 'z') {
		return character - 'a' + 26;
	}
	if (character >= '0' && character <= '9') {
		return character - '0' + 52;
	}
	if (character == '+') {
		return 62;
	}
	if (character == '/') {
		return 63;
	}
	return -1;
}

bool decode_vlq(
		const std::string &segment,
		std::size_t &position,
		int &value,
		std::string &error) {
	int result = 0;
	int shift = 0;
	bool continuation = false;
	do {
		if (position >= segment.size()) {
			error = "Incomplete source-map VLQ value";
			return false;
		}
		int digit = base64_value(segment[position++]);
		if (digit < 0) {
			error = "Invalid base64 digit in source-map mappings";
			return false;
		}
		continuation = (digit & 32) != 0;
		digit &= 31;
		result += digit << shift;
		shift += 5;
		if (shift > 30) {
			error = "Source-map VLQ value exceeds supported integer range";
			return false;
		}
	} while (continuation);
	const bool negative = (result & 1) != 0;
	result >>= 1;
	value = negative ? -result : result;
	return true;
}

std::string resolve_source_path(
		const std::string &generated_path,
		const std::string &source_root,
		const std::string &source) {
	if (source.find("://") != std::string::npos && !is_resource_path(source)) {
		return source;
	}
	std::string specifier;
	if (!source_root.empty()) {
		specifier = source_root;
		if (specifier.back() != '/') {
			specifier += '/';
		}
	}
	specifier += source;
	if (!is_resource_path(specifier) &&
			!specifier.empty() && specifier.front() != '/') {
		specifier = "./" + specifier;
	}
	const ModuleResolution resolved = normalize_resource_path(generated_path, specifier);
	return resolved.ok ? resolved.path : source;
}

} // namespace

std::optional<SourceMap> SourceMap::parse(
		const std::string &json,
		const std::string &generated_path,
		std::string &error) {
	JsonValue root;
	JsonParser parser(json);
	if (!parser.parse(root, error)) {
		return std::nullopt;
	}
	if (root.type != JsonValue::Type::OBJECT) {
		error = "Source map root must be an object";
		return std::nullopt;
	}
	const JsonValue *version = object_value(root, "version");
	if (version == nullptr || version->type != JsonValue::Type::NUMBER ||
			version->number != 3.0) {
		error = "Only source map version 3 is supported";
		return std::nullopt;
	}
	const JsonValue *mappings_value = object_value(root, "mappings");
	if (mappings_value == nullptr || mappings_value->type != JsonValue::Type::STRING) {
		error = "Source map field 'mappings' must be a string";
		return std::nullopt;
	}

	SourceMap source_map;
	if (!string_array(object_value(root, "sources"), source_map.sources, "sources", error)) {
		return std::nullopt;
	}
	const JsonValue *names_value = object_value(root, "names");
	if (names_value != nullptr &&
			!string_array(names_value, source_map.names, "names", error)) {
		return std::nullopt;
	}
	std::string source_root;
	const JsonValue *source_root_value = object_value(root, "sourceRoot");
	if (source_root_value != nullptr) {
		if (source_root_value->type != JsonValue::Type::STRING) {
			error = "Source map field 'sourceRoot' must be a string";
			return std::nullopt;
		}
		source_root = source_root_value->string;
	}
	for (std::string &source : source_map.sources) {
		source = resolve_source_path(generated_path, source_root, source);
	}

	int source_index = 0;
	int original_line = 0;
	int original_column = 0;
	int name_index = 0;
	std::stringstream line_stream(mappings_value->string);
	std::string encoded_line;
	while (std::getline(line_stream, encoded_line, ';')) {
		std::vector<Segment> line;
		int generated_column = 0;
		std::stringstream segment_stream(encoded_line);
		std::string encoded_segment;
		while (std::getline(segment_stream, encoded_segment, ',')) {
			if (encoded_segment.empty()) {
				continue;
			}
			std::vector<int> fields;
			std::size_t position = 0;
			while (position < encoded_segment.size()) {
				int field = 0;
				if (!decode_vlq(encoded_segment, position, field, error)) {
					return std::nullopt;
				}
				fields.push_back(field);
			}
			if (fields.size() == 1) {
				generated_column += fields[0];
				continue;
			}
			if (fields.size() != 4 && fields.size() != 5) {
				error = "Source-map segment must contain one, four, or five fields";
				return std::nullopt;
			}
			generated_column += fields[0];
			source_index += fields[1];
			original_line += fields[2];
			original_column += fields[3];
			if (fields.size() == 5) {
				name_index += fields[4];
			}
			if (source_index < 0 ||
					static_cast<std::size_t>(source_index) >= source_map.sources.size()) {
				error = "Source-map segment references an invalid source index";
				return std::nullopt;
			}
			if (fields.size() == 5 &&
					(name_index < 0 ||
							static_cast<std::size_t>(name_index) >= source_map.names.size())) {
				error = "Source-map segment references an invalid name index";
				return std::nullopt;
			}
			line.push_back({
					generated_column,
					source_index,
					original_line,
					original_column,
					fields.size() == 5 ? name_index : -1,
			});
		}
		source_map.lines.push_back(std::move(line));
	}
	if (!mappings_value->string.empty() && mappings_value->string.back() == ';') {
		source_map.lines.emplace_back();
	}
	return source_map;
}

std::optional<SourcePosition> SourceMap::original_position(
		int generated_line,
		int generated_column) const {
	if (generated_line < 1 || generated_column < 1 ||
			static_cast<std::size_t>(generated_line) > lines.size()) {
		return std::nullopt;
	}
	const std::vector<Segment> &line = lines[static_cast<std::size_t>(generated_line - 1)];
	const int zero_based_column = generated_column - 1;
	const Segment *selected = nullptr;
	for (const Segment &segment : line) {
		if (segment.generated_column > zero_based_column) {
			break;
		}
		selected = &segment;
	}
	if (selected == nullptr) {
		return std::nullopt;
	}
	return SourcePosition{
		sources[static_cast<std::size_t>(selected->source_index)],
		selected->original_line + 1,
		selected->original_column + 1,
		selected->name_index >= 0
				? names[static_cast<std::size_t>(selected->name_index)]
				: std::string(),
	};
}

bool SourceMapRegistry::register_map(
		const std::string &generated_path,
		const std::string &map_json,
		std::string &error) {
	std::optional<SourceMap> source_map = SourceMap::parse(map_json, generated_path, error);
	if (!source_map.has_value()) {
		return false;
	}
	maps.insert_or_assign(generated_path, std::move(*source_map));
	return true;
}

std::optional<SourcePosition> SourceMapRegistry::original_position(
		const std::string &generated_path,
		int line,
		int column) const {
	const auto iterator = maps.find(generated_path);
	if (iterator == maps.end()) {
		return std::nullopt;
	}
	return iterator->second.original_position(line, column);
}

std::string SourceMapRegistry::remap_stack(const std::string &stack) const {
	static const std::regex location_pattern(R"((res://[^\s\)]+):(\d+):(\d+))");
	std::string remapped;
	std::size_t cursor = 0;
	for (std::sregex_iterator iterator(stack.begin(), stack.end(), location_pattern), end;
			iterator != end;
			++iterator) {
		const std::smatch &match = *iterator;
		remapped.append(stack, cursor, static_cast<std::size_t>(match.position()) - cursor);
		const std::string path = match[1].str();
		const int line = std::stoi(match[2].str());
		const int column = std::stoi(match[3].str());
		const std::optional<SourcePosition> original = original_position(path, line, column);
		if (original.has_value()) {
			remapped += original->source + ":" + std::to_string(original->line) + ":" +
					std::to_string(original->column);
		} else {
			remapped += match.str();
		}
		cursor = static_cast<std::size_t>(match.position() + match.length());
	}
	remapped.append(stack, cursor, std::string::npos);
	return remapped;
}

void SourceMapRegistry::clear() {
	maps.clear();
}

std::optional<std::string> find_source_mapping_url(const std::string &source) {
	const std::vector<std::string> markers = {
		"//# sourceMappingURL=",
		"//@ sourceMappingURL=",
		"/*# sourceMappingURL=",
	};
	std::size_t selected_position = std::string::npos;
	std::string selected_marker;
	for (const std::string &marker : markers) {
		const std::size_t position = source.rfind(marker);
		if (position != std::string::npos &&
				(selected_position == std::string::npos || position > selected_position)) {
			selected_position = position;
			selected_marker = marker;
		}
	}
	if (selected_position == std::string::npos) {
		return std::nullopt;
	}
	const std::size_t value_start = selected_position + selected_marker.size();
	std::size_t value_end = source.find_first_of("\r\n", value_start);
	if (selected_marker.rfind("/*", 0) == 0) {
		const std::size_t comment_end = source.find("*/", value_start);
		if (comment_end != std::string::npos &&
				(value_end == std::string::npos || comment_end < value_end)) {
			value_end = comment_end;
		}
	}
	std::string url = source.substr(
			value_start,
			value_end == std::string::npos ? std::string::npos : value_end - value_start);
	while (!url.empty() && std::isspace(static_cast<unsigned char>(url.back())) != 0) {
		url.pop_back();
	}
	return url.empty() ? std::nullopt : std::optional<std::string>(url);
}

} // namespace godot_js_runtime
