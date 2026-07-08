import assert from 'node:assert/strict'
import test from 'node:test'

const {
  DeviceCapabilityError,
  deviceCapabilities,
  isSecureStorageAdapter,
  registerDeviceCapability,
} = await import('../dist/index.js')

const { getSecureItem, removeSecureItem, setSecureItem } = await import(
  '../dist/secureStorage.js'
)

test('secure storage helpers delegate to a registered adapter', async () => {
  deviceCapabilities.clear()
  const values = new Map()
  const adapter = {
    capability: 'secure-storage',
    pluginName: 'mock-keychain',
    isSupported() {
      return true
    },
    getItem(key) {
      return values.get(key) ?? null
    },
    setItem(key, value) {
      values.set(key, value)
    },
    removeItem(key) {
      values.delete(key)
    },
  }

  assert.equal(isSecureStorageAdapter(adapter), true)
  const unregister = registerDeviceCapability(adapter)

  try {
    assert.equal(await getSecureItem('session'), null)
    await setSecureItem('session', 'secret-token')
    assert.equal(await getSecureItem('session'), 'secret-token')
    await removeSecureItem('session')
    assert.equal(await getSecureItem('session'), null)
  } finally {
    unregister()
    deviceCapabilities.clear()
  }
})

test('secure storage helpers reject missing adapters with typed errors', async () => {
  deviceCapabilities.clear()

  await assert.rejects(
    getSecureItem('session'),
    (error) =>
      error instanceof DeviceCapabilityError &&
      error.code === 'missing-plugin' &&
      error.capability === 'secure-storage',
  )
})

test('secure storage helpers require supported capability status', async () => {
  deviceCapabilities.clear()
  const unregister = registerDeviceCapability({
    capability: 'secure-storage',
    pluginName: 'mock-keychain',
    getStatus() {
      return {
        capability: 'secure-storage',
        state: 'export-misconfiguration',
        message: 'Keychain entitlement missing.',
      }
    },
    getItem() {
      return null
    },
    setItem() {
      return undefined
    },
    removeItem() {
      return undefined
    },
  })

  try {
    await assert.rejects(
      setSecureItem('session', 'secret-token'),
      (error) =>
        error instanceof DeviceCapabilityError &&
        error.code === 'export-misconfiguration' &&
        error.capability === 'secure-storage' &&
        error.message === 'Keychain entitlement missing.',
    )
  } finally {
    unregister()
    deviceCapabilities.clear()
  }
})
