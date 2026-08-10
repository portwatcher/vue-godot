# Godot JavaScript Runtime

Godot JavaScript Runtime is a standalone JavaScript and ahead-of-time
TypeScript runtime for official Godot. It is not a Vue package and its native
extension does not import, link, or bundle Vue.

The repository now contains the resource-backed QuickJS-ng host, generated
Godot 4.4 binding with complete Variant conversion, and the JavaScript
`ScriptLanguage` implementation. Stock Godot can load, attach, serialize, run,
and reload `.js`, `.mjs`, and `.cjs` scripts. Installation tooling and release
artifacts remain under development, so this is not yet a published release.

## Attached JavaScript scripts

An ordinary Godot project can attach a JavaScript module to a scene while
importing engine APIs from `godot`:

```js
import { Node2D } from 'godot'

export default class Player extends Node2D {
  _ready() {
    console.log('Player ready')
  }
}
```

The default export must be a JavaScript class derived from a generated Godot
class compatible with the node or resource receiving the script. Prototype
methods are exposed to Godot and virtual methods such as `_ready`, `_process`,
`_physics_process`, `_input`, `_notification`, and `_exit_tree` are dispatched
through the script instance.

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

## TypeScript declarations

The package ships generated ambient declarations for the virtual `godot`,
`godot-js`, and limited `godot-jsb` compatibility modules under `typings/`.
They are generated from the pinned official Godot 4.4.1 extension API and do
not require a custom editor or editor-generated binding bundle.

For a standalone TypeScript project, include the declaration entry point in
`tsconfig.json` while keeping application output owned by the project's
bundler:

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "noEmit": true,
    "strict": true
  },
  "files": ["node_modules/godot-js-runtime/typings/index.d.ts", "src/player.ts"]
}
```

Regenerate the checked-in declarations from the pinned API, or verify them
against the pinned input. To generate a separate declaration set from another
official stock-Godot executable, provide an explicit output directory:

```bash
npm run gen:types --workspace=godot-js-runtime
npm run check:types --workspace=godot-js-runtime
node packages/godot-js-runtime/scripts/generate-types.mjs \
  --godot /path/to/godot --out-dir /path/to/generated-types
```

The generator also accepts `--api /path/to/extension_api.json` and
`--out-dir /path/to/output`. `--check` fails when any declaration or the
fingerprinted manifest differs from deterministic output. The generated
surface includes class inheritance, methods, properties, signals, enums,
bitfields, constants, Variant value types, singletons, utilities, native
structures, and links to the matching official Godot documentation.

## Embedded `godot-js` module

Resource-backed ES modules can import `godot-js`, and CommonJS bundles can
`require('godot-js')`. This module reports runtime capabilities alongside the
`godot` engine binding:

| Function                             | Description                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| `runtimeVersion()`                   | Returns the `godot-js-runtime` package/runtime version.                               |
| `quickJSVersion()`                   | Returns the embedded QuickJS-ng version.                                              |
| `runtimeFeatures()`                  | Returns the deterministic list of enabled host features.                              |
| `hasFeature(name)`                   | Tests one host feature without version-string parsing.                                |
| `collectGarbage()`                   | Forces a QuickJS collection and prunes weak Godot wrapper caches.                     |
| `defineScript(ScriptClass, options)` | Attaches inspector-property, signal, tool-script, and RPC metadata to a script class. |
| `getScriptMetadata(value)`           | Returns metadata previously attached with `defineScript()`.                           |

The host currently supports resource-backed ESM, CommonJS, JSON modules,
relative extension and index resolution, circular dependencies, module caches,
Promise job draining, bounded memory/stack/execution, Godot-routed console
levels, and external version-3 source maps. Node.js built-ins and arbitrary
filesystem access are intentionally unavailable.

## Limited `godot-jsb` compatibility module

Migration code may import or require `godot-jsb`, but its supported surface is
deliberately limited to `callable()`, `to_array_buffer()`, `version`, and
`impl`. New code should use `Callable.create()` and
`PackedByteArray.to_array_buffer()` from `godot` directly. Other historical
helper functions are not part of this runtime's compatibility contract.

The extension also registers `GodotJavaScriptRuntimeInfo` for stock-Godot
diagnostics. It reports the product/package/runtime/minimum-Godot versions,
initialization state, `get_live_runtime_count()`, `get_live_wrapper_count()`,
and `get_live_callback_root_count()` so smoke and editor loops can prove that
runtime, wrapper, and callback ownership was torn down.

## Script metadata

Classes work without metadata. Use `defineScript()` from the embedded
`godot-js` module when a script needs exported inspector properties, declared
signals, tool execution, or RPC configuration:

```js
import { defineScript } from 'godot-js'
import { Node2D } from 'godot'

class Player extends Node2D {
  speed = 240

  move(distance) {
    this.emit_signal('moved', distance)
  }
}

export default defineScript(Player, {
  properties: {
    speed: {
      type: 'float',
      default: 240,
      hint: { range: [0, 1000, 1] },
    },
  },
  signals: {
    moved: [{ name: 'distance', type: 'float' }],
  },
  rpc: {
    move: {
      rpc_mode: 1,
      call_local: true,
      transfer_mode: 2,
      channel: 0,
    },
  },
  tool: false,
})
```

Property types accept Godot Variant names such as `float`, `string`,
`vector2`, `array`, and generated Godot class names. Range hints use
`{ range: [minimum, maximum, step] }`; enum hints use
`{ enum: ['First', 'Second'] }`. Non-tool scripts use Godot placeholder script
instances while their scene is open in the editor, preserving serialized
values without running game code. Scripts marked `tool: true` execute in the
editor.

## Reload behavior

Godot's `Script.reload(keepState)` entry point reloads the project JavaScript
context safely:

- Soft reload (`true`) restores exported property values only when the old and
  new metadata types are compatible; changed types fall back to their new
  defaults.
- Hard reload (`false`) recreates instances from declared defaults.
- A reload requested from inside JavaScript is deferred until the active call
  and Promise-job pump finish. Pending callbacks and signal connections from
  the old context are disconnected before teardown.
- Unsaved editor source stored in `Script.source_code` is used for reload;
  otherwise the resource is refreshed from disk.
- While the editor is open, saved `.js`, `.mjs`, and `.cjs` file changes are
  detected and trigger a state-preserving soft reload. Unsaved in-memory source
  is never overwritten by the disk monitor.

## Editor integration

The registered JavaScript language recognizes `.js`, `.mjs`, and `.cjs`,
provides default and empty script templates, and validates syntax through the
same QuickJS-ng compiler used at runtime. Validation reports resource path,
line, column, and message without executing the module. Godot's normal external
editor setting remains authoritative; the runtime does not claim a built-in
code editor or intercept external-editor launches.

Runtime exceptions retain their JavaScript stack and are remapped through an
external version-3 source map when one is present. Generated TypeScript and Vue
bundles should emit `.map` files beside their JavaScript output so Godot's
debugger and error output can identify the original source file and line.

## Runtime project settings

The extension registers these settings in Godot's Project Settings. Invalid or
out-of-range values produce a warning and use the default.

| Setting                                                    | Default | Range          |
| ---------------------------------------------------------- | ------: | -------------- |
| `godot_js_runtime/runtime/memory_limit_mb`                 |     128 | 16–4096 MB     |
| `godot_js_runtime/runtime/maximum_stack_size_kb`           |    1024 | 256–16384 KB   |
| `godot_js_runtime/runtime/interrupt_interval_milliseconds` |       1 | 0–1000 ms      |
| `godot_js_runtime/runtime/execution_timeout_milliseconds`  |    5000 | 0–600000 ms    |
| `godot_js_runtime/runtime/maximum_promise_jobs_per_frame`  |   10000 | 1–1000000 jobs |

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
| `Signal.as_promise()`                                 | A one-shot tracked connection resolves with the signal's first argument, or `undefined` for a zero-argument signal, matching the migration surface used by existing packages.             |
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
npm run gen:types --workspace=godot-js-runtime
npm run check:types --workspace=godot-js-runtime
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

At this phase, the extension, live generated binding, and JavaScript script
language load and unload cleanly in official Godot 4.4.1 and the current stable
editor. The stock fixture attaches a non-Vue script, exercises lifecycle and
notification dispatch, reflected methods/properties/signals/RPC metadata,
editor placeholders, tool scripts, source serialization, syntax diagnostics,
templates, file monitoring, actionable loader errors, source-mapped runtime
errors, hard and state-preserving soft reloads, deferred reloads, and repeated
editor play/stop cycles. It retains the earlier all-Variant, ownership,
callback, ESM, CommonJS, limit, and stress coverage. Every cycle asserts
balanced runtime, wrapper, and callback ownership. Deterministic stock-Godot
type generation and a strict plain-TypeScript fixture are also verified.
Installers, platform exports, and Vue migration remain later gates.

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
