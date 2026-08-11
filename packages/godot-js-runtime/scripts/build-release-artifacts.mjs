import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildNative } from './build-native.mjs'
import { generateExtensionManifest } from './generate-extension-manifest.mjs'
import {
  releaseTargetsForPlatforms,
  releaseTargetForArtifactName,
} from './platform-matrix.mjs'

const scriptPath = fileURLToPath(import.meta.url)
const packageRoot = path.resolve(path.dirname(scriptPath), '..')
const nativeRoot = path.join(packageRoot, 'native')
const addonBinDirectory = path.join(packageRoot, 'addon/godotjs/bin')

function usage() {
  console.log(`Usage: node scripts/build-release-artifacts.mjs [options]

Options:
  --platform <name>  Build one required platform; repeatable. Default: all.
  --mode <mode>      debug, release, or all. Default: all.
  --jobs <count>     Maximum parallel compiler jobs. Default: up to 8.
  --clean            Clean each selected native build before rebuilding.
  --print            Print the deterministic build plan without building.
  --help             Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    platforms: [],
    mode: 'all',
    jobs: Math.max(1, Math.min(os.cpus().length, 8)),
    clean: false,
    print: false,
  }
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === '--help' || argument === '-h') {
      usage()
      process.exit(0)
    }
    if (argument === '--clean') {
      options.clean = true
      continue
    }
    if (argument === '--print') {
      options.print = true
      continue
    }
    if (
      argument === '--platform' ||
      argument === '--mode' ||
      argument === '--jobs'
    ) {
      const value = argv[++index]
      if (!value) throw new Error(`${argument} requires a value`)
      if (argument === '--platform') {
        options.platforms.push(...value.split(',').filter(Boolean))
      } else if (argument === '--mode') {
        options.mode = value
      } else {
        options.jobs = Number(value)
      }
      continue
    }
    throw new Error(`Unknown option: ${argument}`)
  }
  if (!['debug', 'release', 'all'].includes(options.mode)) {
    throw new Error('--mode must be debug, release, or all')
  }
  if (!Number.isSafeInteger(options.jobs) || options.jobs < 1) {
    throw new Error('--jobs must be a positive integer')
  }
  return options
}

function selectedReleaseTargets(options) {
  const targets = releaseTargetsForPlatforms(options.platforms)
  if (options.mode === 'all') return targets
  const nativeMode =
    options.mode === 'debug' ? 'template_debug' : 'template_release'
  return targets.filter((target) => target.mode === nativeMode)
}

function uniqueBuilds(targets) {
  const builds = new Map()
  for (const target of targets) {
    for (const build of target.builds) {
      const key = JSON.stringify(build)
      builds.set(key, build)
    }
  }
  return [...builds.values()]
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: packageRoot,
    env: process.env,
    encoding: 'utf-8',
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${String(result.status)}`)
  }
}

function removeOutput(outputPath) {
  const resolvedOutput = path.resolve(outputPath)
  const relative = path.relative(
    path.resolve(addonBinDirectory),
    resolvedOutput,
  )
  if (
    relative === '' ||
    relative === '..' ||
    relative.startsWith(`..${path.sep}`)
  ) {
    throw new Error(`Refusing to remove output outside ${addonBinDirectory}`)
  }
  fs.rmSync(resolvedOutput, { recursive: true, force: true })
}

function iosLibraryPath(target, simulator) {
  const suffix = simulator ? 'universal.simulator' : 'arm64'
  return path.join(
    nativeRoot,
    'bin/ios',
    `libgodotjs.ios.${target.mode}.${suffix}.a`,
  )
}

function assembleIosXcframework(target) {
  const deviceLibrary = iosLibraryPath(target, false)
  const simulatorLibrary = iosLibraryPath(target, true)
  for (const library of [deviceLibrary, simulatorLibrary]) {
    if (!fs.existsSync(library)) {
      throw new Error(
        `Missing iOS library required for XCFramework: ${library}`,
      )
    }
  }
  const output = path.join(addonBinDirectory, target.artifactPath)
  removeOutput(output)
  run('xcodebuild', [
    '-create-xcframework',
    '-library',
    deviceLibrary,
    '-library',
    simulatorLibrary,
    '-output',
    output,
  ])
}

export function resolveReleaseBuildPlan(options) {
  const targets = selectedReleaseTargets(options)
  if (targets.length === 0) {
    throw new Error('The selected release build has no targets')
  }
  return {
    targets,
    builds: uniqueBuilds(targets),
    iosTargets: targets.filter((target) => target.platform === 'ios'),
  }
}

export async function buildReleaseArtifacts(options) {
  const plan = resolveReleaseBuildPlan(options)
  if (options.print) return plan

  for (const build of plan.builds) {
    const buildOptions = {
      ...build,
      jobs: options.jobs,
      writeManifest: false,
    }
    if (options.clean) {
      await buildNative({ ...buildOptions, clean: true })
    }
    await buildNative(buildOptions)
  }
  for (const target of plan.iosTargets) {
    assembleIosXcframework(target)
  }

  for (const target of plan.targets) {
    releaseTargetForArtifactName(target.artifactPath)
    const artifactPath = path.join(addonBinDirectory, target.artifactPath)
    if (!fs.existsSync(artifactPath)) {
      throw new Error(`Native build did not produce ${artifactPath}`)
    }
  }
  const manifest = generateExtensionManifest({
    includeArtifacts: true,
    requireAllArtifacts: false,
  })
  return { ...plan, manifest }
}

async function runCli() {
  const options = parseArgs(process.argv.slice(2))
  const result = await buildReleaseArtifacts(options)
  if (options.print) {
    console.log(JSON.stringify(result, null, 2))
    return
  }
  console.log(
    `[release-build] produced ${result.targets.length} target(s) and ${result.manifest.artifacts.length} payload file(s)`,
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    await runCli()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}
