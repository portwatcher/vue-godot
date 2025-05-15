import { createRenderer, RendererOptions } from '@vue/runtime-core'
import { Node } from 'godot'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

const ops: RendererOptions<Node, Node> = {
  ...nodeOps,
  patchProp,
}

export const { createApp } = createRenderer<Node, Node>(ops)
