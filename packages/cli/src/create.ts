import * as fs from 'node:fs'
import * as path from 'node:path'
import { spawn } from 'node:child_process'
import {
  addHtmlVolarPlugin,
  copyProductionSupportFiles,
  copyGodotScanIgnoreScaffold,
  copyTemplateDir,
  generateHtmlAppVue,
  generateHtmlCss,
  generateHtmlMainTs,
  generateHtmlViteConfig,
  getTemplatesDir,
  newPackageJson,
  resolveProjectFeatures,
  writeStarterFeatureFiles,
  type ProjectFeatureOptions,
} from './integrate.js'

export type CreateProfile = 'app' | 'game-ui'

export interface ResolvedCreateProfile {
  html: boolean
  device: boolean
  router: boolean
  storage: boolean
  network: boolean
  deviceApi: boolean
  htmlStarter: 'default' | CreateProfile
}

export interface CreateOptions extends ProjectFeatureOptions {
  projectName: string
  force: boolean
  profile?: CreateProfile
}

function runCommand(
  command: string,
  args: string[],
  cwd: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: false,
    })

    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) {
        resolve()
        return
      }
      reject(
        new Error(
          `Command failed (${code ?? 'unknown'}): ${command} ${args.join(' ')}`,
        ),
      )
    })
  })
}

export function resolveCreateProfile(options: {
  html?: boolean
  device?: boolean
  router?: boolean
  storage?: boolean
  network?: boolean
  deviceApi?: boolean
  profile?: CreateProfile
}): ResolvedCreateProfile {
  const baseFeatures = {
    router: options.router,
    storage: options.storage,
    network: options.network,
    deviceApi: options.deviceApi,
  }
  switch (options.profile) {
    case 'app': {
      const features = resolveProjectFeatures({
        ...baseFeatures,
        html: true,
        device: true,
      })
      return {
        ...features,
        htmlStarter: 'app',
      }
    }

    case 'game-ui': {
      const features = resolveProjectFeatures({
        ...baseFeatures,
        html: true,
        device: options.device,
      })
      return {
        ...features,
        htmlStarter: 'game-ui',
      }
    }

    default: {
      const features = resolveProjectFeatures({
        ...baseFeatures,
        html: options.html,
        device: options.device,
      })
      return {
        ...features,
        htmlStarter: 'default',
      }
    }
  }
}

export async function create(options: CreateOptions): Promise<void> {
  const { projectName, force } = options
  const { html, device, htmlStarter, router, storage, network, deviceApi } =
    resolveCreateProfile(options)
  const absTarget = path.resolve(projectName)
  const packageName = path.basename(absTarget)

  /* --- guard: directory already exists --- */
  if (fs.existsSync(absTarget)) {
    if (!force) {
      console.error(
        `Directory "${absTarget}" already exists. Use -f to overwrite.`,
      )
      process.exit(1)
    }
    fs.rmSync(absTarget, { recursive: true })
  }

  fs.mkdirSync(absTarget, { recursive: true })

  const templatesDir = getTemplatesDir()

  /* --- copy Godot project template --- */
  const godotTplDir = path.join(templatesDir, 'godot')
  if (!fs.existsSync(godotTplDir)) {
    console.error(
      `Template directory not found: ${godotTplDir}\nThe CLI package may not be installed correctly.`,
    )
    process.exit(1)
  }

  copyTemplateDir(
    godotTplDir,
    absTarget,
    { '{{PROJECT_NAME}}': projectName },
    process.cwd(),
  )

  /* --- copy generated resource type ignore marker --- */
  const genTplDir = path.join(templatesDir, 'gen')
  const genDir = path.join(absTarget, 'gen')

  if (!fs.existsSync(genTplDir)) {
    console.error(
      `Template directory not found: ${genTplDir}\nThe CLI package may not be installed correctly.`,
    )
    process.exit(1)
  }

  copyTemplateDir(genTplDir, genDir, {}, process.cwd())
  copyProductionSupportFiles(absTarget, process.cwd())

  /* --- copy Vue template --- */
  const vueTplDir = path.join(templatesDir, 'vue')
  const vueDir = path.join(absTarget, 'vue')

  if (!fs.existsSync(vueTplDir)) {
    console.error(
      `Template directory not found: ${vueTplDir}\nThe CLI package may not be installed correctly.`,
    )
    process.exit(1)
  }

  // node_modules will live in the project root after npm install
  const nodeModulesRelPath = '../node_modules'

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
      generateHtmlAppVue(htmlStarter, { router, storage, network, deviceApi }),
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
  copyGodotScanIgnoreScaffold(absTarget, process.cwd())

  const pkgJsonPath = path.join(absTarget, 'package.json')
  fs.writeFileSync(
    pkgJsonPath,
    JSON.stringify(
      newPackageJson(packageName, {
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

  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

  console.log(`\nRunning project setup...`)
  console.log(`  npm install`)
  await runCommand(npmCmd, ['install'], absTarget)

  console.log(
    `\n✔ Project "${packageName}" created at ${path.relative(process.cwd(), absTarget)}`,
  )
  console.log(`\nCompleted setup:`)
  console.log(`  cd ${projectName}`)
  console.log(`  npm install        (executed)`)
  console.log(`  Install GodotJS: extract the release ZIP at the project root`)
  console.log(`  npm run gen:types  (executed by postinstall)`)
  console.log(
    `  npm run dev          # rebuilds on change; Godot hot-reloads dist/app.js`,
  )
  console.log(`  # Open the project in an official Godot editor and hit Play`)
}
