import { createApp } from '@vue-godot/runtime-tscn'
import { VBoxContainer } from 'godot'
import App from './App.vue'

export default class Root extends VBoxContainer {
  _ready() {
    const app = createApp(App)
    app.mount(this)
  }
}
