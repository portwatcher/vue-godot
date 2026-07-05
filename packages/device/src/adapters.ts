import type {
  DeviceCapabilityAdapter,
  PluginBackedDeviceAdapter,
} from './types.js'

export interface DevicePermissionDescriptor {
  name: string
}

export type DevicePermissionState = 'granted' | 'denied' | 'prompt' | 'unknown'

export interface PermissionAdapter
  extends PluginBackedDeviceAdapter<'permissions'> {
  queryPermission: (
    descriptor: DevicePermissionDescriptor,
  ) => DevicePermissionState | Promise<DevicePermissionState>
  requestPermission?: (
    descriptor: DevicePermissionDescriptor,
  ) => DevicePermissionState | Promise<DevicePermissionState>
}

export interface DeviceGeolocationCoordinates {
  latitude: number
  longitude: number
  accuracy: number
  altitude?: number | null
  altitudeAccuracy?: number | null
  heading?: number | null
  speed?: number | null
}

export interface DeviceGeolocationPosition {
  coords: DeviceGeolocationCoordinates
  timestamp: number
}

export interface DeviceGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

export interface GeolocationAdapter
  extends PluginBackedDeviceAdapter<'geolocation'> {
  getCurrentPosition: (
    options?: DeviceGeolocationOptions,
  ) => Promise<DeviceGeolocationPosition>
  watchPosition: (
    onPosition: (position: DeviceGeolocationPosition) => void,
    onError?: (error: unknown) => void,
    options?: DeviceGeolocationOptions,
  ) => number
  clearWatch: (watchId: number) => void
}

export interface DeviceMediaTrack {
  id: string
  kind: 'audio' | 'video'
  label?: string
  stop: () => void
}

export interface DeviceMediaStream {
  id: string
  getTracks: () => DeviceMediaTrack[]
}

export interface DeviceMediaConstraints {
  audio?: boolean | Record<string, unknown>
  video?: boolean | Record<string, unknown>
}

export interface MediaDevicesAdapter
  extends PluginBackedDeviceAdapter<'media-devices'> {
  getUserMedia: (constraints: DeviceMediaConstraints) => Promise<DeviceMediaStream>
}

export interface NativeNotificationOptions {
  body?: string
  title?: string
  data?: unknown
}

export interface NotificationAdapter
  extends PluginBackedDeviceAdapter<'notifications'> {
  notify: (title: string, options?: NativeNotificationOptions) => Promise<void>
}

export interface NativeShareData {
  data?: unknown
  files?: readonly string[]
  text?: string
  title?: string
  url?: string
}

export interface ShareAdapter extends PluginBackedDeviceAdapter<'share'> {
  share: (data: NativeShareData) => Promise<void>
}

export interface NativeOpenUrlEvent {
  source?: string
  url: string
}

export type NativeOpenUrlHandler = (event: NativeOpenUrlEvent) => void

export interface NativeOpenUrlSubscription {
  disconnect(): void
}

export interface DeepLinkAdapter extends PluginBackedDeviceAdapter<'deep-links'> {
  getInitialUrl?: () => string | null | Promise<string | null>
  subscribeUrlOpen?: (
    handler: NativeOpenUrlHandler,
  ) => NativeOpenUrlSubscription | (() => void)
}

export type DeviceAdapter =
  | DeviceCapabilityAdapter
  | DeepLinkAdapter
  | GeolocationAdapter
  | MediaDevicesAdapter
  | NotificationAdapter
  | PermissionAdapter
  | ShareAdapter
