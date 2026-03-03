/**
 * Custom ESM loader hook that intercepts `import ... from 'godot'` and
 * `import ... from '@vue-godot/browser'`, providing mocks for both.
 *
 * Used by video.test.mjs to run Video component tests in Node.js
 * without the real Godot runtime.
 */

const GODOT_MOCK_URL = 'mock:godot'
const BROWSER_MOCK_URL = 'mock:vue-godot-browser'

export function resolve(specifier, context, nextResolve) {
  if (specifier === 'godot') {
    return { url: GODOT_MOCK_URL, shortCircuit: true }
  }
  if (specifier === '@vue-godot/browser') {
    return { url: BROWSER_MOCK_URL, shortCircuit: true }
  }
  return nextResolve(specifier, context)
}

export function load(url, context, nextLoad) {
  if (url === GODOT_MOCK_URL) {
    return {
      format: 'module',
      shortCircuit: true,
      source: `
        export const ResourceLoader = {
          load(path) {
            return path ? { __mock: true, __kind: 'local', path } : null
          },
        }

        export const DirAccess = {
          make_dir_recursive_absolute() {},
        }

        export class FileAccess {
          _path = ''
          _buffer = null

          static open(path, mode) {
            const fa = new FileAccess()
            fa._path = path
            return fa
          }

          store_buffer(buf) {
            this._buffer = buf
          }

          get_path() {
            return this._path
          }

          close() {}
        }

        export class VideoStreamTheora {
          constructor() {
            this.__mock = true
            this.__kind = 'theora'
            this.file = ''
          }
        }
      `,
    }
  }

  if (url === BROWSER_MOCK_URL) {
    return {
      format: 'module',
      shortCircuit: true,
      source: `
        const _blobStore = new Map()
        let _blobIdCounter = 0

        export function atob(encoded) {
          return globalThis.atob(encoded)
        }

        export class GodotTextEncoder {
          encode(str) {
            return new globalThis.TextEncoder().encode(str)
          }
        }

        export function resolveObjectURL(url) {
          return _blobStore.get(url) ?? undefined
        }

        export function createObjectURL(blob) {
          const id = 'blob:mock-' + (++_blobIdCounter)
          _blobStore.set(id, blob)
          return id
        }

        class MockResponse {
          constructor(buffer, ok, contentType) {
            this._buffer = buffer
            this.ok = ok
            this.headers = new Map([['content-type', contentType || 'application/octet-stream']])
          }
          async arrayBuffer() {
            return this._buffer
          }
        }

        // Global hook: tests can set _mockFetchHandler to control fetch behavior
        globalThis.__videoTestFetchHandler = null

        export async function fetch(url) {
          if (globalThis.__videoTestFetchHandler) {
            return globalThis.__videoTestFetchHandler(url)
          }
          // Default: return a small buffer with ok=true
          return new MockResponse(new ArrayBuffer(16), true, 'video/ogg')
        }
      `,
    }
  }

  return nextLoad(url, context)
}
