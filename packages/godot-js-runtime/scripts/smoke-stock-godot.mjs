import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildNative } from './build-native.mjs'

const scriptPath = fileURLToPath(import.meta.url)
const packageRoot = path.resolve(path.dirname(scriptPath), '..')
const repoRoot = path.resolve(packageRoot, '../..')
const fixtureRoot = path.join(packageRoot, 'native/tests/fixtures/stock-shell')
const stagingRoot = path.join(
  repoRoot,
  '.cache/godot-js-runtime/smoke/stock-shell',
)
const editorStagingRoot = path.join(stagingRoot, 'editor')
const sceneStagingRoot = path.join(stagingRoot, 'scene')
const expectedCallbackException = 'PHASE3_EXPECTED_CALLBACK_EXCEPTION'

function parseArgs(argv) {
  const options = {
    godot: process.env.GODOT_BIN,
    skipBuild: false,
    verbose: false,
  }
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === '--skip-build') {
      options.skipBuild = true
    } else if (argument === '--verbose') {
      options.verbose = true
    } else if (argument === '--godot') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--godot requires an executable path')
      }
      options.godot = value
    } else {
      throw new Error(`Unknown option: ${argument}`)
    }
  }
  if (!options.godot) {
    throw new Error(
      'Set GODOT_BIN or pass --godot with an official Godot executable',
    )
  }
  return options
}

function runGodot(executable, args, description) {
  const result = spawnSync(executable, args, {
    cwd: packageRoot,
    encoding: 'utf-8',
    timeout: 120_000,
    maxBuffer: 16 * 1024 * 1024,
  })
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
  if (result.error) {
    throw new Error(`${description} failed: ${result.error.message}\n${output}`)
  }
  if (result.status !== 0) {
    throw new Error(
      `${description} exited with status ${String(result.status)}\n${output}`,
    )
  }
  return output
}

function assertCount(output, marker, expected, description) {
  const count = countOccurrences(output, marker)
  if (count !== expected) {
    throw new Error(
      `${description} expected ${String(expected)} occurrence(s) of ${marker}, received ${String(count)}\n${output}`,
    )
  }
}

function countOccurrences(output, marker) {
  return output.split(marker).length - 1
}

function assertParentOrForwardedChildCount(output, marker, description) {
  const count = countOccurrences(output, marker)
  const playCycles = countOccurrences(
    output,
    '[godot-js-runtime] EDITOR_PLAY_START',
  )
  if (count !== 1 && count !== playCycles + 1) {
    throw new Error(
      `${description} expected one parent occurrence of ${marker}, or the parent plus all ${String(playCycles)} forwarded child runs; received ${String(count)}\n${output}`,
    )
  }
}

function assertNoneOrForwardedChildCount(output, marker, description) {
  const count = countOccurrences(output, marker)
  const playCycles = countOccurrences(
    output,
    '[godot-js-runtime] EDITOR_PLAY_START',
  )
  if (count !== 0 && count !== playCycles) {
    throw new Error(
      `${description} expected no forwarded child occurrence of ${marker}, or one from each of the ${String(playCycles)} child runs; received ${String(count)}\n${output}`,
    )
  }
}

function prepareFixture() {
  const smokeParent = path.dirname(stagingRoot)
  const relative = path.relative(smokeParent, stagingRoot)
  if (
    relative === '' ||
    relative === '..' ||
    relative.startsWith(`..${path.sep}`)
  ) {
    throw new Error(`Unsafe stock smoke staging path: ${stagingRoot}`)
  }
  fs.rmSync(stagingRoot, { recursive: true, force: true })
  fs.mkdirSync(stagingRoot, { recursive: true })
  fs.cpSync(fixtureRoot, sceneStagingRoot, { recursive: true })
  fs.cpSync(
    path.join(packageRoot, 'native/tests/fixtures/stock-empty'),
    editorStagingRoot,
    { recursive: true },
  )
  for (const projectRoot of [editorStagingRoot, sceneStagingRoot]) {
    fs.cpSync(
      path.join(packageRoot, 'addon/godot-js-runtime'),
      path.join(projectRoot, 'addons/godot-js-runtime'),
      { recursive: true },
    )
    const godotCache = path.join(projectRoot, '.godot')
    fs.mkdirSync(godotCache, { recursive: true })
    fs.writeFileSync(
      path.join(godotCache, 'extension_list.cfg'),
      'res://addons/godot-js-runtime/godot_js_runtime.gdextension\n',
    )
  }
}

function verifyCleanOutput(output, description) {
  const unexpectedOutput = output
    .split('\n')
    .filter((line) => !line.includes(expectedCallbackException))
    .join('\n')
  if (
    unexpectedOutput.includes('SCRIPT ERROR') ||
    unexpectedOutput.includes('ERROR:') ||
    unexpectedOutput.includes('GDExtension library not found')
  ) {
    throw new Error(`${description} reported a runtime error\n${output}`)
  }
}

function verifyLifecycle(output, description) {
  assertCount(output, '[godot-js-runtime] INITIALIZED', 1, description)
  assertCount(output, '[godot-js-runtime] TERMINATED', 1, description)
  verifyCleanOutput(output, description)
}

function verifyEditorLifecycle(output, description) {
  const initialized = countOccurrences(output, '[godot-js-runtime] INITIALIZED')
  const terminated = countOccurrences(output, '[godot-js-runtime] TERMINATED')
  if (initialized < 1 || terminated < 1 || terminated > initialized) {
    throw new Error(
      `${description} expected at least one parent extension lifecycle, received ${String(initialized)} initialization(s) and ${String(terminated)} forwarded termination(s)\n${output}`,
    )
  }
  verifyCleanOutput(output, description)
}

export async function smokeStockGodot(options) {
  if (!options.skipBuild) {
    await buildNative({
      platform: process.platform === 'darwin' ? 'macos' : 'linux',
      arch: process.platform === 'darwin' ? 'universal' : 'x86_64',
      target: 'template_debug',
      jobs: 8,
      clean: false,
      print: false,
    })
  }
  prepareFixture()

  const version = runGodot(
    options.godot,
    ['--version'],
    'Godot version probe',
  ).trim()
  if (!/^4\./.test(version)) {
    throw new Error(
      `Expected an official Godot 4 executable, received: ${version}`,
    )
  }

  const shellOutput = runGodot(
    options.godot,
    ['--headless', '--path', editorStagingRoot, '--editor', '--quit'],
    'headless editor load/unload probe',
  )
  verifyLifecycle(shellOutput, 'headless editor load/unload probe')

  const editorPlayOutput = runGodot(
    options.godot,
    ['--headless', '--path', sceneStagingRoot, '--editor'],
    'headless editor play/stop loop',
  )
  verifyEditorLifecycle(editorPlayOutput, 'headless editor play/stop loop')
  assertCount(
    editorPlayOutput,
    '[godot-js-runtime] PHASE2_EDITOR_PLAY_LOOP PASS',
    1,
    'headless editor play/stop loop',
  )
  assertParentOrForwardedChildCount(
    editorPlayOutput,
    '[godot-js-runtime] PHASE3_BINDING PASS',
    'headless editor play/stop loop',
  )
  assertParentOrForwardedChildCount(
    editorPlayOutput,
    '[godot-js-runtime] PHASE3_VARIANT_MATRIX PASS 39 types',
    'headless editor play/stop loop',
  )
  assertNoneOrForwardedChildCount(
    editorPlayOutput,
    '[godot-js-runtime] PHASE3_COMMONJS_BINDING PASS',
    'headless editor play/stop loop',
  )
  assertParentOrForwardedChildCount(
    editorPlayOutput,
    expectedCallbackException,
    'headless editor play/stop loop',
  )
  const editorPlayStarts = countOccurrences(
    editorPlayOutput,
    '[godot-js-runtime] EDITOR_PLAY_START',
  )
  const editorPlayStops = countOccurrences(
    editorPlayOutput,
    '[godot-js-runtime] EDITOR_PLAY_STOP',
  )
  if (editorPlayStarts < 3 || editorPlayStarts !== editorPlayStops) {
    throw new Error(
      `headless editor play/stop loop expected at least three balanced cycles, received ${String(editorPlayStarts)} start(s) and ${String(editorPlayStops)} stop(s)\n${editorPlayOutput}`,
    )
  }
  assertCount(
    editorPlayOutput,
    '[godot-js-runtime] EDITOR_SCENE_READY',
    editorPlayStarts,
    'headless editor play/stop loop',
  )
  const editorRuntimeStarts = countOccurrences(
    editorPlayOutput,
    '[godot-js-runtime] RUNTIME_STARTED live=1',
  )
  const editorRuntimeStops = countOccurrences(
    editorPlayOutput,
    '[godot-js-runtime] RUNTIME_STOPPED live=0',
  )
  if (editorRuntimeStarts < 1 || editorRuntimeStarts !== editorRuntimeStops) {
    throw new Error(
      `headless editor play/stop loop left unbalanced QuickJS instances: ${String(editorRuntimeStarts)} start(s), ${String(editorRuntimeStops)} stop(s)\n${editorPlayOutput}`,
    )
  }

  const runScene = (runNumber) => {
    const description = `main-scene initialization probe ${String(runNumber)}`
    const output = runGodot(
      options.godot,
      ['--headless', '--path', sceneStagingRoot, '--quit-after', '120'],
      description,
    )
    verifyLifecycle(output, description)
    assertCount(
      output,
      '[godot-js-runtime] phase-two loader evaluated res://main.mjs',
      1,
      description,
    )
    const runtimeStarts = countOccurrences(
      output,
      '[godot-js-runtime] RUNTIME_STARTED live=1',
    )
    const runtimeStops = countOccurrences(
      output,
      '[godot-js-runtime] RUNTIME_STOPPED live=0',
    )
    if (runtimeStarts < 3 || runtimeStarts !== runtimeStops) {
      throw new Error(
        `${description} expected at least three balanced QuickJS start/stop cycles, received ${String(runtimeStarts)} start(s) and ${String(runtimeStops)} stop(s)\n${output}`,
      )
    }
    assertCount(
      output,
      '[godot-js-runtime] PHASE2_MODULE_PROMISE PASS relative-esm resource-json',
      1,
      description,
    )
    assertCount(
      output,
      '[godot-js-runtime] PHASE3_BINDING PASS',
      1,
      description,
    )
    assertCount(
      output,
      '[godot-js-runtime] PHASE3_VARIANT_MATRIX PASS 39 types',
      1,
      description,
    )
    assertCount(
      output,
      '[godot-js-runtime] PHASE3_COMMONJS_BINDING PASS',
      1,
      description,
    )
    assertCount(output, expectedCallbackException, 1, description)
    assertCount(
      output,
      '[godot-js-runtime] PROMISE_JOBS_DRAINED count=1',
      runtimeStarts - 1,
      description,
    )
    assertCount(
      output,
      '[godot-js-runtime] PROMISE_JOBS_DRAINED count=0',
      1,
      description,
    )
    assertCount(
      output,
      '[godot-js-runtime] PHASE2_LOOP_PROMISE PASS',
      runtimeStarts - 2,
      description,
    )
    assertCount(
      output,
      '[godot-js-runtime] PHASE2_RELOAD_LOOP PASS',
      1,
      description,
    )
    assertCount(
      output,
      '[godot-js-runtime] PHASE2_SCRIPT_READY PASS',
      1,
      description,
    )
    return output
  }

  const firstRun = runScene(1)
  const secondRun = runScene(2)
  if (options.verbose) {
    process.stdout.write(shellOutput)
    process.stdout.write(editorPlayOutput)
    process.stdout.write(firstRun)
    process.stdout.write(secondRun)
  }
  console.log(`[stock-smoke] PASS ${version}`)
  const allOutput = `${shellOutput}${editorPlayOutput}${firstRun}${secondRun}`
  const extensionCycles = countOccurrences(
    allOutput,
    '[godot-js-runtime] TERMINATED',
  )
  console.log(
    `[stock-smoke] extension unloads observed: ${String(extensionCycles)} clean cycles`,
  )
  const runtimeCycles = countOccurrences(
    allOutput,
    '[godot-js-runtime] RUNTIME_STOPPED live=0',
  )
  console.log(
    `[stock-smoke] resource ESM, JSON, and Promise jobs: ${String(runtimeCycles)} balanced runtime cycles`,
  )
  console.log(
    `[stock-smoke] editor play/stop: ${String(editorPlayStarts)} balanced cycles`,
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    await smokeStockGodot(parseArgs(process.argv.slice(2)))
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}
