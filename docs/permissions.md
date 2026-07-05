# Permissions And Export Setup

Vue Godot separates permission status, native permission prompts, and export
configuration. Browser-like APIs expose predictable JavaScript behavior, but
platform permission prompts and native plugin setup remain owned by Godot,
GodotJS, or an explicit `@vue-godot/device` adapter.

## Rules

- `navigator.permissions.query()` is query-only. It never calls
  `OS.request_permission()` and never opens a native prompt.
- Direct Godot permission requests live in the
  `@vue-godot/device/permissions` subpath, not in the browser package.
- `installBrowserAPIs()` does not install fake plugin-backed globals when there
  is no native backend. `navigator.geolocation`, `navigator.mediaDevices`, and
  `Notification` require registered adapters.
- Missing adapters, denied permission, unsupported platforms, and export
  misconfiguration are reported through typed errors from `@vue-godot/device`
  or browser-shaped wrapper errors.
- Export permissions must be configured before a release build. The generated
  `scripts/check-export-settings.mjs` warns when source code references APIs
  whose platform export settings may be missing.

## Browser Permission Queries

`navigator.permissions.query()` checks a registered `PermissionAdapter` first.
If there is no adapter, the adapter returns `unknown`, or the adapter cannot
answer, the browser package falls back to built-in Godot checks:

| Permission name | Fallback source |
| --- | --- |
| `camera` | `OS.get_granted_permissions()` includes `android.permission.CAMERA` |
| `microphone` | `OS.get_granted_permissions()` includes `android.permission.RECORD_AUDIO` |
| `geolocation` | `ACCESS_FINE_LOCATION` or `ACCESS_COARSE_LOCATION` is granted |
| `notifications` | `android.permission.POST_NOTIFICATIONS` is granted |
| `clipboard-read`, `clipboard-write` | `DisplayServer` clipboard support |
| `persistent-storage` | `OS.is_userfs_persistent()` |
| `accelerometer`, `gyroscope`, `magnetometer` | Local sensor capability names currently report `granted` |

Unknown names reject with `TypeError` unless a registered `PermissionAdapter`
returns a concrete `granted`, `denied`, or `prompt` state for that name.

## Adapter-Backed APIs

Register native/plugin-backed capabilities before calling `installBrowserAPIs()`
when you want browser-like globals to appear at startup:

```ts
import { installBrowserAPIs } from '@vue-godot/browser'
import { registerDeviceCapability } from '@vue-godot/device'

registerDeviceCapability({
  capability: 'geolocation',
  pluginName: 'my-location-plugin',
  async getCurrentPosition(options) {
    return myLocationPlugin.getCurrentPosition(options)
  },
  watchPosition(onPosition, onError, options) {
    return myLocationPlugin.watchPosition(onPosition, onError, options)
  },
  clearWatch(watchId) {
    myLocationPlugin.clearWatch(watchId)
  },
})

installBrowserAPIs()
```

Adapters should implement `getStatus()` when they can distinguish:

| State | Use when |
| --- | --- |
| `supported` | The API is usable now. |
| `permission-denied` | The user or platform denied access. |
| `missing-plugin` | The required native plugin is not installed or loaded. |
| `export-misconfiguration` | Android permissions, iOS plist keys, entitlements, or export settings are missing. |
| `unsupported-platform` | The current platform cannot provide the capability. |

## Android

Common Android permissions used by Vue Godot APIs:

| API | Android permission |
| --- | --- |
| `fetch()`, `WebSocket`, reachability probes | `android.permission.INTERNET` where required by the export profile |
| `navigator.geolocation` | `android.permission.ACCESS_FINE_LOCATION`, `android.permission.ACCESS_COARSE_LOCATION` |
| `navigator.mediaDevices.getUserMedia({ video: true })`, camera adapters | `android.permission.CAMERA` |
| `navigator.mediaDevices.getUserMedia({ audio: true })`, microphone adapters | `android.permission.RECORD_AUDIO` |
| `navigator.vibrate()` | `android.permission.VIBRATE` |
| `Notification` | `android.permission.POST_NOTIFICATIONS` on Android 13+ |

Runtime requests such as `OS.request_permission()` are not called by the browser
package. Request permissions from your app or native plugin, then expose the
result through a `PermissionAdapter` or capability-specific adapter. Apps that
want to call Godot directly can import:

```ts
import {
  AndroidPermissions,
  onPermissionResult,
  requestPermission,
} from '@vue-godot/device/permissions'

const subscription = onPermissionResult(({ name, granted }) => {
  console.log(`${name}: ${granted ? 'granted' : 'denied'}`)
})

requestPermission(AndroidPermissions.Camera)
```

`requestPermission(name)` wraps `OS.request_permission(name)`.
`requestDangerousPermissions()` wraps `OS.request_permissions()` for Android's
dangerous permission set. `onPermissionResult()` listens to
`MainLoop.on_request_permissions_result`; disconnect the returned subscription
when the screen or integration module is torn down.

## iOS And Apple Platforms

Godot and native plugins own iOS, macOS, and visionOS permission prompts and
entitlements. `OS.get_granted_permissions()` exposes saved sandbox folder
grants on macOS, and `@vue-godot/device/permissions` exposes
`listGrantedPermissions()` plus `revokeGrantedPermissions()` for that Godot
surface. General camera, microphone, location, notification, and visionOS
prompts still need platform-native code or plugin-backed adapters that document
the exact plist keys or entitlements they need. Typical examples include:

| API | Common Apple setup |
| --- | --- |
| Geolocation | Location usage description keys required by the native location plugin |
| Camera | Camera usage description key |
| Microphone | Microphone usage description key |
| Notifications | User notification authorization and platform notification setup |

If a required key or entitlement is absent, adapters should report
`export-misconfiguration` so browser wrappers can reject with the corresponding
browser-shaped error.

## Generated Export Check

Generated projects include `npm run check:exports`, which scans Vue/source files
for export-sensitive API references and prints platform setup warnings. It is a
guardrail, not a substitute for real device testing. Keep the script warnings in
sync with the APIs your app actually uses.
