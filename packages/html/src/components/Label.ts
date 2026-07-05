import { defineComponent, h } from '@vue/runtime-core'
import {
  type GodotPropBag,
} from '../utils/controlStyle.js'
import { extractTextFromSlot } from '../utils/slotText.js'
import type { HtmlStyle } from '../utils/styleMapping.js'
import {
  applyLabelTextStyleProps,
  withRequiredIndicator,
} from '../utils/textLabel.js'
import { Div } from './Div.js'

/**
 * <Label> — form label helper backed by Godot Label.
 */
export const Label = defineComponent({
  name: 'Label',
  props: {
    text: {
      type: String,
      default: undefined,
    },
    required: {
      type: Boolean,
      default: false,
    },
    requiredIndicator: {
      type: String,
      default: ' *',
    },
    style: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
    contentStyle: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    return () => {
      const slotChildren = slots.default?.()
      const rawText = props.text ?? extractTextFromSlot(slots.default)
      const nodeProps: GodotPropBag = {
        text: withRequiredIndicator(
          rawText,
          props.required === true,
          props.requiredIndicator ?? ' *',
        ),
      }

      applyLabelTextStyleProps(nodeProps, props.style, 'Label')

      const labelNode = h('Label', nodeProps)
      if (props.text == null || !slotChildren || slotChildren.length === 0) {
        return labelNode
      }

      return h(
        Div,
        {
          style: {
            flexDirection: 'column',
            ...(props.contentStyle ?? {}),
          },
        },
        [labelNode, ...slotChildren],
      )
    }
  },
})
