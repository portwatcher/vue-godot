import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isRuntimeManifest } from '../dist/manifest.js'
import {
  collectReleaseArtifacts,
  findLegacyRuntimeIdentity,
  releaseTargets,
  releaseTargetsForPlatforms,
} from './platform-matrix.mjs'

const scriptPath = fileURLToPath(import.meta.url)
const packageRoot = path.resolve(path.dirname(scriptPath), '..')
const addonRoot = path.join(packageRoot, 'addon/godotjs')
const defaultBinDirectory = path.join(addonRoot, 'bin')
const defaultExtensionPath = path.join(
  addonRoot,
  'godotjs.gdextension',
)
const defaultManifestPath = path.join(addonRoot, 'manifest.json')
const entrySymbol = 'godotjs_library_init'
const godotCppInterfaceSymbol = 'gdextension_interface_variant_destroy'

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: 'utf-8',
    maxBuffer: 64 * 1024 * 1024,
  })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed (${String(result.status)})\n${result.stdout ?? ''}${result.stderr ?? ''}`,
    )
  }
  return `${result.stdout ?? ''}${result.stderr ?? ''}`
}

function executable(candidates, label) {
  for (const candidate of candidates.filter(Boolean)) {
    if (candidate.includes(path.sep) && !fs.existsSync(candidate)) continue
    const result = spawnSync(candidate, ['--version'], {
      encoding: 'utf-8',
      stdio: 'pipe',
    })
    if (!result.error && result.status === 0) return candidate
  }
  throw new Error(
    `${label} is required. Tried: ${candidates.filter(Boolean).join(', ')}`,
  )
}

export function parseExtensionLibraries(source) {
  const libraries = new Map()
  let inLibraries = false
  for (const line of source.split(/\r?\n/)) {
    const section = line.match(/^\[([^\]]+)\]$/)
    if (section) {
      inLibraries = section[1] === 'libraries'
      continue
    }
    if (!inLibraries || line.trim().length === 0) continue
    const match = line.match(
      /^([^=]+?)\s*=\s*"res:\/\/addons\/godotjs\/bin\/(.+)"$/,
    )
    if (!match) throw new Error(`Invalid GDExtension library entry: ${line}`)
    libraries.set(match[1].trim(), match[2])
  }
  return libraries
}

export function verifyExtensionLibraryMap(source) {
  const libraries = parseExtensionLibraries(source)
  if (libraries.size !== releaseTargets.length) {
    throw new Error(
      `Expected ${releaseTargets.length} GDExtension library entries, found ${libraries.size}`,
    )
  }
  for (const target of releaseTargets) {
    const actual = libraries.get(target.godotFeatureKey)
    if (actual !== target.artifactPath) {
      throw new Error(
        `GDExtension feature ${target.godotFeatureKey} must select ${target.artifactPath}; found ${actual ?? '<missing>'}`,
      )
    }
  }
  return libraries
}

function scanForLegacyIdentity(filePath) {
  const source = fs.readFileSync(filePath).toString('latin1').toLowerCase()
  const forbidden = findLegacyRuntimeIdentity(source)
  if (forbidden) {
    throw new Error(
      `Release binary contains forbidden legacy identity ${forbidden}: ${filePath}`,
    )
  }
}

function payloadPath(binDirectory, target) {
  return path.join(binDirectory, target.artifactPath)
}

function macosBinary(binDirectory, target) {
  const container = payloadPath(binDirectory, target)
  return path.join(container, path.basename(container, '.framework'))
}

function parseArchitectures(output) {
  return [...new Set(output.trim().split(/\s+/).filter(Boolean))].sort()
}

function inspectMacos(binDirectory, target) {
  const binary = macosBinary(binDirectory, target)
  const architectures = parseArchitectures(run('lipo', ['-archs', binary]))
  if (architectures.join(',') !== 'arm64,x86_64') {
    throw new Error(
      `${target.id} is not universal: ${architectures.join(', ')}`,
    )
  }
  const loadCommands = run('otool', ['-L', binary])
  const dependencies = loadCommands
    .split(/\r?\n/)
    .map((line) => line.match(/^\s+(\S+)/)?.[1])
    .filter(Boolean)
  for (const dependency of dependencies) {
    if (
      dependency.startsWith('/System/Library/') ||
      dependency.startsWith('/usr/lib/') ||
      dependency === `@rpath/${target.artifactPath}/${path.basename(binary)}`
    ) {
      continue
    }
    throw new Error(`${target.id} has an unshipped dependency: ${dependency}`)
  }
  const symbols = run('nm', ['-gU', binary])
  if (!symbols.includes(entrySymbol)) {
    throw new Error(`${target.id} does not export ${entrySymbol}`)
  }
  scanForLegacyIdentity(binary)
  return { architectures, dependencies, binaries: [binary] }
}

function inspectIos(binDirectory, target) {
  const container = payloadPath(binDirectory, target)
  const plistPath = path.join(container, 'Info.plist')
  const plist = JSON.parse(
    run('plutil', ['-convert', 'json', '-o', '-', plistPath]),
  )
  const libraries = plist.AvailableLibraries
  if (!Array.isArray(libraries) || libraries.length !== 2) {
    throw new Error(`${target.id} XCFramework must contain two library slices`)
  }
  const device = libraries.find(
    (library) =>
      library.SupportedPlatform === 'ios' &&
      library.SupportedPlatformVariant === undefined,
  )
  const simulator = libraries.find(
    (library) => library.SupportedPlatformVariant === 'simulator',
  )
  if (
    !device ||
    [...device.SupportedArchitectures].sort().join(',') !== 'arm64' ||
    !simulator ||
    [...simulator.SupportedArchitectures].sort().join(',') !== 'arm64,x86_64'
  ) {
    throw new Error(
      `${target.id} XCFramework has incomplete device/simulator slices`,
    )
  }
  const binaries = []
  for (const library of libraries) {
    const binary = path.join(
      container,
      library.LibraryIdentifier,
      library.LibraryPath,
    )
    const architectures = parseArchitectures(run('lipo', ['-archs', binary]))
    const expected = [...library.SupportedArchitectures].sort()
    if (architectures.join(',') !== expected.join(',')) {
      throw new Error(
        `${target.id} XCFramework metadata differs from ${binary}`,
      )
    }
    const symbols = run('nm', ['-gU', binary])
    if (!symbols.includes(entrySymbol)) {
      throw new Error(
        `${target.id} slice does not export ${entrySymbol}: ${binary}`,
      )
    }
    if (!symbols.includes(godotCppInterfaceSymbol)) {
      throw new Error(
        `${target.id} slice is not merged with godot-cpp (${godotCppInterfaceSymbol} is missing): ${binary}`,
      )
    }
    scanForLegacyIdentity(binary)
    binaries.push(binary)
  }
  return {
    architectures: ['device:arm64', 'simulator:arm64+x86_64'],
    dependencies: [],
    binaries,
  }
}

function peInspector() {
  return executable(
    [
      process.env.WINDOWS_OBJDUMP,
      'llvm-objdump',
      'x86_64-w64-mingw32-objdump',
      '/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/llvm-objdump',
    ],
    'llvm-objdump or MinGW objdump',
  )
}

function inspectWindows(binDirectory, target) {
  const binary = payloadPath(binDirectory, target)
  const output = run(peInspector(), ['-f', '-p', binary])
  if (!/file format (?:coff|pei)-x86-64/i.test(output)) {
    throw new Error(`${target.id} is not a 64-bit x86 PE DLL`)
  }
  if (!output.includes(entrySymbol)) {
    throw new Error(`${target.id} does not export ${entrySymbol}`)
  }
  const dependencies = [...output.matchAll(/DLL Name:\s*([^\s]+)/g)].map(
    (match) => match[1],
  )
  const systemLibraries = new Set([
    'advapi32.dll',
    'bcrypt.dll',
    'kernel32.dll',
    'msvcrt.dll',
    'ole32.dll',
    'shell32.dll',
    'user32.dll',
    'ws2_32.dll',
  ])
  for (const dependency of dependencies) {
    if (!systemLibraries.has(dependency.toLowerCase())) {
      throw new Error(`${target.id} has an unshipped dependency: ${dependency}`)
    }
  }
  scanForLegacyIdentity(binary)
  return { architectures: ['x86_64'], dependencies, binaries: [binary] }
}

function elfInspector() {
  return executable(
    [
      process.env.READELF,
      process.env.ANDROID_READELF,
      'readelf',
      'greadelf',
      '/opt/homebrew/opt/binutils/bin/greadelf',
      '/usr/local/opt/binutils/bin/greadelf',
      'llvm-readelf',
    ],
    'readelf',
  )
}

function inspectElf(binDirectory, target) {
  const binary = payloadPath(binDirectory, target)
  const inspector = elfInspector()
  const header = run(inspector, ['-h', binary])
  const dynamic = run(inspector, ['-d', binary])
  const symbols = run(inspector, ['-Ws', binary])
  const expectedMachine =
    target.arch === 'arm64' ? /Machine:\s+AArch64/i : /Machine:.*X86-64/i
  if (!/Class:\s+ELF64/i.test(header) || !expectedMachine.test(header)) {
    throw new Error(`${target.id} has an unexpected ELF architecture`)
  }
  if (!symbols.includes(entrySymbol)) {
    throw new Error(`${target.id} does not export ${entrySymbol}`)
  }
  const dependencies = [
    ...dynamic.matchAll(/Shared library:\s*\[([^\]]+)\]/g),
  ].map((match) => match[1])
  const allowed =
    target.platform === 'android'
      ? /^(?:libc|libdl|liblog|libm)\.so$/
      : /^(?:ld-linux-x86-64|libc|libdl|libgcc_s|libm|libpthread|libstdc\+\+)\.so(?:\.\d+)*$/
  for (const dependency of dependencies) {
    if (!allowed.test(dependency)) {
      throw new Error(`${target.id} has an unshipped dependency: ${dependency}`)
    }
  }
  if (target.platform === 'linux' && process.platform === 'linux') {
    const lddOutput = run('ldd', [binary])
    if (/not found/i.test(lddOutput)) {
      throw new Error(`${target.id} has an unresolved dependency\n${lddOutput}`)
    }
  }
  scanForLegacyIdentity(binary)
  return {
    architectures: [target.arch],
    dependencies,
    binaries: [binary],
  }
}

function inspectWeb(binDirectory, target) {
  const binary = payloadPath(binDirectory, target)
  const validator = executable(
    [process.env.WASM_VALIDATE, 'wasm-validate'],
    'wasm-validate',
  )
  const inspector = executable(
    [process.env.WASM_OBJDUMP, 'wasm-objdump'],
    'wasm-objdump',
  )
  run(validator, ['--enable-threads', binary])
  const output = run(inspector, ['-x', binary])
  for (const expected of [
    'file format wasm 0x1',
    'name: "dylink.0"',
    'shared <- env.memory',
    entrySymbol,
  ]) {
    if (!output.includes(expected)) {
      throw new Error(`${target.id} wasm inspection lacks ${expected}`)
    }
  }
  scanForLegacyIdentity(binary)
  return {
    architectures: ['wasm32'],
    dependencies: ['env', 'GOT.func', 'GOT.mem'],
    binaries: [binary],
  }
}

function inspectTarget(binDirectory, target) {
  if (target.platform === 'macos') return inspectMacos(binDirectory, target)
  if (target.platform === 'ios') return inspectIos(binDirectory, target)
  if (target.platform === 'windows') return inspectWindows(binDirectory, target)
  if (target.platform === 'linux' || target.platform === 'android') {
    return inspectElf(binDirectory, target)
  }
  if (target.platform === 'web') return inspectWeb(binDirectory, target)
  throw new Error(`No artifact inspector for ${target.platform}`)
}

function verifyManifestArtifacts(manifest, artifacts) {
  const records = new Map(
    manifest.artifacts.map((artifact) => [artifact.name, artifact]),
  )
  for (const artifact of artifacts) {
    const record = records.get(artifact.name)
    if (
      !record ||
      record.target !== artifact.target ||
      record.size !== artifact.size ||
      record.sha256 !== artifact.sha256
    ) {
      throw new Error(
        `Runtime manifest does not match built artifact ${artifact.name}`,
      )
    }
  }
}

export function verifyReleaseArtifacts(options = {}) {
  const platforms = options.platforms
  const targets = releaseTargetsForPlatforms(platforms)
  const binDirectory = path.resolve(options.binDirectory ?? defaultBinDirectory)
  verifyExtensionLibraryMap(
    fs.readFileSync(options.extensionPath ?? defaultExtensionPath, 'utf-8'),
  )
  const manifest = readJson(options.manifestPath ?? defaultManifestPath)
  if (!isRuntimeManifest(manifest)) {
    throw new Error('Runtime manifest is invalid')
  }
  const artifacts = collectReleaseArtifacts(binDirectory, {
    platforms,
    requireAll: true,
  })
  verifyManifestArtifacts(manifest, artifacts)

  const inspections = targets.map((target) => ({
    target: target.id,
    mode: target.mode,
    artifactPath: target.artifactPath,
    ...inspectTarget(binDirectory, target),
  }))
  const report = {
    schemaVersion: 1,
    packageName: manifest.packageName,
    version: manifest.version,
    gitCommit: manifest.gitCommit,
    godotMinimum: manifest.godotMinimum,
    platforms: [...new Set(targets.map((target) => target.platform))],
    artifacts,
    inspections,
    status: 'pass',
  }
  if (options.reportPath) {
    const reportPath = path.resolve(options.reportPath)
    fs.mkdirSync(path.dirname(reportPath), { recursive: true })
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
  }
  return report
}

function usage() {
  console.log(`Usage: node scripts/verify-release-artifacts.mjs [options]

Options:
  --platform <name>  Verify one required platform; repeatable. Default: all.
  --bin <directory>  Native artifact directory.
  --manifest <file>  Runtime manifest path.
  --extension <file> GDExtension manifest path.
  --report <file>    Write machine-readable verification evidence.
  --help             Show this help.
`)
}

function parseArgs(argv) {
  const options = { platforms: [] }
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === '--help' || argument === '-h') {
      usage()
      process.exit(0)
    }
    if (
      argument === '--platform' ||
      argument === '--bin' ||
      argument === '--manifest' ||
      argument === '--extension' ||
      argument === '--report'
    ) {
      const value = argv[++index]
      if (!value) throw new Error(`${argument} requires a value`)
      if (argument === '--platform') {
        options.platforms.push(...value.split(',').filter(Boolean))
      } else {
        const fields = {
          '--bin': 'binDirectory',
          '--manifest': 'manifestPath',
          '--extension': 'extensionPath',
          '--report': 'reportPath',
        }
        options[fields[argument]] = value
      }
      continue
    }
    throw new Error(`Unknown option: ${argument}`)
  }
  return options
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    const report = verifyReleaseArtifacts(parseArgs(process.argv.slice(2)))
    console.log(
      `[release-verify] PASS ${report.inspections.length} target(s), ${report.artifacts.length} payload file(s)`,
    )
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}
