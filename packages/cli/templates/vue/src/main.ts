import { createApp } from '@vue-godot/runtime-tscn'
import { VBoxContainer } from 'godot'
import App from './App.vue'

export default class Root extends VBoxContainer {
  private app: ReturnType<typeof createApp> | null = null

  _ready() {
    this.app?.unmount()
    const app = createApp(App)
    app.mount(this)
    this.app = app
  }

  _exit_tree() {
    this.app?.unmount()
    this.app = null
  }
}
