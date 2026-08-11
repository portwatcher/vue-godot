import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  downloadArchive,
  resolveBootstrapPlan,
} from '../scripts/bootstrap-deps.mjs'

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const lock = JSON.parse(
  fs.readFileSync(path.join(packageRoot, 'native/deps.lock.json'), 'utf-8'),
)

test('native dependencies are complete immutable pins', () => {
  assert.equal(lock.schemaVersion, 1)
  assert.match(lock.reviewedAt, /^\d{4}-\d{2}-\d{2}$/)
  for (const dependency of Object.values(lock.dependencies)) {
    assert.match(dependency.sha256, /^[a-f0-9]{64}$/)
    assert.match(dependency.url, /^https:\/\//)
    assert.equal(dependency.license, 'MIT')
    if (dependency.kind === 'source-archive') {
      assert.match(dependency.commit, /^[a-f0-9]{40}$/)
      assert.ok(dependency.requiredFiles.length > 0)
    }
  }
})

test('bootstrap print plan is deterministic and outside tracked source', () => {
  const options = {
    cacheDir: path.join(packageRoot, '.test-cache'),
    depsDir: path.join(packageRoot, '.test-deps'),
  }
  assert.deepEqual(resolveBootstrapPlan(options), resolveBootstrapPlan(options))
  const plan = resolveBootstrapPlan(options)
  assert.equal(plan.dependencies.length, 3)
  assert.ok(plan.dependencies.every((dependency) => dependency.archivePath))
})

test('dependency downloads retry transient failures before checksum validation', async (t) => {
  const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'godotjs-bootstrap-'))
  t.after(() => fs.rmSync(cacheDir, { recursive: true, force: true }))
  const payload = Buffer.from('pinned dependency archive')
  const dependency = {
    name: 'test dependency',
    archiveName: 'dependency.tar.gz',
    url: 'https://example.test/dependency.tar.gz',
    sha256: createHash('sha256').update(payload).digest('hex'),
  }
  let calls = 0
  const archivePath = await downloadArchive(dependency, cacheDir, {
    attempts: 3,
    retryDelayMs: 0,
    fetchImplementation: async () => {
      calls += 1
      if (calls < 3) throw new Error('transient network failure')
      return new Response(payload, { status: 200 })
    },
  })
  assert.equal(calls, 3)
  assert.deepEqual(fs.readFileSync(archivePath), payload)
})
