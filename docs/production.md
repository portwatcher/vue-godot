# Production Readiness Guide

Vue Godot is still experimental. Use this guide as the release checklist for
apps built on the current packages and for future package release candidates.

## Build And Verify

Run the full repository check before cutting a release candidate:

```bash
npm run check
npm audit --audit-level=moderate
npm run check:public-surface
npm run check:platform-evidence -- --allow-open
npm run check:real-device-evidence -- --optional
npm run release:preflight -- --local --skip-check --skip-godot
```

`npm run check` builds packages, runs tests, builds demo apps, and runs clean
CLI scaffold smoke checks. It also runs `npm run check:serious-examples`, which
verifies the required serious native app and game UI demo workspaces, README
coverage, root README links, and fixture-test registration.
`npm audit --audit-level=moderate` must report zero moderate, high, or critical
advisories unless an accepted exception is documented in the release notes.
`npm run check:public-surface` verifies package README exported-subpath
coverage, root README support links, generated template release defaults,
serious example README smoke coverage, compatibility docs, and `apps/html-demo`
component coverage.
`npm run check:platform-evidence` audits the Android/iOS worksheet before final
evidence assembly. Use `--allow-open --summary-output
release/platform-evidence-summary.json --checklist-output
release/platform-evidence-checklist.md` during device testing to report
metadata gaps, malformed outcome counts, remaining required checks, pass-only
or selected-API checks that must move to `passedChecks`, worksheet drift,
nextActions, and a focused Markdown checklist without failing the handoff run.
`npm run check:real-device-evidence` validates the Android/iOS export-smoke
evidence JSON when it exists. Pass `--verify-runs` after evidence assembly to
query GitHub Actions and require the recorded Check and Godot Smoke run URLs to
be completed successful runs for the tested release commit. Add
`--summary-output release/real-device-evidence-summary.json --checklist-output release/real-device-evidence-checklist.md` to write
validation status, metadata/platform/run errors, initial CI evidence status,
platform worksheet
status with compact per-platform progress counts, malformed outcome counts,
exact remaining must-pass/skippable check names, and structured check
descriptions, plus `nextActions` command hints for fixing or
creating evidence in both JSON and Markdown forms. Pass `--ci-evidence <file>` or
`--platform-evidence <file>` when a handoff is using non-default evidence or
worksheet paths so generated creation, validation, and assembly commands
continue to target those files. If a handoff path is outside the Git worktree,
generated commit commands copy it into the standard `release/` evidence file
before staging. Missing-evidence assembly and invalid-evidence regeneration
hints begin with `npm run check`, run the platform worksheet audit before final
evidence assembly or regeneration, then run any still-needed release CI
wait/dispatch or evidence commands, stage the platform/CI/real-device evidence
files, commit them with `git commit -m "Add real-device release evidence"`,
push, and resolve command placeholders to `--expected-commit` when it is
supplied.
`release:preflight` verifies package metadata,
generated package specs, dry-run package contents including every
`package.json` export target, registry state, publish environment assumptions,
dependency audit status, serious example app readiness, Godot smoke, real
device evidence, and GitHub Actions metadata for the Check/Godot Smoke run URLs
recorded in that evidence.
After pushing a release candidate,
`npm run release:ci -- --commit <sha> --output release/ci-runs.json` checks
GitHub Actions for completed successful Check and Godot Smoke runs on that exact
commit. Release commit options (`--commit`, `--expected-commit`, and
`--release-preflight-run-commit`) require full 40-character git commit SHAs; use
`git rev-parse HEAD` or the full pushed release-candidate/evidence commit. The
helper writes `ready`, `commitFound`, required/passed/missing workflow
names, structured workflow checks, local Git branch/upstream diagnostics, hints
for unpushed commits or stale upstreams, `nextActions` command hints for running
`npm run check` before pushing or dispatching missing workflows, and the run
URLs used by real-device release evidence. When an existing ready output file
already contains the same workflow evidence, reruns keep that file unchanged so
evidence-only commits do not churn on local Git diagnostics alone. Add
`--wait` to poll while workflows are still running. If a release-candidate
commit is not found on GitHub, push it before collecting CI evidence. If the
commit only changes docs or evidence and a workflow did not run automatically,
use `GH_TOKEN="$(gh auth token)" npm run release:ci -- --commit <sha> --dispatch-missing --wait --ref <release-candidate-branch-or-tag> --output release/ci-runs.json`
to dispatch Check and Godot Smoke from the CLI. The helper refuses to dispatch
unless the branch or tag resolves to the same commit on GitHub. After the
Release Preflight workflow passes, rerun it with `--include-release-preflight`
so the same CI evidence file also includes the verified preflight run URL used
by final readiness evidence. If that workflow runs on a follow-up evidence
commit, pass `--release-preflight-run-commit "$(git rev-parse HEAD)"` from the
evidence commit while keeping `--commit <release-candidate-sha>` pointed at the
tested release commit.
`release:evidence` rejects not-ready or inconsistent structured CI summaries
before writing evidence.
`npm run release:platform-evidence -- --production-profile` creates a starter
Android/iOS platform evidence file with the exact required device check names
for the maintained production-profile selected API set; it still must be filled
with real artifact, evidence URL, export preset, device, OS, API, pass, and
skip data after testing. Pass
`--commit <release-candidate-sha>` with the full 40-character tested commit SHA
when it is known so generated `nextActions` commands use that commit for CI
collection, worksheet audit, evidence assembly, and validation.
Those `nextActions` include Android and iOS
`release:record-platform-evidence` command templates before the strict
worksheet audit so real-device results can be recorded without hand-editing
JSON.
The worksheet reads `release/ci-runs.json` by default, or
`--ci-evidence <file>`, records an `initialCiEvidence` status object, and omits
duplicate Check/Godot Smoke collection commands when that file already validates
initial CI for the tested commit.
Use `npm run release:record-platform-evidence -- --platform android` or
`--platform ios` after each hosted, real-device, emulator, or simulator pass to
record artifact/evidence URL/export-preset/device metadata, optional
`--test-target real-device|hosted-device|emulator|simulator`, `--pass` check
names, and `--skip check=reason` outcomes without hand-editing JSON. Evidence
URL values must be non-local `http` or `https` links to the device test run, lab
session, committed simulator/emulator log, or signed evidence artifact;
`localhost` and loopback links are rejected. Add `--list-checks` first when
testers need the valid check names, descriptions, current worksheet outcomes,
and selected-API must-pass context without modifying the worksheet.
Run `npm run check:device-prereqs -- --summary-output release/device-test-prereqs-summary.json --allow-missing` before local device
sessions to report whether `adb`, Xcode device listing, attached Android devices
or emulators, and iOS device or simulator targets are available, whether Android
SDK/build-tools and selected Xcode command-line utilities are runnable, whether
the pinned GodotJS Android export templates are installed, that the pinned
GodotJS release does not publish an iOS export-template asset, and whether common
hosted-provider environment variable sets are configured, then leave a
gitignored JSON diagnostic next to the other release helper summaries. The
release-readiness summary and Markdown handoff
read that file into a diagnostic-only `devicePrereqs` / Device Prereq
Diagnostics section with per-platform command, blocker, warning, toolchain, and
export-template details; pass `--device-prereqs-summary <file>` to readiness
when the diagnostic lives elsewhere. The hosted-provider diagnostic reports
configured or partially configured environment variable names for BrowserStack,
Sauce Labs, Firebase Test Lab, AWS Device Farm, LambdaTest, and Kobiton, but
never their values; when none are fully configured, the text output lists the
recognized provider env-set options.
Android emulators and iOS simulators satisfy the local SDK-test prerequisite
when the final evidence records `testTarget` as `emulator` or `simulator`.
iOS local device or simulator sessions require full Xcode, not only Command Line
Tools; if `xcrun xctrace list devices` cannot find `xctrace`, install Xcode.app
and select it with
`sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`, or use hosted
Apple-device evidence. If the App Store CLI is used, Xcode is app id `497799835`
and paused downloads still need to be resumed in App Store.app; the Apple
Developer download path requires an Apple ID. Missing local tooling or provider
environment variables are only diagnostics; hosted, emulator, and simulator runs
still satisfy the release gate when the final evidence records artifact IDs,
device metadata, `testTarget`, and non-local http(s) evidence URLs.
After every unresolved
must-pass check has actually passed, add `--pass-remaining` to record the
remaining must-pass checks in one batch, and include
`--pass-remaining-confirmation "<release-specific confirmation>"` after the
device run; the recorder stores that confirmation on the platform evidence so
`release/real-device-evidence.json` keeps the audit note. Skippable checks still
need an explicit `--pass` or `--skip check=reason`; generated handoff commands
include read-only list-checks commands, skip and pass-remaining confirmation
placeholders for currently open gaps, plus per-check commands that prefill each remaining check name
for incremental device sessions. Replace every placeholder before recording evidence; the recorder,
worksheet audit, and final evidence validator reject placeholder metadata,
placeholder confirmation notes,
and placeholder skip reasons. Final `passedChecks`
must be a non-empty string array without duplicates, and final `skippedChecks`
must be an object whose values are non-empty release-specific reasons. A check
must not appear in both. The Markdown handoff separates ready-to-run commands,
templates with `<...>` placeholders, and downstream evidence assembly,
validation, commit, and push commands, and flags placeholders so device testers
know to edit them before running. The helper rejects unknown check names and
refuses to skip pass-only or selected-API-required checks. When
`--summary-output` is supplied, the recorder writes the updated audit and
follow-up `nextActions` using the same evidence and summary paths.
The production profile currently expands to `fetch`, `WebSocket`,
`checkNetworkReachability`, `navigator.onLine`, `localStorage`,
`sessionStorage`, `navigator.permissions.query`, `navigator.clipboard`,
`navigator.geolocation`, `navigator.mediaDevices.getUserMedia`,
`navigator.vibrate`, `readDeviceMotion`, `SafeAreaView`, and
`KeyboardAvoidingView`.
Final release evidence must include every production-profile API on both
Android and iOS; release evidence assembly, the real-device evidence checker,
release preflight, and strict release readiness reject evidence that omits any
profile API.
Selected API names are validated, so typos or unknown names fail before
conditional checks can be omitted.
Its `passOnlyChecks` worksheet lists core launch/runtime checks that must not
be skipped.
Use its `selectedApiRequiredChecks` worksheet to see which conditional checks
the selected APIs made mandatory, including network, clipboard, haptics,
audio-input, sensor, hardware-adapter, permission, and safe-area/keyboard
checks.
Because the production profile includes `navigator.mediaDevices.getUserMedia`,
`audio-input-if-selected` is a must-pass Android and iOS worksheet check for
production evidence.
Conditional checks required by selected APIs must be recorded in `passedChecks`,
not `skippedChecks`. Its top-level `nextActions` section records Android/iOS
list-checks, per-check, and pass-remaining
`release:record-platform-evidence` command templates, audited progress, exact
remaining metadata/must-pass/skippable gap names and structured `platformCheckDetails` descriptions, the allow-open worksheet audit
command, `npm run check`, release CI wait/dispatch commands, and final evidence
assembly, validation, commit, and push commands for after the worksheet is complete. The generated Markdown checklist separates ready-to-run audit/list commands, templates that still contain `<...>` placeholders, and downstream assembly/commit commands. Run
`npm run check:platform-evidence` without `--allow-open` before
`npm run release:evidence`.
After device testing and CI runs exist, `npm run release:evidence` assembles the
real-device and release-readiness evidence files from the current package
versions, Android/iOS platform evidence, CI evidence, and verified GitHub
Actions run metadata. Real-device and release-readiness evidence must record
full 40-character commit SHAs for the tested release commit and workflow run
commits. It strips platform worksheet fields and scaffold fields and validates normalized platform evidence
before fetching GitHub run metadata. Pass
`--commit <release-candidate-sha>` when generating evidence from a follow-up
evidence commit so the evidence records the tested release commit rather than
current `HEAD`. It rejects not-ready or inconsistent structured CI summaries,
including malformed workflow run commit SHAs, malformed `passedChecks` arrays,
malformed `skippedChecks` reason maps, and checks recorded as both passed and
skipped before writing the final evidence;
`release/real-device-evidence.json` must not contain
`requiredChecks`, `passOnlyChecks`, `selectedApiRequiredChecks`, top-level
`initialCiEvidence`, or top-level `nextActions`, and copied platform evidence is
rejected. For final readiness evidence, fetch the
`release-preflight-summary` artifact from the Release Preflight workflow with
`GH_TOKEN="$(gh auth token)" npm run release:preflight-summary -- --ci-evidence release/ci-runs.json --commit <release-candidate-sha> --output release/release-preflight-summary.json --checklist-output release/release-preflight-checklist.md`,
then pass it to `release:evidence` with
`--release-preflight-summary release/release-preflight-summary.json`. The
helpers check that the summary commit matches and that the preflight had zero
failures, zero warnings, did not use local-only mode, and did not skip release
gates before recording those facts in final readiness evidence. The checklist
records the same gate status plus the follow-up `release:evidence` and
`release:readiness` commands. When the
preflight run URL is supplied manually from a follow-up evidence commit, pass
`--release-preflight-run-commit "$(git rev-parse HEAD)"` from the evidence
commit, or the full evidence commit SHA if you are not on it, so the run
metadata is verified against the workflow commit while the summary and generated
evidence still validate the tested release candidate.

The local preflight command may warn when Godot smoke is skipped or when package
versions are newer than the registry. Release builds should run the full
workflow, including serious example app readiness, Godot smoke, and
trusted-publishing checks. Real-device evidence is read from
`release/real-device-evidence.json` or `VUE_GODOT_REAL_DEVICE_EVIDENCE`.
`--skip-serious-examples` and `--skip-godot` are intended for local validation
only; non-local preflight fails when either gate is skipped.

`npm run release:readiness -- --allow-open` reports final-removal blockers and
final TODO proof status while the production TODO remains open and does not
contact GitHub. Add
`--summary-output release/release-readiness-summary.json --checklist-output release/release-readiness-checklist.md` to write blockers,
warning markers, package description warning status, release tooling/workflow
blocker lists, TODO counts, unchecked TODO item details, final TODO proof status,
structured readiness check and evidence status, local Git state, release
handoff report currentness/format/state status, and
device prereq diagnostics from `release/device-test-prereqs-summary.json` or
`--device-prereqs-summary <file>`, and `nextActions` command hints for the
remaining evidence/finalizer work, including
the local `npm run check`, initial CI evidence collection, push/dispatch
commands, platform worksheet audit status with compact per-platform progress
counts plus exact remaining must-pass/skippable check names and structured check descriptions, separate
Android/iOS real-device evidence status with metadata, platform, and read
errors, release-readiness evidence status, and CI workflow wiring status, as
JSON and a Markdown checklist for final gate handoff. The generated Markdown
checklist and release handoff split `nextActions` commands into `Ready To Run`,
`Replace Placeholders First`, and, when platform placeholder templates are
present, `Run After Device Evidence Is Recorded` so placeholder recording
templates stay separate from downstream evidence assembly or commit commands.
Run
`npm run release:handoff -- --expected-commit <release-candidate-sha> --output release/release-handoff.md`
to render the same allow-open audit as a Markdown handoff for Android/iOS
testers; while real-device evidence is open, the release-readiness
`nextActions` include handoff write and check commands before the device-evidence action
only when `release/release-handoff.md` is missing or stale for the expected
commit and evidence paths. The handoff lists per-platform metadata/check gaps,
device prereq diagnostics, batch confirmation notes and issues, malformed
outcome details, remaining check descriptions, Release Preflight readiness
evidence paths and warning/failure counts, `blockedBy` dependencies, and next
commands. Add `--check` to verify the checked-in handoff is current without
rewriting it. When `--expected-commit` is omitted and no readiness summary is
supplied, the handoff infers the tested release commit from
`release/ci-runs.json`, or the file passed with `--ci-evidence <file>`, when the
CI evidence contains a valid consistent commit.
The initial CI, real-device, and Release Preflight evidence actions begin with
`npm run check` before collecting CI or assembling evidence. The real-device
evidence action also runs
`npm run check:device-prereqs -- --summary-output release/device-test-prereqs-summary.json --allow-missing` before local, hosted, emulator, or simulator
handoff commands so missing local tooling and hosted-provider environment
variable names, plus Android SDK/Xcode toolchain diagnostics and GodotJS
export-template diagnostics, are recorded without pretending they are evidence,
then readiness exposes that snapshot as diagnostic-only `devicePrereqs` with
per-platform command, blocker, warning, toolchain, and export-template details. The Release
Preflight evidence action also reruns
`npm run check:real-device-evidence -- --verify-runs` before CI/preflight
collection continues, so stale device evidence or unverified Check/Godot Smoke
run URLs fail before dispatching preflight.
Later `nextActions` include a `blockedBy` list when they depend on earlier
evidence actions, such as real-device evidence before Release Preflight.
The initial CI action captures Check and Godot Smoke, while Release Preflight is
captured later after real-device evidence is committed. When
`release/ci-runs.json`, or the file passed with `--ci-evidence <file>`,
already validates Check and Godot Smoke for the expected release commit,
readiness marks that initial CI evidence as ready and omits the duplicate
Check/Godot Smoke collection commands from later `nextActions`. If checked-in or
supplied CI evidence is valid for a different tested release commit and
`--expected-commit` is omitted, the summary also adds an `expected-commit`
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
dispatching Release Preflight from the current evidence commit ref with
`--release-preflight-run-commit "$(git rev-parse HEAD)"`.
That later action includes the `--dispatch-missing`,
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
`release:record-platform-evidence` command templates while gaps remain. It only
emits
`npm run release:platform-evidence -- --production-profile` when the worksheet
is missing. Before final evidence assembly it runs the strict platform worksheet
audit. The platform, device-prereq, real-device, and readiness summary/checklist outputs are
gitignored helper files for local handoff work; the committed evidence files stay
limited to the worksheet, CI evidence, assembled real-device evidence, preflight
summary/checklist, and readiness evidence. Before final evidence assembly it stages
`release/platform-evidence.json`,
`release/ci-runs.json`, and `release/real-device-evidence.json`, commits them
with `git commit -m "Add real-device release evidence"`, then pushes so the
Release Preflight workflow can run from that evidence ref. The
release-readiness evidence action stages `release/ci-runs.json`,
`release/release-preflight-summary.json`,
`release/release-preflight-checklist.md`, `release/real-device-evidence.json`,
and `release/release-readiness-evidence.json`, then commits them with
`git commit -m "Add release readiness evidence"` and pushes the commit. The
final warning-removal action runs `npm run check` after the finalizer, stages
the finalizer files, commits them, pushes, and then runs the final strict readiness
check. When an
expected commit is known, the summary resolves evidence and finalizer commands
to that tested release commit. The strict
`npm run release:readiness` command is for the committed final removal
candidate and fails unless the worktree is clean and TODO boxes, current
real-device evidence, prematurely checked final TODO boxes, release tooling
script wiring, CI workflow wiring, public-surface documentation/demo alignment,
`release/release-readiness-evidence.json`, and public warning wording are all in
the final release state. Evidence run URLs must be GitHub Actions run URLs for
`portwatcher/vue-godot`; in strict mode the run metadata is fetched from GitHub,
the workflow names must match `Check`, `Godot Smoke`, and `Release Preflight`,
the Check/Godot Smoke run commits must match the tested release commit recorded
in the evidence, the Release Preflight run commit must match the recorded
preflight workflow commit, the runs must be completed successfully, and
real-device package versions must match the current package manifests.
If evidence files are committed after testing a pushed release-candidate commit,
pass `--expected-commit <release-candidate-sha>` so strict readiness validates
the tested commit instead of the evidence commit.

After final evidence is committed, write a strict summary outside the worktree
and let the guarded finalizer apply only the final TODO checks and warning
wording removal:

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

`release:finalize-readiness` rejects summaries generated with `--allow-open`,
unexpected readiness blockers, missing evidence-backed final TODO proof status,
package description warning markers, finalizer source text drift, or a dirty
worktree. Run `npm run check`, commit the finalizer edits, then rerun strict
`npm run release:readiness`.

Use
[`docs/release-readiness-evidence.example.json`](./release-readiness-evidence.example.json)
as the schema reference for the post-preflight evidence file.

Use the `Release Preflight` GitHub Actions workflow to run non-local preflight
without publishing packages. It accepts the same real-device evidence path as
the publish workflow, accepts an `expected_commit` input for the tested release
candidate, and is the preferred source for the preflight run URL in release
records. The workflow runs
`npm run release:preflight -- --expected-commit "${{ inputs.expected_commit }}" --summary-output release/release-preflight-summary.json`
and uploads the JSON as the `release-preflight-summary` artifact for
`npm run release:evidence -- --release-preflight-summary`. Capture the matching
workflow run URL with:

```bash
npm run release:ci -- \
  --commit <release-candidate-sha> \
  --include-release-preflight \
  --release-preflight-run-commit "$(git rev-parse HEAD)" \
  --output release/ci-runs.json
```

Run that before creating final readiness evidence.

Then download the matching summary artifact:

```bash
GH_TOKEN="$(gh auth token)" npm run release:preflight-summary -- \
  --ci-evidence release/ci-runs.json \
  --commit <release-candidate-sha> \
  --output release/release-preflight-summary.json \
  --checklist-output release/release-preflight-checklist.md
```

When using `--ci-evidence`, the downloader validates the summary JSON against the
tested release commit and validates the workflow run against the
`Release Preflight` run commit recorded in CI evidence. If you supply
`--run-url` manually for a preflight run attached to a follow-up evidence commit,
also pass `--release-preflight-run-commit "$(git rev-parse HEAD)"`, or the full
evidence commit SHA if you are not on it.
The checklist output records the non-local, skip-flag, failure-count, and
warning-count status alongside the follow-up evidence commands.

To dispatch and wait for the preflight workflow from the command line, include
the workflow and evidence input:

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

For this later preflight dispatch, the ref must resolve to the current evidence
commit.
The helper sends the tested release candidate as the workflow `expected_commit`
input, so non-local preflight validates `release/real-device-evidence.json`
against the release commit even though the workflow run attaches to the
evidence commit. If Check or Godot Smoke is still missing for the release
commit, dispatch those workflows first from a release-candidate ref, then
dispatch Release Preflight from the evidence ref.

The `Check`, `Godot Smoke`, `Release Preflight`, and `Publish` workflows all run
under Node 24 with `npm@^11.15.0`, so release-candidate CI evidence is produced
with the same Node/npm baseline as the release gate.

## App Build Checklist

For each app:

1. Run `npm run build`.
2. Run `npm run check:exports` if the generated export-setting checker exists,
   or `npx vue-godot doctor --exports-only` from projects using the CLI.
3. Open the project in the GodotJS editor and run the main scene.
4. Test an exported binary for each target platform, not only editor play mode.
5. Test adapter-backed capabilities on real devices, representative hosted
   devices, emulators, or simulators.

Generated apps load `dist/app.js`, so rebuild before exporting. Keep generated
type directories and Vue source ignored by Godot resource scans; the generated
`.gdignore` files are part of that setup.

## Platform Exports

Follow the dedicated permission and adapter docs before shipping:

- [Permissions and export setup](./permissions.md)
- [Plugin adapter guide](./plugins.md)
- [Compatibility matrix](./compatibility.md)
- [Serious example app criteria](./example-apps.md)
- [Real device release checklist](./real-device-release.md)
- [Migration guide](./migration.md)
- [Performance guide](./performance.md)
- [Roadmap decisions](./roadmap.md)
- [Android platform guide](./platforms/android.md)
- [iOS and Apple platform guide](./platforms/ios.md)
- [Desktop platform guide](./platforms/desktop.md)
- [Troubleshooting](./troubleshooting.md)

Minimum platform checks:

| Platform              | Required validation                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Desktop               | Exported Windows, macOS, or Linux binary launches and loads `dist/app.js`; storage, networking, and media assets resolve. |
| Android               | Export preset includes required permissions; runtime permission prompts and adapter status mapping work on-device.        |
| iOS / Apple platforms | Usage descriptions, entitlements, and plugin setup are present; native prompts and adapter errors are tested.             |
| Web export            | Networking, file access, audio/video, and GodotJS runtime support are tested in the exported browser sandbox.             |

## Browser And Device APIs

Do not assume browser APIs exist because TypeScript accepts them. `@vue-godot/browser`
only installs implemented polyfills, and plugin-backed globals appear only when
adapters are registered.

For adapter-backed APIs, test all relevant states:

- no adapter registered
- unsupported platform
- permission denied
- missing export settings
- successful native operation

The expected behavior for each API is tracked in
[compatibility.md](./compatibility.md).

`vue-godot doctor` is a local guardrail for common setup mistakes: Node version,
package specs and installs, GodotJS typings, Vite/Volar configuration, export
permissions, and plugin-backed API hints. Treat warnings as release-review
items; real device tests still decide whether native plugins and permissions are
actually correct.

## GodotJS Version Pin

CI installs GodotJS through the shared
[setup action](../.github/actions/setup-godotjs/action.yml). The action pins:

| Input     | Current value           | Purpose                                            |
| --------- | ----------------------- | -------------------------------------------------- |
| `release` | `GodotJS_1.0.0-2`       | Release tag from `ialex32x/GodotJS-Build`.         |
| `asset`   | `prebuilt_linux_x64_v8` | Linux x64 V8 editor bundle used by CI smoke tests. |

Both CI and local runs use `scripts/setup-godotjs.mjs` to resolve, download,
cache, and probe the editor executable. Run
`npm run setup:godotjs -- --print-bin` locally to download the pinned asset for
the current platform and print a `GODOT_BIN` path that can be reused for Godot
smokes or `release:preflight`. Template-only assets use the explicit
`templates` mode because they do not contain a runnable editor; for example,
`npm run setup:godotjs -- --asset prebuilt_android_v8 --asset-kind templates --install-templates --godot-bin "$(npm run -s setup:godotjs -- --print-bin)" --print-dir`
downloads the pinned Android export-template bundle, copies it into the Godot
export-template directory for the pinned editor version, and prints that
installed directory. Use `--template-version <version>` instead of
`--godot-bin` when the release process already knows the exact Godot export
template version string.

When updating GodotJS:

1. Change the default `release` and, if needed, `asset` in the setup action and
   the platform asset map in `scripts/setup-godotjs.mjs`.
2. Open the project locally in the matching GodotJS editor and regenerate
   typings for any committed fixture/demo apps that need new engine types.
3. Run `npm run check`.
4. Run the Godot smoke workflows, including generated app and editor reload
   smoke, before publishing.
5. Note any GodotJS behavior or typing changes in the release notes.

## Release Criteria

Before removing experimental/not-production-ready language, the repository still
needs:

- all P0 and approved P1 checklist items complete
- real Godot smoke coverage in CI for supported APIs
- Android and iOS export smoke coverage for selected device APIs
- documented performance budgets
- serious native app and game UI demos that satisfy
  [the example app criteria](./example-apps.md) and pass
  `npm run check:serious-examples`
- clean or documented security/dependency audit results
- `npm run release:readiness` passing without `--allow-open`

Until those are complete, treat release builds as preview/alpha-quality and
document app-specific risk explicitly.
