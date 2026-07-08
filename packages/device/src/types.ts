import type { DeviceCapabilityErrorCode } from './errors.js'

export type CoreDeviceCapabilityName =
  | 'deep-links'
  | 'geolocation'
  | 'camera'
  | 'microphone'
  | 'media-devices'
  | 'notifications'
  | 'permissions'
  | 'clipboard'
  | 'haptics'
  | 'sensors'
  | 'secure-storage'
  | 'network'
  | 'share'

export type DeviceCapabilityName = CoreDeviceCapabilityName | (string & {})

export type DeviceCapabilityState = 'supported' | DeviceCapabilityErrorCode

export interface DeviceCapabilityStatus<
  TName extends DeviceCapabilityName = DeviceCapabilityName,
> {
  capability: TName
  state: DeviceCapabilityState
  message?: string
  pluginName?: string
}

export interface DeviceCapabilityAdapter<
  TName extends DeviceCapabilityName = DeviceCapabilityName,
> {
  readonly capability: TName
  readonly pluginName?: string
  isSupported?: () => boolean | Promise<boolean>
  getStatus?: () => DeviceCapabilityStatus<TName> | Promise<DeviceCapabilityStatus<TName>>
}

export interface PluginBackedDeviceAdapter<
  TName extends DeviceCapabilityName = DeviceCapabilityName,
> extends DeviceCapabilityAdapter<TName> {
  readonly pluginName: string
}
