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

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

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
      'TODO.md:26 Android and iOS export smoke apps run on real, hosted, emulator, or simulator targets for the production profile.',
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
    devicePrereqs: {
      android: {
        blockerCount: 1,
        blockers: ['adb not found'],
        command: 'adb devices -l',
        deviceCount: 0,
        ready: false,
        warningCount: 0,
        warnings: [],
      },
      diagnosticOnly: true,
      hostedProviders: {
        anyConfigured: true,
        configuredProviders: [
          {
            configuredEnv: ['BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY'],
            id: 'browserstack',
            label: 'BrowserStack App Automate',
          },
        ],
        partialProviders: [
          {
            id: 'aws-device-farm',
            label: 'AWS Device Farm',
            missingEnv: ['AWS_SECRET_ACCESS_KEY', 'AWS_REGION'],
            partialEnv: ['AWS_ACCESS_KEY_ID'],
          },
        ],
        providerCount: 6,
      },
      ios: {
        blockerCount: 0,
        blockers: [],
        command: 'xcrun xctrace list devices',
        deviceCount: 1,
        ready: true,
        warningCount: 0,
        warnings: [],
      },
      path: 'release/device-test-prereqs-summary.json',
      readErrors: [],
      ready: false,
      selectedPlatforms: ['android', 'ios'],
      summaryPresent: true,
      toolchains: {
        android: {
          blockerCount: 0,
          blockers: [],
          buildToolsDir:
            '/opt/homebrew/share/android-commandlinetools/build-tools/37.0.0',
          buildToolsVersion: '37.0.0',
          commandCount: 3,
          commands: [
            {
              command: 'adb version',
              detail: 'Android Debug Bridge version 1.0.41',
              id: 'adb',
              label: 'Android Debug Bridge',
              ready: true,
              status: 0,
            },
            {
              command: 'apksigner --version',
              detail: '0.9',
              id: 'apksigner',
              label: 'APK signer',
              ready: true,
              status: 0,
            },
            {
              command: 'zipalign',
              detail: 'Zip alignment utility',
              id: 'zipalign',
              label: 'Zip align',
              ready: true,
              status: 2,
            },
          ],
          ready: true,
          sdkRoot: '/opt/homebrew/share/android-commandlinetools',
          sdkRootSource: 'discovered',
          warningCount: 1,
          warnings: ['ANDROID_HOME or ANDROID_SDK_ROOT is not set'],
        },
        ios: {
          blockerCount: 0,
          blockers: [],
          commandCount: 1,
          commands: [
            {
              command: 'xcodebuild -version',
              detail: 'Xcode 26.6',
              id: 'xcodebuild',
              label: 'Xcode build tools',
              ready: true,
              status: 0,
            },
          ],
          developerDir: '/Applications/Xcode.app/Contents/Developer',
          ready: true,
          warningCount: 0,
          warnings: [],
          xcodeVersion: 'Xcode 26.6',
        },
      },
    },
    initialCiEvidence: {
      commit,
      path: ciEvidencePath,
      ready: true,
    },
    releaseReadinessEvidence: {
      errorCount: 1,
      evidence: null,
      evidencePresent: false,
      path: 'release/release-readiness-evidence.json',
      ready: false,
      readErrors: [
        `Release-readiness evidence file not found: ${repoRoot}/release/release-readiness-evidence.json`,
      ],
      runErrors: [],
      validationErrors: [],
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
          passRemainingConfirmationIssue: [
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
        detail: 'Render the current strict readiness audit as Markdown.',
        commands: [
          `npm run release:handoff -- --expected-commit ${commit} --output release/release-handoff.md`,
        ],
      },
      {
        blockedBy: ['real-device-evidence'],
        id: 'real-device-evidence',
        title: 'Complete Android and iOS real-device export evidence',
        detail:
          'Run the selected API export checks on real, hosted, emulator, or simulator targets.',
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
  assert.match(markdown, /## Device Prereq Diagnostics/)
  assert.match(markdown, /Diagnostic only: yes; this is not release evidence/)
  assert.match(
    markdown,
    /Summary path: `release\/device-test-prereqs-summary\.json`/,
  )
  assert.match(
    markdown,
    /Android: waiting \(1 blocker\(s\), 0 warning\(s\), 0 device\(s\)\)/,
  )
  assert.match(markdown, /  - Command: `adb devices -l`/)
  assert.match(markdown, /  - Blockers:\n    - adb not found/)
  assert.match(
    markdown,
    /iOS: ready \(0 blocker\(s\), 0 warning\(s\), 1 device\(s\)\)/,
  )
  assert.match(markdown, /  - Command: `xcrun xctrace list devices`/)
  assert.match(
    markdown,
    /Android toolchain: ready \(0 blocker\(s\), 1 warning\(s\), 3 command\(s\)\)/,
  )
  assert.match(
    markdown,
    /  - SDK root: `\/opt\/homebrew\/share\/android-commandlinetools`/,
  )
  assert.match(markdown, /  - Build-tools version: `37\.0\.0`/)
  assert.match(
    markdown,
    /    - Zip align: ready \(`zipalign`\) - Zip alignment utility/,
  )
  assert.match(
    markdown,
    /iOS toolchain: ready \(0 blocker\(s\), 0 warning\(s\), 1 command\(s\)\)/,
  )
  assert.match(
    markdown,
    /Hosted provider env configured: BrowserStack App Automate \(`BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY`\)/,
  )
  assert.match(
    markdown,
    /Hosted provider env partial: AWS Device Farm \(set: `AWS_ACCESS_KEY_ID`; missing: `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`\)/,
  )
  assert.match(markdown, /## Release Preflight Evidence/)
  assert.match(
    markdown,
    /Readiness evidence path: `release\/release-readiness-evidence\.json`/,
  )
  assert.match(
    markdown,
    /Summary JSON: `release\/release-preflight-summary\.json`/,
  )
  assert.match(
    markdown,
    /Summary checklist: `release\/release-preflight-checklist\.md`/,
  )
  assert.match(markdown, /Evidence present: no/)
  assert.match(
    markdown,
    /Read errors:\n- Release-readiness evidence file not found: release\/release-readiness-evidence\.json/,
  )
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
  assert.match(
    markdown,
    /Skippable remaining: `deep-links-share-notifications-if-selected`/,
  )
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
  assert.match(
    markdown,
    /`cold-launch` \(must pass\): Install the exported build/,
  )
  assert.match(
    markdown,
    /`deep-links-share-notifications-if-selected` \(skippable\): Verify deep links/,
  )
  assert.match(markdown, /Blocked by: `real-device-evidence`/)
  assert.match(
    markdown,
    /Remaining check details:\n- Android `network-if-selected` \(must pass; selected APIs: fetch, WebSocket\): Exercise fetch/,
  )
  assert.match(
    markdown,
    /Commands with `<\.\.\.>` placeholders must be edited before running; unresolved placeholders are not valid release evidence or dispatch inputs\./,
  )
  assert.match(markdown, /#### Ready To Run/)
  assert.match(markdown, /#### Replace Placeholders First/)
  assert.match(markdown, /#### Run After Device Evidence Is Recorded/)
  assert.match(
    markdown,
    /#### Ready To Run[\s\S]*npm run check[\s\S]*#### Replace Placeholders First/,
  )
  assert.match(
    markdown,
    /#### Replace Placeholders First[\s\S]*<android-apk-aab-or-hosted-build-id>/,
  )
  assert.doesNotMatch(
    markdown,
    /#### Ready To Run[\s\S]*npm run release:evidence -- --commit[\s\S]*#### Replace Placeholders First/,
  )
  assert.match(
    markdown,
    /#### Run After Device Evidence Is Recorded[\s\S]*npm run release:evidence -- --commit[\s\S]*git commit -m "Add real-device release evidence"/,
  )
  assert.match(markdown, /TODO\.md:389 Android export/)
  assert.match(
    markdown,
    /- release-readiness evidence missing at release\/release-readiness-evidence\.json\n  Release-readiness evidence file not found: release\/release-readiness-evidence\.json/,
  )
  assert.doesNotMatch(
    markdown,
    /release-readiness evidence missing at release\/release-readiness-evidence\.json; Release-readiness evidence file not found/,
  )
  assert.match(markdown, /Write Android\/iOS tester handoff/)
  assert.match(
    markdown,
    /release:record-platform-evidence -- --platform android/,
  )
  assert.match(markdown, /npm run release:evidence -- --commit/)
  assert.doesNotMatch(markdown, new RegExp(repoRoot.replaceAll('/', '\\/')))
  assert.match(
    markdown,
    /Release-readiness evidence file not found: release\/release-readiness-evidence\.json/,
  )
})

test('release handoff renderer summarizes recorded release preflight evidence', () => {
  const source = sampleReadinessSummary()
  const markdown = renderReleaseHandoff({
    ...source,
    releaseReadinessEvidence: {
      errorCount: 0,
      evidence: {
        commit,
        releasePreflightFailureCount: 0,
        releasePreflightLocalOnly: false,
        releasePreflightRunCommit: commit,
        releasePreflightRunConclusion: 'success',
        releasePreflightRunUrl:
          'https://github.com/portwatcher/vue-godot/actions/runs/3',
        releasePreflightRunWorkflowName: 'Release Preflight',
        releasePreflightSkipCheck: false,
        releasePreflightSkipGodot: false,
        releasePreflightSkipSeriousExamples: false,
        releasePreflightWarningCount: 0,
      },
      evidencePresent: true,
      path: 'release/release-readiness-evidence.json',
      ready: true,
      readErrors: [],
      runErrors: [],
      validationErrors: [],
    },
  })

  assert.match(markdown, /Release Preflight Evidence/)
  assert.match(markdown, /Status: ready \(0 blocker\(s\)\)/)
  assert.match(markdown, /Evidence present: yes/)
  assert.match(
    markdown,
    /Run URL: https:\/\/github\.com\/portwatcher\/vue-godot\/actions\/runs\/3/,
  )
  assert.match(markdown, new RegExp(`Run commit: ${commit}`))
  assert.match(markdown, /Run conclusion: success/)
  assert.match(markdown, /Local-only: false/)
  assert.match(markdown, /Skipped Check: false/)
  assert.match(markdown, /Skipped Godot: false/)
  assert.match(markdown, /Skipped serious examples: false/)
  assert.match(markdown, /Failure count: 0/)
  assert.match(markdown, /Warning count: 0/)
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
      devicePrereqs: {
        ...summary.devicePrereqs,
        ready: true,
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

test('release handoff summary ignores its own default output dirty blocker', () => {
  const source = sampleReadinessSummary()
  const dirtyBlocker = [
    'working tree must be clean for final release readiness',
    'M release/release-handoff.md',
  ].join('\n')
  const summary = prepareReleaseHandoffSummary(
    {
      ...source,
      blockerCount: source.blockers.length + 1,
      blockers: [...source.blockers, dirtyBlocker],
      checks: {
        ...source.checks,
        cleanWorktree: false,
      },
      localGit: {
        dirtyWorktree: true,
      },
      nextActions: [
        {
          id: 'clean-worktree',
          title: 'Commit or remove local changes before strict readiness',
          commands: ['git status --short'],
        },
        ...source.nextActions,
      ],
    },
    'release/release-handoff.md',
  )
  const markdown = renderReleaseHandoff(summary)

  assert.equal(summary.blockerCount, source.blockers.length)
  assert.equal(summary.checks.cleanWorktree, true)
  assert.equal(summary.localGit.dirtyWorktree, false)
  assert.doesNotMatch(markdown, /working tree must be clean/)
  assert.doesNotMatch(markdown, /git status --short/)
  assert.doesNotMatch(markdown, /Write Android\/iOS tester handoff/)
})

test('release handoff summary keeps non-output dirty blockers', () => {
  const source = sampleReadinessSummary()
  const dirtyBlocker = [
    'working tree must be clean for final release readiness',
    'M README.md',
    'M release/release-handoff.md',
  ].join('\n')
  const summary = prepareReleaseHandoffSummary(
    {
      ...source,
      blockerCount: source.blockers.length + 1,
      blockers: [...source.blockers, dirtyBlocker],
      checks: {
        ...source.checks,
        cleanWorktree: false,
      },
      localGit: {
        dirtyWorktree: true,
      },
      nextActions: [
        {
          id: 'clean-worktree',
          title: 'Commit or remove local changes before strict readiness',
          commands: ['git status --short'],
        },
        ...source.nextActions,
      ],
    },
    'release/release-handoff.md',
  )
  const markdown = renderReleaseHandoff(summary)

  assert.equal(summary.blockerCount, source.blockers.length + 1)
  assert.equal(summary.checks.cleanWorktree, false)
  assert.equal(summary.localGit.dirtyWorktree, true)
  assert.match(markdown, /working tree must be clean/)
  assert.match(markdown, /M README\.md/)
  assert.doesNotMatch(markdown, /M release\/release-handoff\.md/)
  assert.match(markdown, /git status --short/)
  assert.doesNotMatch(markdown, /Write Android\/iOS tester handoff/)
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
    assert.match(
      markdown,
      /Complete Android and iOS real-device export evidence/,
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('release handoff CLI infers expected commit from CI evidence', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-handoff-'))
  const ciEvidencePath = path.join(tempDir, 'ci-runs.json')
  const platformEvidencePath = path.join(tempDir, 'platform-evidence.json')
  const realDeviceEvidencePath = path.join(tempDir, 'real-device-evidence.json')
  const readinessEvidencePath = path.join(
    tempDir,
    'release-readiness-evidence.json',
  )
  const outputPath = path.join(tempDir, 'handoff.md')

  try {
    fs.writeFileSync(
      ciEvidencePath,
      `${JSON.stringify(sampleCiEvidence(), null, 2)}\n`,
    )

    const result = spawnSync(
      process.execPath,
      [
        'scripts/release-handoff-report.mjs',
        '--ci-evidence',
        ciEvidencePath,
        '--platform-evidence',
        platformEvidencePath,
        '--real-device-path',
        realDeviceEvidencePath,
        '--readiness-path',
        readinessEvidencePath,
        '--output',
        outputPath,
      ],
      { cwd: repoRoot, encoding: 'utf-8' },
    )

    assert.equal(result.status, 0, result.stderr)
    const markdown = fs.readFileSync(outputPath, 'utf-8')
    assert.match(
      markdown,
      new RegExp(`Release candidate commit: \`${commit}\``),
    )
    assert.match(markdown, new RegExp(`--expected-commit ${commit}`))
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('release handoff CLI check verifies current output without writing', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-handoff-'))
  const ciEvidencePath = path.join(tempDir, 'ci-runs.json')
  const platformEvidencePath = path.join(tempDir, 'platform-evidence.json')
  const realDeviceEvidencePath = path.join(tempDir, 'real-device-evidence.json')
  const readinessEvidencePath = path.join(
    tempDir,
    'release-readiness-evidence.json',
  )
  const summaryPath = path.join(tempDir, 'readiness.json')
  const outputPath = path.join(tempDir, 'handoff.md')
  const renderArgs = [
    'scripts/release-handoff-report.mjs',
    '--expected-commit',
    commit,
    '--readiness-summary',
    summaryPath,
    '--output',
    outputPath,
    '--ci-evidence',
    ciEvidencePath,
    '--platform-evidence',
    platformEvidencePath,
    '--real-device-path',
    realDeviceEvidencePath,
    '--readiness-path',
    readinessEvidencePath,
  ]

  try {
    fs.writeFileSync(
      ciEvidencePath,
      `${JSON.stringify(sampleCiEvidence(), null, 2)}\n`,
    )
    fs.writeFileSync(
      summaryPath,
      `${JSON.stringify(sampleReadinessSummary(ciEvidencePath), null, 2)}\n`,
    )

    const writeResult = spawnSync(process.execPath, renderArgs, {
      cwd: repoRoot,
      encoding: 'utf-8',
    })
    assert.equal(writeResult.status, 0, writeResult.stderr)
    const before = fs.readFileSync(outputPath, 'utf-8')

    const checkResult = spawnSync(
      process.execPath,
      [...renderArgs, '--check'],
      { cwd: repoRoot, encoding: 'utf-8' },
    )

    assert.equal(checkResult.status, 0, checkResult.stderr)
    assert.match(checkResult.stdout, /is current/)
    assert.equal(fs.readFileSync(outputPath, 'utf-8'), before)

    fs.writeFileSync(outputPath, `${before}\n<!-- stale -->\n`)
    const staleResult = spawnSync(
      process.execPath,
      [...renderArgs, '--check'],
      { cwd: repoRoot, encoding: 'utf-8' },
    )

    assert.equal(staleResult.status, 1)
    const staleOutput = `${staleResult.stdout}\n${staleResult.stderr}`
    assert.match(staleOutput, /is stale/)
    assert.match(staleOutput, new RegExp(`--expected-commit ${commit}`))
    assert.match(
      staleOutput,
      new RegExp(`--output ${escapeRegExp(outputPath)}`),
    )
    assert.match(
      staleOutput,
      new RegExp(`--readiness-summary ${escapeRegExp(summaryPath)}`),
    )
    assert.match(
      staleOutput,
      new RegExp(`--ci-evidence ${escapeRegExp(ciEvidencePath)}`),
    )
    assert.match(
      staleOutput,
      new RegExp(`--platform-evidence ${escapeRegExp(platformEvidencePath)}`),
    )
    assert.match(
      staleOutput,
      new RegExp(`--real-device-path ${escapeRegExp(realDeviceEvidencePath)}`),
    )
    assert.match(
      staleOutput,
      new RegExp(`--readiness-path ${escapeRegExp(readinessEvidencePath)}`),
    )
    assert.doesNotMatch(staleOutput, /--check/)
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})
