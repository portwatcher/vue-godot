/**
 * Custom ESM loader hook that intercepts `import ... from 'godot'` and
 * `import ... from '@vue-godot/browser'`, providing mocks for both.
 *
 * Used by svg.test.mjs to run Svg component tests in Node.js
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

        export class Image {
          _loaded = false
          _scale = 1

          load_svg_from_buffer(buffer, scale) {
            this._loaded = true
            this._scale = scale ?? 1
            this._bufferByteLength = buffer.byteLength
            return 0 // OK
          }
        }

        export class ImageTexture {
          __mock = true
          __kind = 'buffer'

          static create_from_image(image) {
            const t = new ImageTexture()
            t._scale = image._scale
            t._bufferByteLength = image._bufferByteLength
            return t
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

        export async function fetch(url) {
          // Default: return a small SVG buffer with ok=true
          const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"></svg>'
          const encoder = new TextEncoder()
          return new MockResponse(encoder.encode(svg).buffer, true, 'image/svg+xml')
        }
      `,
    }
  }

  return nextLoad(url, context)
}
