import { defineComponent, h } from '@vue/runtime-core'
import {
  accessibilityPropOptions,
  applyAccessibilityProps,
} from '../utils/accessibility.js'
import { applyCommonControlStyleProps } from '../utils/controlStyle.js'
import {
  applyAutoFocusProp,
  applyFocusTraversalProps,
  focusPropOptions,
} from '../utils/focus.js'
import { extractTextFromSlot } from '../utils/slotText.js'
import { normalizeHtmlStyle, type HtmlStyle } from '../utils/styleMapping.js'
import { htmlStyleProp } from '../utils/styleProps.js'
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
  setup(props, { slots, emit }) {
    return () => {
      const style = normalizeHtmlStyle(props.style)
      const nodeProps: Record<string, unknown> = {}

      nodeProps['text'] = extractTextFromSlot(slots.default)

      // Disabled
      if (props.disabled) {
        nodeProps['disabled'] = true
      }

      // Signal forwarding:
      // Godot `pressed` signal → Vue `@click`
      nodeProps['onPressed'] = () => {
        emit('click')
      }

      applyCommonControlStyleProps(nodeProps, style, 'Button')
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
