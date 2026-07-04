# Production Readiness Guide

Vue Godot is still experimental. Use this guide as the release checklist for
apps built on the current packages and for future package release candidates.

## Build And Verify

Run the full repository check before cutting a release candidate:

```bash
npm run check
npm run release:preflight -- --local --skip-check --skip-godot
```

`npm run check` builds packages, runs tests, builds demo apps, and runs clean
CLI scaffold smoke checks. `release:preflight` verifies package metadata,
generated package specs, dry-run package contents, registry state, and publish
environment assumptions.

The local preflight command may warn when Godot smoke is skipped or when package
versions are newer than the registry. Release builds should run the full
workflow, including Godot smoke and trusted-publishing checks.

## App Build Checklist

For each app:

1. Run `npm run build`.
2. Run `npm run check:exports` if the generated export-setting checker exists.
3. Open the project in the GodotJS editor and run the main scene.
4. Test an exported binary for each target platform, not only editor play mode.
5. Test adapter-backed capabilities on real devices or representative hosted
   devices.

Generated apps load `dist/app.js`, so rebuild before exporting. Keep generated
type directories and Vue source ignored by Godot resource scans; the generated
`.gdignore` files are part of that setup.

## Platform Exports

Follow the dedicated permission and adapter docs before shipping:

- [Permissions and export setup](./permissions.md)
- [Plugin adapter guide](./plugins.md)
- [Compatibility matrix](./compatibility.md)

Minimum platform checks:

| Platform | Required validation |
| --- | --- |
| Desktop | Exported Windows, macOS, or Linux binary launches and loads `dist/app.js`; storage, networking, and media assets resolve. |
| Android | Export preset includes required permissions; runtime permission prompts and adapter status mapping work on-device. |
| iOS / Apple platforms | Usage descriptions, entitlements, and plugin setup are present; native prompts and adapter errors are tested. |
| Web export | Networking, file access, audio/video, and GodotJS runtime support are tested in the exported browser sandbox. |

## Browser And Device APIs

Do not assume browser APIs exist because TypeScript accepts them. `@vue-godot/browser`
only installs implemented polyfills, and plugin-backed globals appear only when
adapters are registered.

For adapter-backed APIs, test all relevant states:

- no adapter registered
- unsupported platform
- permission denied
- missing export settings
- successful native operation

The expected behavior for each API is tracked in
[compatibility.md](./compatibility.md).

## Release Criteria

Before removing experimental/not-production-ready language, the repository still
needs:

- all P0 and approved P1 checklist items complete
- real Godot smoke coverage in CI for supported APIs
- Android and iOS export smoke coverage for selected device APIs
- documented performance budgets
- serious native app and game UI demos
- clean or documented security/dependency audit results

Until those are complete, treat release builds as preview/alpha-quality and
document app-specific risk explicitly.
