import { defineComponent, h } from '@vue/runtime-core'
import {
  accessibilityPropOptions,
  applyAccessibilityProps,
} from '../utils/accessibility.js'
import { applyCommonControlStyleProps } from '../utils/controlStyle.js'
import { applyAutoFocusProp, focusPropOptions } from '../utils/focus.js'
import { extractTextFromSlot } from '../utils/slotText.js'
import type { HtmlStyle } from '../utils/styleMapping.js'

/**
 * <Switch> — binary toggle backed by Godot CheckButton.
 */
export const Switch = defineComponent({
  name: 'Switch',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    label: {
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
  emits: ['update:modelValue', 'change'],
  setup(props, { slots, emit }) {
    return () => {
      const nodeProps: Record<string, unknown> = {
        toggle_mode: true,
        button_pressed: props.modelValue === true,
        onToggled: (checked: boolean) => {
          emit('update:modelValue', checked)
          emit('change', checked)
        },
      }

      const text = props.label ?? extractTextFromSlot(slots.default)
      if (text) {
        nodeProps['text'] = text
      }
      if (props.disabled) {
        nodeProps['disabled'] = true
      }

      applyCommonControlStyleProps(nodeProps, props.style, 'Switch')
      applyAccessibilityProps(nodeProps, props)
      if (props.disabled !== true) {
        applyAutoFocusProp(nodeProps, props)
      }

      return h('CheckButton', nodeProps)
    }
  },
})
