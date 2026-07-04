// ---------------------------------------------------------------------------
// Clipboard polyfill for GodotJS
// ---------------------------------------------------------------------------
// Implements the text subset of the async Clipboard API on top of Godot's
// DisplayServer clipboard methods.
// ---------------------------------------------------------------------------

import { DisplayServer } from 'godot'

const DISPLAY_SERVER_FEATURE_CLIPBOARD = 5 as DisplayServer.Feature

export class GodotClipboardError extends Error {
  constructor(
    message: string,
    readonly code: 'not-supported' | 'not-allowed',
  ) {
    super(message)
    this.name = code === 'not-supported' ? 'NotSupportedError' : 'NotAllowedError'
  }
}

export function isClipboardSupported(): boolean {
  try {
    return DisplayServer.has_feature(DISPLAY_SERVER_FEATURE_CLIPBOARD)
  } catch {
    return false
  }
}

function assertClipboardSupported(): void {
  if (!isClipboardSupported()) {
    throw new GodotClipboardError(
      'navigator.clipboard is not supported by the current Godot DisplayServer.',
      'not-supported',
    )
  }
}

export class GodotClipboard {
  get supported(): boolean {
    return isClipboardSupported()
  }

  async readText(): Promise<string> {
    assertClipboardSupported()
    try {
      return DisplayServer.clipboard_get()
    } catch (error) {
      throw new GodotClipboardError(
        error instanceof Error
          ? error.message
          : 'DisplayServer refused clipboard read access.',
        'not-allowed',
      )
    }
  }

  async writeText(data: string): Promise<void> {
    assertClipboardSupported()
    try {
      DisplayServer.clipboard_set(String(data))
    } catch (error) {
      throw new GodotClipboardError(
        error instanceof Error
          ? error.message
          : 'DisplayServer refused clipboard write access.',
        'not-allowed',
      )
    }
  }
}

export const clipboard = new GodotClipboard()
