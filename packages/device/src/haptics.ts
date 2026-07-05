import { Input } from 'godot'

export interface JoypadVibrationOptions {
  device?: number
  weakMagnitude?: number
  strongMagnitude?: number
  durationSeconds?: number
}

export interface JoypadVibrationState {
  device: number
  weakMagnitude: number
  strongMagnitude: number
  durationSeconds: number
}

const DEFAULT_HANDHELD_DURATION_MS = 500
const DEFAULT_HANDHELD_AMPLITUDE = -1

function finiteNumber(value: number | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function finiteInteger(value: number | undefined): number | null {
  const number = finiteNumber(value)
  return number == null ? null : Math.trunc(number)
}

function normalizeDurationMs(value: number | undefined): number {
  return Math.max(
    0,
    finiteInteger(value) ?? DEFAULT_HANDHELD_DURATION_MS,
  )
}

function normalizeAmplitude(value: number | undefined): number {
  const amplitude = finiteNumber(value) ?? DEFAULT_HANDHELD_AMPLITUDE
  if (amplitude < 0) {
    return DEFAULT_HANDHELD_AMPLITUDE
  }
  return Math.min(1, amplitude)
}

function normalizeDevice(value: number | undefined): number {
  return Math.max(0, finiteInteger(value) ?? 0)
}

function normalizeMagnitude(value: number | undefined): number {
  return Math.min(1, Math.max(0, finiteNumber(value) ?? 0))
}

function normalizeDurationSeconds(value: number | undefined): number {
  return Math.max(0, finiteNumber(value) ?? 0)
}

function vectorComponent(vector: unknown, key: 'x' | 'y'): number {
  if (typeof vector !== 'object' || vector === null) {
    return 0
  }

  const value = (vector as Record<string, unknown>)[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

export function isHandheldVibrationSupported(): boolean {
  try {
    return typeof Input.vibrate_handheld === 'function'
  } catch {
    return false
  }
}

export function vibrateHandheld(
  durationMs = DEFAULT_HANDHELD_DURATION_MS,
  amplitude = DEFAULT_HANDHELD_AMPLITUDE,
): boolean {
  try {
    Input.vibrate_handheld(
      normalizeDurationMs(durationMs),
      normalizeAmplitude(amplitude),
    )
    return true
  } catch {
    return false
  }
}

export function startJoypadVibration(
  options: JoypadVibrationOptions = {},
): boolean {
  try {
    Input.start_joy_vibration(
      normalizeDevice(options.device),
      normalizeMagnitude(options.weakMagnitude),
      normalizeMagnitude(options.strongMagnitude),
      normalizeDurationSeconds(options.durationSeconds),
    )
    return true
  } catch {
    return false
  }
}

export function stopJoypadVibration(device = 0): boolean {
  try {
    Input.stop_joy_vibration(normalizeDevice(device))
    return true
  } catch {
    return false
  }
}

export function readJoypadVibration(device = 0): JoypadVibrationState {
  const normalizedDevice = normalizeDevice(device)
  try {
    const strength = Input.get_joy_vibration_strength(normalizedDevice)
    return {
      device: normalizedDevice,
      weakMagnitude: vectorComponent(strength, 'x'),
      strongMagnitude: vectorComponent(strength, 'y'),
      durationSeconds: Math.max(
        0,
        finiteNumber(Input.get_joy_vibration_duration(normalizedDevice)) ?? 0,
      ),
    }
  } catch {
    return {
      device: normalizedDevice,
      weakMagnitude: 0,
      strongMagnitude: 0,
      durationSeconds: 0,
    }
  }
}
