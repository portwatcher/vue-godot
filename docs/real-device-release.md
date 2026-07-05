# Real Device Release Checklist

Use this checklist for release candidates that include Android or iOS support.
It complements the automated GitHub Actions and Godot smoke workflows; it does
not replace them.

## Required Evidence

Record these items in the release PR, tag notes, or release issue before
marking Android or iOS device validation complete:

- commit hash and package versions under test
- GodotJS version and export preset names
- GitHub Actions run URL and workflow name `Check` for `npm run check` in
  `portwatcher/vue-godot`
- `npm run check:serious-examples` result for the release commit
- Godot Smoke workflow run URL and workflow name `Godot Smoke` in
  `portwatcher/vue-godot`
- `npm run release:preflight` result from the release environment
- Android APK/AAB artifact name or hosted-device build identifier
- iOS archive, TestFlight, or hosted-device build identifier
- tested device model, OS version, orientation, and locale for each platform
- selected browser/device APIs and native adapters enabled in the build
- observed failures, skipped capabilities, and accepted release risks

Keep final production-readiness TODO entries for Android and iOS exports open
until this evidence exists for the selected device APIs.

## Machine-Readable Evidence Gate

`npm run release:preflight` now validates real-device evidence in non-local
release runs. It reads `release/real-device-evidence.json` by default, or a
custom path from `VUE_GODOT_REAL_DEVICE_EVIDENCE`:

```bash
VUE_GODOT_REAL_DEVICE_EVIDENCE=release/real-device-evidence.json npm run release:preflight
```

Use [real-device-evidence.example.json](./real-device-evidence.example.json) as
the schema reference. The evidence file must include the tested commit, package
versions matching the current package manifests, GodotJS version, successful
Check and Godot Smoke GitHub Actions run URLs, workflow names, and commit SHAs
for `portwatcher/vue-godot`, Android and iOS artifacts or hosted-device build
identifiers, device model/OS/orientation/locale, selected APIs, and passed or
explicitly skipped platform checks.

Non-local `release:preflight` reads the recorded Check and Godot Smoke run URLs
from the GitHub Actions API and fails if either run is not completed,
successful, named for the expected workflow, or attached to the evidence commit.
The final strict `release:readiness` gate applies the same check and also
verifies the recorded Release Preflight run metadata. The `--allow-open`
readiness audit stays offline so it can be used before final evidence exists.

Before device testing, initialize `release/platform-evidence.json` so the exact
Android and iOS required check names are ready to fill:

```bash
npm run release:platform-evidence -- \
  --selected-api fetch \
  --selected-api WebSocket \
  --selected-api SafeAreaView \
  --orientation "portrait and landscape" \
  --locale en-US
```

The generated `requiredChecks` arrays are a worksheet only. After testing, move
each item into `passedChecks` or into `skippedChecks` with a release-specific
reason, and keep only complete `android` and `ios` evidence objects before
running `npm run release:evidence`.

After the release candidate is pushed, verify the required CI runs and capture
their URLs:

```bash
npm run release:ci -- \
  --commit "$(git rev-parse HEAD)" \
  --output release/ci-runs.json
```

If the `Check` or `Godot Smoke` workflow did not run automatically for that
commit, dispatch the workflow manually on the release-candidate ref and rerun
the command above after it completes.

Then assemble the evidence file from the real device data and completed CI
runs:

```bash
npm run release:evidence -- \
  --platform-evidence release/platform-evidence.json \
  --ci-evidence release/ci-runs.json \
  --real-device-output release/real-device-evidence.json
```

After the `Release Preflight` workflow passes without warnings, download its
`release-preflight-summary` artifact as
`release/release-preflight-summary.json`. Then refresh CI evidence so it
includes the verified Release Preflight run URL:

```bash
npm run release:ci -- \
  --commit "$(git rev-parse HEAD)" \
  --include-release-preflight \
  --output release/ci-runs.json
```

Rerun the same evidence command with the summary JSON to create the final
readiness evidence:

```bash
npm run release:evidence -- \
  --platform-evidence release/platform-evidence.json \
  --ci-evidence release/ci-runs.json \
  --real-device-output release/real-device-evidence.json \
  --release-preflight-summary release/release-preflight-summary.json \
  --readiness-output release/release-readiness-evidence.json
```

`--release-preflight-summary` reads the preflight commit, failure count, and
warning count from `npm run release:preflight -- --summary-output`. It rejects
stale or failed summaries before writing readiness evidence. `--ci-evidence`
supplies the Release Preflight run URL when it was generated with
`--include-release-preflight`; otherwise pass `--release-preflight-run-url`
manually. The older `--release-preflight-warning-count 0` flag remains available
only as a manual fallback when no summary artifact exists.

Local-only preflight runs (`npm run release:preflight -- --local`) warn when
this evidence is missing. Non-local preflight runs fail until the evidence file
exists and validates for the current commit.

Run the `Release Preflight` GitHub Actions workflow after committing the
evidence file. It runs the non-local release preflight without publishing, and
its successful run URL should be recorded in the release PR, tag notes, or
release issue.

## Common Gate

Run this before platform-specific checks:

1. Start from a clean commit.
2. Run `npm run check`.
3. Run `npm run check:serious-examples`.
4. Run `npm audit --audit-level=moderate`.
5. Run `npm run release:preflight` without local-only skips in the release
   environment.
6. Confirm Godot smoke, generated Godot smoke, and editor reload smoke passed in
   CI for the same commit.
7. Build exported release artifacts from the production `export_presets.cfg`.
8. Confirm `dist/app.js` and any `dist/chunks/*.js` files are included in the
   export.

## Android Release Smoke

Run on at least one real Android device or representative hosted Android device
for each release candidate that claims Android support:

1. Install the APK/AAB produced by the production Android export preset.
2. Cold launch into the main scene and confirm there are no GodotJS
   missing-module, script-load, or chunk-load diagnostics.
3. Verify storage persistence under `user://` across app restart.
4. Verify `fetch()`, `WebSocket`, and reachability behavior if the app uses
   network APIs.
5. Verify permission prompts and denied states for selected camera, microphone,
   location, notification, and vibration capabilities.
6. Verify adapter states for each selected plugin-backed capability:
   unsupported platform, missing plugin, export misconfiguration,
   permission denied, and successful native operation where applicable.
7. Verify camera/geolocation/media device adapters on hardware when selected.
8. Verify `<SafeAreaView>` and `<KeyboardAvoidingView>` on the tested device.
9. Verify Android back handling from nested screens, modal/dialog states, and
   the app root.
10. Background and foreground the app, then confirm adapters release or resume
    native resources correctly.
11. Re-run the app workflow after an app restart to catch stale storage,
    permission, or adapter state.

## iOS Release Smoke

Run on at least one real iPhone or iPad, or a hosted real Apple device, for each
release candidate that claims iOS support. Use simulator checks only as an
extra layout pass, not as the final capability sign-off.

1. Install the archive/TestFlight build produced by the production iOS export
   preset.
2. Cold launch into the main scene and confirm there are no GodotJS
   missing-module, script-load, or chunk-load diagnostics.
3. Confirm plist usage descriptions, entitlements, associated domains, and
   plugin files are present for the selected capabilities.
4. Verify storage persistence under `user://` across app restart.
5. Verify `fetch()`, `WebSocket`, and reachability behavior if the app uses
   network APIs.
6. Verify permission prompts and denied states for selected camera, microphone,
   location, notifications, photo/media library, and sensor capabilities.
7. Verify adapter states for each selected plugin-backed capability:
   unsupported platform, missing plugin, export misconfiguration,
   permission denied, and successful native operation where applicable.
8. Verify camera/geolocation/media device adapters on hardware when selected.
9. Verify safe area, virtual keyboard, rotation, and text input behavior on the
   tested device family.
10. Background and foreground the app, then confirm adapters release or resume
    native resources correctly.
11. Verify cold-start and warm-start deep links, share sheets, and notification
    delivery when the app includes those adapters.

## Sign-Off Rule

Android and iOS export validation is complete only when every applicable item
above passes for the selected release profile, skipped items have an explicit
reason, and the required evidence is linked from the release record. Until then,
the repository remains preview-quality for those device capabilities.
