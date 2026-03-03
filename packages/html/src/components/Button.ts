import { defineComponent, h } from '@vue/runtime-core'
import { parseHexColor } from '../utils/colorParser.js'
import type { HtmlStyle } from '../utils/styleMapping.js'

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
 *   - `color`     → `theme_override_colors/font_color`
 *   - `width` / `height` → `custom_minimum_size`
 *   - `display: none`    → `visible = false`
 *
 * Usage:
 *   <Button @click="handleClick">Click me</Button>
 *   <Button :disabled="isLoading">Submit</Button>
 *   <Button :style="{ fontSize: 18 }" @click="save">Save</Button>
 */
export const Button = defineComponent({
  name: 'Button',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    style: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
  },
  emits: ['click'],
  setup(props, { slots, emit }) {
    return () => {
      const style = props.style
      const nodeProps: Record<string, unknown> = {}

      // Text from slot content (flattened strings)
      const slotContent = slots.default?.()
      const textValue =
        slotContent
          ?.map((vnode) =>
            typeof vnode.children === 'string' ? vnode.children : '',
          )
          .join('') ?? ''
      nodeProps['text'] = textValue

      // Disabled
      if (props.disabled) {
        nodeProps['disabled'] = true
      }

      // Signal forwarding:
      // Godot `pressed` signal → Vue `@click`
      nodeProps['onPressed'] = () => {
        emit('click')
      }

      // Width / height → custom_minimum_size
      if (typeof style?.width === 'number' && Number.isFinite(style.width)) {
        nodeProps['custom_minimum_size:x'] = style.width
      }
      if (typeof style?.height === 'number' && Number.isFinite(style.height)) {
        nodeProps['custom_minimum_size:y'] = style.height
      }

      // fontSize → theme_override_font_sizes/font_size
      if (
        typeof style?.fontSize === 'number' &&
        Number.isFinite(style.fontSize)
      ) {
        nodeProps['theme_override_font_sizes/font_size'] = style.fontSize
      }

      // color → theme_override_colors/font_color
      if (typeof style?.color === 'string') {
        const parsed = parseHexColor(style.color)
        if (parsed) {
          nodeProps['theme_override_colors/font_color'] = parsed
        }
      }

      // display: none
      if (style?.display === 'none') {
        nodeProps['visible'] = false
      }

      // opacity
      if (
        typeof style?.opacity === 'number' &&
        Number.isFinite(style.opacity)
      ) {
        nodeProps['modulate'] = `1,1,1,${style.opacity}`
      }

      return h('Button', nodeProps)
    }
  },
})
