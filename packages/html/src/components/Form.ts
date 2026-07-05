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
import { FocusMode, isPressedInputAction } from '../utils/controlInput.js'
import { applyAutoFocusProp, focusPropOptions } from '../utils/focus.js'
import type { HtmlStyle } from '../utils/styleMapping.js'
import { Div } from './Div.js'

/**
 * <Form> — form grouping and keyboard submit/reset helper.
 */
export const Form = defineComponent({
  name: 'Form',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    submitOnAccept: {
      type: Boolean,
      default: true,
    },
    resetOnCancel: {
      type: Boolean,
      default: false,
    },
    ...accessibilityPropOptions,
    ...focusPropOptions,
    style: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
    contentStyle: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
  },
  emits: ['submit', 'reset'],
  setup(props, { slots, emit }) {
    const backgroundTexture = useBackgroundTexture(() => props.style, 'Form')

    return () => {
      const nodeProps: Record<string, unknown> = {
        focus_mode: props.disabled === true ? FocusMode.NONE : FocusMode.ALL,
        onGuiInput: (event: unknown) => {
          if (props.disabled === true) {
            return
          }
          if (
            props.submitOnAccept !== false &&
            isPressedInputAction(event, 'ui_accept')
          ) {
            emit('submit', event)
            return
          }
          if (
            props.resetOnCancel === true &&
            isPressedInputAction(event, 'ui_cancel')
          ) {
            emit('reset', event)
          }
        },
      }

      applyCommonControlStyleProps(nodeProps, props.style, 'Form')
      applyAccessibilityProps(nodeProps, props)
      if (props.disabled !== true) {
        applyAutoFocusProp(nodeProps, props)
      }

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

      return h('PanelContainer', nodeProps, [content])
    }
  },
})
