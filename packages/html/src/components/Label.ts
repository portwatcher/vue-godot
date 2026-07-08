import { defineComponent, h } from '@vue/runtime-core'
import {
  accessibilityPropOptions,
  applyAccessibilityProps,
} from '../utils/accessibility.js'
import {
  type GodotPropBag,
} from '../utils/controlStyle.js'
import { extractTextFromSlot } from '../utils/slotText.js'
import { normalizeHtmlStyle } from '../utils/styleMapping.js'
import { htmlStyleProp } from '../utils/styleProps.js'
import { useHtmlComponentStyleResolver } from '../utils/styleResolver.js'
import { createDefaultSlot } from '../utils/slots.js'
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
    ...accessibilityPropOptions,
    style: htmlStyleProp,
    contentStyle: htmlStyleProp,
  },
  setup(props, { attrs, slots }) {
    const resolveStyle = useHtmlComponentStyleResolver('Label', attrs)

    return () => {
      const contentStyle = normalizeHtmlStyle(props.contentStyle)
      const slotChildren = slots.default?.()
      const rawText = props.text ?? extractTextFromSlot(slots.default)
      const nodeProps: GodotPropBag = {
        text: withRequiredIndicator(
          rawText,
          props.required === true,
          props.requiredIndicator ?? ' *',
        ),
      }

      applyLabelTextStyleProps(nodeProps, resolveStyle(props.style).style, 'Label')
      applyAccessibilityProps(nodeProps, props)

      const labelNode = h('Label', nodeProps)
      if (props.text == null || !slotChildren || slotChildren.length === 0) {
        return labelNode
      }

      return h(
        Div,
        {
          style: {
            flexDirection: 'column',
            ...(contentStyle ?? {}),
          },
        },
        createDefaultSlot(() => [labelNode, ...slotChildren]),
      )
    }
  },
})
