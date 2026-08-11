import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const repositoryRoot = path.resolve(packageRoot, '../..')
const demoRoot = path.join(repositoryRoot, 'apps/godotjs-demo')

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function dependencyNames(packageJson) {
  return [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
    ...Object.keys(packageJson.optionalDependencies ?? {}),
    ...Object.keys(packageJson.peerDependencies ?? {}),
  ]
}

function vueDependencies(packageJson) {
  return dependencyNames(packageJson).filter(
    (name) =>
      name === 'vue' ||
      name.startsWith('@vue/') ||
      name.startsWith('@vue-godot/'),
  )
}

test('standalone package and demo dependency surfaces contain no Vue package', () => {
  const runtimePackage = readJson(path.join(packageRoot, 'package.json'))
  const demoPackage = readJson(path.join(demoRoot, 'package.json'))
  assert.deepEqual(vueDependencies(runtimePackage), [])
  assert.deepEqual(vueDependencies(demoPackage), [])
  assert.equal(runtimePackage.private, true)
  assert.equal(runtimePackage.bin, undefined)
  assert.equal(runtimePackage.exports, undefined)
  assert.deepEqual(demoPackage.dependencies, {})
  assert.equal(demoPackage.private, true)

  for (const name of fs.readdirSync(path.join(packageRoot, 'src'))) {
    if (!name.endsWith('.ts')) continue
    const source = fs.readFileSync(path.join(packageRoot, 'src', name), 'utf-8')
    assert.doesNotMatch(source, /from\s+['"](?:vue|@vue\/|@vue-godot\/)/)
  }
})

test('standalone demo covers the complete non-Vue scripting contract', () => {
  const source = fs.readFileSync(path.join(demoRoot, 'src/player.ts'), 'utf-8')
  const scene = fs.readFileSync(path.join(demoRoot, 'main.tscn'), 'utf-8')
  const tsconfig = readJson(path.join(demoRoot, 'tsconfig.json'))
  const demoPackage = readJson(path.join(demoRoot, 'package.json'))
  const runtimePackage = readJson(path.join(packageRoot, 'package.json'))
  const smoke = fs.readFileSync(
    path.join(packageRoot, 'scripts/smoke-standalone-demo.mjs'),
    'utf-8',
  )

  assert.match(source, /class StandalonePlayer extends Node2D/)
  assert.match(source, /_enter_tree\(\)/)
  assert.match(source, /_ready\(\)/)
  assert.match(source, /_process\(delta: number\)/)
  assert.match(source, /_exit_tree\(\)/)
  assert.match(source, /Input\.get_vector/)
  assert.match(source, /this\.position = new Vector2/)
  assert.match(source, /ResourceLoader\.load/)
  assert.match(source, /Callable\.create/)
  assert.match(source, /this\.emit_signal/)
  assert.match(source, /Promise\.resolve\(\)\.then/)
  assert.match(source, /properties: \{/)
  assert.match(source, /signals: \{/)
  assert.match(source, /PHASE6_STANDALONE_DEMO PASS/)
  assert.match(scene, /res:\/\/dist\/player\.js/)
  assert.equal(tsconfig.compilerOptions.skipLibCheck, false)
  assert.equal(tsconfig.compilerOptions.sourceMap, true)
  assert.equal(runtimePackage.scripts.pretest, 'npm run bootstrap:native')
  assert.equal(demoPackage.scripts['install:runtime'], undefined)
  assert.equal(demoPackage.scripts.typegen, undefined)
  assert.match(smoke, /addons\/godotjs\/godotjs\.gdextension/)
  assert.match(smoke, /GodotJS manual-copy extraction/)
  assert.match(smoke, /--quit-after/)
  assert.doesNotMatch(smoke, /npm pack|installation-manifest/)
})
