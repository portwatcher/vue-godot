import { createRenderer, RendererOptions } from '@vue/runtime-core'
import { Node } from 'godot'
import { nodeOps } from './nodeOps.js'
import { patchProp } from './patchProp.js'

const ops: RendererOptions<Node, Node> = {
  ...nodeOps,
  patchProp,
}

export const { createApp } = createRenderer<Node, Node>(ops)
