import { Engine, FileAccess, Node } from 'godot'
import { defineScript } from 'godot-js'

class ToolScriptProbe extends Node {
  state = 41

  generation() {
    return 1
  }

  _ready() {
    if (Engine.is_editor_hint()) {
      const marker = FileAccess.open(
        'user://godot-js-runtime-tool-script.log',
        FileAccess.ModeFlags.WRITE,
      )
      marker.store_string('ready')
      console.log('[godotjs] PHASE4_TOOL_SCRIPT PASS')
    }
  }
}

export default defineScript(ToolScriptProbe, {
  tool: true,
  properties: {
    state: { type: 'int', default: 41 },
  },
})
