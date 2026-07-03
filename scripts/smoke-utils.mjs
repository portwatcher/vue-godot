import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)

export const repoRoot = path.resolve(path.dirname(__filename), '..')
export const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
export const nodeCommand = process.execPath

export const packageDirs = {
  '@vue-godot/browser': 'packages/browser',
  '@vue-godot/cli': 'packages/cli',
  '@vue-godot/html': 'packages/html',
  '@vue-godot/runtime-tscn': 'packages/runtime-tscn',
}

export function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    env: options.env ?? process.env,
    encoding: 'utf-8',
    stdio: options.stdio ?? 'pipe',
    timeout: options.timeout,
  })

  if (result.status !== 0) {
    const rendered = [command, ...args].join(' ')
    throw new Error(
      [
        `Command failed (${result.status ?? result.signal ?? 'unknown'}): ${rendered}`,
        result.stdout,
        result.stderr,
      ]
        .filter(Boolean)
        .join('\n'),
    )
  }

  return result.stdout
}

export function commandExists(command) {
  const probe = spawnSync(command, ['--version'], {
    encoding: 'utf-8',
    stdio: 'pipe',
  })
  return probe.status === 0
}

export function resolveGodotCommand() {
  if (process.env.GODOT_BIN) {
    return process.env.GODOT_BIN
  }
  if (commandExists('godot4')) {
    return 'godot4'
  }
  if (commandExists('godot')) {
    return 'godot'
  }
  return null
}

export function requireBuiltCli() {
  const cliPath = path.join(repoRoot, 'packages/cli/dist/cli.js')
  if (!fs.existsSync(cliPath)) {
    throw new Error(
      'packages/cli/dist/cli.js not found. Run npm run build first.',
    )
  }
  return cliPath
}

export function packPackage(packageName, packDir) {
  const packageDir = path.join(repoRoot, packageDirs[packageName])
  const stdout = run(npmCommand, ['pack', '--pack-destination', packDir], {
    cwd: packageDir,
  })
  const tarballName = stdout.trim().split('\n').at(-1)
  if (!tarballName) {
    throw new Error(`npm pack did not report a tarball for ${packageName}`)
  }
  return path.join(packDir, tarballName)
}

export function createPackedPackageOverrides(packDir) {
  return Object.fromEntries(
    Object.keys(packageDirs).map((packageName) => [
      packageName,
      `file:${packPackage(packageName, packDir)}`,
    ]),
  )
}
