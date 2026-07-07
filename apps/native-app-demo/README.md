# native-app-demo

Reference native application built with Vue Godot, `@vue-godot/html`,
`@vue-godot/browser`, `@vue-godot/device`, and `vue-router`.

## Production Readiness Coverage

This app exists to keep SDK-level native application flows exercised:

| Requirement               | Coverage                                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| multi-screen routing      | Uses `vue-router` with home, device, and release-check screens.                                      |
| form input                | Renders text fields and textarea inside a `<Form>`.                                                  |
| network loading           | Runs `checkNetworkReachability()` with loading state.                                                |
| reachability              | Uses `navigator.onLine` plus `setNavigatorOnline()` transitions.                                     |
| persistent storage        | Saves profile state with `localStorage` and `sessionStorage`.                                        |
| camera or geolocation     | Checks media/geolocation adapters, then calls the native APIs when available.                        |
| permission                | Queries `navigator.permissions.query()` for camera, geolocation, microphone, clipboard, and sensors. |
| production-profile checks | Runs the maintained release API set from the `Release checks` screen.                                |
| Android lifecycle         | Records back-request and background/foreground counts for release evidence.                          |
| SafeAreaView              | Wraps routed content in `<SafeAreaView>`.                                                            |
| KeyboardAvoidingView      | Wraps form input and release checks in `<KeyboardAvoidingView>`.                                     |
| Godot smoke               | Covered by `npm run smoke:godot`.                                                                    |
| npm run build             | Builds the SDK dependencies and Vite bundle.                                                         |

You can also open `project.godot` in GodotJS and press F5 after building.
The Android emulator smoke record lives in
[`docs/android-emulator-smoke-2026-07-07.md`](docs/android-emulator-smoke-2026-07-07.md).

## Commands

```bash
npm run build --workspace=native-app-demo
npm run dev --workspace=native-app-demo
npm run gen:types --workspace=native-app-demo
GODOT_BIN=/path/to/godot npm run smoke:godot
```

`npm run build` emits `dist/app.js`, which is attached by `app.tscn`.
