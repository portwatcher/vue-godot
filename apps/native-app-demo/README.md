# native-app-demo

Reference native application built with Vue Godot, `@vue-godot/html`,
`@vue-godot/browser`, `@vue-godot/device`, and `vue-router`.

## SDK Coverage

This app exists to keep SDK-level native application flows exercised:

| Requirement               | Coverage                                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| multi-screen routing      | Uses `vue-router` with home, device, and SDK check screens.                                          |
| form input                | Renders text fields and textarea inside a `<Form>`.                                                  |
| network loading           | Runs `checkNetworkReachability()` with loading state.                                                |
| reachability              | Uses `navigator.onLine` plus `setNavigatorOnline()` transitions.                                     |
| persistent storage        | Saves profile state with `localStorage` and `sessionStorage`.                                        |
| camera or geolocation     | Checks media/geolocation adapters, then calls the native APIs when available.                        |
| permission                | Queries `navigator.permissions.query()` for camera, geolocation, microphone, clipboard, and sensors. |
| SDK profile checks        | Runs the maintained API set from the SDK checks screen or `VUE_GODOT_RELEASE_CHECKS`.                |
| Android lifecycle         | Records back-request and background/foreground counts during the native app smoke path.               |
| SafeAreaView              | Wraps routed content in `<SafeAreaView>`.                                                            |
| KeyboardAvoidingView      | Wraps form input and SDK checks in `<KeyboardAvoidingView>`.                                         |
| Godot smoke               | Covered by `npm run smoke:godot`.                                                                    |
| npm run build             | Builds the SDK dependencies and Vite bundle.                                                         |

You can also open `project.godot` in GodotJS and press F5 after building.

## Commands

```bash
npm run build --workspace=native-app-demo
npm run dev --workspace=native-app-demo
npm run gen:types --workspace=native-app-demo
GODOT_BIN=/path/to/godot npm run smoke:godot
SIMCTL_CHILD_VUE_GODOT_RELEASE_CHECKS=1 xcrun simctl launch --terminate-running-process booted org.vuegodot.nativeappdemo
SIMCTL_CHILD_VUE_GODOT_RELEASE_CHECKS=1 SIMCTL_CHILD_VUE_GODOT_RELEASE_CHECKS_DELAY_MS=8000 xcrun simctl launch --terminate-running-process booted org.vuegodot.nativeappdemo
```

`npm run build` emits `dist/app.js`, which is attached by `app.tscn`.
