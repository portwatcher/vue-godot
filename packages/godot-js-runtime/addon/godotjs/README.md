# GodotJS

GodotJS adds JavaScript and TypeScript project scripting to official Godot by
using a native GDExtension backed by QuickJS-ng.

## Install

1. Download `godotjs-v<version>.zip` from the matching GitHub release.
2. Extract the ZIP at the root of the Godot project.
3. Confirm that this file exists:
   `addons/godotjs/godotjs.gdextension`.
4. Open the project in the supported stable Godot version.

The ZIP includes debug and release libraries for macOS, Windows, Linux,
Android, iOS, and Web. Keep the complete `addons/godotjs` directory in source
control and in exported project resources.

For a standalone TypeScript project, include the bundled declarations in
`tsconfig.json`:

```json
{
  "files": [
    "addons/godotjs/typings/index.d.ts",
    "src/main.ts"
  ]
}
```

GodotJS is not installed from npm. Vue Godot is a separate npm package and
works with this manually installed GDExtension.

See the repository README for usage, compatibility, and troubleshooting.
