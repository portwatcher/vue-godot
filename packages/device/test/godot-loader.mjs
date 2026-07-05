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
        let nextCallableId = 1

        class MockPackedStringArray {
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

        class MockPackedVector2Array {
          constructor(frames = []) {
            this.__mock = true
            this.__kind = 'packed-vector2-array'
            this.frames = frames
          }

          size() {
            return this.frames.length
          }
        }

        class MockImage {
          constructor(label = 'clipboard-image') {
            this.__mock = true
            this.__kind = 'image'
            this.label = label
          }
        }

        class MockSignal2 {
          constructor() {
            this.callables = []
            this.connectCalls = []
            this.disconnectCalls = []
          }

          connect(callable) {
            this.callables.push(callable)
            this.connectCalls.push(callable)
          }

          disconnect(callable) {
            const index = this.callables.indexOf(callable)
            if (index >= 0) {
              this.callables.splice(index, 1)
            }
            this.disconnectCalls.push(callable)
          }

          emit(name, granted) {
            for (const callable of this.callables) {
              callable.handler(name, granted)
            }
          }
        }

        function mockAudioServerState() {
          const key = '__vueGodotDeviceMockAudioServer'
          if (!globalThis[key]) {
            globalThis[key] = {
              inputDevices: ['Default'],
              buses: ['Master'],
              busEffects: [],
            }
          }
          return globalThis[key]
        }

        function mockDisplayServerState() {
          const key = '__vueGodotDeviceMockDisplayServer'
          if (!globalThis[key]) {
            globalThis[key] = {
              clipboard: '',
              clipboardImage: null,
              features: new Set([5, 18]),
              primaryClipboard: '',
              throwOnClipboard: false,
            }
          }
          return globalThis[key]
        }

        function mockPermissionState() {
          const key = '__vueGodotDeviceMockPermissions'
          if (!globalThis[key]) {
            globalThis[key] = {
              granted: [],
              requested: [],
              requestAllCalls: 0,
              revoked: false,
              requestResults: new Map(),
            }
          }
          return globalThis[key]
        }

        function mockInputState() {
          const key = '__vueGodotDeviceMockInput'
          if (!globalThis[key]) {
            globalThis[key] = {
              accelerometer: { x: 0, y: 0, z: 0 },
              gravity: { x: 0, y: 0, z: 0 },
              gyroscope: { x: 0, y: 0, z: 0 },
              handheldVibrations: [],
              joypadVibrations: new Map(),
              magnetometer: { x: 0, y: 0, z: 0 },
              throwOnHandheldVibration: false,
              throwOnJoypadVibration: false,
              throwOnSensors: new Set(),
            }
          }
          return globalThis[key]
        }

        function readMockSensor(method, key) {
          const state = mockInputState()
          if (state.throwOnSensors.has(method)) {
            throw new Error('sensor unavailable')
          }
          return state[key]
        }

        function mockMainLoop() {
          const key = '__vueGodotDeviceMockMainLoop'
          if (!globalThis[key]) {
            globalThis[key] = {
              on_request_permissions_result: new MockSignal2(),
            }
          }
          return globalThis[key]
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

          static create(targetOrHandler, maybeHandler) {
            const target =
              typeof maybeHandler === 'function' ? targetOrHandler : undefined
            const handler =
              typeof maybeHandler === 'function'
                ? maybeHandler
                : targetOrHandler
            return new Callable({ id: nextCallableId++, target, handler })
          }
        }

        export class Engine {
          static get_main_loop() {
            return mockMainLoop()
          }
        }

        export class OS {
          static get_granted_permissions() {
            return new MockPackedStringArray(mockPermissionState().granted)
          }

          static request_permission(name) {
            const state = mockPermissionState()
            const permission = String(name)
            state.requested.push(permission)
            if (state.granted.includes(permission)) {
              return true
            }
            return state.requestResults.get(permission) ?? false
          }

          static request_permissions() {
            const state = mockPermissionState()
            state.requestAllCalls += 1
            return state.requestAllResult ?? false
          }

          static revoke_granted_permissions() {
            const state = mockPermissionState()
            state.revoked = true
            state.granted = []
          }
        }

        export class DisplayServer {
          static has_feature(feature) {
            return mockDisplayServerState().features.has(feature)
          }

          static clipboard_set(clipboard) {
            const state = mockDisplayServerState()
            if (state.throwOnClipboard) {
              throw new Error('clipboard unavailable')
            }
            state.clipboard = String(clipboard)
          }

          static clipboard_get() {
            const state = mockDisplayServerState()
            if (state.throwOnClipboard) {
              throw new Error('clipboard unavailable')
            }
            return String(state.clipboard ?? '')
          }

          static clipboard_has() {
            return String(mockDisplayServerState().clipboard ?? '').length > 0
          }

          static clipboard_get_image() {
            const state = mockDisplayServerState()
            if (state.throwOnClipboard) {
              throw new Error('clipboard unavailable')
            }
            return state.clipboardImage ?? new MockImage()
          }

          static clipboard_has_image() {
            return mockDisplayServerState().clipboardImage !== null
          }

          static clipboard_set_primary(clipboardPrimary) {
            const state = mockDisplayServerState()
            if (state.throwOnClipboard) {
              throw new Error('clipboard unavailable')
            }
            state.primaryClipboard = String(clipboardPrimary)
          }

          static clipboard_get_primary() {
            const state = mockDisplayServerState()
            if (state.throwOnClipboard) {
              throw new Error('clipboard unavailable')
            }
            return String(state.primaryClipboard ?? '')
          }

          static Feature = {
            FEATURE_CLIPBOARD: 5,
            FEATURE_CLIPBOARD_PRIMARY: 18,
          }

          static FEATURE_CLIPBOARD = 5
          static FEATURE_CLIPBOARD_PRIMARY = 18
        }

        export class Input {
          static vibrate_handheld(duration_ms = 500, amplitude = -1) {
            const state = mockInputState()
            if (state.throwOnHandheldVibration) {
              throw new Error('handheld vibration unavailable')
            }
            state.handheldVibrations.push({
              durationMs: duration_ms,
              amplitude,
            })
          }

          static get_joy_vibration_strength(device) {
            const vibration = mockInputState().joypadVibrations.get(device)
            return {
              x: vibration?.weakMagnitude ?? 0,
              y: vibration?.strongMagnitude ?? 0,
            }
          }

          static get_joy_vibration_duration(device) {
            return (
              mockInputState().joypadVibrations.get(device)?.durationSeconds ??
              0
            )
          }

          static start_joy_vibration(
            device,
            weakMagnitude,
            strongMagnitude,
            durationSeconds = 0,
          ) {
            const state = mockInputState()
            if (state.throwOnJoypadVibration) {
              throw new Error('joypad vibration unavailable')
            }
            state.joypadVibrations.set(device, {
              weakMagnitude,
              strongMagnitude,
              durationSeconds,
            })
          }

          static stop_joy_vibration(device) {
            const state = mockInputState()
            if (state.throwOnJoypadVibration) {
              throw new Error('joypad vibration unavailable')
            }
            state.joypadVibrations.delete(device)
          }

          static get_accelerometer() {
            return readMockSensor('get_accelerometer', 'accelerometer')
          }

          static get_gravity() {
            return readMockSensor('get_gravity', 'gravity')
          }

          static get_gyroscope() {
            return readMockSensor('get_gyroscope', 'gyroscope')
          }

          static get_magnetometer() {
            return readMockSensor('get_magnetometer', 'magnetometer')
          }
        }

        export class AudioStreamMicrophone {
          constructor() {
            this.__mock = true
            this.__kind = 'audio-stream-microphone'
          }
        }

        export class AudioStreamPlayer {
          constructor() {
            this.__mock = true
            this.__kind = 'audio-stream-player'
            this.stream = null
            this.bus = 'Master'
            this.autoplay = false
            this.volume_db = 0
          }
        }

        export class AudioEffectCapture {
          constructor() {
            this.__mock = true
            this.__kind = 'audio-effect-capture'
            this.buffer_length = 0.1
            this.framesAvailable = 0
            this.discardedFrames = 0
            this.pushedFrames = 0
            this.bufferLengthFrames = 0
            this.buffer = []
          }

          can_get_buffer(frames) {
            return frames <= this.framesAvailable
          }

          get_buffer(frames) {
            return new MockPackedVector2Array(this.buffer.slice(0, frames))
          }

          clear_buffer() {
            this.buffer = []
            this.framesAvailable = 0
          }

          get_frames_available() {
            return this.framesAvailable
          }

          get_discarded_frames() {
            return this.discardedFrames
          }

          get_pushed_frames() {
            return this.pushedFrames
          }

          get_buffer_length_frames() {
            return this.bufferLengthFrames
          }
        }

        export class AudioServer {
          static get_input_device_list() {
            return new MockPackedStringArray(mockAudioServerState().inputDevices)
          }

          static get_bus_index(busName) {
            return mockAudioServerState().buses.indexOf(busName)
          }

          static add_bus_effect(busIndex, effect, effectIndex = -1) {
            mockAudioServerState().busEffects.push({
              busIndex,
              effect,
              effectIndex,
            })
          }
        }
      `,
    }
  }

  return nextLoad(url, context)
}
