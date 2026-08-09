extends Node

const TARGET := "res://reload-probe.mjs"
const VERSION_TWO := "res://reload-probe-v2.source"
const VERSION_THREE := "res://reload-probe-v3.source"

var failed := false

func require_condition(condition: bool, message: String) -> bool:
	if condition:
		return true
	failed = true
	push_error("Phase 4 reload contract failed: %s" % message)
	return false

func replace_source(source_path: String) -> bool:
	var source := FileAccess.get_file_as_string(source_path)
	if source.is_empty():
		return require_condition(false, "could not read %s" % source_path)
	var target := FileAccess.open(TARGET, FileAccess.WRITE)
	if target == null:
		return require_condition(false, "could not open reload target")
	target.store_string(source)
	target = null
	return true

func _ready() -> void:
	await get_tree().process_frame
	var probe := $ReloadProbe
	if not require_condition(probe.state == 11, "initial property default"):
		get_tree().quit(1)
		return
	probe.state = 777
	var deferred_result = probe.call("request_soft_reload")
	if not require_condition(deferred_result == OK, "deferred reload request"):
		get_tree().quit(1)
		return
	await get_tree().process_frame
	await get_tree().process_frame
	if not require_condition(probe.call("generation") == 1, "deferred reload generation"):
		get_tree().quit(1)
		return
	if not require_condition(probe.state == 777, "deferred soft state preservation"):
		get_tree().quit(1)
		return
	var runtime_info := GodotJavaScriptRuntimeInfo.new()
	if not require_condition(
		runtime_info.get_live_callback_root_count() == 0,
		"reload disconnected old callback roots",
	):
		get_tree().quit(1)
		return
	print("[godot-js-runtime] PHASE4_DEFERRED_RELOAD PASS")

	if not replace_source(VERSION_TWO):
		get_tree().quit(1)
		return
	var script: Script = probe.get_script()
	if not require_condition(script.reload(true) == OK, "compatible soft reload"):
		get_tree().quit(1)
		return
	if not require_condition(probe.call("generation") == 2, "compatible source replacement"):
		get_tree().quit(1)
		return
	if not require_condition(probe.state == 777, "compatible property state"):
		get_tree().quit(1)
		return
	print("[godot-js-runtime] PHASE4_SOFT_RELOAD PASS")

	if not replace_source(VERSION_THREE):
		get_tree().quit(1)
		return
	if not require_condition(script.reload(true) == OK, "incompatible soft reload"):
		get_tree().quit(1)
		return
	if not require_condition(probe.call("generation") == 3, "incompatible source replacement"):
		get_tree().quit(1)
		return
	if not require_condition(probe.state == Vector2(3, 4), "incompatible state reset"):
		get_tree().quit(1)
		return
	print("[godot-js-runtime] PHASE4_INCOMPATIBLE_STATE PASS")

	probe.state = Vector2(9, 9)
	if not require_condition(script.reload(false) == OK, "hard reload"):
		get_tree().quit(1)
		return
	if not require_condition(probe.state == Vector2(3, 4), "hard reload state reset"):
		get_tree().quit(1)
		return
	print("[godot-js-runtime] PHASE4_HARD_RELOAD PASS")

	var in_memory_source := FileAccess.get_file_as_string(VERSION_TWO)
	script.source_code = in_memory_source
	if not require_condition(script.reload(true) == OK, "in-memory source reload"):
		get_tree().quit(1)
		return
	if not require_condition(probe.call("generation") == 2, "in-memory source used"):
		get_tree().quit(1)
		return
	if not require_condition(probe.state == 22, "in-memory incompatible state reset"):
		get_tree().quit(1)
		return
	print("[godot-js-runtime] PHASE4_IN_MEMORY_RELOAD PASS")

	probe.queue_free()
	await get_tree().process_frame
	if not require_condition(
		runtime_info.get_live_callback_root_count() == 0,
		"callback roots after pre-delete",
	):
		get_tree().quit(1)
		return
	print("[godot-js-runtime] PHASE4_PREDELETE PASS")
	get_tree().quit(0 if not failed else 1)
