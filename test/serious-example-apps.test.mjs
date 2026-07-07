import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

const repoRoot = process.cwd()
const scriptPath = path.join(repoRoot, 'scripts/check-serious-example-apps.mjs')

function makeTempRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-serious-examples-'))
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, text)
}

function packageJson(requiredDependencies) {
  const dependencies = Object.fromEntries(
    [
      '@vue-godot/cli',
      '@vitejs/plugin-vue',
      'vite',
      '@vue/runtime-core',
      ...requiredDependencies,
    ].map((dependencyName) => [dependencyName, '0.0.0']),
  )

  return `${JSON.stringify(
    {
      scripts: {
        build: 'npm run build:deps && vite build -c vue/vite.config.ts',
        dev: 'npm run build:deps && vite build --watch -c vue/vite.config.ts',
        'build:deps': 'npm run --workspace=@vue-godot/runtime-tscn build',
        'gen:types': 'vue-godot gen-types',
      },
      dependencies,
    },
    null,
    2,
  )}\n`
}

function createFixtureApp(root, appId, requiredDependencies, readmeMarkers) {
  const appRoot = path.join(root, 'apps', appId)
  writeText(path.join(appRoot, 'README.md'), `${readmeMarkers.join('\n')}\n`)
  writeText(
    path.join(appRoot, 'package.json'),
    packageJson(requiredDependencies),
  )
  writeText(path.join(appRoot, 'project.godot'), 'config_version=5\n')
  writeText(path.join(appRoot, 'app.tscn'), '[gd_scene format=3]\n')
  writeText(path.join(appRoot, 'vue/vite.config.ts'), 'export default {}\n')
  writeText(path.join(appRoot, 'vue/src/main.ts'), 'export {}\n')
  writeText(path.join(appRoot, 'vue/src/env.d.ts'), 'export {}\n')
  writeText(path.join(appRoot, 'vue/src/App.vue'), '<template></template>\n')
}

function createCompleteFixtureRoot(root) {
  writeText(
    path.join(root, 'README.md'),
    [
      '| App | Demonstrates |',
      '| --- | --- |',
      '| [apps/native-app-demo](./apps/native-app-demo) | Native app |',
      '| [apps/game-ui-demo](./apps/game-ui-demo) | Game UI |',
      '',
    ].join('\n'),
  )
  writeText(
    path.join(root, 'test/fixture-apps.test.mjs'),
    [
      'const fixtureApps = [',
      "  { id: 'native-app-demo' },",
      "  { id: 'game-ui-demo' },",
      ']',
      '',
    ].join('\n'),
  )
  createFixtureApp(
    root,
    'native-app-demo',
    [
      '@vue-godot/browser',
      '@vue-godot/device',
      '@vue-godot/html',
      '@vue-godot/runtime-tscn',
    ],
    [
      'Production Readiness Coverage',
      'multi-screen routing',
      'form input',
      'network loading',
      'reachability',
      'persistent storage',
      'camera or geolocation',
      'permission',
      'production-profile checks',
      'SafeAreaView',
      'KeyboardAvoidingView',
      'Godot smoke',
      'npm run build',
    ],
  )
  createFixtureApp(
    root,
    'game-ui-demo',
    ['@vue-godot/browser', '@vue-godot/html', '@vue-godot/runtime-tscn'],
    [
      'Production Readiness Coverage',
      'Godot scene',
      'Vue-rendered HUD',
      'controller',
      'keyboard',
      'touch',
      'animation',
      'audio',
      'video',
      'image assets',
      'pause',
      'settings',
      'inventory',
      'focus restoration',
      'Godot smoke',
      'npm run build',
    ],
  )
}

function runChecker(root, ...args) {
  return spawnSync(process.execPath, [scriptPath, '--root', root, ...args], {
    cwd: repoRoot,
    encoding: 'utf-8',
  })
}

test('serious example app checker passes complete fixture apps', () => {
  const root = makeTempRoot()
  createCompleteFixtureRoot(root)

  const result = runChecker(root)

  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /\[serious-examples\] passed/)
})

test('serious example app checker fails missing demo wiring', () => {
  const root = makeTempRoot()
  writeText(path.join(root, 'README.md'), '# Missing demos\n')
  writeText(
    path.join(root, 'test/fixture-apps.test.mjs'),
    'const fixtureApps = []\n',
  )

  const result = runChecker(root)

  assert.equal(result.status, 1)
  assert.match(result.stderr, /apps\/native-app-demo\/README\.md is missing/)
  assert.match(result.stderr, /README\.md examples table must include/)
  assert.match(result.stderr, /fixture registry/)
})

test('serious example app checker can report incomplete fixture without failing', () => {
  const root = makeTempRoot()
  writeText(path.join(root, 'README.md'), '# Missing demos\n')
  writeText(
    path.join(root, 'test/fixture-apps.test.mjs'),
    'const fixtureApps = []\n',
  )

  const result = runChecker(root, '--allow-incomplete')

  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stderr, /\[serious-examples\] incomplete/)
})

test('serious example app checker passes complete current repo with allow-incomplete', () => {
  const result = runChecker(repoRoot, '--allow-incomplete')

  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /\[serious-examples\] passed/)
  assert.equal(result.stderr, '')
})
