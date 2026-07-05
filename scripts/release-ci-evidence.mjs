import fs from 'node:fs'
import path from 'node:path'
import {
  assertGitHubActionsRunUrl,
  isRecord,
} from './release-evidence-utils.mjs'
import { isFullCommitSha, repoRoot } from './release-utils.mjs'

export const defaultInitialCiWorkflowNames = ['Check', 'Godot Smoke']

export function workflowEvidenceErrors(ciEvidence, workflowName) {
  const errors = []
  const workflow = isRecord(ciEvidence.workflows?.[workflowName])
    ? ciEvidence.workflows[workflowName]
    : null

  if (!workflow) {
    return [`CI evidence missing ${workflowName} workflow run`]
  }

  assertGitHubActionsRunUrl(workflow, 'runUrl', errors, workflowName)

  if (!isFullCommitSha(workflow.runCommit)) {
    errors.push(
      `CI evidence ${workflowName}.runCommit must be a full 40-character git commit SHA`,
    )
  }

  if (workflow.runConclusion !== 'success') {
    errors.push(`CI evidence ${workflowName}.runConclusion must be "success"`)
  }

  return errors
}

export function validateInitialCiEvidence(ciResult, expectedCommit) {
  const errors = []
  if (!isRecord(ciResult)) {
    return ['CI evidence must be a JSON object']
  }

  if (ciResult.ready !== true) {
    errors.push('CI evidence ready must be true')
  }
  if (ciResult.commitFound !== true) {
    errors.push('CI evidence commitFound must be true')
  }
  if (ciResult.commit !== expectedCommit) {
    errors.push(`CI evidence commit must match ${expectedCommit}`)
  }

  for (const fieldName of ['requiredWorkflowNames', 'passedWorkflowNames']) {
    const workflowNames = ciResult[fieldName]
    if (!Array.isArray(workflowNames)) {
      errors.push(`CI evidence ${fieldName} must be an array`)
      continue
    }

    for (const workflowName of defaultInitialCiWorkflowNames) {
      if (!workflowNames.includes(workflowName)) {
        errors.push(`CI evidence ${fieldName} must include ${workflowName}`)
      }
    }
  }

  if (!Array.isArray(ciResult.missingWorkflowNames)) {
    errors.push('CI evidence missingWorkflowNames must be an array')
  } else {
    const missingRequiredWorkflowNames = defaultInitialCiWorkflowNames.filter(
      (workflowName) => ciResult.missingWorkflowNames.includes(workflowName),
    )
    if (missingRequiredWorkflowNames.length > 0) {
      errors.push(
        `CI evidence missing required workflow(s): ${missingRequiredWorkflowNames.join(', ')}`,
      )
    }
  }

  if (!isRecord(ciResult.checks)) {
    errors.push('CI evidence checks must be an object')
  } else {
    for (const [checkName, workflowName] of [
      ['commitFound', 'release commit'],
      ['checkWorkflow', 'Check'],
      ['godotSmokeWorkflow', 'Godot Smoke'],
    ]) {
      if (ciResult.checks[checkName] !== true) {
        errors.push(
          `CI evidence checks.${checkName} must be true for ${workflowName}`,
        )
      }
    }
  }

  const ciEvidence = isRecord(ciResult.evidence) ? ciResult.evidence : null
  if (!ciEvidence) {
    errors.push('CI evidence must include an evidence object')
    return errors
  }

  if (ciEvidence.commit !== expectedCommit) {
    errors.push(`CI evidence.evidence.commit must match ${expectedCommit}`)
  }
  if (!isRecord(ciEvidence.workflows)) {
    errors.push('CI evidence must include evidence.workflows')
    return errors
  }

  for (const workflowName of defaultInitialCiWorkflowNames) {
    errors.push(...workflowEvidenceErrors(ciEvidence, workflowName))
  }

  return errors
}

export function resolveCiEvidencePath(evidencePath) {
  return path.resolve(repoRoot, evidencePath)
}

export function readInitialCiEvidenceStatus(evidencePath, expectedCommit) {
  const resolvedPath = resolveCiEvidencePath(evidencePath)
  const status = {
    commit: null,
    errorCount: 0,
    errors: [],
    expectedCommit: expectedCommit ?? null,
    path: evidencePath,
    ready: false,
    validForCommit: null,
  }

  if (!expectedCommit) {
    status.errors.push('expected commit is required to validate CI evidence')
    status.errorCount = status.errors.length
    return status
  }

  let ciResult
  try {
    ciResult = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'))
    if (isRecord(ciResult) && isFullCommitSha(ciResult.commit)) {
      status.commit = ciResult.commit
    }
  } catch (error) {
    status.errors.push(
      `Unable to read CI evidence at ${evidencePath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    status.errorCount = status.errors.length
    return status
  }

  status.errors = validateInitialCiEvidence(ciResult, expectedCommit)
  status.ready = status.errors.length === 0
  if (
    !status.ready &&
    status.commit &&
    status.commit !== expectedCommit &&
    validateInitialCiEvidence(ciResult, status.commit).length === 0
  ) {
    status.validForCommit = status.commit
  }
  status.errorCount = status.errors.length
  return status
}
