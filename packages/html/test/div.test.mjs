import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'
import { Fragment, h } from '@vue/runtime-core'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Div } = await import('../dist/components/Div.js')

function renderDiv(style = {}, slotChildren = []) {
  const render = Div.setup(
    { style },
    {
      slots: {
        default: () => slotChildren,
      },
    },
  )

  return render()
}

test('applies resolved container theme overrides to Div node props', () => {
  const vnode = renderDiv({ flexDirection: 'row', gap: 10 })

  assert.equal(vnode.type, 'HBoxContainer')
  assert.equal(vnode.props['theme_override_constants/separation'], 10)
})

test('uses flow-theme override keys for wrapping Div containers', () => {
  const vnode = renderDiv({ flexDirection: 'column', flexWrap: 'wrap', gap: 9 })

  assert.equal(vnode.type, 'VFlowContainer')
  assert.equal(vnode.props['theme_override_constants/h_separation'], 9)
  assert.equal(vnode.props['theme_override_constants/v_separation'], 9)
})

test('wraps Div content in MarginContainer when padding is set', () => {
  const vnode = renderDiv({
    flexDirection: 'row',
    padding: 12,
    paddingRight: 20,
  })

  assert.equal(vnode.type, 'MarginContainer')
  assert.equal(vnode.props['theme_override_constants/margin_top'], 12)
  assert.equal(vnode.props['theme_override_constants/margin_right'], 20)
  assert.equal(vnode.props['theme_override_constants/margin_bottom'], 12)
  assert.equal(vnode.props['theme_override_constants/margin_left'], 12)

  assert.ok(Array.isArray(vnode.children))
  assert.equal(vnode.children.length, 1)
  assert.equal(vnode.children[0].type, 'HBoxContainer')
})

test('wraps Div content in PanelContainer when backgroundColor is set', () => {
  const vnode = renderDiv({
    flexDirection: 'column',
    backgroundColor: '#123456',
  })

  assert.equal(vnode.type, 'PanelContainer')
  assert.equal(
    vnode.props['theme_override_styles/panel'].__kind,
    'style-box-flat',
  )
  assert.deepEqual(vnode.props['theme_override_styles/panel'].bg_color, {
    __mock: true,
    __kind: 'color',
    rgba: '#123456',
  })
  assert.equal(vnode.props['theme_override_styles/panel'].draw_center, true)
  assert.equal(vnode.children[0].type, 'VBoxContainer')
})

test('puts padding inside the background panel', () => {
  const vnode = renderDiv({ padding: 8, backgroundColor: '#abc' })

  assert.equal(vnode.type, 'PanelContainer')
  assert.equal(vnode.children[0].type, 'MarginContainer')
  assert.equal(
    vnode.children[0].props['theme_override_constants/margin_left'],
    8,
  )
  assert.equal(vnode.children[0].children[0].type, 'HBoxContainer')
})

test('does not create a padding wrapper for display:none', () => {
  const vnode = renderDiv({ display: 'none', padding: 24 })

  assert.equal(vnode.type, 'Control')
  assert.equal(vnode.props.visible, false)
})

test('maps child flex and alignSelf to size flags in row layout', () => {
  const child = h('Control', { style: { flex: 2, alignSelf: 'center' } })
  const vnode = renderDiv({ flexDirection: 'row' }, [child])

  assert.equal(vnode.type, 'HBoxContainer')
  assert.ok(Array.isArray(vnode.children))
  assert.equal(vnode.children.length, 1)

  const mappedChild = vnode.children[0]
  assert.equal(mappedChild.props.size_flags_horizontal, 3)
  assert.equal(mappedChild.props.size_flags_stretch_ratio, 2)
  assert.equal(mappedChild.props.size_flags_vertical, 4)
})

test('applies container alignItems as default child cross-axis alignment', () => {
  const child = h('Control')
  const vnode = renderDiv({ flexDirection: 'row', alignItems: 'center' }, [
    child,
  ])
  const mappedChild = vnode.children[0]

  assert.equal(mappedChild.props.size_flags_vertical, 4)
})

test('maps nested fragments and arrays recursively', () => {
  const nested = h(Fragment, null, [
    h('Control', { style: { flex: 1 } }),
    [h('Control', { style: { alignSelf: 'flex-end' } })],
  ])
  const vnode = renderDiv({ flexDirection: 'row', alignItems: 'center' }, [
    nested,
  ])

  assert.equal(vnode.type, 'HBoxContainer')
  assert.ok(Array.isArray(vnode.children))
  assert.equal(vnode.children.length, 1)
  assert.equal(vnode.children[0].type, Fragment)

  const fragmentChildren = vnode.children[0].children
  assert.ok(Array.isArray(fragmentChildren))
  assert.equal(fragmentChildren.length, 2)

  assert.equal(fragmentChildren[0].props.size_flags_horizontal, 3)
  assert.equal(fragmentChildren[0].props.size_flags_vertical, 4)
  assert.equal(fragmentChildren[1].props.size_flags_vertical, 8)
})

test('maps justifyContent and width/height to container props', () => {
  const vnode = renderDiv({
    flexDirection: 'row',
    justifyContent: 'center',
    width: 64,
    height: '24px',
  })

  assert.equal(vnode.props.alignment, 1)
  assert.equal(vnode.props['custom_minimum_size:x'], 64)
  assert.equal(vnode.props['custom_minimum_size:y'], 24)
})

test('maps child flex and alignSelf to size flags in column layout', () => {
  const child = h('Control', { style: { flex: 1, alignSelf: 'flex-end' } })
  const vnode = renderDiv({ flexDirection: 'column' }, [child])

  assert.equal(vnode.type, 'VBoxContainer')
  assert.ok(Array.isArray(vnode.children))
  assert.equal(vnode.children.length, 1)

  const mappedChild = vnode.children[0]
  assert.equal(mappedChild.props.size_flags_vertical, 3)
  assert.equal(mappedChild.props.size_flags_stretch_ratio, 1)
  assert.equal(mappedChild.props.size_flags_horizontal, 8)
})

test('does not override explicit child size flags', () => {
  const child = h('Control', {
    style: { flex: 3, alignSelf: 'stretch' },
    size_flags_horizontal: 8,
    size_flags_vertical: 4,
    size_flags_stretch_ratio: 9,
  })
  const vnode = renderDiv({ flexDirection: 'row' }, [child])
  const mappedChild = vnode.children[0]

  assert.equal(mappedChild.props.size_flags_horizontal, 8)
  assert.equal(mappedChild.props.size_flags_vertical, 4)
  assert.equal(mappedChild.props.size_flags_stretch_ratio, 9)
})
