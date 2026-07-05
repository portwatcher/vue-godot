# Vue Godot

Use Vue Single File Components to build UI for Godot.

Vue Godot renders Vue components into Godot's scene tree, so you can use Vue reactivity, templates, props, events, and TypeScript tooling while Godot still owns the runtime, nodes, resources, and editor workflow.

This project is experimental and not production ready yet. Follow [@juryxiong](https://x.com/juryxiong) for updates.

See the [compatibility checklist](./docs/compatibility.md) for the current support status, platform caveats, and intentionally skipped browser APIs. See the [production readiness guide](./docs/production.md), [permissions and export setup](./docs/permissions.md), and the [plugin adapter guide](./docs/plugins.md) for release and native capability requirements, the [routing and navigation guide](./docs/routing.md) for app architecture patterns, [runtime renderer support](./docs/runtime.md) for supported Vue features and unsupported browser/DOM assumptions, and the [migration guide](./docs/migration.md) for porting existing Vue, React Native, or Godot UI code.

For build, editor, export, and runtime debugging, see [troubleshooting](./docs/troubleshooting.md).

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

| App                                              | Demonstrates                                               |
| ------------------------------------------------ | ---------------------------------------------------------- |
| [`apps/v-on`](./apps/v-on)                       | Godot signal handling with Vue events                      |
| [`apps/v-model`](./apps/v-model)                 | Two-way binding with Godot controls                        |
| [`apps/template-ref`](./apps/template-ref)       | Vue template refs against Godot nodes                      |
| [`apps/lifecycles`](./apps/lifecycles)           | Component lifecycle behavior                               |
| [`apps/anchor-ordering`](./apps/anchor-ordering) | Anchor and layout ordering behavior                        |
| [`apps/html-demo`](./apps/html-demo)             | `@vue-godot/html` components and `@vue-godot/browser` APIs |

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
│   └── html-demo/          # HTML/browser integration demo
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
npm run smoke:cli    # clean create/create --html plus generated HTML watch rebuild
npm run smoke:public-cli # post-publish create --html smoke using public npm packages
npm run smoke:godot  # optional: runs apps/html-demo lifecycle smoke with GODOT_BIN/godot4/godot
npm run smoke:generated-godot # optional: generated create --html app under Godot + watch rebuild
npm run smoke:editor-reload # optional: generated app played from the Godot editor before/after a watch rebuild
npx vue-godot doctor # optional: local project diagnostics for package/export/plugin setup
npm run check        # build + test + CLI smoke
npm run release:preflight # release gate: check + pack dry-runs + registry + Godot smokes
npm run release:publish   # publish helper used by the Publish workflow; dry-run locally
```

`npm run smoke:godot` skips when no Godot executable is available. Set `GODOT_BIN=/path/to/godot` to force a specific editor/runtime. `GODOT_BIN` may point directly at an executable or at a directory containing a `godot*` executable, including macOS `.app/Contents/MacOS` layouts. When Godot is available, the script builds `apps/html-demo`, imports project assets with Godot's `--import`, starts a loopback HTTP server for `fetch`, runs the scene headlessly with `VUE_GODOT_SMOKE=1`, and fails unless the app reports a completed lifecycle smoke. The smoke repeatedly unmounts/remounts the Vue app, checks that unmount leaves no stale children, verifies rendered signal connections, drives form controls through Godot signals, checks image/SVG texture loading, and runs the demo browser API smoke checks. Set `VUE_GODOT_SMOKE_RELOADS=10` to change the repeat count, or `VUE_GODOT_SMOKE_OPEN_ONLY=1` to run the older project-open smoke.

`npm run smoke:generated-godot` also skips when no Godot executable is available. When Godot is available, it creates a clean `create --html` project with locally packed workspace packages, replaces the generated app with a marker component, builds and runs it headlessly under Godot, starts the generated `npm run dev` watcher, edits `vue/src/App.vue`, verifies the rebuilt `dist` output contains the new marker, verifies generated JavaScript chunk paths are stable, and runs the rebuilt app under Godot again. It also fails on GodotJS missing-module/script-load diagnostics, which catches regressions where Godot scans Vue source/config files instead of only the built `dist` output.

`npm run smoke:editor-reload` also skips when no Godot executable is available. When Godot is available, it creates a clean generated HTML project, writes a visible marker app that auto-quits after mounting, starts the generated `npm run dev` watcher, enables a temporary editor plugin, opens the project with `godot --headless --editor`, uses `EditorInterface.play_main_scene()` to run the generated scene, edits the Vue source, and fails unless a second editor-launched play observes the rebuilt marker without missing-module/script-load diagnostics or unstable generated chunk names.

`npm run smoke:cli` uses locally packed workspace packages, creates both basic and HTML projects in a temp directory, builds them, then starts the generated HTML app's `npm run dev` watcher, edits `vue/src/App.vue`, and fails unless the generated `dist` output contains the edited marker and stable JavaScript chunk paths.

The `Godot Smoke` GitHub Actions workflow installs the pinned `GodotJS_1.0.0-2` Linux x64 V8 editor bundle, caches it, sets `GODOT_BIN`, and runs `npm run smoke:godot`, `npm run smoke:generated-godot`, and `npm run smoke:editor-reload` on PRs and pushes that touch the HTML demo, package code, or smoke workflow. The editor reload smoke runs under Xvfb on Linux because `EditorInterface.play_main_scene()` starts a played-scene process that needs a display server.

`npm run smoke:public-cli` must be run after publishing. It uses `npx @vue-godot/cli@latest create --html` with no local package overrides, then builds the generated app. Set `VUE_GODOT_PUBLIC_CLI_SPEC=@vue-godot/cli@<version>` to test a specific published CLI version.

`npm run release:preflight` is strict by default: it fails when packages need publishing and the process is not running in the GitHub Actions trusted-publishing environment, or when the Godot smokes skip instead of running. Use `npm run release:preflight -- --local` to validate the local build, tests, pack contents, generated package specs, and registry read checks while treating missing trusted publishing or Godot as warnings. `--skip-godot` is only warning-level with `--local`; in non-local preflight it fails the release gate.

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
