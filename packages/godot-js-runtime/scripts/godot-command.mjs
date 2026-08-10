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

export function assertOfficialGodotExecutable(executable) {
  const version = readGodotVersion(executable)
  if (version.includes('official')) return version

  throw new Error(
    `Expected an official stock Godot executable, received ${version || '<empty>'}.`,
  )
}
