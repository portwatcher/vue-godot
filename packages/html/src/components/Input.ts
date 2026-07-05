import { defineComponent, h } from '@vue/runtime-core'
import {
  applyControlSizeProps,
  applyDisplayAndOpacityProps,
  applyFontStyleProps,
  applyTransformStyleProps,
} from '../utils/controlStyle.js'
import { getRadioButtonGroup } from '../utils/radioGroups.js'
import {
  warnUnsupportedStyleProps,
  type HtmlStyle,
} from '../utils/styleMapping.js'

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
  valueType: 'string' | 'boolean' | 'number' | 'radio'
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
  radio: {
    tag: 'CheckBox',
    changeEvent: 'onToggled',
    valueProp: 'button_pressed',
    valueType: 'radio',
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
 *   type="radio"    → CheckBox with optional ButtonGroup
 *   type="range"    → HSlider
 *
 * Supports `v-model` via `modelValue` + `update:modelValue`.
 *
 * Props:
 *   - `type`         — input type (default: `"text"`)
 *   - `modelValue`   — v-model binding value
 *   - `placeholder`  — placeholder text (text/password types)
 *   - `value`        — submitted value for radio inputs
 *   - `name`         — radio group name
 *   - `label`        — text label for checkbox/radio inputs
 *   - `disabled`     — disables interaction
 *   - `maxLength`    — max character count (text/password)
 *   - `min` / `max` / `step` — range slider bounds
 *   - `style`        — subset of CSS styles
 *
 * Events:
 *   - `@update:modelValue` — v-model update
 *
 * Usage:
 *   <Input v-model="name" placeholder="Your name"></Input>
 *   <Input type="password" v-model="password"></Input>
 *   <Input type="checkbox" v-model="agreed"></Input>
 *   <Input type="radio" v-model="choice" name="choice" value="a"></Input>
 *   <Input type="range" v-model="volume" :min="0" :max="100" :step="1"></Input>
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
    value: {
      type: [String, Number, Boolean],
      default: undefined,
    },
    name: {
      type: String,
      default: undefined,
    },
    label: {
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
      warnUnsupportedStyleProps(style, 'Input')
      const inputType = props.type ?? 'text'
      const mapping = INPUT_TYPE_MAP[inputType] ?? INPUT_TYPE_MAP['text']
      const nodeProps: Record<string, unknown> = {}

      // Current value → Godot property
      if (mapping.valueType === 'radio') {
        const radioValue = props.value ?? 'on'
        nodeProps[mapping.valueProp] = props.modelValue === radioValue
      } else if (props.modelValue !== undefined) {
        nodeProps[mapping.valueProp] = props.modelValue
      }

      // Change signal → v-model update
      nodeProps[mapping.changeEvent] = (
        newValue: string | boolean | number,
      ) => {
        if (mapping.valueType === 'radio') {
          if (newValue === true) {
            emit('update:modelValue', props.value ?? 'on')
          }
          return
        }

        emit('update:modelValue', newValue)
      }

      // Type-specific props
      switch (inputType) {
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
          nodeProps['toggle_mode'] = true
          if (props.label) {
            nodeProps['text'] = props.label
          }
          break

        case 'radio':
          nodeProps['toggle_mode'] = true
          if (props.label) {
            nodeProps['text'] = props.label
          }
          {
            const group = getRadioButtonGroup(props.name)
            if (group) {
              nodeProps['button_group'] = group
            }
          }
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
      applyTransformStyleProps(nodeProps, style)

      return h(mapping.tag, nodeProps)
    }
  },
})
