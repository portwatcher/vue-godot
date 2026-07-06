// ---------------------------------------------------------------------------
// Minimal AbortController / AbortSignal for GodotJS
// ---------------------------------------------------------------------------

/**
 * Simplified abort event.
 */
export interface GodotAbortEvent {
  type: 'abort'
  target: GodotAbortSignal
}

/**
 * Simplified AbortSignal.
 */
export class GodotAbortSignal {
  aborted = false
  reason: unknown = undefined

  private _listeners: Array<(ev: GodotAbortEvent) => void> = []

  addEventListener(
    _type: 'abort',
    listener: (ev: GodotAbortEvent) => void,
  ): void {
    this._listeners.push(listener)
  }

  removeEventListener(
    _type: 'abort',
    listener: (ev: GodotAbortEvent) => void,
  ): void {
    const idx = this._listeners.indexOf(listener)
    if (idx !== -1) this._listeners.splice(idx, 1)
  }

  /** @internal */
  _abort(reason?: unknown): void {
    if (this.aborted) return
    this.aborted = true
    this.reason = reason ?? new Error('The operation was aborted.')
    for (const fn of this._listeners) {
      try {
        fn({ type: 'abort', target: this })
      } catch {
        // Swallow listener errors per spec behavior
      }
    }
  }

  throwIfAborted(): void {
    if (this.aborted) {
      throw this.reason
    }
  }
}

/**
 * Simplified AbortController.
 */
export class GodotAbortController {
  readonly signal = new GodotAbortSignal()

  abort(reason?: unknown): void {
    this.signal._abort(reason)
  }
}
