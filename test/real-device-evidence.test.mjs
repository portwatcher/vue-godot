import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { buildRealDeviceEvidenceSummary } from '../scripts/check-real-device-evidence.mjs'
import {
  knownRealDeviceSelectedApis,
  passOnlyRealDeviceChecks,
  productionProfileSelectedApis,
  readRealDeviceEvidence,
  realDeviceWorksheetFields,
  requiredRealDeviceChecks,
  resolveRealDeviceEvidencePath,
  selectedApiRequiredRealDeviceChecks,
  validateRealDeviceEvidence,
  validateRealDeviceEvidenceMetadata,
  validateRealDevicePlatformEvidence,
} from '../scripts/real-device-evidence.mjs'
import { buildPlatformEvidenceTemplate } from '../scripts/create-platform-evidence.mjs'
import {
  currentReleasePackageVersions,
  releasePackageConfigs,
  shellQuote,
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
    selectedApis: [...productionProfileSelectedApis],
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

function realDeviceEvidenceCommitCommands(
  platformEvidencePath = 'release/platform-evidence.json',
  ciEvidencePath = 'release/ci-runs.json',
  evidencePath = 'release/real-device-evidence.json',
) {
  return [
    `git add ${[
      platformEvidencePath,
      ciEvidencePath,
      evidencePath,
    ].map((file) => shellQuote(file)).join(' ')}`,
    'git commit -m "Add real-device release evidence"',
    'git push',
  ]
}

function copyEvidenceCommands(copies) {
  return copies.map(
    ([source, target]) => `cp ${shellQuote(source)} ${shellQuote(target)}`,
  )
}

test('real device evidence accepts a complete Android and iOS sign-off', () => {
  const evidence = validEvidence()
  evidence.android.passRemainingConfirmation =
    'All Android must-pass checks passed on Pixel hosted device run.'

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
  evidence.android.selectedApis = ['SafeAreaView']
  evidence.android.passedChecks = evidence.android.passedChecks.filter(
    (check) => check !== 'network-if-selected',
  )

  assert.match(
    validateRealDeviceEvidence(evidence).join('\n'),
    /network-if-selected/,
  )

  evidence.android.skippedChecks = {
    'network-if-selected': 'Release candidate did not select network APIs.',
  }

  assert.deepEqual(validateRealDeviceEvidence(evidence), [])
})

test('real device evidence rejects placeholder metadata and skip reasons', () => {
  const evidence = validEvidence()
  evidence.android.artifact = '<android-apk-aab-or-hosted-build-id>'
  evidence.android.passRemainingConfirmation =
    '<confirm-all-remaining-must-pass-checks-after-testing>'
  evidence.ios.skippedChecks = {
    'deep-links-share-notifications-if-selected':
      '<skip-reason-if-not-selected>',
  }

  const errors = validateRealDeviceEvidence(evidence).join('\n')
  assert.match(
    errors,
    /android\.artifact must replace placeholder <android-apk-aab-or-hosted-build-id>/,
  )
  assert.match(
    errors,
    /ios\.skippedChecks\.deep-links-share-notifications-if-selected must replace placeholder <skip-reason-if-not-selected>/,
  )
  assert.match(
    errors,
    /android\.passRemainingConfirmation must replace placeholder <confirm-all-remaining-must-pass-checks-after-testing>/,
  )
})

test('real device evidence requires core platform checks to pass', () => {
  const evidence = validEvidence()
  evidence.android.passedChecks = evidence.android.passedChecks.filter(
    (check) => check !== 'android-back-handling',
  )
  evidence.android.skippedChecks = {
    'android-back-handling': 'Release profile does not register back handling.',
  }

  assert.match(
    validateRealDeviceEvidence(evidence).join('\n'),
    /android\.android-back-handling must be in passedChecks/,
  )
})

test('real device evidence requires conditional checks to pass for selected APIs', () => {
  const evidence = validEvidence()
  evidence.android.passedChecks = evidence.android.passedChecks.filter(
    (check) => check !== 'network-if-selected',
  )
  evidence.android.skippedChecks = {
    'network-if-selected': 'Network APIs were not exercised in this pass.',
  }

  assert.match(
    validateRealDeviceEvidence(evidence).join('\n'),
    /android\.network-if-selected must be in passedChecks because selectedApis includes fetch/,
  )
})

test('real device evidence requires permission checks for selected permission APIs', () => {
  const evidence = validEvidence()
  evidence.android.selectedApis = ['navigator.permissions.query']
  evidence.android.passedChecks = evidence.android.passedChecks.filter(
    (check) => check !== 'permission-prompts-if-selected',
  )
  evidence.android.skippedChecks = {
    'permission-prompts-if-selected':
      'Permission state checks were not exercised in this pass.',
  }

  assert.match(
    validateRealDeviceEvidence(evidence).join('\n'),
    /android\.permission-prompts-if-selected must be in passedChecks because selectedApis includes navigator\.permissions\.query/,
  )
})

test('release real device evidence requires production profile selected APIs', () => {
  const evidence = validEvidence()
  evidence.ios.selectedApis = ['fetch', 'SafeAreaView']

  assert.match(
    validateRealDeviceEvidence(evidence, {
      requireProductionProfile: true,
    }).join('\n'),
    /ios\.selectedApis must include production profile API\(s\): WebSocket, checkNetworkReachability, navigator\.onLine/,
  )
})

test('real device evidence exposes metadata and platform-specific validation', () => {
  const evidence = validEvidence()
  evidence.android.passedChecks = evidence.android.passedChecks.filter(
    (check) => check !== 'network-if-selected',
  )

  assert.deepEqual(validateRealDeviceEvidenceMetadata(evidence), [])
  assert.match(
    validateRealDevicePlatformEvidence(evidence, 'android').join('\n'),
    /android\.network-if-selected must be in passedChecks because selectedApis includes fetch/,
  )
  assert.deepEqual(validateRealDevicePlatformEvidence(evidence, 'ios'), [])

  evidence.checkRunConclusion = 'failure'
  assert.match(
    validateRealDeviceEvidenceMetadata(evidence).join('\n'),
    /checkRunConclusion must be "success"/,
  )
  assert.deepEqual(validateRealDevicePlatformEvidence(evidence, 'ios'), [])
})

test('real device evidence permits skipped conditional checks outside selected APIs', () => {
  const evidence = validEvidence()
  evidence.android.selectedApis = ['SafeAreaView']
  evidence.android.passedChecks = evidence.android.passedChecks.filter(
    (check) => check !== 'network-if-selected',
  )
  evidence.android.skippedChecks = {
    'network-if-selected': 'Release candidate did not select network APIs.',
  }

  assert.deepEqual(validateRealDeviceEvidence(evidence), [])
})

test('real device evidence rejects unknown check names', () => {
  const evidence = validEvidence()
  evidence.ios.passedChecks.push('typo-check')
  evidence.ios.skippedChecks = {
    'another-typo': 'This should not be accepted.',
  }

  const errors = validateRealDeviceEvidence(evidence).join('\n')

  assert.match(errors, /ios\.passedChecks contains unknown check typo-check/)
  assert.match(errors, /ios\.skippedChecks contains unknown check another-typo/)
})

test('real device evidence rejects unknown selected API names', () => {
  const evidence = validEvidence()
  evidence.android.selectedApis = ['fetch', 'navigator.geoLocation']

  const errors = validateRealDeviceEvidence(evidence).join('\n')

  assert.match(
    errors,
    /android\.selectedApis contains unknown API navigator\.geoLocation/,
  )
})

test('real device evidence rejects malformed outcome containers', () => {
  const evidence = validEvidence()
  evidence.android.passedChecks = [
    ...evidence.android.passedChecks,
    'cold-launch',
    '',
    123,
  ]
  evidence.ios.passedChecks = {}
  evidence.ios.skippedChecks = {
    'deep-links-share-notifications-if-selected': '',
  }
  evidence.android.skippedChecks = []

  const errors = validateRealDeviceEvidence(evidence).join('\n')

  assert.match(
    errors,
    /android\.passedChecks must contain only non-empty strings/,
  )
  assert.match(errors, /android\.passedChecks contains duplicate cold-launch/)
  assert.match(errors, /android\.skippedChecks must be an object/)
  assert.match(errors, /ios\.passedChecks must be a string array/)
  assert.match(
    errors,
    /ios\.skippedChecks\.deep-links-share-notifications-if-selected must be a non-empty release-specific reason/,
  )
})

test('real device evidence rejects checks recorded as both passed and skipped', () => {
  const evidence = validEvidence()
  evidence.android.skippedChecks = {
    'cold-launch': 'Contradictory hand-edited evidence.',
  }

  const errors = validateRealDeviceEvidence(evidence).join('\n')

  assert.match(
    errors,
    /android\.cold-launch cannot be both passedChecks and skippedChecks/,
  )
})

test('real device evidence rejects worksheet-only platform fields', () => {
  const evidence = validEvidence()
  evidence.android.requiredChecks = [...requiredRealDeviceChecks.android]
  evidence.android.passOnlyChecks = [...passOnlyRealDeviceChecks.android]
  evidence.android.selectedApiRequiredChecks = {
    'network-if-selected': ['fetch'],
  }
  evidence.initialCiEvidence = { ready: true }
  evidence.nextActions = [{ id: 'stale-platform-action' }]

  const errors = validateRealDeviceEvidence(evidence).join('\n')

  assert.match(
    errors,
    /evidence\.initialCiEvidence is platform-evidence worksheet scaffolding/,
  )
  assert.match(
    errors,
    /evidence\.nextActions is platform-evidence worksheet scaffolding/,
  )
  assert.match(errors, /android\.requiredChecks is a platform-evidence worksheet field/)
  assert.match(errors, /android\.passOnlyChecks is a platform-evidence worksheet field/)
  assert.match(
    errors,
    /android\.selectedApiRequiredChecks is a platform-evidence worksheet field/,
  )
})

test('selected API release checks cover public conditional release gates', () => {
  assert.deepEqual(productionProfileSelectedApis, [
    'fetch',
    'WebSocket',
    'checkNetworkReachability',
    'navigator.onLine',
    'localStorage',
    'sessionStorage',
    'navigator.permissions.query',
    'navigator.clipboard',
    'navigator.geolocation',
    'navigator.mediaDevices.getUserMedia',
    'navigator.vibrate',
    'readDeviceMotion',
    'SafeAreaView',
    'KeyboardAvoidingView',
  ])
  for (const apiName of productionProfileSelectedApis) {
    assert.ok(knownRealDeviceSelectedApis.includes(apiName))
  }
  assert.ok(knownRealDeviceSelectedApis.includes('navigator.permissions'))
  assert.ok(knownRealDeviceSelectedApis.includes('navigator.permissions.query'))
  assert.ok(knownRealDeviceSelectedApis.includes('PermissionAdapter'))
  for (const apiName of Object.keys(selectedApiRequiredRealDeviceChecks)) {
    assert.ok(knownRealDeviceSelectedApis.includes(apiName))
  }
  assert.deepEqual(realDeviceWorksheetFields, [
    'requiredChecks',
    'passOnlyChecks',
    'selectedApiRequiredChecks',
  ])
  assert.deepEqual(passOnlyRealDeviceChecks.android, [
    'cold-launch',
    'no-godotjs-load-diagnostics',
    'storage-restart',
    'android-back-handling',
    'background-foreground',
  ])
  assert.deepEqual(passOnlyRealDeviceChecks.ios, [
    'cold-launch',
    'no-godotjs-load-diagnostics',
    'plist-entitlements',
    'storage-restart',
    'background-foreground',
  ])
  for (const check of [
    'clipboard-if-selected',
    'haptics-if-selected',
    'audio-input-if-selected',
    'sensors-if-selected',
  ]) {
    assert.ok(requiredRealDeviceChecks.android.includes(check))
    assert.ok(requiredRealDeviceChecks.ios.includes(check))
  }
  assert.deepEqual(selectedApiRequiredRealDeviceChecks.fetch.all, [
    'network-if-selected',
  ])
  assert.deepEqual(
    selectedApiRequiredRealDeviceChecks['navigator.clipboard'].all,
    ['clipboard-if-selected'],
  )
  assert.deepEqual(
    selectedApiRequiredRealDeviceChecks['navigator.permissions'].all,
    ['permission-prompts-if-selected'],
  )
  assert.deepEqual(
    selectedApiRequiredRealDeviceChecks['navigator.permissions.query'].all,
    ['permission-prompts-if-selected'],
  )
  assert.deepEqual(
    selectedApiRequiredRealDeviceChecks.PermissionAdapter.all,
    ['permission-prompts-if-selected', 'adapter-states-if-selected'],
  )
  assert.deepEqual(
    selectedApiRequiredRealDeviceChecks['navigator.vibrate'].all,
    ['haptics-if-selected'],
  )
  assert.deepEqual(
    selectedApiRequiredRealDeviceChecks['navigator.vibrate'].android,
    ['permission-prompts-if-selected'],
  )
  assert.deepEqual(
    selectedApiRequiredRealDeviceChecks['@vue-godot/device/microphone'].all,
    ['permission-prompts-if-selected', 'audio-input-if-selected'],
  )
  assert.deepEqual(
    selectedApiRequiredRealDeviceChecks[
      'navigator.mediaDevices.getUserMedia'
    ].all,
    [
      'permission-prompts-if-selected',
      'adapter-states-if-selected',
      'hardware-adapters-if-selected',
      'audio-input-if-selected',
    ],
  )
  assert.deepEqual(selectedApiRequiredRealDeviceChecks.readDeviceMotion.all, [
    'sensors-if-selected',
  ])
  assert.deepEqual(selectedApiRequiredRealDeviceChecks.SafeAreaView.android, [
    'safe-area-keyboard',
  ])
  assert.deepEqual(
    selectedApiRequiredRealDeviceChecks['navigator.geolocation'].all,
    [
      'permission-prompts-if-selected',
      'adapter-states-if-selected',
      'hardware-adapters-if-selected',
    ],
  )
  assert.deepEqual(
    selectedApiRequiredRealDeviceChecks['@vue-godot/device/geolocation'].all,
    [
      'permission-prompts-if-selected',
      'adapter-states-if-selected',
      'hardware-adapters-if-selected',
    ],
  )
  assert.deepEqual(selectedApiRequiredRealDeviceChecks.MediaStream.all, [
    'permission-prompts-if-selected',
    'adapter-states-if-selected',
    'hardware-adapters-if-selected',
    'audio-input-if-selected',
  ])
  assert.deepEqual(selectedApiRequiredRealDeviceChecks.Notification.ios, [
    'deep-links-share-notifications-if-selected',
  ])
})

test('real device evidence rejects stale commit evidence', () => {
  const errors = validateRealDeviceEvidence(validEvidence(), {
    expectedCommit: 'ffffffffffffffffffffffffffffffffffffffff',
  }).join('\n')

  assert.match(errors, /must match expected release commit/)
  assert.match(errors, /--expected-commit <release-candidate-sha>/)
})

test('real device evidence requires full commit SHAs in metadata', () => {
  const evidence = validEvidence()
  evidence.commit = 'release-candidate'
  evidence.checkRunCommit = '123456789abc'
  evidence.godotSmokeRunCommit = 'main'

  const errors = validateRealDeviceEvidence(evidence).join('\n')

  assert.match(
    errors,
    /evidence\.commit must be a full 40-character git commit SHA/,
  )
  assert.match(
    errors,
    /evidence\.checkRunCommit must be a full 40-character git commit SHA/,
  )
  assert.match(
    errors,
    /evidence\.godotSmokeRunCommit must be a full 40-character git commit SHA/,
  )
})

test('real device evidence accepts an explicit tested release commit', () => {
  assert.deepEqual(
    validateRealDeviceEvidence(validEvidence(), {
      expectedCommit: '0123456789abcdef0123456789abcdef01234567',
    }),
    [],
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

test('real device evidence requires successful CI runs for the recorded release commit', () => {
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
      requireProductionProfile: true,
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

test('check-real-device-evidence writes a missing-evidence summary when optional', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-evidence-'))
  const evidencePath = path.join(tempDir, 'missing-real-device-evidence.json')
  const summaryPath = path.join(tempDir, 'real-device-summary.json')
  const commandEvidencePath = path.relative(repoRoot, evidencePath)

  try {
    const result = spawnSync(
      process.execPath,
      [
        'scripts/check-real-device-evidence.mjs',
        '--optional',
        '--path',
        evidencePath,
        '--summary-output',
        summaryPath,
      ],
      { cwd: repoRoot, encoding: 'utf-8' },
    )
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))

    assert.equal(result.status, 0)
    assert.equal(summary.ready, false)
    assert.equal(summary.evidencePresent, false)
    assert.equal(summary.errorCount, 1)
    assert.equal(summary.platformEvidenceReady, false)
    assert.equal(summary.platformEvidence.evidencePresent, true)
    assert.equal(summary.platformEvidence.ready, false)
    assert.equal(summary.platformEvidence.path, 'release/platform-evidence.json')
    assert.ok(
      summary.platformEvidence.platforms.android.remainingChecks.includes(
        'cold-launch',
      ),
    )
    assert.ok(
      summary.nextActions.some(
        (action) =>
          action.id === 'complete-platform-evidence' &&
          action.detail.includes('Android: 5 metadata field(s) missing') &&
          action.detail.includes('iOS: 5 metadata field(s) missing') &&
          action.commands.includes(
            'npm run release:record-platform-evidence -- --platform android --platform-evidence release/platform-evidence.json --artifact <android-apk-aab-or-hosted-build-id> --export-preset <android-export-preset> --device <android-device-model> --os <android-os-version> --orientation <tested-orientations> --locale <tested-locale> --pass-remaining --pass-remaining-confirmation <confirm-all-remaining-must-pass-checks-after-testing> --summary-output release/platform-evidence-summary.json --expected-commit <release-candidate-sha>',
          ) &&
          action.commands.includes(
            "npm run release:record-platform-evidence -- --platform ios --platform-evidence release/platform-evidence.json --artifact <ios-archive-testflight-or-hosted-build-id> --export-preset <ios-export-preset> --device <ios-device-model> --os <ios-version> --orientation <tested-orientations> --locale <tested-locale> --pass-remaining --pass-remaining-confirmation <confirm-all-remaining-must-pass-checks-after-testing> --skip 'deep-links-share-notifications-if-selected=<skip-reason-if-not-selected>' --summary-output release/platform-evidence-summary.json --expected-commit <release-candidate-sha>",
          ) &&
          action.commands.includes(
            'npm run check:platform-evidence -- --platform-evidence release/platform-evidence.json --summary-output release/platform-evidence-summary.json --checklist-output release/platform-evidence-checklist.md --allow-open --expected-commit <release-candidate-sha>',
          ),
      ),
    )
    assert.ok(
      summary.nextActions.some(
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
            `npm run check:real-device-evidence -- --path ${commandEvidencePath} --verify-runs --expected-commit <release-candidate-sha>`,
          ) &&
          copyEvidenceCommands([
            [commandEvidencePath, 'release/real-device-evidence.json'],
          ]).every((command) => action.commands.includes(command)) &&
          realDeviceEvidenceCommitCommands().every((command) =>
            action.commands.includes(command),
          ),
      ),
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('check-real-device-evidence next actions honor expected commits', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-evidence-'))
  const evidencePath = path.join(tempDir, 'missing-real-device-evidence.json')
  const summaryPath = path.join(tempDir, 'real-device-summary.json')
  const expectedCommit = '0123456789abcdef0123456789abcdef01234567'
  const commandEvidencePath = path.relative(repoRoot, evidencePath)

  try {
    const result = spawnSync(
      process.execPath,
      [
        'scripts/check-real-device-evidence.mjs',
        '--optional',
        '--expected-commit',
        expectedCommit,
        '--path',
        evidencePath,
        '--summary-output',
        summaryPath,
      ],
      { cwd: repoRoot, encoding: 'utf-8' },
    )
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))
    const assembleAction = summary.nextActions.find(
      (action) => action.id === 'assemble-real-device-evidence',
    )

    assert.equal(result.status, 0)
    assert.equal(summary.platformEvidence.evidencePresent, true)
    assert.equal(summary.platformEvidence.ready, false)
    assert.ok(
      summary.nextActions.some(
        (action) =>
          action.id === 'complete-platform-evidence' &&
          action.detail.includes('Android: 5 metadata field(s) missing') &&
          action.detail.includes('iOS: 5 metadata field(s) missing') &&
          action.commands.includes(
            `npm run release:record-platform-evidence -- --platform android --platform-evidence release/platform-evidence.json --artifact <android-apk-aab-or-hosted-build-id> --export-preset <android-export-preset> --device <android-device-model> --os <android-os-version> --orientation <tested-orientations> --locale <tested-locale> --pass-remaining --pass-remaining-confirmation <confirm-all-remaining-must-pass-checks-after-testing> --summary-output release/platform-evidence-summary.json --expected-commit ${expectedCommit}`,
          ) &&
          action.commands.includes(
            `npm run release:record-platform-evidence -- --platform ios --platform-evidence release/platform-evidence.json --artifact <ios-archive-testflight-or-hosted-build-id> --export-preset <ios-export-preset> --device <ios-device-model> --os <ios-version> --orientation <tested-orientations> --locale <tested-locale> --pass-remaining --pass-remaining-confirmation <confirm-all-remaining-must-pass-checks-after-testing> --skip 'deep-links-share-notifications-if-selected=<skip-reason-if-not-selected>' --summary-output release/platform-evidence-summary.json --expected-commit ${expectedCommit}`,
          ) &&
          action.commands.includes(
            `npm run check:platform-evidence -- --platform-evidence release/platform-evidence.json --summary-output release/platform-evidence-summary.json --checklist-output release/platform-evidence-checklist.md --allow-open --expected-commit ${expectedCommit}`,
          ),
      ),
    )
    assert.ok(assembleAction)
    assert.ok(
      assembleAction.commands.includes(
        `npm run release:ci -- --commit ${expectedCommit} --wait --output release/ci-runs.json`,
      ),
    )
    assert.ok(
      assembleAction.commands.includes(
        `npm run check:platform-evidence -- --platform-evidence release/platform-evidence.json --expected-commit ${expectedCommit}`,
      ),
    )
    assert.ok(
      assembleAction.commands.includes(
        `npm run release:evidence -- --platform-evidence release/platform-evidence.json --ci-evidence release/ci-runs.json --commit ${expectedCommit} --real-device-output ${commandEvidencePath}`,
      ),
    )
    assert.ok(
      assembleAction.commands.includes(
        `npm run check:real-device-evidence -- --path ${commandEvidencePath} --verify-runs --expected-commit ${expectedCommit}`,
      ),
    )
    assert.ok(
      copyEvidenceCommands([
        [commandEvidencePath, 'release/real-device-evidence.json'],
      ]).every((command) => assembleAction.commands.includes(command)),
    )
    assert.ok(
      realDeviceEvidenceCommitCommands().every((command) =>
        assembleAction.commands.includes(command),
      ),
    )
    assert.ok(
      assembleAction.commands.indexOf(
        `npm run check:real-device-evidence -- --path ${commandEvidencePath} --verify-runs --expected-commit ${expectedCommit}`,
      ) <
        assembleAction.commands.indexOf(
          'git commit -m "Add real-device release evidence"',
        ),
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('check-real-device-evidence next actions honor missing custom evidence paths', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-evidence-'))
  const ciEvidencePath = path.join(tempDir, 'ci-runs.json')
  const evidencePath = path.join(tempDir, 'real-device-evidence.json')
  const platformEvidencePath = path.join(tempDir, 'platform-evidence.json')
  const summaryPath = path.join(tempDir, 'real-device-summary.json')
  const expectedCommit = '0123456789abcdef0123456789abcdef01234567'
  const commandEvidencePath = path.relative(repoRoot, evidencePath)
  const commandPlatformEvidencePath = platformEvidencePath

  try {
    const result = spawnSync(
      process.execPath,
      [
        'scripts/check-real-device-evidence.mjs',
        '--optional',
        '--expected-commit',
        expectedCommit,
        '--path',
        evidencePath,
        '--platform-evidence',
        platformEvidencePath,
        '--ci-evidence',
        ciEvidencePath,
        '--summary-output',
        summaryPath,
      ],
      { cwd: repoRoot, encoding: 'utf-8' },
    )
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))
    const createAction = summary.nextActions.find(
      (action) => action.id === 'create-platform-evidence',
    )
    const assembleAction = summary.nextActions.find(
      (action) => action.id === 'assemble-real-device-evidence',
    )

    assert.equal(result.status, 0, result.stderr || result.stdout)
    assert.equal(summary.initialCiEvidencePath, ciEvidencePath)
    assert.equal(summary.platformEvidencePath, commandPlatformEvidencePath)
    assert.equal(summary.evidencePath, commandEvidencePath)
    assert.ok(createAction)
    assert.ok(
      createAction.commands.includes(
        `npm run release:platform-evidence -- --production-profile --commit ${expectedCommit} --output ${shellQuote(commandPlatformEvidencePath)}`,
      ),
    )
    assert.ok(assembleAction)
    assert.ok(
      assembleAction.commands.includes(
        `npm run release:ci -- --commit ${expectedCommit} --wait --output ${ciEvidencePath}`,
      ),
    )
    assert.ok(
      assembleAction.commands.includes(
        `npm run check:platform-evidence -- --platform-evidence ${shellQuote(commandPlatformEvidencePath)} --expected-commit ${expectedCommit}`,
      ),
    )
    assert.ok(
      assembleAction.commands.includes(
        `npm run release:evidence -- --platform-evidence ${shellQuote(commandPlatformEvidencePath)} --ci-evidence ${shellQuote(ciEvidencePath)} --commit ${expectedCommit} --real-device-output ${shellQuote(commandEvidencePath)}`,
      ),
    )
    assert.ok(
      assembleAction.commands.includes(
        `npm run check:real-device-evidence -- --path ${shellQuote(commandEvidencePath)} --platform-evidence ${shellQuote(commandPlatformEvidencePath)} --ci-evidence ${shellQuote(ciEvidencePath)} --verify-runs --expected-commit ${expectedCommit}`,
      ),
    )
    assert.ok(
      copyEvidenceCommands([
        [commandPlatformEvidencePath, 'release/platform-evidence.json'],
        [ciEvidencePath, 'release/ci-runs.json'],
        [commandEvidencePath, 'release/real-device-evidence.json'],
      ]).every((command) => assembleAction.commands.includes(command)),
    )
    assert.ok(
      realDeviceEvidenceCommitCommands().every((command) =>
        assembleAction.commands.includes(command),
      ),
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('check-real-device-evidence reuses committed initial CI evidence', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-evidence-'))
  const evidencePath = path.join(tempDir, 'missing-real-device-evidence.json')
  const summaryPath = path.join(tempDir, 'real-device-summary.json')
  const commandEvidencePath = path.relative(repoRoot, evidencePath)
  const ciEvidence = JSON.parse(
    fs.readFileSync(path.join(repoRoot, 'release/ci-runs.json'), 'utf-8'),
  )

  try {
    const result = spawnSync(
      process.execPath,
      [
        'scripts/check-real-device-evidence.mjs',
        '--optional',
        '--expected-commit',
        ciEvidence.commit,
        '--path',
        evidencePath,
        '--summary-output',
        summaryPath,
      ],
      { cwd: repoRoot, encoding: 'utf-8' },
    )
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))
    const assembleAction = summary.nextActions.find(
      (action) => action.id === 'assemble-real-device-evidence',
    )

    assert.equal(result.status, 0)
    assert.equal(summary.initialCiEvidenceReady, true)
    assert.equal(summary.platformEvidenceReady, false)
    assert.equal(summary.platformEvidence.evidencePresent, true)
    assert.deepEqual(summary.initialCiEvidence, {
      commit: ciEvidence.commit,
      errorCount: 0,
      errors: [],
      expectedCommit: ciEvidence.commit,
      path: 'release/ci-runs.json',
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
      assembleAction.commands.includes(
        `npm run check:platform-evidence -- --platform-evidence release/platform-evidence.json --expected-commit ${ciEvidence.commit}`,
      ),
    )
    assert.ok(
      assembleAction.commands.includes(
        `npm run release:evidence -- --platform-evidence release/platform-evidence.json --ci-evidence release/ci-runs.json --commit ${ciEvidence.commit} --real-device-output ${commandEvidencePath}`,
      ),
    )
    assert.ok(
      copyEvidenceCommands([
        [commandEvidencePath, 'release/real-device-evidence.json'],
      ]).every((command) => assembleAction.commands.includes(command)),
    )
    assert.ok(
      realDeviceEvidenceCommitCommands().every((command) =>
        assembleAction.commands.includes(command),
      ),
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('check-real-device-evidence next actions honor custom completed input paths', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-evidence-'))
  const ciEvidencePath = path.join(tempDir, 'ci-runs.json')
  const platformEvidencePath = path.join(tempDir, 'platform-evidence.json')
  const realDeviceEvidencePath = path.join(tempDir, 'real-device-evidence.json')
  const summaryPath = path.join(tempDir, 'real-device-summary.json')
  const ciEvidence = JSON.parse(
    fs.readFileSync(path.join(repoRoot, 'release/ci-runs.json'), 'utf-8'),
  )

  try {
    fs.copyFileSync(path.join(repoRoot, 'release/ci-runs.json'), ciEvidencePath)
    fs.writeFileSync(
      platformEvidencePath,
      `${JSON.stringify(
        buildPlatformEvidenceTemplate({
          commit: ciEvidence.commit,
          productionProfile: true,
        }),
        null,
        2,
      )}\n`,
    )

    const result = spawnSync(
      process.execPath,
      [
        'scripts/check-real-device-evidence.mjs',
        '--optional',
        '--expected-commit',
        ciEvidence.commit,
        '--path',
        realDeviceEvidencePath,
        '--platform-evidence',
        platformEvidencePath,
        '--ci-evidence',
        ciEvidencePath,
        '--summary-output',
        summaryPath,
      ],
      { cwd: repoRoot, encoding: 'utf-8' },
    )
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))
    const completeAction = summary.nextActions.find(
      (action) => action.id === 'complete-platform-evidence',
    )
    const assembleAction = summary.nextActions.find(
      (action) => action.id === 'assemble-real-device-evidence',
    )
    const platformCommandPath = platformEvidencePath
    const realDeviceCommandPath = path.relative(repoRoot, realDeviceEvidencePath)

    assert.equal(result.status, 0, result.stderr || result.stdout)
    assert.equal(summary.initialCiEvidenceReady, true)
    assert.equal(summary.initialCiEvidencePath, ciEvidencePath)
    assert.equal(summary.platformEvidencePath, platformCommandPath)
    assert.equal(summary.evidencePath, realDeviceCommandPath)
    assert.equal(summary.usesCustomCiEvidencePath, true)
    assert.equal(summary.usesCustomEvidencePath, true)
    assert.equal(summary.usesCustomPlatformEvidencePath, true)
    assert.ok(completeAction)
    assert.ok(
      completeAction.commands.includes(
        `npm run check:platform-evidence -- --platform-evidence ${shellQuote(platformCommandPath)} --summary-output release/platform-evidence-summary.json --checklist-output release/platform-evidence-checklist.md --allow-open --expected-commit ${ciEvidence.commit}`,
      ),
    )
    assert.ok(assembleAction)
    assert.ok(
      assembleAction.commands.every(
        (command) => !command.includes('npm run release:ci --'),
      ),
    )
    assert.ok(
      assembleAction.commands.includes(
        `npm run check:platform-evidence -- --platform-evidence ${shellQuote(platformCommandPath)} --expected-commit ${ciEvidence.commit}`,
      ),
    )
    assert.ok(
      assembleAction.commands.includes(
        `npm run release:evidence -- --platform-evidence ${shellQuote(platformCommandPath)} --ci-evidence ${shellQuote(ciEvidencePath)} --commit ${ciEvidence.commit} --real-device-output ${shellQuote(realDeviceCommandPath)}`,
      ),
    )
    assert.ok(
      assembleAction.commands.includes(
        `npm run check:real-device-evidence -- --path ${shellQuote(realDeviceCommandPath)} --platform-evidence ${shellQuote(platformCommandPath)} --ci-evidence ${shellQuote(ciEvidencePath)} --verify-runs --expected-commit ${ciEvidence.commit}`,
      ),
    )
    assert.ok(
      copyEvidenceCommands([
        [platformCommandPath, 'release/platform-evidence.json'],
        [ciEvidencePath, 'release/ci-runs.json'],
        [realDeviceCommandPath, 'release/real-device-evidence.json'],
      ]).every((command) => assembleAction.commands.includes(command)),
    )
    assert.ok(
      realDeviceEvidenceCommitCommands().every((command) =>
        assembleAction.commands.includes(command),
      ),
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('check-real-device-evidence rejects non-SHA expected commits', () => {
  const result = spawnSync(
    process.execPath,
    [
      'scripts/check-real-device-evidence.mjs',
      '--optional',
      '--expected-commit',
      'release-candidate',
    ],
    { cwd: repoRoot, encoding: 'utf-8' },
  )

  assert.equal(result.status, 1)
  assert.match(
    `${result.stdout}\n${result.stderr}`,
    /--expected-commit must be a full 40-character git commit SHA/,
  )
})

test('check-real-device-evidence writes validation errors before failing', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-evidence-'))
  const evidencePath = path.join(tempDir, 'real-device-evidence.json')
  const summaryPath = path.join(tempDir, 'real-device-summary.json')
  const commandEvidencePath = path.relative(repoRoot, evidencePath)
  const evidence = validEvidence()
  evidence.android.selectedApis = ['navigator.geoLocation']
  fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)

  try {
    const result = spawnSync(
      process.execPath,
      [
        'scripts/check-real-device-evidence.mjs',
        '--path',
        evidencePath,
        '--summary-output',
        summaryPath,
      ],
      { cwd: repoRoot, encoding: 'utf-8' },
    )
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))

    assert.equal(result.status, 1)
    assert.equal(summary.ready, false)
    assert.equal(summary.evidencePresent, true)
    assert.match(summary.errors.join('\n'), /navigator\.geoLocation/)
    assert.ok(
      summary.nextActions.some(
        (action) =>
          action.id === 'fix-real-device-evidence' &&
          action.commands[0] === 'npm run check' &&
          action.commands.includes(
            'npm run check:platform-evidence -- --platform-evidence release/platform-evidence.json --expected-commit <release-candidate-sha>',
          ) &&
          action.commands.some((command) =>
            command.includes(`--real-device-output ${commandEvidencePath}`),
          ) &&
          copyEvidenceCommands([
            [commandEvidencePath, 'release/real-device-evidence.json'],
          ]).every((command) => action.commands.includes(command)) &&
          realDeviceEvidenceCommitCommands().every((command) =>
            action.commands.includes(command),
          ),
      ),
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('check-real-device-evidence summary records run verification errors', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-evidence-'))
  const evidencePath = path.join(tempDir, 'real-device-evidence.json')
  const evidence = validEvidence()
  evidence.packageVersions = currentReleasePackageVersions()
  fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)

  try {
    const summary = await buildRealDeviceEvidenceSummary(
      {
        ciEvidencePath: 'release/ci-runs.json',
        evidencePath,
        expectedCommit: evidence.commit,
        optional: false,
        platformEvidencePath: 'release/platform-evidence.json',
        summaryOutput: null,
        verifyRuns: true,
      },
      async () => ['evidence.checkRunUrl status must be "completed"'],
    )

    assert.equal(summary.ready, false)
    assert.equal(summary.metadataReady, true)
    assert.equal(summary.androidReady, true)
    assert.equal(summary.iosReady, true)
    assert.equal(summary.runVerificationRequested, true)
    assert.deepEqual(summary.runErrors, [
      'evidence.checkRunUrl status must be "completed"',
    ])
    assert.deepEqual(summary.errors, summary.runErrors)
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('check-real-device-evidence writes a passing summary', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-evidence-'))
  const evidencePath = path.join(tempDir, 'real-device-evidence.json')
  const summaryPath = path.join(tempDir, 'real-device-summary.json')
  const evidence = validEvidence()
  evidence.packageVersions = currentReleasePackageVersions()
  fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)

  try {
    const result = spawnSync(
      process.execPath,
      [
        'scripts/check-real-device-evidence.mjs',
        '--path',
        evidencePath,
        '--expected-commit',
        evidence.commit,
        '--summary-output',
        summaryPath,
      ],
      { cwd: repoRoot, encoding: 'utf-8' },
    )
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))

    assert.equal(result.status, 0)
    assert.equal(summary.ready, true)
    assert.equal(summary.errorCount, 0)
    assert.deepEqual(summary.errors, [])
    assert.deepEqual(summary.nextActions, [])
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})
