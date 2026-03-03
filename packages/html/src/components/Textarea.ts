import { defineComponent, h, ref } from '@vue/runtime-core'
import { parseHexColor } from '../utils/colorParser.js'
import type { HtmlStyle } from '../utils/styleMapping.js'

/** Type guard for Godot nodes that expose a `text` property. */
function hasTextProperty(node: unknown): node is { text: string } {
  return typeof node === 'object' && node !== null && 'text' in (node as object)
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
    const textEditRef = ref<unknown>(null)

    return () => {
      const style = props.style
      const nodeProps: Record<string, unknown> = {}

      // Current value → Godot `text` property
      if (props.modelValue !== undefined) {
        nodeProps['text'] = props.modelValue
      }

      // text_changed signal → v-model update
      // Godot's TextEdit.text_changed fires with no arguments, so we read
      // the current text directly from the underlying node via a template ref.
      nodeProps['onTextChanged'] = () => {
        const node = textEditRef.value
        if (hasTextProperty(node)) {
          emit('update:modelValue', node.text)
        }
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

      return h('TextEdit', { ref: textEditRef, ...nodeProps })
    }
  },
})
