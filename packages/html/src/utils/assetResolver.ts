/**
 * Resolves web-style asset paths to Godot resource paths.
 *
 * Examples:
 *   "./assets/logo.png"    → "res://assets/logo.png"
 *   "../shared/icon.svg"   → "res://shared/icon.svg"
 *   "/textures/bg.png"     → "res://textures/bg.png"
 *   "res://already.png"    → "res://already.png"  (passthrough)
 *   "user://saves/a.png"   → "user://saves/a.png" (passthrough)
 */
export function resolveAssetPath(src: string): string {
  if (src.startsWith('res://') || src.startsWith('user://')) {
    return src
  }

  const normalized = src
    .replace(/^\.\//, '')
    .replace(/^\//, '')

  return `res://${normalized}`
}
