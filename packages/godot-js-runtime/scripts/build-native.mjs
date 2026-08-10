import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { bootstrapDependencies, sha256File } from './bootstrap-deps.mjs'
import { generateExtensionManifest } from './generate-extension-manifest.mjs'

const scriptPath = fileURLToPath(import.meta.url)
const packageRoot = path.resolve(path.dirname(scriptPath), '..')
const repoRoot = path.resolve(packageRoot, '../..')
const nativeRoot = path.join(packageRoot, 'native')
const runtimeManifestPath = path.join(
  packageRoot,
  'addon/godot-js-runtime/runtime-manifest.json',
)
const toolingRoot = path.resolve(
  process.env.GODOT_JS_RUNTIME_TOOLING_DIR ??
    path.join(repoRoot, '.cache/godot-js-runtime/tooling'),
)

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? packageRoot,
    env: options.env ?? process.env,
    encoding: 'utf-8',
    stdio: options.capture ? 'pipe' : 'inherit',
  })
  if (result.error) {
    throw result.error
  }
  if (result.status !== 0) {
    const details = options.capture
      ? `\n${result.stdout ?? ''}${result.stderr ?? ''}`
      : ''
    throw new Error(
      `${command} exited with status ${String(result.status)}${details}`,
    )
  }
  return result
}

function defaultPlatform() {
  const platforms = { darwin: 'macos', linux: 'linux', win32: 'windows' }
  const platform = platforms[process.platform]
  if (!platform) {
    throw new Error(`Unsupported host platform: ${process.platform}`)
  }
  return platform
}

function defaultArchitecture(platform) {
  if (platform === 'macos') {
    return 'universal'
  }
  const architectures = { x64: 'x86_64', arm64: 'arm64' }
  const architecture = architectures[process.arch]
  if (!architecture) {
    throw new Error(`Unsupported host architecture: ${process.arch}`)
  }
  return architecture
}

export function shouldWriteNativeManifest(
  existingManifest,
  requestedWrite = undefined,
) {
  if (requestedWrite !== undefined) {
    return requestedWrite === true
  }
  return !(
    existingManifest &&
    Array.isArray(existingManifest.archives) &&
    existingManifest.archives.length > 0
  )
}

function readExistingRuntimeManifest() {
  return fs.existsSync(runtimeManifestPath)
    ? JSON.parse(fs.readFileSync(runtimeManifestPath, 'utf-8'))
    : undefined
}

function parseArgs(argv) {
  const options = {
    platform: undefined,
    arch: undefined,
    target: 'template_debug',
    jobs: Math.max(1, Math.min(os.cpus().length, 8)),
    clean: false,
    print: false,
    tests: false,
    runTests: false,
    sanitizers: [],
    iosSimulator: false,
    threads: undefined,
    androidApiLevel: undefined,
  }
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === '--clean') {
      options.clean = true
    } else if (argument === '--tests') {
      options.tests = true
    } else if (argument === '--run-tests') {
      options.tests = true
      options.runTests = true
    } else if (argument === '--print') {
      options.print = true
    } else if (argument === '--ios-simulator') {
      options.iosSimulator = true
    } else if (argument === '--threads') {
      options.threads = true
    } else if (argument === '--no-threads') {
      options.threads = false
    } else if (
      argument === '--platform' ||
      argument === '--arch' ||
      argument === '--target' ||
      argument === '--jobs' ||
      argument === '--sanitizers' ||
      argument === '--android-api-level'
    ) {
      const value = argv[++index]
      if (!value) {
        throw new Error(`${argument} requires a value`)
      }
      const name =
        argument === '--android-api-level'
          ? 'androidApiLevel'
          : argument.slice(2)
      options[name] =
        name === 'jobs' || name === 'androidApiLevel'
          ? Number(value)
          : name === 'sanitizers'
            ? value.split(',').filter(Boolean)
            : value
    } else {
      throw new Error(`Unknown option: ${argument}`)
    }
  }

  options.platform ??= defaultPlatform()
  options.arch ??= defaultArchitecture(options.platform)
  if (
    !['editor', 'template_debug', 'template_release'].includes(options.target)
  ) {
    throw new Error(`Unsupported target: ${options.target}`)
  }
  if (!Number.isSafeInteger(options.jobs) || options.jobs < 1) {
    throw new Error('--jobs must be a positive integer')
  }
  if (options.iosSimulator && options.platform !== 'ios') {
    throw new Error('--ios-simulator requires --platform ios')
  }
  if (options.threads !== undefined && options.platform !== 'web') {
    throw new Error('--threads and --no-threads require --platform web')
  }
  if (
    options.androidApiLevel !== undefined &&
    (!Number.isSafeInteger(options.androidApiLevel) ||
      options.androidApiLevel < 21)
  ) {
    throw new Error('--android-api-level must be an integer of at least 21')
  }
  if (options.androidApiLevel !== undefined && options.platform !== 'android') {
    throw new Error('--android-api-level requires --platform android')
  }
  const unsupportedSanitizers = options.sanitizers.filter(
    (sanitizer) => !['address', 'undefined'].includes(sanitizer),
  )
  if (unsupportedSanitizers.length > 0) {
    throw new Error(
      `Unsupported sanitizer(s): ${unsupportedSanitizers.join(', ')}`,
    )
  }
  return options
}

function scopedRemove(targetPath, parentPath) {
  const relative = path.relative(
    path.resolve(parentPath),
    path.resolve(targetPath),
  )
  if (
    relative === '' ||
    relative === '..' ||
    relative.startsWith(`..${path.sep}`)
  ) {
    throw new Error(
      `Refusing to remove path outside ${parentPath}: ${targetPath}`,
    )
  }
  fs.rmSync(targetPath, { recursive: true, force: true })
}

function venvExecutable(venvDir, name) {
  return process.platform === 'win32'
    ? path.join(venvDir, 'Scripts', `${name}.exe`)
    : path.join(venvDir, 'bin', name)
}

function ensureSCons(wheelPath, dependency) {
  if (process.env.SCONS_BIN) {
    return process.env.SCONS_BIN
  }
  const python =
    process.env.PYTHON_BIN ??
    (process.platform === 'win32' ? 'python' : 'python3')
  const venvDir = path.join(toolingRoot, `scons-${dependency.version}`)
  const markerPath = path.join(venvDir, '.godot-js-runtime-tool.json')
  const scons = venvExecutable(venvDir, 'scons')
  const expectedMarker = {
    version: dependency.version,
    wheelSha256: sha256File(wheelPath),
  }

  let valid = false
  if (fs.existsSync(markerPath) && fs.existsSync(scons)) {
    try {
      valid =
        JSON.stringify(JSON.parse(fs.readFileSync(markerPath, 'utf-8'))) ===
        JSON.stringify(expectedMarker)
    } catch {
      valid = false
    }
  }
  if (valid) {
    return scons
  }

  if (fs.existsSync(venvDir)) {
    scopedRemove(venvDir, toolingRoot)
  }
  fs.mkdirSync(toolingRoot, { recursive: true })
  run(python, ['-m', 'venv', venvDir])
  const venvPython = venvExecutable(venvDir, 'python')
  run(venvPython, [
    '-m',
    'pip',
    'install',
    '--disable-pip-version-check',
    '--no-index',
    '--no-deps',
    wheelPath,
  ])
  fs.writeFileSync(markerPath, `${JSON.stringify(expectedMarker, null, 2)}\n`)
  return scons
}

export function resolveNativeBuildPlan(options) {
  const platform = options.platform ?? defaultPlatform()
  const arch = options.arch ?? defaultArchitecture(platform)
  const target = options.target ?? 'template_debug'
  const jobs = options.jobs ?? Math.max(1, Math.min(os.cpus().length, 8))
  const buildTests = options.tests === true || options.runTests === true
  const sanitizers = [...(options.sanitizers ?? [])]
  const iosSimulator = options.iosSimulator === true
  const threads = options.threads
  const androidApiLevel = options.androidApiLevel
  const testArtifact = path.join(
    nativeRoot,
    'bin',
    platform === 'windows'
      ? 'godot_js_runtime_tests.exe'
      : 'godot_js_runtime_tests',
  )
  const sconsArguments = [
    '-C',
    nativeRoot,
    `-j${jobs}`,
    'build_profile=godot-cpp-profile.json',
    `platform=${platform}`,
    `target=${target}`,
    `arch=${arch}`,
  ]
  if (iosSimulator) {
    sconsArguments.push('ios_simulator=yes')
  }
  if (threads !== undefined) {
    sconsArguments.push(`threads=${threads ? 'yes' : 'no'}`)
  }
  if (androidApiLevel !== undefined) {
    sconsArguments.push(`android_api_level=${androidApiLevel}`)
  }
  return {
    platform,
    arch,
    target,
    jobs,
    nativeRoot,
    buildTests,
    runTests: options.runTests === true,
    sanitizers,
    iosSimulator,
    threads,
    androidApiLevel,
    testArtifact,
    sconsArguments,
  }
}

export async function buildNative(options) {
  const plan = resolveNativeBuildPlan(options)
  if (options.print) {
    return plan
  }

  const bootstrap = await bootstrapDependencies()
  const dependencyLock = JSON.parse(
    fs.readFileSync(path.join(nativeRoot, 'deps.lock.json'), 'utf-8'),
  )
  const scons = ensureSCons(
    bootstrap.results.SCons,
    dependencyLock.dependencies.scons,
  )
  const args = [...plan.sconsArguments]
  if (options.clean) {
    args.push('--clean')
  }
  run(scons, args, {
    env: {
      ...process.env,
      ...(plan.buildTests ? { GODOT_JS_RUNTIME_BUILD_TESTS: '1' } : {}),
      ...(plan.sanitizers.length > 0
        ? { GODOT_JS_RUNTIME_SANITIZERS: plan.sanitizers.join(',') }
        : {}),
    },
  })
  if (plan.runTests) {
    const hostPlatform = defaultPlatform()
    const hostArchitecture = defaultArchitecture(hostPlatform)
    if (
      plan.platform !== hostPlatform ||
      (plan.arch !== hostArchitecture &&
        !(plan.platform === 'macos' && plan.arch === 'universal'))
    ) {
      throw new Error(
        `Cannot run ${plan.platform}/${plan.arch} native tests on ${hostPlatform}/${hostArchitecture}`,
      )
    }
    run(plan.testArtifact, [], { cwd: nativeRoot })
  }
  const existingManifest =
    options.writeManifest === undefined
      ? readExistingRuntimeManifest()
      : undefined
  const writeManifest = shouldWriteNativeManifest(
    existingManifest,
    options.writeManifest,
  )
  const manifest = generateExtensionManifest({
    includeArtifacts: true,
    write: writeManifest,
  })
  return { ...plan, scons, manifest, manifestWritten: writeManifest }
}

async function runCli() {
  const options = parseArgs(process.argv.slice(2))
  const result = await buildNative(options)
  if (options.print) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    console.log(
      `[build-native] ${result.platform}/${result.arch}/${result.target}: ${result.manifest.artifacts.length} artifact file(s) inspected; package manifest ${result.manifestWritten ? 'written' : 'preserved'}`,
    )
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    await runCli()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}
