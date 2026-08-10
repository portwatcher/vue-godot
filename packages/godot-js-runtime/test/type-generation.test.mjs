import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const generatorPath = path.join(packageRoot, 'scripts/generate-types.mjs')
const apiPath = path.join(
  packageRoot,
  'native/third_party/godot-cpp/gdextension/extension_api.json',
)
const typingsDirectory = path.join(packageRoot, 'typings')

function runGenerator(arguments_) {
  return spawnSync(process.execPath, [generatorPath, ...arguments_], {
    cwd: packageRoot,
    encoding: 'utf-8',
  })
}

test('checked-in declarations match the pinned stock Godot API', () => {
  const result = runGenerator(['--check'])
  assert.equal(result.status, 0, result.stderr || result.stdout)

  const manifest = JSON.parse(
    fs.readFileSync(path.join(typingsDirectory, 'manifest.json'), 'utf-8'),
  )
  assert.deepEqual(manifest.counts, {
    builtins: 38,
    classes: 952,
    globalEnums: 22,
    nativeStructures: 14,
    singletons: 37,
    utilityFunctions: 114,
  })
  assert.equal(
    manifest.apiSha256,
    '1136ad8c676034a0d9ac15ec55f1f4c79f300fd645f45a08a129c0254ca95d51',
  )
})

test('generation from an explicit stock API dump is deterministic', () => {
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'godot-js-runtime-types-test-'),
  )
  try {
    const result = runGenerator([
      '--api',
      apiPath,
      '--out-dir',
      temporaryDirectory,
    ])
    assert.equal(result.status, 0, result.stderr || result.stdout)
    for (const name of [
      'godot.d.ts',
      'godot-js.d.ts',
      'godot-jsb.d.ts',
      'index.d.ts',
      'manifest.json',
    ]) {
      assert.deepEqual(
        fs.readFileSync(path.join(temporaryDirectory, name)),
        fs.readFileSync(path.join(typingsDirectory, name)),
        `${name} changed between equivalent stock API inputs`,
      )
    }
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true })
  }
})

test('newer stock APIs generate typed dictionaries and opaque callbacks safely', () => {
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'godot-js-runtime-current-types-test-'),
  )
  try {
    const api = JSON.parse(fs.readFileSync(apiPath, 'utf-8'))
    api.classes.push({
      name: 'CurrentApiTypeFixture',
      is_instantiable: true,
      inherits: 'RefCounted',
      properties: [
        {
          name: 'color_map',
          type: 'typeddictionary::Color;Color',
          getter: 'get_color_map',
          setter: 'set_color_map',
        },
        {
          name: 'type_names',
          type: 'typeddictionary::int;String',
          getter: 'get_type_names',
          setter: 'set_type_names',
        },
      ],
      methods: [
        {
          name: 'load_from_function',
          arguments: [
            {
              name: 'init_func',
              type: 'const GDExtensionInitializationFunction*',
            },
          ],
          return_value: { type: 'void' },
        },
      ],
    })
    const fixtureApiPath = path.join(temporaryDirectory, 'extension_api.json')
    const outputDirectory = path.join(temporaryDirectory, 'typings')
    fs.writeFileSync(fixtureApiPath, JSON.stringify(api))

    const result = runGenerator([
      '--api',
      fixtureApiPath,
      '--out-dir',
      outputDirectory,
    ])
    assert.equal(result.status, 0, result.stderr || result.stdout)
    const declarationPath = path.join(outputDirectory, 'godot.d.ts')
    const declaration = fs.readFileSync(declarationPath, 'utf-8')
    assert.match(declaration, /color_map: Dictionary<Color, Color>/)
    assert.match(declaration, /type_names: Dictionary<Integer, string>/)
    assert.match(declaration, /init_func: NativePointer/)
    assert.doesNotMatch(declaration, /typeddictionary/)
    assert.doesNotMatch(declaration, /GDExtensionInitializationFunction/)

    const typeScriptPath = path.resolve(
      packageRoot,
      '../../node_modules/typescript/bin/tsc',
    )
    const typeCheck = spawnSync(
      process.execPath,
      [
        typeScriptPath,
        '--noEmit',
        '--strict',
        '--skipLibCheck',
        'false',
        '--target',
        'ES2022',
        '--module',
        'ESNext',
        '--moduleResolution',
        'Bundler',
        '--lib',
        'ES2022,DOM',
        declarationPath,
      ],
      { cwd: packageRoot, encoding: 'utf-8' },
    )
    assert.equal(typeCheck.status, 0, typeCheck.stderr || typeCheck.stdout)
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true })
  }
})

test('godot, godot-js, and compatibility declarations expose the migration contract', () => {
  const godot = fs.readFileSync(
    path.join(typingsDirectory, 'godot.d.ts'),
    'utf-8',
  )
  const helpers = fs.readFileSync(
    path.join(typingsDirectory, 'godot-js.d.ts'),
    'utf-8',
  )
  const compatibility = fs.readFileSync(
    path.join(typingsDirectory, 'godot-jsb.d.ts'),
    'utf-8',
  )

  assert.match(godot, /export class Node2D extends CanvasItem/)
  assert.match(godot, /static get_vector\(/)
  assert.match(godot, /readonly pressed: Signal</)
  assert.match(godot, /as_promise\(\): Promise</)
  assert.match(godot, /export namespace Variant/)
  assert.match(godot, /export enum PropertyUsageFlags/)
  assert.match(godot, /@see https:\/\/docs\.godotengine\.org\/en\/4\.4/)
  assert.match(helpers, /export function defineScript/)
  assert.match(helpers, /export function runtimeFeatures/)
  assert.match(compatibility, /Compatibility is intentionally limited/)
  assert.match(compatibility, /export function callable/)
  assert.doesNotMatch(godot, /\bas any\b/)
})
