import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-loader.mjs', import.meta.url).href)

const {
  GodotBlob,
  GodotFile,
  GodotFileReader,
  GodotFormData,
  GodotNavigator,
  GodotRequest,
  GodotStorage,
  GodotURL,
  GodotURLSearchParams,
  installBrowserAPIs,
  installPolyfill,
} = await import('../dist/index.js')

const patchedGlobals = [
  'Blob',
  'File',
  'FileReader',
  'FormData',
  'URL',
  'URLSearchParams',
  'Storage',
  'localStorage',
  'sessionStorage',
  'Navigator',
  'navigator',
  'fetch',
  'Request',
  'TextDecoder',
  'TextEncoder',
  'setTimeout',
  'clearTimeout',
  'setInterval',
  'clearInterval',
  'queueMicrotask',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'performance',
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
    assert.equal(globalThis.URLSearchParams, GodotURLSearchParams)
    assert.equal(globalThis.Storage, GodotStorage)
    assert.ok(globalThis.localStorage instanceof GodotStorage)
    assert.ok(globalThis.sessionStorage instanceof GodotStorage)
    assert.equal(globalThis.Navigator, GodotNavigator)
    assert.ok(globalThis.navigator instanceof GodotNavigator)
    assert.equal(typeof globalThis.navigator.onLine, 'boolean')
    assert.equal(typeof globalThis.URL.createObjectURL, 'function')
    assert.equal(typeof globalThis.URL.revokeObjectURL, 'function')
    assert.equal(globalThis.Blob, GodotBlob)
    assert.equal(globalThis.File, GodotFile)
    assert.equal(globalThis.FileReader, GodotFileReader)
    assert.equal(globalThis.FormData, GodotFormData)
    assert.equal(globalThis.Request, GodotRequest)
    assert.equal(
      new globalThis.TextDecoder().decode(new Uint8Array([111, 107])),
      'ok',
    )
    assert.deepEqual([...new globalThis.TextEncoder().encode('ok')], [111, 107])
    assert.equal(typeof globalThis.fetch, 'function')
    assert.equal(typeof globalThis.setTimeout, 'function')
    assert.equal(typeof globalThis.clearTimeout, 'function')
    assert.equal(typeof globalThis.setInterval, 'function')
    assert.equal(typeof globalThis.clearInterval, 'function')
    assert.equal(typeof globalThis.queueMicrotask, 'function')
    assert.equal(typeof globalThis.requestAnimationFrame, 'function')
    assert.equal(typeof globalThis.cancelAnimationFrame, 'function')
    assert.equal(typeof globalThis.performance.now, 'function')
    assert.equal(typeof globalThis.performance.mark, 'function')
    assert.equal(typeof globalThis.history.pushState, 'function')
    assert.equal(String(globalThis.location), 'http://localhost/')
    assert.equal(typeof globalThis.addEventListener, 'function')
    assert.equal(typeof globalThis.dispatchEvent, 'function')
  })
})

test('installPolyfill installs named missing globals only', async () => {
  await withClearedGlobals(
    [
      'Blob',
      'File',
      'FormData',
      'Request',
      'URL',
      'URLSearchParams',
      'Storage',
      'localStorage',
      'sessionStorage',
      'Navigator',
      'navigator',
      'queueMicrotask',
    ],
    async () => {
      installPolyfill(
        'Blob',
        'File',
        'FormData',
        'Request',
        'Storage',
        'localStorage',
        'sessionStorage',
        'Navigator',
        'navigator',
        'URLSearchParams',
        'queueMicrotask',
      )

      assert.equal(globalThis.Blob, GodotBlob)
      assert.equal(globalThis.File, GodotFile)
      assert.equal(globalThis.FormData, GodotFormData)
      assert.equal(globalThis.Request, GodotRequest)
      assert.equal(globalThis.Storage, GodotStorage)
      assert.ok(globalThis.localStorage instanceof GodotStorage)
      assert.ok(globalThis.sessionStorage instanceof GodotStorage)
      assert.equal(globalThis.Navigator, GodotNavigator)
      assert.ok(globalThis.navigator instanceof GodotNavigator)
      assert.equal(globalThis.URLSearchParams, GodotURLSearchParams)
      assert.equal(typeof globalThis.queueMicrotask, 'function')
      assert.equal(globalThis.URL, undefined)
    },
  )
})
