import type { GodotPropBag } from './controlStyle.js'

export type ProgressFillMode =
  | 'begin-to-end'
  | 'end-to-begin'
  | 'top-to-bottom'
  | 'bottom-to-top'

const ProgressBarFillMode = {
  BEGIN_TO_END: 0,
  END_TO_BEGIN: 1,
  TOP_TO_BOTTOM: 2,
  BOTTOM_TO_TOP: 3,
} as const

export interface ProgressBarOptions {
  value?: number
  min?: number
  max?: number
  step?: number
  indeterminate?: boolean
  showPercentage?: boolean
  fill?: ProgressFillMode
}

function finiteOrDefault(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : fallback
}

function applyFiniteNumberProp(
  nodeProps: GodotPropBag,
  name: string,
  value: number | undefined,
): void {
  if (typeof value === 'number' && Number.isFinite(value)) {
    nodeProps[name] = value
  }
}

export function toProgressFillMode(fill: ProgressFillMode | undefined): number {
  switch (fill) {
    case 'end-to-begin':
      return ProgressBarFillMode.END_TO_BEGIN
    case 'top-to-bottom':
      return ProgressBarFillMode.TOP_TO_BOTTOM
    case 'bottom-to-top':
      return ProgressBarFillMode.BOTTOM_TO_TOP
    case 'begin-to-end':
    case undefined:
      return ProgressBarFillMode.BEGIN_TO_END
  }
}

export function applyProgressBarProps(
  nodeProps: GodotPropBag,
  options: ProgressBarOptions,
): void {
  nodeProps['min_value'] = finiteOrDefault(options.min, 0)
  nodeProps['max_value'] = finiteOrDefault(options.max, 100)
  nodeProps['value'] = finiteOrDefault(options.value, 0)
  nodeProps['indeterminate'] = options.indeterminate === true
  nodeProps['show_percentage'] = options.showPercentage === true
  nodeProps['fill_mode'] = toProgressFillMode(options.fill)

  applyFiniteNumberProp(nodeProps, 'step', options.step)
}
