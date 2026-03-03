import { defineComponent, h, ref, watch } from '@vue/runtime-core'
import type { Texture2D } from 'godot'
import { Image, ImageTexture, ResourceLoader } from 'godot'
import { resolveAssetPath } from '../utils/assetResolver.js'
import type { HtmlStyle } from '../utils/styleMapping.js'
import { classifySource } from '../utils/textureLoader.js'

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

// ---------------------------------------------------------------------------
// SVG-specific loading
// ---------------------------------------------------------------------------

/**
 * Load an SVG from a buffer into an `ImageTexture`, applying an optional
 * rasterisation scale factor.
 *
 * Godot's `Image.load_svg_from_buffer` rasterises the SVG at a default
 * internal size.  Passing `scale > 1` produces a higher-resolution
 * raster (useful when the SVG will be displayed at a larger size).
 */
function createSvgTextureFromBuffer(
  buffer: ArrayBuffer,
  scale: number,
): ImageTexture | null {
  const image = new Image()
  const err = image.load_svg_from_buffer(buffer, scale)
  if (err !== 0) return null
  return ImageTexture.create_from_image(image)
}

/**
 * Parse a `data:` URI and return the raw bytes and MIME type.
 */
function parseSvgDataUri(uri: string): ArrayBuffer | null {
  const match = uri.match(/^data:([^;,]+)?(?:;base64)?,(.*)$/)
  if (!match) return null

  const raw = match[2]

  if (uri.includes(';base64,')) {
    const binaryStr = atob(raw)
    const bytes = new Uint8Array(binaryStr.length)
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i)
    }
    return bytes.buffer as ArrayBuffer
  }

  const decoded = decodeURIComponent(raw)
  const encoder = new TextEncoder()
  return encoder.encode(decoded).buffer as ArrayBuffer
}

/**
 * <Svg> — SVG display component.
 *
 * Maps to a Godot `TextureRect` node.  Resolves web-style `src` paths
 * to Godot resource paths and loads the SVG texture automatically.
 *
 * Unlike `<Img>`, this component is tailored to SVG assets:
 *   - A `scale` prop controls the rasterisation resolution when the SVG
 *     is loaded from a data URI or inline buffer. Higher values produce
 *     sharper textures at larger display sizes.
 *   - Local `.svg` files are loaded via `ResourceLoader` (Godot imports
 *     them as textures at editor-time, so `scale` has no effect there).
 *
 * Supported source types:
 *   - Godot resource paths: `res://icons/logo.svg`
 *   - Relative / absolute paths: `./assets/logo.svg`, `/icons/logo.svg`
 *   - Data URIs: `data:image/svg+xml;base64,PHN2Zy…`
 *   - Remote URLs: `https://example.com/icon.svg`
 *
 * Style support:
 *   - `width` / `height` → `custom_minimum_size`
 *   - `objectFit`        → `expand_mode` + `stretch_mode`
 *   - `display: none`    → `visible = false`
 *
 * Usage:
 *   <Svg src="./assets/logo.svg" />
 *   <Svg src="res://icons/star.svg" :style="{ width: 48, height: 48 }" />
 *   <Svg src="data:image/svg+xml;base64,PHN2Zy…" :scale="2" />
 */
export const Svg = defineComponent({
  name: 'Svg',
  props: {
    src: {
      type: String,
      default: undefined,
    },
    style: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
    /**
     * Rasterisation scale factor applied when decoding an SVG from a
     * data URI, blob URL, or remote URL.  Has no effect on local
     * resources (Godot handles import-time scaling for those).
     *
     * Default: `1` (native SVG size).
     */
    scale: {
      type: Number,
      default: 1,
    },
    alt: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    const texture = ref<Texture2D | null>(null)
    const loading = ref(false)

    watch(
      () => ({ src: props.src, scale: props.scale }),
      async ({ src, scale }) => {
        if (!src) {
          texture.value = null
          return
        }

        const effectiveScale =
          typeof scale === 'number' && Number.isFinite(scale) && scale > 0
            ? scale
            : 1

        const kind = classifySource(src)

        if (kind === 'local') {
          // Godot handles SVG import — ResourceLoader returns the texture.
          const path = resolveAssetPath(src)
          texture.value = ResourceLoader.load(path) as Texture2D | null
          return
        }

        if (kind === 'data-uri') {
          const buffer = parseSvgDataUri(src)
          if (!buffer) {
            texture.value = null
            return
          }
          texture.value = createSvgTextureFromBuffer(buffer, effectiveScale)
          return
        }

        if (kind === 'remote') {
          loading.value = true
          try {
            const { fetch: godotFetch } = await import('@vue-godot/browser')
            const res = await godotFetch(src)
            if (!res.ok) {
              texture.value = null
              return
            }
            const buffer = await res.arrayBuffer()
            texture.value = createSvgTextureFromBuffer(buffer, effectiveScale)
          } finally {
            loading.value = false
          }
          return
        }

        if (kind === 'blob') {
          const { resolveObjectURL } = await import('@vue-godot/browser')
          const blob = resolveObjectURL(src)
          if (!blob) {
            texture.value = null
            return
          }
          const buffer = await blob.arrayBuffer()
          texture.value = createSvgTextureFromBuffer(buffer, effectiveScale)
          return
        }

        texture.value = null
      },
      { immediate: true },
    )

    return () => {
      const style = props.style
      const nodeProps: Record<string, unknown> = {
        texture: texture.value,
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
        // and STRETCH_KEEP_ASPECT_CENTERED to preserve aspect ratio.
        nodeProps['expand_mode'] = ExpandMode.EXPAND_IGNORE_SIZE
        nodeProps['stretch_mode'] = StretchMode.STRETCH_KEEP_ASPECT_CENTERED
      }

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
