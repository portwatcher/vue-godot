import { defineComponent, h } from '@vue/runtime-core'
import type { HtmlStyle } from '../utils/styleMapping.js'

/**
 * Parse a hex color string (#RGB, #RRGGBB, #RRGGBBAA) into a Godot-compatible
 * `r,g,b,a` string.
 */
function parseHexColor(color: string): string | null {
  const hex = color.startsWith('#') ? color.slice(1) : null
  if (!hex) return null

  let r: number, g: number, b: number, a: number
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16) / 255
    g = parseInt(hex[1] + hex[1], 16) / 255
    b = parseInt(hex[2] + hex[2], 16) / 255
    a = 1
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16) / 255
    g = parseInt(hex.slice(2, 4), 16) / 255
    b = parseInt(hex.slice(4, 6), 16) / 255
    a = 1
  } else if (hex.length === 8) {
    r = parseInt(hex.slice(0, 2), 16) / 255
    g = parseInt(hex.slice(2, 4), 16) / 255
    b = parseInt(hex.slice(4, 6), 16) / 255
    a = parseInt(hex.slice(6, 8), 16) / 255
  } else {
    return null
  }

  if ([r, g, b, a].some((v) => !Number.isFinite(v))) return null
  return `${r},${g},${b},${a}`
}

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
