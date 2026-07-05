import { defineComponent, h } from '@vue/runtime-core'
import {
  createBackgroundPanelStyle,
  createBackgroundTexturePanelProps,
  createBackgroundTexturePanelStyle,
} from '../utils/backgroundStyle.js'
import { useBackgroundTexture } from '../utils/backgroundTexture.js'
import { applyCommonControlStyleProps } from '../utils/controlStyle.js'
import type { HtmlStyle } from '../utils/styleMapping.js'
import { Div } from './Div.js'

const fullRectProps = {
  anchor_right: 1,
  anchor_bottom: 1,
  offset_left: 0,
  offset_top: 0,
  offset_right: 0,
  offset_bottom: 0,
} as const

/**
 * <Screen> — full-parent app screen surface.
 */
export const Screen = defineComponent({
  name: 'Screen',
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    fullRect: {
      type: Boolean,
      default: true,
    },
    style: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
    contentStyle: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const backgroundTexture = useBackgroundTexture(() => props.style, 'Screen')

    return () => {
      const nodeProps: Record<string, unknown> = {
        visible: props.visible !== false && props.style?.display !== 'none',
      }
      if (props.fullRect !== false) {
        Object.assign(nodeProps, fullRectProps)
      }

      applyCommonControlStyleProps(nodeProps, props.style, 'Screen')

      const backgroundStyle = createBackgroundPanelStyle(props.style)
      const backgroundTextureStyle = createBackgroundTexturePanelStyle(
        backgroundTexture.value,
      )
      const tag =
        backgroundStyle || backgroundTextureStyle ? 'PanelContainer' : 'Control'
      if (backgroundStyle) {
        nodeProps['theme_override_styles/panel'] = backgroundStyle
      } else if (backgroundTextureStyle) {
        nodeProps['theme_override_styles/panel'] = backgroundTextureStyle
      }

      let content = h(
        Div,
        {
          style: {
            flexDirection: 'column',
            ...(props.contentStyle ?? {}),
          },
        },
        slots.default?.(),
      )

      if (backgroundStyle && backgroundTextureStyle) {
        content = h(
          'PanelContainer',
          createBackgroundTexturePanelProps(backgroundTextureStyle),
          [content],
        )
      }

      return h(tag, nodeProps, [content])
    }
  },
})
