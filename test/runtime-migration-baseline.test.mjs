import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import {
  buildRuntimeContractFixture,
  runtimeContractFixtureDir,
  verifyRuntimeContractBundle,
} from '../scripts/runtime-contract-fixture.mjs'

const repoRoot = process.cwd()
const baselinePath = path.join(
  repoRoot,
  'docs/godot-js-runtime-baseline.json',
)
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf-8'))

function repositoryFiles() {
  const result = spawnSync(
    'git',
    ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
    { cwd: repoRoot, encoding: 'buffer' },
  )
  assert.equal(result.status, 0, result.stderr.toString('utf-8'))
  return result.stdout
    .toString('utf-8')
    .split('\0')
    .filter(Boolean)
    .sort()
}

function containsLegacyPattern(filePath) {
  if (baseline.scanExclusions.includes(filePath)) {
    return false
  }

  if (baseline.searchPatterns.some((pattern) => filePath.includes(pattern))) {
    return true
  }

  const contents = fs.readFileSync(path.join(repoRoot, filePath))
  if (contents.includes(0)) {
    return false
  }
  const source = contents.toString('utf-8')
  return baseline.searchPatterns.some((pattern) => source.includes(pattern))
}

test('baseline records every required Phase 0 command as passing', () => {
  assert.equal(baseline.baseline.originDevelop.length, 40)
  const commands = new Map(
    baseline.checks.map((check) => [check.command, check.status]),
  )
  for (const command of [
    'npm ci',
    'npm run build',
    'npm run test',
    'npm run smoke:cli',
    'npm run check:serious-examples',
    'npm run bench:performance',
    'GODOT_BIN=<legacy-editor> npm run smoke:godot',
    'npm run build:runtime-contract-fixture',
    'GODOT_BIN=<legacy-editor> npm run smoke:runtime-contract',
    'GODOT_BIN=<stock-4.4.1> npm run smoke:runtime-contract -- --expect-missing-runtime',
  ]) {
    assert.equal(commands.get(command), 'pass', `Missing passing check: ${command}`)
  }
})

test('every tracked legacy coupling has one planned destination', () => {
  const inventoryPaths = baseline.inventory
    .flatMap((entry) => {
      assert.ok(['preserve', 'replace', 'remove'].includes(entry.disposition))
      assert.ok(Number.isInteger(entry.phase))
      assert.ok(entry.destination.length > 0)
      return entry.paths
    })
    .sort()

  assert.equal(
    new Set(inventoryPaths).size,
    inventoryPaths.length,
    'Inventory paths must be unique',
  )

  const discoveredPaths = repositoryFiles().filter(containsLegacyPattern)
  assert.deepEqual(discoveredPaths, inventoryPaths)
})

test('runtime contract fixture covers the required binding and lifecycle surface', () => {
  const source = fs.readFileSync(
    path.join(runtimeContractFixtureDir, 'src/main.ts'),
    'utf-8',
  )
  for (const marker of [
    'new Label()',
    'ClassDB.instantiate',
    "label.set('text'",
    'timer.timeout.connect',
    'Callable.create',
    'ResourceLoader.load',
    'OS.get_environment',
    'Time.get_ticks_msec',
    'new HTTPClient()',
    'new WebSocketPeer()',
    'new AudioStreamGenerator()',
    'new VideoStreamPlayer()',
    "import('./chunk')",
    '_enter_tree()',
    '_ready()',
    '_process(',
    '_exit_tree()',
  ]) {
    assert.ok(source.includes(marker), `Fixture is missing marker: ${marker}`)
  }
  assert.doesNotMatch(source, /(?:^|[/@])vue(?:$|[/@-])/i)
})

test('Vite output preserves the CommonJS entry and stable relative chunk contract', () => {
  buildRuntimeContractFixture()
  const { contract, files } = verifyRuntimeContractBundle()
  assert.equal(contract.format, 'commonjs')
  assert.deepEqual(contract.externalModules, ['godot'])
  assert.deepEqual(files, contract.requiredFiles.slice().sort())
})
