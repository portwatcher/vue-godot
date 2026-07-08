import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

import {
  benchmarkDefinitions,
  requiredBenchmarkIds,
  validateBenchmarkCoverage,
} from '../scripts/performance-benchmarks.mjs'

test('performance benchmark registry covers every SDK quality category', () => {
  validateBenchmarkCoverage()

  const ids = benchmarkDefinitions.map((definition) => definition.id)
  assert.deepEqual([...ids].sort(), [...requiredBenchmarkIds].sort())
  for (const definition of benchmarkDefinitions) {
    assert.equal(typeof definition.label, 'string')
    assert.ok(definition.label.length > 0)
    assert.ok(definition.thresholdMs > 0)
    assert.equal(typeof definition.run, 'function')
  }
})

test('root check script enforces performance benchmarks', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))

  assert.equal(
    packageJson.scripts?.['bench:performance'],
    'node scripts/performance-benchmarks.mjs',
  )
  assert.match(packageJson.scripts?.check ?? '', /bench:performance/)
})
