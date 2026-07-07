# Release Handoff

- Release candidate commit: `68f88b1254ba76795a848f14f8ed616ec489dfec`
- Handoff format: 7
- Handoff state: 50078e354592c2b2
- Overall readiness: ready (0 blocker(s))
- Real-device evidence: ready
- Android evidence: ready
- iOS evidence: ready
- Release Preflight evidence: ready
- Public warning removal: ready

## Current Blockers

- none

## CI Evidence

- Status: ready
- Path: `release/ci-runs.json`
- Check: https://github.com/portwatcher/vue-godot/actions/runs/28878218086 (success)
- Godot Smoke: https://github.com/portwatcher/vue-godot/actions/runs/28878218268 (success)
- Release Preflight: https://github.com/portwatcher/vue-godot/actions/runs/28879322532 (success)

## Device Prereq Diagnostics

- Diagnostic only: yes; this is not release evidence
- Summary path: `release/device-test-prereqs-summary.json`
- Summary present: yes
- Status: waiting
- Selected platforms: `android`, `ios`
- Android: waiting (1 blocker(s), 0 warning(s), 0 device(s))
  - Command: `adb devices -l`
  - Blockers:
    - No authorized Android device or emulator reported by adb; connect and authorize a device, start an emulator, or use hosted device evidence.
- iOS: ready (0 blocker(s), 0 warning(s), 11 device(s))
  - Command: `xcrun xctrace list devices`
- Android toolchain: ready (0 blocker(s), 1 warning(s), 3 command(s))
  - SDK root: `/opt/homebrew/share/android-commandlinetools`
  - SDK root source: `discovered`
  - Build-tools version: `37.0.0`
  - Build-tools dir: `/opt/homebrew/share/android-commandlinetools/build-tools/37.0.0`
  - Commands:
    - Android Debug Bridge: ready (`adb version`) - Android Debug Bridge version 1.0.41
    - APK signer: ready (`apksigner --version`) - 0.9
    - Zip align: ready (`zipalign`) - Zip alignment utility
  - Warnings:
    - ANDROID_HOME or ANDROID_SDK_ROOT is not set; configure Godot Android export settings with the SDK root before local exports.
- iOS toolchain: ready (0 blocker(s), 0 warning(s), 4 command(s))
  - Developer dir: `/Applications/Xcode.app/Contents/Developer`
  - Xcode version: `Xcode 26.6`
  - Commands:
    - Xcode selection: ready (`xcode-select -p`) - /Applications/Xcode.app/Contents/Developer
    - Xcode build tools: ready (`xcodebuild -version`) - Xcode 26.6
    - xctrace: ready (`xcrun --find xctrace`) - /Applications/Xcode.app/Contents/Developer/usr/bin/xctrace
    - devicectl: ready (`xcrun --find devicectl`) - /Applications/Xcode.app/Contents/Developer/usr/bin/devicectl
- Android export templates: ready (0 blocker(s), 0 warning(s), 0 missing file(s))
  - Pinned release: `GodotJS_1.0.0-2`
  - Release repo: `ialex32x/GodotJS-Build`
  - Asset: `prebuilt_android_v8`
  - Templates root: `~/Library/Application Support/Godot/export_templates`
  - Templates dir: `~/Library/Application Support/Godot/export_templates/4.4.1.rc.custom_build.daa4b058e`
  - Template version: `4.4.1.rc.custom_build.daa4b058e`
  - Install command: `npm run setup:godotjs -- --asset prebuilt_android_v8 --asset-kind templates --install-templates --godot-bin "$(npm run -s setup:godotjs -- --print-bin)" --print-dir`
- iOS export templates: ready (0 blocker(s), 0 warning(s), 0 missing file(s))
  - Pinned release: `v1.1.0-generate-typings`
  - Release repo: `godotjs/GodotJS`
  - Asset: `ios-template_debug-4.4-v8, ios-template_release-4.4-v8`
  - Export package: `ios.zip`
  - Templates root: `~/Library/Application Support/Godot/export_templates`
  - Templates dir: `~/Library/Application Support/Godot/export_templates/4.4.1.rc.custom_build.daa4b058e`
  - Template version: `4.4.1.rc.custom_build.daa4b058e`
  - Install command: `npm run setup:godotjs -- --release v1.1.0-generate-typings --release-repo godotjs/GodotJS --asset ios-template_debug-4.4-v8 --asset-kind templates --install-templates --godot-bin "$(npm run -s setup:godotjs -- --print-bin)" --print-dir && npm run setup:godotjs -- --release v1.1.0-generate-typings --release-repo godotjs/GodotJS --asset ios-template_release-4.4-v8 --asset-kind templates --install-templates --assemble-ios-package --godot-bin "$(npm run -s setup:godotjs -- --print-bin)" --print-dir`
  - Notes:
    - iOS library template assets are provided by godotjs/GodotJS v1.1.0-generate-typings; GodotJS_1.0.0-2 remains the editor/runtime bundle used for local smoke checks.
    - Install the release iOS asset with --assemble-ios-package to build ios.zip for Godot's project-only Xcode export path; simulator execution still needs upstream-compatible GodotJS simulator slices and Apple signing/team setup.
- Hosted provider env configured: none
- Hosted provider env partial: none
- Read errors: none

## Platform Evidence

- Status: ready (0 blocker(s))
- Path: `release/platform-evidence.json`

### Android

- Status: ready (0 blocker(s))
- Required checks complete: 14/14
- Batch confirmation: Android emulator run recorded in apps/native-app-demo/docs/android-emulator-smoke-2026-07-07.md exercised all required production-profile checks; plugin-backed geolocation/media APIs were verified as accepted missing-plugin fallback states.
- Metadata gaps: none
- Must-pass remaining: none
- Skippable remaining: none
- Duplicate passed checks: none
- Invalid skipped reasons: none
- Contradictory pass/skip checks: none
- Unknown passed checks: none
- Unknown skipped checks: none
- Unknown selected APIs: none
- Worksheet drift: none

### iOS

- Status: ready (0 blocker(s))
- Required checks complete: 15/15
- Batch confirmation: none
- Metadata gaps: none
- Must-pass remaining: none
- Skippable remaining: none
- Duplicate passed checks: none
- Invalid skipped reasons: none
- Contradictory pass/skip checks: none
- Unknown passed checks: none
- Unknown skipped checks: none
- Unknown selected APIs: none
- Worksheet drift: none

## Release Preflight Evidence

- Status: ready (0 blocker(s))
- Readiness evidence path: `release/release-readiness-evidence.json`
- Summary JSON: `release/release-preflight-summary.json`
- Summary checklist: `release/release-preflight-checklist.md`
- Evidence present: yes
- Release commit: 68f88b1254ba76795a848f14f8ed616ec489dfec
- Run URL: https://github.com/portwatcher/vue-godot/actions/runs/28879322532
- Run commit: aa0651b3ea285a42b2f9b11ef7fdb5d5cbdd0890
- Run conclusion: success
- Local-only: false
- Skipped Check: false
- Skipped Godot: false
- Skipped serious examples: false
- Failure count: 0
- Warning count: 0
- Read errors:
- none
- Validation errors:
- none
- Run verification errors:
- none

## Final TODO Proofs

- Ready: 10/10
- none

## Next Actions

No next actions recorded.
