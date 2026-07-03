import * as fs from 'node:fs'
import * as path from 'node:path'
import * as readline from 'node:readline/promises'
import { fileURLToPath } from 'node:url'

export interface IntegrateOptions {
  targetDir: string
  force: boolean
  html?: boolean
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PACKAGE_SPECS = {
  '@vue-godot/browser': '^0.0.1',
  '@vue-godot/cli': '^0.0.2',
  '@vue-godot/html': '^0.0.1',
  '@vue-godot/runtime-tscn': '^0.0.2',
  '@vue/runtime-core': '^3.5.14',
} as const

function isStringRecord(value: unknown): value is Record<string, string> {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  return Object.values(value).every((entry) => typeof entry === 'string')
}

function readPackageSpecOverrides(): Record<string, string> {
  const raw = process.env['VUE_GODOT_PACKAGE_OVERRIDES']
  if (!raw) {
    return {}
  }

  const parsed: unknown = JSON.parse(raw)
  if (!isStringRecord(parsed)) {
    throw new Error(
      'VUE_GODOT_PACKAGE_OVERRIDES must be a JSON object of package spec strings',
    )
  }
  return parsed
}

function packageSpec(
  packageName: keyof typeof PACKAGE_SPECS,
  overrides: Record<string, string>,
): string {
  return overrides[packageName] ?? PACKAGE_SPECS[packageName]
}

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

export function newPackageJson(
  name: string,
  html?: boolean,
): Record<string, unknown> {
  const packageOverrides = readPackageSpecOverrides()
  const deps: Record<string, string> = {
    '@vue-godot/runtime-tscn': packageSpec(
      '@vue-godot/runtime-tscn',
      packageOverrides,
    ),
    '@vue/runtime-core': packageSpec('@vue/runtime-core', packageOverrides),
  }
  if (html) {
    deps['@vue-godot/browser'] = packageSpec(
      '@vue-godot/browser',
      packageOverrides,
    )
    deps['@vue-godot/html'] = packageSpec('@vue-godot/html', packageOverrides)
  }
  return {
    name,
    version: '1.0.0',
    type: 'commonjs',
    scripts: {
      dev: 'vite build --watch -c vue/vite.config.ts',
      build: 'vite build -c vue/vite.config.ts',
      postinstall: 'npm run build',
      'gen:types': 'vue-godot gen-types',
    },
    devDependencies: {
      '@vue-godot/cli': packageSpec('@vue-godot/cli', packageOverrides),
      '@types/node': '^20.11.18',
      '@vitejs/plugin-vue': '^5.2.4',
      vite: '^6.3.5',
    },
    dependencies: deps,
  }
}

/* ------------------------------------------------------------------ */
/*  HTML-mode file generators                                         */
/* ------------------------------------------------------------------ */

export function generateHtmlViteConfig(): string {
  return `import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Tags provided by @vue-godot/html — kept in sync with htmlTags from the package.
// Listed here to avoid importing at config-load time (Node ESM resolution).
const htmlTags = [
  'a', 'audio', 'div', 'img', 'span', 'button',
  'input', 'textarea', 'select', 'option', 'canvas', 'video', 'svg',
]

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Nothing is a native platform element in Godot
          isNativeTag: () => false,
          // Uppercase tags are Godot nodes (custom elements) UNLESS
          // @vue-godot/html provides a component for them
          isCustomElement: (tag) =>
            tag[0] === tag[0].toUpperCase() &&
            !htmlTags.includes(tag.toLowerCase()),
        },
      },
    }),
  ],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: { vue: '@vue/runtime-core' },
  },
  build: {
    lib: {
      entry: 'vue/src/main.ts',
      formats: ['cjs'],
      fileName: () => 'app.js',
    },
    rollupOptions: {
      external: ['godot'],
      output: {
        exports: 'named',
      },
    },
    target: 'es2020',
    minify: false,
  },
})
`
}

export function generateHtmlMainTs(): string {
  return `import { installBrowserAPIs } from '@vue-godot/browser'
import { createApp } from '@vue-godot/runtime-tscn'
import { htmlPlugin } from '@vue-godot/html'
import { VBoxContainer } from 'godot'
import App from './App.vue'

installBrowserAPIs()

export default class Root extends VBoxContainer {
  private app: ReturnType<typeof createApp> | null = null

  _ready() {
    this.app?.unmount()
    const app = createApp(App)
    app.use(htmlPlugin)
    app.mount(this)
    this.app = app
  }

  _exit_tree() {
    this.app?.unmount()
    this.app = null
  }
}
`
}

export function generateHtmlAppVue(): string {
  return `<template>
  <div
    :style="{
      flexDirection: 'column',
      gap: 12,
      padding: 16,
      width: 520,
      backgroundColor: '#1f2937',
    }"
  >
    <span :style="{ fontSize: 24, color: '#f8fafc' }">
      Hello from Vue Godot HTML
    </span>
    <span :style="{ color: '#cbd5e1' }">
      Edit vue/src/App.vue and keep npm run dev running.
    </span>
    <input v-model="name" placeholder="Player name" />
    <button @click="count++">Clicked {{ count }} times</button>
    <a href="https://github.com/portwatcher/vue-godot">Open project repo</a>
    <span :style="{ color: '#93c5fd' }">Hello, {{ name || 'player' }}.</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const name = ref('')
</script>
`
}

/* ------------------------------------------------------------------ */
/*  Main                                                              */
/* ------------------------------------------------------------------ */

export async function integrate(options: IntegrateOptions): Promise<void> {
  const { targetDir, force, html } = options
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

  /* --- apply HTML-mode overrides --- */
  if (html) {
    const viteConfigPath = path.join(vueDir, 'vite.config.ts')
    fs.writeFileSync(viteConfigPath, generateHtmlViteConfig())
    console.log(
      `  updated ${path.relative(process.cwd(), viteConfigPath)} (html mode)`,
    )

    const mainTsPath = path.join(vueDir, 'src', 'main.ts')
    fs.writeFileSync(mainTsPath, generateHtmlMainTs())
    console.log(
      `  updated ${path.relative(process.cwd(), mainTsPath)} (html mode)`,
    )

    const appVuePath = path.join(vueDir, 'src', 'App.vue')
    fs.writeFileSync(appVuePath, generateHtmlAppVue())
    console.log(
      `  updated ${path.relative(process.cwd(), appVuePath)} (html mode)`,
    )
  }

  /* --- package.json --- */
  const pkgJsonPath = path.join(absTarget, 'package.json')

  if (fs.existsSync(pkgJsonPath)) {
    const existing = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
    existing.scripts = existing.scripts || {}
    existing.scripts.dev ??= 'vite build --watch -c vue/vite.config.ts'
    existing.scripts.build ??= 'vite build -c vue/vite.config.ts'
    existing.scripts.postinstall ??= 'npm run build'
    existing.scripts['gen:types'] ??= 'vue-godot gen-types'

    existing.devDependencies = existing.devDependencies || {}
    const packageOverrides = readPackageSpecOverrides()
    existing.devDependencies['@vue-godot/cli'] ??= packageSpec(
      '@vue-godot/cli',
      packageOverrides,
    )
    existing.devDependencies['@types/node'] ??= '^20.11.18'
    existing.devDependencies['@vitejs/plugin-vue'] ??= '^5.2.4'
    existing.devDependencies['vite'] ??= '^6.3.5'

    existing.dependencies = existing.dependencies || {}
    existing.dependencies['@vue-godot/runtime-tscn'] ??= packageSpec(
      '@vue-godot/runtime-tscn',
      packageOverrides,
    )
    existing.dependencies['@vue/runtime-core'] ??= packageSpec(
      '@vue/runtime-core',
      packageOverrides,
    )
    if (html) {
      existing.dependencies['@vue-godot/browser'] ??= packageSpec(
        '@vue-godot/browser',
        packageOverrides,
      )
      existing.dependencies['@vue-godot/html'] ??= packageSpec(
        '@vue-godot/html',
        packageOverrides,
      )
    }

    fs.writeFileSync(pkgJsonPath, JSON.stringify(existing, null, 2) + '\n')
    console.log(`  updated ${path.relative(process.cwd(), pkgJsonPath)}`)
  } else {
    const name = path.basename(absTarget)
    fs.writeFileSync(
      pkgJsonPath,
      JSON.stringify(newPackageJson(name, html), null, 2) + '\n',
    )
    console.log(`  created ${path.relative(process.cwd(), pkgJsonPath)}`)
  }

  console.log(
    `\n✔ Vue integration scaffolded in ${path.relative(process.cwd(), vueDir)}`,
  )
  console.log(`\nNext steps:`)
  console.log(
    `  1. npm install        (runs initial build and creates dist/app.js)`,
  )
  console.log(`  2. npm run gen:types`)
  console.log(
    `  3. npm run dev          (rebuilds on change; Godot hot-reloads dist/app.js)`,
  )
}
