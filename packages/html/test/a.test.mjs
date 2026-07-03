import assert from 'node:assert/strict'
import test from 'node:test'
import { h } from '@vue/runtime-core'

import { A } from '../dist/components/A.js'

function renderA(props = {}, slotChildren = []) {
  const emitted = []
  const render = A.setup(props, {
    emit: (event, ...args) => emitted.push({ event, args }),
    slots: {
      default: () => slotChildren,
    },
  })

  return { vnode: render(), emitted }
}

test('renders a Godot LinkButton with text and href uri', () => {
  const { vnode } = renderA({ href: 'https://example.com' }, [
    h('span', null, 'Example'),
  ])

  assert.equal(vnode.type, 'LinkButton')
  assert.equal(vnode.props.text, 'Example')
  assert.equal(vnode.props.uri, 'https://example.com')
  assert.equal(vnode.props.tooltip_text, 'https://example.com')
})

test('does not set uri when disabled', () => {
  const { vnode } = renderA({ href: 'https://example.com', disabled: true }, [
    'Disabled',
  ])

  assert.equal(vnode.props.disabled, true)
  assert.equal(vnode.props.uri, undefined)
})

test('forwards pressed signal as click event', () => {
  const { vnode, emitted } = renderA({}, ['Click'])

  vnode.props.onPressed()

  assert.deepEqual(emitted, [{ event: 'click', args: [] }])
})

test('maps common text control styles', () => {
  const { vnode } = renderA(
    {
      style: {
        width: 120,
        height: 32,
        fontSize: 18,
        color: '#ff0000',
        opacity: 0.5,
      },
    },
    ['Styled'],
  )

  assert.equal(vnode.props['custom_minimum_size:x'], 120)
  assert.equal(vnode.props['custom_minimum_size:y'], 32)
  assert.equal(vnode.props['theme_override_font_sizes/font_size'], 18)
  assert.equal(vnode.props['theme_override_colors/font_color'], '1,0,0,1')
  assert.equal(vnode.props.modulate, '1,1,1,0.5')
})
