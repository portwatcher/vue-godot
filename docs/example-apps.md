# Serious Example App Criteria

The SDK quality gate keeps two checked-in example apps that show Vue Godot
handling realistic product work, not only isolated component fixtures. These
criteria define what those apps must keep proving as the public surface changes.

## Design Scope

These are SDK reference examples, not branded product demos. Their visual style
can be simple and implementation-focused as long as they clearly exercise the
required Vue Godot capabilities, build reliably, and document what each workflow
proves.

## Native App Demo

The native app style demo should be checked in at `apps/native-app-demo` and
registered in the fixture app coverage. It must demonstrate:

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

The game UI demo should be checked in at `apps/game-ui-demo` and registered in
the fixture app coverage. It must demonstrate:

- a Godot scene with Vue-rendered HUD or menu UI
- controller, keyboard, and touch-oriented navigation paths
- animation or transition behavior that maps cleanly to Godot runtime behavior
- audio, video, and image assets loaded from the checked-in app
- pause, settings, and inventory or loadout workflows
- focus restoration when moving between overlays, menus, and gameplay UI
- a local build command and Godot smoke path documented in the app README

## Verification

Before changing the serious demo coverage:

- add both apps to the root README examples table
- keep each app's package scripts compatible with the fixture app build contract
- include both apps in `test/fixture-apps.test.mjs`
- run `npm run check:serious-examples`, which is also part of `npm run check`
- run `npm run build --workspace=<app>` for each app
- run `npm run check`
- run the Godot smoke path for each app when Godot is available
- update package READMEs or compatibility docs if the demos expose new public
  API behavior
