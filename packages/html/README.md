# @vue-godot/html

HTML-like Vue components built on Godot nodes.

This package provides familiar HTML element abstractions (`<Div>`, `<Img>`, `<Button>`, etc.) that render as native Godot nodes under the hood. It runs on top of `@vue-godot/runtime-tscn` — the same renderer used for direct Godot node access.

See the repository [compatibility checklist](../../docs/compatibility.md) for current component support status, platform caveats, and known spec differences.

## Motivation

Vue-Godot serves two audiences:

1. **Game developers** who want Vue's reactivity for game UI — they use Godot nodes directly (`<HBoxContainer>`, `<TextureRect>`, `<Sprite2D>`)
2. **Web developers** who want to run Vue apps natively without knowing Godot exists — they use familiar HTML-like components

This package serves audience #2 without interfering with audience #1. Both component styles work in the same app, in the same template, on the same renderer:

```vue
<template>
  <!-- web dev: familiar HTML-like component -->
  <Div :style="{ flexDirection: 'row', gap: 10 }">
    <Img src="./assets/logo.png"></Img>
    <Span>Hello world</Span>
  </Div>

  <!-- game dev: native Godot node, same template -->
  <Sprite2D :texture="playerTexture"></Sprite2D>
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
<Img src="./assets/photo.png"></Img>
```

Under the hood, `<Img>` resolves `./assets/photo.png` → `res://assets/photo.png` and calls `ResourceLoader.load()` to get a `Texture2D`, then passes it to the underlying `TextureRect` node.

Path resolution:

- `./relative/path.png` → `res://relative/path.png`
- `/absolute/path.png` → `res://absolute/path.png`
- `res://already/godot.png` → passthrough
- `user://save/data.png` → passthrough

### CSS: Godot-native container mapping (not a JS layout engine)

Rather than embedding a layout engine like Yoga, we map a CSS flexbox subset to Godot's native container system. This gives us GPU-side layout computed in C++ and a scene tree that game developers can inspect in the Godot editor.

| CSS                                           | Godot Node                                                      |
| --------------------------------------------- | --------------------------------------------------------------- |
| `display: flex; flex-direction: row`          | `HBoxContainer`                                                 |
| `display: flex; flex-direction: column`       | `VBoxContainer`                                                 |
| `flex-wrap: wrap` (row)                       | `HFlowContainer`                                                |
| `flex-wrap: wrap` (column)                    | `VFlowContainer`                                                |
| `display: grid`                               | `GridContainer`                                                 |
| `gap: <n>`                                    | Theme override (`separation` / `h_separation` + `v_separation`) |
| `justify-content: flex-start/center/flex-end` | Container `alignment`                                           |
| `flex: 1` (on child)                          | Size flag `EXPAND_FILL`                                         |
| `align-items: *`                              | Default child cross-axis size flag                              |
| `align-self: center` (on child)               | Size flag `SHRINK_CENTER`                                       |
| `padding: <n>`                                | `MarginContainer` wrapper or theme override                     |
| `backgroundColor: <color>`                    | `PanelContainer` wrapper with `StyleBoxFlat`                    |
| `color: <color>`                              | `theme_override_colors/font_color` on text controls             |
| `fontWeight: 'bold'`                          | `theme_override_fonts/font` with `FontVariation` embolden       |
| `width` / `height`                            | `custom_minimum_size`                                           |
| `display: none`                               | `visible = false`                                               |

Style objects (inline, React Native-style) are the primary styling API:

```vue
<Div :style="{ flexDirection: 'row', gap: 10, padding: 20 }">
  <Div :style="{ flex: 1 }">
    <Img src="./logo.png" :style="{ width: 64, height: 64 }"></Img>
  </Div>
  <Div :style="{ flex: 2, alignItems: 'center' }">
    <Span :style="{ fontSize: 18, color: '#333' }">Hello</Span>
  </Div>
</Div>
```

This is intentionally a subset — not full CSS. We cover the 80% of layouts that real apps need (flex rows, columns, wrapping, grid) using Godot's own layout engine. If the remaining 20% becomes a bottleneck, a JS layout engine (Yoga/Taffy) can be added later without changing the component API.

Color values support hex (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`), named CSS colors, `rgb()` / `rgba()`, and `hsl()` / `hsla()`.

### Supported style props and warnings

Inline style objects are intentionally limited to the Godot-backed subset below. Unsupported style keys emit a `[vue-godot/html]` warning once per component/property pair so migrations surface ignored CSS instead of failing silently.

| Style prop | Godot behavior |
| --- | --- |
| `display` | `none` maps to `visible = false`; `flex` and `grid` affect `<Div>` container selection. |
| `flexDirection` | Chooses row/column containers for `<Div>` and content wrappers. |
| `flexWrap` | Chooses flow containers for wrapping `<Div>` layouts. |
| `justifyContent` | Maps supported containers to Godot `alignment`. |
| `alignItems` | Provides the default child cross-axis size flag in `<Div>`. |
| `alignSelf` | Maps a child to a Godot size flag when it is inside `<Div>`. |
| `flex` | Maps positive child values to expand/fill size flags inside `<Div>`. |
| `gap` | Maps to Godot theme separation constants. |
| `columns` | Maps to `GridContainer.columns` for grid `<Div>` layouts. |
| `padding`, `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft` | Maps to `MarginContainer` theme margin constants. |
| `width`, `height` | Maps numeric or pixel-string values to minimum/control size. |
| `minWidth`, `minHeight`, `maxWidth`, `maxHeight` | Clamps container minimum size where the component uses container sizing. |
| `objectFit` | Maps media texture stretch/expand behavior for `<Img>` and `<Svg>`. |
| `backgroundColor` | Maps to a `PanelContainer` `StyleBoxFlat` background where supported. |
| `color` | Maps text-capable controls to `theme_override_colors/font_color`. |
| `fontSize` | Maps text-capable controls to `theme_override_font_sizes/font_size`. |
| `fontWeight` | Supports `'bold'` via a Godot `FontVariation` embolden override. |
| `textTransform` | Supports `'uppercase'` on `<Span>`. |
| `textAlign` | Maps `<Span>` to Godot horizontal alignment. |
| `overflowWrap` | Supports `'break-word'` on `<Span>` via smart word wrapping. |
| `overflow` | Supports `'hidden'` clipping where the backing Godot node exposes it. |
| `opacity` | Maps to a Godot `modulate` alpha color. |

## Component Mapping

| HTML-like Component | Godot Node                                                             | Key Props             |
| ------------------- | ---------------------------------------------------------------------- | --------------------- |
| `<ActivityIndicator>` | `ProgressBar`                                                        | `active`, `size`, `fill`, `style` |
| `<Dialog>`          | `AcceptDialog`                                                         | `v-model`, `title`, `message`, `confirmText` |
| `<Div>`             | `HBoxContainer` / `VBoxContainer` / `*FlowContainer` / `GridContainer` | `style` (layout)      |
| `<Img>`             | `TextureRect`                                                          | `src`, `alt`, `style` |
| `<Modal>`           | `Window`                                                               | `v-model`, `title`, `width`, `height` |
| `<Overlay>`         | `PanelContainer` plus inner `<Div>`                                    | `v-model`, `closeOnClick`, `blockInput`, `contentStyle` |
| `<Progress>`        | `ProgressBar`                                                          | `value`, `min`, `max`, `indeterminate`, `showPercentage` |
| `<ScrollView>`      | `ScrollContainer`                                                      | `horizontal`, `vertical`, `scrollbarMode`, `contentStyle` |
| `<Span>`            | `Label`                                                                | text content, `style` |
| `<Switch>`          | `CheckButton`                                                          | `v-model`, `label`, `disabled`, `style` |
| `<Button>`          | `Button`                                                               | `@click`, `disabled`  |
| `<Input>`           | `LineEdit` / `CheckBox` / `HSlider`                                    | `type`, `v-model`, `label`, `name`, `value` |
| `<Textarea>`        | `TextEdit`                                                             | `v-model`             |
| `<Select>`          | `OptionButton`                                                         | `<Option>` children   |
| `<Video>`           | `VideoStreamPlayer`                                                    | `src`                 |
| `<Audio>`           | `AudioStreamPlayer`                                                    | `src`                 |
| `<Svg>`             | `TextureRect` (SVG resource)                                           | `src`                 |
| `<A>`               | `LinkButton`                                                           | `href`, `@click`      |

## Provided APIs

| API                                                                                                                                    | Description                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| HTML-like components (`A`, `ActivityIndicator`, `Audio`, `Button`, `Canvas`, `Dialog`, `Div`, `Img`, `Input`, `Modal`, `Option`, `Overlay`, `Progress`, `ScrollView`, `Select`, `Span`, `Svg`, `Switch`, `Textarea`, `Video`) | Vue components backed by Godot nodes                                                                     |
| `htmlPlugin`                                                                                                                           | Registers all HTML-like components globally in PascalCase and lowercase                                  |
| `htmlTags`                                                                                                                             | Lowercase tag-name list for Vue compiler `isCustomElement` configuration                                 |
| `@vue-godot/html/volar-plugin`                                                                                                         | Volar language-service plugin that makes lowercase HTML-like tags resolve to these components in the IDE |

### Lowercase tag compatibility (migrating existing SPAs)

Vue's compiler treats lowercase tags like `<div>` and `<img>` as native HTML elements, bypassing component resolution entirely. To make existing Vue SPAs work without renaming every tag, three things are needed:

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
          // Nothing is a native platform element in Godot.
          isNativeTag: () => false,
          // Uppercase tags are Godot nodes unless @vue-godot/html provides them.
          isCustomElement: (tag: string) =>
            tag[0] === tag[0].toUpperCase() &&
            !htmlTags.includes(tag.toLowerCase()),
        },
      },
    }),
  ],
}
```

2. **`htmlPlugin`** — registers every component under both PascalCase and lowercase names, so `<div>` resolves to the same component as `<Div>`.

3. **Volar plugin** — add `@vue-godot/html/volar-plugin` to `vueCompilerOptions.plugins` so the IDE uses the same Godot-aware tag classification:

```json
{
  "vueCompilerOptions": {
    "plugins": ["@vue-godot/html/volar-plugin"]
  }
}
```

With this setup, existing SPAs using `<div>`, `<img>`, `<span>`, etc. work without any renaming, and both lowercase and PascalCase tags get component hover/type information in VS Code.

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
          isNativeTag: () => false,
          isCustomElement: (tag: string) =>
            tag[0] === tag[0].toUpperCase() &&
            !htmlTags.includes(tag.toLowerCase()),
        },
      },
    }),
  ],
}
```

```ts
// main.ts
import { createApp } from '@vue-godot/runtime-tscn'
import { installBrowserAPIs } from '@vue-godot/browser'
import { htmlPlugin } from '@vue-godot/html'
import { Control } from 'godot'
import Root from './App.vue'

installBrowserAPIs()

export default class App extends Control {
  private app: ReturnType<typeof createApp> | null = null

  _ready() {
    this.app?.unmount()
    const app = createApp(Root)
    app.use(htmlPlugin)
    app.mount(this)
    this.app = app
  }

  _exit_tree() {
    this.app?.unmount()
    this.app = null
  }
}
```

```vue
<!-- existing SPA code works as-is -->
<template>
  <div :style="{ flexDirection: 'row', gap: 10 }">
    <span>Hello world</span>
    <button @click="save">Save</button>
  </div>
</template>
```

### Explicit imports (new code)

```vue
<script setup>
import { Div, Img, Span, Button, Input, Switch } from '@vue-godot/html'
import { ref } from '@vue/runtime-core'

const name = ref('')
const agreed = ref(false)
const plan = ref('basic')
const volume = ref(50)
</script>

<template>
  <Div :style="{ flexDirection: 'column', gap: 10 }">
    <Img src="./logo.png"></Img>
    <Span :style="{ fontSize: 24, color: '#333' }">Welcome!</Span>
    <Input v-model="name" placeholder="Your name"></Input>
    <Input type="password" v-model="password" placeholder="Password"></Input>
    <Input type="checkbox" v-model="agreed" label="I agree"></Input>
    <Input type="radio" v-model="plan" name="plan" value="basic" label="Basic"></Input>
    <Input type="radio" v-model="plan" name="plan" value="pro" label="Pro"></Input>
    <Switch v-model="agreed" label="Enable sync"></Switch>
    <Input type="range" v-model="volume" :min="0" :max="100"></Input>
    <Button @click="save" :style="{ fontSize: 16 }">Save</Button>
  </Div>
</template>
```

### Canvas drawing scope

`<Canvas>` maps to a Godot `Control` with `width` / `height` reflected as `custom_minimum_size` and `clip_contents` enabled. For the current beta, this is the supported drawing path:

- access the underlying `Control` with a Vue template ref;
- implement Godot-native draw behavior on that node or a custom `Control` subclass;
- call `queue_redraw()` when reactive state changes.

`canvas.getContext('2d')` is intentionally deferred. A future Canvas2D adapter should wrap Godot `CanvasItem` draw commands and define clear lifecycle ownership for retained drawing state, but that is not part of the beta surface.

### ScrollView scrolling scope

`<ScrollView>` maps to a Godot `ScrollContainer` and wraps slot content in one inner `<Div>` so the existing layout style subset works inside the viewport:

```vue
<ScrollView
  :style="{ width: 320, height: 160 }"
  :content-style="{ flexDirection: 'column', gap: 8, padding: 8 }"
  scrollbar-mode="auto"
>
  <Div v-for="item in items" :key="item.id">
    <Span>{{ item.label }}</Span>
  </Div>
</ScrollView>
```

The component supports `horizontal`, `vertical`, `scrollbarMode`, `horizontalScrollbar`, `verticalScrollbar`, `scrollHorizontal`, `scrollVertical`, `scrollStep`, `horizontalStep`, `verticalStep`, `followFocus`, `style`, and `contentStyle`. Scrollbar modes are `'auto'`, `'always'`, `'never'`, and `'disabled'`.

### Progress and loading indicators

`<Progress>` maps to Godot `ProgressBar` for determinate and indeterminate progress:

```vue
<Progress
  :value="uploadPercent"
  :max="100"
  :show-percentage="true"
  :style="{ width: 280, height: 18 }"
></Progress>
```

It supports `value`, `min`, `max`, `step`, `indeterminate`, `showPercentage`, `fill`, and `style`. `fill` accepts `'begin-to-end'`, `'end-to-begin'`, `'top-to-bottom'`, and `'bottom-to-top'`.

`<ActivityIndicator>` is a bar-style busy indicator backed by the same native `ProgressBar` indeterminate mode:

```vue
<ActivityIndicator :active="isLoading" :style="{ width: 120, height: 18 }"></ActivityIndicator>
```

It supports `active`, `size`, `fill`, and `style`. When `active` is `false`, the indicator is hidden and the indeterminate animation is disabled.

### Switch and radio input scope

`<Switch>` maps to Godot `CheckButton` and supports `v-model`, `label`, `disabled`, and `style`:

```vue
<Switch v-model="enabled" label="Enable sync"></Switch>
```

`<Input type="radio">` maps to Godot `CheckBox`. When a `name` is provided, inputs with the same name share a Godot `ButtonGroup` so selection is exclusive:

```vue
<Input type="radio" v-model="plan" name="plan" value="basic" label="Basic"></Input>
<Input type="radio" v-model="plan" name="plan" value="pro" label="Pro"></Input>
```

Checkbox inputs now also accept `label`, which maps to the underlying Godot button text.

### Modal, dialog, and overlay scope

`<Overlay>` maps to a full-parent `PanelContainer` backdrop with one inner `<Div>` content wrapper:

```vue
<Overlay
  v-model="showOverlay"
  :close-on-click="true"
  :style="{ backgroundColor: '#0008' }"
  :content-style="{ flexDirection: 'column', gap: 8, padding: 16 }"
>
  <Span>Overlay content</Span>
  <Button @click="showOverlay = false">Close</Button>
</Overlay>
```

It supports `v-model`, `closeOnClick`, `blockInput`, `style`, and `contentStyle`, and emits `click` and `backdropClick`. It is a Godot `Control` overlay, not a DOM portal.

`<Modal>` maps to Godot `Window` and supports `v-model`, `title`, `width`, `height`, `minWidth`, `minHeight`, `exclusive`, `transient`, `popup`, `unresizable`, and `style`:

```vue
<Modal v-model="showModal" title="Settings" :width="420" :height="260">
  <Div :style="{ flexDirection: 'column', gap: 8, padding: 12 }">
    <Span>Window-backed modal content</Span>
    <Button @click="showModal = false">Done</Button>
  </Div>
</Modal>
```

`<Dialog>` maps to Godot `AcceptDialog` and supports `v-model`, `title`, `message`, `confirmText`, `closeOnEscape`, `hideOnOk`, sizing props, and `style`:

```vue
<Dialog
  v-model="confirmOpen"
  title="Delete item"
  message="This cannot be undone."
  confirm-text="Delete"
  @confirm="deleteItem"
  @cancel="confirmOpen = false"
></Dialog>
```

Dialog and modal close requests emit `update:modelValue` with `false` plus `close`. Dialog confirmation emits `confirm`; cancellation emits `cancel`.

### Global registration via plugin (new code)

```ts
import { createApp } from '@vue-godot/runtime-tscn'
import { installBrowserAPIs } from '@vue-godot/browser'
import { htmlPlugin } from '@vue-godot/html'
import { Control } from 'godot'
import Root from './App.vue'

installBrowserAPIs()

export default class App extends Control {
  private app: ReturnType<typeof createApp> | null = null

  _ready() {
    this.app?.unmount()
    const app = createApp(Root)
    app.use(htmlPlugin)
    app.mount(this)
    this.app = app
  }

  _exit_tree() {
    this.app?.unmount()
    this.app = null
  }
}
```

## Status

This package is in early development. Currently scaffolded:

- [x] `<Div>` — layout container with style → Godot container mapping
- [x] `<Img>` — image display with `src` → texture loading
- [x] `<Progress>` — determinate or indeterminate progress (`ProgressBar`, range props, fill direction)
- [x] `<ActivityIndicator>` — bar-style busy indicator (`ProgressBar` indeterminate mode)
- [x] `<ScrollView>` — scrollable viewport (`ScrollContainer`, axis props, scrollbar modes, scroll offsets)
- [x] `<Overlay>` — full-parent backdrop/control layer (`PanelContainer`, `v-model`, backdrop events)
- [x] `<Modal>` — modal window primitive (`Window`, close requests, sizing props)
- [x] `<Dialog>` — confirmation dialog (`AcceptDialog`, confirm/cancel/close events)
- [x] `<Span>` — text display with `fontSize`, `fontWeight`, `color`, `textAlign`, `textTransform`, `overflowWrap`
- [x] `<Switch>` — binary toggle (`CheckButton`, `v-model`, `label`, `disabled`)
- [x] `<Button>` — click handler with `@click`, `disabled`
- [x] `<Input>` — text, password, checkbox, radio, range inputs with `v-model`
- [x] `<Textarea>` — multiline text (`TextEdit`, `v-model`, `placeholder`, `rows`/`cols`)
- [x] `<Select>` / `<Option>` — dropdown (`OptionButton`, `v-model`, `<Option>` children)
- [x] `<Canvas>` — 2D drawing surface (`Control`, `width`/`height`, template ref for draw commands; `getContext('2d')` deferred)
- [x] `<Video>` — video playback (`VideoStreamPlayer`, `src`, `autoplay`, `loop`, `muted`, `volume`, `@ended`)
- [x] `<Audio>` — audio playback (`AudioStreamPlayer`, `src`, `autoplay`, `loop`, `muted`, `volume`, `@ended`)
- [x] `<Svg>` — SVG display (`TextureRect`, `src`, `scale` for rasterisation quality, `alt`)
- [x] `<A>` — link/anchor (`LinkButton`, `href`, `@click`)
- [x] Theme override application (gap, padding)
- [x] Theme override application (colors via `backgroundColor` and text `color`, bold text via `FontVariation`)
- [x] Size flag mapping (flex, align-self)
- [x] Div renderer integration tests (nested fragment/array slot layouts)
- [x] `<style>` block support is a non-goal for the current beta; use inline style objects until a CSS-to-Godot mapping exists.

## Demo Apps

- `apps/html-demo` — integration demo exercising every `@vue-godot/html` component and `@vue-godot/browser` API. Lives in the monorepo root `apps/` directory.
