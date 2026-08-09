@tool
extends EditorPlugin

const PLAY_CYCLES := 3
const PLAY_TIMEOUT_MSEC := 20_000
const PLAY_MARKER := "user://godot-js-runtime-editor-play.log"

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
	var editor := get_editor_interface()
	for cycle in range(PLAY_CYCLES):
		print("[godot-js-runtime] EDITOR_PLAY_START cycle=%d" % cycle)
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
		var runtime_info = GodotJavaScriptRuntimeInfo.new()
		if runtime_info.get_live_runtime_count() != 0:
			push_error("QuickJS runtime leaked after editor play cycle %d" % cycle)
			get_tree().quit(1)
			return
		if runtime_info.get_live_wrapper_count() != 0:
			push_error("Godot wrapper leaked after editor play cycle %d" % cycle)
			get_tree().quit(1)
			return
		if runtime_info.get_live_callback_root_count() != 0:
			push_error("Callback root leaked after editor play cycle %d" % cycle)
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
		print("[godot-js-runtime] EDITOR_SCENE_READY cycle=%d" % cycle)
		print("[godot-js-runtime] EDITOR_PLAY_STOP cycle=%d" % cycle)
	print("[godot-js-runtime] PHASE2_EDITOR_PLAY_LOOP PASS")
	get_tree().quit(0)
