# Godot JavaScript Runtime Demo

This is the standalone, non-Vue TypeScript fixture for Godot JavaScript
Runtime. It demonstrates lifecycle methods, input-driven movement, an exported
inspector property, a declared signal backed by `Callable`, resource loading,
and a Promise job. A successful headless run prints:

```text
[godot-js-runtime-demo] PHASE6_STANDALONE_DEMO PASS
```

An exported build launched by the platform matrix prints its runtime, official
Godot, and platform identity:

```text
[godot-js-runtime-export] STANDALONE PASS runtime=0.0.1 godot=<stable-version> (official) platform=<platform>
```

From this directory, install dependencies and the runtime, generate types,
build TypeScript, then open the project with an official Godot editor:

```bash
npm install
npm run install:runtime
npm run build
godot --editor --path .
```

`npm run dev` watches the TypeScript source. The runtime installer records
every copied addon file in
`addons/godot-js-runtime/installation-manifest.json`; `npm run verify:runtime`
checks those files and `npm run uninstall:runtime` removes only those entries.

The checked-in export presets cover macOS universal, Windows x86_64, Linux
x86_64, Android arm64-v8a and x86_64, iOS device/simulator, and threaded Web in
debug and release modes. From the repository root, install the checksummed
official templates and run this demo together with the representative Vue app:

```bash
npm run setup:godot
npm run setup:godot-templates
npm run smoke:platform-exports
npm run smoke:platform-exports -- \
  --release-dir .artifacts/godot-js-runtime/0.0.1
```

The second run installs every target into fresh staged projects from verified
offline release archives. Web output must be hosted with cross-origin
isolation headers for threads; the automated server in the smoke command does
this. Apple application signing and device provisioning remain the consuming
app's responsibility.
