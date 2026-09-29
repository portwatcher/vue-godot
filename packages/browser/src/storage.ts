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

class GodotFileStorageBackend implements StorageBackend {
  constructor(private readonly _path: string) {}

  load(): Map<string, string> {
    try {
      if (!FileAccess.file_exists(this._path)) {
        return new Map()
      }

      const file = FileAccess.open(this._path, FileAccess.ModeFlags.READ)
      if (!file) {
        return new Map()
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

      return new Map(Object.entries(parsed))
    } catch {
      return new Map()
    }
  }

  save(entries: ReadonlyMap<string, string>): void {
    try {
      const file = FileAccess.open(this._path, FileAccess.ModeFlags.WRITE)
      if (!file) {
        return
      }

      file.store_string(JSON.stringify(Object.fromEntries(entries)))
      file.close()
    } catch {
      // GodotStorage already holds the updated entries in memory.
    }
  }
}

/**
 * Browser-compatible Storage implementation.
 */
export class GodotStorage {
  private _entries: Map<string, string>

  constructor(private readonly _backend?: StorageBackend) {
    this._entries = _backend?.load() ?? new Map()
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

  private _persist(): void {
    this._backend?.save(this._entries)
  }
}

export function createLocalStorage(path = LOCAL_STORAGE_PATH): GodotStorage {
  return new GodotStorage(new GodotFileStorageBackend(path))
}

export function createSessionStorage(): GodotStorage {
  return new GodotStorage()
}

export const localStorage = createLocalStorage()
export const sessionStorage = createSessionStorage()
