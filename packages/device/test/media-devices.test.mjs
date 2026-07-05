import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DeviceCapabilityError,
  createMediaDevicesAdapter,
  normalizeMediaDeviceStream,
  normalizeMediaDeviceTrack,
  normalizeMediaDevicesPluginError,
} from '../dist/index.js'

test('createMediaDevicesAdapter wraps native camera streams', async () => {
  let stopped = false
  const adapter = createMediaDevicesAdapter({
    pluginName: 'mock-android-camera',
    hasPermission() {
      return true
    },
    getUserMedia(constraints) {
      assert.deepEqual(constraints, { video: true })
      return {
        id: 'camera-stream',
        tracks: [
          {
            id: 'video-1',
            kind: 'video',
            label: 'Back Camera',
            stop() {
              stopped = true
            },
          },
        ],
      }
    },
  })

  assert.deepEqual(await adapter.getStatus(), {
    capability: 'media-devices',
    state: 'supported',
    pluginName: 'mock-android-camera',
  })

  const stream = await adapter.getUserMedia({ video: true })
  const tracks = stream.getTracks()
  tracks[0].stop()

  assert.equal(stream.id, 'camera-stream')
  assert.equal(tracks.length, 1)
  assert.equal(tracks[0].id, 'video-1')
  assert.equal(tracks[0].kind, 'video')
  assert.equal(tracks[0].label, 'Back Camera')
  assert.equal(stopped, true)
})

test('media devices adapter reports platform, export, plugin, and permission states', async () => {
  const unsupported = createMediaDevicesAdapter(
    {
      getUserMedia() {
        throw new Error('unused')
      },
    },
    {
      pluginName: 'ios-camera',
      isPlatformSupported() {
        return false
      },
    },
  )
  assert.equal((await unsupported.getStatus()).state, 'unsupported-platform')

  const misconfigured = createMediaDevicesAdapter(
    {
      getUserMedia() {
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

  const missing = createMediaDevicesAdapter({
    isAvailable() {
      return false
    },
    getUserMedia() {
      throw new Error('unused')
    },
  })
  assert.equal((await missing.getStatus()).state, 'missing-plugin')

  const denied = createMediaDevicesAdapter({
    hasPermission() {
      return false
    },
    getUserMedia() {
      throw new Error('unused')
    },
  })
  assert.equal((await denied.getStatus()).state, 'permission-denied')
  await assert.rejects(
    denied.getUserMedia({ video: true }),
    (error) =>
      error instanceof DeviceCapabilityError &&
      error.code === 'permission-denied' &&
      error.capability === 'media-devices',
  )
})

test('media devices helpers normalize getTracks streams and plugin errors', () => {
  const stream = normalizeMediaDeviceStream({
    getTracks() {
      return [
        {
          id: 'audio-1',
          kind: 'audio',
        },
      ]
    },
  })
  const tracks = stream.getTracks()

  assert.match(stream.id, /^native-media-stream-/)
  assert.equal(tracks.length, 1)
  assert.equal(tracks[0].kind, 'audio')

  const typed = new DeviceCapabilityError('missing-plugin', 'media-devices')
  assert.equal(normalizeMediaDevicesPluginError(typed), typed)
  assert.equal(
    normalizeMediaDevicesPluginError(new Error('native failed')).message,
    'native failed',
  )
})

test('media devices helpers reject invalid track kinds', () => {
  assert.throws(
    () =>
      normalizeMediaDeviceTrack({
        id: 'bad-track',
        kind: 'screen',
      }),
    /invalid track kind/,
  )
})
