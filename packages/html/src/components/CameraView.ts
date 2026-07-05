import { defineComponent, h, shallowRef, watch } from '@vue/runtime-core'
import type { Texture2D } from 'godot'
import {
  accessibilityPropOptions,
  applyAccessibilityProps,
} from '../utils/accessibility.js'
import {
  applyControlSizeProps,
  applyTransformStyleProps,
} from '../utils/controlStyle.js'
import { createCameraTexture } from '../utils/camera.js'
import {
  warnUnsupportedStyleProps,
  type HtmlStyle,
} from '../utils/styleMapping.js'
import { applyTextureRectObjectFitProps } from '../utils/textureRectFit.js'

/**
 * <CameraView> — preview a Godot CameraServer feed through CameraTexture.
 */
export const CameraView = defineComponent({
  name: 'CameraView',
  props: {
    feedId: {
      type: Number,
      default: undefined,
    },
    feedIndex: {
      type: Number,
      default: undefined,
    },
    whichFeed: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    alt: {
      type: String,
      default: undefined,
    },
    ...accessibilityPropOptions,
    style: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
  },
  setup(props) {
    const texture = shallowRef<Texture2D | null>(null)

    watch(
      () => [props.feedId, props.feedIndex, props.whichFeed, props.active],
      () => {
        texture.value = createCameraTexture({
          feedId: props.feedId,
          feedIndex: props.feedIndex,
          whichFeed: props.whichFeed,
          active: props.active,
        })
      },
      { immediate: true },
    )

    return () => {
      const style = props.style
      warnUnsupportedStyleProps(style, 'CameraView')
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

      if (style?.display === 'none') {
        nodeProps['visible'] = false
      }

      applyTransformStyleProps(nodeProps, style)
      applyAccessibilityProps(nodeProps, props, {
        label: props.alt,
      })

      return h('TextureRect', nodeProps)
    }
  },
})
