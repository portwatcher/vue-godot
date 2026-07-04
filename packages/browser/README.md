# @vue-godot/browser

Browser API polyfills for **GodotJS**.

GodotJS provides only engine bindings (the `godot` module) and a minimal JS runtime (V8 or QuickJS). Standard browser/DOM APIs like `fetch`, `URL`, `Blob`, `File`, `FormData`, `atob`, `TextEncoder`, `history`, timers, `requestAnimationFrame`, etc. are **not** available. This package re-implements them on top of Godot's native classes so that higher-level libraries (and your own code) can use familiar Web APIs without modification.

## Installation

```bash
npm install @vue-godot/browser
```

## Quick start

Call `installBrowserAPIs()` once at startup to patch `globalThis` with every polyfill:

```ts
import { installBrowserAPIs } from '@vue-godot/browser'

installBrowserAPIs()

// Now you can use fetch(), Request, URL, Blob, FormData, timers, history, etc. globally
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

| API                                              | Implementation         | Notes                                                                                                                              |
| ------------------------------------------------ | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `fetch()`                                        | Godot `HTTPClient`     | Supports GET/POST/PUT/DELETE, `Request` input, redirects (up to 20), TLS, `AbortSignal`, string/ArrayBuffer/Uint8Array/Blob/File/FormData bodies |
| `Request`                                        | `GodotRequest`         | Fetch-compatible request metadata/body wrapper; `.text()`, `.json()`, `.arrayBuffer()`, `.blob()`, `.clone()`                      |
| `Headers`                                        | `GodotHeaders`         | Map-backed with `toGodotArray()` / `fromGodotArray()` interop                                                                      |
| `Response`                                       | `GodotResponse`        | ArrayBuffer-backed; `.json()`, `.text()`, `.arrayBuffer()`, `.blob()`, `.clone()`                                                  |
| `Blob`                                           | `GodotBlob`            | ArrayBuffer-backed; `.slice()`, `.text()`, `.arrayBuffer()`, `.size`, `.type`                                                      |
| `File`                                           | `GodotFile`            | Blob-backed file metadata; `.name`, `.lastModified`, `.webkitRelativePath`                                                         |
| `FormData`                                       | `GodotFormData`        | Ordered duplicate keys, string/file values, multipart serialization for `fetch()` bodies                                           |
| `FileReader`                                     | `GodotFileReader`      | Async `readAsText()`, `readAsArrayBuffer()`, `readAsDataURL()`, `readAsBinaryString()` for Blob/File values                        |
| `URL`                                            | `GodotURL`             | WHATWG subset — `protocol`, `hostname`, `port`, `pathname`, `search`, `searchParams`, `hash`, `href`, `toString()`                 |
| `URLSearchParams`                                | `GodotURLSearchParams` | Query string helper with duplicate-key support, iteration, `.append()`, `.set()`, `.getAll()`, `.sort()`                           |
| `atob` / `btoa`                                  | Pure JS                | RFC 4648 base64 encode/decode                                                                                                      |
| `TextEncoder`                                    | `GodotTextEncoder`     | UTF-8 `.encode()` with V8 native fast-path when available                                                                          |
| `TextDecoder`                                    | `GodotTextDecoder`     | UTF-8 `.decode()` with V8 native fast-path when available                                                                          |
| `AbortController`                                | `GodotAbortController` | Signal-based; `.abort()`, `.signal`                                                                                                |
| `AbortSignal`                                    | `GodotAbortSignal`     | `.aborted`, `.reason`, `addEventListener('abort', …)`                                                                              |
| `setTimeout` / `clearTimeout`                    | Godot timing           | Uses `SceneTree.create_timer()` where available; falls back to host timers in tests                                                |
| `setInterval` / `clearInterval`                  | Godot timing           | Repeating timer built on the same scheduler as `setTimeout`                                                                        |
| `queueMicrotask`                                 | Promise microtask      | Schedules callbacks through the JS microtask queue                                                                                 |
| `requestAnimationFrame` / `cancelAnimationFrame` | Godot frame timing     | Uses `SceneTree.process_frame` where available; falls back to a 16 ms timer before the scene tree exists                           |
| `performance`                                    | `GodotPerformance`     | `Time.get_ticks_usec()`-backed `.now()` plus basic marks, measures, and entry lookup                                               |
| `history`                                        | `GodotHistory`         | In-memory session history; `pushState()`, `replaceState()`, `go()`, `back()`, `forward()`, `.state`                                |
| `location`                                       | `GodotLocation`        | Reflects the current URL; `.href`, `.pathname`, `.search`, `.hash`, `assign()`, `replace()`                                        |
| `PopStateEvent`                                  | `PopStateEvent`        | Fired on traversal (`go` / `back` / `forward`); carries `.state`                                                                   |
| `addEventListener` (global)                      | `GodotEventTarget`     | Enables `addEventListener('popstate', …)` on `globalThis`                                                                          |
| `EventTarget`                                    | `GodotEventTarget`     | Standalone or subclassable; `addEventListener`, `removeEventListener`, `dispatchEvent`                                             |

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

## Requirements

- **GodotJS** runtime (V8 or QuickJS) with access to the `godot` module
- Godot engine classes: `HTTPClient`, `Engine`, `SceneTree`, `Time`, `TLSOptions`, `PackedByteArray`, `PackedStringArray`

## License

MIT
