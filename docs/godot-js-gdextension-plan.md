# Standalone Godot JavaScript GDExtension Implementation Plan

Status: approved implementation plan; not yet part of the supported runtime
surface.

This document is the execution contract for replacing the repository's
dependency on a custom GodotJS editor with a standalone JavaScript runtime
implemented as a GDExtension. The runtime is a separate product from Vue Godot.
It must be useful to any Godot user who wants to write JavaScript or TypeScript,
including projects that do not install Vue or any `@vue-godot/*` package.

The plan is intentionally detailed enough to be used as the objective of a
persistent Codex Goal. Treat the architectural decisions and completion gates
below as settled unless implementation evidence proves that a public Godot API
cannot support them.

## Codex Goal Entry Point

Start a Codex Goal with this objective:

> Implement `docs/godot-js-gdextension-plan.md` end to end. Treat its product
> boundaries, technical decisions, phase order, tests, migration gates, and
> definition of done as the execution contract. Work in a dedicated
> Codex-managed worktree, keep a progress ledger with commit hashes in the plan,
> and continue across goal turns until every required phase and platform gate is
> complete. Do not declare success after a scaffold, desktop-only prototype, or
> dual-runtime state. Preserve the legacy GodotJS path until the replacement
> gates pass, then remove it. Keep documentation, demos, generated templates,
> CI, release tooling, and applicable GitHub issues aligned. When all gates pass,
> synchronize with `origin/develop`, push the completed commits to `develop`,
> and report the final commit hashes and verification results.

The goal runner must not ask the user to choose routine implementation details
already decided here. It should make small, evidence-based adjustments when
necessary, record them in the decision log, and continue. A real external
blocker such as unavailable signing credentials may be reported precisely, but
an untested or partially implemented platform must not be presented as done.

## Mission

Deliver a repository-owned, distributable Godot GDExtension that:

1. loads in an official, unmodified Godot editor and export template;
2. embeds a JavaScript engine and exposes Godot through a virtual `godot`
   module;
3. lets `.js`, `.mjs`, and `.cjs` resources act as Godot scripts;
4. supports ahead-of-time compiled TypeScript without executing TypeScript in
   the engine;
5. provides editor integration, deterministic Godot TypeScript declarations,
   native export artifacts, installation tooling, and diagnostics;
6. runs a non-Vue JavaScript demo as an independent product;
7. runs every existing Vue Godot demo without a custom Godot executable; and
8. removes all build-time and runtime dependence on GodotJS editors, modules,
   generated bindings, and export templates.

The intended dependency direction is:

```text
Vue Godot packages (optional consumer)
                |
                v
Standalone Godot JavaScript runtime GDExtension
                |
                v
         Official stock Godot
```

The native runtime must never import, link, bundle, or otherwise depend on Vue.

## Non-Negotiable Boundaries

- The canonical product name is **Godot JavaScript Runtime**. Use
  `godot-js-runtime` for repository paths and `godot_js_runtime` for Godot
  resource and native-library names.
- The source package lives at `packages/godot-js-runtime` and is independently
  buildable and testable.
- The npm workspace and public package name is `godot-js-runtime`. It is
  intentionally outside the `@vue-godot` scope so its identity and installation
  path do not imply a Vue dependency. Verify registry availability again before
  the first publish, but do not change the code, module, or binary identities if
  distribution later requires a neutral organization scope.
- `godot_js_runtime.gdextension` contains only JavaScript-engine, Godot-binding,
  script-language, editor, and packaging functionality. Vue rendering remains
  in `@vue-godot/runtime-tscn`.
- QuickJS-ng is the only embedded engine required for the first complete
  release. V8, JavaScriptCore, Node.js, and host-browser JavaScript backends are
  out of scope until the QuickJS-ng implementation is complete and released.
- Godot 4.4 is the minimum supported ABI. Build against the 4.4 extension API,
  set `compatibility_minimum = "4.4"`, and test both the latest 4.4 patch and
  the current stable Godot release. A later minimum requires an explicit
  decision-log entry with proof that the 4.4 public GDExtension API is
  insufficient.
- Use only public GDExtension and `godot-cpp` APIs. Do not require Godot engine
  source headers or private engine symbols.
- Do not add GodotJS as a submodule, downloaded build input, linked library,
  runtime fallback, or release artifact. MIT-licensed code may be adapted only
  when its license and provenance are retained and the resulting code is
  maintained in this repository.
- QuickJS-ng and `godot-cpp` are source/build dependencies, not user-installed
  runtimes. Pin them reproducibly and publish self-contained native artifacts.
- Preserve the virtual module specifier `godot` so current application and Vue
  Godot source code does not require a mass import rewrite.
- Do not provide Node.js built-ins. File, network, process, and device access
  comes through Godot APIs or separately installed polyfills.
- Do not claim that untrusted scripts are sandboxed. Application scripts are
  trusted code even when the embedded engine has memory and interrupt limits.
- Keep the legacy GodotJS path working until the stock-Godot replacement passes
  its cutover gates. Remove the legacy path in the same goal after those gates
  pass; do not leave two supported runtimes indefinitely.
- Follow all repository rules in `AGENTS.md`, including no `as any`, no
  self-closing Vue component tags, DRY extraction, README updates, demo updates,
  and GitHub issue synchronization.

## Definition Of Done

The goal is complete only when all of the following are true:

- [ ] `packages/godot-js-runtime` contains the native source, dependency lock,
      build tooling, public TypeScript helper API, installer, package metadata,
      license notices, and standalone README.
- [ ] An official Godot 4.4 editor loads `godot_js_runtime.gdextension` without
      module patches, custom engine builds, or unresolved native dependencies.
- [ ] The current stable official Godot editor does the same.
- [ ] A `.js`, `.mjs`, or `.cjs` file exporting a Godot class can be attached to
      a scene and receives required lifecycle callbacks.
- [ ] The virtual `godot` module exposes the classes, singletons, enums,
      constants, methods, properties, signals, and value types needed by the
      runtime contract and existing Vue Godot packages.
- [ ] Variant conversion, object identity, reference ownership, garbage
      collection, call errors, and signal disconnection pass automated stress
      tests without leaks, stale pointers, or double frees.
- [ ] Both ESM and CommonJS entry modules work, including the relative chunk
      loading produced by the repository's current Vite builds.
- [ ] TypeScript users receive deterministic declarations generated from a
      stock Godot extension API dump, with no GodotJS-generated files required.
- [ ] Source-mapped errors identify the original TypeScript or Vue source when
      a map is available, and ordinary JavaScript errors identify resource path,
      line, column, message, and stack.
- [ ] Editor file changes reload scripts safely and the existing reload smoke
      behavior passes against stock Godot.
- [ ] `apps/js-runtime-demo` proves standalone use and contains no Vue or
      `@vue-godot/*` dependency.
- [ ] `apps/html-demo`, `apps/native-app-demo`, `apps/game-ui-demo`, and all
      smaller fixtures run through the GDExtension using official Godot.
- [ ] The CLI can create and integrate projects, install the extension, generate
      types, diagnose setup, and prepare exports without mentioning a custom
      GodotJS editor.
- [ ] Debug and release artifacts are built and smoke-tested for the required
      desktop, Android, iOS, and Web matrix defined below.
- [ ] Release archives contain checksums, provenance, licenses, the
      `.gdextension` manifest, and only repository-produced binaries.
- [ ] Root build, unit, integration, serious-example, performance, release
      preflight, and stock-Godot smoke gates pass.
- [ ] The old GodotJS setup action, download script, tests, cached paths,
      generated binding templates, CI assumptions, and documentation are
      removed or replaced.
- [ ] Open GitHub issues affected by the migration are closed or updated with
      commit hashes and remaining work, including tracker issues.
- [ ] The implementation and documentation are pushed to `develop`, and the
      progress ledger below records the final commits.

## Progress Ledger

The implementing goal must update this table after each phase. Use `blocked`
only for a demonstrated external blocker; otherwise keep working.

| Phase                                             | Status      | Commit(s) | Verification notes                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------- | ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0. Baseline and contract fixtures                 | Complete    | `107aec5` | Baseline `origin/develop` at `90ac585`; root build, tests, CLI, serious examples, performance, and legacy smoke pass. The focused non-Vue contract passes on the legacy editor and fails on stock 4.4.1 only for the expected missing script loader.                                                                                                                                        |
| 1. Native package and stock-Godot extension shell | Complete    | `5b391fb` | Pinned dependency bootstrap passes from an empty cache; the universal macOS extension passes clean editor load/unload and repeated game startup on official Godot 4.4.1 and 4.7.1; the Linux x86_64 debug extension builds and passes the same official 4.4.1 stock-Godot smoke in Docker. Package tests, the full root check, manifest/package inspection, and private-header checks pass. |
| 2. QuickJS-ng host and module system              | Not started | —         | —                                                                                                                                                                                                                                                                                                                                                                                           |
| 3. Godot binding and Variant bridge               | Not started | —         | —                                                                                                                                                                                                                                                                                                                                                                                           |
| 4. Godot script-language integration              | Not started | —         | —                                                                                                                                                                                                                                                                                                                                                                                           |
| 5. Type generation and editor experience          | Not started | —         | —                                                                                                                                                                                                                                                                                                                                                                                           |
| 6. Standalone installer, CLI, and non-Vue demo    | Not started | —         | —                                                                                                                                                                                                                                                                                                                                                                                           |
| 7. Vue Godot migration and parity                 | Not started | —         | —                                                                                                                                                                                                                                                                                                                                                                                           |
| 8. Platform exports and release artifacts         | Not started | —         | —                                                                                                                                                                                                                                                                                                                                                                                           |
| 9. Legacy cutover and cleanup                     | Not started | —         | —                                                                                                                                                                                                                                                                                                                                                                                           |
| 10. Release hardening and issue audit             | Not started | —         | —                                                                                                                                                                                                                                                                                                                                                                                           |

## Current-State Inventory

Before changing runtime behavior, preserve a machine-readable baseline of the
current working surface. The important coupling points include:

- `scripts/setup-godotjs.mjs` and `.github/actions/setup-godotjs` download a
  custom editor and export templates.
- `.github/workflows/godot-smoke.yml` and `.github/workflows/publish.yml`
  require that custom editor.
- Vite configurations externalize `godot`, and scenes attach `dist/app.js` as a
  `Script` resource. These are desired contracts and should remain stable.
- `packages/runtime-tscn`, `packages/html`, `packages/browser`, and
  `packages/device` import runtime values or types from `godot`.
- CLI creation, integration, doctor, and type generation assume GodotJS binding
  output under `typings/` and, in older fixtures, `.godot/GodotJS`.
- Checked-in `godot*.gen.d.ts`, `jsb.*.d.ts`, and generated Vue component
  declarations encode the current binding shape.
- Documentation and compatibility claims refer to GodotJS behavior and export
  limitations.

Phase 0 must turn this inventory into tests and an allowlisted migration report.
Do not rely on memory or delete old behavior before it is represented by a
replacement test.

## Target Repository Layout

Use this layout unless a build tool imposes a small, documented adjustment:

```text
packages/godot-js-runtime/
├── README.md
├── LICENSE
├── THIRD_PARTY_NOTICES.md
├── package.json
├── tsconfig.json
├── src/                         # JS/TS installer and helper API
│   ├── cli.ts
│   ├── install.ts
│   ├── manifest.ts
│   └── script-metadata.ts
├── native/
│   ├── SConstruct
│   ├── godot_js_runtime.gdextension.in
│   ├── deps.lock.json
│   ├── include/
│   ├── src/
│   │   ├── register_types.cpp
│   │   ├── runtime/
│   │   ├── modules/
│   │   ├── bridge/
│   │   ├── scripting/
│   │   └── editor/
│   ├── tests/
│   └── third_party/             # pinned checkouts or reproducible fetch area
├── addon/
│   └── godot-js-runtime/
│       ├── godot_js_runtime.gdextension
│       ├── runtime-manifest.json
│       └── bin/                 # populated by build/install tooling
├── typings/
│   ├── godot.runtime.d.ts
│   └── godot-js.d.ts
├── scripts/
│   ├── bootstrap-deps.mjs
│   ├── build-native.mjs
│   ├── generate-extension-manifest.mjs
│   ├── generate-types.mjs
│   ├── package-artifacts.mjs
│   └── verify-artifacts.mjs
└── test/
```

Add a standalone fixture at `apps/js-runtime-demo`. Its `package.json` must not
contain `vue`, `@vue/*`, or `@vue-godot/*`. It should use TypeScript and a simple
bundler configuration so the documented development path matches real users.

## Runtime And API Decisions

### Embedded engine

- Pin a stable QuickJS-ng commit in `native/deps.lock.json`, including upstream
  URL, commit, archive checksum, license, and the date it was reviewed.
- Pin a compatible `godot-cpp` release/commit capable of targeting the Godot 4.4
  extension API in the same file.
- Bootstrap dependencies into a repository cache ignored by Git, or use pinned
  submodules. The build must fail on checksum or commit mismatch.
- Compile QuickJS-ng into the extension so end users do not install a separate
  shared library.
- Use C++17 unless a pinned dependency demonstrably requires a newer standard.
- Create one main-thread runtime per Godot process and one context/module cache
  per project execution environment. Any future worker owns a separate runtime;
  sharing a QuickJS runtime across Godot threads is forbidden.
- Expose project settings for memory limit, maximum stack size, interrupt
  interval, and optional execution timeout. Defaults must be safe for normal
  Vue applications and documented.
- Pump pending jobs at deterministic Godot lifecycle points so Promises settle
  without a busy loop. A runaway job queue must not freeze editor shutdown.

### Public JavaScript modules

The runtime must provide these virtual modules:

- `godot`: generated Godot classes, singletons, enums, constants, utility value
  classes, `Callable`, signal access, and runtime type guards.
- `godot-js`: runtime metadata helpers, version information, feature detection,
  and script definition helpers owned by this project.
- `godot-jsb`: a documented compatibility module only for the subset required
  by current repository fixtures and migration. Do not claim complete GodotJS
  compatibility unless a dedicated compatibility suite proves it.

The minimum plain TypeScript experience is:

```ts
import { Input, Node2D, Vector2 } from 'godot'

export default class Player extends Node2D {
  speed = 240

  _process(delta: number): void {
    const direction = Input.get_vector(
      'ui_left',
      'ui_right',
      'ui_up',
      'ui_down',
    )
    const distance = this.speed * delta
    this.position = new Vector2(
      this.position.x + direction.x * distance,
      this.position.y + direction.y * distance,
    )
  }
}
```

A default-exported class works without runtime-specific metadata. Provide
`defineScript()` from `godot-js` for inspector properties, signals, tool mode,
RPC metadata, and methods that need explicit Godot reflection:

```ts
import { Node2D } from 'godot'
import { defineScript } from 'godot-js'

class Player extends Node2D {
  speed = 240
}

export default defineScript(Player, {
  properties: {
    speed: { type: 'float', default: 240, hint: { range: [0, 1000, 1] } },
  },
  signals: {
    moved: [{ name: 'distance', type: 'float' }],
  },
})
```

Decorator sugar may be layered over `defineScript`, but it must not be the only
way to describe scripts because TypeScript decorator modes differ. The metadata
object is the canonical, testable representation.

### Module loading

- Support ESM in `.mjs` and ESM-selected `.js` projects.
- Support CommonJS in `.cjs` and the existing Vite CommonJS application bundle.
- Detect the entry format deterministically from extension, package/runtime
  manifest, and generated bundle metadata; do not guess differently between
  editor and export builds.
- Resolve `res://` paths, relative imports, index files, explicit extensions,
  JSON modules, and Vite-generated relative chunks.
- Canonicalize paths before cache lookup and reject traversal outside `res://`
  unless a documented `user://` loader explicitly permits it.
- Require applications to bundle third-party npm dependencies for the first
  release. General Node-style `node_modules` traversal and Node core modules are
  not part of v1.
- Preserve circular dependency semantics appropriate to each module format.
- Include resource path and importer chain in resolution failures.
- Load source maps beside emitted files and remap stack frames where possible.
- Ensure release exports include JavaScript, chunks, JSON, and source maps only
  according to documented export settings. Source maps may be excluded from
  production by user choice without breaking execution.

### Godot binding contract

Generate bindings from the stock Godot extension API rather than hand-writing
each class. Keep handwritten code only for conversion primitives, ownership,
dynamic invocation, module construction, and documented special cases.

Required behavior includes:

- constructors for instantiable Godot classes;
- inheritance and `instanceof` across Godot class hierarchies;
- engine singletons and utility functions;
- instance, static, vararg, and virtual method calls;
- snake_case API names matching Godot and current source;
- property get/set, indexed and keyed access, and read-only enforcement;
- enums, bitfields, integer constants, default arguments, and method overload
  dispatch where the extension API exposes them;
- signals with connect, disconnect, one-shot/reference-counted flags, emission,
  and JavaScript callback lifetime management;
- `Callable.create`, callable construction, invocation, identity, and cleanup;
- class and singleton discovery through `ClassDB`;
- stable JavaScript wrapper identity for the same live Godot object;
- explicit invalid-object detection after Godot frees an object;
- correct `RefCounted` ownership without leaked or prematurely freed resources;
- errors that include class, method/property, argument index, expected type,
  received value, and Godot call error information.

### Variant conversion contract

Implement and test conversion for every Variant type exposed by the Godot 4.4
extension API. At minimum, settle the following representations:

| Godot value                                             | JavaScript representation                                           |
| ------------------------------------------------------- | ------------------------------------------------------------------- |
| `NIL`                                                   | `null`; accept `undefined` as `NIL` input                           |
| `bool`, `float`, safe `int`                             | `boolean` or `number`                                               |
| 64-bit `int` outside the safe number range              | `bigint`; accept integral `number` or `bigint` input                |
| `String`                                                | JavaScript string with correct UTF-8/UTF-16 conversion              |
| `StringName`, `NodePath`                                | immutable branded wrapper with string conversion                    |
| vectors, rects, transforms, planes, quaternions, colors | constructible value wrappers with generated fields and methods      |
| `Array`, `Dictionary`                                   | identity-preserving proxy/wrapper, not an unsafe borrowed pointer   |
| packed arrays                                           | typed-array-compatible copy/view API with documented ownership      |
| `Object` and `RefCounted`                               | cached wrapper with validity and ownership tracking                 |
| `Callable`, `Signal`                                    | runtime wrapper retaining callbacks only while connected/referenced |
| RID                                                     | opaque branded wrapper                                              |

Round-trip, nested-container, large-integer, Unicode, exception, invalid-object,
and garbage-collection tests are required. If a zero-copy view can outlive its
Godot storage, use a copy instead of exposing dangling memory.

### Script-language integration

Implement the language using Godot's public `ScriptLanguageExtension`,
`ScriptExtension`, resource-loader/saver APIs, and GDExtension script-instance
interface. The implementing agent must verify exact Godot 4.4 signatures from
the pinned extension API and `godot-cpp`; this document intentionally names the
contracts rather than freezing generated C++ signatures.

Required behavior:

- register early enough that a main scene can resolve an attached JavaScript
  script during project startup;
- register and unregister the language through the public Godot `Engine`
  script-language methods rather than calling private `ScriptServer` APIs;
- recognize `.js`, `.mjs`, and `.cjs` as scripts without claiming `.ts` files;
- parse/evaluate the module and validate its default export;
- determine the Godot base class and reject incompatible scene attachments;
- create, destroy, and reload script instances;
- dispatch Godot virtual callbacks such as `_ready`, `_process`, `_input`, and
  `_exit_tree` into JavaScript;
- expose reflected methods, properties, signals, defaults, RPC configuration,
  and tool mode from canonical script metadata;
- support placeholder instances and inspector state needed by editor scenes;
- propagate notifications and pre-delete events without calling dead wrappers;
- make script errors visible in Godot's debugger/output with source locations;
- support a hard reload first, then preserve compatible property state during
  soft reload; never retain functions or wrappers from the destroyed context;
- shut down cleanly during game stop, project reload, editor exit, and extension
  unload.

The initialization-level spike in Phase 1 must prove that the extension can
register the language before scene resource loading using public APIs. Use the
lowest necessary initialization level and split editor-only registration into
the editor level.

## Required Platform Matrix

The first complete release supports these artifacts:

| Target                    | Architectures/forms                                         | Required validation                                                              |
| ------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------- |
| macOS editor and export   | universal arm64 + x86_64 framework/dylib                    | editor smoke and exported app on arm64; binary architecture inspection for both  |
| Windows editor and export | x86_64 DLL                                                  | editor smoke and exported app                                                    |
| Linux editor and export   | x86_64 shared library                                       | headless/editor smoke and exported app                                           |
| Android export            | arm64-v8a and x86_64                                        | export succeeds; arm64 device/emulator launch; ABI inspection for both           |
| iOS export                | arm64 device plus arm64/x86_64 simulator XCFramework slices | Xcode export/link succeeds; simulator or device launch where CI/hardware permits |
| Web export                | wasm32 GDExtension with QuickJS-ng                          | browser smoke using the supported Godot extension-export mode                    |

Windows arm64, Linux arm64, Android arm32, console platforms, and the Godot Web
editor are not release blockers for v1. They must be listed accurately as
unsupported rather than implied by generic platform language.

Use debug artifacts for editor/development and optimized release artifacts for
exports. The `.gdextension` feature tags must select the correct artifact and
must not silently fall back to an incompatible library.

## Distribution Contract

- Publish source and JavaScript helper/types through `godot-js-runtime`.
- Publish versioned native add-on archives as release artifacts owned by this
  repository. Split by platform when necessary to stay within registry and
  release size limits.
- Generate a signed or checksummed `runtime-manifest.json` containing runtime
  version, Git commit, Godot minimum, QuickJS-ng commit, `godot-cpp` commit,
  target tags, artifact URLs/names, sizes, and SHA-256 hashes.
- The installer selects host editor artifacts and requested export targets,
  verifies hashes, and copies them under
  `res://addons/godot-js-runtime/bin`. It must be idempotent and support an
  offline artifact directory.
- Generated projects pin a runtime version. Do not download an unpinned latest
  artifact during build or export.
- `vue-godot create` and `vue-godot integrate` may invoke or wrap the standalone
  installer, but the standalone installer cannot invoke the Vue Godot CLI.
- Provide uninstall and verification commands. Uninstall may remove only files
  recorded in the installed runtime manifest and must preserve user files.
- Include QuickJS-ng, `godot-cpp`, adapted-source, and other required notices in
  every source and binary archive.
- Perform dependency inspection (`otool`, `dumpbin`/equivalent, `ldd`/`readelf`,
  `wasm-objdump`, and XCFramework metadata) so releases do not depend on a
  custom Godot binary or unshipped native library.

## Implementation Phases

Each phase ends with tests and a coherent commit. Do not combine all work into
one unreviewable commit. A failing phase remains in progress.

### Phase 0 — Baseline and contract fixtures

Deliverables:

1. Record the latest `origin/develop` commit and run the existing root build,
   tests, CLI smoke, serious-example checks, performance checks, and GodotJS
   smoke where available.
2. Add a machine-readable inventory of all GodotJS-dependent files and classify
   each as preserve, replace, or remove.
3. Add compatibility fixtures for the currently used `godot` surface: class
   construction, `ClassDB`, properties, signals, `Callable`, resource loading,
   OS/environment access, timing, networking, media-related types, and scene
   script lifecycle.
4. Capture the Vite CommonJS output/chunk behavior that the new loader must run.
5. Add the progress ledger and decision log updates for any baseline deviation.

Gate:

- Existing checks pass or each pre-existing failure is recorded with command,
  output summary, and why it is unrelated.
- Every legacy dependency discovered by `rg` has a planned destination.
- The fixtures fail for a missing runtime for the expected reason and pass with
  the current baseline, proving they can measure the migration.

### Phase 1 — Native package and stock-Godot extension shell

Deliverables:

1. Create the package layout, native build, pinned dependency bootstrap,
   third-party notices, package scripts, and generated `.gdextension` manifest.
2. Register a minimal runtime information object/class through GDExtension.
3. Add a stock-Godot fixture that loads the extension headlessly and verifies
   runtime version and initialization/shutdown events.
4. Prove the initialization level can register JavaScript script resources
   before a main scene containing one is loaded. A temporary minimal loader is
   acceptable for this spike.
5. Add CI for the Linux debug native build and stock Godot 4.4 smoke.

Gate:

- The extension loads in unmodified Godot 4.4 and current stable Godot.
- Dependency bootstrap is reproducible from an empty cache.
- A clean unload does not crash or leave a registered language/object behind.
- No source includes private Godot engine headers.

### Phase 2 — QuickJS-ng host and module system

Deliverables:

1. Implement runtime/context creation, allocator limits, interrupt handler,
   exception conversion, job pumping, and deterministic teardown.
2. Implement resource-backed ESM and CommonJS loading, `res://`/relative path
   resolution, JSON, module cache, circular dependencies, and Vite chunks.
3. Add `godot-js` runtime version/feature functions before the full binding.
4. Implement console output routed through Godot with level and source context.
5. Add source-map parsing and stack remapping with graceful fallback.

Gate:

- Native tests cover evaluation, exceptions, Promises, limits, ESM, CommonJS,
  JSON, cycles, cache behavior, bad paths, chunks, source maps, and teardown.
- A stock-Godot fixture evaluates a resource module and drains Promise jobs.
- Repeated start/stop and editor play/stop loops do not grow runtime instances.

### Phase 3 — Godot binding and Variant bridge

Deliverables:

1. Generate binding metadata/code from the pinned Godot 4.4 extension API.
2. Implement the `godot` virtual module and all conversion/ownership contracts
   above.
3. Add special handling only where generated dispatch is insufficient, with a
   documented reason and test for each exception.
4. Add wrapper registries, invalidation hooks, ref ownership, callback roots,
   and shutdown ordering.
5. Add structured call errors and JavaScript/Godot exception boundaries.

Gate:

- Generated output is deterministic and a regeneration produces no diff.
- Every Variant type has round-trip coverage.
- Binding fixtures cover the exact imports used across all existing packages.
- Stress tests repeatedly allocate/free nodes, resources, containers,
  callables, and signals under forced JS garbage collection.
- Sanitizer-enabled native tests pass on at least Linux; macOS sanitizer runs
  are added where supported.

### Phase 4 — Godot script-language integration

Deliverables:

1. Implement language, script resource, loader/saver, placeholder, and script
   instance contracts.
2. Support default class exports, base-class validation, virtual dispatch,
   reflected metadata, signals, properties, defaults, RPC metadata, and tool
   scripts.
3. Implement hard and state-preserving soft reload paths.
4. Handle project/game/editor teardown and pre-delete notifications safely.
5. Add a minimal attached-script scene with no Vue dependency.

Gate:

- Stock Godot opens, runs, reloads, stops, and reopens the fixture repeatedly.
- Scene serialization retains script and exported property values.
- Invalid exports and incompatible base classes produce actionable errors rather
  than crashes or generic loader failures.
- Lifecycle, notification, signal, callable, property, and reload suites pass.

### Phase 5 — Type generation and editor experience

Deliverables:

1. Generate `godot` declarations from `godot --dump-extension-api` or the pinned
   equivalent, including classes, inheritance, methods, properties, signals,
   enums, bitfields, constants, value types, singletons, and documentation where
   legally and technically available.
2. Generate `godot-js` helper declarations and the required `godot-jsb`
   compatibility declarations.
3. Adapt Vue `GlobalComponents` generation to consume the new declarations.
4. Add editor language metadata, validation, external-editor integration,
   script templates, file recognition, error reporting, and reload monitoring.
5. Replace `.godot/GodotJS` output assumptions with neutral `.godot` cache
   paths and `noEmit`/bundler output where appropriate.

Gate:

- Generation from stock Godot works without opening a custom editor.
- `npm run gen:types` is deterministic and current Vue SFC type checks pass.
- A plain TypeScript fixture receives autocomplete-compatible declarations for
  the `godot` and `godot-js` modules.
- Editor diagnostics and source-mapped runtime errors identify the right file
  and line.

### Phase 6 — Standalone installer, CLI, and non-Vue demo

Deliverables:

1. Implement standalone install, uninstall, verify, add-target, and typegen
   commands in `godot-js-runtime`.
2. Create `apps/js-runtime-demo` with movement/input, lifecycle, exported
   inspector property, signal/callable usage, resource loading, Promise job, and
   an automated success marker.
3. Document installation into a new or existing stock Godot project, JS usage,
   TypeScript build/watch, export targets, troubleshooting, security model, and
   unsupported Node/browser APIs.
4. Add package/public-surface tests proving no Vue dependency is present.

Gate:

- Starting from an empty Godot project, the documented commands install the
  runtime, generate types, build TypeScript, and launch the demo.
- The demo dependency graph contains no Vue package.
- Uninstall removes only manifest-owned files, and reinstall is idempotent.
- The standalone package can build and test without building Vue packages.

### Phase 7 — Vue Godot migration and parity

Deliverables:

1. Make `vue-godot create` and `integrate` install/configure the standalone
   runtime while preserving the standalone dependency direction.
2. Update CLI doctor, type generation, templates, `.gitignore`, `tsconfig`,
   Vite output, production guidance, and export checks.
3. Run all existing packages and apps against the new `godot` module.
4. Update `apps/html-demo` for any binding-visible API differences while
   preserving public Vue Godot behavior.
5. Port Godot smoke, generated-project smoke, editor reload smoke, performance
   benchmarks, and release preflight to official Godot.
6. Maintain a temporary opt-in legacy job only until every parity gate passes.

Gate:

- All current app bundles build without changing their `godot` imports.
- All existing unit, CLI, app, lifecycle, renderer stress, and stock-Godot smoke
  tests pass.
- Serious demos run through official Godot in editor/headless mode as
  applicable.
- Performance and memory remain within existing budgets or a documented,
  justified budget update is approved by measured evidence.
- The standalone demo still passes, proving Vue integration did not leak into
  the runtime.

### Phase 8 — Platform exports and release artifacts

Deliverables:

1. Add build workflows for the full required platform matrix.
2. Produce debug/editor and optimized export artifacts with correct feature
   tags, checksums, manifests, and notices.
3. Install official export templates and export a runtime smoke project plus a
   representative Vue app for every target.
4. Launch exported applications wherever CI runners/emulators/browsers allow;
   inspect all other artifacts structurally and document the remaining manual
   device gate.
5. Add release-package dry runs and clean-machine installation tests.

Gate:

- Desktop exported apps launch and report the expected runtime/Godot versions.
- Android arm64 launches and both required ABIs are present.
- iOS export links all required slices; simulator/device launch evidence is
  recorded. Missing signing credentials may not block unsigned simulator/link
  validation.
- Web export launches in an automated browser with GDExtension support enabled.
- Artifact verification finds no custom GodotJS or missing third-party shared
  library dependency.
- A release archive installed into a clean checkout passes the same smoke test
  as an in-tree build.

### Phase 9 — Legacy cutover and cleanup

Only begin removal after Phases 1–8 are green.

Deliverables:

1. Delete `.github/actions/setup-godotjs`, `scripts/setup-godotjs.mjs`, its
   tests, old cache handling, and GodotJS-specific export-template assembly.
2. Replace the root `setup:godotjs` command with a stock-Godot setup command and
   standalone runtime build/install commands.
3. Remove checked-in GodotJS editor/runtime declaration bundles and regenerate
   neutral binding/type templates from stock Godot.
4. Remove `.godot/GodotJS` paths and GodotJS-specific ignore comments.
5. Update all package READMEs, root README, compatibility matrix, runtime,
   migration, troubleshooting, permissions, platform docs, demo docs, and
   generated production docs.
6. Rename CI steps/workflows and ensure cold-cache CI downloads only official
   Godot plus repository-owned runtime artifacts.
7. Add a final dependency scan allowlist. Historical references are allowed
   only in this plan, migration notes, license/provenance notices, or explicit
   compatibility documentation.

Gate:

- A clean `rg` scan finds no active GodotJS setup, binary, cache, typegen,
  editor, export-template, or runtime dependency.
- A clean clone with empty caches passes install, build, tests, stock-Godot
  smoke, generated project smoke, and release preflight.
- No documentation tells users to download or open a GodotJS editor.
- The standalone and Vue demos both work using only official Godot and the new
  extension.

### Phase 10 — Release hardening and issue audit

Deliverables:

1. Run the complete verification matrix twice: once from the implementation
   worktree and once from clean packaged artifacts.
2. Audit licenses, notices, source offers where applicable, checksums,
   reproducibility metadata, public exports, and npm package contents.
3. Scan all open GitHub issues for items resolved, advanced, invalidated,
   duplicated, or tracked by the migration. Close/update them using the
   repository's required commit-hash format and update tracker checklists.
4. Update the progress ledger, compatibility matrix, roadmap, and decision log
   with final facts rather than intended behavior.
5. Synchronize safely with the latest `origin/develop`, rerun affected gates,
   push the commits to `develop`, and verify the remote branch contains them.

Gate:

- Root `npm run check` and every new native/platform gate pass from committed
  state.
- Package dry-run contents match the documented public surface.
- Remote `develop` contains the final commits and CI is green.
- No required work remains in the goal or hidden behind an undocumented TODO.

## Root Commands To Provide

The implementation should converge on these stable commands, with exact
internal scripts free to evolve:

```text
npm run setup:godot                 # install/resolve official stock Godot
npm run build:godot-js-runtime      # build host debug extension
npm run test:godot-js-runtime       # native + JS unit tests
npm run smoke:godot-js-runtime      # standalone stock-Godot smoke
npm run package:godot-js-runtime    # create verified host/release artifacts
npm run smoke:godot                 # Vue Godot smoke on stock Godot
npm run smoke:generated-godot       # generated project on stock Godot
npm run smoke:editor-reload         # editor reload through the GDExtension
npm run check                       # full repository quality gate
```

Every setup command must accept an explicit `GODOT_BIN` override and support a
print-only mode suitable for CI. Avoid implicit global installs.

## Test Strategy

Use four layers so failures identify the broken boundary:

1. **Native unit tests** for QuickJS ownership, module resolution, conversion,
   generated dispatch, and failure paths without launching the editor where
   practical.
2. **Stock-Godot runtime fixtures** for extension loading, attached scripts,
   ClassDB calls, signals, lifecycle, reload, serialization, and shutdown.
3. **Standalone application smoke** for the complete non-Vue user journey.
4. **Vue Godot application smoke** for renderer, HTML components, browser
   polyfills, device wrappers, serious demos, generated projects, editor reload,
   and exports.

Required stress scenarios include:

- at least 100 play/stop or runtime create/destroy cycles;
- forced QuickJS garbage collection with live and disconnected signals;
- thousands of nodes created, inserted, removed, queued for deletion, and
  wrapped again;
- rejected method/property calls and JavaScript exceptions crossing both
  directions;
- deep/nested Variant arrays and dictionaries;
- 64-bit integer boundaries and non-ASCII strings;
- Promise chains during scene teardown;
- reload while instances, resources, callables, and timers exist;
- clean editor and exported-game shutdown;
- cold dependency/artifact cache installation;
- paths containing spaces and platform-native separators.

Do not hide native crashes behind retry logic. Preserve crash logs and make the
test fail.

## Performance Budgets

Measure and record at least:

- extension/editor cold-load time;
- first JavaScript context and first module evaluation time;
- binding-generation time and output size;
- per-call overhead for representative property, method, and signal paths;
- Vue HTML demo mount/unmount time;
- idle memory, post-demo memory, and memory after forced GC/unmount;
- release binary and packaged artifact sizes.

The migration must not silently weaken existing performance checks. If
QuickJS-ng creates a materially different baseline, update budgets only with
before/after measurements, an explanation, and a decision-log entry. Optimize
correct ownership and batching before adding a second JavaScript engine.

## Security And Reliability Requirements

- Treat loaded project JavaScript as trusted application code.
- Reject module traversal outside allowed Godot resource roots.
- Bound runtime memory/stack and expose an interrupt mechanism for runaway code.
- Do not expose arbitrary host filesystem, environment mutation, process spawn,
  sockets, dynamic native library loading, or `eval`-like Godot editor powers
  beyond what the documented Godot API already permits.
- Validate downloaded runtime artifacts by SHA-256 before extraction.
- Protect extraction from absolute paths, `..` traversal, and symlink escapes.
- Never log tokens, signing material, or environment secrets in CI diagnostics.
- Fail safely when a Godot object has been freed or the runtime is shutting
  down.
- Make callback roots and signal connections observable in debug diagnostics so
  leaks can be traced.

## Documentation Requirements

The completed implementation must clearly distinguish:

- Godot JavaScript Runtime: standalone scripting runtime and `godot` binding;
- Vue Godot runtime renderer: optional Vue consumer;
- `@vue-godot/html`, `browser`, and `device`: optional higher-level packages;
- stock Godot version support versus runtime artifact version support;
- editor support versus exported-platform support;
- JavaScript execution versus ahead-of-time TypeScript compilation;
- supported ECMAScript/module APIs versus unavailable Node/browser APIs;
- verified platforms versus untested or unsupported platforms.

The standalone README must show plain JavaScript first and Vue only in an
optional integration section. Vue package READMEs may depend on the standalone
runtime, but the standalone README must not send non-Vue users through the Vue
CLI for basic setup.

## Cutover Search Checklist

At Phase 9, search at least these patterns across source, templates, tests,
workflows, and docs:

```text
GodotJS
godotjs
GODOTJS
ialex32x
GodotJS-Build
setup:godotjs
.cache/godotjs
.godot/GodotJS
jsb.editor.bundle
jsb.runtime.bundle
```

Classify every remaining result. Only historical migration context,
compatibility shims, and properly attributed source/license notices may remain.

## Decision Log

The implementing goal must append entries here when evidence forces a change.
Each entry needs the date, phase, decision, evidence, alternatives considered,
compatibility effect, and commit hash.

| Date       | Phase | Decision and evidence                                                                                                                                                                                                                                                                                                                                                                                                                    | Compatibility effect                                                                                                                                                          | Commit    |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 2026-08-10 | 1     | Register the temporary `ResourceFormatLoader` probe only for game runs. Registering the provisional loader in a Godot 4.7.1 editor session caused a reproducible clean-exit crash, while loading the extension and runtime-info class without that temporary loader initialized and terminated cleanly on 4.4.1 and 4.7.1. Keeping the crashing editor registration or treating the probe as the final script integration were rejected. | No public API change. Phase 1 still proves pre-main-scene JavaScript resource recognition in stock game startup; full editor registration remains an explicit Phase 4/5 gate. | `5b391fb` |

## Primary Technical References

- [Godot GDExtension overview](https://docs.godotengine.org/en/stable/tutorials/scripting/gdextension/what_is_gdextension.html)
- [Godot GDExtension C example](https://docs.godotengine.org/en/latest/engine_details/engine_api/gdextension/gdextension_c_example.html)
- [Godot `ScriptLanguageExtension`](https://docs.godotengine.org/en/stable/classes/class_scriptlanguageextension.html)
- [Godot `ScriptExtension`](https://docs.godotengine.org/en/stable/classes/class_scriptextension.html)
- [`godot-cpp` GDExtension bindings](https://github.com/godotengine/godot-cpp)
- [QuickJS-ng](https://github.com/quickjs-ng/quickjs)
- [GodotJS source, for migration research and attributed compatibility reference only](https://github.com/godotjs/GodotJS)
- [GodotJS GDExtension build discussion](https://github.com/godotjs/GodotJS/issues/170)
