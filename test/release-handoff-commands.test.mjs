import assert from 'node:assert/strict'
import test from 'node:test'

import {
  checkPlatformEvidenceCommand,
  checkRealDeviceEvidenceCommand,
  commitEvidenceCommands,
  currentHeadCommitCommand,
  defaultPlatformEvidencePath,
  defaultRealDeviceEvidencePath,
  defaultReleasePreflightSummaryPath,
  defaultReleaseReadinessEvidencePath,
  defaultReleaseCiEvidencePath,
  evidenceDispatchRefPlaceholder,
  initialReleaseCiCommands,
  productionProfilePlatformEvidenceCommand,
  recordPlatformEvidenceCommand,
  releaseEvidenceCommand,
  releaseCandidateCommitPlaceholder,
  releaseCandidateDispatchRefPlaceholder,
  releaseCiCommand,
  releaseCommitLabel,
  releaseDispatchRefPlaceholder,
  releasePreflightRunCommitPlaceholder,
  releasePreflightCiCommands,
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
    recordPlatformEvidenceCommand('android', commit),
    `npm run release:record-platform-evidence -- --platform android --platform-evidence release/platform-evidence.json --artifact <android-apk-aab-or-hosted-build-id> --export-preset <android-export-preset> --device <android-device-model> --os <android-os-version> --orientation <tested-orientations> --locale <tested-locale> --pass-remaining --summary-output release/platform-evidence-summary.json --expected-commit ${commit}`,
  )
  assert.equal(
    recordPlatformEvidenceCommand('ios', null, {
      platformEvidencePath: 'release/custom-platform-evidence.json',
      summaryOutput: 'release/custom-platform-summary.json',
    }),
    'npm run release:record-platform-evidence -- --platform ios --platform-evidence release/custom-platform-evidence.json --artifact <ios-archive-testflight-or-hosted-build-id> --export-preset <ios-export-preset> --device <ios-device-model> --os <ios-version> --orientation <tested-orientations> --locale <tested-locale> --pass-remaining --summary-output release/custom-platform-summary.json --expected-commit <release-candidate-sha>',
  )
  assert.equal(
    checkRealDeviceEvidenceCommand(commit),
    `npm run check:real-device-evidence -- --expected-commit ${commit}`,
  )
  assert.equal(
    checkRealDeviceEvidenceCommand(commit, {
      ciEvidencePath: 'release/ci runs.json',
      platformEvidencePath: "release/platform evidence's draft.json",
      realDeviceEvidencePath: 'release/real device evidence.json',
    }),
    `npm run check:real-device-evidence -- --path 'release/real device evidence.json' --platform-evidence 'release/platform evidence'\\''s draft.json' --ci-evidence 'release/ci runs.json' --expected-commit ${commit}`,
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
    checkPlatformEvidenceCommand(commit, {
      allowOpen: true,
      platformEvidencePath: "release/platform evidence's draft.json",
      summaryOutput: 'release/platform summary.json',
    }),
    `npm run check:platform-evidence -- --platform-evidence 'release/platform evidence'\\''s draft.json' --summary-output 'release/platform summary.json' --allow-open --expected-commit ${commit}`,
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
