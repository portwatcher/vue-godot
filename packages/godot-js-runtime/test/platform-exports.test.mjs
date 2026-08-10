import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  exportApplications,
  exportPlatformPresets,
  exportSmokeFeature,
  generateExportPresets,
  writeExportPresets,
} from '../scripts/export-presets.mjs'
import {
  androidBootProbeReady,
  assertPlatformExportGodotVersion,
  resolveNpmInvocation,
} from '../scripts/smoke-platform-exports.mjs'
import { createWebExportServer } from '../scripts/serve-web-export.mjs'

test('the generated export matrix covers both apps and every required platform', () => {
  assert.deepEqual(
    exportApplications.map((application) => application.id),
    ['standalone', 'vue'],
  )
  assert.deepEqual(
    exportPlatformPresets.map((platform) => platform.id),
    ['macos', 'windows', 'linux', 'android', 'ios', 'web'],
  )
  assert.ok(
    exportPlatformPresets.every((platform) =>
      ['debug', 'release'].every((mode) => platform.modes.includes(mode)),
    ),
  )

  for (const application of exportApplications) {
    const source = generateExportPresets(application)
    assert.equal((source.match(/^\[preset\.\d+\]$/gm) ?? []).length, 7)
    assert.match(source, new RegExp(`custom_features="${exportSmokeFeature}"`))
    for (const pattern of [
      'dist/*.js',
      'dist/**/*.js',
      'dist/*.mjs',
      'dist/**/*.mjs',
      'dist/*.cjs',
      'dist/**/*.cjs',
      'dist/*.json',
      'dist/**/*.json',
      'dist/*.js.map',
      'dist/**/*.js.map',
    ]) {
      assert.ok(source.includes(pattern), pattern)
    }
    assert.match(source, /platform="macOS"/)
    assert.match(source, /platform="Windows Desktop"/)
    assert.match(source, /platform="Linux\/X11"/)
    assert.match(source, /platform="Android"/)
    assert.match(source, /platform="iOS"/)
    assert.match(source, /platform="Web"/)
    assert.match(source, /architectures\/arm64-v8a=true/)
    assert.match(source, /architectures\/x86_64=true/)
    assert.match(source, /variant\/extensions_support=true/)
    assert.match(source, /variant\/thread_support=true/)
    assert.match(source, /binary_format\/architecture="universal"/)
    assert.match(source, /application\/export_project_only=true/)
    assert.match(source, /icons\/icon_1024x1024="res:\/\/icon\.svg"/)
    assert.equal(
      fs.readFileSync(
        path.join(application.root, 'export_presets.cfg'),
        'utf-8',
      ),
      source,
    )
  }
  assert.doesNotThrow(() => writeExportPresets({ check: true }))
})

test('export smoke entry points report runtime, Godot, and platform versions', () => {
  const repositoryRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../..',
  )
  const standalone = fs.readFileSync(
    path.join(repositoryRoot, 'apps/js-runtime-demo/src/player.ts'),
    'utf-8',
  )
  const vue = fs.readFileSync(
    path.join(repositoryRoot, 'apps/native-app-demo/vue/src/main.ts'),
    'utf-8',
  )
  const vite = fs.readFileSync(
    path.join(repositoryRoot, 'apps/native-app-demo/vue/vite.config.ts'),
    'utf-8',
  )

  for (const source of [standalone, vue]) {
    assert.match(source, /godot_js_runtime_export_smoke/)
    assert.match(source, /runtimeVersion\(\)/)
    assert.match(source, /Engine\.get_version_info\(\)/)
    assert.match(source, /OS\.get_name\(\)/)
    assert.match(source, /get_tree\(\)\.quit\(0\)/)
    assert.match(source, /OS\.get_name\(\) !== 'Web'/)
  }
  assert.match(vite, /external: \['godot', 'godot-js'\]/)
})

test('the Web export server enables threads and serves exact MIME types', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'godot-js-web-export-'))
  const server = createWebExportServer(root)
  try {
    fs.writeFileSync(path.join(root, 'index.html'), '<!doctype html>\n')
    fs.writeFileSync(
      path.join(root, 'runtime.wasm'),
      Buffer.from([0, 97, 115, 109]),
    )
    await new Promise((resolve, reject) => {
      server.once('error', reject)
      server.listen(0, '127.0.0.1', resolve)
    })
    const address = server.address()
    assert.ok(address && typeof address !== 'string')
    const origin = `http://127.0.0.1:${String(address.port)}`
    const html = await fetch(origin)
    assert.equal(html.status, 200)
    assert.equal(html.headers.get('cross-origin-opener-policy'), 'same-origin')
    assert.equal(
      html.headers.get('cross-origin-embedder-policy'),
      'require-corp',
    )
    assert.equal(
      html.headers.get('cross-origin-resource-policy'),
      'same-origin',
    )
    assert.match(html.headers.get('content-type') ?? '', /^text\/html/)

    const wasm = await fetch(`${origin}/runtime.wasm`)
    assert.equal(wasm.status, 200)
    assert.equal(wasm.headers.get('content-type'), 'application/wasm')
    assert.deepEqual(
      Buffer.from(await wasm.arrayBuffer()),
      Buffer.from([0, 97, 115, 109]),
    )
    assert.equal((await fetch(`${origin}/missing.wasm`)).status, 404)
  } finally {
    await new Promise((resolve) => server.close(resolve))
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test('platform smoke uses direct browser worker-console and iOS slice link gates', () => {
  const repositoryRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../..',
  )
  const runner = fs.readFileSync(
    path.join(
      repositoryRoot,
      'packages/godot-js-runtime/scripts/smoke-platform-exports.mjs',
    ),
    'utf-8',
  )
  const browser = fs.readFileSync(
    path.join(
      repositoryRoot,
      'packages/godot-js-runtime/scripts/run-web-export-browser.mjs',
    ),
    'utf-8',
  )
  assert.match(runner, /linkIosSimulatorRuntimeSlices/)
  assert.match(runner, /generic\/platform=iOS Simulator/)
  assert.match(runner, /passed-with-manual-device-gate/)
  assert.match(browser, /--remote-debugging-pipe/)
  assert.match(browser, /Runtime\.consoleAPICalled/)
  assert.match(browser, /globalThis\.crossOriginIsolated/)
  assert.doesNotMatch(browser, /virtual-time-budget/)
})

test('Android export launch waits for both boot and package-manager readiness', () => {
  assert.equal(
    androidBootProbeReady(
      '1\n',
      'package:/system/framework/framework-res.apk\n',
    ),
    true,
  )
  assert.equal(
    androidBootProbeReady('', 'package:/system/framework/framework-res.apk\n'),
    false,
  )
  assert.equal(
    androidBootProbeReady('1\n', 'Error: device is booting\n'),
    false,
  )
})

test('platform export builds resolve a native npm invocation', () => {
  assert.deepEqual(
    resolveNpmInvocation('win32', {
      ComSpec: 'C:\\Windows\\System32\\cmd.exe',
    }),
    {
      command: 'C:\\Windows\\System32\\cmd.exe',
      prefixArguments: ['/d', '/s', '/c', 'npm.cmd'],
    },
  )
  assert.deepEqual(resolveNpmInvocation('win32', {}), {
    command: 'cmd.exe',
    prefixArguments: ['/d', '/s', '/c', 'npm.cmd'],
  })
  assert.deepEqual(resolveNpmInvocation('linux'), {
    command: 'npm',
    prefixArguments: [],
  })
  assert.deepEqual(resolveNpmInvocation('darwin'), {
    command: 'npm',
    prefixArguments: [],
  })
})

test('platform exports retain the minimum ABI and enforce the selected stable release', () => {
  assert.equal(
    assertPlatformExportGodotVersion(
      '4.7.1.stable.official.fixture',
      '4.7.1-stable',
    ),
    '4.7.1.stable.official.fixture',
  )
  assert.equal(
    assertPlatformExportGodotVersion('4.4.1.stable.official.fixture'),
    '4.4.1.stable.official.fixture',
  )
  assert.throws(
    () => assertPlatformExportGodotVersion('4.3.stable.official.fixture'),
    /4\.4\.1 or newer/,
  )
  assert.throws(
    () =>
      assertPlatformExportGodotVersion(
        '4.7.1.stable.official.fixture',
        '4.8-stable',
      ),
    /expected official Godot 4\.8-stable/,
  )
  assert.throws(
    () =>
      assertPlatformExportGodotVersion(
        '4.7.1.stable.official.fixture',
        '4.8-rc1',
      ),
    /Invalid expected Godot stable release/,
  )
})
