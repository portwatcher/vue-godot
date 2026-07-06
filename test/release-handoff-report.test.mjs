import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  prepareReleaseHandoffSummary,
  renderReleaseHandoff,
} from '../scripts/release-handoff-report.mjs'
import {
  releaseHandoffReportFormatVersion,
  releaseHandoffReportStateHash,
} from '../scripts/release-handoff-commands.mjs'

const repoRoot = path.resolve(import.meta.dirname, '..')
const commit = '0123456789abcdef0123456789abcdef01234567'

function sampleCiEvidence() {
  return {
    ready: true,
    commit,
    commitFound: true,
    evidence: {
      commit,
      workflows: {
        Check: {
          workflowName: 'Check',
          runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
          runConclusion: 'success',
        },
        'Godot Smoke': {
          workflowName: 'Godot Smoke',
          runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/2',
          runConclusion: 'success',
        },
      },
    },
  }
}

function sampleReadinessSummary(ciEvidencePath = 'release/ci-runs.json') {
  return {
    commit,
    ready: false,
    blockerCount: 3,
    blockers: [
      'TODO.md:26 Android and iOS export smoke apps run on real or hosted devices for the production profile.',
      'real-device evidence missing at release/real-device-evidence.json',
      [
        'release-readiness evidence missing at release/release-readiness-evidence.json',
        `Release-readiness evidence file not found: ${repoRoot}/release/release-readiness-evidence.json`,
      ].join('\n'),
    ],
    checks: {
      androidRealDeviceEvidence: false,
      initialCiEvidence: true,
      iosRealDeviceEvidence: false,
      publicWarningMarkersRemoved: false,
      realDeviceEvidence: false,
      releaseReadinessEvidence: false,
    },
    initialCiEvidence: {
      commit,
      path: ciEvidencePath,
      ready: true,
    },
    platformEvidence: {
      errorCount: 3,
      path: 'release/platform-evidence.json',
      ready: false,
      platforms: {
        android: {
          completedCheckCount: 1,
          duplicatePassedChecks: ['cold-launch'],
          errorCount: 2,
          invalidSkippedChecks: ['network-if-selected'],
          missingFields: ['artifact'],
          mustPassMissingChecks: ['cold-launch'],
          passRemainingConfirmation:
            'All remaining Android must-pass checks passed on Pixel hosted run.',
          passedSkippedChecks: ['cold-launch'],
          ready: false,
          remainingCheckDetails: [
            {
              check: 'cold-launch',
              description:
                'Install the exported build, cold launch into the main scene.',
              mustPass: true,
              passOnly: true,
              selectedApis: [],
            },
          ],
          requiredCheckCount: 14,
          skippableMissingChecks: [],
          unknownPassedChecks: ['typo-pass'],
          unknownSelectedApis: ['navigator.typo'],
          unknownSkippedChecks: ['typo-skip'],
          worksheetErrors: ['android.requiredChecks is missing cold-launch'],
        },
        ios: {
          completedCheckCount: 0,
          errorCount: 1,
          missingFields: ['artifact', 'deviceModel'],
          mustPassMissingChecks: ['cold-launch'],
          passRemainingConfirmationIssue:
            [
              'ios.passRemainingConfirmation must replace placeholder',
              '<confirm-all-remaining-must-pass-checks-after-testing>',
            ].join(' '),
          ready: false,
          remainingCheckDetails: [
            {
              check: 'deep-links-share-notifications-if-selected',
              description:
                'Verify deep links, share sheets, and notification delivery.',
              mustPass: false,
              passOnly: false,
              selectedApis: [],
            },
          ],
          requiredCheckCount: 15,
          skippableMissingChecks: [
            'deep-links-share-notifications-if-selected',
          ],
        },
      },
    },
    finalTodoRequirements: [
      {
        file: 'TODO.md',
        line: 389,
        proof: 'androidRealDeviceEvidenceReady',
        ready: false,
        text: 'Android export with selected device APIs has been tested.',
      },
      {
        file: 'TODO.md',
        line: 24,
        proof: 'checkCiEvidenceReady',
        ready: true,
        text: '`npm run check` passes locally and in CI.',
      },
    ],
    nextActions: [
      {
        id: 'release-handoff-report',
        title: 'Write Android/iOS tester handoff',
        detail: 'Render the current allow-open readiness audit as Markdown.',
        commands: [
          `npm run release:handoff -- --expected-commit ${commit} --output release/release-handoff.md`,
        ],
      },
      {
        blockedBy: ['real-device-evidence'],
        id: 'real-device-evidence',
        title: 'Complete Android and iOS real-device export evidence',
        detail: 'Run the selected API export checks on real or hosted devices.',
        platformCheckDetails: [
          {
            check: 'network-if-selected',
            description: 'Exercise fetch and WebSocket on the exported build.',
            mustPass: true,
            passOnly: false,
            platform: 'android',
            platformLabel: 'Android',
            selectedApis: ['fetch', 'WebSocket'],
          },
        ],
        commands: [
          'npm run check',
          'npm run release:record-platform-evidence -- --platform android --artifact <android-apk-aab-or-hosted-build-id>',
          `npm run release:evidence -- --commit ${commit}`,
          'git commit -m "Add real-device release evidence"',
        ],
      },
    ],
  }
}

test('release handoff renderer summarizes evidence gaps and commands', () => {
  const markdown = renderReleaseHandoff(sampleReadinessSummary())

  assert.match(markdown, /^# Release Handoff/)
  assert.match(markdown, new RegExp(`Release candidate commit: \`${commit}\``))
  assert.match(
    markdown,
    new RegExp(`Handoff format: ${releaseHandoffReportFormatVersion}`),
  )
  assert.match(
    markdown,
    new RegExp(
      `Handoff state: ${releaseHandoffReportStateHash(sampleReadinessSummary())}`,
    ),
  )
  assert.match(markdown, /Real-device evidence: waiting/)
  assert.match(markdown, /Required checks complete: 1\/14/)
  assert.match(
    markdown,
    /Batch confirmation: All remaining Android must-pass checks passed on Pixel hosted run\./,
  )
  assert.match(markdown, /Batch confirmation: none/)
  assert.match(
    markdown,
    new RegExp(
      [
        'Batch confirmation issue:',
        'ios\\.passRemainingConfirmation must replace placeholder',
        '<confirm-all-remaining-must-pass-checks-after-testing>',
      ].join(' '),
    ),
  )
  assert.match(markdown, /Metadata gaps: `artifact`, `deviceModel`/)
  assert.match(markdown, /Skippable remaining: `deep-links-share-notifications-if-selected`/)
  assert.match(markdown, /Duplicate passed checks: `cold-launch`/)
  assert.match(markdown, /Invalid skipped reasons: `network-if-selected`/)
  assert.match(markdown, /Contradictory pass\/skip checks: `cold-launch`/)
  assert.match(markdown, /Unknown passed checks: `typo-pass`/)
  assert.match(markdown, /Unknown skipped checks: `typo-skip`/)
  assert.match(markdown, /Unknown selected APIs: `navigator\.typo`/)
  assert.match(
    markdown,
    /Worksheet drift: `android\.requiredChecks is missing cold-launch`/,
  )
  assert.match(markdown, /`cold-launch` \(must pass\): Install the exported build/)
  assert.match(
    markdown,
    /`deep-links-share-notifications-if-selected` \(skippable\): Verify deep links/,
  )
  assert.match(markdown, /Blocked by: `real-device-evidence`/)
  assert.match(markdown, /Remaining check details:\n- Android `network-if-selected` \(must pass; selected APIs: fetch, WebSocket\): Exercise fetch/)
  assert.match(
    markdown,
    /Commands with `<\.\.\.>` placeholders must be edited before running; unresolved placeholders are not valid release evidence or dispatch inputs\./,
  )
  assert.match(markdown, /TODO\.md:389 Android export/)
  assert.match(markdown, /Write Android\/iOS tester handoff/)
  assert.match(markdown, /release:record-platform-evidence -- --platform android/)
  assert.match(markdown, /npm run release:evidence -- --commit/)
  assert.doesNotMatch(markdown, new RegExp(repoRoot.replaceAll('/', '\\/')))
  assert.match(
    markdown,
    /Release-readiness evidence file not found: release\/release-readiness-evidence\.json/,
  )
})

test('release handoff state hash tracks structured release evidence', () => {
  const summary = sampleReadinessSummary()
  const stateHash = releaseHandoffReportStateHash(summary)

  assert.notEqual(
    releaseHandoffReportStateHash({
      ...summary,
      realDeviceEvidence: {
        path: 'release/real-device-evidence.json',
        readErrors: ['missing evidence file'],
        ready: false,
      },
    }),
    stateHash,
  )
  assert.notEqual(
    releaseHandoffReportStateHash({
      ...summary,
      releaseReadinessEvidence: {
        path: 'release/release-readiness-evidence.json',
        readErrors: ['missing evidence file'],
        ready: false,
      },
    }),
    stateHash,
  )
})

test('release handoff summary omits completed default handoff action', () => {
  const summary = prepareReleaseHandoffSummary(
    sampleReadinessSummary(),
    'release/release-handoff.md',
  )
  const markdown = renderReleaseHandoff(summary)

  assert.doesNotMatch(markdown, /Write Android\/iOS tester handoff/)
  assert.match(markdown, /Complete Android and iOS real-device export evidence/)
})

test('release handoff CLI writes a Markdown report from a readiness summary', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-handoff-'))
  const ciEvidencePath = path.join(tempDir, 'ci-runs.json')
  const summaryPath = path.join(tempDir, 'readiness.json')
  const outputPath = path.join(tempDir, 'handoff.md')

  try {
    fs.writeFileSync(
      ciEvidencePath,
      `${JSON.stringify(sampleCiEvidence(), null, 2)}\n`,
    )
    fs.writeFileSync(
      summaryPath,
      `${JSON.stringify(sampleReadinessSummary(ciEvidencePath), null, 2)}\n`,
    )

    const result = spawnSync(
      process.execPath,
      [
        'scripts/release-handoff-report.mjs',
        '--readiness-summary',
        summaryPath,
        '--output',
        outputPath,
      ],
      { cwd: repoRoot, encoding: 'utf-8' },
    )

    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, /wrote/)

    const markdown = fs.readFileSync(outputPath, 'utf-8')
    assert.match(
      markdown,
      /Check: https:\/\/github\.com\/portwatcher\/vue-godot\/actions\/runs\/1 \(success\)/,
    )
    assert.match(
      markdown,
      /Godot Smoke: https:\/\/github\.com\/portwatcher\/vue-godot\/actions\/runs\/2 \(success\)/,
    )
    assert.match(markdown, /Complete Android and iOS real-device export evidence/)
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})
