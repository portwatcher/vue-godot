import { defineComponent, h } from '@vue/runtime-core'
import {
  accessibilityPropOptions,
  applyAccessibilityProps,
} from '../utils/accessibility.js'
import {
  type GodotPropBag,
} from '../utils/controlStyle.js'
import { extractTextFromSlot } from '../utils/slotText.js'
import { normalizeHtmlStyle, type HtmlStyle } from '../utils/styleMapping.js'
import { htmlStyleProp } from '../utils/styleProps.js'
import { applyLabelTextStyleProps } from '../utils/textLabel.js'

/**
 * <Span> — inline text component.
 *
 * Maps to a Godot `Label` node. Text content is passed as the default
 * slot (string children), matching HTML `<span>` semantics.
 *
 * Style support:
 *   - `fontSize`      → `theme_override_font_sizes/font_size`
 *   - `fontWeight`    → bold `theme_override_fonts/font` FontVariation
 *   - `color`         → `theme_override_colors/font_color`
 *   - `textAlign`     → `horizontal_alignment`
 *   - `textTransform`  → `uppercase` (only `'uppercase'` supported)
 *   - `overflowWrap`   → `autowrap_mode` (`'break-word'` = AUTOWRAP_WORD_SMART)
 *   - `overflow`       → `clip_text` (`'hidden'` enables clipping)
 *   - `width` / `height` → `custom_minimum_size`
 *   - `display: none`    → `visible = false`
 *
 * Usage:
 *   <Span>Hello world</Span>
 *   <Span :style="{ fontSize: 24, fontWeight: 'bold', color: '#ff0000' }">Big red text</Span>
 *   <Span :style="{ textTransform: 'uppercase' }">uppercased</Span>
 *   <Span :style="{ overflowWrap: 'break-word' }">Long wrapping text</Span>
 */
export const Span = defineComponent({
  name: 'Span',
  props: {
    ...accessibilityPropOptions,
    style: htmlStyleProp,
  },
  setup(props, { slots }) {
    return () => {
      const style = normalizeHtmlStyle(props.style)
      const nodeProps: GodotPropBag = {}

      nodeProps['text'] = extractTextFromSlot(slots.default)
      applyLabelTextStyleProps(nodeProps, style, 'Span')
      applyAccessibilityProps(nodeProps, props)

      return h('Label', nodeProps)
    }
  },
})
