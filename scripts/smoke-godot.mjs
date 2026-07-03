import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')

function commandExists(command) {
  const probe = spawnSync(command, ['--version'], {
    encoding: 'utf-8',
    stdio: 'pipe',
  })
  return probe.status === 0
}

function resolveGodotCommand() {
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

const godot = resolveGodotCommand()
if (!godot) {
  console.log(
    '[smoke-godot] skipped: set GODOT_BIN or install a godot/godot4 executable',
  )
  process.exit(0)
}

const result = spawnSync(
  godot,
  ['--headless', '--path', path.join(repoRoot, 'apps/html-demo'), '--quit'],
  {
    cwd: repoRoot,
    encoding: 'utf-8',
    stdio: 'inherit',
  },
)

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}

console.log('[smoke-godot] html-demo opened successfully')
