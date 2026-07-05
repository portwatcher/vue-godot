import type { Slot, VNodeChild } from '@vue/runtime-core'

export function asDefaultSlot(
  slot: Slot | undefined,
): { default: Slot } | undefined {
  return slot ? { default: slot } : undefined
}

export function createDefaultSlot(
  render: () => VNodeChild,
): { default: () => VNodeChild } {
  return { default: render }
}
