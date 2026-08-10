# Godot JavaScript Runtime

Godot JavaScript Runtime is a standalone JavaScript and ahead-of-time
TypeScript runtime for official Godot. It is not a Vue package and its native
extension does not import, link, or bundle Vue.

The package contains the resource-backed QuickJS-ng host, a generated binding
for the Godot 4.4.1 compatibility floor with complete Variant conversion, and
the JavaScript `ScriptLanguage` implementation. Stock Godot can load, attach,
serialize, run, reload, and export `.js`, `.mjs`, and `.cjs` scripts. The
release manifest covers the full desktop, Android, iOS, and threaded-Web v1
matrix in debug and release modes.

## Package exports

- `godot-js-runtime` exposes bundle-format helpers and the package's primary
  TypeScript API.
- `godot-js-runtime/installer` exposes the manifest-driven installer and
  verification API for programmatic tooling.

## Install into an official Godot project

Install the package in a new or existing project, inspect the available native
targets, then install the host debug target:

```bash
npm install --save-dev godot-js-runtime
npx godot-js-runtime targets
npx godot-js-runtime install --project .
npx godot-js-runtime verify --project .
```

The project must already contain `project.godot`. `install` copies the core
addon, license notices, and one exact host artifact into
`addons/godot-js-runtime`. Native artifacts are not embedded in the npm
tarball: the installer reads their versioned archive names, HTTPS URLs, sizes,
and SHA-256 hashes from the packaged manifest. It downloads only the archive
needed by the selected target and verifies the archive and every extracted
payload before copying anything. It also adds only the runtime's line to
`.godot/extension_list.cfg`, preserving other registered extensions. Every
owned file, target, size, checksum, and registration is recorded in
`addons/godot-js-runtime/installation-manifest.json`.

For an offline or air-gapped install, download the exact archives named in
`runtime-manifest.json` into one directory and pass it explicitly:

```bash
npx godot-js-runtime install --project . \
  --artifact-dir /absolute/path/to/runtime-archives
```

Offline archives receive the same size, SHA-256, path-safety, embedded
manifest, and per-payload checks as downloaded archives.

Installation is idempotent. An existing destination that is not recorded by a
valid installation manifest is never adopted or overwritten unless `--force`
is passed; even then, only the exact colliding runtime destination is replaced.
To remove the runtime:

```bash
npx godot-js-runtime uninstall --project .
```

Uninstall removes only manifest-owned files and the runtime's extension-list
entry. Other files inside the addon directory and other registered extensions
are preserved.

### TypeScript build and watch

Copy the packaged Godot 4.4.1 declarations, or generate declarations matching
a specific official Godot executable:

```bash
npx godot-js-runtime typegen --project .
GODOT_BIN=/absolute/path/to/godot \
  npx godot-js-runtime typegen --project .
```

Point `tsconfig.json` at `typings/index.d.ts`, compile into a resource path such
as `dist/`, and keep source maps beside the emitted JavaScript:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "rootDir": "src",
    "outDir": "dist",
    "sourceMap": true,
    "strict": true,
    "skipLibCheck": false
  },
  "files": ["typings/index.d.ts", "src/player.ts"]
}
```

```bash
npx tsc -p tsconfig.json
npx tsc -p tsconfig.json --watch
```

Godot executes the emitted `.js`, `.mjs`, or `.cjs`; it never executes the
TypeScript source. `apps/js-runtime-demo` is the tested non-Vue reference
project for this workflow.

### Export targets

The artifact manifest exposes these exact v1 targets. Debug artifacts are for
the editor and development exports; release artifacts are optimized for
production exports.

| Platform | Exact targets                                                                                                                        | Binary form                                                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| macOS    | `macos.template_debug.universal`, `macos.template_release.universal`                                                                 | universal arm64 + x86_64 frameworks                                |
| Windows  | `windows.template_debug.x86_64`, `windows.template_release.x86_64`                                                                   | x86_64 DLLs                                                        |
| Linux    | `linux.template_debug.x86_64`, `linux.template_release.x86_64`                                                                       | x86_64 shared libraries                                            |
| Android  | `android.template_debug.arm64`, `android.template_debug.x86_64`, `android.template_release.arm64`, `android.template_release.x86_64` | arm64-v8a and x86_64 shared libraries                              |
| iOS      | `ios.template_debug.universal`, `ios.template_release.universal`                                                                     | XCFrameworks with arm64 device and arm64 + x86_64 simulator slices |
| Web      | `web.template_debug.wasm32`, `web.template_release.wasm32`                                                                           | threaded wasm32 GDExtensions                                       |

Add every target needed by the project's export presets without removing the
already installed host target:

```bash
npx godot-js-runtime targets
npx godot-js-runtime add-target linux.template_release.x86_64 --project .
npx godot-js-runtime verify --project .
```

The command fails if the installed core and target source have different
versions or manifests. Export presets must include the emitted JavaScript,
relative chunks, JSON resources, and any desired `.map` files.

Windows arm64, Linux arm64, Android arm32, consoles, and the Godot Web editor
are not supported in v1. Web exports require Godot's extension and thread
variants and must be served with cross-origin isolation: `COOP: same-origin`,
`COEP: require-corp`, and compatible `CORP` headers. iOS exports still require
the application's own Apple signing and device provisioning; the release gate
performs unsigned device/simulator links and launches a compatible simulator
where the host and official template architecture permit it.

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
| Installer functions                   | Programmatic install, add-target, verify, uninstall, target discovery, and manifest guards.                  |
| `generateProjectTypes(options)`       | Copies pinned declarations or generates version-matched declarations from official Godot.                    |
| `commonJsBundleBanner`                | Deterministic Rollup/Vite banner that marks a `.js` entry as CommonJS for the native loader.                 |

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

### CommonJS Vite bundles

The `.cjs` extension always selects CommonJS and `.mjs` always selects ESM.
Plain `.js` defaults to ESM unless a bundler emits the runtime's explicit
CommonJS metadata banner. Keep the existing `dist/app.js` scene contract by
adding the shared banner to Rollup output:

```ts
import { commonJsBundleBanner } from 'godot-js-runtime'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.ts',
      formats: ['cjs'],
      fileName: () => 'app.js',
    },
    rollupOptions: {
      external: ['godot'],
      output: {
        banner: commonJsBundleBanner,
        chunkFileNames: 'chunks/[name].js',
      },
    },
  },
})
```

The same banner is written to relative chunks, while the entry format controls
their `require()` evaluation. Format selection is therefore identical in the
editor, headless runs, and exported applications and does not rely on source
guessing.

## TypeScript declarations

The package ships generated ambient declarations for the virtual `godot`,
`godot-js`, and limited `godot-jsb` compatibility modules under `typings/`.
They are generated from the pinned official Godot 4.4.1 extension API and do
not require a custom editor or editor-generated binding bundle.

Generated input types mirror the runtime bridge: ordinary JavaScript arrays
are accepted for Godot and packed arrays, and `PackedByteArray` inputs also
accept `Uint8Array` and `ArrayBuffer` without an intermediate wrapper.

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
structures, typed dictionaries, opaque native callback pointers, and links to
the matching official Godot documentation.

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
`get_live_callback_root_count()`, `get_memory_usage_bytes()`,
`get_initialization_time_usec()`, and
`get_first_module_evaluation_time_usec()`. Its `collect_garbage()` diagnostic
hook forces a QuickJS collection. Together these let smoke, performance, and
editor loops verify runtime cost and prove that wrapper and callback ownership
was torn down.

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
- While the editor is open, changes to loaded `.js`, `.mjs`, `.cjs`, and JSON
  modules—including relative Vite chunks—trigger a state-preserving soft
  reload. Unsaved in-memory entry source is never overwritten by the disk
  monitor.

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
Package tests run that bootstrap automatically, so a clean checkout does not
depend on a previously populated native dependency tree.
`native/godot-cpp-profile.json` compiles only the public C++ wrappers used by
the runtime host; the complete pinned extension API remains available for the
generated JavaScript binding surface. The deterministic generator currently
emits metadata for all 952 Godot 4.4.1 classes, 38 Variant built-ins, 37
singletons, 114 utility functions, and their methods, properties, signals,
enums, constants, and module exports. Generated files record the source API
fingerprint and pinned `godot-cpp` commit.

Once `runtime-manifest.json` contains packaged platform archives, a host-only
native build preserves that canonical release manifest. Release packaging is
the only normal path that replaces the complete platform matrix.

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

The checksummed SCons wheel runs directly through Python's module loader, so
source builds do not require `pip` or `venv`. Set `PYTHON_BIN` or `SCONS_BIN`
when the default tool discovery is unsuitable. The build tooling also supports
print-only operation for CI inspection.

## Build, package, and export verification

The release tooling uses one canonical 14-target matrix for native builds,
`.gdextension` feature tags, manifests, archives, installer selection, and
artifact inspection. From the repository root:

```bash
npm run setup:godot
npm run setup:godot-templates
npm run build:release --workspace=godot-js-runtime -- --platform linux --mode all
npm run verify:release --workspace=godot-js-runtime -- --platform linux
npm run package:godot-js-runtime
```

`package:godot-js-runtime` requires all six platform families, emits one
deterministic archive per family under
`.artifacts/godot-js-runtime/<version>`, writes `SHA256SUMS` and
`PROVENANCE.json`, and refreshes the package manifest. Each archive includes
the extension descriptor, notices, dependency licenses, its platform payloads,
an embedded manifest, provenance, and payload checksums.

Run the complete standalone and representative Vue export gate from in-tree
artifacts, then repeat it through clean offline release archives:

```bash
npm run smoke:platform-exports
npm run smoke:platform-exports -- \
  --release-dir .artifacts/godot-js-runtime/0.0.1
```

Both commands export debug and release applications for macOS, Windows, Linux,
Android, iOS, and Web. The runner launches desktop applications, an arm64
Android device/emulator, and threaded Web in Chromium; it validates both
Android ABIs, all Apple slices, unsigned Xcode links, binary dependencies, and
runtime/Godot/platform markers. It records the remaining signed iOS device
launch as a manual application-release gate when local hardware or credentials
do not permit it. The generated export presets explicitly include `.js`,
`.mjs`, `.cjs`, `.json`, and JavaScript source-map files under `dist/`, so Web
and other packaged exports do not depend on editor resource-discovery state.

The same release matrix runs in CI. Web builds use a digest-pinned Emscripten
SDK, Android uses a pinned NDK, export templates are verified by exact size and
an official SHA-256 (or the retained SHA-512 for older catalog entries), and
native payloads are rejected if they depend on a custom editor/runtime binary
or an undeclared third-party shared library. Linux payloads are built on the
pinned Ubuntu 22.04 runner and launched from the packaged archive in a
digest-pinned Debian Bookworm container, preventing a newer hosted-runner glibc
from becoming an accidental release requirement.

The native ABI and generated fallback declarations remain pinned to Godot
4.4.1 so one artifact set supports later compatible Godot 4 releases. The
ordinary integration and publishing gates use the current stable catalog entry
(4.7.1 for this release). In addition, the daily latest-stable workflow queries
the official Godot source and build releases, admits only stable checksummed
assets, and repeats the stock-engine smoke suite and complete macOS, Windows,
Linux, Android, iOS, and Web export matrix. A GitHub compatibility release is
created only after every gate passes; its tag includes both the runtime and
Godot versions and cannot trigger the separate npm `v*` publisher.

## Security model

Project JavaScript is trusted application code, not a sandbox. The host bounds
QuickJS memory, stack, execution time, and Promise job pumping, but those limits
do not make untrusted scripts safe. The runtime does not expose Node.js
built-ins, `node_modules` traversal, `process`, arbitrary host filesystem
access, child processes, sockets, browser DOM globals, `window`, or
`localStorage`. Bundle ordinary npm dependencies ahead of time; use generated
Godot APIs (and optional separately installed polyfills) for file, network,
device, and platform services.

## Troubleshooting

- `No loader found for resource`: run `verify`, confirm the selected artifact
  matches the host, and restart Godot after installation. The installer records
  the extension for immediate headless startup, but an editor already running
  with an older extension still needs a restart.
- `Runtime target is not packaged`: use `targets` and pass the exact reported
  name. A source checkout must build that target before it can be installed.
- TypeScript cannot resolve `godot`: run `typegen` and include
  `typings/index.d.ts` in the TypeScript project.
- A module import fails in Godot: bundle npm dependencies and keep resource
  imports under `res://`; Node core modules and general package traversal are
  unsupported.
- `verify` reports a checksum mismatch: reinstall from the same trusted package
  source. The CLI refuses to treat modified or unrelated files as owned.

## Requirements

- Official Godot 4.4.1 or newer compatible Godot 4 release
- Node.js 20 or newer for package and build tooling
- Python 3 and a platform C++ toolchain only when building native artifacts
  from source

## License

MIT. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for pinned build and
runtime dependencies.
