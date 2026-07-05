import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultRepoRoot = path.resolve(scriptDir, '..')

const expectedApps = [
  {
    id: 'native-app-demo',
    label: 'native app demo',
    requiredDependencies: [
      '@vue-godot/browser',
      '@vue-godot/device',
      '@vue-godot/html',
      '@vue-godot/runtime-tscn',
    ],
    readmeMarkers: [
      'Production Readiness Coverage',
      'multi-screen routing',
      'form input',
      'network loading',
      'reachability',
      'persistent storage',
      'camera or geolocation',
      'permission',
      'SafeAreaView',
      'KeyboardAvoidingView',
      'Godot smoke',
      'npm run build',
    ],
  },
  {
    id: 'game-ui-demo',
    label: 'game UI demo',
    requiredDependencies: [
      '@vue-godot/browser',
      '@vue-godot/html',
      '@vue-godot/runtime-tscn',
    ],
    readmeMarkers: [
      'Production Readiness Coverage',
      'Godot scene',
      'Vue-rendered HUD',
      'controller',
      'keyboard',
      'touch',
      'animation',
      'audio',
      'video',
      'image assets',
      'pause',
      'settings',
      'inventory',
      'focus restoration',
      'Godot smoke',
      'npm run build',
    ],
  },
]

function usage() {
  console.log(`Usage: node scripts/check-serious-example-apps.mjs [options]

Options:
  --root <path>        Repository root to check. Defaults to the current repo.
  --allow-incomplete  Print failures but exit 0. Useful while TODO.md is open.
  --help              Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    root: defaultRepoRoot,
    allowIncomplete: false,
  }

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
    }

    if (arg === '--allow-incomplete') {
      options.allowIncomplete = true
      continue
    }

    if (arg === '--root') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--root requires a path')
      }
      options.root = path.resolve(value)
      continue
    }

    if (arg.startsWith('--root=')) {
      options.root = path.resolve(arg.slice('--root='.length))
      continue
    }

    throw new Error(`Unknown option: ${arg}`)
  }

  return options
}

function readTextIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : null
}

function readJsonIfExists(filePath) {
  const source = readTextIfExists(filePath)
  return source ? JSON.parse(source) : null
}

function hasDependency(packageJson, dependencyName) {
  return (
    Object.prototype.hasOwnProperty.call(
      packageJson.dependencies ?? {},
      dependencyName,
    ) ||
    Object.prototype.hasOwnProperty.call(
      packageJson.devDependencies ?? {},
      dependencyName,
    )
  )
}

function relative(root, filePath) {
  return path.relative(root, filePath) || '.'
}

function requireFile(root, failures, filePath) {
  if (!fs.existsSync(filePath)) {
    failures.push(`${relative(root, filePath)} is missing`)
    return false
  }
  return true
}

function requireIncludes(root, failures, source, marker, label) {
  if (!source.includes(marker)) {
    failures.push(`${label} must include ${JSON.stringify(marker)}`)
  }
}

function checkPackage(root, failures, app, appRoot) {
  const packageJsonPath = path.join(appRoot, 'package.json')
  const packageJson = readJsonIfExists(packageJsonPath)
  if (!packageJson) {
    failures.push(`${relative(root, packageJsonPath)} is missing`)
    return
  }

  for (const [scriptName, pattern] of [
    ['build', /^npm run build:deps && vite build -c vue\/vite\.config\.ts$/],
    [
      'dev',
      /^npm run build:deps && vite build --watch -c vue\/vite\.config\.ts$/,
    ],
    ['build:deps', /--workspace=@vue-godot\/runtime-tscn build/],
  ]) {
    const script = packageJson.scripts?.[scriptName] ?? ''
    if (!pattern.test(script)) {
      failures.push(
        `${relative(root, packageJsonPath)} script ${scriptName} must match ${pattern}`,
      )
    }
  }

  if (packageJson.scripts?.['gen:types'] !== 'vue-godot gen-types') {
    failures.push(
      `${relative(root, packageJsonPath)} script gen:types must run vue-godot gen-types`,
    )
  }

  for (const dependencyName of [
    '@vue-godot/cli',
    '@vitejs/plugin-vue',
    'vite',
    '@vue/runtime-core',
    ...app.requiredDependencies,
  ]) {
    if (!hasDependency(packageJson, dependencyName)) {
      failures.push(
        `${relative(root, packageJsonPath)} must depend on ${dependencyName}`,
      )
    }
  }
}

function checkApp(root, failures, app) {
  const appRoot = path.join(root, 'apps', app.id)
  const requiredFiles = [
    'README.md',
    'project.godot',
    'app.tscn',
    'vue/vite.config.ts',
    'vue/src/main.ts',
    'vue/src/env.d.ts',
    'vue/src/App.vue',
  ]

  for (const fileName of requiredFiles) {
    requireFile(root, failures, path.join(appRoot, fileName))
  }

  checkPackage(root, failures, app, appRoot)

  const readmePath = path.join(appRoot, 'README.md')
  const readme = readTextIfExists(readmePath)
  if (readme) {
    for (const marker of app.readmeMarkers) {
      requireIncludes(
        root,
        failures,
        readme,
        marker,
        relative(root, readmePath),
      )
    }
  }
}

function checkRepositoryWiring(root, failures) {
  const rootReadmePath = path.join(root, 'README.md')
  const rootReadme = readTextIfExists(rootReadmePath)
  if (!rootReadme) {
    failures.push('README.md is missing')
  }

  const fixtureTestPath = path.join(root, 'test/fixture-apps.test.mjs')
  const fixtureTest = readTextIfExists(fixtureTestPath)
  if (!fixtureTest) {
    failures.push('test/fixture-apps.test.mjs is missing')
  }

  for (const app of expectedApps) {
    if (rootReadme) {
      requireIncludes(
        root,
        failures,
        rootReadme,
        `apps/${app.id}`,
        'README.md examples table',
      )
    }

    if (fixtureTest) {
      requireIncludes(
        root,
        failures,
        fixtureTest,
        `id: '${app.id}'`,
        'test/fixture-apps.test.mjs fixture registry',
      )
    }
  }
}

function checkSeriousExampleApps(root) {
  const failures = []

  for (const app of expectedApps) {
    checkApp(root, failures, app)
  }
  checkRepositoryWiring(root, failures)

  return failures
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const failures = checkSeriousExampleApps(options.root)

  if (failures.length === 0) {
    console.log('[serious-examples] passed')
    return
  }

  console.error('[serious-examples] incomplete')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }

  if (!options.allowIncomplete) {
    process.exit(1)
  }
}

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
