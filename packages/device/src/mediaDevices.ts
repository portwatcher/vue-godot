import {
  createDeviceCapabilityError,
  isDeviceCapabilityError,
  type DeviceCapabilityError,
} from './errors.js'
import type {
  DeviceMediaConstraints,
  DeviceMediaStream,
  DeviceMediaTrack,
  MediaDevicesAdapter,
} from './adapters.js'
import type { DeviceCapabilityStatus } from './types.js'

export type NativeMediaDeviceTrackKind = DeviceMediaTrack['kind']

export interface NativeMediaDeviceTrack {
  id: string
  kind: NativeMediaDeviceTrackKind
  label?: string
  stop?: () => void
}

export interface NativeMediaDeviceStream {
  id?: string
  tracks?: readonly NativeMediaDeviceTrack[]
  getTracks?: () => readonly NativeMediaDeviceTrack[]
}

export interface NativeMediaDevicesPlugin {
  readonly pluginName?: string
  isAvailable?: () => boolean | Promise<boolean>
  hasPermission?: () => boolean | Promise<boolean>
  getUserMedia: (
    constraints: DeviceMediaConstraints,
  ) => NativeMediaDeviceStream | Promise<NativeMediaDeviceStream>
}

export interface NativeMediaDevicesAdapterOptions {
  pluginName?: string
  isPlatformSupported?: () => boolean | Promise<boolean>
  isExportConfigured?: () => boolean | Promise<boolean>
}

export type NativeMediaDevicesAdapter = MediaDevicesAdapter & {
  getStatus: () => Promise<DeviceCapabilityStatus<'media-devices'>>
}

let nextStreamId = 1

function normalizeUnknownPluginError(error: unknown): DeviceCapabilityError {
  if (isDeviceCapabilityError(error)) {
    return error
  }

  return createDeviceCapabilityError('unsupported-platform', 'media-devices', {
    cause: error,
    message:
      error instanceof Error
        ? error.message
        : 'Media devices plugin failed with an unknown error.',
  })
}

function createStatus(
  state: DeviceCapabilityStatus<'media-devices'>['state'],
  pluginName: string,
  message?: string,
): DeviceCapabilityStatus<'media-devices'> {
  return {
    capability: 'media-devices',
    state,
    pluginName,
    ...(message ? { message } : {}),
  }
}

async function readStatus(
  plugin: NativeMediaDevicesPlugin,
  options: NativeMediaDevicesAdapterOptions,
  pluginName: string,
): Promise<DeviceCapabilityStatus<'media-devices'>> {
  if (
    options.isPlatformSupported &&
    !(await options.isPlatformSupported())
  ) {
    return createStatus(
      'unsupported-platform',
      pluginName,
      'Media capture is not supported on this platform.',
    )
  }

  if (options.isExportConfigured && !(await options.isExportConfigured())) {
    return createStatus(
      'export-misconfiguration',
      pluginName,
      'Media capture export or platform configuration is missing.',
    )
  }

  if (plugin.isAvailable && !(await plugin.isAvailable())) {
    return createStatus(
      'missing-plugin',
      pluginName,
      'Media devices native plugin is not available.',
    )
  }

  if (plugin.hasPermission && !(await plugin.hasPermission())) {
    return createStatus(
      'permission-denied',
      pluginName,
      'Media capture permission is denied.',
    )
  }

  return createStatus('supported', pluginName)
}

function assertSupported(status: DeviceCapabilityStatus<'media-devices'>) {
  if (status.state === 'supported') {
    return
  }

  throw createDeviceCapabilityError(status.state, 'media-devices', {
    message: status.message,
  })
}

function normalizeTrackKind(kind: string): NativeMediaDeviceTrackKind | undefined {
  switch (kind) {
    case 'audio':
    case 'video':
      return kind
  }
}

export function normalizeMediaDeviceTrack(
  track: NativeMediaDeviceTrack,
): DeviceMediaTrack {
  const kind = normalizeTrackKind(track.kind)
  if (!kind) {
    throw createDeviceCapabilityError('unsupported-platform', 'media-devices', {
      message: `Media devices plugin returned invalid track kind "${String(
        track.kind,
      )}".`,
    })
  }

  return {
    id: String(track.id),
    kind,
    ...(track.label ? { label: track.label } : {}),
    stop() {
      track.stop?.()
    },
  }
}

function readNativeTracks(stream: NativeMediaDeviceStream) {
  if (stream.tracks) {
    return stream.tracks
  }

  if (stream.getTracks) {
    return stream.getTracks()
  }

  return []
}

export function normalizeMediaDeviceStream(
  stream: NativeMediaDeviceStream,
): DeviceMediaStream {
  const tracks = readNativeTracks(stream).map((track) =>
    normalizeMediaDeviceTrack(track),
  )

  return {
    id: stream.id ?? `native-media-stream-${nextStreamId++}`,
    getTracks() {
      return [...tracks]
    },
  }
}

export function normalizeMediaDevicesPluginError(error: unknown) {
  return normalizeUnknownPluginError(error)
}

export function createMediaDevicesAdapter(
  plugin: NativeMediaDevicesPlugin,
  options: NativeMediaDevicesAdapterOptions = {},
): NativeMediaDevicesAdapter {
  const pluginName =
    options.pluginName ?? plugin.pluginName ?? 'native-media-devices-plugin'

  return {
    capability: 'media-devices',
    pluginName,
    getStatus() {
      return readStatus(plugin, options, pluginName)
    },
    async getUserMedia(constraints) {
      try {
        assertSupported(await readStatus(plugin, options, pluginName))
        return normalizeMediaDeviceStream(await plugin.getUserMedia(constraints))
      } catch (error) {
        throw normalizeUnknownPluginError(error)
      }
    },
  }
}
