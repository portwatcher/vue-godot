// ---------------------------------------------------------------------------
// Minimal URL parser for GodotJS
// ---------------------------------------------------------------------------
// Implements the subset of the WHATWG URL API needed by fetch and general use.
// ---------------------------------------------------------------------------

/**
 * Lightweight URL implementation.
 *
 * Supports `http:`, `https:`, and opaque schemes.
 * Does NOT implement `searchParams` (add if needed).
 */
export class GodotURL {
  protocol: string = ''
  hostname: string = ''
  port: string = ''
  pathname: string = '/'
  search: string = ''
  hash: string = ''
  username: string = ''
  password: string = ''

  constructor(url: string, base?: string) {
    const resolved = base ? this._resolve(url, base) : url
    this._parse(resolved)
  }

  get host(): string {
    return this.port ? `${this.hostname}:${this.port}` : this.hostname
  }

  get origin(): string {
    if (this.protocol === 'http:' || this.protocol === 'https:') {
      return `${this.protocol}//${this.host}`
    }
    return 'null'
  }

  get href(): string {
    let auth = ''
    if (this.username) {
      auth = this.password
        ? `${this.username}:${this.password}@`
        : `${this.username}@`
    }
    return `${this.protocol}//${auth}${this.host}${this.pathname}${this.search}${this.hash}`
  }

  toString(): string {
    return this.href
  }

  private _resolve(relative: string, base: string): string {
    // If relative is already absolute, return as-is
    if (/^https?:\/\//i.test(relative)) return relative
    const baseUrl = new GodotURL(base)
    if (relative.startsWith('//')) {
      return `${baseUrl.protocol}${relative}`
    }
    if (relative.startsWith('/')) {
      return `${baseUrl.origin}${relative}`
    }
    // Relative path
    const basePath = baseUrl.pathname.replace(/\/[^/]*$/, '/')
    return `${baseUrl.origin}${basePath}${relative}`
  }

  private _parse(url: string): void {
    // Protocol
    const protoMatch = url.match(/^([a-z][a-z0-9+\-.]*):\/\//i)
    if (!protoMatch) {
      // Treat as opaque / relative
      this.pathname = url
      return
    }
    this.protocol = protoMatch[1].toLowerCase() + ':'
    let rest = url.slice(protoMatch[0].length)

    // Auth (user:pass@)
    const atIdx = rest.indexOf('@')
    const slashIdx = rest.indexOf('/')
    if (atIdx !== -1 && (slashIdx === -1 || atIdx < slashIdx)) {
      const auth = rest.slice(0, atIdx)
      rest = rest.slice(atIdx + 1)
      const colonIdx = auth.indexOf(':')
      if (colonIdx !== -1) {
        this.username = decodeURIComponent(auth.slice(0, colonIdx))
        this.password = decodeURIComponent(auth.slice(colonIdx + 1))
      } else {
        this.username = decodeURIComponent(auth)
      }
    }

    // Hash
    const hashIdx = rest.indexOf('#')
    if (hashIdx !== -1) {
      this.hash = rest.slice(hashIdx)
      rest = rest.slice(0, hashIdx)
    }

    // Query
    const queryIdx = rest.indexOf('?')
    if (queryIdx !== -1) {
      this.search = rest.slice(queryIdx)
      rest = rest.slice(0, queryIdx)
    }

    // Host + path
    const pathStart = rest.indexOf('/')
    const hostPart = pathStart !== -1 ? rest.slice(0, pathStart) : rest
    this.pathname = pathStart !== -1 ? rest.slice(pathStart) : '/'

    // hostname:port
    // Handle IPv6 [::1]:port
    const bracketEnd = hostPart.indexOf(']')
    if (hostPart.startsWith('[') && bracketEnd !== -1) {
      this.hostname = hostPart.slice(0, bracketEnd + 1)
      const afterBracket = hostPart.slice(bracketEnd + 1)
      if (afterBracket.startsWith(':')) {
        this.port = afterBracket.slice(1)
      }
    } else {
      const lastColon = hostPart.lastIndexOf(':')
      if (lastColon !== -1) {
        this.hostname = hostPart.slice(0, lastColon)
        this.port = hostPart.slice(lastColon + 1)
      } else {
        this.hostname = hostPart
      }
    }

    this.hostname = this.hostname.toLowerCase()
  }
}
