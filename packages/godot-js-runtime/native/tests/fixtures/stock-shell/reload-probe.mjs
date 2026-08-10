import { Callable, Node } from 'godot'
import { defineScript } from 'godot-js'

class ReloadProbe extends Node {
  state = 11

  generation() {
    return 1
  }

  request_soft_reload() {
    Promise.resolve().then(() => {
      console.error('[godotjs] STALE_RELOAD_PROMISE_EXECUTED')
    })
    const timer = this.get_tree().create_timer(60)
    timer.timeout.connect(Callable.create(() => {
      console.error('[godotjs] STALE_RELOAD_TIMER_EXECUTED')
    }))
    return this.get_script().reload(true)
  }
}

export default defineScript(ReloadProbe, {
  properties: {
    state: { type: 'int', default: 11 },
  },
})
