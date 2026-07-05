import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

function runReadiness(args = []) {
  return spawnSync(process.execPath, ['scripts/release-readiness.mjs', ...args], {
    cwd: process.cwd(),
    encoding: 'utf-8',
  })
}

test('release readiness reports current blockers without failing when allowed open', () => {
  const result = runReadiness(['--allow-open'])
  const output = `${result.stdout}\n${result.stderr}`

  assert.equal(result.status, 0)
  assert.match(output, /TODO\.md:21/)
  assert.match(output, /real-device evidence missing/)
  assert.match(output, /release-readiness evidence missing/)
  assert.match(output, /public warning markers still present/)
  assert.match(output, /open gates remain/)
})

test('release readiness fails in strict mode while final gates are open', () => {
  const result = runReadiness()
  const output = `${result.stdout}\n${result.stderr}`

  assert.equal(result.status, 1)
  assert.match(output, /not ready/)
  assert.match(output, /release-readiness evidence missing/)
})

test('release readiness accepts checked-in evidence examples for schema coverage', () => {
  const exampleCommit = '0123456789abcdef0123456789abcdef01234567'
  const result = runReadiness([
    '--allow-open',
    '--real-device-path',
    'docs/real-device-evidence.example.json',
    '--readiness-path',
    'docs/release-readiness-evidence.example.json',
    '--expected-commit',
    exampleCommit,
  ])
  const output = `${result.stdout}\n${result.stderr}`

  assert.equal(result.status, 0)
  assert.doesNotMatch(output, /evidence missing/)
  assert.doesNotMatch(output, /must match current commit/)
  assert.match(output, /TODO\.md:21/)
})

test('release readiness reports a dirty worktree blocker', () => {
  const markerPath = path.join(process.cwd(), '.release-readiness-dirty-test')
  fs.writeFileSync(markerPath, 'dirty\n')

  try {
    const result = runReadiness(['--allow-open'])
    const output = `${result.stdout}\n${result.stderr}`

    assert.equal(result.status, 0)
    assert.match(output, /working tree must be clean for final release readiness/)
    assert.match(output, /\.release-readiness-dirty-test/)
  } finally {
    fs.rmSync(markerPath, { force: true })
  }
})
