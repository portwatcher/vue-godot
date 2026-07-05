# Production Readiness TODO

Goal: make Vue Godot credible for serious native apps and game UI built with Vue.js on Godot.

When this file is complete, maintainers should be confident enough to remove wording such as "not production ready", "alpha", and "experimental" from public docs and package descriptions. Until every P0 and P1 item below is complete and verified, keep those warnings.

## Current Readiness Snapshot

- `@vue-godot/runtime-tscn` renders Vue into Godot nodes and has unit coverage for insertion, prop reset, signals, static text, diagnostics, lifecycle behavior, and stress update patterns.
- `@vue-godot/html` exposes a small HTML-like component set and an inline style subset.
- `@vue-godot/browser` exposes an initial browser API subset: `fetch`, `Request`, `Response`, `Headers`, `Blob`, `URL`, `TextEncoder`, `TextDecoder`, `AbortController`, base64 helpers, `history`, `location`, basic global event dispatch, adapter-backed `navigator.geolocation`, adapter-backed `navigator.mediaDevices.getUserMedia()`, and adapter-backed `Notification`.
- `@vue-godot/device` exposes a capability registry, adapter contracts, feature detection helpers, and typed errors for plugin-backed native APIs.
- The repo has build/test/CLI smoke checks, generated export-setting checks, and CI Godot smoke workflows.
- The project is not yet production ready because platform APIs, app UI primitives, device integration, and release/device smoke coverage are still incomplete.

## Definition Of Done

The project is production ready only when all of these are true:

- [x] A public compatibility checklist exists and every supported, partial, plugin-backed, or intentionally unsupported web API/component is documented.
- [ ] All P0 and P1 checklist items in this file are complete.
- [ ] `npm run check` passes locally and in CI.
- [ ] Godot smoke, generated Godot smoke, and editor reload smoke pass in CI for every release candidate.
- [ ] Android and iOS export smoke apps run on real or hosted devices for the production profile.
- [x] At least two serious example apps exist:
  - [x] A native app style demo using routing, forms, network, storage, camera or geolocation, permissions, and offline/reachability handling.
  - [x] A game UI demo using Godot scenes plus Vue UI, controller/touch/keyboard navigation, animation, audio/video/image assets, and pause/settings/inventory style workflows.
- [x] Performance budgets are documented and enforced for app startup, first rendered UI, hot reload, large list rendering, asset loading, and repeated mount/unmount.
- [x] Security and dependency audits are clean or documented with accepted risk.
- [ ] Package READMEs, root README, generated templates, and demo apps match the final supported API surface.
- [x] Public docs include platform limits, permission setup, export setup, troubleshooting, and migration guidance from Vue web apps.
- [ ] The wording "not production ready", "alpha", and "experimental" is removed only after all criteria above are satisfied.

## Compatibility Strategy

- [x] Create `docs/compatibility.md` as the source of truth.
- [x] Track each API/component with this schema:
  - API or component name.
  - Package owner: `runtime-tscn`, `html`, `browser`, `device`, `cli`, or plugin.
  - Status: `supported`, `partial`, `requires-plugin`, `planned`, `skipped`.
  - Godot backend: class/module/plugin used, or reason none exists.
  - Platforms: desktop, Android, iOS, Web export, editor.
  - Permission/export requirements.
  - Tests: unit, simulated Godot, real Godot smoke, real device.
  - Known caveats and spec differences.
- [x] Do not install fake browser globals by default when there is no real backend.
- [x] Prefer best-effort web-compatible APIs where behavior is close enough.
- [x] Prefer explicit adapters for APIs requiring native plugins.
- [x] Mark impossible or misleading browser APIs as `skipped` with a clear explanation.
- [x] Wrapping stable Godot modules is acceptable.
- [x] Wrapping stable Godot plugins or native Android/iOS plugins is acceptable when core Godot does not expose the capability.

## P0: Runtime And Platform Foundation

- [x] Harden `@vue-godot/runtime-tscn` for production.
  - [x] Remove or justify all source-level `any` usage with safer interop types or `unknown` plus guards.
  - [x] Add stress tests for repeated mount/unmount, large tree updates, reordered keyed children, event replacement, and prop removal.
  - [x] Add runtime diagnostics that identify unsupported node classes, props, and signals with actionable messages.
  - [x] Add lifecycle tests for editor reload, scene exit, nested apps, and failed mounts.
  - [x] Document supported Vue features and unsupported Vue/DOM assumptions.
- [x] Add a production-grade platform capability layer.
  - [x] Create `@vue-godot/device` or an equivalent module namespace for device/native APIs.
  - [x] Define adapter interfaces for plugin-backed capabilities.
  - [x] Provide feature detection helpers such as `isSupported("geolocation")`.
  - [x] Ensure APIs return predictable typed errors for unsupported platforms, denied permissions, missing plugins, and export misconfiguration.
- [x] Make generated projects production-oriented.
  - [x] Add production export guidance for desktop, Android, iOS, and Web where applicable.
  - [x] Add Android permission presets for networking, camera, audio input, vibration, notifications, and location where used.
  - [x] Add iOS permission/plist guidance for camera, microphone, location, and photo/media access where used.
  - [x] Add template checks that warn when selected APIs need missing export settings.

## P0: Browser API Compatibility

- [x] Expand `@vue-godot/browser` into a serious compatibility layer.
- [x] Preserve and harden existing APIs:
  - [x] `fetch`
  - [x] `Request`
  - [x] `Response`
  - [x] `Headers`
  - [x] `Blob`
  - [x] `URL`
  - [x] `TextEncoder`
  - [x] `TextDecoder`
  - [x] `AbortController`
  - [x] `history`
  - [x] `location`
  - [x] global `addEventListener` / `removeEventListener` / `dispatchEvent`
- [x] Add high-priority web APIs:
  - [x] `setTimeout`, `clearTimeout`, `setInterval`, `clearInterval` if missing in target runtimes.
  - [x] `queueMicrotask` if missing.
  - [x] `requestAnimationFrame` and `cancelAnimationFrame` backed by Godot frame timing.
  - [x] `performance.now()` and basic performance marks/measures.
  - [x] `URLSearchParams`.
  - [x] `FormData`.
  - [x] `File`.
  - [x] `FileReader` or documented skip if not worth supporting.
  - [x] `WebSocket` backed by `WebSocketPeer`.
  - [x] `localStorage` backed by `user://`.
  - [x] `sessionStorage` backed by process memory or `user://` with documented lifecycle.
  - [x] `navigator.onLine` plus `online` and `offline` events.
  - [x] Network reachability probe configuration.
  - [x] `navigator.clipboard.readText` / `writeText` where platform clipboard APIs permit.
  - [x] Limited `navigator.permissions.query()` for supported mapped permissions.
  - [x] `navigator.vibrate()` backed by Godot handheld vibration where available.
  - [x] Device motion/orientation events backed by `Input.get_accelerometer()`, `get_gyroscope()`, `get_magnetometer()`, and `get_gravity()`.
- [x] Add plugin-backed browser-like APIs:
  - [x] `navigator.geolocation` through a registered geolocation adapter.
  - [x] `navigator.mediaDevices.getUserMedia()` through camera/microphone adapters where available.
  - [x] `MediaStream` subset if camera/microphone support needs browser compatibility.
  - [x] `Notification` only if native notification plugins are installed and permissions are configured.
- [x] Decide and document skipped APIs:
  - [x] DOM `document` and real element tree.
  - [x] Service workers.
  - [x] Web workers unless a safe GodotJS worker story exists.
  - [x] IndexedDB unless a real storage engine is added.
  - [x] WebRTC browser API unless mapped to Godot WebRTC classes with credible compatibility.

## P0: HTML And Native UI Components

- [x] Expand `@vue-godot/html` beyond the current demo component surface.
- [x] Add core app primitives:
  - [x] `<ScrollView>` backed by Godot scroll containers.
  - [x] `<VirtualList>` or `<FlatList>` equivalent for large data sets.
  - [x] `<Pressable>` with mouse, touch, keyboard, controller, focus, disabled, hover, pressed, and long-press states.
  - [x] `<Modal>` / `<Dialog>` / `<Overlay>`.
  - [x] `<SafeAreaView>` or equivalent layout helper.
  - [x] `<KeyboardAvoidingView>` or equivalent for mobile text input.
  - [x] `<ActivityIndicator>` / `<Progress>`.
  - [x] `<Switch>` / checkbox refinement.
  - [x] Radio input support.
  - [x] Form and label helpers.
  - [x] Screen/router container primitives.
- [x] Make existing components production-grade:
  - [x] `<Div>`
  - [x] `<Span>`
  - [x] `<Button>`
  - [x] `<Input>`
  - [x] `<Textarea>`
  - [x] `<Select>` / `<Option>`
  - [x] `<Img>`
  - [x] `<Svg>`
  - [x] `<A>`
  - [x] `<Audio>`
  - [x] `<Video>`
  - [x] `<Canvas>`
- [x] Add media/device UI:
  - [x] `<CameraView>` backed by `CameraServer` / `CameraFeed` / `CameraTexture` where available.
  - [x] Camera permission and plugin docs.
  - [x] Microphone capture UI or documented non-goal.
- [x] Improve styling:
  - [x] Define the official style subset and document every property.
  - [x] Add CSS parsing or stylesheet support if web migration requires it.
    - [x] CSS declaration-string parsing for inline style inputs.
    - [x] Full stylesheet/cascade support remains deferred to the P2 CSS-to-Godot compiler evaluation.
  - [x] Support margins, border radius, borders, background images where feasible.
    - [x] Margins.
    - [x] Border radius and borders.
    - [x] Background images.
  - [x] Support transforms and basic transitions/animations where feasible.
    - [x] Basic transform mapping (`translate`, `scale`, `rotate`).
    - [x] Transitions for `opacity`, `transform`, `width`, and `height`.
    - [x] Keyframe-style animations.
  - [x] Support font family loading and fallback.
  - [x] Support percent sizes where Godot layout can represent them.
  - [x] Add style warnings for unsupported properties.
- [x] Improve accessibility and input:
  - [x] Focus management.
    - [x] Add `autoFocus` / `autofocus` mount-time focus for focusable controls.
    - [x] Map explicit focus traversal NodePaths to Godot focus graph props.
    - [x] Add focus traps and restoration where needed.
  - [x] Keyboard navigation.
    - [x] Map `focusNext` / `focusPrevious` to Godot Tab focus traversal.
    - [x] Add higher-level keyboard shortcut and escape/back guidance.
  - [x] Controller/gamepad navigation.
    - [x] Map directional focus neighbors to Godot D-pad/controller focus traversal.
    - [x] Add controller navigation examples and fallback guidance.
  - [x] Touch target behavior.
    - [x] Add opt-in `minTouchTarget` minimum Godot Control hit size for focusable controls.
  - [x] Accessible names, roles, labels, and hints where Godot exposes equivalents.
    - [x] Map accessible names, labels, hints, and titles to Godot `tooltip_text` on Control-backed components.
    - [x] Map roles if supported Godot bindings expose a native accessibility role API.
  - [x] Document platform limitations honestly.

## P0: Native Device APIs

- [x] Implement `@vue-godot/device` adapters or equivalent modules.
- [x] Geolocation:
  - [x] Define `GeolocationAdapter`.
  - [x] Support `getCurrentPosition`.
  - [x] Support `watchPosition`.
  - [x] Support `clearWatch`.
  - [x] Map errors to web-like error codes.
  - [x] Provide Android plugin integration.
  - [x] Provide iOS plugin integration.
  - [x] Add export permission docs.
  - [x] Install `navigator.geolocation` only when an adapter is registered.
- [x] Camera:
  - [x] Wrap `CameraServer` for feed enumeration where available.
  - [x] Add camera feed selection.
  - [x] Add `<CameraView>`.
  - [x] Add snapshot/capture API if feasible.
  - [x] Add Android/iOS plugin fallback where core Godot is insufficient.
  - [x] Document platform limits.
- [x] Microphone:
  - [x] Wrap Godot audio input where feasible.
  - [x] Add permission/export docs.
  - [x] Define whether a browser `MediaStream` subset is supported or skipped.
- [x] Network reachability:
  - [x] Implement adapter using local interfaces, DNS, HTTP probe, and timeout.
  - [x] Expose current state and events.
  - [x] Document that internet reachability is best-effort.
- [x] Permissions:
  - [x] Define permission names and mappings.
  - [x] Support Android `OS.request_permission()` and permission result events.
  - [x] Support macOS/iOS/visionOS permissions where Godot exposes them.
  - [x] Provide fallback behavior for plugin-managed permissions.
- [x] Sensors:
  - [x] Accelerometer.
  - [x] Gyroscope.
  - [x] Magnetometer.
  - [x] Gravity vector.
  - [x] Device orientation events.
- [x] Haptics:
  - [x] Handheld vibration.
  - [x] Controller vibration where available.
- [x] Clipboard:
  - [x] Text read/write.
  - [x] Image read/write where feasible.
- [x] App/system:
  - [x] Platform and feature detection.
  - [x] App lifecycle events: focus, pause, resume, quit where feasible.
  - [x] Deep links / URL open events if feasible.
  - [x] Share sheet plugin support if feasible.
  - [x] Native notifications plugin support if feasible.

## P1: Routing, Navigation, And App Architecture

- [x] Provide a recommended Vue Router setup.
- [x] Make `createWebHistory()` work for in-app navigation or document the preferred alternative.
- [x] Provide navigation examples for stacked screens, tabs, modal routes, and deep links.
- [x] Add back button handling on Android and controller/keyboard escape behavior.
- [x] Provide app state persistence patterns with storage APIs.
- [x] Provide error boundaries or recommended Vue error handling.
- [x] Add project architecture guidance for apps, games, and mixed Godot/Vue projects.

## P1: Tooling And Developer Experience

- [x] Improve CLI commands.
  - [x] `create app` profile.
  - [x] `create game-ui` profile.
  - [x] `integrate --html --device`.
  - [x] Template option for router/storage/network/device APIs.
  - [x] Doctor command for GodotJS, Node, package versions, export settings, permissions, and missing plugins.
- [x] Improve Volar and TypeScript support.
  - [x] Lowercase and PascalCase HTML components.
  - [x] Generated Godot component typings.
  - [x] Style prop type coverage.
  - [x] Browser/device API global typings.
- [x] Add debugging guidance.
  - [x] Godot console logs.
  - [x] Source maps.
  - [x] Runtime warnings.
  - [x] Common GodotJS failure modes.
- [x] Add migration docs.
  - [x] Vue SPA to Vue Godot.
  - [x] React Native mental model to Vue Godot.
  - [x] Godot UI to Vue components.

## P1: Testing And CI

- [x] Add a compatibility test suite organized by API.
- [x] Add real Godot smoke coverage for each supported browser/device API.
- [x] Add real device CI/manual release checklist for Android and iOS.
- [x] Add memory leak checks for repeated mount/unmount and navigation.
- [x] Add performance benchmarks:
  - [x] Startup time.
  - [x] First Vue render.
  - [x] Large tree update.
  - [x] Large list scroll.
  - [x] Image/video/audio loading.
  - [x] Fetch/WebSocket throughput.
  - [x] Editor reload stability.
- [x] Add fixture apps for regression testing.
- [x] Make release preflight fail on skipped Godot smoke in non-local release contexts.
- [x] Keep `npm audit` clean for moderate and high issues, or document accepted exceptions.
- [x] Pin and periodically update GodotJS versions.

## P1: Documentation And Examples

- [ ] Update root README to lead with stable value proposition once ready.
- [x] Keep package READMEs accurate for every public API change.
- [x] Add `docs/production.md`.
- [x] Add `docs/platforms/android.md`.
- [x] Add `docs/platforms/ios.md`.
- [x] Add `docs/platforms/desktop.md`.
- [x] Add `docs/permissions.md`.
- [x] Add `docs/plugins.md`.
- [x] Add `docs/compatibility.md`.
- [x] Add `docs/performance.md`.
- [x] Add `docs/troubleshooting.md`.
- [x] Add serious native app demo.
  - Acceptance criteria are tracked in
    [docs/example-apps.md](./docs/example-apps.md).
- [x] Add serious game UI demo.
  - Acceptance criteria are tracked in
    [docs/example-apps.md](./docs/example-apps.md).
- [x] Keep `apps/html-demo` updated for every HTML/browser/device API.

## P2: Ecosystem And Long-Term Parity

- [x] Evaluate a layout engine such as Yoga or Taffy only if Godot-native containers cannot cover production app layouts.
  - Decision: deferred; see [roadmap decisions](./docs/roadmap.md).
- [x] Consider a CSS-to-Godot compiler for real stylesheet support.
  - Decision: deferred; see [roadmap decisions](./docs/roadmap.md).
- [x] Consider package adapters for common Vue ecosystem libraries.
  - Decision: deferred; see [roadmap decisions](./docs/roadmap.md).
- [x] Consider a plugin marketplace/list for supported native capability plugins.
  - Decision: deferred; see [roadmap decisions](./docs/roadmap.md).
- [x] Consider devtools integration.
  - Decision: deferred; see [roadmap decisions](./docs/roadmap.md).
- [x] Consider SSR/static pre-render only if there is a real product need.
  - Decision: deferred; see [roadmap decisions](./docs/roadmap.md).

## API Compatibility Backlog

Use this backlog to seed `docs/compatibility.md`.

| API or Component | Package | Target Status | Backend |
| --- | --- | --- | --- |
| `fetch` | browser | supported | `HTTPClient` |
| `Request` / `Response` / `Headers` | browser | supported | JS + Godot HTTP interop |
| `Blob` / object URLs | browser | supported | JS memory registry |
| `URL` / `URLSearchParams` | browser | supported | JS parser |
| `TextEncoder` / `TextDecoder` | browser | supported | JS/V8 fast path |
| `AbortController` | browser | supported | JS event target |
| `history` / `location` | browser | supported | in-memory history |
| `navigator.onLine` | browser/device | partial | reachability probe |
| `online` / `offline` events | browser/device | partial | reachability probe |
| `WebSocket` | browser | supported | `WebSocketPeer` |
| `localStorage` | browser | supported | `FileAccess` / `user://` |
| `sessionStorage` | browser | supported | memory or `user://` |
| `navigator.clipboard` | browser/device | partial | `DisplayServer` clipboard |
| `navigator.permissions` | browser/device | partial | `PermissionAdapter` + `OS.get_granted_permissions` + capability checks |
| `navigator.vibrate` | browser/device | partial | `Input.vibrate_handheld` |
| Device motion/orientation | browser/device | partial | `Input` sensors |
| `navigator.geolocation` | browser/device | requires-plugin | `@vue-godot/device` `GeolocationAdapter` |
| `navigator.mediaDevices.getUserMedia` | browser/device | requires-plugin | `@vue-godot/device` `MediaDevicesAdapter` |
| `<CameraView>` | html/device | partial | `CameraServer` / `CameraTexture` |
| Camera snapshot helpers | html/device | partial | `CameraTexture` / `Texture2D.get_image()` |
| App/system helpers | device | partial | `OS` / `DisplayServer` / adapter registry |
| Deep links / URL open events | device | requires-plugin | `@vue-godot/device` `DeepLinkAdapter` |
| Notifications | browser/device | requires-plugin | `@vue-godot/device` `NotificationAdapter` |
| Share sheet | device | requires-plugin | `@vue-godot/device` `ShareAdapter` |
| DOM `document` | browser | skipped | no DOM in Godot |
| Service workers | browser | skipped | no browser worker/service worker runtime |
| IndexedDB | browser | planned or skipped | storage engine required |
| `<ScrollView>` | html | supported | `ScrollContainer` |
| `<VirtualList>` | html | supported | virtualized Godot controls |
| `<Pressable>` | html | supported | `Control` input/focus signals |
| `<Modal>` / `<Dialog>` / `<Overlay>` | html | supported | Godot popup/window/control stack |
| `<SafeAreaView>` | html/device | partial | platform/display metrics |
| `<KeyboardAvoidingView>` | html/device | partial | virtual keyboard metrics |
| `<ActivityIndicator>` | html | supported | `ProgressBar` indeterminate mode |
| `<Progress>` | html | supported | `ProgressBar` |
| `<Switch>` | html | supported | `CheckButton` |
| `<Input type="radio">` | html | supported | `CheckBox` + `ButtonGroup` |
| `<Form>` | html | supported | `PanelContainer` |
| `<Label>` | html | supported | `Label` / `<Div>` wrapper |
| `<Screen>` | html | supported | `Control` / `PanelContainer` |
| `<ScreenStack>` | html | supported | `<Screen>` + named slots |
| `<Canvas>` 2D context | html | partial | `CanvasItem` draw adapter |

## Final Removal Checklist

Run this checklist before removing "not production ready", "alpha", or "experimental" wording:

- [ ] Every P0 item is complete.
- [ ] Every P1 item is complete or explicitly moved to P2 with maintainer approval.
- [x] `docs/compatibility.md` is complete and linked from root README and package READMEs.
- [ ] Serious native app demo is complete and passes build/smoke.
- [ ] Serious game UI demo is complete and passes build/smoke.
- [ ] Android export with selected device APIs has been tested.
- [ ] iOS export with selected device APIs has been tested.
- [ ] CI passes on a clean commit.
- [ ] Release preflight passes without warnings in the release environment.
- [x] `npm audit --audit-level=moderate` is clean or accepted exceptions are documented.
- [ ] All public READMEs match the final support claims.
- [ ] The root README warning is removed in the same commit that marks this checklist complete.
