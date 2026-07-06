# Vue Godot

Vue Godot is an SDK for building Godot interfaces with Vue Single File
Components.

It provides a Vue custom renderer, HTML-like Godot components, browser API
polyfills, native capability adapter contracts, and project tooling for apps
that need Vue ergonomics without giving up Godot's runtime, nodes, resources,
and editor workflow.

This project is experimental and not production ready yet. Follow [@juryxiong](https://x.com/juryxiong) for updates.

See the [compatibility checklist](./docs/compatibility.md) for the current support status, platform caveats, and intentionally skipped browser APIs. See the [production readiness guide](./docs/production.md), [permissions and export setup](./docs/permissions.md), the [plugin adapter guide](./docs/plugins.md), and the [real device release checklist](./docs/real-device-release.md) for release and native capability requirements, the [routing and navigation guide](./docs/routing.md) for app architecture patterns, [runtime renderer support](./docs/runtime.md) for supported Vue features and unsupported browser/DOM assumptions, and the [migration guide](./docs/migration.md) for porting existing Vue, React Native, or Godot UI code.

For build, editor, export, and runtime debugging, see [troubleshooting](./docs/troubleshooting.md). For long-term ecosystem decisions that are deferred from the current production gate, see [roadmap decisions](./docs/roadmap.md).

![demo](./intro-medias/demo.gif)

## Quick Start

### Create a new Godot project

```bash
npx vue-godot create my-game
cd my-game
npm run dev
```

The `create` command runs the initial install and type generation for you. Open `project.godot` in the GodotJS editor, then press **F5**.

Use `npm run build` instead of `npm run dev` when you want a one-time build.

To start with HTML-like components such as `<Div>`, `<Img>`, `<Button>`, and `<Input>`, pass `--html`:

```bash
npx vue-godot create my-game --html
```

For app and game UI starters, use a named profile:

```bash
npx vue-godot create app my-native-app
npx vue-godot create game-ui my-hud
npx vue-godot create app my-routed-app --router --storage --network --device-api
```

The `app` profile enables HTML-like components, browser APIs, and
`@vue-godot/device` for native adapter registration. The `game-ui` profile
creates an HTML-like HUD/control starter. Use `--router`, `--storage`,
`--network`, and `--device-api` to scaffold starter modules for those app APIs.

### Add Vue to an existing Godot project

```bash
cd my-existing-godot-project
npx vue-godot integrate --html
npm install
npm run gen:types
npm run dev
```

Open the project in the GodotJS editor and run the scene.

### Try this repository

```bash
npm install
npm run build
```

Then open one of the example projects in the GodotJS editor, for example `apps/v-on/project.godot`, and press **F5**.

## Requirements

- Node.js >= 18
- [GodotJS editor](https://github.com/ialex32x/GodotJS-Build/releases)

If GodotJS prints `ERROR: Could not create directory: './typings/res:/'`, it is a known scene codegen issue in GodotJS 1.0.0-2. The error is harmless for runtime. To suppress it, open **Editor > Editor Settings**, search for `GodotJS`, and set `codegen/generate_scene_dts` to `false`.

## Basic Example

Write a Vue component using Godot node class names as tags:

```vue
<template>
  <HBoxContainer>
    <Button text="Click me" @pressed="handleClick"></Button>
    <Label :text="count.toString()"></Label>
  </HBoxContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(1)

const handleClick = () => {
  count.value = count.value + 1
}
</script>
```

Mount it from a GodotJS script:

```ts
import { createApp } from '@vue-godot/runtime-tscn'
import { Control } from 'godot'
import Counter from './Counter.vue'

export default class App extends Control {
  private app: ReturnType<typeof createApp> | null = null

  _ready() {
    this.app?.unmount()
    const app = createApp(Counter)
    app.mount(this)
    this.app = app
  }

  _exit_tree() {
    this.app?.unmount()
    this.app = null
  }
}
```

## What You Can Build With

| Need                                                                           | Use                       |
| ------------------------------------------------------------------------------ | ------------------------- |
| Vue rendering into native Godot nodes                                          | `@vue-godot/runtime-tscn` |
| Familiar HTML-style components backed by Godot nodes                           | `@vue-godot/html`         |
| Browser-like APIs such as `fetch`, `URL`, `Blob`, `history`, and `TextEncoder` | `@vue-godot/browser`      |
| Device/native capability adapters and feature detection                        | `@vue-godot/device`       |
| Project scaffolding, integration, and generated Vue component types            | `@vue-godot/cli`          |

## Packages

| Package                                                        | Description                                                      |
| -------------------------------------------------------------- | ---------------------------------------------------------------- |
| [`@vue-godot/runtime-tscn`](./packages/runtime-tscn/README.md) | Vue custom renderer for the Godot scene tree                     |
| [`@vue-godot/html`](./packages/html/README.md)                 | HTML-like Vue components implemented with Godot nodes            |
| [`@vue-godot/browser`](./packages/browser/README.md)           | Browser API polyfills for GodotJS                                |
| [`@vue-godot/device`](./packages/device/README.md)             | Device/native capability registry and adapter contracts          |
| [`@vue-godot/cli`](./packages/cli/README.md)                   | CLI for creating projects, integrating Vue, diagnosing setup, and generating types |

## Examples

| App                                              | Demonstrates                                                            |
| ------------------------------------------------ | ----------------------------------------------------------------------- |
| [`apps/v-on`](./apps/v-on)                       | Godot signal handling with Vue events                                   |
| [`apps/v-model`](./apps/v-model)                 | Two-way binding with Godot controls                                     |
| [`apps/template-ref`](./apps/template-ref)       | Vue template refs against Godot nodes                                   |
| [`apps/lifecycles`](./apps/lifecycles)           | Component lifecycle behavior                                            |
| [`apps/anchor-ordering`](./apps/anchor-ordering) | Anchor and layout ordering behavior                                     |
| [`apps/html-demo`](./apps/html-demo)             | `@vue-godot/html` components and `@vue-godot/browser` APIs              |
| [`apps/native-app-demo`](./apps/native-app-demo) | App profile: routing, storage, network, permissions, and device APIs    |
| [`apps/game-ui-demo`](./apps/game-ui-demo)       | Game UI profile: HUD state, input modes, media, settings, and inventory |

Production-readiness examples are tracked by the
[example app criteria](./docs/example-apps.md) before the project can remove
preview/experimental language.

## How It Works

Vue Godot is a custom Vue renderer that targets Godot's scene tree instead of the DOM.

- **`@vue-godot/runtime-tscn`** — A Vue custom renderer (`createRenderer` from `@vue/runtime-core`) that maps Vue operations to Godot node tree operations: `createElement` → `ClassDB.instantiate()`, `insert` → `add_child()`, `patchProp` → `el.set()` / signal `connect()`, etc.
- **`@vue-godot/cli`** — A CLI tool (`vue-godot`) for scaffolding projects, integrating Vue into an existing Godot project, diagnosing local setup with `vue-godot doctor`, and generating Vue `GlobalComponents` type augmentation from GodotJS typings.
- **`@vue-godot/html`** — HTML-like Vue components backed by Godot nodes (`<div>`, `<span>`, `<button>`, `<input>`, `<a>`, media elements, etc.).
- **`@vue-godot/browser`** — Browser API polyfills for GodotJS (`fetch`, `URL`, `Blob`, `history`, `TextEncoder`, and related APIs).
- **`@vue-godot/device`** — Device/native capability registry, adapter interfaces, feature detection, and typed capability errors.
- **Vite** builds the Vue app as a CJS library (`dist/app.js`), with `godot` as an external. The Godot scene (`.tscn`) attaches this script to a `Control` node.
- In the **Godot editor**, GodotJS runs `dist/app.js`. The `_ready()` method calls `createApp(Root).mount(this)`, and `_exit_tree()` calls `app.unmount()` so editor reloads do not retain old Vue trees.

Uppercase template tags such as `<HBoxContainer>` and `<Label>` are treated as Godot node classes. When using `@vue-godot/html`, HTML-like components such as `<Div>` and `<Button>` are registered as Vue components that render Godot nodes internally.

For the supported Vue renderer surface and the browser/DOM assumptions that do not apply in Godot, see [runtime renderer support](./docs/runtime.md).

## Repository Structure

```text
vue-godot/
├── packages/
│   ├── runtime-tscn/       # Vue custom renderer for Godot
│   ├── html/               # HTML-like components backed by Godot nodes
│   ├── browser/            # Browser API polyfills for GodotJS
│   ├── device/             # Device/native capability adapters
│   └── cli/                # CLI tool: vue-godot gen-types, scaffolding, etc.
├── apps/
│   ├── v-on/               # Event handling example
│   ├── v-model/            # Two-way binding example
│   ├── template-ref/       # Template ref example
│   ├── lifecycles/         # Lifecycle example
│   ├── anchor-ordering/    # Layout ordering example
│   ├── html-demo/          # HTML/browser integration demo
│   ├── native-app-demo/    # App profile integration example
│   └── game-ui-demo/       # Game UI profile integration example
└── turbo.json              # Turborepo config
```

Each app uses this shape:

```text
apps/<name>/
├── project.godot            # Godot project file
├── app.tscn                 # Main scene — attaches dist/app.js to a Control node
├── typings/                 # GodotJS-generated type declarations (godot*.gen.d.ts)
│   └── godot.vue-components.gen.d.ts   # Generated by @vue-godot/cli
├── gen/                     # GodotJS-generated resource type stubs, ignored by Godot scans
├── vue/
│   ├── vite.config.ts      # Builds vue/src/main.ts to dist/app.js
│   ├── tsconfig.json       # Vue and Volar TypeScript config
│   └── src/
│       ├── main.ts          # Entry: createApp(Root).mount(this) + unmount cleanup
│       ├── *.vue            # Vue SFC components
│       └── env.d.ts         # *.vue module declaration for TypeScript
├── tsconfig.json            # Godot root tsconfig (excludes vue/)
├── dist/                    # Build output (loaded by Godot at runtime)
└── package.json
```

## Creating Another App In This Repo

1. Copy an existing app directory such as `apps/v-model` to `apps/<your-app>`.
2. Update the `name` field in `package.json`.
3. Update the project name in `project.godot`.
4. Open `apps/<your-app>/project.godot` in the GodotJS editor so GodotJS can generate typings.
5. Run `npm run gen:types` in the app directory.
6. Edit Vue files under `vue/src/`.
7. Run `npm run build`, then press **F5** in Godot.

## Contributing And Local Development

Install dependencies and build everything from the repository root:

```bash
npm install
npm run build          # builds all packages + apps via Turborepo
npm run test           # runs package tests
npm run check          # build + tests + clean CLI scaffold smoke
```

Most app work follows this loop:

Open the GodotJS editor and open any app's `project.godot`, for example `apps/v-on/project.godot`. Run `npm run dev` from that app in a terminal, then press **F5** in Godot to run the scene.

When Godot typings change, regenerate Vue component types from the app directory:

```bash
cd apps/v-model
npm run gen:types
```

This runs `vue-godot gen-types`, which reads the Godot typings and produces `typings/godot.vue-components.gen.d.ts` — a `GlobalComponents` augmentation that gives Volar full autocomplete and type checking for Godot node tags in `.vue` templates.

Re-run this whenever Godot typings are regenerated (e.g. after a Godot version upgrade).

To run an app in watch mode:

```bash
cd apps/v-model
npm run dev
```

Vite compiles `vue/src/main.ts` into `dist/app.js` (CJS format, `godot` external), then rebuilds on every Vue/TypeScript change. Generated configs keep secondary JavaScript chunks at stable paths under `dist/chunks/` so the Godot editor's resource dependency cache does not chase content-hash filenames during watch rebuilds. Press **F5** in the GodotJS editor to run the scene after a build finishes. Godot loads `dist/app.js`, the `_ready()` method fires, and Vue renders its component tree into the Godot scene. On editor reload or scene exit, `_exit_tree()` unmounts the Vue app.

## Quality Gate

```bash
npm run build        # packages + demo apps
npm run test         # package tests plus script utility tests
npm run smoke:cli    # clean create/create --html/create app/create game-ui/feature starter plus generated HTML watch rebuild
npm run smoke:public-cli # post-publish create --html smoke using public npm packages
npm run setup:godotjs -- --print-bin # downloads the pinned GodotJS editor and prints GODOT_BIN
npm run smoke:godot  # optional: runs html-demo plus serious example app smokes with GODOT_BIN/godot4/godot
npm run smoke:generated-godot # optional: generated create --html app under Godot + watch rebuild
npm run smoke:editor-reload # optional: generated app played from the Godot editor before/after a watch rebuild
npx vue-godot doctor # optional: local project diagnostics for package/export/plugin setup
npm audit --audit-level=moderate # dependency security gate
npm run check:serious-examples # verifies native/game example app readiness and docs wiring
npm run check:public-surface # verifies READMEs, compatibility docs, templates, and demos match public APIs
npm run check:platform-evidence # audits Android/iOS worksheet completion before final evidence assembly
npm run check:real-device-evidence # validates Android/iOS export-smoke evidence JSON
npm run check        # build + test + CLI smoke + serious examples + performance budgets
npm run release:ci   # verifies Check/Godot Smoke for the release commit; can capture Release Preflight separately
npm run release:platform-evidence -- --production-profile # creates the Android/iOS device evidence template
npm run release:record-platform-evidence -- --help # records one Android/iOS device-test result batch
npm run release:evidence -- --help # assembles release evidence JSON from device results + CI run URLs
npm run release:finalize-readiness -- --help # applies final TODO checks + warning removal after strict evidence
npm run release:preflight # release gate: check + pack dry-runs + registry + Godot smokes
npm run release:preflight -- --summary-output release/release-preflight-summary.json # writes preflight warning/failure evidence
npm run release:preflight-summary -- --help # downloads the Release Preflight summary artifact
npm run release:publish   # publish helper used by the Publish workflow; dry-run locally
```

`npm run smoke:godot` skips when no Godot executable is available. Set `GODOT_BIN=/path/to/godot` to force a specific editor/runtime, or run `GODOT_BIN="$(npm run -s setup:godotjs -- --print-bin)" npm run smoke:godot` to download and use the pinned GodotJS editor from `.cache/godotjs`. The same `GODOT_BIN` value can be reused for `smoke:generated-godot`, `smoke:editor-reload`, and local release preflight. `GODOT_BIN` may point directly at an executable or at a directory containing a `godot*` executable, including macOS `.app/Contents/MacOS` layouts. When Godot is available, the script builds `apps/html-demo`, imports project assets with Godot's `--import`, starts a loopback HTTP server for `fetch`, runs the scene headlessly with `VUE_GODOT_SMOKE=1`, and fails unless the app reports a completed lifecycle smoke. It then builds, imports, and runs `apps/native-app-demo` and `apps/game-ui-demo` under the same Godot runtime and fails unless both production-readiness examples print their smoke pass markers without GodotJS script-load, asset-load, or signal wiring diagnostics. The HTML demo smoke repeatedly unmounts/remounts the Vue app, checks that unmount leaves no stale children, verifies rendered signal connections, drives form controls through Godot signals, checks image/SVG texture loading, and runs the demo browser API smoke checks. Set `VUE_GODOT_SMOKE_RELOADS=10` to change the repeat count, or `VUE_GODOT_SMOKE_OPEN_ONLY=1` to run the older project-open smoke for all three checked-in smoke apps.

`npm run smoke:generated-godot` also skips when no Godot executable is available. When Godot is available, it creates a clean `create --html` project with locally packed workspace packages, replaces the generated app with a marker component, builds and runs it headlessly under Godot, starts the generated `npm run dev` watcher, edits `vue/src/App.vue`, verifies the rebuilt `dist` output contains the new marker, verifies generated JavaScript chunk paths are stable, and runs the rebuilt app under Godot again. It also fails on GodotJS missing-module/script-load, asset-load, and signal wiring diagnostics, which catches regressions where Godot scans Vue source/config files instead of only the built `dist` output or where Vue event props map to nonexistent Godot signals.

`npm run smoke:editor-reload` also skips when no Godot executable is available. When Godot is available, it creates a clean generated HTML project, writes a visible marker app that auto-quits after mounting, starts the generated `npm run dev` watcher, enables a temporary editor plugin, opens the project with `godot --headless --editor`, uses `EditorInterface.play_main_scene()` to run the generated scene, edits the Vue source, and fails unless a second editor-launched play observes the rebuilt marker without missing-module/script-load, asset-load, or signal wiring diagnostics or unstable generated chunk names.

`npm run smoke:cli` uses locally packed workspace packages, creates both basic and HTML projects in a temp directory, builds them, then starts the generated HTML app's `npm run dev` watcher, edits `vue/src/App.vue`, and fails unless the generated `dist` output contains the edited marker and stable JavaScript chunk paths.

The `Check` and `Godot Smoke` GitHub Actions workflows run on Node 24 with `npm@^11.15.0`, matching the release preflight and publish runtime. The `Godot Smoke` workflow installs the pinned `GodotJS_1.0.0-2` Linux x64 V8 editor bundle with `scripts/setup-godotjs.mjs` through [`.github/actions/setup-godotjs`](./.github/actions/setup-godotjs/action.yml), caches it, sets `GODOT_BIN`, and runs `npm run smoke:godot`, `npm run smoke:generated-godot`, and `npm run smoke:editor-reload` on PRs and pushes that touch the HTML demo, serious example apps, package code, smoke workflow, or shared GodotJS setup action. The editor reload smoke runs under Xvfb on Linux because `EditorInterface.play_main_scene()` starts a played-scene process that needs a display server.

`npm run smoke:public-cli` must be run after publishing. It uses `npx @vue-godot/cli@latest create --html` with no local package overrides, then builds the generated app. Set `VUE_GODOT_PUBLIC_CLI_SPEC=@vue-godot/cli@<version>` to test a specific published CLI version.

`npm run check:public-surface` verifies that package READMEs name their package and exported subpaths, the root README links support docs and examples, generated templates keep export-ready defaults, serious example READMEs document their smoke paths, and `apps/html-demo` renders every registered `@vue-godot/html` component.

`npm run check:serious-examples` is also part of `npm run check`, so the normal local and CI check gate fails if the native app or game UI example workspace, README coverage, root README examples table, or fixture-test registration drifts.

`npm run check:real-device-evidence` reads `release/real-device-evidence.json` by default, or `VUE_GODOT_REAL_DEVICE_EVIDENCE` when the release evidence lives elsewhere. It validates the current Android/iOS export-smoke evidence format, including full 40-character evidence commit and workflow run SHAs, package versions against the current manifests, and the expected Check/Godot Smoke workflow names, documented in [real device release checklist](./docs/real-device-release.md). Add `--summary-output release/real-device-evidence-summary.json` to write validation status, errors, initial CI evidence status, platform worksheet status with compact per-platform progress counts, and `nextActions` command hints for fixing or creating evidence; missing-evidence assembly and invalid-evidence regeneration hints begin with `npm run check`, run the platform worksheet audit before final evidence assembly or regeneration, then run any still-needed release CI wait/dispatch or evidence commands, and resolve command placeholders to `--expected-commit` when it is supplied. Strict release gates also query GitHub Actions metadata for the recorded run URLs so the referenced Check and Godot Smoke runs must be completed successful runs for the tested release commit, while the Release Preflight run may attach to the later evidence commit recorded in readiness evidence.

After pushing a release candidate, `npm run release:ci -- --commit <sha> --output release/ci-runs.json` queries GitHub Actions for completed successful `Check` and `Godot Smoke` workflow runs on that exact commit. Release commit options (`--commit`, `--expected-commit`, and `--release-preflight-run-commit`) require full 40-character git commit SHAs; use `git rev-parse HEAD` or the full pushed release-candidate/evidence commit. The JSON includes `ready`, `commitFound`, required/passed/missing workflow names, structured workflow checks, local Git branch/upstream diagnostics, hints for unpushed commits or stale upstreams, `nextActions` command hints for running `npm run check` before pushing or dispatching missing workflows, and the run URLs used by release evidence. When an existing ready output file already contains the same workflow evidence, reruns keep that file unchanged so evidence-only commits do not churn on local Git diagnostics alone. Add `--wait` to poll while workflows are still running. If it reports that the commit was not found on GitHub, push the release-candidate commit first. If either workflow did not run automatically for a docs/evidence-only release commit, run `GH_TOKEN="$(gh auth token)" npm run release:ci -- --commit <sha> --dispatch-missing --wait --ref <release-candidate-branch-or-tag> --output release/ci-runs.json`; the dispatch ref must resolve to the same commit on GitHub. Pass the generated file to `npm run release:evidence -- --ci-evidence release/ci-runs.json` so the real-device evidence uses the verified run URLs and rejects not-ready or inconsistent structured CI summaries. After the `Release Preflight` workflow passes, rerun `npm run release:ci -- --commit <release-candidate-sha> --include-release-preflight --release-preflight-run-commit "$(git rev-parse HEAD)" --output release/ci-runs.json` from the evidence commit so final readiness evidence can also import the verified preflight run URL from the same CI evidence file. Omit `--release-preflight-run-commit` only when the preflight run attaches to the release-candidate commit itself.

`npm run release:platform-evidence -- --production-profile` creates a starter `release/platform-evidence.json` with the exact Android/iOS required check names for the maintained production-profile selected API set: `fetch`, `WebSocket`, `checkNetworkReachability`, `navigator.onLine`, `localStorage`, `sessionStorage`, `navigator.permissions.query`, `navigator.clipboard`, `navigator.geolocation`, `navigator.mediaDevices.getUserMedia`, `navigator.vibrate`, `readDeviceMotion`, `SafeAreaView`, and `KeyboardAvoidingView`. Pass `--commit <release-candidate-sha>` with the full 40-character tested commit SHA when it is known so generated `nextActions` commands use that commit for CI collection, worksheet audit, evidence assembly, and validation. The worksheet reads `release/ci-runs.json` by default, or `--ci-evidence <file>`, records an `initialCiEvidence` status object, and omits duplicate Check/Godot Smoke collection commands when that file already validates initial CI for the tested commit. Final release evidence must include every production-profile API on both Android and iOS; release evidence assembly, the real-device evidence checker, release preflight, and strict release readiness reject evidence that omits any profile API. The starter is intentionally not release-ready: fill the artifact, device, OS, orientation, locale, and selected APIs, then move each `requiredChecks` entry into `passedChecks` or `skippedChecks` with a release-specific reason after real device testing. Use `npm run release:record-platform-evidence -- --platform android` or `--platform ios` after each hosted or real-device pass to record artifact/device metadata, `--pass` check names, and `--skip check=reason` outcomes without hand-editing JSON; the helper rejects unknown checks and refuses to skip pass-only or selected-API-required checks. Selected API names are validated, so typos or unknown names fail before evidence can omit conditional checks. Its `passOnlyChecks` worksheet lists core launch/runtime checks that must never be skipped, and `selectedApiRequiredChecks` shows which conditional checks were triggered by the selected APIs. Those checks, such as `network-if-selected`, `clipboard-if-selected`, `haptics-if-selected`, `audio-input-if-selected`, `sensors-if-selected`, or `hardware-adapters-if-selected`, must be in `passedChecks`. Use `npm run check:platform-evidence -- --allow-open --summary-output release/platform-evidence-summary.json` during device testing to write per-platform remaining checks, metadata gaps, worksheet drift, and nextActions; run it without `--allow-open` before `npm run release:evidence`. The top-level `nextActions` section records `npm run check`, any still-needed release CI wait/dispatch commands, Android/iOS `release:record-platform-evidence` command templates before the worksheet audit command, and final evidence assembly commands for after the worksheet is complete. Keep worksheet fields only in `release/platform-evidence.json`; final `release/real-device-evidence.json` must not contain `requiredChecks`, `passOnlyChecks`, or `selectedApiRequiredChecks`.

`npm run release:evidence` assembles `release/real-device-evidence.json` and optionally `release/release-readiness-evidence.json` after the real Android/iOS checks and GitHub Actions runs exist. It reads the Android/iOS platform evidence JSON, strips worksheet fields, validates the normalized platform evidence before fetching GitHub run metadata, records current package versions, verifies the supplied or CI-evidence-derived Check/Godot Smoke/Release Preflight run URLs against GitHub Actions metadata, rejects not-ready or inconsistent structured CI summaries including malformed workflow run commit SHAs, imports the commit, local/skip flags, failure count, and warning count from `--release-preflight-summary release/release-preflight-summary.json` when readiness evidence is requested, rejects local-only, skipped, failed, or warning-bearing preflight summaries, then validates the generated evidence before writing it. Pass `--commit <release-candidate-sha>` when generating evidence from a follow-up evidence commit so the evidence records the tested release commit rather than current `HEAD`; pass `--release-preflight-run-commit "$(git rev-parse HEAD)"` with a manually supplied Release Preflight URL when that workflow attached to the current evidence commit, or pass the full evidence commit SHA if you are not on it. Directly copied platform evidence is rejected by the final evidence validator.

`npm run release:readiness -- --allow-open` prints the remaining final-readiness blockers and final TODO proof status without failing while the production-readiness TODO is still open and does not contact GitHub. Add `--summary-output release/release-readiness-summary.json` to write blockers, warning markers, package description warning status, release tooling/workflow blocker lists, TODO counts, unchecked TODO item details, final TODO proof status, structured readiness check and evidence status, local Git state, and `nextActions` command hints for the remaining evidence/finalizer work, including the local `npm run check`, initial CI evidence collection, push/dispatch commands, platform worksheet audit status with compact per-platform progress counts and gaps, separate Android/iOS real-device evidence status with metadata/platform/read errors, release-readiness evidence status, and CI workflow wiring status, as JSON for release handoff. The initial CI, real-device, and Release Preflight evidence actions begin with `npm run check` before collecting CI or assembling evidence; the initial CI action captures Check and Godot Smoke, while Release Preflight is captured later after real-device evidence is committed. When `release/ci-runs.json`, or the file passed with `--ci-evidence <file>`, already validates Check and Godot Smoke for the expected release commit, readiness marks that initial CI evidence as ready and omits the duplicate Check/Godot Smoke collection commands from later `nextActions`. If checked-in or supplied CI evidence is valid for a different tested release commit and `--expected-commit` is omitted, the summary also adds an `expected-commit` `nextActions` entry with the exact `npm run release:readiness -- --allow-open --expected-commit ...` command. If initial CI evidence is still missing, the release-readiness evidence action refreshes Check and Godot Smoke from the release-candidate ref before dispatching Release Preflight from the current evidence commit ref with `--release-preflight-run-commit "$(git rev-parse HEAD)"`. The real-device evidence action reuses an existing platform worksheet, includes Android/iOS metadata-field and required-check counts in its detail, and writes `release/platform-evidence-summary.json` when it still has gaps; while gaps remain, it includes Android/iOS `release:record-platform-evidence` command templates for recording device-test metadata and pass outcomes, and it only emits `npm run release:platform-evidence -- --production-profile` when the worksheet is missing. Before final evidence assembly it runs the strict platform worksheet audit, then stages the worksheet, CI summary, and final device evidence before `git commit -m "Add real-device release evidence"` and `git push`; the release-readiness evidence action stages the refreshed CI summary, preflight summary, real-device evidence, and readiness evidence before `git commit -m "Add release readiness evidence"`. That later action includes the `--dispatch-missing`, `--release-preflight-run-commit`, and `--real-device-evidence-path` inputs for the workflow-dispatch-only preflight workflow. The final warning-removal action runs `npm run check` after the finalizer, stages the finalizer files, commits them, and then runs the final strict readiness check. When an expected commit is known, the summary resolves evidence and finalizer commands to that tested release commit. The strict form, `npm run release:readiness`, is for the committed final removal candidate: it checks for a clean worktree, open TODO boxes, prematurely checked final TODO boxes without matching evidence, release tooling script wiring, CI workflow wiring, current real-device evidence, public-surface documentation/demo drift, `release/release-readiness-evidence.json` for a successful warning-free `Release Preflight` workflow run, GitHub Actions metadata for the recorded evidence runs, and public warning wording before experimental/not-production-ready text is removed. If evidence files are committed after testing a pushed release-candidate commit, pass `--expected-commit <release-candidate-sha>` so strict readiness validates the tested commit instead of the evidence commit.

After final real-device, CI, and Release Preflight evidence files are committed, run `npm run release:readiness -- --summary-output /tmp/vue-godot-readiness.json --expected-commit <release-candidate-sha>` without `--allow-open`, then run `npm run release:finalize-readiness -- --summary /tmp/vue-godot-readiness.json`. The finalizer refuses `--allow-open` summaries, unexpected readiness blockers, missing evidence-backed final TODO proof status, package description warning markers, finalizer source text drift, or a dirty worktree. It only checks the final TODO boxes and removes the public warning wording after strict evidence is ready; run `npm run check`, commit those edits with `git commit -m "Finalize production readiness"`, and rerun `npm run release:readiness -- --expected-commit <release-candidate-sha>` as the final gate.

`npm run release:preflight` is strict by default: it fails when packages need publishing and the process is not running in the GitHub Actions trusted-publishing environment, when the dependency audit reports moderate-or-higher advisories, when the serious example app gate fails, when the Godot smokes skip instead of running, when real-device evidence is missing/incomplete, or when the recorded Check/Godot Smoke run URLs cannot be verified against GitHub Actions metadata for the tested release commit recorded in evidence. Pass `--expected-commit <release-candidate-sha>` when preflight runs from a follow-up evidence commit but must validate real-device evidence for the tested release candidate. Add `--summary-output release/release-preflight-summary.json` to write the preflight commit, skip flags, warning count, failure count, warnings, and failures as JSON for release evidence handoff. Use `npm run release:preflight -- --local` to validate the local build, tests, pack contents including every `package.json` export target, generated package specs, registry read checks, dependency audit status, and serious example app readiness while treating missing trusted publishing, missing Godot, missing real-device evidence, or unverifiable evidence run metadata as warnings. `--skip-serious-examples` and `--skip-godot` are only warning-level with `--local`; in non-local preflight they fail the release gate.

The `Release Preflight` GitHub Actions workflow runs the full non-local preflight under the same trusted-publishing and Xvfb assumptions as the publish workflow, but does not publish packages. It accepts the committed real-device evidence path plus an `expected_commit` input for the tested release candidate. Run `npm run release:ci -- --commit <release-candidate-sha> --include-release-preflight --release-preflight-run-commit "$(git rev-parse HEAD)" --output release/ci-runs.json` from the evidence commit after it passes to capture the verified preflight run URL. To dispatch and wait for it from the CLI, use `GH_TOKEN="$(gh auth token)" npm run release:ci -- --commit <release-candidate-sha> --include-release-preflight --release-preflight-run-commit "$(git rev-parse HEAD)" --dispatch-missing --wait --ref <evidence-branch-or-tag> --real-device-evidence-path release/real-device-evidence.json --output release/ci-runs.json`; the dispatch ref must resolve to the current evidence commit for that later workflow run. If Check or Godot Smoke is still missing for the release commit, dispatch those workflows first from a release-candidate ref, then dispatch Release Preflight from the evidence ref. The workflow also uploads a `release-preflight-summary` artifact; fetch it with `GH_TOKEN="$(gh auth token)" npm run release:preflight-summary -- --ci-evidence release/ci-runs.json --output release/release-preflight-summary.json`, then pass it to `npm run release:evidence -- --ci-evidence release/ci-runs.json --release-preflight-summary release/release-preflight-summary.json` when generating final readiness evidence.

`npm run release:publish` publishes only packages that are missing from npm or newer than the registry, in dependency-safe order (`runtime-tscn`, `browser`, `device`, `html`, then `cli`). It defaults to `npm publish --dry-run`; real publishing requires `npm run release:publish -- --yes` inside the GitHub Actions trusted-publishing environment. Outside GitHub Actions, `--yes` fails before any registry write. The real publish path refuses a dirty worktree, runs `npm run release:preflight` unless `--skip-preflight` is set, and then runs `npm run smoke:public-cli` against the published CLI version unless `--skip-public-smoke` is set.

The `Publish` GitHub Actions workflow runs on `v*` tags and manual dispatch. It uses GitHub-hosted Ubuntu, Node 24, `npm@^11.15.0`, `id-token: write`, the shared GodotJS setup action, Xvfb for the editor reload preflight smoke, and `npm run release:publish -- --yes`; no npm token is needed once each package trusts `.github/workflows/publish.yml`.

Configure npm trusted publishing for each package with the GitHub repository `portwatcher/vue-godot`, workflow filename `publish.yml`, and the `npm publish` allowed action:

```bash
npx npm@latest trust github @vue-godot/runtime-tscn --repository portwatcher/vue-godot --file publish.yml --allow-publish --yes
npx npm@latest trust github @vue-godot/cli --repository portwatcher/vue-godot --file publish.yml --allow-publish --yes
npx npm@latest trust github @vue-godot/browser --repository portwatcher/vue-godot --file publish.yml --allow-publish --yes
npx npm@latest trust github @vue-godot/device --repository portwatcher/vue-godot --file publish.yml --allow-publish --yes
npx npm@latest trust github @vue-godot/html --repository portwatcher/vue-godot --file publish.yml --allow-publish --yes
```

If npm will not attach trusted publishing for a package name yet, finish the npm-side package or organization setup before releasing. This repository does not support local registry writes.

## Release Checklist

1. Ensure npm trusted publishing is configured or otherwise enabled for every package that will be released.
2. Push a `v*` tag or manually run the `Publish` workflow to publish missing/newer packages in order.
3. Confirm `npm run smoke:public-cli` passed against the published package versions.
4. Confirm the remote `Godot Smoke` workflow passed, including the editor reload smoke. Use a manual editor pass for visual inspection before a beta announcement.
