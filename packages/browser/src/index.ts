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
//   • Request         → Fetch-compatible request metadata/body wrapper
//   • URL             → Pure JS parser
//   • Headers         → Map-backed, Godot-array interop
//   • Response        → ArrayBuffer-backed, fetch-compatible
//   • Blob            → ArrayBuffer-backed
//   • atob / btoa     → Pure JS base64
//   • TextEncoder     → Pure JS UTF-8 (with V8 fast-path)
//   • TextDecoder     → Pure JS UTF-8 (with V8 fast-path)
//   • AbortController → Signal-based
//   • URLSearchParams → Pure JS query parameter helper
//   • FormData/File   → Multipart-compatible form bodies
//   • FileReader      → Async Blob/File readers
//   • Storage         → user:// localStorage and memory sessionStorage
//   • Navigator       → onLine and reachability probing
//   • timers/RAF      → SceneTree-backed timing where available
//   • performance     → Time-backed now() and marks/measures
//
// Quick start:
//   import { installBrowserAPIs } from '@vue-godot/browser'
//   installBrowserAPIs()   // patches globalThis once at startup
//
// Or import individual implementations:
//   import { fetch, GodotRequest, GodotURL, GodotHeaders } from '@vue-godot/browser'
// ---------------------------------------------------------------------------

// Individual implementations
export { GodotAbortController, GodotAbortSignal } from './abort.js'
export { atob, btoa } from './base64.js'
export { GodotBlob } from './blob.js'
export type { GodotBodyInit } from './body.js'
export { GodotTextDecoder, GodotTextEncoder } from './encoding.js'
export { GodotEvent, GodotEventTarget } from './event-target.js'
export { GodotFile } from './file.js'
export type { GodotFilePart, GodotFilePropertyBag } from './file.js'
export { GodotFileReader } from './file-reader.js'
export { fetch } from './fetch.js'
export type { GodotFetchInit } from './fetch.js'
export { GodotFormData } from './form-data.js'
export type { GodotFormDataEntryValue } from './form-data.js'
export { GodotHeaders } from './headers.js'
export { GodotRequest } from './request.js'
export type {
  GodotHeadersInit,
  GodotRequestInit,
  GodotRequestInput,
  GodotRequestRedirect,
} from './request.js'
export {
  GodotHistory,
  GodotLocation,
  PopStateEvent,
  createHistoryAndLocation,
  getGlobalEventTarget,
} from './history.js'
export {
  GodotNavigator,
  checkNetworkReachability,
  configureNetworkReachability,
  getNetworkReachabilityOptions,
  navigator,
  setNavigatorOnline,
} from './navigator.js'
export type { GodotNetworkReachabilityOptions } from './navigator.js'
export { GodotResponse } from './response.js'
export {
  GodotStorage,
  createLocalStorage,
  createSessionStorage,
  localStorage,
  sessionStorage,
} from './storage.js'
export {
  GodotURL,
  createObjectURL,
  resolveObjectURL,
  revokeObjectURL,
} from './url.js'
export { GodotURLSearchParams } from './url-search-params.js'
export type { GodotURLSearchParamsInit } from './url-search-params.js'
export {
  GodotPerformance,
  GodotPerformanceEntry,
  GodotPerformanceMark,
  GodotPerformanceMeasure,
  asyncDelay,
  cancelAnimationFrame,
  clearInterval,
  clearTimeout,
  performance,
  queueMicrotask,
  requestAnimationFrame,
  setInterval,
  setTimeout,
} from './timing.js'
export type {
  GodotAnimationFrameCallback,
  GodotPerformanceMarkOptions,
  GodotPerformanceMeasureOptions,
  GodotTimerHandler,
} from './timing.js'

// Batch installers
export { installBrowserAPIs, installPolyfill } from './install.js'
