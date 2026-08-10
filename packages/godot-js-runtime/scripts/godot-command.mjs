import { spawnSync } from 'node:child_process'

export function godotCommandArguments(args, platform = process.platform) {
  return platform === 'darwin'
    ? [...args, '-ApplePersistenceIgnoreState', 'YES']
    : [...args]
}

export function readGodotVersion(executable) {
  const result = spawnSync(executable, ['--version'], {
    encoding: 'utf-8',
    timeout: 30_000,
  })
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim()
  if (result.error || result.status !== 0) {
    throw new Error(
      `Unable to read Godot version from ${executable}: ${result.error?.message ?? output}`,
    )
  }
  return output
}

export function assertOfficialGodotExecutable(executable, options = {}) {
  const version = readGodotVersion(executable)
  if (version.includes('official')) return version

  const allowLegacy =
    options.allowLegacy ?? process.env.VUE_GODOT_ALLOW_LEGACY_RUNTIME === '1'
  if (allowLegacy) {
    console.warn(
      `[godot-command] temporary legacy runtime control enabled for ${version}`,
    )
    return version
  }

  throw new Error(
    `Expected an official stock Godot executable, received ${version || '<empty>'}. Set VUE_GODOT_ALLOW_LEGACY_RUNTIME=1 only for the temporary opt-in parity control.`,
  )
}
