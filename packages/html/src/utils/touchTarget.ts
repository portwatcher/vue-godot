import type { GodotPropBag } from './controlStyle.js'

export interface TouchTargetProps {
  minTouchTarget?: number
}

export const touchTargetPropOptions = {
  minTouchTarget: {
    type: Number,
    default: undefined,
  },
} satisfies Record<keyof TouchTargetProps, object>

function normalizeTouchTarget(value: number | undefined): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return null
  }

  return Math.ceil(value)
}

function applyMinimumAxisSize(
  nodeProps: GodotPropBag,
  key: string,
  minimumSize: number,
): void {
  const current = nodeProps[key]
  nodeProps[key] =
    typeof current === 'number' && Number.isFinite(current)
      ? Math.max(current, minimumSize)
      : minimumSize
}

export function applyMinTouchTargetProps(
  nodeProps: GodotPropBag,
  props: TouchTargetProps,
): void {
  const minimumSize = normalizeTouchTarget(props.minTouchTarget)
  if (minimumSize == null) {
    return
  }

  applyMinimumAxisSize(nodeProps, 'custom_minimum_size:x', minimumSize)
  applyMinimumAxisSize(nodeProps, 'custom_minimum_size:y', minimumSize)
}
