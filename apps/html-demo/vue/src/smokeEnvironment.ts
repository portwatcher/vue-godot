import { OS } from 'godot'

export const SMOKE_ENV = 'VUE_GODOT_SMOKE'
export const SMOKE_RELOADS_ENV = 'VUE_GODOT_SMOKE_RELOADS'
export const SMOKE_FETCH_URL_ENV = 'VUE_GODOT_SMOKE_FETCH_URL'
export const SMOKE_FETCH_TEXT_ENV = 'VUE_GODOT_SMOKE_FETCH_TEXT'
export const PERFORMANCE_ENV = 'VUE_GODOT_PERFORMANCE'
export const PERFORMANCE_CYCLES_ENV = 'VUE_GODOT_PERFORMANCE_CYCLES'

export function readOptionalEnv(name: string): string | undefined {
  return OS.has_environment(name) ? OS.get_environment(name) : undefined
}

export function readPositiveIntegerEnv(name: string, fallback: number): number {
  if (!OS.has_environment(name)) return fallback

  const value = Number.parseInt(OS.get_environment(name), 10)
  return Number.isInteger(value) && value > 0 ? value : fallback
}

export function isSmokeEnabled(): boolean {
  return OS.has_environment(SMOKE_ENV) && OS.get_environment(SMOKE_ENV) !== '0'
}

export function isPerformanceEnabled(): boolean {
  return (
    OS.has_environment(PERFORMANCE_ENV) &&
    OS.get_environment(PERFORMANCE_ENV) !== '0'
  )
}
