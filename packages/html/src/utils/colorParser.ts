/**
 * Parse a hex color string (#RGB, #RRGGBB, #RRGGBBAA) into a Godot-compatible
 * `r,g,b,a` string that the renderer can convert.
 *
 * Returns `null` for unsupported formats.
 */
export function parseHexColor(color: string): string | null {
  const hex = color.startsWith('#') ? color.slice(1) : null
  if (!hex) return null

  let r: number, g: number, b: number, a: number
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16) / 255
    g = parseInt(hex[1] + hex[1], 16) / 255
    b = parseInt(hex[2] + hex[2], 16) / 255
    a = 1
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16) / 255
    g = parseInt(hex.slice(2, 4), 16) / 255
    b = parseInt(hex.slice(4, 6), 16) / 255
    a = 1
  } else if (hex.length === 8) {
    r = parseInt(hex.slice(0, 2), 16) / 255
    g = parseInt(hex.slice(2, 4), 16) / 255
    b = parseInt(hex.slice(4, 6), 16) / 255
    a = parseInt(hex.slice(6, 8), 16) / 255
  } else {
    return null
  }

  if ([r, g, b, a].some((v) => !Number.isFinite(v))) return null
  return `${r},${g},${b},${a}`
}
