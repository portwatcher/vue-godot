import type { RendererOptions } from '@vue/runtime-core'
import { ClassDB, Label, Node } from 'godot'
import { insertChildBeforeAnchor } from './insertChild.js'
import { clearGodotSignalHandlers } from './patchProp.js'
import {
  insertStaticContentNode,
  supportsPlainTextStaticContent,
} from './staticContent.js'

let didWarnUnsupportedStaticMarkup = false

function hasTextProperty(node: Node): node is Node & { text: string } {
  return 'text' in (node as object)
}

function setHostNodeText(
  node: Node,
  text: string,
  opName: 'setText' | 'setElementText',
) {
  if (hasTextProperty(node)) {
    node.text = text
    return
  }

  const nodeType =
    (node as { constructor?: { name?: string } }).constructor?.name ?? 'Node'
  console.warn(
    `vue-godot doesn't support ${opName} on ${nodeType} (no text property)`,
  )
}

function createFallbackNodeForUnsupportedTag(tag: string): Node {
  console.warn(
    `[vue-godot] Unsupported Godot node class "${tag}". Falling back to a generic Node; check the tag name, generated Godot typings, or ClassDB availability.`,
  )
  return new Node()
}

function clearNodeTreeSignalHandlers(node: Node): void {
  const childCount = node.get_child_count()
  for (let index = 0; index < childCount; index++) {
    const child = node.get_child(index)
    if (child) {
      clearNodeTreeSignalHandlers(child)
    }
  }
  clearGodotSignalHandlers(node)
}

export const nodeOps: Omit<RendererOptions<Node, Node>, 'patchProp'> = {
  insert: (child, parent, anchor) => {
    if (!parent) {
      console.warn('parent node is null')
      return
    }

    insertChildBeforeAnchor(child, parent, anchor ?? null)
  },

  remove: (child) => {
    clearNodeTreeSignalHandlers(child)
    const parent = child.get_parent()
    if (parent) {
      parent.remove_child(child)
    }
    child.queue_free()
  },

  createElement: (tag, isSVG, isCustomElement, vnodeProps): Node => {
    return ClassDB.can_instantiate(tag)
      ? ClassDB.instantiate(tag)
      : createFallbackNodeForUnsupportedTag(tag)
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
    setHostNodeText(node, text, 'setText')
  },

  setElementText: (node, text) => {
    setHostNodeText(node, text, 'setElementText')
  },

  parentNode: (node) => node.get_parent() || null,

  nextSibling: (node) => {
    const index = node.get_index() + 1
    if (index >= node.get_parent()?.get_child_count()) {
      return null
    }
    return node.get_parent()?.get_child(index)
  },

  querySelector: (selector) => {
    console.warn("vue-godot doesn't support querySelector")
    return null
  },

  setScopeId(node, id) {
    console.warn("vue-godot doesn't support setScopeId")
  },

  insertStaticContent(content, parent, anchor, isSVG) {
    if (
      !supportsPlainTextStaticContent(content) &&
      !didWarnUnsupportedStaticMarkup
    ) {
      didWarnUnsupportedStaticMarkup = true
      console.warn(
        '[vue-godot] insertStaticContent only supports plain text static content; HTML-like static markup is inserted as a placeholder node.',
      )
    }

    return insertStaticContentNode(content, parent, anchor ?? null, {
      createTextNode(text) {
        const label = new Label()
        label.text = text
        return label
      },
      createPlaceholderNode(staticContent) {
        const node = new Node()
        node.set_meta('static_content', staticContent)
        return node
      },
    })
  },
}
