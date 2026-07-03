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

        export const Engine = {
          get_main_loop() {
            return null
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
