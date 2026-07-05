import assert from 'node:assert/strict'
import test from 'node:test'

import {
  downloadGitHubActionsArtifactZip,
  extractGitHubActionsRunId,
  fetchGitHubActionsRunArtifacts,
  githubTokenFromEnv,
  validateGitHubActionsRunMetadata,
} from '../scripts/release-evidence-utils.mjs'

const commit = '0123456789abcdef0123456789abcdef01234567'

test('GitHub Actions run URLs expose the run id for this repository', () => {
  assert.equal(
    extractGitHubActionsRunId(
      'https://github.com/portwatcher/vue-godot/actions/runs/123456789',
    ),
    '123456789',
  )
  assert.equal(
    extractGitHubActionsRunId(
      'https://github.com/portwatcher/vue-godot/actions/runs/123456789/attempts/1',
    ),
    '123456789',
  )
  assert.equal(
    extractGitHubActionsRunId(
      'https://github.com/other/vue-godot/actions/runs/123456789',
    ),
    null,
  )
})

test('GitHub Actions run metadata validates workflow, commit, status, and conclusion', () => {
  assert.deepEqual(
    validateGitHubActionsRunMetadata(
      {
        name: 'Check',
        head_sha: commit,
        status: 'completed',
        conclusion: 'success',
      },
      {
        label: 'evidence.checkRunUrl',
        workflowName: 'Check',
        commit,
        conclusion: 'success',
      },
    ),
    [],
  )
})

test('GitHub Actions run metadata rejects stale or failed runs', () => {
  const errors = validateGitHubActionsRunMetadata(
    {
      name: 'Godot Smoke',
      head_sha: 'ffffffffffffffffffffffffffffffffffffffff',
      status: 'in_progress',
      conclusion: 'failure',
    },
    {
      label: 'evidence.checkRunUrl',
      workflowName: 'Check',
      commit,
      conclusion: 'success',
    },
  ).join('\n')

  assert.match(errors, /status must be "completed"/)
  assert.match(errors, /workflow name must be "Check"/)
  assert.match(
    errors,
    /commit must be 0123456789abcdef0123456789abcdef01234567/,
  )
  assert.match(errors, /conclusion must be "success"/)
})

test('GitHub token helper accepts Actions and gh token environment names', () => {
  assert.equal(
    githubTokenFromEnv({ GITHUB_TOKEN: 'actions-token' }),
    'actions-token',
  )
  assert.equal(githubTokenFromEnv({ GH_TOKEN: 'gh-token' }), 'gh-token')
  assert.equal(githubTokenFromEnv({}), null)
})

test('GitHub artifact helpers validate identifiers before requesting metadata', async () => {
  await assert.rejects(
    () => fetchGitHubActionsRunArtifacts('https://example.com/actions/runs/1'),
    /GitHub Actions run URL/,
  )
  await assert.rejects(
    () => downloadGitHubActionsArtifactZip(0),
    /Artifact id must be a positive integer/,
  )
})
