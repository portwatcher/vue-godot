// ---------------------------------------------------------------------------
// Device motion and orientation polyfills for the Godot JavaScript Runtime
// ---------------------------------------------------------------------------
// Uses @vue-godot/device/sensors, which wraps Godot's Input sensor methods.
// On platforms without physical sensors, Godot returns Vector3.ZERO.
// ---------------------------------------------------------------------------

import {
  readDeviceMotion as readGodotDeviceMotion,
  readDeviceOrientation as readGodotDeviceOrientation,
} from '@vue-godot/device/sensors'
import type {
  GodotDeviceMotionData,
  GodotDeviceOrientationData,
  GodotVector3Data,
} from '@vue-godot/device/sensors'
import { GodotEvent } from './event-target.js'
import { getGlobalEventTarget } from './history.js'
import {
  clearInterval as clearGodotInterval,
  setInterval as setGodotInterval,
} from './timing.js'

export type {
  GodotDeviceMotionData,
  GodotDeviceOrientationData,
  GodotVector3Data,
} from '@vue-godot/device/sensors'

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

function zeroVector(): GodotVector3Data {
  return { x: 0, y: 0, z: 0 }
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
  return readGodotDeviceMotion(interval)
}

export function readDeviceOrientation(): GodotDeviceOrientationData {
  return readGodotDeviceOrientation()
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
