import {
  createDeviceCapabilityError,
  deviceCapabilities,
  isDeviceCapabilityError,
  requireCapability,
  type DeviceMediaConstraints,
  type DeviceMediaStream,
  type DeviceMediaTrack,
  type MediaDevicesAdapter,
} from '@vue-godot/device'

export type GodotMediaStreamConstraints = DeviceMediaConstraints
export type GodotMediaStreamTrackKind = 'audio' | 'video'
export type GodotMediaStreamTrackState = 'live' | 'ended'
export type GodotMediaDevicesErrorName =
  | 'NotAllowedError'
  | 'NotFoundError'
  | 'NotReadableError'

export class GodotMediaDevicesError extends Error {
  readonly cause?: unknown

  constructor(
    name: GodotMediaDevicesErrorName,
    message: string,
    options: { cause?: unknown } = {},
  ) {
    super(message)
    this.name = name
    this.cause = options.cause
    Object.setPrototypeOf(this, GodotMediaDevicesError.prototype)
  }
}

export class GodotMediaStreamTrack {
  readonly id: string
  readonly kind: GodotMediaStreamTrackKind
  readonly label: string

  enabled = true
  muted = false
  readyState: GodotMediaStreamTrackState = 'live'

  private readonly source: DeviceMediaTrack

  constructor(track: DeviceMediaTrack) {
    this.source = track
    this.id = track.id
    this.kind = track.kind
    this.label = track.label ?? ''
  }

  stop(): void {
    if (this.readyState === 'ended') {
      return
    }

    this.readyState = 'ended'
    this.source.stop()
  }
}

export class GodotMediaStream {
  readonly id: string

  private readonly tracks: GodotMediaStreamTrack[]

  constructor(stream: DeviceMediaStream) {
    this.id = stream.id
    this.tracks = stream
      .getTracks()
      .map((track) => new GodotMediaStreamTrack(track))
  }

  get active(): boolean {
    return this.tracks.some((track) => track.readyState === 'live')
  }

  getTracks(): GodotMediaStreamTrack[] {
    return [...this.tracks]
  }

  getAudioTracks(): GodotMediaStreamTrack[] {
    return this.tracks.filter((track) => track.kind === 'audio')
  }

  getVideoTracks(): GodotMediaStreamTrack[] {
    return this.tracks.filter((track) => track.kind === 'video')
  }

  getTrackById(trackId: string): GodotMediaStreamTrack | null {
    return this.tracks.find((track) => track.id === trackId) ?? null
  }
}

function isMediaDevicesAdapter(value: unknown): value is MediaDevicesAdapter {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<MediaDevicesAdapter>
  return (
    candidate.capability === 'media-devices' &&
    typeof candidate.getUserMedia === 'function'
  )
}

export function getRegisteredMediaDevicesAdapter(): MediaDevicesAdapter | null {
  const adapter = deviceCapabilities.getAdapter('media-devices')
  return isMediaDevicesAdapter(adapter) ? adapter : null
}

function requireRegisteredMediaDevicesAdapter(): MediaDevicesAdapter {
  const adapter = getRegisteredMediaDevicesAdapter()
  if (adapter) {
    return adapter
  }

  throw createDeviceCapabilityError('missing-plugin', 'media-devices', {
    message:
      'No media devices adapter is registered. Register a @vue-godot/device MediaDevicesAdapter before using navigator.mediaDevices.getUserMedia().',
  })
}

async function requireSupportedMediaDevicesAdapter(): Promise<
  MediaDevicesAdapter
> {
  const adapter = requireRegisteredMediaDevicesAdapter()
  await requireCapability('media-devices')
  return adapter
}

function hasRequestedTrackKind(
  constraints: GodotMediaStreamConstraints,
): boolean {
  return Boolean(constraints.audio || constraints.video)
}

function normalizeConstraints(
  constraints: GodotMediaStreamConstraints,
): GodotMediaStreamConstraints {
  if (
    typeof constraints !== 'object' ||
    constraints === null ||
    !hasRequestedTrackKind(constraints)
  ) {
    throw new TypeError(
      'getUserMedia() requires audio and/or video constraints.',
    )
  }

  return constraints
}

function toMediaDevicesError(error: unknown): GodotMediaDevicesError {
  if (error instanceof GodotMediaDevicesError) {
    return error
  }

  const deviceError = isDeviceCapabilityError(error) ? error : null
  if (deviceError?.code === 'permission-denied') {
    return new GodotMediaDevicesError('NotAllowedError', deviceError.message, {
      cause: error,
    })
  }

  if (deviceError?.code === 'export-misconfiguration') {
    return new GodotMediaDevicesError('NotReadableError', deviceError.message, {
      cause: error,
    })
  }

  return new GodotMediaDevicesError(
    'NotFoundError',
    error instanceof Error
      ? error.message
      : 'No media device stream is available.',
    { cause: error },
  )
}

export class GodotMediaDevices {
  async getUserMedia(
    constraints: GodotMediaStreamConstraints,
  ): Promise<GodotMediaStream> {
    const normalizedConstraints = normalizeConstraints(constraints)

    try {
      const adapter = await requireSupportedMediaDevicesAdapter()
      return new GodotMediaStream(
        await adapter.getUserMedia(normalizedConstraints),
      )
    } catch (error) {
      throw toMediaDevicesError(error)
    }
  }
}

export const mediaDevices = new GodotMediaDevices()
