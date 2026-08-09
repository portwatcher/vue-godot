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
  const count = output.split(marker).length - 1
  if (count !== expected) {
    throw new Error(
      `${description} expected ${String(expected)} occurrence(s) of ${marker}, received ${String(count)}\n${output}`,
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

function verifyLifecycle(output, description) {
  assertCount(output, '[godot-js-runtime] INITIALIZED', 1, description)
  assertCount(output, '[godot-js-runtime] TERMINATED', 1, description)
  if (
    output.includes('SCRIPT ERROR') ||
    output.includes('GDExtension library not found')
  ) {
    throw new Error(`${description} reported a runtime error\n${output}`)
  }
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
      '[godot-js-runtime] phase-one loader resolved res://main.js',
      1,
      description,
    )
    assertCount(
      output,
      '[godot-js-runtime] PHASE1_SCRIPT_READY PASS',
      1,
      description,
    )
    return output
  }

  const firstRun = runScene(1)
  const secondRun = runScene(2)
  if (options.verbose) {
    process.stdout.write(shellOutput)
    process.stdout.write(firstRun)
    process.stdout.write(secondRun)
  }
  console.log(`[stock-smoke] PASS ${version}`)
  console.log('[stock-smoke] extension init/unload: 3 clean cycles')
  console.log(
    '[stock-smoke] pre-main-scene .js resource loader: 2 clean cycles',
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
