import { defineComponent, h, ref, shallowRef, watch } from '@vue/runtime-core'
import type { AudioStream } from 'godot'
import { classifySource, loadAudioStream } from '../utils/audioStreamLoader.js'

/**
 * Converts a linear volume (0–1) to decibels for Godot's `volume_db`.
 *
 * Godot uses `volume_db` internally. `0 dB = full volume`, `-80 dB ≈ silence`.
 * The formula `20 * log10(linear)` maps [0,1] to [-∞, 0] dB.
 * We clamp to -80 dB as a practical silence floor.
 */
function linearToDb(linear: number): number {
  if (linear <= 0) return -80
  return Math.max(-80, 20 * Math.log10(linear))
}

/**
 * Audio stream subclasses that have a boolean `loop` property.
 * Used as a type-safe cast target with a runtime `'loop' in` guard.
 */
interface LoopableStream {
  loop: boolean
}

/**
 * Audio stream subclasses that use a numeric `loop_mode` property
 * (e.g. `AudioStreamWAV`).  0 = disabled, 1 = forward loop.
 */
interface LoopModeStream {
  loop_mode: number
}

/**
 * Set the loop state on an audio stream resource.
 *
 * `AudioStreamPlayer` has no `loop` property itself — loop is controlled
 * on the stream resource.  `AudioStreamOggVorbis` and `AudioStreamMP3`
 * expose a boolean `loop`, while `AudioStreamWAV` uses `loop_mode` (int).
 *
 * SAFETY: we check at runtime which property the stream exposes before
 * casting via `as unknown as`.
 */
function setStreamLoop(stream: AudioStream, loop: boolean): void {
  const enabled = !!loop
  if ('loop' in stream) {
    ;(stream as unknown as LoopableStream).loop = enabled
  } else if ('loop_mode' in stream) {
    // AudioStreamWAV: 0 = disabled, 1 = forward loop
    ;(stream as unknown as LoopModeStream).loop_mode = enabled ? 1 : 0
  }
}

/**
 * <Audio> — audio playback component.
 *
 * Maps to a Godot `AudioStreamPlayer` node. Resolves web-style `src`
 * paths to Godot resource paths and loads the audio stream automatically.
 *
 * Supported source types:
 *   - Godot resource paths: `res://audio/music.ogg`, `user://recordings/clip.mp3`
 *   - Relative / absolute paths: `./assets/music.ogg`, `/audio/sfx.wav`
 *   - Data URIs: `data:audio/mpeg;base64,SUQz…`
 *   - Blob URLs: `blob:…`
 *   - Remote URLs: `https://example.com/music.mp3`
 *
 * Props:
 *   - `src`       — path to the audio resource
 *   - `autoplay`  — start playback when the audio loads (default: false)
 *   - `loop`      — restart when the audio reaches its end (default: false)
 *   - `muted`     — mute audio (default: false)
 *   - `volume`    — linear audio volume 0–1 (default: 1)
 *
 * Events:
 *   - `@ended`    → Godot `finished` signal
 *
 * Note: `AudioStreamPlayer` is a non-visual node (inherits from `Node`,
 * not `Control`). It has no visual properties like width, height, opacity,
 * or visibility. Style props are intentionally not supported.
 *
 * Usage:
 *   <Audio src="./assets/music.ogg" autoplay loop />
 *   <Audio src="res://sfx/click.wav" :volume="0.5" @ended="onEnd" />
 */
export const Audio = defineComponent({
  name: 'Audio',
  props: {
    src: {
      type: String,
      default: undefined,
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    loop: {
      type: Boolean,
      default: false,
    },
    muted: {
      type: Boolean,
      default: false,
    },
    volume: {
      type: Number,
      default: 1,
    },
  },
  emits: ['ended'],
  setup(props, { emit }) {
    const stream = shallowRef<AudioStream | null>(null)
    const loading = ref(false)

    watch(
      () => props.src,
      async (src) => {
        if (!src) {
          stream.value = null
          return
        }

        const kind = classifySource(src)

        if (kind === 'remote') {
          loading.value = true
          try {
            stream.value = await loadAudioStream(src)
          } finally {
            loading.value = false
          }
        } else {
          stream.value = await loadAudioStream(src)
        }
      },
      { immediate: true },
    )

    return () => {
      const nodeProps: Record<string, unknown> = {}

      // Stream resource (with loop applied on the resource itself)
      if (stream.value) {
        setStreamLoop(stream.value, props.loop)
        nodeProps['stream'] = stream.value
      }

      // Autoplay
      if (props.autoplay) {
        nodeProps['autoplay'] = true
      }

      // Volume — map linear [0,1] to dB, or mute
      if (props.muted) {
        nodeProps['volume_db'] = -80
      } else {
        const linearVol = Math.max(0, Math.min(1, props.volume))
        nodeProps['volume_db'] = linearToDb(linearVol)
      }

      // Signal forwarding:
      // Godot `finished` signal → Vue `@ended`
      nodeProps['onFinished'] = () => {
        emit('ended')
      }

      return h('AudioStreamPlayer', nodeProps)
    }
  },
})
