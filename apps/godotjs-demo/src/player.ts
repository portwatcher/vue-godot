import {
  Callable,
  Engine,
  Input,
  Node2D,
  OS,
  ResourceLoader,
  Vector2,
  print,
} from 'godot'
import { defineScript, runtimeVersion } from 'godot-js'

const successMarker = '[godotjs-demo] PHASE6_STANDALONE_DEMO PASS'
const exportSmokeFeature = 'godotjs_export_smoke'
const exportSuccessMarker = '[godotjs-export] STANDALONE PASS'

class StandalonePlayer extends Node2D {
  speed = 240
  private enteredTree = false
  private signalObserved = false

  _enter_tree(): void {
    this.enteredTree = true
  }

  _ready(): void {
    const resource = ResourceLoader.load('res://demo-data.tres')
    const callback = Callable.create((message: string) => {
      this.signalObserved = message === 'runtime-ready'
    })
    this.connect('runtime_ready', callback)
    this.emit_signal('runtime_ready', 'runtime-ready')
    this.disconnect('runtime_ready', callback)

    Promise.resolve().then(() => {
      if (!this.enteredTree || !this.signalObserved || !resource) {
        throw new Error(
          'Standalone lifecycle, signal, or resource check failed',
        )
      }
      print(successMarker)
      if (OS.has_feature(exportSmokeFeature)) {
        const godotVersion = String(Engine.get_version_info().get('string'))
        print(
          `${exportSuccessMarker} runtime=${runtimeVersion()} godot=${godotVersion} platform=${OS.get_name()}`,
        )
        if (OS.get_name() !== 'Web') this.get_tree().quit(0)
      }
    })
  }

  _process(delta: number): void {
    const direction = Input.get_vector(
      'ui_left',
      'ui_right',
      'ui_up',
      'ui_down',
    )
    const distance = this.speed * delta
    this.position = new Vector2(
      this.position.x + direction.x * distance,
      this.position.y + direction.y * distance,
    )
  }

  _exit_tree(): void {
    this.enteredTree = false
  }
}

export default defineScript(StandalonePlayer, {
  properties: {
    speed: {
      type: 'float',
      default: 240,
      hint: { range: [0, 1000, 1] },
    },
  },
  signals: {
    runtime_ready: [{ name: 'message', type: 'string' }],
  },
})
