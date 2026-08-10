@tool
extends EditorPlugin

const PLAY_CYCLES := 3
const PLAY_TIMEOUT_MSEC := 20_000
const PLAY_MARKER := "user://godot-js-runtime-editor-play.log"
const TOOL_MARKER := "user://godot-js-runtime-tool-script.log"
const FILE_RELOAD_TIMEOUT_MSEC := 10_000

var loop_started := false

func _enter_tree() -> void:
	if loop_started:
		return
	loop_started = true
	call_deferred("_run_play_loop")

func _run_play_loop() -> void:
	await get_tree().process_frame
	var reset_marker := FileAccess.open(PLAY_MARKER, FileAccess.WRITE)
	if reset_marker == null:
		push_error("Editor play loop could not reset its completion marker")
		get_tree().quit(1)
		return
	reset_marker = null
	var reset_tool_marker := FileAccess.open(TOOL_MARKER, FileAccess.WRITE)
	if reset_tool_marker == null:
		push_error("Editor play loop could not reset its tool-script marker")
		get_tree().quit(1)
		return
	reset_tool_marker = null
	var editor := get_editor_interface()
	editor.open_scene_from_path("res://main.tscn")
	await get_tree().process_frame
	await get_tree().process_frame
	var edited_root := editor.get_edited_scene_root()
	if edited_root == null or edited_root.get_script() == null:
		push_error("Editor did not create a JavaScript script placeholder")
		get_tree().quit(1)
		return
	if edited_root.get("speed") != 321.0:
		push_error("Editor placeholder did not preserve the serialized speed property")
		get_tree().quit(1)
		return
	var placeholder_has_speed := false
	for property in edited_root.get_property_list():
		if property.get("name") == &"speed":
			placeholder_has_speed = true
			break
	if not placeholder_has_speed:
		push_error("Editor placeholder did not expose reflected JavaScript properties")
		get_tree().quit(1)
		return
	var tool_probe := edited_root.get_node_or_null("ToolScriptProbe")
	if (
		tool_probe == null
		or tool_probe.get_script() == null
		or not tool_probe.get_script().is_tool()
		or FileAccess.get_file_as_string(TOOL_MARKER) != "ready"
	):
		push_error("Editor did not instantiate the JavaScript tool script")
		get_tree().quit(1)
		return
	print("[godotjs] PHASE4_EDITOR_PLACEHOLDER PASS")
	var language = null
	for index in range(Engine.get_script_language_count()):
		var candidate := Engine.get_script_language(index)
		if candidate.has_method("validate_source"):
			language = candidate
			break
	if language == null:
		push_error("Editor could not find the JavaScript language")
		get_tree().quit(1)
		return
	var recognized: PackedStringArray = language.call("get_script_extensions")
	if not recognized.has("js") or not recognized.has("mjs") or not recognized.has("cjs"):
		push_error("Editor JavaScript file recognition is incomplete")
		get_tree().quit(1)
		return
	var templates: Array = language.call("get_script_templates", &"Node2D")
	if templates.size() < 2:
		push_error("Editor JavaScript templates are unavailable")
		get_tree().quit(1)
		return
	for template in templates:
		for key in [&"inherit", &"name", &"description", &"content", &"id", &"origin"]:
			if not template.has(key):
				push_error("Editor JavaScript template is missing %s" % key)
				get_tree().quit(1)
				return
	var generated: Script = language.call(
		"make_script_template",
		templates[0]["content"],
		"GeneratedPlayer",
		"Node2D",
	)
	if (
		generated == null
		or not generated.source_code.contains("class GeneratedPlayer extends Node2D")
	):
		push_error("Editor JavaScript template placeholders were not expanded")
		get_tree().quit(1)
		return
	if language.call("overrides_external_editor"):
		push_error("JavaScript language unexpectedly bypasses Godot's external editor")
		get_tree().quit(1)
		return
	var diagnostic: Dictionary = language.call(
		"validate_source",
		"export const valid = 1\nexport const broken = ;\n",
		"res://editor-plugin-diagnostic.mjs",
		true,
		true,
		true,
		true,
	)
	var diagnostic_errors: Array = diagnostic.get("errors", [])
	if (
		diagnostic.get("valid", true)
		or diagnostic_errors.size() != 1
		or diagnostic_errors[0].get("line") != 2
		or diagnostic_errors[0].get("path") != "res://editor-plugin-diagnostic.mjs"
	):
		push_error("Editor JavaScript diagnostics have an incorrect file or line")
		get_tree().quit(1)
		return
	print("[godotjs] PHASE5_EDITOR_LANGUAGE PASS")
	tool_probe.set("state", 99)
	var replacement := FileAccess.open("res://tool-script.mjs", FileAccess.WRITE)
	if replacement == null:
		push_error("Editor could not stage a JavaScript file-monitor reload")
		get_tree().quit(1)
		return
	replacement.store_string(FileAccess.get_file_as_string("res://tool-script-v2.source"))
	replacement = null
	var reload_deadline := Time.get_ticks_msec() + FILE_RELOAD_TIMEOUT_MSEC
	while (
		(tool_probe.call("generation") != 2 or tool_probe.get("state") != 99)
		and Time.get_ticks_msec() < reload_deadline
	):
		await get_tree().process_frame
	if tool_probe.call("generation") != 2 or tool_probe.get("state") != 99:
		push_error("Editor JavaScript file monitor did not preserve compatible state")
		get_tree().quit(1)
		return
	print("[godotjs] PHASE5_EDITOR_FILE_MONITOR PASS")
	var baseline_runtime_info := GodotJavaScriptRuntimeInfo.new()
	var baseline_wrappers := baseline_runtime_info.get_live_wrapper_count()
	var baseline_callbacks := baseline_runtime_info.get_live_callback_root_count()
	for cycle in range(PLAY_CYCLES):
		print("[godotjs] EDITOR_PLAY_START cycle=%d" % cycle)
		editor.play_main_scene()
		var start_deadline := Time.get_ticks_msec() + PLAY_TIMEOUT_MSEC
		while not editor.is_playing_scene() and Time.get_ticks_msec() < start_deadline:
			await get_tree().process_frame
		if not editor.is_playing_scene():
			push_error("Editor play cycle %d did not start" % cycle)
			get_tree().quit(1)
			return
		if editor.get_playing_scene() != "res://main.tscn":
			editor.stop_playing_scene()
			push_error("Editor play cycle %d started an unexpected scene" % cycle)
			get_tree().quit(1)
			return
		var stop_deadline := Time.get_ticks_msec() + PLAY_TIMEOUT_MSEC
		while editor.is_playing_scene() and Time.get_ticks_msec() < stop_deadline:
			await get_tree().process_frame
		if editor.is_playing_scene():
			editor.stop_playing_scene()
			push_error("Editor play cycle %d did not stop" % cycle)
			get_tree().quit(1)
			return
		var runtime_info := GodotJavaScriptRuntimeInfo.new()
		if runtime_info.get_live_runtime_count() != 1:
			push_error("Editor project runtime count changed after play cycle %d" % cycle)
			get_tree().quit(1)
			return
		if runtime_info.get_live_wrapper_count() != baseline_wrappers:
			push_error("Godot wrapper count changed after editor play cycle %d" % cycle)
			get_tree().quit(1)
			return
		if runtime_info.get_live_callback_root_count() != baseline_callbacks:
			push_error("Callback root count changed after editor play cycle %d" % cycle)
			get_tree().quit(1)
			return
		var marker_file := FileAccess.open(PLAY_MARKER, FileAccess.READ)
		if marker_file == null:
			push_error("Editor play cycle %d did not write its completion marker" % cycle)
			get_tree().quit(1)
			return
		var completed_cycles := 0
		while marker_file.get_position() < marker_file.get_length():
			marker_file.get_line()
			completed_cycles += 1
		marker_file = null
		if completed_cycles != cycle + 1:
			push_error(
				"Editor play cycle %d observed %d completed scene run(s)"
				% [cycle, completed_cycles]
			)
			get_tree().quit(1)
			return
		print("[godotjs] EDITOR_SCENE_READY cycle=%d" % cycle)
		print("[godotjs] EDITOR_PLAY_STOP cycle=%d" % cycle)
	print("[godotjs] PHASE4_EDITOR_PLAY_LOOP PASS")
	get_tree().quit(0)
