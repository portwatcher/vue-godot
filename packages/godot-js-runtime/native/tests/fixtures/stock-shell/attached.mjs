import { defineScript } from 'godot-js'
import {
  Callable,
  FileAccess,
  Input,
  InputEventAction,
  Label,
  Node,
  ResourceLoader,
  VBoxContainer,
} from 'godot'

const EDITOR_PLAY_MARKER = 'user://godot-js-runtime-editor-play.log'
const RELOAD_CYCLES = 8

function assertScript(condition, message) {
  if (!condition) {
    throw new Error(`JavaScript script integration failed: ${message}`)
  }
}

class RuntimeShellProbe extends Node {
  speed = 240
  readyCount = 0
  enterTreeCount = 0
  processCount = 0
  physicsProcessCount = 0
  inputCount = 0
  notificationCount = 0
  signalDistance = 0

  ping(value) {
    return `pong:${String(value)}`
  }

  _enter_tree() {
    this.enterTreeCount += 1
  }

  _notification() {
    this.notificationCount += 1
  }

  _ready() {
    this.readyCount += 1
    assertScript(this instanceof RuntimeShellProbe, 'script class identity')
    assertScript(this instanceof Node, 'generated Godot base identity')
    assertScript(this.enterTreeCount === 1, 'enter-tree callback count')
    assertScript(this.speed === 321, 'serialized exported property value')
    assertScript(this.ping('method') === 'pong:method', 'reflected method')
    const originalProcessMode = this.process_mode
    this.process_mode = originalProcessMode
    assertScript(
      this.process_mode === originalProcessMode,
      'inherited native property write falls through script metadata',
    )

    const propertyContainer = new VBoxContainer()
    for (let index = 0; index < 9; index += 1) {
      const propertyLabel = new Label()
      propertyLabel.set('text', `dynamic label ${String(index)}`)
      propertyContainer.add_child(propertyLabel)
    }
    this.add_child(propertyContainer)
    assertScript(
      propertyContainer.get_child_count() === 9,
      'dynamic Object.set labels enter the live scene tree',
    )

    const ephemeralTimer = this.get_tree().create_timer(0.001)
    ephemeralTimer.timeout.as_promise().then(() => {
      console.log('[godot-js-runtime] PHASE7_EPHEMERAL_SIGNAL PASS')
    })

    const moved = Callable.create((distance) => {
      this.signalDistance = distance
    })
    this.connect('moved', moved)
    this.emit_signal('moved', this.speed)
    assertScript(this.signalDistance === 321, 'reflected script signal')
    this.disconnect('moved', moved)

    this.set_process_input(true)
    this.call_deferred('dispatch_input_probe')
  }

  dispatch_input_probe() {
    const input = new InputEventAction()
    input.action = 'ui_accept'
    input.pressed = true
    Input.parse_input_event(input)
    const release = new InputEventAction()
    release.action = 'ui_accept'
    release.pressed = false
    Input.parse_input_event(release)

    const esmProbe = ResourceLoader.load(
      'res://main.mjs',
      'Script',
      ResourceLoader.CacheMode.CACHE_MODE_IGNORE,
    )
    assertScript(esmProbe !== null, 'ES module script resource')
    const commonJsProbe = ResourceLoader.load(
      'res://binding.cjs',
      'Script',
      ResourceLoader.CacheMode.CACHE_MODE_IGNORE,
    )
    assertScript(commonJsProbe !== null, 'CommonJS script resource')
    for (let iteration = 0; iteration < RELOAD_CYCLES; iteration += 1) {
      const loopProbe = ResourceLoader.load(
        'res://loop.mjs',
        'Script',
        ResourceLoader.CacheMode.CACHE_MODE_IGNORE,
      )
      assertScript(loopProbe !== null, `reload resource ${String(iteration)}`)
    }

    console.log(
      '[godot-js-runtime] PHASE4_SCRIPT_READY PASS lifecycle method property signal modules',
    )
  }

  _physics_process() {
    this.physicsProcessCount += 1
  }

  _input(event) {
    if (
      event instanceof InputEventAction &&
      String(event.action) === 'ui_accept'
    ) {
      this.inputCount += 1
    }
  }

  _process() {
    this.processCount += 1
    if (
      this.processCount < 4 ||
      (this.inputCount === 0 && this.processCount < 120)
    ) {
      return
    }
    assertScript(this.readyCount === 1, 'ready callback count')
    assertScript(this.notificationCount > 0, 'notification dispatch')
    assertScript(this.physicsProcessCount > 0, 'physics-process callback')
    if (this.inputCount === 0) {
      this.get_tree().quit(1)
    }
    assertScript(this.inputCount > 0, 'input callback')
    const marker = FileAccess.open(
      EDITOR_PLAY_MARKER,
      FileAccess.ModeFlags.READ_WRITE,
    )
    const markerFile =
      marker ??
      FileAccess.open(EDITOR_PLAY_MARKER, FileAccess.ModeFlags.WRITE_READ)
    assertScript(markerFile !== null, 'editor play completion marker')
    markerFile.seek_end()
    markerFile.store_line('ready')
    console.log('[godot-js-runtime] PHASE4_LIFECYCLE PASS')
    this.get_tree().quit(0)
  }

  _exit_tree() {
    console.log('[godot-js-runtime] PHASE4_EXIT_TREE PASS')
  }
}

export default defineScript(RuntimeShellProbe, {
  properties: {
    speed: {
      type: 'float',
      default: 240,
      hint: { range: [0, 1000, 1] },
    },
  },
  signals: {
    moved: [{ name: 'distance', type: 'float' }],
  },
  rpc: {
    ping: {
      rpc_mode: 1,
      call_local: true,
      transfer_mode: 2,
      channel: 0,
    },
  },
})
