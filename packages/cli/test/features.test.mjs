import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { resolveCreateProfile } from '../dist/create.js'
import {
  copyTemplateDir,
  integrate,
  newPackageJson,
  resolveProjectFeatures,
} from '../dist/integrate.js'

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-cli-features-'))
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

async function withMutedConsole(callback) {
  const originalLog = console.log
  try {
    console.log = () => {}
    return await callback()
  } finally {
    console.log = originalLog
  }
}

test('newPackageJson supports device-only projects', () => {
  const pkg = newPackageJson('device-app', { device: true })
  assert.equal(pkg.dependencies['godot-js-runtime'], '^0.0.1')
  assert.equal(
    pkg.scripts['setup:runtime'],
    'npm run install:runtime && npm run gen:types',
  )
  assert.equal(
    pkg.scripts.postinstall,
    'npm run setup:runtime && npm run build',
  )
  assert.equal(pkg.dependencies['@vue-godot/device'], '^0.0.1')
  assert.equal(pkg.dependencies['@vue-godot/browser'], undefined)
  assert.equal(pkg.dependencies['@vue-godot/html'], undefined)
})

test('newPackageJson keeps legacy html boolean behavior', () => {
  const pkg = newPackageJson('html-app', true)
  assert.equal(pkg.dependencies['@vue-godot/browser'], '^0.0.1')
  assert.equal(pkg.dependencies['@vue-godot/device'], '^0.0.1')
  assert.equal(pkg.dependencies['@vue-godot/html'], '^0.0.1')
})

test('newPackageJson adds router starter dependencies', () => {
  const pkg = newPackageJson('router-app', { router: true })
  assert.equal(pkg.dependencies['@vue-godot/browser'], '^0.0.1')
  assert.equal(pkg.dependencies['@vue-godot/device'], '^0.0.1')
  assert.equal(pkg.dependencies['@vue-godot/html'], '^0.0.1')
  assert.equal(pkg.dependencies['vue-router'], '~4.5.1')
})

test('project feature flags imply html starter mode', () => {
  assert.deepEqual(resolveProjectFeatures({ storage: true }), {
    html: true,
    device: true,
    router: false,
    storage: true,
    network: false,
    deviceApi: false,
  })
})

test('create app profile enables html and device support', () => {
  assert.deepEqual(resolveCreateProfile({ profile: 'app' }), {
    html: true,
    device: true,
    router: false,
    storage: false,
    network: false,
    deviceApi: false,
    htmlStarter: 'app',
  })
})

test('create game-ui profile enables html browser support', () => {
  assert.deepEqual(resolveCreateProfile({ profile: 'game-ui' }), {
    html: true,
    device: true,
    router: false,
    storage: false,
    network: false,
    deviceApi: false,
    htmlStarter: 'game-ui',
  })
})

test('create game-ui profile accepts explicit device support', () => {
  assert.deepEqual(resolveCreateProfile({ profile: 'game-ui', device: true }), {
    html: true,
    device: true,
    router: false,
    storage: false,
    network: false,
    deviceApi: false,
    htmlStarter: 'game-ui',
  })
})

test('create profiles preserve starter feature flags', () => {
  assert.deepEqual(resolveCreateProfile({ profile: 'app', router: true }), {
    html: true,
    device: true,
    router: true,
    storage: false,
    network: false,
    deviceApi: false,
    htmlStarter: 'app',
  })
})

test('template copying excludes generated project state', async () => {
  const tempDir = createTempDir()
  const sourceDir = path.join(tempDir, 'source')
  const outputDir = path.join(tempDir, 'output')

  try {
    fs.mkdirSync(path.join(sourceDir, '.godot'), { recursive: true })
    fs.mkdirSync(path.join(sourceDir, 'node_modules'), { recursive: true })
    fs.mkdirSync(path.join(sourceDir, 'src'), { recursive: true })
    fs.writeFileSync(path.join(sourceDir, '.godot', 'uid_cache.bin'), 'cache')
    fs.writeFileSync(
      path.join(sourceDir, 'node_modules', 'runtime.js'),
      'cache',
    )
    fs.writeFileSync(path.join(sourceDir, 'scene.tscn.uid'), 'cache')
    fs.writeFileSync(path.join(sourceDir, 'src', 'main.ts'), '__NAME__')

    await withMutedConsole(() =>
      copyTemplateDir(sourceDir, outputDir, { __NAME__: 'generated' }, tempDir),
    )

    assert.equal(fs.existsSync(path.join(outputDir, '.godot')), false)
    assert.equal(fs.existsSync(path.join(outputDir, 'node_modules')), false)
    assert.equal(fs.existsSync(path.join(outputDir, 'scene.tscn.uid')), false)
    assert.equal(
      fs.readFileSync(path.join(outputDir, 'src', 'main.ts'), 'utf-8'),
      'generated',
    )
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})

test('integrate adds @vue-godot/device without enabling html mode', async () => {
  const tempDir = createTempDir()
  try {
    await withMutedConsole(() =>
      integrate({ targetDir: tempDir, force: true, device: true }),
    )
    const pkg = readJson(path.join(tempDir, 'package.json'))

    assert.equal(pkg.dependencies['godot-js-runtime'], '^0.0.1')
    assert.equal(
      pkg.scripts['install:runtime'],
      'godot-js-runtime install --project .',
    )
    assert.equal(pkg.scripts['gen:types'], 'vue-godot gen-types')
    assert.ok(fs.existsSync(path.join(tempDir, 'typings/.gdignore')))
    assert.ok(fs.existsSync(path.join(tempDir, 'node_modules/.gdignore')))
    assert.equal(pkg.dependencies['@vue-godot/device'], '^0.0.1')
    assert.equal(pkg.dependencies['@vue-godot/browser'], undefined)
    assert.equal(pkg.dependencies['@vue-godot/html'], undefined)
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})

test('integrate writes router and helper starter files', async () => {
  const tempDir = createTempDir()
  try {
    await withMutedConsole(() =>
      integrate({
        targetDir: tempDir,
        force: true,
        router: true,
        storage: true,
        network: true,
        deviceApi: true,
      }),
    )
    const pkg = readJson(path.join(tempDir, 'package.json'))
    const mainTs = fs.readFileSync(
      path.join(tempDir, 'vue/src/main.ts'),
      'utf-8',
    )
    const appVue = fs.readFileSync(
      path.join(tempDir, 'vue/src/App.vue'),
      'utf-8',
    )
    const appCss = fs.readFileSync(
      path.join(tempDir, 'vue/src/app.css'),
      'utf-8',
    )
    const viteConfig = fs.readFileSync(
      path.join(tempDir, 'vue/vite.config.ts'),
      'utf-8',
    )

    assert.equal(pkg.dependencies['vue-router'], '~4.5.1')
    assert.match(viteConfig, /vueGodotHtmlCss\(\)/)
    assert.match(
      viteConfig,
      /import \{ commonJsBundleBanner \} from 'godot-js-runtime'/,
    )
    assert.match(viteConfig, /banner: commonJsBundleBanner/)
    assert.match(mainTs, /import '\.\/app\.css'/)
    assert.match(mainTs, /app\.use\(router\)/)
    assert.match(appCss, /\.starter-card/)
    assert.ok(appVue.includes('<router-view></router-view>'))
    assert.ok(fs.existsSync(path.join(tempDir, 'vue/src/app/router.ts')))
    assert.ok(fs.existsSync(path.join(tempDir, 'vue/src/app/storage.ts')))
    assert.ok(fs.existsSync(path.join(tempDir, 'vue/src/app/network.ts')))
    assert.ok(fs.existsSync(path.join(tempDir, 'vue/src/app/device.ts')))
    assert.ok(
      fs.existsSync(path.join(tempDir, 'vue/src/screens/HomeScreen.vue')),
    )
    assert.ok(
      fs.existsSync(path.join(tempDir, 'vue/src/screens/SettingsScreen.vue')),
    )
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})

test('integrate writes a lean router-only home screen', async () => {
  const tempDir = createTempDir()
  try {
    await withMutedConsole(() =>
      integrate({
        targetDir: tempDir,
        force: true,
        router: true,
      }),
    )
    const homeScreen = fs.readFileSync(
      path.join(tempDir, 'vue/src/screens/HomeScreen.vue'),
      'utf-8',
    )

    assert.match(homeScreen, /import \{ computed \} from 'vue'/)
    assert.doesNotMatch(homeScreen, /onMounted/)
    assert.doesNotMatch(homeScreen, /\bref\(/)
    assert.equal(
      fs.existsSync(path.join(tempDir, 'vue/src/app/storage.ts')),
      false,
    )
    assert.equal(
      fs.existsSync(path.join(tempDir, 'vue/src/app/network.ts')),
      false,
    )
    assert.equal(
      fs.existsSync(path.join(tempDir, 'vue/src/app/device.ts')),
      false,
    )
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})
