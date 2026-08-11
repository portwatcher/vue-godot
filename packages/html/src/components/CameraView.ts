import {
  defineComponent,
  getCurrentInstance,
  h,
  onBeforeUnmount,
  shallowRef,
  watch,
} from '@vue/runtime-core'
import type { CameraTexture } from 'godot'
import {
  applyControlSizeProps,
  applyTransformStyleProps,
  applyMotionStyleProps,
} from '../utils/controlStyle.js'
import {
  createCameraTexture,
  deactivateCameraTexture,
} from '../utils/camera.js'
import { warnUnsupportedStyleProps } from '../utils/styleMapping.js'
import { htmlStyleProp } from '../utils/styleProps.js'
import { useHtmlComponentStyleResolver } from '../utils/styleResolver.js'
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
    style: htmlStyleProp,
  },
  setup(props, context) {
    const resolveStyle = useHtmlComponentStyleResolver(
      'CameraView',
      context?.attrs,
    )
    const texture = shallowRef<CameraTexture | null>(null)

    watch(
      () => [props.feedId, props.feedIndex, props.whichFeed, props.active],
      () => {
        deactivateCameraTexture(texture.value)
        texture.value = createCameraTexture({
          feedId: props.feedId,
          feedIndex: props.feedIndex,
          whichFeed: props.whichFeed,
          active: props.active,
        })
      },
      { immediate: true },
    )

    if (getCurrentInstance()) {
      onBeforeUnmount(() => {
        deactivateCameraTexture(texture.value)
        texture.value = null
      })
    }

    return () => {
      const style = resolveStyle(props.style).style
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
      applyMotionStyleProps(nodeProps, style)

      return h('TextureRect', nodeProps)
    }
  },
})
