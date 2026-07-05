/**
 * Maps a CSS flexbox-subset style object to the Godot container type
 * and properties that best represent it.
 *
 * Strategy: map to Godot's native container system rather than computing
 * layout in JavaScript. This gives us GPU-side layout and a scene tree
 * that game developers can inspect in the Godot editor.
 *
 * Mapping reference:
 *
 *   CSS                              Godot
 *   ───────────────────────────────   ────────────────────────────
 *   display: flex                     Container (base)
 *   flex-direction: row               HBoxContainer
 *   flex-direction: column            VBoxContainer
 *   flex-wrap: wrap                   HFlowContainer / VFlowContainer
 *   display: grid                     GridContainer
 *   gap: <n>                          theme override separation/h_separation/v_separation
 *   justify-content                   Box/Flow "alignment" property
 *   flex: 1 (on child)               SizeFlags.EXPAND_FILL
 *   align-items: center              default cross-axis child SizeFlags.SHRINK_CENTER
 *   align-self: center (on child)    SizeFlags.SHRINK_CENTER
 *   padding: <n>                      MarginContainer wrapper + margin overrides
 *   margin: <n>                       outer MarginContainer wrapper where supported
 *   border-radius / border-width      StyleBoxFlat corner and border props
 *   width / height                    custom_minimum_size or Control anchors
 *   display: none                     visible = false
 */

export type StyleLength = number | string
export type StyleTime = number | string
export type StyleTransitionProperty =
  | 'all'
  | 'opacity'
  | 'transform'
  | 'width'
  | 'height'
export type StyleTransitionTimingFunction =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
export type StyleAnimationIterationCount = number | 'infinite'
export type StyleAnimationDirection = 'normal' | 'reverse'

export interface HtmlStyle {
  display?: 'flex' | 'grid' | 'none'
  flexDirection?: 'row' | 'column'
  flexWrap?: 'nowrap' | 'wrap'
  justifyContent?: 'flex-start' | 'center' | 'flex-end'
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  alignSelf?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  flex?: number
  gap?: number
  columns?: number
  margin?: StyleLength
  marginTop?: StyleLength
  marginRight?: StyleLength
  marginBottom?: StyleLength
  marginLeft?: StyleLength
  padding?: StyleLength
  paddingTop?: StyleLength
  paddingRight?: StyleLength
  paddingBottom?: StyleLength
  paddingLeft?: StyleLength
  width?: number | string
  height?: number | string
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  backgroundColor?: string
  backgroundImage?: string
  borderColor?: string
  borderStyle?: 'none' | 'solid'
  borderWidth?: StyleLength
  borderTopWidth?: StyleLength
  borderRightWidth?: StyleLength
  borderBottomWidth?: StyleLength
  borderLeftWidth?: StyleLength
  borderRadius?: StyleLength
  borderTopLeftRadius?: StyleLength
  borderTopRightRadius?: StyleLength
  borderBottomRightRadius?: StyleLength
  borderBottomLeftRadius?: StyleLength
  color?: string
  fontFamily?: string
  fontSize?: number
  fontWeight?: 'normal' | 'bold'
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  textAlign?: 'left' | 'center' | 'right'
  transform?: string
  animationName?: string
  animationDuration?: StyleTime
  animationDelay?: StyleTime
  animationTimingFunction?: StyleTransitionTimingFunction | string
  animationIterationCount?: StyleAnimationIterationCount
  animationDirection?: StyleAnimationDirection
  transition?: string
  transitionProperty?:
    | StyleTransitionProperty
    | string
    | readonly (StyleTransitionProperty | string)[]
  transitionDuration?: StyleTime | readonly StyleTime[]
  transitionDelay?: StyleTime | readonly StyleTime[]
  transitionTimingFunction?:
    | StyleTransitionTimingFunction
    | string
    | readonly (StyleTransitionTimingFunction | string)[]
  overflowWrap?: 'normal' | 'break-word'
  overflow?: 'visible' | 'hidden'
  opacity?: number
}

export const supportedHtmlStyleKeys = [
  'alignItems',
  'alignSelf',
  'animationDelay',
  'animationDirection',
  'animationDuration',
  'animationIterationCount',
  'animationName',
  'animationTimingFunction',
  'backgroundColor',
  'backgroundImage',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderBottomWidth',
  'borderColor',
  'borderLeftWidth',
  'borderRadius',
  'borderRightWidth',
  'borderStyle',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderTopWidth',
  'borderWidth',
  'color',
  'columns',
  'display',
  'flex',
  'flexDirection',
  'flexWrap',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'gap',
  'height',
  'justifyContent',
  'margin',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'objectFit',
  'opacity',
  'overflow',
  'overflowWrap',
  'padding',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'textAlign',
  'textTransform',
  'transform',
  'transition',
  'transitionDelay',
  'transitionDuration',
  'transitionProperty',
  'transitionTimingFunction',
  'width',
] as const

const supportedHtmlStyleKeySet = new Set<string>(supportedHtmlStyleKeys)
const warnedUnsupportedStyleProps = new Set<string>()

export function getUnsupportedStyleKeys(
  style: object | undefined,
): string[] {
  if (!style || typeof style !== 'object' || Array.isArray(style)) {
    return []
  }

  return Object.keys(style).filter((key) => !supportedHtmlStyleKeySet.has(key))
}

export function warnUnsupportedStyleProps(
  style: object | undefined,
  componentName: string,
  warn: (message: string) => void = console.warn,
): void {
  const unsupportedKeys = getUnsupportedStyleKeys(style)
  const newKeys: string[] = []

  for (const key of unsupportedKeys) {
    const warningKey = `${componentName}:${key}`
    if (!warnedUnsupportedStyleProps.has(warningKey)) {
      warnedUnsupportedStyleProps.add(warningKey)
      newKeys.push(key)
    }
  }

  if (newKeys.length === 0) {
    return
  }

  const plural = newKeys.length === 1 ? 'prop' : 'props'
  warn(
    `[vue-godot/html] Unsupported style ${plural} on <${componentName}>: ${newKeys
      .map((key) => `"${key}"`)
      .join(', ')}. Supported style props: ${supportedHtmlStyleKeys.join(', ')}.`,
  )
}

export function clearUnsupportedStyleWarningsForTests(): void {
  warnedUnsupportedStyleProps.clear()
}

export type GodotContainerTag =
  | 'HBoxContainer'
  | 'VBoxContainer'
  | 'HFlowContainer'
  | 'VFlowContainer'
  | 'GridContainer'
  | 'MarginContainer'
  | 'CenterContainer'
  | 'Control'

export interface ContainerMapping {
  tag: GodotContainerTag
  themeOverrides: Record<string, number>
  props: Record<string, unknown>
}

export interface ResolvedStyleSize {
  widthPixels: number | null
  heightPixels: number | null
  widthRatio: number | null
  heightRatio: number | null
}

export const ControlSizeFlags = {
  SHRINK_BEGIN: 0,
  FILL: 1,
  EXPAND: 2,
  EXPAND_FILL: 3,
  SHRINK_CENTER: 4,
  SHRINK_END: 8,
} as const

export const ContainerAlignment = {
  BEGIN: 0,
  CENTER: 1,
  END: 2,
} as const

export interface ResolvedEdges {
  top: number
  right: number
  bottom: number
  left: number
}

export type ResolvedPadding = ResolvedEdges

function resolveEdgeValue(value: StyleLength | undefined): number | null {
  return toNumericPixels(value)
}

function resolveBoxEdges(
  base: StyleLength | undefined,
  topValue: StyleLength | undefined,
  rightValue: StyleLength | undefined,
  bottomValue: StyleLength | undefined,
  leftValue: StyleLength | undefined,
): ResolvedEdges | null {
  if (
    base == null &&
    topValue == null &&
    rightValue == null &&
    bottomValue == null &&
    leftValue == null
  ) {
    return null
  }

  const baseResolved = resolveEdgeValue(base)
  const top = resolveEdgeValue(topValue) ?? baseResolved
  const right = resolveEdgeValue(rightValue) ?? baseResolved
  const bottom = resolveEdgeValue(bottomValue) ?? baseResolved
  const left = resolveEdgeValue(leftValue) ?? baseResolved

  if (top == null && right == null && bottom == null && left == null) {
    return null
  }

  return {
    top: top ?? 0,
    right: right ?? 0,
    bottom: bottom ?? 0,
    left: left ?? 0,
  }
}

export function resolvePadding(style: HtmlStyle): ResolvedPadding | null {
  return resolveBoxEdges(
    style.padding,
    style.paddingTop,
    style.paddingRight,
    style.paddingBottom,
    style.paddingLeft,
  )
}

export function resolveMargin(style: HtmlStyle): ResolvedEdges | null {
  return resolveBoxEdges(
    style.margin,
    style.marginTop,
    style.marginRight,
    style.marginBottom,
    style.marginLeft,
  )
}

export function resolveBorderWidths(style: HtmlStyle): ResolvedEdges | null {
  if (style.borderStyle === 'none') {
    return null
  }

  return resolveBoxEdges(
    style.borderWidth,
    style.borderTopWidth,
    style.borderRightWidth,
    style.borderBottomWidth,
    style.borderLeftWidth,
  )
}

export interface ResolvedCornerRadii {
  topLeft: number
  topRight: number
  bottomRight: number
  bottomLeft: number
}

export function resolveBorderRadii(
  style: HtmlStyle,
): ResolvedCornerRadii | null {
  const base = resolveEdgeValue(style.borderRadius)
  const topLeft = resolveEdgeValue(style.borderTopLeftRadius) ?? base
  const topRight = resolveEdgeValue(style.borderTopRightRadius) ?? base
  const bottomRight = resolveEdgeValue(style.borderBottomRightRadius) ?? base
  const bottomLeft = resolveEdgeValue(style.borderBottomLeftRadius) ?? base

  if (
    topLeft == null &&
    topRight == null &&
    bottomRight == null &&
    bottomLeft == null
  ) {
    return null
  }

  return {
    topLeft: topLeft ?? 0,
    topRight: topRight ?? 0,
    bottomRight: bottomRight ?? 0,
    bottomLeft: bottomLeft ?? 0,
  }
}

export function toNumericPixels(
  value: number | string | undefined,
): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    const matched = normalized.match(/^(-?\d+(?:\.\d+)?)(px)?$/)
    if (matched) {
      const parsed = Number(matched[1])
      return Number.isFinite(parsed) ? parsed : null
    }
  }
  return null
}

export function toPercentRatio(
  value: number | string | undefined,
): number | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().toLowerCase()
  const matched = normalized.match(/^(-?\d+(?:\.\d+)?)%$/)
  if (!matched) {
    return null
  }

  const parsed = Number(matched[1])
  return Number.isFinite(parsed) ? parsed / 100 : null
}

export function resolveStyleSize(
  style: Pick<HtmlStyle, 'width' | 'height'> | undefined,
): ResolvedStyleSize {
  return {
    widthPixels: toNumericPixels(style?.width),
    heightPixels: toNumericPixels(style?.height),
    widthRatio: toPercentRatio(style?.width),
    heightRatio: toPercentRatio(style?.height),
  }
}

function applyWidthRatioProps(
  props: Record<string, unknown>,
  ratio: number,
): void {
  props.anchor_left = 0
  props.anchor_right = ratio
  props.offset_left = 0
  props.offset_right = 0
}

function applyHeightRatioProps(
  props: Record<string, unknown>,
  ratio: number,
): void {
  props.anchor_top = 0
  props.anchor_bottom = ratio
  props.offset_top = 0
  props.offset_bottom = 0
}

export function applyStyleSizeProps(
  props: Record<string, unknown>,
  style: Pick<HtmlStyle, 'width' | 'height'> | undefined,
): ResolvedStyleSize {
  const size = resolveStyleSize(style)

  if (size.widthPixels != null) {
    props['custom_minimum_size:x'] = size.widthPixels
  } else if (size.widthRatio != null) {
    applyWidthRatioProps(props, size.widthRatio)
  }

  if (size.heightPixels != null) {
    props['custom_minimum_size:y'] = size.heightPixels
  } else if (size.heightRatio != null) {
    applyHeightRatioProps(props, size.heightRatio)
  }

  return size
}

function resolveMinimumAxisSize(
  sizeValue: number | string | undefined,
  minValue: number | undefined,
  maxValue: number | undefined,
): number | null {
  let resolved: number | null = toNumericPixels(sizeValue)

  if (typeof minValue === 'number' && Number.isFinite(minValue)) {
    resolved = resolved == null ? minValue : Math.max(resolved, minValue)
  }
  if (
    typeof maxValue === 'number' &&
    Number.isFinite(maxValue) &&
    resolved != null
  ) {
    resolved = Math.min(resolved, maxValue)
  }

  return resolved
}

function resolveContainerAlignment(
  tag: GodotContainerTag,
  justifyContent: HtmlStyle['justifyContent'],
): number | null {
  const supportsAlignment = tag !== 'GridContainer' && tag !== 'Control'
  if (!supportsAlignment) {
    return null
  }
  if (justifyContent === 'center') {
    return ContainerAlignment.CENTER
  }
  if (justifyContent === 'flex-end') {
    return ContainerAlignment.END
  }
  if (justifyContent === 'flex-start') {
    return ContainerAlignment.BEGIN
  }
  return null
}

export function resolveContainerTag(style: HtmlStyle): ContainerMapping {
  const themeOverrides: Record<string, number> = {}
  const props: Record<string, unknown> = {}
  let tag: GodotContainerTag

  if (style.display === 'none') {
    tag = 'Control'
    props['visible'] = false
  } else if (style.display === 'grid') {
    tag = 'GridContainer'
  } else {
    const isRow = !style.flexDirection || style.flexDirection === 'row'

    if (style.flexWrap === 'wrap') {
      tag = isRow ? 'HFlowContainer' : 'VFlowContainer'
    } else {
      tag = isRow ? 'HBoxContainer' : 'VBoxContainer'
    }
  }

  if (style.display !== 'none' && style.gap != null) {
    if (tag === 'HBoxContainer' || tag === 'VBoxContainer') {
      themeOverrides['separation'] = style.gap
    } else if (
      tag === 'HFlowContainer' ||
      tag === 'VFlowContainer' ||
      tag === 'GridContainer'
    ) {
      themeOverrides['h_separation'] = style.gap
      themeOverrides['v_separation'] = style.gap
    }
  }

  if (
    style.display !== 'none' &&
    tag === 'GridContainer' &&
    style.columns != null
  ) {
    props['columns'] = style.columns
  }

  if (style.display !== 'none') {
    const alignment = resolveContainerAlignment(tag, style.justifyContent)
    if (alignment != null) {
      props['alignment'] = alignment
    }
  }

  applyStyleSizeProps(props, style)

  const minWidth = resolveMinimumAxisSize(
    style.width,
    style.minWidth,
    style.maxWidth,
  )
  const minHeight = resolveMinimumAxisSize(
    style.height,
    style.minHeight,
    style.maxHeight,
  )

  if (minWidth != null) {
    props['custom_minimum_size:x'] = minWidth
  }
  if (minHeight != null) {
    props['custom_minimum_size:y'] = minHeight
  }

  return { tag, themeOverrides, props }
}
