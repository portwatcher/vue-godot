# @vue-godot/html

HTML-like Vue components built on Godot nodes.

This package provides familiar HTML element abstractions (`<Div>`, `<Img>`, `<Button>`, etc.) that render as native Godot nodes under the hood. It runs on top of `@vue-godot/runtime-tscn` — the same renderer used for direct Godot node access.

## Motivation

Vue-Godot serves two audiences:

1. **Game developers** who want Vue's reactivity for game UI — they use Godot nodes directly (`<HBoxContainer>`, `<TextureRect>`, `<Sprite2D>`)
2. **Web developers** who want to run Vue apps natively without knowing Godot exists — they use familiar HTML-like components

This package serves audience #2 without interfering with audience #1. Both component styles work in the same app, in the same template, on the same renderer:

```vue
<template>
  <!-- web dev: familiar HTML-like component -->
  <Div :style="{ flexDirection: 'row', gap: 10 }">
    <Img src="./assets/logo.png" />
    <Span>Hello world</Span>
  </Div>

  <!-- game dev: native Godot node, same template -->
  <Sprite2D :texture="playerTexture" />
</template>
```

## Design Decisions

### Vue components on `runtime-tscn`, not a separate renderer

Each HTML-like element is a Vue component (using `defineComponent` + `h()`) that internally renders Godot nodes. This means:

- No second renderer to maintain — everything runs on `runtime-tscn`
- HTML components and Godot components can be freely mixed
- Game developers see real Godot nodes in the scene tree inspector
- Incremental — components are added one at a time without big-bang migration

### Asset loading: per-component, `src` prop

Components that load assets (images, video, audio) handle the loading internally:

```vue
<Img src="./assets/photo.png" />
```

Under the hood, `<Img>` resolves `./assets/photo.png` → `res://assets/photo.png` and calls `ResourceLoader.load()` to get a `Texture2D`, then passes it to the underlying `TextureRect` node.

Path resolution:
- `./relative/path.png` → `res://relative/path.png`
- `/absolute/path.png` → `res://absolute/path.png`
- `res://already/godot.png` → passthrough
- `user://save/data.png` → passthrough

### CSS: Godot-native container mapping (not a JS layout engine)

Rather than embedding a layout engine like Yoga, we map a CSS flexbox subset to Godot's native container system. This gives us GPU-side layout computed in C++ and a scene tree that game developers can inspect in the Godot editor.

| CSS | Godot Node |
|---|---|
| `display: flex; flex-direction: row` | `HBoxContainer` |
| `display: flex; flex-direction: column` | `VBoxContainer` |
| `flex-wrap: wrap` (row) | `HFlowContainer` |
| `flex-wrap: wrap` (column) | `VFlowContainer` |
| `display: grid` | `GridContainer` |
| `gap: <n>` | Theme override `separation = n` |
| `flex: 1` (on child) | Size flag `EXPAND_FILL` |
| `align-self: center` (on child) | Size flag `SHRINK_CENTER` |
| `padding: <n>` | `MarginContainer` wrapper or theme override |
| `width` / `height` | `custom_minimum_size` |
| `display: none` | `visible = false` |

Style objects (inline, React Native-style) are the primary styling API:

```vue
<Div :style="{ flexDirection: 'row', gap: 10, padding: 20 }">
  <Div :style="{ flex: 1 }">
    <Img src="./logo.png" :style="{ width: 64, height: 64 }" />
  </Div>
  <Div :style="{ flex: 2, alignItems: 'center' }">
    <Span :style="{ fontSize: 18, color: '#333' }">Hello</Span>
  </Div>
</Div>
```

This is intentionally a subset — not full CSS. We cover the 80% of layouts that real apps need (flex rows, columns, wrapping, grid) using Godot's own layout engine. If the remaining 20% becomes a bottleneck, a JS layout engine (Yoga/Taffy) can be added later without changing the component API.

## Component Mapping

| HTML-like Component | Godot Node | Key Props |
|---|---|---|
| `<Div>` | `HBoxContainer` / `VBoxContainer` / `*FlowContainer` / `GridContainer` | `style` (layout) |
| `<Img>` | `TextureRect` | `src`, `fit` |
| `<Span>` | `Label` | text content |
| `<Button>` | `Button` | `@click` → `pressed` signal |
| `<Input>` | `LineEdit` / `CheckBox` / `HSlider` | `type`, `v-model` |
| `<Textarea>` | `TextEdit` | `v-model` |
| `<Select>` | `OptionButton` | `<Option>` children |
| `<Video>` | `VideoStreamPlayer` | `src` |
| `<Audio>` | `AudioStreamPlayer` | `src` |
| `<Svg>` | `TextureRect` (SVG resource) | `src` |
| `<A>` | `LinkButton` / `RichTextLabel` | `href` |

### Lowercase tag compatibility (migrating existing SPAs)

Vue's compiler treats lowercase tags like `<div>` and `<img>` as native HTML elements, bypassing component resolution entirely. To make existing Vue SPAs work without renaming every tag, two things are needed:

1. **Vite config** — tell Vue's compiler that HTML tags are not native (so they resolve as components):

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import { htmlTags } from '@vue-godot/html'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // HTML tags → component lookup instead of native element
          isNativeTag: (tag: string) => !htmlTags.includes(tag),
          // Godot nodes (uppercase) → custom elements via ClassDB
          isCustomElement: (tag: string) => /^[A-Z]/.test(tag),
        }
      }
    })
  ]
}
```

2. **`htmlPlugin`** — registers every component under both PascalCase and lowercase names, so `<div>` resolves to the same component as `<Div>`.

With this setup, existing SPAs using `<div>`, `<img>`, `<span>`, etc. work without any renaming.

## Usage

### Migrating an existing Vue SPA (lowercase tags, no renaming)

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import { htmlTags } from '@vue-godot/html'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isNativeTag: (tag: string) => !htmlTags.includes(tag),
          isCustomElement: (tag: string) => /^[A-Z]/.test(tag),
        }
      }
    })
  ]
}
```

```ts
// main.ts
import { createApp } from '@vue-godot/runtime-tscn'
import { htmlPlugin } from '@vue-godot/html'
import { Control } from 'godot'
import Root from './App.vue'

export default class App extends Control {
  _ready() {
    const app = createApp(Root)
    app.use(htmlPlugin)
    app.mount(this)
  }
}
```

```vue
<!-- existing SPA code works as-is -->
<template>
  <div style="display: flex; gap: 10px;">
    <img src="./logo.png" />
    <span>Hello world</span>
  </div>
</template>
```

### Explicit imports (new code)

```vue
<script setup>
import { Div, Img } from '@vue-godot/html'
</script>

<template>
  <Div :style="{ flexDirection: 'row' }">
    <Img src="./logo.png" />
  </Div>
</template>
```

### Global registration via plugin (new code)

```ts
import { createApp } from '@vue-godot/runtime-tscn'
import { htmlPlugin } from '@vue-godot/html'
import { Control } from 'godot'
import Root from './App.vue'

export default class App extends Control {
  _ready() {
    const app = createApp(Root)
    app.use(htmlPlugin)
    app.mount(this)
  }
}
```

## Status

This package is in early development. Currently scaffolded:

- [x] `<Div>` — layout container with style → Godot container mapping
- [x] `<Img>` — image display with `src` → texture loading
- [ ] `<Span>` — inline text
- [ ] `<Button>` — click handler
- [ ] `<Input>` — text, checkbox, range inputs
- [ ] `<Textarea>` — multiline text
- [ ] `<Select>` / `<Option>` — dropdown
- [ ] `<Video>` — video playback
- [ ] `<Audio>` — audio playback
- [ ] `<Svg>` — SVG display
- [ ] Theme override application (gap, padding, colors)
- [ ] Size flag mapping (flex, align-self)
- [ ] `<style>` block support via Vite plugin (future)
