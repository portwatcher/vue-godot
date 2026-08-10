import * as fs from 'node:fs'
import * as path from 'node:path'

export type DoctorStatus = 'ok' | 'warning' | 'error'

export interface DoctorCheck {
  status: DoctorStatus
  label: string
  details: string[]
}

export interface DoctorOptions {
  targetDir: string
  exportsOnly?: boolean
  migration?: boolean
  nodeVersion?: string
}

export interface DoctorReport {
  targetDir: string
  checks: DoctorCheck[]
  errorCount: number
  warningCount: number
}

export interface DoctorOutput {
  log(message: string): void
}

interface AndroidRequirement {
  label: string
  markers: string[]
}

interface FeatureRule {
  id: string
  label: string
  patterns: RegExp[]
  android: AndroidRequirement[]
  ios: string[]
}

interface PackageRequirement {
  name: string
  field: 'dependencies' | 'devDependencies'
  reason: string
}

type MigrationTier = 'small-change' | 'medium' | 'rewrite'

interface MigrationFinding {
  tier: MigrationTier
  area: 'css' | 'dom' | 'component'
  file: string
  line: number
  message: string
  suggestion: string
}

const MIN_NODE_MAJOR = 18

const TEXT_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.ts',
  '.tsx',
  '.vue',
])

const CSS_EXTENSIONS = new Set(['.css'])

// Keep this audit allow-list aligned with packages/html/src/utils/styleMapping.ts.
// The CLI must run in plain Node without importing Godot-backed HTML modules.
const SUPPORTED_CSS_PROPERTIES = new Set([
  'display',
  'flex-direction',
  'flex-wrap',
  'justify-content',
  'align-items',
  'align-self',
  'flex',
  'gap',
  'columns',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'width',
  'height',
  'min-width',
  'min-height',
  'max-width',
  'max-height',
  'object-fit',
  'background',
  'background-color',
  'background-image',
  'border',
  'border-color',
  'border-style',
  'border-width',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'border-radius',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-right-radius',
  'border-bottom-left-radius',
  'color',
  'font-size',
  'font-family',
  'font-weight',
  'text-transform',
  'text-align',
  'transform',
  'transition',
  'transition-property',
  'transition-duration',
  'transition-delay',
  'transition-timing-function',
  'animation-name',
  'animation-duration',
  'animation-delay',
  'animation-timing-function',
  'animation-iteration-count',
  'animation-direction',
  'overflow-wrap',
  'overflow',
  'opacity',
])

const HTML_COMPONENT_SUGGESTIONS = new Map([
  ['div', 'Div'],
  ['span', 'Span'],
  ['button', 'Button'],
  ['input', 'Input'],
  ['textarea', 'Textarea'],
  ['select', 'Select'],
  ['option', 'Option'],
  ['form', 'Form'],
  ['img', 'Img'],
  ['a', 'A'],
  ['canvas', 'Canvas'],
  ['video', 'Video'],
  ['audio', 'Audio'],
])

const SUPPORTED_SELECTOR_PSEUDO_CLASSES = new Set([
  'hover',
  'active',
  'pressed',
  'focus',
  'focus-visible',
  'disabled',
  'checked',
  'read-only',
  'selected',
])

const EXPORT_FEATURE_RULES: FeatureRule[] = [
  {
    id: 'network',
    label: 'network requests, WebSocket, or reachability probes',
    patterns: [
      /\bfetch\s*\(/,
      /\bWebSocket\b/,
      /\bcheckNetworkReachability\b/,
      /\bconfigureNetworkReachability\b/,
    ],
    android: [
      {
        label: 'android.permission.INTERNET',
        markers: ['android.permission.INTERNET', 'permissions/internet=true'],
      },
    ],
    ios: [],
  },
  {
    id: 'vibration',
    label: 'handheld vibration',
    patterns: [
      /\bnavigator\.vibrate\b/,
      /\bvibrate\s*\(/,
      /\bisVibrationSupported\b/,
    ],
    android: [
      {
        label: 'android.permission.VIBRATE',
        markers: ['android.permission.VIBRATE', 'permissions/vibrate=true'],
      },
    ],
    ios: [],
  },
  {
    id: 'geolocation',
    label: 'geolocation',
    patterns: [
      /\bnavigator\.geolocation\b/,
      /\bgeolocation\b/,
      /capability\s*:\s*['"]geolocation['"]/,
    ],
    android: [
      {
        label:
          'android.permission.ACCESS_FINE_LOCATION or android.permission.ACCESS_COARSE_LOCATION',
        markers: [
          'android.permission.ACCESS_FINE_LOCATION',
          'android.permission.ACCESS_COARSE_LOCATION',
          'permissions/access_fine_location=true',
          'permissions/access_coarse_location=true',
        ],
      },
    ],
    ios: ['NSLocationWhenInUseUsageDescription'],
  },
  {
    id: 'camera',
    label: 'camera capture',
    patterns: [
      /\bgetUserMedia\s*\(/,
      /\bCameraView\b/,
      /capability\s*:\s*['"]camera['"]/,
      /capability\s*:\s*['"]media-devices['"]/,
    ],
    android: [
      {
        label: 'android.permission.CAMERA',
        markers: ['android.permission.CAMERA', 'permissions/camera=true'],
      },
    ],
    ios: ['NSCameraUsageDescription'],
  },
  {
    id: 'microphone',
    label: 'microphone capture',
    patterns: [
      /\bgetUserMedia\s*\(/,
      /audio\s*:\s*true/,
      /capability\s*:\s*['"]microphone['"]/,
      /capability\s*:\s*['"]media-devices['"]/,
    ],
    android: [
      {
        label: 'android.permission.RECORD_AUDIO',
        markers: [
          'android.permission.RECORD_AUDIO',
          'permissions/record_audio=true',
        ],
      },
    ],
    ios: ['NSMicrophoneUsageDescription'],
  },
  {
    id: 'notifications',
    label: 'native notifications',
    patterns: [/\bNotification\b/, /capability\s*:\s*['"]notifications['"]/],
    android: [
      {
        label: 'android.permission.POST_NOTIFICATIONS',
        markers: [
          'android.permission.POST_NOTIFICATIONS',
          'permissions/post_notifications=true',
        ],
      },
    ],
    ios: [],
  },
]

const PLUGIN_BACKED_FEATURES = new Map([
  ['geolocation', 'GeolocationAdapter'],
  ['camera', 'MediaDevicesAdapter or camera plugin'],
  ['microphone', 'MediaDevicesAdapter or microphone plugin'],
  ['notifications', 'NotificationAdapter'],
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    isRecord(value) &&
    Object.values(value).every((entry) => typeof entry === 'string')
  )
}

function addCheck(
  checks: DoctorCheck[],
  status: DoctorStatus,
  label: string,
  details: string[] = [],
): void {
  checks.push({ status, label, details })
}

function readJsonFile(
  filePath: string,
): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return {
      ok: true,
      value: JSON.parse(fs.readFileSync(filePath, 'utf-8')) as unknown,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { ok: false, error: message }
  }
}

function dependencyField(
  packageJson: Record<string, unknown>,
  field: 'dependencies' | 'devDependencies',
): Record<string, string> {
  const value = packageJson[field]
  return isStringRecord(value) ? value : {}
}

function packageSpec(
  packageJson: Record<string, unknown>,
  packageName: string,
): string | null {
  for (const field of ['dependencies', 'devDependencies'] as const) {
    const deps = dependencyField(packageJson, field)
    if (deps[packageName]) {
      return deps[packageName]
    }
  }
  return null
}

function packagePath(packageName: string): string[] {
  return packageName.split('/')
}

function findNodeModules(from: string): string | null {
  let dir = path.resolve(from)
  while (true) {
    const candidate = path.join(dir, 'node_modules')
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate
    }
    const parent = path.dirname(dir)
    if (parent === dir) {
      return null
    }
    dir = parent
  }
}

function findInstalledPackageJson(
  targetDir: string,
  packageName: string,
): string | null {
  let dir = path.resolve(targetDir)
  while (true) {
    const candidate = path.join(
      dir,
      'node_modules',
      ...packagePath(packageName),
      'package.json',
    )
    if (fs.existsSync(candidate)) {
      return candidate
    }
    const parent = path.dirname(dir)
    if (parent === dir) {
      return null
    }
    dir = parent
  }
}

function installedPackageVersion(
  targetDir: string,
  packageName: string,
): string | null {
  const packageJsonPath = findInstalledPackageJson(targetDir, packageName)
  if (!packageJsonPath) {
    return null
  }
  const parsed = readJsonFile(packageJsonPath)
  if (!parsed.ok || !isRecord(parsed.value)) {
    return null
  }
  const version = parsed.value['version']
  return typeof version === 'string' ? version : null
}

function walkFiles(root: string, extensions: ReadonlySet<string>): string[] {
  if (!fs.existsSync(root)) {
    return []
  }

  const files: string[] = []
  const entries = fs.readdirSync(root, { withFileTypes: true })

  for (const entry of entries) {
    const absolutePath = path.join(root, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') {
        continue
      }
      files.push(...walkFiles(absolutePath, extensions))
      continue
    }

    if (entry.isFile() && extensions.has(path.extname(entry.name))) {
      files.push(absolutePath)
    }
  }

  return files
}

function walkTextFiles(root: string): string[] {
  return walkFiles(root, TEXT_EXTENSIONS)
}

function walkCssFiles(root: string): string[] {
  return walkFiles(root, CSS_EXTENSIONS)
}

function readSourceCorpus(targetDir: string): string {
  const chunks: string[] = []
  for (const rootName of ['vue', 'src']) {
    const root = path.join(targetDir, rootName)
    for (const filePath of walkTextFiles(root)) {
      chunks.push(fs.readFileSync(filePath, 'utf-8'))
    }
  }
  return chunks.join('\n')
}

function lineNumberAt(text: string, index: number): number {
  let line = 1
  for (let cursor = 0; cursor < index; cursor++) {
    if (text[cursor] === '\n') {
      line += 1
    }
  }
  return line
}

function relativeProjectPath(targetDir: string, filePath: string): string {
  return path.relative(targetDir, filePath).split(path.sep).join('/')
}

function migrationTierWeight(tier: MigrationTier): number {
  switch (tier) {
    case 'small-change':
      return 1
    case 'medium':
      return 2
    case 'rewrite':
      return 3
  }
}

function strongestMigrationTier(
  findings: readonly MigrationFinding[],
): MigrationTier {
  let tier: MigrationTier = 'small-change'
  for (const finding of findings) {
    if (migrationTierWeight(finding.tier) > migrationTierWeight(tier)) {
      tier = finding.tier
    }
  }
  return tier
}

function addMigrationFinding(
  findings: MigrationFinding[],
  tier: MigrationTier,
  area: MigrationFinding['area'],
  file: string,
  line: number,
  message: string,
  suggestion: string,
): void {
  findings.push({ tier, area, file, line, message, suggestion })
}

function detectFeatures(source: string): FeatureRule[] {
  return EXPORT_FEATURE_RULES.filter((rule) =>
    rule.patterns.some((pattern) => pattern.test(source)),
  )
}

function isSupportedMigrationSelector(selector: string): boolean {
  if (selector === ':root') {
    return true
  }

  if (
    selector.includes(' ') ||
    selector.includes('>') ||
    selector.includes('+') ||
    selector.includes('~') ||
    selector.includes('[') ||
    selector.includes('#') ||
    selector.includes('*') ||
    selector.includes('::') ||
    selector.includes('(') ||
    selector.includes(')')
  ) {
    return false
  }

  const pseudoMatches = [...selector.matchAll(/:([a-z-]+)/g)]
  for (const match of pseudoMatches) {
    if (!SUPPORTED_SELECTOR_PSEUDO_CLASSES.has(match[1])) {
      return false
    }
  }

  const baseSelector = selector.replace(/:[a-z-]+/g, '')
  if (!baseSelector) {
    return false
  }

  const identifier = '[A-Za-z_][A-Za-z0-9_-]*'
  const typeSelector = '[A-Za-z][A-Za-z0-9_-]*'
  return new RegExp(`^(?:${typeSelector})?(?:\\.${identifier})*$`).test(
    baseSelector,
  )
}

function classifyUnsupportedCssProperty(property: string): {
  tier: MigrationTier
  suggestion: string
} {
  switch (property) {
    case 'position':
    case 'top':
    case 'right':
    case 'bottom':
    case 'left':
    case 'z-index':
      return {
        tier: 'medium',
        suggestion:
          'Replace browser positioning with Godot containers, Screen/Overlay, or explicit Control sizing.',
      }
    case 'float':
    case 'clear':
      return {
        tier: 'rewrite',
        suggestion:
          'Rewrite float layout as Div row/column containers or Godot layout nodes.',
      }
    case 'grid-template-areas':
    case 'grid-area':
    case 'grid-template-columns':
    case 'grid-template-rows':
      return {
        tier: 'medium',
        suggestion:
          'Use the supported Div grid columns subset or explicit nested containers.',
      }
    case 'box-shadow':
    case 'filter':
    case 'backdrop-filter':
      return {
        tier: 'small-change',
        suggestion:
          'Approximate the visual treatment with supported borders/backgrounds or a Godot-native asset.',
      }
    default:
      return {
        tier: 'small-change',
        suggestion:
          'Replace with a documented HtmlStyle property or a component-specific prop.',
      }
  }
}

function scanCssForMigration(
  findings: MigrationFinding[],
  targetDir: string,
): void {
  for (const rootName of ['vue', 'src']) {
    const root = path.join(targetDir, rootName)
    for (const filePath of walkCssFiles(root)) {
      const source = fs.readFileSync(filePath, 'utf-8')
      const relativePath = relativeProjectPath(targetDir, filePath)

      for (const match of source.matchAll(/@([a-z-]+)\b[^;{]*(?:;|\{)/gi)) {
        const ruleName = match[1].toLowerCase()
        if (ruleName === 'media') {
          continue
        }

        const atRule = match[0].replace(/[;{]\s*$/, '').trim()
        addMigrationFinding(
          findings,
          ruleName === 'keyframes' ? 'rewrite' : 'medium',
          'css',
          relativePath,
          lineNumberAt(source, match.index ?? 0),
          `Unsupported CSS at-rule "${atRule}".`,
          'Move animations to registerStyleKeyframes() or replace the at-rule with supported class rules.',
        )
      }

      for (const match of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        const selectorText = match[1].trim()
        const body = match[2]
        const line = lineNumberAt(source, match.index ?? 0)

        if (selectorText.startsWith('@')) {
          continue
        }

        for (const selector of selectorText
          .split(',')
          .map((part) => part.trim())) {
          if (selector && !isSupportedMigrationSelector(selector)) {
            addMigrationFinding(
              findings,
              'medium',
              'css',
              relativePath,
              line,
              `Selector "${selector}" is outside the Vue Godot stylesheet subset.`,
              'Use type selectors, class selectors, type.class, groups, or supported state pseudo-classes.',
            )
          }
        }

        for (const declaration of body.split(';')) {
          const [propertyName] = declaration.split(':')
          const property = propertyName?.trim().toLowerCase()
          if (
            !property ||
            property.startsWith('--') ||
            SUPPORTED_CSS_PROPERTIES.has(property)
          ) {
            continue
          }

          const classification = classifyUnsupportedCssProperty(property)
          addMigrationFinding(
            findings,
            classification.tier,
            'css',
            relativePath,
            line,
            `CSS property "${property}" is not in the Godot-backed style subset.`,
            classification.suggestion,
          )
        }
      }
    }
  }
}

const DOM_MIGRATION_PATTERNS: {
  pattern: RegExp
  tier: MigrationTier
  message: string
  suggestion: string
}[] = [
  {
    pattern:
      /\bdocument\.(querySelector|getElementById|getElementsByClassName|getElementsByTagName)\b/g,
    tier: 'medium',
    message: 'Direct DOM querying is used.',
    suggestion: 'Use Vue refs to HTML-like components or Godot node refs.',
  },
  {
    pattern: /\bdocument\.createElement\b|\bDOMParser\b|\binnerHTML\b/g,
    tier: 'rewrite',
    message: 'Runtime DOM construction or HTML parsing is used.',
    suggestion:
      'Rewrite this area as Vue component state/rendering or explicit Godot nodes.',
  },
  {
    pattern:
      /\b(HTMLElement|Element|NodeList|MutationObserver|ResizeObserver|IntersectionObserver)\b/g,
    tier: 'rewrite',
    message: 'Browser DOM types or observers are referenced.',
    suggestion:
      'Replace DOM measurement/observer logic with Vue state, Godot signals, or component props.',
  },
  {
    pattern: /\bgetComputedStyle\s*\(/g,
    tier: 'medium',
    message: 'Computed CSS reads are used.',
    suggestion:
      'Keep style state in Vue data or use explicit Godot node properties instead of CSSOM reads.',
  },
  {
    pattern:
      /\bwindow\.(innerWidth|innerHeight|matchMedia|requestAnimationFrame)\b/g,
    tier: 'medium',
    message: 'Browser window layout/timing APIs are used.',
    suggestion:
      'Use Godot viewport metrics, responsive stylesheet buckets, or Godot process/tween APIs.',
  },
  {
    pattern: /\bcanvas\.getContext\s*\(/g,
    tier: 'rewrite',
    message: 'Browser canvas drawing context is used.',
    suggestion:
      'Use the Control-backed Canvas ref with Godot drawing or a custom Godot Control.',
  },
]

function scanVueSourcesForMigration(
  findings: MigrationFinding[],
  targetDir: string,
): void {
  for (const rootName of ['vue', 'src']) {
    const root = path.join(targetDir, rootName)
    for (const filePath of walkTextFiles(root)) {
      const source = fs.readFileSync(filePath, 'utf-8')
      const relativePath = relativeProjectPath(targetDir, filePath)

      for (const rule of DOM_MIGRATION_PATTERNS) {
        for (const match of source.matchAll(rule.pattern)) {
          addMigrationFinding(
            findings,
            rule.tier,
            'dom',
            relativePath,
            lineNumberAt(source, match.index ?? 0),
            rule.message,
            rule.suggestion,
          )
        }
      }

      if (path.extname(filePath) !== '.vue') {
        continue
      }

      for (const [tag, component] of HTML_COMPONENT_SUGGESTIONS) {
        const tagPattern = new RegExp(`<${tag}(\\s|>|/)`, 'gi')
        for (const match of source.matchAll(tagPattern)) {
          addMigrationFinding(
            findings,
            'small-change',
            'component',
            relativePath,
            lineNumberAt(source, match.index ?? 0),
            `Browser tag <${tag}> can map to <${component}>.`,
            `Use <${component}></${component}> from @vue-godot/html and keep tags explicitly closed.`,
          )
        }
      }
    }
  }
}

function findMissingRequirements(
  exportPresets: string,
  requirements: AndroidRequirement[],
): string[] {
  return requirements
    .filter((requirement) =>
      requirement.markers.every((marker) => !exportPresets.includes(marker)),
    )
    .map((requirement) => requirement.label)
}

function diagnoseNode(checks: DoctorCheck[], nodeVersion: string): void {
  const majorText = nodeVersion.split('.')[0]
  const major = Number.parseInt(majorText, 10)
  if (Number.isNaN(major)) {
    addCheck(checks, 'warning', 'Unable to parse Node.js version', [
      `process.versions.node reported ${nodeVersion}`,
    ])
    return
  }
  if (major < MIN_NODE_MAJOR) {
    addCheck(checks, 'error', 'Node.js version is too old', [
      `Found ${nodeVersion}; vue-godot requires Node.js ${MIN_NODE_MAJOR} or newer.`,
    ])
    return
  }
  addCheck(checks, 'ok', 'Node.js version is supported', [
    `Found ${nodeVersion}.`,
  ])
}

function diagnoseProjectShape(checks: DoctorCheck[], targetDir: string): void {
  const projectFile = path.join(targetDir, 'project.godot')
  if (fs.existsSync(projectFile)) {
    addCheck(checks, 'ok', 'Godot project file found', [
      path.relative(targetDir, projectFile),
    ])
  } else {
    addCheck(checks, 'warning', 'Godot project file not found', [
      'Run doctor from the Godot project root or pass the project directory.',
    ])
  }

  const vueDir = path.join(targetDir, 'vue')
  if (fs.existsSync(vueDir)) {
    addCheck(checks, 'ok', 'Vue source directory found', ['vue/'])
  } else {
    addCheck(checks, 'warning', 'Vue source directory not found', [
      'Run vue-godot integrate or create a vue/ source tree before building.',
    ])
  }

  for (const ignoredDir of ['node_modules', 'vue', 'gen', 'typings']) {
    const dirPath = path.join(targetDir, ignoredDir)
    if (!fs.existsSync(dirPath)) {
      continue
    }
    const ignorePath = path.join(dirPath, '.gdignore')
    if (!fs.existsSync(ignorePath)) {
      addCheck(checks, 'warning', `${ignoredDir}/ is missing .gdignore`, [
        'Godot may scan generated or source files that should stay outside the resource import pipeline.',
      ])
    }
  }

  const appBundle = path.join(targetDir, 'dist', 'app.js')
  if (fs.existsSync(appBundle)) {
    addCheck(checks, 'ok', 'Built app bundle found', [
      path.relative(targetDir, appBundle),
    ])
  } else {
    addCheck(checks, 'warning', 'Built app bundle not found', [
      'Run npm run build before opening or exporting the project.',
    ])
  }
}

function diagnoseRuntimeInstallation(
  checks: DoctorCheck[],
  targetDir: string,
): void {
  const descriptor = path.join(
    targetDir,
    'addons/godotjs/godotjs.gdextension',
  )
  if (!fs.existsSync(descriptor)) {
    addCheck(checks, 'warning', 'GodotJS is not installed', [
      'Download the GodotJS ZIP from the GitHub release and extract it at the project root.',
      'Expected: addons/godotjs/godotjs.gdextension',
    ])
  } else {
    const source = fs.readFileSync(descriptor, 'utf-8')
    const libraryPaths = [...source.matchAll(/"res:\/\/([^"\n]+)"/g)].map(
      (match) => match[1],
    )
    const invalidPaths = libraryPaths.filter(
      (relativePath) =>
        !relativePath.startsWith('addons/godotjs/bin/') ||
        !fs.existsSync(path.join(targetDir, ...relativePath.split('/'))),
    )
    if (libraryPaths.length === 0 || invalidPaths.length > 0) {
      addCheck(checks, 'error', 'GodotJS installation is incomplete', [
        ...(libraryPaths.length === 0
          ? ['The GDExtension descriptor has no native libraries.']
          : invalidPaths.map((entry) => `Missing or invalid: ${entry}`)),
        'Extract the complete release ZIP again; do not copy a platform subset.',
      ])
    } else {
      addCheck(checks, 'ok', 'GodotJS installation verified', [
        `${libraryPaths.length} platform library mapping(s) found.`,
      ])
    }
  }

  const typingsDir = path.join(targetDir, 'typings')
  if (!fs.existsSync(typingsDir)) {
    addCheck(checks, 'warning', 'Stock-Godot typings directory not found', [
      'Run npm run gen:types; no custom editor is required.',
    ])
    return
  }

  const requiredTypingFiles = [
    'godot.d.ts',
    'godot-js.d.ts',
    'godot-jsb.d.ts',
    'index.d.ts',
    'manifest.json',
  ]
  const missingTypingFiles = requiredTypingFiles.filter(
    (file) => !fs.existsSync(path.join(typingsDir, file)),
  )
  if (missingTypingFiles.length > 0) {
    addCheck(checks, 'warning', 'Stock-Godot declarations are incomplete', [
      'Run npm run gen:types to regenerate declarations.',
      ...missingTypingFiles,
    ])
  } else {
    addCheck(checks, 'ok', 'Stock-Godot declarations found', [
      'godot, godot-js, and limited godot-jsb modules',
    ])
  }

  const componentTypesPath = path.join(
    typingsDir,
    'godot.vue-components.gen.d.ts',
  )
  if (fs.existsSync(componentTypesPath)) {
    addCheck(checks, 'ok', 'Vue Godot component typings found', [
      path.relative(targetDir, componentTypesPath),
    ])
  } else {
    addCheck(checks, 'warning', 'Vue Godot component typings not found', [
      'Run npm run gen:types to regenerate declarations.',
    ])
  }
}

function detectHtmlMode(packageJson: Record<string, unknown>, source: string) {
  return (
    packageSpec(packageJson, '@vue-godot/html') !== null ||
    source.includes('@vue-godot/html') ||
    source.includes('htmlPlugin')
  )
}

function diagnosePackageSetup(
  checks: DoctorCheck[],
  targetDir: string,
  source: string,
): Record<string, unknown> | null {
  const packageJsonPath = path.join(targetDir, 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    addCheck(checks, 'error', 'package.json not found', [
      'Run doctor from the project root.',
    ])
    return null
  }

  const parsed = readJsonFile(packageJsonPath)
  if (!parsed.ok) {
    addCheck(checks, 'error', 'package.json could not be parsed', [
      parsed.error,
    ])
    return null
  }
  if (!isRecord(parsed.value)) {
    addCheck(checks, 'error', 'package.json must be a JSON object')
    return null
  }

  const required: PackageRequirement[] = [
    {
      name: '@vue-godot/runtime-tscn',
      field: 'dependencies',
      reason: 'Vue renderer runtime',
    },
    {
      name: '@vue/runtime-core',
      field: 'dependencies',
      reason: 'Vue runtime-core renderer target',
    },
    {
      name: '@vue-godot/cli',
      field: 'devDependencies',
      reason: 'project scripts and type generation',
    },
  ]

  if (detectHtmlMode(parsed.value, source)) {
    required.push(
      {
        name: '@vue-godot/browser',
        field: 'dependencies',
        reason: 'browser-like APIs for HTML mode',
      },
      {
        name: '@vue-godot/device',
        field: 'dependencies',
        reason: 'adapter-backed browser/device APIs',
      },
      {
        name: '@vue-godot/html',
        field: 'dependencies',
        reason: 'HTML-like component layer',
      },
    )
  }

  const missing: string[] = []
  for (const requirement of required) {
    const deps = dependencyField(parsed.value, requirement.field)
    if (!deps[requirement.name]) {
      missing.push(
        `${requirement.name} in ${requirement.field} (${requirement.reason})`,
      )
    }
  }
  if (missing.length > 0) {
    addCheck(checks, 'error', 'Required package specs are missing', missing)
  } else {
    addCheck(checks, 'ok', 'Required package specs are present', [
      ...required.map((requirement) => requirement.name),
    ])
  }

  const legacyRuntimeSpec =
    dependencyField(parsed.value, 'dependencies')['godot-js-runtime'] ??
    dependencyField(parsed.value, 'devDependencies')['godot-js-runtime']
  if (legacyRuntimeSpec) {
    addCheck(checks, 'error', 'Legacy runtime npm package must be removed', [
      `godot-js-runtime@${legacyRuntimeSpec}`,
      'GodotJS is a native GDExtension installed under addons/godotjs, not an npm dependency.',
    ])
  }

  const scripts = isStringRecord(parsed.value['scripts'])
    ? parsed.value['scripts']
    : {}
  const legacyRuntimeScripts = [
    'install:runtime',
    'verify:runtime',
    'add-target:runtime',
    'uninstall:runtime',
    'setup:runtime',
  ].filter((name) => scripts[name])
  if (!scripts['gen:types']) {
    addCheck(checks, 'error', 'Vue Godot type-generation script is missing', [
      'Run vue-godot integrate to add gen:types.',
    ])
  } else {
    addCheck(checks, 'ok', 'Vue Godot project script is configured', [
      'gen:types',
    ])
  }
  if (legacyRuntimeScripts.length > 0) {
    addCheck(checks, 'error', 'Legacy runtime installer scripts must be removed', [
      ...legacyRuntimeScripts,
      'Install GodotJS by extracting the release ZIP instead.',
    ])
  }

  if (!findNodeModules(targetDir)) {
    addCheck(checks, 'warning', 'node_modules not found', [
      'Run npm install before building or running generated scripts.',
    ])
  } else {
    const installed: string[] = []
    const missingInstalls: string[] = []
    for (const requirement of required) {
      const version = installedPackageVersion(targetDir, requirement.name)
      if (version) {
        installed.push(`${requirement.name}@${version}`)
      } else {
        missingInstalls.push(requirement.name)
      }
    }
    if (installed.length === required.length) {
      addCheck(checks, 'ok', 'Installed project package versions found', [
        ...installed,
      ])
    } else {
      addCheck(checks, 'warning', 'Some package installs were not found', [
        'Run npm install if node_modules is incomplete.',
        ...missingInstalls,
      ])
    }
  }

  return parsed.value
}

function diagnoseViteAndVolar(
  checks: DoctorCheck[],
  targetDir: string,
  htmlMode: boolean,
): void {
  const viteConfigPath = path.join(targetDir, 'vue', 'vite.config.ts')
  if (!fs.existsSync(viteConfigPath)) {
    addCheck(checks, 'warning', 'Vite config not found', [
      'Expected vue/vite.config.ts.',
    ])
    return
  }

  const viteConfig = fs.readFileSync(viteConfigPath, 'utf-8')
  if (viteConfig.includes('isNativeTag: () => false')) {
    addCheck(checks, 'ok', 'Vue compiler treats all tags as non-native', [
      'isNativeTag: () => false',
    ])
  } else {
    addCheck(checks, 'error', 'Vue compiler native tag override is missing', [
      'Godot has no browser-native HTML tags. Add isNativeTag: () => false.',
    ])
  }

  if (!htmlMode) {
    return
  }

  const tsconfigPath = path.join(targetDir, 'vue', 'tsconfig.json')
  if (!fs.existsSync(tsconfigPath)) {
    addCheck(checks, 'warning', 'HTML Volar tsconfig not found', [
      'Expected vue/tsconfig.json with @vue-godot/html/volar-plugin.',
    ])
    return
  }
  const parsed = readJsonFile(tsconfigPath)
  if (!parsed.ok || !isRecord(parsed.value)) {
    addCheck(checks, 'warning', 'HTML Volar tsconfig could not be parsed', [
      parsed.ok ? 'Expected a JSON object.' : parsed.error,
    ])
    return
  }
  const compilerOptions = parsed.value['vueCompilerOptions']
  const plugins = isRecord(compilerOptions)
    ? compilerOptions['plugins']
    : undefined
  if (
    Array.isArray(plugins) &&
    plugins.includes('@vue-godot/html/volar-plugin')
  ) {
    addCheck(checks, 'ok', 'HTML Volar plugin configured', [
      '@vue-godot/html/volar-plugin',
    ])
  } else {
    addCheck(checks, 'warning', 'HTML Volar plugin is not configured', [
      'Add @vue-godot/html/volar-plugin to vueCompilerOptions.plugins for lowercase HTML component typing.',
    ])
  }
}

function diagnoseExportSettings(
  checks: DoctorCheck[],
  targetDir: string,
  source: string,
): FeatureRule[] {
  const selectedFeatures = detectFeatures(source)
  if (selectedFeatures.length === 0) {
    addCheck(checks, 'ok', 'No export-sensitive APIs detected', [
      'Scanned vue/ and src/.',
    ])
    return selectedFeatures
  }

  addCheck(checks, 'ok', 'Detected export-sensitive APIs', [
    ...selectedFeatures.map((feature) => feature.label),
  ])

  const exportPresetsPath = path.join(targetDir, 'export_presets.cfg')
  if (!fs.existsSync(exportPresetsPath)) {
    addCheck(checks, 'warning', 'export_presets.cfg not found', [
      'Create Godot export presets before release and configure permissions for detected APIs.',
    ])
    return selectedFeatures
  }

  const exportPresets = fs.readFileSync(exportPresetsPath, 'utf-8')
  const missing: string[] = []
  for (const feature of selectedFeatures) {
    const missingAndroid = findMissingRequirements(
      exportPresets,
      feature.android,
    )
    const missingIos = feature.ios.filter(
      (token) => !exportPresets.includes(token),
    )

    if (missingAndroid.length > 0) {
      missing.push(
        `${feature.label}: missing Android export permission(s): ${missingAndroid.join(', ')}`,
      )
    }
    if (missingIos.length > 0) {
      missing.push(
        `${feature.label}: missing iOS plist key(s): ${missingIos.join(', ')}`,
      )
    }
  }

  if (missing.length > 0) {
    addCheck(checks, 'warning', 'Export settings may be incomplete', missing)
  } else {
    addCheck(checks, 'ok', 'Export settings include detected API markers')
  }

  return selectedFeatures
}

function diagnosePluginBackedApis(
  checks: DoctorCheck[],
  source: string,
  selectedFeatures: FeatureRule[],
): void {
  const pluginBacked = selectedFeatures.filter((feature) =>
    PLUGIN_BACKED_FEATURES.has(feature.id),
  )
  if (pluginBacked.length === 0) {
    addCheck(checks, 'ok', 'No plugin-backed device APIs detected')
    return
  }

  const details = pluginBacked.map((feature) => {
    const adapter = PLUGIN_BACKED_FEATURES.get(feature.id) ?? 'adapter'
    return `${feature.label}: confirm ${adapter} registration and native plugin/export setup on target platforms.`
  })

  if (/\bregisterDeviceCapability\b/.test(source)) {
    addCheck(checks, 'ok', 'Plugin-backed API adapter registration detected', [
      ...details,
    ])
  } else {
    addCheck(checks, 'warning', 'Plugin-backed APIs need native adapters', [
      ...details,
      'No registerDeviceCapability() call was found in vue/ or src/.',
    ])
  }
}

function diagnoseMigrationReadiness(
  checks: DoctorCheck[],
  targetDir: string,
): void {
  const findings: MigrationFinding[] = []
  scanCssForMigration(findings, targetDir)
  scanVueSourcesForMigration(findings, targetDir)

  if (findings.length === 0) {
    addCheck(checks, 'ok', 'Migration audit: small-change', [
      'No unsupported CSS selectors/properties or direct DOM assumptions were detected.',
      'Validate behavior in the Godot editor and on target devices.',
    ])
    return
  }

  const overallTier = strongestMigrationTier(findings)
  const counts = new Map<MigrationTier, number>([
    ['small-change', 0],
    ['medium', 0],
    ['rewrite', 0],
  ])

  for (const finding of findings) {
    counts.set(finding.tier, (counts.get(finding.tier) ?? 0) + 1)
  }

  const displayedFindings = findings.slice(0, 20)
  const details = [
    `Overall migration tier: ${overallTier}.`,
    `Small-change areas: ${counts.get('small-change') ?? 0}.`,
    `Medium areas: ${counts.get('medium') ?? 0}.`,
    `Rewrite areas: ${counts.get('rewrite') ?? 0}.`,
    ...displayedFindings.map(
      (finding) =>
        `[${finding.tier}/${finding.area}] ${finding.file}:${finding.line} ${finding.message} ${finding.suggestion}`,
    ),
  ]

  if (findings.length > displayedFindings.length) {
    details.push(
      `${findings.length - displayedFindings.length} additional finding(s) omitted.`,
    )
  }

  addCheck(checks, 'warning', `Migration audit: ${overallTier}`, details)
}

export function diagnoseProject(options: DoctorOptions): DoctorReport {
  const targetDir = path.resolve(options.targetDir)
  const checks: DoctorCheck[] = []
  const source = readSourceCorpus(targetDir)

  if (!options.exportsOnly) {
    diagnoseNode(checks, options.nodeVersion ?? process.versions.node)
    diagnoseProjectShape(checks, targetDir)
    diagnoseRuntimeInstallation(checks, targetDir)
    const packageJson = diagnosePackageSetup(checks, targetDir, source)
    if (packageJson) {
      const htmlMode = detectHtmlMode(packageJson, source)
      diagnoseViteAndVolar(checks, targetDir, htmlMode)
    }
  }

  const selectedFeatures = diagnoseExportSettings(checks, targetDir, source)

  if (!options.exportsOnly) {
    diagnosePluginBackedApis(checks, source, selectedFeatures)
  }

  if (options.migration) {
    diagnoseMigrationReadiness(checks, targetDir)
  }

  const errorCount = checks.filter((check) => check.status === 'error').length
  const warningCount = checks.filter(
    (check) => check.status === 'warning',
  ).length

  return { targetDir, checks, errorCount, warningCount }
}

export function printDoctorReport(
  report: DoctorReport,
  output: DoctorOutput = console,
): void {
  output.log(`[vue-godot doctor] Target: ${report.targetDir}`)

  for (const check of report.checks) {
    const prefix =
      check.status === 'ok'
        ? '[ok]'
        : check.status === 'warning'
          ? '[warn]'
          : '[error]'
    output.log(`${prefix} ${check.label}`)
    for (const detail of check.details) {
      output.log(`  - ${detail}`)
    }
  }

  output.log(
    `[vue-godot doctor] ${report.errorCount} error(s), ${report.warningCount} warning(s)`,
  )
}

export function runDoctor(options: DoctorOptions): DoctorReport {
  return diagnoseProject(options)
}
