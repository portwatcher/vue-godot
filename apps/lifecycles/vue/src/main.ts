import { createApp } from '@vue-godot/runtime-tscn'
import { Control } from 'godot'
import App from './App.vue'

export default class Root extends Control {
  _ready() {
    const app = createApp(App)
    app.mount(this)
  }
}
