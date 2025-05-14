import { createRenderer, RendererOptions } from '@vue/runtime-core'
import { Node } from 'godot'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

const ops: RendererOptions<Node, Node> = {
  ...nodeOps,
  patchProp,
}

export const { createApp } = createRenderer<Node, Node>(ops)

// Re-export everything from 'godot'
export * from 'godot'
// Explicitly re-export 'Node' as well, to ensure its availability,
// as 'export *' might have issues with .d.ts generation for some named exports.
export { Node } from 'godot'
