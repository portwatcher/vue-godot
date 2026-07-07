# Release Handoff

- Release candidate commit: `68f88b1254ba76795a848f14f8ed616ec489dfec`
- Handoff format: 7
- Handoff state: a29aa49a304c5e14
- Overall readiness: open (5 blocker(s))
- Real-device evidence: ready
- Android evidence: ready
- iOS evidence: ready
- Release Preflight evidence: ready
- Public warning removal: waiting

## Current Blockers

- TODO.md:34 The wording "not production ready", "alpha", and "experimental" is removed only after all criteria above are satisfied.
- TODO.md:422 CI passes on a clean commit.
- TODO.md:423 Release preflight passes without warnings in the release environment.
- TODO.md:425 All public READMEs match the final support claims.
- TODO.md:426 The root README warning is removed in the same commit that marks this checklist complete.

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

- Ready: 6/10
- TODO.md:34 The wording "not production ready", "alpha", and "experimental" is removed only after all criteria above are satisfied. (warningWordingReady waiting)
- TODO.md:422 CI passes on a clean commit. (ciEvidenceReady waiting)
- TODO.md:425 All public READMEs match the final support claims. (publicReadmesReady waiting)
- TODO.md:426 The root README warning is removed in the same commit that marks this checklist complete. (rootReadmeWarningReady waiting)

## Next Actions

### Collect CI and warning-free Release Preflight evidence

Run the local check after the tested release candidate and real-device evidence are pushed, refresh Check and Godot Smoke from the release-candidate ref when CI evidence is still missing, then dispatch Release Preflight from the current evidence commit ref and write release-readiness evidence.

Commands with `<...>` placeholders must be edited before running; unresolved placeholders are not valid release evidence or dispatch inputs.

#### Ready To Run

```bash
npm run check
npm run check:real-device-evidence -- --summary-output release/real-device-evidence-summary.json --checklist-output release/real-device-evidence-checklist.md --verify-runs --expected-commit 68f88b1254ba76795a848f14f8ed616ec489dfec
npm run release:ci -- --commit 68f88b1254ba76795a848f14f8ed616ec489dfec --include-release-preflight --release-preflight-run-commit "$(git rev-parse HEAD)" --wait --output release/ci-runs.json
GH_TOKEN="$(gh auth token)" npm run release:preflight-summary -- --ci-evidence release/ci-runs.json --commit 68f88b1254ba76795a848f14f8ed616ec489dfec --output release/release-preflight-summary.json --checklist-output release/release-preflight-checklist.md
npm run release:evidence -- --platform-evidence release/platform-evidence.json --ci-evidence release/ci-runs.json --commit 68f88b1254ba76795a848f14f8ed616ec489dfec --real-device-output release/real-device-evidence.json --release-preflight-summary release/release-preflight-summary.json --readiness-output release/release-readiness-evidence.json
git add release/ci-runs.json release/release-preflight-summary.json release/release-preflight-checklist.md release/real-device-evidence.json release/release-readiness-evidence.json
git commit -m "Add release readiness evidence"
git push
npm run release:readiness -- --summary-output release/release-readiness-summary.json --checklist-output release/release-readiness-checklist.md --expected-commit 68f88b1254ba76795a848f14f8ed616ec489dfec
```

#### Replace Placeholders First

```bash
GH_TOKEN="$(gh auth token)" npm run release:ci -- --commit 68f88b1254ba76795a848f14f8ed616ec489dfec --include-release-preflight --release-preflight-run-commit "$(git rev-parse HEAD)" --dispatch-missing --wait --ref <evidence-branch-or-tag> --real-device-evidence-path release/real-device-evidence.json --output release/ci-runs.json
```

### Remove public warning wording through the guarded finalizer

Only run the finalizer after strict release readiness evidence is complete; it applies the final TODO checks and removes public warning wording. The generated commands then run npm run check, stage those edits, commit them, push, and run the final strict readiness check.

```bash
npm run release:readiness -- --summary-output /tmp/vue-godot-readiness.json --checklist-output /tmp/vue-godot-readiness.md --expected-commit 68f88b1254ba76795a848f14f8ed616ec489dfec
npm run release:finalize-readiness -- --summary /tmp/vue-godot-readiness.json
npm run check
git add TODO.md README.md docs/compatibility.md docs/production.md docs/real-device-release.md
git commit -m "Finalize production readiness"
git push
npm run release:readiness -- --summary-output release/release-readiness-summary.json --checklist-output release/release-readiness-checklist.md --expected-commit 68f88b1254ba76795a848f14f8ed616ec489dfec
```

