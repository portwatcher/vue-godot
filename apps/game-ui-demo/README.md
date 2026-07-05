# game-ui-demo

Reference game UI app built with Vue Godot and `@vue-godot/html`.

## Production Readiness Coverage

This app exists to keep SDK-level HUD and game menu flows exercised:

| Requirement       | Coverage                                                         |
| ----------------- | ---------------------------------------------------------------- |
| Godot scene       | `app.tscn` mounts the Vue app into the Godot scene tree.         |
| Vue-rendered HUD  | The root SFC renders the HUD, settings, inventory, and overlays. |
| controller        | Input mode selector includes controller state.                   |
| keyboard          | Keyboard shortcut handling updates HUD state.                    |
| touch             | Touch mode is represented with large `Pressable` controls.       |
| animation         | `requestAnimationFrame()` drives a small HUD pulse.              |
| audio             | `<Audio>` renders an embedded data URI effect.                   |
| video             | `<Video>` renders `assets/demo-video.ogv`.                       |
| image assets      | `<Img>` renders `icon.svg`.                                      |
| pause             | Pause overlay can be opened and closed.                          |
| settings          | Volume, difficulty, and assist toggles are reactive.             |
| inventory         | Inventory selection and item use are reactive.                   |
| focus restoration | Closing the pause overlay restores the last focused panel label. |
| Godot smoke       | Open `project.godot` in GodotJS and press F5 after building.     |
| npm run build     | Builds the SDK dependencies and Vite bundle.                     |

## Commands

```bash
npm run build --workspace=game-ui-demo
npm run dev --workspace=game-ui-demo
npm run gen:types --workspace=game-ui-demo
```

`npm run build` emits `dist/app.js`, which is attached by `app.tscn`.
