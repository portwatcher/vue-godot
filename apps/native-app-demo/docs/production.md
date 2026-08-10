# Production Export Guide

This project is ready for local Vue/Godot development, but production exports
need explicit platform setup. Run this checklist before making release builds.

## Build The Vue Bundle

```bash
npm run gen:types
npm run build
npm run check:exports
npx vue-godot doctor
```

Use an official Godot editor supported by the installed GodotJS version.
Download the universal GodotJS release ZIP and extract it at the project root;
`addons/godotjs/godotjs.gdextension` must exist. Godot loads `dist/app.js`, so
build before exporting. Keep
`node_modules/`, `vue/`, `gen/`, and `typings/` ignored by Godot scans; the
generated `.gdignore` files prevent installed extension copies and development
sources from being registered as project resources.

## Desktop Exports

- Install the official Godot export templates matching the editor version.
- Keep the complete universal `addons/godotjs` bundle. It includes both modes
  for every supported platform.

- Create Windows, macOS, and Linux export presets in Godot.
- Include `dist/app.js` and `dist/chunks/*.js` in exported resources.
- Keep `addons/godotjs/` in the exported project resources.
- Test the exported binary, not only editor play mode.

## Android Exports

Create an official Godot Android export preset and enable the
permissions required by the APIs your app actually uses. Verify every ABI
included in the APK/AAB and launch at least the arm64 build on a device or AVD.

| App capability                                       | Android permission / export setting                                                          |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Network requests, WebSocket, reachability probes     | `android.permission.INTERNET`                                                                |
| Camera capture or `getUserMedia({ video: ... })`     | `android.permission.CAMERA`                                                                  |
| Microphone capture or `getUserMedia({ audio: ... })` | `android.permission.RECORD_AUDIO`                                                            |
| Handheld vibration                                   | `android.permission.VIBRATE`                                                                 |
| Notifications on Android 13+                         | `android.permission.POST_NOTIFICATIONS`                                                      |
| Geolocation                                          | `android.permission.ACCESS_FINE_LOCATION` and/or `android.permission.ACCESS_COARSE_LOCATION` |

Native plugin-backed capabilities may also require Gradle build settings, plugin
repositories, AAR files, or custom manifest entries. Keep those requirements in
the app repository next to the adapter registration code.

## iOS Exports

Create an official Godot iOS export preset and add plist usage descriptions for selected
APIs. Unsigned export/link checks do not replace a signed physical-device launch
before release:

| App capability     | iOS plist key                         |
| ------------------ | ------------------------------------- |
| Camera capture     | `NSCameraUsageDescription`            |
| Microphone capture | `NSMicrophoneUsageDescription`        |
| Geolocation        | `NSLocationWhenInUseUsageDescription` |
| Photo/media access | `NSPhotoLibraryUsageDescription`      |

Native notification and share-sheet plugins may require additional entitlements,
capabilities, or plugin-specific setup.

## Web Exports

Use official Godot's threaded Web export. Serve the files with WebAssembly MIME and
COOP/COEP headers so the engine worker is cross-origin isolated. The runtime's
release gate launches both modes in Chrome; application-specific networking,
file access, audio/video, and plugin-backed capabilities still need exported
browser validation.

## Export Setting Check

`npm run check:exports` delegates to `vue-godot doctor --exports-only`. It
scans `vue/` and `src/` for selected APIs and prints warnings when matching
Android permissions or iOS plist keys are missing from `export_presets.cfg`.
Run `npx vue-godot doctor` for the broader local setup check covering package
installs, the manually copied GodotJS add-on, stock-Godot declarations, Vite/Volar
setup, and plugin-backed API hints. These checks are guardrails, not
replacements for real device testing.
