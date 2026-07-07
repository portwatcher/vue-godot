const iosSimulatorPlatformArgs =
  "--artifact 'iOS simulator Debug app executable sha256:265e7178154d3b6cc9576491d8396c7aa7561c15ba27e080a10e7317331648f5 (GodotJS JavaScriptCore simulator slice)' --evidence-url https://github.com/portwatcher/vue-godot/blob/fe8474267042c3d3ec53ffc455425efca49d1f8a/apps/native-app-demo/docs/ios-simulator-smoke-2026-07-07.md --export-preset 'iOS Release' --device 'iPhone 17 simulator' --os 'iOS 26.5 (Xcode 26.6 simulator runtime)' --orientation 'landscape app orientation on portrait simulator screen' --locale 'default simulator locale' --test-target simulator"

export function iosSimulatorPlatformPassCommand({
  expectedCommit,
  platformEvidencePath,
}) {
  return `npm run release:record-platform-evidence -- --platform ios --platform-evidence ${platformEvidencePath} ${iosSimulatorPlatformArgs} --pass safe-area-keyboard-rotation-text-input --summary-output release/platform-evidence-summary.json --expected-commit ${expectedCommit}`
}

export function iosSimulatorPlatformPassRemainingCommand({
  expectedCommit,
  platformEvidencePath,
}) {
  return `npm run release:record-platform-evidence -- --platform ios --platform-evidence ${platformEvidencePath} ${iosSimulatorPlatformArgs} --pass-remaining --pass-remaining-confirmation <confirm-all-remaining-must-pass-checks-after-testing> --summary-output release/platform-evidence-summary.json --expected-commit ${expectedCommit}`
}
