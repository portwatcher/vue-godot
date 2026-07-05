# @vue-godot/device

Device and native capability adapters for Vue Godot.

This package provides a small capability layer for APIs that depend on platform
support, export settings, runtime permissions, or native/Godot plugins. It does
not install browser globals by itself and does not synthesize fake backends when
no real adapter is registered.

See the repository [compatibility checklist](../../docs/compatibility.md) for
current support status and platform caveats, and
[permissions and export setup](../../docs/permissions.md) for native capability
requirements. See the [plugin adapter guide](../../docs/plugins.md) for adapter
implementation guidance.

## Installation

```bash
npm install @vue-godot/device
```

## Quick Start

Register an adapter from a native plugin or app integration module:

```ts
import {
  isSupported,
  registerDeviceCapability,
  requireCapability,
} from '@vue-godot/device'

const unregister = registerDeviceCapability({
  capability: 'geolocation',
  pluginName: 'my-location-plugin',
  async isSupported() {
    return true
  },
})

if (await isSupported('geolocation')) {
  await requireCapability('geolocation')
}

unregister()
```

## Provided APIs

| API | Description |
| --- | --- |
| `DeviceCapabilityRegistry` | Isolated registry for capability adapters. Useful in tests or multiple integration layers. |
| `deviceCapabilities` | Shared default registry used by the top-level helper functions. |
| `registerDeviceCapability(adapter)` | Registers a capability adapter and returns an unregister function. |
| `unregisterDeviceCapability(capability, adapter?)` | Removes a registered adapter. |
| `getCapabilityStatus(capability)` | Returns a typed status object for a capability. |
| `isSupported(capability)` | Returns `true` only when a registered adapter reports `supported`. |
| `requireCapability(capability)` | Resolves with the supported status or rejects with `DeviceCapabilityError`. |
| `DeviceCapabilityError` | Typed error with `code` and `capability` fields. |
| `createDeviceCapabilityError()` | Constructs a typed capability error. |
| `normalizeDeviceCapabilityError()` | Preserves typed errors and wraps unknown errors. |
| Adapter interfaces | `GeolocationAdapter`, `MediaDevicesAdapter`, `NotificationAdapter`, `PermissionAdapter`, and generic `DeviceCapabilityAdapter`. |
| `@vue-godot/device/clipboard` | Godot-backed text, primary-selection text, and image-read clipboard helpers. Imported from a subpath so the root package stays backend-neutral outside Godot. |
| `@vue-godot/device/haptics` | Godot-backed handheld and joypad/controller vibration helpers. Imported from a subpath so the root package stays backend-neutral outside Godot. |
| `@vue-godot/device/microphone` | Godot-backed microphone and audio-bus capture helpers. Imported from a subpath so the root package stays backend-neutral outside Godot. |
| `@vue-godot/device/permissions` | Godot-backed permission helpers for Android runtime requests, permission result events, and granted-permission lists. Imported from a subpath so the root package stays backend-neutral outside Godot. |
| `@vue-godot/device/sensors` | Godot-backed accelerometer, gravity, gyroscope, magnetometer, motion, and orientation snapshot helpers. Imported from a subpath so the root package stays backend-neutral outside Godot. |

## Capability Status

Statuses are intentionally small and predictable:

| State | Meaning |
| --- | --- |
| `supported` | A registered adapter says the capability is usable now. |
| `unsupported-platform` | The adapter exists, but the current platform/runtime cannot provide the capability. |
| `permission-denied` | The platform or user denied permission. |
| `missing-plugin` | No adapter/plugin is registered, or a required plugin is unavailable. |
| `export-misconfiguration` | The app is missing export settings, Android permissions, iOS plist keys, or equivalent platform setup. |

`requireCapability()` rejects with the same values through
`DeviceCapabilityError.code`, so app code can branch predictably:

```ts
import { DeviceCapabilityError, requireCapability } from '@vue-godot/device'

try {
  await requireCapability('camera')
} catch (error) {
  if (error instanceof DeviceCapabilityError) {
    switch (error.code) {
      case 'missing-plugin':
      case 'export-misconfiguration':
      case 'permission-denied':
      case 'unsupported-platform':
        console.warn(error.message)
        break
    }
  }
}
```

## Adapter Interfaces

The package defines generic and plugin-backed adapter contracts, plus initial
interfaces for geolocation, media capture, notifications, and permissions. These
interfaces are intentionally backend-neutral: Android, iOS, desktop, and Godot
plugin implementations can all register through the same capability registry.

Native implementations should return a `DeviceCapabilityStatus` from
`getStatus()` when they can distinguish permission denial, missing plugins, and
export misconfiguration. Simple adapters can provide `isSupported()` and let the
registry map `false` to `unsupported-platform`.

## Godot Microphone Helpers

Import the built-in Godot audio-input helpers from the `microphone` subpath:

```ts
import {
  attachAudioCaptureEffect,
  createAudioCaptureEffect,
  createMicrophonePlayer,
  listAudioInputDevices,
  readAudioCaptureFrames,
} from '@vue-godot/device/microphone'

const devices = listAudioInputDevices()
const player = createMicrophonePlayer({
  busName: 'Voice',
  autoplay: true,
})

const capture = createAudioCaptureEffect({ bufferLengthSeconds: 0.5 })
attachAudioCaptureEffect(capture, { busName: 'Voice' })

const chunk = readAudioCaptureFrames(capture, 512)
```

These helpers wrap `AudioServer`, `AudioStreamMicrophone`,
`AudioStreamPlayer`, and `AudioEffectCapture`. They do not request runtime
permissions, enable `ProjectSettings.audio/driver/enable_input`, add nodes to a
scene tree, encode recordings, or provide native Android/iOS plugin fallbacks.

## Godot Permission Helpers

Import the built-in Godot permission helpers from the `permissions` subpath:

```ts
import {
  AndroidPermissions,
  listGrantedPermissions,
  onPermissionResult,
  requestPermission,
} from '@vue-godot/device/permissions'

const subscription = onPermissionResult(({ name, granted }) => {
  console.log(`${name}: ${granted ? 'granted' : 'denied'}`)
})

const alreadyGranted = requestPermission(AndroidPermissions.RecordAudio)
const current = listGrantedPermissions()

subscription.disconnect()
```

`requestPermission(name)` wraps `OS.request_permission(name)` and
`requestDangerousPermissions()` wraps `OS.request_permissions()`. Godot exposes
those runtime prompts on Android; the helpers return `false` when the request
cannot be started or is not already granted. `onPermissionResult()` subscribes
to `Engine.get_main_loop().on_request_permissions_result` by default and
returns a `disconnect()` handle.

`listGrantedPermissions()` wraps `OS.get_granted_permissions()`. On Android it
reports granted dangerous permissions. On sandboxed macOS, Godot uses the same
method for user-selected folder grants; `revokeGrantedPermissions()` clears
those saved grants where Godot supports it. iOS, visionOS, and plugin-specific
permission prompts still require explicit native/plugin adapters.

## Godot Clipboard Helpers

Import the built-in Godot clipboard helpers from the `clipboard` subpath:

```ts
import {
  hasClipboardImage,
  readClipboardImage,
  readClipboardText,
  writeClipboardText,
} from '@vue-godot/device/clipboard'

writeClipboardText('Copied')
const text = readClipboardText()

if (hasClipboardImage()) {
  const image = readClipboardImage()
}
```

These helpers wrap `DisplayServer` clipboard methods. Text read/write uses
`clipboard_get()` and `clipboard_set()`. Linux primary selection helpers use
`clipboard_get_primary()` and `clipboard_set_primary()` when the display server
reports `FEATURE_CLIPBOARD_PRIMARY`. Image clipboard support is read-only
because the current Godot typings expose `clipboard_get_image()` and
`clipboard_has_image()`, but no image clipboard setter.

## Godot Haptics Helpers

Import the built-in Godot haptics helpers from the `haptics` subpath:

```ts
import {
  readJoypadVibration,
  startJoypadVibration,
  stopJoypadVibration,
  vibrateHandheld,
} from '@vue-godot/device/haptics'

vibrateHandheld(40)
startJoypadVibration({
  device: 0,
  weakMagnitude: 0.3,
  strongMagnitude: 0.8,
  durationSeconds: 0.4,
})

const rumble = readJoypadVibration(0)
stopJoypadVibration(0)
```

`vibrateHandheld()` wraps `Input.vibrate_handheld()`. On Android, the export
preset must enable the `VIBRATE` permission for hardware vibration to have an
effect. Joypad helpers wrap `Input.start_joy_vibration()`,
`Input.stop_joy_vibration()`, `Input.get_joy_vibration_strength()`, and
`Input.get_joy_vibration_duration()`. Controller support depends on platform,
driver, and connected device capabilities.

## Godot Sensor Helpers

Import the built-in Godot sensor helpers from the `sensors` subpath:

```ts
import {
  readAccelerometer,
  readDeviceMotion,
  readDeviceOrientation,
  readGravity,
} from '@vue-godot/device/sensors'

const acceleration = readAccelerometer()
const gravity = readGravity()
const motion = readDeviceMotion()
const orientation = readDeviceOrientation()
```

These helpers wrap `Input.get_accelerometer()`, `Input.get_gravity()`,
`Input.get_gyroscope()`, and `Input.get_magnetometer()`. Unsupported platforms
or unavailable sensors usually return zero vectors through Godot, and thrown
sensor reads are normalized to zero vectors. `readDeviceMotion()` returns
browser-compatible acceleration and rotation-rate data; `readDeviceOrientation()`
derives best-effort heading and tilt from magnetometer and gravity values. Use
`@vue-godot/browser` when you need browser-style `devicemotion` and
`deviceorientation` events.
