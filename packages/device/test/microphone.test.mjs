import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-loader.mjs', import.meta.url).href)

const {
  attachAudioCaptureEffect,
  createAudioCaptureEffect,
  createMicrophonePlayer,
  createMicrophoneStream,
  listAudioInputDevices,
  readAudioCaptureFrames,
} = await import('../dist/microphone.js')

function setAudioServerState(state) {
  globalThis.__vueGodotDeviceMockAudioServer = {
    inputDevices: ['Default'],
    buses: ['Master'],
    busEffects: [],
    ...state,
  }
}

test('listAudioInputDevices normalizes Godot input device names', () => {
  setAudioServerState({
    inputDevices: ['Default', 'USB Microphone'],
  })

  assert.deepEqual(listAudioInputDevices(), ['Default', 'USB Microphone'])
})

test('createMicrophoneStream constructs a Godot microphone stream', () => {
  const stream = createMicrophoneStream()

  assert.equal(stream.__kind, 'audio-stream-microphone')
})

test('createMicrophonePlayer wires stream, bus, autoplay, and volume', () => {
  const player = createMicrophonePlayer({
    busName: 'Voice',
    autoplay: true,
    volumeDb: -6,
  })

  assert.equal(player.__kind, 'audio-stream-player')
  assert.equal(player.stream.__kind, 'audio-stream-microphone')
  assert.equal(player.bus, 'Voice')
  assert.equal(player.autoplay, true)
  assert.equal(player.volume_db, -6)
})

test('createAudioCaptureEffect sets buffer length when valid', () => {
  const capture = createAudioCaptureEffect({ bufferLengthSeconds: 0.5 })

  assert.equal(capture.__kind, 'audio-effect-capture')
  assert.equal(capture.buffer_length, 0.5)
})

test('attachAudioCaptureEffect adds capture to an existing audio bus', () => {
  setAudioServerState({
    buses: ['Master', 'Voice'],
    busEffects: [],
  })
  const capture = createAudioCaptureEffect()

  const busIndex = attachAudioCaptureEffect(capture, {
    busName: 'Voice',
    effectIndex: 0,
  })

  assert.equal(busIndex, 1)
  assert.equal(globalThis.__vueGodotDeviceMockAudioServer.busEffects.length, 1)
  assert.equal(
    globalThis.__vueGodotDeviceMockAudioServer.busEffects[0].effect,
    capture,
  )
  assert.equal(
    globalThis.__vueGodotDeviceMockAudioServer.busEffects[0].effectIndex,
    0,
  )
})

test('attachAudioCaptureEffect appends by default', () => {
  setAudioServerState({
    buses: ['Master'],
    busEffects: [],
  })

  assert.equal(attachAudioCaptureEffect(createAudioCaptureEffect()), 0)
  assert.equal(
    globalThis.__vueGodotDeviceMockAudioServer.busEffects[0].effectIndex,
    -1,
  )
})

test('attachAudioCaptureEffect returns null for missing audio bus', () => {
  setAudioServerState({
    buses: ['Master'],
    busEffects: [],
  })

  assert.equal(
    attachAudioCaptureEffect(createAudioCaptureEffect(), { busName: 'Missing' }),
    null,
  )
})

test('readAudioCaptureFrames reads available capture buffers and stats', () => {
  const capture = createAudioCaptureEffect()
  capture.framesAvailable = 2
  capture.discardedFrames = 1
  capture.pushedFrames = 4
  capture.bufferLengthFrames = 512
  capture.buffer = [
    { x: 0.25, y: -0.25 },
    { x: 0.5, y: -0.5 },
  ]

  const read = readAudioCaptureFrames(capture, 2)

  assert.equal(read.frames.__kind, 'packed-vector2-array')
  assert.equal(read.frames.size(), 2)
  assert.equal(read.requestedFrames, 2)
  assert.equal(read.readFrames, 2)
  assert.equal(read.framesAvailable, 2)
  assert.equal(read.discardedFrames, 1)
  assert.equal(read.pushedFrames, 4)
  assert.equal(read.bufferLengthFrames, 512)
})

test('readAudioCaptureFrames reports zero read frames when insufficient data', () => {
  const capture = createAudioCaptureEffect()
  capture.framesAvailable = 1

  const read = readAudioCaptureFrames(capture, 2)

  assert.equal(read.frames, null)
  assert.equal(read.requestedFrames, 2)
  assert.equal(read.readFrames, 0)
  assert.equal(read.framesAvailable, 1)
})
