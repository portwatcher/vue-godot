// ---------------------------------------------------------------------------
// Vibration polyfill for GodotJS
// ---------------------------------------------------------------------------
// Implements `navigator.vibrate()` on top of Godot's handheld vibration API.
// ---------------------------------------------------------------------------

import { Input } from 'godot'
import {
  clearTimeout as clearGodotTimeout,
  setTimeout as setGodotTimeout,
} from './timing.js'

export type GodotVibrationPattern = number | readonly number[]

const MAX_VIBRATION_DURATION_MS = 10000
const DEFAULT_AMPLITUDE = -1

let scheduledVibrationIds: number[] = []

function normalizePattern(pattern: GodotVibrationPattern): number[] | null {
  const rawPattern = Array.isArray(pattern) ? pattern : [pattern]

  if (rawPattern.length === 0) {
    return []
  }

  const normalized: number[] = []
  for (const value of rawPattern) {
    const duration = Number(value)
    if (!Number.isFinite(duration) || duration < 0) {
      return null
    }

    normalized.push(
      Math.min(Math.trunc(duration), MAX_VIBRATION_DURATION_MS),
    )
  }

  return normalized
}

function clearScheduledVibrations(): void {
  for (const id of scheduledVibrationIds) {
    clearGodotTimeout(id)
  }
  scheduledVibrationIds = []
}

function vibrateHardware(durationMs: number): boolean {
  try {
    Input.vibrate_handheld(durationMs, DEFAULT_AMPLITUDE)
    return true
  } catch {
    return false
  }
}

export function isVibrationSupported(): boolean {
  try {
    return typeof Input.vibrate_handheld === 'function'
  } catch {
    return false
  }
}

/**
 * Browser-compatible `navigator.vibrate()` implementation.
 *
 * A numeric value vibrates immediately. Arrays alternate vibration and pause
 * durations; calling again cancels any pending pattern from the previous call.
 */
export function vibrate(pattern: GodotVibrationPattern): boolean {
  const normalizedPattern = normalizePattern(pattern)
  if (normalizedPattern === null) {
    return false
  }

  clearScheduledVibrations()

  if (!isVibrationSupported()) {
    return false
  }

  if (
    normalizedPattern.length === 0 ||
    normalizedPattern.every((duration) => duration === 0)
  ) {
    return vibrateHardware(0)
  }

  if (normalizedPattern[0] === 0 && !vibrateHardware(0)) {
    return false
  }

  let delay = 0
  for (let index = 0; index < normalizedPattern.length; index++) {
    const duration = normalizedPattern[index]
    const isVibrationStep = index % 2 === 0

    if (isVibrationStep && duration > 0) {
      if (delay === 0) {
        if (!vibrateHardware(duration)) {
          clearScheduledVibrations()
          return false
        }
      } else {
        const id = setGodotTimeout(() => {
          scheduledVibrationIds = scheduledVibrationIds.filter(
            (scheduledId) => scheduledId !== id,
          )
          vibrateHardware(duration)
        }, delay)
        scheduledVibrationIds.push(id)
      }
    }

    delay += duration
  }

  return true
}
