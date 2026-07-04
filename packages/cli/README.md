# @vue-godot/cli

CLI tool for vue-godot projects — scaffolds new projects, integrates Vue into existing Godot projects, and generates type declarations.

See the repository [compatibility checklist](../../docs/compatibility.md) for current template, runtime, browser API, and component support status.

## Installation

```bash
npm install -D @vue-godot/cli
```

Or run directly with `npx`:

```bash
npx @vue-godot/cli <command> [options]
```

## Commands

### `create`

Create a new Godot project with vue-godot set up and ready to go.

```bash
vue-godot create [name] [options]
```

| Argument | Description                                           |
| -------- | ----------------------------------------------------- |
| `name`   | Project name (used as dir name). Prompted if omitted. |

| Option   | Description                                                    |
| -------- | -------------------------------------------------------------- |
| `-f`     | Force overwrite if directory already exists                    |
| `--html` | Enable `@vue-godot/html` — HTML-like components on Godot nodes |

When `--html` is set, the scaffolded project includes:

- `@vue-godot/html` as a dependency
- `@vue-godot/browser` as a dependency and `installBrowserAPIs()` in `main.ts`
- `@vue-godot/device` as a dependency for adapter-backed browser/device APIs
- Vite compiler config with `isNativeTag: () => false` so lowercase HTML tags like `<div>`, `<img>`, and `<a>` resolve as components
- `htmlPlugin` registered in `main.ts` for global component availability
- an HTML-like starter `App.vue`
- `_exit_tree()` cleanup that calls `app.unmount()` for editor reload safety
- Volar plugin in `tsconfig.json` (`vueCompilerOptions.plugins`) so the IDE resolves lowercase tags as `@vue-godot/html` components with full type-checking and hover info
- Vite output with stable secondary chunk paths under `dist/chunks/` so Godot editor reloads do not chase content-hash filenames

**Example:**

```bash
npx @vue-godot/cli create my-game --html
cd my-game
npm run dev
```

`create` runs the initial `npm install` and `npm run gen:types` for you. Keep `npm run dev` running while editing `vue/src`; Vite rebuilds `dist/app.js` and stable `dist/chunks/*.js` files for the Godot editor to reload.

The generated `vue/` and `gen/` directories include `.gdignore` files so Godot imports the built `dist/app.js` output without trying to scan Vite/TypeScript source files or GodotJS-generated TypeScript resource stubs as scripts.

Generated projects also include `docs/production.md` and
`scripts/check-export-settings.mjs`. Run `npm run check:exports` before release
exports; it scans selected Vue/TypeScript APIs and warns when matching Android
permissions or iOS plist keys are not present in `export_presets.cfg`.

### `integrate`

Scaffold a `vue/` folder with Vite + Vue configuration for an existing Godot project.

```bash
vue-godot integrate [dir] [options]
```

| Argument | Description                        |
| -------- | ---------------------------------- |
| `dir`    | Target directory (defaults to `.`) |

| Option   | Description                                                    |
| -------- | -------------------------------------------------------------- |
| `-f`     | Force overwrite if `vue/` already exists                       |
| `--html` | Enable `@vue-godot/html` — HTML-like components on Godot nodes |

This command:

1. Copies a Vue + Vite template into `<dir>/vue/`
2. Creates or updates `package.json` with the necessary scripts and dependencies
3. Resolves `node_modules` paths for the generated `tsconfig.json`
4. Adds the same HTML/browser setup as `create --html` when `--html` is provided
5. Adds production export guidance and a non-failing export-setting warning script

The copied `vue/` template and root `gen/` ignore marker keep Godot's asset scan focused on generated `dist/` output rather than Vue source/config files or GodotJS-generated TypeScript resource stubs. The Vite config also keeps secondary JavaScript chunk names stable under `dist/chunks/`, which avoids stale Godot editor resource dependencies during watch rebuilds.

**Example:**

```bash
cd my-existing-godot-project
npx @vue-godot/cli integrate
npm install
npm run gen:types
npm run dev
```

### `gen-types`

Generate Vue `GlobalComponents` type augmentation from GodotJS typings. This gives Volar full autocomplete and type checking for Godot node tags (e.g. `<Button>`, `<Label>`) in `.vue` templates.

```bash
vue-godot gen-types [options]
```

| Option       | Default                                   | Description                                        |
| ------------ | ----------------------------------------- | -------------------------------------------------- |
| `--typings`  | `./typings`                               | Directory containing `godot*.gen.d.ts` files       |
| `--out`      | `<typings>/godot.vue-components.gen.d.ts` | Output file path for the generated `.d.ts`         |
| `--ancestor` | `Control`                                 | Base class — only descendants are included         |
| `--vue-src`  | `./vue/src`                               | Vue source dir — generates an `env.d.ts` shim here |

**Example:**

```bash
cd apps/v-model
npx @vue-godot/cli gen-types
```

Re-run whenever Godot typings are regenerated (e.g. after a Godot version upgrade).

## Development (monorepo)

From the repository root:

```bash
npm install
npm run build        # builds all packages via Turborepo
npx vue-godot        # runs the locally-built CLI binary
```

## License

MIT
