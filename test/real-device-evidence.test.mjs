import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import {
  readRealDeviceEvidence,
  requiredRealDeviceChecks,
  resolveRealDeviceEvidencePath,
  validateRealDeviceEvidence,
} from '../scripts/real-device-evidence.mjs'
import {
  currentReleasePackageVersions,
  releasePackageConfigs,
} from '../scripts/release-utils.mjs'

const repoRoot = process.cwd()

function platformEvidence(platform) {
  return {
    artifact:
      platform === 'android'
        ? 'vue-godot-android-release.aab'
        : 'TestFlight build 1',
    exportPreset: platform === 'android' ? 'Android Release' : 'iOS Release',
    deviceModel:
      platform === 'android' ? 'Pixel hosted device' : 'iPhone hosted device',
    osVersion: platform === 'android' ? 'Android 15' : 'iOS 18',
    orientation: 'portrait and landscape',
    locale: 'en-US',
    selectedApis: ['fetch', 'navigator.permissions', 'SafeAreaView'],
    passedChecks: [...requiredRealDeviceChecks[platform]],
    skippedChecks: {},
  }
}

function validEvidence() {
  return {
    commit: '0123456789abcdef0123456789abcdef01234567',
    packageVersions: Object.fromEntries(
      releasePackageConfigs.map((config) => [config.name, '0.0.0']),
    ),
    godotJsVersion: 'GodotJS 1.0.0-2 / Godot 4.4.x',
    checkRunUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
    checkRunWorkflowName: 'Check',
    checkRunCommit: '0123456789abcdef0123456789abcdef01234567',
    checkRunConclusion: 'success',
    godotSmokeRunUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/2',
    godotSmokeRunWorkflowName: 'Godot Smoke',
    godotSmokeRunCommit: '0123456789abcdef0123456789abcdef01234567',
    godotSmokeRunConclusion: 'success',
    android: platformEvidence('android'),
    ios: platformEvidence('ios'),
  }
}

test('real device evidence accepts a complete Android and iOS sign-off', () => {
  const evidence = validEvidence()

  assert.deepEqual(
    validateRealDeviceEvidence(evidence, {
      expectedCommit: '0123456789abcdef0123456789abcdef01234567',
      expectedPackageVersions: evidence.packageVersions,
    }),
    [],
  )
})

test('real device evidence requires every platform check to pass or be skipped with a reason', () => {
  const evidence = validEvidence()
  evidence.android.passedChecks = evidence.android.passedChecks.filter(
    (check) => check !== 'android-back-handling',
  )

  assert.match(
    validateRealDeviceEvidence(evidence).join('\n'),
    /android-back-handling/,
  )

  evidence.android.skippedChecks = {
    'android-back-handling': 'Release profile does not register back handling.',
  }

  assert.deepEqual(validateRealDeviceEvidence(evidence), [])
})

test('real device evidence rejects stale commit evidence', () => {
  assert.match(
    validateRealDeviceEvidence(validEvidence(), {
      expectedCommit: 'ffffffffffffffffffffffffffffffffffffffff',
    }).join('\n'),
    /must match current commit/,
  )
})

test('real device evidence rejects stale package versions when expected versions are provided', () => {
  const evidence = validEvidence()
  const expectedPackageVersions = { ...evidence.packageVersions }
  evidence.packageVersions['@vue-godot/html'] = '9.9.9'

  assert.match(
    validateRealDeviceEvidence(evidence, { expectedPackageVersions }).join(
      '\n',
    ),
    /evidence\.packageVersions\.@vue-godot\/html must match current package version 0\.0\.0/,
  )
})

test('real device evidence requires successful CI runs for the evidence commit', () => {
  const evidence = validEvidence()
  evidence.checkRunConclusion = 'failure'
  evidence.godotSmokeRunCommit = 'ffffffffffffffffffffffffffffffffffffffff'

  const errors = validateRealDeviceEvidence(evidence).join('\n')

  assert.match(errors, /checkRunConclusion must be "success"/)
  assert.match(errors, /godotSmokeRunCommit must match evidence\.commit/)
})

test('real device evidence requires GitHub Actions run URLs for this repo', () => {
  const evidence = validEvidence()
  evidence.checkRunUrl = 'https://example.com/checks/1'
  evidence.godotSmokeRunUrl =
    'https://github.com/other-owner/vue-godot/actions/runs/2'

  const errors = validateRealDeviceEvidence(evidence).join('\n')

  assert.match(
    errors,
    /checkRunUrl must be a GitHub Actions run URL for portwatcher\/vue-godot/,
  )
  assert.match(
    errors,
    /godotSmokeRunUrl must be a GitHub Actions run URL for portwatcher\/vue-godot/,
  )
})

test('real device evidence requires the expected GitHub Actions workflows', () => {
  const evidence = validEvidence()
  evidence.checkRunWorkflowName = 'Publish'
  evidence.godotSmokeRunWorkflowName = 'Check'

  const errors = validateRealDeviceEvidence(evidence).join('\n')

  assert.match(errors, /checkRunWorkflowName must be "Check"/)
  assert.match(errors, /godotSmokeRunWorkflowName must be "Godot Smoke"/)
})

test('checked-in real device evidence example matches the validator schema', () => {
  const { evidence, errors } = readRealDeviceEvidence(
    path.join(repoRoot, 'docs/real-device-evidence.example.json'),
  )

  assert.deepEqual(errors, [])
  assert.ok(evidence)
  assert.deepEqual(
    validateRealDeviceEvidence(evidence, {
      expectedPackageVersions: currentReleasePackageVersions(),
    }),
    [],
  )
})

test('real device evidence path resolves from the release environment variable', () => {
  assert.equal(
    resolveRealDeviceEvidencePath({
      VUE_GODOT_REAL_DEVICE_EVIDENCE: 'tmp/evidence.json',
    }),
    path.join(repoRoot, 'tmp/evidence.json'),
  )
})

test('real device evidence reader reports missing files without throwing', () => {
  const missingPath = path.join(
    repoRoot,
    'tmp/missing-real-device-evidence.json',
  )
  fs.rmSync(missingPath, { force: true })

  const { evidence, errors } = readRealDeviceEvidence(missingPath)

  assert.equal(evidence, null)
  assert.match(errors.join('\n'), /not found/)
})
