import { defineComponent, h, ref } from '@vue/runtime-core'
import {
  accessibilityPropOptions,
  applyAccessibilityProps,
} from '../utils/accessibility.js'
import {
  applyCommonControlStyleProps,
  applyControlStateStyleBoxProps,
  applyControlStyleBoxProps,
} from '../utils/controlStyle.js'
import {
  applyAutoFocusProp,
  applyFocusTraversalProps,
  focusPropOptions,
} from '../utils/focus.js'
import { extractTextFromSlot } from '../utils/slotText.js'
import { htmlStyleProp } from '../utils/styleProps.js'
import { useHtmlComponentStyleResolver } from '../utils/styleResolver.js'
import {
  applyMinTouchTargetProps,
  touchTargetPropOptions,
} from '../utils/touchTarget.js'

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
    ...touchTargetPropOptions,
    style: htmlStyleProp,
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { attrs, slots, emit }) {
    const resolveStyle = useHtmlComponentStyleResolver('Switch', attrs)
    const focused = ref(false)

    return () => {
      const resolvedStyle = resolveStyle(props.style, {
        focus: focused.value,
        focusVisible: focused.value,
        disabled: props.disabled === true,
        checked: props.modelValue === true,
      })
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
      nodeProps['onFocusEntered'] = () => {
        if (props.disabled !== true) {
          focused.value = true
        }
      }
      nodeProps['onFocusExited'] = () => {
        focused.value = false
      }

      applyCommonControlStyleProps(nodeProps, resolvedStyle.style, 'Switch')
      applyControlStyleBoxProps(nodeProps, resolvedStyle.style)
      applyControlStateStyleBoxProps(nodeProps, resolvedStyle.stateStyles)
      applyMinTouchTargetProps(nodeProps, props)
      applyAccessibilityProps(nodeProps, props)
      applyFocusTraversalProps(nodeProps, props)
      if (props.disabled !== true) {
        applyAutoFocusProp(nodeProps, props)
      }

      return h('CheckButton', nodeProps)
    }
  },
})
