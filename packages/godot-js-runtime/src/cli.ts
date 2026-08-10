#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  addRuntimeTarget,
  availableRuntimeTargets,
  generateProjectTypes,
  installRuntime,
  readRuntimeSourceManifest,
  uninstallRuntime,
  verifyRuntime,
} from './install.js'

interface CliIO {
  log(message: string): void
  error(message: string): void
}

interface ParsedOptions {
  readonly positionals: readonly string[]
  readonly projectDirectory: string
  readonly sourceDirectory?: string
  readonly artifactDirectory?: string
  readonly outputDirectory?: string
  readonly godotExecutable?: string
  readonly targets: readonly string[]
  readonly force: boolean
  readonly json: boolean
  readonly help: boolean
  readonly providedOptions: ReadonlySet<string>
}

const usage = `Usage: godot-js-runtime <command> [options]

Commands:
  install       Install the runtime and a host or selected target
  uninstall     Remove only files owned by the installation manifest
  verify        Verify every installed file and checksum
  add-target    Add one or more packaged export targets
  typegen       Copy packaged types or generate them from stock Godot
  targets       List targets available in the runtime package

Common options:
  --project <dir>   Godot project directory (default: current directory)
  --source <dir>    Runtime package/addon source (development and CI)
  --artifact-dir <dir>
                    Offline directory containing release archives
  --json            Print machine-readable output
  -h, --help        Show command help

Run \`godot-js-runtime <command> --help\` for command-specific options.`

const commandUsage: Readonly<Record<string, string>> = {
  install: `Usage: godot-js-runtime install [project] [options]

Install the core addon plus the host debug artifact. Repeat --target to install
an explicit target instead.

Options:
  --project <dir>   Godot project directory
  --target <name>   Exact packaged target (repeatable)
  --source <dir>    Runtime package/addon source
  --artifact-dir <dir>
                    Offline directory containing release archives
  --force           Replace exact unowned destination-file collisions
  --json            Print machine-readable output`,
  uninstall: `Usage: godot-js-runtime uninstall [project] [options]

Remove the installation manifest and only the files recorded in it. Unowned
files inside addons/godot-js-runtime are preserved.

Options:
  --project <dir>   Godot project directory
  --json            Print machine-readable output`,
  verify: `Usage: godot-js-runtime verify [project] [options]

Verify the installation manifest, file sizes, and SHA-256 checksums.

Options:
  --project <dir>   Godot project directory
  --json            Print machine-readable output`,
  'add-target': `Usage: godot-js-runtime add-target <target...> [options]

Add exact targets listed by \`godot-js-runtime targets\` to an existing
installation without removing its other targets.

Options:
  --project <dir>   Godot project directory
  --target <name>   Additional target (repeatable)
  --source <dir>    Runtime package/addon source
  --artifact-dir <dir>
                    Offline directory containing release archives
  --force           Replace exact unowned destination-file collisions
  --json            Print machine-readable output`,
  typegen: `Usage: godot-js-runtime typegen [project] [options]

Copy the package's pinned declarations into <project>/typings. Pass --godot (or
set GODOT_BIN) to generate version-matched declarations from official Godot.

Options:
  --project <dir>   Godot project directory
  --out <dir>       Output inside the project (default: typings)
  --godot <path>    Official Godot executable
  --json            Print machine-readable output`,
  targets: `Usage: godot-js-runtime targets [options]

List exact targets in the runtime artifact manifest.

Options:
  --source <dir>    Runtime package/addon source
  --json            Print machine-readable output`,
}

function optionValue(argv: readonly string[], index: number): string {
  const value = argv[index + 1]
  if (!value || value.startsWith('-')) {
    throw new Error(`${argv[index]} requires a value`)
  }
  return value
}

function parseOptions(argv: readonly string[]): ParsedOptions {
  const positionals: string[] = []
  const targets: string[] = []
  const providedOptions = new Set<string>()
  let projectDirectory = process.cwd()
  let sourceDirectory: string | undefined
  let artifactDirectory: string | undefined
  let outputDirectory: string | undefined
  let godotExecutable: string | undefined
  let force = false
  let json = false
  let help = false
  for (let index = 0; index < argv.length; ++index) {
    const argument = argv[index]
    if (argument === '--project') {
      providedOptions.add('project')
      projectDirectory = optionValue(argv, index)
      index += 1
    } else if (argument === '--source') {
      providedOptions.add('source')
      sourceDirectory = optionValue(argv, index)
      index += 1
    } else if (argument === '--artifact-dir') {
      providedOptions.add('artifact-dir')
      artifactDirectory = optionValue(argv, index)
      index += 1
    } else if (argument === '--out') {
      providedOptions.add('out')
      outputDirectory = optionValue(argv, index)
      index += 1
    } else if (argument === '--godot') {
      providedOptions.add('godot')
      godotExecutable = optionValue(argv, index)
      index += 1
    } else if (argument === '--target') {
      providedOptions.add('target')
      targets.push(optionValue(argv, index))
      index += 1
    } else if (argument === '--force') {
      providedOptions.add('force')
      force = true
    } else if (argument === '--json') {
      providedOptions.add('json')
      json = true
    } else if (argument === '--help' || argument === '-h') {
      providedOptions.add('help')
      help = true
    } else if (argument.startsWith('-')) {
      throw new Error(`Unknown option: ${argument}`)
    } else {
      positionals.push(argument)
    }
  }
  return {
    positionals,
    projectDirectory,
    sourceDirectory,
    artifactDirectory,
    outputDirectory,
    godotExecutable,
    targets,
    force,
    json,
    help,
    providedOptions,
  }
}

function projectFromPositional(options: ParsedOptions): string {
  if (options.positionals.length > 1) {
    throw new Error(`Unexpected argument: ${options.positionals[1]}`)
  }
  if (
    options.positionals.length === 1 &&
    options.providedOptions.has('project')
  ) {
    throw new Error(
      'Pass the project as a positional argument or --project, not both',
    )
  }
  return options.positionals[0] ?? options.projectDirectory
}

function assertCommandOptions(command: string, options: ParsedOptions): void {
  const allowed: Readonly<Record<string, ReadonlySet<string>>> = {
    install: new Set([
      'project',
      'source',
      'artifact-dir',
      'target',
      'force',
      'json',
      'help',
    ]),
    uninstall: new Set(['project', 'json', 'help']),
    verify: new Set(['project', 'json', 'help']),
    'add-target': new Set([
      'project',
      'source',
      'artifact-dir',
      'target',
      'force',
      'json',
      'help',
    ]),
    typegen: new Set(['project', 'out', 'godot', 'json', 'help']),
    targets: new Set(['source', 'json', 'help']),
  }
  for (const option of options.providedOptions) {
    if (!allowed[command].has(option)) {
      throw new Error(`--${option} is not valid for ${command}`)
    }
  }
  if (command === 'targets' && options.positionals.length > 0) {
    throw new Error(`Unexpected argument: ${options.positionals[0]}`)
  }
}

function output(
  io: CliIO,
  value: unknown,
  json: boolean,
  message: string,
): void {
  io.log(json ? JSON.stringify(value, null, 2) : message)
}

export async function runCli(
  argv: readonly string[],
  io: CliIO = console,
): Promise<number> {
  const command = argv[0]
  if (!command || command === '--help' || command === '-h') {
    io.log(usage)
    return 0
  }
  if (!Object.prototype.hasOwnProperty.call(commandUsage, command)) {
    io.error(`Unknown command: ${command}\n\n${usage}`)
    return 1
  }
  try {
    const options = parseOptions(argv.slice(1))
    assertCommandOptions(command, options)
    if (options.help) {
      io.log(commandUsage[command])
      return 0
    }
    if (command === 'install') {
      const result = installRuntime({
        projectDirectory: projectFromPositional(options),
        sourceDirectory: options.sourceDirectory,
        artifactDirectory: options.artifactDirectory,
        targets: options.targets,
        force: options.force,
      })
      output(
        io,
        result,
        options.json,
        `Installed Godot JavaScript Runtime ${result.manifest.version} (${result.manifest.targets.join(', ')}) with ${result.copiedFiles} copied and ${result.unchangedFiles} unchanged file(s).`,
      )
      return 0
    }
    if (command === 'uninstall') {
      const result = uninstallRuntime(projectFromPositional(options))
      output(
        io,
        result,
        options.json,
        `Removed ${result.removedFiles} manifest-owned file(s) and ${result.removedRegistrations} registration(s); preserved ${result.preservedFiles.length} unowned path(s).`,
      )
      return 0
    }
    if (command === 'verify') {
      const result = verifyRuntime(projectFromPositional(options))
      output(
        io,
        result,
        options.json,
        result.ok
          ? `Verified ${result.checkedFiles} Godot JavaScript Runtime file(s).`
          : `Verification failed:\n${result.errors.map((error) => `- ${error}`).join('\n')}`,
      )
      return result.ok ? 0 : 1
    }
    if (command === 'add-target') {
      const targets = [...options.positionals, ...options.targets]
      const result = addRuntimeTarget({
        projectDirectory: options.projectDirectory,
        sourceDirectory: options.sourceDirectory,
        artifactDirectory: options.artifactDirectory,
        targets,
        force: options.force,
      })
      output(
        io,
        result,
        options.json,
        `Installed target(s) ${targets.join(', ')}; ${result.copiedFiles} copied and ${result.unchangedFiles} unchanged file(s).`,
      )
      return 0
    }
    if (command === 'typegen') {
      const result = generateProjectTypes({
        projectDirectory: projectFromPositional(options),
        outputDirectory: options.outputDirectory,
        godotExecutable: options.godotExecutable ?? process.env.GODOT_BIN,
      })
      output(
        io,
        result,
        options.json,
        `Generated ${result.files.length} declaration file(s) from ${result.source} in ${result.outputDirectory}.`,
      )
      return 0
    }
    const manifest = readRuntimeSourceManifest(options.sourceDirectory)
    const targets = availableRuntimeTargets(manifest)
    output(io, { targets }, options.json, targets.join('\n') || '(none)')
    return 0
  } catch (error) {
    io.error(
      `[godot-js-runtime] ${error instanceof Error ? error.message : String(error)}`,
    )
    return 1
  }
}

function canonicalPath(filePath: string): string {
  const resolved = path.resolve(filePath)
  return fs.existsSync(resolved) ? fs.realpathSync(resolved) : resolved
}

const entryPath = process.argv[1] ? canonicalPath(process.argv[1]) : undefined
if (entryPath === canonicalPath(fileURLToPath(import.meta.url))) {
  process.exitCode = await runCli(process.argv.slice(2))
}
