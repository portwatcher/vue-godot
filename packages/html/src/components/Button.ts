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
 * <Button> — interactive button component.
 *
 * Maps to a Godot `Button` node. The `pressed` signal is forwarded as
 * a Vue `@click` event (via the standard `onPressed` → `pressed` signal
 * mapping in the runtime).
 *
 * Text content is passed as the default slot, matching HTML `<button>`
 * semantics.
 *
 * Props:
 *   - `disabled`  — disables interaction
 *   - `style`     — subset of CSS styles mapped to Godot properties
 *
 * Events:
 *   - `@click`    → Godot `pressed` signal
 *
 * Style support:
 *   - `fontSize`  → `theme_override_font_sizes/font_size`
 *   - `fontWeight` → bold `theme_override_fonts/font` FontVariation
 *   - `color`     → `theme_override_colors/font_color`
 *   - `width` / `height` → `custom_minimum_size`
 *   - `display: none`    → `visible = false`
 *
 * Usage:
 *   <Button @click="handleClick">Click me</Button>
 *   <Button :disabled="isLoading">Submit</Button>
 *   <Button :style="{ fontSize: 18, fontWeight: 'bold' }" @click="save">Save</Button>
 */
export const Button = defineComponent({
  name: 'Button',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    ...accessibilityPropOptions,
    ...focusPropOptions,
    ...touchTargetPropOptions,
    style: htmlStyleProp,
  },
  emits: ['click'],
  setup(props, { attrs, slots, emit }) {
    const resolveStyle = useHtmlComponentStyleResolver('Button', attrs)
    const hovered = ref(false)
    const pressed = ref(false)
    const focused = ref(false)

    return () => {
      const resolvedStyle = resolveStyle(props.style, {
        hover: hovered.value,
        pressed: pressed.value,
        focus: focused.value,
        focusVisible: focused.value,
        disabled: props.disabled === true,
      })
      const style = resolvedStyle.style
      const nodeProps: Record<string, unknown> = {}

      nodeProps['text'] = extractTextFromSlot(slots.default)

      // Disabled
      if (props.disabled) {
        nodeProps['disabled'] = true
      }

      // Signal forwarding:
      // Godot `pressed` signal → Vue `@click`
      nodeProps['onPressed'] = () => {
        if (props.disabled !== true) {
          emit('click')
        }
      }
      nodeProps['onMouseEntered'] = () => {
        if (props.disabled !== true) {
          hovered.value = true
        }
      }
      nodeProps['onMouseExited'] = () => {
        hovered.value = false
        pressed.value = false
      }
      nodeProps['onButtonDown'] = () => {
        if (props.disabled !== true) {
          pressed.value = true
        }
      }
      nodeProps['onButtonUp'] = () => {
        pressed.value = false
      }
      nodeProps['onFocusEntered'] = () => {
        if (props.disabled !== true) {
          focused.value = true
        }
      }
      nodeProps['onFocusExited'] = () => {
        focused.value = false
        pressed.value = false
      }

      applyCommonControlStyleProps(nodeProps, style, 'Button')
      applyControlStyleBoxProps(nodeProps, style)
      applyControlStateStyleBoxProps(nodeProps, resolvedStyle.stateStyles)
      applyMinTouchTargetProps(nodeProps, props)
      applyAccessibilityProps(nodeProps, props)
      applyFocusTraversalProps(nodeProps, props)
      if (props.disabled !== true) {
        applyAutoFocusProp(nodeProps, props)
      }

      return h('Button', nodeProps)
    }
  },
})
