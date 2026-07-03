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
        export class Color {
          constructor(r = 0, g = 0, b = 0, a = 1) {
            this.__mock = true
            this.__kind = 'color'
            this.r = r
            this.g = g
            this.b = b
            this.a = a
          }

          static html(rgba) {
            return { __mock: true, __kind: 'color', rgba }
          }
        }

        export class StyleBoxFlat {
          constructor() {
            this.__mock = true
            this.__kind = 'style-box-flat'
            this.bg_color = null
            this.draw_center = false
          }
        }

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

        export class Image {
          _loaded = false
          _scale = 1

          load_svg_from_buffer(buffer, scale) {
            this._loaded = true
            this._scale = scale ?? 1
            this._bufferByteLength = buffer.byteLength
            return 0
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

        export class VideoStreamTheora {
          constructor() {
            this.__mock = true
            this.__kind = 'theora'
            this.file = ''
          }
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
        const blobStore = new Map()
        let blobIdCounter = 0

        export function atob(encoded) {
          return globalThis.atob(encoded)
        }

        export class GodotTextEncoder {
          encode(str) {
            return new globalThis.TextEncoder().encode(str)
          }
        }

        export class GodotBlob {
          constructor(parts = [], options = {}) {
            this.parts = parts
            this.type = options.type ?? ''
            this.size = parts.reduce((total, part) => {
              if (typeof part === 'string') return total + part.length
              if (part instanceof ArrayBuffer) return total + part.byteLength
              if (ArrayBuffer.isView(part)) return total + part.byteLength
              return total
            }, 0)
          }
          async arrayBuffer() {
            const encoder = new TextEncoder()
            return encoder.encode(this.parts.join('')).buffer
          }
        }

        export function resolveObjectURL(url) {
          return blobStore.get(url) ?? undefined
        }

        export function createObjectURL(blob) {
          const id = 'blob:mock-' + (++blobIdCounter)
          blobStore.set(id, blob)
          return id
        }

        export function revokeObjectURL(url) {
          blobStore.delete(url)
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

        globalThis.__audioTestFetchHandler = null
        globalThis.__videoTestFetchHandler = null

        function contentTypeForUrl(url) {
          const value = String(url)
          if (value.endsWith('.mp3')) return 'audio/mpeg'
          if (value.endsWith('.wav')) return 'audio/wav'
          if (value.endsWith('.ogg')) return 'audio/ogg'
          if (value.endsWith('.ogv')) return 'video/ogg'
          if (value.endsWith('.svg')) return 'image/svg+xml'
          return 'application/octet-stream'
        }

        export async function fetch(url) {
          if (globalThis.__audioTestFetchHandler) {
            return globalThis.__audioTestFetchHandler(url)
          }
          if (globalThis.__videoTestFetchHandler) {
            return globalThis.__videoTestFetchHandler(url)
          }

          const contentType = contentTypeForUrl(url)
          if (contentType === 'image/svg+xml') {
            const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"></svg>'
            const encoder = new TextEncoder()
            return new MockResponse(encoder.encode(svg).buffer, true, contentType)
          }

          return new MockResponse(new ArrayBuffer(16), true, contentType)
        }
      `,
    }
  }

  return nextLoad(url, context)
}
