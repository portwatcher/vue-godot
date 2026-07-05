import { createFontStyleOverride } from './fontLoader.js'
import { createOpacityModulate, parseGodotColor } from './godotColor.js'
import {
  applyStyleSizeProps,
  warnUnsupportedStyleProps,
  type HtmlStyle,
  type ResolvedStyleSize,
} from './styleMapping.js'
import { resolveTransformStyle } from './transformStyle.js'
import { applyTransitionStyleProps } from './styleTransition.js'

export type GodotPropBag = Record<string, unknown>

export function applyControlSizeProps(
  nodeProps: GodotPropBag,
  style: HtmlStyle | undefined,
): ResolvedStyleSize {
  return applyStyleSizeProps(nodeProps, style)
}

export function applyFontStyleProps(
  nodeProps: GodotPropBag,
  style: HtmlStyle | undefined,
): void {
  if (typeof style?.fontSize === 'number' && Number.isFinite(style.fontSize)) {
    nodeProps['theme_override_font_sizes/font_size'] = style.fontSize
  }

  const fontOverride = createFontStyleOverride(
    style?.fontFamily,
    style?.fontWeight,
  )
  if (fontOverride) {
    nodeProps['theme_override_fonts/font'] = fontOverride
  }

  if (typeof style?.color === 'string') {
    const parsed = parseGodotColor(style.color)
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
    nodeProps['modulate'] = createOpacityModulate(style.opacity)
  }
}

function addNumericProp(
  nodeProps: GodotPropBag,
  key: string,
  amount: number,
): void {
  const current = nodeProps[key]
  nodeProps[key] = (typeof current === 'number' ? current : 0) + amount
}

export function applyTransformStyleProps(
  nodeProps: GodotPropBag,
  style: HtmlStyle | undefined,
): void {
  const transform = resolveTransformStyle(style?.transform)
  if (!transform) {
    return
  }

  if (transform.translateX !== 0) {
    addNumericProp(nodeProps, 'position:x', transform.translateX)
  }
  if (transform.translateY !== 0) {
    addNumericProp(nodeProps, 'position:y', transform.translateY)
  }
  if (transform.scaleX !== 1) {
    nodeProps['scale:x'] = transform.scaleX
  }
  if (transform.scaleY !== 1) {
    nodeProps['scale:y'] = transform.scaleY
  }
  if (transform.rotation !== 0) {
    nodeProps.rotation = transform.rotation
  }
}

export function applyCommonControlStyleProps(
  nodeProps: GodotPropBag,
  style: HtmlStyle | undefined,
  componentName = 'Control',
): void {
  warnUnsupportedStyleProps(style, componentName)
  applyControlSizeProps(nodeProps, style)
  applyFontStyleProps(nodeProps, style)
  applyDisplayAndOpacityProps(nodeProps, style)
  applyTransformStyleProps(nodeProps, style)
  applyTransitionStyleProps(nodeProps, style)
}

export { applyTransitionStyleProps } from './styleTransition.js'
