# Troubleshooting

Use this guide when a Vue Godot app builds but fails in the editor, works in
the editor but fails after export, or behaves differently from a browser Vue
app.

## First Checks

Run these from the app or repository you are debugging:

```bash
npm run build
npm run check:exports
```

For the monorepo, run:

```bash
npm run check
```

If a failure only appears in Godot, set `GODOT_BIN` and run the relevant smoke
script from the repository root:

```bash
GODOT_BIN=/path/to/godot npm run smoke:godot
GODOT_BIN=/path/to/godot npm run smoke:generated-godot
GODOT_BIN=/path/to/godot npm run smoke:editor-reload
GODOT_BIN="$(npm run -s setup:godot -- --print-bin)" npm run smoke:godot
```

`GODOT_BIN` can point to the executable or to a directory containing a
`godot*` executable, including macOS `.app/Contents/MacOS` layouts. The
`setup:godot` helper downloads a checksum-pinned official editor and prints the
executable path so the same editor can be reused across smoke commands. Project
JavaScript is provided by the separately installed `godot-js-runtime` addon.

## Godot Console Logs

There is no browser developer console in the Godot runtime. Read logs from:

- the Godot editor Output panel when playing from the editor
- the terminal that launched Godot
- headless smoke command output
- exported app logs for the target platform

`console.log`, `console.warn`, and `console.error` from Vue code and the
packages appear in those Godot/host logs. Prefix app-level logs with a stable
tag so they are easy to separate from Godot engine output:

```ts
console.log('[my-app] loaded settings screen')
console.warn('[my-app] location adapter unavailable')
```

Renderer and package warnings are intentionally actionable. Search for prefixes
such as `[vue-godot]`, `[vue-godot/html]`, and export setting warnings before
chasing lower-level Godot errors.

## Source Maps

Generated Vite templates build a CommonJS `dist/app.js` bundle with `godot`
external and `minify: false`. Vite build source maps are not enabled by default.
For local debugging, add `sourcemap: true` to the existing `build` object in
`vue/vite.config.ts`:

```ts
export default defineConfig({
  build: {
    // Keep the existing lib, rollupOptions, target, and minify settings.
    sourcemap: true,
  },
})
```

In generated Vite apps, TypeScript is type-checked by Vite/Vue tooling and the
template `tsconfig.json` uses `noEmit`, so TypeScript `sourceMap` options do
not control the shipped bundle. Enable Vite build source maps when you need
bundle-to-source mapping.

Keep source maps out of production exports if exposing source code or path
layout is not acceptable for your app. If the runtime still reports bundle line
numbers, inspect `dist/app.js` and `dist/app.js.map` together.

## Runtime Warnings

Common warning families:

| Prefix or source                          | Meaning                                                                             | Action                                                                                                    |
| ----------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `[vue-godot]` unsupported node class      | Vue tried to instantiate a Godot class that `ClassDB` could not create.             | Check the tag name, Godot version, generated typings, and whether the class exists in the target runtime. |
| `[vue-godot]` prop warning                | Godot rejected a prop read/write or a removed prop could not be reset.              | Verify the Godot property name, value type, and whether the target node supports the property.            |
| `[vue-godot]` signal warning              | A Vue event prop could not connect to a Godot signal.                               | Check the signal name and whether the target node exposes that signal in the current Godot version.       |
| `[vue-godot/html]` unsupported style prop | The HTML package ignored a CSS property outside the documented Godot-backed subset. | Replace it with a supported style prop or a Godot-native layout/component pattern.                        |
| Export setting warning                    | The generated export checker detected API usage without matching platform setup.    | Update `export_presets.cfg`, plist keys, entitlements, or adapter/plugin configuration before release.    |
| Device capability error                   | An adapter-backed API is unsupported, denied, missing a plugin, or misconfigured.   | Check `getStatus()`, permissions, plugin loading, and platform export settings.                           |

Warnings are not noise during migration. They usually identify the exact place
where a browser assumption or Godot binding mismatch needs a decision.

## Common JavaScript Runtime Failure Modes

### Godot Tries To Import Vue Source

Symptoms include missing-module errors for files under `vue/`, `vite.config.ts`,
or generated type files.

Expected setup:

- `vue/`, `gen/`, and `typings/` include `.gdignore` markers where generated by
  the CLI.
- Godot loads `dist/app.js`, not TypeScript or Vue source files.
- Vite chunks are emitted under stable `dist/chunks/*.js` paths.

Run `npm run build`, confirm `dist/app.js` exists, and restore missing
`.gdignore` files if a hand-edited project lost them.

### Godot Cannot Load A Chunk

Generated configs keep secondary chunk names stable with:

```ts
chunkFileNames: 'chunks/[name].js'
```

If an exported app cannot load a chunk, confirm `dist/chunks/*.js` is included
in exported resources and that the app was rebuilt before export. In editor
watch mode, keep `npm run dev` running and press F5 after Vite finishes
rebuilding.

### `Cannot find module "godot"` Outside Godot

The `godot` module is provided by `godot-js-runtime` and is externalized by the
Vite config. Do not execute `dist/app.js` directly with Node. Use unit tests for
package code and run the app through official Godot with the addon installed.

### HTML Tags Do Not Resolve As Components

Godot is not a browser, so generated HTML-mode Vite configs must set:

```ts
isNativeTag: () => false
```

For `@vue-godot/html` apps, `isCustomElement` must also exclude HTML component
names from the uppercase custom-element rule. If lowercase or PascalCase HTML
components render incorrectly, compare your config with
`apps/html-demo/vue/vite.config.ts` and ensure `htmlPlugin` is registered in
`main.ts`.

### Volar Or TypeScript Does Not Know Godot Tags

Install the standalone runtime and generate declarations from the selected
stock-Godot API:

```bash
npm run setup:runtime
npm run gen:types
```

Regenerate after Godot or runtime upgrades. For HTML-mode apps, ensure
`vueCompilerOptions.plugins` includes `@vue-godot/html/volar-plugin`.

### Browser APIs Are Missing

Call `installBrowserAPIs()` before creating routers, stores, or components that
read browser-like globals:

```ts
import { installBrowserAPIs } from '@vue-godot/browser'

installBrowserAPIs()
```

Plugin-backed globals such as `navigator.geolocation`,
`navigator.mediaDevices`, and `Notification` appear only when matching
`@vue-godot/device` adapters are registered before installation. Use
[compatibility.md](./compatibility.md) to check whether an API is supported,
partial, plugin-backed, or skipped.

### Permissions Work In Editor But Fail After Export

Editor checks do not prove mobile or sandboxed desktop permissions are correct.
Run `npm run check:exports`, then test the exported app on the target platform.
Adapters should distinguish `permission-denied`, `missing-plugin`,
`export-misconfiguration`, and `unsupported-platform` so app UI can show the
right fallback.

### CSS Is Ignored

`@vue-godot/html` supports a documented Godot-backed style subset as inline
objects, CSS declaration strings, arrays, structured theme defaults, and
explicit `createHtmlStyleSheet()` registration or global CSS imports through
`@vue-godot/html/vite`. Unsupported inline style props warn once per
component/property pair; unsupported stylesheet selectors, at-rules, media
features, variables, and properties warn with `[vue-godot/html/css]` during
Vite builds and runtime style resolution. Check
[packages/html/README.md](../packages/html/README.md) for the supported style
and media-query subset before copying browser CSS into a Godot UI. Run
`npx vue-godot doctor --migration` to get a source-level report of unsupported
selectors, properties, at-rules, and DOM assumptions.

### Camera, Microphone, Geolocation, Notifications, Or Share Fail

These capabilities are platform- and plugin-dependent. First check whether the
adapter is registered and what `getStatus()` returns. Then check the relevant
platform guide:

- [Android](./platforms/android.md)
- [iOS and Apple platforms](./platforms/ios.md)
- [Desktop](./platforms/desktop.md)

The browser package does not fake these APIs without a real backend.

## Reproducible Bug Reports

When filing or debugging a failure, capture:

- `git rev-parse --short HEAD`
- Node and npm versions
- official Godot version and `godot-js-runtime` manifest version/commit
- target platform and export preset
- the exact command that failed
- full Godot console or headless smoke output
- whether `npm run build`, `npm run check:exports`, and `npm run check` pass
- adapter `getStatus()` output for plugin-backed capabilities

Small repro projects should include `project.godot`, `vue/`, `package.json`,
`export_presets.cfg` if export behavior matters, and enough `dist/` output to
show the failure path.
