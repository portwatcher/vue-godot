# Vue Godot

A small simple project that bridges Vue.js and Godot.

This project is for:

- Write game UI using Vue.js
- Write cross platform applications using Vue.js with Godot as the runtime

This project is far from production ready. follow me on [@juryxiong](https://x.com/juryxiong) for updates.

```vue
<template>
  <HBoxContainer>
    <Button :text="'Click me'" @pressed="handleClick"></Button>
    <Label :text="count"></Label>
  </HBoxContainer>
</template>

<script setup lang="ts">
// Test.vue
import { ref } from 'vue'

const count = ref(1)

const handleClick = () => {
  count.value = count.value + 1
}
</script>
```

```ts
// main.ts
import { createApp } from '@vue-godot/runtime-tscn'
import { Control } from 'godot'
import Test from './Test.vue'

export default class App extends Control {
  _ready() {
    const app = createApp(Test)
    app.mount(this)
  }
}
```

![demo](./intro-medias/demo.gif)

## Getting Started

Download GodotJS editor from https://github.com/ialex32x/GodotJS-Build/releases

> **Note:** GodotJS 1.0.0-2 has a scene codegen bug where `SceneTSDCodeGen.make_path` doesn't strip `res://` from scene paths, producing `ERROR: Could not create directory: './typings/res:/'`. This was fixed on the [main branch](https://github.com/godotjs/GodotJS/blob/main/scripts/jsb.editor/src/jsb.editor.codegen.ts) (method renamed to `make_scene_path` with `res://` stripping) but no Godot 4.4 build includes the fix yet. The errors are harmless and don't affect runtime. To suppress them, go to **Editor → Editor Settings → search `GodotJS`** and set `codegen/generate_scene_dts` to `false`.

```bash
npm install
npm run build
```

Open GodotJS editor and open `apps/v-on/project.godot`
