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

        export class StyleBoxTexture {
          constructor() {
            this.__mock = true
            this.__kind = 'style-box-texture'
            this.texture = null
            this.draw_center = false
            this.axis_stretch_horizontal = -1
            this.axis_stretch_vertical = -1
          }
        }

        export class Font {
          constructor() {
            this.__mock = true
            this.__kind = 'font'
            this.path = ''
            this.fallbacks = []
          }

          get_font_name() {
            return this.path
          }
        }

        export class FontFile extends Font {
          constructor() {
            super()
            this.__kind = 'font-file'
          }
        }

        export class FontVariation extends Font {
          constructor() {
            super()
            this.__mock = true
            this.__kind = 'font-variation'
            this.variation_embolden = 0
            this.base_font = null
            this.fallbacks = []
          }
        }

        export class ButtonGroup {
          constructor() {
            this.__mock = true
            this.__kind = 'button-group'
            this.allow_unpress = false
          }
        }

        export class Callable {
          constructor(value) {
            const source = value instanceof Callable ? value._source : value
            this.__mock = true
            this.__kind = 'callable'
            this._source = source
            this._handler =
              typeof source === 'function'
                ? source
                : typeof source?.handler === 'function'
                  ? source.handler
                  : null
          }

          static create(...args) {
            const handler = args.length === 1 ? args[0] : args[1]
            return {
              __mock: true,
              __kind: 'callable-source',
              handler,
            }
          }

          call(...args) {
            return this._handler?.(...args)
          }
        }

        export class CameraFeed {
          constructor(input = {}) {
            this.__mock = true
            this.__kind = 'camera-feed'
            this.id = input.id ?? 0
            this.name = input.name ?? ''
            this.position = input.position ?? 0
            this.feed_is_active = input.active ?? false
          }

          get_id() {
            return this.id
          }

          get_name() {
            return this.name
          }

          get_position() {
            return this.position
          }
        }

        export class CameraTexture {
          constructor() {
            this.__mock = true
            this.__kind = 'camera-texture'
            this.camera_feed_id = -1
            this.which_feed = 0
            this.camera_is_active = false
          }

          get_image() {
            const state = mockCameraServerState()
            if (state.throwOnSnapshot) {
              throw new Error('camera snapshot unavailable')
            }
            return (
              state.snapshotImage ?? {
                __mock: true,
                __kind: 'camera-image',
                feedId: this.camera_feed_id,
                whichFeed: this.which_feed,
                active: this.camera_is_active,
              }
            )
          }
        }

        function mockCameraServerState() {
          const key = '__vueGodotHtmlMockCameraServer'
          if (!globalThis[key]) {
            globalThis[key] = {
              feeds: [
                { id: 1, name: 'Mock Camera', position: 0, active: false },
              ],
              snapshotImage: null,
              throwOnSnapshot: false,
            }
          }
          return globalThis[key]
        }

        function toCameraFeed(value, index) {
          if (value instanceof CameraFeed) {
            return value
          }

          return new CameraFeed({
            id: value?.id ?? index,
            name: value?.name ?? '',
            position: value?.position ?? 0,
            active: value?.active ?? false,
          })
        }

        export class CameraServer {
          static get_feed_count() {
            return mockCameraServerState().feeds.length
          }

          static get_feed(index) {
            const feed = mockCameraServerState().feeds[index]
            return feed == null ? null : toCameraFeed(feed, index)
          }

          static feeds() {
            return mockCameraServerState().feeds.map((feed, index) =>
              toCameraFeed(feed, index),
            )
          }
        }

        function mockDisplayServerState() {
          const key = '__vueGodotHtmlMockDisplayServer'
          if (!globalThis[key]) {
            globalThis[key] = {
              safeArea: {
                position: { x: 0, y: 0 },
                size: { x: 1000, y: 1000 },
              },
              windowSize: { x: 1000, y: 1000 },
              screenSize: { x: 1000, y: 1000 },
              virtualKeyboardHeight: 0,
            }
          }
          return globalThis[key]
        }

        export class DisplayServer {
          static get_display_safe_area() {
            return mockDisplayServerState().safeArea
          }

          static window_get_size() {
            return mockDisplayServerState().windowSize
          }

          static screen_get_size() {
            return mockDisplayServerState().screenSize
          }

          static virtual_keyboard_get_height() {
            return mockDisplayServerState().virtualKeyboardHeight
          }
        }

        export class ProjectSettings {
          static get_setting(name) {
            return globalThis.__vueGodotHtmlMockProjectSettings?.[name] ?? 1000
          }
        }

        export const ResourceLoader = {
          load(path) {
            if (!path) return null
            if (/\\.(ttf|otf|woff2?|pfb|pfm|fnt|font|tres|res)$/i.test(path)) {
              const font = new FontFile()
              font.path = path
              return font
            }
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
          _format = null
          _scale = 1

          _loadBuffer(buffer, format, scale = 1) {
            this._loaded = true
            this._format = format
            this._scale = scale
            this._bufferByteLength = buffer.byteLength
            return 0
          }

          load_png_from_buffer(buffer) {
            return this._loadBuffer(buffer, 'png')
          }

          load_jpg_from_buffer(buffer) {
            return this._loadBuffer(buffer, 'jpg')
          }

          load_webp_from_buffer(buffer) {
            return this._loadBuffer(buffer, 'webp')
          }

          load_bmp_from_buffer(buffer) {
            return this._loadBuffer(buffer, 'bmp')
          }

          load_tga_from_buffer(buffer) {
            return this._loadBuffer(buffer, 'tga')
          }

          load_ktx_from_buffer(buffer) {
            return this._loadBuffer(buffer, 'ktx')
          }

          load_svg_from_buffer(buffer, scale) {
            return this._loadBuffer(buffer, 'svg', scale ?? 1)
          }
        }

        export class ImageTexture {
          __mock = true
          __kind = 'buffer'

          static create_from_image(image) {
            const t = new ImageTexture()
            t._format = image._format
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
          if (value.endsWith('.png')) return 'image/png'
          if (value.endsWith('.jpg') || value.endsWith('.jpeg')) return 'image/jpeg'
          if (value.endsWith('.webp')) return 'image/webp'
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
          if (contentType.startsWith('image/')) {
            return new MockResponse(new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer, true, contentType)
          }

          return new MockResponse(new ArrayBuffer(16), true, contentType)
        }
      `,
    }
  }

  return nextLoad(url, context)
}
