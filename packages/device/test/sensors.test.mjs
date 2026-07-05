import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-loader.mjs', import.meta.url).href)

const {
  DEFAULT_DEVICE_SENSOR_INTERVAL_MS,
  readAccelerometer,
  readDeviceMotion,
  readDeviceOrientation,
  readGravity,
  readGyroscope,
  readMagnetometer,
} = await import('../dist/sensors.js')

function resetSensors(state = {}) {
  globalThis.__vueGodotDeviceMockInput = {
    accelerometer: { x: 0, y: 0, z: 0 },
    gravity: { x: 0, y: 0, z: 0 },
    gyroscope: { x: 0, y: 0, z: 0 },
    magnetometer: { x: 0, y: 0, z: 0 },
    throwOnSensors: new Set(),
    ...state,
  }
}

test('sensor helpers read individual Godot Input vectors', () => {
  resetSensors({
    accelerometer: { x: 1, y: 2, z: 3 },
    gravity: { x: 4, y: 5, z: 6 },
    gyroscope: { x: 7, y: 8, z: 9 },
    magnetometer: { x: 10, y: 11, z: 12 },
  })

  assert.deepEqual(readAccelerometer(), { x: 1, y: 2, z: 3 })
  assert.deepEqual(readGravity(), { x: 4, y: 5, z: 6 })
  assert.deepEqual(readGyroscope(), { x: 7, y: 8, z: 9 })
  assert.deepEqual(readMagnetometer(), { x: 10, y: 11, z: 12 })
})

test('sensor helpers normalize unavailable or invalid vectors to zeroes', () => {
  resetSensors({
    accelerometer: { x: 1, y: Number.NaN, z: 'bad' },
    throwOnSensors: new Set(['get_gyroscope']),
  })

  assert.deepEqual(readAccelerometer(), { x: 1, y: 0, z: 0 })
  assert.deepEqual(readGyroscope(), { x: 0, y: 0, z: 0 })
})

test('readDeviceMotion returns browser-compatible motion data', () => {
  resetSensors({
    accelerometer: { x: 1, y: 2, z: 3 },
    gravity: { x: 0, y: 0, z: 9.8 },
    gyroscope: { x: Math.PI / 2, y: Math.PI, z: Math.PI * 2 },
  })

  const motion = readDeviceMotion(25)

  assert.deepEqual(motion.acceleration, { x: 1, y: 2, z: 3 })
  assert.deepEqual(motion.accelerationIncludingGravity, {
    x: 1,
    y: 2,
    z: 12.8,
  })
  assert.equal(motion.rotationRate.beta, 90)
  assert.equal(motion.rotationRate.gamma, 180)
  assert.equal(motion.rotationRate.alpha, 360)
  assert.equal(motion.interval, 25)
})

test('readDeviceMotion uses a stable default interval', () => {
  resetSensors()

  assert.equal(readDeviceMotion().interval, DEFAULT_DEVICE_SENSOR_INTERVAL_MS)
})

test('readDeviceOrientation derives best-effort heading and tilt', () => {
  resetSensors({
    gravity: { x: 0, y: 0, z: 9.8 },
    magnetometer: { x: 0, y: 1, z: 0 },
  })

  const orientation = readDeviceOrientation()

  assert.equal(orientation.alpha, 90)
  assert.equal(orientation.beta, -0)
  assert.equal(orientation.gamma, 0)
  assert.equal(orientation.absolute, true)
})

test('readDeviceOrientation reports null values without backing sensors', () => {
  resetSensors()

  assert.deepEqual(readDeviceOrientation(), {
    alpha: null,
    beta: null,
    gamma: null,
    absolute: false,
  })
})
