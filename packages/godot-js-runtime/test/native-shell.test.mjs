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
  assert.equal(plan.buildTests, false)
  assert.equal(plan.runTests, false)
  assert.deepEqual(plan.sanitizers, [])
  assert.deepEqual(plan.sconsArguments.slice(-3), [
    'platform=linux',
    'target=template_debug',
    'arch=x86_64',
  ])

  const testPlan = resolveNativeBuildPlan({ ...options, runTests: true })
  assert.equal(testPlan.buildTests, true)
  assert.equal(testPlan.runTests, true)
  assert.ok(testPlan.testArtifact.endsWith('native/bin/godot_js_runtime_tests'))
  assert.ok(!testPlan.sconsArguments.includes('build_tests=yes'))

  const sanitizerPlan = resolveNativeBuildPlan({
    ...options,
    runTests: true,
    sanitizers: ['address', 'undefined'],
  })
  assert.deepEqual(sanitizerPlan.sanitizers, ['address', 'undefined'])
})

test('native build embeds pinned QuickJS-ng and exposes host tests', () => {
  const sconstruct = fs.readFileSync(
    path.join(packageRoot, 'native/SConstruct'),
    'utf-8',
  )
  for (const source of ['dtoa.c', 'libregexp.c', 'libunicode.c', 'quickjs.c']) {
    assert.ok(sconstruct.includes(`quickjs_dir.File("${source}")`))
  }
  assert.match(sconstruct, /GODOT_JS_RUNTIME_BUILD_TESTS/)
  assert.match(sconstruct, /tests\/runtime_host_tests\.cpp/)
  assert.match(sconstruct, /GODOT_JS_RUNTIME_SANITIZERS/)
  assert.match(sconstruct, /-fno-omit-frame-pointer/)
})

test('stock fixture enforces module, teardown, and editor play gates', () => {
  const fixtureRoot = path.join(
    packageRoot,
    'native/tests/fixtures/stock-shell',
  )
  const project = fs.readFileSync(
    path.join(fixtureRoot, 'project.godot'),
    'utf-8',
  )
  const editorPlugin = fs.readFileSync(
    path.join(fixtureRoot, 'addons/editor-play-loop/plugin.gd'),
    'utf-8',
  )
  const smoke = fs.readFileSync(
    path.join(packageRoot, 'scripts/smoke-stock-godot.mjs'),
    'utf-8',
  )
  const bindingFixture = fs.readFileSync(
    path.join(fixtureRoot, 'main.mjs'),
    'utf-8',
  )
  const variantFixture = fs.readFileSync(
    path.join(fixtureRoot, 'variant-roundtrip.mjs'),
    'utf-8',
  )
  const commonJsFixture = fs.readFileSync(
    path.join(fixtureRoot, 'binding.cjs'),
    'utf-8',
  )
  assert.match(project, /run\/main_run_args="--headless"/)
  assert.match(editorPlugin, /PHASE2_EDITOR_PLAY_LOOP PASS/)
  assert.match(editorPlugin, /get_live_runtime_count\(\) != 0/)
  assert.match(editorPlugin, /get_live_wrapper_count\(\) != 0/)
  assert.match(editorPlugin, /get_live_callback_root_count\(\) != 0/)
  assert.match(smoke, /balanced QuickJS start\/stop cycles/)
  assert.match(smoke, /EDITOR_PLAY_START/)
  assert.match(smoke, /PHASE3_VARIANT_MATRIX PASS 39 types/)
  assert.match(smoke, /PHASE3_COMMONJS_BINDING PASS/)
  assert.match(bindingFixture, /index < 2048/)
  assert.match(bindingFixture, /collectGarbage\(\)/)
  assert.match(bindingFixture, /stress signal disconnect/)
  assert.match(bindingFixture, /ProjectSettings\.settings_changed\.connect/)
  assert.match(bindingFixture, /PHASE3_EXPECTED_CALLBACK_EXCEPTION/)
  assert.match(
    variantFixture,
    /observedTypes\.size === Variant\.Type\.TYPE_MAX/,
  )
  assert.match(variantFixture, /depth < 32/)
  assert.match(commonJsFixture, /require\('godot'\)/)
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
          !includePath.includes('/') ||
          includePath.startsWith('godot_cpp/') ||
          includePath.startsWith('godot_js_runtime/'),
        `${path.relative(packageRoot, filePath)} has an unexpected include ${includePath}`,
      )
    }
  }
})
