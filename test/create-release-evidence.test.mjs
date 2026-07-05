import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

import {
  buildRealDeviceEvidence,
  buildReleaseReadinessEvidence,
  extractCiRunUrls,
  extractReleasePreflightWarningCount,
} from '../scripts/create-release-evidence.mjs'
import {
  requiredRealDeviceChecks,
  validateRealDeviceEvidence,
} from '../scripts/real-device-evidence.mjs'
import { validateReleaseReadinessEvidence } from '../scripts/release-readiness.mjs'
import { currentReleasePackageVersions } from '../scripts/release-utils.mjs'

const commit = '0123456789abcdef0123456789abcdef01234567'

function ciRunResult(workflows, overrides = {}) {
  const workflowNames = Object.keys(workflows)
  return {
    ready: true,
    commit,
    commitFound: true,
    requiredWorkflowNames: workflowNames,
    passedWorkflowNames: workflowNames,
    missingWorkflowNames: [],
    checks: {
      checkWorkflow: workflowNames.includes('Check'),
      commitFound: true,
      godotSmokeWorkflow: workflowNames.includes('Godot Smoke'),
      ...(workflowNames.includes('Release Preflight')
        ? { releasePreflightWorkflow: true }
        : {}),
    },
    evidence: {
      commit,
      workflows,
    },
    errors: [],
    ...overrides,
  }
}

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
    selectedApis: ['fetch', 'navigator.permissions', 'SafeAreaView'],
    passedChecks: [...requiredRealDeviceChecks[platform]],
    skippedChecks: {},
  }
}

test('buildRealDeviceEvidence assembles validator-ready evidence from CI runs and device data', () => {
  const packageVersions = currentReleasePackageVersions()
  const evidence = buildRealDeviceEvidence({
    commit,
    packageVersions,
    godotJsVersion: 'GodotJS 1.0.0-2 / Godot 4.4.x',
    checkRunUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
    checkRun: {
      name: 'Check',
      head_sha: commit,
      conclusion: 'success',
    },
    godotSmokeRunUrl:
      'https://github.com/portwatcher/vue-godot/actions/runs/2',
    godotSmokeRun: {
      name: 'Godot Smoke',
      head_sha: commit,
      conclusion: 'success',
    },
    platformEvidence: {
      android: platformEvidence('android'),
      ios: platformEvidence('ios'),
    },
  })

  assert.deepEqual(
    validateRealDeviceEvidence(evidence, {
      expectedCommit: commit,
      expectedPackageVersions: packageVersions,
    }),
    [],
  )
})

test('buildReleaseReadinessEvidence records release preflight run metadata', () => {
  const evidence = buildReleaseReadinessEvidence({
    commit,
    releasePreflightRunUrl:
      'https://github.com/portwatcher/vue-godot/actions/runs/3',
    releasePreflightRun: {
      name: 'Release Preflight',
      head_sha: commit,
      conclusion: 'success',
    },
    releasePreflightLocalOnly: false,
    releasePreflightSkipCheck: false,
    releasePreflightSkipGodot: false,
    releasePreflightSkipSeriousExamples: false,
    releasePreflightFailureCount: 0,
    releasePreflightWarningCount: 0,
  })

  assert.deepEqual(evidence, {
    commit,
    releasePreflightRunUrl:
      'https://github.com/portwatcher/vue-godot/actions/runs/3',
    releasePreflightRunWorkflowName: 'Release Preflight',
    releasePreflightRunCommit: commit,
    releasePreflightRunConclusion: 'success',
    releasePreflightLocalOnly: false,
    releasePreflightSkipCheck: false,
    releasePreflightSkipGodot: false,
    releasePreflightSkipSeriousExamples: false,
    releasePreflightFailureCount: 0,
    releasePreflightWarningCount: 0,
  })
  assert.deepEqual(validateReleaseReadinessEvidence(evidence, commit), [])
})

test('create-release-evidence requires a preflight summary for readiness evidence', () => {
  const result = spawnSync(
    process.execPath,
    [
      'scripts/create-release-evidence.mjs',
      '--platform-evidence',
      'docs/real-device-evidence.example.json',
      '--real-device-output',
      'release/real-device-evidence.json',
      '--readiness-output',
      'release/release-readiness-evidence.json',
      '--check-run-url',
      'https://github.com/portwatcher/vue-godot/actions/runs/1',
      '--godot-smoke-run-url',
      'https://github.com/portwatcher/vue-godot/actions/runs/2',
      '--release-preflight-run-url',
      'https://github.com/portwatcher/vue-godot/actions/runs/3',
      '--release-preflight-warning-count',
      '0',
      '--commit',
      commit,
    ],
    {
      cwd: process.cwd(),
      encoding: 'utf-8',
    },
  )

  assert.equal(result.status, 1)
  assert.match(
    `${result.stdout}\n${result.stderr}`,
    /Missing required option: --release-preflight-summary/,
  )
})

test('extractCiRunUrls reads release CI evidence for the evidence commit', () => {
  assert.deepEqual(
    extractCiRunUrls(
      ciRunResult({
        Check: {
          runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
        },
        'Godot Smoke': {
          runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/2',
        },
      }),
      commit,
    ),
    {
      checkRunUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
      godotSmokeRunUrl:
        'https://github.com/portwatcher/vue-godot/actions/runs/2',
      releasePreflightRunUrl: null,
      errors: [],
    },
  )
})

test('extractCiRunUrls rejects not-ready release CI summaries', () => {
  const result = extractCiRunUrls(
    ciRunResult(
      {
        Check: {
          runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
        },
        'Godot Smoke': {
          runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/2',
        },
      },
      {
        ready: false,
        commitFound: false,
        passedWorkflowNames: ['Check'],
        missingWorkflowNames: ['Godot Smoke'],
        checks: {
          checkWorkflow: true,
          commitFound: false,
          godotSmokeWorkflow: false,
        },
        errors: [],
      },
    ),
    commit,
  )

  assert.equal(
    result.checkRunUrl,
    'https://github.com/portwatcher/vue-godot/actions/runs/1',
  )
  assert.equal(
    result.godotSmokeRunUrl,
    'https://github.com/portwatcher/vue-godot/actions/runs/2',
  )
  assert.match(result.errors.join('\n'), /ready must be true/)
  assert.match(result.errors.join('\n'), /commitFound must be true/)
  assert.match(
    result.errors.join('\n'),
    /checks\.godotSmokeWorkflow must be true/,
  )
  assert.match(
    result.errors.join('\n'),
    /passedWorkflowNames must include passed workflow Godot Smoke/,
  )
  assert.match(
    result.errors.join('\n'),
    /missingWorkflowNames includes required workflow\(s\): Godot Smoke/,
  )
})

test('extractCiRunUrls rejects partial structured CI summaries', () => {
  const result = extractCiRunUrls(
    {
      ready: true,
      evidence: {
        commit,
        workflows: {
          Check: {
            runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
          },
          'Godot Smoke': {
            runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/2',
          },
        },
      },
      errors: [],
    },
    commit,
  )

  assert.equal(
    result.checkRunUrl,
    'https://github.com/portwatcher/vue-godot/actions/runs/1',
  )
  assert.match(result.errors.join('\n'), /commitFound must be true/)
  assert.match(result.errors.join('\n'), /checks must be an object/)
  assert.match(
    result.errors.join('\n'),
    /requiredWorkflowNames must be an array/,
  )
  assert.match(
    result.errors.join('\n'),
    /passedWorkflowNames must be an array/,
  )
  assert.match(
    result.errors.join('\n'),
    /missingWorkflowNames must be an array/,
  )
})

test('extractCiRunUrls requires structured Release Preflight readiness when requested', () => {
  const result = extractCiRunUrls(
    ciRunResult(
      {
        Check: {
          runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
        },
        'Godot Smoke': {
          runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/2',
        },
        'Release Preflight': {
          runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/3',
        },
      },
      {
        checks: {
          checkWorkflow: true,
          commitFound: true,
          godotSmokeWorkflow: true,
          releasePreflightWorkflow: false,
        },
        passedWorkflowNames: ['Check', 'Godot Smoke'],
        missingWorkflowNames: ['Release Preflight'],
      },
    ),
    commit,
    { requireReleasePreflight: true },
  )

  assert.equal(
    result.releasePreflightRunUrl,
    'https://github.com/portwatcher/vue-godot/actions/runs/3',
  )
  assert.match(
    result.errors.join('\n'),
    /checks\.releasePreflightWorkflow must be true/,
  )
  assert.match(
    result.errors.join('\n'),
    /passedWorkflowNames must include passed workflow Release Preflight/,
  )
  assert.match(
    result.errors.join('\n'),
    /missingWorkflowNames includes required workflow\(s\): Release Preflight/,
  )
})

test('extractCiRunUrls accepts legacy CI evidence with verified workflow URLs', () => {
  assert.deepEqual(
    extractCiRunUrls(
      {
        evidence: {
          commit,
          workflows: {
            Check: {
              runUrl:
                'https://github.com/portwatcher/vue-godot/actions/runs/1',
            },
            'Godot Smoke': {
              runUrl:
                'https://github.com/portwatcher/vue-godot/actions/runs/2',
            },
          },
        },
        errors: [],
      },
      commit,
    ),
    {
      checkRunUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
      godotSmokeRunUrl:
        'https://github.com/portwatcher/vue-godot/actions/runs/2',
      releasePreflightRunUrl: null,
      errors: [],
    },
  )
})

test('extractCiRunUrls can read Release Preflight evidence for final readiness', () => {
  assert.deepEqual(
    extractCiRunUrls(
      ciRunResult({
        Check: {
          runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
        },
        'Godot Smoke': {
          runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/2',
        },
        'Release Preflight': {
          runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/3',
        },
      }),
      commit,
      { requireReleasePreflight: true },
    ),
    {
      checkRunUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
      godotSmokeRunUrl:
        'https://github.com/portwatcher/vue-godot/actions/runs/2',
      releasePreflightRunUrl:
        'https://github.com/portwatcher/vue-godot/actions/runs/3',
      errors: [],
    },
  )
})

test('extractCiRunUrls rejects stale or incomplete CI evidence', () => {
  const result = extractCiRunUrls(
    {
      evidence: {
        commit: 'ffffffffffffffffffffffffffffffffffffffff',
        workflows: {
          Check: {
            runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
          },
        },
      },
      errors: ['No completed successful Godot Smoke workflow run found'],
    },
    commit,
  )

  assert.equal(
    result.checkRunUrl,
    'https://github.com/portwatcher/vue-godot/actions/runs/1',
  )
  assert.equal(result.godotSmokeRunUrl, null)
  assert.equal(result.releasePreflightRunUrl, null)
  assert.match(result.errors.join('\n'), /unresolved errors/)
  assert.match(result.errors.join('\n'), /CI evidence commit must match/)
  assert.match(result.errors.join('\n'), /missing Godot Smoke/)
})

test('extractCiRunUrls rejects missing Release Preflight when required', () => {
  const result = extractCiRunUrls(
    {
      evidence: {
        commit,
        workflows: {
          Check: {
            runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
          },
          'Godot Smoke': {
            runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/2',
          },
        },
      },
      errors: [],
    },
    commit,
    { requireReleasePreflight: true },
  )

  assert.equal(result.releasePreflightRunUrl, null)
  assert.match(result.errors.join('\n'), /missing Release Preflight/)
})

test('extractReleasePreflightWarningCount reads a matching preflight summary', () => {
  assert.deepEqual(
    extractReleasePreflightWarningCount(
      {
        commit,
        localOnly: false,
        skipCheck: false,
        skipGodot: false,
        skipSeriousExamples: false,
        warningCount: 0,
        failureCount: 0,
        warnings: [],
        failures: [],
      },
      commit,
    ),
    {
      warningCount: 0,
      failureCount: 0,
      localOnly: false,
      skipCheck: false,
      skipGodot: false,
      skipSeriousExamples: false,
      errors: [],
    },
  )
})

test('extractReleasePreflightWarningCount rejects stale or failed summaries', () => {
  const result = extractReleasePreflightWarningCount(
    {
      commit: 'ffffffffffffffffffffffffffffffffffffffff',
      localOnly: false,
      skipCheck: false,
      skipGodot: false,
      skipSeriousExamples: false,
      warningCount: '0',
      failureCount: 1,
      failures: ['Godot smoke skipped by --skip-godot'],
    },
    commit,
  )

  assert.equal(result.warningCount, null)
  assert.match(result.errors.join('\n'), /summary commit must match/)
  assert.match(
    result.errors.join('\n'),
    /warningCount must be a non-negative integer/,
  )
  assert.match(result.errors.join('\n'), /contains 1 failure/)
  assert.match(result.errors.join('\n'), /Godot smoke skipped/)
})

test('extractReleasePreflightWarningCount rejects warning-bearing summaries', () => {
  const result = extractReleasePreflightWarningCount(
    {
      commit,
      localOnly: false,
      skipCheck: false,
      skipGodot: false,
      skipSeriousExamples: false,
      warningCount: 1,
      failureCount: 0,
      warnings: ['Real device evidence run metadata could not be verified'],
      failures: [],
    },
    commit,
  )

  assert.equal(result.warningCount, 1)
  assert.match(result.errors.join('\n'), /contains 1 warning/)
  assert.match(result.errors.join('\n'), /run metadata could not be verified/)
})

test('extractReleasePreflightWarningCount rejects local or skipped preflight summaries', () => {
  const result = extractReleasePreflightWarningCount(
    {
      commit,
      localOnly: true,
      skipCheck: true,
      skipGodot: true,
      skipSeriousExamples: true,
      warningCount: 0,
      failureCount: 0,
      warnings: [],
      failures: [],
    },
    commit,
  )

  assert.equal(result.warningCount, 0)
  assert.equal(result.localOnly, null)
  assert.equal(result.skipCheck, null)
  assert.equal(result.skipGodot, null)
  assert.equal(result.skipSeriousExamples, null)
  assert.match(result.errors.join('\n'), /non-local release preflight run/)
  assert.match(result.errors.join('\n'), /skipCheck must be false/)
  assert.match(result.errors.join('\n'), /skipGodot must be false/)
  assert.match(result.errors.join('\n'), /skipSeriousExamples must be false/)
})
