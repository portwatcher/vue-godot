import { createApp } from '@vue-godot/runtime-tscn'
import { Control } from 'godot'
import Test from './Test.vue'

export default class App extends Control {
  _ready() {
    const app = createApp(Test)
    app.mount(this)
  }
}
