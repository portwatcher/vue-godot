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
import { createMarginThemeOverrides } from '../utils/edgeInsets.js'
import {
  allSafeAreaEdges,
  readDisplayServerSafeAreaInsets,
  resolveSafeAreaPadding,
  type SafeAreaEdge,
  type SafeAreaInsets,
} from '../utils/safeArea.js'
import { normalizeHtmlStyle, type HtmlStyle } from '../utils/styleMapping.js'
import { htmlStyleProp } from '../utils/styleProps.js'
import { asDefaultSlot } from '../utils/slots.js'
import { Div } from './Div.js'

/**
 * <SafeAreaView> — pads content away from display cutouts and unsafe edges.
 */
export const SafeAreaView = defineComponent({
  name: 'SafeAreaView',
  props: {
    edges: {
      type: Array as () => SafeAreaEdge[],
      default: () => [...allSafeAreaEdges],
    },
    fallbackInsets: {
      type: Object as () => Partial<SafeAreaInsets>,
      default: undefined,
    },
    ...accessibilityPropOptions,
    style: htmlStyleProp,
    contentStyle: htmlStyleProp,
  },
  setup(props, { slots }) {
    const backgroundTexture = useBackgroundTexture(
      () => props.style,
      'SafeAreaView',
    )

    return () => {
      const style = normalizeHtmlStyle(props.style)
      const contentStyle = normalizeHtmlStyle(props.contentStyle)
      const safeAreaInsets = readDisplayServerSafeAreaInsets(
        props.fallbackInsets,
      )
      const padding = resolveSafeAreaPadding(
        style,
        safeAreaInsets,
        props.edges,
      )
      const nodeProps: Record<string, unknown> = {}
      applyCommonControlStyleProps(nodeProps, style, 'SafeAreaView')
      applyAccessibilityProps(nodeProps, props)

      const content = h(
        Div,
        { style: contentStyle ?? {} },
        asDefaultSlot(slots.default),
      )
      const marginProps = createMarginThemeOverrides(padding)
      const backgroundTextureStyle = createBackgroundTexturePanelStyle(
        backgroundTexture.value,
      )
      const backgroundStyle = createBackgroundPanelStyle(style)
      let paddedContent = h('MarginContainer', marginProps, [content])

      if (backgroundStyle && backgroundTextureStyle) {
        paddedContent = h(
          'PanelContainer',
          createBackgroundTexturePanelProps(backgroundTextureStyle),
          [paddedContent],
        )
      }

      if (!backgroundStyle && !backgroundTextureStyle) {
        return h('MarginContainer', { ...nodeProps, ...marginProps }, [content])
      }

      const panelProps: Record<string, unknown> = { ...nodeProps }
      panelProps['theme_override_styles/panel'] =
        backgroundStyle ?? backgroundTextureStyle

      return h('PanelContainer', panelProps, [paddedContent])
    }
  },
})
