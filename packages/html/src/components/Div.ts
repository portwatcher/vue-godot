import { defineComponent, h } from '@vue/runtime-core'
import type { HtmlStyle } from '../utils/styleMapping'
import { resolveContainerTag } from '../utils/styleMapping'

/**
 * <Div> — the general-purpose layout container.
 *
 * Maps to a Godot container node based on the style prop:
 *   flex-direction: row    → HBoxContainer
 *   flex-direction: column → VBoxContainer
 *   flex-wrap: wrap        → HFlowContainer / VFlowContainer
 *   display: grid          → GridContainer
 *   (default)              → VBoxContainer
 *
 * Usage:
 *   <Div :style="{ flexDirection: 'row', gap: 10 }">
 *     <Div :style="{ flex: 1 }">Left</Div>
 *     <Div :style="{ flex: 2 }">Right</Div>
 *   </Div>
 */
export const Div = defineComponent({
  name: 'Div',
  props: {
    style: {
      type: Object as () => HtmlStyle,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    return () => {
      const { tag, themeOverrides, props: godotProps } = resolveContainerTag(
        props.style ?? {},
      )

      // TODO: apply themeOverrides via add_theme_constant_override
      // TODO: apply size flags for flex, alignSelf on children
      // TODO: handle padding (MarginContainer wrapper or theme override)

      return h(tag, godotProps, slots.default?.())
    }
  },
})
