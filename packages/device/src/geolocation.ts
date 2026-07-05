import {
  createDeviceCapabilityError,
  isDeviceCapabilityError,
  type DeviceCapabilityError,
} from './errors.js'
import type {
  DeviceGeolocationOptions,
  DeviceGeolocationPosition,
  GeolocationAdapter,
} from './adapters.js'
import type { DeviceCapabilityStatus } from './types.js'

export interface NativeGeolocationPluginPosition {
  latitude: number
  longitude: number
  accuracy: number
  altitude?: number | null
  altitudeAccuracy?: number | null
  heading?: number | null
  speed?: number | null
  timestamp?: number
}

export interface NativeGeolocationPlugin {
  readonly pluginName?: string
  isAvailable?: () => boolean | Promise<boolean>
  hasPermission?: () => boolean | Promise<boolean>
  getCurrentPosition: (
    options?: DeviceGeolocationOptions,
  ) => NativeGeolocationPluginPosition | Promise<NativeGeolocationPluginPosition>
  watchPosition?: (
    onPosition: (position: NativeGeolocationPluginPosition) => void,
    onError?: (error: unknown) => void,
    options?: DeviceGeolocationOptions,
  ) => number
  clearWatch?: (watchId: number) => void
}

export interface NativeGeolocationAdapterOptions {
  pluginName?: string
  isPlatformSupported?: () => boolean | Promise<boolean>
  isExportConfigured?: () => boolean | Promise<boolean>
}

export type NativeGeolocationAdapter = GeolocationAdapter & {
  getStatus: () => Promise<DeviceCapabilityStatus<'geolocation'>>
}

function readFiniteNumber(value: number, field: string) {
  if (!Number.isFinite(value)) {
    throw createDeviceCapabilityError('unsupported-platform', 'geolocation', {
      message: `Geolocation plugin returned invalid ${field}.`,
    })
  }
  return value
}

function readOptionalFiniteNumber(
  value: number | null | undefined,
  field: string,
) {
  if (value == null) {
    return value
  }
  return readFiniteNumber(value, field)
}

function normalizeUnknownPluginError(error: unknown): DeviceCapabilityError {
  if (isDeviceCapabilityError(error)) {
    return error
  }

  return createDeviceCapabilityError('unsupported-platform', 'geolocation', {
    cause: error,
    message:
      error instanceof Error
        ? error.message
        : 'Geolocation plugin failed with an unknown error.',
  })
}

function createStatus(
  state: DeviceCapabilityStatus<'geolocation'>['state'],
  pluginName: string,
  message?: string,
): DeviceCapabilityStatus<'geolocation'> {
  return {
    capability: 'geolocation',
    state,
    pluginName,
    ...(message ? { message } : {}),
  }
}

async function readStatus(
  plugin: NativeGeolocationPlugin,
  options: NativeGeolocationAdapterOptions,
  pluginName: string,
): Promise<DeviceCapabilityStatus<'geolocation'>> {
  if (
    options.isPlatformSupported &&
    !(await options.isPlatformSupported())
  ) {
    return createStatus(
      'unsupported-platform',
      pluginName,
      'Geolocation is not supported on this platform.',
    )
  }

  if (options.isExportConfigured && !(await options.isExportConfigured())) {
    return createStatus(
      'export-misconfiguration',
      pluginName,
      'Geolocation export or platform configuration is missing.',
    )
  }

  if (plugin.isAvailable && !(await plugin.isAvailable())) {
    return createStatus(
      'missing-plugin',
      pluginName,
      'Geolocation native plugin is not available.',
    )
  }

  if (plugin.hasPermission && !(await plugin.hasPermission())) {
    return createStatus(
      'permission-denied',
      pluginName,
      'Geolocation permission is denied.',
    )
  }

  return createStatus('supported', pluginName)
}

function assertSupported(status: DeviceCapabilityStatus<'geolocation'>) {
  if (status.state === 'supported') {
    return
  }

  throw createDeviceCapabilityError(status.state, 'geolocation', {
    message: status.message,
  })
}

export function normalizeGeolocationPosition(
  position: NativeGeolocationPluginPosition,
): DeviceGeolocationPosition {
  return {
    coords: {
      latitude: readFiniteNumber(position.latitude, 'latitude'),
      longitude: readFiniteNumber(position.longitude, 'longitude'),
      accuracy: readFiniteNumber(position.accuracy, 'accuracy'),
      altitude: readOptionalFiniteNumber(position.altitude, 'altitude'),
      altitudeAccuracy: readOptionalFiniteNumber(
        position.altitudeAccuracy,
        'altitudeAccuracy',
      ),
      heading: readOptionalFiniteNumber(position.heading, 'heading'),
      speed: readOptionalFiniteNumber(position.speed, 'speed'),
    },
    timestamp:
      position.timestamp != null
        ? readFiniteNumber(position.timestamp, 'timestamp')
        : Date.now(),
  }
}

export function normalizeGeolocationPluginError(error: unknown) {
  return normalizeUnknownPluginError(error)
}

export function createGeolocationAdapter(
  plugin: NativeGeolocationPlugin,
  options: NativeGeolocationAdapterOptions = {},
): NativeGeolocationAdapter {
  const pluginName =
    options.pluginName ?? plugin.pluginName ?? 'native-geolocation-plugin'

  return {
    capability: 'geolocation',
    pluginName,
    getStatus() {
      return readStatus(plugin, options, pluginName)
    },
    async getCurrentPosition(positionOptions) {
      try {
        assertSupported(await readStatus(plugin, options, pluginName))
        return normalizeGeolocationPosition(
          await plugin.getCurrentPosition(positionOptions),
        )
      } catch (error) {
        throw normalizeUnknownPluginError(error)
      }
    },
    watchPosition(onPosition, onError, positionOptions) {
      if (!plugin.watchPosition) {
        onError?.(
          createDeviceCapabilityError('missing-plugin', 'geolocation', {
            message: 'Geolocation plugin does not support watchPosition().',
          }),
        )
        return -1
      }

      try {
        return plugin.watchPosition(
          (position) => {
            try {
              onPosition(normalizeGeolocationPosition(position))
            } catch (error) {
              onError?.(normalizeUnknownPluginError(error))
            }
          },
          (error) => {
            onError?.(normalizeUnknownPluginError(error))
          },
          positionOptions,
        )
      } catch (error) {
        onError?.(normalizeUnknownPluginError(error))
        return -1
      }
    },
    clearWatch(watchId) {
      plugin.clearWatch?.(watchId)
    },
  }
}
