import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  createDeterministicZip,
  createDeterministicTarGzip,
  readTarGzip,
} from '../dist/archive.js'
import { packageReleaseArtifacts } from '../scripts/package-release-artifacts.mjs'
import { releaseTargetsForPlatforms } from '../scripts/platform-matrix.mjs'

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)

function sha256(contents) {
  return createHash('sha256').update(contents).digest('hex')
}

function writeFixtureArtifacts(binDirectory, platforms) {
  for (const target of releaseTargetsForPlatforms(platforms)) {
    const container = path.join(binDirectory, target.artifactPath)
    if (target.artifactPath.endsWith('.framework')) {
      fs.mkdirSync(container, { recursive: true })
      fs.writeFileSync(
        path.join(container, path.basename(container, '.framework')),
        `fixture ${target.id}`,
      )
    } else if (target.artifactPath.endsWith('.xcframework')) {
      fs.mkdirSync(container, { recursive: true })
      fs.writeFileSync(
        path.join(container, 'Info.plist'),
        `fixture ${target.id}`,
      )
    } else {
      fs.mkdirSync(path.dirname(container), { recursive: true })
      fs.writeFileSync(container, `fixture ${target.id}`)
    }
  }
}

function unzip(archivePath, destination) {
  const result = spawnSync('unzip', ['-q', archivePath, '-d', destination], {
    encoding: 'utf-8',
  })
  assert.equal(result.status, 0, result.stderr || result.stdout)
}

test('deterministic tar archives round-trip modes and reject unsafe paths', () => {
  const entries = [
    {
      path: 'root/bin/runtime.so',
      contents: Buffer.from('binary'),
      mode: 0o755,
    },
    { path: 'root/LICENSE', contents: Buffer.from('license\n'), mode: 0o644 },
  ]
  const first = createDeterministicTarGzip(entries)
  const second = createDeterministicTarGzip([...entries].reverse())
  assert.deepEqual(first, second)
  assert.deepEqual(
    readTarGzip(first).map((entry) => [
      entry.path,
      entry.mode,
      entry.contents.toString(),
    ]),
    [
      ['root/bin/runtime.so', 0o755, 'binary'],
      ['root/LICENSE', 0o644, 'license\n'],
    ].sort((left, right) => left[0].localeCompare(right[0])),
  )
  assert.throws(
    () =>
      createDeterministicTarGzip([
        { path: '../escape', contents: Buffer.from('bad') },
      ]),
    /unsafe segment/,
  )
})

test('deterministic ZIP output rejects unsafe paths', () => {
  const entries = [
    { path: 'addons/godotjs/b', contents: Buffer.from('b') },
    { path: 'addons/godotjs/a', contents: Buffer.from('a') },
  ]
  assert.deepEqual(
    createDeterministicZip(entries),
    createDeterministicZip([...entries].reverse()),
  )
  assert.throws(
    () =>
      createDeterministicZip([
        { path: '../escape', contents: Buffer.from('bad') },
      ]),
    /unsafe segment/,
  )
})

test('the universal ZIP is a clean manual-copy Godot add-on', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'godot-js-release-'))
  try {
    const binDirectory = path.join(root, 'bin')
    const platforms = ['macos', 'windows', 'linux', 'android', 'ios', 'web']
    writeFixtureArtifacts(binDirectory, platforms)
    const firstOutput = path.join(root, 'first')
    const secondOutput = path.join(root, 'second')
    const options = {
      platforms,
      binDirectory,
      releaseBaseUrl: 'https://example.invalid/releases/v0.0.1',
      sourceDateEpoch: 123,
      gitCommit: '0123456789abcdef0123456789abcdef01234567',
    }
    const first = packageReleaseArtifacts({
      ...options,
      outputDirectory: firstOutput,
    })
    const second = packageReleaseArtifacts({
      ...options,
      outputDirectory: secondOutput,
    })
    assert.equal(first.archives.length, 1)
    assert.equal(first.manifest.schemaVersion, 2)
    assert.equal(first.manifest.archives.length, 1)
    assert.equal(first.manifest.runtimeName, 'GodotJS')
    assert.equal(first.manifest.packageName, 'godotjs')
    assert.equal(first.manifest.artifacts.length, 14)
    assert.ok(
      first.manifest.artifacts.every((artifact) => artifact.archive !== null),
    )
    assert.ok(
      first.manifest.artifacts.every((artifact) =>
        artifact.url.startsWith('https://example.invalid/releases/v0.0.1/'),
      ),
    )
    const archiveName = first.archives[0].name
    assert.equal(archiveName, 'godotjs-v0.0.1.zip')
    assert.equal(
      sha256(fs.readFileSync(path.join(firstOutput, archiveName))),
      sha256(fs.readFileSync(path.join(secondOutput, archiveName))),
    )

    const listing = spawnSync(
      'unzip',
      ['-Z1', path.join(firstOutput, archiveName)],
      { encoding: 'utf-8' },
    )
    assert.equal(listing.status, 0, listing.stderr || listing.stdout)
    const names = listing.stdout.trim().split(/\r?\n/)
    assert.ok(names.every((name) => name.startsWith('addons/godotjs/')))
    for (const name of [
      'addons/godotjs/LICENSE',
      'addons/godotjs/README.md',
      'addons/godotjs/THIRD_PARTY_NOTICES.md',
      'addons/godotjs/licenses/godot-cpp-MIT.md',
      'addons/godotjs/licenses/quickjs-ng-MIT.txt',
      'addons/godotjs/PROVENANCE.json',
      'addons/godotjs/SHA256SUMS',
      'addons/godotjs/godotjs.gdextension',
      'addons/godotjs/manifest.json',
    ]) {
      assert.ok(names.includes(name), name)
    }

    const projectDirectory = path.join(root, 'clean project')
    fs.mkdirSync(projectDirectory)
    unzip(path.join(firstOutput, archiveName), projectDirectory)
    assert.deepEqual(fs.readdirSync(projectDirectory), ['addons'])
    assert.ok(
      fs.existsSync(
        path.join(projectDirectory, 'addons/godotjs/godotjs.gdextension'),
      ),
    )
    assert.equal(
      fs.existsSync(path.join(projectDirectory, 'addons/godot-js-runtime')),
      false,
    )
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test('the native build workspace cannot be published to npm', () => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf-8'),
  )
  assert.equal(packageJson.private, true)
  assert.equal(packageJson.name, '@vue-godot/internal-godotjs')
  assert.equal(packageJson.bin, undefined)
  assert.equal(packageJson.publishConfig, undefined)
})
