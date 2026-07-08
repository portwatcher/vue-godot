import { defineComponent, h } from '@vue/runtime-core'
import {
  accessibilityPropOptions,
  applyAccessibilityProps,
} from '../utils/accessibility.js'
import {
  createBackgroundPanelStyle,
  createBackgroundTexturePanelProps,
  createBackgroundTexturePanelStyle,
} from '../utils/backgroundStyle.js'
import { useBackgroundTexture } from '../utils/backgroundTexture.js'
import { applyCommonControlStyleProps } from '../utils/controlStyle.js'
import { normalizeHtmlStyle } from '../utils/styleMapping.js'
import { htmlStyleProp } from '../utils/styleProps.js'
import { useHtmlComponentStyleResolver } from '../utils/styleResolver.js'
import { asDefaultSlot } from '../utils/slots.js'
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
    ...accessibilityPropOptions,
    style: htmlStyleProp,
    contentStyle: htmlStyleProp,
  },
  setup(props, { attrs, slots }) {
    const resolveStyle = useHtmlComponentStyleResolver('Screen', attrs)
    const backgroundTexture = useBackgroundTexture(
      () => resolveStyle(props.style).style,
      'Screen',
    )

    return () => {
      const style = resolveStyle(props.style).style
      const contentStyle = normalizeHtmlStyle(props.contentStyle)
      const nodeProps: Record<string, unknown> = {
        visible: props.visible !== false && style?.display !== 'none',
      }
      if (props.fullRect !== false) {
        Object.assign(nodeProps, fullRectProps)
      }

      applyCommonControlStyleProps(nodeProps, style, 'Screen')
      applyAccessibilityProps(nodeProps, props)

      const backgroundStyle = createBackgroundPanelStyle(style)
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
            ...(contentStyle ?? {}),
          },
        },
        asDefaultSlot(slots.default),
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
