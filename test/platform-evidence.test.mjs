import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { auditPlatformEvidence } from '../scripts/check-platform-evidence.mjs'
import { buildPlatformEvidenceTemplate } from '../scripts/create-platform-evidence.mjs'
import {
  productionProfileSelectedApis,
  requiredRealDeviceChecks,
} from '../scripts/real-device-evidence.mjs'

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
    summary.platforms.ios.remainingChecks.includes(
      'safe-area-keyboard-rotation-text-input',
    ),
  )
})

test('platform evidence audit accepts completed production profile worksheet', () => {
  const summary = auditPlatformEvidence(completedTemplate())

  assert.equal(summary.ready, true)
  assert.equal(summary.errorCount, 0)
  assert.equal(summary.platforms.android.completedCheckCount, 14)
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
    assert.ok(
      summary.nextActions[0].commands.includes(
        `npm run check:platform-evidence -- --platform-evidence ${evidencePath} --summary-output ${summaryPath} --allow-open --expected-commit ${commit}`,
      ),
    )
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
