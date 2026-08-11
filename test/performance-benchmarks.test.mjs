import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

import {
  benchmarkDefinitions,
  requiredBenchmarkIds,
  validateBenchmarkCoverage,
} from '../scripts/performance-benchmarks.mjs'
import {
  extractOfficialGodotPerformanceMetrics,
  officialGodotPerformanceBudgets,
  validateOfficialGodotPerformanceMetrics,
} from '../scripts/performance-godot.mjs'

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
    'npm run bench:performance:deterministic && npm run bench:performance:godot',
  )
  assert.equal(
    packageJson.scripts?.['bench:performance:deterministic'],
    'node scripts/performance-benchmarks.mjs',
  )
  assert.equal(
    packageJson.scripts?.['bench:performance:godot'],
    'node scripts/performance-godot.mjs',
  )
  assert.match(packageJson.scripts?.check ?? '', /bench:performance/)
})

function officialMetrics(overrides = {}) {
  return {
    callbackRootCount: 2,
    cycles: officialGodotPerformanceBudgets.cycles,
    finalChildCount: 0,
    firstModuleEvaluationMs: 75,
    firstVueMountMs: 20,
    idleCallbackRootCount: 2,
    idleQuickJsMemoryBytes: 4_000_000,
    idleStaticMemoryBytes: 80_000_000,
    idleWrapperCount: 4,
    mounts: officialGodotPerformanceBudgets.cycles + 1,
    postDemoQuickJsMemoryBytes: 4_500_000,
    postDemoStaticMemoryBytes: 84_000_000,
    postUnmountQuickJsMemoryBytes: 4_100_000,
    postUnmountStaticMemoryBytes: 82_000_000,
    repeatedMountUnmountMs: 500,
    runtimeInitializationMs: 15,
    staticMemoryPeakBytes: 90_000_000,
    unmounts: officialGodotPerformanceBudgets.cycles + 1,
    wrapperCount: 4,
    ...overrides,
  }
}

test('official-Godot performance output is parsed and budgeted', () => {
  const metrics = officialMetrics()
  const output = [
    'Godot Engine v4.4.1.stable.official',
    `[vue-godot-performance] ${JSON.stringify(metrics)}`,
  ].join('\n')

  const parsed = extractOfficialGodotPerformanceMetrics(output)
  assert.deepEqual(parsed, metrics)
  assert.deepEqual(validateOfficialGodotPerformanceMetrics(parsed, 250), {
    quickJsRetainedBytes: 100_000,
    staticRetainedBytes: 2_000_000,
  })
})

test('official-Godot performance gate rejects leaks and missing metrics', () => {
  assert.throws(
    () => extractOfficialGodotPerformanceMetrics('no performance marker'),
    /missing/,
  )
  assert.throws(
    () =>
      validateOfficialGodotPerformanceMetrics(
        officialMetrics({ callbackRootCount: 3 }),
        250,
      ),
    /callback roots grew/,
  )
  assert.throws(
    () =>
      validateOfficialGodotPerformanceMetrics(
        officialMetrics({
          postUnmountQuickJsMemoryBytes:
            4_000_000 +
            officialGodotPerformanceBudgets.quickJsRetainedBytes +
            1,
        }),
        250,
      ),
    /QuickJS retained/,
  )
})
