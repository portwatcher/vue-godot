import { RendererOptions } from '@vue/runtime-core'
import { Node } from 'godot'

type TSCNRendererOptions = RendererOptions<Node, Node>

export const patchProp: TSCNRendererOptions['patchProp'] = function (
  el: Node,
  key: string,
  prev: Node,
  next: Node,
) {
  if (key.startsWith('on') && typeof next === 'function') {
    // onPressed → pressed
    const signal = key.slice(2).replace(/^[A-Z]/, (s) => s.toLowerCase())
    if (el.is_connected(signal, next)) el.disconnect(signal, next)
    el.connect(signal, next)
  } else if (el.has_method('set')) {
    el.set(key, next) // Universal Godot setter
  } else {
    ;(el as any)[key] = next
  }
}
