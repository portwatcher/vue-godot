import { Callable, Input, Node2D, ResourceLoader, Vector2, print } from 'godot'
import { defineScript } from 'godot-js'

const successMarker = '[godot-js-runtime-demo] PHASE6_STANDALONE_DEMO PASS'

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
