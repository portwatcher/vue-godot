# iOS Simulator Smoke - 2026-07-07

Release-candidate context:

- Commit under test: local working tree after `69d2e64`, with the unattended release-check launch hook.
- Target: iPhone 17 simulator, iOS 26.5, Xcode 26.6.
- Export preset: `iOS Release` using Godot project-only Xcode export.
- Runtime: locally built GodotJS iOS simulator template using JavaScriptCore.
- App executable SHA-256: `265e7178154d3b6cc9576491d8396c7aa7561c15ba27e080a10e7317331648f5`.

Important caveat: the published GodotJS 4.4 V8 iOS release assets provide
device `arm64` static libraries, not simulator slices. This simulator smoke used
a locally built JavaScriptCore simulator slice and linked `JavaScriptCore.framework`.
It verifies the iOS export project, simulator launch, app rendering, and
production-profile API behavior on iOS Simulator. It does not replace a signed
physical-device V8 run.

## Build And Launch

The Vue bundle was rebuilt:

```bash
npm run build --workspace=native-app-demo
```

The Godot project-only iOS export succeeded:

```bash
GODOT_BIN="$(npm run -s setup:godotjs -- --print-bin)"
"$GODOT_BIN" --headless --path apps/native-app-demo --export-debug "iOS Release" build/ios/native-app-demo
```

The generated Xcode project was built for the iPhone 17 simulator after applying
the local simulator-only project adjustments:

- remove generated `MoltenVK.xcframework` and `MetalFX.framework` references not
  present in the local simulator package/SDK;
- link `JavaScriptCore.framework` for the JavaScriptCore-backed simulator slice.

```bash
xcodebuild \
  -project apps/native-app-demo/build/ios/native-app-demo.xcodeproj \
  -scheme native-app-demo \
  -configuration Debug \
  -destination 'platform=iOS Simulator,name=iPhone 17' \
  -derivedDataPath /tmp/vue-godot-ios-derived \
  CODE_SIGNING_ALLOWED=NO \
  'OTHER_LDFLAGS=$(LD_CLASSIC_$(XCODE_VERSION_ACTUAL)) -framework JavaScriptCore' \
  build
```

The app was launched with the unattended release-check hook and an 8 second
delay. During the delay, Settings was launched to background the app, then the
native demo was foregrounded again:

```bash
SIMCTL_CHILD_VUE_GODOT_RELEASE_CHECKS=1 \
SIMCTL_CHILD_VUE_GODOT_RELEASE_CHECKS_DELAY_MS=8000 \
xcrun simctl launch --terminate-running-process --console \
  6705F08F-38D3-4650-8AAE-BD4715D180ED \
  org.vuegodot.nativeappdemo
```

## Evidence

![iOS simulator home screen](./evidence/ios-simulator-home-2026-07-07.png)

[Release check log excerpt](./evidence/ios-simulator-release-checks-2026-07-07.log)

Release-check summary:

```text
[JS] [native-release-checks] summary passed=18 info=6 failed=0
[JS] [native-release-checks] pass storage restart marker: localStorage restored and sessionStorage reset for this runtime
[JS] [native-release-checks] pass fetch: HEAD https://example.com/ -> 200
[JS] [native-release-checks] pass checkNetworkReachability: example.com reachable
[JS] [native-release-checks] pass navigator.clipboard: write/read succeeded
[JS] [native-release-checks] pass readDeviceMotion: accel=0.00,0.00,0.00 absolute=false
[JS] [native-release-checks] pass background/foreground lifecycle: blur=1 focus=1
[JS] [native-release-checks] native-app-demo passed
```

Informational rows were expected for plugin-backed APIs on this simulator:
permissions, geolocation, media devices, `getUserMedia`, geolocation calls, and
Android Back handling.
