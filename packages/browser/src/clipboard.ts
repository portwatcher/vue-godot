// ---------------------------------------------------------------------------
// Clipboard polyfill for the Godot JavaScript Runtime
// ---------------------------------------------------------------------------
// Implements the text subset of the async Clipboard API on top of Godot's
// @vue-godot/device clipboard helpers.
// ---------------------------------------------------------------------------

import {
  isClipboardSupported as isGodotClipboardSupported,
  readClipboardText,
  writeClipboardText,
} from '@vue-godot/device/clipboard'

export class GodotClipboardError extends Error {
  constructor(
    message: string,
    readonly code: 'not-supported' | 'not-allowed',
  ) {
    super(message)
    this.name =
      code === 'not-supported' ? 'NotSupportedError' : 'NotAllowedError'
  }
}

export function isClipboardSupported(): boolean {
  return isGodotClipboardSupported()
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
    const text = readClipboardText()
    if (text !== null) {
      return text
    }

    throw new GodotClipboardError(
      'DisplayServer refused clipboard read access.',
      'not-allowed',
    )
  }

  async writeText(data: string): Promise<void> {
    assertClipboardSupported()
    if (writeClipboardText(String(data))) {
      return
    }

    throw new GodotClipboardError(
      'DisplayServer refused clipboard write access.',
      'not-allowed',
    )
  }
}

export const clipboard = new GodotClipboard()
