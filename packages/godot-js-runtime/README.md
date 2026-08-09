# Godot JavaScript Runtime

Godot JavaScript Runtime is a standalone JavaScript and ahead-of-time
TypeScript runtime for official Godot. It is not a Vue package and its native
extension does not import, link, or bundle Vue.

The repository now contains the resource-backed QuickJS-ng host and module
system. The full Godot object binding and JavaScript `ScriptLanguage` adapter
are still under construction, so JavaScript scene attachment is not yet a
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

| API                                   | Description                                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `defineScript(ScriptClass, metadata)` | Attaches canonical inspector, signal, tool, and RPC metadata to a script class without requiring decorators. |
| `getScriptMetadata(value)`            | Reads metadata previously attached by `defineScript()`.                                                      |
| `runtimeName`                         | Canonical product name: `Godot JavaScript Runtime`.                                                          |
| `runtimePackageName`                  | Canonical npm and workspace name: `godot-js-runtime`.                                                        |
| `minimumGodotVersion`                 | Minimum supported Godot ABI, currently `4.4`.                                                                |
| Manifest types and guards             | Typed representation and runtime validation for native artifact manifests.                                   |

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

## Embedded `godot-js` module

Resource-backed ES modules can import `godot-js`, and CommonJS bundles can
`require('godot-js')`. This bootstrap-only module reports runtime capabilities
before the full `godot` engine binding is installed:

| Function            | Description                                              |
| ------------------- | -------------------------------------------------------- |
| `runtimeVersion()`  | Returns the `godot-js-runtime` package/runtime version.  |
| `quickJSVersion()`  | Returns the embedded QuickJS-ng version.                 |
| `runtimeFeatures()` | Returns the deterministic list of enabled host features. |
| `hasFeature(name)`  | Tests one host feature without version-string parsing.   |

The host currently supports resource-backed ESM, CommonJS, JSON modules,
relative extension and index resolution, circular dependencies, module caches,
Promise job draining, bounded memory/stack/execution, Godot-routed console
levels, and external version-3 source maps. Node.js built-ins and arbitrary
filesystem access are intentionally unavailable.

The extension also registers `GodotJavaScriptRuntimeInfo` for stock-Godot
diagnostics. It reports the product/package/runtime/minimum-Godot versions,
initialization state, and `get_live_runtime_count()` so smoke and editor loops
can prove that QuickJS instances were torn down.

## Native development

The build pins `godot-cpp`, QuickJS-ng, and SCons in
`native/deps.lock.json`. Bootstrap verifies every archive with SHA-256 before
extracting it into the ignored `native/third_party` directory.
`native/godot-cpp-profile.json` compiles only the public C++ wrappers used by
the runtime host; the complete pinned extension API remains available for the
generated JavaScript binding surface. The deterministic generator currently
emits metadata for all 952 Godot 4.4.1 classes, 38 Variant built-ins, 37
singletons, 114 utility functions, and their methods, properties, signals,
enums, constants, and module exports. Generated files record the source API
fingerprint and pinned `godot-cpp` commit.

```bash
npm run bootstrap:native --workspace=godot-js-runtime
npm run generate:bindings --workspace=godot-js-runtime
npm run check:bindings --workspace=godot-js-runtime
npm run build:native --workspace=godot-js-runtime
npm run test:native --workspace=godot-js-runtime
```

Set `PYTHON_BIN` or `SCONS_BIN` when the default tool discovery is unsuitable.
The build tooling also supports print-only operation for CI inspection.

## Current verification boundary

At this phase, the extension loads and unloads cleanly in official Godot 4.4.1
and the current stable editor. Its temporary resource-loader probe evaluates a
real resource ESM graph, JSON import, `godot-js` feature calls, and Promise jobs
before returning a placeholder Godot script. Native tests separately cover ESM
and CommonJS cycles, Vite-style chunks, limits, exceptions, source maps, caches,
and repeated teardown. The stock fixture also runs repeated resource reloads and
three editor play/stop cycles while asserting that the live QuickJS count
returns to zero. This is not yet the final scene-script integration: Godot
classes, Variant conversion, editor tooling, platform export support,
installation commands, and the live generated binding bridge are later
migration gates. The pinned binding metadata and deterministic regeneration
gate are present, but metadata alone is not a usable `godot` module.

## Security model

Project JavaScript is trusted application code, not a sandbox. The host bounds
QuickJS memory, stack, execution time, and Promise job pumping, but those limits
do not make untrusted scripts safe. Node.js built-ins are outside the
version-one scope.

## Requirements

- Official Godot 4.4.1 or newer compatible Godot 4 release
- Node.js 20 or newer for package and build tooling
- Python 3 and a platform C++ toolchain for source builds

## License

MIT. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for pinned build and
runtime dependencies.
