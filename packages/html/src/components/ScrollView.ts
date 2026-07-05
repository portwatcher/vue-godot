import { defineComponent, h } from '@vue/runtime-core'
import { createOpacityModulate } from '../utils/godotColor.js'
import type { HtmlStyle } from '../utils/styleMapping.js'
import { resolveContainerTag } from '../utils/styleMapping.js'
import { Div } from './Div.js'

export type ScrollViewScrollbarMode =
  | 'auto'
  | 'always'
  | 'never'
  | 'disabled'

const ScrollMode = {
  DISABLED: 0,
  AUTO: 1,
  SHOW_ALWAYS: 2,
  SHOW_NEVER: 3,
} as const

function toScrollMode(
  enabled: boolean,
  mode: ScrollViewScrollbarMode | undefined,
): number {
  if (!enabled) {
    return ScrollMode.DISABLED
  }

  switch (mode) {
    case 'always':
      return ScrollMode.SHOW_ALWAYS
    case 'never':
      return ScrollMode.SHOW_NEVER
    case 'disabled':
      return ScrollMode.DISABLED
    case 'auto':
    case undefined:
      return ScrollMode.AUTO
  }
}

function applyFiniteNumberProp(
  props: Record<string, unknown>,
  name: string,
  value: number | undefined,
): void {
  if (typeof value === 'number' && Number.isFinite(value)) {
    props[name] = value
  }
}

function applyStyleProps(
  props: Record<string, unknown>,
  style: HtmlStyle | undefined,
): void {
  if (!style) {
    return
  }

  const styleProps = resolveContainerTag(style).props
  for (const propName of [
    'visible',
    'custom_minimum_size:x',
    'custom_minimum_size:y',
  ]) {
    if (propName in styleProps) {
      props[propName] = styleProps[propName]
    }
  }
  if (
    typeof style.opacity === 'number' &&
    Number.isFinite(style.opacity)
  ) {
    props['modulate'] = createOpacityModulate(style.opacity)
  }
}

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
    style: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
    contentStyle: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
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
  },
  setup(props, { slots }) {
    return () => {
      const horizontal = props.horizontal === true
      const vertical = props.vertical !== false
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

      applyStyleProps(nodeProps, props.style)
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
        ...(props.contentStyle ?? {}),
      }

      return h('ScrollContainer', nodeProps, [
        h(Div, { style: contentStyle }, slots.default?.()),
      ])
    }
  },
})
