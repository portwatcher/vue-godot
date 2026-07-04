// ---------------------------------------------------------------------------
// URLSearchParams polyfill for GodotJS
// ---------------------------------------------------------------------------

export type GodotURLSearchParamsInit =
  | string
  | GodotURLSearchParams
  | Iterable<readonly [string, string]>
  | Record<string, string>

type SearchParamEntry = [string, string]

function decodeParam(value: string): string {
  return decodeURIComponent(value.replace(/\+/g, ' '))
}

function encodeParam(value: string): string {
  return encodeURIComponent(value).replace(/%20/g, '+')
}

function hasIterator(
  value: unknown,
): value is Iterable<readonly [string, string]> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { [Symbol.iterator]?: unknown })[Symbol.iterator] ===
      'function'
  )
}

/**
 * Web-compatible `URLSearchParams` subset.
 *
 * Stores duplicate keys in insertion order and serializes spaces as `+`, like
 * browser `URLSearchParams`. When owned by `GodotURL`, mutations update the
 * URL's `.search` and `.href` immediately.
 */
export class GodotURLSearchParams implements Iterable<SearchParamEntry> {
  private _entries: SearchParamEntry[] = []
  private _onChange: ((query: string) => void) | null = null

  constructor(init?: GodotURLSearchParamsInit) {
    if (init !== undefined) {
      this._appendInit(init)
    }
  }

  get size(): number {
    return this._entries.length
  }

  append(name: string, value: string): void {
    this._entries.push([String(name), String(value)])
    this._notifyChange()
  }

  delete(name: string, value?: string): void {
    const key = String(name)
    const expectedValue = value === undefined ? undefined : String(value)
    this._entries = this._entries.filter(([entryKey, entryValue]) => {
      if (entryKey !== key) return true
      return expectedValue !== undefined && entryValue !== expectedValue
    })
    this._notifyChange()
  }

  get(name: string): string | null {
    const key = String(name)
    const match = this._entries.find(([entryKey]) => entryKey === key)
    return match ? match[1] : null
  }

  getAll(name: string): string[] {
    const key = String(name)
    return this._entries
      .filter(([entryKey]) => entryKey === key)
      .map(([, value]) => value)
  }

  has(name: string, value?: string): boolean {
    const key = String(name)
    const expectedValue = value === undefined ? undefined : String(value)
    return this._entries.some(([entryKey, entryValue]) => {
      if (entryKey !== key) return false
      return expectedValue === undefined || entryValue === expectedValue
    })
  }

  set(name: string, value: string): void {
    const key = String(name)
    const nextValue = String(value)
    const nextEntries: SearchParamEntry[] = []
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
    this._notifyChange()
  }

  sort(): void {
    this._entries.sort(([a], [b]) => a.localeCompare(b))
    this._notifyChange()
  }

  forEach(
    callback: (
      value: string,
      name: string,
      params: GodotURLSearchParams,
    ) => void,
  ): void {
    for (const [name, value] of this._entries) {
      callback(value, name, this)
    }
  }

  keys(): IterableIterator<string> {
    return this._entries.map(([key]) => key)[Symbol.iterator]()
  }

  values(): IterableIterator<string> {
    return this._entries.map(([, value]) => value)[Symbol.iterator]()
  }

  entries(): IterableIterator<SearchParamEntry> {
    return this._entries
      .map(([key, value]) => [key, value] as SearchParamEntry)
      [Symbol.iterator]()
  }

  toString(): string {
    return this._entries
      .map(([key, value]) => `${encodeParam(key)}=${encodeParam(value)}`)
      .join('&')
  }

  [Symbol.iterator](): IterableIterator<SearchParamEntry> {
    return this.entries()
  }

  /** @internal */
  _setChangeCallback(callback: ((query: string) => void) | null): void {
    this._onChange = callback
  }

  /** @internal */
  _replaceFromString(search: string): void {
    this._entries = []
    this._appendQueryString(search)
  }

  private _appendInit(init: GodotURLSearchParamsInit): void {
    if (typeof init === 'string') {
      this._appendQueryString(init)
      return
    }

    if (init instanceof GodotURLSearchParams) {
      for (const [key, value] of init) {
        this._entries.push([key, value])
      }
      return
    }

    if (hasIterator(init)) {
      for (const tuple of init) {
        const [key, value] = tuple
        this._entries.push([String(key), String(value)])
      }
      return
    }

    for (const key of Object.keys(init)) {
      this._entries.push([key, String(init[key])])
    }
  }

  private _appendQueryString(search: string): void {
    const query = search.startsWith('?') ? search.slice(1) : search
    if (!query) return

    for (const pair of query.split('&')) {
      if (pair === '') continue
      const equalsIndex = pair.indexOf('=')
      const key = equalsIndex === -1 ? pair : pair.slice(0, equalsIndex)
      const value = equalsIndex === -1 ? '' : pair.slice(equalsIndex + 1)
      this._entries.push([decodeParam(key), decodeParam(value)])
    }
  }

  private _notifyChange(): void {
    if (this._onChange) {
      this._onChange(this.toString())
    }
  }
}
