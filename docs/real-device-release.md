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
- Android and iOS device test run, lab session, or signed non-local evidence URLs
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
identifiers, device evidence URLs, device model/OS/orientation/locale, selected
APIs, and passed or explicitly skipped platform checks.
When a selected API maps to a conditional check such as `network-if-selected`,
`clipboard-if-selected`, `permission-prompts-if-selected`,
`adapter-states-if-selected`, `hardware-adapters-if-selected`,
`haptics-if-selected`, `audio-input-if-selected`, `sensors-if-selected`, or
`deep-links-share-notifications-if-selected`, that conditional check must be in
`passedChecks`; `skippedChecks` is only accepted outside the selected API set.
The maintained production profile includes `navigator.mediaDevices.getUserMedia`,
so `audio-input-if-selected` is a must-pass Android and iOS device check for the
production release worksheet.

Non-local `release:preflight` reads the recorded Check and Godot Smoke run URLs
from the GitHub Actions API and fails if either run is not completed,
successful, named for the expected workflow, or attached to the tested release
commit recorded in evidence.
The final strict `release:readiness` gate applies the same check and also
verifies the recorded Release Preflight run metadata. The `--allow-open`
readiness audit stays offline and prints final TODO proof status so it can be
used before final evidence exists.
Add `--summary-output release/release-readiness-summary.json --checklist-output release/release-readiness-checklist.md` to either form to
capture the current blockers, TODO counts, unchecked TODO item details, final TODO proof status,
readiness check and evidence status, local Git state, release handoff report
currentness/format/state status, platform worksheet audit
status with compact per-platform progress counts, malformed outcome counts,
exact remaining must-pass/skippable check names, and structured check
descriptions, separate Android/iOS real-device evidence
status with metadata, platform, and read errors,
release-readiness evidence status, CI workflow wiring status,
device prereq diagnostics from `release/device-test-prereqs-summary.json` or
`--device-prereqs-summary <file>`, release tooling/workflow blocker lists, public warning markers, package
description warning status, and `nextActions` command hints for the local
`npm run check`, initial CI evidence collection, push/dispatch commands, and the
remaining evidence/finalizer work as JSON and a Markdown checklist. The
generated Markdown checklist and release handoff split `nextActions` commands
into `Ready To Run`, `Replace Placeholders First`, and, when platform
placeholder templates are present, `Run After Device Evidence Is Recorded` so
placeholder recording templates stay separate from downstream evidence assembly
or commit commands. Run
`npm run release:handoff -- --expected-commit <release-candidate-sha> --output release/release-handoff.md`
to render the same allow-open audit as a Markdown handoff for Android/iOS
testers; while real-device evidence is open, the release-readiness
`nextActions` include handoff write and check commands before the device-evidence action
only when `release/release-handoff.md` is missing or stale for the expected
commit and evidence paths. The handoff lists per-platform metadata/check gaps,
diagnostic-only device prereq status, batch confirmation notes and issues, malformed
outcome details, remaining check descriptions, Release Preflight readiness
evidence paths and warning/failure counts, `blockedBy` dependencies, and next
commands. Add `--check` to verify the checked-in handoff is current without
rewriting it. When `--expected-commit` is omitted and no readiness summary is
supplied, the handoff infers the tested release commit from
`release/ci-runs.json`, or the file passed with `--ci-evidence <file>`, when the
CI evidence contains a valid consistent commit.
The initial CI, real-device, and Release Preflight evidence actions begin
with `npm run check` before collecting CI or assembling evidence. The
real-device evidence action also runs
`npm run check:device-prereqs -- --summary-output release/device-test-prereqs-summary.json --allow-missing` before local or hosted device
handoff commands so missing local tooling and hosted-provider environment
variable names are recorded without pretending they are evidence, then
readiness and handoff reports expose that snapshot as diagnostic-only
`devicePrereqs` / Device Prereq Diagnostics with per-platform command, blocker,
and warning details. Pass `--device-prereqs-summary <file>` when the diagnostic
lives elsewhere. The
hosted-provider diagnostic covers BrowserStack, Sauce Labs, Firebase Test Lab,
AWS Device Farm, LambdaTest, and Kobiton, and never records environment values.
The Release Preflight evidence action also reruns
`npm run check:real-device-evidence -- --verify-runs` before CI/preflight
collection continues, so stale device evidence or unverified Check/Godot Smoke
run URLs fail before dispatching preflight. The initial CI action captures Check
and Godot Smoke, while Release Preflight is captured later after real-device
evidence is committed. The real-device evidence action runs the platform
worksheet audit before final evidence assembly. Later
`nextActions` include a `blockedBy` list when they depend on earlier evidence
work, for example real-device evidence before Release Preflight. When
`release/ci-runs.json`, or the
file passed with `--ci-evidence <file>`, already validates Check and Godot Smoke
for the expected release commit, readiness marks that initial CI evidence as
ready and omits the duplicate Check/Godot Smoke collection commands from later
`nextActions`. If checked-in or supplied CI evidence is valid for a different
tested release commit and `--expected-commit` is omitted, the summary also adds
an `expected-commit`
`nextActions` entry with the exact
`npm run release:readiness -- --allow-open --expected-commit ...` command. The
terminal output also prints a tested release commit hint with that command. If
`--ci-evidence <file>`, `--platform-evidence <file>`,
`--real-device-path <file>`, or `--readiness-path <file>` is supplied with a
path inside the Git worktree, generated `nextActions` keep that path through
release CI refreshes, platform worksheet audits, real-device evidence assembly
and validation, Release Preflight evidence, `git add`, and the final strict
readiness checks. If a handoff path is outside the Git worktree,
evidence-commit commands copy it into the standard `release/` evidence file
before staging, and the preflight dispatch plus final strict readiness checks
reference that repo-local copy. If initial CI evidence is still missing, the
release-readiness evidence action
refreshes Check and Godot Smoke from the release-candidate ref before
dispatching Release Preflight from the evidence ref. In generated `nextActions`,
that preflight dispatch uses
`--release-preflight-run-commit "$(git rev-parse HEAD)"` after the evidence
commit is current `HEAD`. That later action includes the `--dispatch-missing`,
`--release-preflight-run-commit`, and `--real-device-evidence-path` inputs for
the workflow-dispatch-only preflight workflow. The real-device evidence action
reuses an existing platform worksheet and writes
`release/platform-evidence-summary.json` plus
`release/platform-evidence-checklist.md` when it still has gaps. Its detail
includes Android/iOS metadata-field counts, malformed outcome counts,
required-check counts, and exact remaining must-pass/skippable check names in
its detail, attaches
`platformCheckDetails` with descriptions and selected API context, and includes Android/iOS
list-checks, per-check, and pass-remaining
`release:record-platform-evidence` command templates while gaps remain. It only emits
`npm run release:platform-evidence -- --production-profile` when the worksheet
is missing, then runs the strict platform worksheet audit before final evidence
assembly. The Markdown checklist separates ready-to-run audit/list commands,
templates that still contain `<...>` placeholders, and downstream
assembly/commit commands. The platform, real-device, and readiness summary/checklist outputs are
gitignored helper files for local handoff work; the committed evidence files stay
limited to `release/platform-evidence.json`, `release/ci-runs.json`,
`release/real-device-evidence.json`, `release/release-preflight-summary.json`,
`release/release-preflight-checklist.md`, and
`release/release-readiness-evidence.json`. The final warning-removal action runs
`npm run check` after the finalizer, stages the finalizer files, commits them,
pushes, and then runs the final strict readiness check. When an expected
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
`passedChecks`. The generated top-level `nextActions` section records Android
and iOS list-checks, per-check, and pass-remaining
`release:record-platform-evidence` command templates, audited progress,
malformed outcome counts, exact remaining metadata/must-pass/skippable gap names and structured `platformCheckDetails` descriptions, the allow-open worksheet
audit command, the local `npm run check`, any still-needed release CI
wait/dispatch commands, and final evidence assembly, validation, commit, and
push commands for turning the completed worksheet into final real-device
evidence. It reads
`release/ci-runs.json` by default, or
`--ci-evidence <file>`, records an `initialCiEvidence` status object, and omits
duplicate Check/Godot Smoke collection commands when that file already validates
initial CI for the tested commit.
Pass `--commit <release-candidate-sha>` when creating the worksheet if the
tested release commit is known; it must be the full 40-character commit SHA.
Generated `nextActions` commands will use that commit for CI collection,
worksheet audit, evidence assembly, and validation instead of the placeholder.
If you prefill `--android-evidence-url` or `--ios-evidence-url`, each value
must be a non-local `http` or `https` link to the device test run, lab session,
or signed evidence artifact; `localhost` and loopback links are rejected.
Keep only complete `android` and `ios` evidence objects before running
`npm run release:evidence`.
Keep platform worksheet fields and scaffold fields only in `release/platform-evidence.json`; final
`release/real-device-evidence.json` must not contain `requiredChecks`,
`passOnlyChecks`, `selectedApiRequiredChecks`, top-level `initialCiEvidence`, or
top-level `nextActions`.

During device testing, audit worksheet progress without failing the handoff:

```bash
npm run check:platform-evidence -- \
  --allow-open \
  --expected-commit <release-candidate-sha> \
  --summary-output release/platform-evidence-summary.json \
  --checklist-output release/platform-evidence-checklist.md
```

The summary reports Android and iOS metadata gaps, remaining required checks,
exact must-pass/skippable check names and structured check descriptions, pass-only and selected-API checks that
still must be in `passedChecks`, worksheet drift from the maintained check lists, and follow-up `nextActions`. Those
actions include Android and iOS `release:record-platform-evidence` command
templates before the strict worksheet audit. The Markdown checklist contains
the same remaining metadata fields, per-platform checks, selected API context,
and command block in a tester-facing format. Once the worksheet is complete,
they include final evidence assembly, validation, commit, and push commands.
Before assembling final evidence, run the same command without `--allow-open`;
it must pass.

After each real or hosted device pass, record the observed metadata and outcomes
without hand-editing JSON:

```bash
npm run release:record-platform-evidence -- \
  --platform android \
  --artifact <apk-aab-or-hosted-build-id> \
  --evidence-url <device-test-run-or-lab-url> \
  --export-preset <android-export-preset> \
  --device <device-model> \
  --os <os-version> \
  --orientation "portrait and landscape" \
  --locale en-US \
  --pass cold-launch,no-godotjs-load-diagnostics,audio-input-if-selected \
  --expected-commit <release-candidate-sha> \
  --summary-output release/platform-evidence-summary.json
```

Add `--list-checks` before recording outcomes when testers need the valid check
names, descriptions, current worksheet outcomes, and selected-API must-pass
context without modifying `release/platform-evidence.json`.

Use `--platform ios` with `--export-preset <ios-export-preset>` for the iOS
pass. The recorder rejects unknown check names and refuses to put pass-only or
selected-API-required checks in `skippedChecks`; those checks must be recorded
with `--pass` after they actually pass. `--evidence-url` must be a non-local
`http` or `https` link to the device test run, lab session, or signed evidence
artifact; `localhost` and loopback links are rejected.
Only use `--skip check=reason` for conditional checks that are genuinely outside
the selected release profile, such as
`--skip deep-links-share-notifications-if-selected="not selected for this release profile"`
on an iOS build that does not include deep links, share sheets, or notifications.
After every unresolved must-pass check for that platform has actually passed,
use `--pass-remaining` to move the remaining must-pass checks into
`passedChecks` in one batch, and include
`--pass-remaining-confirmation "<release-specific confirmation>"` after the
device run; the recorder stores that confirmation on the platform evidence so
`release/real-device-evidence.json` keeps the audit note. Skippable checks still
need an explicit `--pass` or `--skip check=reason`; generated handoff commands
include read-only list-checks commands, skip and pass-remaining confirmation
placeholders for currently open gaps, plus per-check commands that prefill each remaining check name
for incremental device sessions. Replace every placeholder before recording evidence; the recorder,
worksheet audit, and final evidence validator reject placeholder metadata,
placeholder confirmation notes,
and placeholder skip reasons. Final `passedChecks` must be a non-empty
string array without duplicates, and final `skippedChecks` must be an object whose
values are non-empty release-specific reasons. A check must not appear in both.
The Markdown handoff separates ready-to-run commands, templates with `<...>`
placeholders, and downstream evidence assembly, validation, commit, and push
commands, and flags placeholders so device testers know to edit them before
running. It preserves existing and newly supplied `--skip check=reason`
entries, and the same pass-only and selected-API validation still applies. When
`--summary-output` is supplied, the recorder writes the updated audit and
follow-up `nextActions` using the same evidence and summary paths.

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
`release:evidence`. When an existing ready output file already contains the
same workflow evidence, reruns keep that file unchanged so evidence-only commits
do not churn on local Git diagnostics alone. Release commit options (`--commit`,
`--expected-commit`, and `--release-preflight-run-commit`) require full
40-character git commit SHAs; use `git rev-parse HEAD` or the full pushed
release-candidate/evidence commit.
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
The helper strips platform worksheet fields and scaffold fields before writing final evidence and rejects malformed `passedChecks` arrays, malformed `skippedChecks` reason maps, or checks recorded as both passed and skipped. If
`release/platform-evidence.json` is copied directly to
`release/real-device-evidence.json`, `npm run check:real-device-evidence` and
strict release gates reject it.
Use `npm run check:real-device-evidence -- --summary-output release/real-device-evidence-summary.json --checklist-output release/real-device-evidence-checklist.md`
to write validation status, metadata/platform/run errors, initial CI evidence
status, platform
worksheet status with compact per-platform progress counts, malformed outcome
counts, exact remaining must-pass/skippable check names, and structured check
descriptions, plus `nextActions` command hints for fixing or
creating evidence in both JSON and Markdown forms. Pass `--ci-evidence <file>` or
`--platform-evidence <file>` when those inputs use non-default handoff paths so
generated creation, validation, and assembly commands target those files. If a
handoff path is outside the Git worktree, generated commit commands copy it into
the standard `release/` evidence file before staging. Missing-evidence assembly
and invalid-evidence regeneration hints begin with `npm run check`, run the
platform worksheet audit before final evidence assembly or regeneration, then
run any still-needed release CI wait/dispatch or evidence commands, stage the
platform/CI/real-device evidence files, commit them with
`git commit -m "Add real-device release evidence"`, and push.
The helper validates the normalized platform evidence before fetching GitHub run
metadata, so missing device details, unknown selected APIs, or selected-API
checks left in `skippedChecks` fail before network calls.
After `npm run release:evidence` assembles final evidence, pass `--verify-runs`
to `npm run check:real-device-evidence` to query GitHub Actions and require the
recorded Check and Godot Smoke run URLs to be completed successful runs for the
tested release commit.
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
  --commit <release-candidate-sha> \
  --output release/release-preflight-summary.json \
  --checklist-output release/release-preflight-checklist.md
```

With `--ci-evidence`, `release:preflight-summary` validates the summary commit
against the tested release candidate and validates the workflow run against the
`Release Preflight` run commit recorded in CI evidence. If you pass `--run-url`
manually for a preflight run attached to a follow-up evidence commit, also pass
`--release-preflight-run-commit "$(git rev-parse HEAD)"`, or the full evidence
commit SHA if you are not on it.
The checklist output records the non-local, skip-flag, failure-count, and
warning-count status alongside the follow-up evidence commands.

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
git add release/ci-runs.json release/release-preflight-summary.json release/release-preflight-checklist.md release/real-device-evidence.json release/release-readiness-evidence.json
git commit -m "Add release readiness evidence"
git push
```

After committing and pushing the final evidence files, generate a strict
readiness summary outside the worktree and run the guarded finalizer:

```bash
npm run release:readiness -- \
  --summary-output /tmp/vue-godot-readiness.json \
  --expected-commit <release-candidate-sha>
npm run release:finalize-readiness -- --summary /tmp/vue-godot-readiness.json
npm run check
git add TODO.md README.md docs/compatibility.md docs/production.md docs/real-device-release.md
git commit -m "Finalize production readiness"
git push
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
3. Run `npm run check:device-prereqs -- --summary-output release/device-test-prereqs-summary.json --allow-missing` to see whether local
   Android/iOS device tooling, attached devices, and common hosted-provider
   environment variable sets are available and to write a gitignored JSON
   diagnostic. The hosted-provider diagnostic reports configured environment
   variable names and partially configured missing-name hints for BrowserStack,
   Sauce Labs, Firebase Test Lab, AWS Device Farm, LambdaTest, and Kobiton, but
   never their values; when none are fully configured, the text output lists the
   recognized provider env-set options. The release-readiness summary and
   Markdown handoff read the diagnostic as a `devicePrereqs` / Device Prereq
   Diagnostics section; use `--device-prereqs-summary <file>` with readiness
   when the diagnostic lives outside the default path.
   Android emulators are reported separately and do not satisfy the local
   release-device prerequisite. iOS local device sessions require full Xcode,
   not only Command Line Tools; if `xcrun xctrace list devices` cannot find
   `xctrace`, install Xcode.app and select it with
   `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`, or use
   hosted real Apple-device evidence. Missing local tooling or provider
   environment variables do not satisfy or fail final evidence by themselves;
   use a hosted real-device lab when the final evidence can link to the lab run.
4. Run `npm run check:serious-examples`.
5. Run `npm audit --audit-level=moderate`.
6. Optionally run `npm run release:preflight -- --local` as a local dry run;
   treat missing real-device evidence, missing trusted publishing, or missing
   Godot metadata as warnings only.
7. Confirm Check, Godot smoke, generated Godot smoke, and editor reload smoke
   passed in CI for the same commit.
8. Build exported release artifacts from the production `export_presets.cfg`.
9. Confirm `dist/app.js` and any `dist/chunks/*.js` files are included in the
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
