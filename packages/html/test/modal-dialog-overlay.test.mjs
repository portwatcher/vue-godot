import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'
import { h } from '@vue/runtime-core'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Dialog, Div, Modal, Overlay } = await import('../dist/index.js')

function renderComponent(component, props = {}, emitted = [], children = []) {
  const render = component.setup(props, {
    slots: {
      default: () => children,
    },
    emit: (event, value) => {
      emitted.push(value === undefined ? [event] : [event, value])
    },
  })

  return render()
}

test('Modal renders an exclusive transient Godot Window', () => {
  const emitted = []
  const child = h('Label', { text: 'Body' })
  const vnode = renderComponent(
    Modal,
    {
      modelValue: true,
      title: 'Settings',
      width: 420,
      height: 260,
      minWidth: 300,
      minHeight: 180,
      popup: true,
      unresizable: true,
    },
    emitted,
    [child],
  )

  assert.equal(vnode.type, 'Window')
  assert.equal(vnode.props.visible, true)
  assert.equal(vnode.props.title, 'Settings')
  assert.equal(vnode.props.wrap_controls, true)
  assert.equal(vnode.props.transient, true)
  assert.equal(vnode.props.exclusive, true)
  assert.equal(vnode.props.popup_window, true)
  assert.equal(vnode.props.unresizable, true)
  assert.equal(vnode.props['size:x'], 420)
  assert.equal(vnode.props['size:y'], 260)
  assert.equal(vnode.props['min_size:x'], 300)
  assert.equal(vnode.props['min_size:y'], 180)
  assert.equal(typeof vnode.props.onVnodeMounted, 'function')
  assert.equal(typeof vnode.props.onVnodeUpdated, 'function')
  assert.equal(typeof vnode.props.onVnodeBeforeUnmount, 'function')
  assert.deepEqual(vnode.children, [child])

  vnode.props.onCloseRequested()
  assert.deepEqual(emitted, [['update:modelValue', false], ['close']])
})

test('Modal can be hidden and sized from style values', () => {
  const vnode = renderComponent(Modal, {
    modelValue: true,
    title: 'Hidden',
    style: {
      display: 'none',
      width: '320px',
      height: 200,
      minWidth: 240,
      minHeight: 160,
    },
  })

  assert.equal(vnode.props.visible, false)
  assert.equal(vnode.props['size:x'], 320)
  assert.equal(vnode.props['size:y'], 200)
  assert.equal(vnode.props['min_size:x'], 240)
  assert.equal(vnode.props['min_size:y'], 160)
})

test('Dialog renders an AcceptDialog and forwards confirm/cancel events', () => {
  const emitted = []
  const vnode = renderComponent(
    Dialog,
    {
      modelValue: true,
      title: 'Delete item',
      message: 'This cannot be undone.',
      confirmText: 'Delete',
      closeOnEscape: false,
      hideOnOk: true,
      width: 360,
    },
    emitted,
  )

  assert.equal(vnode.type, 'AcceptDialog')
  assert.equal(vnode.props.visible, true)
  assert.equal(vnode.props.title, 'Delete item')
  assert.equal(vnode.props.dialog_text, 'This cannot be undone.')
  assert.equal(vnode.props.ok_button_text, 'Delete')
  assert.equal(vnode.props.dialog_close_on_escape, false)
  assert.equal(vnode.props.dialog_hide_on_ok, true)
  assert.equal(vnode.props.transient, true)
  assert.equal(vnode.props.exclusive, true)
  assert.equal(vnode.props['size:x'], 360)
  assert.equal(typeof vnode.props.onVnodeMounted, 'function')
  assert.equal(typeof vnode.props.onVnodeUpdated, 'function')
  assert.equal(typeof vnode.props.onVnodeBeforeUnmount, 'function')

  vnode.props.onConfirmed()
  assert.deepEqual(emitted, [['confirm'], ['update:modelValue', false]])

  vnode.props.onCanceled()
  assert.deepEqual(emitted.slice(2), [
    ['cancel'],
    ['update:modelValue', false],
    ['close'],
  ])
})

test('Overlay renders a full-parent PanelContainer with backdrop events', () => {
  const emitted = []
  const child = h('Label', { text: 'Overlay body' })
  const vnode = renderComponent(
    Overlay,
    {
      modelValue: true,
      closeOnClick: true,
      style: {
        backgroundColor: '#0008',
        opacity: 0.5,
      },
      contentStyle: {
        flexDirection: 'column',
        gap: 8,
      },
    },
    emitted,
    [child],
  )

  assert.equal(vnode.type, 'PanelContainer')
  assert.equal(vnode.props.visible, true)
  assert.equal(vnode.props.anchor_right, 1)
  assert.equal(vnode.props.anchor_bottom, 1)
  assert.equal(vnode.props.offset_left, 0)
  assert.equal(vnode.props.offset_top, 0)
  assert.equal(vnode.props.offset_right, 0)
  assert.equal(vnode.props.offset_bottom, 0)
  assert.equal(vnode.props.mouse_filter, 0)
  assert.equal(vnode.props.focus_mode, 2)
  assert.equal(vnode.props.focus_next, '.')
  assert.equal(vnode.props.focus_previous, '.')
  assert.equal(vnode.props.focus_neighbor_left, '.')
  assert.equal(vnode.props.focus_neighbor_top, '.')
  assert.equal(vnode.props.focus_neighbor_right, '.')
  assert.equal(vnode.props.focus_neighbor_bottom, '.')
  assert.equal(typeof vnode.props.onVnodeMounted, 'function')
  assert.equal(typeof vnode.props.onVnodeUpdated, 'function')
  assert.equal(typeof vnode.props.onVnodeBeforeUnmount, 'function')
  assert.equal(vnode.props.modulate.__kind, 'color')
  assert.equal(vnode.props.modulate.a, 0.5)
  assert.equal(
    vnode.props['theme_override_styles/panel'].__kind,
    'style-box-flat',
  )
  assert.equal(vnode.children[0].type, Div)
  assert.deepEqual(vnode.children[0].props.style, {
    flexDirection: 'column',
    gap: 8,
  })

  const event = { type: 'click' }
  vnode.props.onGuiInput(event)
  assert.deepEqual(emitted, [
    ['click', event],
    ['backdropClick', event],
    ['update:modelValue', false],
  ])
})

test('Overlay can ignore input and hide via modelValue', () => {
  const vnode = renderComponent(Overlay, {
    modelValue: false,
    blockInput: false,
  })

  assert.equal(vnode.props.visible, false)
  assert.equal(vnode.props.mouse_filter, 2)
})

test('Overlay can opt out of focus containment', () => {
  const vnode = renderComponent(Overlay, {
    modelValue: true,
    trapFocus: false,
    restoreFocus: false,
  })

  assert.equal('focus_mode' in vnode.props, false)
  assert.equal('focus_next' in vnode.props, false)
  assert.equal('onVnodeMounted' in vnode.props, false)
  assert.equal('onVnodeUpdated' in vnode.props, false)
  assert.equal('onVnodeBeforeUnmount' in vnode.props, false)
})
