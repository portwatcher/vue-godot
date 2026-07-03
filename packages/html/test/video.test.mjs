import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'

// Register a loader that intercepts 'godot' and '@vue-godot/browser'
// bare specifiers with mocks.
register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Video } = await import('../dist/components/Video.js')

/**
 * Render the Video component. Because setup() uses an async watcher
 * internally (`await loadStream()`), we need to flush microtasks
 * before calling the render function so `stream.value` is populated.
 */
async function renderVideo(props = {}) {
  const emitted = []
  const resultOrPromise = Video.setup(props, {
    emit: (event, ...args) => emitted.push({ event, args }),
    slots: {},
  })
  // setup() returns a Promise that resolves to the render function.
  const render =
    typeof resultOrPromise?.then === 'function'
      ? await resultOrPromise
      : resultOrPromise

  // Flush microtasks so the immediate watcher's async body completes.
  await new Promise((r) => setTimeout(r, 0))

  return { vnode: render(), emitted }
}

test('renders a VideoStreamPlayer node', async () => {
  const { vnode } = await renderVideo({ src: './intro.ogv' })
  assert.equal(vnode.type, 'VideoStreamPlayer')
})

test('resolves src to a Godot resource path and loads stream', async () => {
  const { vnode } = await renderVideo({ src: './videos/intro.ogv' })
  assert.ok(vnode.props.stream != null)
  assert.equal(vnode.props.stream.__mock, true)
  assert.equal(vnode.props.stream.__kind, 'local')
})

test('does not set stream when src is undefined', async () => {
  const { vnode } = await renderVideo({})
  assert.equal(vnode.props.stream, undefined)
})

test('passes autoplay prop', async () => {
  const { vnode } = await renderVideo({ src: './v.ogv', autoplay: true })
  assert.equal(vnode.props.autoplay, true)
})

test('does not set autoplay when false', async () => {
  const { vnode } = await renderVideo({ src: './v.ogv', autoplay: false })
  assert.equal(vnode.props.autoplay, undefined)
})

test('passes loop prop', async () => {
  const { vnode } = await renderVideo({ src: './v.ogv', loop: true })
  assert.equal(vnode.props.loop, true)
})

test('mutes audio when muted is true', async () => {
  const { vnode } = await renderVideo({
    src: './v.ogv',
    muted: true,
    volume: 1,
  })
  assert.equal(vnode.props.volume_db, -80)
})

test('maps linear volume 1 to 0 dB', async () => {
  const { vnode } = await renderVideo({ src: './v.ogv', volume: 1 })
  assert.equal(vnode.props.volume_db, 0)
})

test('maps linear volume 0 to -80 dB', async () => {
  const { vnode } = await renderVideo({ src: './v.ogv', volume: 0 })
  assert.equal(vnode.props.volume_db, -80)
})

test('maps linear volume 0.5 to approximately -6 dB', async () => {
  const { vnode } = await renderVideo({ src: './v.ogv', volume: 0.5 })
  // 20 * log10(0.5) ≈ -6.0206
  assert.ok(vnode.props.volume_db < -5.9)
  assert.ok(vnode.props.volume_db > -6.1)
})

test('sets expand to true by default', async () => {
  const { vnode } = await renderVideo({ src: './v.ogv' })
  assert.equal(vnode.props.expand, true)
})

test('maps width and height from style to custom_minimum_size', async () => {
  const { vnode } = await renderVideo({
    src: './v.ogv',
    style: { width: 640, height: 360 },
  })
  assert.equal(vnode.props['custom_minimum_size:x'], 640)
  assert.equal(vnode.props['custom_minimum_size:y'], 360)
})

test('maps display:none to visible=false', async () => {
  const { vnode } = await renderVideo({
    src: './v.ogv',
    style: { display: 'none' },
  })
  assert.equal(vnode.props.visible, false)
})

test('maps opacity to modulate alpha', async () => {
  const { vnode } = await renderVideo({
    src: './v.ogv',
    style: { opacity: 0.5 },
  })
  assert.equal(vnode.props.modulate, '1,1,1,0.5')
})

test('forwards Godot finished signal as @ended event', async () => {
  const { vnode, emitted } = await renderVideo({ src: './v.ogv' })
  // Simulate the Godot finished signal
  vnode.props.onFinished()
  assert.equal(emitted.length, 1)
  assert.equal(emitted[0].event, 'ended')
})

test('handles res:// paths as passthrough', async () => {
  const { vnode } = await renderVideo({ src: 'res://videos/intro.ogv' })
  assert.ok(vnode.props.stream != null)
})

test('handles pixel string values for width/height', async () => {
  const { vnode } = await renderVideo({
    src: './v.ogv',
    style: { width: '320px', height: '240px' },
  })
  assert.equal(vnode.props['custom_minimum_size:x'], 320)
  assert.equal(vnode.props['custom_minimum_size:y'], 240)
})

// -----------------------------------------------------------------------
// Data-URI, Blob, and Remote source tests
// -----------------------------------------------------------------------

test('loads video from a data URI via temp file', async () => {
  // A minimal base64 data URI (content is irrelevant for the mock).
  const dataUri = 'data:video/ogg;base64,T2dnUw=='
  const { vnode } = await renderVideo({ src: dataUri })
  assert.ok(vnode.props.stream != null)
  assert.equal(vnode.props.stream.__kind, 'theora')
  assert.ok(vnode.props.stream.file.includes('vue-godot-video'))
  assert.ok(vnode.props.stream.file.endsWith('.ogv'))
})

test('loads video from a remote URL', async () => {
  const { vnode } = await renderVideo({ src: 'https://example.com/clip.ogv' })
  assert.ok(vnode.props.stream != null)
  assert.equal(vnode.props.stream.__kind, 'theora')
  assert.ok(vnode.props.stream.file.endsWith('.ogv'))
})

test('loads video from a blob URL', async () => {
  // We need to use the mock's createObjectURL. Import the browser mock.
  const browser = await import('@vue-godot/browser')
  const fakeBlob = {
    type: 'video/ogg',
    async arrayBuffer() {
      return new ArrayBuffer(8)
    },
  }
  const blobUrl = browser.createObjectURL(fakeBlob)

  const { vnode } = await renderVideo({ src: blobUrl })
  assert.ok(vnode.props.stream != null)
  assert.equal(vnode.props.stream.__kind, 'theora')
  assert.ok(vnode.props.stream.file.endsWith('.ogv'))
})
