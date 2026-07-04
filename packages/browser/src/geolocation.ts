import {
  createDeviceCapabilityError,
  deviceCapabilities,
  isDeviceCapabilityError,
  requireCapability,
  type DeviceGeolocationCoordinates,
  type DeviceGeolocationOptions,
  type DeviceGeolocationPosition,
  type GeolocationAdapter,
} from '@vue-godot/device'

export type GodotGeolocationPositionOptions = DeviceGeolocationOptions
export type GodotGeolocationPositionCallback = (
  position: GodotGeolocationPosition,
) => void
export type GodotGeolocationPositionErrorCallback = (
  error: GodotGeolocationPositionError,
) => void

export class GodotGeolocationCoordinates {
  readonly latitude: number
  readonly longitude: number
  readonly accuracy: number
  readonly altitude: number | null
  readonly altitudeAccuracy: number | null
  readonly heading: number | null
  readonly speed: number | null

  constructor(coords: DeviceGeolocationCoordinates) {
    this.latitude = coords.latitude
    this.longitude = coords.longitude
    this.accuracy = coords.accuracy
    this.altitude = coords.altitude ?? null
    this.altitudeAccuracy = coords.altitudeAccuracy ?? null
    this.heading = coords.heading ?? null
    this.speed = coords.speed ?? null
  }
}

export class GodotGeolocationPosition {
  readonly coords: GodotGeolocationCoordinates
  readonly timestamp: number

  constructor(position: DeviceGeolocationPosition) {
    this.coords = new GodotGeolocationCoordinates(position.coords)
    this.timestamp = Number.isFinite(position.timestamp)
      ? position.timestamp
      : Date.now()
  }
}

export type GodotGeolocationErrorCode = 1 | 2 | 3

export class GodotGeolocationPositionError extends Error {
  static readonly PERMISSION_DENIED = 1
  static readonly POSITION_UNAVAILABLE = 2
  static readonly TIMEOUT = 3

  readonly PERMISSION_DENIED = GodotGeolocationPositionError.PERMISSION_DENIED
  readonly POSITION_UNAVAILABLE =
    GodotGeolocationPositionError.POSITION_UNAVAILABLE
  readonly TIMEOUT = GodotGeolocationPositionError.TIMEOUT

  readonly code: GodotGeolocationErrorCode

  constructor(code: GodotGeolocationErrorCode, message: string) {
    super(message)
    this.name = 'GeolocationPositionError'
    this.code = code
    Object.setPrototypeOf(this, GodotGeolocationPositionError.prototype)
  }
}

interface WatchRecord {
  adapter?: GeolocationAdapter
  adapterWatchId?: number
  cancelled: boolean
}

function isGeolocationAdapter(value: unknown): value is GeolocationAdapter {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<GeolocationAdapter>
  return (
    candidate.capability === 'geolocation' &&
    typeof candidate.getCurrentPosition === 'function' &&
    typeof candidate.watchPosition === 'function' &&
    typeof candidate.clearWatch === 'function'
  )
}

export function getRegisteredGeolocationAdapter(): GeolocationAdapter | null {
  const adapter = deviceCapabilities.getAdapter('geolocation')
  return isGeolocationAdapter(adapter) ? adapter : null
}

function requireRegisteredGeolocationAdapter(): GeolocationAdapter {
  const adapter = getRegisteredGeolocationAdapter()
  if (adapter) {
    return adapter
  }

  throw createDeviceCapabilityError('missing-plugin', 'geolocation', {
    message:
      'No geolocation adapter is registered. Register a @vue-godot/device GeolocationAdapter before using navigator.geolocation.',
  })
}

async function requireSupportedGeolocationAdapter(): Promise<GeolocationAdapter> {
  const adapter = requireRegisteredGeolocationAdapter()
  await requireCapability('geolocation')
  return adapter
}

function wrapPosition(
  position: DeviceGeolocationPosition,
): GodotGeolocationPosition {
  return new GodotGeolocationPosition(position)
}

function isTimeoutLikeError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name.toLowerCase().includes('timeout') ||
      error.message.toLowerCase().includes('timeout'))
  )
}

function toGeolocationError(error: unknown): GodotGeolocationPositionError {
  if (error instanceof GodotGeolocationPositionError) {
    return error
  }

  if (isTimeoutLikeError(error)) {
    return new GodotGeolocationPositionError(
      GodotGeolocationPositionError.TIMEOUT,
      error instanceof Error ? error.message : 'Geolocation request timed out.',
    )
  }

  const deviceError = isDeviceCapabilityError(error) ? error : null
  if (deviceError?.code === 'permission-denied') {
    return new GodotGeolocationPositionError(
      GodotGeolocationPositionError.PERMISSION_DENIED,
      deviceError.message,
    )
  }

  return new GodotGeolocationPositionError(
    GodotGeolocationPositionError.POSITION_UNAVAILABLE,
    error instanceof Error
      ? error.message
      : 'Geolocation position is unavailable.',
  )
}

function validateSuccessCallback(
  successCallback: GodotGeolocationPositionCallback,
): void {
  if (typeof successCallback !== 'function') {
    throw new TypeError('Geolocation success callback must be a function.')
  }
}

export class GodotGeolocation {
  private nextWatchId = 1
  private readonly watches = new Map<number, WatchRecord>()

  getCurrentPosition(
    successCallback: GodotGeolocationPositionCallback,
    errorCallback?: GodotGeolocationPositionErrorCallback | null,
    options?: GodotGeolocationPositionOptions,
  ): void {
    validateSuccessCallback(successCallback)

    void requireSupportedGeolocationAdapter()
      .then((adapter) => adapter.getCurrentPosition(options))
      .then(
        (position: DeviceGeolocationPosition) => {
          successCallback(wrapPosition(position))
        },
        (error: unknown) => {
          errorCallback?.(toGeolocationError(error))
        },
      )
  }

  watchPosition(
    successCallback: GodotGeolocationPositionCallback,
    errorCallback?: GodotGeolocationPositionErrorCallback | null,
    options?: GodotGeolocationPositionOptions,
  ): number {
    validateSuccessCallback(successCallback)

    const watchId = this.createWatchId()
    const record: WatchRecord = { cancelled: false }
    this.watches.set(watchId, record)

    void this.startWatch(
      watchId,
      record,
      successCallback,
      errorCallback ?? null,
      options,
    )

    return watchId
  }

  clearWatch(watchId: number): void {
    const normalizedId = Math.trunc(Number(watchId))
    const record = this.watches.get(normalizedId)
    if (!record) {
      return
    }

    record.cancelled = true
    this.watches.delete(normalizedId)

    if (record.adapter && record.adapterWatchId !== undefined) {
      record.adapter.clearWatch(record.adapterWatchId)
    }
  }

  private createWatchId(): number {
    let watchId = this.nextWatchId
    do {
      watchId = this.nextWatchId
      this.nextWatchId =
        this.nextWatchId === Number.MAX_SAFE_INTEGER
          ? 1
          : this.nextWatchId + 1
    } while (this.watches.has(watchId))
    return watchId
  }

  private async startWatch(
    watchId: number,
    record: WatchRecord,
    successCallback: GodotGeolocationPositionCallback,
    errorCallback: GodotGeolocationPositionErrorCallback | null,
    options?: GodotGeolocationPositionOptions,
  ): Promise<void> {
    try {
      const adapter = await requireSupportedGeolocationAdapter()
      if (record.cancelled || !this.watches.has(watchId)) {
        return
      }

      const adapterWatchId = adapter.watchPosition(
        (position: DeviceGeolocationPosition) => {
          if (!record.cancelled && this.watches.has(watchId)) {
            successCallback(wrapPosition(position))
          }
        },
        (error: unknown) => {
          if (!record.cancelled && this.watches.has(watchId)) {
            errorCallback?.(toGeolocationError(error))
          }
        },
        options,
      )

      if (record.cancelled || !this.watches.has(watchId)) {
        adapter.clearWatch(adapterWatchId)
        return
      }

      record.adapter = adapter
      record.adapterWatchId = adapterWatchId
    } catch (error) {
      if (!record.cancelled && this.watches.has(watchId)) {
        this.watches.delete(watchId)
        errorCallback?.(toGeolocationError(error))
      }
    }
  }
}

export const geolocation = new GodotGeolocation()
