import * as fs from 'node:fs'
import * as path from 'node:path'
import * as readline from 'node:readline/promises'
import { fileURLToPath } from 'node:url'

export interface IntegrateOptions {
  targetDir: string
  force: boolean
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** Resolve the bundled templates/ directory (lives next to dist/). */
export function getTemplatesDir(): string {
  // In the built package: dist/integrate.js → ../templates
  return path.resolve(__dirname, '..', 'templates')
}

/**
 * Walk up the directory tree from `from` until we find a `node_modules` dir.
 */
function findNodeModules(from: string): string | null {
  let dir = path.resolve(from)
  while (true) {
    const candidate = path.join(dir, 'node_modules')
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate
    }
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return null
}

/**
 * Recursively copy a directory, applying placeholder replacements to every
 * text file. Binary files are copied as-is.
 */
export function copyTemplateDir(
  srcDir: string,
  destDir: string,
  replacements: Record<string, string>,
  cwd: string,
): void {
  fs.mkdirSync(destDir, { recursive: true })

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name)
    const destPath = path.join(destDir, entry.name)

    if (entry.isDirectory()) {
      copyTemplateDir(srcPath, destPath, replacements, cwd)
    } else {
      let content = fs.readFileSync(srcPath, 'utf-8')
      for (const [placeholder, value] of Object.entries(replacements)) {
        content = content.replaceAll(placeholder, value)
      }
      fs.writeFileSync(destPath, content)
      console.log(`  created ${path.relative(cwd, destPath)}`)
    }
  }
}

export function newPackageJson(name: string): Record<string, unknown> {
  return {
    name,
    version: '1.0.0',
    type: 'commonjs',
    scripts: {
      dev: 'vite build --watch -c vue/vite.config.ts',
      build: 'vite build -c vue/vite.config.ts',
      'gen:types': 'vue-godot gen-types',
    },
    devDependencies: {
      '@vue-godot/cli': '*',
      '@types/node': '^20.11.18',
      '@vitejs/plugin-vue': '^5.2.4',
      vite: '^6.3.5',
    },
    dependencies: {
      '@vue-godot/runtime-tscn': '*',
      '@vue/runtime-core': '^3.5.14',
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Main                                                              */
/* ------------------------------------------------------------------ */

export async function integrate(options: IntegrateOptions): Promise<void> {
  const { targetDir, force } = options
  const absTarget = path.resolve(targetDir)
  const vueDir = path.join(absTarget, 'vue')

  /* --- guard: target directory must exist --- */
  if (!fs.existsSync(absTarget)) {
    console.error(`Target directory does not exist: ${absTarget}`)
    process.exit(1)
  }

  /* --- vue/ already present? --- */
  if (fs.existsSync(vueDir)) {
    if (!force) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })
      const answer = await rl.question(
        `Directory "${vueDir}" already exists. Overwrite? (y/N) `,
      )
      rl.close()
      if (answer.trim().toLowerCase() !== 'y') {
        console.log('Aborted.')
        return
      }
    }
    fs.rmSync(vueDir, { recursive: true })
  }

  /* --- resolve node_modules relative path for tsconfig --- */
  const nodeModules = findNodeModules(absTarget)
  let nodeModulesRelPath: string
  if (nodeModules) {
    nodeModulesRelPath = path.relative(vueDir, nodeModules)
  } else {
    // fallback: assume node_modules lives in the parent of target
    nodeModulesRelPath = '../node_modules'
  }

  /* --- copy template tree with placeholder substitution --- */
  const templatesDir = getTemplatesDir()
  const vueTplDir = path.join(templatesDir, 'vue')

  if (!fs.existsSync(vueTplDir)) {
    console.error(
      `Template directory not found: ${vueTplDir}\nThe CLI package may not be installed correctly.`,
    )
    process.exit(1)
  }

  copyTemplateDir(
    vueTplDir,
    vueDir,
    { '{{NODE_MODULES}}': nodeModulesRelPath },
    process.cwd(),
  )

  /* --- package.json --- */
  const pkgJsonPath = path.join(absTarget, 'package.json')

  if (fs.existsSync(pkgJsonPath)) {
    const existing = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
    existing.scripts = existing.scripts || {}
    existing.scripts.dev ??= 'vite build --watch -c vue/vite.config.ts'
    existing.scripts.build ??= 'vite build -c vue/vite.config.ts'
    existing.scripts['gen:types'] ??= 'vue-godot gen-types'

    existing.devDependencies = existing.devDependencies || {}
    existing.devDependencies['@vue-godot/cli'] ??= '*'
    existing.devDependencies['@types/node'] ??= '^20.11.18'
    existing.devDependencies['@vitejs/plugin-vue'] ??= '^5.2.4'
    existing.devDependencies['vite'] ??= '^6.3.5'

    existing.dependencies = existing.dependencies || {}
    existing.dependencies['@vue-godot/runtime-tscn'] ??= '*'
    existing.dependencies['@vue/runtime-core'] ??= '^3.5.14'

    fs.writeFileSync(pkgJsonPath, JSON.stringify(existing, null, 2) + '\n')
    console.log(`  updated ${path.relative(process.cwd(), pkgJsonPath)}`)
  } else {
    const name = path.basename(absTarget)
    fs.writeFileSync(
      pkgJsonPath,
      JSON.stringify(newPackageJson(name), null, 2) + '\n',
    )
    console.log(`  created ${path.relative(process.cwd(), pkgJsonPath)}`)
  }

  console.log(
    `\n✔ Vue integration scaffolded in ${path.relative(process.cwd(), vueDir)}`,
  )
  console.log(`\nNext steps:`)
  console.log(`  1. npm install`)
  console.log(`  2. npm run gen:types`)
  console.log(
    `  3. npm run dev          (rebuilds on change; Godot hot-reloads dist/app.js)`,
  )
}
