import { defineComponent, h } from '@vue/runtime-core'
import {
  accessibilityPropOptions,
  applyAccessibilityProps,
} from '../utils/accessibility.js'
import {
  applyCommonControlStyleProps,
  type GodotPropBag,
} from '../utils/controlStyle.js'
import { applyAutoFocusProp, focusPropOptions } from '../utils/focus.js'
import { extractTextFromSlot } from '../utils/slotText.js'
import type { HtmlStyle } from '../utils/styleMapping.js'

/**
 * <A> — link component.
 *
 * Maps to Godot `LinkButton`. The `href` prop is passed to LinkButton's `uri`
 * property so Godot opens it through `OS.shell_open()` when pressed.
 */
export const A = defineComponent({
  name: 'A',
  props: {
    href: {
      type: String,
      default: undefined,
    },
    target: {
      type: String,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    ...accessibilityPropOptions,
    ...focusPropOptions,
    style: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
  },
  emits: ['click'],
  setup(props, { slots, emit }) {
    return () => {
      const nodeProps: GodotPropBag = {
        text: extractTextFromSlot(slots.default),
        onPressed: () => emit('click'),
      }

      if (props.href && !props.disabled) {
        nodeProps['uri'] = props.href
        nodeProps['tooltip_text'] = props.href
      }

      if (props.disabled) {
        nodeProps['disabled'] = true
      }

      applyCommonControlStyleProps(nodeProps, props.style, 'A')
      applyAccessibilityProps(nodeProps, props, {
        hint: props.disabled ? undefined : props.href,
      })
      if (props.disabled !== true) {
        applyAutoFocusProp(nodeProps, props)
      }

      return h('LinkButton', nodeProps)
    }
  },
})
