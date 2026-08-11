// ---------------------------------------------------------------------------
// FileReader polyfill for the Godot JavaScript Runtime
// ---------------------------------------------------------------------------

import { GodotBlob } from './blob.js'
import { GodotTextDecoder } from './encoding.js'
import { GodotEvent, GodotEventTarget } from './event-target.js'
import { btoa } from './base64.js'
import { queueMicrotask } from './timing.js'

type GodotFileReaderResult = string | ArrayBuffer | null
type GodotFileReaderEventHandler = (event: GodotEvent) => void

function bytesToBinaryString(bytes: Uint8Array): string {
  let result = ''
  for (const byte of bytes) {
    result += String.fromCharCode(byte)
  }
  return result
}

function arrayBufferToDataURL(buffer: ArrayBuffer, type: string): string {
  const binary = bytesToBinaryString(new Uint8Array(buffer))
  return `data:${type || 'application/octet-stream'};base64,${btoa(binary)}`
}

/**
 * Minimal `FileReader` implementation for Blob/File values.
 */
export class GodotFileReader extends GodotEventTarget {
  static readonly EMPTY = 0
  static readonly LOADING = 1
  static readonly DONE = 2

  readonly EMPTY = GodotFileReader.EMPTY
  readonly LOADING = GodotFileReader.LOADING
  readonly DONE = GodotFileReader.DONE

  readyState = GodotFileReader.EMPTY
  result: GodotFileReaderResult = null
  error: Error | null = null

  onabort: GodotFileReaderEventHandler | null = null
  onerror: GodotFileReaderEventHandler | null = null
  onload: GodotFileReaderEventHandler | null = null
  onloadend: GodotFileReaderEventHandler | null = null
  onloadstart: GodotFileReaderEventHandler | null = null

  private _aborted = false

  abort(): void {
    if (this.readyState !== GodotFileReader.LOADING) {
      this.result = null
      return
    }

    this._aborted = true
    this.result = null
    this.error = new Error('FileReader read was aborted.')
    this.readyState = GodotFileReader.DONE
    this._emit('abort')
    this._emit('loadend')
  }

  readAsArrayBuffer(blob: GodotBlob): void {
    this._read(blob, async () => blob.arrayBuffer())
  }

  readAsBinaryString(blob: GodotBlob): void {
    this._read(blob, async () =>
      bytesToBinaryString(new Uint8Array(await blob.arrayBuffer())),
    )
  }

  readAsDataURL(blob: GodotBlob): void {
    this._read(blob, async () =>
      arrayBufferToDataURL(await blob.arrayBuffer(), blob.type),
    )
  }

  readAsText(blob: GodotBlob, encoding?: string): void {
    this._read(blob, async () => {
      const decoder = new GodotTextDecoder(encoding)
      return decoder.decode(await blob.arrayBuffer())
    })
  }

  private _read(
    blob: GodotBlob,
    load: () => Promise<string | ArrayBuffer>,
  ): void {
    if (!(blob instanceof GodotBlob)) {
      throw new TypeError('FileReader can only read Blob or File values.')
    }
    if (this.readyState === GodotFileReader.LOADING) {
      throw new Error('FileReader is already loading.')
    }

    this.readyState = GodotFileReader.LOADING
    this.result = null
    this.error = null
    this._aborted = false
    this._emit('loadstart')

    queueMicrotask(() => {
      void this._finishRead(load)
    })
  }

  private async _finishRead(
    load: () => Promise<string | ArrayBuffer>,
  ): Promise<void> {
    try {
      const result = await load()
      if (this._aborted) return

      this.result = result
      this.readyState = GodotFileReader.DONE
      this._emit('load')
      this._emit('loadend')
    } catch (error) {
      if (this._aborted) return

      this.error = error instanceof Error ? error : new Error(String(error))
      this.result = null
      this.readyState = GodotFileReader.DONE
      this._emit('error')
      this._emit('loadend')
    }
  }

  private _emit(type: string): void {
    const event = new GodotEvent(type)
    const handler = this._handlerForType(type)
    if (handler) {
      handler(event)
    }
    this.dispatchEvent(event)
  }

  private _handlerForType(type: string): GodotFileReaderEventHandler | null {
    switch (type) {
      case 'abort':
        return this.onabort
      case 'error':
        return this.onerror
      case 'load':
        return this.onload
      case 'loadend':
        return this.onloadend
      case 'loadstart':
        return this.onloadstart
      default:
        return null
    }
  }
}
