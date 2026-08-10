// ---------------------------------------------------------------------------
// Minimal EventTarget implementation for the Godot JavaScript Runtime
// ---------------------------------------------------------------------------
// Provides a spec-aligned EventTarget that can be subclassed or used
// standalone. Also exposes a lightweight GodotEvent base class.
//
// Used by:
//   • GodotHistory — dispatches PopStateEvent on the global event target
//   • installBrowserAPIs — patches addEventListener / removeEventListener /
//     dispatchEvent onto globalThis so that libraries relying on
//     `window.addEventListener('popstate', …)` work out of the box.
// ---------------------------------------------------------------------------

/**
 * Minimal `Event`-compatible base class.
 *
 * Provides the properties that the spec requires listeners to be able to
 * inspect (`type`, `cancelable`, `defaultPrevented`). Subclass for richer
 * event types like `PopStateEvent`.
 */
export class GodotEvent {
  readonly type: string
  readonly cancelable: boolean
  defaultPrevented = false

  constructor(type: string, init?: { cancelable?: boolean }) {
    this.type = type
    this.cancelable = init?.cancelable ?? false
  }

  preventDefault(): void {
    if (this.cancelable) this.defaultPrevented = true
  }
}

type Listener = (event: GodotEvent) => void

/**
 * Minimal `EventTarget`-compatible class.
 *
 * Supports `addEventListener`, `removeEventListener`, and `dispatchEvent`
 * with the same signature as the DOM EventTarget.
 */
export class GodotEventTarget {
  private _listeners = new Map<string, Listener[]>()

  addEventListener(type: string, listener: Listener): void {
    let list = this._listeners.get(type)
    if (!list) {
      list = []
      this._listeners.set(type, list)
    }
    // Prevent duplicate registrations (same-type same-listener)
    if (!list.includes(listener)) {
      list.push(listener)
    }
  }

  removeEventListener(type: string, listener: Listener): void {
    const list = this._listeners.get(type)
    if (!list) return
    const idx = list.indexOf(listener)
    if (idx !== -1) list.splice(idx, 1)
  }

  dispatchEvent(event: GodotEvent): boolean {
    const list = this._listeners.get(event.type)
    if (!list) return true
    // Iterate a snapshot so mutations during dispatch are safe
    for (const fn of [...list]) {
      try {
        fn(event)
      } catch {
        // Swallow listener errors per spec behaviour
      }
    }
    return !event.defaultPrevented
  }
}
