import { defineComponent, h } from '@vue/runtime-core'
import {
  accessibilityPropOptions,
  applyAccessibilityProps,
} from '../utils/accessibility.js'
import {
  applyFiniteNumberProp,
  applyScrollContainerStyleProps,
  toScrollMode,
  type ScrollViewScrollbarMode,
} from '../utils/scrollContainer.js'
import { normalizeHtmlStyle, type HtmlStyle } from '../utils/styleMapping.js'
import { htmlStyleProp } from '../utils/styleProps.js'
import { asDefaultSlot } from '../utils/slots.js'
import { Div } from './Div.js'

export type { ScrollViewScrollbarMode } from '../utils/scrollContainer.js'

function defaultContentStyle(horizontal: boolean, vertical: boolean): HtmlStyle {
  return {
    flexDirection: horizontal && !vertical ? 'row' : 'column',
  }
}

/**
 * <ScrollView> — scrollable viewport backed by Godot ScrollContainer.
 *
 * Renders a `ScrollContainer` with one inner `<Div>` content container, so the
 * existing flex/grid style subset works inside the scrollable area.
 */
export const ScrollView = defineComponent({
  name: 'ScrollView',
  props: {
    style: htmlStyleProp,
    contentStyle: htmlStyleProp,
    horizontal: {
      type: Boolean,
      default: false,
    },
    vertical: {
      type: Boolean,
      default: true,
    },
    scrollbarMode: {
      type: String as () => ScrollViewScrollbarMode,
      default: 'auto',
    },
    horizontalScrollbar: {
      type: String as () => ScrollViewScrollbarMode | undefined,
      default: undefined,
    },
    verticalScrollbar: {
      type: String as () => ScrollViewScrollbarMode | undefined,
      default: undefined,
    },
    scrollHorizontal: {
      type: Number,
      default: undefined,
    },
    scrollVertical: {
      type: Number,
      default: undefined,
    },
    scrollStep: {
      type: Number,
      default: undefined,
    },
    horizontalStep: {
      type: Number,
      default: undefined,
    },
    verticalStep: {
      type: Number,
      default: undefined,
    },
    followFocus: {
      type: Boolean,
      default: false,
    },
    ...accessibilityPropOptions,
  },
  setup(props, { slots }) {
    return () => {
      const horizontal = props.horizontal === true
      const vertical = props.vertical !== false
      const contentStyleOverride = normalizeHtmlStyle(props.contentStyle)
      const scrollbarMode = props.scrollbarMode ?? 'auto'
      const nodeProps: Record<string, unknown> = {
        clip_contents: true,
        follow_focus: props.followFocus === true,
        horizontal_scroll_mode: toScrollMode(
          horizontal,
          props.horizontalScrollbar ?? scrollbarMode,
        ),
        vertical_scroll_mode: toScrollMode(
          vertical,
          props.verticalScrollbar ?? scrollbarMode,
        ),
      }

      applyScrollContainerStyleProps(nodeProps, props.style, 'ScrollView')
      applyAccessibilityProps(nodeProps, props)
      applyFiniteNumberProp(
        nodeProps,
        'scroll_horizontal',
        props.scrollHorizontal,
      )
      applyFiniteNumberProp(nodeProps, 'scroll_vertical', props.scrollVertical)
      applyFiniteNumberProp(
        nodeProps,
        'scroll_horizontal_custom_step',
        props.horizontalStep ?? props.scrollStep,
      )
      applyFiniteNumberProp(
        nodeProps,
        'scroll_vertical_custom_step',
        props.verticalStep ?? props.scrollStep,
      )

      const contentStyle = {
        ...defaultContentStyle(horizontal, vertical),
        ...(contentStyleOverride ?? {}),
      }

      return h('ScrollContainer', nodeProps, [
        h(Div, { style: contentStyle }, asDefaultSlot(slots.default)),
      ])
    }
  },
})
