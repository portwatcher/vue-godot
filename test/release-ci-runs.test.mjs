import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import {
  collectReleaseCiHints,
  collectReleaseCiNextActions,
  collectReleaseCiRunEvidence,
  dispatchableReleaseCiWorkflows,
  missingReleaseCiWorkflows,
  releaseCiOutput,
  releaseCiWorkflowDispatches,
  releasePreflightWorkflowName,
  requiredReleaseCiWorkflows,
  selectLatestWorkflowRun,
  selectSuccessfulWorkflowRun,
  validateWorkflowDispatchRef,
} from '../scripts/check-release-ci-runs.mjs'

const commit = '0123456789abcdef0123456789abcdef01234567'
const otherCommit = 'abcdef0123456789abcdef0123456789abcdef01'
const workflowDir = path.join(process.cwd(), '.github/workflows')

function workflowRun(overrides) {
  return {
    id: 1,
    name: 'Check',
    head_sha: commit,
    status: 'completed',
    conclusion: 'success',
    html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
    run_number: 1,
    run_attempt: 1,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

test('release CI run evidence selects successful Check and Godot Smoke runs for the commit', () => {
  const runs = [
    workflowRun({
      id: 1,
      name: 'Check',
      head_sha: otherCommit,
      html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
    }),
    workflowRun({
      id: 2,
      name: 'Check',
      status: 'in_progress',
      conclusion: null,
      html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/2',
    }),
    workflowRun({
      id: 3,
      name: 'Check',
      html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/3',
      updated_at: '2026-01-01T00:05:00Z',
    }),
    workflowRun({
      id: 4,
      name: 'Godot Smoke',
      conclusion: 'failure',
      html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/4',
    }),
    workflowRun({
      id: 5,
      name: 'Godot Smoke',
      html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/5',
      updated_at: '2026-01-01T00:10:00Z',
    }),
  ]

  const { evidence, errors } = collectReleaseCiRunEvidence(runs, commit)

  assert.deepEqual(errors, [])
  assert.equal(evidence.commit, commit)
  assert.equal(
    evidence.workflows.Check.runUrl,
    'https://github.com/portwatcher/vue-godot/actions/runs/3',
  )
  assert.equal(
    evidence.workflows['Godot Smoke'].runUrl,
    'https://github.com/portwatcher/vue-godot/actions/runs/5',
  )
})

test('release CI run evidence reports missing required workflows', () => {
  const { evidence, errors } = collectReleaseCiRunEvidence(
    [
      workflowRun({
        name: 'Check',
        html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
      }),
    ],
    commit,
  )

  assert.equal(evidence.workflows.Check.workflowName, 'Check')
  assert.match(errors.join('\n'), /No completed successful Godot Smoke/)
})

test('release CI run evidence reports commits that are not visible on GitHub', () => {
  const { errors } = collectReleaseCiRunEvidence(
    [],
    commit,
    requiredReleaseCiWorkflows,
    { commitFound: false },
  )

  assert.match(errors[0], /Commit .* was not found on GitHub/)
  assert.match(errors[0], /push the release-candidate commit/)
  assert.match(errors.join('\n'), /No completed successful Check/)
})

test('release CI run evidence can include Release Preflight for final readiness', () => {
  const { evidence, errors } = collectReleaseCiRunEvidence(
    [
      workflowRun({
        name: 'Check',
        html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
      }),
      workflowRun({
        name: 'Godot Smoke',
        html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/2',
      }),
      workflowRun({
        name: releasePreflightWorkflowName,
        html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/3',
      }),
    ],
    commit,
    [...requiredReleaseCiWorkflows, releasePreflightWorkflowName],
  )

  assert.deepEqual(errors, [])
  assert.equal(
    evidence.workflows[releasePreflightWorkflowName].runUrl,
    'https://github.com/portwatcher/vue-godot/actions/runs/3',
  )
})

test('release CI output reports structured workflow readiness', () => {
  const workflows = [...requiredReleaseCiWorkflows, releasePreflightWorkflowName]
  const result = collectReleaseCiRunEvidence(
    [
      workflowRun({
        name: 'Check',
        html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
      }),
      workflowRun({
        name: releasePreflightWorkflowName,
        html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/3',
      }),
    ],
    commit,
    workflows,
  )
  const output = releaseCiOutput(
    { ...result, runs: [], commitFound: true },
    workflows,
  )

  assert.equal(output.ready, false)
  assert.equal(output.commit, commit)
  assert.equal(output.commitFound, true)
  assert.deepEqual(output.requiredWorkflowNames, workflows)
  assert.deepEqual(output.passedWorkflowNames, [
    'Check',
    releasePreflightWorkflowName,
  ])
  assert.deepEqual(output.missingWorkflowNames, ['Godot Smoke'])
  assert.deepEqual(output.checks, {
    checkWorkflow: true,
    commitFound: true,
    godotSmokeWorkflow: false,
    releasePreflightWorkflow: true,
  })
  assert.equal(output.evidence, result.evidence)
  assert.equal(output.errors, result.errors)
  assert.ok(
    output.nextActions.some(
      (action) =>
        action.id === 'dispatch-missing-workflows' &&
        action.commands[0] === 'npm run check' &&
        action.commands.some((command) =>
          command.includes('--include-release-preflight'),
        ) &&
        action.commands.some((command) =>
          command.includes('--real-device-evidence-path release/real-device-evidence.json'),
        ),
    ),
  )
})

test('release CI output reports missing commit status', () => {
  const result = collectReleaseCiRunEvidence(
    [],
    commit,
    requiredReleaseCiWorkflows,
    { commitFound: false },
  )
  const output = releaseCiOutput(
    { ...result, runs: [], commitFound: false },
    requiredReleaseCiWorkflows,
  )

  assert.equal(output.ready, false)
  assert.equal(output.commitFound, false)
  assert.deepEqual(output.passedWorkflowNames, [])
  assert.deepEqual(output.missingWorkflowNames, requiredReleaseCiWorkflows)
  assert.equal(output.checks.commitFound, false)
  assert.equal(output.checks.checkWorkflow, false)
  assert.equal(output.checks.godotSmokeWorkflow, false)
  assert.ok(
    output.nextActions.some(
      (action) =>
        action.id === 'push-release-candidate' &&
        action.commands[0] === 'npm run check' &&
        action.commands.includes('git push') &&
        action.commands.some((command) =>
          command.includes('--commit 0123456789abcdef0123456789abcdef01234567 --wait --output release/ci-runs.json'),
        ),
    ),
  )
})

test('release CI output includes local git hints for unpushed commits', () => {
  const result = collectReleaseCiRunEvidence(
    [],
    commit,
    requiredReleaseCiWorkflows,
    { commitFound: false },
  )
  const output = releaseCiOutput(
    {
      ...result,
      commitFound: false,
      localGit: {
        currentBranch: 'develop',
        currentHead: commit,
        commitIsHead: true,
        dirtyWorktree: false,
        upstreamCommit: null,
        upstreamMatchesCommit: false,
        upstreamRef: null,
      },
      runs: [],
    },
    requiredReleaseCiWorkflows,
  )

  assert.equal(output.localGit.currentBranch, 'develop')
  assert.match(output.hints.join('\n'), /develop has no upstream/)
  assert.doesNotMatch(output.hints.join('\n'), /Current HEAD is/)
  assert.ok(
    output.nextActions.some(
      (action) =>
        action.id === 'push-release-candidate' &&
        action.commands.includes('git push --set-upstream origin develop'),
    ),
  )
})

test('release CI hints report stale upstreams and dirty worktrees', () => {
  const hints = collectReleaseCiHints({
    commit,
    commitFound: false,
    localGit: {
      currentBranch: 'release',
      currentHead: otherCommit,
      commitIsHead: false,
      dirtyWorktree: true,
      upstreamCommit: otherCommit,
      upstreamMatchesCommit: false,
      upstreamRef: 'origin/release',
    },
  }).join('\n')

  assert.match(hints, /origin\/release does not point at release commit/)
  assert.match(hints, /Current HEAD is/)
  assert.match(hints, /Working tree has local changes/)
})

test('release CI next actions report dirty worktree cleanup', () => {
  const actions = collectReleaseCiNextActions({
    commit,
    commitFound: true,
    localGit: {
      currentBranch: 'release',
      currentHead: commit,
      commitIsHead: true,
      dirtyWorktree: true,
      upstreamCommit: commit,
      upstreamMatchesCommit: true,
      upstreamRef: 'origin/release',
    },
    missingWorkflowNames: [],
    requiredWorkflowNames: requiredReleaseCiWorkflows,
  })

  assert.deepEqual(actions[0], {
    id: 'clean-worktree',
    title: 'Commit or remove local changes before final release evidence',
    detail:
      'The CI run evidence can be collected with local changes present, but strict final readiness requires a clean worktree.',
    commands: ['git status --short'],
  })
})

test('release CI run selection prefers the newest successful matching run', () => {
  const selected = selectSuccessfulWorkflowRun(
    [
      workflowRun({
        id: 10,
        html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/10',
        updated_at: '2026-01-01T00:00:00Z',
      }),
      workflowRun({
        id: 11,
        html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/11',
        updated_at: '2026-01-01T01:00:00Z',
      }),
      workflowRun({
        id: 12,
        conclusion: 'cancelled',
        html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/12',
        updated_at: '2026-01-01T02:00:00Z',
      }),
    ],
    'Check',
    commit,
  )

  assert.equal(
    selected.html_url,
    'https://github.com/portwatcher/vue-godot/actions/runs/11',
  )
})

test('release CI run selection can inspect the latest run before success', () => {
  const selected = selectLatestWorkflowRun(
    [
      workflowRun({
        id: 10,
        status: 'completed',
        conclusion: 'failure',
        html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/10',
        updated_at: '2026-01-01T00:00:00Z',
      }),
      workflowRun({
        id: 11,
        status: 'in_progress',
        conclusion: null,
        html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/11',
        updated_at: '2026-01-01T01:00:00Z',
      }),
    ],
    'Check',
    commit,
  )

  assert.equal(
    selected.html_url,
    'https://github.com/portwatcher/vue-godot/actions/runs/11',
  )
})

test('release CI dispatch targets missing or failed workflows, not running workflows', () => {
  const runs = [
    workflowRun({
      name: 'Check',
      status: 'in_progress',
      conclusion: null,
      html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
    }),
    workflowRun({
      name: 'Godot Smoke',
      conclusion: 'failure',
      html_url: 'https://github.com/portwatcher/vue-godot/actions/runs/2',
    }),
  ]

  assert.deepEqual(missingReleaseCiWorkflows(runs, commit), [
    'Check',
    'Godot Smoke',
  ])
  assert.deepEqual(dispatchableReleaseCiWorkflows(runs, commit), [
    'Godot Smoke',
  ])
})

test('release CI dispatch refuses refs that do not resolve to the release commit', () => {
  assert.deepEqual(validateWorkflowDispatchRef('develop', commit, commit), [])
  assert.match(
    validateWorkflowDispatchRef('develop', commit, null).join('\n'),
    /was not found on GitHub/,
  )
  assert.match(
    validateWorkflowDispatchRef('develop', commit, otherCommit).join('\n'),
    /points to .* not release commit/,
  )
})

test('release CI dispatch config maps required workflows to workflow files', () => {
  assert.equal(releaseCiWorkflowDispatches.Check.workflowId, 'check.yml')
  assert.equal(
    releaseCiWorkflowDispatches['Godot Smoke'].workflowId,
    'godot-smoke.yml',
  )
  assert.equal(
    releaseCiWorkflowDispatches[releasePreflightWorkflowName].workflowId,
    'release-preflight.yml',
  )
  assert.equal(
    releaseCiWorkflowDispatches[releasePreflightWorkflowName].inputName,
    'real_device_evidence_path',
  )
})

test('release CI dispatch config matches workflow files', () => {
  const dispatchableWorkflows = [
    ...requiredReleaseCiWorkflows,
    releasePreflightWorkflowName,
  ]

  for (const workflowName of dispatchableWorkflows) {
    const dispatchConfig = releaseCiWorkflowDispatches[workflowName]
    assert.ok(dispatchConfig, `${workflowName} must have dispatch config`)

    const workflowPath = path.join(workflowDir, dispatchConfig.workflowId)
    const workflow = fs.readFileSync(workflowPath, 'utf-8')

    assert.match(workflow, new RegExp(`^name: ${workflowName}$`, 'm'))
    assert.match(workflow, /^\s+workflow_dispatch:/m)

    if (dispatchConfig.inputName) {
      assert.match(
        workflow,
        new RegExp(`^\\s{6}${dispatchConfig.inputName}:$`, 'm'),
      )
    }
  }
})

test('default release CI workflows match real-device evidence gates', () => {
  assert.deepEqual(requiredReleaseCiWorkflows, ['Check', 'Godot Smoke'])
  assert.equal(releasePreflightWorkflowName, 'Release Preflight')
})
