import { spawn, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  compareGodotVersionParts,
  parseGodotNumericVersion,
  parseStableGodotTag,
} from './godot-version.mjs'

import {
  exportApplications,
  exportOutputPath,
  exportPlatformPresets,
  generateExportPresets,
  presetName,
  writeExportPresets,
} from './export-presets.mjs'
import {
  assertOfficialGodotExecutable,
  godotCommandArguments,
} from './godot-command.mjs'
import {
  findLegacyRuntimeIdentity,
  releaseTargets,
  releaseTargetById,
} from './platform-matrix.mjs'
import {
  releaseManifest,
  stageRuntimeSource,
} from './smoke-standalone-demo.mjs'

const scriptPath = fileURLToPath(import.meta.url)
const packageRoot = path.resolve(path.dirname(scriptPath), '..')
const repositoryRoot = path.resolve(packageRoot, '../..')
const defaultOutputRoot = path.join(
  repositoryRoot,
  '.artifacts/platform-exports',
)
const runtimeCli = path.join(packageRoot, 'dist/cli.js')
const linuxSmokeImage =
  'node@sha256:0557ac14e0d45d02ed563067b82856ca5e7aa3437fa28d98d4350ea9c3d9494a'
const wineSmokeImage = 'codex/godot-js-runtime-wine:bookworm'
const wineSmokeDockerfile = path.join(
  packageRoot,
  'scripts/wine-smoke.Dockerfile',
)
const webExportServer = path.join(packageRoot, 'scripts/serve-web-export.mjs')
const webExportBrowser = path.join(
  packageRoot,
  'scripts/run-web-export-browser.mjs',
)
const expectedMarkers = Object.freeze({
  standalone: '[godot-js-runtime-export] STANDALONE PASS',
  vue: '[godot-js-runtime-export] VUE PASS',
})
let androidDeviceContext

export function resolveNpmInvocation(
  platform = process.platform,
  environment = process.env,
) {
  if (platform === 'win32') {
    return {
      command: environment.ComSpec || environment.COMSPEC || 'cmd.exe',
      prefixArguments: ['/d', '/s', '/c', 'npm.cmd'],
    }
  }

  return {
    command: 'npm',
    prefixArguments: [],
  }
}

export function assertPlatformExportGodotVersion(
  actualVersion,
  expectedRelease,
) {
  if (
    compareGodotVersionParts(
      parseGodotNumericVersion(actualVersion),
      [4, 4, 1],
    ) < 0
  ) {
    throw new Error(
      `Platform exports require official Godot 4.4.1 or newer, received ${actualVersion}`,
    )
  }
  if (expectedRelease) {
    try {
      parseStableGodotTag(expectedRelease)
    } catch {
      throw new Error(
        `Invalid expected Godot stable release: ${expectedRelease}`,
      )
    }
    const expectedPrefix = expectedRelease.replace(/-stable$/, '.stable')
    if (
      actualVersion !== expectedPrefix &&
      !actualVersion.startsWith(`${expectedPrefix}.`)
    ) {
      throw new Error(
        `Platform exports expected official Godot ${expectedRelease}, received ${actualVersion}`,
      )
    }
  }
  return actualVersion
}

function usage() {
  console.log(`Usage: node scripts/smoke-platform-exports.mjs [options]

Export and verify the standalone runtime demo and representative Vue app.

Options:
  --godot <path>       Compatible official Godot executable (or GODOT_BIN).
  --godot-version <tag> Require an exact stable release tag.
  --platform <name>    macos, windows, linux, android, ios, or web; repeatable.
  --mode <name>        debug or release; repeatable. Default: both.
  --app <name>         standalone or vue; repeatable. Default: both.
  --release-dir <dir>  Install binaries from verified offline archives.
  --output-dir <dir>   Evidence/output root (default: .artifacts/platform-exports).
  --skip-build         Reuse existing runtime and demo JavaScript builds.
  --skip-launch        Export and inspect without launching applications.
  --keep-work          Preserve staged projects after the run.
  --json               Print the final evidence JSON.
  --help               Show this help.
`)
}

function repeatedValue(options, argument, value) {
  if (!value) throw new Error(`${argument} requires a value`)
  options.push(...value.split(',').filter(Boolean))
}

function parseArgs(argv) {
  const options = {
    godot: process.env.GODOT_BIN,
    expectedGodotVersion: process.env.GODOT_INTEGRATION_VERSION,
    platforms: [],
    modes: [],
    applications: [],
    releaseDirectory: undefined,
    outputRoot: defaultOutputRoot,
    skipBuild: false,
    skipLaunch: false,
    keepWork: false,
    json: false,
  }
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === '--help' || argument === '-h') {
      usage()
      process.exit(0)
    }
    if (argument === '--skip-build') {
      options.skipBuild = true
      continue
    }
    if (argument === '--skip-launch') {
      options.skipLaunch = true
      continue
    }
    if (argument === '--keep-work') {
      options.keepWork = true
      continue
    }
    if (argument === '--json') {
      options.json = true
      continue
    }
    if (
      argument === '--godot' ||
      argument === '--godot-version' ||
      argument === '--platform' ||
      argument === '--mode' ||
      argument === '--app' ||
      argument === '--release-dir' ||
      argument === '--output-dir'
    ) {
      const value = argv[++index]
      if (argument === '--platform') {
        repeatedValue(options.platforms, argument, value)
      } else if (argument === '--mode') {
        repeatedValue(options.modes, argument, value)
      } else if (argument === '--app') {
        repeatedValue(options.applications, argument, value)
      } else if (argument === '--godot') {
        if (!value) throw new Error(`${argument} requires a value`)
        options.godot = value
      } else if (argument === '--godot-version') {
        if (!value) throw new Error(`${argument} requires a value`)
        options.expectedGodotVersion = value
      } else if (argument === '--release-dir') {
        if (!value) throw new Error(`${argument} requires a value`)
        options.releaseDirectory = path.resolve(value)
      } else {
        if (!value) throw new Error(`${argument} requires a value`)
        options.outputRoot = path.resolve(value)
      }
      continue
    }
    throw new Error(`Unknown option: ${argument}`)
  }

  if (!options.godot) {
    throw new Error(
      'Set GODOT_BIN or pass --godot with compatible official Godot',
    )
  }
  options.godot = path.resolve(options.godot)
  const knownPlatforms = new Set(
    exportPlatformPresets.map((platform) => platform.id),
  )
  const knownApplications = new Set(
    exportApplications.map((application) => application.id),
  )
  for (const platform of options.platforms) {
    if (!knownPlatforms.has(platform)) {
      throw new Error(`Unknown export platform: ${platform}`)
    }
  }
  for (const mode of options.modes) {
    if (!['debug', 'release'].includes(mode)) {
      throw new Error(`Unknown export mode: ${mode}`)
    }
  }
  for (const application of options.applications) {
    if (!knownApplications.has(application)) {
      throw new Error(`Unknown export app: ${application}`)
    }
  }
  return options
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repositoryRoot,
    env: { ...process.env, ...(options.env ?? {}) },
    encoding: 'utf-8',
    maxBuffer: options.maxBuffer ?? 128 * 1024 * 1024,
    timeout: options.timeout ?? 10 * 60_000,
    stdio: options.inherit ? 'inherit' : 'pipe',
  })
  const output = options.inherit
    ? ''
    : `${result.stdout ?? ''}${result.stderr ?? ''}`
  if (result.error || result.status !== 0) {
    throw new Error(
      `${options.description ?? command} failed${
        result.error
          ? `: ${result.error.message}`
          : ` with exit code ${String(result.status)}`
      }${output ? `\n${output}` : ''}`,
    )
  }
  return output
}

function scopedRemove(targetPath, parentPath) {
  const target = path.resolve(targetPath)
  const parent = path.resolve(parentPath)
  const relative = path.relative(parent, target)
  if (
    relative === '' ||
    relative === '..' ||
    relative.startsWith(`..${path.sep}`)
  ) {
    throw new Error(`Refusing to remove path outside ${parent}: ${target}`)
  }
  fs.rmSync(target, { recursive: true, force: true })
}

function sha256File(filePath) {
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')
}

function inTreeRuntimeManifest() {
  const manifestPath = path.join(
    packageRoot,
    'addon/godot-js-runtime/runtime-manifest.json',
  )
  return JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
}

function recursiveFiles(root) {
  const files = []
  const visit = (directory) => {
    for (const entry of fs
      .readdirSync(directory, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name))) {
      const entryPath = path.join(directory, entry.name)
      if (entry.isSymbolicLink()) {
        throw new Error(`Export output contains a symbolic link: ${entryPath}`)
      }
      if (entry.isDirectory()) visit(entryPath)
      else if (entry.isFile()) files.push(entryPath)
      else throw new Error(`Unsupported export output entry: ${entryPath}`)
    }
  }
  visit(root)
  return files
}

function findRecursiveFile(root, predicate, description) {
  const match = recursiveFiles(root).find(predicate)
  if (!match) throw new Error(`${description} is missing under ${root}`)
  return match
}

function outputFileRecords(outputDirectory) {
  return recursiveFiles(outputDirectory).map((filePath) => ({
    path: path.relative(outputDirectory, filePath).split(path.sep).join('/'),
    size: fs.statSync(filePath).size,
    sha256: sha256File(filePath),
  }))
}

function stageApplication(application, workRoot) {
  const destination = path.join(workRoot, `app-${application.id}`)
  const excluded = new Set([
    '.godot',
    '.turbo',
    'addons',
    'android',
    'build',
    'node_modules',
    'typings',
  ])
  fs.cpSync(application.root, destination, {
    recursive: true,
    filter(source) {
      const relative = path.relative(application.root, source)
      if (relative === '') return true
      return !excluded.has(relative.split(path.sep)[0])
    },
  })
  fs.writeFileSync(
    path.join(destination, 'export_presets.cfg'),
    generateExportPresets(application),
  )
  return destination
}

function selectedValues(all, selected, field = 'id') {
  if (selected.length === 0) return all
  const values = new Set(selected)
  return all.filter((value) => values.has(value[field]))
}

function nativeMode(mode) {
  return mode === 'debug' ? 'template_debug' : 'template_release'
}

function targetsFor(platforms, modes) {
  const targetIds = new Set(['macos.template_debug.universal'])
  for (const target of releaseTargets) {
    if (
      platforms.some((platform) => platform.id === target.platform) &&
      modes.some((mode) => nativeMode(mode) === target.mode)
    ) {
      targetIds.add(target.id)
    }
  }
  return [...targetIds].sort()
}

function installRuntime(projectRoot, sourceRoot, targetIds, releaseDirectory) {
  const arguments_ = [
    runtimeCli,
    'install',
    '--project',
    projectRoot,
    '--source',
    sourceRoot,
  ]
  for (const target of targetIds) arguments_.push('--target', target)
  if (releaseDirectory) {
    arguments_.push('--artifact-dir', releaseDirectory)
  }
  arguments_.push('--json')
  const installed = JSON.parse(
    run(process.execPath, arguments_, {
      description: 'runtime installation for export project',
    }),
  )
  const verification = JSON.parse(
    run(
      process.execPath,
      [runtimeCli, 'verify', '--project', projectRoot, '--json'],
      { description: 'runtime verification for export project' },
    ),
  )
  if (!verification.ok) {
    throw new Error(
      `Export project runtime verification failed: ${verification.errors.join('; ')}`,
    )
  }
  return {
    targets: installed.manifest.targets,
    checkedFiles: verification.checkedFiles,
  }
}

function assertNoExportFailures(output, description) {
  for (const failure of [
    'Cannot export project',
    'Project export for preset',
    'Failed to load extension',
    'SCRIPT ERROR',
  ]) {
    if (
      output.includes(failure) &&
      !output.includes('completed with warnings')
    ) {
      throw new Error(`${description} output contains ${failure}\n${output}`)
    }
  }
}

function assertIncludes(values, pattern, description) {
  if (!values.some((value) => pattern.test(value))) {
    throw new Error(
      `${description} lacks ${String(pattern)}\n${values.join('\n')}`,
    )
  }
}

function archiveEntries(archivePath) {
  return run('unzip', ['-Z1', archivePath], {
    description: `archive listing for ${archivePath}`,
  })
    .split(/\r?\n/)
    .filter(Boolean)
}

function inspectExport({
  application,
  platform,
  mode,
  outputDirectory,
  outputPath,
}) {
  const files = outputFileRecords(outputDirectory)
  const names = files.map((file) => file.path)
  if (files.length === 0) throw new Error('Export produced no files')
  const legacyIdentity = names
    .map((name) => findLegacyRuntimeIdentity(name))
    .find(Boolean)
  if (legacyIdentity) {
    throw new Error(
      `Export contains forbidden legacy identity ${legacyIdentity}: ${names.join(', ')}`,
    )
  }
  const target = releaseTargetById(
    `${platform.id}.${nativeMode(mode)}.${
      platform.id === 'macos'
        ? 'universal'
        : platform.id === 'windows' || platform.id === 'linux'
          ? 'x86_64'
          : platform.id === 'ios'
            ? 'universal'
            : platform.id === 'web'
              ? 'wasm32'
              : 'arm64'
    }`,
  )
  if (!target && platform.id !== 'android') {
    throw new Error(
      `Missing canonical native target for ${platform.id}/${mode}`,
    )
  }

  const inspection = { target: target?.id ?? `android.${nativeMode(mode)}.*` }
  if (platform.id === 'macos') {
    const entries = archiveEntries(outputPath)
    assertIncludes(
      entries,
      new RegExp(
        `Frameworks/libgodot_js_runtime\\.macos\\.${nativeMode(mode)}\\.universal\\.framework/Resources/Info\\.plist$`,
      ),
      'macOS export',
    )
    assertIncludes(
      entries,
      new RegExp(
        `Frameworks/libgodot_js_runtime\\.macos\\.${nativeMode(mode)}\\.universal\\.framework/libgodot_js_runtime\\.macos\\.${nativeMode(mode)}\\.universal$`,
      ),
      'macOS export',
    )
    inspection.archiveEntries = entries.length
  } else if (platform.id === 'android') {
    const entries = archiveEntries(outputPath)
    for (const architecture of ['arm64-v8a', 'x86_64']) {
      assertIncludes(
        entries,
        new RegExp(
          `^lib/${architecture}/libgodot_js_runtime\\.android\\.${nativeMode(mode)}\\.(?:arm64|x86_64)\\.so$`,
        ),
        `Android ${architecture} export`,
      )
    }
    inspection.archiveEntries = entries.length
    inspection.abis = ['arm64-v8a', 'x86_64']
  } else if (platform.id === 'ios') {
    assertIncludes(names, /\.xcodeproj\/project\.pbxproj$/, 'iOS export')
    assertIncludes(
      names,
      new RegExp(
        `libgodot_js_runtime\\.ios\\.${nativeMode(mode)}\\.xcframework/Info\\.plist$`,
      ),
      'iOS export',
    )
  } else if (platform.id === 'web') {
    assertIncludes(names, /\.html$/, 'Web export')
    assertIncludes(names, /\.wasm$/, 'Web export')
    assertIncludes(
      names,
      new RegExp(
        `libgodot_js_runtime\\.web\\.${nativeMode(mode)}\\.wasm32\\.wasm$`,
      ),
      'Web export',
    )
  } else {
    const artifactName = target.artifactPath.split('/').at(-1)
    assertIncludes(
      names,
      new RegExp(artifactName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'),
      `${platform.id} export`,
    )
    if (!fs.existsSync(outputPath)) {
      throw new Error(
        `${platform.id} export executable is missing: ${outputPath}`,
      )
    }
  }
  return { files, inspection }
}

export function assertExportLaunchMarker(output, application) {
  for (const failure of [
    'Failed to load extension',
    'SCRIPT ERROR',
    'Could not read source map',
  ]) {
    if (output.includes(failure)) {
      throw new Error(`${application.id} launch contains ${failure}\n${output}`)
    }
  }
  const marker = expectedMarkers[application.id]
  const count = output.split(marker).length - 1
  if (count !== 1) {
    throw new Error(
      `${application.id} export emitted ${String(count)} copies of ${marker}\n${output}`,
    )
  }
  const markerLine = output.split(/\r?\n/).find((line) => line.includes(marker))
  const godotMatch = markerLine
    ? /\bgodot=(\d+\.\d+(?:\.\d+)?-stable) \(official\)/.exec(markerLine)
    : undefined
  if (
    !markerLine ||
    !/runtime=\d+\.\d+\.\d+/.test(markerLine) ||
    !godotMatch ||
    !/platform=/.test(markerLine)
  ) {
    throw new Error(
      `Export marker lacks version/platform evidence: ${markerLine}`,
    )
  }
  assertPlatformExportGodotVersion(
    godotMatch[1].replace(/-stable$/, '.stable.official.marker'),
  )
  return markerLine
}

function launchLinux(application, mode, outputDirectory, outputPath) {
  const executableName = path.basename(outputPath)
  const output = run(
    'docker',
    [
      'run',
      '--rm',
      '--platform',
      'linux/amd64',
      '--volume',
      `${outputDirectory}:/export:ro`,
      '--workdir',
      '/export',
      '--entrypoint',
      `/export/${executableName}`,
      linuxSmokeImage,
      '--headless',
    ],
    {
      description: `${application.id} Linux ${mode} launch`,
      timeout: 3 * 60_000,
    },
  )
  return {
    status: 'passed',
    marker: assertExportLaunchMarker(output, application),
    architecture: 'x86_64',
    containerImage: linuxSmokeImage,
  }
}

function ensureWineSmokeImage() {
  const inspected = spawnSync('docker', ['image', 'inspect', wineSmokeImage], {
    encoding: 'utf-8',
    timeout: 30_000,
  })
  if (!inspected.error && inspected.status === 0) return
  run(
    'docker',
    [
      'build',
      '--platform',
      'linux/amd64',
      '--file',
      wineSmokeDockerfile,
      '--tag',
      wineSmokeImage,
      path.dirname(wineSmokeDockerfile),
    ],
    { description: 'pinned Windows Wine smoke image', timeout: 15 * 60_000 },
  )
}

function launchWindows(
  application,
  mode,
  outputDirectory,
  outputPath,
  evidenceRoot,
) {
  const launchExecutable = outputPath
  let output
  let environment
  if (process.platform === 'win32') {
    output = run(launchExecutable, ['--headless'], {
      description: `${application.id} Windows ${mode} launch`,
      timeout: 3 * 60_000,
    })
    environment = 'native-windows'
  } else {
    ensureWineSmokeImage()
    const winePrefix = path.join(evidenceRoot, '.wine-prefix')
    fs.mkdirSync(winePrefix, { recursive: true })
    output = run(
      'docker',
      [
        'run',
        '--rm',
        '--platform',
        'linux/amd64',
        '--env',
        'WINEPREFIX=/wine-prefix',
        '--volume',
        `${winePrefix}:/wine-prefix`,
        '--volume',
        `${outputDirectory}:/export:ro`,
        '--workdir',
        '/export',
        wineSmokeImage,
        path.basename(launchExecutable),
        '--headless',
      ],
      {
        description: `${application.id} Windows ${mode} Wine launch`,
        timeout: 5 * 60_000,
      },
    )
    environment = `${wineSmokeImage} on linux/amd64`
  }
  return {
    status: 'passed',
    marker: assertExportLaunchMarker(output, application),
    architecture: 'x86_64',
    environment,
    executable: path.basename(launchExecutable),
  }
}

function sleep(milliseconds) {
  Atomics.wait(
    new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)),
    0,
    0,
    milliseconds,
  )
}

function androidSdkRoot() {
  const configured = process.env.ANDROID_SDK_ROOT ?? process.env.ANDROID_HOME
  const candidate = configured
    ? path.resolve(configured)
    : process.platform === 'darwin'
      ? '/opt/homebrew/share/android-commandlinetools'
      : path.join(os.homedir(), 'Android/Sdk')
  if (!fs.existsSync(candidate)) {
    throw new Error(
      `Android SDK is unavailable. Set ANDROID_SDK_ROOT: ${candidate}`,
    )
  }
  return candidate
}

function androidTool(root, relativePath) {
  const tool = path.join(root, relativePath)
  if (!fs.existsSync(tool)) {
    throw new Error(`Android SDK tool is missing: ${tool}`)
  }
  return tool
}

function connectedAndroidDevices(adb) {
  const output = run(adb, ['devices'], {
    description: 'Android device listing',
    timeout: 30_000,
  })
  return output
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim().split(/\s+/))
    .filter((parts) => parts.length >= 2 && parts[1] === 'device')
    .map((parts) => parts[0])
}

function arm64AndroidDevice(adb) {
  for (const serial of connectedAndroidDevices(adb)) {
    const abi = run(
      adb,
      ['-s', serial, 'shell', 'getprop', 'ro.product.cpu.abi'],
      {
        description: `Android ABI probe for ${serial}`,
        timeout: 30_000,
      },
    ).trim()
    if (abi === 'arm64-v8a') return { serial, abi }
  }
  return undefined
}

function arm64Avd(emulator) {
  const avds = run(emulator, ['-list-avds'], {
    description: 'Android virtual device listing',
    timeout: 30_000,
  })
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean)
  const configured = process.env.GODOT_JS_RUNTIME_ANDROID_AVD
  const candidates = configured ? [configured] : avds
  for (const name of candidates) {
    const configPath = path.join(
      os.homedir(),
      `.android/avd/${name}.avd/config.ini`,
    )
    if (
      fs.existsSync(configPath) &&
      /^abi\.type\s*=\s*arm64-v8a\s*$/m.test(
        fs.readFileSync(configPath, 'utf-8'),
      )
    ) {
      return name
    }
  }
  throw new Error(
    `No arm64-v8a Android AVD is available. Found: ${avds.join(', ') || '(none)'}`,
  )
}

export function androidBootProbeReady(bootCompleted, systemPackage) {
  return (
    bootCompleted.trim() === '1' && /^package:\/\S+/m.test(systemPackage.trim())
  )
}

function probeAndroidBoot(adb, serial) {
  const bootCompleted = spawnSync(
    adb,
    ['-s', serial, 'shell', 'getprop', 'sys.boot_completed'],
    { encoding: 'utf-8', timeout: 30_000 },
  )
  if (bootCompleted.error || bootCompleted.status !== 0) return false

  const systemPackage = spawnSync(
    adb,
    ['-s', serial, 'shell', 'cmd', 'package', 'path', 'android'],
    { encoding: 'utf-8', timeout: 30_000 },
  )
  if (systemPackage.error || systemPackage.status !== 0) return false

  return androidBootProbeReady(
    bootCompleted.stdout ?? '',
    systemPackage.stdout ?? '',
  )
}

function waitForAndroidBoot(adb, device, emulatorProcess) {
  const deadline = Date.now() + 4 * 60_000
  while (Date.now() < deadline) {
    if (emulatorProcess && emulatorProcess.exitCode !== null) {
      throw new Error(
        `Android emulator exited before ${device.serial} completed boot: ${String(emulatorProcess.exitCode)}`,
      )
    }
    if (probeAndroidBoot(adb, device.serial)) return
    sleep(2_000)
  }
  throw new Error(
    `Timed out waiting for Android package manager on ${device.serial}`,
  )
}

function ensureAndroidDevice(evidenceRoot) {
  if (androidDeviceContext) return androidDeviceContext
  const sdkRoot = androidSdkRoot()
  const adb = androidTool(sdkRoot, 'platform-tools/adb')
  run(adb, ['start-server'], {
    description: 'Android adb startup',
    timeout: 30_000,
  })
  let device = arm64AndroidDevice(adb)
  let emulatorProcess
  let emulatorLog
  let avd = null
  if (!device) {
    const emulator = androidTool(sdkRoot, 'emulator/emulator')
    avd = arm64Avd(emulator)
    const logPath = path.join(evidenceRoot, 'android-emulator.log')
    emulatorLog = fs.openSync(logPath, 'a')
    emulatorProcess = spawn(
      emulator,
      [
        '-avd',
        avd,
        '-no-window',
        '-no-audio',
        '-no-boot-anim',
        '-no-metrics',
        '-gpu',
        'swiftshader_indirect',
        '-no-snapshot-load',
        '-no-snapshot-save',
      ],
      { detached: false, stdio: ['ignore', emulatorLog, emulatorLog] },
    )
    const deadline = Date.now() + 4 * 60_000
    while (!device && Date.now() < deadline) {
      if (emulatorProcess.exitCode !== null) {
        throw new Error(
          `Android emulator exited before an arm64 device connected: ${String(emulatorProcess.exitCode)}`,
        )
      }
      sleep(2_000)
      device = arm64AndroidDevice(adb)
    }
    if (!device) throw new Error('Timed out waiting for arm64 Android emulator')
  }
  waitForAndroidBoot(adb, device, emulatorProcess)
  const apiLevel = run(
    adb,
    ['-s', device.serial, 'shell', 'getprop', 'ro.build.version.sdk'],
    { description: 'Android API level probe', timeout: 30_000 },
  ).trim()
  androidDeviceContext = {
    ...device,
    apiLevel,
    sdkRoot,
    adb,
    avd,
    emulatorProcess,
    emulatorLog,
  }
  return androidDeviceContext
}

function shutdownOwnedAndroidDevice() {
  const context = androidDeviceContext
  androidDeviceContext = undefined
  if (!context?.emulatorProcess) return
  spawnSync(context.adb, ['-s', context.serial, 'emu', 'kill'], {
    encoding: 'utf-8',
    timeout: 30_000,
  })
  context.emulatorProcess.kill('SIGTERM')
  if (context.emulatorLog !== undefined) fs.closeSync(context.emulatorLog)
}

function newestAndroidBuildTool(sdkRoot, name) {
  const buildToolsRoot = path.join(sdkRoot, 'build-tools')
  const versions = fs
    .readdirSync(buildToolsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) =>
      right.localeCompare(left, undefined, { numeric: true }),
    )
  for (const version of versions) {
    const candidate = path.join(buildToolsRoot, version, name)
    if (fs.existsSync(candidate)) return candidate
  }
  throw new Error(
    `Android build tool ${name} is unavailable in ${buildToolsRoot}`,
  )
}

function androidTestKeystore(evidenceRoot) {
  const ordinaryDebugKeystore = path.join(
    os.homedir(),
    '.android/debug.keystore',
  )
  if (fs.existsSync(ordinaryDebugKeystore)) return ordinaryDebugKeystore
  const keystore = path.join(evidenceRoot, '.android-smoke/debug.keystore')
  fs.mkdirSync(path.dirname(keystore), { recursive: true })
  if (!fs.existsSync(keystore)) {
    const javaHome = process.env.JAVA_HOME
    const keytool = javaHome ? path.join(javaHome, 'bin/keytool') : 'keytool'
    run(
      keytool,
      [
        '-genkeypair',
        '-keystore',
        keystore,
        '-storepass',
        'android',
        '-alias',
        'androiddebugkey',
        '-keypass',
        'android',
        '-dname',
        'CN=Godot JavaScript Runtime Export Smoke,O=Vue Godot,C=US',
        '-keyalg',
        'RSA',
        '-validity',
        '3650',
      ],
      { description: 'Android export-smoke test keystore', timeout: 60_000 },
    )
  }
  return keystore
}

function launchAndroid(
  application,
  mode,
  outputDirectory,
  outputPath,
  evidenceRoot,
) {
  const device = ensureAndroidDevice(evidenceRoot)
  let installApk = outputPath
  let testSigned = false
  if (mode === 'release') {
    const launchDirectory = path.join(outputDirectory, 'launch')
    fs.mkdirSync(launchDirectory, { recursive: true })
    installApk = path.join(launchDirectory, path.basename(outputPath))
    fs.copyFileSync(outputPath, installApk)
    const apksigner = newestAndroidBuildTool(device.sdkRoot, 'apksigner')
    run(
      apksigner,
      [
        'sign',
        '--ks',
        androidTestKeystore(evidenceRoot),
        '--ks-pass',
        'pass:android',
        '--ks-key-alias',
        'androiddebugkey',
        installApk,
      ],
      { description: 'Android release smoke test signing', timeout: 60_000 },
    )
    testSigned = true
  }
  const apksigner = newestAndroidBuildTool(device.sdkRoot, 'apksigner')
  run(apksigner, ['verify', '--verbose', installApk], {
    description: 'Android APK signature verification',
    timeout: 60_000,
  })
  const adbPrefix = ['-s', device.serial]
  run(
    device.adb,
    [...adbPrefix, 'install', '-r', '--no-incremental', installApk],
    {
      description: `${application.id} Android ${mode} installation`,
      timeout: 3 * 60_000,
    },
  )
  try {
    run(device.adb, [...adbPrefix, 'logcat', '-c'], {
      description: 'Android log reset',
      timeout: 30_000,
    })
    run(
      device.adb,
      [...adbPrefix, 'shell', 'am', 'force-stop', application.bundleId],
      { description: 'Android smoke app reset', timeout: 30_000 },
    )
    run(
      device.adb,
      [
        ...adbPrefix,
        'shell',
        'am',
        'start',
        '-W',
        '-n',
        `${application.bundleId}/com.godot.game.GodotApp`,
      ],
      {
        description: `${application.id} Android ${mode} launch`,
        timeout: 60_000,
      },
    )
    const deadline = Date.now() + 60_000
    let output = ''
    while (Date.now() < deadline) {
      output = run(
        device.adb,
        [...adbPrefix, 'logcat', '-d', '-v', 'brief', 'godot:I', '*:S'],
        { description: 'Android Godot log capture', timeout: 30_000 },
      )
      if (output.includes(expectedMarkers[application.id])) break
      sleep(1_000)
    }
    return {
      status: 'passed',
      marker: assertExportLaunchMarker(output, application),
      architecture: device.abi,
      apiLevel: device.apiLevel,
      serial: device.serial,
      avd: device.avd,
      releaseTestSigned: testSigned,
    }
  } finally {
    spawnSync(device.adb, [...adbPrefix, 'uninstall', application.bundleId], {
      encoding: 'utf-8',
      timeout: 60_000,
    })
  }
}

function launchMacos(application, mode, outputDirectory, outputPath) {
  const launchDirectory = path.join(outputDirectory, 'launch')
  fs.mkdirSync(launchDirectory, { recursive: true })
  run('unzip', ['-q', outputPath, '-d', launchDirectory], {
    description: 'macOS export extraction',
  })
  const appName = fs
    .readdirSync(launchDirectory)
    .find((entry) => entry.endsWith('.app'))
  if (!appName) throw new Error('macOS export does not contain an app bundle')
  const appRoot = path.join(launchDirectory, appName)
  const executableDirectory = path.join(appRoot, 'Contents/MacOS')
  const executableName = fs.readdirSync(executableDirectory)[0]
  const executable = path.join(executableDirectory, executableName)
  const architectureOutput = run('lipo', ['-archs', executable], {
    description: 'macOS export architecture inspection',
  }).trim()
  for (const architecture of ['arm64', 'x86_64']) {
    if (!architectureOutput.split(/\s+/).includes(architecture)) {
      throw new Error(
        `macOS export lacks ${architecture}: ${architectureOutput}`,
      )
    }
  }
  const output = run(executable, ['--headless'], {
    description: `${application.id} macOS ${mode} launch`,
    timeout: 120_000,
  })
  return {
    status: 'passed',
    marker: assertExportLaunchMarker(output, application),
    architectures: architectureOutput.split(/\s+/).sort(),
  }
}

function xcodeBuild({
  application,
  mode,
  outputDirectory,
  projectPath,
  derivedDataPath,
  sdk,
  destination,
  architecture,
}) {
  return run(
    'xcodebuild',
    [
      '-quiet',
      '-project',
      projectPath,
      '-scheme',
      application.slug,
      '-configuration',
      mode === 'debug' ? 'Debug' : 'Release',
      ...(sdk ? ['-sdk', sdk] : []),
      '-destination',
      destination,
      '-derivedDataPath',
      derivedDataPath,
      `ARCHS=${architecture}`,
      'ONLY_ACTIVE_ARCH=NO',
      'CODE_SIGNING_ALLOWED=NO',
      'CODE_SIGNING_REQUIRED=NO',
      'build',
    ],
    {
      cwd: outputDirectory,
      description: `${application.id} iOS ${mode} ${architecture} link`,
      timeout: 10 * 60_000,
    },
  )
}

function binaryArchitectures(binaryPath) {
  return run('lipo', ['-archs', binaryPath], {
    description: `Apple binary architecture inspection for ${binaryPath}`,
  })
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .sort()
}

function stripUnavailableSimulatorMetalFx(projectContents) {
  const lines = projectContents.split('\n')
  const retained = lines.filter((line) => !line.includes('MetalFX.framework'))
  const removedLines = lines.length - retained.length
  if (removedLines < 3) {
    throw new Error(
      `Expected at least three MetalFX project entries, removed ${String(removedLines)}`,
    )
  }
  return { contents: retained.join('\n'), removedLines }
}

function linkIosSimulatorRuntimeSlices(runtimeArchive, launchRoot) {
  const linkedArchitectures = []
  for (const architecture of ['arm64', 'x86_64']) {
    const outputPath = path.join(
      launchRoot,
      `libgodot_js_runtime.${architecture}.dylib`,
    )
    run(
      'xcrun',
      [
        '--sdk',
        'iphonesimulator',
        'clang++',
        '-target',
        `${architecture}-apple-ios14.0-simulator`,
        '-dynamiclib',
        `-Wl,-force_load,${runtimeArchive}`,
        '-o',
        outputPath,
      ],
      {
        description: `iOS simulator runtime ${architecture} force-load link`,
        timeout: 3 * 60_000,
      },
    )
    const architectures = binaryArchitectures(outputPath)
    if (architectures.length !== 1 || architectures[0] !== architecture) {
      throw new Error(
        `iOS runtime link output has unexpected architectures: ${architectures.join(', ')}`,
      )
    }
    linkedArchitectures.push({
      architecture,
      sha256: sha256File(outputPath),
      size: fs.statSync(outputPath).size,
    })
  }
  return linkedArchitectures
}

function compatibleIosSimulatorLaunch({
  application,
  simulatorArchitectures,
  simulatorApp,
}) {
  const hostArchitecture = process.arch === 'x64' ? 'x86_64' : process.arch
  if (!simulatorArchitectures.includes(hostArchitecture)) {
    return {
      status: 'manual-device-gate',
      reason:
        `The selected official Godot release provides ${simulatorArchitectures.join('+')} ` +
        `simulator engine code, which CoreSimulator cannot install on this ${hostArchitecture} host; ` +
        'unsigned device and simulator links passed.',
      hostArchitecture,
    }
  }
  const deviceListing = JSON.parse(
    run('xcrun', ['simctl', 'list', 'devices', 'available', '--json'], {
      description: 'available iOS simulator listing',
      timeout: 30_000,
    }),
  )
  const devices = Object.entries(deviceListing.devices)
    .filter(([runtime]) => runtime.includes('SimRuntime.iOS-'))
    .flatMap(([, runtimeDevices]) => runtimeDevices)
    .filter((device) => device.isAvailable !== false)
  const device =
    devices.find((candidate) => candidate.state === 'Booted') ?? devices[0]
  if (!device) {
    return {
      status: 'manual-device-gate',
      reason:
        'No compatible iOS simulator device is installed; all unsigned links passed.',
      hostArchitecture,
    }
  }
  const bootedBySmoke = device.state !== 'Booted'
  if (bootedBySmoke) {
    run('xcrun', ['simctl', 'boot', device.udid], {
      description: `boot iOS simulator ${device.name}`,
      timeout: 60_000,
    })
  }
  try {
    run('xcrun', ['simctl', 'bootstatus', device.udid, '-b'], {
      description: `wait for iOS simulator ${device.name}`,
      timeout: 4 * 60_000,
    })
    run('xcrun', ['simctl', 'install', device.udid, simulatorApp], {
      description: `${application.id} iOS simulator installation`,
      timeout: 2 * 60_000,
    })
    const output = run(
      'xcrun',
      [
        'simctl',
        'launch',
        '--console-pty',
        '--terminate-running-process',
        device.udid,
        application.bundleId,
      ],
      {
        description: `${application.id} iOS simulator launch`,
        timeout: 2 * 60_000,
      },
    )
    return {
      status: 'passed',
      marker: assertExportLaunchMarker(output, application),
      hostArchitecture,
      simulator: { name: device.name, udid: device.udid },
    }
  } finally {
    spawnSync(
      'xcrun',
      ['simctl', 'uninstall', device.udid, application.bundleId],
      {
        encoding: 'utf-8',
        timeout: 60_000,
      },
    )
    if (bootedBySmoke) {
      spawnSync('xcrun', ['simctl', 'shutdown', device.udid], {
        encoding: 'utf-8',
        timeout: 60_000,
      })
    }
  }
}

function launchIos(application, mode, outputDirectory) {
  if (process.platform !== 'darwin') {
    return {
      status: 'manual-device-gate',
      reason: 'iOS Xcode link validation requires a macOS runner.',
    }
  }
  const projectFile = findRecursiveFile(
    outputDirectory,
    (filePath) => filePath.endsWith('.xcodeproj/project.pbxproj'),
    'iOS Xcode project',
  )
  const projectPath = path.dirname(projectFile)
  const launchRoot = path.join(outputDirectory, 'launch')
  if (fs.existsSync(launchRoot)) scopedRemove(launchRoot, outputDirectory)
  fs.mkdirSync(launchRoot, { recursive: true })
  const configuration = mode === 'debug' ? 'Debug' : 'Release'
  const deviceDerivedData = path.join(launchRoot, 'DerivedData-device')
  const simulatorDerivedData = path.join(launchRoot, 'DerivedData-simulator')
  const originalProject = fs.readFileSync(projectFile, 'utf-8')
  try {
    xcodeBuild({
      application,
      mode,
      outputDirectory,
      projectPath,
      derivedDataPath: deviceDerivedData,
      destination: 'generic/platform=iOS',
      architecture: 'arm64',
    })
    const deviceExecutable = path.join(
      deviceDerivedData,
      'Build/Products',
      `${configuration}-iphoneos`,
      `${application.slug}.app`,
      application.slug,
    )
    const deviceArchitectures = binaryArchitectures(deviceExecutable)
    if (!deviceArchitectures.includes('arm64')) {
      throw new Error(
        `iOS device export lacks arm64: ${deviceArchitectures.join(', ')}`,
      )
    }

    const runtimeSimulatorArchive = findRecursiveFile(
      outputDirectory,
      (filePath) =>
        filePath.includes('libgodot_js_runtime.ios.') &&
        filePath.includes('ios-arm64_x86_64-simulator') &&
        filePath.endsWith('.a'),
      'iOS runtime simulator archive',
    )
    const runtimeSimulatorLinks = linkIosSimulatorRuntimeSlices(
      runtimeSimulatorArchive,
      launchRoot,
    )
    const engineSimulatorArchive = findRecursiveFile(
      outputDirectory,
      (filePath) =>
        filePath.includes(`${application.slug}.xcframework`) &&
        filePath.includes('ios-arm64_x86_64-simulator') &&
        filePath.endsWith('libgodot.a'),
      'official Godot iOS simulator archive',
    )
    const engineSimulatorArchitectures = binaryArchitectures(
      engineSimulatorArchive,
    )
    const hostArchitecture = process.arch === 'x64' ? 'x86_64' : process.arch
    const simulatorArchitecture = engineSimulatorArchitectures.includes(
      hostArchitecture,
    )
      ? hostArchitecture
      : engineSimulatorArchitectures[0]
    if (!simulatorArchitecture) {
      throw new Error(
        'Official Godot iOS simulator archive has no architecture',
      )
    }

    const simulatorSdk = run(
      'xcrun',
      ['--sdk', 'iphonesimulator', '--show-sdk-path'],
      { description: 'iOS simulator SDK discovery', timeout: 30_000 },
    ).trim()
    let simulatorAdaptation = null
    if (
      !fs.existsSync(
        path.join(simulatorSdk, 'System/Library/Frameworks/MetalFX.framework'),
      )
    ) {
      const adapted = stripUnavailableSimulatorMetalFx(originalProject)
      fs.writeFileSync(projectFile, adapted.contents)
      simulatorAdaptation = {
        reason:
          'The selected Xcode simulator SDK omits MetalFX while the official Godot project weak-links it.',
        removedProjectLines: adapted.removedLines,
      }
    }
    xcodeBuild({
      application,
      mode,
      outputDirectory,
      projectPath,
      derivedDataPath: simulatorDerivedData,
      sdk: 'iphonesimulator',
      destination: 'generic/platform=iOS Simulator',
      architecture: simulatorArchitecture,
    })
    const simulatorApp = path.join(
      simulatorDerivedData,
      'Build/Products',
      `${configuration}-iphonesimulator`,
      `${application.slug}.app`,
    )
    const simulatorExecutable = path.join(simulatorApp, application.slug)
    const simulatorArchitectures = binaryArchitectures(simulatorExecutable)
    if (!simulatorArchitectures.includes(simulatorArchitecture)) {
      throw new Error(
        `iOS simulator export lacks ${simulatorArchitecture}: ${simulatorArchitectures.join(', ')}`,
      )
    }
    const simulatorLaunch = compatibleIosSimulatorLaunch({
      application,
      simulatorArchitectures,
      simulatorApp,
    })
    return {
      status:
        simulatorLaunch.status === 'passed'
          ? 'passed'
          : 'passed-with-manual-device-gate',
      xcodeVersion: run('xcodebuild', ['-version'], {
        description: 'Xcode version probe',
        timeout: 30_000,
      }).trim(),
      deviceLink: {
        status: 'passed',
        architectures: deviceArchitectures,
        executableSha256: sha256File(deviceExecutable),
      },
      simulatorLink: {
        status: 'passed',
        architectures: simulatorArchitectures,
        engineArchitectures: engineSimulatorArchitectures,
        executableSha256: sha256File(simulatorExecutable),
        adaptation: simulatorAdaptation,
      },
      runtimeSimulatorLinks,
      simulatorLaunch,
    }
  } finally {
    fs.writeFileSync(projectFile, originalProject)
    if (fs.existsSync(launchRoot)) scopedRemove(launchRoot, outputDirectory)
  }
}

function chromeExecutable() {
  const configured = process.env.CHROME_BIN
  const candidates = [
    configured,
    process.platform === 'darwin'
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : undefined,
    process.platform === 'win32'
      ? path.join(
          process.env.PROGRAMFILES ?? 'C:\\Program Files',
          'Google/Chrome/Application/chrome.exe',
        )
      : undefined,
    'google-chrome-stable',
    'google-chrome',
    'chromium',
    'chromium-browser',
  ].filter(Boolean)
  for (const candidate of candidates) {
    const result = spawnSync(candidate, ['--version'], {
      encoding: 'utf-8',
      timeout: 30_000,
    })
    if (!result.error && result.status === 0) return candidate
  }
  throw new Error(
    `Chrome/Chromium is unavailable. Set CHROME_BIN; tried ${candidates.join(', ')}`,
  )
}

function waitForWebServer(readyFile, logFile) {
  const deadline = Date.now() + 15_000
  while (!fs.existsSync(readyFile) && Date.now() < deadline) sleep(100)
  if (!fs.existsSync(readyFile)) {
    const log = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf-8') : ''
    throw new Error(
      `Timed out starting Web export server${log ? `\n${log}` : ''}`,
    )
  }
  return JSON.parse(fs.readFileSync(readyFile, 'utf-8'))
}

function launchWeb(application, mode, outputDirectory, outputPath) {
  const launchRoot = path.join(outputDirectory, 'launch')
  if (fs.existsSync(launchRoot)) scopedRemove(launchRoot, outputDirectory)
  fs.mkdirSync(launchRoot, { recursive: true })
  const readyFile = path.join(launchRoot, 'server-ready.json')
  const serverLog = path.join(launchRoot, 'server.log')
  const serverLogDescriptor = fs.openSync(serverLog, 'a')
  const serverProcess = spawn(
    process.execPath,
    [
      webExportServer,
      '--root',
      outputDirectory,
      '--ready-file',
      readyFile,
      '--port',
      '0',
    ],
    { stdio: ['ignore', serverLogDescriptor, serverLogDescriptor] },
  )
  try {
    const server = waitForWebServer(readyFile, serverLog)
    const browser = chromeExecutable()
    const browserVersion = run(browser, ['--version'], {
      description: 'Web smoke browser version',
      timeout: 30_000,
    }).trim()
    const url = `${server.origin}/${encodeURIComponent(path.basename(outputPath))}`
    const browserResult = JSON.parse(
      run(
        process.execPath,
        [
          webExportBrowser,
          '--chrome',
          browser,
          '--url',
          url,
          '--profile',
          path.join(launchRoot, 'chrome-profile'),
          '--marker',
          expectedMarkers[application.id],
          '--timeout',
          '90000',
        ],
        {
          description: `${application.id} Web ${mode} browser launch`,
          timeout: 2 * 60_000,
          maxBuffer: 32 * 1024 * 1024,
        },
      ),
    )
    const output = browserResult.console.join('\n')
    return {
      status: 'passed',
      marker: assertExportLaunchMarker(output, application),
      browser: browserVersion,
      crossOriginIsolated: browserResult.crossOriginIsolated,
      gdextensionMode: 'dynamic-linking',
    }
  } finally {
    serverProcess.kill('SIGTERM')
    fs.closeSync(serverLogDescriptor)
    if (fs.existsSync(launchRoot)) scopedRemove(launchRoot, outputDirectory)
  }
}

function exportApplication({
  options,
  application,
  platform,
  mode,
  projectRoot,
  sourceKind,
}) {
  const outputDirectory = path.join(
    options.outputRoot,
    sourceKind,
    application.id,
    platform.id,
    mode,
  )
  if (fs.existsSync(outputDirectory)) {
    scopedRemove(outputDirectory, options.outputRoot)
  }
  fs.mkdirSync(outputDirectory, { recursive: true })
  const canonicalOutput = exportOutputPath(application, platform, mode)
  const outputPath = path.join(outputDirectory, path.basename(canonicalOutput))
  const preset = presetName(platform, mode)
  console.log(
    `[platform-export] ${sourceKind} ${application.id} ${platform.id}/${mode}`,
  )
  const exportOutput = run(
    options.godot,
    godotCommandArguments([
      '--headless',
      '--path',
      projectRoot,
      mode === 'debug' ? '--export-debug' : '--export-release',
      preset,
      outputPath,
    ]),
    {
      description: `${application.id} ${platform.id}/${mode} export`,
      timeout: platform.id === 'ios' ? 20 * 60_000 : 10 * 60_000,
    },
  )
  assertNoExportFailures(
    exportOutput,
    `${application.id} ${platform.id}/${mode}`,
  )
  const structural = inspectExport({
    application,
    platform,
    mode,
    outputDirectory,
    outputPath,
  })
  let launch
  if (options.skipLaunch) {
    launch = { status: 'skipped', reason: '--skip-launch' }
  } else if (platform.id === 'macos') {
    launch = launchMacos(application, mode, outputDirectory, outputPath)
  } else if (platform.id === 'linux') {
    launch = launchLinux(application, mode, outputDirectory, outputPath)
  } else if (platform.id === 'windows') {
    launch = launchWindows(
      application,
      mode,
      outputDirectory,
      outputPath,
      options.outputRoot,
    )
  } else if (platform.id === 'android') {
    launch = launchAndroid(
      application,
      mode,
      outputDirectory,
      outputPath,
      options.outputRoot,
    )
  } else if (platform.id === 'ios') {
    launch = launchIos(application, mode, outputDirectory)
  } else if (platform.id === 'web') {
    launch = launchWeb(application, mode, outputDirectory, outputPath)
  } else {
    launch = { status: 'pending', reason: 'platform launcher not yet selected' }
  }
  return {
    application: application.id,
    platform: platform.id,
    mode,
    preset,
    output: path
      .relative(options.outputRoot, outputPath)
      .split(path.sep)
      .join('/'),
    ...structural,
    launch,
  }
}

export function resolvePlatformExportPlan(options) {
  const platforms = selectedValues(
    exportPlatformPresets,
    options.platforms ?? [],
  )
  const modes = selectedValues(
    ['debug', 'release'].map((id) => ({ id })),
    options.modes ?? [],
  ).map((mode) => mode.id)
  const applications = selectedValues(
    exportApplications,
    options.applications ?? [],
  )
  if (
    platforms.length === 0 ||
    modes.length === 0 ||
    applications.length === 0
  ) {
    throw new Error('Platform export plan cannot be empty')
  }
  return {
    platforms,
    modes,
    applications,
    targets: targetsFor(platforms, modes),
  }
}

export function smokePlatformExports(options) {
  const godotVersion = assertOfficialGodotExecutable(options.godot)
  assertPlatformExportGodotVersion(godotVersion, options.expectedGodotVersion)
  writeExportPresets({ check: true })
  const plan = resolvePlatformExportPlan(options)
  if (!options.skipBuild) {
    const npmInvocation = resolveNpmInvocation()
    run(
      npmInvocation.command,
      [
        ...npmInvocation.prefixArguments,
        'run',
        'build',
        '--workspace=godot-js-runtime',
      ],
      {
        description: 'runtime TypeScript build',
        inherit: true,
      },
    )
    for (const application of plan.applications) {
      const workspace =
        application.id === 'standalone'
          ? 'godot-js-runtime-demo'
          : 'native-app-demo'
      run(
        npmInvocation.command,
        [
          ...npmInvocation.prefixArguments,
          'run',
          'build',
          `--workspace=${workspace}`,
        ],
        {
          description: `${application.id} application build`,
          inherit: true,
        },
      )
    }
  }

  fs.mkdirSync(options.outputRoot, { recursive: true })
  const workRoot = fs.mkdtempSync(path.join(options.outputRoot, '.work-'))
  const sourceKind = options.releaseDirectory ? 'packaged' : 'in-tree'
  const runtimeManifest = options.releaseDirectory
    ? releaseManifest(options.releaseDirectory)
    : inTreeRuntimeManifest()
  const evidence = {
    schemaVersion: 1,
    godotVersion,
    runtimeSource: sourceKind,
    releaseDirectory: options.releaseDirectory ?? null,
    runtimeManifest: {
      version: runtimeManifest.version,
      gitCommit: runtimeManifest.gitCommit,
      godotMinimum: runtimeManifest.godotMinimum,
      artifactCount: runtimeManifest.artifacts.length,
      archiveCount: runtimeManifest.archives.length,
    },
    targets: plan.targets,
    installations: [],
    exports: [],
  }
  try {
    const runtimeSource = options.releaseDirectory
      ? stageRuntimeSource(workRoot, runtimeManifest, false)
      : packageRoot
    for (const application of plan.applications) {
      const projectRoot = stageApplication(application, workRoot)
      const installation = installRuntime(
        projectRoot,
        runtimeSource,
        plan.targets,
        options.releaseDirectory,
      )
      evidence.installations.push({
        application: application.id,
        ...installation,
      })
      const editorOutput = run(
        options.godot,
        godotCommandArguments([
          '--headless',
          '--editor',
          '--path',
          projectRoot,
          '--quit',
        ]),
        {
          description: `${application.id} export editor import`,
          timeout: 5 * 60_000,
        },
      )
      for (const failure of ['Failed to load extension', 'SCRIPT ERROR']) {
        if (editorOutput.includes(failure)) {
          throw new Error(
            `${application.id} export editor import contains ${failure}\n${editorOutput}`,
          )
        }
      }
      for (const platform of plan.platforms) {
        for (const mode of plan.modes) {
          evidence.exports.push(
            exportApplication({
              options,
              application,
              platform,
              mode,
              projectRoot,
              sourceKind,
            }),
          )
        }
      }
    }
    const evidencePath = path.join(
      options.outputRoot,
      `${sourceKind}-evidence.json`,
    )
    fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
    return { evidence, evidencePath }
  } finally {
    shutdownOwnedAndroidDevice()
    if (options.keepWork) {
      console.log(`[platform-export] preserved staging projects at ${workRoot}`)
    } else if (fs.existsSync(workRoot)) {
      scopedRemove(workRoot, options.outputRoot)
    }
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const result = smokePlatformExports(options)
  if (options.json) {
    console.log(JSON.stringify(result.evidence, null, 2))
  } else {
    console.log(
      `[platform-export] PASS ${String(result.evidence.exports.length)} export(s); evidence ${result.evidencePath}`,
    )
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
