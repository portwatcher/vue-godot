# GodotJS GDExtension execution ledger

This temporary ledger tracks the end-to-end productization run. It is removed
after every required local, hosted, platform, migration, and publication gate
passes.

## Product boundary

- GodotJS is one native GDExtension under `addons/godotjs`.
- Consumer delivery is one universal GitHub Release ZIP, suitable for manual
  copy and a later Godot Asset Library submission.
- GodotJS has no consumer npm package, installer, downloader, or postinstall.
- Vue Godot remains npm-distributed and only generates project declarations.
- The old `addons/godot-js-runtime` and npm installation path stay removed.

## Progress

| Phase | Status | Commit | Evidence |
| --- | --- | --- | --- |
| Native identity and add-on layout | Complete | `784c206` | `addons/godotjs`, `libgodotjs`, canonical entry point and settings |
| Universal release ZIP | Complete | `784c206` | deterministic clean-copy archive tests |
| Standalone TypeScript declarations | Complete | `a6d1ce8`, `2260019` | declarations ship inside the add-on; clean-checkout demo build has no native-submodule dependency |
| Vue/npm separation | Complete | `784c206` | generated projects contain no GodotJS dependency or install scripts |
| Manual-copy generated-project gate | Complete | `dbe8c89` | fresh generated app receives the add-on fixture explicitly and passes Godot 4.7.1 import/run/rebuild smoke |
| Docs, demos, templates, and migration cleanup | Complete | `784c206` | root guide and maintained examples aligned |
| Latest-stable discovery and release automation | Implemented; hosted verification pending | `784c206` | live discovery resolved Godot `4.7.1-stable` |
| Local quality and stock-engine gates | Complete | `784c206` | unit/build tests, native tests, standalone and Vue smoke on Godot 4.7.1 |
| Six-platform debug/release builds and exports | In progress | `784c206` | run `31433732006`: all six native build jobs and universal ZIP passed; export jobs exposed the fixed clean-checkout typings gap |
| Compatibility release publication | Pending | — | Runs only after the platform matrix passes |
| Synchronize and push `develop` | Pending | — | Final gate |
