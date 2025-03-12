import {
  type App,
  type CreateAppFunction,
  type Renderer,
  createRenderer,
  warn,
} from '@vue/runtime-core'
import { extend, isString } from '@vue/shared'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

// This is our renderer options that will be passed to createRenderer
const rendererOptions = /*@__PURE__*/ extend({ patchProp }, nodeOps)

// Lazy create the renderer - follows the pattern from runtime-dom
let renderer: Renderer<any, any>

function ensureRenderer() {
  return renderer || (renderer = createRenderer<any, any>(rendererOptions))
}

// Our main function to render Vue components to TSCN structure
export const render = (...args) => {
  ensureRenderer().render(...args)
}

// Create a Vue app that renders to TSCN
export const createApp = ((...args) => {
  const app = ensureRenderer().createApp(...args)

  const { mount } = app
  app.mount = (container: any): any => {
    if (isString(container)) {
      container = { id: container, type: 'Node2D' }
    }

    // If no template exists, we can't do much
    const component = app._component
    if (!component.render && !component.template) {
      warn('Component needs a render function or template')
      return
    }

    // Mount the app (this will trigger the internal Vue rendering process)
    const proxy = mount(container)

    // After mounting, export the TSCN representation
    const tscnOutput = generateTSCNOutput(container)

    // In a real implementation, we would write this to a file
    // or return it for further processing
    console.log('Generated TSCN:', tscnOutput)

    return proxy
  }

  return app
}) as CreateAppFunction<Element>

// Function to generate TSCN output from a rendered tree
function generateTSCNOutput(rootNode: any): string {
  // Start with TSCN file format header
  let output = '[gd_scene format=2]\n\n'

  // Process the virtual DOM tree and convert to TSCN format
  output += processTSCNNode(rootNode, 0)

  return output
}

// Process a node and its children recursively
function processTSCNNode(
  node: any,
  depth: number,
  parentPath: string = '',
): string {
  if (!node) return ''

  const nodePath = parentPath
    ? `${parentPath}/${node.id || 'Node'}`
    : node.id || 'Node'

  // Start with the node declaration
  let output = `[node name="${node.id || 'Node'}" type="${node.type || 'Node2D'}"`

  // Add parent reference if not the root
  if (parentPath) {
    output += ` parent="${parentPath}"`
  }

  output += ']\n'

  // Add properties
  if (node.props) {
    Object.entries(node.props).forEach(([key, value]) => {
      output += `${key} = ${serializeValue(value)}\n`
    })
  }

  // Process children
  if (node.children) {
    for (const child of node.children) {
      output += processTSCNNode(child, depth + 1, nodePath)
    }
  }

  return output
}

// Helper to serialize property values to TSCN format
function serializeValue(value: any): string {
  if (typeof value === 'string') {
    return `"${value}"`
  } else if (typeof value === 'number') {
    return value.toString()
  } else if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  } else if (Array.isArray(value)) {
    // For Vector2, Vector3, Color, etc.
    return `(${value.join(', ')})`
  } else if (value === null) {
    return 'null'
  } else if (typeof value === 'object') {
    // For complex objects like resources
    return JSON.stringify(value)
  }
  return String(value)
}

// Export for SSR - not implemented for TSCN
export const createSSRApp = ((...args) => {
  warn('SSR is not supported in TSCN renderer')
  return createApp(...args)
}) as CreateAppFunction<Element>
