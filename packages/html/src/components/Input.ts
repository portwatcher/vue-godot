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
 * Maps HTML `<input type="...">` to the Godot node tag and
 * the signal used for value changes.
 */
interface InputTypeMapping {
  /** Godot node tag name. */
  tag: string
  /** Godot signal name for value changes (used in the `onXxx` event prop). */
  changeEvent: string
  /** The Godot property that holds the current value. */
  valueProp: string
  /** Type of the modeled value. */
  valueType: 'string' | 'boolean' | 'number'
}

const INPUT_TYPE_MAP: Record<string, InputTypeMapping> = {
  text: {
    tag: 'LineEdit',
    changeEvent: 'onTextChanged',
    valueProp: 'text',
    valueType: 'string',
  },
  password: {
    tag: 'LineEdit',
    changeEvent: 'onTextChanged',
    valueProp: 'text',
    valueType: 'string',
  },
  checkbox: {
    tag: 'CheckBox',
    changeEvent: 'onToggled',
    valueProp: 'button_pressed',
    valueType: 'boolean',
  },
  range: {
    tag: 'HSlider',
    changeEvent: 'onValueChanged',
    valueProp: 'value',
    valueType: 'number',
  },
}

/**
 * <Input> — form input component.
 *
 * Maps to different Godot nodes depending on the `type` prop:
 *
 *   type="text"     → LineEdit
 *   type="password" → LineEdit (secret mode)
 *   type="checkbox" → CheckBox
 *   type="range"    → HSlider
 *
 * Supports `v-model` via `modelValue` + `update:modelValue`.
 *
 * Props:
 *   - `type`         — input type (default: `"text"`)
 *   - `modelValue`   — v-model binding value
 *   - `placeholder`  — placeholder text (text/password types)
 *   - `disabled`     — disables interaction
 *   - `maxLength`    — max character count (text/password)
 *   - `min` / `max` / `step` — range slider bounds
 *   - `style`        — subset of CSS styles
 *
 * Events:
 *   - `@update:modelValue` — v-model update
 *
 * Usage:
 *   <Input v-model="name" placeholder="Your name" />
 *   <Input type="password" v-model="password" />
 *   <Input type="checkbox" v-model="agreed" />
 *   <Input type="range" v-model="volume" :min="0" :max="100" :step="1" />
 */
export const Input = defineComponent({
  name: 'Input',
  props: {
    type: {
      type: String,
      default: 'text',
    },
    modelValue: {
      type: [String, Number, Boolean],
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
    maxLength: {
      type: Number,
      default: undefined,
    },
    min: {
      type: Number,
      default: undefined,
    },
    max: {
      type: Number,
      default: undefined,
    },
    step: {
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
      const mapping = INPUT_TYPE_MAP[props.type] ?? INPUT_TYPE_MAP['text']
      const nodeProps: Record<string, unknown> = {}

      // Current value → Godot property
      if (props.modelValue !== undefined) {
        nodeProps[mapping.valueProp] = props.modelValue
      }

      // Change signal → v-model update
      nodeProps[mapping.changeEvent] = (
        newValue: string | boolean | number,
      ) => {
        emit('update:modelValue', newValue)
      }

      // Type-specific props
      switch (props.type) {
        case 'text':
          if (props.placeholder) {
            nodeProps['placeholder_text'] = props.placeholder
          }
          if (typeof props.maxLength === 'number') {
            nodeProps['max_length'] = props.maxLength
          }
          break

        case 'password':
          nodeProps['secret'] = true
          if (props.placeholder) {
            nodeProps['placeholder_text'] = props.placeholder
          }
          if (typeof props.maxLength === 'number') {
            nodeProps['max_length'] = props.maxLength
          }
          break

        case 'checkbox':
          // No extra props needed — CheckBox toggle_mode is on by default
          break

        case 'range':
          if (typeof props.min === 'number' && Number.isFinite(props.min)) {
            nodeProps['min_value'] = props.min
          }
          if (typeof props.max === 'number' && Number.isFinite(props.max)) {
            nodeProps['max_value'] = props.max
          }
          if (typeof props.step === 'number' && Number.isFinite(props.step)) {
            nodeProps['step'] = props.step
          }
          break
      }

      // Disabled
      if (props.disabled) {
        // LineEdit uses `editable`, BaseButton/Slider use `disabled`
        if (mapping.tag === 'LineEdit') {
          nodeProps['editable'] = false
        } else {
          nodeProps['disabled'] = true
        }
      }

      // Width / height → custom_minimum_size
      if (typeof style?.width === 'number' && Number.isFinite(style.width)) {
        nodeProps['custom_minimum_size:x'] = style.width
      }
      if (typeof style?.height === 'number' && Number.isFinite(style.height)) {
        nodeProps['custom_minimum_size:y'] = style.height
      }

      // fontSize → theme_override_font_sizes/font_size (LineEdit)
      if (
        mapping.tag === 'LineEdit' &&
        typeof style?.fontSize === 'number' &&
        Number.isFinite(style.fontSize)
      ) {
        nodeProps['theme_override_font_sizes/font_size'] = style.fontSize
      }

      // color → theme_override_colors/font_color (LineEdit)
      if (mapping.tag === 'LineEdit' && typeof style?.color === 'string') {
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

      return h(mapping.tag, nodeProps)
    }
  },
})
