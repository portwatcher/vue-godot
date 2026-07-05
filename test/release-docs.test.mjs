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
    /GitHub Actions run URL[\s\S]*portwatcher\/vue-godot/,
    /workflow name `Check`/,
    /workflow name `Godot Smoke`/,
    /Release Preflight/,
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
  const packageJson = JSON.parse(readDoc('package.json'))

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
  assert.equal(
    packageJson.scripts['check:serious-examples'],
    'node scripts/check-serious-example-apps.mjs',
  )
  assert.match(packageJson.scripts.check, /npm run check:serious-examples/)
})

test('release preflight validates package export targets in tarballs', () => {
  const preflight = readDoc('scripts/release-preflight.mjs')

  for (const pattern of [
    /collectPackageExportFiles/,
    /packageJson\.exports/,
    /collectPackageExportFiles\(packageJson\.exports\)/,
    /package tarball missing \$\{expectedFile\}/,
  ]) {
    assert.match(preflight, pattern)
  }
})

test('release preflight enforces real device evidence', () => {
  const preflight = readDoc('scripts/release-preflight.mjs')
  const production = readDoc('docs/production.md')
  const readme = readDoc('README.md')
  const packageJson = JSON.parse(readDoc('package.json'))
  const workflow = readDoc('.github/workflows/publish.yml')
  const preflightWorkflow = readDoc('.github/workflows/release-preflight.yml')
  const example = JSON.parse(readDoc('docs/real-device-evidence.example.json'))

  for (const pattern of [
    /checkRealDeviceEvidence/,
    /currentReleasePackageVersions/,
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
  assert.match(production, /Release Preflight/)
  assert.match(readme, /Release Preflight/)
  assert.match(preflightWorkflow, /name: Release Preflight/)
  assert.match(preflightWorkflow, /id-token: write/)
  assert.match(preflightWorkflow, /npm run release:preflight/)
  assert.match(preflightWorkflow, /VUE_GODOT_REAL_DEVICE_EVIDENCE/)
  assert.equal(example.checkRunConclusion, 'success')
  assert.equal(example.godotSmokeRunConclusion, 'success')
  assert.equal(example.checkRunWorkflowName, 'Check')
  assert.equal(example.godotSmokeRunWorkflowName, 'Godot Smoke')
  assert.equal(example.checkRunCommit, example.commit)
  assert.equal(example.godotSmokeRunCommit, example.commit)
  assert.equal('releasePreflightRunUrl' in example, false)
})

test('release readiness audit documents final removal blockers', () => {
  const readiness = readDoc('scripts/release-readiness.mjs')
  const production = readDoc('docs/production.md')
  const readme = readDoc('README.md')
  const todo = readDoc('TODO.md')
  const packageJson = JSON.parse(readDoc('package.json'))
  const example = JSON.parse(
    readDoc('docs/release-readiness-evidence.example.json'),
  )

  for (const pattern of [
    /release-readiness evidence missing/,
    /collectUncheckedTodoItems/,
    /checkCleanWorktree/,
    /collectPublicSurfaceAuditErrors/,
    /currentReleasePackageVersions/,
    /validateRealDeviceEvidence/,
    /release-evidence-utils/,
    /releasePreflightWarningCount must be 0/,
    /working tree must be clean for final release readiness/,
    /public warning markers still present/,
  ]) {
    assert.match(readiness, pattern)
  }

  assert.equal(
    packageJson.scripts['check:public-surface'],
    'node scripts/public-surface-audit.mjs',
  )
  assert.equal(
    packageJson.scripts['check:serious-examples'],
    'node scripts/check-serious-example-apps.mjs',
  )
  assert.match(packageJson.scripts.check, /npm run check:serious-examples/)
  assert.equal(
    packageJson.scripts['release:readiness'],
    'node scripts/release-readiness.mjs',
  )
  assert.match(production, /check:public-surface/)
  assert.match(production, /release:readiness/)
  assert.match(readme, /check:public-surface/)
  assert.match(production, /GitHub Actions run URLs for/)
  assert.match(production, /Release Preflight/)
  assert.match(production, /Godot Smoke/)
  assert.match(production, /release-readiness-evidence\.example\.json/)
  assert.match(readme, /release:readiness/)
  assert.match(readme, /release-readiness-evidence\.json/)
  assert.match(todo, /release:readiness/)
  assert.equal(example.releasePreflightRunConclusion, 'success')
  assert.equal(example.releasePreflightRunWorkflowName, 'Release Preflight')
  assert.equal(example.releasePreflightWarningCount, 0)
  assert.equal(example.releasePreflightRunCommit, example.commit)
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
