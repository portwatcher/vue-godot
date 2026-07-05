import { defineComponent, h, ref, shallowRef, watch } from '@vue/runtime-core'
import type { VideoStream } from 'godot'
import { createOpacityModulate } from '../utils/godotColor.js'
import { classifySource, loadStream } from '../utils/streamLoader.js'
import {
  toNumericPixels,
  warnUnsupportedStyleProps,
  type HtmlStyle,
} from '../utils/styleMapping.js'

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
 * <Video> — video playback component.
 *
 * Maps to a Godot `VideoStreamPlayer` node. Resolves web-style `src`
 * paths to Godot resource paths and loads the video stream automatically.
 *
 * Supported source types:
 *   - Godot resource paths: `res://videos/intro.ogv`, `user://recordings/clip.ogv`
 *   - Relative / absolute paths: `./assets/intro.ogv`, `/videos/clip.ogv`
 *   - Data URIs: `data:video/ogg;base64,T2dnUw…`
 *   - Blob URLs: `blob:…`
 *   - Remote URLs: `https://example.com/video.ogv`
 *
 * Props:
 *   - `src`       — path to the video resource
 *   - `autoplay`  — start playback when the video loads (default: false)
 *   - `loop`      — restart when the video reaches its end (default: false)
 *   - `muted`     — mute audio (default: false)
 *   - `volume`    — linear audio volume 0–1 (default: 1)
 *   - `style`     — subset of CSS styles mapped to Godot properties
 *
 * Events:
 *   - `@ended`    → Godot `finished` signal
 *
 * Style support:
 *   - `width` / `height` → `custom_minimum_size`
 *   - `display: none`    → `visible = false`
 *
 * Usage:
 *   <Video src="./assets/intro.ogv" autoplay loop></Video>
 *   <Video src="res://videos/clip.ogv" :volume="0.5" @ended="onEnd"></Video>
 *   <Video src="./trailer.ogv" :style="{ width: 640, height: 360 }"></Video>
 */
export const Video = defineComponent({
  name: 'Video',
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
    style: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
  },
  emits: ['ended'],
  setup(props, { emit }) {
    const stream = shallowRef<VideoStream | null>(null)
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
          // Async path — show nothing (or stale stream) while loading.
          loading.value = true
          try {
            stream.value = await loadStream(src)
          } finally {
            loading.value = false
          }
        } else {
          // Local resources load synchronously; data-URIs and blobs
          // may involve an async step but are typically fast.
          stream.value = await loadStream(src)
        }
      },
      { immediate: true },
    )

    return () => {
      const style = props.style
      warnUnsupportedStyleProps(style, 'Video')
      const nodeProps: Record<string, unknown> = {}

      // Stream resource
      if (stream.value) {
        nodeProps['stream'] = stream.value
      }

      // Autoplay
      if (props.autoplay) {
        nodeProps['autoplay'] = true
      }

      // Loop
      if (props.loop) {
        nodeProps['loop'] = true
      }

      // Volume — map linear [0,1] to dB, or mute
      if (props.muted) {
        nodeProps['volume_db'] = -80
      } else {
        const linearVol = Math.max(0, Math.min(1, props.volume))
        nodeProps['volume_db'] = linearToDb(linearVol)
      }

      // Expand — scale video to control size (like <video> default behavior)
      nodeProps['expand'] = true

      // Width / height → custom_minimum_size
      const w = toNumericPixels(style?.width)
      const h_ = toNumericPixels(style?.height)
      if (w != null) {
        nodeProps['custom_minimum_size:x'] = w
      }
      if (h_ != null) {
        nodeProps['custom_minimum_size:y'] = h_
      }

      // display: none
      if (style?.display === 'none') {
        nodeProps['visible'] = false
      }

      // opacity
      if (
        typeof style?.opacity === 'number' &&
        Number.isFinite(style.opacity)
      ) {
        nodeProps['modulate'] = createOpacityModulate(style.opacity)
      }

      // Signal forwarding:
      // Godot `finished` signal → Vue `@ended`
      nodeProps['onFinished'] = () => {
        emit('ended')
      }

      return h('VideoStreamPlayer', nodeProps)
    }
  },
})
