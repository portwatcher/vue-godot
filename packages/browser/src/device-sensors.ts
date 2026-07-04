// ---------------------------------------------------------------------------
// Device motion and orientation polyfills for GodotJS
// ---------------------------------------------------------------------------
// Uses Godot's Input sensor methods. On platforms without physical sensors,
// Godot returns Vector3.ZERO, matching its native behavior.
// ---------------------------------------------------------------------------

import { Input } from 'godot'
import { GodotEvent } from './event-target.js'
import { getGlobalEventTarget } from './history.js'
import {
  clearInterval as clearGodotInterval,
  setInterval as setGodotInterval,
} from './timing.js'

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

export interface GodotDeviceSensorEventOptions {
  intervalMs?: number
  motion?: boolean
  orientation?: boolean
}

const DEFAULT_SENSOR_EVENT_OPTIONS: Required<GodotDeviceSensorEventOptions> = {
  intervalMs: 100,
  motion: true,
  orientation: true,
}

const RAD_TO_DEG = 180 / Math.PI

let sensorEventOptions: Required<GodotDeviceSensorEventOptions> = {
  ...DEFAULT_SENSOR_EVENT_OPTIONS,
}
let sensorIntervalId: number | null = null

function normalizeOptions(
  options: GodotDeviceSensorEventOptions = {},
): Required<GodotDeviceSensorEventOptions> {
  const requestedInterval = Number(
    options.intervalMs ?? sensorEventOptions.intervalMs,
  )

  return {
    intervalMs: Number.isFinite(requestedInterval)
      ? Math.max(16, Math.trunc(requestedInterval))
      : sensorEventOptions.intervalMs,
    motion: options.motion ?? sensorEventOptions.motion,
    orientation: options.orientation ?? sensorEventOptions.orientation,
  }
}

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

function readSensor(method: keyof Pick<
  typeof Input,
  | 'get_accelerometer'
  | 'get_gravity'
  | 'get_gyroscope'
  | 'get_magnetometer'
>): GodotVector3Data {
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

export class GodotDeviceMotionEvent extends GodotEvent {
  readonly acceleration: GodotDeviceMotionData['acceleration']
  readonly accelerationIncludingGravity: GodotDeviceMotionData['accelerationIncludingGravity']
  readonly rotationRate: GodotDeviceMotionData['rotationRate']
  readonly interval: number

  constructor(type: 'devicemotion', init?: Partial<GodotDeviceMotionData>) {
    super(type)
    const data = init ?? readDeviceMotion()
    this.acceleration = data.acceleration ?? zeroVector()
    this.accelerationIncludingGravity =
      data.accelerationIncludingGravity ?? zeroVector()
    this.rotationRate = data.rotationRate ?? {
      alpha: 0,
      beta: 0,
      gamma: 0,
    }
    this.interval = data.interval ?? sensorEventOptions.intervalMs
  }
}

export class GodotDeviceOrientationEvent extends GodotEvent {
  readonly alpha: number | null
  readonly beta: number | null
  readonly gamma: number | null
  readonly absolute: boolean

  constructor(
    type: 'deviceorientation',
    init?: Partial<GodotDeviceOrientationData>,
  ) {
    super(type)
    const data = init ?? readDeviceOrientation()
    this.alpha = data.alpha ?? null
    this.beta = data.beta ?? null
    this.gamma = data.gamma ?? null
    this.absolute = data.absolute ?? false
  }
}

export function readDeviceMotion(
  interval = sensorEventOptions.intervalMs,
): GodotDeviceMotionData {
  const acceleration = readSensor('get_accelerometer')
  const gravity = readSensor('get_gravity')
  const gyroscope = readSensor('get_gyroscope')

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
  const gravity = readSensor('get_gravity')
  const magnetometer = readSensor('get_magnetometer')
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

export function configureDeviceSensorEvents(
  options: GodotDeviceSensorEventOptions,
): void {
  const wasRunning = sensorIntervalId !== null
  sensorEventOptions = normalizeOptions(options)

  if (wasRunning) {
    stopDeviceSensorEvents()
    startDeviceSensorEvents()
  }
}

export function getDeviceSensorEventOptions(): Required<GodotDeviceSensorEventOptions> {
  return { ...sensorEventOptions }
}

export function dispatchDeviceSensorEvents(): void {
  const target = getGlobalEventTarget()

  if (sensorEventOptions.motion) {
    target.dispatchEvent(
      new GodotDeviceMotionEvent('devicemotion', readDeviceMotion()),
    )
  }

  if (sensorEventOptions.orientation) {
    target.dispatchEvent(
      new GodotDeviceOrientationEvent(
        'deviceorientation',
        readDeviceOrientation(),
      ),
    )
  }
}

export function startDeviceSensorEvents(
  options: GodotDeviceSensorEventOptions = {},
): void {
  sensorEventOptions = normalizeOptions(options)
  stopDeviceSensorEvents()
  dispatchDeviceSensorEvents()
  sensorIntervalId = setGodotInterval(() => {
    dispatchDeviceSensorEvents()
  }, sensorEventOptions.intervalMs)
}

export function stopDeviceSensorEvents(): void {
  if (sensorIntervalId === null) {
    return
  }

  clearGodotInterval(sensorIntervalId)
  sensorIntervalId = null
}
