import { DisplayServer } from 'godot'

export function getDisplayServerName(): string {
  try {
    return String(DisplayServer.get_name())
  } catch {
    return ''
  }
}

export function hasDisplayServerFeature(
  feature: DisplayServer.Feature,
): boolean {
  try {
    return DisplayServer.has_feature(feature)
  } catch {
    return false
  }
}
