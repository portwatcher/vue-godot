# Godot JavaScript Runtime Demo

This is the standalone, non-Vue TypeScript fixture for Godot JavaScript
Runtime. It demonstrates lifecycle methods, input-driven movement, an exported
inspector property, a declared signal backed by `Callable`, resource loading,
and a Promise job. A successful headless run prints:

```text
[godot-js-runtime-demo] PHASE6_STANDALONE_DEMO PASS
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
