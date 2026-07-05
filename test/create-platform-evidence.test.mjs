import assert from 'node:assert/strict'
import test from 'node:test'

import { buildPlatformEvidenceTemplate } from '../scripts/create-platform-evidence.mjs'
import {
  buildRealDeviceEvidence,
  normalizePlatformEvidence,
} from '../scripts/create-release-evidence.mjs'
import {
  passOnlyRealDeviceChecks,
  requiredRealDeviceChecks,
  validateRealDeviceEvidence,
} from '../scripts/real-device-evidence.mjs'
import { currentReleasePackageVersions } from '../scripts/release-utils.mjs'

const commit = '0123456789abcdef0123456789abcdef01234567'

function baseRun(name, id) {
  return {
    name,
    head_sha: commit,
    conclusion: 'success',
    html_url: `https://github.com/portwatcher/vue-godot/actions/runs/${id}`,
  }
}

function fullEvidence(platformEvidence) {
  return buildRealDeviceEvidence({
    commit,
    packageVersions: currentReleasePackageVersions(),
    godotJsVersion: 'GodotJS 1.0.0-2 / Godot 4.4.x',
    checkRunUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
    checkRun: baseRun('Check', 1),
    godotSmokeRunUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/2',
    godotSmokeRun: baseRun('Godot Smoke', 2),
    platformEvidence: {
      android: normalizePlatformEvidence(platformEvidence.android),
      ios: normalizePlatformEvidence(platformEvidence.ios),
    },
  })
}

test('platform evidence template lists required checks without passing them', () => {
  const template = buildPlatformEvidenceTemplate({
    selectedApis: ['fetch', 'SafeAreaView', 'fetch'],
    orientation: 'portrait and landscape',
    locale: 'en-US',
  })

  assert.deepEqual(template.android.selectedApis, ['fetch', 'SafeAreaView'])
  assert.deepEqual(template.android.selectedApiRequiredChecks, {
    'network-if-selected': ['fetch'],
    'safe-area-keyboard': ['SafeAreaView'],
  })
  assert.deepEqual(template.ios.selectedApiRequiredChecks, {
    'network-if-selected': ['fetch'],
    'safe-area-keyboard-rotation-text-input': ['SafeAreaView'],
  })
  assert.deepEqual(template.android.passedChecks, [])
  assert.deepEqual(template.android.skippedChecks, {})
  assert.deepEqual(
    template.android.requiredChecks,
    requiredRealDeviceChecks.android,
  )
  assert.deepEqual(
    template.android.passOnlyChecks,
    passOnlyRealDeviceChecks.android,
  )
  assert.deepEqual(template.ios.requiredChecks, requiredRealDeviceChecks.ios)
  assert.deepEqual(template.ios.passOnlyChecks, passOnlyRealDeviceChecks.ios)
  assert.ok(
    template.nextActions.some(
      (action) =>
        action.id === 'assemble-real-device-evidence' &&
        action.commands[0] === 'npm run check' &&
        action.commands.includes(
          'GH_TOKEN="$(gh auth token)" npm run release:ci -- --commit <release-candidate-sha> --dispatch-missing --wait --ref <branch-or-tag> --output release/ci-runs.json',
        ) &&
        action.commands.includes(
          'npm run release:evidence -- --platform-evidence release/platform-evidence.json --ci-evidence release/ci-runs.json --commit <release-candidate-sha> --real-device-output release/real-device-evidence.json',
        ),
    ),
  )

  const errors = validateRealDeviceEvidence(fullEvidence(template)).join('\n')
  assert.match(errors, /android must pass cold-launch/)
  assert.match(errors, /ios must pass cold-launch/)
})

test('platform evidence template next actions honor custom output paths', () => {
  const template = buildPlatformEvidenceTemplate({
    output: 'release/custom-platform-evidence.json',
    selectedApis: ['fetch'],
  })

  const assembleAction = template.nextActions.find(
    (action) => action.id === 'assemble-real-device-evidence',
  )
  assert.ok(assembleAction)
  assert.ok(
    assembleAction.commands.some((command) =>
      command.includes('--platform-evidence release/custom-platform-evidence.json'),
    ),
  )
})

test('platform evidence template rejects unknown selected APIs', () => {
  assert.throws(
    () =>
      buildPlatformEvidenceTemplate({
        selectedApis: ['fetch', 'navigator.geoLocation'],
      }),
    /Unknown selected API\(s\): navigator\.geoLocation/,
  )
})

test('completed platform template validates after required checks are recorded', () => {
  const template = buildPlatformEvidenceTemplate({
    selectedApis: ['fetch', 'WebSocket', 'SafeAreaView'],
    androidArtifact: 'vue-godot-android-release.aab',
    iosArtifact: 'TestFlight build 1',
    androidDevice: 'Pixel hosted device',
    iosDevice: 'iPhone hosted device',
    androidOs: 'Android 15',
    iosOs: 'iOS 18',
    orientation: 'portrait and landscape',
    locale: 'en-US',
  })
  template.android.passedChecks = [...requiredRealDeviceChecks.android]
  template.ios.passedChecks = [...requiredRealDeviceChecks.ios]

  assert.deepEqual(
    validateRealDeviceEvidence(fullEvidence(template), {
      expectedCommit: commit,
      expectedPackageVersions: currentReleasePackageVersions(),
    }),
    [],
  )
})

test('release evidence normalization removes template-only required checks', () => {
  const template = buildPlatformEvidenceTemplate({
    selectedApis: ['fetch'],
  })
  const normalized = normalizePlatformEvidence(template.android)

  assert.equal('requiredChecks' in normalized, false)
  assert.equal('passOnlyChecks' in normalized, false)
  assert.equal('selectedApiRequiredChecks' in normalized, false)
  assert.equal('nextActions' in normalized, false)
  assert.deepEqual(normalized.passedChecks, [])
})
