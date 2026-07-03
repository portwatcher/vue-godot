import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const nodeCommand = process.execPath

const packageDirs = {
  '@vue-godot/browser': 'packages/browser',
  '@vue-godot/cli': 'packages/cli',
  '@vue-godot/html': 'packages/html',
  '@vue-godot/runtime-tscn': 'packages/runtime-tscn',
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    env: options.env ?? process.env,
    encoding: 'utf-8',
    stdio: options.stdio ?? 'pipe',
  })

  if (result.status !== 0) {
    const rendered = [command, ...args].join(' ')
    throw new Error(
      [
        `Command failed (${result.status ?? 'unknown'}): ${rendered}`,
        result.stdout,
        result.stderr,
      ]
        .filter(Boolean)
        .join('\n'),
    )
  }

  return result.stdout
}

function requireBuiltCli() {
  const cliPath = path.join(repoRoot, 'packages/cli/dist/cli.js')
  if (!fs.existsSync(cliPath)) {
    throw new Error(
      'packages/cli/dist/cli.js not found. Run npm run build first.',
    )
  }
  return cliPath
}

function packPackage(packageName, packDir) {
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

function smokeProject(cliPath, workspaceDir, name, extraArgs, env) {
  const target = path.join(workspaceDir, name)
  run(nodeCommand, [cliPath, 'create', target, '-f', ...extraArgs], {
    env,
    stdio: 'inherit',
  })
  run(npmCommand, ['run', 'build'], {
    cwd: target,
    env,
    stdio: 'inherit',
  })
}

const cliPath = requireBuiltCli()
const workspaceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-smoke-'))
const packDir = path.join(workspaceDir, 'packs')
fs.mkdirSync(packDir)

const packageOverrides = Object.fromEntries(
  Object.keys(packageDirs).map((packageName) => [
    packageName,
    `file:${packPackage(packageName, packDir)}`,
  ]),
)

const env = {
  ...process.env,
  VUE_GODOT_PACKAGE_OVERRIDES: JSON.stringify(packageOverrides),
}

console.log(`[smoke-cli] workspace: ${workspaceDir}`)
smokeProject(cliPath, workspaceDir, 'basic-app', [], env)
smokeProject(cliPath, workspaceDir, 'html-app', ['--html'], env)
console.log('[smoke-cli] create and create --html smoke checks passed')
