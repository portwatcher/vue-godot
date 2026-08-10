import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import {
  currentStableOfficialGodotVersion,
  officialGodotArtifactForPlatform,
  pinnedOfficialGodotVersion,
  resolveOfficialGodotSetupPlan,
  resolveZipExtractionCommand,
  setupOfficialGodot,
} from '../scripts/setup-godot.mjs'
import {
  defaultOfficialGodotTemplateRoot,
  officialGodotTemplateArtifact,
  resolveOfficialGodotTemplateSetupPlan,
  setupOfficialGodotExportTemplates,
} from '../scripts/setup-godot-export-templates.mjs'

test('official Godot catalog pins minimum and current stable host editors', () => {
  assert.equal(pinnedOfficialGodotVersion, '4.4.1-stable')
  assert.equal(currentStableOfficialGodotVersion, '4.7.1-stable')

  const minimumLinux = officialGodotArtifactForPlatform(
    pinnedOfficialGodotVersion,
    'linux',
    'x64',
  )
  const currentMac = officialGodotArtifactForPlatform(
    currentStableOfficialGodotVersion,
    'darwin',
    'arm64',
  )
  assert.equal(minimumLinux.key, 'linux-x86_64')
  assert.match(minimumLinux.sha256, /^[0-9a-f]{64}$/)
  assert.equal(currentMac.key, 'macos-universal')
  assert.match(currentMac.sha256, /^[0-9a-f]{64}$/)
  const minimumWindows = officialGodotArtifactForPlatform(
    pinnedOfficialGodotVersion,
    'win32',
    'x64',
  )
  assert.equal(minimumWindows.key, 'windows-x86_64')
  assert.equal(
    minimumWindows.executable,
    'Godot_v4.4.1-stable_win64_console.exe',
  )
  assert.match(minimumWindows.sha256, /^[0-9a-f]{64}$/)
})

test('official Godot setup plan is pinned, checksummed, and cache scoped', () => {
  const plan = resolveOfficialGodotSetupPlan({
    cacheDir: '.tmp-official-godot',
    platform: 'darwin',
    arch: 'x64',
    version: currentStableOfficialGodotVersion,
  })

  assert.equal(plan.version, currentStableOfficialGodotVersion)
  assert.equal(
    plan.url,
    'https://github.com/godotengine/godot-builds/releases/download/4.7.1-stable/Godot_v4.7.1-stable_macos.universal.zip',
  )
  assert.equal(
    plan.executablePath,
    path.join(
      process.cwd(),
      '.tmp-official-godot',
      '4.7.1-stable',
      'macos-universal',
      'Godot.app/Contents/MacOS/Godot',
    ),
  )
  assert.match(plan.sha256, /^[0-9a-f]{64}$/)
})

test('official Godot extraction passes Windows paths through scoped environment variables', () => {
  const plan = {
    archivePath: 'D:\\cache with spaces\\Godot[v4.4.1].zip',
    destinationPath: 'D:\\cache with spaces\\Godot 4.4.1',
  }
  const command = resolveZipExtractionCommand(plan, 'win32')

  assert.equal(command.command, 'powershell.exe')
  assert.deepEqual(command.arguments.slice(0, 3), [
    '-NoProfile',
    '-NonInteractive',
    '-Command',
  ])
  assert.match(command.arguments[3], /\$env:GODOT_SETUP_ARCHIVE_PATH/)
  assert.match(command.arguments[3], /\$env:GODOT_SETUP_DESTINATION_PATH/)
  assert.doesNotMatch(command.arguments[3], /\$args/)
  assert.deepEqual(command.environment, {
    GODOT_SETUP_ARCHIVE_PATH: plan.archivePath,
    GODOT_SETUP_DESTINATION_PATH: plan.destinationPath,
  })
})

test('official Godot setup accepts and exports an explicit official executable', async () => {
  if (process.platform === 'win32') return

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'official-godot-'))
  try {
    const executable = path.join(tempDir, 'godot')
    const githubEnv = path.join(tempDir, 'github-env')
    fs.writeFileSync(
      executable,
      "#!/bin/sh\nprintf '%s\\n' '4.4.1.stable.official.fixture'\n",
    )
    fs.chmodSync(executable, 0o755)

    const result = await setupOfficialGodot({
      godotBin: executable,
      githubEnv,
    })
    assert.equal(result.executablePath, executable)
    assert.equal(result.source, 'explicit')
    assert.equal(
      fs.readFileSync(githubEnv, 'utf-8'),
      `GODOT_BIN=${executable}\n`,
    )
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})

test('official Godot export templates are pinned by size and SHA-512', () => {
  const artifact = officialGodotTemplateArtifact(pinnedOfficialGodotVersion)
  assert.equal(artifact.filename, 'Godot_v4.4.1-stable_export_templates.tpz')
  assert.equal(artifact.installedVersion, '4.4.1.stable')
  assert.equal(artifact.size, 1206040900)
  assert.match(artifact.sha512, /^[0-9a-f]{128}$/)
})

test('official Godot export template plans use each platform data directory', () => {
  assert.equal(
    defaultOfficialGodotTemplateRoot({
      platform: 'darwin',
      homeDir: '/Users/fixture',
    }),
    '/Users/fixture/Library/Application Support/Godot/export_templates',
  )
  assert.equal(
    defaultOfficialGodotTemplateRoot({
      platform: 'linux',
      homeDir: '/home/fixture',
    }),
    '/home/fixture/.local/share/godot/export_templates',
  )
  assert.equal(
    defaultOfficialGodotTemplateRoot({
      platform: 'win32',
      homeDir: 'C:\\Users\\fixture',
      appData: 'C:\\Users\\fixture\\AppData\\Roaming',
    }),
    path.join(
      path.resolve('C:\\Users\\fixture\\AppData\\Roaming'),
      'Godot/export_templates',
    ),
  )

  const plan = resolveOfficialGodotTemplateSetupPlan({
    cacheDir: '.tmp-official-godot-templates',
    installRoot: '.tmp-export-templates',
  })
  assert.equal(plan.version, pinnedOfficialGodotVersion)
  assert.equal(
    plan.url,
    'https://github.com/godotengine/godot-builds/releases/download/4.4.1-stable/Godot_v4.4.1-stable_export_templates.tpz',
  )
  assert.equal(
    plan.installDir,
    path.join(process.cwd(), '.tmp-export-templates', '4.4.1.stable'),
  )
})

test('official template setup refuses to replace an unowned install', async () => {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'official-godot-templates-'),
  )
  const installRoot = path.join(tempDir, 'export_templates')
  const installDir = path.join(installRoot, '4.4.1.stable')
  fs.mkdirSync(installDir, { recursive: true })
  fs.writeFileSync(path.join(installDir, 'version.txt'), 'fixture')
  try {
    await assert.rejects(
      setupOfficialGodotExportTemplates({
        cacheDir: path.join(tempDir, 'cache'),
        installRoot,
      }),
      /not owned by this setup script/,
    )
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})

test('stock Godot setup is exposed through npm and a checksum-only CI action', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
  const action = fs.readFileSync(
    '.github/actions/setup-godot/action.yml',
    'utf-8',
  )
  const templateAction = fs.readFileSync(
    '.github/actions/setup-godot-export-templates/action.yml',
    'utf-8',
  )
  const releaseWorkflow = fs.readFileSync(
    '.github/workflows/godot-js-runtime-release.yml',
    'utf-8',
  )
  const publishWorkflow = fs.readFileSync(
    '.github/workflows/publish.yml',
    'utf-8',
  )
  const smokeWorkflow = fs.readFileSync(
    '.github/workflows/godot-smoke.yml',
    'utf-8',
  )

  assert.equal(
    packageJson.scripts['setup:godot'],
    'node scripts/setup-godot.mjs',
  )
  assert.equal(
    packageJson.scripts['setup:godot-templates'],
    'node scripts/setup-godot-export-templates.mjs',
  )
  assert.equal(packageJson.scripts['setup:godotjs'], undefined)
  for (const removedPath of [
    '.github/actions/setup-godotjs/action.yml',
    'scripts/setup-godotjs.mjs',
    'test/setup-godotjs.test.mjs',
  ]) {
    assert.equal(
      fs.existsSync(removedPath),
      false,
      `${removedPath} still exists`,
    )
  }
  assert.deepEqual(fs.readdirSync('packages/cli/templates/typings').sort(), [
    '.gdignore',
  ])
  const rendererTypingsDir = 'packages/runtime-tscn/typings'
  assert.deepEqual(
    fs.existsSync(rendererTypingsDir) ? fs.readdirSync(rendererTypingsDir) : [],
    [],
  )
  assert.match(action, /default: 4\.4\.1-stable/)
  assert.match(action, /actions\/cache@v5/)
  assert.match(action, /node scripts\/setup-godot\.mjs/)
  assert.match(action, /apt-cache show libasound2t64/)
  assert.match(action, /godot_audio_package=libasound2t64/)
  assert.match(action, /godot_audio_package=libasound2/)
  assert.match(action, /"\$godot_audio_package"/)
  assert.doesNotMatch(action, /GodotJS|ialex32x/)
  assert.match(templateAction, /actions\/cache@v5/)
  assert.match(
    templateAction,
    /node scripts\/setup-godot-export-templates\.mjs/,
  )
  for (const platform of [
    'macos',
    'windows',
    'linux',
    'android',
    'ios',
    'web',
  ]) {
    assert.match(releaseWorkflow, new RegExp(`platform: ${platform}`))
  }
  assert.match(releaseWorkflow, /- platform: linux\s+runner: ubuntu-22\.04/)
  assert.match(releaseWorkflow, /--release-dir/)
  assert.match(releaseWorkflow, /emscripten\/emsdk@sha256:/)
  assert.match(
    releaseWorkflow,
    /android-actions\/setup-android@40fd30fb8d7440372e1316f5d1809ec01dcd3699/,
  )
  assert.match(releaseWorkflow, /cmdline-tools-version: '14742923'/)
  assert.match(releaseWorkflow, /packages: 'ndk;23\.2\.8568313'/)
  assert.match(
    releaseWorkflow,
    /ANDROID_NDK_ROOT=\$\{ANDROID_SDK_ROOT\}\/ndk\/23\.2\.8568313/,
  )
  assert.doesNotMatch(releaseWorkflow, /^\s*sdkmanager\s/m)
  assert.match(
    releaseWorkflow,
    /update-alternatives --set x86_64-w64-mingw32-gcc \/usr\/bin\/x86_64-w64-mingw32-gcc-posix/,
  )
  assert.match(
    releaseWorkflow,
    /update-alternatives --set x86_64-w64-mingw32-g\+\+ \/usr\/bin\/x86_64-w64-mingw32-g\+\+-posix/,
  )
  assert.match(releaseWorkflow, /Thread model: \/\/p'\)" = posix/)
  assert.match(releaseWorkflow, /workflow_call:/)
  assert.match(publishWorkflow, /godot-js-runtime-release\.yml/)
  assert.match(publishWorkflow, /name: godot-js-runtime-release/)
  assert.match(publishWorkflow, /name: godot-js-runtime-linux/)
  assert.match(publishWorkflow, /cmp \\/)
  assert.doesNotMatch(publishWorkflow, /Build Linux runtime/)
  assert.doesNotMatch(smokeWorkflow, /setup-godotjs|legacy-parity-control/)
})
