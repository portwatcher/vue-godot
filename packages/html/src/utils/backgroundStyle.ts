import { StyleBoxFlat } from 'godot'
import { parseGodotColor } from './godotColor.js'

export function createBackgroundPanelStyle(
  color: string | undefined,
): StyleBoxFlat | null {
  if (!color) {
    return null
  }

  const parsed = parseGodotColor(color)
  if (!parsed) {
    return null
  }

  const styleBox = new StyleBoxFlat()
  styleBox.bg_color = parsed
  styleBox.draw_center = true
  return styleBox
}
