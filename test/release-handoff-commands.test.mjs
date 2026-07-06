import assert from 'node:assert/strict'
import test from 'node:test'

import {
  checkDevicePrereqsCommand,
  checkPlatformEvidenceCommand,
  checkRealDeviceEvidenceCommand,
  commitEvidenceCommands,
  commitEvidenceFileCommands,
  currentHeadCommitCommand,
  defaultDeviceTestPrereqsSummaryPath,
  defaultPlatformEvidencePath,
  defaultRealDeviceEvidencePath,
  defaultReleasePreflightSummaryPath,
  defaultReleaseReadinessEvidencePath,
  defaultReleaseReadinessChecklistPath,
  defaultReleaseReadinessSummaryPath,
  defaultReleaseCiEvidencePath,
  defaultRealDeviceEvidenceChecklistPath,
  defaultRealDeviceEvidenceSummaryPath,
  defaultReleasePreflightChecklistPath,
  evidenceDispatchRefPlaceholder,
  initialReleaseCiCommands,
  localReleasePreflightCommand,
  productionProfilePlatformEvidenceCommand,
  recordPlatformEvidenceCommand,
  recordPlatformEvidenceCommands,
  recordPlatformEvidenceListChecksCommand,
  recordPlatformEvidencePassCommand,
  recordPlatformEvidencePassCommands,
  releaseEvidenceCommand,
  releaseCandidateCommitPlaceholder,
  releaseCandidateDispatchRefPlaceholder,
  releaseCiCommand,
  releaseCommitLabel,
  releaseDispatchRefPlaceholder,
  releasePreflightRunCommitPlaceholder,
  releasePreflightCiCommands,
  releasePreflightSummaryCommand,
  repoLocalEvidencePath,
} from '../scripts/release-handoff-commands.mjs'

const commit = '0123456789abcdef0123456789abcdef01234567'
const evidenceCommit = 'abcdef0123456789abcdef0123456789abcdef01'

test('release handoff commands format release CI waits and dispatches', () => {
  assert.equal(releaseCommitLabel(null), releaseCandidateCommitPlaceholder)
  assert.equal(releaseCommitLabel(commit), commit)
  assert.equal(releasePreflightRunCommitPlaceholder, '<evidence-commit-sha>')
  assert.equal(currentHeadCommitCommand, '"$(git rev-parse HEAD)"')
  assert.equal(
    releaseCandidateDispatchRefPlaceholder,
    '<release-candidate-branch-or-tag>',
  )
  assert.equal(evidenceDispatchRefPlaceholder, '<evidence-branch-or-tag>')
  assert.equal(defaultPlatformEvidencePath, 'release/platform-evidence.json')
  assert.equal(defaultReleaseCiEvidencePath, 'release/ci-runs.json')
  assert.equal(
    defaultRealDeviceEvidenceSummaryPath,
    'release/real-device-evidence-summary.json',
  )
  assert.equal(
    defaultDeviceTestPrereqsSummaryPath,
    'release/device-test-prereqs-summary.json',
  )
  assert.equal(
    defaultRealDeviceEvidenceChecklistPath,
    'release/real-device-evidence-checklist.md',
  )
  assert.equal(
    defaultReleasePreflightChecklistPath,
    'release/release-preflight-checklist.md',
  )
  assert.equal(
    defaultReleaseReadinessSummaryPath,
    'release/release-readiness-summary.json',
  )
  assert.equal(
    defaultReleaseReadinessChecklistPath,
    'release/release-readiness-checklist.md',
  )
  assert.equal(
    productionProfilePlatformEvidenceCommand(null),
    'npm run release:platform-evidence -- --production-profile --commit <release-candidate-sha>',
  )
  assert.equal(
    productionProfilePlatformEvidenceCommand(commit),
    `npm run release:platform-evidence -- --production-profile --commit ${commit}`,
  )
  assert.equal(
    productionProfilePlatformEvidenceCommand(commit, {
      output: "release/platform evidence's draft.json",
    }),
    `npm run release:platform-evidence -- --production-profile --commit ${commit} --output 'release/platform evidence'\\''s draft.json'`,
  )
  assert.equal(
    productionProfilePlatformEvidenceCommand(commit, {
      output: 'release/custom-platform-evidence.json',
    }),
    `npm run release:platform-evidence -- --production-profile --commit ${commit} --output release/custom-platform-evidence.json`,
  )

  assert.deepEqual(initialReleaseCiCommands(commit), [
    `npm run release:ci -- --commit ${commit} --wait --output release/ci-runs.json`,
    `GH_TOKEN="$(gh auth token)" npm run release:ci -- --commit ${commit} --dispatch-missing --wait --ref ${releaseCandidateDispatchRefPlaceholder} --output release/ci-runs.json`,
  ])
})

test('release handoff commands format real-device evidence assembly', () => {
  assert.equal(
    releaseEvidenceCommand(commit),
    `npm run release:evidence -- --platform-evidence release/platform-evidence.json --ci-evidence release/ci-runs.json --commit ${commit} --real-device-output release/real-device-evidence.json`,
  )
  assert.equal(
    checkPlatformEvidenceCommand(commit),
    `npm run check:platform-evidence -- --platform-evidence release/platform-evidence.json --expected-commit ${commit}`,
  )
  assert.equal(
    checkDevicePrereqsCommand({ allowMissing: true }),
    'npm run check:device-prereqs -- --allow-missing',
  )
  assert.equal(
    checkDevicePrereqsCommand({
      allowMissing: true,
      platform: 'android',
      summaryOutput: 'release/device prereqs.json',
    }),
    "npm run check:device-prereqs -- --platform android --summary-output 'release/device prereqs.json' --allow-missing",
  )
  assert.equal(
    recordPlatformEvidencePassCommand('android', commit),
    `npm run release:record-platform-evidence -- --platform android --platform-evidence release/platform-evidence.json --artifact <android-apk-aab-or-hosted-build-id> --evidence-url <android-device-evidence-url> --export-preset <android-export-preset> --device <android-device-model> --os <android-os-version> --orientation <tested-orientations> --locale <tested-locale> --pass <observed-android-check-name> --summary-output release/platform-evidence-summary.json --expected-commit ${commit}`,
  )
  assert.equal(
    recordPlatformEvidenceListChecksCommand('android', commit),
    `npm run release:record-platform-evidence -- --platform android --platform-evidence release/platform-evidence.json --list-checks --summary-output release/platform-evidence-summary.json --expected-commit ${commit}`,
  )
  assert.equal(
    recordPlatformEvidenceListChecksCommand('ios', commit, {
      platformEvidencePath: 'release/custom-platform-evidence.json',
      summaryOutput: 'release/custom-platform-summary.json',
    }),
    `npm run release:record-platform-evidence -- --platform ios --platform-evidence release/custom-platform-evidence.json --list-checks --summary-output release/custom-platform-summary.json --expected-commit ${commit}`,
  )
  assert.equal(
    recordPlatformEvidencePassCommand('ios', commit, {
      check: 'cold-launch',
    }),
    `npm run release:record-platform-evidence -- --platform ios --platform-evidence release/platform-evidence.json --artifact <ios-archive-testflight-or-hosted-build-id> --evidence-url <ios-device-evidence-url> --export-preset <ios-export-preset> --device <ios-device-model> --os <ios-version> --orientation <tested-orientations> --locale <tested-locale> --pass cold-launch --summary-output release/platform-evidence-summary.json --expected-commit ${commit}`,
  )
  assert.deepEqual(
    recordPlatformEvidencePassCommands('android', commit, {
      checks: ['cold-launch', 'storage-restart', 'cold-launch'],
    }),
    [
      `npm run release:record-platform-evidence -- --platform android --platform-evidence release/platform-evidence.json --artifact <android-apk-aab-or-hosted-build-id> --evidence-url <android-device-evidence-url> --export-preset <android-export-preset> --device <android-device-model> --os <android-os-version> --orientation <tested-orientations> --locale <tested-locale> --pass cold-launch --summary-output release/platform-evidence-summary.json --expected-commit ${commit}`,
      `npm run release:record-platform-evidence -- --platform android --platform-evidence release/platform-evidence.json --artifact <android-apk-aab-or-hosted-build-id> --evidence-url <android-device-evidence-url> --export-preset <android-export-preset> --device <android-device-model> --os <android-os-version> --orientation <tested-orientations> --locale <tested-locale> --pass storage-restart --summary-output release/platform-evidence-summary.json --expected-commit ${commit}`,
    ],
  )
  assert.equal(
    recordPlatformEvidenceCommand('android', commit),
    `npm run release:record-platform-evidence -- --platform android --platform-evidence release/platform-evidence.json --artifact <android-apk-aab-or-hosted-build-id> --evidence-url <android-device-evidence-url> --export-preset <android-export-preset> --device <android-device-model> --os <android-os-version> --orientation <tested-orientations> --locale <tested-locale> --pass-remaining --pass-remaining-confirmation <confirm-all-remaining-must-pass-checks-after-testing> --summary-output release/platform-evidence-summary.json --expected-commit ${commit}`,
  )
  assert.deepEqual(recordPlatformEvidenceCommands('android', commit), [
    recordPlatformEvidenceListChecksCommand('android', commit),
    recordPlatformEvidencePassCommand('android', commit),
    recordPlatformEvidenceCommand('android', commit),
  ])
  assert.equal(
    recordPlatformEvidenceCommand('ios', null, {
      platformEvidencePath: 'release/custom-platform-evidence.json',
      summaryOutput: 'release/custom-platform-summary.json',
    }),
    'npm run release:record-platform-evidence -- --platform ios --platform-evidence release/custom-platform-evidence.json --artifact <ios-archive-testflight-or-hosted-build-id> --evidence-url <ios-device-evidence-url> --export-preset <ios-export-preset> --device <ios-device-model> --os <ios-version> --orientation <tested-orientations> --locale <tested-locale> --pass-remaining --pass-remaining-confirmation <confirm-all-remaining-must-pass-checks-after-testing> --summary-output release/custom-platform-summary.json --expected-commit <release-candidate-sha>',
  )
  assert.equal(
    checkRealDeviceEvidenceCommand(commit),
    `npm run check:real-device-evidence -- --expected-commit ${commit}`,
  )
  assert.equal(
    checkRealDeviceEvidenceCommand(commit, { verifyRuns: true }),
    `npm run check:real-device-evidence -- --verify-runs --expected-commit ${commit}`,
  )
  assert.equal(
    checkRealDeviceEvidenceCommand(commit, {
      checklistOutput: 'release/real checklist.md',
      ciEvidencePath: 'release/ci runs.json',
      platformEvidencePath: "release/platform evidence's draft.json",
      realDeviceEvidencePath: 'release/real device evidence.json',
      summaryOutput: 'release/real summary.json',
    }),
    `npm run check:real-device-evidence -- --path 'release/real device evidence.json' --platform-evidence 'release/platform evidence'\\''s draft.json' --ci-evidence 'release/ci runs.json' --summary-output 'release/real summary.json' --checklist-output 'release/real checklist.md' --expected-commit ${commit}`,
  )
  assert.equal(
    checkRealDeviceEvidenceCommand(commit, {
      ciEvidencePath: 'release/custom-ci-runs.json',
      platformEvidencePath: 'release/custom-platform-evidence.json',
      realDeviceEvidencePath: 'release/custom-real-device-evidence.json',
    }),
    `npm run check:real-device-evidence -- --path release/custom-real-device-evidence.json --platform-evidence release/custom-platform-evidence.json --ci-evidence release/custom-ci-runs.json --expected-commit ${commit}`,
  )
  assert.equal(
    checkRealDeviceEvidenceCommand(commit, {
      ciEvidencePath: 'release/custom-ci-runs.json',
      checklistOutput: 'release/real-device-checklist.md',
      platformEvidencePath: 'release/custom-platform-evidence.json',
      realDeviceEvidencePath: 'release/custom-real-device-evidence.json',
      summaryOutput: 'release/real-device-summary.json',
      verifyRuns: true,
    }),
    `npm run check:real-device-evidence -- --path release/custom-real-device-evidence.json --platform-evidence release/custom-platform-evidence.json --ci-evidence release/custom-ci-runs.json --summary-output release/real-device-summary.json --checklist-output release/real-device-checklist.md --verify-runs --expected-commit ${commit}`,
  )
  assert.equal(
    releaseEvidenceCommand(null, {
      platformEvidencePath: 'release/custom-platform-evidence.json',
    }),
    'npm run release:evidence -- --platform-evidence release/custom-platform-evidence.json --ci-evidence release/ci-runs.json --commit <release-candidate-sha> --real-device-output release/real-device-evidence.json',
  )
  assert.equal(
    releaseEvidenceCommand(commit, {
      releasePreflightSummaryPath: defaultReleasePreflightSummaryPath,
      readinessEvidencePath: defaultReleaseReadinessEvidencePath,
    }),
    `npm run release:evidence -- --platform-evidence release/platform-evidence.json --ci-evidence release/ci-runs.json --commit ${commit} --real-device-output release/real-device-evidence.json --release-preflight-summary release/release-preflight-summary.json --readiness-output release/release-readiness-evidence.json`,
  )
  assert.deepEqual(
    commitEvidenceCommands(
      [
        'release/platform-evidence.json',
        'release/ci-runs.json',
        'release/real-device-evidence.json',
      ],
      'Add real-device release evidence',
      { push: true },
    ),
    [
      'git add release/platform-evidence.json release/ci-runs.json release/real-device-evidence.json',
      'git commit -m "Add real-device release evidence"',
      'git push',
    ],
  )
  assert.deepEqual(
    commitEvidenceCommands(
      ["release/platform evidence's draft.json", 'release/ci runs.json'],
      'Refresh release evidence',
    ),
    [
      "git add 'release/platform evidence'\\''s draft.json' 'release/ci runs.json'",
      'git commit -m "Refresh release evidence"',
    ],
  )
  assert.equal(
    repoLocalEvidencePath(
      '/tmp/vue-godot-release/platform evidence.json',
      defaultPlatformEvidencePath,
    ),
    defaultPlatformEvidencePath,
  )
  assert.equal(
    repoLocalEvidencePath(
      'release/custom-platform-evidence.json',
      defaultPlatformEvidencePath,
    ),
    'release/custom-platform-evidence.json',
  )
  assert.deepEqual(
    commitEvidenceFileCommands(
      [
        [
          '/tmp/vue-godot-release/platform evidence.json',
          defaultPlatformEvidencePath,
        ],
        ['release/custom-ci-runs.json', defaultReleaseCiEvidencePath],
        ['../real-device-evidence.json', defaultRealDeviceEvidencePath],
      ],
      'Add real-device release evidence',
      { push: true },
    ),
    [
      "cp '/tmp/vue-godot-release/platform evidence.json' release/platform-evidence.json",
      'cp ../real-device-evidence.json release/real-device-evidence.json',
      'git add release/platform-evidence.json release/custom-ci-runs.json release/real-device-evidence.json',
      'git commit -m "Add real-device release evidence"',
      'git push',
    ],
  )
})

test('release handoff commands include preflight evidence input only for preflight', () => {
  assert.equal(defaultRealDeviceEvidencePath, 'release/real-device-evidence.json')
  assert.deepEqual(releasePreflightCiCommands(commit), [
    `npm run release:ci -- --commit ${commit} --include-release-preflight --wait --output release/ci-runs.json`,
    `GH_TOKEN="$(gh auth token)" npm run release:ci -- --commit ${commit} --include-release-preflight --dispatch-missing --wait --ref ${releaseDispatchRefPlaceholder} --real-device-evidence-path release/real-device-evidence.json --output release/ci-runs.json`,
  ])
  assert.deepEqual(
    releasePreflightCiCommands(commit, {
      releasePreflightRunCommit: evidenceCommit,
    }),
    [
      `npm run release:ci -- --commit ${commit} --include-release-preflight --release-preflight-run-commit ${evidenceCommit} --wait --output release/ci-runs.json`,
      `GH_TOKEN="$(gh auth token)" npm run release:ci -- --commit ${commit} --include-release-preflight --release-preflight-run-commit ${evidenceCommit} --dispatch-missing --wait --ref ${evidenceDispatchRefPlaceholder} --real-device-evidence-path release/real-device-evidence.json --output release/ci-runs.json`,
    ],
  )
  assert.equal(
    releasePreflightSummaryCommand(commit, {
      checklistOutput: defaultReleasePreflightChecklistPath,
      withGitHubToken: true,
    }),
    `GH_TOKEN="$(gh auth token)" npm run release:preflight-summary -- --ci-evidence release/ci-runs.json --commit ${commit} --output release/release-preflight-summary.json --checklist-output release/release-preflight-checklist.md`,
  )
  assert.equal(
    releasePreflightSummaryCommand(commit, {
      releasePreflightRunCommit: evidenceCommit,
      runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/3',
    }),
    `npm run release:preflight-summary -- --run-url https://github.com/portwatcher/vue-godot/actions/runs/3 --commit ${commit} --release-preflight-run-commit ${evidenceCommit} --output release/release-preflight-summary.json`,
  )
  assert.equal(
    localReleasePreflightCommand(commit, {
      skipCheck: true,
      skipGodot: true,
      summaryOutput: '/tmp/vue-godot-local-preflight-summary.json',
    }),
    `npm run release:preflight -- --local --skip-check --skip-godot --expected-commit ${commit} --summary-output /tmp/vue-godot-local-preflight-summary.json`,
  )

  assert.equal(
    releaseCiCommand(commit, {
      dispatchMissing: true,
      output: 'release/custom-ci-runs.json',
      realDeviceEvidencePath: 'release/custom-real-device.json',
      ref: 'release-candidate',
      wait: true,
      withGitHubToken: true,
    }),
    'GH_TOKEN="$(gh auth token)" npm run release:ci -- --commit 0123456789abcdef0123456789abcdef01234567 --dispatch-missing --wait --ref release-candidate --output release/custom-ci-runs.json',
  )

  assert.equal(
    releaseCiCommand(commit, {
      dispatchMissing: true,
      includeReleasePreflight: true,
      output: 'release/custom-ci-runs.json',
      realDeviceEvidencePath: 'release/custom-real-device.json',
      ref: 'release-candidate',
      wait: true,
      withGitHubToken: true,
    }),
    'GH_TOKEN="$(gh auth token)" npm run release:ci -- --commit 0123456789abcdef0123456789abcdef01234567 --include-release-preflight --dispatch-missing --wait --ref release-candidate --real-device-evidence-path release/custom-real-device.json --output release/custom-ci-runs.json',
  )
})

test('release handoff commands quote custom refs and evidence paths', () => {
  assert.equal(
    releaseCiCommand(commit, {
      dispatchMissing: true,
      includeReleasePreflight: true,
      output: 'release/ci runs.json',
      realDeviceEvidencePath: 'release/real device evidence.json',
      ref: "release candidate's branch",
      wait: true,
      withGitHubToken: true,
    }),
    `GH_TOKEN="$(gh auth token)" npm run release:ci -- --commit ${commit} --include-release-preflight --dispatch-missing --wait --ref 'release candidate'\\''s branch' --real-device-evidence-path 'release/real device evidence.json' --output 'release/ci runs.json'`,
  )

  assert.equal(
    releaseEvidenceCommand(commit, {
      ciEvidencePath: 'release/ci runs.json',
      platformEvidencePath: "release/platform evidence's draft.json",
      realDeviceEvidencePath: 'release/real device evidence.json',
      readinessEvidencePath: 'release/readiness evidence.json',
      releasePreflightSummaryPath: 'release/preflight summary.json',
    }),
    `npm run release:evidence -- --platform-evidence 'release/platform evidence'\\''s draft.json' --ci-evidence 'release/ci runs.json' --commit ${commit} --real-device-output 'release/real device evidence.json' --release-preflight-summary 'release/preflight summary.json' --readiness-output 'release/readiness evidence.json'`,
  )

  assert.equal(
    releasePreflightSummaryCommand(commit, {
      checklistOutput: 'release/preflight checklist.md',
      ciEvidencePath: 'release/ci runs.json',
      output: 'release/preflight summary.json',
      withGitHubToken: true,
    }),
    `GH_TOKEN="$(gh auth token)" npm run release:preflight-summary -- --ci-evidence 'release/ci runs.json' --commit ${commit} --output 'release/preflight summary.json' --checklist-output 'release/preflight checklist.md'`,
  )

  assert.equal(
    checkPlatformEvidenceCommand(commit, {
      allowOpen: true,
      checklistOutput: 'release/platform checklist.md',
      platformEvidencePath: "release/platform evidence's draft.json",
      summaryOutput: 'release/platform summary.json',
    }),
    `npm run check:platform-evidence -- --platform-evidence 'release/platform evidence'\\''s draft.json' --summary-output 'release/platform summary.json' --checklist-output 'release/platform checklist.md' --allow-open --expected-commit ${commit}`,
  )

  assert.equal(
    checkRealDeviceEvidenceCommand(commit, {
      ciEvidencePath: 'release/ci runs.json',
      platformEvidencePath: "release/platform evidence's draft.json",
      realDeviceEvidencePath: 'release/real device evidence.json',
    }),
    `npm run check:real-device-evidence -- --path 'release/real device evidence.json' --platform-evidence 'release/platform evidence'\\''s draft.json' --ci-evidence 'release/ci runs.json' --expected-commit ${commit}`,
  )
  assert.deepEqual(
    commitEvidenceCommands(
      [
        "release/platform evidence's draft.json",
        'release/ci runs.json',
        'release/real device evidence.json',
      ],
      'Add real-device release evidence',
    ),
    [
      "git add 'release/platform evidence'\\''s draft.json' 'release/ci runs.json' 'release/real device evidence.json'",
      'git commit -m "Add real-device release evidence"',
    ],
  )
})
