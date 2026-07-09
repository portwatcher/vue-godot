import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const cliSpec = process.env.VUE_GODOT_PUBLIC_CLI_SPEC ?? 'vue-godot@latest'

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env ?? process.env,
    encoding: 'utf-8',
    stdio: options.stdio ?? 'pipe',
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

  return result
}

const workspaceDir = fs.mkdtempSync(
  path.join(os.tmpdir(), 'vue-godot-public-smoke-'),
)
const targetDir = path.join(workspaceDir, 'html-app')

console.log(`[smoke-public-cli] workspace: ${workspaceDir}`)
console.log(`[smoke-public-cli] cli: ${cliSpec}`)

try {
  run(npxCommand, ['--yes', cliSpec, 'create', targetDir, '--html', '-f'], {
    cwd: workspaceDir,
    stdio: 'inherit',
  })
  run(npmCommand, ['run', 'build'], {
    cwd: targetDir,
    stdio: 'inherit',
  })
  console.log('[smoke-public-cli] public create --html smoke passed')
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  console.error(
    [
      '[smoke-public-cli] failed.',
      'Expected causes before release: the published CLI alias is stale, @vue-godot/cli is stale, or @vue-godot/browser / @vue-godot/html is not published.',
      'Set VUE_GODOT_PUBLIC_CLI_SPEC=vue-godot@<version> to test a specific CLI alias version.',
    ].join('\n'),
  )
  process.exit(1)
}
