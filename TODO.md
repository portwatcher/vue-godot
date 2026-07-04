# Vue Godot Production Readiness Assessment

Goal for the product:

- A user can initialize a project easily with the CLI.
- The user can write Vue components in VSCode with useful typing/autocomplete.
- Vite watch rebuilds into the Godot project.
- Godot editor hot reload picks up the rebuilt app so the user can inspect a live scene.
- HTML-like components backed by Godot nodes are generally usable.

## Current Verdict

This is alpha-quality, not production ready yet.

The core renderer is real, both non-HTML and HTML CLI scaffolds now build from a clean project when verified against packed local packages, the generated HTML scaffold loads under a real GodotJS executable before and after a watch rebuild, the HTML demo lifecycle smoke passes under a real GodotJS executable, a headless Godot editor smoke plays a generated scene before and after a watch rebuild, and a full Godot editor UI pass has visually confirmed a generated HTML app rendering rebuilt text from `npm run dev`. The remaining production-readiness gaps are public npm install verification and remote workflow confirmation after the maintainer publishes.

## Verified Current State

- `npm run check` passes:
  - builds all packages and demo apps;
  - runs package tests;
  - runs smoke script utility tests;
  - runs clean CLI scaffold smoke for `create` and `create --html` using packed local packages.
- `@vue-godot/runtime-tscn` tests pass: 12 tests.
- `@vue-godot/html` tests pass: 100 tests.
- `@vue-godot/browser` tests pass: 17 tests.
- Basic `vue-godot create` works from a clean `/tmp` project:
  - `npm install` succeeds.
  - initial Vite build succeeds.
  - `npm run gen:types` succeeds.
  - `npm run dev` is generated as the Vite watch command.
- `vue-godot create --html` works from a clean temp project when package specs are overridden to locally packed tarballs. `npm run smoke:cli` now starts the generated HTML app's `npm run dev` watcher, edits `vue/src/App.vue`, and verifies the generated `dist` output contains the edited marker. Generated projects include `vue/.gdignore` and `gen/.gdignore` so Godot scans built output without treating Vue sources or GodotJS-generated TypeScript resource stubs as scripts.
- Generated HTML projects also include `@vue-godot/html/volar-plugin` in `vue/tsconfig.json`, and `npm run smoke:cli` asserts that configuration so VSCode/Volar resolves Godot-backed HTML components with the same compiler assumptions as the build.
- Generated Vite configs now keep secondary JavaScript chunks at stable paths under `dist/chunks/` instead of content-hashed filenames. `npm run smoke:cli`, `npm run smoke:generated-godot`, and `npm run smoke:editor-reload` assert this so Godot editor reloads do not chase stale chunk dependency paths after watch rebuilds.
- Public `npx @vue-godot/cli create my-app --html` still requires publishing `@vue-godot/browser`, `@vue-godot/html`, and the compatible CLI/runtime packages to npm. This publish/public-smoke step is maintainer-owned after local verification is complete.
- Registry check: `@vue-godot/runtime-tscn@0.0.2` is public; `@vue-godot/cli@0.0.2` is public but does not support `create --html`, so local `@vue-godot/cli@0.0.3` must be published. `@vue-godot/browser` and `@vue-godot/html` are not published yet.
- `npm whoami` succeeds as `skyquakers` in the current environment. Real publishing now reaches npm, but the registry requires an OTP; `npm run release:publish -- --yes` stopped on `EOTP` before publishing `@vue-godot/browser@0.0.1`.
- `npm pack --dry-run` for packages looks sane: built `dist` files, CLI templates, and `@vue-godot/html/volar-plugin` are included.
- `npm run smoke:public-cli` now automates the post-publish public `create --html` verification, but it cannot pass until `@vue-godot/browser` and `@vue-godot/html` are public.
- `npm run release:publish` automates the package publish order and is dry-run by default. Real publishing requires `--yes`, a clean worktree, npm auth, release preflight, and then runs the public CLI smoke unless explicitly skipped.
- `npm run release:preflight` passes with npm auth and `GODOT_BIN=/Users/jury/Developments/Godot/editor/macos-editor-4.4-v8`. It runs the local quality gate, verifies CLI-generated package specs, checks structured `npm pack --dry-run --json` contents, reads registry state, checks npm auth, and runs the Godot smokes. Local mode is still available for unauthenticated machines, and `GODOT_BIN=... npm run release:preflight -- --local --skip-check` also passes after `npm run check` has already passed.
- `GODOT_BIN` now accepts either a direct executable path or a directory containing a `godot*` executable, including macOS app-style layouts.
- `npm run smoke:godot` passes locally when `GODOT_BIN=/Users/jury/Developments/Godot/editor/macos-editor-4.4-v8`, which resolves to `godot.macos.editor.universal` (`Godot Engine v4.4.2.rc.gh.d94252cf9`). The smoke builds `apps/html-demo`, imports project assets with Godot `--import`, starts a loopback HTTP server for `fetch`, runs the scene headlessly with `VUE_GODOT_SMOKE=1`, repeatedly unmounts/remounts the Vue app, checks for stale children after unmount, checks rendered signal connection counts, drives form controls through Godot signals, checks image/SVG texture loading, and runs the demo browser API smoke helper against the loopback `fetch(new Request(...))` endpoint. The current local run reports `reloads=3`, `mounts=4`, and `unmounts=4`.
- `npm run smoke:generated-godot` passes locally with the same `GODOT_BIN` directory. It creates a clean `create --html` project from locally packed packages, builds and runs a marker app under Godot, starts the generated `npm run dev` watcher, edits `vue/src/App.vue`, verifies the rebuilt `dist` output contains the new marker, and runs the rebuilt app under Godot again. Generated projects now include `vue/.gdignore` and `gen/.gdignore`, and the smoke fails on GodotJS missing-module/script-load diagnostics, so regressions where Godot tries to load Vue source/config files or generated resource stubs as GodotJS scripts are caught automatically.
- `npm run smoke:editor-reload` passes locally with the same `GODOT_BIN` directory. It creates a clean generated HTML project, writes a visible marker app that auto-quits after mounting, starts the generated `npm run dev` watcher, enables a temporary editor plugin, opens the project with `godot --headless --editor`, uses `EditorInterface.play_main_scene()` to run the generated scene, edits the Vue source, and verifies a second editor-launched play observes the rebuilt marker without missing-module/script-load diagnostics.
- Full editor UI visual verification passed locally on a disposable `create --html` project generated from packed local packages. The project opened in the Godot editor UI, `app.tscn` and the generated project files were visible, an editor-launched game window rendered the starter HTML UI, the running `npm run dev` watcher rebuilt after two `vue/src/App.vue` edits, and the full editor-launched window rendered the final rebuilt marker (`Hello from Vue Godot HTML VISUAL RELOAD 2`). A rapid temporary-plugin replay surfaced Godot's dependency dialog once while the editor caught up to swapped chunks; accepting the focused `Open Anyway` action allowed the rebuilt app to render, and stable Vite chunk filenames were added afterward to reduce that dependency churn.
- GitHub Actions now runs `npm run check`, and the `Godot Smoke` workflow installs the pinned `GodotJS_1.0.0-2` Linux x64 V8 editor bundle before running `npm run smoke:godot`, `npm run smoke:generated-godot`, and `npm run smoke:editor-reload` on relevant PRs and pushes.
- Local `develop` includes the remote `develop` branch plus unpushed readiness commits; pushing is required before the new workflow and release-readiness commits can be verified remotely.

## Major Blockers

### 1. Publish/runtime installability

`create --html` generates a project depending on:

- `@vue-godot/html`
- `@vue-godot/browser`

Both still need to be published to the public npm registry. Local clean-user simulation now passes through packed tarballs, but public install will fail until the packages are published. This is intentionally deferred to the maintainer; Codex should not block local completion on npm OTP or public registry mutation.

Needed:

- Run `npm run release:preflight` with npm credentials and `GODOT_BIN` available.
- Run `npm run release:publish -- --yes --otp <code>` to publish missing/newer packages in dependency-safe order.
- Run `npm run smoke:public-cli` against the published packages.
- Keep CLI-generated compatible package versions in sync before each release.

### 2. Hot reload lifecycle safety

Generated root scripts now store the Vue app instance and call `app.unmount()` in `_exit_tree()`.

The renderer does free nodes when Vue removes them, `apps/html-demo` now has a headless lifecycle smoke mode that makes child and button-signal leaks visible under `npm run smoke:godot`, the generated scaffold smoke proves a rebuilt `dist/app.js` still loads under Godot, the editor reload smoke proves the Godot editor can launch the generated scene before and after a Vue source rebuild, and the manual full editor UI pass confirms the visible editor-launched app reflects rebuilt text from `npm run dev`. Those checks pass locally with a real GodotJS executable.

Needed:

- Confirm the remote `Godot Smoke` workflow is green after pushing.

### 3. Full editor UI verification is local, not automated

The most important user workflow depends on GodotJS behavior. The repo now has Node-side tests, CLI smoke tests, CI, a local headless Godot lifecycle smoke that passes with the pinned GodotJS release, a generated-scaffold Godot smoke that proves rebuilt output still runs, a headless editor reload smoke that proves `EditorInterface.play_main_scene()` observes a rebuilt generated scene after a Vite watch rebuild, and a local full editor UI visual pass. It still does not have a GUI-level screenshot assertion in CI.

Needed:

- Decide later whether a GUI-level screenshot smoke is worth automating. This is not a remaining local beta blocker.

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
- `Request` is implemented in `@vue-godot/browser`, installed by `installBrowserAPIs()`, accepted by `fetch()`, covered by package tests, and included in the html-demo browser smoke helper. The GodotJS browser smoke now exercises loopback `fetch(new Request(...))`.
- `@vue-godot/html` now exports `@vue-godot/html/volar-plugin` and imports global component declarations for both PascalCase and lowercase HTML-like tags. Generated HTML apps and `apps/html-demo` use PascalCase tags for parser/IDE compatibility while retaining lowercase aliases for SPA migration.

Needed:

- Maintainer completes publish/public smoke and remote workflow confirmation.
- Keep `apps/html-demo` aligned with every component/API.
- Confirm the form, asset loading, and loopback `fetch` smoke remain green in the remote `Godot Smoke` workflow.

### 5. Docs drift and copy-paste risk

README examples now match the generated compiler config and root docs describe `npm run dev`, stable generated chunk paths, `_exit_tree()` cleanup, the CLI smoke, the Volar plugin setup, and the optional Godot smoke.

Needed:

- Keep docs aligned with future editor reload behavior changes.

### 6. Missing project-level quality gate

Root scripts now include `test`, `test:scripts`, `smoke:cli`, `smoke:godot`, `smoke:generated-godot`, `smoke:editor-reload`, and `check`, and CI runs `npm run check`. `test:scripts` covers shared smoke utility behavior such as resolving `GODOT_BIN` from a directory. `smoke:cli` creates clean local-package projects, verifies the generated HTML app includes `@vue-godot/html/volar-plugin`, verifies generated JavaScript chunk names are stable, and verifies the generated HTML `npm run dev` watcher rebuilds `dist` after a Vue source edit. `smoke:generated-godot` creates a clean generated HTML project, verifies it runs under Godot, edits the app while the generated Vite watcher is running, checks the rebuilt output and stable chunk names, and verifies the rebuilt bundle runs under Godot. `smoke:editor-reload` opens a generated app in a headless Godot editor process, starts the generated Vite watcher, launches the scene through `EditorInterface.play_main_scene()`, edits the Vue source, and verifies a second editor-launched play observes the rebuilt marker with stable chunk names. A separate `Godot Smoke` workflow downloads and caches a pinned GodotJS Linux x64 V8 editor bundle, sets `GODOT_BIN`, and runs all Godot smokes. `smoke:godot` now goes beyond project-open verification when Godot is available: it imports project assets, runs the HTML demo scene headlessly, and requires the app's lifecycle smoke pass marker.

`release:preflight` now wraps the local quality gate, pack dry-runs, generated package-spec checks, npm registry/auth checks, `smoke:godot`, `smoke:generated-godot`, and `smoke:editor-reload`. Strict mode fails when npm credentials or Godot are missing; `--local` mode is for unauthenticated/local environments and reports those as warnings. `release:publish` provides the guarded publish flow and stays dry-run unless `--yes` is provided.

Needed:

- Confirm the `Godot Smoke` workflow is green after pushing.
- Consider GUI-level editor screenshot automation later if the manual visual pass becomes a repeated release requirement.

## Recommended Next-Session Goal

Local full editor UI verification is complete. Publish/public smoke is maintainer-owned; remote workflow confirmation follows after pushing these readiness commits.

Suggested Codex goal:

> Publish the packages and verify public install plus remote Godot workflow.

Acceptance criteria:

- `@vue-godot/browser`, `@vue-godot/html`, and compatible CLI/runtime versions are published.
- `npx @vue-godot/cli create my-app --html` works from a clean directory using public packages.
- The remote `Godot Smoke` workflow passes with `smoke:godot`, `smoke:generated-godot`, and `smoke:editor-reload`.

## Suggested Priority Order

1. Commit and push local readiness work.
2. Confirm the `Godot Smoke` workflow is green after pushing.
3. Maintainer publishes packages with an npm OTP and verifies public clean install.
4. Re-run `npm run smoke:public-cli` against the published CLI.

## Production Readiness Estimate

Public beta: likely 1-3 focused weeks if the remote Godot workflow and public npm install smoke stay green after publishing.

Production ready: likely 2-3+ months. Most remaining work is not inventing the renderer; it is hardening the full product loop, adding automated verification, publishing packages, and making the HTML abstraction predictable enough for users.
