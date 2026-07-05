import {
  defineComponent,
  h,
  ref,
  type PropType,
  type VNode,
} from '@vue/runtime-core'
import { Callable } from 'godot'
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
import {
  normalizeHtmlStyle,
  toNumericPixels,
  type HtmlStyle,
} from '../utils/styleMapping.js'
import { htmlStyleProp } from '../utils/styleProps.js'
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

interface GodotSignalLike {
  connect(callable: Callable): unknown
  disconnect(callable: Callable): unknown
  is_connected?: (callable: Callable) => boolean
}

interface VerticalScrollbarSource {
  get_v_scroll_bar: () => unknown
}

function hasScrollVertical(value: unknown): value is { scroll_vertical: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    finiteNumber((value as Record<string, unknown>).scroll_vertical) != null
  )
}

function hasVerticalScrollbarSource(
  value: unknown,
): value is VerticalScrollbarSource {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  return typeof (value as Record<string, unknown>).get_v_scroll_bar === 'function'
}

function isGodotSignal(value: unknown): value is GodotSignalLike {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.connect === 'function' &&
    typeof candidate.disconnect === 'function'
  )
}

function readVerticalScrollbarScrollingSignal(
  node: unknown,
): GodotSignalLike | null {
  if (!hasVerticalScrollbarSource(node)) {
    return null
  }

  const scrollbar = node.get_v_scroll_bar()
  if (typeof scrollbar !== 'object' || scrollbar === null) {
    return null
  }

  const signal = (scrollbar as Record<string, unknown>).scrolling
  return isGodotSignal(signal) ? signal : null
}

function isSignalConnected(
  signal: GodotSignalLike,
  callable: Callable,
): boolean {
  if (typeof signal.is_connected !== 'function') {
    return false
  }

  try {
    return signal.is_connected(callable)
  } catch {
    return false
  }
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
    style: htmlStyleProp,
    contentStyle: htmlStyleProp,
    itemStyle: htmlStyleProp,
    ...accessibilityPropOptions,
  },
  emits: ['scroll', 'scrollStarted', 'scrollEnded', 'update:scrollOffset'],
  setup(props, { emit, slots }) {
    let scrollNode: unknown = null
    let verticalScrollbarSignal: GodotSignalLike | null = null
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

    const scrollingCallable = new Callable(
      Callable.create(syncScrollOffsetFromNode),
    )

    function disconnectVerticalScrollbarSignal(): void {
      if (!verticalScrollbarSignal) {
        return
      }

      try {
        if (isSignalConnected(verticalScrollbarSignal, scrollingCallable)) {
          verticalScrollbarSignal.disconnect(scrollingCallable)
        }
      } catch {
        // The node may already be leaving the scene tree during unmount.
      } finally {
        verticalScrollbarSignal = null
      }
    }

    function attachScrollNode(node: unknown): void {
      if (scrollNode === node) {
        return
      }

      disconnectVerticalScrollbarSignal()
      scrollNode = node

      const nextSignal = readVerticalScrollbarScrollingSignal(node)
      if (!nextSignal) {
        return
      }

      try {
        if (!isSignalConnected(nextSignal, scrollingCallable)) {
          nextSignal.connect(scrollingCallable)
        }
        verticalScrollbarSignal = nextSignal
      } catch (error) {
        console.warn(
          '[vue-godot/html] Unable to connect VirtualList vertical scrollbar scrolling signal:',
          error,
        )
      }
    }

    function clearScrollNode(): void {
      disconnectVerticalScrollbarSignal()
      scrollNode = null
    }

    return () => {
      const itemHeight = positiveFinite(props.itemHeight, 32)
      const style = normalizeHtmlStyle(props.style)
      const contentStyle = normalizeHtmlStyle(props.contentStyle)
      const itemStyle = normalizeHtmlStyle(props.itemStyle)
      const viewportHeight = resolveViewportHeight(
        props.height,
        style,
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
        onScrollStarted: () => emit('scrollStarted'),
        onScrollEnded: () => emit('scrollEnded'),
        onVnodeMounted: (vnode: VNode) => {
          attachScrollNode(vnode.el)
        },
        onVnodeUpdated: (vnode: VNode) => {
          attachScrollNode(vnode.el)
        },
        onVnodeUnmounted: () => {
          clearScrollNode()
        },
      }

      applyScrollContainerStyleProps(nodeProps, style, 'VirtualList')
      applyAccessibilityProps(nodeProps, props)
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
                ...(itemStyle ?? {}),
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
              ...(contentStyle ?? {}),
              flexDirection: 'column',
            },
          },
          children,
        ),
      ])
    }
  },
})
