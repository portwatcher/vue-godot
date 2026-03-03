# @vue-godot/browser

Browser API polyfills for **GodotJS**.

GodotJS provides only engine bindings (the `godot` module) and a minimal JS runtime (V8 or QuickJS). Standard browser/DOM APIs like `fetch`, `URL`, `Blob`, `atob`, `TextEncoder`, etc. are **not** available. This package re-implements them on top of Godot's native classes so that higher-level libraries (and your own code) can use familiar Web APIs without modification.

## Installation

```bash
npm install @vue-godot/browser
```

## Quick start

Call `installBrowserAPIs()` once at startup to patch `globalThis` with every polyfill:

```ts
import { installBrowserAPIs } from '@vue-godot/browser'

installBrowserAPIs()

// Now you can use fetch(), URL, Blob, atob, TextEncoder, etc. globally
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

| API               | Implementation         | Notes                                                                                                        |
| ----------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| `fetch()`         | Godot `HTTPClient`     | Supports GET/POST/PUT/DELETE, redirects (up to 20), TLS, `AbortSignal`, string/ArrayBuffer/Uint8Array bodies |
| `Headers`         | `GodotHeaders`         | Map-backed with `toGodotArray()` / `fromGodotArray()` interop                                                |
| `Response`        | `GodotResponse`        | ArrayBuffer-backed; `.json()`, `.text()`, `.arrayBuffer()`, `.blob()`, `.clone()`                            |
| `Blob`            | `GodotBlob`            | ArrayBuffer-backed; `.slice()`, `.text()`, `.arrayBuffer()`, `.size`, `.type`                                |
| `URL`             | `GodotURL`             | WHATWG subset — `protocol`, `hostname`, `port`, `pathname`, `search`, `hash`, `href`, `toString()`           |
| `atob` / `btoa`   | Pure JS                | RFC 4648 base64 encode/decode                                                                                |
| `TextEncoder`     | `GodotTextEncoder`     | UTF-8 `.encode()` with V8 native fast-path when available                                                    |
| `TextDecoder`     | `GodotTextDecoder`     | UTF-8 `.decode()` with V8 native fast-path when available                                                    |
| `AbortController` | `GodotAbortController` | Signal-based; `.abort()`, `.signal`                                                                          |
| `AbortSignal`     | `GodotAbortSignal`     | `.aborted`, `.reason`, `addEventListener('abort', …)`                                                        |

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
