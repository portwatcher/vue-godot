import { spawn } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  assertGeneratedOutputIgnoredByGodot,
  assertStableViteChunkNames,
  assertVueSourceIgnoredByGodot,
  createPackedPackageOverrides,
  delay,
  directoryContainsText,
  nodeCommand,
  npmCommand,
  requireBuiltCli,
  run,
  canKillProcessGroup,
  stopProcess,
} from './smoke-utils.mjs'

function hashDirectory(dir) {
  const hash = crypto.createHash('sha256')

  function visit(currentDir, relativeBase = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
    entries.sort((a, b) => a.name.localeCompare(b.name))

    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name)
      const relativePath = path.join(relativeBase, entry.name)

      if (entry.isDirectory()) {
        visit(absolutePath, relativePath)
        continue
      }

      if (entry.isFile()) {
        hash.update(relativePath)
        hash.update('\0')
        hash.update(fs.readFileSync(absolutePath))
        hash.update('\0')
      }
    }
  }

  visit(dir)
  return hash.digest('hex')
}

function countMatches(value, pattern) {
  return [...value.matchAll(pattern)].length
}

function assertHtmlVolarPluginConfigured(target) {
  const tsconfigPath = path.join(target, 'vue/tsconfig.json')
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'))
  const plugins = tsconfig.vueCompilerOptions?.plugins
  if (
    !Array.isArray(plugins) ||
    !plugins.includes('@vue-godot/html/volar-plugin')
  ) {
    throw new Error(
      `${tsconfigPath} must include @vue-godot/html/volar-plugin in vueCompilerOptions.plugins`,
    )
  }
}

function assertProductionSupportConfigured(target) {
  const packageJsonPath = path.join(target, 'package.json')
  const productionDocPath = path.join(target, 'docs/production.md')
  const exportCheckPath = path.join(target, 'scripts/check-export-settings.mjs')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

  if (
    packageJson.scripts?.['check:exports'] !==
    'node scripts/check-export-settings.mjs'
  ) {
    throw new Error(`${packageJsonPath} must include the check:exports script`)
  }
  if (!fs.existsSync(productionDocPath)) {
    throw new Error(`${productionDocPath} must be generated`)
  }
  if (!fs.existsSync(exportCheckPath)) {
    throw new Error(`${exportCheckPath} must be generated`)
  }
}

function assertStarterFeatureFilesConfigured(target) {
  const packageJsonPath = path.join(target, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  if (packageJson.dependencies?.['vue-router'] !== '~4.5.1') {
    throw new Error(`${packageJsonPath} must include vue-router`)
  }

  for (const relativePath of [
    'vue/src/app/router.ts',
    'vue/src/app/storage.ts',
    'vue/src/app/network.ts',
    'vue/src/app/device.ts',
    'vue/src/screens/HomeScreen.vue',
    'vue/src/screens/SettingsScreen.vue',
  ]) {
    const filePath = path.join(target, relativePath)
    if (!fs.existsSync(filePath)) {
      throw new Error(`${filePath} must be generated`)
    }
  }
}

async function waitForWatchCondition(state, description, predicate) {
  const startedAt = Date.now()
  while (Date.now() - startedAt < 30_000) {
    if (predicate()) {
      return
    }
    if (state.exited) {
      throw new Error(
        [
          `Watch process exited before ${description}`,
          state.stdout,
          state.stderr,
        ]
          .filter(Boolean)
          .join('\n'),
      )
    }
    await delay(200)
  }

  throw new Error(
    [`Timed out waiting for ${description}`, state.stdout, state.stderr]
      .filter(Boolean)
      .join('\n'),
  )
}

async function smokeWatchRebuild(target, env) {
  const appVuePath = path.join(target, 'vue/src/App.vue')
  const distDir = path.join(target, 'dist')
  const source = fs.readFileSync(appVuePath, 'utf-8')
  const initialMarker = 'Hello from Vue Godot HTML'

  if (!source.includes(initialMarker)) {
    throw new Error(`Unable to locate expected generated text in ${appVuePath}`)
  }
  if (!directoryContainsText(distDir, initialMarker)) {
    throw new Error(`Unable to locate initial generated text in ${distDir}`)
  }
  assertStableViteChunkNames(target)

  const state = {
    stdout: '',
    stderr: '',
    exited: false,
  }
  const child = spawn(npmCommand, ['run', 'dev'], {
    cwd: target,
    env,
    detached: canKillProcessGroup,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  child.stdout.setEncoding('utf-8')
  child.stderr.setEncoding('utf-8')
  child.stdout.on('data', (chunk) => {
    state.stdout += chunk
  })
  child.stderr.on('data', (chunk) => {
    state.stderr += chunk
  })
  child.on('close', () => {
    state.exited = true
  })

  try {
    await waitForWatchCondition(state, 'initial Vite watch build', () =>
      /built in \d/.test(state.stdout + state.stderr),
    )

    const initialBuildCount = countMatches(
      state.stdout + state.stderr,
      /built in \d/g,
    )
    const beforeHash = hashDirectory(distDir)
    const replacement = `Hello from Vue Godot HTML smoke ${Date.now()}`
    fs.writeFileSync(appVuePath, source.replace(initialMarker, replacement))

    await waitForWatchCondition(state, 'Vite watch rebuild output', () => {
      const output = state.stdout + state.stderr
      return (
        countMatches(output, /built in \d/g) > initialBuildCount &&
        hashDirectory(distDir) !== beforeHash &&
        directoryContainsText(distDir, replacement)
      )
    })
    assertStableViteChunkNames(target)

    console.log('[smoke-cli] html-app npm run dev rebuild smoke passed')
  } finally {
    fs.writeFileSync(appVuePath, source)
    await stopProcess(child)
  }
}

function smokeProject(cliPath, workspaceDir, name, createArgs, env) {
  const target = path.join(workspaceDir, name)
  run(nodeCommand, [cliPath, 'create', ...createArgs, target, '-f'], {
    env,
    stdio: 'inherit',
  })
  run(npmCommand, ['run', 'build'], {
    cwd: target,
    env,
    stdio: 'inherit',
  })
  run(npmCommand, ['run', 'check:exports'], {
    cwd: target,
    env,
    stdio: 'inherit',
  })
  assertStableViteChunkNames(target)
  return target
}

const cliPath = requireBuiltCli()
const workspaceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-smoke-'))
const packDir = path.join(workspaceDir, 'packs')
fs.mkdirSync(packDir)

const packageOverrides = createPackedPackageOverrides(packDir)

const env = {
  ...process.env,
  VUE_GODOT_PACKAGE_OVERRIDES: JSON.stringify(packageOverrides),
}

console.log(`[smoke-cli] workspace: ${workspaceDir}`)
const basicAppDir = smokeProject(cliPath, workspaceDir, 'basic-app', [], env)
assertProductionSupportConfigured(basicAppDir)
const htmlAppDir = smokeProject(
  cliPath,
  workspaceDir,
  'html-app',
  ['--html'],
  env,
)
assertProductionSupportConfigured(htmlAppDir)
assertVueSourceIgnoredByGodot(htmlAppDir)
assertGeneratedOutputIgnoredByGodot(htmlAppDir)
assertHtmlVolarPluginConfigured(htmlAppDir)
await smokeWatchRebuild(htmlAppDir, env)
const nativeAppDir = smokeProject(
  cliPath,
  workspaceDir,
  'native-app',
  ['app'],
  env,
)
assertProductionSupportConfigured(nativeAppDir)
assertVueSourceIgnoredByGodot(nativeAppDir)
assertGeneratedOutputIgnoredByGodot(nativeAppDir)
assertHtmlVolarPluginConfigured(nativeAppDir)
const gameUiAppDir = smokeProject(
  cliPath,
  workspaceDir,
  'game-ui-app',
  ['game-ui'],
  env,
)
assertProductionSupportConfigured(gameUiAppDir)
assertVueSourceIgnoredByGodot(gameUiAppDir)
assertGeneratedOutputIgnoredByGodot(gameUiAppDir)
assertHtmlVolarPluginConfigured(gameUiAppDir)
const featureAppDir = smokeProject(
  cliPath,
  workspaceDir,
  'feature-app',
  ['app', '--router', '--storage', '--network', '--device-api'],
  env,
)
assertProductionSupportConfigured(featureAppDir)
assertVueSourceIgnoredByGodot(featureAppDir)
assertGeneratedOutputIgnoredByGodot(featureAppDir)
assertHtmlVolarPluginConfigured(featureAppDir)
assertStarterFeatureFilesConfigured(featureAppDir)
console.log('[smoke-cli] create profile smoke checks passed')
