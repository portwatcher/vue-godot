# GodotJS native source

This private workspace builds the GodotJS GDExtension. It is repository build
infrastructure and is deliberately not publishable to npm.

Users install GodotJS by downloading `godotjs-v<version>.zip` from a GitHub
release and extracting it at the root of a Godot project. The public add-on
layout is:

```text
addons/godotjs/
├── godotjs.gdextension
├── manifest.json
├── bin/
├── licenses/
├── LICENSE
├── README.md
└── THIRD_PARTY_NOTICES.md
```

The universal ZIP contains debug and release payloads for macOS universal,
Windows x86_64, Linux x86_64, Android arm64/x86_64, iOS device/simulator, and
threaded Web wasm32. A consumer must copy the complete directory; there is no
npm installer, postinstall hook, target downloader, or partial-platform state.

## Development

From the repository root:

```bash
npm install
npm run test --workspace=packages/godot-js-runtime
npm run build:native --workspace=packages/godot-js-runtime -- --run-tests
```

Native dependencies are immutable, checksummed pins in `native/deps.lock.json`.
The build uses public GDExtension/godot-cpp APIs and embeds QuickJS-ng.

Build all platform payloads in CI, then assemble the universal release:

```bash
npm run build:release --workspace=packages/godot-js-runtime
npm run package:release --workspace=packages/godot-js-runtime
npm run verify:release --workspace=packages/godot-js-runtime
```

Release packaging writes `godotjs-v<version>.zip`, `godotjs-manifest.json`,
`PROVENANCE.json`, and `SHA256SUMS`. Verification checks architecture, exported
entry point, dependency closure, GDExtension feature mappings, licensing,
checksums, and the complete debug/release platform matrix.

## Runtime modules

GodotJS provides `godot` and `godot-js` to project scripts. TypeScript
declarations are maintained in `packages/cli/templates/typings` so Vue Godot's
npm CLI can generate project types without treating the native extension as an
npm dependency. The standalone demo in `apps/godotjs-demo` exercises the
same modules without Vue.

## Compatibility automation

Godot 4.4.1 is the minimum ABI floor. The scheduled latest-stable workflow
resolves the newest official stable Godot release, validates checksums for the
editor and export templates, builds and tests every target, runs stock-editor
and exported-application gates, and publishes a new GodotJS compatibility
release only after every required gate passes.

See the repository [compatibility matrix](../../docs/compatibility.md) and
[platform guides](../../docs/platforms) for current evidence and limitations.
