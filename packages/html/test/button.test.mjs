import assert from 'node:assert/strict'
import { h } from '@vue/runtime-core'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Button } = await import('../dist/components/Button.js')

function renderButton(props = {}, slotChildren = ['Save']) {
  const emitted = []
  const render = Button.setup(props, {
    emit: (event, ...args) => emitted.push({ event, args }),
    slots: {
      default: () => slotChildren,
    },
  })

  return { vnode: render(), emitted }
}

test('renders a Godot Button with extracted slot text', () => {
  const { vnode } = renderButton({}, [h('span', null, 'Save changes')])

  assert.equal(vnode.type, 'Button')
  assert.equal(vnode.props.text, 'Save changes')
})

test('forwards pressed signal as click event', () => {
  const { vnode, emitted } = renderButton()

  vnode.props.onPressed()

  assert.deepEqual(emitted, [{ event: 'click', args: [] }])
})

test('does not emit click when disabled', () => {
  const { vnode, emitted } = renderButton({ disabled: true }, ['Disabled'])

  assert.equal(vnode.props.disabled, true)
  vnode.props.onPressed()
  assert.deepEqual(emitted, [])
})

test('maps CSS style strings and minimum touch target props', () => {
  const { vnode } = renderButton(
    {
      minTouchTarget: 44,
      style:
        'width: 120px; height: 32px; color: #ff0000; display: none',
    },
    ['Styled'],
  )

  assert.equal(vnode.props['custom_minimum_size:x'], 120)
  assert.equal(vnode.props['custom_minimum_size:y'], 44)
  assert.equal(vnode.props.visible, false)

  const fontColor = vnode.props['theme_override_colors/font_color']
  assert.equal(fontColor.__mock, true)
  assert.equal(fontColor.__kind, 'color')
  assert.equal(fontColor.r, 1)
  assert.equal(fontColor.g, 0)
  assert.equal(fontColor.b, 0)
  assert.equal(fontColor.a, 1)
})
