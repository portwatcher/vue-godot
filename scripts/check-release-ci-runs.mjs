import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  dispatchGitHubActionsWorkflow,
  fetchGitHubCommitExists,
  fetchGitHubCommitSha,
  fetchGitHubActionsRunsForCommit,
  hasGitHubActionsRunUrl,
  validateGitHubActionsRunMetadata,
} from './release-evidence-utils.mjs'
import { repoRoot, run } from './release-utils.mjs'

export const releasePreflightWorkflowName = 'Release Preflight'
export const requiredReleaseCiWorkflows = ['Check', 'Godot Smoke']
export const releaseCiWorkflowDispatches = {
  Check: {
    workflowId: 'check.yml',
  },
  'Godot Smoke': {
    workflowId: 'godot-smoke.yml',
  },
  [releasePreflightWorkflowName]: {
    workflowId: 'release-preflight.yml',
    inputName: 'real_device_evidence_path',
  },
}

const defaultPollMs = 15_000
const defaultTimeoutMs = 45 * 60_000
const defaultRealDeviceEvidencePath = 'release/real-device-evidence.json'

function usage() {
  console.log(`Usage: node scripts/check-release-ci-runs.mjs [options]

Verifies that the release commit has completed successful GitHub Actions runs
for the required release CI workflows, then prints the run URLs and structured
workflow readiness status used by release evidence.

Options:
  --commit <sha>       Commit to verify. Default: current HEAD.
  --include-release-preflight
                       Also require the Release Preflight workflow run.
  --wait               Poll GitHub Actions until required runs pass or timeout.
  --timeout-ms <ms>    Maximum wait time. Default: ${defaultTimeoutMs}.
  --poll-ms <ms>       Poll interval while waiting. Default: ${defaultPollMs}.
  --dispatch-missing   Dispatch missing or previously failed workflows before
                       waiting. Requires GITHUB_TOKEN or GH_TOKEN.
  --ref <branch|tag>   Branch or tag to dispatch. Default: current branch.
                       The ref must resolve to --commit on GitHub.
  --real-device-evidence-path <file>
                       Release Preflight workflow input when dispatching it.
                       Default: ${defaultRealDeviceEvidencePath}.
  --json               Print machine-readable evidence JSON.
  --output <file>      Write machine-readable evidence JSON to a file.
  --allow-missing      Exit 0 while still reporting missing runs.
  --help               Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    commit: null,
    includeReleasePreflight: false,
    json: false,
    output: null,
    allowMissing: false,
    wait: false,
    timeoutMs: defaultTimeoutMs,
    pollMs: defaultPollMs,
    dispatchMissing: false,
    ref: null,
    realDeviceEvidencePath: defaultRealDeviceEvidencePath,
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

    if (arg === '--include-release-preflight') {
      options.includeReleasePreflight = true
      continue
    }

    if (arg === '--wait') {
      options.wait = true
      continue
    }

    if (arg === '--dispatch-missing') {
      options.dispatchMissing = true
      continue
    }

    if (arg === '--timeout-ms') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--timeout-ms requires a value')
      }
      options.timeoutMs = parsePositiveInteger(value, '--timeout-ms')
      continue
    }

    if (arg.startsWith('--timeout-ms=')) {
      options.timeoutMs = parsePositiveInteger(
        arg.slice('--timeout-ms='.length),
        '--timeout-ms',
      )
      continue
    }

    if (arg === '--poll-ms') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--poll-ms requires a value')
      }
      options.pollMs = parsePositiveInteger(value, '--poll-ms')
      continue
    }

    if (arg.startsWith('--poll-ms=')) {
      options.pollMs = parsePositiveInteger(
        arg.slice('--poll-ms='.length),
        '--poll-ms',
      )
      continue
    }

    if (arg === '--output') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--output requires a value')
      }
      options.output = value
      continue
    }

    if (arg.startsWith('--output=')) {
      options.output = arg.slice('--output='.length)
      continue
    }

    if (arg === '--ref') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--ref requires a value')
      }
      options.ref = value
      continue
    }

    if (arg.startsWith('--ref=')) {
      options.ref = arg.slice('--ref='.length)
      continue
    }

    if (arg === '--real-device-evidence-path') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--real-device-evidence-path requires a value')
      }
      options.realDeviceEvidencePath = value
      continue
    }

    if (arg.startsWith('--real-device-evidence-path=')) {
      options.realDeviceEvidencePath = arg.slice(
        '--real-device-evidence-path='.length,
      )
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

function parsePositiveInteger(value, optionName) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${optionName} must be a positive integer`)
  }
  return parsed
}

function currentCommit() {
  const result = run('git', ['rev-parse', 'HEAD'])
  if (result.status !== 0) {
    throw new Error(`Unable to read current git commit\n${result.stderr}`)
  }
  return result.stdout.trim()
}

function currentBranchRef() {
  const result = run('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
  if (result.status !== 0) {
    throw new Error(`Unable to read current git branch\n${result.stderr}`)
  }

  const branch = result.stdout.trim()
  if (branch.length === 0 || branch === 'HEAD') {
    throw new Error(
      'Unable to infer workflow dispatch ref from detached HEAD; pass --ref <branch|tag>.',
    )
  }
  return branch
}

function readGitValue(args) {
  const result = run('git', args)
  if (result.status !== 0) {
    return null
  }

  const value = result.stdout.trim()
  return value.length > 0 ? value : null
}

export function collectLocalGitReleaseState(commit) {
  const currentHead = readGitValue(['rev-parse', 'HEAD'])
  const branch = readGitValue(['rev-parse', '--abbrev-ref', 'HEAD'])
  const currentBranch = branch && branch !== 'HEAD' ? branch : null
  const upstreamRef = readGitValue([
    'rev-parse',
    '--abbrev-ref',
    '--symbolic-full-name',
    '@{u}',
  ])
  const upstreamCommit = upstreamRef ? readGitValue(['rev-parse', '@{u}']) : null
  const statusResult = run('git', ['status', '--porcelain'])
  const dirtyWorktree =
    statusResult.status === 0 && statusResult.stdout.trim().length > 0

  return {
    currentBranch,
    currentHead,
    commitIsHead: currentHead === commit,
    upstreamRef,
    upstreamCommit,
    upstreamMatchesCommit: upstreamCommit === commit,
    dirtyWorktree,
  }
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

export function selectLatestWorkflowRun(runs, workflowName, commit) {
  return runs
    .filter(
      (runMetadata) =>
        runMetadata.name === workflowName && runMetadata.head_sha === commit,
    )
    .sort((left, right) => {
      const timeDelta = runTime(right) - runTime(left)
      return timeDelta === 0 ? runId(right) - runId(left) : timeDelta
    })[0]
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

export function missingReleaseCiWorkflows(
  runs,
  commit,
  workflows = requiredReleaseCiWorkflows,
) {
  return workflows.filter(
    (workflowName) => !selectSuccessfulWorkflowRun(runs, workflowName, commit),
  )
}

export function dispatchableReleaseCiWorkflows(
  runs,
  commit,
  workflows = requiredReleaseCiWorkflows,
) {
  return workflows.filter((workflowName) => {
    if (selectSuccessfulWorkflowRun(runs, workflowName, commit)) {
      return false
    }

    const latestRun = selectLatestWorkflowRun(runs, workflowName, commit)
    return !latestRun || latestRun.status === 'completed'
  })
}

export function collectReleaseCiRunEvidence(
  runs,
  commit,
  workflows = requiredReleaseCiWorkflows,
  options = {},
) {
  const evidence = {
    commit,
    workflows: {},
  }
  const errors = []

  if (options.commitFound === false) {
    errors.push(
      `Commit ${commit} was not found on GitHub; push the release-candidate commit before collecting CI evidence.`,
    )
  }

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

export function validateWorkflowDispatchRef(ref, commit, refCommit) {
  if (refCommit == null) {
    return [
      `Workflow dispatch ref ${ref} was not found on GitHub; push the branch or tag before dispatching release CI.`,
    ]
  }

  if (refCommit !== commit) {
    return [
      `Workflow dispatch ref ${ref} points to ${refCommit}, not release commit ${commit}; push or update the ref before dispatching release CI.`,
    ]
  }

  return []
}

function releaseCiWorkflows(options) {
  return options.includeReleasePreflight
    ? [...requiredReleaseCiWorkflows, releasePreflightWorkflowName]
    : requiredReleaseCiWorkflows
}

function workflowDispatchInputs(workflowName, options) {
  const dispatchConfig = releaseCiWorkflowDispatches[workflowName]
  if (!dispatchConfig?.inputName) {
    return {}
  }

  return {
    [dispatchConfig.inputName]: options.realDeviceEvidencePath,
  }
}

function logProgress(options, message) {
  if (options.json) {
    console.error(message)
    return
  }
  console.log(message)
}

export function collectReleaseCiHints(output) {
  const hints = []
  const localGit = output.localGit

  if (!localGit) {
    return hints
  }

  if (output.commitFound === false) {
    if (localGit.currentBranch && !localGit.upstreamRef) {
      hints.push(
        `Current branch ${localGit.currentBranch} has no upstream; push a branch or pass --ref to a branch or tag that exists on GitHub before collecting CI evidence.`,
      )
    } else if (
      localGit.upstreamRef &&
      localGit.upstreamMatchesCommit === false
    ) {
      hints.push(
        `Upstream ${localGit.upstreamRef} does not point at release commit ${output.commit}; push the release-candidate commit before collecting CI evidence.`,
      )
    }

    if (localGit.currentHead && !localGit.commitIsHead) {
      hints.push(
        `Current HEAD is ${localGit.currentHead}, but release:ci is checking ${output.commit}; make sure the pushed ref contains the checked commit.`,
      )
    }
  }

  if (localGit.dirtyWorktree) {
    hints.push(
      'Working tree has local changes; final release readiness still requires a clean worktree.',
    )
  }

  return hints
}

function releaseCiCommand(output, options = {}) {
  const args = ['npm run release:ci --', '--commit', output.commit]
  if (output.requiredWorkflowNames.includes(releasePreflightWorkflowName)) {
    args.push('--include-release-preflight')
  }
  if (options.dispatchMissing) {
    args.push('--dispatch-missing')
  }
  if (options.wait) {
    args.push('--wait')
  }
  if (options.ref) {
    args.push('--ref', options.ref)
  }
  if (
    options.realDeviceEvidencePath &&
    output.requiredWorkflowNames.includes(releasePreflightWorkflowName)
  ) {
    args.push(
      '--real-device-evidence-path',
      options.realDeviceEvidencePath,
    )
  }
  if (options.output) {
    args.push('--output', options.output)
  }
  return args.join(' ')
}

export function collectReleaseCiNextActions(output) {
  const actions = []
  const localGit = output.localGit

  if (localGit?.dirtyWorktree) {
    actions.push({
      id: 'clean-worktree',
      title: 'Commit or remove local changes before final release evidence',
      detail:
        'The CI run evidence can be collected with local changes present, but strict final readiness requires a clean worktree.',
      commands: ['git status --short'],
    })
  }

  if (output.commitFound === false) {
    const pushCommand =
      localGit?.currentBranch && !localGit.upstreamRef
        ? `git push --set-upstream origin ${localGit.currentBranch}`
        : 'git push'
    actions.push({
      id: 'push-release-candidate',
      title: 'Push the tested release-candidate commit',
      detail:
        'Run the local check, then push the release-candidate commit so GitHub Actions evidence can be collected.',
      commands: [
        'npm run check',
        pushCommand,
        releaseCiCommand(output, {
          wait: true,
          output: 'release/ci-runs.json',
        }),
      ],
    })
    return actions
  }

  if (output.missingWorkflowNames.length > 0) {
    const commandOptions = {
      dispatchMissing: true,
      output: 'release/ci-runs.json',
      realDeviceEvidencePath: defaultRealDeviceEvidencePath,
      ref: '<branch-or-tag>',
      wait: true,
    }
    actions.push({
      id: 'dispatch-missing-workflows',
      title: 'Dispatch and wait for missing release CI workflows',
      detail:
        'Run the local check, then use a branch or tag that resolves to the tested release commit so manually dispatched workflows attach to the right SHA.',
      commands: [
        'npm run check',
        `GH_TOKEN="$(gh auth token)" ${releaseCiCommand(output, commandOptions)}`,
      ],
    })
  }

  return actions
}

function printText(output, workflows) {
  console.log(`[release-ci] commit ${output.evidence.commit}`)
  for (const workflowName of workflows) {
    const runEvidence = output.evidence.workflows[workflowName]
    if (runEvidence) {
      console.log(`[release-ci] ${workflowName}: ${runEvidence.runUrl}`)
    }
  }

  if (output.errors.length === 0) {
    console.log('[release-ci] all required CI runs passed')
  } else {
    console.log('[release-ci] missing required CI runs')
    for (const error of output.errors) {
      console.log(`- ${error}`)
    }
  }

  if (output.hints.length > 0) {
    console.log('\n[release-ci] local git hints')
    for (const hint of output.hints) {
      console.log(`- ${hint}`)
    }
  }

  if (output.nextActions.length > 0) {
    console.log('\n[release-ci] next actions')
    for (const action of output.nextActions) {
      console.log(`- ${action.title}`)
      for (const command of action.commands) {
        console.log(`  ${command}`)
      }
    }
  }
}

function writeJson(filePath, data, options) {
  const resolved = path.resolve(repoRoot, filePath)
  fs.mkdirSync(path.dirname(resolved), { recursive: true })
  fs.writeFileSync(resolved, `${JSON.stringify(data, null, 2)}\n`)
  logProgress(
    options,
    `[release-ci] wrote ${path.relative(repoRoot, resolved)}`,
  )
}

async function collectReleaseCiRunResult(commit, workflows) {
  const commitFound = await fetchGitHubCommitExists(commit)
  const runs = commitFound ? await fetchGitHubActionsRunsForCommit(commit) : []
  const result = collectReleaseCiRunEvidence(runs, commit, workflows, {
    commitFound,
  })

  return { ...result, runs, commitFound }
}

async function dispatchReleaseCiWorkflows(workflows, ref, options) {
  for (const workflowName of workflows) {
    const dispatchConfig = releaseCiWorkflowDispatches[workflowName]
    if (!dispatchConfig) {
      throw new Error(`No workflow dispatch config for ${workflowName}`)
    }

    logProgress(options, `[release-ci] dispatching ${workflowName} on ${ref}`)
    await dispatchGitHubActionsWorkflow(
      dispatchConfig.workflowId,
      ref,
      workflowDispatchInputs(workflowName, options),
    )
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function waitForReleaseCiRunResult(commit, workflows, options) {
  const deadline = Date.now() + options.timeoutMs
  let result = await collectReleaseCiRunResult(commit, workflows)

  while (result.errors.length > 0 && Date.now() < deadline) {
    const missing = missingReleaseCiWorkflows(result.runs, commit, workflows)
    logProgress(
      options,
      `[release-ci] waiting for ${missing.join(', ') || 'release CI'}...`,
    )
    await sleep(options.pollMs)
    result = await collectReleaseCiRunResult(commit, workflows)
  }

  if (result.errors.length > 0) {
    result.errors.push(
      `Timed out after ${options.timeoutMs}ms waiting for required release CI runs for commit ${commit}`,
    )
  }

  return result
}

export function releaseCiOutput(result, workflows = requiredReleaseCiWorkflows) {
  const passedWorkflowNames = workflows.filter(
    (workflowName) => result.evidence.workflows[workflowName],
  )
  const missingWorkflowNames = workflows.filter(
    (workflowName) => !result.evidence.workflows[workflowName],
  )
  const checks = {
    checkWorkflow: passedWorkflowNames.includes('Check'),
    commitFound: result.commitFound !== false,
    godotSmokeWorkflow: passedWorkflowNames.includes('Godot Smoke'),
  }

  if (workflows.includes(releasePreflightWorkflowName)) {
    checks.releasePreflightWorkflow = passedWorkflowNames.includes(
      releasePreflightWorkflowName,
    )
  }

  const output = {
    ready: result.errors.length === 0,
    commit: result.evidence.commit,
    commitFound: result.commitFound !== false,
    localGit: result.localGit ?? null,
    requiredWorkflowNames: [...workflows],
    passedWorkflowNames,
    missingWorkflowNames,
    checks,
    evidence: result.evidence,
    errors: result.errors,
    hints: collectReleaseCiHints({
      commit: result.evidence.commit,
      commitFound: result.commitFound !== false,
      localGit: result.localGit ?? null,
    }),
    nextActions: [],
  }

  output.nextActions = collectReleaseCiNextActions(output)
  return output
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const commit = options.commit ?? currentCommit()
  const workflows = releaseCiWorkflows(options)
  let result = await collectReleaseCiRunResult(commit, workflows)

  if (options.dispatchMissing && result.commitFound) {
    const workflowsToDispatch = dispatchableReleaseCiWorkflows(
      result.runs,
      commit,
      workflows,
    )

    if (workflowsToDispatch.length > 0) {
      const ref = options.ref ?? currentBranchRef()
      const refCommit = await fetchGitHubCommitSha(ref)
      const refErrors = validateWorkflowDispatchRef(ref, commit, refCommit)
      if (refErrors.length > 0) {
        throw new Error(refErrors.join('\n'))
      }

      await dispatchReleaseCiWorkflows(workflowsToDispatch, ref, options)
    }
  }

  if (options.wait && result.errors.length > 0 && result.commitFound) {
    result = await waitForReleaseCiRunResult(commit, workflows, options)
  }

  const output = releaseCiOutput(
    { ...result, localGit: collectLocalGitReleaseState(commit) },
    workflows,
  )
  if (options.output) {
    writeJson(options.output, output, options)
  }

  if (options.json) {
    console.log(JSON.stringify(output, null, 2))
  } else {
    printText(output, workflows)
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
