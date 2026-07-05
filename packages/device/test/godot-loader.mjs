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
