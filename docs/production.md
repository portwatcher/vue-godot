# Production Readiness Guide

Vue Godot is still experimental. Use this guide as the release checklist for
apps built on the current packages and for future package release candidates.

## Build And Verify

Run the full repository check before cutting a release candidate:

```bash
npm run check
npm run check:serious-examples
npm audit --audit-level=moderate
npm run release:preflight -- --local --skip-check --skip-godot
```

`npm run check` builds packages, runs tests, builds demo apps, and runs clean
CLI scaffold smoke checks. `npm run check:serious-examples` verifies the
required serious native app and game UI demo workspaces, README coverage, root
README links, and fixture-test registration. It is expected to fail until those
P1 examples exist. `npm audit --audit-level=moderate` must report zero
moderate, high, or critical advisories unless an accepted exception is
documented in the release notes. `release:preflight` verifies package metadata,
generated package specs, dry-run package contents, registry state, and publish
environment assumptions.

The local preflight command may warn when Godot smoke is skipped or when package
versions are newer than the registry. Release builds should run the full
workflow, including Godot smoke and trusted-publishing checks. `--skip-godot`
is intended for local validation only; non-local preflight fails when Godot
smoke is skipped.

## App Build Checklist

For each app:

1. Run `npm run build`.
2. Run `npm run check:exports` if the generated export-setting checker exists,
   or `npx vue-godot doctor --exports-only` from projects using the CLI.
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
- [Serious example app criteria](./example-apps.md)
- [Real device release checklist](./real-device-release.md)
- [Migration guide](./migration.md)
- [Performance guide](./performance.md)
- [Roadmap decisions](./roadmap.md)
- [Android platform guide](./platforms/android.md)
- [iOS and Apple platform guide](./platforms/ios.md)
- [Desktop platform guide](./platforms/desktop.md)
- [Troubleshooting](./troubleshooting.md)

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

`vue-godot doctor` is a local guardrail for common setup mistakes: Node version,
package specs and installs, GodotJS typings, Vite/Volar configuration, export
permissions, and plugin-backed API hints. Treat warnings as release-review
items; real device tests still decide whether native plugins and permissions are
actually correct.

## GodotJS Version Pin

CI installs GodotJS through the shared
[setup action](../.github/actions/setup-godotjs/action.yml). The action pins:

| Input | Current value | Purpose |
| --- | --- | --- |
| `release` | `GodotJS_1.0.0-2` | Release tag from `ialex32x/GodotJS-Build`. |
| `asset` | `prebuilt_linux_x64_v8` | Linux x64 V8 editor bundle used by CI smoke tests. |

When updating GodotJS:

1. Change the default `release` and, if needed, `asset` in the setup action.
2. Open the project locally in the matching GodotJS editor and regenerate
   typings for any committed fixture/demo apps that need new engine types.
3. Run `npm run check`.
4. Run the Godot smoke workflows, including generated app and editor reload
   smoke, before publishing.
5. Note any GodotJS behavior or typing changes in the release notes.

## Release Criteria

Before removing experimental/not-production-ready language, the repository still
needs:

- all P0 and approved P1 checklist items complete
- real Godot smoke coverage in CI for supported APIs
- Android and iOS export smoke coverage for selected device APIs
- documented performance budgets
- serious native app and game UI demos that satisfy
  [the example app criteria](./example-apps.md) and pass
  `npm run check:serious-examples`
- clean or documented security/dependency audit results

Until those are complete, treat release builds as preview/alpha-quality and
document app-specific risk explicitly.
