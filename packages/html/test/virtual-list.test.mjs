import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'
import { h } from '@vue/runtime-core'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Div, VirtualList } = await import('../dist/index.js')
const {
  resolveVirtualListRange,
} = await import('../dist/utils/virtualList.js')

function renderVirtualList(props = {}, emitted = [], slotCalls = []) {
  const render = VirtualList.setup(props, {
    emit: (event, value) => {
      emitted.push(value === undefined ? [event] : [event, value])
    },
    slots: {
      default: (slotProps) => {
        slotCalls.push(slotProps)
        return [
          h('Label', {
            text: `${slotProps.index}:${String(slotProps.key)}`,
          }),
        ]
      },
    },
  })

  return render()
}

function createVirtualListRenderer(props = {}, emitted = [], slotCalls = []) {
  return VirtualList.setup(props, {
    emit: (event, value) => {
      emitted.push(value === undefined ? [event] : [event, value])
    },
    slots: {
      default: (slotProps) => {
        slotCalls.push(slotProps)
        return [h('Label', { text: String(slotProps.index) })]
      },
    },
  })
}

test('resolves a fixed-height virtual list window with overscan', () => {
  assert.deepEqual(
    resolveVirtualListRange({
      itemCount: 100,
      itemHeight: 20,
      viewportHeight: 100,
      scrollOffset: 160,
      overscan: 1,
    }),
    {
      startIndex: 7,
      endIndex: 14,
      offsetTop: 140,
      offsetBottom: 1720,
      totalHeight: 2000,
      renderedCount: 7,
    },
  )
})

test('includes partially visible rows for unaligned scroll offsets', () => {
  assert.deepEqual(
    resolveVirtualListRange({
      itemCount: 10,
      itemHeight: 10,
      viewportHeight: 30,
      scrollOffset: 15,
      overscan: 0,
    }),
    {
      startIndex: 1,
      endIndex: 5,
      offsetTop: 10,
      offsetBottom: 50,
      totalHeight: 100,
      renderedCount: 4,
    },
  )
})

test('VirtualList renders only the visible window plus spacers', () => {
  const items = Array.from({ length: 100 }, (_, index) => ({
    id: `row-${index}`,
    label: `Row ${index}`,
  }))
  const slotCalls = []
  const vnode = renderVirtualList(
    {
      items,
      itemHeight: 20,
      height: 100,
      scrollOffset: 160,
      overscan: 1,
      keyField: 'id',
      itemStyle: {
        padding: 2,
      },
      contentStyle: {
        gap: 0,
      },
    },
    [],
    slotCalls,
  )

  assert.equal(vnode.type, 'ScrollContainer')
  assert.equal(vnode.props.clip_contents, true)
  assert.equal(vnode.props.horizontal_scroll_mode, 0)
  assert.equal(vnode.props.vertical_scroll_mode, 1)
  assert.equal(vnode.props['custom_minimum_size:y'], 100)
  assert.equal(vnode.props.scroll_vertical, 160)

  const content = vnode.children[0]
  assert.equal(content.type, Div)
  assert.deepEqual(content.props.style, {
    gap: 0,
    flexDirection: 'column',
  })

  const children = content.children
  assert.equal(children.length, 9)
  assert.equal(children[0].type, 'Control')
  assert.equal(children[0].props['custom_minimum_size:y'], 140)
  assert.equal(children[8].type, 'Control')
  assert.equal(children[8].props['custom_minimum_size:y'], 1720)

  const firstRow = children[1]
  assert.equal(firstRow.type, Div)
  assert.equal(firstRow.key, 'row-7')
  assert.deepEqual(firstRow.props.style, {
    padding: 2,
    height: 20,
  })
  assert.equal(firstRow.children[0].props.text, '7:row-7')

  assert.deepEqual(
    slotCalls.map((call) => call.index),
    [7, 8, 9, 10, 11, 12, 13],
  )
  assert.equal(slotCalls[0].item, items[7])
  assert.equal(slotCalls[0].range.startIndex, 7)
})

test('VirtualList can render by itemCount and keyExtractor', () => {
  const slotCalls = []
  const vnode = renderVirtualList(
    {
      itemCount: 12,
      itemHeight: 10,
      height: 30,
      scrollOffset: 20,
      overscan: 0,
      keyExtractor: (_item, index) => `index-${index}`,
      scrollbarMode: 'never',
      scrollStep: 10,
    },
    [],
    slotCalls,
  )

  assert.equal(vnode.props.vertical_scroll_mode, 3)
  assert.equal(vnode.props.scroll_vertical_custom_step, 10)
  const rows = vnode.children[0].children
  assert.equal(rows.length, 5)
  assert.equal(rows[0].props['custom_minimum_size:y'], 20)
  assert.equal(rows[1].key, 'index-2')
  assert.equal(rows[3].key, 'index-4')
  assert.equal(rows[4].props['custom_minimum_size:y'], 70)
  assert.deepEqual(
    slotCalls.map((call) => call.item),
    [undefined, undefined, undefined],
  )
})

test('VirtualList maps style height, visibility, opacity, and scroll events', () => {
  const emitted = []
  const vnode = renderVirtualList(
    {
      itemCount: 3,
      itemHeight: 16,
      style: {
        display: 'none',
        height: '48px',
        opacity: 0.4,
      },
    },
    emitted,
  )

  assert.equal(vnode.props.visible, false)
  assert.equal(vnode.props['custom_minimum_size:y'], 48)
  assert.equal(vnode.props.modulate.__kind, 'color')
  assert.equal(vnode.props.modulate.a, 0.4)

  vnode.props.onScrollStarted()
  vnode.props.onScrollEnded()
  assert.deepEqual(emitted, [['scrollStarted'], ['scrollEnded']])
  assert.equal('onScrolling' in vnode.props, false)
})

test('VirtualList updates its window from the internal scrollbar signal', () => {
  const emitted = []
  const slotCalls = []
  const render = createVirtualListRenderer(
    {
      itemCount: 20,
      itemHeight: 10,
      height: 30,
      overscan: 0,
    },
    emitted,
    slotCalls,
  )

  let vnode = render()
  assert.deepEqual(
    slotCalls.map((call) => call.index),
    [0, 1, 2],
  )

  const connectedCallables = new Set()
  const scrolling = {
    connect(callable) {
      connectedCallables.add(callable)
    },
    disconnect(callable) {
      connectedCallables.delete(callable)
    },
    is_connected(callable) {
      return connectedCallables.has(callable)
    },
    emit() {
      for (const callable of connectedCallables) {
        callable.call()
      }
    },
  }
  const scrollNode = {
    scroll_vertical: 40,
    get_v_scroll_bar() {
      return { scrolling }
    },
  }

  vnode.props.onVnodeMounted({ el: scrollNode })
  assert.equal(connectedCallables.size, 1)

  scrolling.emit()
  vnode = render()

  assert.equal(vnode.props.scroll_vertical, 40)
  assert.deepEqual(emitted, [
    ['update:scrollOffset', 40],
    ['scroll', 40],
  ])
  assert.deepEqual(
    slotCalls.slice(3).map((call) => call.index),
    [4, 5, 6],
  )

  vnode.props.onVnodeUnmounted()
  assert.equal(connectedCallables.size, 0)
})
