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
