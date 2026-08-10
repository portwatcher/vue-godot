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
const repositoryRoot = path.resolve(packageRoot, '../..')
const demoRoot = path.join(repositoryRoot, 'apps/godotjs-demo')
const successMarker = '[godotjs-demo] PHASE6_STANDALONE_DEMO PASS'

function parseArguments(argv) {
  const options = {
    godot: process.env.GODOT_BIN,
    keepTemporaryProject: false,
    skipNativeBuild: process.env.GODOTJS_SKIP_NATIVE_BUILD === '1',
    releaseDirectory: undefined,
  }
  for (let index = 0; index < argv.length; ++index) {
    const argument = argv[index]
    if (argument === '--keep-temp') {
      options.keepTemporaryProject = true
    } else if (argument === '--skip-native-build') {
      options.skipNativeBuild = true
    } else if (argument === '--godot' || argument === '--release-dir') {
      const value = argv[++index]
      if (!value) throw new Error(`${argument} requires a value`)
      if (argument === '--godot') options.godot = value
      else options.releaseDirectory = value
    } else if (argument === '--target') {
      index += 1
    } else {
      throw new Error(`Unknown option: ${argument}`)
    }
  }
  if (!options.godot) {
    throw new Error('Set GODOT_BIN or pass --godot with official Godot')
  }
  options.godot = path.resolve(options.godot)
  if (options.releaseDirectory) {
    options.releaseDirectory = path.resolve(options.releaseDirectory)
  }
  return options
}

function run(command, arguments_, options = {}) {
  const result = spawnSync(command, arguments_, {
    cwd: options.cwd ?? repositoryRoot,
    encoding: 'utf-8',
    maxBuffer: 32 * 1024 * 1024,
    timeout: options.timeout ?? 180_000,
  })
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
  if (result.error || result.status !== 0) {
    throw new Error(`${options.description ?? command} failed\n${output}`)
  }
  return output
}

function copyFile(source, destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(source, destination)
}

function copyTree(source, destination) {
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name)
    const to = path.join(destination, entry.name)
    if (entry.isDirectory()) copyTree(from, to)
    else if (entry.isFile()) copyFile(from, to)
  }
}

function stageProject(root) {
  const project = path.join(root, 'clean-project')
  fs.mkdirSync(project)
  for (const name of ['project.godot', 'main.tscn', 'demo-data.tres', 'tsconfig.json']) {
    copyFile(path.join(demoRoot, name), path.join(project, name))
  }
  copyFile(path.join(demoRoot, 'src/player.ts'), path.join(project, 'src/player.ts'))
  copyTree(
    path.join(repositoryRoot, 'packages/cli/templates/typings'),
    path.join(project, 'typings'),
  )
  return project
}

function installLocalAddon(project) {
  const source = path.join(packageRoot, 'addon/godotjs')
  const destination = path.join(project, 'addons/godotjs')
  copyTree(source, destination)
}

function installReleaseAddon(project, releaseDirectory) {
  const archives = fs
    .readdirSync(releaseDirectory)
    .filter((name) => /^godotjs-v[^/]+\.zip$/.test(name))
  if (archives.length !== 1) {
    throw new Error(`Expected one GodotJS ZIP, found ${archives.length}`)
  }
  run('unzip', ['-q', path.join(releaseDirectory, archives[0]), '-d', project], {
    description: 'GodotJS manual-copy extraction',
  })
}

export async function smokeStandaloneDemo(options) {
  assertOfficialGodotExecutable(options.godot)
  if (!options.skipNativeBuild && !options.releaseDirectory) {
    await buildNative({
      target: 'template_debug',
      print: false,
      tests: false,
      runTests: false,
      sanitizers: [],
    })
  }

  const temporaryRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), 'godotjs-manual-copy-smoke-'),
  )
  try {
    const project = stageProject(temporaryRoot)
    if (options.releaseDirectory) {
      installReleaseAddon(project, options.releaseDirectory)
    } else {
      installLocalAddon(project)
    }
    const extension = path.join(project, 'addons/godotjs/godotjs.gdextension')
    if (!fs.existsSync(extension)) {
      throw new Error('Manual copy did not install addons/godotjs')
    }
    if (fs.existsSync(path.join(project, 'addons/godot-js-runtime'))) {
      throw new Error('Legacy runtime add-on path is present')
    }
    fs.mkdirSync(path.join(project, '.godot'), { recursive: true })
    fs.writeFileSync(
      path.join(project, '.godot/extension_list.cfg'),
      'res://addons/godotjs/godotjs.gdextension\n',
    )

    run(
      process.execPath,
      [
        path.join(repositoryRoot, 'node_modules/typescript/bin/tsc'),
        '-p',
        path.join(project, 'tsconfig.json'),
      ],
      { description: 'standalone TypeScript build' },
    )
    const version = run(options.godot, ['--version']).trim()
    const output = run(
      options.godot,
      godotCommandArguments([
        '--headless',
        '--path',
        project,
        '--quit-after',
        '120',
      ]),
      { description: 'standalone demo in official Godot', timeout: 120_000 },
    )
    if (output.split(successMarker).length - 1 !== 1) {
      throw new Error(`Standalone demo did not pass\n${output}`)
    }
    for (const failure of ['SCRIPT ERROR', 'Failed to load extension']) {
      if (output.includes(failure)) throw new Error(`${failure}\n${output}`)
    }
    return { godotVersion: version, marker: successMarker }
  } finally {
    if (options.keepTemporaryProject) {
      console.log(`[standalone-smoke] preserved ${temporaryRoot}`)
    } else {
      fs.rmSync(temporaryRoot, { recursive: true, force: true })
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    const result = await smokeStandaloneDemo(parseArguments(process.argv.slice(2)))
    console.log(`[standalone-smoke] PASS ${JSON.stringify(result)}`)
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}
