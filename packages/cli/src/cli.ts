#!/usr/bin/env node

import * as path from 'node:path'
import { generate } from './index.js'

const args = process.argv.slice(2)
const command = args[0]

function mainUsage(): never {
  console.error(
    `Usage: vue-godot <command> [options]

Commands:
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

if (!command || command === '--help' || command === '-h') {
  mainUsage()
}

switch (command) {
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
  default:
    console.error(`Unknown command: ${command}`)
    mainUsage()
}
