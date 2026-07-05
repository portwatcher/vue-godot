export {
  DeviceCapabilityError,
  createDeviceCapabilityError,
  isDeviceCapabilityError,
} from './errors.js'
export type {
  DeviceCapabilityErrorCode,
  DeviceCapabilityErrorOptions,
} from './errors.js'
export {
  DeviceCapabilityRegistry,
  deviceCapabilities,
  getCapabilityStatus,
  isSupported,
  normalizeDeviceCapabilityError,
  registerDeviceCapability,
  requireCapability,
  unregisterDeviceCapability,
} from './registry.js'
export {
  isDeepLinkAdapter,
  isNotificationAdapter,
  isShareAdapter,
} from './adapterGuards.js'
export {
  createGeolocationAdapter,
  normalizeGeolocationPluginError,
  normalizeGeolocationPosition,
} from './geolocation.js'
export type {
  NativeGeolocationAdapter,
  NativeGeolocationAdapterOptions,
  NativeGeolocationPlugin,
  NativeGeolocationPluginPosition,
} from './geolocation.js'
export type {
  CoreDeviceCapabilityName,
  DeviceCapabilityAdapter,
  DeviceCapabilityName,
  DeviceCapabilityState,
  DeviceCapabilityStatus,
  PluginBackedDeviceAdapter,
} from './types.js'
export type {
  DeepLinkAdapter,
  DeviceAdapter,
  DeviceGeolocationCoordinates,
  DeviceGeolocationOptions,
  DeviceGeolocationPosition,
  DeviceMediaConstraints,
  DeviceMediaStream,
  DeviceMediaTrack,
  DevicePermissionDescriptor,
  DevicePermissionState,
  GeolocationAdapter,
  MediaDevicesAdapter,
  NativeOpenUrlEvent,
  NativeOpenUrlHandler,
  NativeOpenUrlSubscription,
  NativeNotificationOptions,
  NativeShareData,
  NotificationAdapter,
  PermissionAdapter,
  ShareAdapter,
} from './adapters.js'
