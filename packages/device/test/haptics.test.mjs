import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-loader.mjs', import.meta.url).href)

const {
  isHandheldVibrationSupported,
  readJoypadVibration,
  startJoypadVibration,
  stopJoypadVibration,
  vibrateHandheld,
} = await import('../dist/haptics.js')

function resetHaptics(state = {}) {
  globalThis.__vueGodotDeviceMockInput = {
    accelerometer: { x: 0, y: 0, z: 0 },
    gravity: { x: 0, y: 0, z: 0 },
    gyroscope: { x: 0, y: 0, z: 0 },
    handheldVibrations: [],
    joypadVibrations: new Map(),
    magnetometer: { x: 0, y: 0, z: 0 },
    throwOnHandheldVibration: false,
    throwOnJoypadVibration: false,
    throwOnSensors: new Set(),
    ...state,
  }
}

test('vibrateHandheld delegates to Godot handheld vibration', () => {
  resetHaptics()

  assert.equal(isHandheldVibrationSupported(), true)
  assert.equal(vibrateHandheld(25, 0.5), true)

  assert.deepEqual(globalThis.__vueGodotDeviceMockInput.handheldVibrations, [
    { durationMs: 25, amplitude: 0.5 },
  ])
})

test('vibrateHandheld normalizes duration and amplitude', () => {
  resetHaptics()

  assert.equal(vibrateHandheld(-10, 5), true)
  assert.equal(vibrateHandheld(Number.NaN, -5), true)

  assert.deepEqual(globalThis.__vueGodotDeviceMockInput.handheldVibrations, [
    { durationMs: 0, amplitude: 1 },
    { durationMs: 500, amplitude: -1 },
  ])
})

test('vibrateHandheld reports unavailable hardware failures', () => {
  resetHaptics({
    throwOnHandheldVibration: true,
  })

  assert.equal(vibrateHandheld(10), false)
})

test('startJoypadVibration starts and reads controller rumble state', () => {
  resetHaptics()

  assert.equal(
    startJoypadVibration({
      device: 2,
      weakMagnitude: 0.25,
      strongMagnitude: 2,
      durationSeconds: 1.5,
    }),
    true,
  )

  assert.deepEqual(readJoypadVibration(2), {
    device: 2,
    weakMagnitude: 0.25,
    strongMagnitude: 1,
    durationSeconds: 1.5,
  })
})

test('stopJoypadVibration clears controller rumble state', () => {
  resetHaptics()
  startJoypadVibration({
    device: 1,
    weakMagnitude: 0.4,
    strongMagnitude: 0.6,
    durationSeconds: 2,
  })

  assert.equal(stopJoypadVibration(1), true)

  assert.deepEqual(readJoypadVibration(1), {
    device: 1,
    weakMagnitude: 0,
    strongMagnitude: 0,
    durationSeconds: 0,
  })
})

test('joypad vibration helpers report Godot failures predictably', () => {
  resetHaptics({
    throwOnJoypadVibration: true,
  })

  assert.equal(startJoypadVibration({ device: 1 }), false)
  assert.equal(stopJoypadVibration(1), false)
})
