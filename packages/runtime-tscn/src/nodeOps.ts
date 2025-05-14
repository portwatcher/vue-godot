import type { RendererOptions } from '@vue/runtime-core'
import { ClassDB, Label, Node } from 'godot'

export const nodeOps: Omit<RendererOptions<Node, Node>, 'patchProp'> = {
  insert: (child, parent, anchor) => {
    if (!parent) {
      console.warn('parent node is null')
      return
    }

    if (anchor) {
      child.add_sibling(anchor)
    } else {
      parent.add_child(child)
    }
  },

  remove: (child) => {
    const parent = child.get_parent()
    if (parent) {
      parent.remove_child(child)
    }
    child.queue_free()
  },

  createElement: (tag, isSVG, isCustomElement, vnodeProps): Node => {
    return (ClassDB.instantiate(tag) as Node) ?? new Node()
  },

  createText: (text): Node => {
    const label = new Label()
    label.text = text
    return label
  },

  createComment: (text): Node => {
    const node = new Node()
    node.set_meta('comment', text)
    return node
  },

  setText: (node, text) => {
    if (node instanceof Label) {
      node.text = text
    } else {
      console.warn("vue-godot doesn't support setText on non-Label nodes")
    }
  },

  setElementText: (node, text) => {
    if (node instanceof Label) {
      node.text = text
    } else {
      console.warn(
        "vue-godot doesn't support setElementText on non-Label nodes",
      )
    }
  },

  parentNode: (node) => node.get_parent() || null,

  nextSibling: (node) => {
    const index = node.get_index() + 1
    return node.get_parent()?.get_child(index) || null
  },

  querySelector: (selector) => {
    console.warn("vue-godot doesn't support querySelector")
    return null
  },

  setScopeId(node, id) {
    console.warn("vue-godot doesn't support setScopeId")
  },

  insertStaticContent(content, parent, anchor, isSVG) {
    console.warn("vue-godot doesn't support insertStaticContent")
    return [new Node(), new Node()]
  },
}
