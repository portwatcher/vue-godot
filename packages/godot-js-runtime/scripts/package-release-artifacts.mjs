import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createDeterministicTarGzip } from '../dist/archive.js'
import { generateExtensionManifest } from './generate-extension-manifest.mjs'
import {
  collectReleaseArtifacts,
  defaultReleaseBaseUrl,
  releaseArchiveName,
  releasePlatforms,
  releaseTargetsForPlatforms,
} from './platform-matrix.mjs'

const scriptPath = fileURLToPath(import.meta.url)
const packageRoot = path.resolve(path.dirname(scriptPath), '..')
const repoRoot = path.resolve(packageRoot, '../..')
const addonRoot = path.join(packageRoot, 'addon/godot-js-runtime')

function sha256(contents) {
  return createHash('sha256').update(contents).digest('hex')
}

function json(value) {
  return Buffer.from(`${JSON.stringify(value, null, 2)}\n`)
}

function sourceDateEpoch() {
  if (/^\d+$/.test(process.env.SOURCE_DATE_EPOCH ?? '')) {
    return Number(process.env.SOURCE_DATE_EPOCH)
  }
  try {
    return Number(
      execFileSync('git', ['show', '-s', '--format=%ct', 'HEAD'], {
        cwd: repoRoot,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim(),
    )
  } catch {
    return 0
  }
}

function checksums(entries) {
  return Buffer.from(
    `${[...entries]
      .sort((left, right) => left.path.localeCompare(right.path))
      .map((entry) => `${sha256(entry.contents)}  ${entry.path}`)
      .join('\n')}\n`,
  )
}

function releaseFileMode(relativePath) {
  const normalized = relativePath.replaceAll('\\', '/')
  if (/\.(?:dll|so|wasm)$/.test(normalized)) return 0o755
  const frameworkBinary = normalized.match(
    /\/([^/]+)\.framework\/([^/]+)$/,
  )
  if (frameworkBinary && frameworkBinary[1] === frameworkBinary[2]) {
    return 0o755
  }
  return 0o644
}

function fileEntry(archiveRoot, sourcePath, relativePath) {
  const status = fs.lstatSync(sourcePath)
  if (status.isSymbolicLink() || !status.isFile()) {
    throw new Error(
      `Release archive source is not a regular file: ${sourcePath}`,
    )
  }
  return {
    path: `${archiveRoot}/${relativePath}`,
    contents: fs.readFileSync(sourcePath),
    mode: releaseFileMode(relativePath),
  }
}

function requiredNoticeEntries(archiveRoot) {
  const sourceFiles = [
    ['LICENSE', 'LICENSE'],
    ['THIRD_PARTY_NOTICES.md', 'THIRD_PARTY_NOTICES.md'],
    ['licenses/godot-cpp-MIT.md', 'licenses/godot-cpp-MIT.md'],
    ['licenses/quickjs-ng-MIT.txt', 'licenses/quickjs-ng-MIT.txt'],
    [
      'addon/godot-js-runtime/godot_js_runtime.gdextension',
      'addon/godot-js-runtime/godot_js_runtime.gdextension',
    ],
  ]
  return sourceFiles.map(([source, destination]) =>
    fileEntry(archiveRoot, path.join(packageRoot, source), destination),
  )
}

function platformProvenance(manifest, platform, targets, epoch) {
  return {
    schemaVersion: 1,
    product: manifest.runtimeName,
    packageName: manifest.packageName,
    version: manifest.version,
    gitCommit: manifest.gitCommit,
    godotMinimum: manifest.godotMinimum,
    platform,
    targets,
    sourceDateEpoch: epoch,
    sourceRepository: 'https://github.com/portwatcher/vue-godot',
    dependencies: manifest.dependencies,
  }
}

function archiveEntries({
  archiveRoot,
  binDirectory,
  platform,
  artifacts,
  manifest,
  epoch,
}) {
  const entries = requiredNoticeEntries(archiveRoot)
  for (const artifact of artifacts) {
    entries.push(
      fileEntry(
        archiveRoot,
        path.join(binDirectory, ...artifact.name.split('/')),
        `addon/godot-js-runtime/bin/${artifact.name}`,
      ),
    )
  }
  entries.push({
    path: `${archiveRoot}/addon/godot-js-runtime/runtime-manifest.json`,
    contents: json(manifest),
    mode: 0o644,
  })
  entries.push({
    path: `${archiveRoot}/PROVENANCE.json`,
    contents: json(
      platformProvenance(
        manifest,
        platform,
        [...new Set(artifacts.map((artifact) => artifact.target))].sort(),
        epoch,
      ),
    ),
    mode: 0o644,
  })
  entries.push({
    path: `${archiveRoot}/SHA256SUMS`,
    contents: checksums(entries),
    mode: 0o644,
  })
  return entries
}

function releaseProvenance(manifest, platforms, epoch) {
  return {
    schemaVersion: 1,
    product: manifest.runtimeName,
    packageName: manifest.packageName,
    version: manifest.version,
    gitCommit: manifest.gitCommit,
    godotMinimum: manifest.godotMinimum,
    sourceDateEpoch: epoch,
    sourceRepository: 'https://github.com/portwatcher/vue-godot',
    platforms,
    dependencies: manifest.dependencies,
  }
}

export function packageReleaseArtifacts(options = {}) {
  const platforms =
    options.platforms && options.platforms.length > 0
      ? [...new Set(options.platforms)]
      : releasePlatforms.map((platform) => platform.id)
  releaseTargetsForPlatforms(platforms)
  const binDirectory = path.resolve(
    options.binDirectory ?? path.join(addonRoot, 'bin'),
  )
  const initialManifest = generateExtensionManifest({
    gitCommit: options.gitCommit,
    write: false,
  })
  const outputDirectory = path.resolve(
    options.outputDirectory ??
      path.join(
        repoRoot,
        '.artifacts/godot-js-runtime',
        initialManifest.version,
      ),
  )
  const releaseBaseUrl =
    options.releaseBaseUrl ?? defaultReleaseBaseUrl(initialManifest.version)
  const epoch = options.sourceDateEpoch ?? sourceDateEpoch()
  fs.mkdirSync(outputDirectory, { recursive: true })

  const artifacts = collectReleaseArtifacts(binDirectory, {
    platforms,
    requireAll: true,
  })
  const archives = []
  for (const platform of platforms) {
    const platformArtifacts = artifacts.filter(
      (artifact) => artifact.target.split('.')[0] === platform,
    )
    const archiveName = releaseArchiveName(initialManifest.version, platform)
    const archiveRoot = archiveName.slice(0, -'.tar.gz'.length)
    const platformManifest = generateExtensionManifest({
      gitCommit: initialManifest.gitCommit,
      write: false,
      artifacts: platformArtifacts,
    })
    const archive = createDeterministicTarGzip(
      archiveEntries({
        archiveRoot,
        binDirectory,
        platform,
        artifacts: platformArtifacts,
        manifest: platformManifest,
        epoch,
      }),
    )
    const archivePath = path.join(outputDirectory, archiveName)
    fs.writeFileSync(archivePath, archive)
    archives.push({
      name: archiveName,
      platform,
      url: `${releaseBaseUrl}/${archiveName}`,
      size: archive.length,
      sha256: sha256(archive),
      targets: [
        ...new Set(platformArtifacts.map((artifact) => artifact.target)),
      ].sort(),
    })
  }

  const manifest = generateExtensionManifest({
    gitCommit: initialManifest.gitCommit,
    write: options.writePackageManifest === true,
    artifacts,
    archives,
    releaseBaseUrl,
  })
  const manifestPath = path.join(outputDirectory, 'runtime-manifest.json')
  fs.writeFileSync(manifestPath, json(manifest))
  const provenancePath = path.join(outputDirectory, 'PROVENANCE.json')
  fs.writeFileSync(
    provenancePath,
    json(releaseProvenance(manifest, platforms, epoch)),
  )
  const checksumEntries = [
    manifestPath,
    provenancePath,
    ...archives.map((archive) => path.join(outputDirectory, archive.name)),
  ].map((filePath) => ({
    path: path.basename(filePath),
    contents: fs.readFileSync(filePath),
  }))
  fs.writeFileSync(
    path.join(outputDirectory, 'SHA256SUMS'),
    checksums(checksumEntries),
  )

  return {
    outputDirectory,
    manifest,
    archives,
    files: fs.readdirSync(outputDirectory).sort(),
  }
}

function usage() {
  console.log(`Usage: node scripts/package-release-artifacts.mjs [options]

Options:
  --platform <name>          Package one built platform; repeatable. Default: all.
  --output <directory>       Release output directory.
  --base-url <url>           Pinned release URL prefix stored in the manifest.
  --write-package-manifest   Replace the package's manifest with the release manifest.
  --help                     Show this help.
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
    if (argument === '--write-package-manifest') {
      options.writePackageManifest = true
      continue
    }
    if (
      argument === '--platform' ||
      argument === '--output' ||
      argument === '--base-url'
    ) {
      const value = argv[++index]
      if (!value) throw new Error(`${argument} requires a value`)
      if (argument === '--platform') {
        options.platforms.push(...value.split(',').filter(Boolean))
      } else if (argument === '--output') {
        options.outputDirectory = value
      } else {
        options.releaseBaseUrl = value.replace(/\/$/, '')
      }
      continue
    }
    throw new Error(`Unknown option: ${argument}`)
  }
  return options
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    const result = packageReleaseArtifacts(parseArgs(process.argv.slice(2)))
    console.log(
      `[release-package] wrote ${result.archives.length} verified archive(s) to ${result.outputDirectory}`,
    )
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}
