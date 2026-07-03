import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const demoDir = path.join(repoRoot, 'apps/html-demo')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const SMOKE_PASS_MARKER = '[vue-godot-smoke] passed'

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

function run(command, args, options = {}) {
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

  return result
}

function runProjectOpenSmoke(godot) {
  run(godot, ['--headless', '--path', demoDir, '--quit'], {
    stdio: 'inherit',
  })
  console.log('[smoke-godot] html-demo opened successfully')
}

function runLifecycleSmoke(godot) {
  console.log('[smoke-godot] building html-demo')
  run(npmCommand, ['run', 'build', '--workspace=html-demo'], {
    stdio: 'inherit',
  })

  console.log('[smoke-godot] running html-demo lifecycle smoke')
  const result = run(godot, ['--headless', '--path', demoDir], {
    env: {
      ...process.env,
      VUE_GODOT_SMOKE: '1',
      VUE_GODOT_SMOKE_RELOADS: process.env.VUE_GODOT_SMOKE_RELOADS ?? '3',
    },
    timeout: 30_000,
  })

  if (result.stdout) {
    process.stdout.write(result.stdout)
  }
  if (result.stderr) {
    process.stderr.write(result.stderr)
  }

  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`
  if (!output.includes(SMOKE_PASS_MARKER)) {
    throw new Error(
      `Godot lifecycle smoke did not print pass marker: ${SMOKE_PASS_MARKER}`,
    )
  }

  console.log('[smoke-godot] html-demo lifecycle smoke passed')
}

const godot = resolveGodotCommand()
if (!godot) {
  console.log(
    '[smoke-godot] skipped: set GODOT_BIN or install a godot/godot4 executable',
  )
  process.exit(0)
}

try {
  if (process.env.VUE_GODOT_SMOKE_OPEN_ONLY === '1') {
    runProjectOpenSmoke(godot)
  } else {
    runLifecycleSmoke(godot)
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
