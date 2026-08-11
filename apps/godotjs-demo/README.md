# GodotJS Demo

This is the standalone, non-Vue TypeScript fixture for GodotJS. It demonstrates
lifecycle methods, input-driven movement, an exported
inspector property, a declared signal backed by `Callable`, resource loading,
and a Promise job. A successful headless run prints:

```text
[godotjs-demo] PHASE6_STANDALONE_DEMO PASS
```

An exported build launched by the platform matrix prints its runtime, official
Godot, and platform identity:

```text
[godotjs-export] STANDALONE PASS runtime=0.0.1 godot=<stable-version> (official) platform=<platform>
```

Extract the GodotJS release ZIP at this project root, then build TypeScript and
open the project with an official Godot editor:

```bash
npm run build
godot --editor --path .
```

`npm run dev` watches the TypeScript source. GodotJS is installed only by
manually copying the complete `addons/godotjs` directory; this demo has no Vue
or extension npm dependency.

The checked-in export presets cover macOS universal, Windows x86_64, Linux
x86_64, Android arm64-v8a and x86_64, iOS device/simulator, and threaded Web in
debug and release modes. From the repository root, install the checksummed
official templates and run this demo together with the representative Vue app:

```bash
npm run setup:godot
npm run setup:godot-templates
npm run smoke:platform-exports
npm run smoke:platform-exports -- \
  --release-dir .artifacts/godotjs/0.0.1
```

The second run installs every target into fresh staged projects from verified
offline universal release ZIP. Web output must be hosted with cross-origin
isolation headers for threads; the automated server in the smoke command does
this. Apple application signing and device provisioning remain the consuming
app's responsibility.
