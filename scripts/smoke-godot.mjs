import http from 'node:http'
import path from 'node:path'
import {
  assertNoGodotScriptLoadErrors,
  assertOfficialGodotExecutable,
  godotCommandArguments,
  installBuiltRuntime,
  npmCommand,
  repoRoot,
  resolveGodotCommand,
  run,
  runAsync,
} from './smoke-utils.mjs'

const htmlDemoDir = path.join(repoRoot, 'apps/html-demo')
const SMOKE_PASS_MARKER = '[vue-godot-smoke] passed'
const FETCH_SMOKE_PATH = '/vue-godot-fetch-smoke'
const FETCH_SMOKE_TEXT = 'vue-godot fetch smoke ok'
const exampleSmokeApps = [
  {
    id: 'native-app-demo',
    workspace: 'native-app-demo',
    dir: path.join(repoRoot, 'apps/native-app-demo'),
    marker: '[vue-godot-smoke] native-app-demo passed',
  },
  {
    id: 'game-ui-demo',
    workspace: 'game-ui-demo',
    dir: path.join(repoRoot, 'apps/game-ui-demo'),
    marker: '[vue-godot-smoke] game-ui-demo passed',
  },
]

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

function runProjectOpenSmoke(godot, appDir, label) {
  installBuiltRuntime(appDir)
  run(
    godot,
    godotCommandArguments(['--headless', '--path', appDir, '--quit']),
    {
      stdio: 'inherit',
    },
  )
  console.log(`[smoke-godot] ${label} opened successfully`)
}

function prepareProject(appDir, workspace, label) {
  console.log(`[smoke-godot] installing runtime for ${label}`)
  installBuiltRuntime(appDir)

  console.log(`[smoke-godot] generating ${label} declarations`)
  run(npmCommand, ['run', 'gen:types', `--workspace=${workspace}`], {
    stdio: 'inherit',
  })

  console.log(`[smoke-godot] building ${label}`)
  run(npmCommand, ['run', 'build', `--workspace=${workspace}`], {
    stdio: 'inherit',
  })
}

function importProjectAssets(godot, appDir, label) {
  console.log(`[smoke-godot] importing ${label} assets`)
  run(
    godot,
    godotCommandArguments(['--headless', '--path', appDir, '--import']),
    {
      stdio: 'inherit',
    },
  )
}

async function runLifecycleSmoke(godot) {
  prepareProject(htmlDemoDir, 'html-demo', 'html-demo')

  importProjectAssets(godot, htmlDemoDir, 'html-demo')

  const fetchSmokeServer = await startFetchSmokeServer()

  console.log('[smoke-godot] running html-demo lifecycle smoke')
  try {
    const result = await runAsync(
      godot,
      godotCommandArguments(['--headless', '--path', htmlDemoDir]),
      {
        env: {
          ...process.env,
          VUE_GODOT_SMOKE: '1',
          VUE_GODOT_SMOKE_RELOADS: process.env.VUE_GODOT_SMOKE_RELOADS ?? '3',
          VUE_GODOT_SMOKE_FETCH_TEXT: FETCH_SMOKE_TEXT,
          VUE_GODOT_SMOKE_FETCH_URL: fetchSmokeServer.url,
        },
        streamOutput: true,
        timeout: 60_000,
      },
    )

    const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`
    assertNoGodotScriptLoadErrors(output, 'html-demo Godot lifecycle smoke')
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

async function runExampleSmoke(godot, app) {
  prepareProject(app.dir, app.workspace, app.id)

  importProjectAssets(godot, app.dir, app.id)

  console.log(`[smoke-godot] running ${app.id} smoke`)
  const result = await runAsync(
    godot,
    godotCommandArguments(['--headless', '--path', app.dir]),
    {
      env: {
        ...process.env,
        VUE_GODOT_SMOKE: '1',
      },
      streamOutput: true,
      timeout: 60_000,
    },
  )

  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`
  assertNoGodotScriptLoadErrors(output, `${app.id} Godot smoke`)
  if (!output.includes(app.marker)) {
    throw new Error(
      `${app.id} Godot smoke did not print pass marker: ${app.marker}`,
    )
  }

  console.log(`[smoke-godot] ${app.id} smoke passed`)
}

const godot = resolveGodotCommand()
if (!godot) {
  console.log(
    '[smoke-godot] skipped: set GODOT_BIN or install a godot/godot4 executable',
  )
  process.exit(0)
}
assertOfficialGodotExecutable(godot)

try {
  if (process.env.VUE_GODOT_SMOKE_OPEN_ONLY === '1') {
    runProjectOpenSmoke(godot, htmlDemoDir, 'html-demo')
    for (const app of exampleSmokeApps) {
      runProjectOpenSmoke(godot, app.dir, app.id)
    }
  } else {
    await runLifecycleSmoke(godot)
    for (const app of exampleSmokeApps) {
      await runExampleSmoke(godot, app)
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
