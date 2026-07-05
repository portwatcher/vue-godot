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
import {
  applyAutoFocusProp,
  applyFocusTraversalProps,
  focusPropOptions,
} from '../utils/focus.js'
import { normalizeHtmlStyle, type HtmlStyle } from '../utils/styleMapping.js'
import { htmlStyleProp } from '../utils/styleProps.js'
import {
  applyMinTouchTargetProps,
  touchTargetPropOptions,
} from '../utils/touchTarget.js'
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
    ...touchTargetPropOptions,
    style: htmlStyleProp,
    contentStyle: htmlStyleProp,
  },
  emits: ['submit', 'reset'],
  setup(props, { slots, emit }) {
    const backgroundTexture = useBackgroundTexture(() => props.style, 'Form')

    return () => {
      const style = normalizeHtmlStyle(props.style)
      const contentStyle = normalizeHtmlStyle(props.contentStyle)
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

      applyCommonControlStyleProps(nodeProps, style, 'Form')
      applyMinTouchTargetProps(nodeProps, props)
      applyAccessibilityProps(nodeProps, props)
      applyFocusTraversalProps(nodeProps, props)
      if (props.disabled !== true) {
        applyAutoFocusProp(nodeProps, props)
      }

      const backgroundStyle = createBackgroundPanelStyle(style)
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
            ...(contentStyle ?? {}),
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
