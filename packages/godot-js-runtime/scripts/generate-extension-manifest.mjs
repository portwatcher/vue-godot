import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import {
  collectReleaseArtifacts,
  defaultReleaseBaseUrl,
} from './platform-matrix.mjs'

const scriptPath = fileURLToPath(import.meta.url)
const packageRoot = path.resolve(path.dirname(scriptPath), '..')
const repoRoot = path.resolve(packageRoot, '../..')
const addonRoot = path.join(packageRoot, 'addon/godotjs')
const templatePath = path.join(
  packageRoot,
  'native/godotjs.gdextension.in',
)

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function resolveGitCommit() {
  if (process.env.GODOTJS_GIT_COMMIT) {
    return process.env.GODOTJS_GIT_COMMIT
  }
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: repoRoot,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return 'unknown'
  }
}

export function generateExtensionManifest(options = {}) {
  const packageJson = readJson(path.join(packageRoot, 'package.json'))
  const dependencyLock = readJson(
    path.join(packageRoot, 'native/deps.lock.json'),
  )
  const extensionTemplate = fs.readFileSync(templatePath, 'utf-8')
  const godotMinimum = '4.4'
  const extension = extensionTemplate.replaceAll(
    '{{GODOT_MINIMUM}}',
    godotMinimum,
  )
  const artifacts =
    options.artifacts ??
    (options.includeArtifacts === true
      ? collectReleaseArtifacts(path.join(addonRoot, 'bin'), {
          platforms: options.platforms,
          requireAll: options.requireAllArtifacts === true,
        })
      : [])
  const archives = options.archives ?? []
  const releaseBaseUrl =
    options.releaseBaseUrl ?? defaultReleaseBaseUrl(packageJson.version)
  const archiveNames = new Map(
    archives.map((archive) => [archive.platform, archive.name]),
  )
  const releaseArtifacts = artifacts.map((artifact) => {
    if (artifact.archive !== null || artifact.url !== null) {
      return artifact
    }
    const platform = artifact.target.split('.')[0]
    const archive = archiveNames.get(platform) ?? archiveNames.get('universal')
    return archive
      ? {
          ...artifact,
          archive,
          url: `${releaseBaseUrl}/${archive}`,
        }
      : artifact
  })
  const manifest = {
    schemaVersion: 2,
    runtimeName: 'GodotJS',
    packageName: 'godotjs',
    version: packageJson.version,
    gitCommit:
      options.gitCommit ??
      (packageJson.version.includes('development')
        ? 'development'
        : resolveGitCommit()),
    godotMinimum,
    dependencies: Object.values(dependencyLock.dependencies)
      .filter((dependency) => dependency.kind === 'source-archive')
      .map((dependency) => ({
        name: dependency.name,
        repository: dependency.repository,
        commit: dependency.commit,
        license: dependency.license,
      }))
      .sort((left, right) => left.name.localeCompare(right.name)),
    archives,
    artifacts: releaseArtifacts,
  }

  if (options.write !== false) {
    fs.mkdirSync(addonRoot, { recursive: true })
    fs.writeFileSync(
      path.join(addonRoot, 'godotjs.gdextension'),
      extension,
    )
    fs.writeFileSync(
      path.join(addonRoot, 'manifest.json'),
      `${JSON.stringify(manifest, null, 2)}\n`,
    )
  }
  return manifest
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  const argumentsList = process.argv.slice(2)
  const unknown = argumentsList.filter(
    (argument) => argument !== '--include-artifacts',
  )
  if (unknown.length > 0) {
    throw new Error(`Unknown option: ${unknown[0]}`)
  }
  const manifest = generateExtensionManifest({
    includeArtifacts: argumentsList.includes('--include-artifacts'),
  })
  console.log(
    `[manifest] wrote ${manifest.artifacts.length} artifact record(s) for ${manifest.version}`,
  )
}
