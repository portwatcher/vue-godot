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
              displayServerName: 'mock-display',
              features: new Set([5, 18]),
              primaryClipboard: '',
              shellOpenCalls: [],
              shellOpenResult: 0,
              throwOnClipboard: false,
              throwOnWindowCallbacks: false,
              windowCallbackCalls: [],
              windowCallbacks: new Map(),
            }
          }
          return globalThis[key]
        }

        function mockOSState() {
          const key = '__vueGodotDeviceMockOS'
          if (!globalThis[key]) {
            globalThis[key] = {
              cmdlineArgs: [],
              cmdlineUserArgs: [],
              debugBuild: false,
              distributionName: 'Mock Linux',
              features: new Set(['linux', 'pc', 'debug']),
              locale: 'en_US',
              localeLanguage: 'en',
              modelName: 'MockDevice',
              name: 'Linux',
              sandboxed: false,
              shellOpenCalls: [],
              shellOpenResult: 0,
              userfsPersistent: true,
              version: '6.0.0',
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
          static get_name() {
            return mockOSState().name
          }

          static get_distribution_name() {
            return mockOSState().distributionName
          }

          static get_version() {
            return mockOSState().version
          }

          static get_model_name() {
            return mockOSState().modelName
          }

          static get_cmdline_args() {
            return new MockPackedStringArray(mockOSState().cmdlineArgs)
          }

          static get_cmdline_user_args() {
            return new MockPackedStringArray(mockOSState().cmdlineUserArgs)
          }

          static get_locale() {
            return mockOSState().locale
          }

          static get_locale_language() {
            return mockOSState().localeLanguage
          }

          static has_feature(tagName) {
            return mockOSState().features.has(String(tagName))
          }

          static is_debug_build() {
            return mockOSState().debugBuild
          }

          static is_sandboxed() {
            return mockOSState().sandboxed
          }

          static is_userfs_persistent() {
            return mockOSState().userfsPersistent
          }

          static shell_open(uri) {
            const state = mockOSState()
            state.shellOpenCalls.push(String(uri))
            return state.shellOpenResult
          }

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
          static get_name() {
            return mockDisplayServerState().displayServerName
          }

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

          static window_set_window_event_callback(callable, window_id = 0) {
            const state = mockDisplayServerState()
            if (state.throwOnWindowCallbacks) {
              throw new Error('window callbacks unavailable')
            }
            state.windowCallbackCalls.push({ callable, windowId: window_id })
            state.windowCallbacks.set(window_id, callable)
          }

          static WindowEvent = {
            WINDOW_EVENT_MOUSE_ENTER: 0,
            WINDOW_EVENT_MOUSE_EXIT: 1,
            WINDOW_EVENT_FOCUS_IN: 2,
            WINDOW_EVENT_FOCUS_OUT: 3,
            WINDOW_EVENT_CLOSE_REQUEST: 4,
            WINDOW_EVENT_GO_BACK_REQUEST: 5,
            WINDOW_EVENT_DPI_CHANGE: 6,
            WINDOW_EVENT_TITLEBAR_CHANGE: 7,
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
