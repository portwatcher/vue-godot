import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'
import { h } from '@vue/runtime-core'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Div, ScrollView } = await import('../dist/index.js')

function renderScrollView(props = {}, slotChildren = []) {
  const render = ScrollView.setup(props, {
    slots: {
      default: () => slotChildren,
    },
  })

  return render()
}

test('ScrollView renders a ScrollContainer with vertical scrolling by default', () => {
  const child = h('Label', { text: 'Row' })
  const vnode = renderScrollView({}, [child])

  assert.equal(vnode.type, 'ScrollContainer')
  assert.equal(vnode.props.clip_contents, true)
  assert.equal(vnode.props.follow_focus, false)
  assert.equal(vnode.props.horizontal_scroll_mode, 0)
  assert.equal(vnode.props.vertical_scroll_mode, 1)
  assert.ok(Array.isArray(vnode.children))
  assert.equal(vnode.children.length, 1)
  assert.equal(vnode.children[0].type, Div)
  assert.deepEqual(vnode.children[0].props.style, { flexDirection: 'column' })
})

test('ScrollView supports horizontal scrolling and custom scrollbar modes', () => {
  const vnode = renderScrollView({
    horizontal: true,
    vertical: false,
    scrollbarMode: 'always',
    horizontalScrollbar: 'auto',
    verticalScrollbar: 'never',
    followFocus: true,
    scrollHorizontal: 20,
    scrollVertical: 4,
    scrollStep: 12,
    verticalStep: 6,
  })

  assert.equal(vnode.props.horizontal_scroll_mode, 1)
  assert.equal(vnode.props.vertical_scroll_mode, 0)
  assert.equal(vnode.props.follow_focus, true)
  assert.equal(vnode.props.scroll_horizontal, 20)
  assert.equal(vnode.props.scroll_vertical, 4)
  assert.equal(vnode.props.scroll_horizontal_custom_step, 12)
  assert.equal(vnode.props.scroll_vertical_custom_step, 6)
  assert.deepEqual(vnode.children[0].props.style, { flexDirection: 'row' })
})

test('ScrollView maps style sizing, opacity, visibility, and contentStyle', () => {
  const vnode = renderScrollView({
    style: {
      display: 'none',
      width: '240px',
      height: '120px',
      opacity: 0.5,
    },
    contentStyle: {
      flexDirection: 'row',
      gap: 8,
      padding: 4,
    },
  })

  assert.equal(vnode.props.visible, false)
  assert.equal(vnode.props['custom_minimum_size:x'], 240)
  assert.equal(vnode.props['custom_minimum_size:y'], 120)
  assert.equal(vnode.props.modulate.__kind, 'color')
  assert.equal(vnode.props.modulate.a, 0.5)
  assert.deepEqual(vnode.children[0].props.style, {
    flexDirection: 'row',
    gap: 8,
    padding: 4,
  })
})
