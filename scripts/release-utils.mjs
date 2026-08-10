import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  defaultReleaseBaseUrl,
  findLegacyRuntimeIdentity,
  releaseArchiveName,
  releasePlatforms,
  releaseTargets,
} from '../packages/godot-js-runtime/scripts/platform-matrix.mjs'

const __filename = fileURLToPath(import.meta.url)

export const repoRoot = path.resolve(path.dirname(__filename), '..')
export const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

export const releasePackageConfigs = [
  {
    name: 'godot-js-runtime',
    dir: 'packages/godot-js-runtime',
    expectedFiles: [
      'dist/index.js',
      'dist/index.d.ts',
      'dist/cli.js',
      'addon/godot-js-runtime/godot_js_runtime.gdextension',
      'addon/godot-js-runtime/runtime-manifest.json',
      'typings/godot.d.ts',
      'typings/godot-js.d.ts',
      'THIRD_PARTY_NOTICES.md',
      'licenses/godot-cpp-MIT.md',
      'licenses/quickjs-ng-MIT.txt',
      'scripts/package-release-artifacts.mjs',
      'scripts/smoke-platform-exports.mjs',
      'scripts/verify-release-artifacts.mjs',
    ],
  },
  {
    name: '@vue-godot/runtime-tscn',
    dir: 'packages/runtime-tscn',
    expectedFiles: ['dist/index.js', 'dist/index.d.ts'],
  },
  {
    name: '@vue-godot/cli',
    dir: 'packages/cli',
    expectedFiles: [
      'dist/index.js',
      'dist/index.d.ts',
      'dist/cli.js',
      'templates/docs/production.md',
      'templates/gen/.gdignore',
      'templates/scripts/check-export-settings.mjs',
      'templates/vue/.gdignore',
      'templates/vue/vite.config.ts',
      'templates/godot/project.godot',
    ],
  },
  {
    name: 'vue-godot',
    dir: 'packages/vue-godot',
    expectedFiles: ['dist/index.js', 'dist/index.d.ts', 'dist/cli.js'],
  },
  {
    name: '@vue-godot/browser',
    dir: 'packages/browser',
    expectedFiles: [
      'dist/body.js',
      'dist/body.d.ts',
      'dist/index.js',
      'dist/index.d.ts',
      'dist/request.js',
      'dist/request.d.ts',
    ],
  },
  {
    name: '@vue-godot/device',
    dir: 'packages/device',
    expectedFiles: ['dist/index.js', 'dist/index.d.ts'],
  },
  {
    name: '@vue-godot/html',
    dir: 'packages/html',
    expectedFiles: ['dist/index.js', 'dist/index.d.ts', 'volar-plugin.cjs'],
  },
]

const publishOrder = [
  'godot-js-runtime',
  '@vue-godot/runtime-tscn',
  '@vue-godot/device',
  '@vue-godot/browser',
  '@vue-godot/html',
  '@vue-godot/cli',
  'vue-godot',
]

export function releasePackageConfigsInPublishOrder() {
  const configsByName = new Map(
    releasePackageConfigs.map((config) => [config.name, config]),
  )

  return publishOrder.map((packageName) => {
    const config = configsByName.get(packageName)
    if (!config) {
      throw new Error(`Missing release package config for ${packageName}`)
    }
    return config
  })
}

export function currentReleasePackageVersions() {
  return Object.fromEntries(
    releasePackageConfigs.map((config) => [
      config.name,
      readJson(path.join(config.dir, 'package.json')).version,
    ]),
  )
}

export function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf-8'))
}

export function uniqueStrings(values) {
  if (!Array.isArray(values)) {
    return []
  }

  return [
    ...new Set(
      values
        .filter((value) => typeof value === 'string')
        .map((value) => value.trim())
        .filter((value) => value.length > 0),
    ),
  ]
}

export function duplicateStrings(values) {
  if (!Array.isArray(values)) {
    return []
  }

  const seen = new Set()
  const duplicates = new Set()
  for (const value of values) {
    if (typeof value !== 'string') {
      continue
    }
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      continue
    }
    if (seen.has(trimmed)) {
      duplicates.add(trimmed)
    }
    seen.add(trimmed)
  }
  return [...duplicates]
}

export function intersectStrings(firstValues, secondValues) {
  const second = new Set(uniqueStrings(secondValues))
  return uniqueStrings(firstValues).filter((value) => second.has(value))
}

export function run(command, commandArgs, options = {}) {
  return spawnSync(command, commandArgs, {
    cwd: options.cwd ?? repoRoot,
    env: options.env ?? process.env,
    encoding: 'utf-8',
    stdio: options.stdio ?? 'pipe',
  })
}

export function isFullCommitSha(value) {
  return typeof value === 'string' && /^[0-9a-f]{40}$/i.test(value)
}

export function normalizeCommitSha(value, optionName = '--commit') {
  if (value == null) {
    return null
  }
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${optionName} requires a value`)
  }

  const commit = value.trim()
  if (!isFullCommitSha(commit)) {
    throw new Error(`${optionName} must be a full 40-character git commit SHA`)
  }
  return commit
}

export function shellQuote(value) {
  const text = String(value)
  if (/^[A-Za-z0-9_/:=.,@%+-]+$/.test(text)) {
    return text
  }

  return `'${text.replaceAll("'", "'\\''")}'`
}

export function formatCommandFailure(command, commandArgs, result) {
  const rendered = [command, ...commandArgs].join(' ')
  return [
    `Command failed (${result.status ?? result.signal ?? 'unknown'}): ${rendered}`,
    result.stdout,
    result.stderr,
  ]
    .filter(Boolean)
    .join('\n')
}

export function compareVersions(left, right) {
  const leftParts = left.split('.').map((part) => Number(part))
  const rightParts = right.split('.').map((part) => Number(part))
  for (
    let index = 0;
    index < Math.max(leftParts.length, rightParts.length);
    index++
  ) {
    const leftValue = leftParts[index] ?? 0
    const rightValue = rightParts[index] ?? 0
    if (leftValue > rightValue) return 1
    if (leftValue < rightValue) return -1
  }
  return 0
}

export function expectedRange(version) {
  return `^${version}`
}

export function parseNpmJson(stdout, label) {
  try {
    return JSON.parse(stdout)
  } catch {
    throw new Error(`${label}: npm did not return valid JSON\n${stdout}`)
  }
}

export function isTrustedPublishingEnvironment() {
  return Boolean(
    process.env.GITHUB_ACTIONS === 'true' &&
    process.env.ACTIONS_ID_TOKEN_REQUEST_URL &&
    process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN,
  )
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function sameStrings(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  )
}

export function runtimeReleaseManifestErrors(manifest, packageVersion) {
  const errors = []
  if (!isRecord(manifest)) {
    return ['runtime manifest must be a JSON object']
  }

  const expectedBaseUrl = defaultReleaseBaseUrl(packageVersion)
  if (manifest.schemaVersion !== 2) {
    errors.push('runtime manifest schemaVersion must be 2')
  }
  if (manifest.packageName !== 'godot-js-runtime') {
    errors.push('runtime manifest packageName must be godot-js-runtime')
  }
  if (manifest.version !== packageVersion) {
    errors.push(
      `runtime manifest version must be ${packageVersion}, found ${String(manifest.version)}`,
    )
  }
  if (!isFullCommitSha(manifest.gitCommit)) {
    errors.push('runtime manifest gitCommit must be a full commit SHA')
  }
  if (manifest.godotMinimum !== '4.4') {
    errors.push('runtime manifest godotMinimum must be 4.4')
  }

  const dependencyNames = Array.isArray(manifest.dependencies)
    ? manifest.dependencies.map((dependency) => dependency?.name).sort()
    : []
  if (!sameStrings(dependencyNames, ['QuickJS-ng', 'godot-cpp'])) {
    errors.push('runtime manifest must include QuickJS-ng and godot-cpp')
  }
  for (const dependency of Array.isArray(manifest.dependencies)
    ? manifest.dependencies
    : []) {
    if (
      !isRecord(dependency) ||
      typeof dependency.repository !== 'string' ||
      !dependency.repository.startsWith('https://') ||
      !isFullCommitSha(dependency.commit) ||
      dependency.license !== 'MIT'
    ) {
      errors.push(
        `runtime dependency metadata is invalid for ${String(dependency?.name)}`,
      )
    }
  }

  const archives = Array.isArray(manifest.archives) ? manifest.archives : []
  if (archives.length !== releasePlatforms.length) {
    errors.push(
      `runtime manifest must contain ${String(releasePlatforms.length)} archives, found ${String(archives.length)}`,
    )
  }
  const archivesByPlatform = new Map()
  for (const archive of archives) {
    if (!isRecord(archive) || typeof archive.platform !== 'string') {
      errors.push('runtime manifest contains an invalid archive entry')
      continue
    }
    if (archivesByPlatform.has(archive.platform)) {
      errors.push(
        `runtime manifest repeats archive platform ${archive.platform}`,
      )
      continue
    }
    archivesByPlatform.set(archive.platform, archive)
  }
  for (const platform of releasePlatforms) {
    const archive = archivesByPlatform.get(platform.id)
    const expectedName = releaseArchiveName(packageVersion, platform.id)
    const expectedUrl = `${expectedBaseUrl}/${expectedName}`
    const expectedTargets = releaseTargets
      .filter((target) => target.platform === platform.id)
      .map((target) => target.id)
      .sort()
    if (!archive) {
      errors.push(`runtime manifest is missing the ${platform.id} archive`)
      continue
    }
    if (archive.name !== expectedName || archive.url !== expectedUrl) {
      errors.push(`runtime ${platform.id} archive name or URL is not pinned`)
    }
    if (
      !Number.isSafeInteger(archive.size) ||
      archive.size <= 0 ||
      typeof archive.sha256 !== 'string' ||
      !/^[a-f0-9]{64}$/.test(archive.sha256)
    ) {
      errors.push(`runtime ${platform.id} archive size or checksum is invalid`)
    }
    if (!sameStrings(archive.targets, expectedTargets)) {
      errors.push(`runtime ${platform.id} archive targets are incomplete`)
    }
  }

  const artifacts = Array.isArray(manifest.artifacts) ? manifest.artifacts : []
  if (artifacts.length !== 20) {
    errors.push(
      `runtime manifest must contain 20 payload files, found ${String(artifacts.length)}`,
    )
  }
  const expectedTargetIds = releaseTargets.map((target) => target.id).sort()
  const actualTargetIds = [
    ...new Set(artifacts.map((artifact) => artifact?.target)),
  ].sort()
  if (!sameStrings(actualTargetIds, expectedTargetIds)) {
    errors.push('runtime manifest does not cover the exact 14-target matrix')
  }
  const artifactNames = new Set()
  for (const artifact of artifacts) {
    if (
      !isRecord(artifact) ||
      typeof artifact.name !== 'string' ||
      typeof artifact.target !== 'string'
    ) {
      errors.push('runtime manifest contains an invalid artifact entry')
      continue
    }
    if (artifactNames.has(artifact.name)) {
      errors.push(`runtime manifest repeats artifact ${artifact.name}`)
    }
    artifactNames.add(artifact.name)
    const target = releaseTargets.find(
      (candidate) => candidate.id === artifact.target,
    )
    const archive = target ? archivesByPlatform.get(target.platform) : undefined
    if (
      !target ||
      !archive ||
      artifact.archive !== archive.name ||
      artifact.url !== archive.url
    ) {
      errors.push(
        `runtime artifact ${artifact.name} has invalid archive metadata`,
      )
    }
    if (
      !Number.isSafeInteger(artifact.size) ||
      artifact.size <= 0 ||
      typeof artifact.sha256 !== 'string' ||
      !/^[a-f0-9]{64}$/.test(artifact.sha256)
    ) {
      errors.push(
        `runtime artifact ${artifact.name} size or checksum is invalid`,
      )
    }
    if (findLegacyRuntimeIdentity(artifact.name)) {
      errors.push(
        `runtime artifact ${artifact.name} uses a legacy product name`,
      )
    }
  }

  return errors
}
