import { defineComponent, h, ref, shallowRef, watch } from '@vue/runtime-core'
import type { Texture2D } from 'godot'
import type { HtmlStyle } from '../utils/styleMapping.js'
import { classifySource, loadTexture } from '../utils/textureLoader.js'

/**
 * TextureRect.ExpandMode enum values (Godot 4.x).
 *
 * @see https://docs.godotengine.org/en/4.4/classes/class_texturerect.html#enum-texturerect-expandmode
 */
const ExpandMode = {
  EXPAND_KEEP_SIZE: 0,
  EXPAND_IGNORE_SIZE: 1,
  EXPAND_FIT_WIDTH: 2,
  EXPAND_FIT_WIDTH_PROPORTIONAL: 3,
  EXPAND_FIT_HEIGHT: 4,
  EXPAND_FIT_HEIGHT_PROPORTIONAL: 5,
} as const

/**
 * TextureRect.StretchMode enum values (Godot 4.x).
 *
 * @see https://docs.godotengine.org/en/4.4/classes/class_texturerect.html#enum-texturerect-stretchmode
 */
const StretchMode = {
  STRETCH_SCALE: 0,
  STRETCH_TILE: 1,
  STRETCH_KEEP: 2,
  STRETCH_KEEP_CENTERED: 3,
  STRETCH_KEEP_ASPECT: 4,
  STRETCH_KEEP_ASPECT_CENTERED: 5,
  STRETCH_KEEP_ASPECT_COVERED: 6,
} as const

/**
 * Maps CSS `object-fit` values to Godot TextureRect expand_mode / stretch_mode.
 *
 *   CSS object-fit   → Godot
 *   ───────────────   ───────────────────────────────────────────
 *   fill             → EXPAND_IGNORE_SIZE + STRETCH_SCALE
 *   contain          → EXPAND_IGNORE_SIZE + STRETCH_KEEP_ASPECT_CENTERED
 *   cover            → EXPAND_IGNORE_SIZE + STRETCH_KEEP_ASPECT_COVERED
 *   none             → EXPAND_IGNORE_SIZE + STRETCH_KEEP_CENTERED
 *   scale-down       → EXPAND_IGNORE_SIZE + STRETCH_KEEP_ASPECT_CENTERED
 */
function resolveObjectFit(
  fit: HtmlStyle['objectFit'] | undefined,
): { expand_mode: number; stretch_mode: number } | null {
  switch (fit) {
    case 'fill':
      return {
        expand_mode: ExpandMode.EXPAND_IGNORE_SIZE,
        stretch_mode: StretchMode.STRETCH_SCALE,
      }
    case 'contain':
    case 'scale-down':
      return {
        expand_mode: ExpandMode.EXPAND_IGNORE_SIZE,
        stretch_mode: StretchMode.STRETCH_KEEP_ASPECT_CENTERED,
      }
    case 'cover':
      return {
        expand_mode: ExpandMode.EXPAND_IGNORE_SIZE,
        stretch_mode: StretchMode.STRETCH_KEEP_ASPECT_COVERED,
      }
    case 'none':
      return {
        expand_mode: ExpandMode.EXPAND_IGNORE_SIZE,
        stretch_mode: StretchMode.STRETCH_KEEP_CENTERED,
      }
    default:
      return null
  }
}

function toNumericPixels(value: number | string | undefined): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string') {
    const matched = value.trim().match(/^(-?\d+(?:\.\d+)?)(px)?$/)
    if (matched) {
      const parsed = Number(matched[1])
      return Number.isFinite(parsed) ? parsed : null
    }
  }
  return null
}

/**
 * <Img> — image display component.
 *
 * Maps to a Godot TextureRect node. Resolves web-style `src` paths
 * to Godot resource paths and loads the texture automatically.
 *
 * Supported source types:
 *   - Godot resource paths: `res://icon.svg`, `user://saves/pic.png`
 *   - Relative / absolute paths: `./assets/logo.png`, `/textures/bg.png`
 *   - Data URIs: `data:image/png;base64,iVBOR…`
 *   - Remote URLs: `https://example.com/image.png`
 *
 * Style support:
 *   - `width` / `height` → `custom_minimum_size`
 *   - `objectFit`        → `expand_mode` + `stretch_mode`
 *
 * Usage:
 *   <Img src="./assets/logo.png" />
 *   <Img src="res://icon.svg" :style="{ width: 64, height: 64, objectFit: 'contain' }" />
 *   <Img src="data:image/png;base64,iVBOR..." />
 *   <Img src="https://example.com/photo.jpg" />
 */
export const Img = defineComponent({
  name: 'Img',
  props: {
    src: {
      type: String,
      default: undefined,
    },
    style: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
    alt: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    const texture = shallowRef<Texture2D | null>(null)
    const loading = ref(false)

    // String `src` prop — handles local, data-URI, and remote sources.
    watch(
      () => props.src,
      async (src) => {
        if (!src) {
          texture.value = null
          return
        }

        const kind = classifySource(src)

        if (kind === 'remote') {
          // Async path — show nothing (or stale texture) while loading.
          loading.value = true
          try {
            texture.value = await loadTexture(src)
          } finally {
            loading.value = false
          }
        } else {
          // Synchronous path (local resources and data URIs).
          texture.value = await loadTexture(src)
        }
      },
      { immediate: true },
    )

    return () => {
      const style = props.style
      const nodeProps: Record<string, unknown> = {}

      if (texture.value) {
        nodeProps['texture'] = texture.value
      }

      // Width / height → custom_minimum_size
      const w = toNumericPixels(style?.width)
      const h_ = toNumericPixels(style?.height)
      if (w != null) {
        nodeProps['custom_minimum_size:x'] = w
      }
      if (h_ != null) {
        nodeProps['custom_minimum_size:y'] = h_
      }

      // object-fit → expand_mode + stretch_mode
      const fitMapping = resolveObjectFit(style?.objectFit)
      if (fitMapping) {
        nodeProps['expand_mode'] = fitMapping.expand_mode
        nodeProps['stretch_mode'] = fitMapping.stretch_mode
      } else if (w != null || h_ != null) {
        // When explicit size is set but no objectFit, default to
        // EXPAND_IGNORE_SIZE so the TextureRect respects the size
        // and STRETCH_KEEP_ASPECT_CENTERED to avoid distortion.
        nodeProps['expand_mode'] = ExpandMode.EXPAND_IGNORE_SIZE
        nodeProps['stretch_mode'] = StretchMode.STRETCH_KEEP_ASPECT_CENTERED
      }

      // Flip — not supported; use CSS transform: scaleX(-1)/scaleY(-1)
      // in a future style update if needed.

      // Alt → tooltip_text (accessibility hint)
      if (props.alt) {
        nodeProps['tooltip_text'] = props.alt
      }

      // display: none
      if (style?.display === 'none') {
        nodeProps['visible'] = false
      }

      return h('TextureRect', nodeProps)
    }
  },
})
