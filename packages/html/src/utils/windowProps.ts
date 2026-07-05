import type { GodotPropBag } from './controlStyle.js'
import {
  normalizeHtmlStyle,
  toNumericPixels,
  warnUnsupportedStyleProps,
  type HtmlStyleInput,
} from './styleMapping.js'

export interface WindowLikeProps {
  modelValue?: boolean
  title?: string
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
  style?: HtmlStyleInput
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
  componentName = 'Window',
): void {
  const style = normalizeHtmlStyle(props.style)
  warnUnsupportedStyleProps(style, componentName)

  nodeProps['visible'] =
    isWindowOpen(props.modelValue) && style?.display !== 'none'

  if (props.title) {
    nodeProps['title'] = props.title
  }

  const width = finiteNumber(props.width) ?? toNumericPixels(style?.width)
  const height = finiteNumber(props.height) ?? toNumericPixels(style?.height)
  const minWidth =
    finiteNumber(props.minWidth) ?? toNumericPixels(style?.minWidth)
  const minHeight =
    finiteNumber(props.minHeight) ?? toNumericPixels(style?.minHeight)

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
