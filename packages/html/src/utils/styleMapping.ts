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
 *   width / height                    custom_minimum_size
 *   display: none                     visible = false
 */

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
  padding?: number
  paddingTop?: number
  paddingRight?: number
  paddingBottom?: number
  paddingLeft?: number
  width?: number | string
  height?: number | string
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  backgroundColor?: string
  color?: string
  fontSize?: number
  fontWeight?: 'normal' | 'bold'
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  textAlign?: 'left' | 'center' | 'right'
  overflowWrap?: 'normal' | 'break-word'
  overflow?: 'visible' | 'hidden'
  opacity?: number
}

export const supportedHtmlStyleKeys = [
  'alignItems',
  'alignSelf',
  'backgroundColor',
  'color',
  'columns',
  'display',
  'flex',
  'flexDirection',
  'flexWrap',
  'fontSize',
  'fontWeight',
  'gap',
  'height',
  'justifyContent',
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

export interface ResolvedPadding {
  top: number
  right: number
  bottom: number
  left: number
}

export function resolvePadding(style: HtmlStyle): ResolvedPadding | null {
  const top = style.paddingTop ?? style.padding
  const right = style.paddingRight ?? style.padding
  const bottom = style.paddingBottom ?? style.padding
  const left = style.paddingLeft ?? style.padding

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
