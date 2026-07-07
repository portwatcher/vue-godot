# Production Export Guide

This project is ready for local Vue/Godot development, but production exports
need explicit platform setup. Run this checklist before making release builds.

## Build The Vue Bundle

```bash
npm run build
npm run check:exports
npx vue-godot doctor
```

Godot loads `dist/app.js`, so build before exporting. Keep `vue/`, `gen/`, and
`typings/` ignored by Godot scans; the generated `.gdignore` files handle this.

## Desktop Exports

- Install the Godot export templates for your GodotJS editor version.
- Create Windows, macOS, and Linux export presets in Godot.
- Include `dist/app.js` and `dist/chunks/*.js` in exported resources.
- Test the exported binary, not only editor play mode.

## Android Exports

Create an Android export preset and enable the permissions required by the APIs
your app actually uses:

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

Before recording Android evidence, open the `Release checks` screen in the app
and run the production-profile check batch. It exercises the maintained release
API set, including fetch, WebSocket constructor support, reachability,
`navigator.onLine`, storage, permissions, clipboard, geolocation/media adapter
states, vibration, sensors, `SafeAreaView`, and `KeyboardAvoidingView`.
The screen also logs every result with a `[native-release-checks]` prefix for
logcat evidence. For the restart and lifecycle rows, run the screen once, force
stop and restart the app, run it again, press Android Back from a nested screen,
background/foreground the app, and run the screen one final time.

## iOS Exports

The checked-in `iOS Release` preset exports an Xcode project
(`application/export_project_only=true`) and includes plist usage descriptions
for the selected production-profile APIs:

| App capability     | iOS plist key                         |
| ------------------ | ------------------------------------- |
| Camera capture     | `NSCameraUsageDescription`            |
| Microphone capture | `NSMicrophoneUsageDescription`        |
| Geolocation        | `NSLocationWhenInUseUsageDescription` |
| Photo/media access | `NSPhotoLibraryUsageDescription`      |

Install both GodotJS iOS library assets, then assemble the local project-export
package before running the Godot export:

```bash
npm run setup:godotjs -- --release v1.1.0-generate-typings --release-repo godotjs/GodotJS --asset ios-template_debug-4.4-v8 --asset-kind templates --install-templates --godot-bin "$(npm run -s setup:godotjs -- --print-bin)" --print-dir
npm run setup:godotjs -- --release v1.1.0-generate-typings --release-repo godotjs/GodotJS --asset ios-template_release-4.4-v8 --asset-kind templates --install-templates --assemble-ios-package --godot-bin "$(npm run -s setup:godotjs -- --print-bin)" --print-dir
```

The assembled `ios.zip` supports Godot's project-only Xcode export path. Local
iOS simulator execution still requires upstream-compatible GodotJS simulator
template slices plus real Apple signing/team configuration; the published
GodotJS 4.4 V8 iOS assets currently provide device `arm64` static libraries.
Native notification and share-sheet plugins may require additional entitlements,
capabilities, or plugin-specific setup.

## Web Exports

Vue Godot targets GodotJS. Web exports depend on what the selected GodotJS build
and browser sandbox expose. Test networking, file access, audio/video, and any
plugin-backed capability in the exported Web build.

## Export Setting Check

`npm run check:exports` delegates to `vue-godot doctor --exports-only`. It
scans `vue/` and `src/` for selected APIs and prints warnings when matching
Android permissions or iOS plist keys are missing from `export_presets.cfg`.
Run `npx vue-godot doctor` for the broader local setup check covering package
installs, GodotJS typings, Vite/Volar setup, and plugin-backed API hints. These
checks are guardrails, not replacements for real device testing.
