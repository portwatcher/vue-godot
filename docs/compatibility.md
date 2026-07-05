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

## Compatibility Strategy

Vue Godot chooses compatibility backends with these rules:

- Prefer best-effort web-compatible APIs where a Godot or JavaScript backend can
  preserve the useful browser shape closely enough for app code. Document the
  entry as `partial` when behavior is useful but not spec-complete.
- Prefer explicit `@vue-godot/device` adapters for APIs that require native
  plugins, runtime permissions, platform channels, or app-specific setup. Do not
  install browser-shaped globals for those APIs until a real adapter is
  registered.
- Wrapping stable Godot modules and classes is acceptable when the wrapper keeps
  Godot semantics visible in the backend, platform, permission, and caveat
  fields.
- Wrapping stable Godot plugins or native Android/iOS plugins is acceptable when
  core Godot does not expose the capability. The plugin, export settings,
  permissions, and real-device validation remain part of the compatibility row
  and release checklist.
- Mark APIs as `skipped` when a compatibility layer would mislead users into
  assuming a browser DOM, worker, storage, or native capability that Godot does
  not actually provide.

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
| `history` / `location` / `PopStateEvent` | `browser` | `supported` | In-memory history stack | All JS runtimes | None | Unit | Enables SPA routers; no actual OS/window navigation; see the [routing guide](./routing.md) for architecture patterns. |
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
| `navigator.geolocation` | `browser` + `device` adapter | `requires-plugin` | `@vue-godot/device` `GeolocationAdapter` | Android, iOS, desktop where an adapter exists | Android location permissions; iOS location plist keys | Unit, html-demo smoke | `navigator.geolocation` is exposed only after an adapter is registered; Android/iOS plugins can use `@vue-godot/device/geolocation` to bridge native location methods. |
| `navigator.mediaDevices.getUserMedia()` | `browser` + `device` adapter | `requires-plugin` | `@vue-godot/device` `MediaDevicesAdapter` | Android, iOS, desktop where an adapter exists | Camera and microphone export permissions | Unit, html-demo smoke | `navigator.mediaDevices` is exposed only after an adapter is registered; native capture plugins still own device enumeration and permission prompts. |
| `MediaStream` subset | `browser` + `device` adapter | `partial` | Adapter-provided audio/video tracks | Depends on adapter | Same as getUserMedia | Unit, html-demo smoke | Supports stream id/active/track lists and track stop; no browser codec, recorder, or constraint negotiation API yet. |
| `Notification` | `browser` + `device` adapter | `requires-plugin` | `@vue-godot/device` `NotificationAdapter` | Android, iOS, desktop where an adapter exists | Android `POST_NOTIFICATIONS`; platform notification setup | Unit, html-demo smoke | Installed by `installBrowserAPIs()` only after an adapter is registered; native plugins still own delivery, prompts, and platform channels. |

## Device Capability Layer

| API | Owner | Status | Godot backend | Platforms | Permissions/export | Tests | Caveats |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `DeviceCapabilityRegistry` | `device` | `supported` | JavaScript adapter registry | All JS runtimes | None | Unit | Registry only; native capabilities still require registered adapters/plugins. |
| `registerDeviceCapability()` / `isSupported()` / `requireCapability()` | `device` | `supported` | JavaScript adapter registry | All JS runtimes | None | Unit | `isSupported()` returns `false` when no adapter is registered; `requireCapability()` rejects with typed errors. |
| `DeviceCapabilityError` | `device` | `supported` | JavaScript typed error | All JS runtimes | None | Unit | Error codes cover unsupported platform, permission denied, missing plugin, and export misconfiguration. |
| Plugin adapter interfaces | `device` | `supported` | TypeScript contracts | All JS runtimes | Depends on adapter | Type build, unit | Includes generic capability adapters plus deep links, geolocation, media devices, notifications, permissions, and share sheet contracts. |
| Adapter type guards | `device` | `supported` | JavaScript shape guards | All JS runtimes | None | Unit | Includes `isDeepLinkAdapter()`, `isNotificationAdapter()`, and `isShareAdapter()` for registry narrowing. |
| `@vue-godot/device/geolocation` bridge | `device` | `supported` | JavaScript adapter bridge for native Android/iOS/location plugins | Android, iOS, desktop where a plugin exists | Android location permissions; iOS location plist keys; plugin export setup | Unit, html-demo smoke | Normalizes native plugin positions to `GeolocationAdapter` and maps platform, permission, missing-plugin, and export setup failures to typed capability states. |
| `@vue-godot/device/clipboard` helpers | `device` | `partial` | `DisplayServer.clipboard_get()`, `clipboard_set()`, `clipboard_has()`, `clipboard_get_image()`, `clipboard_has_image()`, primary clipboard methods | Platforms where Godot `DisplayServer` exposes clipboard features | Platform clipboard access must be available | Unit, browser/html-demo smoke through `navigator.clipboard` | Text read/write and image read are exposed; image write is not exposed by current Godot typings, and browser `ClipboardItem` is not synthesized. |
| `@vue-godot/device/haptics` helpers | `device` | `partial` | `Input.vibrate_handheld()`, `Input.start_joy_vibration()`, `Input.stop_joy_vibration()`, `Input.get_joy_vibration_strength()`, `Input.get_joy_vibration_duration()` | Handheld vibration primarily Android/mobile; joypad vibration where Godot/platform/controller support it | Android `VIBRATE` export permission for handheld vibration | Unit, browser/html-demo smoke through `navigator.vibrate()` | Low-level haptics helpers only; physical support depends on platform policy, drivers, and connected controllers. |
| `@vue-godot/device/microphone` helpers | `device` | `partial` | `AudioServer`, `AudioStreamMicrophone`, `AudioStreamPlayer`, `AudioEffectCapture` | Platforms where Godot audio input is enabled | `ProjectSettings.audio/driver/enable_input`, OS privacy prompts, and export permissions remain app/plugin responsibilities | Unit | Low-level stream/player/capture helpers only; no native plugin fallback, runtime permission prompt, scene-tree attachment, recording encoder, or browser `MediaRecorder` API. |
| `@vue-godot/device/permissions` helpers | `device` | `partial` | `OS.request_permission()`, `OS.request_permissions()`, `OS.get_granted_permissions()`, `OS.revoke_granted_permissions()`, `MainLoop.on_request_permissions_result` | Android runtime permission APIs; macOS sandbox granted-folder list/revoke where Godot exposes it | Android export permissions; macOS sandbox entitlements and file-dialog flow; iOS/visionOS prompts remain plugin-owned | Unit | Low-level Godot helpers only; no browser prompt integration, no Android manifest editing, and no general iOS/visionOS permission prompt backend. |
| `@vue-godot/device/sensors` helpers | `device` | `partial` | `Input.get_accelerometer()`, `Input.get_gravity()`, `Input.get_gyroscope()`, `Input.get_magnetometer()` | Mobile/device sensor platforms; desktop/editor usually zero vectors | Platform sensor availability | Unit, browser/html-demo smoke through wrappers | Snapshot reads only; motion/orientation math is best-effort, and browser-style events remain in `@vue-godot/browser`. |
| `@vue-godot/device/system` platform helpers | `device` | `partial` | `OS.get_name()`, `OS.get_distribution_name()`, `OS.get_version()`, `OS.get_model_name()`, `OS.has_feature()`, locale/userfs/debug/sandbox helpers, `DisplayServer.get_name()` | All Godot JS runtimes where OS/DisplayServer expose data | None | Unit | Platform names and feature tags follow Godot; custom engine builds can report additional names/tags. |
| `@vue-godot/device/system` lifecycle helpers | `device` | `partial` | `DisplayServer.window_set_window_event_callback()` | Desktop, Android, editor; exact events depend on platform/window backend | None | Unit | Normalizes focus, blur, close request, Android back request, mouse enter/exit, DPI change, and titlebar change. Godot exposes one callback slot per window; this helper owns that slot while listeners are registered. Mobile pause/resume notifications are not synthesized. |
| `openExternalUrl()` | `device` | `partial` | `OS.shell_open()` | Platforms where Godot can open OS/browser URIs | Platform URI handling availability | Unit | Opens outgoing URLs/files through the OS; this is not incoming deep-link handling. |
| `DeepLinkAdapter` / `readInitialOpenUrl()` / `onOpenUrl()` | `device` | `requires-plugin` | Registered native/Godot plugin adapter | Android/iOS/desktop where an adapter exists | URL scheme, Android intent, iOS universal/app link, and export/plugin setup | Unit | Core Godot does not provide a portable incoming URL event stream; plugins own launch/runtime URL delivery. |
| `ShareAdapter` / `share()` | `device` | `requires-plugin` | Registered native/Godot plugin adapter | Android/iOS/desktop where an adapter exists | Native plugin and platform share setup | Unit | Core Godot does not expose a portable native share sheet API; adapters own file URI/content provider handling. |
| `NotificationAdapter` / `showNativeNotification()` | `device` | `requires-plugin` | Registered native/Godot plugin adapter | Android/iOS/desktop where an adapter exists | Android notification permission/channel setup, iOS notification setup, platform plugin setup | Unit, browser wrapper smoke | Direct device helper; browser-shaped `Notification` remains in `@vue-godot/browser`. Native plugins own delivery, prompts, and channels. |

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
and lowercase/PascalCase registration. Control-backed components support
tooltip-backed labels and hints through `accessibilityLabel`, `ariaLabel`,
`aria-label`, `accessibilityHint`, and `title` where those names do not conflict
with component-specific props. Native ARIA role mapping is not implemented
because the supported Godot bindings do not expose a portable Control role
property yet. Focusable controls support mount-time `autoFocus` / `autofocus`
through Godot `grab_focus()` and explicit Godot focus graph paths through
`focusNext`, `focusPrevious`, and directional `focusNeighbor*` props. The same
focusable controls support opt-in `minTouchTarget` sizing for touch and
controller-friendly hit rects. `<Overlay>`, `<Modal>`, and `<Dialog>` support
Godot-native focus containment and restoration through `trapFocus` and
`restoreFocus`; browser tab-order emulation is not implemented. Keyboard
shortcuts, controller activation, and escape/back handling are Godot
input-action patterns (`ui_accept`, `ui_cancel`, and project-defined actions),
not DOM keyboard events. They are marked `partial` until the production-grade
component checklist covers role mapping and documented style limits. Inline
style objects support the documented Godot-backed subset; unsupported style
keys emit a `[vue-godot/html]` warning once per component/property pair.

| Component/API | Owner | Status | Godot backend | Platforms | Permissions/export | Tests | Caveats |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `<Div>` | `html` | `partial` | Godot containers and style wrappers | All Godot UI targets | None | Unit, html-demo | CSS flex/grid subset with margin, padding, color/texture backgrounds, border, radius, percent-size anchors, and basic transform wrappers; not a DOM element. |
| `<Span>` | `html` | `partial` | `Label` | All Godot UI targets | None | Unit, html-demo | Text/style subset with registered/local font family loading; not a DOM inline layout box. |
| `<ScrollView>` | `html` | `partial` | `ScrollContainer` plus inner `<Div>` content wrapper | All Godot UI targets | None | Unit, html-demo | Scrollbar behavior follows Godot `ScrollContainer`; content layout uses the existing style subset. |
| `<VirtualList>` | `html` | `partial` | `ScrollContainer` plus fixed-height row wrappers and spacer `Control` nodes | All Godot UI targets | None | Unit, html-demo | Fixed row heights only; dynamic-height measurement and horizontal virtualization are not implemented. |
| `<Progress>` | `html` | `partial` | `ProgressBar` | All Godot UI targets | None | Unit, html-demo | Uses Godot `Range` props and native indeterminate mode; not a DOM progress element. |
| `<ActivityIndicator>` | `html` | `partial` | `ProgressBar` indeterminate mode | All Godot UI targets | None | Unit, html-demo | Bar-style busy indicator; spinner visuals are not implemented yet. |
| `<Overlay>` | `html` | `partial` | `PanelContainer` plus inner `<Div>` content wrapper | All Godot UI targets | None | Unit, html-demo | Godot `Control` overlay, not a DOM portal; backdrop input follows Godot `mouse_filter`; focus containment uses the backdrop root as a Godot focus sentinel, not DOM tab-order traversal. |
| `<Modal>` | `html` | `partial` | `Window` | All Godot UI targets | None | Unit, html-demo | Window behavior follows Godot embedded/native subwindow settings; `trapFocus`/`restoreFocus` use Godot window focus and the previous viewport focus owner. |
| `<Dialog>` | `html` | `partial` | `AcceptDialog` | All Godot UI targets | None | Unit, html-demo | Confirmation dialog subset; button layout and escape handling follow Godot `AcceptDialog`; `trapFocus`/`restoreFocus` use Godot window focus and the previous viewport focus owner. |
| `<Pressable>` | `html` | `partial` | `PanelContainer` with `Control.gui_input`, focus, and mouse signals | All Godot UI targets | None | Unit, html-demo | Mouse/touch/keyboard/controller activation depends on Godot focused Control input; supports `autoFocus`, focus traversal props, and `minTouchTarget`; labels and hints map to `tooltip_text`; ARIA-style roles are not implemented yet. |
| `<Form>` | `html` | `partial` | `PanelContainer` plus inner `<Div>` content wrapper | All Godot UI targets | None | Unit, html-demo | Emits `submit` from `ui_accept` and optional `reset` from `ui_cancel`; supports shared focus and touch target props; not a browser DOM form and does not serialize controls. |
| `<Label>` | `html` | `partial` | `Label` plus optional inner `<Div>` wrapper | All Godot UI targets | None | Unit, html-demo | Groups label text with slot content visually; browser `for` / `id` focus binding is not implemented; labels and hints map to `tooltip_text`. |
| `<Screen>` | `html` | `partial` | `Control` / `PanelContainer` plus inner `<Div>` content wrapper | All Godot UI targets | None | Unit, html-demo | Full-parent app screen surface; not tied to OS windows or browser navigation. |
| `<ScreenStack>` | `html` | `partial` | `<Screen>` plus route-name named-slot rendering | All Godot UI targets | None | Unit, html-demo | In-memory native-style screen stack helper; see the [routing guide](./routing.md) for Vue Router, deep links, Android back handling, and tab/modal route examples. |
| `<SafeAreaView>` | `html` | `partial` | `DisplayServer.get_display_safe_area()` plus `MarginContainer` | Android cutouts where Godot reports safe area; desktop/editor usually zero insets | None | Unit, html-demo | Safe-area metrics follow Godot `DisplayServer`; `fallbackInsets` can provide deterministic padding where metrics are unavailable. |
| `<KeyboardAvoidingView>` | `html` | `partial` | `DisplayServer.virtual_keyboard_get_height()` plus `MarginContainer` | Android, iOS, and Web exports where Godot reports virtual keyboard height; desktop/editor usually zero height | None | Unit, html-demo | Default padding behavior is most reliable inside Godot containers; position/height modes depend on parent layout and explicit sizing. |
| `<Switch>` | `html` | `partial` | `CheckButton` | All Godot UI targets | None | Unit, html-demo | Binary toggle subset; supports `autoFocus`, focus traversal props, `minTouchTarget`, and tooltip-backed labels/hints. |
| `<Button>` | `html` | `partial` | `Button` | All Godot UI targets | None | Unit, html-demo | Click maps to Godot pressed signal; supports `autoFocus`, focus traversal props, `minTouchTarget`, and tooltip-backed labels/hints. |
| `<Input>` | `html` | `partial` | `LineEdit`, `CheckBox`, `ButtonGroup`, `HSlider` | All Godot UI targets | None | Unit, html-demo | Supports text, password, checkbox, radio, and range subsets; supports `autoFocus`, focus traversal props, `minTouchTarget`, and tooltip-backed labels/hints. |
| `<Textarea>` | `html` | `partial` | `TextEdit` | All Godot UI targets | None | Unit, html-demo | Text editing subset with `autoFocus`, focus traversal props, `minTouchTarget`, and tooltip-backed labels/hints; browser selection APIs are not implemented. |
| `<Select>` / `<Option>` | `html` | `partial` | `OptionButton` | All Godot UI targets | None | Unit, html-demo | Option model subset with `autoFocus`, focus traversal props, `minTouchTarget`, and tooltip-backed labels/hints; not a native HTML select. |
| `<Img>` | `html` | `partial` | `TextureRect`, `ResourceLoader`, browser blob/data helpers | All Godot UI targets | Asset import/export paths must be valid | Unit, html-demo | Supports Godot paths, relative `res://` resolution, data/blob/remote sources where loaders support them; `alt` falls back to `tooltip_text`. |
| `<CameraView>` and camera snapshot helpers | `html` | `partial` | `CameraServer`, `CameraFeed`, `CameraTexture`, `TextureRect`, `Texture2D.get_image()` | Platforms where Godot reports camera feeds and exposes texture images | Camera export permissions and native plugin setup remain app responsibilities | Unit, html-demo | Previews a selected camera feed through `CameraTexture`; `captureCameraImage()` / `captureCameraTextureImage()` expose best-effort Godot image snapshots. No permission prompt, image file save flow, native still-photo pipeline, or plugin fallback is bundled. |
| `<Svg>` | `html` | `partial` | `TextureRect`, SVG/image loaders | All Godot UI targets | Asset import/export paths must be valid | Unit, html-demo | SVG rendering depends on Godot image support and conversion path; `alt` falls back to `tooltip_text`. |
| `<A>` | `html` | `partial` | `LinkButton` / Godot URI handling | All Godot UI targets | OS URI handling availability | Unit, html-demo | Opens through Godot link behavior; supports shared focus and touch target props; no browser navigation context; `href` falls back to tooltip hint text when enabled. |
| `<Audio>` | `html` | `partial` | `AudioStreamPlayer` | Platforms with audio output | Audio asset import/export paths | Unit, html-demo | Browser media element API is not complete. |
| Microphone capture UI | `html` | `skipped` | None | All | Use adapter-backed `navigator.mediaDevices.getUserMedia({ audio: true })` for capture | Docs | No `<MicrophoneRecorder>` component is provided; native plugins own permission prompts, capture format, recording, encoding, and cleanup. |
| `<Video>` | `html` | `partial` | `VideoStreamPlayer` | Platforms/codecs supported by Godot | Video asset import/export paths | Unit, html-demo | Codec/platform support follows Godot. |
| `<Canvas>` | `html` | `partial` | `Control` | All Godot UI targets | None | Unit, html-demo | No `getContext('2d')`; use Godot drawing through template refs. |
| `htmlPlugin` | `html` | `supported` | Vue plugin registration | All Vue Godot apps | None | Unit, CLI smoke | Registers PascalCase and lowercase aliases. |
| `htmlTags` | `html` | `supported` | Static tag list | Build tooling | Must be kept in Vite config generation | Unit, CLI smoke | Used by Vue compiler custom-element rules. |
| Volar plugin and HTML component globals | `html` | `supported` | Volar language service plugin plus `@vue/runtime-core` `GlobalComponents` augmentation | Editor tooling | VS Code/Volar setup | Type compile test, CLI smoke | PascalCase and lowercase HTML-like tags resolve to the same component prop types, including `HtmlStyle` style props. |

## Runtime And CLI

| Feature | Owner | Status | Godot backend | Platforms | Permissions/export | Tests | Caveats |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Vue custom renderer | `runtime-tscn` | `partial` | Godot scene tree nodes | All GodotJS targets | None | Unit, lifecycle tests, renderer stress tests, app builds, smoke | Supported Vue features and unsupported browser/DOM assumptions are documented in [runtime renderer support](./runtime.md); real editor/device release validation remains pending. |
| Godot signal event mapping | `runtime-tscn` | `partial` | Godot signals and `Callable` wrappers | All GodotJS targets | None | Unit | Failed signal connects/disconnects warn with the Godot signal, node name, and Vue event prop. Typed signal coverage still depends on Godot typings. |
| Prop removal/reset semantics | `runtime-tscn` | `supported` | Godot `get()` / `set()` | All GodotJS targets | None | Unit | Generic reset cannot infer every Godot-specific default; rejected prop reads/writes warn with the prop name. |
| Static text insertion | `runtime-tscn` | `partial` | Text node placeholders | All GodotJS targets | None | Unit | Non-text static markup is intentionally limited. |
| `vue-godot create` | `cli` | `supported` | Project templates | Local development | Node.js, GodotJS editor | CLI smoke, unit | Generated projects include production export guidance and a non-failing export-setting check backed by `vue-godot doctor --exports-only`; `--device` adds `@vue-godot/device`; `create app` and `create game-ui` provide named starter profiles; `--router`, `--storage`, `--network`, and `--device-api` scaffold optional starter modules. |
| `vue-godot create --html` | `cli` | `supported` | HTML/browser template integration | Local development | Node.js, GodotJS editor | CLI smoke, unit | Template is a starter, not a serious app demo yet, but includes browser/device/html dependencies, production export guidance, and checks. |
| `vue-godot integrate` | `cli` | `supported` | Existing project scaffolding | Local development | Node.js, GodotJS editor | Unit, CLI smoke | Adds production export guidance and the same doctor-backed export-setting check used by generated projects; `--device` can be used by itself or with `--html`. |
| `vue-godot gen-types` | `cli` | `supported` | GodotJS generated typings | Local development | GodotJS typings must exist | Unit, CLI smoke | Generates method-filtered Godot node `GlobalComponents` types for `@vue/runtime-core` and `vue`, plus a no-`any` Vue SFC shim. Regenerate when Godot typings change. |
| `vue-godot doctor` | `cli` | `supported` | Local filesystem diagnostics | Local development and release review | Node.js, package installs, GodotJS typings, export presets, plugin-backed API setup | Unit | Static guardrail only; warnings must still be validated in the Godot editor and on target devices. |
| `@vue-godot/browser/globals` | `browser` | `supported` | TypeScript declarations | Non-DOM Godot TypeScript projects | None | Type compile test | Opt-in global declarations for projects that exclude `lib.dom.d.ts`; default package types avoid global merging conflicts. |
