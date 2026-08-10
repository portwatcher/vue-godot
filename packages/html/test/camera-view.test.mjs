import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const {
  CameraView,
  captureCameraImage,
  captureCameraTextureImage,
  createCameraTexture,
  deactivateCameraTexture,
  listCameraFeeds,
  resolveCameraFeedId,
} = await import('../dist/index.js')

function setMockCameraServer(state) {
  globalThis.__vueGodotHtmlMockCameraServer = {
    feeds: [],
    snapshotImage: null,
    throwOnSnapshot: false,
    ...state,
  }
}

function setMockFeeds(feeds) {
  setMockCameraServer({ feeds })
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

test('deactivateCameraTexture releases an active camera feed', () => {
  const texture = createCameraTexture({ feedId: 9, active: true })

  deactivateCameraTexture(texture)

  assert.equal(texture.camera_is_active, false)
})

test('captureCameraImage returns a camera texture image snapshot', () => {
  setMockFeeds([{ id: 4, name: 'Default Camera', position: 0, active: true }])

  const image = captureCameraImage({ feedIndex: 0, whichFeed: 1 })

  assert.equal(image.__kind, 'camera-image')
  assert.equal(image.feedId, 4)
  assert.equal(image.whichFeed, 1)
  assert.equal(image.active, true)
})

test('captureCameraTextureImage captures from an existing texture', () => {
  const texture = createCameraTexture({
    feedId: 9,
    whichFeed: 1,
    active: false,
  })

  const image = captureCameraTextureImage(texture)

  assert.equal(image.__kind, 'camera-image')
  assert.equal(image.feedId, 9)
  assert.equal(image.whichFeed, 1)
  assert.equal(image.active, false)
})

test('camera snapshot helpers return null when unavailable', () => {
  setMockCameraServer({
    feeds: [],
  })

  assert.equal(captureCameraImage(), null)
  assert.equal(captureCameraTextureImage(null), null)

  setMockCameraServer({
    feeds: [{ id: 5, name: 'Default Camera', position: 0, active: true }],
    throwOnSnapshot: true,
  })

  assert.equal(captureCameraImage({ feedIndex: 0 }), null)
})

test('CameraView renders a selected CameraTexture in a TextureRect', () => {
  setMockFeeds([
    { id: 7, name: 'Back Camera', position: 2, active: true },
    { id: 8, name: 'Front Camera', position: 1, active: false },
  ])

  const vnode = renderCameraView({
    feedIndex: 1,
    active: true,
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
})

test('CameraView renders without a texture when no feed is available', () => {
  setMockFeeds([])

  const vnode = renderCameraView({})

  assert.equal(vnode.type, 'TextureRect')
  assert.equal('texture' in vnode.props, false)
})
