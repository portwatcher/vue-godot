// ---------------------------------------------------------------------------
// FormData polyfill for GodotJS
// ---------------------------------------------------------------------------

import { GodotBlob } from './blob.js'
import { GodotTextEncoder } from './encoding.js'
import { GodotFile } from './file.js'

export type GodotFormDataEntryValue = string | GodotFile

type FormDataEntry = [string, GodotFormDataEntryValue]

let nextBoundaryId = 1

function createBoundary(): string {
  return `----vue-godot-formdata-${Date.now().toString(36)}-${nextBoundaryId++}`
}

function escapeMultipartValue(value: string): string {
  return value.replace(/\r/g, '%0D').replace(/\n/g, '%0A').replace(/"/g, '%22')
}

function mergeUint8Arrays(chunks: readonly Uint8Array[]): ArrayBuffer {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)
  const merged = new Uint8Array(totalLength)
  let offset = 0

  for (const chunk of chunks) {
    merged.set(chunk, offset)
    offset += chunk.byteLength
  }

  return merged.buffer as ArrayBuffer
}

async function fileToBytes(file: GodotFile): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer())
}

function toFormDataFile(
  value: GodotBlob,
  filename: string | undefined,
): GodotFile {
  if (value instanceof GodotFile && filename === undefined) {
    return value
  }

  const name = filename ?? (value instanceof GodotFile ? value.name : 'blob')
  const lastModified =
    value instanceof GodotFile ? value.lastModified : Date.now()

  return new GodotFile([value], name, {
    type: value.type,
    lastModified,
  })
}

/**
 * Ordered `FormData` implementation with duplicate-key support.
 *
 * This stores string values and file parts, and can serialize itself as
 * `multipart/form-data` for `fetch()`.
 */
export class GodotFormData implements Iterable<FormDataEntry> {
  private _entries: FormDataEntry[] = []
  private _boundary: string | null = null

  append(name: string, value: string | GodotBlob, filename?: string): void {
    this._entries.push([String(name), this._normalizeValue(value, filename)])
  }

  delete(name: string): void {
    const key = String(name)
    this._entries = this._entries.filter(([entryKey]) => entryKey !== key)
  }

  get(name: string): GodotFormDataEntryValue | null {
    const key = String(name)
    const match = this._entries.find(([entryKey]) => entryKey === key)
    return match ? match[1] : null
  }

  getAll(name: string): GodotFormDataEntryValue[] {
    const key = String(name)
    return this._entries
      .filter(([entryKey]) => entryKey === key)
      .map(([, value]) => value)
  }

  has(name: string): boolean {
    const key = String(name)
    return this._entries.some(([entryKey]) => entryKey === key)
  }

  set(name: string, value: string | GodotBlob, filename?: string): void {
    const key = String(name)
    const nextValue = this._normalizeValue(value, filename)
    const nextEntries: FormDataEntry[] = []
    let replaced = false

    for (const [entryKey, entryValue] of this._entries) {
      if (entryKey !== key) {
        nextEntries.push([entryKey, entryValue])
      } else if (!replaced) {
        nextEntries.push([key, nextValue])
        replaced = true
      }
    }

    if (!replaced) {
      nextEntries.push([key, nextValue])
    }

    this._entries = nextEntries
  }

  forEach(
    callback: (
      value: GodotFormDataEntryValue,
      name: string,
      formData: GodotFormData,
    ) => void,
  ): void {
    for (const [name, value] of this._entries) {
      callback(value, name, this)
    }
  }

  keys(): IterableIterator<string> {
    return this._entries.map(([key]) => key)[Symbol.iterator]()
  }

  values(): IterableIterator<GodotFormDataEntryValue> {
    return this._entries.map(([, value]) => value)[Symbol.iterator]()
  }

  entries(): IterableIterator<FormDataEntry> {
    return this._entries
      .map(([key, value]) => [key, value] as FormDataEntry)
      [Symbol.iterator]()
  }

  clone(): GodotFormData {
    const clone = new GodotFormData()
    clone._entries = this._entries.map(([key, value]) => [key, value])
    clone._boundary = this._boundary
    return clone
  }

  [Symbol.iterator](): IterableIterator<FormDataEntry> {
    return this.entries()
  }

  /** @internal */
  _getMultipartContentType(): string {
    return `multipart/form-data; boundary=${this._getBoundary()}`
  }

  /** @internal */
  async _toMultipartArrayBuffer(): Promise<ArrayBuffer> {
    const encoder = new GodotTextEncoder()
    const boundary = this._getBoundary()
    const chunks: Uint8Array[] = []

    for (const [name, value] of this._entries) {
      if (typeof value === 'string') {
        chunks.push(
          encoder.encode(
            `--${boundary}\r\n` +
              `Content-Disposition: form-data; name="${escapeMultipartValue(
                name,
              )}"\r\n\r\n` +
              `${value}\r\n`,
          ),
        )
        continue
      }

      chunks.push(
        encoder.encode(
          `--${boundary}\r\n` +
            `Content-Disposition: form-data; name="${escapeMultipartValue(
              name,
            )}"; filename="${escapeMultipartValue(value.name)}"\r\n` +
            `Content-Type: ${value.type || 'application/octet-stream'}\r\n\r\n`,
        ),
      )
      chunks.push(await fileToBytes(value))
      chunks.push(encoder.encode('\r\n'))
    }

    chunks.push(encoder.encode(`--${boundary}--\r\n`))
    return mergeUint8Arrays(chunks)
  }

  private _getBoundary(): string {
    if (this._boundary === null) {
      this._boundary = createBoundary()
    }
    return this._boundary
  }

  private _normalizeValue(
    value: string | GodotBlob,
    filename: string | undefined,
  ): GodotFormDataEntryValue {
    if (typeof value === 'string') {
      return String(value)
    }
    return toFormDataFile(value, filename)
  }
}
