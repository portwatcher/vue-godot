import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import {
  assertNoGodotScriptLoadErrors,
  directoryContainsText,
  relevantGodotDiagnosticLines,
  resolveGodotBin,
  resolveGodotCommand,
} from '../scripts/smoke-utils.mjs'

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-smoke-utils-'))
}

function writeExecutable(filePath) {
  fs.writeFileSync(filePath, '#!/bin/sh\nexit 0\n')
  fs.chmodSync(filePath, 0o755)
}

test('directoryContainsText tolerates files removed during traversal', () => {
  const tempDir = createTempDir()
  const outputPath = path.join(tempDir, 'app.css')
  const originalReadFileSync = fs.readFileSync
  let removedOutput = false

  try {
    fs.writeFileSync(outputPath, 'generated rebuilt marker')
    fs.readFileSync = (filePath, options) => {
      if (filePath === outputPath) {
        fs.rmSync(outputPath)
        removedOutput = true
      }
      return originalReadFileSync(filePath, options)
    }

    assert.equal(directoryContainsText(tempDir, 'rebuilt marker'), false)
    assert.equal(removedOutput, true)
  } finally {
    fs.readFileSync = originalReadFileSync
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})

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

test('resolveGodotCommand returns absolute paths for relative GODOT_BIN values', () => {
  const tempDir = createTempDir()
  const originalCwd = process.cwd()
  try {
    const godot = path.join(tempDir, 'godot.linuxbsd.editor.dev.x86_64')
    writeExecutable(godot)

    process.chdir(path.dirname(tempDir))
    const relativeGodot = path.relative(process.cwd(), godot)

    assert.equal(resolveGodotCommand({ godotBin: relativeGodot }), godot)
  } finally {
    process.chdir(originalCwd)
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

test('Godot smoke diagnostics include missing resource loads', () => {
  const output = [
    'Godot Engine v4.4',
    'ERROR: Resource file not found: user://tmp/vue-godot-audio/1.wav',
    "ERROR: Error loading resource: 'user://tmp/vue-godot-audio/1.wav'.",
  ].join('\n')

  assert.match(
    relevantGodotDiagnosticLines(output),
    /Resource file not found/,
  )
  assert.throws(
    () => assertNoGodotScriptLoadErrors(output, 'fixture smoke'),
    /script-load, asset-load, or signal wiring diagnostics/,
  )
})

test('Godot smoke diagnostics include failed signal wiring', () => {
  const output = [
    'Godot Engine v4.4',
    'WARN: [vue-godot] Unable to connect signal "scrolling" on @ScrollContainer@2147483771 from Vue event prop "onScrolling". Check that this Godot class defines the signal and that the event name maps to the expected Godot signal:',
    "ERROR: In Object of type 'ScrollContainer': Attempt to connect nonexistent signal 'scrolling' to callable ''.",
  ].join('\n')

  assert.match(
    relevantGodotDiagnosticLines(output),
    /Unable to connect signal/,
  )
  assert.throws(
    () => assertNoGodotScriptLoadErrors(output, 'fixture smoke'),
    /signal wiring diagnostics/,
  )
})
