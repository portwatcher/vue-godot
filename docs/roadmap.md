# Roadmap Decisions

This document records long-term ecosystem decisions that have been evaluated but
are not part of the current SDK surface. The compatibility matrix remains the
source of truth for current support.

## Runtime Expansion Decisions

| Area                              | Current decision                                                                                                                                                                                         | Revisit trigger                                                                                                                                                    |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Additional JavaScript engines     | Defer. QuickJS-ng is the sole embedded engine for the completed 0.0.1 standalone runtime and passes the stock-editor, lifecycle, sanitizer, reload, performance, and full export gates.                  | Revisit only after a released workload demonstrates a measured requirement that cannot be met by optimizing the pinned QuickJS-ng implementation.                  |
| Additional artifact architectures | Defer. The verified v1 matrix is 14 debug/release targets and 20 payloads across macOS universal, Windows x86_64, Linux x86_64, Android arm64-v8a/x86_64, iOS device/simulator, and threaded Web wasm32. | Add a target when official Godot export support, a reproducible toolchain, release hardware or runner coverage, and a real consumer requirement are all available. |

## P2 Ecosystem Decisions

| Area                                | Current decision                                                                                                                                                                     | Revisit trigger                                                                                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout engine such as Yoga or Taffy | Defer. The current `<Div>` style subset maps to Godot containers, size flags, and wrappers, which keeps layout native, inspectable, and covered by the existing performance budget.  | Add a JS layout engine only if serious apps hit repeated layout requirements that Godot containers cannot express without brittle wrappers.           |
| CSS-to-Godot compiler               | Defer. Inline style objects, CSS declaration strings, arrays, warnings for unsupported keys, and documented migration guidance cover the current beta surface.                       | Revisit when users need shared stylesheets, cascading selectors, media/container query translation, or design-token compilation across multiple apps. |
| Vue ecosystem adapters              | Defer. The runtime supports Vue core rendering patterns and documents unsupported DOM assumptions; adapters should be added only for libraries with clear Godot-native value.        | Revisit for specific libraries once a demo or user app proves the integration pattern and expected runtime behavior.                                  |
| Plugin marketplace/list             | Defer. The device package defines adapter contracts and plugin setup docs, but native plugin quality and platform coverage need validation before a curated marketplace is credible. | Revisit after multiple maintained geolocation, media, notification, deep-link, or share adapters pass app-level device validation.                    |
| Devtools integration                | Defer. Current diagnostics, source maps, runtime warnings, fixture apps, and smoke tests are the SDK quality baseline.                                                               | Revisit if debugging large Vue Godot apps repeatedly requires component-tree inspection, event tracing, or time-travel style state tooling.           |
| SSR/static pre-render               | Defer. Godot owns runtime rendering, resources, scene setup, and platform exports; SSR would not help the current native app/game UI targets.                                        | Revisit only if a product needs build-time scene/UI snapshots, web export pre-rendering, or server-authored UI payloads.                              |

These decisions intentionally keep the SDK focused on Godot-native runtime
reliability, documented compatibility, and real app examples.
