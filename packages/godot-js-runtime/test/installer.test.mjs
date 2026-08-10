import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  addRuntimeTarget,
  generateProjectTypes,
  installRuntime,
  resolveHostDebugTarget,
  uninstallRuntime,
  verifyRuntime,
} from '../dist/index.js'

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const cliPath = path.join(packageRoot, 'dist/cli.js')

function sha256(contents) {
  return createHash('sha256').update(contents).digest('hex')
}

function writeFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, contents)
}

function createProject(root, name = 'project') {
  const project = path.join(root, name)
  writeFile(
    path.join(project, 'project.godot'),
    'config_version=5\n\n[application]\nconfig/name="installer-test"\n',
  )
  return project
}

function createRuntimeSource(root, artifacts) {
  const source = path.join(root, 'runtime-source')
  const addon = path.join(source, 'addon/godot-js-runtime')
  writeFile(
    path.join(addon, 'godot_js_runtime.gdextension'),
    '[configuration]\nentry_symbol="fixture"\n',
  )
  writeFile(path.join(source, 'LICENSE'), 'fixture license\n')
  writeFile(path.join(source, 'THIRD_PARTY_NOTICES.md'), 'fixture notices\n')
  const manifestArtifacts = artifacts.map((artifact) => {
    const contents = Buffer.from(artifact.contents)
    writeFile(path.join(addon, 'bin', artifact.name), contents)
    return {
      name: artifact.name,
      target: artifact.target,
      size: contents.length,
      sha256: sha256(contents),
      archive: null,
      url: null,
    }
  })
  const manifest = {
    schemaVersion: 2,
    runtimeName: 'Godot JavaScript Runtime',
    packageName: 'godot-js-runtime',
    version: '1.2.3-test',
    gitCommit: '0123456789abcdef',
    godotMinimum: '4.4',
    dependencies: [],
    archives: [],
    artifacts: manifestArtifacts,
  }
  writeFile(
    path.join(addon, 'runtime-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  )
  return { source, addon, manifest }
}

function createFixture() {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'godot-js-runtime-installer test-'),
  )
  const linuxTarget = 'linux.template_debug.x86_64'
  const windowsTarget = 'windows.template_release.x86_64'
  const runtime = createRuntimeSource(root, [
    {
      name: 'libgodot_js_runtime.linux.template_debug.x86_64.so',
      target: linuxTarget,
      contents: 'linux binary fixture',
    },
    {
      name: 'libgodot_js_runtime.windows.template_release.x86_64.dll',
      target: windowsTarget,
      contents: 'windows binary fixture',
    },
  ])
  return {
    root,
    project: createProject(root),
    runtime,
    linuxTarget,
    windowsTarget,
  }
}

test('install, add-target, verify, reinstall, and manifest-scoped uninstall', () => {
  const fixture = createFixture()
  try {
    const registrationPath = path.join(
      fixture.project,
      '.godot/extension_list.cfg',
    )
    writeFile(registrationPath, 'res://addons/other/other.gdextension\n')
    const installed = installRuntime({
      projectDirectory: fixture.project,
      sourceDirectory: fixture.runtime.source,
      targets: [fixture.linuxTarget],
    })
    assert.deepEqual(installed.manifest.targets, [fixture.linuxTarget])
    assert.equal(installed.copiedFiles, 5)
    assert.equal(installed.unchangedFiles, 0)
    assert.equal(verifyRuntime(fixture.project).ok, true)
    assert.match(
      fs.readFileSync(registrationPath, 'utf-8'),
      /res:\/\/addons\/godot-js-runtime\/godot_js_runtime\.gdextension/,
    )

    const installationManifestPath = path.join(
      fixture.project,
      'addons/godot-js-runtime/installation-manifest.json',
    )
    const firstManifest = fs.readFileSync(installationManifestPath)
    const reinstalled = installRuntime({
      projectDirectory: fixture.project,
      sourceDirectory: fixture.runtime.source,
      targets: [fixture.linuxTarget],
    })
    assert.equal(reinstalled.copiedFiles, 0)
    assert.equal(reinstalled.unchangedFiles, 5)
    assert.deepEqual(fs.readFileSync(installationManifestPath), firstManifest)

    const augmented = addRuntimeTarget({
      projectDirectory: fixture.project,
      sourceDirectory: fixture.runtime.source,
      targets: [fixture.windowsTarget],
    })
    assert.deepEqual(augmented.manifest.targets, [
      fixture.linuxTarget,
      fixture.windowsTarget,
    ])
    assert.equal(verifyRuntime(fixture.project).ok, true)

    const windowsArtifact = path.join(
      fixture.project,
      'addons/godot-js-runtime/bin/libgodot_js_runtime.windows.template_release.x86_64.dll',
    )
    fs.appendFileSync(windowsArtifact, 'tampered')
    const damaged = verifyRuntime(fixture.project)
    assert.equal(damaged.ok, false)
    assert.match(damaged.errors.join('\n'), /size differs/)

    addRuntimeTarget({
      projectDirectory: fixture.project,
      sourceDirectory: fixture.runtime.source,
      targets: [fixture.windowsTarget],
    })
    const sentinel = path.join(
      fixture.project,
      'addons/godot-js-runtime/user-notes.txt',
    )
    writeFile(sentinel, 'not owned by the installer\n')
    const uninstalled = uninstallRuntime(fixture.project)
    assert.equal(fs.existsSync(sentinel), true)
    assert.ok(uninstalled.preservedFiles.includes('user-notes.txt'))
    assert.equal(uninstalled.removedRegistrations, 1)
    assert.equal(
      fs.readFileSync(registrationPath, 'utf-8'),
      'res://addons/other/other.gdextension\n',
    )
    assert.equal(fs.existsSync(installationManifestPath), false)
    assert.equal(
      fs.existsSync(
        path.join(
          fixture.project,
          'addons/godot-js-runtime/godot_js_runtime.gdextension',
        ),
      ),
      false,
    )
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true })
  }
})

test('installer refuses unowned collisions unless the exact path is forced', () => {
  const fixture = createFixture()
  try {
    const collision = path.join(
      fixture.project,
      'addons/godot-js-runtime/godot_js_runtime.gdextension',
    )
    writeFile(collision, 'user-owned collision\n')
    assert.throws(
      () =>
        installRuntime({
          projectDirectory: fixture.project,
          sourceDirectory: fixture.runtime.source,
          targets: [fixture.linuxTarget],
        }),
      /not owned by an installation manifest/,
    )
    const result = installRuntime({
      projectDirectory: fixture.project,
      sourceDirectory: fixture.runtime.source,
      targets: [fixture.linuxTarget],
      force: true,
    })
    assert.equal(result.manifest.version, '1.2.3-test')
    assert.equal(verifyRuntime(fixture.project).ok, true)
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true })
  }
})

test('installer validates every destination before copying any file', () => {
  const fixture = createFixture()
  try {
    const artifactName = fixture.runtime.manifest.artifacts.find(
      (artifact) => artifact.target === fixture.linuxTarget,
    ).name
    const lateCollision = path.join(
      fixture.project,
      'addons/godot-js-runtime/bin',
      artifactName,
    )
    writeFile(lateCollision, 'user-owned late collision\n')
    assert.throws(
      () =>
        installRuntime({
          projectDirectory: fixture.project,
          sourceDirectory: fixture.runtime.source,
          targets: [fixture.linuxTarget],
        }),
      /not owned by an installation manifest/,
    )
    assert.equal(
      fs.existsSync(
        path.join(
          fixture.project,
          'addons/godot-js-runtime/godot_js_runtime.gdextension',
        ),
      ),
      false,
    )
    assert.equal(
      fs.readFileSync(lateCollision, 'utf-8'),
      'user-owned late collision\n',
    )
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true })
  }
})

test('uninstall validates every owned path before removing any file', () => {
  const fixture = createFixture()
  try {
    const installed = installRuntime({
      projectDirectory: fixture.project,
      sourceDirectory: fixture.runtime.source,
      targets: [fixture.linuxTarget],
    })
    const invalidOwnedPath = path.join(
      fixture.project,
      installed.manifest.files.at(-1).path,
    )
    fs.rmSync(invalidOwnedPath)
    fs.mkdirSync(invalidOwnedPath)
    assert.throws(
      () => uninstallRuntime(fixture.project),
      /Manifest-owned runtime path is not a regular file/,
    )
    assert.equal(
      fs.existsSync(
        path.join(
          fixture.project,
          'addons/godot-js-runtime/godot_js_runtime.gdextension',
        ),
      ),
      true,
    )
    assert.equal(
      fs.existsSync(
        path.join(
          fixture.project,
          'addons/godot-js-runtime/installation-manifest.json',
        ),
      ),
      true,
    )
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true })
  }
})

test('artifact paths cannot escape the addon', () => {
  const fixture = createFixture()
  try {
    const manifestPath = path.join(
      fixture.runtime.addon,
      'runtime-manifest.json',
    )
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    manifest.artifacts[0].name = '../escape.so'
    writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
    assert.throws(
      () =>
        installRuntime({
          projectDirectory: fixture.project,
          sourceDirectory: fixture.runtime.source,
          targets: [fixture.linuxTarget],
        }),
      /escapes its allowed directory/,
    )
    assert.equal(fs.existsSync(path.join(fixture.project, 'escape.so')), false)
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true })
  }
})

test('host target selection is deterministic', () => {
  const fixture = createFixture()
  try {
    assert.equal(
      resolveHostDebugTarget(fixture.runtime.manifest, 'linux', 'x64'),
      fixture.linuxTarget,
    )
    assert.throws(
      () => resolveHostDebugTarget(fixture.runtime.manifest, 'darwin', 'arm64'),
      /found 0/,
    )
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true })
  }
})

test('typegen copies packaged declarations into a Godot project idempotently', () => {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'godot-js-runtime-typegen project-'),
  )
  try {
    const project = createProject(root)
    const first = generateProjectTypes({ projectDirectory: project })
    assert.equal(first.source, 'packaged')
    assert.deepEqual(first.files, [
      'godot.d.ts',
      'godot-js.d.ts',
      'godot-jsb.d.ts',
      'index.d.ts',
      'manifest.json',
    ])
    const manifestPath = path.join(project, 'typings/manifest.json')
    const firstManifest = fs.readFileSync(manifestPath)
    generateProjectTypes({ projectDirectory: project })
    assert.deepEqual(fs.readFileSync(manifestPath), firstManifest)
    assert.throws(
      () =>
        generateProjectTypes({
          projectDirectory: project,
          outputDirectory: '../outside',
        }),
      /inside the Godot project/,
    )
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test(
  'typegen refuses a symbolic-link declaration destination',
  { skip: process.platform === 'win32' },
  () => {
    const root = fs.mkdtempSync(
      path.join(os.tmpdir(), 'godot-js-runtime-typegen symlink-'),
    )
    try {
      const project = createProject(root)
      const outside = path.join(root, 'outside.d.ts')
      writeFile(outside, 'user-owned\n')
      const destination = path.join(project, 'typings/index.d.ts')
      fs.mkdirSync(path.dirname(destination), { recursive: true })
      fs.symlinkSync(outside, destination)
      assert.throws(
        () => generateProjectTypes({ projectDirectory: project }),
        /Type declaration destination is not a regular file/,
      )
      assert.equal(fs.readFileSync(outside, 'utf-8'), 'user-owned\n')
    } finally {
      fs.rmSync(root, { recursive: true, force: true })
    }
  },
)

test('standalone CLI exposes automation-friendly target and install commands', () => {
  const fixture = createFixture()
  try {
    const targets = spawnSync(
      process.execPath,
      [cliPath, 'targets', '--source', fixture.runtime.source, '--json'],
      { encoding: 'utf-8' },
    )
    assert.equal(targets.status, 0, targets.stderr)
    assert.deepEqual(JSON.parse(targets.stdout).targets, [
      fixture.linuxTarget,
      fixture.windowsTarget,
    ])

    const install = spawnSync(
      process.execPath,
      [
        cliPath,
        'install',
        '--project',
        fixture.project,
        '--source',
        fixture.runtime.source,
        '--target',
        fixture.linuxTarget,
        '--json',
      ],
      { encoding: 'utf-8' },
    )
    assert.equal(install.status, 0, install.stderr)
    assert.equal(
      JSON.parse(install.stdout).manifest.targets[0],
      fixture.linuxTarget,
    )

    const verify = spawnSync(
      process.execPath,
      [cliPath, 'verify', '--project', fixture.project, '--json'],
      { encoding: 'utf-8' },
    )
    assert.equal(verify.status, 0, verify.stderr)
    assert.equal(JSON.parse(verify.stdout).ok, true)

    const invalid = spawnSync(
      process.execPath,
      [cliPath, 'verify', '--project', fixture.project, '--force'],
      { encoding: 'utf-8' },
    )
    assert.equal(invalid.status, 1)
    assert.match(invalid.stderr, /--force is not valid for verify/)
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true })
  }
})
