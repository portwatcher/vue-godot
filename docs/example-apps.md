# Serious Example App Criteria

The final production-readiness pass requires two checked-in example apps that
show Vue Godot handling realistic product work, not only isolated component
fixtures. These criteria define what those apps must prove before the TODO
entries can be checked.

## Required Design Context

Before implementing either serious demo, confirm these inputs with the
maintainer:

- target audience and usage context
- primary jobs the user is trying to complete
- brand personality and interface tone

Do not infer this context from the codebase. The examples should be credible
for the people they are meant to serve, and the owner must define that audience
before UI direction, copy, layout, color, and motion are finalized.

## Native App Demo

The native app style demo should be checked in under `apps/` and registered in
the fixture app coverage. It must demonstrate:

- multi-screen routing with back/forward behavior
- form input, validation states, disabled or read-only states, and submission
- network loading, failure, retry, and reachability/offline states
- persistent storage under `user://` or the browser storage polyfills
- at least one camera or geolocation capability through the browser/device
  adapter layer
- permission query/request-denied flows and missing-plugin/export-error states
- safe area and keyboard-aware layout behavior on mobile-oriented screens
- a local build command and Godot smoke path documented in the app README

## Game UI Demo

The game UI demo should be checked in under `apps/` and registered in the
fixture app coverage. It must demonstrate:

- a Godot scene with Vue-rendered HUD or menu UI
- controller, keyboard, and touch-oriented navigation paths
- animation or transition behavior that maps cleanly to Godot runtime behavior
- audio, video, and image assets loaded from the checked-in app
- pause, settings, and inventory or loadout workflows
- focus restoration when moving between overlays, menus, and gameplay UI
- a local build command and Godot smoke path documented in the app README

## Verification

Before checking off the serious demo TODO items:

- add both apps to the root README examples table
- keep each app's package scripts compatible with the fixture app build contract
- include both apps in `test/fixture-apps.test.mjs`
- run `npm run build --workspace=<app>` for each app
- run `npm run check`
- run the Godot smoke path for each app when Godot is available
- update package READMEs or compatibility docs if the demos expose new public
  API behavior
