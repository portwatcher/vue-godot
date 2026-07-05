import assert from 'node:assert/strict'
import test from 'node:test'
import { register } from 'node:module'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Canvas } = await import('../dist/components/Canvas.js')

function renderCanvas(props = {}) {
  const render = Canvas.setup(
    {
      width: 300,
      height: 150,
      ...props,
    },
    {
      emit: () => {},
      slots: {},
    },
  )

  return render()
}

test('Canvas uses default pixel size when style size is absent', () => {
  const vnode = renderCanvas()

  assert.equal(vnode.props['custom_minimum_size:x'], 300)
  assert.equal(vnode.props['custom_minimum_size:y'], 150)
})

test('Canvas maps percent style sizes to anchors without default pixel size', () => {
  const vnode = renderCanvas({
    style: {
      width: '100%',
      height: '50%',
    },
  })

  assert.equal(vnode.props.anchor_left, 0)
  assert.equal(vnode.props.anchor_right, 1)
  assert.equal(vnode.props.anchor_top, 0)
  assert.equal(vnode.props.anchor_bottom, 0.5)
  assert.equal('custom_minimum_size:x' in vnode.props, false)
  assert.equal('custom_minimum_size:y' in vnode.props, false)
  assert.equal(vnode.props.clip_contents, true)
})
