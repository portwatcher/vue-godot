import * as fs from 'node:fs'
import * as path from 'node:path'
import { spawn } from 'node:child_process'
import { copyTemplateDir, getTemplatesDir, newPackageJson } from './integrate.js'

export interface CreateOptions {
  projectName: string
  force: boolean
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

export async function create(options: CreateOptions): Promise<void> {
  const { projectName, force } = options
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

  /* --- package.json --- */
  const typingsTplDir = path.join(templatesDir, 'typings')
  const typingsDir = path.join(absTarget, 'typings')

  if (!fs.existsSync(typingsTplDir)) {
    console.error(
      `Template directory not found: ${typingsTplDir}\nThe CLI package may not be installed correctly.`,
    )
    process.exit(1)
  }

  copyTemplateDir(typingsTplDir, typingsDir, {}, process.cwd())

  const pkgJsonPath = path.join(absTarget, 'package.json')
  fs.writeFileSync(
    pkgJsonPath,
    JSON.stringify(newPackageJson(packageName), null, 2) + '\n',
  )
  console.log(`  created ${path.relative(process.cwd(), pkgJsonPath)}`)

  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

  console.log(`\nRunning project setup...`)
  console.log(`  npm install`)
  await runCommand(npmCmd, ['install'], absTarget)
  console.log(`  npm run gen:types`)
  await runCommand(npmCmd, ['run', 'gen:types'], absTarget)

  console.log(
    `\n✔ Project "${packageName}" created at ${path.relative(process.cwd(), absTarget)}`,
  )
  console.log(`\nCompleted setup:`)
  console.log(`  cd ${projectName}`)
  console.log(`  npm install        (executed)`)
  console.log(`  npm run gen:types  (executed)`)
  console.log(
    `  npm run dev          # rebuilds on change; Godot hot-reloads dist/app.js`,
  )
  console.log(`  # Open the project in Godot and hit Play`)
}
