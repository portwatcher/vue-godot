import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url))
const packageDirectory = path.resolve(moduleDirectory, '..')
const declarationFiles = [
  'godot.d.ts',
  'godot-js.d.ts',
  'godot-jsb.d.ts',
  'index.d.ts',
  'manifest.json',
] as const

export interface ProjectTypeOptions {
  projectDirectory: string
  outputDirectory?: string
  godotExecutable?: string
}

export interface ProjectTypeResult {
  outputDirectory: string
  files: readonly string[]
  source: 'packaged' | 'stock-godot'
}

function sha256(filePath: string): string {
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')
}

function assertProjectDirectory(directory: string): string {
  const resolved = path.resolve(directory)
  if (!fs.statSync(path.join(resolved, 'project.godot')).isFile()) {
    throw new Error(`Godot project file does not exist: ${resolved}`)
  }
  return resolved
}

function resolveOutputDirectory(
  projectDirectory: string,
  outputDirectory?: string,
): string {
  const resolved = path.resolve(
    projectDirectory,
    outputDirectory ?? 'typings',
  )
  const relative = path.relative(projectDirectory, resolved)
  if (
    relative === '' ||
    relative === '..' ||
    relative.startsWith(`..${path.sep}`)
  ) {
    throw new Error(`Type output must be inside the Godot project: ${resolved}`)
  }
  return resolved
}

export function generateProjectTypes(
  options: ProjectTypeOptions,
): ProjectTypeResult {
  const projectDirectory = assertProjectDirectory(options.projectDirectory)
  const outputDirectory = resolveOutputDirectory(
    projectDirectory,
    options.outputDirectory,
  )
  fs.mkdirSync(outputDirectory, { recursive: true })

  if (options.godotExecutable) {
    const generatorPath = path.join(
      packageDirectory,
      'scripts/generate-types.mjs',
    )
    const result = spawnSync(
      process.execPath,
      [
        generatorPath,
        '--godot',
        path.resolve(options.godotExecutable),
        '--out-dir',
        outputDirectory,
      ],
      { cwd: projectDirectory, encoding: 'utf-8' },
    )
    if (result.error || result.status !== 0) {
      const detail = result.error
        ? result.error.message
        : `${result.stdout ?? ''}${result.stderr ?? ''}`.trim()
      throw new Error(`Stock-Godot type generation failed: ${detail}`)
    }
  } else {
    const templates = path.join(packageDirectory, 'templates/typings')
    for (const name of declarationFiles) {
      const source = path.join(templates, name)
      const destination = path.join(outputDirectory, name)
      if (!fs.existsSync(destination) || sha256(source) !== sha256(destination)) {
        fs.copyFileSync(source, destination)
      }
    }
  }

  return {
    outputDirectory,
    files: declarationFiles,
    source: options.godotExecutable ? 'stock-godot' : 'packaged',
  }
}
