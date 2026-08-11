extends Node

var failed := false

func require_condition(condition: bool, message: String) -> bool:
	if condition:
		return true
	failed = true
	push_error("Phase 4 script contract failed: %s" % message)
	return false

func load_fresh(path: String):
	return ResourceLoader.load(path, "Script", ResourceLoader.CACHE_MODE_IGNORE)

func has_named_entry(entries: Array, name: StringName) -> bool:
	for entry in entries:
		if entry.get("name") == name:
			return true
	return false

func javascript_language():
	for index in range(Engine.get_script_language_count()):
		var language := Engine.get_script_language(index)
		if language.has_method("validate_source"):
			return language
	return null

func _ready() -> void:
	var language = javascript_language()
	require_condition(language != null, "JavaScript language registration")
	if language != null:
		var diagnostic: Dictionary = language.call(
			"validate_source",
			"export const valid = 1\nexport const broken = ;\n",
			"res://editor-diagnostic.mjs",
			true,
			true,
			true,
			true,
		)
		var errors: Array = diagnostic.get("errors", [])
		require_condition(not diagnostic.get("valid", true), "invalid syntax diagnostic")
		require_condition(errors.size() == 1, "single syntax diagnostic")
		if errors.size() == 1:
			require_condition(errors[0].get("line") == 2, "syntax diagnostic line")
			require_condition(
				errors[0].get("path") == "res://editor-diagnostic.mjs",
				"syntax diagnostic path",
			)
		var valid: Dictionary = language.call(
			"validate_source",
			"export function ready() { return true }\n",
			"res://editor-valid.mjs",
			true,
			true,
			true,
			true,
		)
		require_condition(valid.get("valid", false), "valid editor source")
		require_condition(valid.get("functions", []).has("ready:1"), "function metadata")
		require_condition(valid.get("safe_lines", []).has(1), "safe-line metadata")
		print("[godotjs] PHASE5_EDITOR_DIAGNOSTICS PASS")

	var plain: Script = load_fresh("res://plain.js")
	require_condition(plain != null and plain.can_instantiate(), ".js default class export")
	require_condition(plain.get_instance_base_type() == &"Node", ".js base class")
	var plain_node := Node.new()
	plain_node.set_script(plain)
	require_condition(plain_node.call("echo", "ok") == "plain:ok", ".js method dispatch")
	plain_node.free()

	var common_js: Script = load_fresh("res://binding.cjs")
	require_condition(common_js != null and common_js.can_instantiate(), ".cjs default class export")
	var attached: Script = load_fresh("res://attached.mjs")
	require_condition(attached != null and attached.can_instantiate(), ".mjs default class export")
	require_condition(
		has_named_entry(attached.get_script_method_list(), &"ping"),
		"reflected method list",
	)
	require_condition(
		has_named_entry(attached.get_script_property_list(), &"speed"),
		"reflected property list",
	)
	require_condition(
		has_named_entry(attached.get_script_signal_list(), &"moved"),
		"reflected signal list",
	)
	require_condition(attached.get_property_default_value(&"speed") == 240.0, "property default")
	var rpc: Dictionary = attached.get_rpc_config()
	require_condition(rpc.has("ping"), "RPC method metadata")
	require_condition(rpc["ping"].get("rpc_mode") == 1, "RPC mode metadata")
	var tool_script: Script = load_fresh("res://tool-script.mjs")
	require_condition(tool_script != null and tool_script.is_tool(), "tool script metadata")

	var saved_path := "user://godot-js-runtime-phase4-saved.js"
	var original_source := plain.source_code
	require_condition(ResourceSaver.save(plain, saved_path) == OK, "JavaScript ResourceSaver")
	require_condition(
		FileAccess.get_file_as_string(saved_path) == original_source,
		"ResourceSaver source round trip",
	)
	print("[godotjs] PHASE4_LANGUAGE_CONTRACT PASS js mjs cjs metadata tool saver")

	var incompatible: Script = load_fresh("res://incompatible-base.mjs")
	require_condition(incompatible != null and incompatible.can_instantiate(), "incompatible script load")
	var incompatible_node := Node.new()
	incompatible_node.set_script(incompatible)
	incompatible_node.free()
	print("[godotjs] PHASE4_EXPECTED_INCOMPATIBLE_BASE")

	require_condition(load_fresh("res://invalid-export.mjs") == null, "invalid default export rejected")
	require_condition(load_fresh("res://missing-default.mjs") == null, "missing default export rejected")
	require_condition(load_fresh("res://syntax-error.mjs") == null, "syntax error rejected")
	print("[godotjs] PHASE4_EXPECTED_SCRIPT_ERRORS")

	var mapped_script: Script = load_fresh("res://dist/source-map-error.mjs")
	require_condition(mapped_script != null, "source-map fixture load")
	var mapped_node := Node.new()
	mapped_node.set_script(mapped_script)
	add_child(mapped_node)
	await get_tree().process_frame
	if language != null:
		var debug_error: String = language.call("get_last_error")
		var stack: Array = language.call("get_current_stack_info")
		require_condition(
			debug_error.contains("res://src/source-map-probe.ts:10:5"),
			"source-mapped debugger error",
		)
		require_condition(stack.size() == 1, "source-mapped debugger stack")
		if stack.size() == 1:
			require_condition(
				stack[0].get("file") == "res://src/source-map-probe.ts",
				"source-mapped stack file",
			)
			require_condition(stack[0].get("line") == 10, "source-mapped stack line")
	mapped_node.free()
	print("[godotjs] PHASE5_SOURCE_MAP_ERROR PASS")

	require_condition(
		ProjectSettings.get_setting("godotjs/runtime/memory_limit_mb") == 96,
		"memory-limit project setting",
	)
	require_condition(
		ProjectSettings.get_setting("godotjs/runtime/maximum_stack_size_kb") == 768,
		"stack-limit project setting",
	)
	require_condition(
		ProjectSettings.get_setting("godotjs/runtime/interrupt_interval_milliseconds") == 2,
		"interrupt-interval project setting",
	)
	require_condition(
		ProjectSettings.get_setting("godotjs/runtime/execution_timeout_milliseconds") == 4000,
		"execution-timeout project setting",
	)
	require_condition(
		ProjectSettings.get_setting("godotjs/runtime/maximum_promise_jobs_per_frame") == 12000,
		"Promise-job project setting",
	)
	print("[godotjs] PHASE4_PROJECT_SETTINGS PASS")
	get_tree().quit(0 if not failed else 1)
