# @vue-godot/cli

CLI tool for vue-godot projects — scaffolds new projects, integrates Vue into existing Godot projects, generates type declarations, and audits local setup.

See the repository [compatibility checklist](../../docs/compatibility.md) for current template, runtime, browser API, and component support status.

## Installation

```bash
npm install -D @vue-godot/cli
```

Or run directly with `npx`:

```bash
npx vue-godot <command> [options]
```

The unscoped [`vue-godot`](../vue-godot/README.md) npm package is a thin
`npx` alias for this package. Use `@vue-godot/cli` directly when importing CLI
helpers from scripts.

## Exported Modules

| Module               | Description                                      |
| -------------------- | ------------------------------------------------ |
| `@vue-godot/cli`     | Importable helpers such as `runDoctor()`         |
| `@vue-godot/cli/cli` | Executable CLI entry used by the `vue-godot` bin |

## Commands

### `create`

Create a new Godot project with vue-godot set up and ready to go.

```bash
vue-godot create [profile] [name] [options]
```

| Argument  | Description                                           |
| --------- | ----------------------------------------------------- |
| `profile` | Optional profile: `app` or `game-ui`                  |
| `name`    | Project name (used as dir name). Prompted if omitted. |

| Option         | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| `-f`           | Force overwrite if directory already exists                    |
| `--profile`    | Project profile: `app` or `game-ui`                            |
| `--html`       | Enable `@vue-godot/html` — HTML-like components on Godot nodes |
| `--device`     | Add `@vue-godot/device` for native/device adapter APIs         |
| `--router`     | Add a Vue Router starter module and route screens              |
| `--storage`    | Add a Web Storage helper module                                |
| `--network`    | Add a network reachability helper module                       |
| `--device-api` | Add a native/device adapter status helper module               |

When `--html` is set, the scaffolded project includes:

- `@vue-godot/html` as a dependency
- `@vue-godot/browser` as a dependency and `installBrowserAPIs()` in `main.ts`
- `@vue-godot/device` as a dependency for adapter-backed browser/device APIs
- Vite compiler config with `isNativeTag: () => false` so lowercase HTML tags like `<div>`, `<img>`, and `<a>` resolve as components
- Vite CSS collection through `@vue-godot/html/vite` plus an imported `vue/src/app.css` starter stylesheet
- `htmlPlugin` registered in `main.ts` for global component availability
- an HTML-like starter `App.vue`
- `_exit_tree()` cleanup that calls `app.unmount()` for editor reload safety
- Volar plugin in `tsconfig.json` (`vueCompilerOptions.plugins`) so the IDE resolves lowercase tags as `@vue-godot/html` components with full type-checking and hover info
- Vite output with stable secondary chunk paths under `dist/chunks/` so Godot editor reloads do not chase content-hash filenames

When `--device` is set without `--html`, the scaffolded project includes
`@vue-godot/device` for direct native/device adapter APIs, but it does not add
browser globals or HTML components.

Profiles are shortcuts for common starter shapes:

- `vue-godot create app my-app` creates an app-oriented HTML starter with
  browser APIs and `@vue-godot/device` included for native adapter registration.
- `vue-godot create game-ui my-game-ui` creates a game UI starter with
  HTML-like HUD controls. Add `--device-api` when the starter should include
  direct native/device adapter helper code.

Starter feature flags imply HTML/browser scaffold mode and can be combined with
profiles:

- `--router` adds `vue-router`, `vue/src/app/router.ts`, route screens, and
  `app.use(router)` in `main.ts`.
- `--storage` adds a typed Web Storage helper module backed by the installed
  browser polyfills.
- `--network` adds a network reachability helper using
  `checkNetworkReachability()`.
- `--device-api` adds a native adapter status helper using
  `@vue-godot/device` capability detection.

**Example:**

```bash
npx vue-godot create my-game --html
npx vue-godot create app my-native-app
npx vue-godot create game-ui my-hud
npx vue-godot create app my-routed-app --router --storage --network --device-api
cd my-game
npm run dev
```

`create` runs the initial `npm install`, generates declarations, and builds the
first bundle. Install GodotJS separately by extracting its universal release
ZIP at the project root. Keep `npm run dev` running while editing `vue/src`; Vite rebuilds
`dist/app.js` and stable `dist/chunks/*.js` files for the Godot editor to
reload.

The generated `node_modules/`, `vue/`, `gen/`, and `typings/` directories
include `.gdignore` files so Godot imports the built `dist/app.js` output
without scanning npm packages, Vite/TypeScript
source files, or generated declaration scaffolds as project resources.

Generated projects provide this type-generation command:

| Command             | Purpose                                         |
| ------------------- | ----------------------------------------------- |
| `npm run gen:types` | Regenerate Godot and Vue component declarations |

The CLI never installs, updates, or removes GodotJS. `vue-godot doctor`
checks that `addons/godotjs/godotjs.gdextension` and its mapped libraries are
present and reports the manual GitHub-release installation step when missing.

Generated projects also include `docs/production.md` and
`scripts/check-export-settings.mjs`. Run `npm run check:exports` before release
exports; it scans selected Vue/TypeScript APIs and warns when matching Android
permissions or iOS plist keys are not present in `export_presets.cfg`.
The generated export check delegates to `vue-godot doctor --exports-only`, so
the same rules are available directly from the CLI.

### `integrate`

Scaffold a `vue/` folder with Vite + Vue configuration for an existing Godot project.

```bash
vue-godot integrate [dir] [options]
```

| Argument | Description                        |
| -------- | ---------------------------------- |
| `dir`    | Target directory (defaults to `.`) |

| Option         | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| `-f`           | Force overwrite if `vue/` already exists                       |
| `--html`       | Enable `@vue-godot/html` — HTML-like components on Godot nodes |
| `--device`     | Add `@vue-godot/device` for native/device adapter APIs         |
| `--router`     | Add a Vue Router starter module and route screens              |
| `--storage`    | Add a Web Storage helper module                                |
| `--network`    | Add a network reachability helper module                       |
| `--device-api` | Add a native/device adapter status helper module               |

This command:

1. Copies a Vue + Vite template into `<dir>/vue/`
2. Creates or updates `package.json` with the necessary scripts and dependencies
3. Resolves `node_modules` paths for the generated `tsconfig.json`
4. Adds the same HTML/browser setup as `create --html` when `--html` is provided
5. Adds `@vue-godot/device` when `--device` is provided, including when combined with `--html`
6. Adds starter feature modules when `--router`, `--storage`, `--network`, or `--device-api` are provided
7. Adds production export guidance and a non-failing export-setting warning script

The copied `vue/` template and `node_modules/`, `gen/`, and `typings/` ignore
markers keep Godot's asset scan focused on generated `dist/` output rather
than installed extension copies, Vue source/config files, or generated
declaration scaffolds. The Vite config also keeps secondary JavaScript chunk
names stable under `dist/chunks/`, which avoids stale Godot editor resource
dependencies during watch rebuilds.

**Example:**

```bash
cd my-existing-godot-project
npx vue-godot integrate
npm install
# Extract godotjs-v<version>.zip here
npm run dev
```

### `gen-types`

Generate deterministic TypeScript declarations from Vue Godot's pinned
official-Godot API, then generate Vue `GlobalComponents` augmentation.
This gives Volar autocomplete and type checking for Godot node tags such as
`<Button>` and `<Label>`. Generated props include settable Godot instance
properties and exclude methods; the command also refreshes the Vue SFC shim
without introducing permissive `any` types.

```bash
vue-godot gen-types [options]
```

| Option       | Default                                   | Description                                                     |
| ------------ | ----------------------------------------- | --------------------------------------------------------------- |
| `--typings`  | generated `./typings`                     | Use an existing declarations directory and skip runtime typegen |
| `--godot`    | `GODOT_BIN` or pinned API                 | Official Godot executable used for version-matched declarations |
| `--out`      | `<typings>/godot.vue-components.gen.d.ts` | Output file path for the generated `.d.ts`                      |
| `--ancestor` | `Control`                                 | Base class — only descendants are included                      |
| `--vue-src`  | `./vue/src`                               | Vue source dir — generates an `env.d.ts` shim here              |

**Example:**

```bash
cd apps/v-model
npx vue-godot gen-types
```

`--typings` and `--godot` are mutually exclusive. Re-run after changing the
Godot version. In projects using `@vue-godot/html`, names supplied by that
component package are omitted from native `GlobalComponents` generation so
Volar sees one unambiguous component definition.

### `doctor`

Check local project setup, package specs and installed versions, the manually
installed GodotJS add-on, stock-Godot declarations,
Vite/Volar configuration, export settings, migration risks, and plugin-backed
API hints.

```bash
vue-godot doctor [dir] [options]
```

| Argument | Description                        |
| -------- | ---------------------------------- |
| `dir`    | Target directory (defaults to `.`) |

| Option           | Description                                                                |
| ---------------- | -------------------------------------------------------------------------- |
| `--exports-only` | Only scan `vue/`, `src/`, and `export_presets.cfg` for permission warnings |
| `--migration`    | Scan CSS/Vue source for web-to-Godot migration risks                       |

`doctor` exits with a non-zero status only for errors. Missing export presets,
missing `node_modules`, and adapter-backed API setup are warnings because they
depend on the local release workflow or target devices.

`vue-godot doctor --migration` adds a static migration report. It scans CSS for
unsupported selectors, properties, and at-rules; scans Vue/TypeScript source for
DOM assumptions such as `document.querySelector`, `HTMLElement`, and
`getComputedStyle()`; and suggests `@vue-godot/html` component replacements for
browser tags. The report groups findings into `small-change`, `medium`, and
`rewrite` tiers so candidate Vue apps can be triaged before deeper porting work.

## Development (monorepo)

From the repository root:

```bash
npm install
npm run build        # builds all packages via Turborepo
npx vue-godot        # runs the locally-built CLI binary
```

## License

MIT
