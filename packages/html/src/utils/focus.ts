import type { VNode } from '@vue/runtime-core'
import type { GodotPropBag } from './controlStyle.js'

export interface FocusProps {
  autoFocus?: boolean
  autofocus?: boolean
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
