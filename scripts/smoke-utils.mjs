import { spawn, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  assertOfficialGodotExecutable,
  godotCommandArguments,
  readGodotVersion,
} from '../packages/godot-js-runtime/scripts/godot-command.mjs'

const __filename = fileURLToPath(import.meta.url)

export const repoRoot = path.resolve(path.dirname(__filename), '..')
export const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
export const nodeCommand = process.execPath
export const canKillProcessGroup = process.platform !== 'win32'
export {
  assertOfficialGodotExecutable,
  godotCommandArguments,
  readGodotVersion,
}

export const packageDirs = {
  '@vue-godot/browser': 'packages/browser',
  '@vue-godot/cli': 'packages/cli',
  '@vue-godot/device': 'packages/device',
  '@vue-godot/html': 'packages/html',
  '@vue-godot/runtime-tscn': 'packages/runtime-tscn',
}

const runtimePackageDir = path.join(repoRoot, 'packages/godot-js-runtime')

const GODOT_SCRIPT_LOAD_ERROR_PATTERNS = [
  /\[jsb\]\[Error\]/,
  /\[vue-godot\] Unable to (?:connect|disconnect) signal/,
  /failed to check out module/,
  /javascript file is missing/,
  /something went wrong on loading/,
  /unknown module:/,
  /Resource file not found:/,
  /Error loading resource:/,
  /Attempt to (?:connect|disconnect) nonexistent signal/,
  /CameraServer is not actively monitoring feeds/,
]

const GODOT_IMPORT_TIMEOUT_MS = 60_000
const godotExecutableNamePattern = /^godot(?:4|[._-].*)?(?:\.exe)?$/i
const godotDirectorySearchDepth = 4

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function waitFor(predicate, description, timeoutMs = 30_000) {
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeoutMs) {
    if (predicate()) {
      return
    }
    await delay(200)
  }
  throw new Error(`Timed out waiting for ${description}`)
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

export function runAsync(command, args, options = {}) {
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
      options.onStdoutChunk?.(chunk)
      if (options.streamOutput) {
        process.stdout.write(chunk)
      }
    })
    child.stderr.on('data', (chunk) => {
      stderr += chunk
      options.onStderrChunk?.(chunk)
      if (options.streamOutput) {
        process.stderr.write(chunk)
      }
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

      if (status !== 0 && !options.allowFailure) {
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

      resolve({ stdout, stderr, status, signal })
    })
  })
}

export async function stopProcess(child) {
  if (child.exitCode !== null || child.signalCode !== null) {
    return
  }

  let didClose = false
  const closed = new Promise((resolve) => {
    child.once('close', () => {
      didClose = true
      resolve()
    })
  })

  function sendSignal(signal) {
    if (canKillProcessGroup && child.pid) {
      try {
        process.kill(-child.pid, signal)
        return
      } catch {
        // Fall back to the direct child below. The child may not be a process
        // group leader when it was not spawned with detached: true.
      }
    }
    child.kill(signal)
  }

  sendSignal('SIGTERM')
  await Promise.race([closed, delay(3_000)])

  if (!didClose && child.exitCode === null && child.signalCode === null) {
    sendSignal('SIGKILL')
    await Promise.race([closed, delay(3_000)])
  }

  if (!didClose) {
    console.warn(
      `[smoke-utils] process ${child.pid ?? '<unknown>'} did not close after SIGKILL`,
    )
  }
}

export function startNpmDevWatch(projectDir, env = process.env) {
  const child = spawn(npmCommand, ['run', 'dev'], {
    cwd: projectDir,
    env,
    detached: canKillProcessGroup,
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

function isMissingPathError(error) {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === 'ENOENT'
  )
}

export function directoryContainsText(dir, text) {
  try {
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
  } catch (error) {
    // Vite can remove an output path between listing and reading it while
    // emptying dist for a watch rebuild. Let waitFor retry the next snapshot.
    if (isMissingPathError(error)) {
      return false
    }
    throw error
  }
  return false
}

export function assertStableViteChunkNames(projectDir) {
  const distDir = path.join(projectDir, 'dist')
  const unstableChunkPaths = []
  const hashedChunkPattern = /(?:^|[/\\])[^/\\]+-[A-Za-z0-9_-]{8,}\.js$/

  function visit(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        visit(absolutePath)
        continue
      }
      if (!entry.isFile()) {
        continue
      }

      const relativePath = path.relative(distDir, absolutePath)
      if (hashedChunkPattern.test(relativePath)) {
        unstableChunkPaths.push(relativePath)
      }
    }
  }

  visit(distDir)
  if (unstableChunkPaths.length > 0) {
    throw new Error(
      [
        'Generated Vite output must use stable JS chunk names for Godot editor reloads',
        ...unstableChunkPaths.map((filePath) => `- ${filePath}`),
      ].join('\n'),
    )
  }
}

export function relevantGodotDiagnosticLines(output) {
  return output
    .split(/\r?\n/)
    .filter((line) =>
      GODOT_SCRIPT_LOAD_ERROR_PATTERNS.some((pattern) => pattern.test(line)),
    )
    .join('\n')
}

export function assertNoGodotScriptLoadErrors(output, context) {
  if (
    !GODOT_SCRIPT_LOAD_ERROR_PATTERNS.some((pattern) => pattern.test(output))
  ) {
    return
  }

  const diagnostics = relevantGodotDiagnosticLines(output)
  throw new Error(
    [
      `${context} printed runtime script-load, asset-load, or signal wiring diagnostics`,
      diagnostics || output,
    ]
      .filter(Boolean)
      .join('\n'),
  )
}

export function runGodotImport(godot, projectDir) {
  const result = spawnSync(
    godot,
    godotCommandArguments([
      '--headless',
      '--path',
      projectDir,
      '--import',
      '--quit',
    ]),
    {
      cwd: projectDir,
      env: process.env,
      encoding: 'utf-8',
      stdio: 'pipe',
      timeout: GODOT_IMPORT_TIMEOUT_MS,
      maxBuffer: 10 * 1024 * 1024,
    },
  )
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`

  if (result.stdout) {
    process.stdout.write(result.stdout)
  }
  if (result.stderr) {
    process.stderr.write(result.stderr)
  }

  if (result.status !== 0) {
    throw new Error(
      [
        `Godot import failed (${result.status ?? result.signal ?? 'unknown'})`,
        result.error instanceof Error ? result.error.message : '',
        output,
      ]
        .filter(Boolean)
        .join('\n'),
    )
  }

  assertNoGodotScriptLoadErrors(output, 'Godot import')
}

export async function runGodotProjectUntilMarker(
  godot,
  projectDir,
  marker,
  context,
  timeoutMs = 30_000,
) {
  let output = ''

  const child = await new Promise((resolve, reject) => {
    const child = spawn(
      godot,
      godotCommandArguments(['--headless', '--path', projectDir]),
      {
        cwd: projectDir,
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    )

    let didSettle = false
    const timeout = setTimeout(() => {
      child.kill('SIGTERM')
      if (!didSettle) {
        didSettle = true
        reject(
          new Error(
            `Timed out waiting for ${context} marker ${JSON.stringify(marker)}\n${output}`,
          ),
        )
      }
    }, timeoutMs)

    function handleOutput(chunk) {
      output += chunk
      if (!didSettle && output.includes(marker)) {
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
              `Godot exited before ${context} marker ${JSON.stringify(marker)}`,
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
  assertNoGodotScriptLoadErrors(output, context)
  return output
}

export function commandExists(command) {
  const probe = spawnSync(command, godotCommandArguments(['--version']), {
    encoding: 'utf-8',
    stdio: 'pipe',
  })
  return probe.status === 0
}

export function assertFileExists(filePath, description = filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${description} not found: ${filePath}`)
  }
}

export function assertVueSourceIgnoredByGodot(projectDir) {
  assertFileExists(
    path.join(projectDir, 'vue/.gdignore'),
    'generated Vue directory .gdignore',
  )
}

export function assertGeneratedOutputIgnoredByGodot(projectDir) {
  assertFileExists(
    path.join(projectDir, 'gen/.gdignore'),
    'generated runtime resource type output .gdignore',
  )
}

function isExecutableFile(filePath) {
  try {
    const stat = fs.statSync(filePath)
    if (!stat.isFile()) {
      return false
    }

    if (process.platform === 'win32') {
      return true
    }

    return (stat.mode & 0o111) !== 0
  } catch {
    return false
  }
}

function godotCandidateRank(filePath) {
  const name = path.basename(filePath).toLowerCase()
  if (name === 'godot4') return 0
  if (name === 'godot') return 1
  if (name.includes('editor')) return 2
  return 3
}

function findGodotCandidateInDirectory(directory, requireExecutable) {
  const queue = [{ directory, depth: 0 }]

  while (queue.length > 0) {
    const current = queue.shift()
    const entries = fs
      .readdirSync(current.directory, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name))
    const candidates = []

    for (const entry of entries) {
      const entryPath = path.join(current.directory, entry.name)

      if (entry.isFile() || entry.isSymbolicLink()) {
        if (
          godotExecutableNamePattern.test(entry.name) &&
          (!requireExecutable || isExecutableFile(entryPath))
        ) {
          candidates.push(entryPath)
        }
        continue
      }

      if (entry.isDirectory() && current.depth < godotDirectorySearchDepth) {
        queue.push({ directory: entryPath, depth: current.depth + 1 })
      }
    }

    if (candidates.length > 0) {
      candidates.sort((left, right) => {
        const rank = godotCandidateRank(left) - godotCandidateRank(right)
        return rank === 0 ? left.localeCompare(right) : rank
      })
      return candidates[0]
    }
  }

  return null
}

export function resolveGodotBin(godotBin, options = {}) {
  if (!godotBin) {
    return null
  }

  const requireExecutable = options.requireExecutable ?? true
  const absoluteGodotBin = path.resolve(godotBin)

  if (!fs.existsSync(absoluteGodotBin)) {
    throw new Error(`GODOT_BIN does not exist: ${godotBin}`)
  }

  const stat = fs.statSync(absoluteGodotBin)
  if (stat.isFile()) {
    if (requireExecutable && !isExecutableFile(absoluteGodotBin)) {
      throw new Error(`GODOT_BIN is not executable: ${godotBin}`)
    }
    return absoluteGodotBin
  }

  if (!stat.isDirectory()) {
    throw new Error(`GODOT_BIN must be a file or directory: ${godotBin}`)
  }

  const candidate = findGodotCandidateInDirectory(
    absoluteGodotBin,
    requireExecutable,
  )
  if (!candidate) {
    throw new Error(
      requireExecutable
        ? `GODOT_BIN directory does not contain an executable named like godot*: ${godotBin}`
        : `GODOT_BIN directory does not contain a file named like godot*: ${godotBin}`,
    )
  }

  return candidate
}

export function resolveGodotCommand(options = {}) {
  const godotBin = options.godotBin ?? process.env.GODOT_BIN
  if (godotBin) {
    return resolveGodotBin(godotBin)
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

export function installBuiltRuntime(projectDir) {
  const source = path.join(runtimePackageDir, 'addon/godotjs')
  const destination = path.join(projectDir, 'addons/godotjs')
  const legacyDestination = path.join(projectDir, 'addons/godot-js-runtime')
  fs.rmSync(legacyDestination, { recursive: true, force: true })
  fs.cpSync(source, destination, { recursive: true })
  const descriptor = path.join(destination, 'godotjs.gdextension')
  if (!fs.existsSync(descriptor)) {
    throw new Error(
      `GodotJS manual copy did not create ${descriptor}`,
    )
  }
  const godotCache = path.join(projectDir, '.godot')
  fs.mkdirSync(godotCache, { recursive: true })
  fs.writeFileSync(
    path.join(godotCache, 'extension_list.cfg'),
    'res://addons/godotjs/godotjs.gdextension\n',
  )
  console.log(
    `[smoke-utils] GodotJS copied to ${path.relative(repoRoot, destination)}`,
  )
  return { addonDirectory: destination }
}

export function createPackedPackageOverrides(packDir) {
  const entries = Object.keys(packageDirs).map((packageName) => [
    packageName,
    `file:${packPackage(packageName, packDir)}`,
  ])
  return Object.fromEntries(entries)
}
