import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { isRuntimeManifest } from '../dist/index.js'
import { generateExtensionManifest } from '../scripts/generate-extension-manifest.mjs'
import { resolveNativeBuildPlan } from '../scripts/build-native.mjs'

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)

function walkFiles(directory) {
  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkFiles(entryPath))
    } else if (entry.isFile()) {
      files.push(entryPath)
    }
  }
  return files
}

test('extension and artifact manifests preserve canonical identities', () => {
  const manifest = generateExtensionManifest({
    gitCommit: 'test-commit',
    write: false,
  })
  assert.ok(isRuntimeManifest(manifest))
  assert.equal(manifest.gitCommit, 'test-commit')
  assert.equal(manifest.artifacts.length, 0)

  const extension = fs.readFileSync(
    path.join(
      packageRoot,
      'addon/godot-js-runtime/godot_js_runtime.gdextension',
    ),
    'utf-8',
  )
  assert.match(extension, /entry_symbol = "godot_js_runtime_library_init"/)
  assert.match(extension, /compatibility_minimum = "4\.4"/)
  assert.match(extension, /linux\.debug\.x86_64/)
  assert.match(extension, /macos\.debug/)
})

test('native build plan is deterministic and targets the pinned source tree', () => {
  const options = {
    platform: 'linux',
    arch: 'x86_64',
    target: 'template_debug',
    jobs: 3,
  }
  assert.deepEqual(
    resolveNativeBuildPlan(options),
    resolveNativeBuildPlan(options),
  )
  const plan = resolveNativeBuildPlan(options)
  assert.deepEqual(plan.sconsArguments.slice(-3), [
    'platform=linux',
    'target=template_debug',
    'arch=x86_64',
  ])
})

test('native version constants match the npm package', () => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf-8'),
  )
  const versionHeader = fs.readFileSync(
    path.join(packageRoot, 'native/include/godot_js_runtime/version.hpp'),
    'utf-8',
  )
  assert.ok(versionHeader.includes(`VERSION[] = "${packageJson.version}"`))
  assert.ok(versionHeader.includes('MINIMUM_GODOT_VERSION[] = "4.4"'))
})

test('runtime native source uses only public GDExtension and godot-cpp headers', () => {
  const sourceFiles = [
    ...walkFiles(path.join(packageRoot, 'native/include')),
    ...walkFiles(path.join(packageRoot, 'native/src')),
  ]
  assert.ok(sourceFiles.length > 0)
  for (const filePath of sourceFiles) {
    const source = fs.readFileSync(filePath, 'utf-8')
    const includes = [...source.matchAll(/^#include\s+[<"]([^>"]+)[>"]/gm)].map(
      (match) => match[1],
    )
    for (const includePath of includes) {
      assert.doesNotMatch(
        includePath,
        /^(?:core|editor|main|modules|scene|servers)\//,
        `${path.relative(packageRoot, filePath)} includes private Godot header ${includePath}`,
      )
      assert.ok(
        includePath === 'gdextension_interface.h' ||
          includePath.startsWith('godot_cpp/') ||
          includePath.startsWith('godot_js_runtime/') ||
          ['atomic', 'cstdint'].includes(includePath),
        `${path.relative(packageRoot, filePath)} has an unexpected include ${includePath}`,
      )
    }
  }
})
