import { atob as godotAtob, GodotTextEncoder } from '@vue-godot/browser'

// ---------------------------------------------------------------------------
// Data-URI parsing
// ---------------------------------------------------------------------------

export interface DataUriParts {
  mime: string
  buffer: ArrayBuffer
}

/**
 * Parse a `data:` URI into its MIME type and decoded binary payload.
 *
 * Handles both `;base64,` encoded URIs and percent-encoded URIs.
 * Returns `null` if the string doesn't match the `data:` URI syntax.
 */
export function parseDataUri(uri: string): DataUriParts | null {
  const match = uri.match(/^data:([^;,]+)?(?:;base64)?,(.*)$/)
  if (!match) return null

  const mime = (match[1] ?? 'application/octet-stream').toLowerCase()
  const raw = match[2]

  if (uri.includes(';base64,')) {
    const binaryStr = godotAtob(raw)
    const bytes = new Uint8Array(binaryStr.length)
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i)
    }
    return { mime, buffer: bytes.buffer as ArrayBuffer }
  }

  const decoded = decodeURIComponent(raw)
  const bytes = new GodotTextEncoder().encode(decoded)
  return { mime, buffer: bytes.buffer as ArrayBuffer }
}
