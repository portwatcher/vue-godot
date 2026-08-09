# Godot JavaScript Runtime

Godot JavaScript Runtime is a standalone JavaScript and ahead-of-time
TypeScript runtime for official Godot. It is not a Vue package and its native
extension does not import, link, or bundle Vue.

The repository is currently implementing the native extension shell. The
checked-in helper API and reproducible dependency bootstrap are usable for
development, but JavaScript execution and script attachment are not yet a
supported release surface.

## Plain JavaScript goal

The completed runtime will let an ordinary Godot project attach a bundled
JavaScript module to a scene while importing engine APIs from `godot`:

```js
import { Node2D } from 'godot'

export default class Player extends Node2D {
  _ready() {
    console.log('Player ready')
  }
}
```

TypeScript is compiled before Godot runs it. The embedded engine will not
execute TypeScript source directly.

## Current helper API

Install the workspace package for helper types while developing the native
runtime:

```bash
npm install godot-js-runtime
```

| API | Description |
| --- | --- |
| `defineScript(ScriptClass, metadata)` | Attaches canonical inspector, signal, tool, and RPC metadata to a script class without requiring decorators. |
| `getScriptMetadata(value)` | Reads metadata previously attached by `defineScript()`. |
| `runtimeName` | Canonical product name: `Godot JavaScript Runtime`. |
| `runtimePackageName` | Canonical npm and workspace name: `godot-js-runtime`. |
| `minimumGodotVersion` | Minimum supported Godot ABI, currently `4.4`. |
| Manifest types and guards | Typed representation and runtime validation for native artifact manifests. |

```ts
import { defineScript } from 'godot-js-runtime'

class Player {
  speed = 240
}

export default defineScript(Player, {
  properties: {
    speed: { type: 'float', default: 240 },
  },
})
```

## Native development

The build pins `godot-cpp`, QuickJS-ng, and SCons in
`native/deps.lock.json`. Bootstrap verifies every archive with SHA-256 before
extracting it into the ignored `native/third_party` directory.
`native/godot-cpp-profile.json` compiles only the public C++ wrappers used by
the runtime host; the complete pinned extension API remains available for the
generated JavaScript binding surface.

```bash
npm run bootstrap:native --workspace=godot-js-runtime
npm run build:native --workspace=godot-js-runtime
```

Set `PYTHON_BIN` or `SCONS_BIN` when the default tool discovery is unsuitable.
The build tooling also supports print-only operation for CI inspection.

## Current verification boundary

At this phase, the extension shell is required to load and unload cleanly in
official Godot 4.4.1 and the current stable editor. It registers runtime version
information and an early resource-loader spike. It does not yet evaluate
JavaScript. Platform export support, installation commands, binding generation,
and the final public package are added by later migration phases and must not be
inferred from the shell smoke test.

## Security model

Project JavaScript is trusted application code, not a sandbox. The completed
runtime will bound engine memory and stack usage, but it will not claim to make
untrusted scripts safe. Node.js built-ins are outside the version-one scope.

## Requirements

- Official Godot 4.4.1 or newer compatible Godot 4 release
- Node.js 20 or newer for package and build tooling
- Python 3 and a platform C++ toolchain for source builds

## License

MIT. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for pinned build and
runtime dependencies.
