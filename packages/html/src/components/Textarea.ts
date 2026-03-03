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

/** Default line height in pixels when no fontSize is specified. */
const DEFAULT_LINE_HEIGHT = 20

/** Default character width in pixels when no fontSize is specified. */
const DEFAULT_CHAR_WIDTH = 10

/**
 * <Textarea> — multiline text input component.
 *
 * Maps to a Godot `TextEdit` node. Supports `v-model` via
 * `modelValue` + `update:modelValue`.
 *
 * Props:
 *   - `modelValue`  — v-model binding value
 *   - `placeholder` — placeholder text
 *   - `disabled`    — disables editing
 *   - `readonly`    — makes the field read-only
 *   - `rows`        — visible row count (sets minimum height)
 *   - `cols`        — visible column count (sets minimum width)
 *   - `style`       — subset of CSS styles
 *
 * Events:
 *   - `@update:modelValue` — v-model update
 *
 * **Limitation**: Godot's `TextEdit.text_changed` signal fires with no
 * arguments, so the component cannot read the new text from the signal
 * handler alone. The `text` property is set declaratively; `update:modelValue`
 * is emitted when `text_changed` fires, passing the current `modelValue`
 * to prompt a re-read. In practice, pair with the runtime's two-way prop
 * patching or use a `ref` that the runtime keeps in sync.
 *
 * Usage:
 *   <Textarea v-model="message" placeholder="Enter message..." />
 *   <Textarea v-model="bio" :rows="5" :cols="40" />
 *   <Textarea v-model="notes" :disabled="true" />
 */
export const Textarea = defineComponent({
  name: 'Textarea',
  props: {
    modelValue: {
      type: String,
      default: undefined,
    },
    placeholder: {
      type: String,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: Number,
      default: undefined,
    },
    cols: {
      type: Number,
      default: undefined,
    },
    style: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => {
      const style = props.style
      const nodeProps: Record<string, unknown> = {}

      // Current value → Godot `text` property
      if (props.modelValue !== undefined) {
        nodeProps['text'] = props.modelValue
      }

      // text_changed signal → v-model update
      // TextEdit's text_changed has no arguments; we emit the signal event
      // so the runtime can reconcile the value from the node.
      nodeProps['onTextChanged'] = () => {
        emit('update:modelValue', props.modelValue)
      }

      // Placeholder
      if (props.placeholder) {
        nodeProps['placeholder_text'] = props.placeholder
      }

      // Disabled / readonly → editable = false
      if (props.disabled || props.readonly) {
        nodeProps['editable'] = false
      }

      // rows → custom_minimum_size:y
      const lineHeight =
        typeof style?.fontSize === 'number' && Number.isFinite(style.fontSize)
          ? style.fontSize * 1.4
          : DEFAULT_LINE_HEIGHT
      if (typeof props.rows === 'number' && Number.isFinite(props.rows)) {
        nodeProps['custom_minimum_size:y'] = Math.round(props.rows * lineHeight)
      }

      // cols → custom_minimum_size:x
      const charWidth =
        typeof style?.fontSize === 'number' && Number.isFinite(style.fontSize)
          ? style.fontSize * 0.6
          : DEFAULT_CHAR_WIDTH
      if (typeof props.cols === 'number' && Number.isFinite(props.cols)) {
        nodeProps['custom_minimum_size:x'] = Math.round(props.cols * charWidth)
      }

      // Width / height → custom_minimum_size (overrides rows/cols if both set)
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

      return h('TextEdit', nodeProps)
    }
  },
})
