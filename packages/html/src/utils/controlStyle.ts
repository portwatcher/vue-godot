import { createFontStyleOverride } from './fontLoader.js'
import { createBackgroundPanelStyle } from './backgroundStyle.js'
import { createOpacityModulate, parseGodotColor } from './godotColor.js'
import {
  applyStyleSizeProps,
  normalizeHtmlStyle,
  warnUnsupportedStyleProps,
  type HtmlStyleInput,
  type ResolvedStyleSize,
} from './styleMapping.js'
import { resolveTransformStyle } from './transformStyle.js'
import { applyMotionStyleProps } from './styleTransition.js'

export type GodotPropBag = Record<string, unknown>

export function applyControlSizeProps(
  nodeProps: GodotPropBag,
  style: HtmlStyleInput,
): ResolvedStyleSize {
  return applyStyleSizeProps(nodeProps, normalizeHtmlStyle(style))
}

export function applyFontStyleProps(
  nodeProps: GodotPropBag,
  style: HtmlStyleInput,
): void {
  const normalizedStyle = normalizeHtmlStyle(style)
  if (
    typeof normalizedStyle?.fontSize === 'number' &&
    Number.isFinite(normalizedStyle.fontSize)
  ) {
    nodeProps['theme_override_font_sizes/font_size'] = normalizedStyle.fontSize
  }

  const fontOverride = createFontStyleOverride(
    normalizedStyle?.fontFamily,
    normalizedStyle?.fontWeight,
  )
  if (fontOverride) {
    nodeProps['theme_override_fonts/font'] = fontOverride
  }

  if (typeof normalizedStyle?.color === 'string') {
    const parsed = parseGodotColor(normalizedStyle.color)
    if (parsed) {
      nodeProps['theme_override_colors/font_color'] = parsed
    }
  }
}

export function applyDisplayAndOpacityProps(
  nodeProps: GodotPropBag,
  style: HtmlStyleInput,
): void {
  const normalizedStyle = normalizeHtmlStyle(style)
  if (normalizedStyle?.display === 'none') {
    nodeProps['visible'] = false
  }

  if (
    typeof normalizedStyle?.opacity === 'number' &&
    Number.isFinite(normalizedStyle.opacity)
  ) {
    nodeProps['modulate'] = createOpacityModulate(normalizedStyle.opacity)
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
  style: HtmlStyleInput,
): void {
  const normalizedStyle = normalizeHtmlStyle(style)
  const transform = resolveTransformStyle(normalizedStyle?.transform)
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
  style: HtmlStyleInput,
  componentName = 'Control',
): void {
  const normalizedStyle = normalizeHtmlStyle(style)
  warnUnsupportedStyleProps(normalizedStyle, componentName)
  applyControlSizeProps(nodeProps, normalizedStyle)
  applyFontStyleProps(nodeProps, normalizedStyle)
  applyDisplayAndOpacityProps(nodeProps, normalizedStyle)
  applyTransformStyleProps(nodeProps, normalizedStyle)
  applyMotionStyleProps(nodeProps, normalizedStyle)
}

export function applyControlStyleBoxProps(
  nodeProps: GodotPropBag,
  style: HtmlStyleInput,
  styleName = 'normal',
): void {
  const styleBox = createBackgroundPanelStyle(normalizeHtmlStyle(style))
  if (styleBox) {
    nodeProps[`theme_override_styles/${styleName}`] = styleBox
  }
}

export function applyControlStateStyleBoxProps(
  nodeProps: GodotPropBag,
  stateStyles: Partial<
    Record<
      | 'hover'
      | 'pressed'
      | 'focus'
      | 'focusVisible'
      | 'disabled'
      | 'checked'
      | 'readOnly'
      | 'selected',
      HtmlStyleInput
    >
  >,
  names: Partial<
    Record<
      | 'hover'
      | 'pressed'
      | 'focus'
      | 'focusVisible'
      | 'disabled'
      | 'checked'
      | 'readOnly'
      | 'selected',
      string
    >
  > = {
    hover: 'hover',
    pressed: 'pressed',
    focus: 'focus',
    focusVisible: 'focus',
    disabled: 'disabled',
    checked: 'pressed',
    readOnly: 'read_only',
    selected: 'pressed',
  },
): void {
  for (const [stateName, styleName] of Object.entries(names)) {
    if (!styleName) {
      continue
    }
    applyControlStyleBoxProps(
      nodeProps,
      stateStyles[stateName as keyof typeof stateStyles],
      styleName,
    )
  }
}

export {
  applyAnimationStyleProps,
  applyMotionStyleProps,
  applyTransitionStyleProps,
  registerStyleKeyframes,
  unregisterStyleKeyframes,
} from './styleTransition.js'
export type {
  StyleKeyframe,
  StyleKeyframeStyle,
} from './styleTransition.js'
