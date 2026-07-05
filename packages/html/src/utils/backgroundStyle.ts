import { StyleBoxFlat } from 'godot'
import { parseGodotColor } from './godotColor.js'
import {
  resolveBorderRadii,
  resolveBorderWidths,
  type HtmlStyle,
} from './styleMapping.js'

export function createBackgroundPanelStyle(
  styleOrColor: HtmlStyle | string | undefined,
): StyleBoxFlat | null {
  const style =
    typeof styleOrColor === 'string'
      ? { backgroundColor: styleOrColor }
      : styleOrColor
  const backgroundColor =
    typeof style?.backgroundColor === 'string'
      ? parseGodotColor(style.backgroundColor)
      : null
  const borderColor =
    typeof style?.borderColor === 'string'
      ? parseGodotColor(style.borderColor)
      : null
  const borderWidths = style ? resolveBorderWidths(style) : null
  const borderRadii = style ? resolveBorderRadii(style) : null
  const hasBorder =
    borderWidths != null &&
    (borderWidths.top > 0 ||
      borderWidths.right > 0 ||
      borderWidths.bottom > 0 ||
      borderWidths.left > 0)

  if (!backgroundColor && !hasBorder) {
    return null
  }

  const styleBox = new StyleBoxFlat()
  styleBox.draw_center = backgroundColor != null
  if (backgroundColor) {
    styleBox.bg_color = backgroundColor
  }
  if (borderColor) {
    styleBox.border_color = borderColor
  }
  if (borderWidths) {
    styleBox.border_width_top = borderWidths.top
    styleBox.border_width_right = borderWidths.right
    styleBox.border_width_bottom = borderWidths.bottom
    styleBox.border_width_left = borderWidths.left
  }
  if (borderRadii) {
    styleBox.corner_radius_top_left = borderRadii.topLeft
    styleBox.corner_radius_top_right = borderRadii.topRight
    styleBox.corner_radius_bottom_right = borderRadii.bottomRight
    styleBox.corner_radius_bottom_left = borderRadii.bottomLeft
  }
  return styleBox
}
