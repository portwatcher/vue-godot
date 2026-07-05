import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
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
  assert.match(output, /All P0 and P1 checklist items/)
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
  assert.match(output, /All P0 and P1 checklist items/)
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

test('release readiness requires a GitHub Actions preflight run URL for this repo', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-readiness-'))
  const readinessPath = path.join(tempDir, 'release-readiness.json')

  fs.writeFileSync(
    readinessPath,
    JSON.stringify(
      {
        commit: '0123456789abcdef0123456789abcdef01234567',
        releasePreflightRunUrl: 'https://example.com/actions/runs/3',
        releasePreflightRunCommit:
          '0123456789abcdef0123456789abcdef01234567',
        releasePreflightRunConclusion: 'success',
        releasePreflightWarningCount: 0,
      },
      null,
      2,
    ),
  )

  try {
    const result = runReadiness([
      '--allow-open',
      '--real-device-path',
      'docs/real-device-evidence.example.json',
      '--readiness-path',
      readinessPath,
      '--expected-commit',
      '0123456789abcdef0123456789abcdef01234567',
    ])
    const output = `${result.stdout}\n${result.stderr}`

    assert.equal(result.status, 0)
    assert.match(
      output,
      /releasePreflightRunUrl must be a GitHub Actions run URL for portwatcher\/vue-godot/,
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('release readiness rejects stale real-device package versions', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-readiness-'))
  const realDevicePath = path.join(tempDir, 'real-device-evidence.json')
  const evidence = JSON.parse(
    fs.readFileSync('docs/real-device-evidence.example.json', 'utf-8'),
  )
  evidence.packageVersions['@vue-godot/html'] = '9.9.9'

  fs.writeFileSync(realDevicePath, JSON.stringify(evidence, null, 2))

  try {
    const result = runReadiness([
      '--allow-open',
      '--real-device-path',
      realDevicePath,
      '--readiness-path',
      'docs/release-readiness-evidence.example.json',
      '--expected-commit',
      '0123456789abcdef0123456789abcdef01234567',
    ])
    const output = `${result.stdout}\n${result.stderr}`

    assert.equal(result.status, 0)
    assert.match(
      output,
      /packageVersions\.@vue-godot\/html must match current package version/,
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})
