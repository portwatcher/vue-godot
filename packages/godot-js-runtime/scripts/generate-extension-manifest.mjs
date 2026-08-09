import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const scriptPath = fileURLToPath(import.meta.url)
const packageRoot = path.resolve(path.dirname(scriptPath), '..')
const repoRoot = path.resolve(packageRoot, '../..')
const addonRoot = path.join(packageRoot, 'addon/godot-js-runtime')
const templatePath = path.join(
  packageRoot,
  'native/godot_js_runtime.gdextension.in',
)

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function sha256File(filePath) {
  const hash = createHash('sha256')
  hash.update(fs.readFileSync(filePath))
  return hash.digest('hex')
}

function resolveGitCommit() {
  if (process.env.GODOT_JS_RUNTIME_GIT_COMMIT) {
    return process.env.GODOT_JS_RUNTIME_GIT_COMMIT
  }
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: repoRoot,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return 'unknown'
  }
}

function collectArtifacts(binDir) {
  if (!fs.existsSync(binDir)) {
    return []
  }

  const files = []
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        visit(absolutePath)
      } else if (entry.isFile() && entry.name !== '.gitkeep') {
        files.push(absolutePath)
      }
    }
  }
  visit(binDir)

  return files
    .sort((left, right) => left.localeCompare(right))
    .map((filePath) => {
      const name = path.relative(binDir, filePath).split(path.sep).join('/')
      const match = name.match(
        /^libgodot_js_runtime\.([^.]+)\.([^.]+)(?:\.([^.]+))?/,
      )
      return {
        name,
        target: match
          ? [match[1], match[2], match[3]].filter(Boolean).join('.')
          : 'unknown',
        size: fs.statSync(filePath).size,
        sha256: sha256File(filePath),
      }
    })
}

export function generateExtensionManifest(options = {}) {
  const packageJson = readJson(path.join(packageRoot, 'package.json'))
  const dependencyLock = readJson(
    path.join(packageRoot, 'native/deps.lock.json'),
  )
  const extensionTemplate = fs.readFileSync(templatePath, 'utf-8')
  const godotMinimum = '4.4'
  const extension = extensionTemplate.replaceAll(
    '{{GODOT_MINIMUM}}',
    godotMinimum,
  )
  const manifest = {
    schemaVersion: 1,
    runtimeName: 'Godot JavaScript Runtime',
    packageName: packageJson.name,
    version: packageJson.version,
    gitCommit:
      options.gitCommit ??
      (packageJson.version.includes('development')
        ? 'development'
        : resolveGitCommit()),
    godotMinimum,
    dependencies: Object.values(dependencyLock.dependencies)
      .filter((dependency) => dependency.kind === 'source-archive')
      .map((dependency) => ({
        name: dependency.name,
        repository: dependency.repository,
        commit: dependency.commit,
        license: dependency.license,
      }))
      .sort((left, right) => left.name.localeCompare(right.name)),
    artifacts:
      options.includeArtifacts === true
        ? collectArtifacts(path.join(addonRoot, 'bin'))
        : [],
  }

  if (options.write !== false) {
    fs.mkdirSync(addonRoot, { recursive: true })
    fs.writeFileSync(
      path.join(addonRoot, 'godot_js_runtime.gdextension'),
      extension,
    )
    fs.writeFileSync(
      path.join(addonRoot, 'runtime-manifest.json'),
      `${JSON.stringify(manifest, null, 2)}\n`,
    )
  }
  return manifest
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  const argumentsList = process.argv.slice(2)
  const unknown = argumentsList.filter(
    (argument) => argument !== '--include-artifacts',
  )
  if (unknown.length > 0) {
    throw new Error(`Unknown option: ${unknown[0]}`)
  }
  const manifest = generateExtensionManifest({
    includeArtifacts: argumentsList.includes('--include-artifacts'),
  })
  console.log(
    `[manifest] wrote ${manifest.artifacts.length} artifact record(s) for ${manifest.version}`,
  )
}
