# Vue Runtime TSCN

A Vue.js runtime renderer that compiles Vue components into Godot Engine TSCN scene files.

## Overview

This package provides a custom Vue.js renderer that targets the Godot Engine scene format (TSCN) instead of the DOM. It enables you to:

1. Define your game UI/scenes using Vue's component system
2. Use Vue's reactivity and component composition
3. Export the result as Godot TSCN files that can be used directly in the Godot Engine

## Installation

```bash
npm install @vue-godot/runtime-tscn
```

## Usage

### Converting a Vue Component to TSCN

```js
import { compileVueToTSCN } from '@vue-godot/runtime-tscn/dist/vueToTSCN'

// Convert a Vue component to TSCN
const tscnContent = compileVueToTSCN('/path/to/component.vue', {
  outFile: 'output.tscn', // Optional: save to file
  appId: 'MainScene', // Optional: root node ID
  rootNodeType: 'Node2D', // Optional: root node type
})

console.log(tscnContent)
```

### From Command Line

```bash
npx vue-to-tscn input.vue output.tscn
```

## How It Works

The package works by:

1. Parsing the Vue SFC (Single File Component)
2. Creating a virtual representation of the component
3. Using a custom renderer to transform Vue components to Godot nodes
4. Mapping Vue/HTML elements to appropriate Godot nodes
5. Converting Vue events to Godot signals
6. Generating a TSCN file that can be loaded in Godot

## Mapping

### HTML Elements to Godot Nodes

- `<div>`, `<span>` → `Control`
- `<button>` → `Button`
- `<img>` → `TextureRect`
- `<input type="text">` → `LineEdit`
- `<input type="checkbox">` → `CheckBox`
- And many more...

### Properties

- `style.width` → `rect_min_size/x`
- `style.height` → `rect_min_size/y`
- `style.backgroundColor` → `modulate`
- And more...

### Events

- `@click` → `pressed` signal
- `@change` → `value_changed` signal
- And more...

## Example

```vue
<template>
  <div class="game-container">
    <h1>{{ title }}</h1>
    <button @click="incrementScore">Score: {{ score }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'My Godot Game',
      score: 0,
    }
  },
  methods: {
    incrementScore() {
      this.score++
    },
  },
}
</script>
```

Becomes:

```
[gd_scene format=2]

[node name="GameScene" type="Node2D"]

[node name="game-container" type="Control" parent="GameScene"]
rect_min_size/x = "800"
rect_min_size/y = "600"
self_modulate = "Color(0.529, 0.808, 0.922, 1)"

[node name="h1" type="Label" parent="GameScene/game-container"]
text = "My Godot Game"
align = "center"
self_modulate = "Color(1, 1, 1, 1)"

[node name="button" type="Button" parent="GameScene/game-container"]
text = "Score: 0"
self_modulate = "Color(1, 1, 1, 1)"
```

## Limitations

- Not all Vue features are supported
- Some manual adjustments in Godot might be needed
- Currently focuses on UI elements rather than game-specific nodes
- The GDScript generation for event handlers is basic and may need custom implementation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
