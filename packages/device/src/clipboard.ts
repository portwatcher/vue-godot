import { DisplayServer } from 'godot'
import type { Image as GodotImage } from 'godot'
import { hasDisplayServerFeature } from './utils/displayServer.js'

export function isClipboardSupported(): boolean {
  return hasDisplayServerFeature(DisplayServer.Feature.FEATURE_CLIPBOARD)
}

export function isPrimaryClipboardSupported(): boolean {
  return hasDisplayServerFeature(DisplayServer.Feature.FEATURE_CLIPBOARD_PRIMARY)
}

export function hasClipboardText(): boolean {
  try {
    return isClipboardSupported() && DisplayServer.clipboard_has()
  } catch {
    return false
  }
}

export function readClipboardText(): string | null {
  if (!isClipboardSupported()) {
    return null
  }

  try {
    return DisplayServer.clipboard_get()
  } catch {
    return null
  }
}

export function writeClipboardText(data: string): boolean {
  if (!isClipboardSupported()) {
    return false
  }

  try {
    DisplayServer.clipboard_set(String(data))
    return true
  } catch {
    return false
  }
}

export function hasClipboardImage(): boolean {
  try {
    return isClipboardSupported() && DisplayServer.clipboard_has_image()
  } catch {
    return false
  }
}

export function readClipboardImage(): GodotImage | null {
  if (!hasClipboardImage()) {
    return null
  }

  try {
    return DisplayServer.clipboard_get_image()
  } catch {
    return null
  }
}

export function readPrimaryClipboardText(): string | null {
  if (!isPrimaryClipboardSupported()) {
    return null
  }

  try {
    return DisplayServer.clipboard_get_primary()
  } catch {
    return null
  }
}

export function writePrimaryClipboardText(data: string): boolean {
  if (!isPrimaryClipboardSupported()) {
    return false
  }

  try {
    DisplayServer.clipboard_set_primary(String(data))
    return true
  } catch {
    return false
  }
}
