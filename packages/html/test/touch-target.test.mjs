import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'
import { h } from '@vue/runtime-core'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Button, Input, Pressable } = await import('../dist/index.js')

function renderButton(props = {}) {
  const render = Button.setup(props, {
    slots: {
      default: () => ['Tap'],
    },
    emit: () => {},
  })

  return render()
}

function renderInput(props = {}) {
  const render = Input.setup(props, {
    slots: {},
    emit: () => {},
  })

  return render()
}

function renderPressable(props = {}) {
  const render = Pressable.setup(props, {
    slots: {
      default: () => [h('Label', { text: 'Tap' })],
    },
    emit: () => {},
  })

  return render()
}

test('minTouchTarget expands focusable controls to a minimum hit size', () => {
  const pressable = renderPressable({ minTouchTarget: 44 })

  assert.equal(pressable.props['custom_minimum_size:x'], 44)
  assert.equal(pressable.props['custom_minimum_size:y'], 44)
})

test('minTouchTarget preserves larger explicit style dimensions', () => {
  const button = renderButton({
    minTouchTarget: 48,
    style: {
      width: 96,
      height: 24,
    },
  })
  const input = renderInput({
    minTouchTarget: 48,
    style: {
      width: 20,
      height: 72,
    },
  })

  assert.equal(button.props['custom_minimum_size:x'], 96)
  assert.equal(button.props['custom_minimum_size:y'], 48)
  assert.equal(input.props['custom_minimum_size:x'], 48)
  assert.equal(input.props['custom_minimum_size:y'], 72)
})

test('minTouchTarget ignores invalid values', () => {
  const button = renderButton({ minTouchTarget: 0 })

  assert.equal('custom_minimum_size:x' in button.props, false)
  assert.equal('custom_minimum_size:y' in button.props, false)
})
