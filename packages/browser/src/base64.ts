// ---------------------------------------------------------------------------
// atob / btoa polyfills for GodotJS
// ---------------------------------------------------------------------------
// GodotJS (V8/QuickJS) does not expose the browser atob/btoa globals.
// These implementations work on the standard base64 alphabet.
// ---------------------------------------------------------------------------

const BASE64_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

/**
 * Decode a base64-encoded string into a binary string
 * (each char's code-point is one byte, matching the browser `atob` spec).
 */
export function atob(encoded: string): string {
  const cleaned = encoded.replace(/[\s=]/g, '')
  let bits = 0
  let value = 0
  let result = ''

  for (let i = 0; i < cleaned.length; i++) {
    const idx = BASE64_CHARS.indexOf(cleaned[i])
    if (idx === -1) {
      throw new DOMException(
        `Failed to execute 'atob': The string contains characters outside of the valid base64 range.`,
      )
    }
    value = (value << 6) | idx
    bits += 6
    if (bits >= 8) {
      bits -= 8
      result += String.fromCharCode((value >>> bits) & 0xff)
    }
  }

  return result
}

/**
 * Encode a binary string (each char code-point ≤ 255) into base64.
 */
export function btoa(input: string): string {
  let result = ''
  let i = 0

  while (i < input.length) {
    const a = input.charCodeAt(i++)
    const b = i < input.length ? input.charCodeAt(i++) : -1
    const c = i < input.length ? input.charCodeAt(i++) : -1

    if (a > 255 || (b > 255 && b !== -1) || (c > 255 && c !== -1)) {
      throw new DOMException(
        `Failed to execute 'btoa': The string to be encoded contains characters outside of the Latin1 range.`,
      )
    }

    const triplet = (a << 16) | (b !== -1 ? b << 8 : 0) | (c !== -1 ? c : 0)

    result += BASE64_CHARS[(triplet >>> 18) & 0x3f]
    result += BASE64_CHARS[(triplet >>> 12) & 0x3f]
    result += b !== -1 ? BASE64_CHARS[(triplet >>> 6) & 0x3f] : '='
    result += c !== -1 ? BASE64_CHARS[triplet & 0x3f] : '='
  }

  return result
}

// Minimal DOM-compat shim (atob/btoa spec says it throws DOMException)
class DOMException extends Error {
  override name = 'DOMException'
}
