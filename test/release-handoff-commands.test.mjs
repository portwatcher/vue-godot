import assert from 'node:assert/strict'
import test from 'node:test'

import {
  checkRealDeviceEvidenceCommand,
  defaultPlatformEvidencePath,
  defaultRealDeviceEvidencePath,
  defaultReleasePreflightSummaryPath,
  defaultReleaseReadinessEvidencePath,
  defaultReleaseCiEvidencePath,
  initialReleaseCiCommands,
  productionProfilePlatformEvidenceCommand,
  releaseEvidenceCommand,
  releaseCandidateCommitPlaceholder,
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

  assert.deepEqual(initialReleaseCiCommands(commit), [
    `npm run release:ci -- --commit ${commit} --wait --output release/ci-runs.json`,
    `GH_TOKEN="$(gh auth token)" npm run release:ci -- --commit ${commit} --dispatch-missing --wait --ref ${releaseDispatchRefPlaceholder} --output release/ci-runs.json`,
  ])
})

test('release handoff commands format real-device evidence assembly', () => {
  assert.equal(
    releaseEvidenceCommand(commit),
    `npm run release:evidence -- --platform-evidence release/platform-evidence.json --ci-evidence release/ci-runs.json --commit ${commit} --real-device-output release/real-device-evidence.json`,
  )
  assert.equal(
    checkRealDeviceEvidenceCommand(commit),
    `npm run check:real-device-evidence -- --expected-commit ${commit}`,
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
      `GH_TOKEN="$(gh auth token)" npm run release:ci -- --commit ${commit} --include-release-preflight --release-preflight-run-commit ${evidenceCommit} --dispatch-missing --wait --ref ${releaseDispatchRefPlaceholder} --real-device-evidence-path release/real-device-evidence.json --output release/ci-runs.json`,
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
