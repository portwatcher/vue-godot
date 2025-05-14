import { RendererOptions } from '@vue/runtime-core'
import { Node } from 'godot'

type TSCNRendererOptions = RendererOptions<Node, Node>

export const patchProp: TSCNRendererOptions['patchProp'] = function (
  el: Node,
  key: string,
  prev: Node,
  next: Node,
) {
  el.set(key, next)
}
