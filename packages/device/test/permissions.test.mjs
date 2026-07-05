import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-loader.mjs', import.meta.url).href)

const {
  AndroidPermissions,
  isPermissionGranted,
  listGrantedPermissions,
  onPermissionResult,
  requestDangerousPermissions,
  requestPermission,
  revokeGrantedPermissions,
} = await import('../dist/permissions.js')

function resetPermissions(state = {}) {
  globalThis.__vueGodotDeviceMockPermissions = {
    granted: [],
    requested: [],
    requestAllCalls: 0,
    revoked: false,
    requestResults: new Map(),
    ...state,
  }
  globalThis.__vueGodotDeviceMockMainLoop = undefined
}

test('listGrantedPermissions normalizes Godot permission names', () => {
  resetPermissions({
    granted: [AndroidPermissions.Camera, AndroidPermissions.RecordAudio],
  })

  assert.deepEqual(listGrantedPermissions(), [
    'android.permission.CAMERA',
    'android.permission.RECORD_AUDIO',
  ])
  assert.equal(isPermissionGranted(AndroidPermissions.Camera), true)
  assert.equal(isPermissionGranted(AndroidPermissions.PostNotifications), false)
})

test('requestPermission delegates to OS.request_permission', () => {
  resetPermissions({
    requestResults: new Map([[AndroidPermissions.PostNotifications, true]]),
  })

  assert.equal(requestPermission(AndroidPermissions.PostNotifications), true)
  assert.deepEqual(globalThis.__vueGodotDeviceMockPermissions.requested, [
    AndroidPermissions.PostNotifications,
  ])
})

test('requestPermission reports already granted permissions as granted', () => {
  resetPermissions({
    granted: [AndroidPermissions.RecordAudio],
  })

  assert.equal(requestPermission(AndroidPermissions.RecordAudio), true)
})

test('requestDangerousPermissions delegates to OS.request_permissions', () => {
  resetPermissions({
    requestAllResult: true,
  })

  assert.equal(requestDangerousPermissions(), true)
  assert.equal(globalThis.__vueGodotDeviceMockPermissions.requestAllCalls, 1)
})

test('revokeGrantedPermissions clears Godot grants', () => {
  resetPermissions({
    granted: [AndroidPermissions.Camera],
  })

  revokeGrantedPermissions()

  assert.deepEqual(listGrantedPermissions(), [])
  assert.equal(globalThis.__vueGodotDeviceMockPermissions.revoked, true)
})

test('onPermissionResult subscribes to permission result events', () => {
  resetPermissions()
  const results = []
  const subscription = onPermissionResult((result) => {
    results.push(result)
  })
  const signal =
    globalThis.__vueGodotDeviceMockMainLoop.on_request_permissions_result

  signal.emit(AndroidPermissions.Camera, true)
  subscription.disconnect()
  signal.emit(AndroidPermissions.RecordAudio, false)
  subscription.disconnect()

  assert.deepEqual(results, [
    { name: AndroidPermissions.Camera, granted: true },
  ])
  assert.equal(signal.connectCalls.length, 1)
  assert.equal(signal.disconnectCalls.length, 1)
})
