import {
  AudioEffectCapture,
  AudioServer,
  AudioStreamMicrophone,
  AudioStreamPlayer,
} from 'godot'
import type {
  AudioEffectCapture as GodotAudioEffectCapture,
  AudioStreamMicrophone as GodotAudioStreamMicrophone,
  AudioStreamPlayer as GodotAudioStreamPlayer,
  PackedVector2Array,
} from 'godot'
import { packedStringArrayToStrings } from './utils/packedStringArray.js'

export interface MicrophonePlayerOptions {
  busName?: string
  autoplay?: boolean
  volumeDb?: number
}

export interface AudioCaptureOptions {
  bufferLengthSeconds?: number
  busName?: string
  effectIndex?: number
}

export interface AudioCaptureRead {
  frames: PackedVector2Array | null
  requestedFrames: number
  readFrames: number
  framesAvailable: number
  discardedFrames: number
  pushedFrames: number
  bufferLengthFrames: number
}

function finiteInteger(value: number | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.trunc(value)
    : null
}

function finiteNonNegativeInteger(value: number | undefined): number | null {
  const integer = finiteInteger(value)
  return integer == null ? null : Math.max(0, integer)
}

function finiteNumber(value: number | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

export function listAudioInputDevices(): string[] {
  try {
    return packedStringArrayToStrings(AudioServer.get_input_device_list())
  } catch {
    return []
  }
}

export function createMicrophoneStream(): GodotAudioStreamMicrophone {
  return new AudioStreamMicrophone()
}

export function createMicrophonePlayer(
  options: MicrophonePlayerOptions = {},
): GodotAudioStreamPlayer {
  const player = new AudioStreamPlayer()
  player.stream = createMicrophoneStream()

  if (options.busName) {
    player.bus = options.busName
  }

  const volumeDb = finiteNumber(options.volumeDb)
  if (volumeDb != null) {
    player.volume_db = volumeDb
  }

  if (options.autoplay === true) {
    player.autoplay = true
  }

  return player
}

export function createAudioCaptureEffect(
  options: AudioCaptureOptions = {},
): GodotAudioEffectCapture {
  const capture = new AudioEffectCapture()
  const bufferLengthSeconds = finiteNumber(options.bufferLengthSeconds)
  if (bufferLengthSeconds != null && bufferLengthSeconds > 0) {
    capture.buffer_length = bufferLengthSeconds
  }

  return capture
}

export function attachAudioCaptureEffect(
  capture: GodotAudioEffectCapture,
  options: Pick<AudioCaptureOptions, 'busName' | 'effectIndex'> = {},
): number | null {
  const busName = options.busName ?? 'Master'
  const busIndex = AudioServer.get_bus_index(busName)
  if (!Number.isFinite(busIndex) || busIndex < 0) {
    return null
  }

  const effectIndex = Math.max(-1, finiteInteger(options.effectIndex) ?? -1)
  AudioServer.add_bus_effect(busIndex, capture, effectIndex)
  return busIndex
}

export function readAudioCaptureFrames(
  capture: GodotAudioEffectCapture,
  requestedFrames?: number,
): AudioCaptureRead {
  const framesAvailable = Math.max(
    0,
    Math.trunc(Number(capture.get_frames_available())),
  )
  const requested = finiteNonNegativeInteger(requestedFrames) ?? framesAvailable
  const canRead = requested > 0 && capture.can_get_buffer(requested)
  const frames = canRead ? capture.get_buffer(requested) : null

  return {
    frames,
    requestedFrames: requested,
    readFrames: frames ? requested : 0,
    framesAvailable,
    discardedFrames: Math.max(
      0,
      Math.trunc(Number(capture.get_discarded_frames())),
    ),
    pushedFrames: Math.max(0, Math.trunc(Number(capture.get_pushed_frames()))),
    bufferLengthFrames: Math.max(
      0,
      Math.trunc(Number(capture.get_buffer_length_frames())),
    ),
  }
}
