#!/usr/bin/env node

import * as path from 'node:path'
import * as readline from 'node:readline/promises'
import { create } from './create.js'
import { generate } from './index.js'
import { integrate } from './integrate.js'

const args = process.argv.slice(2)
const command = args[0]

function mainUsage(): never {
  console.error(
    `Usage: vue-godot <command> [options]

Commands:
  create      Create a new Godot project with vue-godot set up and ready to go
  integrate   Scaffold a vue/ folder with Vite + Vue configs for an existing Godot project
  gen-types   Generate Vue GlobalComponents type augmentation from Godot typings

Run \`vue-godot <command> --help\` for command-specific options.
`,
  )
  process.exit(1)
}

function genTypesUsage(): never {
  console.error(
    `Usage: vue-godot gen-types [options]

Generate Vue GlobalComponents type augmentation from GodotJS typings.

Options:
  --typings   Path to the typings directory containing godot*.gen.d.ts files.
              Defaults to ./typings
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

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--typings':
        typingsDir = argv[++i]
        break
      case '--out':
        outFile = argv[++i]
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

  return { typingsDir, outFile, ancestor, vueSrcDir }
}

function createUsage(): never {
  console.error(
    `Usage: vue-godot create [name] [options]

Create a new Godot project with vue-godot set up and ready to go.
If no name is given you will be prompted for one.

Arguments:
  name        Project name (used as directory name)

Options:
  -f          Force overwrite if directory already exists
`,
  )
  process.exit(1)
}

function parseCreateArgs(argv: string[]) {
  let projectName: string | undefined
  let force = false

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '-f':
        force = true
        break
      case '--help':
      case '-h':
        createUsage()
      default:
        if (argv[i].startsWith('-')) {
          console.error(`Unknown option: ${argv[i]}`)
          createUsage()
        }
        if (!projectName) {
          projectName = argv[i]
        } else {
          console.error(`Unexpected argument: ${argv[i]}`)
          createUsage()
        }
    }
  }

  return { projectName, force }
}

function integrateUsage(): never {
  console.error(
    `Usage: vue-godot integrate [dir] [options]

Scaffold a vue/ folder with Vite + Vue configuration for a Godot project.

Arguments:
  dir         Target directory (defaults to the current directory)

Options:
  -f          Force overwrite if vue/ already exists (no prompt)
`,
  )
  process.exit(1)
}

function parseIntegrateArgs(argv: string[]) {
  let targetDir: string | undefined
  let force = false

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '-f':
        force = true
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

  return { targetDir: targetDir ?? '.', force }
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
    await create({ projectName, force: parsed.force })
    break
  }
  case 'gen-types': {
    const parsed = parseGenTypesArgs(args.slice(1))
    const typingsDir = path.resolve(parsed.typingsDir ?? './typings')
    const outFile = path.resolve(
      parsed.outFile ?? path.join(typingsDir, 'godot.vue-components.gen.d.ts'),
    )
    const ancestor = parsed.ancestor ?? 'Control'
    const vueSrcDir = path.resolve(parsed.vueSrcDir ?? './vue/src')
    generate({ typingsDir, outFile, ancestor, vueSrcDir })
    break
  }
  case 'integrate': {
    const parsed = parseIntegrateArgs(args.slice(1))
    await integrate(parsed)
    break
  }
  default:
    console.error(`Unknown command: ${command}`)
    mainUsage()
}
