import { spawn, spawnSync } from 'node:child_process'
import crypto from 'node:crypto'
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

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function hashDirectory(dir) {
  const hash = crypto.createHash('sha256')

  function visit(currentDir, relativeBase = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
    entries.sort((a, b) => a.name.localeCompare(b.name))

    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name)
      const relativePath = path.join(relativeBase, entry.name)

      if (entry.isDirectory()) {
        visit(absolutePath, relativePath)
        continue
      }

      if (entry.isFile()) {
        hash.update(relativePath)
        hash.update('\0')
        hash.update(fs.readFileSync(absolutePath))
        hash.update('\0')
      }
    }
  }

  visit(dir)
  return hash.digest('hex')
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

function countMatches(value, pattern) {
  return [...value.matchAll(pattern)].length
}

async function stopWatchProcess(child) {
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

async function waitForWatchCondition(state, description, predicate) {
  const startedAt = Date.now()
  while (Date.now() - startedAt < 30_000) {
    if (predicate()) {
      return
    }
    if (state.exited) {
      throw new Error(
        [
          `Watch process exited before ${description}`,
          state.stdout,
          state.stderr,
        ]
          .filter(Boolean)
          .join('\n'),
      )
    }
    await delay(200)
  }

  throw new Error(
    [
      `Timed out waiting for ${description}`,
      state.stdout,
      state.stderr,
    ]
      .filter(Boolean)
      .join('\n'),
  )
}

async function smokeWatchRebuild(target, env) {
  const appVuePath = path.join(target, 'vue/src/App.vue')
  const distDir = path.join(target, 'dist')
  const source = fs.readFileSync(appVuePath, 'utf-8')
  const initialMarker = 'Hello from Vue Godot HTML'

  if (!source.includes(initialMarker)) {
    throw new Error(
      `Unable to locate expected generated text in ${appVuePath}`,
    )
  }
  if (!directoryContainsText(distDir, initialMarker)) {
    throw new Error(`Unable to locate initial generated text in ${distDir}`)
  }

  const state = {
    stdout: '',
    stderr: '',
    exited: false,
  }
  const child = spawn(npmCommand, ['run', 'dev'], {
    cwd: target,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

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

  try {
    await waitForWatchCondition(state, 'initial Vite watch build', () =>
      /built in \d/.test(state.stdout + state.stderr),
    )

    const initialBuildCount = countMatches(
      state.stdout + state.stderr,
      /built in \d/g,
    )
    const beforeHash = hashDirectory(distDir)
    const replacement = `Hello from Vue Godot HTML smoke ${Date.now()}`
    fs.writeFileSync(appVuePath, source.replace(initialMarker, replacement))

    await waitForWatchCondition(state, 'Vite watch rebuild output', () => {
      const output = state.stdout + state.stderr
      return (
        countMatches(output, /built in \d/g) > initialBuildCount &&
        hashDirectory(distDir) !== beforeHash &&
        directoryContainsText(distDir, replacement)
      )
    })

    console.log('[smoke-cli] html-app npm run dev rebuild smoke passed')
  } finally {
    fs.writeFileSync(appVuePath, source)
    await stopWatchProcess(child)
  }
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
  return target
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
const htmlAppDir = smokeProject(
  cliPath,
  workspaceDir,
  'html-app',
  ['--html'],
  env,
)
await smokeWatchRebuild(htmlAppDir, env)
console.log('[smoke-cli] create and create --html smoke checks passed')
