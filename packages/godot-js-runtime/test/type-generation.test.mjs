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
