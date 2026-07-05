# Compatibility

This is the source of truth for Vue Godot API and component compatibility. The
project is still experimental; a `supported` entry means the listed subset is
implemented and tested, not that the full browser, DOM, or native platform spec
is complete.

## Status Legend

| Status | Meaning |
| --- | --- |
| `supported` | Implemented with a real Godot or JavaScript backend and covered by automated tests. |
| `partial` | Usable subset with known spec gaps, platform gaps, or missing production hardening. |
| `requires-plugin` | Needs an explicit native or Godot plugin adapter before it should be installed. |
| `planned` | Intended, but no public implementation is available yet. |
| `skipped` | Intentionally not provided because a browser-compatible backend would be misleading. |

## Tracking Schema

Each entry should be evaluated with these fields:

| Field | Requirement |
| --- | --- |
| API or component | Public API, global, component, or integration feature name. |
| Owner | Package or adapter responsible for the behavior. |
| Status | One of `supported`, `partial`, `requires-plugin`, `planned`, or `skipped`. |
| Godot backend | Godot class/module/plugin used, or the reason no backend exists. |
| Platforms | Desktop, Android, iOS, Web export, and editor expectations when known. |
| Permission/export requirements | Android permissions, iOS plist keys, export settings, or plugin setup. |
| Tests | Unit, simulated Godot, real Godot smoke, or real device coverage. |
| Caveats | Spec differences, unsupported options, lifecycle notes, and known limits. |

## Browser APIs

| API | Owner | Status | Godot backend | Platforms | Permissions/export | Tests | Caveats |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `fetch()` | `browser` | `supported` | `HTTPClient` | Desktop, Android, iOS, editor; Web export depends on Godot networking | Network export permissions where the target platform requires them | Unit, simulated Godot, html-demo smoke | Fetch subset; no browser cache, service worker, cookie jar, or streaming body API. |
| `Request` / `Response` / `Headers` | `browser` | `supported` | JavaScript body/header wrappers plus `HTTPClient` interop | All JS runtimes | None beyond `fetch()` backend | Unit | Web-compatible subset used by package fetch. |
| `Blob` / object URLs | `browser` | `supported` | JavaScript memory registry | All JS runtimes | Memory budget depends on app | Unit, html-demo smoke | Object URLs are process-local and not persisted. |
| `File` | `browser` | `supported` | `Blob` wrapper | All JS runtimes | None | Unit, html-demo smoke | Does not represent OS file picker handles. |
| `FormData` | `browser` | `supported` | JavaScript multipart serializer | All JS runtimes | None | Unit, html-demo smoke | Multipart upload support is implemented for package fetch bodies. |
| `FileReader` | `browser` | `supported` | `Blob` readers plus event target | All JS runtimes | None | Unit, html-demo smoke | Async event-compatible subset. |
| `WebSocket` | `browser` | `supported` | `WebSocketPeer` | Desktop, Android, iOS, editor; Web export depends on Godot WebSocket support | Network export permissions where needed | Unit, simulated Godot, html-demo constructor smoke | Client subset; no extensions, no server mode, and polling requires the app loop to keep running. |
| `URL` / `URLSearchParams` | `browser` | `supported` | JavaScript parser | All JS runtimes | None | Unit, html-demo smoke | WHATWG-compatible subset, not a browser navigation engine. |
| `atob` / `btoa` | `browser` | `supported` | JavaScript base64 | All JS runtimes | None | Unit, html-demo smoke | Binary string semantics match browser helpers. |
| `TextEncoder` / `TextDecoder` | `browser` | `supported` | JavaScript UTF-8 with V8 fast path when available | All JS runtimes | None | Unit, html-demo smoke | UTF-8 focus; encoding label support is intentionally limited. |
| `AbortController` / `AbortSignal` | `browser` | `supported` | JavaScript event target | All JS runtimes | None | Unit, html-demo smoke | Used by fetch and reachability checks. |
| Timers | `browser` | `supported` | `SceneTree.create_timer()` or host timers in tests | All JS runtimes; scene tree improves Godot runtime behavior | None | Unit | `setTimeout`, `clearTimeout`, `setInterval`, and `clearInterval`. |
| `queueMicrotask` | `browser` | `supported` | Promise microtask | All JS runtimes | None | Unit | Reports async errors through rejected microtasks. |
| `requestAnimationFrame` | `browser` | `supported` | `SceneTree.process_frame`, timer fallback before scene tree exists | Godot runtime and editor | None | Unit | Frame timing follows Godot process frames, not browser paint phases. |
| `performance` | `browser` | `supported` | `Time.get_ticks_usec()` | All JS runtimes with Godot Time | None | Unit | Includes `now()`, marks, and measures; no navigation/resource timing. |
| `history` / `location` / `PopStateEvent` | `browser` | `supported` | In-memory history stack | All JS runtimes | None | Unit | Enables SPA routers; no actual OS/window navigation. |
| Global event target | `browser` | `supported` | `GodotEventTarget` | All JS runtimes | None | Unit | Installs global `addEventListener`, `removeEventListener`, and `dispatchEvent` when missing. |
| `localStorage` | `browser` | `supported` | `FileAccess` JSON file under `user://` with memory fallback | Desktop, Android, iOS, editor; persistence depends on `user://` | Storage/export persistence depends on platform | Unit | Synchronous Web Storage shape; values are strings only. |
| `sessionStorage` | `browser` | `supported` | Process memory | All JS runtimes | None | Unit | Cleared when the GodotJS runtime exits or reloads. |
| `navigator.onLine` | `browser` | `partial` | Explicit state plus fetch reachability probe | All JS runtimes with fetch backend | Network export permissions where needed | Unit, html-demo smoke | Starts optimistic; internet reachability is best-effort. |
| `online` / `offline` events | `browser` | `partial` | Shared `GodotEventTarget` | All JS runtimes | None | Unit | Events fire when the polyfill state changes, not from OS network callbacks. |
| `checkNetworkReachability()` | `browser` | `partial` | Fetch probe with timeout | Same as fetch | Network export permissions where needed | Unit | Captive portals, firewalls, and platform policy can affect results. |
| Reachability helpers | `browser` | `partial` | Fetch probe configuration and explicit navigator state | Same as fetch | Network export permissions where needed | Unit | Includes `configureNetworkReachability()`, `getNetworkReachabilityOptions()`, and `setNavigatorOnline()`. |
| `navigator.permissions.query()` | `browser` + optional `device` adapter | `partial` | `@vue-godot/device` `PermissionAdapter`, then `OS.get_granted_permissions()` plus local capability checks | Mainly Android for runtime permissions; local checks everywhere | Android permission export settings for mapped names | Unit, html-demo smoke | Query-only; adapter `unknown`/failure falls back locally; never calls `OS.request_permission()` or opens prompts. |
| `navigator.clipboard.readText()` / `writeText()` | `browser` | `partial` | `DisplayServer` clipboard methods | Platforms where DisplayServer exposes text clipboard | Platform clipboard access must be available | Unit, html-demo smoke | Text only; image clipboard and synthesized permission prompts are not provided. |
| `isClipboardSupported()` | `browser` | `partial` | `DisplayServer.has_feature()` | Platforms where DisplayServer exposes text clipboard | Platform clipboard access must be available | Unit | Capability probe only; does not request permission. |
| `navigator.vibrate()` | `browser` | `partial` | `Input.vibrate_handheld()` | Primarily Android/mobile | Android `VIBRATE` export permission | Unit, html-demo smoke | Return value reports accepted pattern, not physical vibration success. |
| `isVibrationSupported()` | `browser` | `partial` | `Input.vibrate_handheld()` presence | Primarily Android/mobile | Android `VIBRATE` export permission | Unit | Capability probe only; physical vibration can still fail by platform policy. |
| `readDeviceMotion()` / `readDeviceOrientation()` | `browser` | `partial` | `Input` accelerometer, gravity, gyroscope, magnetometer | Mobile/device sensor platforms; desktop usually zero values | Platform sensor availability | Unit, html-demo smoke | Snapshot reads only; values are best-effort. |
| Device motion/orientation events | `browser` | `partial` | `Input` accelerometer, gravity, gyroscope, magnetometer | Mobile/device sensor platforms; desktop usually zero values | Platform sensor availability | Unit, html-demo smoke | Orientation is best-effort and sensor availability varies. |

## Plugin-Backed Browser APIs

| API | Owner | Status | Godot backend | Platforms | Permissions/export | Tests | Caveats |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `navigator.geolocation` | `browser` + `device` adapter | `requires-plugin` | `@vue-godot/device` `GeolocationAdapter` | Android, iOS, desktop where an adapter exists | Android location permissions; iOS location plist keys | Unit, html-demo smoke | `navigator.geolocation` is exposed only after an adapter is registered; native Android/iOS plugin integrations are still needed. |
| `navigator.mediaDevices.getUserMedia()` | `browser` + `device` adapter | `requires-plugin` | `@vue-godot/device` `MediaDevicesAdapter` | Android, iOS, desktop where an adapter exists | Camera and microphone export permissions | Unit, html-demo smoke | `navigator.mediaDevices` is exposed only after an adapter is registered; native capture plugins still own device enumeration and permission prompts. |
| `MediaStream` subset | `browser` + `device` adapter | `partial` | Adapter-provided audio/video tracks | Depends on adapter | Same as getUserMedia | Unit, html-demo smoke | Supports stream id/active/track lists and track stop; no browser codec, recorder, or constraint negotiation API yet. |
| `Notification` | `browser` + `device` adapter | `requires-plugin` | `@vue-godot/device` `NotificationAdapter` | Android, iOS, desktop where an adapter exists | Android `POST_NOTIFICATIONS`; platform notification setup | Unit, html-demo smoke | Installed by `installBrowserAPIs()` only after an adapter is registered; native plugins still own delivery, prompts, and platform channels. |

## Device Capability Layer

| API | Owner | Status | Godot backend | Platforms | Permissions/export | Tests | Caveats |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `DeviceCapabilityRegistry` | `device` | `supported` | JavaScript adapter registry | All JS runtimes | None | Unit | Registry only; native capabilities still require registered adapters/plugins. |
| `registerDeviceCapability()` / `isSupported()` / `requireCapability()` | `device` | `supported` | JavaScript adapter registry | All JS runtimes | None | Unit | `isSupported()` returns `false` when no adapter is registered; `requireCapability()` rejects with typed errors. |
| `DeviceCapabilityError` | `device` | `supported` | JavaScript typed error | All JS runtimes | None | Unit | Error codes cover unsupported platform, permission denied, missing plugin, and export misconfiguration. |
| Plugin adapter interfaces | `device` | `supported` | TypeScript contracts | All JS runtimes | Depends on adapter | Type build, unit | Includes generic capability adapters plus geolocation, media devices, notifications, and permissions contracts. |

## Skipped Browser APIs

| API | Owner | Status | Godot backend | Platforms | Permissions/export | Tests | Caveats |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DOM `document` and real element tree | `browser` | `skipped` | None | All | None | N/A | Godot is not a browser. HTML-like components are Vue components, not DOM nodes. |
| Service workers | `browser` | `skipped` | None | All | None | N/A | No browser worker, cache, fetch interception, or lifecycle backend exists. |
| Web workers | `browser` | `skipped` | No safe GodotJS worker story yet | All | None | N/A | Revisit only if GodotJS exposes a safe isolated JS worker runtime. |
| IndexedDB | `browser` | `skipped` | None | All | None | N/A | Use explicit storage APIs until a real transactional storage engine is added. |
| Browser WebRTC API | `browser` | `skipped` | Potential Godot WebRTC classes are not mapped | All | Platform/network setup unknown | N/A | Revisit only with a credible compatibility mapping and tests. |

## HTML Components

All HTML-like components are available through `@vue-godot/html`, `htmlPlugin`,
and lowercase/PascalCase registration. They are marked `partial` until the
production-grade component checklist covers accessibility, focus, keyboard,
controller, touch behavior, and documented style limits. Inline style objects
support the documented Godot-backed subset; unsupported style keys emit a
`[vue-godot/html]` warning once per component/property pair.

| Component/API | Owner | Status | Godot backend | Platforms | Permissions/export | Tests | Caveats |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `<Div>` | `html` | `partial` | Godot containers and style wrappers | All Godot UI targets | None | Unit, html-demo | CSS flex/grid subset only; not a DOM element. |
| `<Span>` | `html` | `partial` | `Label` | All Godot UI targets | None | Unit, html-demo | Text/style subset only. |
| `<ScrollView>` | `html` | `partial` | `ScrollContainer` plus inner `<Div>` content wrapper | All Godot UI targets | None | Unit, html-demo | Scrollbar behavior follows Godot `ScrollContainer`; content layout uses the existing style subset. |
| `<Progress>` | `html` | `partial` | `ProgressBar` | All Godot UI targets | None | Unit, html-demo | Uses Godot `Range` props and native indeterminate mode; not a DOM progress element. |
| `<ActivityIndicator>` | `html` | `partial` | `ProgressBar` indeterminate mode | All Godot UI targets | None | Unit, html-demo | Bar-style busy indicator; spinner visuals are not implemented yet. |
| `<Overlay>` | `html` | `partial` | `PanelContainer` plus inner `<Div>` content wrapper | All Godot UI targets | None | Unit, html-demo | Godot `Control` overlay, not a DOM portal; backdrop input follows Godot `mouse_filter`. |
| `<Modal>` | `html` | `partial` | `Window` | All Godot UI targets | None | Unit, html-demo | Window behavior follows Godot embedded/native subwindow settings; browser focus trapping is not implemented yet. |
| `<Dialog>` | `html` | `partial` | `AcceptDialog` | All Godot UI targets | None | Unit, html-demo | Confirmation dialog subset; button layout and escape handling follow Godot `AcceptDialog`. |
| `<Pressable>` | `html` | `partial` | `PanelContainer` with `Control.gui_input`, focus, and mouse signals | All Godot UI targets | None | Unit, html-demo | Mouse/touch/keyboard/controller activation depends on Godot focused Control input; ARIA-style roles are not implemented yet. |
| `<SafeAreaView>` | `html` | `partial` | `DisplayServer.get_display_safe_area()` plus `MarginContainer` | Android cutouts where Godot reports safe area; desktop/editor usually zero insets | None | Unit, html-demo | Safe-area metrics follow Godot `DisplayServer`; `fallbackInsets` can provide deterministic padding where metrics are unavailable. |
| `<Switch>` | `html` | `partial` | `CheckButton` | All Godot UI targets | None | Unit, html-demo | Binary toggle subset; accessibility metadata is limited. |
| `<Button>` | `html` | `partial` | `Button` | All Godot UI targets | None | Unit, html-demo | Click maps to Godot pressed signal; accessibility is limited. |
| `<Input>` | `html` | `partial` | `LineEdit`, `CheckBox`, `ButtonGroup`, `HSlider` | All Godot UI targets | None | Unit, html-demo | Supports text, password, checkbox, radio, and range subsets. |
| `<Textarea>` | `html` | `partial` | `TextEdit` | All Godot UI targets | None | Unit, html-demo | Text editing subset; browser selection APIs are not implemented. |
| `<Select>` / `<Option>` | `html` | `partial` | `OptionButton` | All Godot UI targets | None | Unit, html-demo | Option model subset; not a native HTML select. |
| `<Img>` | `html` | `partial` | `TextureRect`, `ResourceLoader`, browser blob/data helpers | All Godot UI targets | Asset import/export paths must be valid | Unit, html-demo | Supports Godot paths, relative `res://` resolution, data/blob/remote sources where loaders support them. |
| `<Svg>` | `html` | `partial` | `TextureRect`, SVG/image loaders | All Godot UI targets | Asset import/export paths must be valid | Unit, html-demo | SVG rendering depends on Godot image support and conversion path. |
| `<A>` | `html` | `partial` | `LinkButton` / Godot URI handling | All Godot UI targets | OS URI handling availability | Unit, html-demo | Opens through Godot link behavior; no browser navigation context. |
| `<Audio>` | `html` | `partial` | `AudioStreamPlayer` | Platforms with audio output | Audio asset import/export paths | Unit, html-demo | Browser media element API is not complete. |
| `<Video>` | `html` | `partial` | `VideoStreamPlayer` | Platforms/codecs supported by Godot | Video asset import/export paths | Unit, html-demo | Codec/platform support follows Godot. |
| `<Canvas>` | `html` | `partial` | `Control` | All Godot UI targets | None | Unit, html-demo | No `getContext('2d')`; use Godot drawing through template refs. |
| `htmlPlugin` | `html` | `supported` | Vue plugin registration | All Vue Godot apps | None | Unit, CLI smoke | Registers PascalCase and lowercase aliases. |
| `htmlTags` | `html` | `supported` | Static tag list | Build tooling | Must be kept in Vite config generation | Unit, CLI smoke | Used by Vue compiler custom-element rules. |
| Volar plugin | `html` | `partial` | Volar language service plugin | Editor tooling | VS Code/Volar setup | CLI smoke | Tracks lowercase HTML-like component resolution. |

## Runtime And CLI

| Feature | Owner | Status | Godot backend | Platforms | Permissions/export | Tests | Caveats |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Vue custom renderer | `runtime-tscn` | `partial` | Godot scene tree nodes | All GodotJS targets | None | Unit, lifecycle tests, renderer stress tests, app builds, smoke | Supported Vue features and unsupported browser/DOM assumptions are documented in [runtime renderer support](./runtime.md); real editor/device release validation remains pending. |
| Godot signal event mapping | `runtime-tscn` | `partial` | Godot signals and `Callable` wrappers | All GodotJS targets | None | Unit | Failed signal connects/disconnects warn with the Godot signal, node name, and Vue event prop. Typed signal coverage still depends on Godot typings. |
| Prop removal/reset semantics | `runtime-tscn` | `supported` | Godot `get()` / `set()` | All GodotJS targets | None | Unit | Generic reset cannot infer every Godot-specific default; rejected prop reads/writes warn with the prop name. |
| Static text insertion | `runtime-tscn` | `partial` | Text node placeholders | All GodotJS targets | None | Unit | Non-text static markup is intentionally limited. |
| `vue-godot create` | `cli` | `supported` | Project templates | Local development | Node.js, GodotJS editor | CLI smoke | Generated projects include production export guidance and a non-failing export-setting warning script; production app profiles are still planned. |
| `vue-godot create --html` | `cli` | `supported` | HTML/browser template integration | Local development | Node.js, GodotJS editor | CLI smoke | Template is a starter, not a serious app demo yet, but includes production export guidance and checks. |
| `vue-godot integrate` | `cli` | `supported` | Existing project scaffolding | Local development | Node.js, GodotJS editor | Unit, CLI smoke | Adds production export guidance and a non-failing export-setting warning script; a full doctor command is still planned. |
| `vue-godot gen-types` | `cli` | `supported` | GodotJS generated typings | Local development | GodotJS typings must exist | Unit, CLI smoke | Regenerate when Godot typings change. |
| `@vue-godot/browser/globals` | `browser` | `supported` | TypeScript declarations | Non-DOM Godot TypeScript projects | None | Type compile test | Opt-in global declarations for projects that exclude `lib.dom.d.ts`; default package types avoid global merging conflicts. |
