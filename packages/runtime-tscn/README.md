# @vue-godot/runtime-tscn

This package is part of the [Vue Godot](../../README.md) project.

It provides a Vue runtime renderer for Godot TSCN files. This allows you to use Vue.js to define and manipulate Godot scene tree (TSCN) files programmatically.

See the repository [compatibility checklist](../../docs/compatibility.md) for current renderer support status, platform caveats, and known limits.

## Features

- Render Vue components into Godot scene nodes.
- Manipulate Godot node properties using Vue's reactivity system.

## Prop Removal / Unset Semantics

When Vue removes a non-event prop (`next == null` / `undefined`), the renderer treats this as a request to reset the Godot property instead of writing `null`/`undefined` directly.

- On the first non-null assignment for a property, the renderer caches the current value via `get(...)` (when available).
- When that prop is later removed, the renderer restores the cached value via `set(...)`.
- If no cached value is available, the renderer warns and leaves the current value unchanged.

Limitations:

- Some Godot properties require type-specific reset values or custom reset APIs. The generic fallback cannot infer those automatically.
- If a property is mutated outside the Vue renderer after the initial cache capture, the cached "default" may no longer represent the desired reset value.
- Cached values are stored as-is; mutable objects/resources may need app-level handling if deep reset semantics are required.

## Installation

```
npm install @vue-godot/runtime-tscn
```
