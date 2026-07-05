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
the schema reference. The evidence file must include the full 40-character
tested commit SHA, package versions matching the current package manifests,
GodotJS version, successful Check and Godot Smoke GitHub Actions run URLs,
workflow names, and full 40-character run commit SHAs for
`portwatcher/vue-godot`, Android and iOS artifacts or hosted-device build
identifiers, device model/OS/orientation/locale, selected APIs, and passed or
explicitly skipped platform checks.
When a selected API maps to a conditional check such as `network-if-selected`,
`clipboard-if-selected`, `permission-prompts-if-selected`,
`adapter-states-if-selected`, `hardware-adapters-if-selected`,
`haptics-if-selected`, `audio-input-if-selected`, `sensors-if-selected`, or
`deep-links-share-notifications-if-selected`, that conditional check must be in
`passedChecks`; `skippedChecks` is only accepted outside the selected API set.

Non-local `release:preflight` reads the recorded Check and Godot Smoke run URLs
from the GitHub Actions API and fails if either run is not completed,
successful, named for the expected workflow, or attached to the tested release
commit recorded in evidence.
The final strict `release:readiness` gate applies the same check and also
verifies the recorded Release Preflight run metadata. The `--allow-open`
readiness audit stays offline and prints final TODO proof status so it can be
used before final evidence exists.
Add `--summary-output release/release-readiness-summary.json` to either form to
capture the current blockers, TODO counts, unchecked TODO item details, final TODO proof status,
readiness check and evidence status, local Git state, platform worksheet audit
status with per-platform gaps, separate Android/iOS real-device evidence status
with metadata, platform, and read errors, release-readiness evidence status, CI workflow wiring status,
release tooling/workflow blocker lists, public warning markers, package
description warning status, and `nextActions` command hints for the local
`npm run check`, initial CI evidence collection, push/dispatch commands, and the
remaining evidence/finalizer work as JSON. The initial CI, real-device, and
Release Preflight evidence actions begin
with `npm run check` before collecting CI or assembling evidence. The initial CI
action captures Check and Godot Smoke, while Release Preflight is captured later
after real-device evidence is committed. The real-device evidence action runs
the platform worksheet audit before final evidence assembly. When
`release/ci-runs.json`, or the
file passed with `--ci-evidence <file>`, already validates Check and Godot Smoke
for the expected release commit, readiness marks that initial CI evidence as
ready and omits the duplicate Check/Godot Smoke collection commands from later
`nextActions`. If checked-in or supplied CI evidence is valid for a different
tested release commit and `--expected-commit` is omitted, the summary also adds
an `expected-commit`
`nextActions` entry with the exact
`npm run release:readiness -- --allow-open --expected-commit ...` command. If
initial CI evidence is still missing, the release-readiness evidence action
refreshes Check and Godot Smoke from the release-candidate ref before
dispatching Release Preflight from the evidence ref. In generated `nextActions`,
that preflight dispatch uses
`--release-preflight-run-commit "$(git rev-parse HEAD)"` after the evidence
commit is current `HEAD`. That later action includes the `--dispatch-missing`,
`--release-preflight-run-commit`, and `--real-device-evidence-path` inputs for
the workflow-dispatch-only preflight workflow. The real-device evidence action
reuses an existing platform worksheet and writes
`release/platform-evidence-summary.json` when it still has gaps; it only emits
`npm run release:platform-evidence -- --production-profile` when the worksheet
is missing, then runs the strict platform worksheet audit before final evidence
assembly. The final warning-removal action runs
`npm run check` after the finalizer, stages the finalizer files, commits them,
and then runs the final strict readiness check. When an expected
commit is known, the summary resolves evidence and
finalizer commands to that tested release commit.

Before device testing, initialize `release/platform-evidence.json` so the exact
Android and iOS required check names are ready to fill:

```bash
npm run release:platform-evidence -- \
  --production-profile \
  --commit <release-candidate-sha> \
  --orientation "portrait and landscape" \
  --locale en-US
```

The `--production-profile` shortcut expands to the maintained selected API set:
`fetch`, `WebSocket`, `checkNetworkReachability`, `navigator.onLine`,
`localStorage`, `sessionStorage`, `navigator.permissions.query`,
`navigator.clipboard`, `navigator.geolocation`,
`navigator.mediaDevices.getUserMedia`, `navigator.vibrate`,
`readDeviceMotion`, `SafeAreaView`, and `KeyboardAvoidingView`. Add extra
`--selected-api` flags only for release candidates that intentionally exercise
more APIs.
Final release evidence must include every production-profile API on both
Android and iOS; `npm run release:evidence`,
`npm run check:real-device-evidence`, `npm run release:preflight`, and strict
`npm run release:readiness` reject evidence that omits any profile API.

The generated `requiredChecks` arrays are a worksheet only. After testing, move
each item into `passedChecks` or into `skippedChecks` with a release-specific
reason. The generated `passOnlyChecks` object lists core launch/runtime checks
that must not be skipped. The generated `selectedApiRequiredChecks` object
shows which conditional checks came from the selected API set. Selected API
names are validated, so typos or unknown names fail before conditional checks
can be omitted. Conditional checks for selected APIs must be moved into
`passedChecks`. The generated top-level `nextActions` section records the
local `npm run check`, any still-needed release CI wait/dispatch commands, the
worksheet audit command, and final evidence assembly commands for turning the
completed worksheet into final real-device evidence. It reads
`release/ci-runs.json` by default, or
`--ci-evidence <file>`, records an `initialCiEvidence` status object, and omits
duplicate Check/Godot Smoke collection commands when that file already validates
initial CI for the tested commit.
Pass `--commit <release-candidate-sha>` when creating the worksheet if the
tested release commit is known; it must be the full 40-character commit SHA.
Generated `nextActions` commands will use that commit for CI collection,
worksheet audit, evidence assembly, and validation instead of the placeholder.
Keep only complete `android` and `ios` evidence objects before running
`npm run release:evidence`.
Keep worksheet fields only in `release/platform-evidence.json`; final
`release/real-device-evidence.json` must not contain `requiredChecks`,
`passOnlyChecks`, or `selectedApiRequiredChecks`.

During device testing, audit worksheet progress without failing the handoff:

```bash
npm run check:platform-evidence -- \
  --allow-open \
  --expected-commit <release-candidate-sha> \
  --summary-output release/platform-evidence-summary.json
```

The summary reports Android and iOS metadata gaps, remaining required checks,
pass-only and selected-API checks that still must be in `passedChecks`, worksheet
drift from the maintained check lists, and follow-up `nextActions`. Before
assembling final evidence, run the same command without `--allow-open`; it must
pass.

After the release candidate is pushed, verify the required CI runs and capture
their URLs and structured workflow readiness status:

```bash
npm run release:ci -- \
  --commit "$(git rev-parse HEAD)" \
  --output release/ci-runs.json
```

If the `Check` or `Godot Smoke` workflow did not run automatically for that
commit, dispatch and wait from the CLI:

```bash
GH_TOKEN="$(gh auth token)" npm run release:ci -- \
  --commit "$(git rev-parse HEAD)" \
  --dispatch-missing \
  --wait \
  --ref <release-candidate-branch-or-tag> \
  --output release/ci-runs.json
```

The dispatch ref must resolve to the same commit on GitHub. If `release:ci`
reports that the commit was not found on GitHub, push the release-candidate
commit first. The resulting `release/ci-runs.json` includes `ready`,
`commitFound`, required/passed/missing workflow names, structured workflow
checks, local Git branch/upstream diagnostics, hints for unpushed commits or
stale upstreams, `nextActions` command hints for running `npm run check` before
pushing or dispatching missing workflows, and the run URLs consumed by
`release:evidence`. Release commit options (`--commit`, `--expected-commit`,
and `--release-preflight-run-commit`) require full 40-character git commit SHAs;
use `git rev-parse HEAD` or the full pushed release-candidate/evidence commit.
The evidence helper rejects not-ready or inconsistent structured CI summaries,
including malformed workflow run commit SHAs, before writing final evidence.

Then assemble the evidence file from the real device data and completed CI
runs:

```bash
npm run release:evidence -- \
  --platform-evidence release/platform-evidence.json \
  --ci-evidence release/ci-runs.json \
  --commit <release-candidate-sha> \
  --real-device-output release/real-device-evidence.json
```

Use `--commit <release-candidate-sha>` whenever the evidence is generated from
a follow-up evidence commit instead of directly on the tested release candidate.
The helper strips worksheet fields before writing final evidence. If
`release/platform-evidence.json` is copied directly to
`release/real-device-evidence.json`, `npm run check:real-device-evidence` and
strict release gates reject it.
Use `npm run check:real-device-evidence -- --summary-output release/real-device-evidence-summary.json`
to write validation status, errors, initial CI evidence status, platform
worksheet status, and `nextActions` command hints for fixing or creating
evidence; missing-evidence assembly and invalid-evidence regeneration hints
begin with `npm run check`, run the platform worksheet audit before final
evidence assembly or regeneration, then run any still-needed release CI
wait/dispatch or evidence commands.
The helper validates the normalized platform evidence before fetching GitHub run
metadata, so missing device details, unknown selected APIs, or selected-API
checks left in `skippedChecks` fail before network calls.
Commit and push the completed evidence before dispatching Release Preflight:

```bash
git add release/platform-evidence.json release/ci-runs.json release/real-device-evidence.json
git commit -m "Add real-device release evidence"
git push
```

After the `Release Preflight` workflow passes without warnings, refresh CI
evidence so it includes the verified Release Preflight run URL:

```bash
npm run release:ci -- \
  --commit <release-candidate-sha> \
  --include-release-preflight \
  --output release/ci-runs.json
```

If the real-device evidence was committed after the tested release candidate,
run the preflight workflow on that follow-up evidence commit and keep
`--commit` pointed at the tested release candidate:

```bash
npm run release:ci -- \
  --commit <release-candidate-sha> \
  --include-release-preflight \
  --release-preflight-run-commit "$(git rev-parse HEAD)" \
  --output release/ci-runs.json
```

Then fetch the matching `release-preflight-summary` artifact:

```bash
GH_TOKEN="$(gh auth token)" npm run release:preflight-summary -- \
  --ci-evidence release/ci-runs.json \
  --output release/release-preflight-summary.json
```

To dispatch and wait for `Release Preflight` from the same helper, add the
workflow input:

```bash
GH_TOKEN="$(gh auth token)" npm run release:ci -- \
  --commit <release-candidate-sha> \
  --include-release-preflight \
  --release-preflight-run-commit "$(git rev-parse HEAD)" \
  --dispatch-missing \
  --wait \
  --ref <evidence-branch-or-tag> \
  --real-device-evidence-path release/real-device-evidence.json \
  --output release/ci-runs.json
```

For that later preflight dispatch, `<evidence-branch-or-tag>` must resolve to the
current evidence commit that contains `release/real-device-evidence.json`. The helper
passes the tested release candidate to the workflow as `expected_commit`, so the
non-local preflight validates the committed evidence against the release commit
instead of against the evidence commit itself. If Check or Godot Smoke is still
missing for the release commit, dispatch those workflows first from a
release-candidate ref, then dispatch Release Preflight from the evidence ref.

Rerun the same evidence command with the summary JSON to create the final
readiness evidence:

```bash
npm run release:evidence -- \
  --platform-evidence release/platform-evidence.json \
  --ci-evidence release/ci-runs.json \
  --commit <release-candidate-sha> \
  --real-device-output release/real-device-evidence.json \
  --release-preflight-summary release/release-preflight-summary.json \
  --readiness-output release/release-readiness-evidence.json
```

`--release-preflight-summary` reads the preflight commit, local/skip flags,
failure count, and warning count from
`npm run release:preflight -- --summary-output`. It rejects stale, local-only,
skipped, failed, or warning-bearing summaries before writing readiness evidence.
`--ci-evidence` supplies the Release Preflight run URL when it was generated
with `--include-release-preflight`, and the structured CI summary must report
the Release Preflight workflow as ready; otherwise pass
`--release-preflight-run-url` manually. Pass
`--release-preflight-run-commit "$(git rev-parse HEAD)"` with a manual URL when
the preflight run attached to the current evidence commit, or pass the full
evidence commit SHA if you are not on it.
`--release-preflight-warning-count 0` is only an optional consistency check when
the summary artifact is also supplied.
Commit the final evidence files before running strict readiness:

```bash
git add release/ci-runs.json release/release-preflight-summary.json release/real-device-evidence.json release/release-readiness-evidence.json
git commit -m "Add release readiness evidence"
```

After committing the final evidence files, generate a strict readiness summary
outside the worktree and run the guarded finalizer:

```bash
npm run release:readiness -- \
  --summary-output /tmp/vue-godot-readiness.json \
  --expected-commit <release-candidate-sha>
npm run release:finalize-readiness -- --summary /tmp/vue-godot-readiness.json
npm run check
git add TODO.md README.md docs/compatibility.md docs/production.md docs/real-device-release.md
git commit -m "Finalize production readiness"
npm run release:readiness -- --expected-commit <release-candidate-sha>
```

Use the pushed release-candidate SHA for `--expected-commit` when the evidence
files are committed in a follow-up evidence commit; strict readiness validates
the tested commit and still requires the current worktree to be clean.

The finalizer refuses `--allow-open` summaries, unexpected readiness blockers,
missing evidence-backed final TODO proof status, package description warning
markers, finalizer source text drift, or a dirty worktree. It only checks the
final TODO boxes and removes public warning wording after strict evidence is
ready. Run `npm run check`, commit those edits, then rerun
`npm run release:readiness -- --expected-commit <release-candidate-sha>` without
`--allow-open`.

Local-only preflight runs (`npm run release:preflight -- --local`) warn when
this evidence is missing. Non-local preflight runs fail until the evidence file
exists and validates for the current commit.

Run the `Release Preflight` GitHub Actions workflow after committing the
evidence file. It runs the non-local release preflight without publishing,
passes the tested release candidate through `expected_commit`, and its
successful run URL should be recorded in the release PR, tag notes, or release
issue.

## Common Gate

Run these before platform-specific device checks:

1. Start from a clean commit.
2. Run `npm run check`.
3. Run `npm run check:serious-examples`.
4. Run `npm audit --audit-level=moderate`.
5. Optionally run `npm run release:preflight -- --local` as a local dry run;
   treat missing real-device evidence, missing trusted publishing, or missing
   Godot metadata as warnings only.
6. Confirm Check, Godot smoke, generated Godot smoke, and editor reload smoke
   passed in CI for the same commit.
7. Build exported release artifacts from the production `export_presets.cfg`.
8. Confirm `dist/app.js` and any `dist/chunks/*.js` files are included in the
   export.

Run non-local `npm run release:preflight` or the `Release Preflight` workflow
only after `release/real-device-evidence.json` is generated and committed for
the tested release candidate. Non-local preflight fails when real-device
evidence is missing. When the workflow runs from a follow-up evidence commit,
its `expected_commit` input must be the tested release-candidate SHA. Its
warning-free summary is later imported into
`release/release-readiness-evidence.json`.

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
   location, notification, vibration, clipboard, audio-input, and sensor
   capabilities.
6. Verify adapter states for each selected plugin-backed capability:
   unsupported platform, missing plugin, export misconfiguration,
   permission denied, and successful native operation where applicable.
7. Verify camera/geolocation/media device adapters, haptics, audio input,
   clipboard, and sensors on hardware when selected.
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
   location, notifications, photo/media library, clipboard, haptics,
   audio-input, and sensor capabilities.
7. Verify adapter states for each selected plugin-backed capability:
   unsupported platform, missing plugin, export misconfiguration,
   permission denied, and successful native operation where applicable.
8. Verify camera/geolocation/media device adapters, haptics, audio input,
   clipboard, and sensors on hardware when selected.
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
