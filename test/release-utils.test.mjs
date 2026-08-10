import assert from 'node:assert/strict'
import test from 'node:test'

import {
  isFullCommitSha,
  normalizeCommitSha,
  runtimeReleaseManifestErrors,
  shellQuote,
} from '../scripts/release-utils.mjs'
import {
  defaultReleaseBaseUrl,
  releaseArchiveName,
  releasePlatforms,
  releaseTargets,
} from '../packages/godot-js-runtime/scripts/platform-matrix.mjs'

const commit = '0123456789abcdef0123456789abcdef01234567'

test('normalizeCommitSha accepts optional and full SHA values', () => {
  assert.equal(isFullCommitSha(commit), true)
  assert.equal(isFullCommitSha(commit.toUpperCase()), true)
  assert.equal(isFullCommitSha(` ${commit} `), false)
  assert.equal(isFullCommitSha(commit.slice(0, 12)), false)
  assert.equal(normalizeCommitSha(null), null)
  assert.equal(normalizeCommitSha(` ${commit} `), commit)
  assert.equal(normalizeCommitSha(commit.toUpperCase()), commit.toUpperCase())
})

test('normalizeCommitSha rejects branch names, short SHAs, and blank values', () => {
  assert.throws(
    () => normalizeCommitSha('release-candidate'),
    /--commit must be a full 40-character git commit SHA/,
  )
  assert.throws(
    () => normalizeCommitSha(commit.slice(0, 12), '--expected-commit'),
    /--expected-commit must be a full 40-character git commit SHA/,
  )
  assert.throws(
    () => normalizeCommitSha('   ', '--expected-commit'),
    /--expected-commit requires a value/,
  )
})

test('shellQuote leaves safe tokens readable and quotes shell-sensitive values', () => {
  assert.equal(shellQuote('develop'), 'develop')
  assert.equal(shellQuote('release/candidate-1'), 'release/candidate-1')
  assert.equal(shellQuote('release candidate'), "'release candidate'")
  assert.equal(shellQuote("release'candidate"), "'release'\\''candidate'")
  assert.equal(shellQuote('release;candidate'), "'release;candidate'")
})

test('runtime release manifest validator requires the complete pinned matrix', () => {
  const version = '0.0.1'
  const baseUrl = defaultReleaseBaseUrl(version)
  const archives = releasePlatforms.map((platform) => {
    const name = releaseArchiveName(version, platform.id)
    return {
      name,
      platform: platform.id,
      url: `${baseUrl}/${name}`,
      size: 123,
      sha256: 'a'.repeat(64),
      targets: releaseTargets
        .filter((target) => target.platform === platform.id)
        .map((target) => target.id)
        .sort(),
    }
  })
  const artifacts = releaseTargets.flatMap((target) => {
    const count =
      target.platform === 'ios' ? 3 : target.platform === 'macos' ? 2 : 1
    const archive = archives.find(
      (candidate) => candidate.platform === target.platform,
    )
    return Array.from({ length: count }, (_, index) => ({
      name: `${target.artifactPath}/payload-${String(index)}`,
      target: target.id,
      size: 456,
      sha256: 'b'.repeat(64),
      archive: archive.name,
      url: archive.url,
    }))
  })
  const manifest = {
    schemaVersion: 2,
    runtimeName: 'Godot JavaScript Runtime',
    packageName: 'godot-js-runtime',
    version,
    gitCommit: commit,
    godotMinimum: '4.4',
    dependencies: [
      {
        name: 'QuickJS-ng',
        repository: 'https://github.com/quickjs-ng/quickjs',
        commit,
        license: 'MIT',
      },
      {
        name: 'godot-cpp',
        repository: 'https://github.com/godotengine/godot-cpp',
        commit,
        license: 'MIT',
      },
    ],
    archives,
    artifacts,
  }

  assert.deepEqual(runtimeReleaseManifestErrors(manifest, version), [])
  assert.match(
    runtimeReleaseManifestErrors(
      { ...manifest, archives: archives.slice(1) },
      version,
    ).join('\n'),
    /6 archives|missing the macos archive/,
  )
})
