import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'
import { h } from '@vue/runtime-core'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Pressable } = await import('../dist/index.js')

function renderPressable(props = {}, emitted = [], slotStates = []) {
  const render = Pressable.setup(props, {
    slots: {
      default: (state) => {
        slotStates.push(state)
        return [h('Label', { text: state.pressed ? 'Pressed' : 'Ready' })]
      },
    },
    emit: (event, value) => {
      emitted.push(value === undefined ? [event] : [event, value])
    },
  })

  return render()
}

test('Pressable renders a focusable PanelContainer with state slot props', () => {
  const emitted = []
  const slotStates = []
  const vnode = renderPressable(
    {
      style: {
        width: 160,
        height: 48,
        backgroundColor: '#223344',
      },
    },
    emitted,
    slotStates,
  )

  assert.equal(vnode.type, 'PanelContainer')
  assert.equal(vnode.props.focus_mode, 2)
  assert.equal(vnode.props.mouse_filter, 0)
  assert.equal(vnode.props['custom_minimum_size:x'], 160)
  assert.equal(vnode.props['custom_minimum_size:y'], 48)
  assert.equal(
    vnode.props['theme_override_styles/panel'].__kind,
    'style-box-flat',
  )
  assert.deepEqual(slotStates[0], {
    hovered: false,
    pressed: false,
    focused: false,
    disabled: false,
  })
  assert.equal(vnode.children[0].props.text, 'Ready')
})

test('Pressable emits hover, focus, press, and click events', () => {
  const emitted = []
  const vnode = renderPressable({}, emitted)
  const downEvent = { pressed: true, button_index: 1 }
  const upEvent = { pressed: false, button_index: 1 }

  vnode.props.onMouseEntered()
  vnode.props.onFocusEntered()
  vnode.props.onGuiInput(downEvent)
  vnode.props.onGuiInput(upEvent)
  vnode.props.onFocusExited()
  vnode.props.onMouseExited()

  assert.deepEqual(emitted, [
    ['hoverIn'],
    [
      'stateChange',
      { hovered: true, pressed: false, focused: false, disabled: false },
    ],
    ['focus'],
    [
      'stateChange',
      { hovered: true, pressed: false, focused: true, disabled: false },
    ],
    ['pressIn', downEvent],
    [
      'stateChange',
      { hovered: true, pressed: true, focused: true, disabled: false },
    ],
    ['pressOut', upEvent],
    [
      'stateChange',
      { hovered: true, pressed: false, focused: true, disabled: false },
    ],
    ['press', upEvent],
    ['click', upEvent],
    ['blur'],
    [
      'stateChange',
      { hovered: true, pressed: false, focused: false, disabled: false },
    ],
    ['hoverOut'],
    [
      'stateChange',
      { hovered: false, pressed: false, focused: false, disabled: false },
    ],
  ])
})

test('Pressable emits longPress without a follow-up press', async () => {
  const emitted = []
  const vnode = renderPressable({ longPressDelay: 0 }, emitted)
  const downEvent = { pressed: true, keycode: 32 }
  const upEvent = { pressed: false, keycode: 32 }

  vnode.props.onGuiInput(downEvent)
  await new Promise((resolve) => setTimeout(resolve, 5))
  vnode.props.onGuiInput(upEvent)

  assert.deepEqual(emitted, [
    ['pressIn', downEvent],
    [
      'stateChange',
      { hovered: false, pressed: true, focused: false, disabled: false },
    ],
    ['longPress', downEvent],
    ['pressOut', upEvent],
    [
      'stateChange',
      { hovered: false, pressed: false, focused: false, disabled: false },
    ],
  ])
})

test('Pressable ignores input when disabled', () => {
  const emitted = []
  const slotStates = []
  const vnode = renderPressable({ disabled: true }, emitted, slotStates)

  assert.equal(vnode.props.focus_mode, 0)
  assert.equal(vnode.props.mouse_filter, 2)
  assert.deepEqual(slotStates[0], {
    hovered: false,
    pressed: false,
    focused: false,
    disabled: true,
  })

  vnode.props.onMouseEntered()
  vnode.props.onFocusEntered()
  vnode.props.onGuiInput({ pressed: true, button_index: 1 })

  assert.deepEqual(emitted, [])
})
