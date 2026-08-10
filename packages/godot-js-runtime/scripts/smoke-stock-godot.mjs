import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildNative } from './build-native.mjs'
import {
  assertOfficialGodotExecutable,
  godotCommandArguments,
} from './godot-command.mjs'

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
const typeGeneratorPath = path.join(
  packageRoot,
  '../cli/scripts/generate-types.mjs',
)

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
  const result = spawnSync(executable, godotCommandArguments(args), {
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

function verifyStockTypeGeneration(executable) {
  const temporaryRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), 'godot-js-runtime-stock-types-'),
  )
  try {
    const outputDirectories = ['first', 'second'].map((name) =>
      path.join(temporaryRoot, name),
    )
    for (const outputDirectory of outputDirectories) {
      const result = spawnSync(
        process.execPath,
        [
          typeGeneratorPath,
          '--godot',
          executable,
          '--out-dir',
          outputDirectory,
        ],
        {
          cwd: packageRoot,
          encoding: 'utf-8',
          timeout: 120_000,
          maxBuffer: 16 * 1024 * 1024,
        },
      )
      const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
      if (result.error || result.status !== 0) {
        throw new Error(
          `stock Godot type generation failed${
            result.error
              ? `: ${result.error.message}`
              : ` with status ${String(result.status)}`
          }\n${output}`,
        )
      }
    }

    const generatedNames = fs.readdirSync(outputDirectories[0]).sort()
    if (
      generatedNames.join(',') !==
      'godot-js.d.ts,godot-jsb.d.ts,godot.d.ts,index.d.ts,manifest.json'
    ) {
      throw new Error(
        `stock Godot type generation produced an unexpected file set: ${generatedNames.join(', ')}`,
      )
    }
    for (const name of generatedNames) {
      const first = fs.readFileSync(path.join(outputDirectories[0], name))
      const second = fs.readFileSync(path.join(outputDirectories[1], name))
      if (!first.equals(second)) {
        throw new Error(
          `stock Godot type generation is nondeterministic for ${name}`,
        )
      }
    }

    const manifest = JSON.parse(
      fs.readFileSync(
        path.join(outputDirectories[0], 'manifest.json'),
        'utf-8',
      ),
    )
    if (
      manifest.schemaVersion !== 1 ||
      !manifest.counts ||
      manifest.counts.classes < 900 ||
      manifest.counts.builtins < 30
    ) {
      throw new Error(
        `stock Godot type generation produced an invalid manifest: ${JSON.stringify(manifest)}`,
      )
    }
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true })
  }
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

function assertNoneOrForwardedChildCount(output, marker, description) {
  const count = countOccurrences(output, marker)
  const playCycles = countOccurrences(
    output,
    '[godotjs] EDITOR_PLAY_START',
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
  if (process.platform === 'darwin') {
    const projectFile = path.join(sceneStagingRoot, 'project.godot')
    const source = fs.readFileSync(projectFile, 'utf-8')
    fs.writeFileSync(
      projectFile,
      source.replace(
        'run/main_run_args="--headless"',
        'run/main_run_args="--headless -ApplePersistenceIgnoreState YES"',
      ),
    )
  }
  fs.cpSync(
    path.join(packageRoot, 'native/tests/fixtures/stock-empty'),
    editorStagingRoot,
    { recursive: true },
  )
  for (const projectRoot of [editorStagingRoot, sceneStagingRoot]) {
    fs.cpSync(
      path.join(packageRoot, 'addon/godotjs'),
      path.join(projectRoot, 'addons/godotjs'),
      { recursive: true },
    )
    const godotCache = path.join(projectRoot, '.godot')
    fs.mkdirSync(godotCache, { recursive: true })
    fs.writeFileSync(
      path.join(godotCache, 'extension_list.cfg'),
      'res://addons/godotjs/godotjs.gdextension\n',
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
  assertCount(output, '[godotjs] INITIALIZED', 1, description)
  assertCount(output, '[godotjs] TERMINATED', 1, description)
  verifyCleanOutput(output, description)
}

function verifyProjectRuntimeBalance(output, description, minimumCycles = 1) {
  const starts = countOccurrences(
    output,
    '[godotjs] PROJECT_RUNTIME_STARTED live=1',
  )
  const stops = countOccurrences(
    output,
    '[godotjs] PROJECT_RUNTIME_STOPPED live=0',
  )
  if (starts < minimumCycles || starts !== stops) {
    throw new Error(
      `${description} expected at least ${String(minimumCycles)} balanced project runtime cycle(s), received ${String(starts)} start(s) and ${String(stops)} stop(s)\n${output}`,
    )
  }
  if (
    output.includes('PROJECT_RUNTIME_STARTED live=2') ||
    output.includes('PROJECT_RUNTIME_STOPPED live=1')
  ) {
    throw new Error(
      `${description} ran overlapping project runtimes\n${output}`,
    )
  }
  return starts
}

function verifySerializedScene() {
  const staged = fs.readFileSync(
    path.join(sceneStagingRoot, 'main.tscn'),
    'utf-8',
  )
  if (
    !staged.includes('path="res://attached.mjs"') ||
    !staged.includes('speed = 321.0')
  ) {
    throw new Error(
      'Attached-script scene does not serialize its JavaScript resource and exported property',
    )
  }
}

function verifyEditorLifecycle(output, description) {
  const initialized = countOccurrences(output, '[godotjs] INITIALIZED')
  const terminated = countOccurrences(output, '[godotjs] TERMINATED')
  if (initialized < 1 || terminated < 1 || terminated > initialized) {
    throw new Error(
      `${description} expected at least one parent extension lifecycle, received ${String(initialized)} initialization(s) and ${String(terminated)} forwarded termination(s)\n${output}`,
    )
  }
  verifyCleanOutput(output, description)
}

function verifyEditorProjectRuntimes(output, description, playCycles) {
  const starts = countOccurrences(
    output,
    '[godotjs] PROJECT_RUNTIME_STARTED live=1',
  )
  const stops = countOccurrences(
    output,
    '[godotjs] PROJECT_RUNTIME_STOPPED live=0',
  )
  if (
    (starts !== 2 && starts !== playCycles + 2) ||
    stops < 2 ||
    stops > starts ||
    output.includes('PROJECT_RUNTIME_STARTED live=2')
  ) {
    throw new Error(
      `${description} observed an invalid parent/forwarded-child runtime lifecycle: ${String(starts)} start(s), ${String(stops)} stop(s)\n${output}`,
    )
  }
}

export async function smokeStockGodot(options) {
  assertOfficialGodotExecutable(options.godot)
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
  verifyStockTypeGeneration(options.godot)

  const shellOutput = runGodot(
    options.godot,
    ['--headless', '--path', editorStagingRoot, '--editor', '--quit'],
    'headless editor load/unload probe',
  )
  verifyLifecycle(shellOutput, 'headless editor load/unload probe')
  verifyProjectRuntimeBalance(shellOutput, 'headless editor load/unload probe')

  const editorPlayOutput = runGodot(
    options.godot,
    ['--headless', '--path', sceneStagingRoot, '--editor'],
    'headless editor play/stop loop',
  )
  verifyEditorLifecycle(editorPlayOutput, 'headless editor play/stop loop')
  assertCount(
    editorPlayOutput,
    '[godotjs] PHASE4_EDITOR_PLACEHOLDER PASS',
    1,
    'headless editor play/stop loop',
  )
  assertCount(
    editorPlayOutput,
    '[godotjs] PHASE4_TOOL_SCRIPT PASS',
    1,
    'headless editor play/stop loop',
  )
  assertCount(
    editorPlayOutput,
    '[godotjs] PHASE4_EDITOR_PLAY_LOOP PASS',
    1,
    'headless editor play/stop loop',
  )
  assertCount(
    editorPlayOutput,
    '[godotjs] PHASE5_EDITOR_LANGUAGE PASS',
    1,
    'headless editor play/stop loop',
  )
  assertCount(
    editorPlayOutput,
    '[godotjs] PHASE5_EDITOR_FILE_MONITOR PASS',
    1,
    'headless editor play/stop loop',
  )
  assertNoneOrForwardedChildCount(
    editorPlayOutput,
    '[godotjs] PHASE4_SCRIPT_READY PASS',
    'headless editor play/stop loop',
  )
  assertNoneOrForwardedChildCount(
    editorPlayOutput,
    expectedCallbackException,
    'headless editor play/stop loop',
  )
  const editorPlayStarts = countOccurrences(
    editorPlayOutput,
    '[godotjs] EDITOR_PLAY_START',
  )
  const editorPlayStops = countOccurrences(
    editorPlayOutput,
    '[godotjs] EDITOR_PLAY_STOP',
  )
  if (editorPlayStarts < 3 || editorPlayStarts !== editorPlayStops) {
    throw new Error(
      `headless editor play/stop loop expected at least three balanced cycles, received ${String(editorPlayStarts)} start(s) and ${String(editorPlayStops)} stop(s)\n${editorPlayOutput}`,
    )
  }
  assertCount(
    editorPlayOutput,
    '[godotjs] EDITOR_SCENE_READY',
    editorPlayStarts,
    'headless editor play/stop loop',
  )
  verifyEditorProjectRuntimes(
    editorPlayOutput,
    'headless editor play/stop loop',
    editorPlayStarts,
  )
  verifySerializedScene()

  const runScene = (runNumber) => {
    const description = `attached-script main-scene probe ${String(runNumber)}`
    const output = runGodot(
      options.godot,
      ['--headless', '--path', sceneStagingRoot, '--quit-after', '120'],
      description,
    )
    verifyLifecycle(output, description)
    assertCount(
      output,
      '[godotjs] PHASE4_SCRIPT_READY PASS',
      1,
      description,
    )
    assertCount(
      output,
      '[godotjs] PHASE4_LIFECYCLE PASS',
      1,
      description,
    )
    assertCount(
      output,
      '[godotjs] PHASE4_EXIT_TREE PASS',
      1,
      description,
    )
    assertCount(
      output,
      '[godotjs] PHASE3_BINDING PASS',
      1,
      description,
    )
    assertCount(
      output,
      '[godotjs] PHASE3_VARIANT_MATRIX PASS 39 types',
      1,
      description,
    )
    assertCount(
      output,
      '[godotjs] PHASE3_COMMONJS_BINDING PASS',
      1,
      description,
    )
    assertCount(
      output,
      '[godotjs] PHASE5_SIGNAL_PROMISE PASS',
      1,
      description,
    )
    assertCount(
      output,
      '[godotjs] PHASE7_EPHEMERAL_SIGNAL PASS',
      1,
      description,
    )
    assertCount(output, expectedCallbackException, 1, description)
    assertCount(
      output,
      '[godotjs] PHASE2_MODULE_PROMISE PASS relative-esm resource-json',
      1,
      description,
    )
    assertCount(
      output,
      '[godotjs] PHASE2_LOOP_PROMISE PASS',
      8,
      description,
    )
    verifyProjectRuntimeBalance(output, description)
    return output
  }

  const firstRun = runScene(1)
  const secondRun = runScene(2)

  const contractDescription = 'script-language contract and rejection probe'
  const contractOutput = runGodot(
    options.godot,
    [
      '--headless',
      '--path',
      sceneStagingRoot,
      'res://script-contract.tscn',
      '--quit-after',
      '600',
    ],
    contractDescription,
  )
  assertCount(
    contractOutput,
    '[godotjs] INITIALIZED',
    1,
    contractDescription,
  )
  assertCount(
    contractOutput,
    '[godotjs] TERMINATED',
    1,
    contractDescription,
  )
  assertCount(
    contractOutput,
    '[godotjs] PHASE4_LANGUAGE_CONTRACT PASS',
    1,
    contractDescription,
  )
  assertCount(
    contractOutput,
    '[godotjs] PHASE4_PROJECT_SETTINGS PASS',
    1,
    contractDescription,
  )
  assertCount(
    contractOutput,
    '[godotjs] PHASE5_EDITOR_DIAGNOSTICS PASS',
    1,
    contractDescription,
  )
  assertCount(
    contractOutput,
    '[godotjs] PHASE5_SOURCE_MAP_ERROR PASS',
    1,
    contractDescription,
  )
  for (const expected of [
    'res://incompatible-base.mjs requires base Node2D but was attached to Node',
    'res://invalid-export.mjs: default export must be a JavaScript class',
    'res://missing-default.mjs: default export must be a JavaScript class',
    'res://syntax-error.mjs:4:1',
    'res://src/source-map-probe.ts:10:5',
  ]) {
    if (!contractOutput.includes(expected)) {
      throw new Error(
        `${contractDescription} did not report actionable error detail ${expected}\n${contractOutput}`,
      )
    }
  }
  if (
    contractOutput.includes('Phase 4 script contract failed') ||
    contractOutput.includes('SCRIPT ERROR')
  ) {
    throw new Error(
      `${contractDescription} failed its controller\n${contractOutput}`,
    )
  }
  verifyProjectRuntimeBalance(contractOutput, contractDescription)

  const runReloadScene = (runNumber) => {
    fs.copyFileSync(
      path.join(fixtureRoot, 'reload-probe.mjs'),
      path.join(sceneStagingRoot, 'reload-probe.mjs'),
    )
    const description = `script reload probe ${String(runNumber)}`
    const output = runGodot(
      options.godot,
      [
        '--headless',
        '--path',
        sceneStagingRoot,
        'res://reload-probe.tscn',
        '--quit-after',
        '600',
      ],
      description,
    )
    verifyLifecycle(output, description)
    for (const marker of [
      'PHASE4_DEFERRED_RELOAD PASS',
      'PHASE4_SOFT_RELOAD PASS',
      'PHASE4_INCOMPATIBLE_STATE PASS',
      'PHASE4_HARD_RELOAD PASS',
      'PHASE4_IN_MEMORY_RELOAD PASS',
      'PHASE4_PREDELETE PASS',
    ]) {
      assertCount(output, `[godotjs] ${marker}`, 1, description)
    }
    assertCount(output, '[godotjs] RELOAD_DEFERRED', 1, description)
    assertCount(
      output,
      '[godotjs] SOFT_RELOAD_COMPLETE',
      4,
      description,
    )
    assertCount(
      output,
      '[godotjs] HARD_RELOAD_COMPLETE',
      1,
      description,
    )
    if (
      output.includes('STALE_RELOAD_PROMISE_EXECUTED') ||
      output.includes('STALE_RELOAD_TIMER_EXECUTED')
    ) {
      throw new Error(
        `${description} executed a callback from a destroyed context\n${output}`,
      )
    }
    verifyProjectRuntimeBalance(output, description, 6)
    return output
  }

  const firstReload = runReloadScene(1)
  const secondReload = runReloadScene(2)
  if (options.verbose) {
    process.stdout.write(shellOutput)
    process.stdout.write(editorPlayOutput)
    process.stdout.write(firstRun)
    process.stdout.write(secondRun)
    process.stdout.write(contractOutput)
    process.stdout.write(firstReload)
    process.stdout.write(secondReload)
  }
  console.log(`[stock-smoke] PASS ${version}`)
  const allOutput = `${shellOutput}${editorPlayOutput}${firstRun}${secondRun}${contractOutput}${firstReload}${secondReload}`
  const extensionCycles = countOccurrences(
    allOutput,
    '[godotjs] TERMINATED',
  )
  console.log(
    `[stock-smoke] extension unloads observed: ${String(extensionCycles)} clean cycles`,
  )
  const runtimeCycles = countOccurrences(
    allOutput,
    '[godotjs] PROJECT_RUNTIME_STOPPED live=0',
  )
  console.log(
    `[stock-smoke] attached scripts, reloads, and Promise jobs: ${String(runtimeCycles)} balanced project runtime cycles`,
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
