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
  setupOfficialGodot,
} from '../scripts/setup-godot.mjs'

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

test('stock Godot setup is exposed through npm and a checksum-only CI action', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
  const action = fs.readFileSync(
    '.github/actions/setup-godot/action.yml',
    'utf-8',
  )

  assert.equal(
    packageJson.scripts['setup:godot'],
    'node scripts/setup-godot.mjs',
  )
  assert.match(action, /default: 4\.4\.1-stable/)
  assert.match(action, /actions\/cache@v5/)
  assert.match(action, /node scripts\/setup-godot\.mjs/)
  assert.doesNotMatch(action, /GodotJS|ialex32x/)
})
