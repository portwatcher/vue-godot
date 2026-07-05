import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'
import { renderWhenAsyncPropSettles } from './render-helpers.mjs'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Img } = await import('../dist/components/Img.js')

async function renderImg(props = {}) {
  const resultOrPromise = Img.setup(props, {
    emit: () => {},
    slots: {},
  })
  const render =
    typeof resultOrPromise?.then === 'function'
      ? await resultOrPromise
      : resultOrPromise

  return renderWhenAsyncPropSettles(render, 'texture', props.src != null)
}

test('renders a TextureRect node and loads local image sources', async () => {
  const vnode = await renderImg({ src: './assets/logo.png' })

  assert.equal(vnode.type, 'TextureRect')
  assert.ok(vnode.props.texture != null)
  assert.equal(vnode.props.texture.__mock, true)
  assert.equal(vnode.props.texture.__kind, 'local')
  assert.equal(vnode.props.texture.path, 'res://assets/logo.png')
})

test('does not set texture when src is undefined', async () => {
  const vnode = await renderImg({})
  assert.equal(vnode.props.texture, undefined)
})

test('maps sizing, object-fit, display, and alt metadata', async () => {
  const vnode = await renderImg({
    src: './image.png',
    alt: 'Status chart',
    accessibilityHint: 'Updated every frame',
    style: {
      width: 160,
      height: 90,
      objectFit: 'cover',
      display: 'none',
    },
  })

  assert.equal(vnode.props['custom_minimum_size:x'], 160)
  assert.equal(vnode.props['custom_minimum_size:y'], 90)
  assert.equal(vnode.props.expand_mode, 1)
  assert.equal(vnode.props.stretch_mode, 6)
  assert.equal(vnode.props.visible, false)
  assert.equal(vnode.props.tooltip_text, 'Status chart\nUpdated every frame')
})

test('maps percent style sizes to anchors', async () => {
  const vnode = await renderImg({
    src: './image.png',
    style: {
      width: '50%',
      height: '25%',
    },
  })

  assert.equal(vnode.props.anchor_left, 0)
  assert.equal(vnode.props.anchor_right, 0.5)
  assert.equal(vnode.props.anchor_top, 0)
  assert.equal(vnode.props.anchor_bottom, 0.25)
  assert.equal(vnode.props.expand_mode, 1)
  assert.equal(vnode.props.stretch_mode, 5)
})

test('loads image data URIs', async () => {
  const pngHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x47])
  const dataUri = `data:image/png;base64,${Buffer.from(pngHeader).toString(
    'base64',
  )}`

  const vnode = await renderImg({ src: dataUri })
  assert.ok(vnode.props.texture != null)
  assert.equal(vnode.props.texture.__kind, 'buffer')
  assert.equal(vnode.props.texture._format, 'png')
})

test('loads image blob URLs', async () => {
  const browser = await import('@vue-godot/browser')
  const fakeBlob = {
    type: 'image/png',
    async arrayBuffer() {
      return new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer
    },
  }
  const blobUrl = browser.createObjectURL(fakeBlob)

  const vnode = await renderImg({ src: blobUrl })
  assert.ok(vnode.props.texture != null)
  assert.equal(vnode.props.texture.__kind, 'buffer')
  assert.equal(vnode.props.texture._format, 'png')
})

test('loads remote image URLs', async () => {
  const vnode = await renderImg({ src: 'https://example.com/image.png' })

  assert.ok(vnode.props.texture != null)
  assert.equal(vnode.props.texture.__kind, 'buffer')
  assert.equal(vnode.props.texture._format, 'png')
})
