import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { buildNative } from './build-native.mjs'
import {
  assertOfficialGodotExecutable,
  godotCommandArguments,
} from './godot-command.mjs'
import { generateExtensionManifest } from './generate-extension-manifest.mjs'

const scriptPath = fileURLToPath(import.meta.url)
const packageRoot = path.resolve(path.dirname(scriptPath), '..')
const repositoryRoot = path.resolve(packageRoot, '../..')
const demoRoot = path.join(repositoryRoot, 'apps/js-runtime-demo')
const successMarker = '[godot-js-runtime-demo] PHASE6_STANDALONE_DEMO PASS'

function parseArguments(argv) {
  const options = {
    godot: process.env.GODOT_BIN,
    keepTemporaryProject: false,
    skipNativeBuild: process.env.GODOT_JS_RUNTIME_SKIP_NATIVE_BUILD === '1',
    target: undefined,
    releaseDirectory: undefined,
  }
  for (let index = 0; index < argv.length; ++index) {
    const argument = argv[index]
    if (argument === '--keep-temp') {
      options.keepTemporaryProject = true
    } else if (argument === '--skip-native-build') {
      options.skipNativeBuild = true
    } else if (
      argument === '--godot' ||
      argument === '--target' ||
      argument === '--release-dir'
    ) {
      const value = argv[++index]
      if (!value) throw new Error(`${argument} requires a value`)
      const field =
        argument === '--release-dir' ? 'releaseDirectory' : argument.slice(2)
      options[field] = value
    } else {
      throw new Error(`Unknown option: ${argument}`)
    }
  }
  if (!options.godot) {
    throw new Error(
      'Set GODOT_BIN or pass --godot with an official Godot executable',
    )
  }
  options.godot = path.resolve(options.godot)
  if (!fs.existsSync(options.godot)) {
    throw new Error(`Godot executable does not exist: ${options.godot}`)
  }
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
    throw new Error(
      `${options.description ?? command} failed${
        result.error
          ? `: ${result.error.message}`
          : ` with exit code ${String(result.status)}`
      }\n${output}`,
    )
  }
  return output
}

function copyFile(source, destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(source, destination)
  fs.chmodSync(destination, fs.statSync(source).mode & 0o777)
}

export function stageRuntimeSource(temporaryRoot, manifest, copyArtifacts) {
  const sourceRoot = path.join(temporaryRoot, 'runtime package')
  const sourceAddon = path.join(sourceRoot, 'addon/godot-js-runtime')
  const packageAddon = path.join(packageRoot, 'addon/godot-js-runtime')
  for (const name of [
    'godot_js_runtime.gdextension',
    'LICENSE',
    'THIRD_PARTY_NOTICES.md',
    'licenses/godot-cpp-MIT.md',
    'licenses/quickjs-ng-MIT.txt',
  ]) {
    const extension = name === 'godot_js_runtime.gdextension'
    const source = extension
      ? path.join(packageAddon, name)
      : path.join(packageRoot, name)
    const destination = extension
      ? path.join(sourceAddon, name)
      : path.join(sourceRoot, name)
    copyFile(source, destination)
  }
  if (copyArtifacts) {
    for (const artifact of manifest.artifacts) {
      copyFile(
        path.join(packageAddon, 'bin', ...artifact.name.split('/')),
        path.join(sourceAddon, 'bin', ...artifact.name.split('/')),
      )
    }
  }
  fs.writeFileSync(
    path.join(sourceAddon, 'runtime-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  )
  return sourceRoot
}

function sha256File(filePath) {
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')
}

export function releaseManifest(releaseDirectory) {
  const checksumPath = path.join(releaseDirectory, 'SHA256SUMS')
  const checksumSource = fs.readFileSync(checksumPath, 'utf-8')
  for (const line of checksumSource.trim().split(/\r?\n/)) {
    const match = line.match(/^([a-f0-9]{64})  ([^/\\]+)$/)
    if (!match) throw new Error(`Invalid release checksum entry: ${line}`)
    const filePath = path.join(releaseDirectory, match[2])
    if (!fs.existsSync(filePath) || sha256File(filePath) !== match[1]) {
      throw new Error(`Release checksum differs for ${match[2]}`)
    }
  }
  return JSON.parse(
    fs.readFileSync(
      path.join(releaseDirectory, 'runtime-manifest.json'),
      'utf-8',
    ),
  )
}

function stageEmptyProject(temporaryRoot) {
  const projectRoot = path.join(temporaryRoot, 'empty stock project')
  fs.mkdirSync(projectRoot, { recursive: true })
  copyFile(
    path.join(demoRoot, 'project.godot'),
    path.join(projectRoot, 'project.godot'),
  )
  return projectRoot
}

function addDemoSources(projectRoot) {
  for (const name of ['main.tscn', 'demo-data.tres', 'tsconfig.json']) {
    copyFile(path.join(demoRoot, name), path.join(projectRoot, name))
  }
  copyFile(
    path.join(demoRoot, 'src/player.ts'),
    path.join(projectRoot, 'src/player.ts'),
  )
}

function runCli(cliPath, arguments_, description) {
  return run(process.execPath, [cliPath, ...arguments_, '--json'], {
    description,
  })
}

function markerCount(output, marker) {
  return output.split(marker).length - 1
}

export async function smokeStandaloneDemo(options) {
  assertOfficialGodotExecutable(options.godot)
  run('npm', ['run', 'build', '--workspace=godot-js-runtime'], {
    description: 'standalone runtime package build',
  })
  if (!options.skipNativeBuild && !options.releaseDirectory) {
    await buildNative({
      target: 'template_debug',
      print: false,
      tests: false,
      runTests: false,
      sanitizers: [],
    })
  }

  const manifest = options.releaseDirectory
    ? releaseManifest(options.releaseDirectory)
    : generateExtensionManifest({
        includeArtifacts: true,
        write: false,
      })
  const installer = await import(
    pathToFileURL(path.join(packageRoot, 'dist/index.js')).href
  )
  const target = options.target ?? installer.resolveHostDebugTarget(manifest)
  const temporaryRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), 'godot-js-runtime standalone smoke-'),
  )
  try {
    const sourceRoot = stageRuntimeSource(
      temporaryRoot,
      manifest,
      !options.releaseDirectory,
    )
    const projectRoot = stageEmptyProject(temporaryRoot)
    const cliPath = path.join(packageRoot, 'dist/cli.js')
    const archiveArguments = options.releaseDirectory
      ? ['--artifact-dir', options.releaseDirectory]
      : []

    const installOutput = runCli(
      cliPath,
      [
        'install',
        '--project',
        projectRoot,
        '--source',
        sourceRoot,
        '--target',
        target,
        ...archiveArguments,
      ],
      'standalone runtime installation',
    )
    const installation = JSON.parse(installOutput)
    if (!installation.manifest.targets.includes(target)) {
      throw new Error(`Installer did not record target ${target}`)
    }
    const installationManifestPath = path.join(
      projectRoot,
      'addons/godot-js-runtime/installation-manifest.json',
    )
    const firstInstallationManifest = fs.readFileSync(installationManifestPath)

    runCli(
      cliPath,
      ['typegen', '--project', projectRoot],
      'standalone project type generation',
    )
    addDemoSources(projectRoot)
    run(
      process.execPath,
      [
        path.join(repositoryRoot, 'node_modules/typescript/bin/tsc'),
        '-p',
        path.join(projectRoot, 'tsconfig.json'),
      ],
      { description: 'standalone TypeScript build' },
    )
    for (const relativePath of [
      'typings/godot.d.ts',
      'dist/player.js',
      'dist/player.js.map',
    ]) {
      if (!fs.existsSync(path.join(projectRoot, relativePath))) {
        throw new Error(`Standalone build did not create ${relativePath}`)
      }
    }

    const verification = JSON.parse(
      runCli(
        cliPath,
        ['verify', '--project', projectRoot],
        'standalone runtime verification',
      ),
    )
    if (!verification.ok) {
      throw new Error(
        `Standalone runtime verification failed: ${verification.errors.join('; ')}`,
      )
    }

    runCli(
      cliPath,
      [
        'install',
        '--project',
        projectRoot,
        '--source',
        sourceRoot,
        '--target',
        target,
        ...archiveArguments,
      ],
      'standalone runtime reinstall',
    )
    if (
      !fs
        .readFileSync(installationManifestPath)
        .equals(firstInstallationManifest)
    ) {
      throw new Error('Standalone reinstall changed its deterministic manifest')
    }

    const version = run(options.godot, ['--version'], {
      description: 'official Godot version check',
    }).trim()
    if (!/^4\./.test(version)) {
      throw new Error(`Expected official Godot 4, received: ${version}`)
    }
    const godotOutput = run(
      options.godot,
      godotCommandArguments([
        '--headless',
        '--path',
        projectRoot,
        '--quit-after',
        '120',
      ]),
      {
        description: 'standalone demo in official Godot',
        timeout: 120_000,
      },
    )
    if (markerCount(godotOutput, successMarker) !== 1) {
      throw new Error(
        `Standalone demo did not emit exactly one success marker\n${godotOutput}`,
      )
    }
    for (const failure of [
      'SCRIPT ERROR',
      'Failed to load extension',
      'Standalone lifecycle, signal, or resource check failed',
    ]) {
      if (godotOutput.includes(failure)) {
        throw new Error(
          `Standalone demo output contains ${failure}\n${godotOutput}`,
        )
      }
    }

    const sentinelPath = path.join(
      projectRoot,
      'addons/godot-js-runtime/user-preserved.txt',
    )
    fs.writeFileSync(sentinelPath, 'unowned file\n')
    const uninstall = JSON.parse(
      runCli(
        cliPath,
        ['uninstall', '--project', projectRoot],
        'standalone runtime uninstall',
      ),
    )
    if (
      !fs.existsSync(sentinelPath) ||
      !uninstall.preservedFiles.includes('user-preserved.txt')
    ) {
      throw new Error('Uninstall removed or failed to report an unowned file')
    }
    if (fs.existsSync(installationManifestPath)) {
      throw new Error('Uninstall left the installation manifest behind')
    }

    return {
      godotVersion: version,
      target,
      checkedFiles: verification.checkedFiles,
      installedFiles: installation.manifest.files.length,
      marker: successMarker,
    }
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
    const result = await smokeStandaloneDemo(
      parseArguments(process.argv.slice(2)),
    )
    console.log(
      `[standalone-smoke] PASS ${result.godotVersion} ${result.target}; ${result.installedFiles} installed and ${result.checkedFiles} verified file(s)`,
    )
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
