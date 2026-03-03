// ---------------------------------------------------------------------------
// TextEncoder / TextDecoder polyfills for GodotJS
// ---------------------------------------------------------------------------
// Only UTF-8 is supported (matching the web platform's practical reality).
// ---------------------------------------------------------------------------

/**
 * Minimal TextEncoder — encodes a JS string into a UTF-8 Uint8Array.
 */
export class GodotTextEncoder {
  readonly encoding = 'utf-8'

  encode(input: string = ''): Uint8Array {
    // Fast path: V8/QuickJS may have a native encoder hidden somewhere.
    const g: Record<string, unknown> = globalThis
    if (typeof g['TextEncoder'] === 'function') {
      return new (g['TextEncoder'] as typeof GodotTextEncoder)().encode(input)
    }

    const bytes: number[] = []
    for (let i = 0; i < input.length; i++) {
      let code = input.charCodeAt(i)

      // Handle surrogate pairs
      if (code >= 0xd800 && code <= 0xdbff && i + 1 < input.length) {
        const lo = input.charCodeAt(i + 1)
        if (lo >= 0xdc00 && lo <= 0xdfff) {
          code = ((code - 0xd800) << 10) + (lo - 0xdc00) + 0x10000
          i++
        }
      }

      if (code < 0x80) {
        bytes.push(code)
      } else if (code < 0x800) {
        bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f))
      } else if (code < 0x10000) {
        bytes.push(
          0xe0 | (code >> 12),
          0x80 | ((code >> 6) & 0x3f),
          0x80 | (code & 0x3f),
        )
      } else {
        bytes.push(
          0xf0 | (code >> 18),
          0x80 | ((code >> 12) & 0x3f),
          0x80 | ((code >> 6) & 0x3f),
          0x80 | (code & 0x3f),
        )
      }
    }

    return new Uint8Array(bytes)
  }

  encodeInto(
    source: string,
    destination: Uint8Array,
  ): { read: number; written: number } {
    const encoded = this.encode(source)
    const written = Math.min(encoded.length, destination.byteLength)
    destination.set(encoded.subarray(0, written))
    // Count how many source chars were consumed for `written` bytes
    // (approximation — correct for ASCII, conservative for multi-byte)
    let read = 0
    let byteCount = 0
    while (read < source.length && byteCount < written) {
      const code = source.charCodeAt(read)
      if (code < 0x80) byteCount += 1
      else if (code < 0x800) byteCount += 2
      else if (code >= 0xd800 && code <= 0xdbff) {
        byteCount += 4
        read++ // skip low surrogate
      } else byteCount += 3
      read++
    }
    return { read, written }
  }
}

/**
 * Minimal TextDecoder — decodes a UTF-8 byte sequence into a JS string.
 */
export class GodotTextDecoder {
  readonly encoding = 'utf-8'
  readonly fatal: boolean
  readonly ignoreBOM: boolean

  constructor(
    _encoding: string = 'utf-8',
    options?: { fatal?: boolean; ignoreBOM?: boolean },
  ) {
    this.fatal = options?.fatal ?? false
    this.ignoreBOM = options?.ignoreBOM ?? false
  }

  decode(input?: ArrayBuffer | Uint8Array | ArrayBufferView): string {
    if (!input) return ''

    // Fast path
    const g: Record<string, unknown> = globalThis
    if (typeof g['TextDecoder'] === 'function') {
      return new (g['TextDecoder'] as typeof GodotTextDecoder)('utf-8', {
        fatal: this.fatal,
      }).decode(input)
    }

    const bytes =
      input instanceof Uint8Array
        ? input
        : new Uint8Array(
            'buffer' in input
              ? (input as ArrayBufferView).buffer
              : (input as ArrayBuffer),
          )

    let result = ''
    let i = 0

    // Skip BOM if present and not ignored
    if (
      !this.ignoreBOM &&
      bytes.length >= 3 &&
      bytes[0] === 0xef &&
      bytes[1] === 0xbb &&
      bytes[2] === 0xbf
    ) {
      i = 3
    }

    while (i < bytes.length) {
      const byte = bytes[i]
      let codePoint: number

      if (byte < 0x80) {
        codePoint = byte
        i++
      } else if ((byte & 0xe0) === 0xc0) {
        codePoint = ((byte & 0x1f) << 6) | (bytes[i + 1] & 0x3f)
        i += 2
      } else if ((byte & 0xf0) === 0xe0) {
        codePoint =
          ((byte & 0x0f) << 12) |
          ((bytes[i + 1] & 0x3f) << 6) |
          (bytes[i + 2] & 0x3f)
        i += 3
      } else if ((byte & 0xf8) === 0xf0) {
        codePoint =
          ((byte & 0x07) << 18) |
          ((bytes[i + 1] & 0x3f) << 12) |
          ((bytes[i + 2] & 0x3f) << 6) |
          (bytes[i + 3] & 0x3f)
        i += 4
      } else {
        // Invalid byte — replacement character
        codePoint = 0xfffd
        i++
      }

      if (codePoint > 0xffff) {
        // Encode as surrogate pair
        codePoint -= 0x10000
        result += String.fromCharCode(
          0xd800 + (codePoint >> 10),
          0xdc00 + (codePoint & 0x3ff),
        )
      } else {
        result += String.fromCharCode(codePoint)
      }
    }

    return result
  }
}
