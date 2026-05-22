# Vue Godot

Use Vue Single File Components to build UI for Godot.

Vue Godot renders Vue components into Godot's scene tree, so you can use Vue reactivity, templates, props, events, and TypeScript tooling while Godot still owns the runtime, nodes, resources, and editor workflow.

This project is experimental and not production ready yet. Follow [@juryxiong](https://x.com/juryxiong) for updates.

![demo](./intro-medias/demo.gif)

## Quick Start

### Create a new Godot project

```bash
npx vue-godot create my-game
cd my-game
npm run dev
```

The `create` command runs the initial install and type generation for you. Open `project.godot` in the GodotJS editor, then press **F5**.

Use `npm run build` instead of `npm run dev` when you want a one-time build.

To start with HTML-like components such as `<Div>`, `<Img>`, `<Button>`, and `<Input>`, pass `--html`:

```bash
npx vue-godot create my-game --html
```

### Add Vue to an existing Godot project

```bash
cd my-existing-godot-project
npx vue-godot integrate --html
npm install
npm run gen:types
npm run dev
```

Open the project in the GodotJS editor and run the scene.

### Try this repository

```bash
npm install
npm run build
```

Then open one of the example projects in the GodotJS editor, for example `apps/v-on/project.godot`, and press **F5**.

## Requirements

- Node.js >= 18
- [GodotJS editor](https://github.com/ialex32x/GodotJS-Build/releases)

If GodotJS prints `ERROR: Could not create directory: './typings/res:/'`, it is a known scene codegen issue in GodotJS 1.0.0-2. The error is harmless for runtime. To suppress it, open **Editor > Editor Settings**, search for `GodotJS`, and set `codegen/generate_scene_dts` to `false`.

## Basic Example

Write a Vue component using Godot node class names as tags:

```vue
<template>
  <HBoxContainer>
    <Button text="Click me" @pressed="handleClick"></Button>
    <Label :text="count.toString()"></Label>
  </HBoxContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(1)

const handleClick = () => {
  count.value = count.value + 1
}
</script>
```

Mount it from a GodotJS script:

```ts
import { createApp } from '@vue-godot/runtime-tscn'
import { Control } from 'godot'
import Counter from './Counter.vue'

export default class App extends Control {
  _ready() {
    const app = createApp(Counter)
    app.mount(this)
  }
}
```

## What You Can Build With

| Need | Use |
| ---- | --- |
| Vue rendering into native Godot nodes | `@vue-godot/runtime-tscn` |
| Familiar HTML-style components backed by Godot nodes | `@vue-godot/html` |
| Browser-like APIs such as `fetch`, `URL`, `Blob`, `history`, and `TextEncoder` | `@vue-godot/browser` |
| Project scaffolding, integration, and generated Vue component types | `@vue-godot/cli` |

## Packages

| Package | Description |
| ------- | ----------- |
| [`@vue-godot/runtime-tscn`](./packages/runtime-tscn/README.md) | Vue custom renderer for the Godot scene tree |
| [`@vue-godot/html`](./packages/html/README.md) | HTML-like Vue components implemented with Godot nodes |
| [`@vue-godot/browser`](./packages/browser/README.md) | Browser API polyfills for GodotJS |
| [`@vue-godot/cli`](./packages/cli/README.md) | CLI for creating projects, integrating Vue, and generating types |

## Examples

| App | Demonstrates |
| --- | ------------ |
| [`apps/v-on`](./apps/v-on) | Godot signal handling with Vue events |
| [`apps/v-model`](./apps/v-model) | Two-way binding with Godot controls |
| [`apps/template-ref`](./apps/template-ref) | Vue template refs against Godot nodes |
| [`apps/lifecycles`](./apps/lifecycles) | Component lifecycle behavior |
| [`apps/anchor-ordering`](./apps/anchor-ordering) | Anchor and layout ordering behavior |
| [`apps/html-demo`](./apps/html-demo) | `@vue-godot/html` components and `@vue-godot/browser` APIs |

## How It Works

Vue Godot is a custom Vue renderer that targets Godot's scene tree instead of the DOM.

- `createElement` instantiates Godot classes through `ClassDB.instantiate()`.
- `insert` adds nodes with `add_child()`.
- `patchProp` writes Godot properties with `set()` and connects signals for `v-on`.
- Vite builds the Vue app as a CommonJS bundle with `godot` externalized.
- A Godot scene attaches the generated script to a `Control` node.
- In `_ready()`, the script calls `createApp(Root).mount(this)`, and Vue takes over that subtree.

Uppercase template tags such as `<HBoxContainer>` and `<Label>` are treated as Godot node classes. When using `@vue-godot/html`, HTML-like components such as `<Div>` and `<Button>` are registered as Vue components that render Godot nodes internally.

## Repository Structure

```text
vue-godot/
├── packages/
│   ├── runtime-tscn/       # Vue custom renderer for Godot
│   ├── html/               # HTML-like Vue components
│   ├── browser/            # Browser API polyfills for GodotJS
│   └── cli/                # vue-godot command line tools
├── apps/
│   ├── v-on/               # Event handling example
│   ├── v-model/            # Two-way binding example
│   ├── template-ref/       # Template ref example
│   ├── lifecycles/         # Lifecycle example
│   ├── anchor-ordering/    # Layout ordering example
│   └── html-demo/          # HTML/browser integration demo
└── turbo.json              # Turborepo config
```

Each app uses this shape:

```text
apps/<name>/
├── project.godot           # Godot project file
├── app.tscn                # Main scene
├── typings/                # GodotJS and generated Vue declarations
├── vue/
│   ├── vite.config.ts      # Builds vue/src/main.ts to dist/app.js
│   ├── tsconfig.json       # Vue and Volar TypeScript config
│   └── src/
│       ├── main.ts         # createApp(Root).mount(this)
│       └── *.vue           # Vue SFC components
├── dist/                   # Build output loaded by Godot
└── package.json
```

## Creating Another App In This Repo

1. Copy an existing app directory such as `apps/v-model` to `apps/<your-app>`.
2. Update the `name` field in `package.json`.
3. Update the project name in `project.godot`.
4. Open `apps/<your-app>/project.godot` in the GodotJS editor so GodotJS can generate typings.
5. Run `npm run gen:types` in the app directory.
6. Edit Vue files under `vue/src/`.
7. Run `npm run build`, then press **F5** in Godot.

## Contributing And Local Development

Install dependencies and build everything from the repository root:

```bash
npm install
npm run build
```

Most app work follows this loop:

```text
Edit .vue or .ts files
npm run build
Run the scene in Godot
```

When Godot typings change, regenerate Vue component types from the app directory:

```bash
cd apps/v-model
npm run gen:types
```

The generated `typings/godot.vue-components.gen.d.ts` file gives Volar autocomplete and type checking for Godot node tags in Vue templates.
