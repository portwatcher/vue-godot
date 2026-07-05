import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

test('release preflight rejects non-SHA expected commits before running checks', () => {
  const result = spawnSync(
    process.execPath,
    [
      'scripts/release-preflight.mjs',
      '--local',
      '--skip-check',
      '--skip-godot',
      '--skip-serious-examples',
      '--expected-commit',
      'release-candidate',
    ],
    { cwd: process.cwd(), encoding: 'utf-8' },
  )

  assert.notEqual(result.status, 0)
  assert.match(
    `${result.stdout}\n${result.stderr}`,
    /--expected-commit must be a full 40-character git commit SHA/,
  )
})
