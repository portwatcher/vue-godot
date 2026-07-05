import type { VNode } from '@vue/runtime-core'
import { FocusMode } from './controlInput.js'
import type { GodotPropBag } from './controlStyle.js'

export interface FocusProps {
  autoFocus?: boolean
  autofocus?: boolean
  focusNext?: string
  focusPrevious?: string
  focusNeighborLeft?: string
  focusNeighborTop?: string
  focusNeighborRight?: string
  focusNeighborBottom?: string
}

export interface FocusContainmentProps {
  trapFocus?: boolean
  restoreFocus?: boolean
}

export const focusPropOptions = {
  autoFocus: {
    type: Boolean,
    default: false,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  focusNext: {
    type: String,
    default: undefined,
  },
  focusPrevious: {
    type: String,
    default: undefined,
  },
  focusNeighborLeft: {
    type: String,
    default: undefined,
  },
  focusNeighborTop: {
    type: String,
    default: undefined,
  },
  focusNeighborRight: {
    type: String,
    default: undefined,
  },
  focusNeighborBottom: {
    type: String,
    default: undefined,
  },
} satisfies Record<keyof FocusProps, object>

export const focusContainmentPropOptions = {
  trapFocus: {
    type: Boolean,
    default: true,
  },
  restoreFocus: {
    type: Boolean,
    default: true,
  },
} satisfies Record<keyof FocusContainmentProps, object>

export interface FocusContainmentOptions {
  open: boolean
  selfLoopTraversal?: boolean
}

type VNodeHandler = (vnode: VNode) => void

function hasGrabFocusMethod(node: unknown): node is { grab_focus: () => void } {
  return (
    typeof node === 'object' &&
    node !== null &&
    typeof (node as Record<string, unknown>)['grab_focus'] === 'function'
  )
}

function hasCallMethod(
  node: unknown,
): node is { call: (method: string, ...args: unknown[]) => unknown } {
  return (
    typeof node === 'object' &&
    node !== null &&
    typeof (node as Record<string, unknown>)['call'] === 'function'
  )
}

function hasGetViewportMethod(node: unknown): node is { get_viewport: () => unknown } {
  return (
    typeof node === 'object' &&
    node !== null &&
    typeof (node as Record<string, unknown>)['get_viewport'] === 'function'
  )
}

function hasGuiFocusOwnerMethod(
  node: unknown,
): node is { gui_get_focus_owner: () => unknown } {
  return (
    typeof node === 'object' &&
    node !== null &&
    typeof (node as Record<string, unknown>)['gui_get_focus_owner'] ===
      'function'
  )
}

export function shouldAutoFocus(props: FocusProps): boolean {
  return props.autoFocus === true || props.autofocus === true
}

export function focusGodotControl(node: unknown): void {
  if (hasGrabFocusMethod(node)) {
    node.grab_focus()
    return
  }

  if (hasCallMethod(node)) {
    node.call('grab_focus')
  }
}

export function readCurrentFocusOwner(node: unknown): unknown | null {
  if (!hasGetViewportMethod(node)) {
    return null
  }

  try {
    const viewport = node.get_viewport()
    if (!hasGuiFocusOwnerMethod(viewport)) {
      return null
    }

    return viewport.gui_get_focus_owner() ?? null
  } catch {
    return null
  }
}

export function restoreGodotFocus(node: unknown): void {
  try {
    focusGodotControl(node)
  } catch {
    // The previous focus owner may have been freed while the modal was open.
  }
}

function nonEmptyNodePath(value: string | undefined): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function applyNodePathProp(
  nodeProps: GodotPropBag,
  propName: string,
  value: string | undefined,
): void {
  const nodePath = nonEmptyNodePath(value)
  if (nodePath) {
    nodeProps[propName] = nodePath
  }
}

export function applyFocusTraversalProps(
  nodeProps: GodotPropBag,
  props: FocusProps,
): void {
  applyNodePathProp(nodeProps, 'focus_next', props.focusNext)
  applyNodePathProp(nodeProps, 'focus_previous', props.focusPrevious)
  applyNodePathProp(
    nodeProps,
    'focus_neighbor_left',
    props.focusNeighborLeft,
  )
  applyNodePathProp(nodeProps, 'focus_neighbor_top', props.focusNeighborTop)
  applyNodePathProp(
    nodeProps,
    'focus_neighbor_right',
    props.focusNeighborRight,
  )
  applyNodePathProp(
    nodeProps,
    'focus_neighbor_bottom',
    props.focusNeighborBottom,
  )
}

function readVNodeHandler(value: unknown): VNodeHandler | null {
  return typeof value === 'function' ? (value as VNodeHandler) : null
}

export function applySelfLoopFocusTrapProps(nodeProps: GodotPropBag): void {
  nodeProps['focus_mode'] = FocusMode.ALL
  nodeProps['focus_next'] = '.'
  nodeProps['focus_previous'] = '.'
  nodeProps['focus_neighbor_left'] = '.'
  nodeProps['focus_neighbor_top'] = '.'
  nodeProps['focus_neighbor_right'] = '.'
  nodeProps['focus_neighbor_bottom'] = '.'
}

export function createFocusContainmentController() {
  let wasOpen = false
  let previousFocus: unknown | null = null
  let restoreOnDeactivate = true

  function activate(
    rootNode: unknown,
    props: FocusContainmentProps,
  ): void {
    if (wasOpen) {
      return
    }

    restoreOnDeactivate = props.restoreFocus !== false
    if (restoreOnDeactivate) {
      previousFocus = readCurrentFocusOwner(rootNode)
    }

    if (props.trapFocus !== false) {
      focusGodotControl(rootNode)
    }

    wasOpen = true
  }

  function deactivate(): void {
    if (!wasOpen) {
      return
    }

    if (restoreOnDeactivate && previousFocus) {
      restoreGodotFocus(previousFocus)
    }

    previousFocus = null
    wasOpen = false
  }

  function sync(
    rootNode: unknown,
    props: FocusContainmentProps,
    options: FocusContainmentOptions,
  ): void {
    if (options.open) {
      activate(rootNode, props)
    } else {
      deactivate()
    }
  }

  return {
    apply(
      nodeProps: GodotPropBag,
      props: FocusContainmentProps,
      options: FocusContainmentOptions,
    ): void {
      if (options.open && options.selfLoopTraversal && props.trapFocus !== false) {
        applySelfLoopFocusTrapProps(nodeProps)
      }

      if (props.trapFocus === false && props.restoreFocus === false) {
        return
      }

      const previousMounted = readVNodeHandler(nodeProps['onVnodeMounted'])
      const previousUpdated = readVNodeHandler(nodeProps['onVnodeUpdated'])
      const previousBeforeUnmount = readVNodeHandler(
        nodeProps['onVnodeBeforeUnmount'],
      )

      nodeProps['onVnodeMounted'] = (vnode: VNode) => {
        previousMounted?.(vnode)
        sync(vnode.el, props, options)
      }

      nodeProps['onVnodeUpdated'] = (vnode: VNode) => {
        previousUpdated?.(vnode)
        sync(vnode.el, props, options)
      }

      nodeProps['onVnodeBeforeUnmount'] = (vnode: VNode) => {
        previousBeforeUnmount?.(vnode)
        deactivate()
      }
    },
  }
}

export function applyAutoFocusProp(
  nodeProps: GodotPropBag,
  props: FocusProps,
): void {
  if (!shouldAutoFocus(props)) {
    return
  }

  const previousMounted = readVNodeHandler(nodeProps['onVnodeMounted'])
  nodeProps['onVnodeMounted'] = (vnode: VNode) => {
    previousMounted?.(vnode)
    focusGodotControl(vnode.el)
  }
}
