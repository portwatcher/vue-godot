#ifndef GODOT_JS_RUNTIME_SOURCE_MAP_HPP
#define GODOT_JS_RUNTIME_SOURCE_MAP_HPP

#include <optional>
#include <string>
#include <unordered_map>
#include <vector>

namespace godot_js_runtime {

struct SourcePosition {
	std::string source;
	int line = 0;
	int column = 0;
	std::string name;
};

class SourceMap {
public:
	static std::optional<SourceMap> parse(
			const std::string &json,
			const std::string &generated_path,
			std::string &error);

	std::optional<SourcePosition> original_position(
			int generated_line,
			int generated_column) const;

private:
	struct Segment {
		int generated_column = 0;
		int source_index = 0;
		int original_line = 0;
		int original_column = 0;
		int name_index = -1;
	};

	std::vector<std::string> sources;
	std::vector<std::string> names;
	std::vector<std::vector<Segment>> lines;
};

class SourceMapRegistry {
public:
	bool register_map(
			const std::string &generated_path,
			const std::string &map_json,
			std::string &error);
	std::optional<SourcePosition> original_position(
			const std::string &generated_path,
			int line,
			int column) const;
	std::string remap_stack(const std::string &stack) const;
	void clear();

private:
	std::unordered_map<std::string, SourceMap> maps;
};

std::optional<std::string> find_source_mapping_url(const std::string &source);

} // namespace godot_js_runtime

#endif // GODOT_JS_RUNTIME_SOURCE_MAP_HPP
