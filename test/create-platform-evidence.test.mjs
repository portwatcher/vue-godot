import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { buildPlatformEvidenceTemplate } from '../scripts/create-platform-evidence.mjs'
import {
  buildRealDeviceEvidence,
  normalizePlatformEvidence,
} from '../scripts/create-release-evidence.mjs'
import {
  passOnlyRealDeviceChecks,
  productionProfileSelectedApis,
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

function initialCiEvidence() {
  return {
    ready: true,
    commitFound: true,
    commit,
    requiredWorkflowNames: ['Check', 'Godot Smoke'],
    passedWorkflowNames: ['Check', 'Godot Smoke'],
    missingWorkflowNames: [],
    checks: {
      commitFound: true,
      checkWorkflow: true,
      godotSmokeWorkflow: true,
    },
    evidence: {
      commit,
      workflows: {
        Check: {
          runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
          runCommit: commit,
          runConclusion: 'success',
        },
        'Godot Smoke': {
          runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/2',
          runCommit: commit,
          runConclusion: 'success',
        },
      },
    },
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
  const completeAction = template.nextActions.find(
    (action) => action.id === 'complete-platform-evidence',
  )
  assert.ok(completeAction)
  assert.match(completeAction.detail, /Android must-pass remaining: cold-launch/)
  assert.ok(
    completeAction.platformCheckDetails.some(
      (detail) =>
        detail.platform === 'android' &&
        detail.check === 'cold-launch' &&
        detail.description.includes('Install the exported build'),
    ),
  )
  assert.ok(
    completeAction.platformCheckDetails.some(
      (detail) =>
        detail.check === 'network-if-selected' &&
        detail.mustPass === true &&
        detail.selectedApis.includes('fetch'),
    ),
  )
  assert.match(
    completeAction.detail,
    /iOS skippable remaining: .*deep-links-share-notifications-if-selected/,
  )
  assert.ok(
    completeAction.platformCheckDetails.some(
      (detail) =>
        detail.platform === 'ios' &&
        detail.check === 'deep-links-share-notifications-if-selected' &&
        detail.mustPass === false &&
        detail.description.includes('Verify cold-start'),
    ),
  )
  const androidRecordCommand = completeAction.commands.find((command) =>
    command.includes('--platform android'),
  )
  assert.ok(androidRecordCommand)
  assert.match(androidRecordCommand, /--pass-remaining/)
  assert.match(
    androidRecordCommand,
    /--skip 'clipboard-if-selected=<skip-reason-if-not-selected>'/,
  )
  const iosRecordCommand = completeAction.commands.find((command) =>
    command.includes('--platform ios'),
  )
  assert.ok(iosRecordCommand)
  assert.match(iosRecordCommand, /--pass-remaining/)
  assert.match(
    iosRecordCommand,
    /--skip 'deep-links-share-notifications-if-selected=<skip-reason-if-not-selected>'/,
  )
  assert.ok(
    template.nextActions.some(
      (action) =>
        action.id === 'record-required-checks' &&
        /Android: 3 metadata field\(s\) missing/.test(action.detail) &&
        /iOS must-pass remaining: cold-launch/.test(action.detail) &&
        action.commands.includes(
          'npm run check:platform-evidence -- --platform-evidence release/platform-evidence.json --summary-output release/platform-evidence-summary.json --allow-open --expected-commit <release-candidate-sha>',
        ),
    ),
  )
  assert.ok(
    template.nextActions.some(
      (action) =>
        action.id === 'assemble-real-device-evidence' &&
        action.commands[0] === 'npm run check' &&
        action.commands.includes(
          'GH_TOKEN="$(gh auth token)" npm run release:ci -- --commit <release-candidate-sha> --dispatch-missing --wait --ref <release-candidate-branch-or-tag> --output release/ci-runs.json',
        ) &&
        action.commands.includes(
          'npm run check:platform-evidence -- --platform-evidence release/platform-evidence.json --expected-commit <release-candidate-sha>',
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
    output: "release/custom platform's evidence.json",
    commit: ` ${commit} `,
    selectedApis: ['fetch'],
  })

  const assembleAction = template.nextActions.find(
    (action) => action.id === 'assemble-real-device-evidence',
  )
  const completeAction = template.nextActions.find(
    (action) => action.id === 'complete-platform-evidence',
  )
  const recordAction = template.nextActions.find(
    (action) => action.id === 'record-required-checks',
  )
  assert.ok(completeAction)
  assert.ok(
    completeAction.commands.some((command) =>
      command.includes(
        "--platform-evidence 'release/custom platform'\\''s evidence.json'",
      ),
    ),
  )
  assert.ok(
    completeAction.commands.every((command) =>
      command.includes(`--expected-commit ${commit}`),
    ),
  )
  assert.ok(recordAction)
  assert.ok(
    recordAction.commands.includes(
      `npm run check:platform-evidence -- --platform-evidence 'release/custom platform'\\''s evidence.json' --summary-output release/platform-evidence-summary.json --allow-open --expected-commit ${commit}`,
    ),
  )
  assert.ok(assembleAction)
  assert.ok(
    assembleAction.commands.some((command) =>
      command.includes(
        "--platform-evidence 'release/custom platform'\\''s evidence.json'",
      ),
    ),
  )
  assert.ok(
    assembleAction.commands.includes(
      `npm run release:ci -- --commit ${commit} --wait --output release/ci-runs.json`,
    ),
  )
  assert.ok(
    assembleAction.commands.includes(
      `npm run check:platform-evidence -- --platform-evidence 'release/custom platform'\\''s evidence.json' --expected-commit ${commit}`,
    ),
  )
  assert.ok(
    assembleAction.commands.includes(
      `npm run release:evidence -- --platform-evidence 'release/custom platform'\\''s evidence.json' --ci-evidence release/ci-runs.json --commit ${commit} --real-device-output release/real-device-evidence.json`,
    ),
  )
  assert.ok(
    assembleAction.commands.includes(
      `npm run check:real-device-evidence -- --platform-evidence 'release/custom platform'\\''s evidence.json' --expected-commit ${commit}`,
    ),
  )
})

test('platform evidence template reuses ready initial CI evidence', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-ci-'))
  const ciEvidencePath = path.join(tempDir, 'ci-runs.json')

  try {
    fs.writeFileSync(
      ciEvidencePath,
      `${JSON.stringify(initialCiEvidence(), null, 2)}\n`,
    )
    const template = buildPlatformEvidenceTemplate({
      ciEvidencePath,
      commit,
      selectedApis: ['fetch'],
    })
    const assembleAction = template.nextActions.find(
      (action) => action.id === 'assemble-real-device-evidence',
    )

    assert.deepEqual(template.initialCiEvidence, {
      commit,
      errorCount: 0,
      errors: [],
      expectedCommit: commit,
      path: ciEvidencePath,
      ready: true,
      validForCommit: null,
    })
    assert.ok(assembleAction)
    assert.ok(
      assembleAction.commands.every(
        (command) => !command.includes('npm run release:ci --'),
      ),
    )
    assert.ok(
      assembleAction.commands.some((command) =>
        command.includes(`--ci-evidence ${ciEvidencePath}`),
      ),
    )
    assert.ok(
      assembleAction.commands.includes(
        `npm run check:real-device-evidence -- --ci-evidence ${ciEvidencePath} --expected-commit ${commit}`,
      ),
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('platform evidence template rejects invalid release commits', () => {
  assert.throws(
    () =>
      buildPlatformEvidenceTemplate({
        commit: 'release-candidate',
        selectedApis: ['fetch'],
      }),
    /--commit must be a full 40-character git commit SHA/,
  )
})

test('platform evidence template expands production profile selected APIs', () => {
  const template = buildPlatformEvidenceTemplate({
    productionProfile: true,
    selectedApis: ['fetch', 'KeyboardAvoidingView'],
  })
  const completeAction = template.nextActions.find(
    (action) => action.id === 'complete-platform-evidence',
  )

  assert.deepEqual(template.android.selectedApis, productionProfileSelectedApis)
  assert.ok(completeAction)
  assert.match(
    completeAction.detail,
    /Android must-pass remaining: .*audio-input-if-selected/,
  )
  assert.ok(
    completeAction.platformCheckDetails.some(
      (detail) =>
        detail.check === 'network-if-selected' &&
        detail.mustPass === true &&
        detail.selectedApis.includes('fetch') &&
        detail.selectedApis.includes('WebSocket'),
    ),
  )
  assert.match(
    completeAction.detail,
    /iOS skippable remaining: deep-links-share-notifications-if-selected/,
  )
  assert.deepEqual(template.android.selectedApiRequiredChecks, {
    'network-if-selected': [
      'fetch',
      'WebSocket',
      'checkNetworkReachability',
      'navigator.onLine',
    ],
    'storage-restart': ['localStorage', 'sessionStorage'],
    'permission-prompts-if-selected': [
      'navigator.permissions.query',
      'navigator.geolocation',
      'navigator.mediaDevices.getUserMedia',
      'navigator.vibrate',
    ],
    'clipboard-if-selected': ['navigator.clipboard'],
    'adapter-states-if-selected': [
      'navigator.geolocation',
      'navigator.mediaDevices.getUserMedia',
    ],
    'hardware-adapters-if-selected': [
      'navigator.geolocation',
      'navigator.mediaDevices.getUserMedia',
    ],
    'haptics-if-selected': ['navigator.vibrate'],
    'audio-input-if-selected': ['navigator.mediaDevices.getUserMedia'],
    'sensors-if-selected': ['readDeviceMotion'],
    'safe-area-keyboard': ['SafeAreaView', 'KeyboardAvoidingView'],
  })
  assert.deepEqual(template.ios.selectedApiRequiredChecks, {
    'network-if-selected': [
      'fetch',
      'WebSocket',
      'checkNetworkReachability',
      'navigator.onLine',
    ],
    'storage-restart': ['localStorage', 'sessionStorage'],
    'permission-prompts-if-selected': [
      'navigator.permissions.query',
      'navigator.geolocation',
      'navigator.mediaDevices.getUserMedia',
    ],
    'clipboard-if-selected': ['navigator.clipboard'],
    'adapter-states-if-selected': [
      'navigator.geolocation',
      'navigator.mediaDevices.getUserMedia',
    ],
    'hardware-adapters-if-selected': [
      'navigator.geolocation',
      'navigator.mediaDevices.getUserMedia',
    ],
    'haptics-if-selected': ['navigator.vibrate'],
    'audio-input-if-selected': ['navigator.mediaDevices.getUserMedia'],
    'sensors-if-selected': ['readDeviceMotion'],
    'safe-area-keyboard-rotation-text-input': [
      'SafeAreaView',
      'KeyboardAvoidingView',
    ],
  })
})

test('platform evidence template expands device API conditional checks', () => {
  const template = buildPlatformEvidenceTemplate({
    selectedApis: [
      'navigator.permissions.query',
      'navigator.clipboard',
      'navigator.vibrate',
      '@vue-godot/device/microphone',
      'readDeviceMotion',
    ],
  })

  assert.deepEqual(template.android.selectedApiRequiredChecks, {
    'permission-prompts-if-selected': [
      'navigator.permissions.query',
      'navigator.vibrate',
      '@vue-godot/device/microphone',
    ],
    'clipboard-if-selected': ['navigator.clipboard'],
    'haptics-if-selected': ['navigator.vibrate'],
    'audio-input-if-selected': ['@vue-godot/device/microphone'],
    'sensors-if-selected': ['readDeviceMotion'],
  })
  assert.deepEqual(template.ios.selectedApiRequiredChecks, {
    'permission-prompts-if-selected': [
      'navigator.permissions.query',
      '@vue-godot/device/microphone',
    ],
    'clipboard-if-selected': ['navigator.clipboard'],
    'haptics-if-selected': ['navigator.vibrate'],
    'audio-input-if-selected': ['@vue-godot/device/microphone'],
    'sensors-if-selected': ['readDeviceMotion'],
  })
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
  template.android.initialCiEvidence = { ready: true }
  template.android.nextActions = [{ id: 'stale-platform-action' }]
  const normalized = normalizePlatformEvidence(template.android)

  assert.equal('requiredChecks' in normalized, false)
  assert.equal('passOnlyChecks' in normalized, false)
  assert.equal('selectedApiRequiredChecks' in normalized, false)
  assert.equal('initialCiEvidence' in normalized, false)
  assert.equal('nextActions' in normalized, false)
  assert.deepEqual(normalized.passedChecks, [])
})
