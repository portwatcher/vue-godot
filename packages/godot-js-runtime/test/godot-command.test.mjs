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
  'runtime gates require official Godot unless the temporary legacy control is explicit',
  { skip: process.platform === 'win32' },
  () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'godot-command-'))
    try {
      const official = path.join(tempDir, 'official-godot')
      const legacy = path.join(tempDir, 'legacy-godot')
      fs.writeFileSync(
        official,
        "#!/bin/sh\nprintf '%s\\n' '4.4.1.stable.official.fixture'\n",
      )
      fs.writeFileSync(
        legacy,
        "#!/bin/sh\nprintf '%s\\n' '4.4.1.stable.custom_build.godotjs'\n",
      )
      fs.chmodSync(official, 0o755)
      fs.chmodSync(legacy, 0o755)

      assert.match(assertOfficialGodotExecutable(official), /official/)
      assert.throws(
        () => assertOfficialGodotExecutable(legacy),
        /Expected an official stock Godot executable/,
      )
      assert.match(
        assertOfficialGodotExecutable(legacy, { allowLegacy: true }),
        /godotjs/,
      )
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  },
)
