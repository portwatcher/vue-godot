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
import { extractTextFromVNode } from '../utils/slotText.js'
import {
  normalizeHtmlStyle,
  warnUnsupportedStyleProps,
  type HtmlStyle,
} from '../utils/styleMapping.js'
import { htmlStyleProp } from '../utils/styleProps.js'
import {
  applyMinTouchTargetProps,
  touchTargetPropOptions,
} from '../utils/touchTarget.js'

/** Type guard for Godot OptionButton-like nodes. */
interface OptionButtonLike {
  call(method: string, ...args: unknown[]): unknown
}

function isOptionButton(node: unknown): node is OptionButtonLike {
  if (typeof node !== 'object' || node === null) {
    return false
  }

  const candidate = node as Record<string, unknown>
  return typeof candidate['call'] === 'function'
}

/**
 * Extract option entries from `<Option>` slot vnodes.
 *
 * Each `<Option>` child is expected to have:
 *   - `value` prop — the option value string
 *   - text slot children — the display label
 *
 * Returns an array of `{ value, label }` pairs in slot order.
 */
function extractOptions(
  children: VNode[],
): Array<{ value: string; label: string }> {
  const result: Array<{ value: string; label: string }> = []

  for (const vnode of children) {
    // Skip non-element vnodes (text, comments, fragments)
    if (vnode.type === Option) {
      const vnodeProps = vnode.props as Record<string, unknown> | null
      const value =
        typeof vnodeProps?.['value'] === 'string'
          ? vnodeProps['value']
          : String(result.length)
      const label = extractTextFromVNode(vnode)
      result.push({ value, label })
    } else if (Array.isArray(vnode.children)) {
      // Fragment — recurse into children
      result.push(...extractOptions(vnode.children as VNode[]))
    }
  }

  return result
}

/**
 * <Option> — individual option within a `<Select>`.
 *
 * This is a virtual component that does not render any Godot node on its own.
 * It is used purely as a declarative child of `<Select>` to provide option
 * `value` and display text, matching the HTML `<option>` element.
 *
 * Props:
 *   - `value`    — the option value (string)
 *   - `disabled` — marks the option as disabled (currently informational)
 *   - `selected` — marks the option as initially selected (currently informational)
 *
 * Usage:
 *   <Select v-model="choice">
 *     <Option value="a">Alpha</Option>
 *     <Option value="b">Bravo</Option>
 *   </Select>
 */
export const Option = defineComponent({
  name: 'Option',
  props: {
    value: {
      type: String,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  setup(_props, { slots }) {
    // Option doesn't render anything on its own — Select reads its props.
    // Return a comment node so it occupies no visual space.
    return () => h('_comment', {}, slots.default?.())
  },
})

/**
 * <Select> — dropdown selection component.
 *
 * Maps to a Godot `OptionButton` node. Children should be `<Option>`
 * components that define the available choices, matching HTML `<select>`
 * semantics.
 *
 * Supports `v-model` via `modelValue` + `update:modelValue`.
 *
 * Props:
 *   - `modelValue` — currently selected option value
 *   - `disabled`   — disables interaction
 *   - `style`      — subset of CSS styles
 *
 * Events:
 *   - `@update:modelValue` — emits the `value` of the newly selected option
 *   - `@change`            — emits the selected index (Godot `item_selected` signal)
 *
 * Usage:
 *   <Select v-model="color">
 *     <Option value="red">Red</Option>
 *     <Option value="green">Green</Option>
 *     <Option value="blue">Blue</Option>
 *   </Select>
 */
export const Select = defineComponent({
  name: 'Select',
  props: {
    modelValue: {
      type: String,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    ...accessibilityPropOptions,
    ...focusPropOptions,
    ...touchTargetPropOptions,
    style: htmlStyleProp,
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { slots, emit }) {
    /**
     * Imperatively sync the OptionButton's items with the extracted
     * option list using clear() + add_item(). This avoids relying on
     * Godot's `popup/item_N/text` property paths which are fragile
     * through Vue's prop-diffing lifecycle.
     */
    function syncItems(
      node: unknown,
      options: Array<{ value: string; label: string }>,
    ): void {
      if (!isOptionButton(node)) return

      node.call('clear')
      for (let i = 0; i < options.length; i++) {
        node.call('add_item', options[i].label, i)
      }

      // Restore selection
      if (props.modelValue !== undefined) {
        const selectedIdx = options.findIndex(
          (opt) => opt.value === props.modelValue,
        )
        if (selectedIdx >= 0) {
          node.call('select', selectedIdx)
        }
      }
    }

    return () => {
      const style = normalizeHtmlStyle(props.style)
      warnUnsupportedStyleProps(style, 'Select')
      const nodeProps: Record<string, unknown> = {}

      // Extract options from <Option> children
      const slotContent = slots.default?.() ?? []
      const options = extractOptions(slotContent)

      // item_selected signal → v-model update + change event
      nodeProps['onItemSelected'] = (index: number) => {
        const selectedOption = options[index]
        if (selectedOption) {
          emit('update:modelValue', selectedOption.value)
        }
        emit('change', index)
      }

      // Disabled
      if (props.disabled) {
        nodeProps['disabled'] = true
      }

      applyControlSizeProps(nodeProps, style)
      applyFontStyleProps(nodeProps, style)
      applyMinTouchTargetProps(nodeProps, props)
      applyDisplayAndOpacityProps(nodeProps, style)
      applyTransformStyleProps(nodeProps, style)
      applyAccessibilityProps(nodeProps, props)

      // Sync items imperatively after the vnode is mounted/patched
      nodeProps['onVnodeMounted'] = (vnode: VNode) =>
        syncItems(vnode.el, options)
      nodeProps['onVnodeUpdated'] = (vnode: VNode) =>
        syncItems(vnode.el, options)
      applyFocusTraversalProps(nodeProps, props)
      if (props.disabled !== true) {
        applyAutoFocusProp(nodeProps, props)
      }
      applyMotionStyleProps(nodeProps, style)

      return h('OptionButton', nodeProps)
    }
  },
})
