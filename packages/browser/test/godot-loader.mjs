const GODOT_MOCK_URL = 'mock:godot'

export function resolve(specifier, context, nextResolve) {
  if (specifier === 'godot') {
    return { url: GODOT_MOCK_URL, shortCircuit: true }
  }
  return nextResolve(specifier, context)
}

export function load(url, context, nextLoad) {
  if (url === GODOT_MOCK_URL) {
    return {
      format: 'module',
      shortCircuit: true,
      source: `
        const MethodName = {
          0: 'GET',
          1: 'HEAD',
          2: 'POST',
          3: 'PUT',
          4: 'DELETE',
          5: 'OPTIONS',
          6: 'TRACE',
          7: 'CONNECT',
          8: 'PATCH',
        }

        function mockState() {
          const key = '__vueGodotBrowserMockHttp'
          if (!globalThis[key]) {
            globalThis[key] = { requests: [], responses: [] }
          }
          return globalThis[key]
        }

        function mockFileState() {
          const key = '__vueGodotBrowserMockFiles'
          if (!globalThis[key]) {
            globalThis[key] = new Map()
          }
          return globalThis[key]
        }

        function mockDisplayServerState() {
          const key = '__vueGodotBrowserMockDisplayServer'
          if (!globalThis[key]) {
            globalThis[key] = {
              clipboard: '',
              features: new Set([5]),
            }
          }
          return globalThis[key]
        }

        function mockInputState() {
          const key = '__vueGodotBrowserMockInput'
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

        function mockWebSocketState() {
          const key = '__vueGodotBrowserMockWebSocket'
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
            const state = mockState()
            const bodyBytes = bodyToBytes(body)
            state.requests.push({
              hostname: this.hostname,
              port: this.port,
              tls: Boolean(this.tlsOptions),
              method,
              methodName: MethodName[method] ?? String(method),
              path,
              headers: Array.from(headers ?? []),
              body: new TextDecoder().decode(bodyBytes),
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

        export class SceneTree {}

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
            this.buffer += String(value)
            mockFileState().set(this.path, this.buffer)
          }

          close() {}
        }

        FileAccess.ModeFlags = FileAccess.ModeFlags

        export class DisplayServer {
          static has_feature(feature) {
            return mockDisplayServerState().features.has(feature)
          }

          static clipboard_set(clipboard) {
            mockDisplayServerState().clipboard = String(clipboard)
          }

          static clipboard_get() {
            return String(mockDisplayServerState().clipboard ?? '')
          }

          static clipboard_has() {
            return String(mockDisplayServerState().clipboard ?? '').length > 0
          }
        }

        DisplayServer.Feature = {
          FEATURE_CLIPBOARD: 5,
        }

        export class Input {
          static vibrate_handheld(duration_ms = 500, amplitude = -1) {
            const state = mockInputState()
            if (state.throwOnVibrate) {
              throw new Error('vibration unavailable')
            }
            state.vibrations.push({
              durationMs: duration_ms,
              amplitude,
            })
          }

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
            const state = mockWebSocketState()
            if (state.sendError !== 0) {
              return state.sendError
            }
            this.sent.push({
              type: 'text',
              message: String(message),
            })
            return 0
          }

          send(message, writeMode = 1) {
            const state = mockWebSocketState()
            if (state.sendError !== 0) {
              return state.sendError
            }
            const bytes = bodyToBytes(message)
            this.sent.push({
              type: 'binary',
              writeMode,
              bytes: Array.from(bytes),
            })
            return 0
          }

          queueText(message) {
            this.incoming.push({
              text: true,
              body: String(message),
            })
          }

          queueBinary(bytes) {
            this.incoming.push({
              text: false,
              body: bytes,
            })
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
            return { __mock: true, __kind: 'tls-options' }
          },
        }
      `,
    }
  }

  return nextLoad(url, context)
}
