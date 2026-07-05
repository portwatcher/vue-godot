export interface EdgeInsets {
  top: number
  right: number
  bottom: number
  left: number
}

export const zeroEdgeInsets: EdgeInsets = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
}

export function createMarginThemeOverrides(
  insets: EdgeInsets,
): Record<string, unknown> {
  return {
    'theme_override_constants/margin_top': insets.top,
    'theme_override_constants/margin_right': insets.right,
    'theme_override_constants/margin_bottom': insets.bottom,
    'theme_override_constants/margin_left': insets.left,
  }
}
