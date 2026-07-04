import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DeviceCapabilityError,
  DeviceCapabilityRegistry,
  createDeviceCapabilityError,
  isSupported,
  deviceCapabilities,
  getCapabilityStatus,
  normalizeDeviceCapabilityError,
  registerDeviceCapability,
  requireCapability,
} from '../dist/index.js'

test('missing capabilities report false support and reject with a typed error', async () => {
  const registry = new DeviceCapabilityRegistry()

  assert.equal(await registry.isSupported('geolocation'), false)

  await assert.rejects(
    registry.requireCapability('geolocation'),
    (error) =>
      error instanceof DeviceCapabilityError &&
      error.code === 'missing-plugin' &&
      error.capability === 'geolocation',
  )
})

test('registered capability adapters can report support and unregister cleanly', async () => {
  const registry = new DeviceCapabilityRegistry()
  const adapter = {
    capability: 'geolocation',
    pluginName: 'mock-location',
    isSupported() {
      return true
    },
  }

  const unregister = registry.register(adapter)

  assert.equal(await registry.isSupported('geolocation'), true)
  assert.deepEqual(await registry.requireCapability('geolocation'), {
    capability: 'geolocation',
    state: 'supported',
    pluginName: 'mock-location',
  })

  unregister()

  assert.equal(await registry.isSupported('geolocation'), false)
})

test('capability status maps unsupported platforms to typed errors', async () => {
  const registry = new DeviceCapabilityRegistry()
  registry.register({
    capability: 'camera',
    isSupported() {
      return false
    },
  })

  const status = await registry.getStatus('camera')
  assert.deepEqual(status, {
    capability: 'camera',
    state: 'unsupported-platform',
  })

  await assert.rejects(
    registry.requireCapability('camera'),
    (error) =>
      error instanceof DeviceCapabilityError &&
      error.code === 'unsupported-platform' &&
      error.capability === 'camera',
  )
})

test('adapters can report permission and export errors predictably', async () => {
  const registry = new DeviceCapabilityRegistry()
  registry.register({
    capability: 'microphone',
    pluginName: 'mock-audio',
    getStatus() {
      return {
        capability: 'microphone',
        state: 'permission-denied',
        message: 'Microphone permission was denied.',
      }
    },
  })
  registry.register({
    capability: 'notifications',
    pluginName: 'mock-notifications',
    getStatus() {
      return {
        capability: 'notifications',
        state: 'export-misconfiguration',
        message: 'POST_NOTIFICATIONS is missing from the Android export.',
      }
    },
  })

  await assert.rejects(
    registry.requireCapability('microphone'),
    (error) =>
      error instanceof DeviceCapabilityError &&
      error.code === 'permission-denied' &&
      error.message === 'Microphone permission was denied.',
  )
  await assert.rejects(
    registry.requireCapability('notifications'),
    (error) =>
      error instanceof DeviceCapabilityError &&
      error.code === 'export-misconfiguration' &&
      error.message === 'POST_NOTIFICATIONS is missing from the Android export.',
  )
})

test('adapter exceptions normalize to capability statuses', async () => {
  const registry = new DeviceCapabilityRegistry()
  registry.register({
    capability: 'share',
    isSupported() {
      throw createDeviceCapabilityError('missing-plugin', 'share', {
        message: 'Share plugin missing.',
      })
    },
  })

  const status = await registry.getStatus('share')
  assert.deepEqual(status, {
    capability: 'share',
    state: 'missing-plugin',
    message: 'Share plugin missing.',
  })
})

test('global registry helpers use the shared device capability registry', async () => {
  deviceCapabilities.clear()
  const unregister = registerDeviceCapability({
    capability: 'haptics',
    isSupported() {
      return true
    },
  })

  try {
    assert.equal(await isSupported('haptics'), true)
    assert.equal((await getCapabilityStatus('haptics')).state, 'supported')
    assert.equal((await requireCapability('haptics')).capability, 'haptics')
  } finally {
    unregister()
    deviceCapabilities.clear()
  }
})

test('normalizeDeviceCapabilityError preserves typed errors and wraps unknown errors', () => {
  const typed = createDeviceCapabilityError('permission-denied', 'camera')
  assert.equal(normalizeDeviceCapabilityError('camera', typed), typed)

  const wrapped = normalizeDeviceCapabilityError('camera', new Error('no camera'))
  assert.equal(wrapped.code, 'unsupported-platform')
  assert.equal(wrapped.capability, 'camera')
  assert.equal(wrapped.message, 'no camera')
})
