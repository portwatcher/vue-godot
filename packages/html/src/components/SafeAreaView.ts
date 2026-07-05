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
import type { HtmlStyle } from '../utils/styleMapping.js'
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
    const backgroundTexture = useBackgroundTexture(
      () => props.style,
      'SafeAreaView',
    )

    return () => {
      const safeAreaInsets = readDisplayServerSafeAreaInsets(
        props.fallbackInsets,
      )
      const padding = resolveSafeAreaPadding(
        props.style,
        safeAreaInsets,
        props.edges,
      )
      const nodeProps: Record<string, unknown> = {}
      applyCommonControlStyleProps(nodeProps, props.style, 'SafeAreaView')
      applyAccessibilityProps(nodeProps, props)

      const content = h(
        Div,
        { style: props.contentStyle ?? {} },
        slots.default?.(),
      )
      const marginProps = createMarginThemeOverrides(padding)
      const backgroundTextureStyle = createBackgroundTexturePanelStyle(
        backgroundTexture.value,
      )
      const backgroundStyle = createBackgroundPanelStyle(props.style)
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
