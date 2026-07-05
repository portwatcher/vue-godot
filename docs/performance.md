# Performance Guide

Vue Godot performance depends on three layers: Vite bundle output, Vue renderer
work, and Godot node/resource behavior. Use this guide to set app-level budgets
and to measure regressions consistently.

These budgets are initial release targets. They are documented here, but not
fully enforced by automated benchmarks yet. Keep the testing TODOs open until
CI records and fails on the relevant measurements.

## Target Budgets

| Area | Starter app target | Serious app target | Notes |
| --- | --- | --- | --- |
| Cold launch to first usable screen | <= 2s desktop/editor, <= 4s mobile/export | app-owned budget, documented per target platform | Measure exported builds, not only editor play mode. |
| First Vue render after `_ready()` | <= 250ms desktop, <= 500ms mobile | <= 10% of cold-start budget | Time from before `createApp(...).mount()` to first screen-ready mark. |
| Hot reload edit to rebuilt `dist/app.js` | <= 1s starter, <= 3s serious app | app-owned budget | Keep stable chunk names to avoid Godot editor dependency churn. |
| Large list rendering | 60 fps target while scrolling | no sustained frame over 33ms | Use `<VirtualList>` for large fixed-height lists. |
| Asset loading for first screen | critical local assets <= 250ms after mount | remote assets async and non-blocking | Import or preload critical `res://` resources where possible. |
| Repeated mount/unmount | 100 cycles without stale rendered children | no unbounded memory growth | Existing unit and smoke tests cover stale children; memory gates are still pending. |
| Fetch/WebSocket responsiveness | app-owned timeout budget | app-owned timeout budget | Use abort/timeouts and avoid blocking first render on non-critical network calls. |

If an app needs different numbers, commit the app-specific budget in its docs or
README and explain the target hardware.

## Measuring Startup And First Render

Use `@vue-godot/browser` performance marks when browser APIs are installed:

```ts
import { installBrowserAPIs } from '@vue-godot/browser'
import { createApp } from '@vue-godot/runtime-tscn'
import type { Node } from 'godot'
import Root from './Root.vue'

installBrowserAPIs()

export function mountVue(rootNode: Node) {
  performance.mark('vue-godot:ready:start')
  const app = createApp(Root)
  performance.mark('vue-godot:mount:start')
  app.mount(rootNode)
  performance.mark('vue-godot:mount:end')

  const measure = performance.measure(
    'vue-godot:first-render',
    'vue-godot:mount:start',
    'vue-godot:mount:end',
  )

  console.log(`[perf] first render ${measure.duration.toFixed(1)}ms`)
  return app
}
```

For code that runs before browser APIs install, use `Date.now()` or Godot
timing helpers and convert to the same log format. Always include the target
platform, export mode, and hardware class with recorded numbers.

## Large Lists

Use `<VirtualList>` when a screen can render more rows than are visible.
Current virtualization supports fixed-height vertical rows. Dynamic-height
measurement and horizontal virtualization are not implemented.

Budget checklist for list screens:

- Keep row components small and side-effect free.
- Use stable keys through `keyExtractor`.
- Keep `overscan` low enough to avoid rendering hidden work, high enough to
  avoid visible blanking during fast scrolls.
- Load images asynchronously and cache resolved textures where the app owns
  repeated media.
- Avoid recomputing expensive filters or sort orders inside row render paths.

For small lists, ordinary `<ScrollView>` or Godot containers are simpler and
often faster than over-abstracting.

## Asset Loading

Prefer `res://` or relative project paths for first-screen assets. Those assets
are part of the exported project and do not depend on network conditions.

Use remote, data, blob, or `user://` sources only when they match the product
need:

| Source | Use for | Performance note |
| --- | --- | --- |
| `res://` / relative path | bundled UI images, icons, local media | best for first screen and deterministic exports |
| `user://` | user-generated or downloaded content | validate existence and size before blocking UI |
| data URL | small inline fixtures or generated content | avoid large payloads because they copy through JS strings/buffers |
| blob URL | process-local generated objects | revoke app-owned object URLs when no longer needed |
| remote URL | network content | show loading states and use timeouts/retry policy |

Do not block first render on non-critical remote assets. Render the shell first,
then stream or swap media as it becomes available.

## Network And Timers

Use `AbortController` for fetch timeouts and cancellation:

```ts
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 5000)

try {
  const response = await fetch(url, { signal: controller.signal })
  return await response.json()
} finally {
  clearTimeout(timeout)
}
```

For animation or frame-coupled UI, prefer `requestAnimationFrame()` over tight
timer loops. In Godot, the polyfill waits for process frames where available.

## Repeated Mount And Editor Reload

Generated apps should unmount Vue in `_exit_tree()` and before editor-style
remounts:

```ts
_exit_tree() {
  this.app?.unmount()
  this.app = null
}
```

Run these smokes when working on renderer lifecycle, generated templates, or
large app shells:

```bash
npm run smoke:godot
npm run smoke:generated-godot
npm run smoke:editor-reload
```

Set `GODOT_BIN=/path/to/godot` when the executable is not discoverable. These
smokes catch stale children, missing module imports, unstable chunk paths, and
editor reload behavior. They do not replace future memory-budget benchmarks.

## Bundle And Build Hygiene

- Keep `godot` external in Vite output.
- Keep `vue` aliased to `@vue/runtime-core` so the DOM renderer is not bundled.
- Keep generated chunk names stable under `dist/chunks/`.
- Run `npm run build` before export; Godot loads `dist/app.js`.
- Avoid adding broad dependencies for small helpers inside package code.
- Prefer direct Godot resources for heavy runtime assets instead of large
  JavaScript literals.

Use `npm run check` before merging performance-sensitive changes. It builds all
packages and demo apps, runs package tests, and exercises generated project
smoke flows.

## Benchmark Backlog

The production checklist still needs automated benchmarks for:

- startup time
- first Vue render
- large tree update
- large list scroll
- image/video/audio loading
- fetch/WebSocket throughput
- editor reload stability

Until those are implemented, record manual measurements in PRs that touch the
renderer, `@vue-godot/html` layout components, browser/device polyfills, Vite
templates, or smoke workflows.
