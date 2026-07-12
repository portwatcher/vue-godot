import { defineComponent, h } from '@vue/runtime-core'
import {
  applyCommonControlStyleProps,
  type GodotPropBag,
} from '../utils/controlStyle.js'
import {
  applyAutoFocusProp,
  applyFocusTraversalProps,
  focusPropOptions,
} from '../utils/focus.js'
import { extractTextFromSlot } from '../utils/slotText.js'
import { htmlStyleProp } from '../utils/styleProps.js'
import {
  applyMinTouchTargetProps,
  touchTargetPropOptions,
} from '../utils/touchTarget.js'
import { useHtmlComponentStyleResolver } from '../utils/styleResolver.js'

/**
 * <A> — link component.
 *
 * Maps to Godot `LinkButton`. The `href` prop is passed to LinkButton's `uri`
 * property so Godot opens it through `OS.shell_open()` when pressed.
 */
export const A = defineComponent({
  name: 'A',
  props: {
    href: {
      type: String,
      default: undefined,
    },
    target: {
      type: String,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    ...focusPropOptions,
    ...touchTargetPropOptions,
    style: htmlStyleProp,
  },
  emits: ['click'],
  setup(props, { attrs, slots, emit }) {
    const resolveStyle = useHtmlComponentStyleResolver('A', attrs)

    return () => {
      const nodeProps: GodotPropBag = {
        text: extractTextFromSlot(slots.default),
        onPressed: () => emit('click'),
      }

      if (props.href && !props.disabled) {
        nodeProps['uri'] = props.href
      }

      if (props.disabled) {
        nodeProps['disabled'] = true
      }

      applyCommonControlStyleProps(
        nodeProps,
        resolveStyle(props.style, {
          disabled: props.disabled === true,
        }).style,
        'A',
      )
      applyMinTouchTargetProps(nodeProps, props)
      applyFocusTraversalProps(nodeProps, props)
      if (props.disabled !== true) {
        applyAutoFocusProp(nodeProps, props)
      }

      return h('LinkButton', nodeProps)
    }
  },
})
