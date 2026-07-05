import { defineComponent, h } from '@vue/runtime-core'
import { createBackgroundPanelStyle } from '../utils/backgroundStyle.js'
import { applyCommonControlStyleProps } from '../utils/controlStyle.js'
import { FocusMode, isPressedInputAction } from '../utils/controlInput.js'
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

      const backgroundStyle = createBackgroundPanelStyle(
        props.style?.backgroundColor,
      )
      if (backgroundStyle) {
        nodeProps['theme_override_styles/panel'] = backgroundStyle
      }

      return h('PanelContainer', nodeProps, [
        h(
          Div,
          {
            style: {
              flexDirection: 'column',
              ...(props.contentStyle ?? {}),
            },
          },
          slots.default?.(),
        ),
      ])
    }
  },
})
