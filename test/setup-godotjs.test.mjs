import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import {
  defaultGodotJsAssetForPlatform,
  godotJsReleaseAssetUrl,
  pinnedGodotJsRelease,
  resolveGodotJsSetupPlan,
} from '../scripts/setup-godotjs.mjs'

const repoRoot = process.cwd()

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf-8')
}

test('default GodotJS asset mapping covers supported CI and local platforms', () => {
  assert.equal(
    defaultGodotJsAssetForPlatform('darwin', 'arm64'),
    'prebuilt_macos_arm64_v8',
  )
  assert.equal(
    defaultGodotJsAssetForPlatform('linux', 'x64'),
    'prebuilt_linux_x64_v8',
  )
  assert.equal(
    defaultGodotJsAssetForPlatform('win32', 'x64'),
    'prebuilt_windows_x64_v8',
  )
})

test('default GodotJS asset mapping rejects unsupported platforms', () => {
  assert.throws(
    () => defaultGodotJsAssetForPlatform('freebsd', 'x64'),
    /No pinned GodotJS asset is configured for freebsd:x64/,
  )
})

test('GodotJS setup plan resolves pinned release, asset, cache paths, and URL', () => {
  const plan = resolveGodotJsSetupPlan({
    cacheDir: '.tmp-godot-cache',
    platform: 'darwin',
    arch: 'arm64',
  })

  assert.equal(plan.release, pinnedGodotJsRelease)
  assert.equal(plan.asset, 'prebuilt_macos_arm64_v8')
  assert.equal(plan.cacheDir, path.join(repoRoot, '.tmp-godot-cache'))
  assert.equal(
    plan.assetDir,
    path.join(
      repoRoot,
      '.tmp-godot-cache',
      pinnedGodotJsRelease,
      'prebuilt_macos_arm64_v8',
    ),
  )
  assert.equal(
    plan.archivePath,
    path.join(plan.assetDir, 'prebuilt_macos_arm64_v8.zip'),
  )
  assert.equal(
    plan.url,
    'https://github.com/ialex32x/GodotJS-Build/releases/download/GodotJS_1.0.0-2/prebuilt_macos_arm64_v8.zip',
  )
  assert.equal(plan.url, godotJsReleaseAssetUrl(plan.release, plan.asset))
})

test('GodotJS setup is exposed through npm and the shared CI action', () => {
  const packageJson = JSON.parse(readText('package.json'))
  const action = readText('.github/actions/setup-godotjs/action.yml')

  assert.equal(
    packageJson.scripts['setup:godotjs'],
    'node scripts/setup-godotjs.mjs',
  )
  assert.match(action, /default: GodotJS_1\.0\.0-2/)
  assert.match(action, /default: prebuilt_linux_x64_v8/)
  assert.match(action, /actions\/cache@v5/)
  assert.match(action, /node scripts\/setup-godotjs\.mjs/)
  assert.match(action, /--github-env "\$GITHUB_ENV"/)
  assert.doesNotMatch(action, /curl --fail/)
  assert.doesNotMatch(action, /find "\$GODOTJS_CACHE_DIR"/)
})
