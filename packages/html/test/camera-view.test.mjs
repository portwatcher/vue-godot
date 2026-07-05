import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const {
  CameraView,
  createCameraTexture,
  listCameraFeeds,
  resolveCameraFeedId,
} = await import('../dist/index.js')

function setMockFeeds(feeds) {
  globalThis.__vueGodotHtmlMockCameraServer = { feeds }
}

function renderCameraView(props = {}) {
  const render = CameraView.setup(props)

  return render()
}

test('listCameraFeeds enumerates Godot camera feeds', () => {
  setMockFeeds([
    { id: 7, name: 'Back Camera', position: 2, active: true },
    { id: 8, name: 'Front Camera', position: 1, active: false },
    { id: 9, name: 'External Camera', position: 0, active: true },
  ])

  assert.deepEqual(listCameraFeeds(), [
    {
      index: 0,
      id: 7,
      name: 'Back Camera',
      position: 'back',
      active: true,
    },
    {
      index: 1,
      id: 8,
      name: 'Front Camera',
      position: 'front',
      active: false,
    },
    {
      index: 2,
      id: 9,
      name: 'External Camera',
      position: 'unspecified',
      active: true,
    },
  ])
})

test('resolveCameraFeedId uses explicit feed ids before feed indexes', () => {
  setMockFeeds([{ id: 4, name: 'Default Camera', position: 0, active: false }])

  assert.equal(resolveCameraFeedId({ feedId: 99, feedIndex: 0 }), 99)
  assert.equal(resolveCameraFeedId({ feedIndex: 0 }), 4)
})

test('createCameraTexture maps selected feed options to CameraTexture', () => {
  const texture = createCameraTexture({
    feedId: 9,
    whichFeed: 1,
    active: false,
  })

  assert.equal(texture.__kind, 'camera-texture')
  assert.equal(texture.camera_feed_id, 9)
  assert.equal(texture.which_feed, 1)
  assert.equal(texture.camera_is_active, false)
})

test('createCameraTexture returns null when no camera feed is available', () => {
  setMockFeeds([])

  assert.equal(createCameraTexture(), null)
})

test('CameraView renders a selected CameraTexture in a TextureRect', () => {
  setMockFeeds([
    { id: 7, name: 'Back Camera', position: 2, active: true },
    { id: 8, name: 'Front Camera', position: 1, active: false },
  ])

  const vnode = renderCameraView({
    feedIndex: 1,
    active: true,
    alt: 'Camera preview',
    style: { width: 320, height: 180, objectFit: 'cover' },
  })

  assert.equal(vnode.type, 'TextureRect')
  assert.equal(vnode.props.texture.__kind, 'camera-texture')
  assert.equal(vnode.props.texture.camera_feed_id, 8)
  assert.equal(vnode.props.texture.which_feed, 0)
  assert.equal(vnode.props.texture.camera_is_active, true)
  assert.equal(vnode.props['custom_minimum_size:x'], 320)
  assert.equal(vnode.props['custom_minimum_size:y'], 180)
  assert.equal(vnode.props.expand_mode, 1)
  assert.equal(vnode.props.stretch_mode, 6)
  assert.equal(vnode.props.tooltip_text, 'Camera preview')
})

test('CameraView renders without a texture when no feed is available', () => {
  setMockFeeds([])

  const vnode = renderCameraView({})

  assert.equal(vnode.type, 'TextureRect')
  assert.equal('texture' in vnode.props, false)
})
