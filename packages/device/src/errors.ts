import type { DeviceCapabilityName } from './types.js'

export type DeviceCapabilityErrorCode =
  | 'unsupported-platform'
  | 'permission-denied'
  | 'missing-plugin'
  | 'export-misconfiguration'

export interface DeviceCapabilityErrorOptions {
  cause?: unknown
  message?: string
}

function defaultMessage(
  code: DeviceCapabilityErrorCode,
  capability: DeviceCapabilityName,
) {
  switch (code) {
    case 'unsupported-platform':
      return `Device capability "${capability}" is not supported on this platform.`
    case 'permission-denied':
      return `Permission denied for device capability "${capability}".`
    case 'missing-plugin':
      return `No adapter or native plugin is registered for device capability "${capability}".`
    case 'export-misconfiguration':
      return `Device capability "${capability}" is missing required export or platform configuration.`
  }
}

export class DeviceCapabilityError extends Error {
  readonly code: DeviceCapabilityErrorCode
  readonly capability: DeviceCapabilityName
  readonly cause?: unknown

  constructor(
    code: DeviceCapabilityErrorCode,
    capability: DeviceCapabilityName,
    options: DeviceCapabilityErrorOptions = {},
  ) {
    super(options.message ?? defaultMessage(code, capability))
    this.name = 'DeviceCapabilityError'
    this.code = code
    this.capability = capability
    this.cause = options.cause
    Object.setPrototypeOf(this, DeviceCapabilityError.prototype)
  }
}

export function isDeviceCapabilityError(
  value: unknown,
): value is DeviceCapabilityError {
  return value instanceof DeviceCapabilityError
}

export function createDeviceCapabilityError(
  code: DeviceCapabilityErrorCode,
  capability: DeviceCapabilityName,
  options: DeviceCapabilityErrorOptions = {},
) {
  return new DeviceCapabilityError(code, capability, options)
}
