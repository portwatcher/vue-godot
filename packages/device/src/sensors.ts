import { Input } from 'godot'

export interface GodotVector3Data {
  x: number
  y: number
  z: number
}

export interface GodotDeviceMotionData {
  acceleration: GodotVector3Data
  accelerationIncludingGravity: GodotVector3Data
  rotationRate: {
    alpha: number
    beta: number
    gamma: number
  }
  interval: number
}

export interface GodotDeviceOrientationData {
  alpha: number | null
  beta: number | null
  gamma: number | null
  absolute: boolean
}

export const DEFAULT_DEVICE_SENSOR_INTERVAL_MS = 100

const RAD_TO_DEG = 180 / Math.PI

type GodotSensorMethod = keyof Pick<
  typeof Input,
  | 'get_accelerometer'
  | 'get_gravity'
  | 'get_gyroscope'
  | 'get_magnetometer'
>

function vectorComponent(vector: unknown, key: keyof GodotVector3Data): number {
  if (typeof vector !== 'object' || vector === null) {
    return 0
  }

  const value = (vector as Record<string, unknown>)[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function toVectorData(vector: unknown): GodotVector3Data {
  return {
    x: vectorComponent(vector, 'x'),
    y: vectorComponent(vector, 'y'),
    z: vectorComponent(vector, 'z'),
  }
}

function zeroVector(): GodotVector3Data {
  return { x: 0, y: 0, z: 0 }
}

function readSensor(method: GodotSensorMethod): GodotVector3Data {
  try {
    return toVectorData(Input[method]())
  } catch {
    return zeroVector()
  }
}

function addVectors(
  first: GodotVector3Data,
  second: GodotVector3Data,
): GodotVector3Data {
  return {
    x: first.x + second.x,
    y: first.y + second.y,
    z: first.z + second.z,
  }
}

function vectorMagnitude(vector: GodotVector3Data): number {
  return Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2)
}

function radiansToDegrees(value: number): number {
  return value * RAD_TO_DEG
}

function normalizeDegrees(value: number): number {
  return ((value % 360) + 360) % 360
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function readAccelerometer(): GodotVector3Data {
  return readSensor('get_accelerometer')
}

export function readGravity(): GodotVector3Data {
  return readSensor('get_gravity')
}

export function readGyroscope(): GodotVector3Data {
  return readSensor('get_gyroscope')
}

export function readMagnetometer(): GodotVector3Data {
  return readSensor('get_magnetometer')
}

export function readDeviceMotion(
  interval = DEFAULT_DEVICE_SENSOR_INTERVAL_MS,
): GodotDeviceMotionData {
  const acceleration = readAccelerometer()
  const gravity = readGravity()
  const gyroscope = readGyroscope()

  return {
    acceleration,
    accelerationIncludingGravity: addVectors(acceleration, gravity),
    rotationRate: {
      alpha: radiansToDegrees(gyroscope.z),
      beta: radiansToDegrees(gyroscope.x),
      gamma: radiansToDegrees(gyroscope.y),
    },
    interval,
  }
}

export function readDeviceOrientation(): GodotDeviceOrientationData {
  const gravity = readGravity()
  const magnetometer = readMagnetometer()
  const hasGravity = vectorMagnitude(gravity) > 0
  const hasMagnetometer = vectorMagnitude(magnetometer) > 0

  return {
    alpha: hasMagnetometer
      ? normalizeDegrees(
          radiansToDegrees(Math.atan2(magnetometer.y, magnetometer.x)),
        )
      : null,
    beta: hasGravity
      ? clamp(
          radiansToDegrees(
            Math.atan2(-gravity.x, Math.sqrt(gravity.y ** 2 + gravity.z ** 2)),
          ),
          -180,
          180,
        )
      : null,
    gamma: hasGravity
      ? clamp(radiansToDegrees(Math.atan2(gravity.y, gravity.z)), -90, 90)
      : null,
    absolute: hasMagnetometer,
  }
}
