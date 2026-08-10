import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const libraryStem = 'libgodot_js_runtime'
const forbiddenLegacyIdentities = Object.freeze([
  ['godot', 'js'].join(''),
  ['ialex', '32x'].join(''),
  ['jsb', 'editor', 'bundle'].join('.'),
  ['jsb', 'runtime', 'bundle'].join('.'),
])

export function findLegacyRuntimeIdentity(value) {
  const normalized = String(value).toLowerCase()
  return forbiddenLegacyIdentities.find((identity) =>
    normalized.includes(identity),
  )
}

export const releasePlatforms = Object.freeze([
  Object.freeze({ id: 'macos', archiveLabel: 'macos-universal' }),
  Object.freeze({ id: 'windows', archiveLabel: 'windows-x86_64' }),
  Object.freeze({ id: 'linux', archiveLabel: 'linux-x86_64' }),
  Object.freeze({ id: 'android', archiveLabel: 'android' }),
  Object.freeze({ id: 'ios', archiveLabel: 'ios-xcframework' }),
  Object.freeze({ id: 'web', archiveLabel: 'web-wasm32' }),
])

function target({
  platform,
  mode,
  arch,
  artifactPath,
  godotFeatureKey,
  builds,
}) {
  return Object.freeze({
    id: `${platform}.${mode}.${arch}`,
    platform,
    mode,
    arch,
    artifactPath,
    godotFeatureKey,
    builds: Object.freeze(builds.map((build) => Object.freeze(build))),
  })
}

const modes = Object.freeze([
  Object.freeze({ mode: 'template_debug', feature: 'debug' }),
  Object.freeze({ mode: 'template_release', feature: 'release' }),
])

const targets = []
for (const { mode, feature } of modes) {
  const macosBase = `${libraryStem}.macos.${mode}.universal`
  targets.push(
    target({
      platform: 'macos',
      mode,
      arch: 'universal',
      artifactPath: `${macosBase}.framework`,
      godotFeatureKey: `macos.${feature}`,
      builds: [{ platform: 'macos', arch: 'universal', target: mode }],
    }),
  )

  targets.push(
    target({
      platform: 'windows',
      mode,
      arch: 'x86_64',
      artifactPath: `${libraryStem}.windows.${mode}.x86_64.dll`,
      godotFeatureKey: `windows.${feature}.x86_64`,
      builds: [{ platform: 'windows', arch: 'x86_64', target: mode }],
    }),
  )

  targets.push(
    target({
      platform: 'linux',
      mode,
      arch: 'x86_64',
      artifactPath: `${libraryStem}.linux.${mode}.x86_64.so`,
      godotFeatureKey: `linux.${feature}.x86_64`,
      builds: [{ platform: 'linux', arch: 'x86_64', target: mode }],
    }),
  )

  for (const arch of ['arm64', 'x86_64']) {
    targets.push(
      target({
        platform: 'android',
        mode,
        arch,
        artifactPath: `${libraryStem}.android.${mode}.${arch}.so`,
        godotFeatureKey: `android.${feature}.${arch}`,
        builds: [
          {
            platform: 'android',
            arch,
            target: mode,
            androidApiLevel: 21,
          },
        ],
      }),
    )
  }

  targets.push(
    target({
      platform: 'ios',
      mode,
      arch: 'universal',
      artifactPath: `${libraryStem}.ios.${mode}.xcframework`,
      godotFeatureKey: `ios.${feature}`,
      builds: [
        { platform: 'ios', arch: 'arm64', target: mode },
        {
          platform: 'ios',
          arch: 'universal',
          target: mode,
          iosSimulator: true,
        },
      ],
    }),
  )

  targets.push(
    target({
      platform: 'web',
      mode,
      arch: 'wasm32',
      artifactPath: `${libraryStem}.web.${mode}.wasm32.wasm`,
      godotFeatureKey: `web.${feature}.threads.wasm32`,
      builds: [
        {
          platform: 'web',
          arch: 'wasm32',
          target: mode,
          threads: true,
        },
      ],
    }),
  )
}

export const releaseTargets = Object.freeze(targets)

export function releaseTargetById(targetId) {
  return releaseTargets.find((candidate) => candidate.id === targetId)
}

export function releaseTargetsForPlatforms(platforms = undefined) {
  if (!platforms || platforms.length === 0) {
    return releaseTargets
  }
  const selected = new Set(platforms)
  const unknown = [...selected].filter(
    (platform) =>
      !releasePlatforms.some((candidate) => candidate.id === platform),
  )
  if (unknown.length > 0) {
    throw new Error(`Unknown release platform(s): ${unknown.sort().join(', ')}`)
  }
  return releaseTargets.filter((candidate) => selected.has(candidate.platform))
}

function normalizeArtifactName(name) {
  if (typeof name !== 'string' || name.length === 0) {
    throw new Error('Runtime artifact name must be a non-empty string')
  }
  const normalized = name.replaceAll('\\', '/')
  if (
    normalized.startsWith('/') ||
    normalized
      .split('/')
      .some((part) => part === '' || part === '..' || part === '.')
  ) {
    throw new Error(`Unsafe runtime artifact name: ${name}`)
  }
  return normalized
}

export function releaseTargetForArtifactName(name) {
  const normalized = normalizeArtifactName(name)
  const matches = releaseTargets.filter(
    (candidate) =>
      normalized === candidate.artifactPath ||
      normalized.startsWith(`${candidate.artifactPath}/`),
  )
  if (matches.length !== 1) {
    throw new Error(
      `Expected one release target for artifact ${normalized}; found ${matches.length}`,
    )
  }
  return matches[0]
}

function sha256File(filePath) {
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')
}

function regularFiles(containerPath) {
  const status = fs.lstatSync(containerPath)
  if (status.isSymbolicLink()) {
    throw new Error(
      `Release artifact cannot be a symbolic link: ${containerPath}`,
    )
  }
  if (status.isFile()) {
    return [containerPath]
  }
  if (!status.isDirectory()) {
    throw new Error(
      `Release artifact is not a file or directory: ${containerPath}`,
    )
  }

  const files = []
  const visit = (directory) => {
    for (const entry of fs
      .readdirSync(directory, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name))) {
      const entryPath = path.join(directory, entry.name)
      if (entry.isSymbolicLink()) {
        throw new Error(
          `Release artifact cannot contain a symbolic link: ${entryPath}`,
        )
      }
      if (entry.isDirectory()) {
        visit(entryPath)
      } else if (entry.isFile()) {
        files.push(entryPath)
      } else {
        throw new Error(
          `Release artifact contains an unsupported entry: ${entryPath}`,
        )
      }
    }
  }
  visit(containerPath)
  if (files.length === 0) {
    throw new Error(`Release artifact directory is empty: ${containerPath}`)
  }
  return files
}

export function collectReleaseArtifacts(
  binDirectory,
  { platforms = undefined, requireAll = true } = {},
) {
  const selectedTargets = releaseTargetsForPlatforms(platforms)
  const artifacts = []
  for (const releaseTarget of selectedTargets) {
    const containerPath = path.join(binDirectory, releaseTarget.artifactPath)
    if (!fs.existsSync(containerPath)) {
      if (requireAll) {
        throw new Error(
          `Missing release artifact for ${releaseTarget.id}: ${containerPath}`,
        )
      }
      continue
    }
    for (const filePath of regularFiles(containerPath)) {
      const name = path
        .relative(binDirectory, filePath)
        .split(path.sep)
        .join('/')
      artifacts.push({
        name,
        target: releaseTarget.id,
        size: fs.statSync(filePath).size,
        sha256: sha256File(filePath),
        archive: null,
        url: null,
      })
    }
  }
  return artifacts.sort((left, right) => left.name.localeCompare(right.name))
}

export function releaseArchiveName(version, platform) {
  const releasePlatform = releasePlatforms.find(
    (candidate) => candidate.id === platform,
  )
  if (!releasePlatform) {
    throw new Error(`Unknown release platform: ${platform}`)
  }
  return `godot-js-runtime-v${version}-${releasePlatform.archiveLabel}.tar.gz`
}

export function defaultReleaseBaseUrl(version) {
  return `https://github.com/portwatcher/vue-godot/releases/download/godot-js-runtime-v${version}`
}
