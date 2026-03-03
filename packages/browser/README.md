# @vue-godot/browser

Browser API polyfills for **GodotJS**.

GodotJS provides only engine bindings (the `godot` module) and a minimal JS runtime (V8 or QuickJS). Standard browser/DOM APIs like `fetch`, `URL`, `Blob`, `atob`, `TextEncoder`, `history`, etc. are **not** available. This package re-implements them on top of Godot's native classes so that higher-level libraries (and your own code) can use familiar Web APIs without modification.

## Installation

```bash
npm install @vue-godot/browser
```

## Quick start

Call `installBrowserAPIs()` once at startup to patch `globalThis` with every polyfill:

```ts
import { installBrowserAPIs } from '@vue-godot/browser'

installBrowserAPIs()

// Now you can use fetch(), URL, Blob, atob, TextEncoder, history, etc. globally
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
import { fetch, GodotURL, GodotHeaders } from '@vue-godot/browser'
```

## Provided APIs

| API                         | Implementation         | Notes                                                                                                        |
| --------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| `fetch()`                   | Godot `HTTPClient`     | Supports GET/POST/PUT/DELETE, redirects (up to 20), TLS, `AbortSignal`, string/ArrayBuffer/Uint8Array bodies |
| `Headers`                   | `GodotHeaders`         | Map-backed with `toGodotArray()` / `fromGodotArray()` interop                                                |
| `Response`                  | `GodotResponse`        | ArrayBuffer-backed; `.json()`, `.text()`, `.arrayBuffer()`, `.blob()`, `.clone()`                            |
| `Blob`                      | `GodotBlob`            | ArrayBuffer-backed; `.slice()`, `.text()`, `.arrayBuffer()`, `.size`, `.type`                                |
| `URL`                       | `GodotURL`             | WHATWG subset — `protocol`, `hostname`, `port`, `pathname`, `search`, `hash`, `href`, `toString()`           |
| `atob` / `btoa`             | Pure JS                | RFC 4648 base64 encode/decode                                                                                |
| `TextEncoder`               | `GodotTextEncoder`     | UTF-8 `.encode()` with V8 native fast-path when available                                                    |
| `TextDecoder`               | `GodotTextDecoder`     | UTF-8 `.decode()` with V8 native fast-path when available                                                    |
| `AbortController`           | `GodotAbortController` | Signal-based; `.abort()`, `.signal`                                                                          |
| `AbortSignal`               | `GodotAbortSignal`     | `.aborted`, `.reason`, `addEventListener('abort', …)`                                                        |
| `history`                   | `GodotHistory`         | In-memory session history; `pushState()`, `replaceState()`, `go()`, `back()`, `forward()`, `.state`          |
| `location`                  | `GodotLocation`        | Reflects the current URL; `.href`, `.pathname`, `.search`, `.hash`, `assign()`, `replace()`                  |
| `PopStateEvent`             | `PopStateEvent`        | Fired on traversal (`go` / `back` / `forward`); carries `.state`                                             |
| `addEventListener` (global) | `GodotEventTarget`     | Enables `addEventListener('popstate', …)` on `globalThis`                                                    |
| `EventTarget`               | `GodotEventTarget`     | Standalone or subclassable; `addEventListener`, `removeEventListener`, `dispatchEvent`                       |

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

## How `fetch()` works

Under the hood, `fetch()` drives Godot's `HTTPClient` through its state machine using a non-blocking poll loop:

1. **Connect** — `HTTPClient.connect_to_host()` with optional TLS
2. **Poll** — Advances the connection by calling `HTTPClient.poll()` in a loop, yielding via `SceneTree.create_timer().timeout.as_promise()` between iterations (no busy-waiting)
3. **Request** — Sends the HTTP request with headers and body
4. **Read** — Streams the response body in chunks, concatenating `PackedByteArray` buffers
5. **Return** — Wraps the result in a `GodotResponse`

Redirects (301, 302, 307, 308) are followed automatically up to 20 hops.

## Requirements

- **GodotJS** runtime (V8 or QuickJS) with access to the `godot` module
- Godot engine classes: `HTTPClient`, `Engine`, `TLSOptions`, `PackedByteArray`, `PackedStringArray`

## License

MIT
