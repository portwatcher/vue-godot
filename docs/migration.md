# Migration Guide

Vue Godot is a Vue renderer for Godot, not a browser runtime and not React
Native. Migration works best when you keep Vue's component and state model but
move platform assumptions to Godot nodes, `@vue-godot/html` components, and
explicit `@vue-godot/device` adapters.

Use this guide with:

- [runtime renderer support](./runtime.md)
- [compatibility checklist](./compatibility.md)
- [routing and navigation](./routing.md)
- [permissions and export setup](./permissions.md)
- [troubleshooting](./troubleshooting.md)

## Shared Rules

- Godot owns the scene tree, resources, input, windows, export presets, and
  native runtime.
- Vue owns component composition, reactivity, props, slots, and app state.
- Browser DOM APIs such as `document`, `HTMLElement`, CSSOM, selectors, DOM
  events, and browser form serialization are not available.
- Browser-like APIs exist only where `@vue-godot/browser` implements them.
- Native/mobile APIs exist only through Godot surfaces or registered
  `@vue-godot/device` adapters.
- Build output is `dist/app.js` plus optional `dist/chunks/*.js`; Godot should
  not import Vue source files directly.

Start with the compatibility matrix before assuming a web or native API exists.

## Vue SPA To Vue Godot

Use `@vue-godot/html` when migrating an existing Vue SPA. It provides familiar
components such as `<Div>`, `<Span>`, `<Button>`, `<Input>`, `<Img>`,
`<ScrollView>`, `<Modal>`, and lowercase aliases such as `<div>` when the Vite
compiler and `htmlPlugin` are configured.

Recommended path:

1. Create or integrate an HTML-mode app:

```bash
npx vue-godot create my-app --html
# or, inside an existing Godot project
npx vue-godot integrate --html
```

2. Move the Vue app into `vue/src/`.
3. Keep `installBrowserAPIs()` before router, store, or component setup.
4. Use Vue Router with `createWebHistory()` for route-shaped app state, or
   `<ScreenStack>` for simple native-style stacks.
5. Replace DOM-only code with component refs, Godot node refs, browser polyfill
   helpers, or explicit device adapters.
6. Replace full browser CSS/cascade assumptions with the documented
   Godot-backed style subset, explicit `createHtmlStyleSheet()` registration,
   Vite-collected global CSS imports, structured `defineHtmlTheme()` defaults,
   limited media query buckets where useful, and Godot container layout.
7. Run `npx vue-godot doctor --migration` to triage unsupported CSS, DOM
   assumptions, and browser tags before deeper porting work.
8. Extract the GodotJS release ZIP at the project root, run `npm run build` and
   `npm run check:exports`, then test in an official Godot editor.

See the `@vue-godot/html` README's lowercase tag migration section for the
exact `isNativeTag`, `isCustomElement`, `htmlPlugin`, and Volar setup.

### Migration Audit

`vue-godot doctor --migration` adds a static migration report to the usual
project diagnostics. The audit scans CSS files under `vue/` and `src/` for
unsupported properties, selectors, and at-rules, and scans Vue/TypeScript files
for browser DOM assumptions such as `document.querySelector`, `HTMLElement`,
`getComputedStyle()`, `window.matchMedia`, and browser canvas contexts.

Findings are grouped into three tiers:

| Tier           | Meaning                                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `small-change` | Usually a component rename, supported style replacement, or visual approximation.                                            |
| `medium`       | Requires layout or state reshaping, often around selectors, positioning, or CSSOM reads.                                     |
| `rewrite`      | Relies on browser DOM construction, observers, float layout, keyframes outside the supported API, or browser canvas drawing. |

The report also suggests equivalent `@vue-godot/html` components for browser
tags such as `<div>`, `<button>`, `<input>`, and `<img>`. It is a triage tool,
not a runtime guarantee; validate the migrated app in the Godot editor and on
target devices.

### What Usually Ports Cleanly

| Vue web pattern                           | Vue Godot approach                                                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Composition API, refs, computed state     | Keep as-is.                                                                                                        |
| SFC components and slots                  | Keep as-is unless they depend on DOM nodes.                                                                        |
| `fetch()`, `URL`, `Blob`, timers, storage | Use `installBrowserAPIs()` and check [compatibility](./compatibility.md).                                          |
| Vue Router route records and guards       | Use `createWebHistory()` with the in-memory history implementation.                                                |
| Form state with `v-model`                 | Use `@vue-godot/html` form/input components and explicit submit/reset events.                                      |
| Asset components                          | Use `res://`, relative project paths, `user://`, blob/data URLs, or remote URLs where the component supports them. |

### What Needs Redesign

| Browser assumption                                        | Replacement                                                                                                                                                                                                                                                                             |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `document.querySelector`, DOM refs, `HTMLElement` methods | Vue refs to components or Godot node instances.                                                                                                                                                                                                                                         |
| CSS cascade, stylesheets, computed styles                 | Explicit `createHtmlStyleSheet()` registration or global CSS imports through `@vue-godot/html/vite`, structured `defineHtmlTheme()` defaults, inline style overrides, limited viewport media buckets, Godot containers, and explicit component props. No CSSOM or computed style reads. |
| DOM event bubbling/capture                                | Vue component events and Godot signals.                                                                                                                                                                                                                                                 |
| Browser focus and ARIA tree                               | Godot focus traversal props cover keyboard/controller navigation; screen-reader semantics are unsupported until the supported stock-Godot API exposes portable native accessibility metadata.                                                                                           |
| Service workers, IndexedDB, Web Workers                   | Treat as unsupported unless a real project-specific backend is added.                                                                                                                                                                                                                   |
| Full-page navigation and reloads                          | In-memory routing, app state restoration, and Godot scene/app lifecycle.                                                                                                                                                                                                                |

## React Native Mental Model To Vue Godot

Vue Godot can feel familiar to React Native teams because the primary app UI
style is component-based and often uses inline style objects. The important
difference is that the host platform is Godot `Control` nodes, not native
UIKit/Android views and not Yoga layout.

Useful mental mappings:

| React Native idea      | Vue Godot equivalent                                                     |
| ---------------------- | ------------------------------------------------------------------------ |
| `View`                 | `<Div>` or a Godot container/control tag.                                |
| `Text`                 | `<Span>` or Godot `<Label>`.                                             |
| `Image`                | `<Img>` or Godot texture nodes.                                          |
| `Pressable`            | `<Pressable>` or focusable button components.                            |
| `TextInput`            | `<Input>` / `<Textarea>`.                                                |
| `FlatList`             | `<VirtualList>` for fixed-height rows.                                   |
| `Modal`                | `<Modal>`, `<Dialog>`, or `<Overlay>`.                                   |
| `SafeAreaView`         | `<SafeAreaView>`.                                                        |
| `KeyboardAvoidingView` | `<KeyboardAvoidingView>`.                                                |
| `Vibration`            | `navigator.vibrate()` or `@vue-godot/device/haptics`.                    |
| Native modules         | `@vue-godot/device` adapters registered before browser API installation. |

Key differences:

- Layout maps to Godot containers and `Control` sizing flags, not Yoga.
- There is no React Native bridge or Metro bundler; Vite emits `dist/app.js`.
- Device APIs are explicit adapters, not auto-linked packages.
- Godot resources use `res://` and `user://` paths.
- Game UI can mix Vue components with ordinary Godot scene nodes.
- Release testing must happen through Godot export presets, not mobile JS
  bundle deployment alone.

Treat Vue Godot as a Godot app shell with Vue ergonomics, not as a drop-in React
Native runtime.

## Godot UI To Vue Components

Existing Godot UI can migrate incrementally. You do not need to rewrite every
Control node into HTML-like components.

Recommended path:

1. Keep gameplay, physics, rendering, and existing scene resources in Godot.
2. Mount Vue into a root `Control` node from the runtime-backed JavaScript
   script.
3. Convert one screen or panel at a time into Vue components.
4. Use Godot node tags directly for native controls where that is clearer:

```vue
<template>
  <VBoxContainer>
    <Label text="Inventory"></Label>
    <Button text="Close" @pressed="$emit('close')"></Button>
  </VBoxContainer>
</template>
```

5. Use `@vue-godot/html` components where SPA-style props, inline style, or
   migration from HTML naming is useful.
6. Move mutable UI state into Vue refs/computed values and keep long-lived game
   state in Godot systems or app stores.
7. Use Godot signals as Vue events, such as `@pressed`, `@item-selected`, or the
   normalized event props exposed by `@vue-godot/html` components.

Godot scene lifecycle still matters. Generated apps mount in `_ready()` and
unmount in `_exit_tree()` so editor reloads and scene exits do not retain stale
Vue trees.

## Mixed Godot And Vue Architecture

A pragmatic production app usually separates layers like this:

```text
godot/
  scenes/          # gameplay scenes, imported resources, native plugins
vue/
  src/
    app/           # router, browser/device setup, storage, app shell
    screens/       # route or ScreenStack screens
    components/    # reusable UI components
    game/          # typed adapters around Godot gameplay state/events
dist/              # generated Vue bundle consumed by Godot
```

Keep the boundary explicit:

- Godot scripts or services own engine-heavy behavior.
- Vue components render UI and subscribe to typed state/events.
- Device plugins register adapters in one startup module.
- Browser polyfills install before app/router creation.
- Routing, deep links, storage restoration, and back handling live in an app
  shell module rather than scattered across screens.

## Migration Checklist

- [ ] Choose direct Godot tags, `@vue-godot/html`, or a mix.
- [ ] Verify Vite compiler options use `isNativeTag: () => false`.
- [ ] Register `htmlPlugin` for HTML-mode apps.
- [ ] Install browser APIs before creating router/store/app code that reads
      browser-like globals.
- [ ] Run `npx vue-godot doctor --migration` and address `medium`/`rewrite`
      findings deliberately.
- [ ] Replace DOM refs and selectors with Vue/Godot refs.
- [ ] Replace unsupported CSS with the documented style subset or Godot
      containers.
- [ ] Move native capabilities behind `@vue-godot/device` adapters.
- [ ] Add platform export permissions and plugin configuration.
- [ ] Run `npm run build`, `npm run check:exports`, and relevant smoke tests.
- [ ] Test exported builds on every target platform you intend to ship.
