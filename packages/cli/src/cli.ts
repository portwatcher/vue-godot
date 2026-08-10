#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'
import * as readline from 'node:readline/promises'
import { create, type CreateProfile } from './create.js'
import { printDoctorReport, runDoctor } from './doctor.js'
import { HTML_COMPONENT_TAGS } from './html-tags.js'
import { generate } from './index.js'
import { integrate } from './integrate.js'
import { generateProjectTypes } from './project-types.js'

const args = process.argv.slice(2)
const command = args[0]

function mainUsage(): never {
  console.error(
    `Usage: vue-godot <command> [options]

Commands:
  create      Create a new Godot project with vue-godot set up and ready to go
  integrate   Scaffold a vue/ folder with Vite + Vue configs for an existing Godot project
  gen-types   Generate stock-Godot declarations and Vue GlobalComponents types
  doctor      Check setup, packages, exports, migration risks, and plugin APIs

Run \`vue-godot <command> --help\` for command-specific options.
`,
  )
  process.exit(1)
}

function genTypesUsage(): never {
  console.error(
    `Usage: vue-godot gen-types [options]

Generate GodotJS declarations, then generate Vue
GlobalComponents type augmentation from those declarations.

Options:
  --typings   Use an existing typings directory without running runtime typegen.
              Defaults to generated ./typings declarations.
  --godot     Official Godot executable used for version-matched declarations.
              Defaults to GODOT_BIN or Vue Godot's pinned declarations.
  --out       Output file path for the generated .d.ts file.
              Defaults to <typings>/godot.vue-components.gen.d.ts
  --ancestor  Base class to filter by inheritance. Only descendants are included.
              Defaults to Control
  --vue-src   Path to the Vue source directory (e.g. vue/src).
              When set, generates an env.d.ts shim for Vue SFC support.
              Defaults to ./vue/src
`,
  )
  process.exit(1)
}

function parseGenTypesArgs(argv: string[]) {
  let typingsDir: string | undefined
  let outFile: string | undefined
  let ancestor: string | undefined
  let vueSrcDir: string | undefined
  let godotExecutable: string | undefined

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--typings':
        typingsDir = argv[++i]
        break
      case '--out':
        outFile = argv[++i]
        break
      case '--godot':
        godotExecutable = argv[++i]
        break
      case '--ancestor':
        ancestor = argv[++i]
        break
      case '--vue-src':
        vueSrcDir = argv[++i]
        break
      case '--help':
      case '-h':
        genTypesUsage()
      default:
        console.error(`Unknown option: ${argv[i]}`)
        genTypesUsage()
    }
  }

  if (typingsDir && godotExecutable) {
    console.error('--typings and --godot are mutually exclusive')
    genTypesUsage()
  }

  return { typingsDir, outFile, ancestor, vueSrcDir, godotExecutable }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function projectUsesHtmlComponents(projectDirectory: string): boolean {
  const packageJsonPath = path.join(projectDirectory, 'package.json')
  try {
    const parsed: unknown = JSON.parse(
      fs.readFileSync(packageJsonPath, 'utf-8'),
    )
    if (!isRecord(parsed)) {
      return false
    }
    return ['dependencies', 'devDependencies'].some((field) => {
      const dependencies = parsed[field]
      return isRecord(dependencies) && '@vue-godot/html' in dependencies
    })
  } catch {
    return false
  }
}

function createUsage(): never {
  console.error(
    `Usage: vue-godot create [profile] [name] [options]

Create a new Godot project with vue-godot set up and ready to go.
If no name is given you will be prompted for one.

Arguments:
  profile     Optional project profile: app or game-ui
  name        Project name (used as directory name)

Options:
  -f          Force overwrite if directory already exists
  --profile   Project profile: app or game-ui
  --html      Enable @vue-godot/html support (HTML-like components on Godot nodes)
  --device    Add @vue-godot/device for native/device adapter APIs
  --router    Add a Vue Router starter module and route screens
  --storage   Add a Web Storage helper module
  --network   Add a network reachability helper module
  --device-api Add a native/device adapter status helper module
`,
  )
  process.exit(1)
}

function isCreateProfile(value: string): value is CreateProfile {
  return value === 'app' || value === 'game-ui'
}

function readCreateProfile(value: string | undefined): CreateProfile {
  if (value && isCreateProfile(value)) {
    return value
  }
  console.error(
    value
      ? `Unknown create profile: ${value}`
      : 'Missing profile after --profile',
  )
  createUsage()
}

function setCreateProfile(
  current: CreateProfile | undefined,
  next: CreateProfile,
): CreateProfile {
  if (current && current !== next) {
    console.error(`Conflicting create profiles: ${current} and ${next}`)
    createUsage()
  }
  return next
}

function parseCreateArgs(argv: string[]) {
  let projectName: string | undefined
  let profile: CreateProfile | undefined
  let force = false
  let html = false
  let device = false
  let router = false
  let storage = false
  let network = false
  let deviceApi = false

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    switch (arg) {
      case '-f':
        force = true
        break
      case '--profile':
        profile = setCreateProfile(profile, readCreateProfile(argv[++i]))
        break
      case '--html':
        html = true
        break
      case '--device':
        device = true
        break
      case '--router':
        router = true
        break
      case '--storage':
        storage = true
        break
      case '--network':
        network = true
        break
      case '--device-api':
        deviceApi = true
        break
      case '--help':
      case '-h':
        createUsage()
      default:
        if (arg.startsWith('-')) {
          console.error(`Unknown option: ${arg}`)
          createUsage()
        }
        if (!projectName && !profile && isCreateProfile(arg)) {
          profile = arg
          break
        }
        if (!projectName) {
          projectName = arg
        } else {
          console.error(`Unexpected argument: ${arg}`)
          createUsage()
        }
    }
  }

  return {
    projectName,
    profile,
    force,
    html,
    device,
    router,
    storage,
    network,
    deviceApi,
  }
}

function integrateUsage(): never {
  console.error(
    `Usage: vue-godot integrate [dir] [options]

Scaffold a vue/ folder with Vite + Vue configuration for a Godot project.

Arguments:
  dir         Target directory (defaults to the current directory)

Options:
  -f          Force overwrite if vue/ already exists (no prompt)
  --html      Enable @vue-godot/html support (HTML-like components on Godot nodes)
  --device    Add @vue-godot/device for native/device adapter APIs
  --router    Add a Vue Router starter module and route screens
  --storage   Add a Web Storage helper module
  --network   Add a network reachability helper module
  --device-api Add a native/device adapter status helper module
`,
  )
  process.exit(1)
}

function parseIntegrateArgs(argv: string[]) {
  let targetDir: string | undefined
  let force = false
  let html = false
  let device = false
  let router = false
  let storage = false
  let network = false
  let deviceApi = false

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '-f':
        force = true
        break
      case '--html':
        html = true
        break
      case '--device':
        device = true
        break
      case '--router':
        router = true
        break
      case '--storage':
        storage = true
        break
      case '--network':
        network = true
        break
      case '--device-api':
        deviceApi = true
        break
      case '--help':
      case '-h':
        integrateUsage()
      default:
        if (argv[i].startsWith('-')) {
          console.error(`Unknown option: ${argv[i]}`)
          integrateUsage()
        }
        if (!targetDir) {
          targetDir = argv[i]
        } else {
          console.error(`Unexpected argument: ${argv[i]}`)
          integrateUsage()
        }
    }
  }

  return {
    targetDir: targetDir ?? '.',
    force,
    html,
    device,
    router,
    storage,
    network,
    deviceApi,
  }
}

function doctorUsage(): never {
  console.error(
    `Usage: vue-godot doctor [dir] [options]

Check local project setup, package versions, runtime installation, stock-Godot
typings, export settings,
permissions, migration risks, and plugin-backed API setup.

Arguments:
  dir             Target directory (defaults to the current directory)

Options:
  --exports-only  Only scan source files and export_presets.cfg for permission/plist warnings
  --migration     Scan CSS/Vue source for web-to-Godot migration risks
`,
  )
  process.exit(1)
}

function parseDoctorArgs(argv: string[]) {
  let targetDir: string | undefined
  let exportsOnly = false
  let migration = false

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--exports-only':
        exportsOnly = true
        break
      case '--migration':
        migration = true
        break
      case '--help':
      case '-h':
        doctorUsage()
      default:
        if (argv[i].startsWith('-')) {
          console.error(`Unknown option: ${argv[i]}`)
          doctorUsage()
        }
        if (!targetDir) {
          targetDir = argv[i]
        } else {
          console.error(`Unexpected argument: ${argv[i]}`)
          doctorUsage()
        }
    }
  }

  return { targetDir: targetDir ?? '.', exportsOnly, migration }
}

if (!command || command === '--help' || command === '-h') {
  mainUsage()
}

switch (command) {
  case 'create': {
    const parsed = parseCreateArgs(args.slice(1))
    let { projectName } = parsed
    if (!projectName) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })
      projectName = (await rl.question('Project name: ')).trim()
      rl.close()
      if (!projectName) {
        console.error('Project name is required.')
        process.exit(1)
      }
    }
    await create({
      projectName,
      force: parsed.force,
      html: parsed.html,
      device: parsed.device,
      router: parsed.router,
      storage: parsed.storage,
      network: parsed.network,
      deviceApi: parsed.deviceApi,
      profile: parsed.profile,
    })
    break
  }
  case 'gen-types': {
    const parsed = parseGenTypesArgs(args.slice(1))
    const typingsDir = path.resolve(parsed.typingsDir ?? './typings')
    if (!parsed.typingsDir) {
      const result = generateProjectTypes({
        projectDirectory: process.cwd(),
        outputDirectory: path.relative(process.cwd(), typingsDir),
        godotExecutable: parsed.godotExecutable ?? process.env.GODOT_BIN,
      })
      console.log(
        `vue-godot: generated ${result.files.length} declaration file(s) from ${result.source} → ${result.outputDirectory}`,
      )
    }
    const outFile = path.resolve(
      parsed.outFile ?? path.join(typingsDir, 'godot.vue-components.gen.d.ts'),
    )
    const ancestor = parsed.ancestor ?? 'Control'
    const vueSrcDir = path.resolve(parsed.vueSrcDir ?? './vue/src')
    generate({
      typingsDir,
      outFile,
      ancestor,
      vueSrcDir,
      excludeComponents: projectUsesHtmlComponents(process.cwd())
        ? HTML_COMPONENT_TAGS
        : undefined,
    })
    break
  }
  case 'integrate': {
    const parsed = parseIntegrateArgs(args.slice(1))
    await integrate({
      targetDir: parsed.targetDir,
      force: parsed.force,
      html: parsed.html,
      device: parsed.device,
      router: parsed.router,
      storage: parsed.storage,
      network: parsed.network,
      deviceApi: parsed.deviceApi,
    })
    break
  }
  case 'doctor': {
    const parsed = parseDoctorArgs(args.slice(1))
    const report = runDoctor({
      targetDir: parsed.targetDir,
      exportsOnly: parsed.exportsOnly,
      migration: parsed.migration,
    })
    printDoctorReport(report)
    if (report.errorCount > 0) {
      process.exit(1)
    }
    break
  }
  default:
    console.error(`Unknown command: ${command}`)
    mainUsage()
}
