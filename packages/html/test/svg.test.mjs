import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'
import { renderWhenAsyncPropSettles } from './render-helpers.mjs'

// Register a loader that intercepts 'godot' and '@vue-godot/browser'
// bare specifiers with mocks.
register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Svg } = await import('../dist/components/Svg.js')

/**
 * Render the Svg component. Because setup() uses an async watcher
 * internally, we need to flush microtasks before calling the render
 * function so `texture.value` is populated.
 */
async function renderSvg(props = {}) {
  const resultOrPromise = Svg.setup(props, {
    emit: () => {},
    slots: {},
  })
  const render =
    typeof resultOrPromise?.then === 'function'
      ? await resultOrPromise
      : resultOrPromise

  return renderWhenAsyncPropSettles(render, 'texture', props.src != null)
}

// -----------------------------------------------------------------------
// Basic rendering
// -----------------------------------------------------------------------

test('renders a TextureRect node', async () => {
  const vnode = await renderSvg({ src: './icon.svg' })
  assert.equal(vnode.type, 'TextureRect')
})

test('resolves src to a Godot resource path and loads texture', async () => {
  const vnode = await renderSvg({ src: './assets/logo.svg' })
  assert.ok(vnode.props.texture != null)
  assert.equal(vnode.props.texture.__mock, true)
  assert.equal(vnode.props.texture.__kind, 'local')
})

test('does not set texture when src is undefined', async () => {
  const vnode = await renderSvg({})
  assert.equal(vnode.props.texture, undefined)
})

test('handles res:// paths as passthrough', async () => {
  const vnode = await renderSvg({ src: 'res://icons/star.svg' })
  assert.ok(vnode.props.texture != null)
  assert.equal(vnode.props.texture.__kind, 'local')
  assert.equal(vnode.props.texture.path, 'res://icons/star.svg')
})

test('handles user:// paths as passthrough', async () => {
  const vnode = await renderSvg({ src: 'user://icons/custom.svg' })
  assert.ok(vnode.props.texture != null)
  assert.equal(vnode.props.texture.__kind, 'local')
  assert.equal(vnode.props.texture.path, 'user://icons/custom.svg')
})

// -----------------------------------------------------------------------
// Style mapping
// -----------------------------------------------------------------------

test('maps width and height from style to custom_minimum_size', async () => {
  const vnode = await renderSvg({
    src: './icon.svg',
    style: { width: 48, height: 48 },
  })
  assert.equal(vnode.props['custom_minimum_size:x'], 48)
  assert.equal(vnode.props['custom_minimum_size:y'], 48)
})

test('handles pixel string values for width/height', async () => {
  const vnode = await renderSvg({
    src: './icon.svg',
    style: { width: '64px', height: '64px' },
  })
  assert.equal(vnode.props['custom_minimum_size:x'], 64)
  assert.equal(vnode.props['custom_minimum_size:y'], 64)
})

test('maps percent width and height to anchors', async () => {
  const vnode = await renderSvg({
    src: './icon.svg',
    style: { width: '50%', height: '25%' },
  })

  assert.equal(vnode.props.anchor_left, 0)
  assert.equal(vnode.props.anchor_right, 0.5)
  assert.equal(vnode.props.anchor_top, 0)
  assert.equal(vnode.props.anchor_bottom, 0.25)
  assert.equal(vnode.props.expand_mode, 1)
  assert.equal(vnode.props.stretch_mode, 5)
})

test('maps display:none to visible=false', async () => {
  const vnode = await renderSvg({
    src: './icon.svg',
    style: { display: 'none' },
  })
  assert.equal(vnode.props.visible, false)
})

test('maps objectFit contain to expand_mode + stretch_mode', async () => {
  const vnode = await renderSvg({
    src: './icon.svg',
    style: { objectFit: 'contain', width: 100, height: 100 },
  })
  // EXPAND_IGNORE_SIZE = 1, STRETCH_KEEP_ASPECT_CENTERED = 5
  assert.equal(vnode.props.expand_mode, 1)
  assert.equal(vnode.props.stretch_mode, 5)
})

test('maps objectFit cover to stretch_mode KEEP_ASPECT_COVERED', async () => {
  const vnode = await renderSvg({
    src: './icon.svg',
    style: { objectFit: 'cover', width: 100, height: 100 },
  })
  // EXPAND_IGNORE_SIZE = 1, STRETCH_KEEP_ASPECT_COVERED = 6
  assert.equal(vnode.props.expand_mode, 1)
  assert.equal(vnode.props.stretch_mode, 6)
})

test('defaults to EXPAND_IGNORE_SIZE + KEEP_ASPECT_CENTERED when size set without objectFit', async () => {
  const vnode = await renderSvg({
    src: './icon.svg',
    style: { width: 32, height: 32 },
  })
  assert.equal(vnode.props.expand_mode, 1)
  assert.equal(vnode.props.stretch_mode, 5)
})

// -----------------------------------------------------------------------
// Alt / tooltip
// -----------------------------------------------------------------------

test('maps alt prop to tooltip_text', async () => {
  const vnode = await renderSvg({
    src: './icon.svg',
    alt: 'Application icon',
  })
  assert.equal(vnode.props.tooltip_text, 'Application icon')
})

test('combines alt fallback label with accessibility hints', async () => {
  const vnode = await renderSvg({
    src: './icon.svg',
    alt: 'Application icon',
    accessibilityHint: 'Vector asset',
  })
  assert.equal(vnode.props.tooltip_text, 'Application icon\nVector asset')
})

test('does not set tooltip_text when alt is absent', async () => {
  const vnode = await renderSvg({ src: './icon.svg' })
  assert.equal(vnode.props.tooltip_text, undefined)
})

// -----------------------------------------------------------------------
// Data-URI source
// -----------------------------------------------------------------------

test('loads SVG from a data URI (base64)', async () => {
  const svgContent = '<svg xmlns="http://www.w3.org/2000/svg"></svg>'
  const b64 = globalThis.btoa(svgContent)
  const dataUri = `data:image/svg+xml;base64,${b64}`

  const vnode = await renderSvg({ src: dataUri })
  assert.ok(vnode.props.texture != null)
  assert.equal(vnode.props.texture.__kind, 'buffer')
})

test('loads SVG from a percent-encoded data URI', async () => {
  const svgContent = '<svg xmlns="http://www.w3.org/2000/svg"></svg>'
  const encoded = encodeURIComponent(svgContent)
  const dataUri = `data:image/svg+xml,${encoded}`

  const vnode = await renderSvg({ src: dataUri })
  assert.ok(vnode.props.texture != null)
  assert.equal(vnode.props.texture.__kind, 'buffer')
})

// -----------------------------------------------------------------------
// Remote source
// -----------------------------------------------------------------------

test('loads SVG from a remote URL', async () => {
  const vnode = await renderSvg({ src: 'https://example.com/icon.svg' })
  assert.ok(vnode.props.texture != null)
  assert.equal(vnode.props.texture.__kind, 'buffer')
})

// -----------------------------------------------------------------------
// Blob source
// -----------------------------------------------------------------------

test('loads SVG from a blob URL', async () => {
  const browser = await import('@vue-godot/browser')
  const fakeBlob = {
    type: 'image/svg+xml',
    async arrayBuffer() {
      const svg = '<svg xmlns="http://www.w3.org/2000/svg"></svg>'
      return new TextEncoder().encode(svg).buffer
    },
  }
  const blobUrl = browser.createObjectURL(fakeBlob)

  const vnode = await renderSvg({ src: blobUrl })
  assert.ok(vnode.props.texture != null)
  assert.equal(vnode.props.texture.__kind, 'buffer')
})

// -----------------------------------------------------------------------
// Scale prop
// -----------------------------------------------------------------------

test('passes scale to SVG rasterisation (data URI)', async () => {
  const svgContent = '<svg xmlns="http://www.w3.org/2000/svg"></svg>'
  const b64 = globalThis.btoa(svgContent)
  const dataUri = `data:image/svg+xml;base64,${b64}`

  const vnode = await renderSvg({ src: dataUri, scale: 2 })
  assert.ok(vnode.props.texture != null)
  assert.equal(vnode.props.texture._scale, 2)
})

test('defaults scale to 1 when not specified', async () => {
  const svgContent = '<svg xmlns="http://www.w3.org/2000/svg"></svg>'
  const b64 = globalThis.btoa(svgContent)
  const dataUri = `data:image/svg+xml;base64,${b64}`

  const vnode = await renderSvg({ src: dataUri })
  assert.ok(vnode.props.texture != null)
  assert.equal(vnode.props.texture._scale, 1)
})

test('falls back to scale 1 for invalid scale values', async () => {
  const svgContent = '<svg xmlns="http://www.w3.org/2000/svg"></svg>'
  const b64 = globalThis.btoa(svgContent)
  const dataUri = `data:image/svg+xml;base64,${b64}`

  const vnode = await renderSvg({ src: dataUri, scale: -2 })
  assert.ok(vnode.props.texture != null)
  assert.equal(vnode.props.texture._scale, 1)
})
