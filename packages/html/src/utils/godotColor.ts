import { Color } from 'godot'
import { parseColorChannels, type ParsedColor } from './colorParser.js'

export function colorChannelsToGodotColor(channels: ParsedColor): Color {
  return new Color(channels.r, channels.g, channels.b, channels.a)
}

export function parseGodotColor(color: string): Color | null {
  const parsed = parseColorChannels(color)
  return parsed ? colorChannelsToGodotColor(parsed) : null
}

export function createOpacityModulate(alpha: number): Color {
  return new Color(1, 1, 1, alpha)
}
