# vue-godot

Unscoped npm package for running the Vue Godot CLI with `npx vue-godot`.

This package is a thin alias for [`@vue-godot/cli`](../cli/README.md). It does
not provide a separate library API; install `@vue-godot/cli` directly when you
need to import CLI helpers from scripts.

## Usage

```bash
npx vue-godot create my-game
npx vue-godot integrate --html
npx vue-godot gen-types
npx vue-godot doctor
```

## Relationship to `@vue-godot/cli`

The implementation lives in `@vue-godot/cli`. This package depends on that
scoped package and exposes the same `vue-godot` binary so users can run the
shorter `npx vue-godot ...` command.

Created projects install and verify `godot-js-runtime`, generate declarations
from stock Godot, and run in an official Godot editor. This alias does not ship
an editor or a second JavaScript runtime.

## License

MIT
