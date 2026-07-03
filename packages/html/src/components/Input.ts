import { defineComponent, h } from '@vue/runtime-core'
import {
  applyControlSizeProps,
  applyDisplayAndOpacityProps,
  applyFontStyleProps,
} from '../utils/controlStyle.js'
import type { HtmlStyle } from '../utils/styleMapping.js'

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

      applyControlSizeProps(nodeProps, style)
      if (mapping.tag === 'LineEdit') {
        applyFontStyleProps(nodeProps, style)
      }
      applyDisplayAndOpacityProps(nodeProps, style)

      return h(mapping.tag, nodeProps)
    }
  },
})
