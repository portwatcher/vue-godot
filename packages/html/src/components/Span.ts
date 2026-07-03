import { defineComponent, h } from '@vue/runtime-core'
import {
  applyCommonControlStyleProps,
  type GodotPropBag,
} from '../utils/controlStyle.js'
import { extractTextFromSlot } from '../utils/slotText.js'
import type { HtmlStyle } from '../utils/styleMapping.js'

/**
 * Godot HorizontalAlignment constants.
 *
 * @see https://docs.godotengine.org/en/4.4/classes/class_%40globalscope.html#enum-globalscope-horizontalalignment
 */
const HorizontalAlignment = {
  LEFT: 0,
  CENTER: 1,
  RIGHT: 2,
  FILL: 3,
} as const

/**
 * Resolve CSS `textAlign` to Godot HorizontalAlignment value.
 */
function resolveTextAlign(textAlign: string | undefined): number | null {
  switch (textAlign) {
    case 'left':
      return HorizontalAlignment.LEFT
    case 'center':
      return HorizontalAlignment.CENTER
    case 'right':
      return HorizontalAlignment.RIGHT
    default:
      return null
  }
}

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
    style: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    return () => {
      const style = props.style
      const nodeProps: GodotPropBag = {}

      nodeProps['text'] = extractTextFromSlot(slots.default)
      applyCommonControlStyleProps(nodeProps, style)

      // textAlign → horizontal_alignment
      const hAlign = resolveTextAlign(style?.textAlign)
      if (hAlign != null) {
        nodeProps['horizontal_alignment'] = hAlign
      }

      // textTransform: 'uppercase' → Label.uppercase
      if (style?.textTransform === 'uppercase') {
        nodeProps['uppercase'] = true
      }

      // overflowWrap: 'break-word' → autowrap_mode (AUTOWRAP_WORD_SMART = 3)
      if (style?.overflowWrap === 'break-word') {
        nodeProps['autowrap_mode'] = 3
      }

      // overflow: 'hidden' → clip_text
      if (style?.overflow === 'hidden') {
        nodeProps['clip_text'] = true
      }

      return h('Label', nodeProps)
    }
  },
})
