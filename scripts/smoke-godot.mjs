import { spawn, spawnSync } from 'node:child_process'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const demoDir = path.join(repoRoot, 'apps/html-demo')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const SMOKE_PASS_MARKER = '[vue-godot-smoke] passed'
const FETCH_SMOKE_PATH = '/vue-godot-fetch-smoke'
const FETCH_SMOKE_TEXT = 'vue-godot fetch smoke ok'

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

function runAsync(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? repoRoot,
      env: options.env ?? process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''
    let didSettle = false

    const timeout =
      typeof options.timeout === 'number'
        ? setTimeout(() => {
            child.kill('SIGTERM')
          }, options.timeout)
        : null

    child.stdout.setEncoding('utf-8')
    child.stderr.setEncoding('utf-8')
    child.stdout.on('data', (chunk) => {
      stdout += chunk
    })
    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })

    child.on('error', (error) => {
      if (timeout) {
        clearTimeout(timeout)
      }
      if (!didSettle) {
        didSettle = true
        reject(error)
      }
    })

    child.on('close', (status, signal) => {
      if (timeout) {
        clearTimeout(timeout)
      }
      if (didSettle) {
        return
      }
      didSettle = true

      if (status !== 0) {
        const rendered = [command, ...args].join(' ')
        reject(
          new Error(
            [
              `Command failed (${status ?? signal ?? 'unknown'}): ${rendered}`,
              stdout,
              stderr,
            ]
              .filter(Boolean)
              .join('\n'),
          ),
        )
        return
      }

      resolve({ stdout, stderr })
    })
  })
}

function startFetchSmokeServer() {
  const server = http.createServer((request, response) => {
    if (request.url !== FETCH_SMOKE_PATH) {
      response.writeHead(404, { 'content-type': 'text/plain' })
      response.end('not found')
      return
    }

    response.writeHead(200, { 'content-type': 'text/plain' })
    response.end(FETCH_SMOKE_TEXT)
  })

  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject)
      const address = server.address()
      if (!address || typeof address === 'string') {
        server.close()
        reject(new Error('Unable to resolve fetch smoke server address'))
        return
      }

      resolve({
        url: `http://127.0.0.1:${address.port}${FETCH_SMOKE_PATH}`,
        close: () =>
          new Promise((closeResolve, closeReject) => {
            server.close((error) => {
              if (error) {
                closeReject(error)
              } else {
                closeResolve()
              }
            })
          }),
      })
    })
  })
}

function runProjectOpenSmoke(godot) {
  run(godot, ['--headless', '--path', demoDir, '--quit'], {
    stdio: 'inherit',
  })
  console.log('[smoke-godot] html-demo opened successfully')
}

function importProjectAssets(godot) {
  console.log('[smoke-godot] importing html-demo assets')
  run(godot, ['--headless', '--path', demoDir, '--import'], {
    stdio: 'inherit',
  })
}

async function runLifecycleSmoke(godot) {
  console.log('[smoke-godot] building html-demo')
  run(npmCommand, ['run', 'build', '--workspace=html-demo'], {
    stdio: 'inherit',
  })

  importProjectAssets(godot)

  const fetchSmokeServer = await startFetchSmokeServer()

  console.log('[smoke-godot] running html-demo lifecycle smoke')
  try {
    const result = await runAsync(godot, ['--headless', '--path', demoDir], {
      env: {
        ...process.env,
        VUE_GODOT_SMOKE: '1',
        VUE_GODOT_SMOKE_RELOADS: process.env.VUE_GODOT_SMOKE_RELOADS ?? '3',
        VUE_GODOT_SMOKE_FETCH_TEXT: FETCH_SMOKE_TEXT,
        VUE_GODOT_SMOKE_FETCH_URL: fetchSmokeServer.url,
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
  } finally {
    await fetchSmokeServer.close()
  }
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
    await runLifecycleSmoke(godot)
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
