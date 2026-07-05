import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-loader.mjs', import.meta.url).href)

const {
  hasClipboardImage,
  hasClipboardText,
  isClipboardSupported,
  isPrimaryClipboardSupported,
  readClipboardImage,
  readClipboardText,
  readPrimaryClipboardText,
  writeClipboardText,
  writePrimaryClipboardText,
} = await import('../dist/clipboard.js')

function resetClipboard(state = {}) {
  globalThis.__vueGodotDeviceMockDisplayServer = {
    clipboard: '',
    clipboardImage: null,
    features: new Set([5, 18]),
    primaryClipboard: '',
    throwOnClipboard: false,
    ...state,
  }
}

test('clipboard helpers read and write text through DisplayServer', () => {
  resetClipboard()

  assert.equal(isClipboardSupported(), true)
  assert.equal(hasClipboardText(), false)
  assert.equal(writeClipboardText('hello clipboard'), true)
  assert.equal(hasClipboardText(), true)
  assert.equal(readClipboardText(), 'hello clipboard')
})

test('clipboard helpers report unsupported text clipboard access', () => {
  resetClipboard({
    features: new Set(),
  })

  assert.equal(isClipboardSupported(), false)
  assert.equal(writeClipboardText('ignored'), false)
  assert.equal(readClipboardText(), null)
  assert.equal(hasClipboardText(), false)
})

test('clipboard helpers return null or false when DisplayServer refuses access', () => {
  resetClipboard({
    clipboard: 'secret',
    throwOnClipboard: true,
  })

  assert.equal(writeClipboardText('ignored'), false)
  assert.equal(readClipboardText(), null)
})

test('clipboard helpers read image clipboard content where Godot exposes it', () => {
  const image = {
    __kind: 'image',
    label: 'mock-image',
  }
  resetClipboard({
    clipboardImage: image,
  })

  assert.equal(hasClipboardImage(), true)
  assert.equal(readClipboardImage(), image)
})

test('clipboard helpers report missing image clipboard content', () => {
  resetClipboard()

  assert.equal(hasClipboardImage(), false)
  assert.equal(readClipboardImage(), null)
})

test('primary clipboard helpers use the primary selection feature', () => {
  resetClipboard()

  assert.equal(isPrimaryClipboardSupported(), true)
  assert.equal(writePrimaryClipboardText('primary text'), true)
  assert.equal(readPrimaryClipboardText(), 'primary text')
})

test('primary clipboard helpers report unsupported primary selection', () => {
  resetClipboard({
    features: new Set([5]),
  })

  assert.equal(isPrimaryClipboardSupported(), false)
  assert.equal(writePrimaryClipboardText('ignored'), false)
  assert.equal(readPrimaryClipboardText(), null)
})
