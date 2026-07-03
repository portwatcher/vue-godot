import type { VNode } from '@vue/runtime-core'

function extractTextFromUnknownChild(child: unknown): string {
  if (typeof child === 'string') {
    return child
  }
  if (typeof child === 'object' && child !== null && 'children' in child) {
    return extractTextFromVNode(child as VNode)
  }
  return ''
}

/**
 * Extract flattened text content from a VNode, including nested arrays and a
 * default slot object. HTML-like components use this to mirror text-only slot
 * behavior such as `<button>Save</button>` and `<option>Save</option>`.
 */
export function extractTextFromVNode(vnode: VNode): string {
  const children = vnode.children

  if (typeof children === 'string') {
    return children
  }

  if (Array.isArray(children)) {
    return children.map(extractTextFromUnknownChild).join('')
  }

  if (children && typeof children === 'object' && 'default' in children) {
    const slot = (children as Record<string, unknown>)['default']
    if (typeof slot === 'function') {
      const slotChildren = (slot as () => unknown)()
      if (Array.isArray(slotChildren)) {
        return slotChildren.map(extractTextFromUnknownChild).join('')
      }
    }
  }

  return ''
}

export function extractTextFromSlot(slot?: () => VNode[]): string {
  return (slot?.() ?? []).map(extractTextFromVNode).join('')
}
