import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const repositoryRoot = path.resolve(packageRoot, '../..')
const exportsManifest = JSON.parse(
  fs.readFileSync(
    path.join(packageRoot, 'native/generated/binding_exports.json'),
    'utf-8',
  ),
)

function repositoryFiles() {
  const result = spawnSync(
    'git',
    ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
    {
      cwd: repositoryRoot,
      encoding: 'buffer',
    },
  )
  assert.equal(result.status, 0, result.stderr.toString('utf-8'))
  return result.stdout.toString('utf-8').split('\0').filter(Boolean)
}

function runtimeGodotImports() {
  const sourceFile = /\.(?:[cm]?[jt]s|tsx|vue)$/
  const sourceRoot =
    /^(?:apps\/[^/]+\/vue\/src|packages\/[^/]+\/(?:src|native\/tests\/fixtures)|scripts|test\/fixtures)\//
  const imports = new Set()
  for (const filePath of repositoryFiles()) {
    if (!sourceRoot.test(filePath) || !sourceFile.test(filePath)) continue
    const source = fs.readFileSync(path.join(repositoryRoot, filePath), 'utf-8')
    const importPattern =
      /^\s*import\s+(type\s+)?\{([^}]*)\}\s+from\s+['"]godot['"]/gm
    for (const match of source.matchAll(importPattern)) {
      if (match[1]) continue
      for (const imported of match[2].split(',')) {
        const name = imported
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .trim()
          .replace(/^type\s+/, '')
          .split(/\s+as\s+/)[0]
        if (name && !imported.trim().startsWith('type ')) imports.add(name)
      }
    }
  }
  return [...imports].sort()
}

test('generated binding manifest is pinned to the complete Godot 4.4.1 API', () => {
  assert.equal(exportsManifest.schemaVersion, 1)
  assert.equal(exportsManifest.godotVersion, '4.4.1')
  assert.equal(
    exportsManifest.godotCppCommit,
    'e4b7c25e721ce3435a029087e3917a30aa73f06b',
  )
  assert.match(exportsManifest.extensionApiSha256, /^[0-9a-f]{64}$/)
  assert.deepEqual(exportsManifest.counts, {
    classes: 952,
    builtins: 38,
    singletons: 37,
    utilities: 114,
    globalEnums: 22,
    methods: 16324,
    properties: 3843,
    signals: 466,
    exports: 1120,
  })
})

test('generated C++ metadata records the same source fingerprint', () => {
  const header = fs.readFileSync(
    path.join(
      packageRoot,
      'native/include/godot_js_runtime/generated/binding_metadata.gen.hpp',
    ),
    'utf-8',
  )
  const source = fs.readFileSync(
    path.join(packageRoot, 'native/src/generated/binding_metadata.gen.cpp'),
    'utf-8',
  )
  for (const generated of [header, source]) {
    assert.ok(generated.includes(exportsManifest.godotCppCommit))
    assert.ok(generated.includes(exportsManifest.extensionApiSha256))
    assert.ok(generated.includes('Godot 4.4.1'))
  }
})

test('godot module metadata exports every runtime import used by the repository', () => {
  const exportNames = new Set(
    exportsManifest.exports.map((entry) => entry.name),
  )
  const importedNames = runtimeGodotImports()
  assert.ok(importedNames.length > 20)
  assert.deepEqual(
    importedNames.filter((name) => !exportNames.has(name)),
    [],
  )
})
