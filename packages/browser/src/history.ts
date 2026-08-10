// ---------------------------------------------------------------------------
// Web-standards-compatible History API polyfill for the Godot JavaScript Runtime
// ---------------------------------------------------------------------------
// Implements the core History API surface:
//   • History      — push / replace / go / back / forward + state
//   • Location     — mirrors the current URL, supports assign / replace
//   • PopStateEvent — fired asynchronously on go() / back() / forward()
//
// Spec references:
//   https://html.spec.whatwg.org/multipage/nav-history-apis.html#the-history-interface
//   https://html.spec.whatwg.org/multipage/nav-history-apis.html#the-location-interface
//
// Design notes:
//   • History and Location are tightly coupled — a factory function
//     (`createHistoryAndLocation`) creates them as a linked pair.
//   • PopState events are dispatched on a module-level global EventTarget
//     singleton which is installed onto globalThis by `installBrowserAPIs`.
//   • URL resolution reuses GodotURL to stay DRY.
// ---------------------------------------------------------------------------

import { GodotEvent, GodotEventTarget } from './event-target.js'
import { GodotURL } from './url.js'

// ---------------------------------------------------------------------------
// Module-level global event target (acts as `window` for event dispatch)
// ---------------------------------------------------------------------------

const globalTarget = new GodotEventTarget()

/**
 * Returns the shared `EventTarget` singleton used for global events like
 * `popstate`. The `install` module patches its methods onto `globalThis`.
 */
export function getGlobalEventTarget(): GodotEventTarget {
  return globalTarget
}

// ---------------------------------------------------------------------------
// PopStateEvent
// ---------------------------------------------------------------------------

/**
 * Event object passed to `popstate` listeners.
 *
 * Per spec, `popstate` fires on traversal (go / back / forward) but
 * **not** on pushState / replaceState.
 */
export class PopStateEvent extends GodotEvent {
  readonly state: unknown

  constructor(type: 'popstate', init?: { state?: unknown }) {
    super(type)
    this.state = init?.state ?? null
  }
}

// ---------------------------------------------------------------------------
// Internal history entry
// ---------------------------------------------------------------------------

interface HistoryEntry {
  state: unknown
  title: string
  url: string
}

// ---------------------------------------------------------------------------
// GodotLocation
// ---------------------------------------------------------------------------

/**
 * In-memory `Location` implementation.
 *
 * Always reflects the URL of the current history entry. Mutating the
 * location (`.href = …`, `.assign()`, `.replace()`) delegates to the
 * linked `GodotHistory` instance so the entry stack stays in sync.
 */
export class GodotLocation {
  private _url: GodotURL

  /** @internal – set by the factory after construction */
  _history: GodotHistory | null = null

  constructor(url?: string) {
    this._url = new GodotURL(url ?? 'http://localhost/')
  }

  // -- read-only URL components -------------------------------------------

  get href(): string {
    return this._url.href
  }

  set href(value: string) {
    this.assign(value)
  }

  get protocol(): string {
    return this._url.protocol
  }

  get hostname(): string {
    return this._url.hostname
  }

  get port(): string {
    return this._url.port
  }

  get pathname(): string {
    return this._url.pathname
  }

  get search(): string {
    return this._url.search
  }

  get hash(): string {
    return this._url.hash
  }

  get host(): string {
    return this._url.host
  }

  get origin(): string {
    return this._url.origin
  }

  // -- navigation methods -------------------------------------------------

  /**
   * Navigate to `url`, creating a new history entry (like clicking a link).
   */
  assign(url: string): void {
    if (this._history) {
      this._history.pushState(null, '', url)
    } else {
      this._url = new GodotURL(url, this._url.href)
    }
  }

  /**
   * Navigate to `url` **without** creating a new history entry.
   */
  replace(url: string): void {
    if (this._history) {
      this._history.replaceState(null, '', url)
    } else {
      this._url = new GodotURL(url, this._url.href)
    }
  }

  /**
   * No-op in a headless environment — there is nothing to reload.
   */
  reload(): void {
    // intentional no-op
  }

  // -- internal -----------------------------------------------------------

  /** @internal – called by GodotHistory when the active entry changes. */
  _setURL(url: string): void {
    this._url = new GodotURL(url)
  }

  toString(): string {
    return this.href
  }
}

// ---------------------------------------------------------------------------
// GodotHistory
// ---------------------------------------------------------------------------

type ScrollRestoration = 'auto' | 'manual'

/**
 * In-memory `History` implementation.
 *
 * Maintains a stack of `{ state, title, url }` entries and a pointer to
 * the current entry. Navigation methods update the pointer (and truncate
 * forward entries on push). `popstate` events are dispatched
 * asynchronously through the module-level global event target.
 */
export class GodotHistory {
  private _entries: HistoryEntry[]
  private _index: number
  private _location: GodotLocation

  scrollRestoration: ScrollRestoration = 'auto'

  constructor(location: GodotLocation) {
    this._location = location
    this._entries = [{ state: null, title: '', url: location.href }]
    this._index = 0
  }

  /** Number of entries in the session history. */
  get length(): number {
    return this._entries.length
  }

  /** State object for the current entry. */
  get state(): unknown {
    return this._entries[this._index]?.state ?? null
  }

  // -- mutation methods (no popstate) -------------------------------------

  /**
   * Push a new entry onto the history stack.
   *
   * If `url` is relative it is resolved against the current entry's URL.
   * Per spec, this does **not** fire `popstate`.
   */
  pushState(state: unknown, title: string, url?: string | null): void {
    const resolvedUrl = this._resolveURL(url)

    // Truncate any forward entries
    this._entries.length = this._index + 1
    this._entries.push({ state, title, url: resolvedUrl })
    this._index++
    this._location._setURL(resolvedUrl)
  }

  /**
   * Replace the current entry.
   *
   * Per spec, this does **not** fire `popstate`.
   */
  replaceState(state: unknown, title: string, url?: string | null): void {
    const resolvedUrl = this._resolveURL(url)
    this._entries[this._index] = { state, title, url: resolvedUrl }
    this._location._setURL(resolvedUrl)
  }

  // -- traversal methods (fire popstate) ----------------------------------

  /**
   * Navigate `delta` entries from the current position.
   *
   * Out-of-range deltas are silently ignored (per spec). A `popstate`
   * event is dispatched asynchronously after the traversal.
   */
  go(delta?: number): void {
    const d = delta ?? 0
    if (d === 0) return

    const newIndex = this._index + d
    if (newIndex < 0 || newIndex >= this._entries.length) return

    this._index = newIndex
    const entry = this._entries[this._index]
    this._location._setURL(entry.url)

    // Per spec, popstate fires asynchronously (as a queued task).
    const entryState: unknown = entry.state
    Promise.resolve().then(() => {
      globalTarget.dispatchEvent(
        new PopStateEvent('popstate', { state: entryState }),
      )
    })
  }

  /** Equivalent to `go(-1)`. */
  back(): void {
    this.go(-1)
  }

  /** Equivalent to `go(1)`. */
  forward(): void {
    this.go(1)
  }

  // -- helpers ------------------------------------------------------------

  private _resolveURL(url: string | null | undefined): string {
    if (url == null) return this._entries[this._index].url
    return new GodotURL(url, this._entries[this._index].url).href
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Create a linked `GodotHistory` + `GodotLocation` pair.
 *
 * The two objects stay in sync: navigating the history updates the
 * location, and mutating the location (`.assign()` / `.replace()`)
 * delegates to the history.
 *
 * @param initialUrl — the initial URL for the session (defaults to
 *                     `http://localhost/`).
 */
export function createHistoryAndLocation(initialUrl?: string): {
  history: GodotHistory
  location: GodotLocation
} {
  const location = new GodotLocation(initialUrl)
  const history = new GodotHistory(location)
  location._history = history
  return { history, location }
}
