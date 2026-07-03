# Vue Godot Production Readiness Assessment

Goal for the product:

- A user can initialize a project easily with the CLI.
- The user can write Vue components in VSCode with useful typing/autocomplete.
- Vite watch rebuilds into the Godot project.
- Godot editor hot reload picks up the rebuilt app so the user can inspect a live scene.
- HTML-like components backed by Godot nodes are generally usable.

## Current Verdict

This is alpha-quality, not production ready yet.

The core renderer is real and the non-HTML CLI scaffold works from a clean project. The HTML component package has broad MVP coverage and useful tests, but the full "CLI init -> write Vue -> watch build -> Godot editor hot reload -> inspect usable HTML components" workflow is not yet end-to-end reliable.

## Verified Current State

- `npm run build` passes for all packages and demo apps.
- `@vue-godot/runtime-tscn` tests pass: 12 tests.
- `@vue-godot/html` tests pass: 80 tests.
- `@vue-godot/browser` has a test script but currently runs 0 tests.
- Basic `vue-godot create` works from a clean `/tmp` project:
  - `npm install` succeeds.
  - initial Vite build succeeds.
  - `npm run gen:types` succeeds.
  - `npm run dev` enters Vite watch mode and rebuilds `dist/app.js`.
- `vue-godot create --html` currently fails from a clean project because `@vue-godot/html` and `@vue-godot/browser` are not published to npm.
- `npm pack --dry-run` for packages looks sane: built `dist` files and CLI templates are included.
- No Godot/GodotJS executable was available in the assessment environment, so editor hot reload could not be verified directly.
- There is no CI workflow or single root test/check command.

## Major Blockers

### 1. Publish/runtime installability

`create --html` generates a project depending on:

- `@vue-godot/html`
- `@vue-godot/browser`

Both are currently missing from the public npm registry, so clean-user install fails with npm 404. This blocks the exact desired HTML-first CLI workflow.

Needed:

- Publish `@vue-godot/browser`.
- Publish `@vue-godot/html`.
- Verify `npx vue-godot create my-app --html && cd my-app && npm install && npm run build`.
- Consider making CLI versions pin compatible package versions instead of using loose ranges.

### 2. Hot reload lifecycle safety

Generated root scripts call `createApp(App).mount(this)` inside `_ready()` but do not store the app instance or call `app.unmount()` in `_exit_tree()`.

The renderer does free nodes when Vue removes them, but repeated Godot editor hot reload needs explicit proof that old Vue apps, nodes, timers, watchers, and signal connections do not accumulate.

Needed:

- Update generated `main.ts` templates to store the Vue app instance.
- Add `_exit_tree()` and call `app.unmount()`.
- Verify repeated editor reloads do not duplicate children or signal handlers.
- Add a reload counter/smoke scene that makes leaks obvious.

### 3. No automated Godot smoke test

The most important user workflow depends on GodotJS behavior, but the repo currently only has Node-side tests and manual demos.

Needed:

- Add a documented GodotJS smoke command if headless/editor CLI support is available.
- Validate at minimum:
  - project opens or runs;
  - `dist/app.js` loads;
  - root Vue app mounts;
  - a known node tree appears;
  - rebuild/hot reload updates visible text;
  - repeated reload does not leak old nodes.

### 4. HTML package is beta-incomplete

Implemented MVP components:

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

Still incomplete:

- `<A>` / anchor component.
- `backgroundColor` / color theme overrides on containers.
- `<style>` block support or a clear documented non-goal.
- Canvas is only a bare `Control`; no `getContext('2d')`.
- Browser polyfills have little automated coverage.

Needed:

- Finish or explicitly defer all open beta tracker items.
- Keep `apps/html-demo` aligned with every component/API.
- Add smoke tests for plugin registration, lowercase tags, form v-model, asset loading, and browser APIs.

### 5. Docs drift and copy-paste risk

`packages/html/README.md` still shows an older compiler config using `isNativeTag: (tag) => !htmlTags.includes(tag)`.

Repo guidance and generated config correctly require:

```ts
isNativeTag: () => false
```

Needed:

- Fix README examples to match generated config.
- Make root README say `npm run dev`, not only `npm run build -> F5`, for the hot reload loop.
- Document exactly what Godot editor hot reload does and what users should expect.

### 6. Missing project-level quality gate

Current root scripts are mostly build-only. There is no single command that proves the repo is healthy.

Needed:

- Add root `test` script that runs package tests.
- Add root `check` script for build + tests + CLI smoke.
- Add CI workflow.
- Add release/publish checklist.
- Consider `noEmitOnError: true` for packages before beta.

## Recommended Next-Session Goal

Start with the installability blocker because it determines whether the desired CLI workflow can work for any external user.

Suggested Codex goal:

> Make the HTML CLI scaffold installable and verifiable from a clean project.

Acceptance criteria:

- `@vue-godot/browser` is ready to publish and has at least basic tests.
- `@vue-godot/html` is ready to publish and depends on the published browser package.
- `vue-godot create --html` works from a clean directory.
- Generated HTML project starts with an HTML-like template, not only a Godot `<Label>`.
- A root smoke command verifies basic create and create-html flows.
- README instructions match the generated project.

## Suggested Priority Order

1. Publishability and clean CLI smoke.
2. Generated root lifecycle cleanup with `_exit_tree()` / `app.unmount()`.
3. Root `check` command and CI.
4. GodotJS hot reload smoke verification.
5. Finish HTML beta tracker:
   - `<A>`
   - color/background support
   - browser tests
   - demo coverage
6. Documentation pass.

## Production Readiness Estimate

Public beta: likely 2-4 focused weeks if GodotJS hot reload behaves well once tested.

Production ready: likely 2-3+ months. Most remaining work is not inventing the renderer; it is hardening the full product loop, adding automated verification, publishing packages, and making the HTML abstraction predictable enough for users.
