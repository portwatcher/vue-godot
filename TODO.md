# Vue Godot Production Readiness Assessment

Goal for the product:

- A user can initialize a project easily with the CLI.
- The user can write Vue components in VSCode with useful typing/autocomplete.
- Vite watch rebuilds into the Godot project.
- Godot editor hot reload picks up the rebuilt app so the user can inspect a live scene.
- HTML-like components backed by Godot nodes are generally usable.

## Current Verdict

This is alpha-quality, not production ready yet.

The core renderer is real and both non-HTML and HTML CLI scaffolds now build from a clean project when verified against packed local packages. The remaining production-readiness gap is external verification: publish the packages to npm and run repeated GodotJS editor hot reload tests with a real GodotJS executable.

## Verified Current State

- `npm run check` passes:
  - builds all packages and demo apps;
  - runs package tests;
  - runs clean CLI scaffold smoke for `create` and `create --html` using packed local packages.
- `@vue-godot/runtime-tscn` tests pass: 12 tests.
- `@vue-godot/html` tests pass: 88 tests.
- `@vue-godot/browser` tests pass: 10 tests.
- Basic `vue-godot create` works from a clean `/tmp` project:
  - `npm install` succeeds.
  - initial Vite build succeeds.
  - `npm run gen:types` succeeds.
  - `npm run dev` enters Vite watch mode and rebuilds `dist/app.js`.
- `vue-godot create --html` works from a clean temp project when package specs are overridden to locally packed tarballs.
- Public `npx @vue-godot/cli create my-app --html` still requires publishing `@vue-godot/browser`, `@vue-godot/html`, and the compatible CLI/runtime packages to npm.
- `npm pack --dry-run` for packages looks sane: built `dist` files and CLI templates are included.
- No Godot/GodotJS executable was available in the assessment environment, so editor hot reload could not be verified directly. `npm run smoke:godot` now builds `apps/html-demo` and, when `GODOT_BIN`, `godot4`, or `godot` is available, runs a headless lifecycle smoke that repeatedly unmounts/remounts the Vue app, checks for stale children after unmount, checks rendered signal connection counts, drives form controls through Godot signals, checks image/SVG texture loading, and runs the demo browser API smoke helper against a loopback `fetch` endpoint. It skips cleanly otherwise.
- A GitHub Actions workflow now runs `npm run check`.

## Major Blockers

### 1. Publish/runtime installability

`create --html` generates a project depending on:

- `@vue-godot/html`
- `@vue-godot/browser`

Both still need to be published to the public npm registry. Local clean-user simulation now passes through packed tarballs, but public install will fail until the packages are published.

Needed:

- Publish `@vue-godot/browser`.
- Publish `@vue-godot/html`.
- Verify `npx @vue-godot/cli create my-app --html && cd my-app && npm run build` against the published packages.
- Keep CLI-generated compatible package versions in sync before each release.

### 2. Hot reload lifecycle safety

Generated root scripts now store the Vue app instance and call `app.unmount()` in `_exit_tree()`.

The renderer does free nodes when Vue removes them, and `apps/html-demo` now has a headless lifecycle smoke mode that makes child and button-signal leaks visible under `npm run smoke:godot`. Repeated Godot editor hot reload still needs direct proof that old Vue apps, nodes, timers, watchers, and signal connections do not accumulate in the real editor workflow.

Needed:

- Run `npm run smoke:godot` with a real GodotJS executable and record the result.
- Verify repeated editor reloads do not duplicate children or signal handlers.

### 3. No automated Godot smoke test

The most important user workflow depends on GodotJS behavior. The repo now has Node-side tests, CLI smoke tests, CI, and an optional headless Godot lifecycle smoke, but not a full editor hot reload assertion.

Needed:

- Validate at minimum:
  - project opens or runs;
  - `dist/app.js` loads;
  - root Vue app mounts;
  - a known node tree appears;
  - rebuild/hot reload updates visible text;
  - repeated reload does not leak old nodes.

### 4. HTML package is beta-incomplete

Implemented MVP components:

- `<A>`
- `<Div>`
- `<Img>`
- `<Span>`
- `<Button>`
- `<Input>`
- `<Textarea>`
- `<Select>` / `<Option>`
- `<Canvas>`
- `<Video>`
- `<Audio>`
- `<Svg>`

Still incomplete or externally unverified:

- Canvas is only a bare `Control`; no `getContext('2d')`.
- Browser polyfills now have a reusable demo smoke helper that can run under `npm run smoke:godot`, and the smoke script provisions a loopback `fetch` endpoint. Form v-model paths and image/SVG asset loading are also covered by the headless smoke. These still need to be run and recorded with a real GodotJS executable.

Current beta decisions and completed hardening:

- `<style>` block support is explicitly documented as a current beta non-goal in `packages/html/README.md`; use inline style objects until a CSS-to-Godot mapping exists.
- Color parsing now supports hex, named CSS colors, `rgb()` / `rgba()`, and `hsl()` / `hsla()` for text `color` and Div `backgroundColor`.

Needed:

- Finish or explicitly defer all open beta tracker items.
- Keep `apps/html-demo` aligned with every component/API.
- Run and record the form, asset loading, and loopback `fetch` smoke with a real GodotJS executable.

### 5. Docs drift and copy-paste risk

README examples now match the generated compiler config and root docs describe `npm run dev`, `_exit_tree()` cleanup, the CLI smoke, and the optional Godot smoke.

Needed:

- Document observed Godot editor hot reload behavior after real editor verification.

### 6. Missing project-level quality gate

Root scripts now include `test`, `smoke:cli`, `smoke:godot`, and `check`, and CI runs `npm run check`. `smoke:godot` now goes beyond project-open verification when Godot is available: it runs the HTML demo scene headlessly and requires the app's lifecycle smoke pass marker.

Needed:

- Add CI coverage with an installed GodotJS executable.
- Expand beyond headless lifecycle simulation to a real editor hot reload assertion when GodotJS CLI/editor support is available.

## Recommended Next-Session Goal

Start with public publishing plus real GodotJS hot reload verification.

Suggested Codex goal:

> Publish the packages and verify HTML scaffold + Godot editor hot reload end to end.

Acceptance criteria:

- `@vue-godot/browser` and `@vue-godot/html` are published.
- `npx @vue-godot/cli create my-app --html` works from a clean directory using public packages.
- `npm run dev` rebuilds `dist/app.js`, and GodotJS editor reload reflects the change.
- Repeated reload does not duplicate children or signal handlers.

## Suggested Priority Order

1. Publish packages and verify public clean install.
2. Run and record the GodotJS headless lifecycle smoke on a real executable.
3. GodotJS editor hot reload smoke verification.
4. Finish HTML beta tracker:
   - Canvas `getContext('2d')` or documented longer-term replacement.
   - More browser tests under real GodotJS, especially `fetch`.
5. Documentation pass based on observed Godot editor behavior.

## Production Readiness Estimate

Public beta: likely 2-4 focused weeks if GodotJS hot reload behaves well once tested.

Production ready: likely 2-3+ months. Most remaining work is not inventing the renderer; it is hardening the full product loop, adding automated verification, publishing packages, and making the HTML abstraction predictable enough for users.
