import { createApp, Node } from '@vue-godot/runtime-tscn'
import Test from './Test.vue'

/**
 * Called from Godot.
 * `root` must be a Godot Node that will become the component’s container.
 */
export function mount(root: Node) {
  return createApp(Test).mount(root)
}
