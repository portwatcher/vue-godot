import { parseHexColor } from './colorParser.js'
import type { HtmlStyle } from './styleMapping.js'

export type GodotPropBag = Record<string, unknown>

export function applyControlSizeProps(
  nodeProps: GodotPropBag,
  style: HtmlStyle | undefined,
): void {
  if (typeof style?.width === 'number' && Number.isFinite(style.width)) {
    nodeProps['custom_minimum_size:x'] = style.width
  }
  if (typeof style?.height === 'number' && Number.isFinite(style.height)) {
    nodeProps['custom_minimum_size:y'] = style.height
  }
}

export function applyFontStyleProps(
  nodeProps: GodotPropBag,
  style: HtmlStyle | undefined,
): void {
  if (typeof style?.fontSize === 'number' && Number.isFinite(style.fontSize)) {
    nodeProps['theme_override_font_sizes/font_size'] = style.fontSize
  }

  if (typeof style?.color === 'string') {
    const parsed = parseHexColor(style.color)
    if (parsed) {
      nodeProps['theme_override_colors/font_color'] = parsed
    }
  }
}

export function applyDisplayAndOpacityProps(
  nodeProps: GodotPropBag,
  style: HtmlStyle | undefined,
): void {
  if (style?.display === 'none') {
    nodeProps['visible'] = false
  }

  if (typeof style?.opacity === 'number' && Number.isFinite(style.opacity)) {
    nodeProps['modulate'] = `1,1,1,${style.opacity}`
  }
}

export function applyCommonControlStyleProps(
  nodeProps: GodotPropBag,
  style: HtmlStyle | undefined,
): void {
  applyControlSizeProps(nodeProps, style)
  applyFontStyleProps(nodeProps, style)
  applyDisplayAndOpacityProps(nodeProps, style)
}
