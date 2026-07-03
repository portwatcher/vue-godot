# Vue Godot Production Readiness Assessment

Goal for the product:

- A user can initialize a project easily with the CLI.
- The user can write Vue components in VSCode with useful typing/autocomplete.
- Vite watch rebuilds into the Godot project.
- Godot editor hot reload picks up the rebuilt app so the user can inspect a live scene.
- HTML-like components backed by Godot nodes are generally usable.

## Current Verdict

This is alpha-quality, not production ready yet.

The core renderer is real, both non-HTML and HTML CLI scaffolds now build from a clean project when verified against packed local packages, the generated HTML scaffold loads under a real GodotJS executable before and after a watch rebuild, and the HTML demo lifecycle smoke passes under a real GodotJS executable. The remaining production-readiness gap is external verification: publish the packages to npm, confirm the remote Godot smoke workflow is green, and run repeated GodotJS editor hot reload tests.

## Verified Current State

- `npm run check` passes:
  - builds all packages and demo apps;
  - runs package tests;
  - runs clean CLI scaffold smoke for `create` and `create --html` using packed local packages.
- `@vue-godot/runtime-tscn` tests pass: 12 tests.
- `@vue-godot/html` tests pass: 100 tests.
- `@vue-godot/browser` tests pass: 17 tests.
- Basic `vue-godot create` works from a clean `/tmp` project:
  - `npm install` succeeds.
  - initial Vite build succeeds.
  - `npm run gen:types` succeeds.
  - `npm run dev` is generated as the Vite watch command.
- `vue-godot create --html` works from a clean temp project when package specs are overridden to locally packed tarballs. `npm run smoke:cli` now starts the generated HTML app's `npm run dev` watcher, edits `vue/src/App.vue`, and verifies the generated `dist` output contains the edited marker.
- Public `npx @vue-godot/cli create my-app --html` still requires publishing `@vue-godot/browser`, `@vue-godot/html`, and the compatible CLI/runtime packages to npm.
- Registry check: `@vue-godot/runtime-tscn@0.0.2` is public; `@vue-godot/cli@0.0.2` is public but does not support `create --html`, so local `@vue-godot/cli@0.0.3` must be published. `@vue-godot/browser` and `@vue-godot/html` are not published yet.
- `npm whoami` returns 401 in the current environment, so publishing cannot be completed here without npm credentials.
- `npm pack --dry-run` for packages looks sane: built `dist` files and CLI templates are included.
- `npm run smoke:public-cli` now automates the post-publish public `create --html` verification, but it cannot pass until `@vue-godot/browser` and `@vue-godot/html` are public.
- `npm run release:publish` automates the package publish order and is dry-run by default. Real publishing requires `--yes`, a clean worktree, npm auth, release preflight, and then runs the public CLI smoke unless explicitly skipped.
- `npm run release:preflight -- --local` passes. It runs the local quality gate, verifies CLI-generated package specs, checks structured `npm pack --dry-run --json` contents, reads registry state, reports missing npm auth as a warning in local mode, and runs the Godot smokes when `GODOT_BIN` is set. After `npm run check` has already passed, `GODOT_BIN=... npm run release:preflight -- --local --skip-check` also passes.
- `npm run smoke:godot` passes locally with `GodotJS_1.0.0-2` macOS arm64 V8 (`Godot Engine v4.4.1.rc.custom_build.daa4b058e`) when `GODOT_BIN` points at the downloaded editor binary. The smoke builds `apps/html-demo`, imports project assets with Godot `--import`, starts a loopback HTTP server for `fetch`, runs the scene headlessly with `VUE_GODOT_SMOKE=1`, repeatedly unmounts/remounts the Vue app, checks for stale children after unmount, checks rendered signal connection counts, drives form controls through Godot signals, checks image/SVG texture loading, and runs the demo browser API smoke helper against the loopback `fetch` endpoint. The current local run reports `reloads=3`, `mounts=4`, and `unmounts=4`.
- `npm run smoke:generated-godot` passes locally with the same GodotJS binary. It creates a clean `create --html` project from locally packed packages, builds and runs a marker app under Godot, starts the generated `npm run dev` watcher, edits `vue/src/App.vue`, verifies the rebuilt `dist` output contains the new marker, and runs the rebuilt app under Godot again.
- GitHub Actions now runs `npm run check`, and the `Godot Smoke` workflow installs the pinned `GodotJS_1.0.0-2` Linux x64 V8 editor bundle before running `npm run smoke:godot` and `npm run smoke:generated-godot` on relevant PRs and pushes.

## Major Blockers

### 1. Publish/runtime installability

`create --html` generates a project depending on:

- `@vue-godot/html`
- `@vue-godot/browser`

Both still need to be published to the public npm registry. Local clean-user simulation now passes through packed tarballs, but public install will fail until the packages are published.

Needed:

- Run `npm run release:preflight` with npm credentials and `GODOT_BIN` available.
- Run `npm run release:publish -- --yes` to publish missing/newer packages in dependency-safe order.
- Run `npm run smoke:public-cli` against the published packages.
- Keep CLI-generated compatible package versions in sync before each release.

### 2. Hot reload lifecycle safety

Generated root scripts now store the Vue app instance and call `app.unmount()` in `_exit_tree()`.

The renderer does free nodes when Vue removes them, `apps/html-demo` now has a headless lifecycle smoke mode that makes child and button-signal leaks visible under `npm run smoke:godot`, and the generated scaffold smoke proves a rebuilt `dist/app.js` still loads under Godot. Those smokes pass locally with a real GodotJS executable. Repeated Godot editor hot reload still needs direct proof that old Vue apps, nodes, timers, watchers, and signal connections do not accumulate in the real editor workflow.

Needed:

- Confirm the remote `Godot Smoke` workflow is green after pushing.
- Verify repeated editor reloads do not duplicate children or signal handlers.

### 3. Godot smoke is headless, not full editor hot reload

The most important user workflow depends on GodotJS behavior. The repo now has Node-side tests, CLI smoke tests, CI, a local headless Godot lifecycle smoke that passes with the pinned GodotJS release, a generated-scaffold Godot smoke that proves rebuilt output still runs, and a GitHub Actions `Godot Smoke` workflow that installs a pinned GodotJS executable before running both Godot smokes. It still does not have a full editor hot reload assertion.

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

- Browser polyfills now have a reusable demo smoke helper that runs under `npm run smoke:godot`, and the smoke script provisions a loopback `fetch` endpoint. Form v-model paths and image/SVG asset loading are covered by the local headless GodotJS smoke. The remote `Godot Smoke` workflow still needs to be confirmed green after pushing.

Current beta decisions and completed hardening:

- `<style>` block support is explicitly documented as a current beta non-goal in `packages/html/README.md`; use inline style objects until a CSS-to-Godot mapping exists.
- Canvas `getContext('2d')` is explicitly deferred for beta; use a template ref to the underlying Godot `Control` and native draw/`queue_redraw()` methods.
- Color parsing now supports hex, named CSS colors, `rgb()` / `rgba()`, and `hsl()` / `hsla()` for text `color` and Div `backgroundColor`.
- `fontWeight: 'bold'` maps to a Godot `FontVariation` embolden override for text controls.
- `Request` is implemented in `@vue-godot/browser`, installed by `installBrowserAPIs()`, accepted by `fetch()`, covered by package tests, and included in the html-demo browser smoke helper.

Needed:

- Finish or explicitly defer all open beta tracker items.
- Keep `apps/html-demo` aligned with every component/API.
- Confirm the form, asset loading, and loopback `fetch` smoke remain green in the remote `Godot Smoke` workflow.

### 5. Docs drift and copy-paste risk

README examples now match the generated compiler config and root docs describe `npm run dev`, `_exit_tree()` cleanup, the CLI smoke, and the optional Godot smoke.

Needed:

- Document observed Godot editor hot reload behavior after real editor verification.

### 6. Missing project-level quality gate

Root scripts now include `test`, `smoke:cli`, `smoke:godot`, `smoke:generated-godot`, and `check`, and CI runs `npm run check`. `smoke:cli` creates clean local-package projects and verifies the generated HTML `npm run dev` watcher rebuilds `dist` after a Vue source edit. `smoke:generated-godot` creates a clean generated HTML project, verifies it runs under Godot, edits the app while the generated Vite watcher is running, checks the rebuilt output, and verifies the rebuilt bundle runs under Godot. A separate `Godot Smoke` workflow downloads and caches a pinned GodotJS Linux x64 V8 editor bundle, sets `GODOT_BIN`, and runs both Godot smokes. `smoke:godot` now goes beyond project-open verification when Godot is available: it imports project assets, runs the HTML demo scene headlessly, and requires the app's lifecycle smoke pass marker.

`release:preflight` now wraps the local quality gate, pack dry-runs, generated package-spec checks, npm registry/auth checks, `smoke:godot`, and `smoke:generated-godot`. Strict mode fails when npm credentials or Godot are missing; `--local` mode is for unauthenticated/local environments and reports those as warnings. `release:publish` provides the guarded publish flow and stays dry-run unless `--yes` is provided.

Needed:

- Confirm the `Godot Smoke` workflow is green after pushing.
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
2. Confirm the `Godot Smoke` workflow is green after pushing.
3. GodotJS editor hot reload smoke verification.
4. Finish HTML beta tracker:
   - More browser tests under real GodotJS, especially `fetch`.
5. Documentation pass based on observed Godot editor behavior.

## Production Readiness Estimate

Public beta: likely 2-4 focused weeks if GodotJS hot reload behaves well once tested.

Production ready: likely 2-3+ months. Most remaining work is not inventing the renderer; it is hardening the full product loop, adding automated verification, publishing packages, and making the HTML abstraction predictable enough for users.
