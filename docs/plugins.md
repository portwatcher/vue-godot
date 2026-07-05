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
