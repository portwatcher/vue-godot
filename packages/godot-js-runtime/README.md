# Godot JavaScript Runtime

Godot JavaScript Runtime is a standalone JavaScript and ahead-of-time
TypeScript runtime for official Godot. It is not a Vue package and its native
extension does not import, link, or bundle Vue.

The repository now contains the resource-backed QuickJS-ng host, module system,
and generated Godot 4.4 binding with complete Variant conversion. The
JavaScript `ScriptLanguage` adapter is still under construction, so JavaScript
scene attachment is not yet a supported release surface.

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
`require('godot-js')`. This module reports runtime capabilities alongside the
`godot` engine binding:

| Function            | Description                                                       |
| ------------------- | ----------------------------------------------------------------- |
| `runtimeVersion()`  | Returns the `godot-js-runtime` package/runtime version.           |
| `quickJSVersion()`  | Returns the embedded QuickJS-ng version.                          |
| `runtimeFeatures()` | Returns the deterministic list of enabled host features.          |
| `hasFeature(name)`  | Tests one host feature without version-string parsing.            |
| `collectGarbage()`  | Forces a QuickJS collection and prunes weak Godot wrapper caches. |

The host currently supports resource-backed ESM, CommonJS, JSON modules,
relative extension and index resolution, circular dependencies, module caches,
Promise job draining, bounded memory/stack/execution, Godot-routed console
levels, and external version-3 source maps. Node.js built-ins and arbitrary
filesystem access are intentionally unavailable.

The extension also registers `GodotJavaScriptRuntimeInfo` for stock-Godot
diagnostics. It reports the product/package/runtime/minimum-Godot versions,
initialization state, `get_live_runtime_count()`, `get_live_wrapper_count()`,
and `get_live_callback_root_count()` so smoke and editor loops can prove that
runtime, wrapper, and callback ownership was torn down.

## Embedded `godot` module

ES modules can import `godot`, and CommonJS bundles can `require('godot')`.
The generated surface contains every class, singleton, utility function,
global enum, constant, signal, property, method, and Variant built-in in the
pinned Godot 4.4.1 extension API. Names remain in Godot's snake_case form.

```js
import { Array as GodotArray, Callable, Label, Vector2 } from 'godot'

const label = new Label()
label.text = 'こんにちは JavaScript'

const values = new GodotArray([new Vector2(2, 4)])
values[0].y = 8

const callback = Callable.create(() => console.log(label.text))
callback.call()
label.free()
```

Godot objects use weak, identity-preserving JavaScript wrappers keyed by
instance ID. Calls validate that the instance is still live before touching its
public GDExtension handle. `Array` and `Dictionary` wrappers also preserve
identity, support indexed/keyed property access, and never expose borrowed
storage. Integers outside JavaScript's safe range use `bigint`; Unicode strings
round-trip through UTF-8; packed-array buffer and typed-array APIs return owned
copies.

Generated dispatch has these deliberately small special cases:

| Special case                                          | Reason and behavior                                                                                                                                                                       |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Variant `Object` slot                                 | Godot's API dump omits `Object` from `builtin_classes`, so generation uses the canonical `Variant.Type` order rather than array position.                                                 |
| `Object.free()`                                       | The API dump omits this core method. The runtime supplies it for non-`RefCounted` objects, rejects manual destruction of `RefCounted` instances, and invalidates the wrapper immediately. |
| `Callable.create()`                                   | JavaScript functions require a repository-owned `CallableCustom` adapter, rooted only while the Callable or a signal connection retains it.                                               |
| Signal connection teardown                            | Connections created through JavaScript are tracked, pruned after collection, and disconnected before their QuickJS context is destroyed.                                                  |
| Editor-only singletons                                | Their exports are `null` outside editor runs instead of manufacturing invalid wrappers.                                                                                                   |
| Packed arrays                                         | `to_array_buffer()` and `toTypedArray()` copy data so JavaScript cannot outlive Godot storage.                                                                                            |
| `StringName`, `NodePath`, and `RID`                   | These branded value wrappers are frozen after construction.                                                                                                                               |
| `typeof`, `is_instance_valid`, and `instance_from_id` | Generated utility dispatch maps the reserved C++ name for `typeof`; object utilities use raw public instance IDs so freed wrappers are never dereferenced.                                |
| Compatible static method fallback                     | When a newer compatible Godot changes a static method hash, dispatch falls back through the public `ClassDB.class_call_static()` API instead of using private engine symbols.             |

The bridge uses public raw GDExtension object handles instead of installing
persistent godot-cpp instance bindings on engine-owned singletons. This keeps
extension unload safe across the minimum 4.4 ABI and newer compatible Godot
releases while retaining correct `RefCounted` ownership through Variants.

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

Native sanitizer tests accept `--sanitizers address,undefined` on Linux and
macOS. Apple platforms run AddressSanitizer without leak detection because the
platform runtime does not support it. Official Linux Godot loads extensions
with `RTLD_DEEPBIND`, which is incompatible with AddressSanitizer; CI therefore
runs the standalone native suite with ASan, UBSan, and leak detection, then
runs the complete live binding stress through stock Godot with UBSan.

Set `PYTHON_BIN` or `SCONS_BIN` when the default tool discovery is unsuitable.
The build tooling also supports print-only operation for CI inspection.

## Current verification boundary

At this phase, the extension and live generated binding load and unload cleanly
in official Godot 4.4.1 and the current stable editor. The stock fixture covers
all 39 Variant types, inheritance, constructors and overloads, singletons,
properties, methods, signals, callback roots, object/container identity,
invalid-object errors, deep nested containers, 64-bit boundaries, Unicode,
2,048-node ownership stress, forced garbage collection, repeated reloads, and
three editor play/stop cycles. Native tests separately cover ESM and CommonJS
cycles, Vite-style chunks, limits, exceptions, source maps, caches, and repeated
teardown. Every cycle asserts that live runtime, wrapper, and callback counts
return to zero. This is not yet the final scene-script integration: the loader
still returns a placeholder Godot script after evaluating a resource module.
Script instances, editor tooling, installers, platform exports, and Vue
migration remain later gates.

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
