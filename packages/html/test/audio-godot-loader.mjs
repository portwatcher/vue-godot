/**
 * Custom ESM loader hook that intercepts `import ... from 'godot'` and
 * `import ... from '@vue-godot/browser'`, providing mocks for both.
 *
 * Used by audio.test.mjs to run Audio component tests in Node.js
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
            if (!path) return null
            if (path.endsWith('.wav')) {
              return { __mock: true, __kind: 'wav', path, loop_mode: 0 }
            }
            return { __mock: true, __kind: 'local', path, loop: false }
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

        export class AudioStreamOggVorbis {
          static load_from_buffer(buffer) {
            const s = new AudioStreamOggVorbis()
            s.__bufferByteLength = buffer.byteLength
            return s
          }
          static load_from_file(path) {
            const s = new AudioStreamOggVorbis()
            s.file = path
            return s
          }
          constructor() {
            this.__mock = true
            this.__kind = 'ogg'
            this.loop = false
          }
        }

        export class AudioStreamMP3 {
          constructor() {
            this.__mock = true
            this.__kind = 'mp3'
            this.loop = false
            this.data = null
          }
        }

        export class AudioStreamWAV {
          constructor() {
            this.__mock = true
            this.__kind = 'wav'
            this.loop_mode = 0
            this.data = null
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

        // Global hook: tests can set __audioTestFetchHandler to control fetch behavior
        globalThis.__audioTestFetchHandler = null

        export async function fetch(url) {
          if (globalThis.__audioTestFetchHandler) {
            return globalThis.__audioTestFetchHandler(url)
          }
          // Default: return a small buffer with ok=true, detecting format from URL
          let mime = 'audio/ogg'
          if (url.endsWith('.mp3')) mime = 'audio/mpeg'
          else if (url.endsWith('.wav')) mime = 'audio/wav'
          return new MockResponse(new ArrayBuffer(16), true, mime)
        }
      `,
    }
  }

  return nextLoad(url, context)
}
