import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  createDeterministicTarGzip,
  extractTarGzip,
  readTarGzip,
} from '../dist/archive.js'
import { installRuntime, verifyRuntime } from '../dist/index.js'
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

function writeRuntimeSource(sourceDirectory, manifest) {
  const files = [
    'LICENSE',
    'THIRD_PARTY_NOTICES.md',
    'licenses/godot-cpp-MIT.md',
    'licenses/quickjs-ng-MIT.txt',
    'addon/godot-js-runtime/godot_js_runtime.gdextension',
  ]
  for (const relativePath of files) {
    const destination = path.join(sourceDirectory, relativePath)
    fs.mkdirSync(path.dirname(destination), { recursive: true })
    fs.copyFileSync(path.join(packageRoot, relativePath), destination)
  }
  fs.writeFileSync(
    path.join(sourceDirectory, 'addon/godot-js-runtime/runtime-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  )
}

function writeProject(projectDirectory) {
  fs.mkdirSync(projectDirectory, { recursive: true })
  fs.writeFileSync(
    path.join(projectDirectory, 'project.godot'),
    'config_version=5\n',
  )
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

test('platform release archives contain payload checksums, provenance, and notices', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'godot-js-release-'))
  try {
    const binDirectory = path.join(root, 'bin')
    writeFixtureArtifacts(binDirectory, ['linux'])
    const firstOutput = path.join(root, 'first')
    const secondOutput = path.join(root, 'second')
    const options = {
      platforms: ['linux'],
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
    assert.equal(first.manifest.artifacts.length, 2)
    assert.ok(
      first.manifest.artifacts.every((artifact) => artifact.archive !== null),
    )
    assert.ok(
      first.manifest.artifacts.every((artifact) =>
        artifact.url.startsWith('https://example.invalid/releases/v0.0.1/'),
      ),
    )
    const archiveName = first.archives[0].name
    assert.equal(
      sha256(fs.readFileSync(path.join(firstOutput, archiveName))),
      sha256(fs.readFileSync(path.join(secondOutput, archiveName))),
    )

    const entries = readTarGzip(
      fs.readFileSync(path.join(firstOutput, archiveName)),
    )
    const names = entries.map((entry) => entry.path)
    assert.ok(
      entries
        .filter((entry) => entry.path.endsWith('.so'))
        .every((entry) => entry.mode === 0o755),
    )
    assert.ok(
      entries
        .filter((entry) => entry.path.endsWith('/LICENSE'))
        .every((entry) => entry.mode === 0o644),
    )
    for (const suffix of [
      '/LICENSE',
      '/THIRD_PARTY_NOTICES.md',
      '/licenses/godot-cpp-MIT.md',
      '/licenses/quickjs-ng-MIT.txt',
      '/PROVENANCE.json',
      '/SHA256SUMS',
      '/addon/godot-js-runtime/godot_js_runtime.gdextension',
      '/addon/godot-js-runtime/runtime-manifest.json',
    ]) {
      assert.ok(
        names.some((name) => name.endsWith(suffix)),
        suffix,
      )
    }

    const extracted = path.join(root, 'extracted')
    const extractedFiles = extractTarGzip(
      path.join(firstOutput, archiveName),
      extracted,
    )
    assert.ok(extractedFiles.length >= 10)

    const sourceDirectory = path.join(root, 'runtime-source')
    writeRuntimeSource(sourceDirectory, first.manifest)
    const projectDirectory = path.join(root, 'clean project')
    writeProject(projectDirectory)
    const debugTarget = 'linux.template_debug.x86_64'
    const installed = installRuntime({
      projectDirectory,
      sourceDirectory,
      artifactDirectory: firstOutput,
      targets: [debugTarget],
    })
    assert.deepEqual(installed.manifest.targets, [debugTarget])
    assert.equal(verifyRuntime(projectDirectory).ok, true)
    assert.equal(
      fs.existsSync(
        path.join(
          projectDirectory,
          'addons/godot-js-runtime/licenses/quickjs-ng-MIT.txt',
        ),
      ),
      true,
    )

    fs.appendFileSync(path.join(firstOutput, archiveName), 'tampered')
    const damagedProject = path.join(root, 'damaged project')
    writeProject(damagedProject)
    assert.throws(
      () =>
        installRuntime({
          projectDirectory: damagedProject,
          sourceDirectory,
          artifactDirectory: firstOutput,
          targets: [debugTarget],
        }),
      /archive does not match runtime-manifest/,
    )
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})
