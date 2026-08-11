import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import {
  assertOfficialGodotExecutable,
  godotCommandArguments,
} from '../scripts/godot-command.mjs'

test('macOS Godot commands bypass persistent crash-recovery dialogs', () => {
  assert.deepEqual(godotCommandArguments(['--version'], 'darwin'), [
    '--version',
    '-ApplePersistenceIgnoreState',
    'YES',
  ])
  assert.deepEqual(godotCommandArguments(['--version'], 'linux'), ['--version'])
})

test(
  'runtime gates always require official Godot',
  { skip: process.platform === 'win32' },
  () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'godot-command-'))
    try {
      const official = path.join(tempDir, 'official-godot')
      const custom = path.join(tempDir, 'custom-godot')
      fs.writeFileSync(
        official,
        "#!/bin/sh\nprintf '%s\\n' '4.4.1.stable.official.fixture'\n",
      )
      fs.writeFileSync(
        custom,
        "#!/bin/sh\nprintf '%s\\n' '4.4.1.stable.custom_build.fixture'\n",
      )
      fs.chmodSync(official, 0o755)
      fs.chmodSync(custom, 0o755)

      assert.match(assertOfficialGodotExecutable(official), /official/)
      assert.throws(
        () => assertOfficialGodotExecutable(custom),
        /Expected an official stock Godot executable/,
      )
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  },
)
