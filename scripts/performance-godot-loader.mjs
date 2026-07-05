const GODOT_MOCK_URL = 'mock:vue-godot-performance-godot'

export function resolve(specifier, context, nextResolve) {
  if (specifier === 'godot') {
    return { url: GODOT_MOCK_URL, shortCircuit: true }
  }
  return nextResolve(specifier, context)
}

export function load(url, context, nextLoad) {
  if (url !== GODOT_MOCK_URL) {
    return nextLoad(url, context)
  }

  return {
    format: 'module',
    shortCircuit: true,
    source: `
      let nextCallableId = 1

      function nameObject(value) {
        return {
          toString() {
            return String(value)
          },
        }
      }

      function mockHttpState() {
        const key = '__vueGodotPerformanceMockHttp'
        if (!globalThis[key]) {
          globalThis[key] = { requests: [], responses: [] }
        }
        return globalThis[key]
      }

      function mockFileState() {
        const key = '__vueGodotPerformanceMockFiles'
        if (!globalThis[key]) {
          globalThis[key] = new Map()
        }
        return globalThis[key]
      }

      function mockDisplayServerState() {
        const key = '__vueGodotPerformanceMockDisplayServer'
        if (!globalThis[key]) {
          globalThis[key] = {
            clipboard: '',
            features: new Set([5]),
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

      function mockInputState() {
        const key = '__vueGodotPerformanceMockInput'
        if (!globalThis[key]) {
          globalThis[key] = {
            accelerometer: { x: 0, y: 0, z: 0 },
            gravity: { x: 0, y: 0, z: 0 },
            gyroscope: { x: 0, y: 0, z: 0 },
            magnetometer: { x: 0, y: 0, z: 0 },
            vibrations: [],
            throwOnVibrate: false,
          }
        }
        return globalThis[key]
      }

      function mockOSState() {
        const key = '__vueGodotPerformanceMockOS'
        if (!globalThis[key]) {
          globalThis[key] = {
            grantedPermissions: [],
            userFsPersistent: true,
          }
        }
        return globalThis[key]
      }

      function mockWebSocketState() {
        const key = '__vueGodotPerformanceMockWebSocket'
        if (!globalThis[key]) {
          globalThis[key] = {
            peers: [],
            connectError: 0,
            sendError: 0,
            openOnPoll: true,
          }
        }
        return globalThis[key]
      }

      function bodyToBytes(body) {
        if (body == null) {
          return new Uint8Array()
        }
        if (typeof body === 'string') {
          return new TextEncoder().encode(body)
        }
        if (Array.isArray(body)) {
          return new Uint8Array(body)
        }
        if (body instanceof Uint8Array) {
          return body
        }
        if (body instanceof ArrayBuffer) {
          return new Uint8Array(body)
        }
        if (ArrayBuffer.isView(body)) {
          return new Uint8Array(body.buffer, body.byteOffset, body.byteLength)
        }
        return new Uint8Array()
      }

      function headersToLines(headers) {
        if (!headers) {
          return []
        }
        if (Array.isArray(headers)) {
          return headers
        }
        return Object.entries(headers).map(([key, value]) => key + ': ' + value)
      }

      class MockStringArray {
        constructor(items) {
          this.items = items
        }

        size() {
          return this.items.length
        }

        get_indexed(index) {
          return this.items[index]
        }
      }

      class MockByteArray {
        constructor(bytes) {
          this.bytes = bytes
        }

        size() {
          return this.bytes.byteLength
        }

        to_array_buffer() {
          return this.bytes.buffer.slice(
            this.bytes.byteOffset,
            this.bytes.byteOffset + this.bytes.byteLength,
          )
        }
      }

      export class Callable {
        constructor(value) {
          if (value instanceof Callable) {
            this.id = value.id
            this.target = value.target
            this.handler = value.handler
            return
          }

          this.id = value?.id ?? nextCallableId++
          this.target = value?.target
          this.handler = value?.handler
        }

        static create(target, handler) {
          return new Callable({ id: nextCallableId++, target, handler })
        }
      }

      export class Node {
        constructor(name = 'Node') {
          this.name = String(name)
          this.parent = null
          this.children = []
          this.meta = new Map()
          this.connections = new Map()
          this.queuedFree = false
          this.visible = true
        }

        has_method(name) {
          return typeof this[name] === 'function'
        }

        set(key, value) {
          this[key] = value
        }

        get(key) {
          return this[key]
        }

        add_child(child) {
          if (child.parent && child.parent !== this) {
            child.parent.remove_child(child)
          }
          if (child.parent === this) {
            return
          }
          child.parent = this
          this.children.push(child)
        }

        remove_child(child) {
          const index = this.children.indexOf(child)
          if (index >= 0) {
            this.children.splice(index, 1)
            child.parent = null
          }
        }

        move_child(child, toIndex) {
          const fromIndex = this.children.indexOf(child)
          if (fromIndex < 0) {
            throw new Error('child is not in parent')
          }
          this.children.splice(fromIndex, 1)
          this.children.splice(toIndex, 0, child)
        }

        get_parent() {
          return this.parent
        }

        get_index() {
          return this.parent ? this.parent.children.indexOf(this) : -1
        }

        get_child_count() {
          return this.children.length
        }

        get_child(index) {
          return this.children[index] ?? null
        }

        queue_free() {
          this.queuedFree = true
          for (const child of this.children) {
            child.queue_free()
          }
        }

        set_meta(key, value) {
          this.meta.set(String(key), value)
        }

        get_meta(key) {
          return this.meta.get(String(key))
        }

        is_inside_tree() {
          return this.parent !== null
        }

        get_name() {
          return nameObject(this.name)
        }

        get_path() {
          const names = []
          let current = this
          while (current) {
            names.unshift(current.name)
            current = current.parent
          }
          return nameObject('/' + names.join('/'))
        }

        connect(signalName, callable) {
          const signal = String(signalName)
          const byId = this.connections.get(signal) ?? new Map()
          byId.set(callable.id, callable)
          this.connections.set(signal, byId)
        }

        disconnect(signalName, callable) {
          const signal = String(signalName)
          const byId = this.connections.get(signal)
          byId?.delete(callable.id)
        }
      }

      export class Label extends Node {
        constructor(name = 'Label') {
          super(name)
          this.text = ''
        }
      }

      export const ClassDB = {
        can_instantiate() {
          return true
        },
        instantiate(tag) {
          return tag === 'Label' ? new Label(tag) : new Node(tag)
        },
      }

      export class Color {
        constructor(r = 0, g = 0, b = 0, a = 1) {
          this.r = r
          this.g = g
          this.b = b
          this.a = a
        }

        static html(rgba) {
          return { rgba }
        }
      }

      export class StyleBoxFlat {}
      export class StyleBoxTexture {}
      export class Font {}
      export class FontFile extends Font {}
      export class FontVariation extends Font {}
      export class ButtonGroup {}
      export class CameraFeed {}
      export class CameraTexture {}
      export class SceneTree {}

      export class HTTPClient {
        blocking_mode_enabled = false
        status = 0
        response = null
        bodyRead = false

        connect_to_host(hostname, port, tlsOptions) {
          this.hostname = hostname
          this.port = port
          this.tlsOptions = tlsOptions
          this.status = 5
          return 0
        }

        poll() {}

        get_status() {
          return this.status
        }

        request(method, path, headers) {
          return this.recordRequest(method, path, headers, undefined)
        }

        request_raw(method, path, headers, body) {
          return this.recordRequest(method, path, headers, body)
        }

        recordRequest(method, path, headers, body) {
          const state = mockHttpState()
          const bodyBytes = bodyToBytes(body)
          state.requests.push({
            hostname: this.hostname,
            port: this.port,
            tls: Boolean(this.tlsOptions),
            method,
            path,
            headers: Array.from(headers ?? []),
            bodyBytes: Array.from(bodyBytes),
          })

          this.response = state.responses.shift() ?? {
            status: 200,
            headers: {},
            body: '',
          }
          this.bodyRead = false
          this.status = 7
          return 0
        }

        has_response() {
          return this.response !== null
        }

        get_response_code() {
          return this.response?.status ?? 200
        }

        get_response_headers() {
          return new MockStringArray(headersToLines(this.response?.headers))
        }

        read_response_body_chunk() {
          if (this.bodyRead) {
            return new MockByteArray(new Uint8Array())
          }
          this.bodyRead = true
          this.status = 0
          return new MockByteArray(bodyToBytes(this.response?.body))
        }

        close() {
          this.status = 0
        }
      }

      export class WebSocketPeer {
        supported_protocols = []
        handshake_headers = []
        inbound_buffer_size = 0
        outbound_buffer_size = 0
        state = 0
        selectedProtocol = ''
        incoming = []
        sent = []
        closeCode = -1
        closeReason = ''
        lastWasText = false

        connect_to_url(url, tlsOptions) {
          const state = mockWebSocketState()
          this.url = url
          this.tlsOptions = tlsOptions
          this.selectedProtocol = this.supported_protocols[0] ?? ''
          this.state = state.connectError === 0 ? 0 : 3
          state.peers.push(this)
          return state.connectError
        }

        poll() {
          if (this.state === 0 && mockWebSocketState().openOnPoll) {
            this.state = 1
          }
        }

        get_ready_state() {
          return this.state
        }

        send_text(message) {
          if (mockWebSocketState().sendError !== 0) {
            return mockWebSocketState().sendError
          }
          this.sent.push({ type: 'text', message: String(message) })
          return 0
        }

        send(message, writeMode = 1) {
          if (mockWebSocketState().sendError !== 0) {
            return mockWebSocketState().sendError
          }
          const bytes = bodyToBytes(message)
          this.sent.push({
            type: 'binary',
            writeMode,
            bytes: Array.from(bytes),
          })
          return 0
        }

        get_available_packet_count() {
          return this.incoming.length
        }

        get_packet() {
          const packet = this.incoming.shift() ?? {
            text: false,
            body: [],
          }
          this.lastWasText = packet.text
          return new MockByteArray(bodyToBytes(packet.body))
        }

        was_string_packet() {
          return this.lastWasText
        }

        close(code = 1000, reason = '') {
          this.closeCode = code
          this.closeReason = String(reason)
          this.state = 3
        }

        get_close_code() {
          return this.closeCode
        }

        get_close_reason() {
          return this.closeReason
        }

        get_selected_protocol() {
          return this.selectedProtocol
        }

        get_current_outbound_buffered_amount() {
          return 0
        }
      }

      export const ResourceLoader = {
        load(path) {
          if (!path) {
            return null
          }
          if (path.endsWith('.wav')) {
            return { __kind: 'wav', path, loop_mode: 0 }
          }
          return { __kind: 'local', path, loop: false }
        },
      }

      export const DirAccess = {
        make_dir_recursive_absolute() {},
      }

      export class FileAccess {
        static ModeFlags = {
          READ: 1,
          WRITE: 2,
          READ_WRITE: 3,
          WRITE_READ: 7,
        }

        static open(path, flags) {
          return new FileAccess(path, flags)
        }

        static file_exists(path) {
          return mockFileState().has(path)
        }

        static get_file_as_bytes(path) {
          return new MockByteArray(bodyToBytes(mockFileState().get(path) ?? ''))
        }

        constructor(path, flags) {
          this.path = path
          this.flags = flags
          this.buffer = flags === FileAccess.ModeFlags.READ
            ? mockFileState().get(path) ?? ''
            : ''
        }

        get_as_text() {
          return this.buffer
        }

        store_string(value) {
          this.buffer = String(value)
          mockFileState().set(this.path, this.buffer)
        }

        store_buffer(value) {
          this.buffer = value
          mockFileState().set(this.path, value)
        }

        get_path() {
          return this.path
        }

        close() {}
      }

      export class Image {
        load_png_from_buffer(buffer) {
          this._bufferByteLength = buffer.byteLength
          return 0
        }

        load_jpg_from_buffer(buffer) {
          this._bufferByteLength = buffer.byteLength
          return 0
        }

        load_webp_from_buffer(buffer) {
          this._bufferByteLength = buffer.byteLength
          return 0
        }

        load_bmp_from_buffer(buffer) {
          this._bufferByteLength = buffer.byteLength
          return 0
        }

        load_tga_from_buffer(buffer) {
          this._bufferByteLength = buffer.byteLength
          return 0
        }

        load_svg_from_buffer(buffer, scale = 1) {
          this._bufferByteLength = buffer.byteLength
          this._scale = scale
          return 0
        }

        load_ktx_from_buffer(buffer) {
          this._bufferByteLength = buffer.byteLength
          return 0
        }
      }

      export class ImageTexture {
        static create_from_image(image) {
          return {
            __kind: 'image-texture',
            byteLength: image._bufferByteLength ?? 0,
            scale: image._scale ?? 1,
          }
        }
      }

      export class VideoStreamTheora {
        constructor() {
          this.__kind = 'theora'
          this.file = ''
        }
      }

      export class AudioStreamOggVorbis {
        static load_from_buffer(buffer) {
          const stream = new AudioStreamOggVorbis()
          stream.byteLength = buffer.byteLength
          return stream
        }

        constructor() {
          this.__kind = 'ogg'
          this.loop = false
        }
      }

      export class AudioStreamMP3 {
        constructor() {
          this.__kind = 'mp3'
          this.loop = false
          this.data = null
        }
      }

      export class AudioStreamWAV {
        constructor() {
          this.__kind = 'wav'
          this.loop_mode = 0
          this.data = null
        }
      }

      export class DisplayServer {
        static clipboard_get() {
          return mockDisplayServerState().clipboard
        }

        static clipboard_set(value) {
          mockDisplayServerState().clipboard = String(value)
        }

        static has_feature(feature) {
          return mockDisplayServerState().features.has(feature)
        }

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

      export class Input {
        static get_accelerometer() {
          return mockInputState().accelerometer
        }

        static get_gravity() {
          return mockInputState().gravity
        }

        static get_gyroscope() {
          return mockInputState().gyroscope
        }

        static get_magnetometer() {
          return mockInputState().magnetometer
        }

        static vibrate_handheld(durationMs = 500) {
          if (mockInputState().throwOnVibrate) {
            throw new Error('vibrate unavailable')
          }
          mockInputState().vibrations.push(durationMs)
        }
      }

      export class OS {
        static get_granted_permissions() {
          return new MockStringArray([...mockOSState().grantedPermissions])
        }

        static request_permission(name) {
          return mockOSState().grantedPermissions.includes(String(name))
        }

        static is_userfs_persistent() {
          return Boolean(mockOSState().userFsPersistent)
        }
      }

      export const Engine = {
        get_main_loop() {
          return null
        },
      }

      export const Time = {
        get_ticks_usec() {
          return Math.round(performance.now() * 1000)
        },
      }

      export const TLSOptions = {
        client() {
          return { __kind: 'tls-options' }
        },
      }
    `,
  }
}
