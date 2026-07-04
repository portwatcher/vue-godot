# @vue-godot/browser

Browser API polyfills for **GodotJS**.

GodotJS provides only engine bindings (the `godot` module) and a minimal JS runtime (V8 or QuickJS). Standard browser/DOM APIs like `fetch`, `URL`, `Blob`, `File`, `FormData`, `atob`, `TextEncoder`, `history`, timers, `requestAnimationFrame`, etc. are **not** available. This package re-implements them on top of Godot's native classes so that higher-level libraries (and your own code) can use familiar Web APIs without modification.

See the repository [compatibility checklist](../../docs/compatibility.md) for support status, platform caveats, and skipped browser APIs.

## Installation

```bash
npm install @vue-godot/browser
```

## Quick start

Call `installBrowserAPIs()` once at startup to patch `globalThis` with every polyfill:

```ts
import { installBrowserAPIs } from '@vue-godot/browser'

installBrowserAPIs()

// Now you can use fetch(), Request, URL, Blob, FormData, storage, timers, history, etc. globally
const res = await fetch('https://example.com/data.json')
const data = await res.json()
```

Or install only the APIs you need:

```ts
import { installPolyfill } from '@vue-godot/browser'

installPolyfill('fetch', 'URL', 'atob', 'btoa')
```

You can also import individual implementations directly without patching globals:

```ts
import { fetch, GodotRequest, GodotURL, GodotHeaders } from '@vue-godot/browser'
```

## Provided APIs

| API                                              | Implementation         | Notes                                                                                                                                            |
| ------------------------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fetch()`                                        | Godot `HTTPClient`     | Supports GET/POST/PUT/DELETE, `Request` input, redirects (up to 20), TLS, `AbortSignal`, string/ArrayBuffer/Uint8Array/Blob/File/FormData bodies |
| `Request`                                        | `GodotRequest`         | Fetch-compatible request metadata/body wrapper; `.text()`, `.json()`, `.arrayBuffer()`, `.blob()`, `.clone()`                                    |
| `Headers`                                        | `GodotHeaders`         | Map-backed with `toGodotArray()` / `fromGodotArray()` interop                                                                                    |
| `Response`                                       | `GodotResponse`        | ArrayBuffer-backed; `.json()`, `.text()`, `.arrayBuffer()`, `.blob()`, `.clone()`                                                                |
| `Blob`                                           | `GodotBlob`            | ArrayBuffer-backed; `.slice()`, `.text()`, `.arrayBuffer()`, `.size`, `.type`                                                                    |
| `File`                                           | `GodotFile`            | Blob-backed file metadata; `.name`, `.lastModified`, `.webkitRelativePath`                                                                       |
| `FormData`                                       | `GodotFormData`        | Ordered duplicate keys, string/file values, multipart serialization for `fetch()` bodies                                                         |
| `FileReader`                                     | `GodotFileReader`      | Async `readAsText()`, `readAsArrayBuffer()`, `readAsDataURL()`, `readAsBinaryString()` for Blob/File values                                      |
| `WebSocket`                                      | `GodotWebSocket`       | Browser WebSocket subset backed by `WebSocketPeer`; supports open/message/error/close, text/binary send, `binaryType`, protocols, and close codes |
| `Storage`                                        | `GodotStorage`         | Web Storage API shape; `.length`, `.key()`, `.getItem()`, `.setItem()`, `.removeItem()`, `.clear()`                                              |
| `localStorage`                                   | `GodotStorage`         | Persistent JSON-backed storage at `user://vue-godot-browser-local-storage.json` with memory fallback                                             |
| `sessionStorage`                                 | `GodotStorage`         | Process-memory storage; cleared when the GodotJS runtime exits or reloads                                                                        |
| `navigator`                                      | `GodotNavigator`       | Provides `navigator.onLine`, `navigator.permissions`, adapter-backed `navigator.geolocation`, `navigator.clipboard`, and `navigator.vibrate()`; reachability changes dispatch events |
| `navigator.permissions.query()`                  | `GodotPermissions`     | Query-only Permissions API subset for mapped Godot/Android permissions and local capabilities; never triggers native permission prompts             |
| `navigator.geolocation`                          | `GodotGeolocation`     | Browser Geolocation API callback subset exposed only when a `@vue-godot/device` `GeolocationAdapter` is registered                                 |
| `navigator.clipboard.readText()` / `writeText()` | `GodotClipboard`       | Async text clipboard subset backed by `DisplayServer.clipboard_get()` / `clipboard_set()` when the display server supports clipboard access       |
| `isClipboardSupported()`                         | DisplayServer helper   | Returns whether the current display server reports text clipboard support                                                                         |
| `navigator.vibrate()`                            | Godot handheld haptics | Browser Vibration API subset backed by `Input.vibrate_handheld()`                                                                                |
| `isVibrationSupported()`                         | Input helper           | Returns whether Godot's handheld vibration method is exposed                                                                                     |
| `DeviceMotionEvent` / `DeviceOrientationEvent`   | Godot sensor events    | Event classes plus opt-in polling helpers backed by `Input` accelerometer, gyroscope, magnetometer, and gravity sensors                          |
| `readDeviceMotion()` / `readDeviceOrientation()` | Godot sensor reads     | Snapshot helpers for motion/orientation data without starting an event loop                                                                      |
| `checkNetworkReachability()`                     | Fetch probe            | Configurable HTTP probe using `fetch()` and `AbortController`                                                                                    |
| `URL`                                            | `GodotURL`             | WHATWG subset — `protocol`, `hostname`, `port`, `pathname`, `search`, `searchParams`, `hash`, `href`, `toString()`                               |
| `URLSearchParams`                                | `GodotURLSearchParams` | Query string helper with duplicate-key support, iteration, `.append()`, `.set()`, `.getAll()`, `.sort()`                                         |
| `atob` / `btoa`                                  | Pure JS                | RFC 4648 base64 encode/decode                                                                                                                    |
| `TextEncoder`                                    | `GodotTextEncoder`     | UTF-8 `.encode()` with V8 native fast-path when available                                                                                        |
| `TextDecoder`                                    | `GodotTextDecoder`     | UTF-8 `.decode()` with V8 native fast-path when available                                                                                        |
| `AbortController`                                | `GodotAbortController` | Signal-based; `.abort()`, `.signal`                                                                                                              |
| `AbortSignal`                                    | `GodotAbortSignal`     | `.aborted`, `.reason`, `addEventListener('abort', …)`                                                                                            |
| `setTimeout` / `clearTimeout`                    | Godot timing           | Uses `SceneTree.create_timer()` where available; falls back to host timers in tests                                                              |
| `setInterval` / `clearInterval`                  | Godot timing           | Repeating timer built on the same scheduler as `setTimeout`                                                                                      |
| `queueMicrotask`                                 | Promise microtask      | Schedules callbacks through the JS microtask queue                                                                                               |
| `requestAnimationFrame` / `cancelAnimationFrame` | Godot frame timing     | Uses `SceneTree.process_frame` where available; falls back to a 16 ms timer before the scene tree exists                                         |
| `performance`                                    | `GodotPerformance`     | `Time.get_ticks_usec()`-backed `.now()` plus basic marks, measures, and entry lookup                                                             |
| `history`                                        | `GodotHistory`         | In-memory session history; `pushState()`, `replaceState()`, `go()`, `back()`, `forward()`, `.state`                                              |
| `location`                                       | `GodotLocation`        | Reflects the current URL; `.href`, `.pathname`, `.search`, `.hash`, `assign()`, `replace()`                                                      |
| `PopStateEvent`                                  | `PopStateEvent`        | Fired on traversal (`go` / `back` / `forward`); carries `.state`                                                                                 |
| `addEventListener` (global)                      | `GodotEventTarget`     | Enables `addEventListener('popstate', …)` on `globalThis`                                                                                        |
| `EventTarget`                                    | `GodotEventTarget`     | Standalone or subclassable; `addEventListener`, `removeEventListener`, `dispatchEvent`                                                           |

## History API

The History API polyfill implements the [WHATWG History spec](https://html.spec.whatwg.org/multipage/nav-history-apis.html#the-history-interface) as an in-memory entry stack. This enables SPA routers like **Vue Router** to work out of the box with `createWebHistory()` — no custom router wrapper needed.

### How it works

`installBrowserAPIs()` patches `globalThis` with:

- `history` — a `GodotHistory` instance (push/replace/go/back/forward + state)
- `location` — a `GodotLocation` instance (always reflects the current URL)
- `addEventListener` / `removeEventListener` / `dispatchEvent` — delegated to a shared `GodotEventTarget` singleton

These are the same globals that `createWebHistory()` from Vue Router (and similar libraries) use internally.

### Usage with Vue Router

```ts
import { installBrowserAPIs } from '@vue-godot/browser'
installBrowserAPIs()

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
  ],
})
```

### Spec compliance

- `pushState()` / `replaceState()` do **not** fire `popstate` (per spec)
- `go()` / `back()` / `forward()` fire `popstate` **asynchronously** via a microtask
- Relative URLs are resolved against the current entry
- Forward entries are truncated on `pushState()` (per spec)
- Out-of-range `go(delta)` calls are silently ignored (per spec)

### Standalone usage

You can also create a linked History + Location pair without installing globals:

```ts
import { createHistoryAndLocation } from '@vue-godot/browser'

const { history, location } = createHistoryAndLocation('http://localhost/app')

history.pushState({ page: 1 }, '', '/app/page1')
console.log(location.pathname) // "/app/page1"

history.back() // fires popstate asynchronously
```

## Timing And Performance

`installBrowserAPIs()` installs browser-compatible timers only when the target runtime does not already provide them. In Godot, timers use `SceneTree.create_timer()` so they do not busy-wait while HTTP polling, animations, or app logic are running. `requestAnimationFrame()` waits for `SceneTree.process_frame` and passes a `performance.now()` timestamp to the callback.

```ts
setTimeout(() => {
  console.log('later')
}, 250)

const frame = requestAnimationFrame((time) => {
  performance.mark('frame')
  console.log(time)
})
cancelAnimationFrame(frame)
```

The `performance` polyfill supports `now()`, `mark()`, `measure()`, `getEntries()`, `getEntriesByName()`, `getEntriesByType()`, `clearMarks()`, and `clearMeasures()`. It is intentionally limited to local process timing; navigation/resource timing entries are not synthesized.

## URLSearchParams

`GodotURL` exposes a live `.searchParams` object. Mutating it updates `.search` and `.href` immediately.

```ts
const url = new URL('https://example.com/items?page=1')
url.searchParams.set('page', '2')
url.searchParams.append('tag', 'godot')

console.log(url.href) // "https://example.com/items?page=2&tag=godot"
```

## How `fetch()` works

Under the hood, `fetch()` drives Godot's `HTTPClient` through its state machine using a non-blocking poll loop:

1. **Connect** — `HTTPClient.connect_to_host()` with optional TLS
2. **Poll** — Advances the connection by calling `HTTPClient.poll()` in a loop, yielding via `SceneTree.create_timer().timeout.as_promise()` between iterations (no busy-waiting)
3. **Request** — Sends the HTTP request with headers and body
4. **Read** — Streams the response body in chunks, concatenating `PackedByteArray` buffers
5. **Return** — Wraps the result in a `GodotResponse`

Redirects (301, 302, 303, 307, 308) are followed automatically up to 20 hops.

## WebSocket

`WebSocket` wraps Godot's `WebSocketPeer` and polls it with the same timer scheduler used by the rest of the browser package. It supports the common client API surface: `readyState`, `protocol`, `bufferedAmount`, `binaryType`, `send()`, `close()`, and `open` / `message` / `error` / `close` events.

```ts
const socket = new WebSocket('wss://example.com/realtime', ['chat'])

socket.onopen = () => {
  socket.send('hello')
}

socket.onmessage = (event) => {
  console.log(event.data)
}

socket.onclose = (event) => {
  console.log(event.code, event.reason)
}
```

Text messages are delivered as strings. Binary messages are delivered as `Blob` by default or `ArrayBuffer` when `socket.binaryType = 'arraybuffer'`. Godot's WebSocket implementation still needs the app to keep running its main loop; this wrapper polls automatically while the socket is connecting or open.

## Request API

`GodotRequest` mirrors the fetch `Request` shape used by common libraries: it stores `url`, normalized uppercase `method`, `headers`, `signal`, `redirect`, `bodyUsed`, and exposes `.text()`, `.json()`, `.arrayBuffer()`, `.blob()`, and `.clone()`.

```ts
import { GodotRequest, fetch } from '@vue-godot/browser'

const req = new GodotRequest('https://example.com/api', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ ok: true }),
})

const res = await fetch(req)
```

As in browsers, `GET` and `HEAD` requests cannot have bodies, and body helper methods can only consume a request once.

## File, FormData, And FileReader

`File` extends the Blob implementation with `name`, `lastModified`, and `webkitRelativePath`. `FormData` stores duplicate keys in insertion order and accepts string, `Blob`, or `File` values. When a `FormData` instance is used as a `Request`/`fetch()` body, `@vue-godot/browser` serializes it as `multipart/form-data` and adds the boundary-bearing `Content-Type` header when the caller has not already set one.

```ts
const form = new FormData()
form.append('title', 'Screenshot')
form.append('image', new File([bytes], 'screen.png', { type: 'image/png' }))

await fetch('https://example.com/upload', {
  method: 'POST',
  body: form,
})
```

`FileReader` provides event-compatible async reads for Blob/File values:

```ts
const reader = new FileReader()
reader.onload = () => {
  console.log(reader.result)
}
reader.readAsText(new Blob(['hello']))
```

## Web Storage

`localStorage` persists string key/value pairs to `user://vue-godot-browser-local-storage.json` using Godot `FileAccess`. If the file cannot be read or written, it falls back to process memory so the API remains predictable during early startup or restricted exports.

```ts
localStorage.setItem('auth-token', token)
const token = localStorage.getItem('auth-token')
localStorage.removeItem('auth-token')
```

`sessionStorage` uses process memory only. It survives within the active GodotJS runtime but is cleared when the runtime exits, the app restarts, or the script context is reloaded.

## Network Reachability

`navigator.onLine` starts as `true`, matching browser behavior. Call `checkNetworkReachability()` to run a configurable HTTP probe; when the result changes, the shared global event target dispatches `online` or `offline`.

```ts
import {
  checkNetworkReachability,
  configureNetworkReachability,
} from '@vue-godot/browser'

configureNetworkReachability({
  url: 'https://example.com/health',
  method: 'GET',
  timeoutMs: 2000,
  expectedStatus: [200, 204],
})

addEventListener('offline', () => {
  console.log('network unavailable')
})

const online = await checkNetworkReachability()
console.log(navigator.onLine, online)
```

The default probe is a `HEAD` request to `https://example.com/` with a five-second timeout. Internet reachability is always best-effort; captive portals, firewall rules, and platform network policies can all affect the result.

## Permissions

`navigator.permissions.query()` implements a query-only subset. It never calls `OS.request_permission()` and never opens a native permission prompt. It reports `granted` when Godot already exposes the backing capability or `OS.get_granted_permissions()` includes a mapped Android permission, `prompt` when a mapped runtime permission is not currently granted, and `denied` when a local capability is unavailable.

```ts
const camera = await navigator.permissions.query({ name: 'camera' })
const clipboard = await navigator.permissions.query({ name: 'clipboard-read' })

console.log(camera.state, clipboard.state)
```

Supported names are `camera`, `microphone`, `geolocation`, `notifications`, `persistent-storage`, `clipboard-read`, `clipboard-write`, `accelerometer`, `gyroscope`, and `magnetometer`. Unknown names reject with `TypeError`. Android mappings use `CAMERA`, `RECORD_AUDIO`, `ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION`, and `POST_NOTIFICATIONS`; plugin-backed APIs still need their own adapter and permission flow.

## Geolocation

`navigator.geolocation` is intentionally exposed only after a
`@vue-godot/device` `GeolocationAdapter` is registered. This avoids presenting a
browser API when the app has no native location backend.

```ts
import { installBrowserAPIs } from '@vue-godot/browser'
import { registerDeviceCapability } from '@vue-godot/device'

registerDeviceCapability({
  capability: 'geolocation',
  pluginName: 'my-location-plugin',
  async getCurrentPosition(options) {
    return myLocationPlugin.getCurrentPosition(options)
  },
  watchPosition(onPosition, onError, options) {
    return myLocationPlugin.watchPosition(onPosition, onError, options)
  },
  clearWatch(watchId) {
    myLocationPlugin.clearWatch(watchId)
  },
})

installBrowserAPIs()

navigator.geolocation?.getCurrentPosition(
  (position) => {
    console.log(position.coords.latitude, position.coords.longitude)
  },
  (error) => {
    console.log(error.code, error.message)
  },
)
```

The browser wrapper supports `getCurrentPosition()`, `watchPosition()`, and
`clearWatch()`. Adapter permission failures map to browser-style geolocation
error code `1` (`PERMISSION_DENIED`); missing plugins, unsupported platforms,
and export misconfiguration map to code `2` (`POSITION_UNAVAILABLE`); timeout
errors map to code `3` (`TIMEOUT`). Android and iOS exports still need the
platform permissions and plist keys required by the native location plugin.

## Clipboard

`navigator.clipboard` implements the async text clipboard subset using Godot's `DisplayServer` clipboard methods. It is available when the current display server reports clipboard support; otherwise `readText()` and `writeText()` reject with `NotSupportedError`.

```ts
await navigator.clipboard.writeText('Copied from Vue Godot')
const text = await navigator.clipboard.readText()
console.log(text)
```

Only text clipboard access is supported. Image clipboard APIs and permission prompts are not synthesized.

For direct imports, use `clipboard` or `isClipboardSupported()`:

```ts
import { clipboard, isClipboardSupported } from '@vue-godot/browser'

if (isClipboardSupported()) {
  await clipboard.writeText('Copied')
}
```

## Vibration

`navigator.vibrate()` implements the browser Vibration API shape on top of `Input.vibrate_handheld()`. A number vibrates immediately; arrays alternate vibration and pause durations. Calling `navigator.vibrate(0)` cancels pending vibration patterns.

```ts
navigator.vibrate(50)
navigator.vibrate([40, 30, 40])
navigator.vibrate(0)
```

The return value reports whether the pattern was accepted by the polyfill, not whether the device physically vibrated. On Android, the app export must enable the `VIBRATE` permission for Godot's handheld vibration to have an effect.

## Device Motion And Orientation

Device sensor helpers read Godot's accelerometer, gravity, magnetometer, and gyroscope values through `Input`. Use snapshot reads when you need current values, or opt in to browser-style global events.

```ts
import {
  readDeviceMotion,
  readDeviceOrientation,
  startDeviceSensorEvents,
  stopDeviceSensorEvents,
} from '@vue-godot/browser'

const motion = readDeviceMotion()
const orientation = readDeviceOrientation()

addEventListener('devicemotion', (event) => {
  console.log(event.acceleration, event.rotationRate)
})

startDeviceSensorEvents({ intervalMs: 100 })
stopDeviceSensorEvents()
```

Godot returns zero vectors for unsupported platforms or missing sensors. The orientation values are best-effort: `alpha` comes from magnetometer heading when available, and `beta` / `gamma` are derived from gravity tilt. Gyroscope rotation rates are converted from radians per second to degrees per second for browser compatibility.

## Requirements

- **GodotJS** runtime (V8 or QuickJS) with access to the `godot` module
- `@vue-godot/device` for plugin-backed capability adapters such as geolocation
- Godot engine classes: `HTTPClient`, `DisplayServer`, `Engine`, `FileAccess`, `Input`, `OS`, `SceneTree`, `Time`, `TLSOptions`, `WebSocketPeer`, `PackedByteArray`, `PackedStringArray`

## License

MIT
