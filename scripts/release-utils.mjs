import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)

export const repoRoot = path.resolve(path.dirname(__filename), '..')
export const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

export const releasePackageConfigs = [
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
  '@vue-godot/runtime-tscn',
  '@vue-godot/device',
  '@vue-godot/browser',
  '@vue-godot/html',
  '@vue-godot/cli',
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
