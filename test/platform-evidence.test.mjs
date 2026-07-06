import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import {
  auditPlatformEvidence,
  formatPlatformEvidenceProgress,
  formatPlatformEvidenceRemaining,
} from '../scripts/check-platform-evidence.mjs'
import { buildPlatformEvidenceTemplate } from '../scripts/create-platform-evidence.mjs'
import {
  productionProfileSelectedApis,
  requiredRealDeviceChecks,
} from '../scripts/real-device-evidence.mjs'
import { shellQuote } from '../scripts/release-utils.mjs'

const commit = '0123456789abcdef0123456789abcdef01234567'
const repoRoot = process.cwd()

function completedTemplate() {
  const template = buildPlatformEvidenceTemplate({
    androidArtifact: 'vue-godot-android-release.aab',
    androidDevice: 'Pixel hosted device',
    androidOs: 'Android 15',
    commit,
    iosArtifact: 'TestFlight build 1',
    iosDevice: 'iPhone hosted device',
    iosOs: 'iOS 18',
    locale: 'en-US',
    orientation: 'portrait and landscape',
    productionProfile: true,
  })
  template.android.passRemainingConfirmation =
    'All Android must-pass checks passed on Pixel hosted device run.'
  template.android.passedChecks = [...requiredRealDeviceChecks.android]
  template.ios.passedChecks = [...requiredRealDeviceChecks.ios]
  return template
}

test('platform evidence audit reports incomplete worksheet gaps', () => {
  const template = buildPlatformEvidenceTemplate({
    productionProfile: true,
  })
  const summary = auditPlatformEvidence(template)

  assert.equal(summary.ready, false)
  assert.equal(summary.platforms.android.ready, false)
  assert.equal(summary.platforms.ios.ready, false)
  assert.deepEqual(
    summary.platforms.android.selectedApis,
    productionProfileSelectedApis,
  )
  assert.ok(
    summary.platforms.android.missingFields.includes('artifact'),
  )
  assert.ok(
    summary.platforms.android.remainingChecks.includes('cold-launch'),
  )
  assert.ok(
    summary.platforms.android.mustPassMissingChecks.includes('cold-launch'),
  )
  assert.ok(
    summary.platforms.android.remainingCheckDetails.some(
      (detail) =>
        detail.check === 'cold-launch' &&
        detail.mustPass === true &&
        detail.passOnly === true &&
        detail.description.includes('cold launch'),
    ),
  )
  assert.ok(
    summary.platforms.android.remainingCheckDetails.some(
      (detail) =>
        detail.check === 'network-if-selected' &&
        detail.mustPass === true &&
        detail.selectedApis.includes('fetch'),
    ),
  )
  assert.ok(
    summary.platforms.ios.remainingChecks.includes(
      'safe-area-keyboard-rotation-text-input',
    ),
  )
  assert.ok(
    summary.platforms.ios.remainingCheckDetails.some(
      (detail) =>
        detail.check === 'deep-links-share-notifications-if-selected' &&
        detail.mustPass === false &&
        detail.description.includes('deep links'),
    ),
  )
  assert.deepEqual(summary.progress.android, {
    ready: false,
    selectedApiCount: productionProfileSelectedApis.length,
    missingFieldCount: 5,
    completedCheckCount: 0,
    duplicatePassedCheckCount: 0,
    invalidSkippedCheckCount: 0,
    requiredCheckCount: requiredRealDeviceChecks.android.length,
    remainingCheckCount: requiredRealDeviceChecks.android.length,
    mustPassMissingCheckCount: requiredRealDeviceChecks.android.length,
    passedSkippedCheckCount: 0,
    skippableMissingCheckCount: 0,
    unknownPassedCheckCount: 0,
    unknownSelectedApiCount: 0,
    unknownSkippedCheckCount: 0,
    worksheetErrorCount: 0,
  })
  assert.match(
    formatPlatformEvidenceProgress(summary),
    /Android: 5 metadata field\(s\) missing, 14\/14 required check\(s\) unresolved, 14 must-pass check\(s\) missing/,
  )
  assert.ok(
    formatPlatformEvidenceRemaining(summary).includes(
      'Android missing metadata: artifact, deviceModel, osVersion, orientation, locale',
    ),
  )
  assert.ok(
    formatPlatformEvidenceRemaining(summary).some((line) =>
      line.includes('Android must-pass remaining: cold-launch'),
    ),
  )
  assert.ok(
    formatPlatformEvidenceRemaining(summary).some((line) =>
      line.includes('iOS must-pass remaining: cold-launch'),
    ),
  )
})

test('platform evidence audit accepts completed production profile worksheet', () => {
  const summary = auditPlatformEvidence(completedTemplate())

  assert.equal(summary.ready, true)
  assert.equal(summary.errorCount, 0)
  assert.equal(summary.platforms.android.completedCheckCount, 14)
  assert.equal(
    summary.platforms.android.passRemainingConfirmation,
    'All Android must-pass checks passed on Pixel hosted device run.',
  )
  assert.equal(summary.platforms.ios.completedCheckCount, 15)
  assert.deepEqual(summary.platforms.android.remainingChecks, [])
  assert.deepEqual(summary.platforms.ios.mustPassMissingChecks, [])
})

test('platform evidence audit catches stale worksheet check lists', () => {
  const template = completedTemplate()
  template.android.requiredChecks = template.android.requiredChecks.filter(
    (check) => check !== 'cold-launch',
  )
  template.ios.selectedApiRequiredChecks['extra-check'] = ['fetch']

  const summary = auditPlatformEvidence(template)
  const errors = summary.errors.join('\n')

  assert.equal(summary.ready, false)
  assert.match(errors, /android\.requiredChecks is missing cold-launch/)
  assert.match(
    errors,
    /ios\.selectedApiRequiredChecks contains unexpected extra-check/,
  )
})

test('platform evidence audit reports malformed worksheet arrays', () => {
  const template = completedTemplate()
  template.android.passedChecks = {}

  const summary = auditPlatformEvidence(template)

  assert.equal(summary.ready, false)
  assert.match(
    summary.platforms.android.errors.join('\n'),
    /android\.passedChecks must be a string array/,
  )
})

test('platform evidence audit rejects checks recorded as both passed and skipped', () => {
  const template = completedTemplate()
  template.android.skippedChecks = {
    'cold-launch': 'Contradictory hand-edited evidence.',
  }

  const summary = auditPlatformEvidence(template)

  assert.equal(summary.ready, false)
  assert.deepEqual(summary.platforms.android.passedSkippedChecks, [
    'cold-launch',
  ])
  assert.equal(summary.progress.android.passedSkippedCheckCount, 1)
  assert.match(
    formatPlatformEvidenceProgress(summary),
    /1 contradictory pass\/skip check\(s\)/,
  )
  assert.ok(
    formatPlatformEvidenceRemaining(summary).includes(
      'Android contradictory pass/skip checks: cold-launch',
    ),
  )
  assert.match(
    summary.platforms.android.errors.join('\n'),
    /android\.cold-launch cannot be both passedChecks and skippedChecks/,
  )
})

test('platform evidence audit reports malformed worksheet fields without throwing', () => {
  const template = buildPlatformEvidenceTemplate({
    androidArtifact: 'vue-godot-android-release.aab',
    androidDevice: 'Pixel hosted device',
    androidOs: 'Android 15',
    iosArtifact: 'TestFlight build 1',
    iosDevice: 'iPhone hosted device',
    iosOs: 'iOS 18',
    locale: 'en-US',
    orientation: 'portrait and landscape',
    selectedApis: ['fetch'],
  })
  template.android.passedChecks = {}

  const summary = auditPlatformEvidence(template, {
    allowNonProductionProfile: true,
  })

  assert.equal(summary.ready, false)
  assert.match(
    summary.platforms.android.errors.join('\n'),
    /android\.passedChecks must be a string array/,
  )
})

test('platform evidence audit rejects placeholder metadata and skip reasons', () => {
  const template = buildPlatformEvidenceTemplate({
    androidArtifact: '<android-apk-aab-or-hosted-build-id>',
    androidDevice: 'Pixel hosted device',
    androidOs: 'Android 15',
    iosArtifact: 'TestFlight build 1',
    iosDevice: 'iPhone hosted device',
    iosOs: 'iOS 18',
    locale: 'en-US',
    orientation: 'portrait and landscape',
    productionProfile: true,
  })
  template.ios.skippedChecks = {
    'deep-links-share-notifications-if-selected':
      '<skip-reason-if-not-selected>',
  }
  template.ios.passRemainingConfirmation =
    '<confirm-all-remaining-must-pass-checks-after-testing>'

  const summary = auditPlatformEvidence(template)
  const errors = summary.errors.join('\n')

  assert.equal(summary.ready, false)
  assert.deepEqual(summary.platforms.ios.invalidSkippedChecks, [
    'deep-links-share-notifications-if-selected',
  ])
  assert.equal(summary.progress.ios.invalidSkippedCheckCount, 1)
  assert.ok(
    formatPlatformEvidenceRemaining(summary).includes(
      'iOS invalid skipped reason checks: deep-links-share-notifications-if-selected',
    ),
  )
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
    /ios\.passRemainingConfirmation must replace placeholder <confirm-all-remaining-must-pass-checks-after-testing>/,
  )

  template.ios.passRemainingConfirmation = ''
  const emptyConfirmationSummary = auditPlatformEvidence(template)
  assert.match(
    emptyConfirmationSummary.errors.join('\n'),
    /ios\.passRemainingConfirmation must be a non-empty release-specific confirmation note/,
  )
})

test('platform evidence audit accepts non-production profile when allowed', () => {
  const template = buildPlatformEvidenceTemplate({
    androidArtifact: 'vue-godot-android-release.aab',
    androidDevice: 'Pixel hosted device',
    androidOs: 'Android 15',
    iosArtifact: 'TestFlight build 1',
    iosDevice: 'iPhone hosted device',
    iosOs: 'iOS 18',
    locale: 'en-US',
    orientation: 'portrait and landscape',
    selectedApis: ['fetch', 'WebSocket', 'SafeAreaView'],
  })
  template.android.passedChecks = [...requiredRealDeviceChecks.android]
  template.ios.passedChecks = [...requiredRealDeviceChecks.ios]

  const summary = auditPlatformEvidence(template, {
    allowNonProductionProfile: true,
  })

  assert.equal(summary.ready, true)
  assert.equal(summary.errorCount, 0)
})

test('record-platform-evidence CLI records one platform result batch', () => {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "vue godot platform's "),
  )
  const evidencePath = path.join(tempDir, 'platform-evidence.json')
  const summaryPath = path.join(tempDir, 'platform-summary.json')

  try {
    fs.writeFileSync(
      evidencePath,
      `${JSON.stringify(buildPlatformEvidenceTemplate({ selectedApis: [] }), null, 2)}\n`,
    )
    const result = spawnSync(
      process.execPath,
      [
        'scripts/record-platform-evidence.mjs',
        '--platform',
        'android',
        '--platform-evidence',
        evidencePath,
        '--artifact',
        'vue-godot-android-release.aab',
        '--device',
        'Pixel hosted device',
        '--os',
        'Android 15',
        '--orientation',
        'portrait and landscape',
        '--locale',
        'en-US',
        '--pass',
        'cold-launch,no-godotjs-load-diagnostics',
        '--skip',
        'network-if-selected=Network APIs were not selected for this hosted pass',
        '--expected-commit',
        commit,
        '--summary-output',
        summaryPath,
      ],
      {
        cwd: repoRoot,
        encoding: 'utf-8',
      },
    )

    assert.equal(result.status, 0, result.stderr || result.stdout)
    const updated = JSON.parse(fs.readFileSync(evidencePath, 'utf-8'))
    assert.equal(updated.android.artifact, 'vue-godot-android-release.aab')
    assert.equal(updated.android.deviceModel, 'Pixel hosted device')
    assert.equal(updated.android.osVersion, 'Android 15')
    assert.equal(updated.android.orientation, 'portrait and landscape')
    assert.equal(updated.android.locale, 'en-US')
    assert.deepEqual(updated.android.passedChecks, [
      'cold-launch',
      'no-godotjs-load-diagnostics',
    ])
    assert.equal(
      updated.android.skippedChecks['network-if-selected'],
      'Network APIs were not selected for this hosted pass',
    )

    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))
    assert.equal(summary.updatedPlatform, 'android')
    assert.equal(summary.expectedCommit, commit)
    assert.equal(summary.progress.android.completedCheckCount, 3)
    assert.equal(summary.nextActions[0].id, 'complete-platform-evidence')
    assert.match(result.stdout, /iOS missing metadata: artifact/)
    assert.match(result.stdout, /Android must-pass remaining: storage-restart/)
    const androidRecordCommand = summary.nextActions[0].commands.find(
      (command) => command.includes('--platform android'),
    )
    assert.ok(androidRecordCommand)
    assert.match(
      androidRecordCommand,
      new RegExp(
        `--platform-evidence ${shellQuote(evidencePath).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
      ),
    )
    assert.match(androidRecordCommand, /--pass-remaining/)
    assert.match(
      androidRecordCommand,
      /--skip 'clipboard-if-selected=<skip-reason-if-not-selected>'/,
    )
    assert.doesNotMatch(
      androidRecordCommand,
      /--skip 'network-if-selected=<skip-reason-if-not-selected>'/,
    )
    assert.ok(
      summary.nextActions[0].commands.includes(
        `npm run check:platform-evidence -- --platform-evidence ${shellQuote(evidencePath)} --summary-output ${shellQuote(summaryPath)} --allow-open --expected-commit ${commit}`,
      ),
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('record-platform-evidence CLI rejects skipped must-pass checks', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-platform-'))
  const evidencePath = path.join(tempDir, 'platform-evidence.json')

  try {
    fs.writeFileSync(
      evidencePath,
      `${JSON.stringify(buildPlatformEvidenceTemplate({ productionProfile: true }), null, 2)}\n`,
    )
    const result = spawnSync(
      process.execPath,
      [
        'scripts/record-platform-evidence.mjs',
        '--platform',
        'ios',
        '--platform-evidence',
        evidencePath,
        '--skip',
        'cold-launch=Skipped in hosted device pass',
      ],
      {
        cwd: repoRoot,
        encoding: 'utf-8',
      },
    )

    assert.equal(result.status, 1)
    assert.match(
      result.stderr,
      /ios check\(s\) must be recorded in passedChecks, not skippedChecks: cold-launch/,
    )
    const unchanged = JSON.parse(fs.readFileSync(evidencePath, 'utf-8'))
    assert.deepEqual(unchanged.ios.passedChecks, [])
    assert.deepEqual(unchanged.ios.skippedChecks, {})
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('record-platform-evidence CLI rejects unreplaced placeholders', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-platform-'))
  const evidencePath = path.join(tempDir, 'platform-evidence.json')

  try {
    fs.writeFileSync(
      evidencePath,
      `${JSON.stringify(buildPlatformEvidenceTemplate({ productionProfile: true }), null, 2)}\n`,
    )
    const metadataResult = spawnSync(
      process.execPath,
      [
        'scripts/record-platform-evidence.mjs',
        '--platform',
        'android',
        '--platform-evidence',
        evidencePath,
        '--artifact',
        '<android-apk-aab-or-hosted-build-id>',
        '--pass',
        'cold-launch',
      ],
      {
        cwd: repoRoot,
        encoding: 'utf-8',
      },
    )

    assert.equal(metadataResult.status, 1)
    assert.match(
      metadataResult.stderr,
      /android\.artifact requires a real value, not <android-apk-aab-or-hosted-build-id>/,
    )

    const skipResult = spawnSync(
      process.execPath,
      [
        'scripts/record-platform-evidence.mjs',
        '--platform',
        'ios',
        '--platform-evidence',
        evidencePath,
        '--skip',
        'deep-links-share-notifications-if-selected=<skip-reason-if-not-selected>',
      ],
      {
        cwd: repoRoot,
        encoding: 'utf-8',
      },
    )

    assert.equal(skipResult.status, 1)
    assert.match(
      skipResult.stderr,
      /--skip deep-links-share-notifications-if-selected requires a real reason, not <skip-reason-if-not-selected>/,
    )

    const missingConfirmationResult = spawnSync(
      process.execPath,
      [
        'scripts/record-platform-evidence.mjs',
        '--platform',
        'android',
        '--platform-evidence',
        evidencePath,
        '--pass-remaining',
      ],
      {
        cwd: repoRoot,
        encoding: 'utf-8',
      },
    )

    assert.equal(missingConfirmationResult.status, 1)
    assert.match(
      missingConfirmationResult.stderr,
      /--pass-remaining requires --pass-remaining-confirmation/,
    )

    const placeholderConfirmationResult = spawnSync(
      process.execPath,
      [
        'scripts/record-platform-evidence.mjs',
        '--platform',
        'android',
        '--platform-evidence',
        evidencePath,
        '--pass-remaining',
        '--pass-remaining-confirmation',
        '<confirm-all-remaining-must-pass-checks-after-testing>',
      ],
      {
        cwd: repoRoot,
        encoding: 'utf-8',
      },
    )

    assert.equal(placeholderConfirmationResult.status, 1)
    assert.match(
      placeholderConfirmationResult.stderr,
      /--pass-remaining-confirmation requires a real confirmation note/,
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('record-platform-evidence CLI passes remaining must-pass checks only', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-platform-'))
  const evidencePath = path.join(tempDir, 'platform-evidence.json')
  const summaryPath = path.join(tempDir, 'platform-summary.json')

  try {
    fs.writeFileSync(
      evidencePath,
      `${JSON.stringify(buildPlatformEvidenceTemplate({ selectedApis: [] }), null, 2)}\n`,
    )
    const result = spawnSync(
      process.execPath,
      [
        'scripts/record-platform-evidence.mjs',
        '--platform',
        'android',
        '--platform-evidence',
        evidencePath,
        '--skip',
        'network-if-selected=Network APIs were not selected for this hosted pass',
        '--pass-remaining',
        '--pass-remaining-confirmation',
        'All remaining Android must-pass checks passed on the hosted device run',
        '--summary-output',
        summaryPath,
      ],
      {
        cwd: repoRoot,
        encoding: 'utf-8',
      },
    )

    assert.equal(result.status, 0, result.stderr || result.stdout)
    const updated = JSON.parse(fs.readFileSync(evidencePath, 'utf-8'))
    assert.deepEqual(updated.android.passedChecks, [
      'cold-launch',
      'no-godotjs-load-diagnostics',
      'storage-restart',
      'android-back-handling',
      'background-foreground',
    ])
    assert.equal(
      updated.android.skippedChecks['network-if-selected'],
      'Network APIs were not selected for this hosted pass',
    )
    assert.equal(
      updated.android.passRemainingConfirmation,
      'All remaining Android must-pass checks passed on the hosted device run',
    )

    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))
    assert.equal(summary.updatedPlatform, 'android')
    assert.equal(summary.passRemaining, true)
    assert.equal(
      summary.passRemainingConfirmation,
      'All remaining Android must-pass checks passed on the hosted device run',
    )
    assert.equal(summary.progress.android.completedCheckCount, 6)
    assert.ok(
      summary.platforms.android.skippableMissingChecks.includes(
        'clipboard-if-selected',
      ),
    )
    assert.deepEqual(summary.platforms.android.mustPassMissingChecks, [])
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('check-platform-evidence CLI writes summary and supports allow-open', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-platform-'))
  const evidencePath = path.join(tempDir, 'platform-evidence.json')
  const summaryPath = path.join(tempDir, 'platform-summary.json')

  try {
    fs.writeFileSync(
      evidencePath,
      `${JSON.stringify(buildPlatformEvidenceTemplate({ productionProfile: true }), null, 2)}\n`,
    )
    const result = spawnSync(
      process.execPath,
      [
        'scripts/check-platform-evidence.mjs',
        '--platform-evidence',
        evidencePath,
        '--allow-open',
        '--expected-commit',
        commit,
        '--summary-output',
        summaryPath,
      ],
      {
        cwd: repoRoot,
        encoding: 'utf-8',
      },
    )

    assert.equal(result.status, 0, result.stderr || result.stdout)
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))
    assert.equal(summary.ready, false)
    assert.equal(summary.path, path.relative(repoRoot, evidencePath))
    assert.equal(summary.nextActions[0].id, 'complete-platform-evidence')
    assert.match(summary.nextActions[0].detail, /Android: 5 metadata/)
    assert.match(summary.nextActions[0].detail, /iOS: 5 metadata/)
    assert.match(
      summary.nextActions[0].detail,
      /Android must-pass remaining: cold-launch/,
    )
    assert.ok(
      summary.nextActions[0].platformCheckDetails.some(
        (detail) =>
          detail.platform === 'android' &&
          detail.check === 'cold-launch' &&
          detail.description.includes('Install the exported build'),
      ),
    )
    assert.ok(
      summary.nextActions[0].platformCheckDetails.some(
        (detail) =>
          detail.check === 'network-if-selected' &&
          detail.mustPass === true &&
          detail.selectedApis.includes('fetch') &&
          detail.selectedApis.includes('WebSocket'),
      ),
    )
    assert.ok(
      summary.nextActions[0].platformCheckDetails.some(
        (detail) =>
          detail.platform === 'ios' &&
          detail.check === 'deep-links-share-notifications-if-selected' &&
          detail.mustPass === false &&
          detail.description.includes('Verify cold-start'),
      ),
    )
    assert.match(
      result.stdout,
      /iOS missing metadata: artifact, deviceModel, osVersion, orientation, locale/,
    )
    assert.ok(
      summary.nextActions[0].commands.includes(
        `npm run release:record-platform-evidence -- --platform android --platform-evidence ${evidencePath} --artifact <android-apk-aab-or-hosted-build-id> --export-preset <android-export-preset> --device <android-device-model> --os <android-os-version> --orientation <tested-orientations> --locale <tested-locale> --pass-remaining --pass-remaining-confirmation <confirm-all-remaining-must-pass-checks-after-testing> --summary-output ${summaryPath} --expected-commit ${commit}`,
      ),
    )
    assert.ok(
      summary.nextActions[0].commands.includes(
        `npm run release:record-platform-evidence -- --platform ios --platform-evidence ${evidencePath} --artifact <ios-archive-testflight-or-hosted-build-id> --export-preset <ios-export-preset> --device <ios-device-model> --os <ios-version> --orientation <tested-orientations> --locale <tested-locale> --pass-remaining --pass-remaining-confirmation <confirm-all-remaining-must-pass-checks-after-testing> --skip 'deep-links-share-notifications-if-selected=<skip-reason-if-not-selected>' --summary-output ${summaryPath} --expected-commit ${commit}`,
      ),
    )
    assert.ok(
      summary.nextActions[0].commands.includes(
        `npm run check:platform-evidence -- --platform-evidence ${evidencePath} --summary-output ${summaryPath} --allow-open --expected-commit ${commit}`,
      ),
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('check-platform-evidence missing custom worksheet creates custom output next action', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-platform-'))
  const evidencePath = path.join(tempDir, 'missing-platform-evidence.json')
  const summaryPath = path.join(tempDir, 'platform-summary.json')

  try {
    const result = spawnSync(
      process.execPath,
      [
        'scripts/check-platform-evidence.mjs',
        '--platform-evidence',
        evidencePath,
        '--allow-open',
        '--expected-commit',
        commit,
        '--summary-output',
        summaryPath,
      ],
      {
        cwd: repoRoot,
        encoding: 'utf-8',
      },
    )
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))

    assert.equal(result.status, 0, result.stderr || result.stdout)
    assert.equal(summary.evidencePresent, false)
    assert.equal(summary.nextActions[0].id, 'create-platform-evidence')
    assert.deepEqual(summary.nextActions[0].commands, [
      `npm run release:platform-evidence -- --production-profile --commit ${commit} --output ${shellQuote(evidencePath)}`,
    ])
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('check-platform-evidence CLI fails incomplete worksheet in strict mode', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-platform-'))
  const evidencePath = path.join(tempDir, 'platform-evidence.json')

  try {
    fs.writeFileSync(
      evidencePath,
      `${JSON.stringify(buildPlatformEvidenceTemplate({ productionProfile: true }), null, 2)}\n`,
    )
    const result = spawnSync(
      process.execPath,
      ['scripts/check-platform-evidence.mjs', '--platform-evidence', evidencePath],
      {
        cwd: repoRoot,
        encoding: 'utf-8',
      },
    )

    assert.equal(result.status, 1)
    assert.match(result.stdout, /\[platform-evidence\] blockers/)
    assert.match(result.stdout, /cold-launch/)
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})
