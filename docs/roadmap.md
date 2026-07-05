# Roadmap Decisions

This document records long-term ecosystem decisions that were evaluated during
production-readiness work but are not required for the current release gate.
The compatibility matrix remains the source of truth for current support.

## P2 Ecosystem Decisions

| Area | Current decision | Revisit trigger |
| --- | --- | --- |
| Layout engine such as Yoga or Taffy | Defer. The current `<Div>` style subset maps to Godot containers, size flags, and wrappers, which keeps layout native, inspectable, and covered by the existing performance budget. | Add a JS layout engine only if serious apps hit repeated layout requirements that Godot containers cannot express without brittle wrappers. |
| CSS-to-Godot compiler | Defer. Inline style objects, CSS declaration strings, arrays, warnings for unsupported keys, and documented migration guidance cover the current beta surface. | Revisit when users need shared stylesheets, cascading selectors, media/container query translation, or design-token compilation across multiple apps. |
| Vue ecosystem adapters | Defer. The runtime supports Vue core rendering patterns and documents unsupported DOM assumptions; adapters should be added only for libraries with clear Godot-native value. | Revisit for specific libraries once a demo or user app proves the integration pattern and expected runtime behavior. |
| Plugin marketplace/list | Defer. The device package defines adapter contracts and plugin setup docs, but native plugin quality and platform coverage need validation before a curated marketplace is credible. | Revisit after multiple maintained geolocation, media, notification, deep-link, or share adapters pass real-device release checks. |
| Devtools integration | Defer. Current diagnostics, source maps, runtime warnings, fixture apps, and smoke tests are the production-readiness baseline. | Revisit if debugging large Vue Godot apps repeatedly requires component-tree inspection, event tracing, or time-travel style state tooling. |
| SSR/static pre-render | Defer. Godot owns runtime rendering, resources, scene setup, and platform exports; SSR would not help the current native app/game UI targets. | Revisit only if a product needs build-time scene/UI snapshots, web export pre-rendering, or server-authored UI payloads. |

These decisions intentionally keep the production track focused on Godot-native
runtime reliability, documented compatibility, real app examples, and device
release validation.
