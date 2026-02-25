import * as fs from 'node:fs'
import * as path from 'node:path'
import { copyTemplateDir, getTemplatesDir, newPackageJson } from './integrate.js'

export interface CreateOptions {
  projectName: string
  force: boolean
}

export async function create(options: CreateOptions): Promise<void> {
  const { projectName, force } = options
  const absTarget = path.resolve(projectName)

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
  const pkgJsonPath = path.join(absTarget, 'package.json')
  fs.writeFileSync(
    pkgJsonPath,
    JSON.stringify(newPackageJson(projectName), null, 2) + '\n',
  )
  console.log(`  created ${path.relative(process.cwd(), pkgJsonPath)}`)

  console.log(
    `\n✔ Project "${projectName}" created at ${path.relative(process.cwd(), absTarget)}`,
  )
  console.log(`\nNext steps:`)
  console.log(`  cd ${projectName}`)
  console.log(`  npm install`)
  console.log(`  npm run build`)
  console.log(`  # Open the project in Godot and hit Play`)
}
