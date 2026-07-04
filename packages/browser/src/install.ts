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
import {
  GodotClipboard,
  clipboard as godotClipboard,
  isClipboardSupported,
} from './clipboard.js'
import {
  GodotDeviceMotionEvent,
  GodotDeviceOrientationEvent,
  configureDeviceSensorEvents,
  dispatchDeviceSensorEvents,
  getDeviceSensorEventOptions,
  readDeviceMotion,
  readDeviceOrientation,
  startDeviceSensorEvents,
  stopDeviceSensorEvents,
} from './device-sensors.js'
import { GodotTextDecoder, GodotTextEncoder } from './encoding.js'
import { GodotFile } from './file.js'
import { GodotFileReader } from './file-reader.js'
import { fetch } from './fetch.js'
import { GodotFormData } from './form-data.js'
import { GodotHeaders } from './headers.js'
import { GodotRequest } from './request.js'
import {
  createHistoryAndLocation,
  getGlobalEventTarget,
  GodotHistory,
  GodotLocation,
  PopStateEvent,
} from './history.js'
import {
  checkNetworkReachability,
  configureNetworkReachability,
  GodotNavigator,
  getNetworkReachabilityOptions,
  navigator as godotNavigator,
  setNavigatorOnline,
} from './navigator.js'
import { GodotResponse } from './response.js'
import {
  cancelAnimationFrame,
  clearInterval as godotClearInterval,
  clearTimeout as godotClearTimeout,
  performance,
  queueMicrotask,
  requestAnimationFrame,
  setInterval as godotSetInterval,
  setTimeout as godotSetTimeout,
} from './timing.js'
import {
  GodotStorage,
  localStorage as godotLocalStorage,
  sessionStorage as godotSessionStorage,
} from './storage.js'
import { createObjectURL, GodotURL, revokeObjectURL } from './url.js'
import { GodotURLSearchParams } from './url-search-params.js'
import { isVibrationSupported, vibrate } from './vibration.js'

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
  polyfill('TextEncoder', GodotTextEncoder)
  polyfill('TextDecoder', GodotTextDecoder)
  polyfill('Blob', GodotBlob)
  polyfill('File', GodotFile)
  polyfill('FileReader', GodotFileReader)
  polyfill('FormData', GodotFormData)
  polyfill('fetch', fetch)
  polyfill('Headers', GodotHeaders)
  polyfill('Response', GodotResponse)
  polyfill('Request', GodotRequest)
  polyfill('URL', GodotURL)
  polyfill('URLSearchParams', GodotURLSearchParams)
  polyfill('Storage', GodotStorage)
  polyfill('localStorage', godotLocalStorage)
  polyfill('sessionStorage', godotSessionStorage)
  polyfill('Navigator', GodotNavigator)
  polyfill('navigator', godotNavigator)
  polyfill('DeviceMotionEvent', GodotDeviceMotionEvent)
  polyfill('DeviceOrientationEvent', GodotDeviceOrientationEvent)

  // URL.createObjectURL / revokeObjectURL (static methods)
  if (typeof g['URL'] === 'function') {
    const UrlCtor = g['URL'] as unknown as Record<string, unknown>
    if (typeof UrlCtor['createObjectURL'] === 'undefined') {
      UrlCtor['createObjectURL'] = createObjectURL
    }
    if (typeof UrlCtor['revokeObjectURL'] === 'undefined') {
      UrlCtor['revokeObjectURL'] = revokeObjectURL
    }
  }
  polyfill('atob', atob)
  polyfill('btoa', btoa)
  polyfill('AbortController', GodotAbortController)
  polyfill('AbortSignal', GodotAbortSignal)
  polyfill('setTimeout', godotSetTimeout)
  polyfill('clearTimeout', godotClearTimeout)
  polyfill('setInterval', godotSetInterval)
  polyfill('clearInterval', godotClearInterval)
  polyfill('queueMicrotask', queueMicrotask)
  polyfill('requestAnimationFrame', requestAnimationFrame)
  polyfill('cancelAnimationFrame', cancelAnimationFrame)
  polyfill('performance', performance)

  // History API — history, location, PopStateEvent, and global event methods
  polyfill('PopStateEvent', PopStateEvent)

  if (
    typeof g['history'] === 'undefined' ||
    typeof g['location'] === 'undefined'
  ) {
    const pair = createHistoryAndLocation(
      typeof g['location'] === 'object' && g['location'] !== null
        ? String(g['location'])
        : undefined,
    )
    polyfill('history', pair.history)
    polyfill('location', pair.location)
  }

  // Global addEventListener / removeEventListener / dispatchEvent
  // (required for libraries that do `window.addEventListener('popstate', …)`)
  const target = getGlobalEventTarget()
  polyfill('addEventListener', target.addEventListener.bind(target))
  polyfill('removeEventListener', target.removeEventListener.bind(target))
  polyfill('dispatchEvent', target.dispatchEvent.bind(target))
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
    Request: GodotRequest,
    Response: GodotResponse,
    URL: GodotURL,
    URLSearchParams: GodotURLSearchParams,
    Storage: GodotStorage,
    localStorage: godotLocalStorage,
    sessionStorage: godotSessionStorage,
    Navigator: GodotNavigator,
    navigator: godotNavigator,
    Clipboard: GodotClipboard,
    clipboard: godotClipboard,
    isClipboardSupported,
    isVibrationSupported,
    vibrate,
    DeviceMotionEvent: GodotDeviceMotionEvent,
    DeviceOrientationEvent: GodotDeviceOrientationEvent,
    configureDeviceSensorEvents,
    dispatchDeviceSensorEvents,
    getDeviceSensorEventOptions,
    readDeviceMotion,
    readDeviceOrientation,
    startDeviceSensorEvents,
    stopDeviceSensorEvents,
    checkNetworkReachability,
    configureNetworkReachability,
    getNetworkReachabilityOptions,
    setNavigatorOnline,
    'URL.createObjectURL': createObjectURL,
    'URL.revokeObjectURL': revokeObjectURL,
    Blob: GodotBlob,
    File: GodotFile,
    FileReader: GodotFileReader,
    FormData: GodotFormData,
    atob,
    btoa,
    TextEncoder: GodotTextEncoder,
    TextDecoder: GodotTextDecoder,
    AbortController: GodotAbortController,
    AbortSignal: GodotAbortSignal,
    setTimeout: godotSetTimeout,
    clearTimeout: godotClearTimeout,
    setInterval: godotSetInterval,
    clearInterval: godotClearInterval,
    queueMicrotask,
    requestAnimationFrame,
    cancelAnimationFrame,
    performance,
    PopStateEvent,
    History: GodotHistory,
    Location: GodotLocation,
  }

  for (const name of names) {
    const impl = registry[name]
    if (impl !== undefined) {
      polyfill(name, impl)
    }
  }
}
