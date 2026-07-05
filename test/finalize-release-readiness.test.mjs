import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import {
  applyReleaseReadinessFinalization,
  validateFinalizationSummary,
} from '../scripts/finalize-release-readiness.mjs'
import {
  collectFinalTodoRequirementStatuses,
  collectTodoItems,
  collectWarningMarkerHits,
} from '../scripts/release-readiness.mjs'

const repoRoot = process.cwd()
const finalizationFiles = [
  'TODO.md',
  'README.md',
  'docs/compatibility.md',
  'docs/production.md',
  'docs/real-device-release.md',
]

function readSources() {
  return Object.fromEntries(
    finalizationFiles.map((file) => [
      file,
      fs.readFileSync(path.join(repoRoot, file), 'utf-8'),
    ]),
  )
}

function readyFinalizationSummary() {
  const todoItems = collectTodoItems(
    fs.readFileSync(path.join(repoRoot, 'TODO.md'), 'utf-8'),
  )
  const finalTodoRequirements = collectFinalTodoRequirementStatuses(todoItems, {
    androidRealDeviceEvidenceReady: true,
    checkCiEvidenceReady: true,
    ciEvidenceReady: true,
    godotSmokeCiEvidenceReady: true,
    iosRealDeviceEvidenceReady: true,
    publicReadmesReady: false,
    realDeviceEvidenceReady: true,
    releaseReadinessEvidenceReady: true,
    rootReadmeWarningReady: false,
    warningWordingReady: false,
  })

  return {
    allowOpen: false,
    blockers: finalTodoRequirements.map(
      (status) => `${status.file}:${status.line} ${status.text}`,
    ),
    checks: {
      androidRealDeviceEvidence: true,
      checkedFinalTodosBackedByEvidence: true,
      cleanWorktree: true,
      finalTodoStructure: true,
      iosRealDeviceEvidence: true,
      packageDescriptionWarningsRemoved: true,
      publicSurface: true,
      realDeviceEvidence: true,
      realDeviceEvidenceMetadata: true,
      releaseReadinessEvidence: true,
      releaseTooling: true,
      releaseWorkflows: true,
      strictCiEvidence: true,
    },
    finalTodoRequirements,
    packageDescriptionWarningCount: 0,
  }
}

test('release readiness finalizer rejects unsafe summaries', () => {
  const allowOpenSummary = {
    ...readyFinalizationSummary(),
    allowOpen: true,
  }
  assert.match(
    validateFinalizationSummary(allowOpenSummary).join('\n'),
    /strict mode without --allow-open/,
  )

  const missingEvidenceSummary = {
    ...readyFinalizationSummary(),
    checks: {
      ...readyFinalizationSummary().checks,
      realDeviceEvidence: false,
    },
    finalTodoRequirements: readyFinalizationSummary().finalTodoRequirements.map(
      (status) =>
        status.proof === 'realDeviceEvidenceReady'
          ? { ...status, ready: false }
          : status,
    ),
  }
  const missingEvidenceErrors =
    validateFinalizationSummary(missingEvidenceSummary).join('\n')

  assert.match(missingEvidenceErrors, /checks\.realDeviceEvidence must be true/)
  assert.match(
    missingEvidenceErrors,
    /realDeviceEvidenceReady must be ready before finalization/,
  )
})

test('release readiness finalizer checks final TODOs and removes warning markers', () => {
  const sources = readSources()
  const result = applyReleaseReadinessFinalization(
    sources,
    readyFinalizationSummary(),
  )

  assert.deepEqual(result.errors, [])
  assert.deepEqual(
    result.changedFiles,
    [
      'TODO.md',
      'README.md',
      'docs/compatibility.md',
      'docs/production.md',
      'docs/real-device-release.md',
    ],
  )
  assert.match(
    result.sources['TODO.md'],
    /- \[x\] `npm run check` passes locally and in CI\./,
  )
  assert.match(
    result.sources['TODO.md'],
    /- \[x\] The root README warning is removed in the same commit that marks this checklist complete\./,
  )
  assert.doesNotMatch(
    result.sources['README.md'],
    /experimental and not production ready yet/i,
  )
  assert.doesNotMatch(result.sources['README.md'], /preview\/experimental/)
  assert.doesNotMatch(
    result.sources['docs/production.md'],
    /preview\/alpha-quality/,
  )
  assert.deepEqual(
    collectWarningMarkerHits((file) => result.sources[file] ?? ''),
    [],
  )
})
