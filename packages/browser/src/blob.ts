// ---------------------------------------------------------------------------
// Minimal Blob implementation for GodotJS
// ---------------------------------------------------------------------------

import { GodotTextEncoder } from './encoding.js'

/**
 * A simplified `Blob` implementation backed by an ArrayBuffer.
 */
export class GodotBlob {
  private _buffer: ArrayBuffer
  private _type: string

  constructor(
    parts?: (ArrayBuffer | Uint8Array | string | GodotBlob)[],
    options?: { type?: string },
  ) {
    this._type = options?.type ?? ''

    if (!parts || parts.length === 0) {
      this._buffer = new ArrayBuffer(0)
      return
    }

    const encoder = new GodotTextEncoder()
    const buffers: Uint8Array[] = parts.map((part) => {
      if (typeof part === 'string') {
        return encoder.encode(part)
      }
      if (part instanceof Uint8Array) {
        return part
      }
      if (part instanceof GodotBlob) {
        return new Uint8Array(part._buffer)
      }
      // ArrayBuffer
      return new Uint8Array(part)
    })

    const totalLength = buffers.reduce((sum, b) => sum + b.byteLength, 0)
    const merged = new Uint8Array(totalLength)
    let offset = 0
    for (const buf of buffers) {
      merged.set(buf, offset)
      offset += buf.byteLength
    }
    this._buffer = merged.buffer as ArrayBuffer
  }

  get size(): number {
    return this._buffer.byteLength
  }

  get type(): string {
    return this._type
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    return this._buffer.slice(0)
  }

  async text(): Promise<string> {
    const { GodotTextDecoder } = await import('./encoding.js')
    return new GodotTextDecoder().decode(this._buffer)
  }

  slice(start?: number, end?: number, contentType?: string): GodotBlob {
    const buf = this._buffer.slice(start ?? 0, end ?? this._buffer.byteLength)
    return GodotBlob._fromBuffer(buf, contentType ?? this._type)
  }

  /** @internal Create a Blob wrapping an existing buffer. */
  static _fromBuffer(buffer: ArrayBuffer, type: string): GodotBlob {
    const blob = new GodotBlob([], { type })
    blob._buffer = buffer
    return blob
  }
}
