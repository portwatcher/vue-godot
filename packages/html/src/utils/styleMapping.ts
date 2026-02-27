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
 *   gap: <n>                          theme override "separation" = n
 *   flex: 1 (on child)               SizeFlags.EXPAND_FILL
 *   align-self: center (on child)    SizeFlags.SHRINK_CENTER
 *   padding: <n>                      MarginContainer wrapper or theme override
 *   width / height                    custom_minimum_size
 *   display: none                     visible = false
 */

export interface HtmlStyle {
  display?: 'flex' | 'grid' | 'none'
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  alignSelf?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  flex?: number
  gap?: number
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
  backgroundColor?: string
  color?: string
  fontSize?: number
  fontWeight?: 'normal' | 'bold'
  opacity?: number
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
  props: Record<string, any>
}

export function resolveContainerTag(style: HtmlStyle): ContainerMapping {
  const themeOverrides: Record<string, number> = {}
  const props: Record<string, any> = {}

  if (style.display === 'none') {
    return { tag: 'Control', themeOverrides, props: { visible: false } }
  }

  if (style.display === 'grid') {
    return { tag: 'GridContainer', themeOverrides, props }
  }

  let tag: GodotContainerTag

  const isRow = !style.flexDirection || style.flexDirection === 'row' || style.flexDirection === 'row-reverse'

  if (style.flexWrap === 'wrap' || style.flexWrap === 'wrap-reverse') {
    tag = isRow ? 'HFlowContainer' : 'VFlowContainer'
  } else {
    tag = isRow ? 'HBoxContainer' : 'VBoxContainer'
  }

  if (style.gap != null) {
    themeOverrides['separation'] = style.gap
  }

  return { tag, themeOverrides, props }
}
