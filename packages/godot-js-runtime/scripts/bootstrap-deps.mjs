import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptPath = fileURLToPath(import.meta.url)
const packageRoot = path.resolve(path.dirname(scriptPath), '..')
const repoRoot = path.resolve(packageRoot, '../..')
const lockPath = path.join(packageRoot, 'native/deps.lock.json')
const defaultCacheDir = path.join(
  repoRoot,
  '.cache/godot-js-runtime/dependencies',
)
const defaultDepsDir = path.join(packageRoot, 'native/third_party')

function readLock() {
  return JSON.parse(fs.readFileSync(lockPath, 'utf-8'))
}

export function sha256File(filePath) {
  const hash = createHash('sha256')
  hash.update(fs.readFileSync(filePath))
  return hash.digest('hex')
}

function assertInside(parent, candidate, description) {
  const relative = path.relative(path.resolve(parent), path.resolve(candidate))
  if (
    relative === '' ||
    relative.startsWith(`..${path.sep}`) ||
    relative === '..'
  ) {
    throw new Error(`${description} must be a child of ${parent}: ${candidate}`)
  }
}

async function downloadArchive(dependency, cacheDir) {
  const archivePath = path.join(cacheDir, dependency.archiveName)
  fs.mkdirSync(cacheDir, { recursive: true })

  if (fs.existsSync(archivePath)) {
    const actualHash = sha256File(archivePath)
    if (actualHash !== dependency.sha256) {
      throw new Error(
        `Cached ${dependency.name} hash mismatch: expected ${dependency.sha256}, received ${actualHash}`,
      )
    }
    return archivePath
  }

  const response = await fetch(dependency.url, { redirect: 'follow' })
  if (!response.ok) {
    throw new Error(
      `Unable to download ${dependency.name}: HTTP ${response.status} ${response.statusText}`,
    )
  }
  const bytes = Buffer.from(await response.arrayBuffer())
  const actualHash = createHash('sha256').update(bytes).digest('hex')
  if (actualHash !== dependency.sha256) {
    throw new Error(
      `Downloaded ${dependency.name} hash mismatch: expected ${dependency.sha256}, received ${actualHash}`,
    )
  }

  const partialPath = `${archivePath}.partial-${process.pid}`
  fs.writeFileSync(partialPath, bytes, { flag: 'wx' })
  fs.renameSync(partialPath, archivePath)
  return archivePath
}

function validateTarEntries(archivePath, dependencyName) {
  const result = spawnSync('tar', ['-tzf', archivePath], {
    encoding: 'utf-8',
  })
  if (result.status !== 0) {
    throw new Error(
      `Unable to inspect ${dependencyName} archive: ${result.stderr || result.stdout}`,
    )
  }

  for (const entry of result.stdout.split(/\r?\n/).filter(Boolean)) {
    const normalized = path.posix.normalize(entry.replace(/^\.\//, ''))
    if (
      path.posix.isAbsolute(entry) ||
      normalized === '..' ||
      normalized.startsWith('../')
    ) {
      throw new Error(
        `${dependencyName} archive contains unsafe path: ${entry}`,
      )
    }
  }
}

function markerMatches(markerPath, dependency) {
  if (!fs.existsSync(markerPath)) {
    return false
  }
  const marker = JSON.parse(fs.readFileSync(markerPath, 'utf-8'))
  return (
    marker.name === dependency.name &&
    marker.commit === dependency.commit &&
    marker.sha256 === dependency.sha256
  )
}

function verifyRequiredFiles(targetDir, dependency) {
  for (const fileName of dependency.requiredFiles) {
    const requiredPath = path.join(targetDir, fileName)
    if (!fs.existsSync(requiredPath)) {
      throw new Error(
        `${dependency.name} archive is missing required file: ${fileName}`,
      )
    }
  }
}

function extractSourceDependency(dependency, archivePath, depsDir, force) {
  const targetDir = path.join(depsDir, dependency.destination)
  const markerPath = path.join(targetDir, '.godot-js-runtime-dependency.json')

  if (fs.existsSync(targetDir) && markerMatches(markerPath, dependency)) {
    verifyRequiredFiles(targetDir, dependency)
    console.log(`[bootstrap] using pinned ${dependency.name} at ${targetDir}`)
    return targetDir
  }

  if (fs.existsSync(targetDir)) {
    if (!force) {
      throw new Error(
        `${targetDir} does not match deps.lock.json; rerun with --force after reviewing local changes`,
      )
    }
    assertInside(depsDir, targetDir, 'Dependency target')
    fs.rmSync(targetDir, { recursive: true, force: true })
  }

  validateTarEntries(archivePath, dependency.name)
  fs.mkdirSync(depsDir, { recursive: true })
  const stagingDir = fs.mkdtempSync(path.join(depsDir, '.extract-'))
  try {
    const result = spawnSync(
      'tar',
      ['-xzf', archivePath, '-C', stagingDir, '--strip-components=1'],
      { encoding: 'utf-8' },
    )
    if (result.status !== 0) {
      throw new Error(
        `Unable to extract ${dependency.name}: ${result.stderr || result.stdout}`,
      )
    }
    verifyRequiredFiles(stagingDir, dependency)
    fs.writeFileSync(
      path.join(stagingDir, '.godot-js-runtime-dependency.json'),
      `${JSON.stringify(
        {
          name: dependency.name,
          commit: dependency.commit,
          sha256: dependency.sha256,
        },
        null,
        2,
      )}\n`,
    )
    fs.renameSync(stagingDir, targetDir)
  } catch (error) {
    fs.rmSync(stagingDir, { recursive: true, force: true })
    throw error
  }

  console.log(`[bootstrap] extracted ${dependency.name} to ${targetDir}`)
  return targetDir
}

export function resolveBootstrapPlan(options = {}) {
  const lock = readLock()
  const cacheDir = path.resolve(options.cacheDir ?? defaultCacheDir)
  const depsDir = path.resolve(options.depsDir ?? defaultDepsDir)
  return {
    cacheDir,
    depsDir,
    lockPath,
    dependencies: Object.values(lock.dependencies).map((dependency) => ({
      ...dependency,
      archivePath: path.join(cacheDir, dependency.archiveName),
      destinationPath:
        dependency.kind === 'source-archive'
          ? path.join(depsDir, dependency.destination)
          : null,
    })),
  }
}

export async function bootstrapDependencies(options = {}) {
  const plan = resolveBootstrapPlan(options)
  const results = {}

  for (const dependency of plan.dependencies) {
    const archivePath = await downloadArchive(dependency, plan.cacheDir)
    if (dependency.kind === 'source-archive') {
      results[dependency.name] = extractSourceDependency(
        dependency,
        archivePath,
        plan.depsDir,
        options.force === true,
      )
    } else {
      results[dependency.name] = archivePath
      console.log(
        `[bootstrap] verified pinned ${dependency.name} at ${archivePath}`,
      )
    }
  }

  return { ...plan, results }
}

function parseArgs(argv) {
  const options = { force: false, print: false }
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === '--force') {
      options.force = true
    } else if (argument === '--print') {
      options.print = true
    } else if (argument === '--cache-dir' || argument === '--deps-dir') {
      const value = argv[++index]
      if (!value) {
        throw new Error(`${argument} requires a path`)
      }
      options[argument === '--cache-dir' ? 'cacheDir' : 'depsDir'] = value
    } else {
      throw new Error(`Unknown option: ${argument}`)
    }
  }
  return options
}

async function runCli() {
  const options = parseArgs(process.argv.slice(2))
  if (options.print) {
    console.log(JSON.stringify(resolveBootstrapPlan(options), null, 2))
    return
  }
  await bootstrapDependencies(options)
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    await runCli()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}
