import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

// Register a loader that intercepts 'godot' and '@vue-godot/browser'
// bare specifiers with mocks.
register(new URL('./audio-godot-loader.mjs', import.meta.url).href)

const { Audio } = await import('../dist/components/Audio.js')

/**
 * Render the Audio component. Because setup() uses an async watcher
 * internally (`await loadAudioStream()`), we need to flush microtasks
 * before calling the render function so `stream.value` is populated.
 */
async function renderAudio(props = {}) {
  const emitted = []
  const resultOrPromise = Audio.setup(props, {
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

test('renders an AudioStreamPlayer node', async () => {
  const { vnode } = await renderAudio({ src: './music.ogg' })
  assert.equal(vnode.type, 'AudioStreamPlayer')
})

test('resolves src to a Godot resource path and loads stream', async () => {
  const { vnode } = await renderAudio({ src: './audio/music.ogg' })
  assert.ok(vnode.props.stream != null)
  assert.equal(vnode.props.stream.__mock, true)
  assert.equal(vnode.props.stream.__kind, 'local')
})

test('does not set stream when src is undefined', async () => {
  const { vnode } = await renderAudio({})
  assert.equal(vnode.props.stream, undefined)
})

test('passes autoplay prop', async () => {
  const { vnode } = await renderAudio({ src: './a.ogg', autoplay: true })
  assert.equal(vnode.props.autoplay, true)
})

test('does not set autoplay when false', async () => {
  const { vnode } = await renderAudio({ src: './a.ogg', autoplay: false })
  assert.equal(vnode.props.autoplay, undefined)
})

test('mutes audio when muted is true', async () => {
  const { vnode } = await renderAudio({
    src: './a.ogg',
    muted: true,
    volume: 1,
  })
  assert.equal(vnode.props.volume_db, -80)
})

test('maps linear volume 1 to 0 dB', async () => {
  const { vnode } = await renderAudio({ src: './a.ogg', volume: 1 })
  assert.equal(vnode.props.volume_db, 0)
})

test('maps linear volume 0 to -80 dB', async () => {
  const { vnode } = await renderAudio({ src: './a.ogg', volume: 0 })
  assert.equal(vnode.props.volume_db, -80)
})

test('maps linear volume 0.5 to approximately -6 dB', async () => {
  const { vnode } = await renderAudio({ src: './a.ogg', volume: 0.5 })
  // 20 * log10(0.5) ≈ -6.0206
  assert.ok(vnode.props.volume_db < -5.9)
  assert.ok(vnode.props.volume_db > -6.1)
})

test('forwards Godot finished signal as @ended event', async () => {
  const { vnode, emitted } = await renderAudio({ src: './a.ogg' })
  // Simulate the Godot finished signal
  vnode.props.onFinished()
  assert.equal(emitted.length, 1)
  assert.equal(emitted[0].event, 'ended')
})

test('handles res:// paths as passthrough', async () => {
  const { vnode } = await renderAudio({ src: 'res://audio/music.ogg' })
  assert.ok(vnode.props.stream != null)
})

// -----------------------------------------------------------------------
// Loop prop tests
// -----------------------------------------------------------------------

test('sets loop=true on stream resources with a boolean loop property', async () => {
  const { vnode } = await renderAudio({ src: './a.ogg', loop: true })
  // The mock returns a stream with `loop: false` initially;
  // the component should set it to true.
  assert.equal(vnode.props.stream.loop, true)
})

test('sets loop=false on stream resources by default', async () => {
  const { vnode } = await renderAudio({ src: './a.ogg' })
  assert.equal(vnode.props.stream.loop, false)
})

// -----------------------------------------------------------------------
// Data-URI, Blob, and Remote source tests
// -----------------------------------------------------------------------

test('loads audio from a data URI (ogg)', async () => {
  const dataUri = 'data:audio/ogg;base64,T2dnUw=='
  const { vnode } = await renderAudio({ src: dataUri })
  assert.ok(vnode.props.stream != null)
  assert.equal(vnode.props.stream.__kind, 'ogg')
})

test('loads audio from a data URI (mp3)', async () => {
  const dataUri = 'data:audio/mpeg;base64,SUQz'
  const { vnode } = await renderAudio({ src: dataUri })
  assert.ok(vnode.props.stream != null)
  assert.equal(vnode.props.stream.__kind, 'mp3')
})

test('loads audio from a remote URL (ogg)', async () => {
  const { vnode } = await renderAudio({
    src: 'https://example.com/music.ogg',
  })
  assert.ok(vnode.props.stream != null)
  assert.equal(vnode.props.stream.__kind, 'ogg')
})

test('loads audio from a remote URL (mp3)', async () => {
  const { vnode } = await renderAudio({
    src: 'https://example.com/track.mp3',
  })
  assert.ok(vnode.props.stream != null)
  assert.equal(vnode.props.stream.__kind, 'mp3')
})

test('loads audio from a blob URL', async () => {
  const browser = await import('@vue-godot/browser')
  const fakeBlob = {
    type: 'audio/ogg',
    async arrayBuffer() {
      return new ArrayBuffer(8)
    },
  }
  const blobUrl = browser.createObjectURL(fakeBlob)

  const { vnode } = await renderAudio({ src: blobUrl })
  assert.ok(vnode.props.stream != null)
  assert.equal(vnode.props.stream.__kind, 'ogg')
})

test('loads WAV audio from a data URI and uses loop_mode for looping', async () => {
  const dataUri = 'data:audio/wav;base64,UklGRg=='
  const { vnode } = await renderAudio({ src: dataUri, loop: true })
  assert.ok(vnode.props.stream != null)
  assert.equal(vnode.props.stream.__kind, 'wav')
  // WAV streams use loop_mode (1 = forward loop)
  assert.equal(vnode.props.stream.loop_mode, 1)
})

test('WAV stream loop_mode is 0 when loop is false', async () => {
  const dataUri = 'data:audio/wav;base64,UklGRg=='
  const { vnode } = await renderAudio({ src: dataUri, loop: false })
  assert.equal(vnode.props.stream.loop_mode, 0)
})
