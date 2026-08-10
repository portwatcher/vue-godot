import * as fs from 'node:fs'
import * as path from 'node:path'
import * as readline from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import { HTML_COMPONENT_TAGS } from './html-tags.js'

export interface IntegrateOptions {
  targetDir: string
  force: boolean
  html?: boolean
  device?: boolean
  router?: boolean
  storage?: boolean
  network?: boolean
  deviceApi?: boolean
}

export interface ProjectFeatureOptions {
  html?: boolean
  device?: boolean
  router?: boolean
  storage?: boolean
  network?: boolean
  deviceApi?: boolean
}

export interface ResolvedProjectFeatures {
  html: boolean
  device: boolean
  router: boolean
  storage: boolean
  network: boolean
  deviceApi: boolean
}

export type HtmlStarterProfile = 'default' | 'app' | 'game-ui'

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PACKAGE_SPECS = {
  '@vue-godot/browser': '^0.0.1',
  '@vue-godot/cli': '^0.0.3',
  '@vue-godot/device': '^0.0.1',
  '@vue-godot/html': '^0.0.1',
  '@vue-godot/runtime-tscn': '^0.0.2',
  '@vue/runtime-core': '^3.5.14',
  'godot-js-runtime': '^0.0.1',
  'vue-router': '~4.5.1',
} as const

const RUNTIME_PROJECT_SCRIPTS = {
  'install:runtime': 'godot-js-runtime install --project .',
  'verify:runtime': 'godot-js-runtime verify --project .',
  'add-target:runtime': 'godot-js-runtime add-target --project .',
  'uninstall:runtime': 'godot-js-runtime uninstall --project .',
  'gen:types': 'vue-godot gen-types',
  'setup:runtime': 'npm run install:runtime && npm run gen:types',
} as const

const EPHEMERAL_TEMPLATE_DIRECTORIES = new Set([
  '.godot',
  '.turbo',
  'dist',
  'node_modules',
])

function isEphemeralTemplateEntry(entry: fs.Dirent): boolean {
  if (entry.isDirectory()) {
    return EPHEMERAL_TEMPLATE_DIRECTORIES.has(entry.name)
  }
  return entry.name === '.DS_Store' || entry.name.endsWith('.uid')
}

function isStringRecord(value: unknown): value is Record<string, string> {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  return Object.values(value).every((entry) => typeof entry === 'string')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function objectField(
  parent: Record<string, unknown>,
  key: string,
): Record<string, unknown> {
  const value = parent[key]
  if (value === undefined) {
    const next: Record<string, unknown> = {}
    parent[key] = next
    return next
  }
  if (isRecord(value)) {
    return value
  }
  throw new Error(`Expected ${key} to be an object`)
}

function stringArrayField(
  parent: Record<string, unknown>,
  key: string,
): string[] {
  const value = parent[key]
  if (value === undefined) {
    return []
  }
  if (
    Array.isArray(value) &&
    value.every((entry) => typeof entry === 'string')
  ) {
    return [...value]
  }
  throw new Error(`Expected ${key} to be a string array`)
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

export function addHtmlVolarPlugin(vueDir: string, cwd: string): void {
  const tsconfigPath = path.join(vueDir, 'tsconfig.json')
  if (!fs.existsSync(tsconfigPath)) {
    return
  }

  const parsed: unknown = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'))
  if (!isRecord(parsed)) {
    throw new Error(`Expected ${tsconfigPath} to contain a JSON object`)
  }

  const vueCompilerOptions = objectField(parsed, 'vueCompilerOptions')
  const plugins = stringArrayField(vueCompilerOptions, 'plugins')
  if (!plugins.includes('@vue-godot/html/volar-plugin')) {
    plugins.push('@vue-godot/html/volar-plugin')
  }
  vueCompilerOptions['plugins'] = plugins

  fs.writeFileSync(tsconfigPath, JSON.stringify(parsed, null, 2) + '\n')
  console.log(
    `  updated ${path.relative(cwd, tsconfigPath)} (html volar plugin)`,
  )
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
    if (isEphemeralTemplateEntry(entry)) {
      continue
    }
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

export function copyTemplateDirIfMissing(
  srcDir: string,
  destDir: string,
  replacements: Record<string, string>,
  cwd: string,
): void {
  fs.mkdirSync(destDir, { recursive: true })

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (isEphemeralTemplateEntry(entry)) {
      continue
    }
    const srcPath = path.join(srcDir, entry.name)
    const destPath = path.join(destDir, entry.name)

    if (entry.isDirectory()) {
      copyTemplateDirIfMissing(srcPath, destPath, replacements, cwd)
      continue
    }

    if (fs.existsSync(destPath)) {
      console.log(`  kept ${path.relative(cwd, destPath)}`)
      continue
    }

    let content = fs.readFileSync(srcPath, 'utf-8')
    for (const [placeholder, value] of Object.entries(replacements)) {
      content = content.replaceAll(placeholder, value)
    }
    fs.writeFileSync(destPath, content)
    console.log(`  created ${path.relative(cwd, destPath)}`)
  }
}

export function copyProductionSupportFiles(
  targetDir: string,
  cwd: string,
): void {
  const templatesDir = getTemplatesDir()
  for (const entryName of ['docs', 'scripts']) {
    const templateDir = path.join(templatesDir, entryName)
    if (!fs.existsSync(templateDir)) {
      console.error(
        `Template directory not found: ${templateDir}\nThe CLI package may not be installed correctly.`,
      )
      process.exit(1)
    }
    copyTemplateDirIfMissing(
      templateDir,
      path.join(targetDir, entryName),
      {},
      cwd,
    )
  }
}

export function copyGodotScanIgnoreScaffold(
  targetDir: string,
  cwd: string,
): void {
  const sourcePath = path.join(getTemplatesDir(), 'typings', '.gdignore')
  if (!fs.existsSync(sourcePath)) {
    console.error(
      `Template file not found: ${sourcePath}\nThe CLI package may not be installed correctly.`,
    )
    process.exit(1)
  }
  for (const directory of ['node_modules', 'typings']) {
    const destinationPath = path.join(targetDir, directory, '.gdignore')
    fs.mkdirSync(path.dirname(destinationPath), { recursive: true })
    if (fs.existsSync(destinationPath)) {
      console.log(`  kept ${path.relative(cwd, destinationPath)}`)
      continue
    }
    fs.copyFileSync(sourcePath, destinationPath)
    console.log(`  created ${path.relative(cwd, destinationPath)}`)
  }
}

function applyRuntimeScripts(
  scripts: Record<string, unknown>,
): Record<string, unknown> {
  for (const [name, command] of Object.entries(RUNTIME_PROJECT_SCRIPTS)) {
    scripts[name] ??= command
  }
  return scripts
}

function normalizeProjectFeaturesInput(
  options?: boolean | ProjectFeatureOptions,
): ProjectFeatureOptions {
  return typeof options === 'boolean' ? { html: options } : (options ?? {})
}

export function resolveProjectFeatures(
  options?: boolean | ProjectFeatureOptions,
): ResolvedProjectFeatures {
  const normalized = normalizeProjectFeaturesInput(options)
  const router = normalized.router === true
  const storage = normalized.storage === true
  const network = normalized.network === true
  const deviceApi = normalized.deviceApi === true
  const usesFeatureStarter = router || storage || network || deviceApi
  const html = normalized.html === true || usesFeatureStarter

  return {
    html,
    device: normalized.device === true || html || deviceApi,
    router,
    storage,
    network,
    deviceApi,
  }
}

export function newPackageJson(
  name: string,
  options?: boolean | ProjectFeatureOptions,
): Record<string, unknown> {
  const { html, device, router } = resolveProjectFeatures(options)
  const packageOverrides = readPackageSpecOverrides()
  const deps: Record<string, string> = {
    '@vue-godot/runtime-tscn': packageSpec(
      '@vue-godot/runtime-tscn',
      packageOverrides,
    ),
    '@vue/runtime-core': packageSpec('@vue/runtime-core', packageOverrides),
    'godot-js-runtime': packageSpec('godot-js-runtime', packageOverrides),
  }
  if (html) {
    deps['@vue-godot/browser'] = packageSpec(
      '@vue-godot/browser',
      packageOverrides,
    )
    deps['@vue-godot/html'] = packageSpec('@vue-godot/html', packageOverrides)
  }
  if (router) {
    deps['vue-router'] = packageSpec('vue-router', packageOverrides)
  }
  if (html || device) {
    deps['@vue-godot/device'] = packageSpec(
      '@vue-godot/device',
      packageOverrides,
    )
  }
  return {
    name,
    version: '1.0.0',
    type: 'commonjs',
    scripts: applyRuntimeScripts({
      dev: 'vite build --watch -c vue/vite.config.ts',
      build: 'vite build -c vue/vite.config.ts',
      'check:exports': 'node scripts/check-export-settings.mjs',
      postinstall: 'npm run setup:runtime && npm run build',
    }),
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
  const htmlTags = JSON.stringify(HTML_COMPONENT_TAGS, null, 2)
  return `import vue from '@vitejs/plugin-vue'
import { vueGodotHtmlCss } from '@vue-godot/html/vite'
import { commonJsBundleBanner } from 'godot-js-runtime'
import { defineConfig } from 'vite'

// Tags provided by @vue-godot/html — kept in sync with htmlTags from the package.
// Listed here to avoid importing at config-load time (Node ESM resolution).
const htmlTags = ${htmlTags}

export default defineConfig({
  plugins: [
    vueGodotHtmlCss(),
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
        banner: commonJsBundleBanner,
        // Stable chunk paths avoid stale Godot editor resource dependencies
        // when Vite rebuilds while the project is open.
        chunkFileNames: 'chunks/[name].js',
        exports: 'named',
      },
    },
    target: 'es2020',
    minify: false,
  },
})
`
}

type StarterModuleOptions = Pick<
  ResolvedProjectFeatures,
  'router' | 'storage' | 'network' | 'deviceApi'
>

const defaultStarterModuleOptions: StarterModuleOptions = {
  router: false,
  storage: false,
  network: false,
  deviceApi: false,
}

function normalizeStarterModuleOptions(
  options?: Partial<StarterModuleOptions>,
): StarterModuleOptions {
  return { ...defaultStarterModuleOptions, ...(options ?? {}) }
}

export function generateHtmlMainTs(
  options?: Partial<StarterModuleOptions>,
): string {
  const features = normalizeStarterModuleOptions(options)
  return `import { installBrowserAPIs } from '@vue-godot/browser'
import { createApp } from '@vue-godot/runtime-tscn'
import { htmlPlugin } from '@vue-godot/html'
import { VBoxContainer } from 'godot'
import App from './App.vue'
import './app.css'
${features.router ? "import { router } from './app/router'\n" : ''}

installBrowserAPIs()

export default class Root extends VBoxContainer {
  private app: ReturnType<typeof createApp> | null = null

  _ready() {
    this.app?.unmount()
    const app = createApp(App)
    app.use(htmlPlugin)
${features.router ? '    app.use(router)\n' : ''}    app.mount(this)
    this.app = app
  }

  _exit_tree() {
    this.app?.unmount()
    this.app = null
  }
}
`
}

export function generateHtmlCss(): string {
  return `:root {
  --starter-surface: #1f2937;
  --starter-text: #f8fafc;
  --starter-muted: #cbd5e1;
  --starter-accent: #93c5fd;
  --starter-space: 16px;
}

.starter-card {
  background-color: var(--starter-surface);
  color: var(--starter-text);
  padding: var(--starter-space);
  border-radius: 8px;
}

@media (max-width: 520px) {
  .starter-card {
    padding: 12px;
  }
}
`
}

function generateDefaultHtmlAppVue(): string {
  return `<template>
  <Div
    class="starter-card"
    :style="{
      flexDirection: 'column',
      gap: 12,
      width: 520,
    }"
  >
    <Span :style="{ fontSize: 24, color: '#f8fafc' }">
      Hello from Vue Godot HTML
    </Span>
    <Span :style="{ color: '#cbd5e1' }">
      Edit vue/src/App.vue and keep npm run dev running.
    </Span>
    <Input v-model="name" placeholder="Player name"></Input>
    <Button @click="count++">Clicked {{ count }} times</Button>
    <A href="https://github.com/portwatcher/vue-godot">Open project repo</A>
    <Span :style="{ color: '#93c5fd' }">Hello, {{ name || 'player' }}.</Span>
  </Div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const name = ref('')
</script>
`
}

function generateNativeAppVue(): string {
  return `<template>
  <SafeAreaView
    :style="{
      padding: 16,
      backgroundColor: '#172033',
      width: '100%',
      height: '100%',
    }"
  >
    <Screen
      :style="{ backgroundColor: '#f8fafc', borderRadius: 6 }"
      :content-style="{ gap: 12, padding: 16, width: 560 }"
    >
      <Span :style="{ fontSize: 22, fontWeight: 'bold', color: '#172033' }">
        Native App Starter
      </Span>
      <Span :style="{ color: '#475569' }">
        Signed in as {{ displayName || 'guest' }}
      </Span>

      <Form :content-style="{ gap: 10 }">
        <Label>Display name</Label>
        <Input
          v-model="displayName"
          placeholder="Player or account name"
          :min-touch-target="44"
        ></Input>
        <Switch v-model="offlineQueue" label="Queue changes while offline"></Switch>
        <Button @click="saveProfile">Save profile</Button>
      </Form>

      <Div
        :style="{
          flexDirection: 'column',
          gap: 6,
          padding: 12,
          backgroundColor: '#e2e8f0',
          borderRadius: 6,
        }"
      >
        <Span :style="{ color: '#0f172a' }">Network: {{ networkLabel }}</Span>
        <Span :style="{ color: '#0f172a' }">
          Share adapter: {{ shareLabel }}
        </Span>
        <Span :style="{ color: '#0f172a' }">Saved profile: {{ savedLabel }}</Span>
      </Div>

      <Button @click="refreshCapabilities">Refresh adapter status</Button>
    </Screen>
  </SafeAreaView>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { isSupported } from '@vue-godot/device'

const displayName = ref(localStorage.getItem('profile:name') ?? '')
const savedName = ref(displayName.value)
const offlineQueue = ref(localStorage.getItem('settings:offlineQueue') === 'true')
const networkOnline = ref(navigator.onLine)
const checkedShare = ref(false)
const shareReady = ref(false)

const networkLabel = computed(() => (networkOnline.value ? 'online' : 'offline'))
const savedLabel = computed(() => savedName.value || 'not saved')
const shareLabel = computed(() => {
  if (!checkedShare.value) {
    return 'not checked'
  }
  return shareReady.value ? 'registered' : 'not registered'
})

function saveProfile() {
  localStorage.setItem('profile:name', displayName.value)
  localStorage.setItem('settings:offlineQueue', String(offlineQueue.value))
  savedName.value = displayName.value
}

async function refreshCapabilities() {
  shareReady.value = await isSupported('share')
  checkedShare.value = true
}

function handleOnline() {
  networkOnline.value = true
}

function handleOffline() {
  networkOnline.value = false
}

onMounted(() => {
  addEventListener('online', handleOnline)
  addEventListener('offline', handleOffline)
  void refreshCapabilities()
})

onUnmounted(() => {
  removeEventListener('online', handleOnline)
  removeEventListener('offline', handleOffline)
})
</script>
`
}

function generateGameUiAppVue(): string {
  return `<template>
  <Screen
    :style="{ backgroundColor: '#111827' }"
    :content-style="{ gap: 14, padding: 16, width: 620 }"
  >
    <Div
      :style="{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        backgroundColor: '#243447',
        borderRadius: 6,
      }"
    >
      <Div :style="{ flex: 1, gap: 4 }">
        <Span :style="{ fontSize: 22, fontWeight: 'bold', color: '#f8fafc' }">
          Scout HUD
        </Span>
        <Span :style="{ color: '#cbd5e1' }">{{ selectedActionLabel }}</Span>
      </Div>
      <Progress
        :value="health"
        :max="100"
        :style="{ width: 180, height: 18 }"
      ></Progress>
    </Div>

    <Div :style="{ flexDirection: 'row', gap: 10 }">
      <Pressable
        v-for="action in actions"
        :key="action"
        :style="actionStyle(action)"
        :min-touch-target="48"
        @press="selectAction(action)"
      >
        <Span :style="{ color: '#f8fafc', fontWeight: 'bold' }">
          {{ actionLabels[action] }}
        </Span>
      </Pressable>
    </Div>

    <Div
      :style="{
        flexDirection: 'column',
        gap: 10,
        padding: 12,
        backgroundColor: '#f8fafc',
        borderRadius: 6,
      }"
    >
      <Span :style="{ color: '#172033', fontWeight: 'bold' }">
        Session Controls
      </Span>
      <Input
        v-model="volume"
        type="range"
        :min="0"
        :max="100"
        :step="1"
      ></Input>
      <Span :style="{ color: '#475569' }">Volume {{ volume }}%</Span>
      <Switch v-model="paused" label="Paused"></Switch>
      <Button @click="usePotion">Use potion</Button>
    </Div>
  </Screen>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HtmlStyle } from '@vue-godot/html'

type ActionKey = 'inventory' | 'map' | 'settings'

const actionLabels: Record<ActionKey, string> = {
  inventory: 'Inventory',
  map: 'Map',
  settings: 'Settings',
}
const actions: ActionKey[] = ['inventory', 'map', 'settings']
const selectedAction = ref<ActionKey>('inventory')
const health = ref(72)
const volume = ref(64)
const paused = ref(false)

const selectedActionLabel = computed(() => actionLabels[selectedAction.value])

function selectAction(action: ActionKey) {
  selectedAction.value = action
}

function actionStyle(action: ActionKey): HtmlStyle {
  const selected = selectedAction.value === action
  return {
    flex: 1,
    padding: 12,
    backgroundColor: selected ? '#2563eb' : '#334155',
    borderColor: selected ? '#bfdbfe' : '#475569',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 6,
  }
}

function usePotion() {
  health.value = Math.min(100, health.value + 8)
}
</script>
`
}

function generateRouterShellAppVue(): string {
  return `<template>
  <SafeAreaView
    :style="{
      padding: 16,
      backgroundColor: '#172033',
      width: '100%',
      height: '100%',
    }"
  >
    <router-view></router-view>
  </SafeAreaView>
</template>

<script setup lang="ts"></script>
`
}

export function generateHtmlAppVue(
  starter: HtmlStarterProfile = 'default',
  options?: Partial<StarterModuleOptions>,
): string {
  const features = normalizeStarterModuleOptions(options)
  if (features.router) {
    return generateRouterShellAppVue()
  }

  switch (starter) {
    case 'app':
      return generateNativeAppVue()
    case 'game-ui':
      return generateGameUiAppVue()
    default:
      return generateDefaultHtmlAppVue()
  }
}

function generateRouterTs(): string {
  return `import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeScreen from '../screens/HomeScreen.vue'
import SettingsScreen from '../screens/SettingsScreen.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeScreen },
  { path: '/settings', name: 'settings', component: SettingsScreen },
]

export const router = createRouter({
  history: createWebHistory('/'),
  routes,
})
`
}

function generateStorageTs(): string {
  return `const preferencePrefix = 'vue-godot:preference:'

export function readPreference(key: string, fallback = ''): string {
  return localStorage.getItem(preferencePrefix + key) ?? fallback
}

export function writePreference(key: string, value: string): void {
  localStorage.setItem(preferencePrefix + key, value)
}
`
}

function generateNetworkTs(): string {
  return `import { checkNetworkReachability } from '@vue-godot/browser'

export async function readNetworkStatus(): Promise<string> {
  return (await checkNetworkReachability()) ? 'reachable' : 'offline'
}
`
}

function generateDeviceTs(): string {
  return `import { isSupported, type DeviceCapabilityName } from '@vue-godot/device'

export async function readDeviceApiStatus(
  capability: DeviceCapabilityName = 'share',
): Promise<string> {
  return (await isSupported(capability)) ? 'registered' : 'not registered'
}
`
}

function generateHomeScreenVue(options: StarterModuleOptions): string {
  const vueImports = ['computed']
  if (options.network || options.deviceApi) {
    vueImports.push('onMounted')
  }
  if (options.storage || options.network || options.deviceApi) {
    vueImports.push('ref')
  }

  const storageImport = options.storage
    ? "import { readPreference, writePreference } from '../app/storage'\n"
    : ''
  const networkImport = options.network
    ? "import { readNetworkStatus } from '../app/network'\n"
    : ''
  const deviceImport = options.deviceApi
    ? "import { readDeviceApiStatus } from '../app/device'\n"
    : ''

  const storageTemplate = options.storage
    ? `\n      <Div :style="{ flexDirection: 'column', gap: 8 }">
        <Span :style="{ color: '#475569' }">Preference</Span>
        <Input v-model="mode" placeholder="Display mode"></Input>
        <Button @click="saveMode">Save preference</Button>
        <Span :style="{ color: '#475569' }">Saved: {{ savedMode }}</Span>
      </Div>`
    : ''
  const networkTemplate = options.network
    ? `\n      <Div :style="{ flexDirection: 'column', gap: 8 }">
        <Button @click="refreshNetwork">Refresh network</Button>
        <Span :style="{ color: '#475569' }">Network: {{ networkStatus }}</Span>
      </Div>`
    : ''
  const deviceTemplate = options.deviceApi
    ? `\n      <Div :style="{ flexDirection: 'column', gap: 8 }">
        <Button @click="refreshDeviceApi">Refresh device API</Button>
        <Span :style="{ color: '#475569' }">Share API: {{ deviceStatus }}</Span>
      </Div>`
    : ''

  const storageSetup = options.storage
    ? `
const mode = ref(readPreference('mode', 'balanced'))
const savedMode = ref(mode.value)

function saveMode() {
  writePreference('mode', mode.value)
  savedMode.value = mode.value
}
`
    : ''
  const networkSetup = options.network
    ? `
const networkStatus = ref('unchecked')

async function refreshNetwork() {
  networkStatus.value = await readNetworkStatus()
}
`
    : ''
  const deviceSetup = options.deviceApi
    ? `
const deviceStatus = ref('unchecked')

async function refreshDeviceApi() {
  deviceStatus.value = await readDeviceApiStatus()
}
`
    : ''
  const mountedCalls = [
    options.network ? 'void refreshNetwork()' : '',
    options.deviceApi ? 'void refreshDeviceApi()' : '',
  ].filter(Boolean)
  const mountedSetup =
    mountedCalls.length > 0
      ? `
onMounted(() => {
  ${mountedCalls.join('\n  ')}
})
`
      : ''

  return `<template>
  <Div
    :style="{
      flexDirection: 'column',
      gap: 12,
      padding: 16,
      backgroundColor: '#f8fafc',
      borderRadius: 6,
      width: 560,
    }"
  >
    <Span :style="{ fontSize: 22, fontWeight: 'bold', color: '#172033' }">
      Home
    </Span>
    <Span :style="{ color: '#475569' }">Route: {{ routePath }}</Span>${storageTemplate}${networkTemplate}${deviceTemplate}
    <Button @click="openSettings">Open settings</Button>
  </Div>
</template>

<script setup lang="ts">
import { ${vueImports.join(', ')} } from 'vue'
import { useRoute, useRouter } from 'vue-router'
${storageImport}${networkImport}${deviceImport}
const route = useRoute()
const router = useRouter()
const routePath = computed(() => route.fullPath)
${storageSetup}${networkSetup}${deviceSetup}
function openSettings() {
  void router.push('/settings')
}
${mountedSetup}</script>
`
}

function generateSettingsScreenVue(): string {
  return `<template>
  <Div
    :style="{
      flexDirection: 'column',
      gap: 12,
      padding: 16,
      backgroundColor: '#f8fafc',
      borderRadius: 6,
      width: 560,
    }"
  >
    <Span :style="{ fontSize: 22, fontWeight: 'bold', color: '#172033' }">
      Settings
    </Span>
    <Span :style="{ color: '#475569' }">
      Route-backed screens can still render Godot-backed HTML components.
    </Span>
    <Button @click="goHome">Done</Button>
  </Div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  void router.push('/')
}
</script>
`
}

export function writeStarterFeatureFiles(
  vueDir: string,
  options?: Partial<StarterModuleOptions>,
  cwd = process.cwd(),
): void {
  const features = normalizeStarterModuleOptions(options)
  if (
    !features.router &&
    !features.storage &&
    !features.network &&
    !features.deviceApi
  ) {
    return
  }

  const appDir = path.join(vueDir, 'src', 'app')
  fs.mkdirSync(appDir, { recursive: true })

  function writeGenerated(relativePath: string, content: string): void {
    const filePath = path.join(vueDir, 'src', relativePath)
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, content)
    console.log(`  created ${path.relative(cwd, filePath)}`)
  }

  if (features.router) {
    writeGenerated('app/router.ts', generateRouterTs())
    writeGenerated('screens/HomeScreen.vue', generateHomeScreenVue(features))
    writeGenerated('screens/SettingsScreen.vue', generateSettingsScreenVue())
  }
  if (features.storage) {
    writeGenerated('app/storage.ts', generateStorageTs())
  }
  if (features.network) {
    writeGenerated('app/network.ts', generateNetworkTs())
  }
  if (features.deviceApi) {
    writeGenerated('app/device.ts', generateDeviceTs())
  }
}

/* ------------------------------------------------------------------ */
/*  Main                                                              */
/* ------------------------------------------------------------------ */

export async function integrate(options: IntegrateOptions): Promise<void> {
  const { targetDir, force } = options
  const { html, device, router, storage, network, deviceApi } =
    resolveProjectFeatures(options)
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

  /* --- keep generated resource type stubs out of Godot's scan --- */
  const genTplDir = path.join(templatesDir, 'gen')

  if (!fs.existsSync(genTplDir)) {
    console.error(
      `Template directory not found: ${genTplDir}\nThe CLI package may not be installed correctly.`,
    )
    process.exit(1)
  }

  copyTemplateDir(genTplDir, path.join(absTarget, 'gen'), {}, process.cwd())
  copyGodotScanIgnoreScaffold(absTarget, process.cwd())
  copyProductionSupportFiles(absTarget, process.cwd())

  /* --- apply HTML-mode overrides --- */
  if (html) {
    const viteConfigPath = path.join(vueDir, 'vite.config.ts')
    fs.writeFileSync(viteConfigPath, generateHtmlViteConfig())
    console.log(
      `  updated ${path.relative(process.cwd(), viteConfigPath)} (html mode)`,
    )

    const mainTsPath = path.join(vueDir, 'src', 'main.ts')
    fs.writeFileSync(
      mainTsPath,
      generateHtmlMainTs({ router, storage, network, deviceApi }),
    )
    console.log(
      `  updated ${path.relative(process.cwd(), mainTsPath)} (html mode)`,
    )

    const appCssPath = path.join(vueDir, 'src', 'app.css')
    fs.writeFileSync(appCssPath, generateHtmlCss())
    console.log(
      `  updated ${path.relative(process.cwd(), appCssPath)} (html mode)`,
    )

    const appVuePath = path.join(vueDir, 'src', 'App.vue')
    fs.writeFileSync(
      appVuePath,
      generateHtmlAppVue('default', { router, storage, network, deviceApi }),
    )
    console.log(
      `  updated ${path.relative(process.cwd(), appVuePath)} (html mode)`,
    )

    addHtmlVolarPlugin(vueDir, process.cwd())
    writeStarterFeatureFiles(
      vueDir,
      { router, storage, network, deviceApi },
      process.cwd(),
    )
  }

  /* --- package.json --- */
  const pkgJsonPath = path.join(absTarget, 'package.json')

  if (fs.existsSync(pkgJsonPath)) {
    const existing = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
    existing.scripts = applyRuntimeScripts(existing.scripts || {})
    existing.scripts.dev ??= 'vite build --watch -c vue/vite.config.ts'
    existing.scripts.build ??= 'vite build -c vue/vite.config.ts'
    existing.scripts['check:exports'] ??=
      'node scripts/check-export-settings.mjs'
    existing.scripts.postinstall ??= 'npm run setup:runtime && npm run build'

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
    existing.dependencies['godot-js-runtime'] ??= packageSpec(
      'godot-js-runtime',
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
    if (html || device) {
      existing.dependencies['@vue-godot/device'] ??= packageSpec(
        '@vue-godot/device',
        packageOverrides,
      )
    }
    if (router) {
      existing.dependencies['vue-router'] ??= packageSpec(
        'vue-router',
        packageOverrides,
      )
    }

    fs.writeFileSync(pkgJsonPath, JSON.stringify(existing, null, 2) + '\n')
    console.log(`  updated ${path.relative(process.cwd(), pkgJsonPath)}`)
  } else {
    const name = path.basename(absTarget)
    fs.writeFileSync(
      pkgJsonPath,
      JSON.stringify(
        newPackageJson(name, {
          html,
          device,
          router,
          storage,
          network,
          deviceApi,
        }),
        null,
        2,
      ) + '\n',
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
  console.log(`  2. npm run setup:runtime`)
  console.log(
    `  3. npm run dev          (rebuilds on change; Godot hot-reloads dist/app.js)`,
  )
}
