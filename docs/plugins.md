# Plugin And Adapter Guide

Vue Godot does not bundle native camera, microphone, location, deep-link,
notification, or share-sheet plugins. Instead, native integrations register
adapters through `@vue-godot/device`, and browser-like wrappers in
`@vue-godot/browser` expose those capabilities only when a real backend is
present.

## Adapter Lifecycle

Register adapters before calling `installBrowserAPIs()` when you want
browser-like globals to appear during startup:

```ts
import { installBrowserAPIs } from '@vue-godot/browser'
import { registerDeviceCapability } from '@vue-godot/device'

const unregister = registerDeviceCapability({
  capability: 'notifications',
  pluginName: 'my-notification-plugin',
  async notify(title, options) {
    await myNotificationPlugin.notify(title, options)
  },
})

installBrowserAPIs()
```

Keep the unregister function for tests, editor reloads, or plugin teardown.
Registering a new adapter for the same capability replaces the previous adapter
in the shared registry.

## Capability Status

Adapters should expose `getStatus()` when they can distinguish platform and
permission failures:

```ts
registerDeviceCapability({
  capability: 'media-devices',
  pluginName: 'my-camera-plugin',
  getStatus() {
    if (!myCameraPlugin.isLoaded()) {
      return { capability: 'media-devices', state: 'missing-plugin' }
    }
    if (!myCameraPlugin.hasExportPermissions()) {
      return { capability: 'media-devices', state: 'export-misconfiguration' }
    }
    if (!myCameraPlugin.hasRuntimePermission()) {
      return { capability: 'media-devices', state: 'permission-denied' }
    }
    return { capability: 'media-devices', state: 'supported' }
  },
  async getUserMedia(constraints) {
    return myCameraPlugin.getUserMedia(constraints)
  },
})
```

If an adapter only has a boolean platform check, implement `isSupported()`. The
registry maps `false` to `unsupported-platform`.

## Error Mapping

Use `DeviceCapabilityError` or status states instead of throwing arbitrary
strings. Browser wrappers map these states to web-shaped failures:

| Device state | Browser wrapper behavior |
| --- | --- |
| `permission-denied` | Geolocation `PERMISSION_DENIED`, media/notification `NotAllowedError` |
| `missing-plugin`, `unsupported-platform` | Geolocation `POSITION_UNAVAILABLE`, media/notification `NotFoundError` |
| `export-misconfiguration` | Geolocation `POSITION_UNAVAILABLE`, media/notification `NotReadableError` |

Unknown adapter errors are preserved as the rejection cause where wrappers
support it, but typed capability errors produce clearer app behavior.

## Adapter Contracts

Current first-party contracts:

| Capability | Adapter | Browser wrapper |
| --- | --- | --- |
| `deep-links` | `DeepLinkAdapter` | Direct `@vue-godot/device/system` helpers |
| `geolocation` | `GeolocationAdapter` | `navigator.geolocation` |
| `media-devices` | `MediaDevicesAdapter` | `navigator.mediaDevices.getUserMedia()` and `MediaStream` subset |
| `notifications` | `NotificationAdapter` | `Notification` and direct `@vue-godot/device/system` helper |
| `permissions` | `PermissionAdapter` | `navigator.permissions.query()` adapter-first lookup |
| `share` | `ShareAdapter` | Direct `@vue-godot/device/system` helper |

Adapters may be implemented by a Godot script plugin, a native Android/iOS
plugin, desktop integration code, or app-specific JavaScript that bridges to a
known runtime object.

## Geolocation Plugins On Android And iOS

Use `createGeolocationAdapter()` from `@vue-godot/device/geolocation` to adapt
Android, iOS, or desktop location plugins to Vue Godot's shared
`GeolocationAdapter` contract:

```ts
import { installBrowserAPIs } from '@vue-godot/browser'
import { registerDeviceCapability } from '@vue-godot/device'
import { createGeolocationAdapter } from '@vue-godot/device/geolocation'

registerDeviceCapability(
  createGeolocationAdapter(
    {
      pluginName: 'native-location',
      isAvailable() {
        return nativeLocation.is_available()
      },
      hasPermission() {
        return nativeLocation.has_permission()
      },
      async getCurrentPosition(options) {
        return nativeLocation.get_current_position({
          high_accuracy: options?.enableHighAccuracy === true,
          timeout_ms: options?.timeout,
        })
      },
      watchPosition(onPosition, onError, options) {
        return nativeLocation.watch_position(onPosition, onError, {
          high_accuracy: options?.enableHighAccuracy === true,
          maximum_age_ms: options?.maximumAge,
        })
      },
      clearWatch(watchId) {
        nativeLocation.clear_watch(watchId)
      },
    },
    {
      isExportConfigured() {
        return nativeLocation.has_required_export_settings()
      },
    },
  ),
)

installBrowserAPIs()
```

The bridge expects plugin positions with `latitude`, `longitude`, `accuracy`,
optional altitude/heading/speed fields, and an optional `timestamp`. It maps
plugin availability, permission, export setup, and platform checks to the
device capability states that `navigator.geolocation` already understands.
Android plugins still own runtime permission prompts and manifest/export
settings. iOS plugins still own Core Location prompts, plist usage strings, and
authorization mode.

## Camera And Media Plugins On Android And iOS

Use `createMediaDevicesAdapter()` from `@vue-godot/device/media-devices` to
adapt Android, iOS, or desktop camera/microphone plugins to the shared
`MediaDevicesAdapter` contract:

```ts
import { installBrowserAPIs } from '@vue-godot/browser'
import { registerDeviceCapability } from '@vue-godot/device'
import { createMediaDevicesAdapter } from '@vue-godot/device/media-devices'

registerDeviceCapability(
  createMediaDevicesAdapter(
    {
      pluginName: 'native-camera',
      isAvailable() {
        return nativeCamera.is_available()
      },
      hasPermission() {
        return nativeCamera.has_camera_permission()
      },
      async getUserMedia(constraints) {
        return nativeCamera.get_user_media(constraints)
      },
    },
    {
      isExportConfigured() {
        return nativeCamera.has_required_export_settings()
      },
    },
  ),
)

installBrowserAPIs()
```

The bridge expects a native stream with an optional `id`, `tracks` or
`getTracks()`, and tracks with `id`, `kind` (`audio` or `video`), optional
`label`, and optional `stop()`. It maps plugin availability, permission,
export setup, and platform checks to the device capability states that
`navigator.mediaDevices.getUserMedia()` already understands. Android plugins
still own camera/microphone runtime permission prompts, manifest entries, and
camera resource cleanup. iOS plugins still own AVFoundation permission prompts,
plist usage strings, capture session lifecycle, and camera resource cleanup.

## System Adapters

Deep links and share sheets are plugin-backed because core Godot does not expose
a portable incoming URL event stream or native share sheet API. Register adapters
for those capabilities and use `@vue-godot/device/system` helpers from app code:

```ts
import { onOpenUrl, share } from '@vue-godot/device/system'
import { registerDeviceCapability } from '@vue-godot/device'

registerDeviceCapability({
  capability: 'deep-links',
  pluginName: 'my-links-plugin',
  getInitialUrl() {
    return myLinksPlugin.getInitialUrl()
  },
  subscribeUrlOpen(handler) {
    return myLinksPlugin.onOpenUrl((url) => handler({ url }))
  },
})

registerDeviceCapability({
  capability: 'share',
  pluginName: 'my-share-plugin',
  async share(data) {
    await mySharePlugin.share(data)
  },
})

onOpenUrl((event) => {
  console.log(event.url)
})

await share({
  text: 'Share this from Vue Godot',
  url: 'https://example.com',
})
```

Native notification plugins can either be used through the browser-shaped
`Notification` wrapper or directly through
`showNativeNotification()` from `@vue-godot/device/system`.

## Media Stream Shape

`MediaDevicesAdapter.getUserMedia()` returns a backend-neutral stream:

```ts
{
  id: 'stream-id',
  getTracks() {
    return [
      {
        id: 'camera-track',
        kind: 'video',
        label: 'Back camera',
        stop() {
          myCameraPlugin.stop()
        },
      },
    ]
  },
}
```

The browser package wraps this in `GodotMediaStream` and
`GodotMediaStreamTrack`. Native plugins still own device enumeration, capture
format, permission prompts, and platform-specific resources.

## Testing Adapters

Use isolated adapters in unit tests and unregister them in `finally` blocks:

```ts
const unregister = registerDeviceCapability({
  capability: 'permissions',
  pluginName: 'test-permissions',
  queryPermission({ name }) {
    return name === 'camera' ? 'granted' : 'unknown'
  },
})

try {
  // test code
} finally {
  unregister()
}
```

For release candidates, adapter unit tests are not enough. Camera, microphone,
geolocation, notifications, and share-sheet behavior need real editor, desktop,
Android, or iOS smoke coverage depending on the platforms you intend to ship.
