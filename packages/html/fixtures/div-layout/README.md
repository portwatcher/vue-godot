# Div Layout Fixture

Purpose: reproducible manual scene for validating `Div` layout behavior in Godot.

What this fixture exercises:
- `gap` mapping across row/column + wrap combinations.
- `padding` wrapper (`MarginContainer`) behavior.
- `justifyContent` (`alignment`) mapping.
- `alignItems` default child cross-axis alignment.
- child `flex` and `alignSelf` size-flag mapping.
- nested `template v-for` fragment children.
- `width` / `minHeight` mapping to `custom_minimum_size`.

Usage:
1. Create/integrate a Vue-Godot app with `@vue-godot/html` enabled.
2. Replace your `App.vue` with `fixtures/div-layout/App.vue`.
3. Run your app in Godot and use the buttons to toggle layout modes.
4. Inspect generated nodes and properties in the Godot scene tree inspector.
