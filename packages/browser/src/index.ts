// ---------------------------------------------------------------------------
// @vue-godot/browser — Browser API polyfills for GodotJS
// ---------------------------------------------------------------------------
//
// GodotJS provides only engine bindings (the "godot" module) and a minimal
// JS runtime (V8/QuickJS). Browser/DOM APIs like `fetch`, `URL`, `Blob`,
// `atob`, `TextEncoder`, etc. are not available.
//
// This package implements those APIs on top of Godot's native classes:
//   • fetch()         → Godot HTTPClient
//   • URL             → Pure JS parser
//   • Headers         → Map-backed, Godot-array interop
//   • Response        → ArrayBuffer-backed, fetch-compatible
//   • Blob            → ArrayBuffer-backed
//   • atob / btoa     → Pure JS base64
//   • TextEncoder     → Pure JS UTF-8 (with V8 fast-path)
//   • TextDecoder     → Pure JS UTF-8 (with V8 fast-path)
//   • AbortController → Signal-based
//
// Quick start:
//   import { installBrowserAPIs } from '@vue-godot/browser'
//   installBrowserAPIs()   // patches globalThis once at startup
//
// Or import individual implementations:
//   import { fetch, GodotURL, GodotHeaders } from '@vue-godot/browser'
// ---------------------------------------------------------------------------

// Individual implementations
export { GodotAbortController, GodotAbortSignal } from './abort.js'
export { atob, btoa } from './base64.js'
export { GodotBlob } from './blob.js'
export { GodotTextDecoder, GodotTextEncoder } from './encoding.js'
export { GodotEvent, GodotEventTarget } from './event-target.js'
export { fetch } from './fetch.js'
export type { GodotFetchInit } from './fetch.js'
export { GodotHeaders } from './headers.js'
export {
  GodotHistory,
  GodotLocation,
  PopStateEvent,
  createHistoryAndLocation,
  getGlobalEventTarget,
} from './history.js'
export { GodotResponse } from './response.js'
export {
  GodotURL,
  createObjectURL,
  resolveObjectURL,
  revokeObjectURL,
} from './url.js'

// Batch installers
export { installBrowserAPIs, installPolyfill } from './install.js'
