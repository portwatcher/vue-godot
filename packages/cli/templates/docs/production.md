# Production Export Guide

This project is ready for local Vue/Godot development, but production exports
need explicit platform setup. Run this checklist before making release builds.

## Build The Vue Bundle

```bash
npm run setup:runtime
npm run verify:runtime
npm run build
npm run check:exports
npx vue-godot doctor
```

Use an official Godot editor supported by the installed `godot-js-runtime`
version. The setup command installs the host extension and generates matching
declarations; verification checks every manifest-owned runtime file before an
export. Godot loads `dist/app.js`, so build before exporting. Keep
`node_modules/`, `vue/`, `gen/`, and `typings/` ignored by Godot scans; the
generated `.gdignore` files prevent installed extension copies and development
sources from being registered as project resources.

## Desktop Exports

- Install the official Godot export templates matching the editor version.
- Add the runtime artifact required by each export preset, for example:

  ```bash
  npm run add-target:runtime -- linux.template_release.x86_64
  npm run verify:runtime
  ```

  Run `npx godot-js-runtime targets` to list artifacts shipped by the installed
  runtime package.

- Create Windows, macOS, and Linux export presets in Godot.
- Include `dist/app.js` and `dist/chunks/*.js` in exported resources.
- Keep `addons/godot-js-runtime/` in the exported project resources.
- Test the exported binary, not only editor play mode.

## Android Exports

Install the required Android runtime ABI artifacts, create an official Godot
Android export preset, and enable the permissions required by the APIs your app
actually uses:

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

Install the required iOS runtime slices, create an official Godot iOS export
preset, and add plist usage descriptions for selected APIs:

| App capability     | iOS plist key                         |
| ------------------ | ------------------------------------- |
| Camera capture     | `NSCameraUsageDescription`            |
| Microphone capture | `NSMicrophoneUsageDescription`        |
| Geolocation        | `NSLocationWhenInUseUsageDescription` |
| Photo/media access | `NSPhotoLibraryUsageDescription`      |

Native notification and share-sheet plugins may require additional entitlements,
capabilities, or plugin-specific setup.

## Web Exports

Web export requires a `wasm32` runtime artifact and an official Godot export
mode that supports GDExtension. A packaged runtime may not include that target
yet; confirm it with `npx godot-js-runtime targets` before creating a Web
preset. Treat Web as unsupported unless the target is listed and the exported
app passes its automated browser smoke. Browser sandbox restrictions still
apply to networking, file access, audio/video, and plugin-backed capabilities.

## Export Setting Check

`npm run check:exports` delegates to `vue-godot doctor --exports-only`. It
scans `vue/` and `src/` for selected APIs and prints warnings when matching
Android permissions or iOS plist keys are missing from `export_presets.cfg`.
Run `npx vue-godot doctor` for the broader local setup check covering package
installs, runtime-manifest checksums, stock-Godot declarations, Vite/Volar
setup, and plugin-backed API hints. These checks are guardrails, not
replacements for real device testing.
