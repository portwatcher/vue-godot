import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  assertFileExists,
  createPackedPackageOverrides,
  nodeCommand,
  npmCommand,
  requireBuiltCli,
  resolveGodotCommand,
  run,
} from './smoke-utils.mjs'

const SMOKE_MARKER_PREFIX = '[vue-godot-generated-smoke]'
const WATCH_TIMEOUT_MS = 30_000
const INITIAL_MARKER = `generated initial ${Date.now()}`
const UPDATED_MARKER = `generated rebuilt ${Date.now()}`

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitFor(predicate, description, timeoutMs = WATCH_TIMEOUT_MS) {
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeoutMs) {
    if (predicate()) {
      return
    }
    await delay(200)
  }
  throw new Error(`Timed out waiting for ${description}`)
}

function directoryContainsText(dir, text) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (directoryContainsText(absolutePath, text)) {
        return true
      }
      continue
    }
    if (
      entry.isFile() &&
      fs.readFileSync(absolutePath, 'utf-8').includes(text)
    ) {
      return true
    }
  }
  return false
}

async function stopProcess(child) {
  if (child.exitCode !== null || child.signalCode !== null) {
    return
  }

  const closed = new Promise((resolve) => child.once('close', resolve))
  child.kill('SIGTERM')
  await Promise.race([
    closed,
    delay(3_000).then(() => {
      if (child.exitCode === null && child.signalCode === null) {
        child.kill('SIGKILL')
      }
    }),
  ])
  if (child.exitCode === null && child.signalCode === null) {
    await closed
  }
}

function writeSmokeApp(projectDir, marker) {
  const appVuePath = path.join(projectDir, 'vue/src/App.vue')
  fs.writeFileSync(
    appVuePath,
    `<template>
  <div :style="{ flexDirection: 'column', gap: 8, padding: 12 }">
    <span :style="{ fontSize: 20, color: '#f8fafc' }">{{ marker }}</span>
    <button @click="count++">Clicked {{ count }} times</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const marker = ${JSON.stringify(marker)}
const count = ref(0)

onMounted(() => {
  console.log(${JSON.stringify(SMOKE_MARKER_PREFIX)} + ' ' + marker)
})
</script>
`,
  )
}

function assertVueSourceIgnoredByGodot(projectDir) {
  assertFileExists(
    path.join(projectDir, 'vue/.gdignore'),
    'generated Vue directory .gdignore',
  )
}

async function runGodotUntilMarker(godot, projectDir, marker) {
  const expected = `${SMOKE_MARKER_PREFIX} ${marker}`

  const child = await new Promise((resolve, reject) => {
    const child = spawn(godot, ['--headless', '--path', projectDir], {
      cwd: projectDir,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let output = ''
    let didSettle = false

    const timeout = setTimeout(() => {
      child.kill('SIGTERM')
      if (!didSettle) {
        didSettle = true
        reject(
          new Error(
            `Timed out waiting for generated Godot marker "${expected}"\n${output}`,
          ),
        )
      }
    }, WATCH_TIMEOUT_MS)

    function handleOutput(chunk) {
      output += chunk
      if (!didSettle && output.includes(expected)) {
        didSettle = true
        clearTimeout(timeout)
        resolve(child)
      }
    }

    child.stdout.setEncoding('utf-8')
    child.stderr.setEncoding('utf-8')
    child.stdout.on('data', handleOutput)
    child.stderr.on('data', handleOutput)
    child.on('error', (error) => {
      if (!didSettle) {
        didSettle = true
        clearTimeout(timeout)
        reject(error)
      }
    })
    child.on('close', (code, signal) => {
      if (!didSettle) {
        didSettle = true
        clearTimeout(timeout)
        reject(
          new Error(
            [
              `Godot exited before generated marker "${expected}"`,
              `status=${code ?? signal ?? 'unknown'}`,
              output,
            ]
              .filter(Boolean)
              .join('\n'),
          ),
        )
      }
    })
  })

  await stopProcess(child)
}

function startWatch(projectDir) {
  const child = spawn(npmCommand, ['run', 'dev'], {
    cwd: projectDir,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  const state = {
    stdout: '',
    stderr: '',
    exited: false,
  }

  child.stdout.setEncoding('utf-8')
  child.stderr.setEncoding('utf-8')
  child.stdout.on('data', (chunk) => {
    state.stdout += chunk
  })
  child.stderr.on('data', (chunk) => {
    state.stderr += chunk
  })
  child.on('close', () => {
    state.exited = true
  })

  return {
    state,
    stop: () => stopProcess(child),
  }
}

const godot = resolveGodotCommand()
if (!godot) {
  console.log(
    '[smoke-generated-godot] skipped: set GODOT_BIN or install a godot/godot4 executable',
  )
  process.exit(0)
}

const cliPath = requireBuiltCli()
const workspaceDir = fs.mkdtempSync(
  path.join(os.tmpdir(), 'vue-godot-generated-godot-smoke-'),
)
const packDir = path.join(workspaceDir, 'packs')
const projectDir = path.join(workspaceDir, 'html-app')
fs.mkdirSync(packDir)

const packageOverrides = createPackedPackageOverrides(packDir)
const env = {
  ...process.env,
  VUE_GODOT_PACKAGE_OVERRIDES: JSON.stringify(packageOverrides),
}

console.log(`[smoke-generated-godot] workspace: ${workspaceDir}`)
run(nodeCommand, [cliPath, 'create', projectDir, '-f', '--html'], {
  env,
  stdio: 'inherit',
})
assertVueSourceIgnoredByGodot(projectDir)

writeSmokeApp(projectDir, INITIAL_MARKER)
run(npmCommand, ['run', 'build'], {
  cwd: projectDir,
  env,
  stdio: 'inherit',
})
run(godot, ['--headless', '--path', projectDir, '--import'], {
  stdio: 'inherit',
})
await runGodotUntilMarker(godot, projectDir, INITIAL_MARKER)

const watcher = startWatch(projectDir)
try {
  await waitFor(
    () =>
      watcher.state.exited ||
      /built in \d/.test(watcher.state.stdout + watcher.state.stderr),
    'initial generated app Vite watch build',
  )
  if (watcher.state.exited) {
    throw new Error(
      [
        'Generated app watcher exited before rebuild',
        watcher.state.stdout,
        watcher.state.stderr,
      ]
        .filter(Boolean)
        .join('\n'),
    )
  }

  writeSmokeApp(projectDir, UPDATED_MARKER)
  await waitFor(
    () => directoryContainsText(path.join(projectDir, 'dist'), UPDATED_MARKER),
    'generated app watch rebuild output',
  )
} finally {
  await watcher.stop()
}

await runGodotUntilMarker(godot, projectDir, UPDATED_MARKER)
console.log('[smoke-generated-godot] generated HTML app Godot smoke passed')
