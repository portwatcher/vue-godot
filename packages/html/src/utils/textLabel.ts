import {
  applyCommonControlStyleProps,
  type GodotPropBag,
} from './controlStyle.js'
import {
  normalizeHtmlStyle,
  type HtmlStyleInput,
} from './styleMapping.js'

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
  style: HtmlStyleInput,
  componentName: string,
): void {
  const normalizedStyle = normalizeHtmlStyle(style)
  applyCommonControlStyleProps(nodeProps, normalizedStyle, componentName)

  const hAlign = resolveTextAlign(normalizedStyle?.textAlign)
  if (hAlign != null) {
    nodeProps['horizontal_alignment'] = hAlign
  }

  if (normalizedStyle?.textTransform === 'uppercase') {
    nodeProps['uppercase'] = true
  }

  if (normalizedStyle?.overflowWrap === 'break-word') {
    nodeProps['autowrap_mode'] = 3
  }

  if (normalizedStyle?.overflow === 'hidden') {
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
