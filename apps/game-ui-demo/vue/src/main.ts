import { installBrowserAPIs } from '@vue-godot/browser'
import { htmlPlugin } from '@vue-godot/html'
import { createApp } from '@vue-godot/runtime-tscn'
import { OS, VBoxContainer } from 'godot'
import App from './App.vue'

installBrowserAPIs()

const SMOKE_ENV = 'VUE_GODOT_SMOKE'
const SMOKE_PASS_MARKER = '[vue-godot-smoke] game-ui-demo passed'

function isSmokeEnabled(): boolean {
  return OS.has_environment(SMOKE_ENV) && OS.get_environment(SMOKE_ENV) !== '0'
}

export default class Root extends VBoxContainer {
  private app: ReturnType<typeof createApp> | null = null

  _ready() {
    this.app?.unmount()
    const app = createApp(App)
    app.use(htmlPlugin)
    app.mount(this)
    this.app = app

    if (isSmokeEnabled()) {
      console.log(SMOKE_PASS_MARKER)
      this.get_tree().quit(0)
    }
  }

  _exit_tree() {
    this.app?.unmount()
    this.app = null
  }
}
