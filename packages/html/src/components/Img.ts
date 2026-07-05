import { defineComponent, h, ref, shallowRef, watch } from '@vue/runtime-core'
import type { Texture2D } from 'godot'
import {
  accessibilityPropOptions,
  applyAccessibilityProps,
} from '../utils/accessibility.js'
import {
  applyControlSizeProps,
  applyTransformStyleProps,
  applyMotionStyleProps,
} from '../utils/controlStyle.js'
import {
  normalizeHtmlStyle,
  warnUnsupportedStyleProps,
  type HtmlStyle,
} from '../utils/styleMapping.js'
import { htmlStyleProp } from '../utils/styleProps.js'
import { applyTextureRectObjectFitProps } from '../utils/textureRectFit.js'
import { classifySource, loadTexture } from '../utils/textureLoader.js'

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
 *   <Img src="./assets/logo.png"></Img>
 *   <Img src="res://icon.svg" :style="{ width: 64, height: 64, objectFit: 'contain' }"></Img>
 *   <Img src="data:image/png;base64,iVBOR..."></Img>
 *   <Img src="https://example.com/photo.jpg"></Img>
 */
export const Img = defineComponent({
  name: 'Img',
  props: {
    src: {
      type: String,
      default: undefined,
    },
    style: htmlStyleProp,
    alt: {
      type: String,
      default: undefined,
    },
    ...accessibilityPropOptions,
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
      const style = normalizeHtmlStyle(props.style)
      warnUnsupportedStyleProps(style, 'Img')
      const nodeProps: Record<string, unknown> = {}

      if (texture.value) {
        nodeProps['texture'] = texture.value
      }

      const resolvedSize = applyControlSizeProps(nodeProps, style)
      const hasExplicitSize =
        resolvedSize.widthPixels != null ||
        resolvedSize.heightPixels != null ||
        resolvedSize.widthRatio != null ||
        resolvedSize.heightRatio != null

      applyTextureRectObjectFitProps(nodeProps, style, hasExplicitSize)

      // Flip — not supported; use CSS transform: scaleX(-1)/scaleY(-1)
      // in a future style update if needed.

      // Alt → tooltip_text (accessibility hint)
      if (props.alt) {
        nodeProps['tooltip_text'] = props.alt
      }
      applyAccessibilityProps(nodeProps, props, {
        label: props.alt,
      })

      // display: none
      if (style?.display === 'none') {
        nodeProps['visible'] = false
      }
      applyTransformStyleProps(nodeProps, style)
      applyMotionStyleProps(nodeProps, style)

      return h('TextureRect', nodeProps)
    }
  },
})
