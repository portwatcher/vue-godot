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
export type {
  CoreDeviceCapabilityName,
  DeviceCapabilityAdapter,
  DeviceCapabilityName,
  DeviceCapabilityState,
  DeviceCapabilityStatus,
  PluginBackedDeviceAdapter,
} from './types.js'
export type {
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
  NativeNotificationOptions,
  NotificationAdapter,
  PermissionAdapter,
} from './adapters.js'
