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

test('stock fixture enforces binding, script-language, reload, and editor gates', () => {
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
  const attachedFixture = fs.readFileSync(
    path.join(fixtureRoot, 'attached.mjs'),
    'utf-8',
  )
  const contractController = fs.readFileSync(
    path.join(fixtureRoot, 'script-contract-controller.gd'),
    'utf-8',
  )
  const reloadController = fs.readFileSync(
    path.join(fixtureRoot, 'reload-controller.gd'),
    'utf-8',
  )
  assert.match(project, /run\/main_run_args="--headless"/)
  assert.match(project, /\[godot_js_runtime\]/)
  assert.match(project, /runtime\/memory_limit_mb=96/)
  assert.match(project, /maximum_promise_jobs_per_frame=12000/)
  assert.match(editorPlugin, /PHASE4_EDITOR_PLACEHOLDER PASS/)
  assert.match(editorPlugin, /PHASE4_EDITOR_PLAY_LOOP PASS/)
  assert.match(editorPlugin, /get_live_runtime_count\(\) != 1/)
  assert.match(editorPlugin, /get_live_wrapper_count\(\) != baseline_wrappers/)
  assert.match(
    editorPlugin,
    /get_live_callback_root_count\(\) != baseline_callbacks/,
  )
  assert.match(smoke, /attached scripts, reloads, and Promise jobs/)
  assert.match(smoke, /EDITOR_PLAY_START/)
  assert.match(smoke, /PHASE3_VARIANT_MATRIX PASS 39 types/)
  assert.match(smoke, /PHASE3_COMMONJS_BINDING PASS/)
  assert.match(smoke, /PHASE4_LANGUAGE_CONTRACT PASS/)
  assert.match(smoke, /PHASE4_DEFERRED_RELOAD PASS/)
  assert.match(smoke, /PHASE4_IN_MEMORY_RELOAD PASS/)
  assert.match(smoke, /STALE_RELOAD_PROMISE_EXECUTED/)
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
  assert.match(attachedFixture, /export default defineScript/)
  assert.match(attachedFixture, /_enter_tree\(\)/)
  assert.match(attachedFixture, /_notification\(\)/)
  assert.match(attachedFixture, /_physics_process\(\)/)
  assert.match(attachedFixture, /_input\(event\)/)
  assert.match(attachedFixture, /signals: \{/)
  assert.match(attachedFixture, /rpc: \{/)
  assert.match(contractController, /ResourceSaver\.save/)
  assert.match(contractController, /invalid-export\.mjs/)
  assert.match(contractController, /incompatible-base\.mjs/)
  assert.match(reloadController, /script\.reload\(true\)/)
  assert.match(reloadController, /script\.reload\(false\)/)
  assert.match(reloadController, /script\.source_code = in_memory_source/)
  assert.match(reloadController, /PHASE4_PREDELETE PASS/)
})

test('script-language implementation registers public contracts and runtime settings', () => {
  const registerTypes = fs.readFileSync(
    path.join(packageRoot, 'native/src/register_types.cpp'),
    'utf-8',
  )
  const language = fs.readFileSync(
    path.join(packageRoot, 'native/src/scripting/javascript_language.cpp'),
    'utf-8',
  )
  const projectSettings = fs.readFileSync(
    path.join(packageRoot, 'native/src/runtime/runtime_project_settings.cpp'),
    'utf-8',
  )
  const scriptInstance = fs.readFileSync(
    path.join(
      packageRoot,
      'native/include/godot_js_runtime/scripting/javascript_script_instance.hpp',
    ),
    'utf-8',
  )

  assert.match(registerTypes, /register_runtime_project_settings\(\)/)
  assert.match(registerTypes, /register_script_language/)
  assert.match(registerTypes, /add_resource_format_loader/)
  assert.match(registerTypes, /add_resource_format_saver/)
  assert.match(language, /_get_recognized_extensions\(\)/)
  assert.match(language, /_reload_scripts/)
  assert.match(projectSettings, /MEMORY_LIMIT_MB, 128, 16, 4096/)
  assert.match(projectSettings, /MAXIMUM_STACK_SIZE_KB, 1024, 256, 16384/)
  assert.match(
    projectSettings,
    /EXECUTION_TIMEOUT_MILLISECONDS, 5000, 0, 600000/,
  )
  assert.match(
    projectSettings,
    /MAXIMUM_PROMISE_JOBS_PER_FRAME, 10000, 1, 1000000/,
  )
  assert.match(scriptInstance, /GDExtensionScriptInstanceInfo3/)
  assert.match(scriptInstance, /godot::Ref<JavaScriptScript>/)
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
