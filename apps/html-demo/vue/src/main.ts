import { installBrowserAPIs } from '@vue-godot/browser'
import { htmlPlugin } from '@vue-godot/html'
import { createApp } from '@vue-godot/runtime-tscn'
import { VBoxContainer } from 'godot'
import App from './App.vue'

installBrowserAPIs()

export default class Root extends VBoxContainer {
  _ready() {
    const app = createApp(App)
    app.use(htmlPlugin)
    app.mount(this)
  }
}
