// ---------------------------------------------------------------------------
// Install browser API polyfills onto globalThis
// ---------------------------------------------------------------------------
// Call `installBrowserAPIs()` once at application startup, before any
// code that depends on browser globals like `fetch`, `atob`, `URL`, etc.
//
// Only installs polyfills for APIs that are not already present, so it
// is safe to call in environments that already provide them.
// ---------------------------------------------------------------------------

import { GodotAbortController, GodotAbortSignal } from './abort.js'
import { atob, btoa } from './base64.js'
import { GodotBlob } from './blob.js'
import { GodotTextDecoder, GodotTextEncoder } from './encoding.js'
import { fetch } from './fetch.js'
import { GodotHeaders } from './headers.js'
import { GodotResponse } from './response.js'
import { GodotURL } from './url.js'

const g: Record<string, unknown> = globalThis

function polyfill(name: string, impl: unknown): void {
  if (typeof g[name] === 'undefined') {
    g[name] = impl
  }
}

/**
 * Install all browser API polyfills onto `globalThis`.
 *
 * Usage (at the top of your main.ts):
 *   import { installBrowserAPIs } from '@vue-godot/browser'
 *   installBrowserAPIs()
 */
export function installBrowserAPIs(): void {
  polyfill('fetch', fetch)
  polyfill('Headers', GodotHeaders)
  polyfill('Response', GodotResponse)
  polyfill('Request', undefined) // TODO: implement Request
  polyfill('URL', GodotURL)
  polyfill('Blob', GodotBlob)
  polyfill('atob', atob)
  polyfill('btoa', btoa)
  polyfill('TextEncoder', GodotTextEncoder)
  polyfill('TextDecoder', GodotTextDecoder)
  polyfill('AbortController', GodotAbortController)
  polyfill('AbortSignal', GodotAbortSignal)
}

/**
 * Install only a specific subset of polyfills.
 *
 * Usage:
 *   import { installPolyfill } from '@vue-godot/browser'
 *   installPolyfill('fetch', 'URL', 'atob', 'btoa')
 */
export function installPolyfill(...names: string[]): void {
  const registry: Record<string, unknown> = {
    fetch,
    Headers: GodotHeaders,
    Response: GodotResponse,
    URL: GodotURL,
    Blob: GodotBlob,
    atob,
    btoa,
    TextEncoder: GodotTextEncoder,
    TextDecoder: GodotTextDecoder,
    AbortController: GodotAbortController,
    AbortSignal: GodotAbortSignal,
  }

  for (const name of names) {
    const impl = registry[name]
    if (impl !== undefined) {
      polyfill(name, impl)
    }
  }
}
