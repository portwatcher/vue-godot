import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'
import { h } from '@vue/runtime-core'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Div, Form, Label } = await import('../dist/index.js')

function defaultSlotChildren(vnode) {
  return typeof vnode.children?.default === 'function'
    ? vnode.children.default()
    : vnode.children
}

function renderForm(props = {}, children = [], emitted = []) {
  const render = Form.setup(props, {
    emit: (event, value) => {
      emitted.push(value === undefined ? [event] : [event, value])
    },
    slots: {
      default: () => children,
    },
  })

  return render()
}

function renderLabel(props = {}, children = []) {
  const render = Label.setup(props, {
    slots: {
      default: () => children,
    },
  })

  return render()
}

test('Form renders a focusable PanelContainer with column content', () => {
  const child = h('LineEdit', { text: 'Ada' })
  const vnode = renderForm(
    {
      style: {
        width: 320,
        backgroundColor: '#111827',
      },
      contentStyle: {
        gap: 8,
      },
    },
    [child],
  )

  assert.equal(vnode.type, 'PanelContainer')
  assert.equal(vnode.props.focus_mode, 2)
  assert.equal(vnode.props['custom_minimum_size:x'], 320)
  assert.equal(
    vnode.props['theme_override_styles/panel'].__kind,
    'style-box-flat',
  )
  assert.equal(vnode.children[0].type, Div)
  assert.deepEqual(vnode.children[0].props.style, {
    flexDirection: 'column',
    gap: 8,
  })
  assert.deepEqual(defaultSlotChildren(vnode.children[0]), [child])
})

test('Form emits submit and reset for Godot UI actions', () => {
  const emitted = []
  const vnode = renderForm(
    {
      resetOnCancel: true,
    },
    [],
    emitted,
  )
  const submitEvent = { pressed: true, action: 'ui_accept' }
  const resetEvent = { pressed: true, action: 'ui_cancel' }

  vnode.props.onGuiInput(submitEvent)
  vnode.props.onGuiInput({ pressed: true, echo: true, action: 'ui_accept' })
  vnode.props.onGuiInput(resetEvent)

  assert.deepEqual(emitted, [
    ['submit', submitEvent],
    ['reset', resetEvent],
  ])
})

test('Form ignores input when disabled', () => {
  const emitted = []
  const vnode = renderForm(
    {
      disabled: true,
      resetOnCancel: true,
    },
    [],
    emitted,
  )

  assert.equal(vnode.props.focus_mode, 0)
  vnode.props.onGuiInput({ pressed: true, action: 'ui_accept' })
  vnode.props.onGuiInput({ pressed: true, action: 'ui_cancel' })
  assert.deepEqual(emitted, [])
})

test('Label renders text, required marker, and text styles', () => {
  const vnode = renderLabel({
    text: 'Email',
    required: true,
    style: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ff0000',
      textAlign: 'center',
      overflowWrap: 'break-word',
      overflow: 'hidden',
    },
  })

  assert.equal(vnode.type, 'Label')
  assert.equal(vnode.props.text, 'Email *')
  assert.equal(vnode.props['theme_override_font_sizes/font_size'], 18)
  assert.equal(vnode.props['theme_override_fonts/font'].__kind, 'font-variation')
  assert.equal(vnode.props['theme_override_colors/font_color'].__kind, 'color')
  assert.equal(vnode.props.horizontal_alignment, 1)
  assert.equal(vnode.props.autowrap_mode, 3)
  assert.equal(vnode.props.clip_text, true)
})

test('Label can wrap a labeled control', () => {
  const input = h('LineEdit', { text: 'Ada' })
  const vnode = renderLabel(
    {
      text: 'Name',
      contentStyle: {
        gap: 4,
      },
    },
    [input],
  )

  assert.equal(vnode.type, Div)
  assert.deepEqual(vnode.props.style, {
    flexDirection: 'column',
    gap: 4,
  })
  const children = defaultSlotChildren(vnode)
  assert.equal(children[0].type, 'Label')
  assert.equal(children[0].props.text, 'Name')
  assert.equal(children[1], input)
})
