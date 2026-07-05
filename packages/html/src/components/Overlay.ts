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
import type { HtmlStyle } from '../utils/styleMapping.js'
import { Div } from './Div.js'

const MouseFilter = {
  STOP: 0,
  IGNORE: 2,
} as const

/**
 * <Overlay> — full-parent overlay surface backed by Godot Control nodes.
 */
export const Overlay = defineComponent({
  name: 'Overlay',
  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
    closeOnClick: {
      type: Boolean,
      default: false,
    },
    blockInput: {
      type: Boolean,
      default: true,
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
  emits: ['update:modelValue', 'click', 'backdropClick'],
  setup(props, { slots, emit }) {
    const backgroundTexture = useBackgroundTexture(() => props.style, 'Overlay')

    return () => {
      const nodeProps: Record<string, unknown> = {
        visible: props.modelValue !== false && props.style?.display !== 'none',
        anchor_right: 1,
        anchor_bottom: 1,
        offset_left: 0,
        offset_top: 0,
        offset_right: 0,
        offset_bottom: 0,
        mouse_filter:
          props.blockInput !== false ? MouseFilter.STOP : MouseFilter.IGNORE,
        onGuiInput: (event: unknown) => {
          emit('click', event)
          emit('backdropClick', event)
          if (props.closeOnClick) {
            emit('update:modelValue', false)
          }
        },
      }

      applyCommonControlStyleProps(nodeProps, props.style, 'Overlay')
      applyAccessibilityProps(nodeProps, props)

      const backgroundStyle = createBackgroundPanelStyle(props.style)
      const backgroundTextureStyle = createBackgroundTexturePanelStyle(
        backgroundTexture.value,
      )
      if (backgroundStyle) {
        nodeProps['theme_override_styles/panel'] = backgroundStyle
      } else if (backgroundTextureStyle) {
        nodeProps['theme_override_styles/panel'] = backgroundTextureStyle
      }

      let content = h(
        Div,
        { style: props.contentStyle ?? {} },
        slots.default?.(),
      )
      if (backgroundStyle && backgroundTextureStyle) {
        content = h(
          'PanelContainer',
          createBackgroundTexturePanelProps(backgroundTextureStyle),
          [content],
        )
      }

      return h('PanelContainer', nodeProps, [content])
    }
  },
})
