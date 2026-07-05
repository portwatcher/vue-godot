import type { VNode } from '@vue/runtime-core'
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

type VNodeMountedHandler = (vnode: VNode) => void

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

function readMountedHandler(value: unknown): VNodeMountedHandler | null {
  return typeof value === 'function' ? (value as VNodeMountedHandler) : null
}

export function applyAutoFocusProp(
  nodeProps: GodotPropBag,
  props: FocusProps,
): void {
  if (!shouldAutoFocus(props)) {
    return
  }

  const previousMounted = readMountedHandler(nodeProps['onVnodeMounted'])
  nodeProps['onVnodeMounted'] = (vnode: VNode) => {
    previousMounted?.(vnode)
    focusGodotControl(vnode.el)
  }
}
