import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const repoRoot = process.cwd()

function readDoc(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf-8')
}

test('real device release checklist covers required Android and iOS gates', () => {
  const checklist = readDoc('docs/real-device-release.md')

  for (const pattern of [
    /^# Real Device Release Checklist/m,
    /^## Required Evidence/m,
    /^## Common Gate/m,
    /^## Android Release Smoke/m,
    /^## iOS Release Smoke/m,
    /npm run check/,
    /npm run check:serious-examples/,
    /npm run release:preflight[\s\S]*validates real-device evidence/,
    /npm audit --audit-level=moderate/,
    /npm run release:preflight/,
    /VUE_GODOT_REAL_DEVICE_EVIDENCE/,
    /real-device-evidence\.example\.json/,
    /Godot Smoke workflow/,
    /APK\/AAB/,
    /archive, TestFlight, or hosted-device build identifier/,
    /export_presets\.cfg/,
    /dist\/chunks\/\*\.js/,
    /permission prompts and denied states/,
    /adapter states/,
    /missing plugin/,
    /export misconfiguration/,
    /successful native operation/,
    /SafeAreaView/,
    /KeyboardAvoidingView/,
    /Android back handling/,
    /safe area, virtual keyboard, rotation, and text input/,
    /background and foreground/i,
    /deep links[\s\S]*share sheets[\s\S]*notification\s+delivery/,
  ]) {
    assert.match(checklist, pattern)
  }
})

test('release preflight enforces serious example app readiness', () => {
  const preflight = readDoc('scripts/release-preflight.mjs')
  const production = readDoc('docs/production.md')
  const readme = readDoc('README.md')

  for (const pattern of [
    /checkSeriousExampleApps/,
    /check:serious-examples/,
    /skip-serious-examples/,
    /Serious example app check failed/,
  ]) {
    assert.match(preflight, pattern)
  }

  assert.match(production, /serious example app readiness/i)
  assert.match(production, /--skip-serious-examples/)
  assert.match(readme, /serious example app gate fails/i)
  assert.match(readme, /--skip-serious-examples/)
})

test('release preflight enforces real device evidence', () => {
  const preflight = readDoc('scripts/release-preflight.mjs')
  const production = readDoc('docs/production.md')
  const readme = readDoc('README.md')
  const packageJson = JSON.parse(readDoc('package.json'))
  const workflow = readDoc('.github/workflows/publish.yml')

  for (const pattern of [
    /checkRealDeviceEvidence/,
    /readRealDeviceEvidence/,
    /validateRealDeviceEvidence/,
    /realDeviceEvidenceEnvVar/,
    /Real device evidence missing/,
  ]) {
    assert.match(preflight, pattern)
  }

  assert.equal(
    packageJson.scripts['check:real-device-evidence'],
    'node scripts/check-real-device-evidence.mjs',
  )
  assert.match(production, /check:real-device-evidence/)
  assert.match(production, /VUE_GODOT_REAL_DEVICE_EVIDENCE/)
  assert.match(readme, /check:real-device-evidence/)
  assert.match(readme, /real-device-evidence\.json/)
  assert.match(workflow, /real_device_evidence_path/)
  assert.match(workflow, /VUE_GODOT_REAL_DEVICE_EVIDENCE/)
})

test('Godot smoke gate covers serious example apps', () => {
  const smokeScript = readDoc('scripts/smoke-godot.mjs')
  const preflight = readDoc('scripts/release-preflight.mjs')
  const workflow = readDoc('.github/workflows/godot-smoke.yml')
  const readme = readDoc('README.md')

  for (const pattern of [
    /exampleSmokeApps/,
    /native-app-demo/,
    /game-ui-demo/,
    /\$\{app\.id\} smoke passed/,
  ]) {
    assert.match(smokeScript, pattern)
  }

  for (const pattern of [
    /\[smoke-godot\] native-app-demo smoke passed/,
    /\[smoke-godot\] game-ui-demo smoke passed/,
  ]) {
    assert.match(preflight, pattern)
  }

  for (const pattern of [
    /apps\/native-app-demo\/\*\*/,
    /apps\/game-ui-demo\/\*\*/,
  ]) {
    assert.match(workflow, pattern)
  }

  assert.match(readme, /serious example apps/)
  assert.match(readme, /native-app-demo/)
  assert.match(readme, /game-ui-demo/)
})

test('release documentation links the real device checklist', () => {
  const linkedDocs = [
    'README.md',
    'docs/production.md',
    'docs/platforms/android.md',
    'docs/platforms/ios.md',
  ]

  for (const relativePath of linkedDocs) {
    assert.match(
      readDoc(relativePath),
      /real device release checklist/i,
      `${relativePath} must link the real device release checklist`,
    )
  }
})

test('serious example app criteria are documented and linked', () => {
  const criteria = readDoc('docs/example-apps.md')

  for (const pattern of [
    /^# Serious Example App Criteria/m,
    /^## Design Scope/m,
    /SDK reference examples/,
    /implementation-focused/,
    /^## Native App Demo/m,
    /multi-screen routing/,
    /network loading, failure, retry, and reachability\/offline states/,
    /permission query\/request-denied flows/,
    /^## Game UI Demo/m,
    /Godot scene with Vue-rendered HUD or menu UI/,
    /controller, keyboard, and touch-oriented navigation paths/,
    /pause, settings, and inventory or loadout workflows/,
    /^## Verification/m,
    /test\/fixture-apps\.test\.mjs/,
    /npm run check/,
  ]) {
    assert.match(criteria, pattern)
  }

  for (const relativePath of ['README.md', 'docs/production.md', 'TODO.md']) {
    assert.match(
      readDoc(relativePath),
      /docs\/example-apps\.md|example-apps\.md|example app criteria/i,
      `${relativePath} must link the serious example app criteria`,
    )
  }
})
