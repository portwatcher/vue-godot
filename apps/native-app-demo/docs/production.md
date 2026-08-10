# Production Export Guide

This project is ready for local Vue/Godot development, but production exports
need explicit platform setup. Run this checklist before making release builds.

## Build The Vue Bundle

```bash
npm run build
npm run setup:runtime
npm run check:exports
npx vue-godot doctor
```

Godot loads `dist/app.js`, so build before exporting. Keep `vue/`, `gen/`, and
`typings/` ignored by Godot scans; the generated `.gdignore` files handle this.

## Desktop Exports

- Install official export templates matching your stock Godot version.
- Verify the installed `godot-js-runtime` desktop target before exporting.
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

Before testing Android exports, open the SDK checks screen in the app and run
the production-profile check batch. It exercises the maintained SDK API set,
including fetch, WebSocket constructor support, reachability,
`navigator.onLine`, storage, permissions, clipboard, geolocation/media adapter
states, vibration, sensors, `SafeAreaView`, and `KeyboardAvoidingView`.
The screen also logs every result with a `[native-release-checks]` prefix for
logcat filtering. For the restart and lifecycle rows, run the screen once, force
stop and restart the app, run it again, press Android Back from a nested screen,
background/foreground the app, and run the screen one final time.

For unattended device or simulator runs, launch the app with
`VUE_GODOT_RELEASE_CHECKS=1`. The app runs the same production-profile check
batch after startup, prints the `[native-release-checks]` summary and result
rows, prints `[native-release-checks] native-app-demo passed` when there are no
failures, and exits with status `1` if any check fails.
Set `VUE_GODOT_RELEASE_CHECKS_DELAY_MS` when the test harness needs time to
background/foreground the app before the check batch starts.

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

Install the standalone runtime and official export templates before running the
Godot export:

```bash
npm run setup:runtime
npm run verify:runtime
# From the monorepo when preparing the pinned official templates:
npm run setup:godot-templates
```

The runtime ships device arm64 and simulator arm64/x86_64 XCFramework slices.
Godot's project-only export produces the Xcode project; a signed physical-device
launch still requires an Apple development team and provisioning profile.
Native notification and share-sheet plugins may require additional entitlements,
capabilities, or plugin-specific setup.

When running a simulator build through `simctl`, pass the unattended release
check flag through the simulator environment:

```bash
SIMCTL_CHILD_VUE_GODOT_RELEASE_CHECKS=1 xcrun simctl launch --terminate-running-process booted org.vuegodot.nativeappdemo
SIMCTL_CHILD_VUE_GODOT_RELEASE_CHECKS=1 SIMCTL_CHILD_VUE_GODOT_RELEASE_CHECKS_DELAY_MS=8000 xcrun simctl launch --terminate-running-process booted org.vuegodot.nativeappdemo
```

## Web Exports

Install the threaded Web runtime target and use official Godot's Web export
templates. Serve the export with COOP/COEP headers so the runtime worker is
cross-origin isolated. Test networking, file access, audio/video, and any
plugin-backed capability in the exported Web build.

## Export Setting Check

`npm run check:exports` delegates to `vue-godot doctor --exports-only`. It
scans `vue/` and `src/` for selected APIs and prints warnings when matching
Android permissions or iOS plist keys are missing from `export_presets.cfg`.
Run `npx vue-godot doctor` for the broader local setup check covering package
installs, stock-Godot typings, Vite/Volar setup, and plugin-backed API hints. These
checks are guardrails, not replacements for real device testing.
