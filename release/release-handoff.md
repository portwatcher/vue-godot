# Release Handoff

- Release candidate commit: `43f76a37f9885a3f656127479e810212ef1ffd85`
- Overall readiness: open (10 blocker(s))
- Real-device evidence: waiting
- Android evidence: waiting
- iOS evidence: waiting
- Release Preflight evidence: waiting
- Public warning removal: waiting

## Current Blockers

- TODO.md:26 Android and iOS export smoke apps run on real or hosted devices for the production profile.
- TODO.md:34 The wording "not production ready", "alpha", and "experimental" is removed only after all criteria above are satisfied.
- TODO.md:389 Android export with selected device APIs has been tested.
- TODO.md:390 iOS export with selected device APIs has been tested.
- TODO.md:391 CI passes on a clean commit.
- TODO.md:392 Release preflight passes without warnings in the release environment.
- TODO.md:394 All public READMEs match the final support claims.
- TODO.md:395 The root README warning is removed in the same commit that marks this checklist complete.
- real-device evidence missing at release/real-device-evidence.json; Create release/real-device-evidence.json after completing docs/real-device-release.md, then run npm run check:real-device-evidence.; Real device evidence file not found: release/real-device-evidence.json
- release-readiness evidence missing at release/release-readiness-evidence.json; Create it after the Release Preflight workflow passes without warnings.; Release-readiness evidence file not found: release/release-readiness-evidence.json

## CI Evidence

- Status: ready
- Path: `release/ci-runs.json`
- Check: https://github.com/portwatcher/vue-godot/actions/runs/28768381979 (success)
- Godot Smoke: https://github.com/portwatcher/vue-godot/actions/runs/28768391129 (success)

## Platform Evidence

- Status: waiting (69 blocker(s))
- Path: `release/platform-evidence.json`

### Android

- Status: waiting (34 blocker(s))
- Required checks complete: 0/14
- Metadata gaps: `artifact`, `deviceModel`, `osVersion`, `orientation`, `locale`
- Must-pass remaining: `cold-launch`, `no-godotjs-load-diagnostics`, `storage-restart`, `network-if-selected`, `clipboard-if-selected`, `permission-prompts-if-selected`, `adapter-states-if-selected`, `hardware-adapters-if-selected`, `haptics-if-selected`, `audio-input-if-selected`, `sensors-if-selected`, `safe-area-keyboard`, `android-back-handling`, `background-foreground`
- Skippable remaining: none
- Remaining check details:
  - `cold-launch` (must pass): Install the exported build, cold launch into the main scene, and confirm the app reaches the expected UI.
  - `no-godotjs-load-diagnostics` (must pass): Confirm the device logs do not show GodotJS missing-module, script-load, chunk-load, asset-load, or signal wiring diagnostics.
  - `storage-restart` (must pass; selected APIs: localStorage, sessionStorage): Write and read the selected storage APIs, restart the app, and confirm persisted state is restored from user://.
  - `network-if-selected` (must pass; selected APIs: fetch, WebSocket, checkNetworkReachability, navigator.onLine): Exercise fetch, WebSocket, and reachability or online/offline behavior when network APIs are selected.
  - `clipboard-if-selected` (must pass; selected APIs: navigator.clipboard): Verify selected clipboard read/write APIs and denied or unsupported states on the exported device build.
  - `permission-prompts-if-selected` (must pass; selected APIs: navigator.permissions.query, navigator.geolocation, navigator.mediaDevices.getUserMedia, navigator.vibrate): Verify permission prompts, granted states, denied states, and plugin-managed permission fallbacks for selected capabilities.
  - `adapter-states-if-selected` (must pass; selected APIs: navigator.geolocation, navigator.mediaDevices.getUserMedia): Verify unsupported platform, missing plugin, export misconfiguration, permission denied, and success states for selected adapters.
  - `hardware-adapters-if-selected` (must pass; selected APIs: navigator.geolocation, navigator.mediaDevices.getUserMedia): Verify selected camera, geolocation, media device, or other hardware-backed adapters on real or hosted hardware.
  - `haptics-if-selected` (must pass; selected APIs: navigator.vibrate): Verify handheld or controller vibration APIs report support accurately and run successfully when selected.
  - `audio-input-if-selected` (must pass; selected APIs: navigator.mediaDevices.getUserMedia): Verify microphone/audio input permissions, stream setup, and captured audio frames or adapter success states when selected.
  - `sensors-if-selected` (must pass; selected APIs: readDeviceMotion): Verify accelerometer, gyroscope, magnetometer, gravity, or device motion/orientation values when selected.
  - `safe-area-keyboard` (must pass; selected APIs: SafeAreaView, KeyboardAvoidingView): Verify SafeAreaView and KeyboardAvoidingView behavior with the Android virtual keyboard and tested orientations.
  - `android-back-handling` (must pass): Verify Android back handling from nested screens, modal/dialog states, and the app root.
  - `background-foreground` (must pass): Background and foreground the app, then confirm resources, adapters, and app state resume correctly.

### iOS

- Status: waiting (35 blocker(s))
- Required checks complete: 0/15
- Metadata gaps: `artifact`, `deviceModel`, `osVersion`, `orientation`, `locale`
- Must-pass remaining: `cold-launch`, `no-godotjs-load-diagnostics`, `plist-entitlements`, `storage-restart`, `network-if-selected`, `clipboard-if-selected`, `permission-prompts-if-selected`, `adapter-states-if-selected`, `hardware-adapters-if-selected`, `haptics-if-selected`, `audio-input-if-selected`, `sensors-if-selected`, `safe-area-keyboard-rotation-text-input`, `background-foreground`
- Skippable remaining: `deep-links-share-notifications-if-selected`
- Remaining check details:
  - `cold-launch` (must pass): Install the exported build, cold launch into the main scene, and confirm the app reaches the expected UI.
  - `no-godotjs-load-diagnostics` (must pass): Confirm the device logs do not show GodotJS missing-module, script-load, chunk-load, asset-load, or signal wiring diagnostics.
  - `plist-entitlements` (must pass): Confirm iOS usage descriptions, entitlements, associated domains, and plugin files are present for selected capabilities.
  - `storage-restart` (must pass; selected APIs: localStorage, sessionStorage): Write and read the selected storage APIs, restart the app, and confirm persisted state is restored from user://.
  - `network-if-selected` (must pass; selected APIs: fetch, WebSocket, checkNetworkReachability, navigator.onLine): Exercise fetch, WebSocket, and reachability or online/offline behavior when network APIs are selected.
  - `clipboard-if-selected` (must pass; selected APIs: navigator.clipboard): Verify selected clipboard read/write APIs and denied or unsupported states on the exported device build.
  - `permission-prompts-if-selected` (must pass; selected APIs: navigator.permissions.query, navigator.geolocation, navigator.mediaDevices.getUserMedia): Verify permission prompts, granted states, denied states, and plugin-managed permission fallbacks for selected capabilities.
  - `adapter-states-if-selected` (must pass; selected APIs: navigator.geolocation, navigator.mediaDevices.getUserMedia): Verify unsupported platform, missing plugin, export misconfiguration, permission denied, and success states for selected adapters.
  - `hardware-adapters-if-selected` (must pass; selected APIs: navigator.geolocation, navigator.mediaDevices.getUserMedia): Verify selected camera, geolocation, media device, or other hardware-backed adapters on real or hosted hardware.
  - `haptics-if-selected` (must pass; selected APIs: navigator.vibrate): Verify handheld or controller vibration APIs report support accurately and run successfully when selected.
  - `audio-input-if-selected` (must pass; selected APIs: navigator.mediaDevices.getUserMedia): Verify microphone/audio input permissions, stream setup, and captured audio frames or adapter success states when selected.
  - `sensors-if-selected` (must pass; selected APIs: readDeviceMotion): Verify accelerometer, gyroscope, magnetometer, gravity, or device motion/orientation values when selected.
  - `safe-area-keyboard-rotation-text-input` (must pass; selected APIs: SafeAreaView, KeyboardAvoidingView): Verify safe area, virtual keyboard, rotation, and text input behavior on the tested iPhone or iPad family.
  - `background-foreground` (must pass): Background and foreground the app, then confirm resources, adapters, and app state resume correctly.
  - `deep-links-share-notifications-if-selected` (skippable): Verify cold-start and warm-start deep links, share sheets, and notification delivery when those adapters are selected.

## Final TODO Proofs

- Ready: 2/10
- TODO.md:26 Android and iOS export smoke apps run on real or hosted devices for the production profile. (realDeviceEvidenceReady waiting)
- TODO.md:34 The wording "not production ready", "alpha", and "experimental" is removed only after all criteria above are satisfied. (warningWordingReady waiting)
- TODO.md:389 Android export with selected device APIs has been tested. (androidRealDeviceEvidenceReady waiting)
- TODO.md:390 iOS export with selected device APIs has been tested. (iosRealDeviceEvidenceReady waiting)
- TODO.md:391 CI passes on a clean commit. (ciEvidenceReady waiting)
- TODO.md:392 Release preflight passes without warnings in the release environment. (releaseReadinessEvidenceReady waiting)
- TODO.md:394 All public READMEs match the final support claims. (publicReadmesReady waiting)
- TODO.md:395 The root README warning is removed in the same commit that marks this checklist complete. (rootReadmeWarningReady waiting)

## Next Actions

### Complete Android and iOS real-device export evidence

Run the local check and selected API export checks on real or hosted devices, reuse the platform worksheet when it exists, then assemble and validate release/real-device-evidence.json for the tested release commit. Android: 5 metadata field(s) missing, 14/14 required check(s) unresolved, 14 must-pass check(s) missing; iOS: 5 metadata field(s) missing, 15/15 required check(s) unresolved, 14 must-pass check(s) missing Android missing metadata: artifact, deviceModel, osVersion, orientation, locale Android must-pass remaining: cold-launch, no-godotjs-load-diagnostics, storage-restart, network-if-selected, clipboard-if-selected, permission-prompts-if-selected, adapter-states-if-selected, hardware-adapters-if-selected, haptics-if-selected, audio-input-if-selected, sensors-if-selected, safe-area-keyboard, android-back-handling, background-foreground iOS missing metadata: artifact, deviceModel, osVersion, orientation, locale iOS must-pass remaining: cold-launch, no-godotjs-load-diagnostics, plist-entitlements, storage-restart, network-if-selected, clipboard-if-selected, permission-prompts-if-selected, adapter-states-if-selected, hardware-adapters-if-selected, haptics-if-selected, audio-input-if-selected, sensors-if-selected, safe-area-keyboard-rotation-text-input, background-foreground iOS skippable remaining: deep-links-share-notifications-if-selected Android remaining check details: cold-launch (must pass): Install the exported build, cold launch into the main scene, and confirm the app reaches the expected UI.; no-godotjs-load-diagnostics (must pass): Confirm the device logs do not show GodotJS missing-module, script-load, chunk-load, asset-load, or signal wiring diagnostics.; storage-restart (must pass; selected APIs: localStorage, sessionStorage): Write and read the selected storage APIs, restart the app, and confirm persisted state is restored from user://.; network-if-selected (must pass; selected APIs: fetch, WebSocket, checkNetworkReachability, navigator.onLine): Exercise fetch, WebSocket, and reachability or online/offline behavior when network APIs are selected.; clipboard-if-selected (must pass; selected APIs: navigator.clipboard): Verify selected clipboard read/write APIs and denied or unsupported states on the exported device build.; permission-prompts-if-selected (must pass; selected APIs: navigator.permissions.query, navigator.geolocation, navigator.mediaDevices.getUserMedia, navigator.vibrate): Verify permission prompts, granted states, denied states, and plugin-managed permission fallbacks for selected capabilities.; adapter-states-if-selected (must pass; selected APIs: navigator.geolocation, navigator.mediaDevices.getUserMedia): Verify unsupported platform, missing plugin, export misconfiguration, permission denied, and success states for selected adapters.; hardware-adapters-if-selected (must pass; selected APIs: navigator.geolocation, navigator.mediaDevices.getUserMedia): Verify selected camera, geolocation, media device, or other hardware-backed adapters on real or hosted hardware.; haptics-if-selected (must pass; selected APIs: navigator.vibrate): Verify handheld or controller vibration APIs report support accurately and run successfully when selected.; audio-input-if-selected (must pass; selected APIs: navigator.mediaDevices.getUserMedia): Verify microphone/audio input permissions, stream setup, and captured audio frames or adapter success states when selected.; sensors-if-selected (must pass; selected APIs: readDeviceMotion): Verify accelerometer, gyroscope, magnetometer, gravity, or device motion/orientation values when selected.; safe-area-keyboard (must pass; selected APIs: SafeAreaView, KeyboardAvoidingView): Verify SafeAreaView and KeyboardAvoidingView behavior with the Android virtual keyboard and tested orientations.; android-back-handling (must pass): Verify Android back handling from nested screens, modal/dialog states, and the app root.; background-foreground (must pass): Background and foreground the app, then confirm resources, adapters, and app state resume correctly. iOS remaining check details: cold-launch (must pass): Install the exported build, cold launch into the main scene, and confirm the app reaches the expected UI.; no-godotjs-load-diagnostics (must pass): Confirm the device logs do not show GodotJS missing-module, script-load, chunk-load, asset-load, or signal wiring diagnostics.; plist-entitlements (must pass): Confirm iOS usage descriptions, entitlements, associated domains, and plugin files are present for selected capabilities.; storage-restart (must pass; selected APIs: localStorage, sessionStorage): Write and read the selected storage APIs, restart the app, and confirm persisted state is restored from user://.; network-if-selected (must pass; selected APIs: fetch, WebSocket, checkNetworkReachability, navigator.onLine): Exercise fetch, WebSocket, and reachability or online/offline behavior when network APIs are selected.; clipboard-if-selected (must pass; selected APIs: navigator.clipboard): Verify selected clipboard read/write APIs and denied or unsupported states on the exported device build.; permission-prompts-if-selected (must pass; selected APIs: navigator.permissions.query, navigator.geolocation, navigator.mediaDevices.getUserMedia): Verify permission prompts, granted states, denied states, and plugin-managed permission fallbacks for selected capabilities.; adapter-states-if-selected (must pass; selected APIs: navigator.geolocation, navigator.mediaDevices.getUserMedia): Verify unsupported platform, missing plugin, export misconfiguration, permission denied, and success states for selected adapters.; hardware-adapters-if-selected (must pass; selected APIs: navigator.geolocation, navigator.mediaDevices.getUserMedia): Verify selected camera, geolocation, media device, or other hardware-backed adapters on real or hosted hardware.; haptics-if-selected (must pass; selected APIs: navigator.vibrate): Verify handheld or controller vibration APIs report support accurately and run successfully when selected.; audio-input-if-selected (must pass; selected APIs: navigator.mediaDevices.getUserMedia): Verify microphone/audio input permissions, stream setup, and captured audio frames or adapter success states when selected.; sensors-if-selected (must pass; selected APIs: readDeviceMotion): Verify accelerometer, gyroscope, magnetometer, gravity, or device motion/orientation values when selected.; safe-area-keyboard-rotation-text-input (must pass; selected APIs: SafeAreaView, KeyboardAvoidingView): Verify safe area, virtual keyboard, rotation, and text input behavior on the tested iPhone or iPad family.; background-foreground (must pass): Background and foreground the app, then confirm resources, adapters, and app state resume correctly.; deep-links-share-notifications-if-selected (skippable): Verify cold-start and warm-start deep links, share sheets, and notification delivery when those adapters are selected.

```bash
npm run check
npm run release:record-platform-evidence -- --platform android --platform-evidence release/platform-evidence.json --artifact <android-apk-aab-or-hosted-build-id> --export-preset <android-export-preset> --device <android-device-model> --os <android-os-version> --orientation <tested-orientations> --locale <tested-locale> --pass-remaining --summary-output release/platform-evidence-summary.json --expected-commit 43f76a37f9885a3f656127479e810212ef1ffd85
npm run release:record-platform-evidence -- --platform ios --platform-evidence release/platform-evidence.json --artifact <ios-archive-testflight-or-hosted-build-id> --export-preset <ios-export-preset> --device <ios-device-model> --os <ios-version> --orientation <tested-orientations> --locale <tested-locale> --pass-remaining --summary-output release/platform-evidence-summary.json --expected-commit 43f76a37f9885a3f656127479e810212ef1ffd85
npm run check:platform-evidence -- --platform-evidence release/platform-evidence.json --summary-output release/platform-evidence-summary.json --allow-open --expected-commit 43f76a37f9885a3f656127479e810212ef1ffd85
npm run check:platform-evidence -- --platform-evidence release/platform-evidence.json --expected-commit 43f76a37f9885a3f656127479e810212ef1ffd85
npm run release:evidence -- --platform-evidence release/platform-evidence.json --ci-evidence release/ci-runs.json --commit 43f76a37f9885a3f656127479e810212ef1ffd85 --real-device-output release/real-device-evidence.json
npm run check:real-device-evidence -- --expected-commit 43f76a37f9885a3f656127479e810212ef1ffd85
git add release/platform-evidence.json release/ci-runs.json release/real-device-evidence.json
git commit -m "Add real-device release evidence"
git push
```

### Collect CI and warning-free Release Preflight evidence

Blocked by: `real-device-evidence`

Run the local check after the tested release candidate and real-device evidence are pushed, refresh Check and Godot Smoke from the release-candidate ref when CI evidence is still missing, then dispatch Release Preflight from the current evidence commit ref and write release-readiness evidence.

```bash
npm run check
npm run release:ci -- --commit 43f76a37f9885a3f656127479e810212ef1ffd85 --include-release-preflight --release-preflight-run-commit "$(git rev-parse HEAD)" --wait --output release/ci-runs.json
GH_TOKEN="$(gh auth token)" npm run release:ci -- --commit 43f76a37f9885a3f656127479e810212ef1ffd85 --include-release-preflight --release-preflight-run-commit "$(git rev-parse HEAD)" --dispatch-missing --wait --ref <evidence-branch-or-tag> --real-device-evidence-path release/real-device-evidence.json --output release/ci-runs.json
GH_TOKEN="$(gh auth token)" npm run release:preflight-summary -- --ci-evidence release/ci-runs.json --commit 43f76a37f9885a3f656127479e810212ef1ffd85 --output release/release-preflight-summary.json
npm run release:evidence -- --platform-evidence release/platform-evidence.json --ci-evidence release/ci-runs.json --commit 43f76a37f9885a3f656127479e810212ef1ffd85 --real-device-output release/real-device-evidence.json --release-preflight-summary release/release-preflight-summary.json --readiness-output release/release-readiness-evidence.json
git add release/ci-runs.json release/release-preflight-summary.json release/real-device-evidence.json release/release-readiness-evidence.json
git commit -m "Add release readiness evidence"
git push
npm run release:readiness -- --expected-commit 43f76a37f9885a3f656127479e810212ef1ffd85
```

### Remove public warning wording through the guarded finalizer

Blocked by: `real-device-evidence`, `release-preflight-evidence`

Only run the finalizer after strict release readiness evidence is complete; it applies the final TODO checks, removes public warning wording, then stages and commits those edits before the final strict readiness check.

```bash
npm run release:readiness -- --summary-output /tmp/vue-godot-readiness.json --expected-commit 43f76a37f9885a3f656127479e810212ef1ffd85
npm run release:finalize-readiness -- --summary /tmp/vue-godot-readiness.json
npm run check
git add TODO.md README.md docs/compatibility.md docs/production.md docs/real-device-release.md
git commit -m "Finalize production readiness"
git push
npm run release:readiness -- --expected-commit 43f76a37f9885a3f656127479e810212ef1ffd85
```

