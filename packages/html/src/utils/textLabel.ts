import {
  applyCommonControlStyleProps,
  type GodotPropBag,
} from './controlStyle.js'
import type { HtmlStyle } from './styleMapping.js'

const HorizontalAlignment = {
  LEFT: 0,
  CENTER: 1,
  RIGHT: 2,
} as const

function resolveTextAlign(textAlign: string | undefined): number | null {
  switch (textAlign) {
    case 'left':
      return HorizontalAlignment.LEFT
    case 'center':
      return HorizontalAlignment.CENTER
    case 'right':
      return HorizontalAlignment.RIGHT
    default:
      return null
  }
}

export function applyLabelTextStyleProps(
  nodeProps: GodotPropBag,
  style: HtmlStyle | undefined,
  componentName: string,
): void {
  applyCommonControlStyleProps(nodeProps, style, componentName)

  const hAlign = resolveTextAlign(style?.textAlign)
  if (hAlign != null) {
    nodeProps['horizontal_alignment'] = hAlign
  }

  if (style?.textTransform === 'uppercase') {
    nodeProps['uppercase'] = true
  }

  if (style?.overflowWrap === 'break-word') {
    nodeProps['autowrap_mode'] = 3
  }

  if (style?.overflow === 'hidden') {
    nodeProps['clip_text'] = true
  }
}

export function withRequiredIndicator(
  text: string,
  required: boolean,
  indicator: string,
): string {
  if (!required || !indicator || text.endsWith(indicator)) {
    return text
  }
  return `${text}${indicator}`
}
