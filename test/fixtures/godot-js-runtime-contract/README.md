# Godot JavaScript runtime contract fixture

This non-Vue project captures the engine-binding and bundle behavior that the
standalone runtime must preserve. Its scene attaches the CommonJS Vite entry at
res://dist/app.js and exercises class construction, ClassDB, properties,
signals, Callable, resource loading, environment access, timing, networking,
media-related types, Promise jobs, relative chunks, and scene lifecycle hooks.

During Phase 0 it is a control against the legacy runtime. Later phases run the
same fixture through the repository-owned extension and unmodified Godot.
