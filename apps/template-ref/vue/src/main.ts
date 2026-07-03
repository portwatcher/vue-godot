import { createApp } from '@vue-godot/runtime-tscn'
import { Control } from 'godot'
import Test from './Test.vue'

export default class App extends Control {
  private app: ReturnType<typeof createApp> | null = null

  _ready() {
    this.app?.unmount()
    const app = createApp(Test)
    app.mount(this)
    this.app = app
  }

  _exit_tree() {
    this.app?.unmount()
    this.app = null
  }
}
