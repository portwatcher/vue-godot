import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'
import { Text, h } from '@vue/runtime-core'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Switch } = await import('../dist/index.js')

function renderSwitch(props = {}, slotText = '', emitted = []) {
  const render = Switch.setup(props, {
    slots: {
      default: () => (slotText ? [h(Text, null, slotText)] : []),
    },
    emit: (event, value) => {
      emitted.push([event, value])
    },
  })

  return render()
}

test('Switch renders a Godot CheckButton with v-model state', () => {
  const emitted = []
  const vnode = renderSwitch(
    {
      modelValue: true,
      label: 'Enable sync',
      style: {
        width: 180,
        height: 32,
      },
    },
    '',
    emitted,
  )

  assert.equal(vnode.type, 'CheckButton')
  assert.equal(vnode.props.toggle_mode, true)
  assert.equal(vnode.props.button_pressed, true)
  assert.equal(vnode.props.text, 'Enable sync')
  assert.equal(vnode.props['custom_minimum_size:x'], 180)
  assert.equal(vnode.props['custom_minimum_size:y'], 32)

  vnode.props.onToggled(false)
  assert.deepEqual(emitted, [
    ['update:modelValue', false],
    ['change', false],
  ])
})

test('Switch uses slot text and disabled/display style props', () => {
  const vnode = renderSwitch(
    {
      disabled: true,
      style: {
        display: 'none',
      },
    },
    'Slot label',
  )

  assert.equal(vnode.props.button_pressed, false)
  assert.equal(vnode.props.text, 'Slot label')
  assert.equal(vnode.props.disabled, true)
  assert.equal(vnode.props.visible, false)
})
