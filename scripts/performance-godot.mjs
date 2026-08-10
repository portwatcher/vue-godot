import assert from 'node:assert/strict'
import { performance } from 'node:perf_hooks'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  assertNoGodotScriptLoadErrors,
  assertOfficialGodotExecutable,
  godotCommandArguments,
  installBuiltRuntime,
  npmCommand,
  repoRoot,
  resolveGodotCommand,
  run,
  runAsync,
  runGodotImport,
} from './smoke-utils.mjs'

const scriptPath = fileURLToPath(import.meta.url)
const htmlDemoDir = path.join(repoRoot, 'apps/html-demo')
const READY_MARKER = '[vue-godot-performance-ready]'
const RESULT_MARKER = '[vue-godot-performance]'
const MEBIBYTE = 1024 * 1024

export const officialGodotPerformanceBudgets = Object.freeze({
  coldLaunchToFirstFrameMs: 10_000,
  cycles: 10,
  firstModuleEvaluationMs: 2_000,
  firstVueMountMs: 250,
  quickJsRetainedBytes: 2 * MEBIBYTE,
  repeatedMountUnmountMs: 5_000,
  runtimeInitializationMs: 500,
  staticRetainedBytes: 32 * MEBIBYTE,
})

const requiredMetricNames = [
  'callbackRootCount',
  'cycles',
  'finalChildCount',
  'firstModuleEvaluationMs',
  'firstVueMountMs',
  'idleCallbackRootCount',
  'idleQuickJsMemoryBytes',
  'idleStaticMemoryBytes',
  'idleWrapperCount',
  'mounts',
  'postDemoQuickJsMemoryBytes',
  'postDemoStaticMemoryBytes',
  'postUnmountQuickJsMemoryBytes',
  'postUnmountStaticMemoryBytes',
  'repeatedMountUnmountMs',
  'runtimeInitializationMs',
  'staticMemoryPeakBytes',
  'unmounts',
  'wrapperCount',
]

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function extractOfficialGodotPerformanceMetrics(output) {
  const line = output
    .split(/\r?\n/)
    .find((candidate) => candidate.includes(`${RESULT_MARKER} {`))
  if (!line) {
    throw new Error(
      `Official-Godot performance output is missing ${RESULT_MARKER}`,
    )
  }

  const markerIndex = line.indexOf(RESULT_MARKER)
  const parsed = JSON.parse(
    line.slice(markerIndex + RESULT_MARKER.length).trim(),
  )
  if (!isRecord(parsed)) {
    throw new Error('Official-Godot performance result must be an object')
  }
  for (const name of requiredMetricNames) {
    if (typeof parsed[name] !== 'number' || !Number.isFinite(parsed[name])) {
      throw new Error(`Official-Godot performance metric ${name} is not finite`)
    }
  }
  return parsed
}

export function validateOfficialGodotPerformanceMetrics(
  metrics,
  coldLaunchToFirstFrameMs,
  budgets = officialGodotPerformanceBudgets,
) {
  assert.equal(metrics.cycles, budgets.cycles, 'performance cycle count')
  assert.equal(metrics.mounts, budgets.cycles + 1, 'mount count')
  assert.equal(metrics.unmounts, budgets.cycles + 1, 'unmount count')
  assert.equal(metrics.finalChildCount, 0, 'final rendered child count')
  assert.ok(
    metrics.callbackRootCount <= metrics.idleCallbackRootCount,
    `callback roots grew from ${metrics.idleCallbackRootCount} to ${metrics.callbackRootCount}`,
  )
  assert.ok(
    metrics.wrapperCount <= metrics.idleWrapperCount,
    `live wrappers grew from ${metrics.idleWrapperCount} to ${metrics.wrapperCount}`,
  )
  assert.ok(
    coldLaunchToFirstFrameMs <= budgets.coldLaunchToFirstFrameMs,
    `cold launch to first frame ${coldLaunchToFirstFrameMs.toFixed(2)}ms exceeded ${budgets.coldLaunchToFirstFrameMs}ms`,
  )
  for (const name of [
    'firstModuleEvaluationMs',
    'firstVueMountMs',
    'repeatedMountUnmountMs',
    'runtimeInitializationMs',
  ]) {
    assert.ok(
      metrics[name] <= budgets[name],
      `${name} ${metrics[name].toFixed(2)}ms exceeded ${budgets[name]}ms`,
    )
  }

  const quickJsRetainedBytes =
    metrics.postUnmountQuickJsMemoryBytes - metrics.idleQuickJsMemoryBytes
  assert.ok(
    quickJsRetainedBytes <= budgets.quickJsRetainedBytes,
    `QuickJS retained ${quickJsRetainedBytes} bytes after unmount; budget ${budgets.quickJsRetainedBytes}`,
  )
  const staticRetainedBytes =
    metrics.postUnmountStaticMemoryBytes - metrics.idleStaticMemoryBytes
  assert.ok(
    staticRetainedBytes <= budgets.staticRetainedBytes,
    `Godot retained ${staticRetainedBytes} static bytes after unmount; budget ${budgets.staticRetainedBytes}`,
  )

  return { quickJsRetainedBytes, staticRetainedBytes }
}

function renderMetric(name, value, unit = 'ms') {
  console.log(`[performance-godot] ${name}=${value.toFixed(2)}${unit}`)
}

export async function runOfficialGodotPerformanceGate(godot) {
  assertOfficialGodotExecutable(godot)
  installBuiltRuntime(htmlDemoDir)
  run(npmCommand, ['run', 'build', '--workspace=html-demo'], {
    stdio: 'inherit',
  })
  runGodotImport(godot, htmlDemoDir)

  let observedOutput = ''
  let coldLaunchToFirstFrameMs = null
  const launchStartedAt = performance.now()
  const observeOutput = (chunk) => {
    observedOutput += chunk
    if (
      coldLaunchToFirstFrameMs === null &&
      observedOutput.includes(READY_MARKER)
    ) {
      coldLaunchToFirstFrameMs = performance.now() - launchStartedAt
    }
  }

  const result = await runAsync(
    godot,
    godotCommandArguments(['--headless', '--path', htmlDemoDir]),
    {
      env: {
        ...process.env,
        VUE_GODOT_PERFORMANCE: '1',
        VUE_GODOT_PERFORMANCE_CYCLES: String(
          officialGodotPerformanceBudgets.cycles,
        ),
      },
      onStderrChunk: observeOutput,
      onStdoutChunk: observeOutput,
      streamOutput: true,
      timeout: 90_000,
    },
  )
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`
  assertNoGodotScriptLoadErrors(output, 'official-Godot performance gate')
  if (coldLaunchToFirstFrameMs === null) {
    throw new Error(
      `Official-Godot performance output is missing ${READY_MARKER}`,
    )
  }

  const metrics = extractOfficialGodotPerformanceMetrics(output)
  const retained = validateOfficialGodotPerformanceMetrics(
    metrics,
    coldLaunchToFirstFrameMs,
  )

  renderMetric('cold-launch-to-first-frame', coldLaunchToFirstFrameMs)
  renderMetric('runtime-initialization', metrics.runtimeInitializationMs)
  renderMetric('first-module-evaluation', metrics.firstModuleEvaluationMs)
  renderMetric('first-vue-mount', metrics.firstVueMountMs)
  renderMetric('repeated-mount-unmount', metrics.repeatedMountUnmountMs)
  renderMetric('quickjs-retained', retained.quickJsRetainedBytes, 'B')
  renderMetric('static-retained', retained.staticRetainedBytes, 'B')
  console.log(
    `[performance-godot] ok cycles=${metrics.cycles} wrappers=${metrics.wrapperCount} peak=${metrics.staticMemoryPeakBytes}B`,
  )
  return { coldLaunchToFirstFrameMs, metrics, ...retained }
}

async function main() {
  const godot = resolveGodotCommand()
  if (!godot) {
    console.log(
      '[performance-godot] skipped: set GODOT_BIN or install a godot/godot4 executable',
    )
    return
  }
  await runOfficialGodotPerformanceGate(godot)
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    await main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
