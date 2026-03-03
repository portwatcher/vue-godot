// ---------------------------------------------------------------------------
// Minimal Headers implementation for GodotJS
// ---------------------------------------------------------------------------

/**
 * A simplified `Headers` class compatible with the Fetch API surface.
 */
export class GodotHeaders {
  private _map: Map<string, string[]> = new Map()

  constructor(
    init?: Record<string, string> | [string, string][] | GodotHeaders,
  ) {
    if (init instanceof GodotHeaders) {
      init.forEach((value, key) => this.append(key, value))
    } else if (Array.isArray(init)) {
      for (const [k, v] of init) {
        this.append(k, v)
      }
    } else if (init && typeof init === 'object') {
      for (const key of Object.keys(init)) {
        this.append(key, init[key])
      }
    }
  }

  append(name: string, value: string): void {
    const key = name.toLowerCase()
    const existing = this._map.get(key)
    if (existing) {
      existing.push(value)
    } else {
      this._map.set(key, [value])
    }
  }

  delete(name: string): void {
    this._map.delete(name.toLowerCase())
  }

  get(name: string): string | null {
    const values = this._map.get(name.toLowerCase())
    return values ? values.join(', ') : null
  }

  has(name: string): boolean {
    return this._map.has(name.toLowerCase())
  }

  set(name: string, value: string): void {
    this._map.set(name.toLowerCase(), [value])
  }

  forEach(
    callback: (value: string, key: string, parent: GodotHeaders) => void,
  ): void {
    this._map.forEach((values, key) => {
      callback(values.join(', '), key, this)
    })
  }

  entries(): IterableIterator<[string, string]> {
    const self = this
    return (function* () {
      for (const [key, values] of self._map) {
        yield [key, values.join(', ')] as [string, string]
      }
    })()
  }

  keys(): IterableIterator<string> {
    return this._map.keys()
  }

  *values(): IterableIterator<string> {
    for (const values of this._map.values()) {
      yield values.join(', ')
    }
  }

  /**
   * Serialize to the `["Key: Value", ...]` format that Godot's
   * HTTPClient.request() expects.
   */
  toGodotArray(): string[] {
    const result: string[] = []
    this._map.forEach((values, key) => {
      for (const v of values) {
        result.push(`${key}: ${v}`)
      }
    })
    return result
  }

  /**
   * Parse Godot's `PackedStringArray` header format (`"Key: Value"` lines).
   */
  static fromGodotArray(headers: string[]): GodotHeaders {
    const h = new GodotHeaders()
    for (const line of headers) {
      const colonIdx = line.indexOf(':')
      if (colonIdx === -1) continue
      const key = line.slice(0, colonIdx).trim()
      const value = line.slice(colonIdx + 1).trim()
      h.append(key, value)
    }
    return h
  }
}
