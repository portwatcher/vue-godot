import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-loader.mjs', import.meta.url).href)

const { GodotBlob, GodotURL, installBrowserAPIs, installPolyfill } =
  await import('../dist/index.js')

const patchedGlobals = [
  'Blob',
  'URL',
  'fetch',
  'history',
  'location',
  'PopStateEvent',
  'addEventListener',
  'removeEventListener',
  'dispatchEvent',
]

async function withClearedGlobals(names, callback) {
  const descriptors = new Map()
  for (const name of names) {
    descriptors.set(name, Object.getOwnPropertyDescriptor(globalThis, name))
    Object.defineProperty(globalThis, name, {
      value: undefined,
      writable: true,
      configurable: true,
    })
  }

  try {
    await callback()
  } finally {
    for (const name of names) {
      const descriptor = descriptors.get(name)
      if (descriptor) {
        Object.defineProperty(globalThis, name, descriptor)
      } else {
        delete globalThis[name]
      }
    }
  }
}

test('installBrowserAPIs installs missing browser globals', async () => {
  await withClearedGlobals(patchedGlobals, async () => {
    installBrowserAPIs()

    assert.equal(globalThis.URL, GodotURL)
    assert.equal(typeof globalThis.URL.createObjectURL, 'function')
    assert.equal(typeof globalThis.URL.revokeObjectURL, 'function')
    assert.equal(globalThis.Blob, GodotBlob)
    assert.equal(typeof globalThis.fetch, 'function')
    assert.equal(typeof globalThis.history.pushState, 'function')
    assert.equal(String(globalThis.location), 'http://localhost/')
    assert.equal(typeof globalThis.addEventListener, 'function')
    assert.equal(typeof globalThis.dispatchEvent, 'function')
  })
})

test('installPolyfill installs named missing globals only', async () => {
  await withClearedGlobals(['Blob', 'URL'], async () => {
    installPolyfill('Blob')

    assert.equal(globalThis.Blob, GodotBlob)
    assert.equal(globalThis.URL, undefined)
  })
})
