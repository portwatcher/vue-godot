import assert from 'node:assert/strict'
import test from 'node:test'

import {
  collectReleaseCiRunEvidence,
  requiredReleaseCiWorkflows,
  selectSuccessfulWorkflowRun,
} from '../scripts/check-release-ci-runs.mjs'

const commit = '0123456789abcdef0123456789abcdef01234567'
const otherCommit = 'abcdef0123456789abcdef0123456789abcdef01'

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

test('required release CI workflows match final readiness gates', () => {
  assert.deepEqual(requiredReleaseCiWorkflows, ['Check', 'Godot Smoke'])
})
