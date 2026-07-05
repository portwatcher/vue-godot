import {
  defineComponent,
  h,
  ref,
  type PropType,
  type VNode,
} from '@vue/runtime-core'
import {
  applyFiniteNumberProp,
  applyScrollContainerStyleProps,
  toScrollMode,
  type ScrollViewScrollbarMode,
} from '../utils/scrollContainer.js'
import {
  toNumericPixels,
  type HtmlStyle,
} from '../utils/styleMapping.js'
import {
  nonNegativeFinite,
  positiveFinite,
  resolveItemCount,
  resolveVirtualListRange,
  type VirtualListRange,
} from '../utils/virtualList.js'
import { Div } from './Div.js'

export type VirtualListKeyExtractor = (
  item: unknown,
  index: number,
) => string | number

export interface VirtualListItemSlotProps {
  item: unknown
  index: number
  key: string | number
  range: VirtualListRange
}

function readKeyField(item: unknown, keyField: string): string | number | null {
  if (typeof item !== 'object' || item === null) {
    return null
  }

  const value = (item as Record<string, unknown>)[keyField]
  return typeof value === 'string' || typeof value === 'number' ? value : null
}

function finiteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function hasScrollVertical(value: unknown): value is { scroll_vertical: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    finiteNumber((value as Record<string, unknown>).scroll_vertical) != null
  )
}

function resolveItemKey(
  item: unknown,
  index: number,
  keyField: string | undefined,
  keyExtractor: VirtualListKeyExtractor | undefined,
): string | number {
  const extracted = keyExtractor?.(item, index)
  if (typeof extracted === 'string' || typeof extracted === 'number') {
    return extracted
  }

  if (keyField) {
    const fieldValue = readKeyField(item, keyField)
    if (fieldValue != null) {
      return fieldValue
    }
  }

  return index
}

function spacer(height: number, key: string) {
  return h('Control', {
    key,
    'custom_minimum_size:y': height,
  })
}

function resolveViewportHeight(
  height: number | undefined,
  style: HtmlStyle | undefined,
  itemHeight: number,
): number {
  const explicitHeight = positiveFinite(height, 0)
  if (explicitHeight > 0) {
    return explicitHeight
  }

  const styleHeight = toNumericPixels(style?.height)
  if (styleHeight != null && styleHeight > 0) {
    return styleHeight
  }

  return itemHeight * 10
}

/**
 * <VirtualList> — fixed-height vertical list virtualization.
 */
export const VirtualList = defineComponent({
  name: 'VirtualList',
  props: {
    items: {
      type: Array as PropType<readonly unknown[] | undefined>,
      default: undefined,
    },
    itemCount: {
      type: Number,
      default: undefined,
    },
    itemHeight: {
      type: Number,
      default: 32,
    },
    height: {
      type: Number,
      default: undefined,
    },
    overscan: {
      type: Number,
      default: 2,
    },
    scrollOffset: {
      type: Number,
      default: undefined,
    },
    keyField: {
      type: String,
      default: undefined,
    },
    keyExtractor: {
      type: Function as PropType<VirtualListKeyExtractor | undefined>,
      default: undefined,
    },
    scrollbarMode: {
      type: String as PropType<ScrollViewScrollbarMode>,
      default: 'auto',
    },
    scrollStep: {
      type: Number,
      default: undefined,
    },
    style: {
      type: Object as PropType<HtmlStyle | undefined>,
      default: undefined,
    },
    contentStyle: {
      type: Object as PropType<HtmlStyle | undefined>,
      default: undefined,
    },
    itemStyle: {
      type: Object as PropType<HtmlStyle | undefined>,
      default: undefined,
    },
  },
  emits: ['scroll', 'scrollStarted', 'scrollEnded', 'update:scrollOffset'],
  setup(props, { emit, slots }) {
    let scrollNode: unknown = null
    const internalScrollOffset = ref(0)

    function syncScrollOffsetFromNode(): void {
      if (!hasScrollVertical(scrollNode)) {
        return
      }

      const nextScrollOffset = nonNegativeFinite(scrollNode.scroll_vertical)
      internalScrollOffset.value = nextScrollOffset
      emit('update:scrollOffset', nextScrollOffset)
      emit('scroll', nextScrollOffset)
    }

    return () => {
      const itemHeight = positiveFinite(props.itemHeight, 32)
      const viewportHeight = resolveViewportHeight(
        props.height,
        props.style,
        itemHeight,
      )
      const itemCount = resolveItemCount(props.items, props.itemCount)
      const controlledScrollOffset = finiteNumber(props.scrollOffset)
      const scrollOffset =
        controlledScrollOffset != null
          ? nonNegativeFinite(controlledScrollOffset)
          : internalScrollOffset.value
      const range = resolveVirtualListRange({
        itemCount,
        itemHeight,
        viewportHeight,
        scrollOffset,
        overscan: props.overscan,
      })
      const nodeProps: Record<string, unknown> = {
        clip_contents: true,
        horizontal_scroll_mode: toScrollMode(false, 'disabled'),
        vertical_scroll_mode: toScrollMode(true, props.scrollbarMode),
        'custom_minimum_size:y': viewportHeight,
        onScrolling: syncScrollOffsetFromNode,
        onScrollStarted: () => emit('scrollStarted'),
        onScrollEnded: () => emit('scrollEnded'),
        onVnodeMounted: (vnode: VNode) => {
          scrollNode = vnode.el
        },
        onVnodeUpdated: (vnode: VNode) => {
          scrollNode = vnode.el
        },
        onVnodeUnmounted: () => {
          scrollNode = null
        },
      }

      applyScrollContainerStyleProps(nodeProps, props.style, 'VirtualList')
      applyFiniteNumberProp(nodeProps, 'scroll_vertical', scrollOffset)
      applyFiniteNumberProp(
        nodeProps,
        'scroll_vertical_custom_step',
        props.scrollStep,
      )

      const children = []
      if (range.offsetTop > 0) {
        children.push(spacer(range.offsetTop, 'top-spacer'))
      }

      for (let index = range.startIndex; index < range.endIndex; index += 1) {
        const item = props.items?.[index]
        const key = resolveItemKey(
          item,
          index,
          props.keyField,
          props.keyExtractor,
        )
        const slotProps: VirtualListItemSlotProps = {
          item,
          index,
          key,
          range,
        }
        children.push(
          h(
            Div,
            {
              key,
              style: {
                ...(props.itemStyle ?? {}),
                height: itemHeight,
              },
            },
            slots.default?.(slotProps),
          ),
        )
      }

      if (range.offsetBottom > 0) {
        children.push(spacer(range.offsetBottom, 'bottom-spacer'))
      }

      return h('ScrollContainer', nodeProps, [
        h(
          Div,
          {
            style: {
              ...(props.contentStyle ?? {}),
              flexDirection: 'column',
            },
          },
          children,
        ),
      ])
    }
  },
})
