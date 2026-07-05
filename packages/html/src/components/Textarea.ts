import { defineComponent, h, type VNode } from '@vue/runtime-core'
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
} from '../utils/controlStyle.js'
import {
  applyAutoFocusProp,
  applyFocusTraversalProps,
  focusPropOptions,
} from '../utils/focus.js'
import {
  warnUnsupportedStyleProps,
  type HtmlStyle,
} from '../utils/styleMapping.js'
import {
  applyMinTouchTargetProps,
  touchTargetPropOptions,
} from '../utils/touchTarget.js'

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
 *   <Textarea v-model="message" placeholder="Enter message..."></Textarea>
 *   <Textarea v-model="bio" :rows="5" :cols="40"></Textarea>
 *   <Textarea v-model="notes" :disabled="true"></Textarea>
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
    ...accessibilityPropOptions,
    ...focusPropOptions,
    ...touchTargetPropOptions,
    style: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    let textEditNode: unknown = null

    return () => {
      const style = props.style
      warnUnsupportedStyleProps(style, 'Textarea')
      const nodeProps: Record<string, unknown> = {}

      // Current value → Godot `text` property
      if (props.modelValue !== undefined) {
        nodeProps['text'] = props.modelValue
      }

      // text_changed signal → v-model update
      // Godot's TextEdit.text_changed fires with no arguments, so we read
      // the current text directly from the host node captured by vnode hooks.
      nodeProps['onTextChanged'] = () => {
        if (hasTextProperty(textEditNode)) {
          emit('update:modelValue', textEditNode.text)
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

      applyControlSizeProps(nodeProps, style)
      applyFontStyleProps(nodeProps, style)
      applyMinTouchTargetProps(nodeProps, props)
      applyDisplayAndOpacityProps(nodeProps, style)
      applyTransformStyleProps(nodeProps, style)
      applyAccessibilityProps(nodeProps, props)

      nodeProps['onVnodeMounted'] = (vnode: VNode) => {
        textEditNode = vnode.el
      }
      nodeProps['onVnodeUpdated'] = (vnode: VNode) => {
        textEditNode = vnode.el
      }
      nodeProps['onVnodeUnmounted'] = () => {
        textEditNode = null
      }
      applyFocusTraversalProps(nodeProps, props)
      if (props.disabled !== true) {
        applyAutoFocusProp(nodeProps, props)
      }
      applyMotionStyleProps(nodeProps, style)

      return h('TextEdit', nodeProps)
    }
  },
})
