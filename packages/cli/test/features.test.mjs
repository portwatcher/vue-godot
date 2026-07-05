import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { integrate, newPackageJson } from '../dist/integrate.js'

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

test('integrate adds @vue-godot/device without enabling html mode', async () => {
  const tempDir = createTempDir()
  try {
    await withMutedConsole(() =>
      integrate({ targetDir: tempDir, force: true, device: true }),
    )
    const pkg = readJson(path.join(tempDir, 'package.json'))

    assert.equal(pkg.dependencies['@vue-godot/device'], '^0.0.1')
    assert.equal(pkg.dependencies['@vue-godot/browser'], undefined)
    assert.equal(pkg.dependencies['@vue-godot/html'], undefined)
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})
