# Runtime Renderer Support

`@vue-godot/runtime-tscn` is a Vue custom renderer for Godot's scene tree. It
uses Vue's runtime-core package, but its host environment is Godot nodes, not a
browser DOM.

Use this document to decide whether a Vue feature is supported by the renderer
itself, partially supported through Godot-specific behavior, or unsupported
because it assumes browser elements.

## Supported Vue Features

| Feature | Support | Notes |
| --- | --- | --- |
| `createApp(...).mount(node)` / `app.unmount()` | Supported | Mount into a Godot `Node`; unmount removes rendered children and calls `queue_free()` on host nodes. |
| Vue SFCs compiled by Vite | Supported | Templates compile to runtime-core render functions. The app bundle keeps `godot` external for the GodotJS runtime. |
| Composition API and reactivity | Supported | `ref`, `computed`, `watch`, component state updates, and lifecycle hooks run through Vue. |
| Components, props, slots, and fragments | Supported | Vue owns the component tree. Rendered host children are inserted into the Godot node tree. |
| Keyed children and reordering | Supported | The renderer handles anchor insertion, same-parent moves, and append-to-end moves for keyed updates. |
| Template refs | Supported | Refs point to Godot node instances or Vue component instances, not DOM elements. |
| Godot node tags | Supported | Uppercase tags such as `<HBoxContainer>` and `<Label>` instantiate Godot classes through `ClassDB`. Unsupported classes warn and fall back to a generic `Node`. |
| Godot props | Supported with Godot limits | Non-event props are written with `node.set(key, value)`. Rejected reads/writes warn with the prop name. |
| Godot signals as Vue events | Supported with Godot limits | Vue event props such as `@pressed` / `onPressed` map to Godot snake_case signal names such as `pressed`; failed connects warn with the node, signal, and Vue prop. |
| Text children | Partial | Plain text creates or updates Godot nodes with a `text` property, usually `Label`. Nodes without `text` warn. |
| `v-model` sugar | Partial | Works when the rendered Godot node or component exposes matching prop and signal names. Browser input semantics are not synthesized. |

## Partial Renderer Semantics

| Area | Behavior | Limit |
| --- | --- | --- |
| Prop removal | The first non-null prop assignment caches the current value via `get()` when possible. Later removal restores that cached value. | Some Godot properties need type-specific reset behavior that the generic renderer cannot infer. |
| Static content | Plain text static content becomes a text node. | HTML-like static markup is inserted as a placeholder node and warns once. |
| Diagnostics | Unsupported classes, rejected props, failed signals, unsupported text writes, `querySelector`, and `setScopeId` emit warnings. | Warnings identify likely causes but do not guarantee every invalid Godot property or signal is detectable before Godot rejects it. |
| Lifecycle cleanup | App code should call `app.unmount()` from `_exit_tree()` and before remounting during editor reload. | Dedicated editor reload and scene-exit smoke coverage is still pending. |

## Unsupported Browser And DOM Assumptions

Godot does not provide browser-native elements. The renderer intentionally does
not emulate a real DOM.

| Assumption | Status | What to use instead |
| --- | --- | --- |
| `document`, `HTMLElement`, `Element`, and real DOM nodes | Unsupported | Use Godot node refs or `@vue-godot/html` components. |
| Browser layout, CSSOM, computed styles, and stylesheet cascade | Unsupported in runtime | Use Godot containers and explicit node props. `@vue-godot/html` provides a documented style subset. |
| DOM event propagation, capture/bubble phases, and `Event` objects | Unsupported in runtime | Use Godot signals through Vue event props. |
| `querySelector` / selector-based mounting or teleports | Unsupported | Mount to an explicit Godot node instance and pass node refs directly. |
| Scoped CSS host scope IDs | Unsupported | `setScopeId` warns; styling should map to Godot props or HTML package style helpers. |
| `v-html` / parsed HTML strings | Unsupported | Compose Vue components directly. Static HTML-like strings become placeholders. |
| Native browser form controls | Unsupported in runtime | Use Godot controls directly or `@vue-godot/html` components such as `<Input></Input>`. |
| CSS transitions and DOM transition hooks | Unsupported in runtime | Use Godot animation systems or explicit reactive prop updates. |
| Browser focus, accessibility tree, and ARIA semantics | Unsupported in runtime | Use Godot focus APIs and document platform-specific limitations. |

## Template Compiler Requirements

Godot is not a browser, so Vue's compiler must not classify tags as native HTML
elements. Every Vite config in this repo sets:

```ts
isNativeTag: () => false,
```

For apps using `@vue-godot/html`, HTML-like component names must still resolve as
Vue components instead of custom elements. See generated app templates and the
`@vue-godot/html` README for the exact `isCustomElement` setup.
