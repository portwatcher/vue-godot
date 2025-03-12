import type { RendererOptions } from '@vue/runtime-core'

// Define types for Godot node virtual representation
export interface TSCNNode {
  id?: string
  type: string
  props?: Record<string, any>
  children?: TSCNNode[]
  parent?: TSCNNode
}

// Node operations for TSCN renderer
export const nodeOps: Omit<RendererOptions<TSCNNode, TSCNNode>, 'patchProp'> = {
  insert: (child, parent, anchor) => {
    // In TSCN, the order of nodes doesn't matter as much as in DOM
    // We still track parent-child relationships
    if (!parent.children) {
      parent.children = []
    }

    // If anchor is specified, insert at specific position
    if (anchor) {
      const index = parent.children.indexOf(anchor)
      if (index !== -1) {
        parent.children.splice(index, 0, child)
      } else {
        parent.children.push(child)
      }
    } else {
      parent.children.push(child)
    }

    // Set parent reference
    child.parent = parent
  },

  remove: child => {
    const parent = child.parent
    if (parent && parent.children) {
      const index = parent.children.indexOf(child)
      if (index !== -1) {
        parent.children.splice(index, 1)
      }
    }
    child.parent = undefined
  },

  createElement: (tag, isSVG, isCustomElement, vnodeProps): TSCNNode => {
    // Map Vue component tags to Godot node types
    const nodeType = mapTagToNodeType(tag, vnodeProps)

    return {
      type: nodeType,
      id: vnodeProps?.id || tag,
      props: {},
    }
  },

  createText: (text): TSCNNode => {
    // In Godot, text is typically a Label node
    return {
      type: 'Label',
      props: {
        text,
      },
    }
  },

  createComment: (text): TSCNNode => {
    // Comments don't translate directly to Godot, but we can store them as metadata
    return {
      type: 'Node',
      props: {
        _comment: text,
      },
    }
  },

  setText: (node, text) => {
    // Set text property on the node (usually for Label nodes)
    if (!node.props) {
      node.props = {}
    }
    node.props.text = text
  },

  setElementText: (node, text) => {
    // For elements, clear children and add a text node
    node.children = [
      {
        type: 'Label',
        props: { text },
        parent: node,
      },
    ]
  },

  parentNode: node => node.parent || null,

  nextSibling: node => {
    const parent = node.parent
    if (!parent || !parent.children) return null

    const index = parent.children.indexOf(node)
    if (index !== -1 && index + 1 < parent.children.length) {
      return parent.children[index + 1]
    }

    return null
  },

  querySelector: selector => {
    // Not really applicable for TSCN, but we can provide a stub
    console.warn('querySelector not fully implemented in TSCN renderer')
    return null
  },

  setScopeId(node, id) {
    if (!node.props) {
      node.props = {}
    }
    // Store scope ID as metadata
    node.props._scopeId = id
  },

  // Not applicable for TSCN, but provide implementation for compatibility
  insertStaticContent(content, parent, anchor, isSVG) {
    console.warn('insertStaticContent not applicable in TSCN renderer')
    const dummyNode: TSCNNode = {
      type: 'Node',
      props: { _staticContent: content },
      parent,
    }

    if (!parent.children) {
      parent.children = []
    }

    parent.children.push(dummyNode)

    return [dummyNode, dummyNode]
  },
}

// Helper function to map Vue component tags to Godot node types
function mapTagToNodeType(tag: string, props?: Record<string, any>): string {
  // Map common HTML elements to appropriate Godot nodes
  switch (tag.toLowerCase()) {
    case 'div':
    case 'span':
      return 'Control'
    case 'img':
      return 'TextureRect'
    case 'p':
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return 'Label'
    case 'button':
      return 'Button'
    case 'input':
      if (props?.type === 'checkbox') return 'CheckBox'
      if (props?.type === 'radio') return 'CheckBox'
      return 'LineEdit'
    case 'textarea':
      return 'TextEdit'
    case 'select':
      return 'OptionButton'
    case 'ul':
    case 'ol':
      return 'VBoxContainer'
    case 'li':
      return 'HBoxContainer'
    case 'a':
      return 'LinkButton'
    case 'form':
      return 'PanelContainer'
    // Add more mappings as needed
    default:
      // Check if it's a custom component (starting with uppercase)
      if (tag[0] === tag[0].toUpperCase()) {
        return 'Node2D' // Default for custom components
      }
      return 'Control' // Default fallback
  }
}
