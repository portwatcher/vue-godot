import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DeviceCapabilityError,
  createGeolocationAdapter,
  normalizeGeolocationPluginError,
  normalizeGeolocationPosition,
} from '../dist/index.js'

test('createGeolocationAdapter wraps native plugin positions', async () => {
  const adapter = createGeolocationAdapter({
    pluginName: 'mock-ios-location',
    hasPermission() {
      return true
    },
    getCurrentPosition(options) {
      assert.equal(options.enableHighAccuracy, true)
      return {
        latitude: 35.681236,
        longitude: 139.767125,
        accuracy: 8,
        altitude: null,
        altitudeAccuracy: null,
        heading: 180,
        speed: 0,
        timestamp: 1234,
      }
    },
  })

  assert.deepEqual(await adapter.getStatus(), {
    capability: 'geolocation',
    state: 'supported',
    pluginName: 'mock-ios-location',
  })

  const position = await adapter.getCurrentPosition({
    enableHighAccuracy: true,
  })

  assert.deepEqual(position, {
    coords: {
      latitude: 35.681236,
      longitude: 139.767125,
      accuracy: 8,
      altitude: null,
      altitudeAccuracy: null,
      heading: 180,
      speed: 0,
    },
    timestamp: 1234,
  })
})

test('geolocation adapter reports platform, export, plugin, and permission states', async () => {
  const unsupported = createGeolocationAdapter(
    {
      getCurrentPosition() {
        throw new Error('unused')
      },
    },
    {
      pluginName: 'android-location',
      isPlatformSupported() {
        return false
      },
    },
  )
  assert.equal((await unsupported.getStatus()).state, 'unsupported-platform')

  const misconfigured = createGeolocationAdapter(
    {
      getCurrentPosition() {
        throw new Error('unused')
      },
    },
    {
      isExportConfigured() {
        return false
      },
    },
  )
  assert.equal((await misconfigured.getStatus()).state, 'export-misconfiguration')

  const missing = createGeolocationAdapter({
    isAvailable() {
      return false
    },
    getCurrentPosition() {
      throw new Error('unused')
    },
  })
  assert.equal((await missing.getStatus()).state, 'missing-plugin')

  const denied = createGeolocationAdapter({
    hasPermission() {
      return false
    },
    getCurrentPosition() {
      throw new Error('unused')
    },
  })
  assert.equal((await denied.getStatus()).state, 'permission-denied')
  await assert.rejects(
    denied.getCurrentPosition(),
    (error) =>
      error instanceof DeviceCapabilityError &&
      error.code === 'permission-denied' &&
      error.capability === 'geolocation',
  )
})

test('geolocation adapter bridges watchPosition and clearWatch', () => {
  let clearedWatchId = 0
  const adapter = createGeolocationAdapter({
    getCurrentPosition() {
      throw new Error('unused')
    },
    watchPosition(onPosition) {
      onPosition({
        latitude: 1,
        longitude: 2,
        accuracy: 3,
        timestamp: 4,
      })
      return 42
    },
    clearWatch(watchId) {
      clearedWatchId = watchId
    },
  })

  let watchedLatitude = 0
  const watchId = adapter.watchPosition((position) => {
    watchedLatitude = position.coords.latitude
  })
  adapter.clearWatch(watchId)

  assert.equal(watchId, 42)
  assert.equal(watchedLatitude, 1)
  assert.equal(clearedWatchId, 42)
})

test('geolocation helpers normalize plugin errors and invalid positions', () => {
  const typed = new DeviceCapabilityError('missing-plugin', 'geolocation')

  assert.equal(normalizeGeolocationPluginError(typed), typed)
  assert.equal(
    normalizeGeolocationPluginError(new Error('native failed')).message,
    'native failed',
  )
  assert.throws(
    () =>
      normalizeGeolocationPosition({
        latitude: Number.NaN,
        longitude: 2,
        accuracy: 3,
      }),
    /invalid latitude/,
  )
})
