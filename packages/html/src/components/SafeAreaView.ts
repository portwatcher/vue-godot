import { defineComponent, h } from '@vue/runtime-core'
import { createBackgroundPanelStyle } from '../utils/backgroundStyle.js'
import { applyCommonControlStyleProps } from '../utils/controlStyle.js'
import {
  allSafeAreaEdges,
  readDisplayServerSafeAreaInsets,
  resolveSafeAreaPadding,
  type SafeAreaEdge,
  type SafeAreaInsets,
} from '../utils/safeArea.js'
import type { HtmlStyle } from '../utils/styleMapping.js'
import { Div } from './Div.js'

function withSafeAreaMargins(
  insets: SafeAreaInsets,
): Record<string, unknown> {
  return {
    'theme_override_constants/margin_top': insets.top,
    'theme_override_constants/margin_right': insets.right,
    'theme_override_constants/margin_bottom': insets.bottom,
    'theme_override_constants/margin_left': insets.left,
  }
}

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

      const content = h(Div, { style: props.contentStyle ?? {} }, slots.default?.())
      const marginProps = withSafeAreaMargins(padding)
      const backgroundStyle = createBackgroundPanelStyle(
        props.style?.backgroundColor,
      )

      if (!backgroundStyle) {
        return h('MarginContainer', { ...nodeProps, ...marginProps }, [content])
      }

      return h(
        'PanelContainer',
        {
          ...nodeProps,
          'theme_override_styles/panel': backgroundStyle,
        },
        [h('MarginContainer', marginProps, [content])],
      )
    }
  },
})
