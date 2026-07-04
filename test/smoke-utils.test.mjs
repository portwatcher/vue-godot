import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { resolveGodotBin, resolveGodotCommand } from '../scripts/smoke-utils.mjs'

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-smoke-utils-'))
}

function writeExecutable(filePath) {
  fs.writeFileSync(filePath, '#!/bin/sh\nexit 0\n')
  fs.chmodSync(filePath, 0o755)
}

test('resolveGodotBin accepts an executable file path', () => {
  const tempDir = createTempDir()
  try {
    const godot = path.join(tempDir, 'godot.macos.editor.universal')
    writeExecutable(godot)

    assert.equal(resolveGodotBin(godot), godot)
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})

test('resolveGodotBin accepts a directory containing a Godot executable', () => {
  const tempDir = createTempDir()
  try {
    const godot = path.join(tempDir, 'godot.macos.editor.universal')
    writeExecutable(godot)

    assert.equal(resolveGodotBin(tempDir), godot)
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})

test('resolveGodotBin searches nested Godot app-style directories', () => {
  const tempDir = createTempDir()
  try {
    const binDir = path.join(tempDir, 'Godot.app', 'Contents', 'MacOS')
    fs.mkdirSync(binDir, { recursive: true })
    const godot = path.join(binDir, 'godot')
    writeExecutable(godot)

    assert.equal(resolveGodotBin(tempDir), godot)
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})

test('resolveGodotCommand normalizes explicit GODOT_BIN directory values', () => {
  const tempDir = createTempDir()
  try {
    const godot = path.join(tempDir, 'godot.linuxbsd.editor.dev.x86_64')
    writeExecutable(godot)

    assert.equal(resolveGodotCommand({ godotBin: tempDir }), godot)
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})

test('resolveGodotBin rejects directories without a Godot executable', () => {
  const tempDir = createTempDir()
  try {
    const script = path.join(tempDir, 'not-godot')
    writeExecutable(script)

    assert.throws(
      () => resolveGodotBin(tempDir),
      /does not contain an executable named like godot\*/,
    )
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})
