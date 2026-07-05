import type { GodotPropBag } from './controlStyle.js'
import { toNumericPixels, type HtmlStyle } from './styleMapping.js'

export interface WindowLikeProps {
  modelValue?: boolean
  title?: string
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
  style?: HtmlStyle
}

function finiteNumber(value: number | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

export function isWindowOpen(value: boolean | undefined): boolean {
  return value !== false
}

export function applyWindowBaseProps(
  nodeProps: GodotPropBag,
  props: WindowLikeProps,
): void {
  nodeProps['visible'] =
    isWindowOpen(props.modelValue) && props.style?.display !== 'none'

  if (props.title) {
    nodeProps['title'] = props.title
  }

  const width = finiteNumber(props.width) ?? toNumericPixels(props.style?.width)
  const height =
    finiteNumber(props.height) ?? toNumericPixels(props.style?.height)
  const minWidth =
    finiteNumber(props.minWidth) ?? toNumericPixels(props.style?.minWidth)
  const minHeight =
    finiteNumber(props.minHeight) ?? toNumericPixels(props.style?.minHeight)

  if (width != null) {
    nodeProps['size:x'] = width
  }
  if (height != null) {
    nodeProps['size:y'] = height
  }
  if (minWidth != null) {
    nodeProps['min_size:x'] = minWidth
  }
  if (minHeight != null) {
    nodeProps['min_size:y'] = minHeight
  }
}

export function emitWindowClose(
  emit: (event: 'update:modelValue' | 'close', value?: boolean) => void,
): void {
  emit('update:modelValue', false)
  emit('close')
}
