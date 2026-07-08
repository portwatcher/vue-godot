import { defineComponent, h, ref } from '@vue/runtime-core'
import {
  accessibilityPropOptions,
  applyAccessibilityProps,
} from '../utils/accessibility.js'
import {
  applyControlSizeProps,
  applyDisplayAndOpacityProps,
  applyFontStyleProps,
  applyTransformStyleProps,
  applyMotionStyleProps,
  applyControlStateStyleBoxProps,
  applyControlStyleBoxProps,
} from '../utils/controlStyle.js'
import {
  applyAutoFocusProp,
  applyFocusTraversalProps,
  focusPropOptions,
} from '../utils/focus.js'
import { getRadioButtonGroup } from '../utils/radioGroups.js'
import {
  warnUnsupportedStyleProps,
} from '../utils/styleMapping.js'
import { htmlStyleProp } from '../utils/styleProps.js'
import { useHtmlComponentStyleResolver } from '../utils/styleResolver.js'
import {
  applyMinTouchTargetProps,
  touchTargetPropOptions,
} from '../utils/touchTarget.js'

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

const INPUT_TYPE_MAP = {
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
} satisfies Record<string, InputTypeMapping>

type SupportedInputType = keyof typeof INPUT_TYPE_MAP

function resolveInputType(type: string | undefined): SupportedInputType {
  const requestedType = type ?? 'text'
  if (Object.prototype.hasOwnProperty.call(INPUT_TYPE_MAP, requestedType)) {
    return requestedType as SupportedInputType
  }
  return 'text'
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
 *   - `readonly`     — disables text editing for text/password inputs
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
    readonly: {
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
    ...accessibilityPropOptions,
    ...focusPropOptions,
    ...touchTargetPropOptions,
    style: htmlStyleProp,
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    const resolveStyle = useHtmlComponentStyleResolver('Input', attrs)
    const focused = ref(false)

    return () => {
      const inputType = resolveInputType(props.type)
      const mapping = INPUT_TYPE_MAP[inputType]
      const readonlyLineEdit =
        props.readonly && (inputType === 'text' || inputType === 'password')
      const checked =
        mapping.valueType === 'radio'
          ? props.modelValue === (props.value ?? 'on')
          : inputType === 'checkbox' && props.modelValue === true
      const resolvedStyle = resolveStyle(props.style, {
        focus: focused.value,
        focusVisible: focused.value,
        disabled: props.disabled === true,
        readOnly: readonlyLineEdit,
        checked,
      })
      const style = resolvedStyle.style
      warnUnsupportedStyleProps(style, 'Input')
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
        if (props.disabled || readonlyLineEdit) {
          return
        }
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
      if (props.disabled || readonlyLineEdit) {
        // LineEdit uses `editable`, BaseButton/Slider use `disabled`
        if (mapping.tag === 'LineEdit') {
          nodeProps['editable'] = false
        } else {
          nodeProps['disabled'] = true
        }
      }
      nodeProps['onFocusEntered'] = () => {
        if (props.disabled !== true) {
          focused.value = true
        }
      }
      nodeProps['onFocusExited'] = () => {
        focused.value = false
      }

      applyControlSizeProps(nodeProps, style)
      if (mapping.tag === 'LineEdit') {
        applyFontStyleProps(nodeProps, style)
      }
      applyControlStyleBoxProps(nodeProps, style)
      applyControlStateStyleBoxProps(nodeProps, resolvedStyle.stateStyles)
      applyMinTouchTargetProps(nodeProps, props)
      applyDisplayAndOpacityProps(nodeProps, style)
      applyTransformStyleProps(nodeProps, style)
      applyAccessibilityProps(nodeProps, props)
      applyFocusTraversalProps(nodeProps, props)
      if (props.disabled !== true) {
        applyAutoFocusProp(nodeProps, props)
      }
      applyMotionStyleProps(nodeProps, style)

      return h(mapping.tag, nodeProps)
    }
  },
})
