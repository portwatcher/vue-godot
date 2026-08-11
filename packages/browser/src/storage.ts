// ---------------------------------------------------------------------------
// Storage polyfills for the Godot JavaScript Runtime
// ---------------------------------------------------------------------------

import { FileAccess } from 'godot'

const LOCAL_STORAGE_PATH = 'user://vue-godot-browser-local-storage.json'

interface StorageBackend {
  load(): Map<string, string>
  save(entries: ReadonlyMap<string, string>): void
}

function isStringRecord(value: unknown): value is Record<string, string> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const record = value as Record<string, unknown>
  return Object.keys(record).every((key) => typeof record[key] === 'string')
}

function mapFromRecord(record: Record<string, string>): Map<string, string> {
  return new Map(Object.entries(record))
}

function recordFromMap(
  entries: ReadonlyMap<string, string>,
): Record<string, string> {
  const record: Record<string, string> = {}
  for (const [key, value] of entries) {
    record[key] = value
  }
  return record
}

class MemoryStorageBackend implements StorageBackend {
  private _entries = new Map<string, string>()

  load(): Map<string, string> {
    return new Map(this._entries)
  }

  save(entries: ReadonlyMap<string, string>): void {
    this._entries = new Map(entries)
  }
}

class GodotFileStorageBackend implements StorageBackend {
  private readonly _fallback = new MemoryStorageBackend()

  constructor(private readonly _path: string) {}

  load(): Map<string, string> {
    try {
      if (!FileAccess.file_exists(this._path)) {
        return this._fallback.load()
      }

      const file = FileAccess.open(this._path, FileAccess.ModeFlags.READ)
      if (!file) {
        return this._fallback.load()
      }

      const text = file.get_as_text()
      file.close()
      if (text.trim() === '') {
        return new Map()
      }

      const parsed: unknown = JSON.parse(text)
      if (!isStringRecord(parsed)) {
        return new Map()
      }

      const entries = mapFromRecord(parsed)
      this._fallback.save(entries)
      return entries
    } catch {
      return this._fallback.load()
    }
  }

  save(entries: ReadonlyMap<string, string>): void {
    this._fallback.save(entries)

    try {
      const file = FileAccess.open(this._path, FileAccess.ModeFlags.WRITE)
      if (!file) {
        return
      }

      file.store_string(JSON.stringify(recordFromMap(entries)))
      file.close()
    } catch {
      // Keep the in-memory fallback updated when user:// cannot be written.
    }
  }
}

/**
 * Browser-compatible Storage implementation.
 */
export class GodotStorage {
  private _entries: Map<string, string>

  constructor(
    private readonly _backend: StorageBackend = new MemoryStorageBackend(),
  ) {
    this._entries = this._backend.load()
  }

  get length(): number {
    return this._entries.size
  }

  key(index: number): string | null {
    const normalizedIndex = Math.trunc(Number(index))
    if (!Number.isFinite(normalizedIndex) || normalizedIndex < 0) {
      return null
    }

    return Array.from(this._entries.keys())[normalizedIndex] ?? null
  }

  getItem(key: string): string | null {
    return this._entries.get(String(key)) ?? null
  }

  setItem(key: string, value: string): void {
    this._entries.set(String(key), String(value))
    this._persist()
  }

  removeItem(key: string): void {
    this._entries.delete(String(key))
    this._persist()
  }

  clear(): void {
    this._entries.clear()
    this._persist()
  }

  /** @internal */
  _snapshot(): Record<string, string> {
    return recordFromMap(this._entries)
  }

  private _persist(): void {
    this._backend.save(this._entries)
  }
}

export function createLocalStorage(path = LOCAL_STORAGE_PATH): GodotStorage {
  return new GodotStorage(new GodotFileStorageBackend(path))
}

export function createSessionStorage(): GodotStorage {
  return new GodotStorage(new MemoryStorageBackend())
}

export const localStorage = createLocalStorage()
export const sessionStorage = createSessionStorage()
