import { pathToFileURL } from 'node:url'
import {
  fetchGitHubActionsRunsForCommit,
  hasGitHubActionsRunUrl,
  validateGitHubActionsRunMetadata,
} from './release-evidence-utils.mjs'
import { run } from './release-utils.mjs'

export const requiredReleaseCiWorkflows = ['Check', 'Godot Smoke']

function usage() {
  console.log(`Usage: node scripts/check-release-ci-runs.mjs [options]

Verifies that the release commit has completed successful GitHub Actions runs
for the required release CI workflows, then prints the run URLs used by
release evidence.

Options:
  --commit <sha>       Commit to verify. Default: current HEAD.
  --json               Print machine-readable evidence JSON.
  --allow-missing      Exit 0 while still reporting missing runs.
  --help               Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    commit: null,
    json: false,
    allowMissing: false,
  }

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
    }

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--allow-missing') {
      options.allowMissing = true
      continue
    }

    if (arg === '--commit') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--commit requires a value')
      }
      options.commit = value
      continue
    }

    if (arg.startsWith('--commit=')) {
      options.commit = arg.slice('--commit='.length)
      continue
    }

    throw new Error(`Unknown option: ${arg}`)
  }

  return options
}

function currentCommit() {
  const result = run('git', ['rev-parse', 'HEAD'])
  if (result.status !== 0) {
    throw new Error(`Unable to read current git commit\n${result.stderr}`)
  }
  return result.stdout.trim()
}

function runTime(runMetadata) {
  for (const key of ['updated_at', 'run_started_at', 'created_at']) {
    const timestamp = Date.parse(runMetadata[key])
    if (Number.isFinite(timestamp)) {
      return timestamp
    }
  }
  return 0
}

function runId(runMetadata) {
  return typeof runMetadata.id === 'number' ? runMetadata.id : 0
}

export function summarizeWorkflowRun(runMetadata) {
  return {
    workflowName: runMetadata.name,
    runUrl: runMetadata.html_url,
    runId: runMetadata.id,
    runNumber: runMetadata.run_number,
    runAttempt: runMetadata.run_attempt,
    runCommit: runMetadata.head_sha,
    runConclusion: runMetadata.conclusion,
  }
}

export function selectSuccessfulWorkflowRun(runs, workflowName, commit) {
  return runs
    .filter(
      (runMetadata) =>
        validateGitHubActionsRunMetadata(runMetadata, {
          label: workflowName,
          workflowName,
          commit,
          conclusion: 'success',
        }).length === 0 &&
        hasGitHubActionsRunUrl({ runUrl: runMetadata.html_url }, 'runUrl'),
    )
    .sort((left, right) => {
      const timeDelta = runTime(right) - runTime(left)
      return timeDelta === 0 ? runId(right) - runId(left) : timeDelta
    })[0]
}

export function collectReleaseCiRunEvidence(
  runs,
  commit,
  workflows = requiredReleaseCiWorkflows,
) {
  const evidence = {
    commit,
    workflows: {},
  }
  const errors = []

  for (const workflowName of workflows) {
    const runMetadata = selectSuccessfulWorkflowRun(runs, workflowName, commit)
    if (!runMetadata) {
      errors.push(
        `No completed successful ${workflowName} workflow run found for commit ${commit}`,
      )
      continue
    }

    evidence.workflows[workflowName] = summarizeWorkflowRun(runMetadata)
  }

  return { evidence, errors }
}

function printText(evidence, errors) {
  console.log(`[release-ci] commit ${evidence.commit}`)
  for (const workflowName of requiredReleaseCiWorkflows) {
    const runEvidence = evidence.workflows[workflowName]
    if (runEvidence) {
      console.log(`[release-ci] ${workflowName}: ${runEvidence.runUrl}`)
    }
  }

  if (errors.length === 0) {
    console.log('[release-ci] all required CI runs passed')
    return
  }

  console.log('[release-ci] missing required CI runs')
  for (const error of errors) {
    console.log(`- ${error}`)
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const commit = options.commit ?? currentCommit()
  const runs = await fetchGitHubActionsRunsForCommit(commit)
  const result = collectReleaseCiRunEvidence(runs, commit)

  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    printText(result.evidence, result.errors)
  }

  if (result.errors.length > 0 && !options.allowMissing) {
    process.exit(1)
  }
}

const entryPoint = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (import.meta.url === entryPoint) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
}
