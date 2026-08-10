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

| Phase                                             | Status      | Commit(s)                                             | Verification notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------- | ----------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0. Baseline and contract fixtures                 | Complete    | `107aec5`                                             | Baseline `origin/develop` at `90ac585`; root build, tests, CLI, serious examples, performance, and legacy smoke pass. The focused non-Vue contract passes on the legacy editor and fails on stock 4.4.1 only for the expected missing script loader.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 1. Native package and stock-Godot extension shell | Complete    | `5b391fb`                                             | Pinned dependency bootstrap passes from an empty cache; the universal macOS extension passes clean editor load/unload and repeated game startup on official Godot 4.4.1 and 4.7.1; the Linux x86_64 debug extension builds and passes the same official 4.4.1 stock-Godot smoke in Docker. Package tests, the full root check, manifest/package inspection, and private-header checks pass.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 2. QuickJS-ng host and module system              | Complete    | `b6a1e8f`                                             | QuickJS-ng native tests pass all seven eval, exception, Promise/limit, ESM, CommonJS, JSON, cycle/cache, Vite-chunk, source-map, and 128-cycle teardown groups with abort-on-leak enabled on universal macOS and Linux x86_64. Official Godot 4.4.1 and 4.7.1 macOS plus 4.4.1 Linux pass resource-module evaluation, balanced runtime teardown, and three real editor play/stop cycles; package inspection, binary checks, and the full root check pass.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 3. Godot binding and Variant bridge               | Complete    | `509910f`, `4e648ea`                                  | Deterministic generation covers 952 classes, 38 built-ins, 37 singletons, 114 utilities, and 1,120 exports from the pinned API. ESM/CommonJS stock fixtures cover all 39 Variant types, inheritance, static/instance/virtual dispatch, overloads, properties, signals, callback exceptions/teardown, identity, invalid objects, 2,048 nodes, 256 ownership cycles, and forced GC. Official Godot 4.4.1 and 4.7.1 macOS plus 4.4.1 Linux pass 21/51 balanced runtime cycles and three editor play/stop cycles. Seven native test groups pass on macOS/Linux; Linux ASan+UBSan+LSan and macOS ASan+UBSan native runs pass, and the complete Linux bridge passes under UBSan. Package tests, deterministic regeneration, public-header scans, and the full root check pass.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 4. Godot script-language integration              | Complete    | `0fc990b`                                             | Public `ScriptLanguageExtension`, `ScriptExtension`, loader, saver, placeholder, and `GDExtensionScriptInstanceInfo3` contracts support attachable `.js`, `.mjs`, and `.cjs` classes, reflected methods/properties/signals/RPC/tool metadata, serialization, project limits, virtual callbacks, and hard/compatible-state soft reload. Official Godot 4.4.1 and 4.7.1 macOS plus 4.4.1 Linux pass 7/10 clean extension cycles, 17/20 balanced project-runtime cycles, three editor play/stop cycles, actionable rejection cases, and repeated disk/in-memory/deferred reload and pre-delete cleanup. Fifteen package tests, seven native groups on macOS/Linux, Linux ASan+UBSan+LSan, the live Linux suite under UBSan, deterministic generation, and the full root check pass.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 5. Type generation and editor experience          | Complete    | `ebcbb4b`                                             | Deterministic declarations generated from the pinned official 4.4.1 API cover 952 classes, 38 built-ins, 37 singletons, 114 utilities, global enums, native structures, `godot-js`, and the deliberately limited `godot-jsb`; live generation from official 4.4.1 and 4.7.1 is byte-repeatable. Strict plain-TypeScript and Vue SFC checks pass with `skipLibCheck: false`/`noEmit`, and CLI `GlobalComponents` generation consumes the standalone declaration. Compile-only diagnostics, templates, extension recognition, external-editor fallback, saved-file monitoring, `Signal.as_promise()`, debugger state, and source-map remapping pass in stock fixtures. Official 4.4.1/4.7.1 macOS and 4.4.1 Linux pass 7/10 clean extension cycles, 18/21 balanced runtime cycles, and three editor cycles. Seven native groups pass on macOS/Linux, both native sanitizer suites and the live Linux UBSan suite pass, and 18 package tests, the full root check, Vue type check, and package dry run pass.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 6. Standalone installer, CLI, and non-Vue demo    | Complete    | `014b839`                                             | Manifest-owned install, add-target, verify, typegen, and uninstall commands validate SHA-256, reject traversal/symlinks/unowned collisions, preserve unrelated files and extension registrations, and produce a byte-stable reinstall manifest. Starting from empty stock projects in paths containing spaces, the non-Vue TypeScript demo installs five runtime files, generates declarations, builds with strict checking/source maps, exercises lifecycle/input/native-property movement/resource/signal/Callable/Promise behavior, emits exactly one success marker, verifies, reinstalls deterministically, and uninstalls without removing a sentinel. The journey passes official macOS Godot 4.4.1 and 4.7.1 plus Linux 4.4.1. Twenty-nine package tests, the independent demo build, strict Vue type check, package dry run, full root check, seven native groups on macOS/Linux, 7/10 clean stock extension cycles, 18/21 balanced project-runtime cycles, three editor cycles, and the live Linux bridge under UBSan pass. Public-surface tests prove neither the package nor demo depends on Vue.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 7. Vue Godot migration and parity                 | Complete    | `f82f06a`                                             | All eight checked-in Vue apps and every `create`/`integrate` profile install and verify the standalone runtime, generate stock-Godot declarations, preserve existing `godot` imports, and emit explicitly marked CommonJS bundles. CLI doctor, templates, production guidance, public-surface auditing, package metadata, CI, and release preflight now use official Godot; the legacy path remains only as a manual parity control. Official macOS Godot 4.4.1 and 4.7.1 pass the standalone demo, serious HTML/native/game demos, fresh packed-project smoke, and editor-observed transitive Vite-chunk reload. The formatted tree passes the 16-package build, all package/root tests (including 244 HTML, 31 runtime, 24 renderer, 21 CLI, and 68 root tests), strict Vue SFC checking, all CLI profiles, serious-example checks, eight deterministic performance budgets, and live official-Godot performance with zero callback roots, stable wrapper count, 6,064 QuickJS retained bytes, and 638,504 static retained bytes. The local release preflight passes package dry runs, audit, stock/standalone/generated/editor smokes, and registry checks. Linux x86_64 independently passes all 31 runtime package tests, seven native groups, ASan+UBSan+LSan, and official 4.4.1 stock smoke with 10 clean unloads, 21 balanced project-runtime cycles, and three editor cycles.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 8. Platform exports and release artifacts         | Complete    | `3b8f164`                                             | The canonical release matrix contains 14 debug/release targets, 20 payloads, and six deterministic platform archives covering macOS universal, Windows x64, Linux x64, Android arm64-v8a/x86_64, iOS device/simulator XCFramework slices, and threaded Web wasm32. The schema-v2 manifest records exact artifact/archive hashes, sizes, URLs, provenance, dependencies, licenses, and minimum Godot; the verifier checks binary architecture, symbols, packaged ownership, and release integrity. In-tree and clean packaged installs each complete 24 exports (two apps × debug/release × six platforms): 20 launch markers plus four unsigned iOS device/simulator link gates where signing or matching simulator hardware is unavailable. Evidence hashes are `894031bfe863ed1876e3a23b1c420b9b6ecb4a8ef45d85052e5c34f687ba9345` and `3d318d6e83d2e4ef204a4ed03cefb6b30de63b62ceb03a5ec2d427acd4f55536`; final Web reruns after fatal browser-diagnostic handling are `3ce24834bd323146502f8c9675cb3b73ca53cdcd543f0a99c3705b6369a6cafa` and `7f7dca26e1c166be1ba8d1692ed84a43993a6833ec868c85f76d079671028731`. Both installs verify all targets, Android launches arm64 and inspects both ABIs, and the Web gate proves a cross-origin-isolated worker in Chrome. Release packaging is byte-reproducible and offline-installable; 40 package tests, the 16-package root check, actionlint, manifest verification, and the official-Godot local release preflight pass.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 9. Legacy cutover and cleanup                     | Complete    | `a96a968`, `e2ff667`, `e2fc7cb`, `8eb4cf1`, `78c89f3` | The custom-editor setup action, downloader, workflow, cached paths, checked-in generated bundles, runtime fallbacks, and user-facing custom-editor instructions are removed after the Phase 8 replacement gates passed. All source packages now type-check against the standalone stock-Godot declarations, and a machine-checked cutover allowlist permits only the historical execution contract and a negative regression test. From an isolated clone at `78c89f3` with empty npm and Godot caches, `npm ci`, the 16-package build, all package tests plus 61 root tests, official Godot 4.4.1 stock smoke (seven clean unloads, 18 balanced project cycles, and three editor cycles), generated standalone/Vue projects, live editor chunk reload, package dry runs, zero-vulnerability audit, and the complete release preflight pass. The canonical release manifest remains byte-identical with 20 payloads and six archives after host builds and every clean-room smoke. Documentation, demos, templates, CI, package launchers, and release tooling now describe and exercise only official Godot plus the standalone extension.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 10. Release hardening and issue audit             | In progress | `1d477fe`, `5434ba8`, `098717b`, `6313c13`            | From committed state, the complete in-tree and clean packaged matrices each pass 24 exports: 20 automated launches and four explicit unsigned iOS device/simulator link gates. Evidence hashes are `f8c1bde71a602252c8e262f4e5ad2204dab6bd49c76f28737c54f72ff2780103` and `d7334ac55f48e2119fe649ca12f73884917d97e2bc1e4fc4139d76dd5369d5dc`. All 14 targets/20 payloads pass architecture, symbols, shared-dependency, manifest, checksum, provenance, license/notice, and legacy-identity verification; two independent repackagings reproduce all six release archives and metadata byte-for-byte. The 16-package root build, all package suites, 61 root tests, CLI creation/integration, serious examples, eight deterministic budgets, live official-Godot performance, and the complete local release preflight pass. GitHub app and CLI audits find zero open issues or tracker checklists. The synchronized `develop` runs exposed clean-runner assumptions that the local matrices could not: `5434ba8` provisions Android tools explicitly, while `098717b` runs the pinned SCons wheel without `pip`/`venv`, selects the POSIX MinGW thread model, completes the binding header's standard-library includes, and supports current-Godot typed dictionaries and opaque callback pointers. Exact pinned Web, Linux GCC, and Windows MinGW container builds now pass debug/release; standalone smoke passes official Godot 4.7.1; 44 runtime tests and the complete official-Godot 4.4.1 root check pass with the canonical release-manifest checksum preserved. The committed release preflight passes. A clean Check run then exposed concurrent dependency-package rebuilds; `6313c13` makes Turbo finish dependency tests before dependents import their generated output, and a forced run from empty browser/device `dist` directories passes all package suites plus 62 root tests. The corrected hosted CI rerun and final completion ledger remain. |

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

| Date       | Phase | Decision and evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Compatibility effect                                                                                                                                                                                                              | Commit    |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 2026-08-10 | 1     | Register the temporary `ResourceFormatLoader` probe only for game runs. Registering the provisional loader in a Godot 4.7.1 editor session caused a reproducible clean-exit crash, while loading the extension and runtime-info class without that temporary loader initialized and terminated cleanly on 4.4.1 and 4.7.1. Keeping the crashing editor registration or treating the probe as the final script integration were rejected.                                                                                                                                                             | No public API change. Phase 1 still proves pre-main-scene JavaScript resource recognition in stock game startup; full editor registration remains an explicit Phase 4/5 gate.                                                     | `5b391fb` |
| 2026-08-10 | 2     | Supersede the Phase 1 editor deferral and register the resource loader in editor sessions once it evaluates through the real QuickJS host. Official Godot 4.4.1 and 4.7.1 complete clean editor startup/exit and three actual play/stop loops; removing the loader's manual `Resource::set_path` leaves path ownership with `ResourceLoader`, and repeated `CACHE_MODE_IGNORE` loads no longer conflict. Continuing the deferral or retaining manual path ownership were rejected.                                                                                                                   | Editor scans now evaluate `.js`, `.mjs`, and `.cjs` resources through QuickJS and return a placeholder `Script`; full attachable class/script-instance behavior remains the Phase 4 boundary.                                     | `b6a1e8f` |
| 2026-08-10 | 3     | Use the canonical 0–38 `Variant.Type` order rather than the `builtin_classes` array position. The pinned `extension_api.json` omits `Object` from that array even though it occupies type slot 24; deriving indices from array position shifted `Callable`, `Signal`, containers, and every packed array to the wrong type. Keeping inferred positions or adding per-type runtime patches were rejected.                                                                                                                                                                                             | Corrects generated wrapper prototypes and round trips for all 39 Godot 4.4 Variant types without changing JavaScript names or representations.                                                                                    | `4e648ea` |
| 2026-08-10 | 3     | Represent object wrappers with public raw GDExtension handles and instance IDs, never persistent godot-cpp instance bindings. Eager singleton wrapping through `get_object_instance_binding` reproducibly completed all JavaScript assertions but crashed Godot 4.7.1 after extension unload; raw public construction, validation, class tags, and dispatch remove that retained binding state and pass clean unloads on 4.4.1 and 4.7.1. Retaining godot-cpp bindings on engine-owned objects or limiting support to 4.4 were rejected.                                                             | No JavaScript API change. Object identity, `RefCounted` ownership, invalidation, and compatible-version unload behavior now use only the public GDExtension ABI.                                                                  | `4e648ea` |
| 2026-08-10 | 3     | Split sanitizer validation at the official-editor process boundary. Linux official Godot uses `RTLD_DEEPBIND`, which AddressSanitizer explicitly rejects, and Apple's sanitizer runtime cannot be injected into the signed official editor; therefore CI runs the standalone native host under ASan+UBSan+LSan on Linux and ASan+UBSan on macOS, then runs the complete stock-Godot bridge under UBSan on Linux. Disabling sanitizers entirely or treating loader-runtime incompatibility as a product failure were rejected.                                                                        | No runtime API change. The bridge still receives live sanitizer coverage where the official process permits it, while ownership/leak checks remain enforced by native sanitizers and runtime counters on every stock-Godot cycle. | `4e648ea` |
| 2026-08-10 | 4     | Hold a strong `Ref<JavaScriptScript>` from every native script instance. A raw script pointer survived ordinary 4.4 runs but became stale while Godot 4.7.1 kept an editor tool-script instance alive after releasing the resource wrapper, producing a reproducible allocator crash during later instance callbacks. Strong resource ownership passes the same tool-script scene, unload, and three play/stop cycles on both versions. Retaining the raw pointer or limiting tool-script support to 4.4 were rejected.                                                                              | No JavaScript API change. Script resources now remain alive for exactly as long as any attached native instance needs their metadata and Godot extension handle.                                                                  | `0fc990b` |
| 2026-08-10 | 4     | Defer project-context reload requests made during active JavaScript execution until the dispatch and Promise-job pump unwind; coalesced hard reloads take precedence over soft reloads. Destroying the QuickJS context from a method executing on that context invalidates the live native/JavaScript stack. The reload fixture requests a soft reload from JavaScript, verifies the deferred marker, and proves that old Promise/timer callbacks and signal roots never run afterward. Immediate teardown or rejecting in-script reload were rejected.                                              | `Script.reload()` remains the public entry point. Calls made inside JavaScript complete safely, then apply the requested reload before the next frame's jobs; hard/soft behavior outside an active dispatch is unchanged.         | `0fc990b` |
| 2026-08-10 | 5     | Add `Signal.as_promise()` as a narrow generated-binding exception. Existing browser/runtime source consumes this helper, while the stock extension API exposes signal connection primitives but no Promise adapter. A one-shot repository-owned Callable resolves with the first signal argument (or `undefined` for no arguments), participates in normal connection pruning, and leaves no roots at teardown on all stock and sanitizer runs. Rewriting consumers during a compatibility migration or importing the broader historical helper surface were rejected.                               | Preserves the existing repository's signal-to-Promise behavior without claiming full `godot-jsb` compatibility or changing stock `Signal.connect()` semantics.                                                                    | `ebcbb4b` |
| 2026-08-10 | 5     | Validate stock-executable type generation by producing two isolated outputs from the same executable and comparing every byte, rather than comparing the current stable API to the checked-in 4.4.1 declarations. Official 4.7.1 legitimately adds and changes API entries, so a pinned-output comparison would report a false failure even when generation is correct. Dropping the pinned declarations or accepting a single unverified current-version output were rejected.                                                                                                                      | Checked-in declarations remain reproducible from the minimum-version 4.4.1 API, while users and CI can deterministically generate declarations matching a newer supported stock Godot.                                            | `ebcbb4b` |
| 2026-08-10 | 5     | Explicitly initialize dynamically reflected `MethodInfo` return and per-argument metadata to `GDEXTENSION_METHOD_ARGUMENT_METADATA_NONE`. The complete official Godot 4.7.1 editor fixture under live UBSan reported an invalid enum value when default-constructed metadata crossed the extension boundary; explicit values remove the undefined behavior and pass 4.4.1, 4.7.1, and sanitizer suites. Relying on incidental initialization or suppressing the UBSan report were rejected.                                                                                                          | No JavaScript or reflection API change. Reflected methods and signals now carry valid public GDExtension metadata across both supported Godot lines.                                                                              | `ebcbb4b` |
| 2026-08-10 | 6     | Register the installed runtime through the exact `.godot/extension_list.cfg` entry owned by the installer. A newly created project launched headlessly attempted to load its JavaScript main scene before Godot had discovered an addon placed under `addons/`; adding the canonical registration makes the documented first launch succeed. Requiring an editor warm-up, manufacturing broader editor cache state, or asking users to register the extension manually were rejected.                                                                                                                | Install now adds one deterministic registration line and uninstall removes only that exact line; registrations belonging to other extensions remain untouched.                                                                    | `014b839` |
| 2026-08-10 | 6     | Claim script-instance property writes only for properties explicitly declared by `defineScript()` metadata. Assigning inherited `Node2D.position` re-entered the JavaScript accessor through Godot's native setter because the script instance previously claimed every property name, causing unbounded recursion and a native crash. Letting undeclared names fall through passes focused `position` and `Node.process_mode` regressions on official 4.4.1, 4.7.1, Linux, and live UBSan. Special-casing individual native properties or prohibiting inherited property assignment were rejected.  | Exported JavaScript properties retain script-instance storage and inspector behavior; inherited native Godot properties now use their canonical engine setters and are safely readable and writable from JavaScript.              | `014b839` |
| 2026-08-10 | 7     | Mark generated CommonJS `.js` entries with the exact `/*! godot-js-runtime:format=commonjs */` banner shared by TypeScript and the native loader. Godot scenes require the stable `dist/app.js` resource path, while Vite's CommonJS output cannot be inferred safely from that neutral extension. The loader accepts the marker only after an optional BOM, whitespace, and strict-mode directive; extension-only dispatch broke generated apps, heuristic source parsing was ambiguous, and renaming the scene entry to `.cjs` would break the established output contract.                        | Existing scene paths and application imports remain unchanged. Plain `.js` stays ESM, `.mjs` is always ESM, `.cjs` is always CommonJS, and repository-generated `.js` bundles select CommonJS deterministically.                  | `f82f06a` |
| 2026-08-10 | 7     | Monitor the source of every resource module actually loaded by the project runtime and coalesce changed dependency paths into the existing safe soft-reload path. The editor reload smoke proved that Vite rewrites `dist/chunks/main.js` while the stable `dist/app.js` entry remains byte-identical, so watching attached script resources alone silently missed real rebuilds. Polling the whole output directory would reload unrelated files and lose module-graph scope; requiring hashed entry paths would violate the scene contract.                                                        | Editing a Vue/TypeScript dependency now reloads the active project even when only a transitive ESM, CommonJS, or JSON module changed. Direct script reload behavior and the public `Script.reload()` contract are unchanged.      | `f82f06a` |
| 2026-08-10 | 7     | Keep an official editor process open to observe rebuilt chunk hashes, then validate initial and rebuilt scenes through direct stock-Godot launches in the editor reload smoke. A headless editor uses Godot's dummy thumbnail renderer and cannot create the embedded play window, but its filesystem/plugin/runtime context does detect the rebuild and reevaluate the changed module. Treating the missing headless play window as product behavior or reducing the gate to a file watcher were rejected.                                                                                          | CI remains display-independent while still proving official-editor observation, runtime soft reload, balanced stop/start, rebuilt-module evaluation, and successful execution of both scene revisions.                            | `f82f06a` |
| 2026-08-10 | 8     | Publish one canonical 14-target matrix through six platform archives, with composite Apple payloads retaining per-target debug/release libraries inside their framework or XCFramework layout. Building one host artifact during publish overwrote the complete manifest, while a platform-owned archive plus byte-equal committed-manifest gate preserves every target and makes provenance independently verifiable. A host-only manifest and one archive per individual library were rejected.                                                                                                    | Installers can select exactly one platform archive while the package manifest continues to describe and verify the complete supported matrix.                                                                                     | `3b8f164` |
| 2026-08-10 | 8     | Treat successful unsigned iOS device/simulator export and link validation as the automatable gate when matching hardware and signing are unavailable. Official Godot 4.4.1 supplies an x86_64 simulator engine, so an Apple Silicon host cannot honestly launch it; both runtime slices are force-loaded and symbol-checked, while a signed physical-device launch remains an explicit release operator gate. Manufacturing a fake universal engine or silently skipping one runtime slice were rejected.                                                                                            | iOS device arm64 and simulator arm64/x86_64 artifacts are shipped and link-verified without claiming a launch that the available host cannot perform.                                                                             | `3b8f164` |
| 2026-08-10 | 8     | Capture the threaded Web success marker directly from Godot's worker through Chrome DevTools Protocol and serve exports with cross-origin isolation plus the correct WebAssembly MIME type. The marker is emitted in the worker rather than the page console, and browser/runtime errors are now fatal to the gate. Page-console-only observation or accepting a successful HTTP load without runtime evidence were rejected.                                                                                                                                                                        | Web debug/release exports retain Godot threading and are automatically launch-verified in a real browser with `crossOriginIsolated === true`.                                                                                     | `3b8f164` |
| 2026-08-10 | 9     | Type-check repository consumers directly against the standalone stock-Godot declaration and narrow `ClassDB.instantiate()` results with the runtime-supported `instanceof Node` guard. Clean cutover builds proved the narrower public binding is sufficient for the renderer and browser packages. Copying the removed custom-editor declarations, weakening checks with broad casts, or keeping a dual type surface were rejected.                                                                                                                                                                 | Existing `godot` imports remain unchanged, while the repository and generated projects now have one declaration source matching the standalone runtime.                                                                           | `a96a968` |
| 2026-08-10 | 9     | Make clean installation independent of previously built workspace state: runtime tests bootstrap pinned native dependencies, npm packages ship tracked executable launchers whose bin targets exist at install time, and fixture `typings/.gdignore` scan markers are tracked. Empty-cache clones exposed each missing prerequisite before `e2ff667`, `e2fc7cb`, and `8eb4cf1`; relying on an already-built checkout, untracked ignored files, or npm links to absent `dist` entries were rejected.                                                                                                  | Workspace and packed-project commands retain their existing names, but cold `npm ci` now creates usable CLIs and official Godot can scan every checked-in fixture deterministically.                                              | `8eb4cf1` |
| 2026-08-10 | 9     | Preserve a canonical release manifest containing packaged archives during host-only native builds. The clean stock smoke rebuilt the host extension and otherwise replaced the verified 20-payload/six-archive manifest with a host-only manifest; the release packager remains the sole operation allowed to replace a complete archived manifest. Always overwriting it or requiring callers to restore it manually were rejected.                                                                                                                                                                 | Host development and smoke commands no longer invalidate the distributable matrix; release packaging still deterministically regenerates and verifies every target and archive.                                                   | `78c89f3` |
| 2026-08-10 | 10    | Wait for both Android's `sys.boot_completed` signal and a responsive system package-manager path before making the single export-smoke install attempt. The first final cold matrix saw an arm64 ADB transport but failed installation because the device was still booting; the committed readiness probe then passed cold in both the in-tree and archive-installed matrices. Retrying failed installs, accepting ADB transport alone, or requiring a pre-warmed emulator were rejected.                                                                                                           | No runtime or application API change. Android export validation is deterministic from a cold AVD and still fails the first actual install or launch error without hiding native failures behind retries.                          | `1d477fe` |
| 2026-08-10 | 10    | Bootstrap Android command-line tools on the release runner with commit-pinned `android-actions/setup-android` v4.0.1, command-line-tools build 14742923, and NDK 23.2.8568313, then verify the expected compiler before exporting `ANDROID_NDK_ROOT`. The first `develop` release-matrix run proved that the refreshed Ubuntu image no longer exposes `sdkmanager`; depending on runner-global state, using a floating action tag, or weakening the pinned NDK were rejected.                                                                                                                        | Android artifacts remain byte-compatible with the already-verified local matrix, while clean CI runners now provision every required SDK/NDK input explicitly.                                                                    | `5434ba8` |
| 2026-08-10 | 10    | Execute the checksummed SCons wheel directly through Python's module loader. The pinned Emscripten SDK image deliberately lacks `ensurepip`, while a verified wheel is already a valid import path; exact-image Web debug/release builds pass without creating a virtual environment. Installing `pip` into the image, relying on a runner-global SCons, or weakening the dependency checksum were rejected.                                                                                                                                                                                         | Source and release builds keep the same commands and pinned SCons version, but now require only Python itself across native and cross-compilation environments.                                                                   | `098717b` |
| 2026-08-10 | 10    | Normalize current stock-Godot API encodings for `typeddictionary::Key;Value` and opaque `GDExtensionInitializationFunction` pointers, and make the binding header include its own `<cstdint>` dependency. Official Godot 4.7.1 introduced those encodings and strict GCC clean builds exposed the transitive-include assumption; synthetic strict-TypeScript regression generation, live 4.7.1 standalone smoke, and Linux debug/release builds now pass. Pinning consumers permanently to 4.4 declarations, emitting unresolved native callback types, or depending on include order were rejected. | Minimum-version 4.4.1 declarations remain byte-identical, while deterministic declarations generated from current Godot compile without consumer shims.                                                                           | `098717b` |
| 2026-08-10 | 10    | Select Debian's POSIX MinGW-w64 compiler alternatives and assert `Thread model: posix` before Windows release builds. The default `win32` alternative omits the C++ thread primitives used by the runtime, while the same pinned cross-toolchain's POSIX variant completes both Windows debug and release DLLs. Removing runtime mutexes, accepting host-dependent alternatives, or weakening Windows concurrency behavior were rejected.                                                                                                                                                            | Windows artifacts retain the same x86_64 ABI and runtime behavior; clean CI now chooses the required standard-library thread implementation deterministically.                                                                    | `098717b` |
| 2026-08-10 | 10    | Order workspace package tests after tests of their package dependencies. A clean hosted Check run caught `@vue-godot/device` rebuilding `dist` while `@vue-godot/browser` imported it, briefly exposing a half-written ES module; moving both output trees aside and forcing the graph proves dependency tests complete before browser tests begin. Serializing every package globally, relying on warm Turbo output, or masking the module error with a retry were rejected.                                                                                                                        | Test assertions and package output are unchanged. Clean parallel CI retains independent branches while preventing concurrent writers and readers across package dependency edges.                                                 | `6313c13` |

## Primary Technical References

- [Godot GDExtension overview](https://docs.godotengine.org/en/stable/tutorials/scripting/gdextension/what_is_gdextension.html)
- [Godot GDExtension C example](https://docs.godotengine.org/en/latest/engine_details/engine_api/gdextension/gdextension_c_example.html)
- [Godot `ScriptLanguageExtension`](https://docs.godotengine.org/en/stable/classes/class_scriptlanguageextension.html)
- [Godot `ScriptExtension`](https://docs.godotengine.org/en/stable/classes/class_scriptextension.html)
- [`godot-cpp` GDExtension bindings](https://github.com/godotengine/godot-cpp)
- [QuickJS-ng](https://github.com/quickjs-ng/quickjs)
- [GodotJS source, for migration research and attributed compatibility reference only](https://github.com/godotjs/GodotJS)
- [GodotJS GDExtension build discussion](https://github.com/godotjs/GodotJS/issues/170)
