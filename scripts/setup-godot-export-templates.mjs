import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  downloadFile,
  pinnedOfficialGodotVersion,
  resolveZipExtractionCommand,
  runChecked,
  scopedRemove,
} from './setup-godot.mjs'

const scriptPath = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(scriptPath), '..')
const catalogPath = path.join(
  path.dirname(scriptPath),
  'official-godot-export-templates.json',
)
const installMarkerName = '.official-template-install.json'

export const defaultOfficialGodotTemplateCacheDir = path.join(
  repoRoot,
  '.cache/godot-export-templates',
)

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readCatalog() {
  const parsed = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'))
  if (!isRecord(parsed)) {
    throw new Error('Official Godot export template catalog must be an object')
  }
  return parsed
}

export function officialGodotTemplateArtifact(version) {
  const artifact = readCatalog()[version]
  if (!isRecord(artifact)) {
    throw new Error(
      `No pinned official Godot export templates are configured for ${version}`,
    )
  }

  for (const field of ['filename', 'installedVersion', 'sha512']) {
    if (typeof artifact[field] !== 'string' || artifact[field].length === 0) {
      throw new Error(
        `Official Godot export template catalog entry ${version} lacks ${field}`,
      )
    }
  }
  if (!Number.isSafeInteger(artifact.size) || artifact.size <= 0) {
    throw new Error(
      `Official Godot export template catalog entry ${version} has an invalid size`,
    )
  }

  return {
    filename: artifact.filename,
    installedVersion: artifact.installedVersion,
    sha512: artifact.sha512,
    size: artifact.size,
  }
}

export function defaultOfficialGodotTemplateRoot(options = {}) {
  const platform = options.platform ?? process.platform
  const homeDir = path.resolve(options.homeDir ?? os.homedir())
  if (platform === 'darwin') {
    return path.join(
      homeDir,
      'Library/Application Support/Godot/export_templates',
    )
  }
  if (platform === 'linux') {
    const dataHome = options.xdgDataHome
      ? path.resolve(options.xdgDataHome)
      : path.join(homeDir, '.local/share')
    return path.join(dataHome, 'godot/export_templates')
  }
  if (platform === 'win32') {
    const appData = options.appData ?? process.env.APPDATA
    if (!appData) {
      throw new Error('APPDATA is required to locate Godot export templates')
    }
    return path.join(path.resolve(appData), 'Godot/export_templates')
  }
  throw new Error(`Unsupported Godot export template host: ${platform}`)
}

export function resolveOfficialGodotTemplateSetupPlan(options = {}) {
  const version = options.version ?? pinnedOfficialGodotVersion
  const artifact = officialGodotTemplateArtifact(version)
  const cacheDir = path.resolve(
    options.cacheDir ?? defaultOfficialGodotTemplateCacheDir,
  )
  const installRoot = path.resolve(
    options.installRoot ?? defaultOfficialGodotTemplateRoot(options),
  )
  const versionDir = path.join(cacheDir, version)
  const installDir = path.join(installRoot, artifact.installedVersion)

  return {
    version,
    ...artifact,
    cacheDir,
    versionDir,
    archivePath: path.join(versionDir, artifact.filename),
    installRoot,
    installDir,
    markerPath: path.join(installDir, installMarkerName),
    url: `https://github.com/godotengine/godot-builds/releases/download/${version}/${artifact.filename}`,
  }
}

function sha512File(filePath) {
  return createHash('sha512').update(fs.readFileSync(filePath)).digest('hex')
}

function archiveIsValid(plan) {
  if (!fs.existsSync(plan.archivePath)) return false
  const stat = fs.statSync(plan.archivePath)
  return stat.size === plan.size && sha512File(plan.archivePath) === plan.sha512
}

function readOwnedInstallMarker(plan) {
  if (!fs.existsSync(plan.markerPath)) return undefined
  try {
    const marker = JSON.parse(fs.readFileSync(plan.markerPath, 'utf-8'))
    if (
      isRecord(marker) &&
      marker.version === plan.version &&
      marker.installedVersion === plan.installedVersion &&
      marker.sha512 === plan.sha512 &&
      marker.size === plan.size &&
      marker.url === plan.url
    ) {
      return marker
    }
  } catch {
    return undefined
  }
  return undefined
}

function installLooksComplete(plan) {
  return (
    readOwnedInstallMarker(plan) !== undefined &&
    fs.existsSync(path.join(plan.installDir, 'version.txt'))
  )
}

function usage() {
  console.log(`Usage: node scripts/setup-godot-export-templates.mjs [options]

Install checksummed official Godot export templates.

Options:
  --version <tag>       Official release tag (default: ${pinnedOfficialGodotVersion}).
  --cache-dir <path>    Download cache (default: .cache/godot-export-templates).
  --install-root <path> Override Godot's platform export_templates directory.
  --force               Replace an existing version directory, even if unowned.
  --print               Print the resolved plan without changing the filesystem.
  --help                Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    version: undefined,
    cacheDir: undefined,
    installRoot: undefined,
    force: false,
    print: false,
  }

  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === '--help' || argument === '-h') {
      usage()
      process.exit(0)
    }
    if (argument === '--force') {
      options.force = true
      continue
    }
    if (argument === '--print') {
      options.print = true
      continue
    }
    if (
      argument === '--version' ||
      argument === '--cache-dir' ||
      argument === '--install-root'
    ) {
      const value = argv[++index]
      if (!value) throw new Error(`${argument} requires a value`)
      const fields = {
        '--version': 'version',
        '--cache-dir': 'cacheDir',
        '--install-root': 'installRoot',
      }
      options[fields[argument]] = value
      continue
    }
    throw new Error(`Unknown option: ${argument}`)
  }
  return options
}

export async function setupOfficialGodotExportTemplates(options = {}) {
  const plan = resolveOfficialGodotTemplateSetupPlan(options)
  fs.mkdirSync(plan.versionDir, { recursive: true })

  if (fs.existsSync(plan.installDir)) {
    if (installLooksComplete(plan)) {
      return { ...plan, source: 'installed' }
    }
    if (!options.force) {
      throw new Error(
        `Refusing to replace an export template directory not owned by this setup script: ${plan.installDir}. Pass --force to replace it.`,
      )
    }
    scopedRemove(plan.installDir, plan.installRoot)
  }

  if (!archiveIsValid(plan)) {
    if (fs.existsSync(plan.archivePath)) {
      scopedRemove(plan.archivePath, plan.versionDir)
    }
    const temporaryArchive = `${plan.archivePath}.download-${process.pid}`
    try {
      await downloadFile(plan.url, temporaryArchive)
      const stat = fs.statSync(temporaryArchive)
      const actualSha512 = sha512File(temporaryArchive)
      if (stat.size !== plan.size || actualSha512 !== plan.sha512) {
        throw new Error(
          `Official Godot export template verification failed: expected ${String(plan.size)} bytes and ${plan.sha512}, received ${String(stat.size)} bytes and ${actualSha512}`,
        )
      }
      fs.renameSync(temporaryArchive, plan.archivePath)
    } finally {
      if (fs.existsSync(temporaryArchive)) {
        scopedRemove(temporaryArchive, plan.versionDir)
      }
    }
  }

  const extractionDir = path.join(
    plan.versionDir,
    `.extract-${process.pid}-${Date.now()}`,
  )
  const temporaryInstallDir = path.join(
    plan.installRoot,
    `.${plan.installedVersion}.install-${process.pid}`,
  )
  fs.mkdirSync(extractionDir, { recursive: true })
  fs.mkdirSync(plan.installRoot, { recursive: true })
  try {
    const extraction = resolveZipExtractionCommand({
      archivePath: plan.archivePath,
      destinationPath: extractionDir,
    })
    runChecked(
      extraction.command,
      extraction.arguments,
      'Official Godot export template extraction',
      {
        env: { ...process.env, ...extraction.environment },
      },
    )
    const extractedTemplates = path.join(extractionDir, 'templates')
    if (!fs.existsSync(path.join(extractedTemplates, 'version.txt'))) {
      throw new Error(
        `Official Godot export template archive lacks templates/version.txt: ${plan.archivePath}`,
      )
    }
    if (fs.existsSync(temporaryInstallDir)) {
      scopedRemove(temporaryInstallDir, plan.installRoot)
    }
    fs.cpSync(extractedTemplates, temporaryInstallDir, {
      recursive: true,
      errorOnExist: true,
      force: false,
    })
    fs.writeFileSync(
      path.join(temporaryInstallDir, installMarkerName),
      `${JSON.stringify(
        {
          schemaVersion: 1,
          version: plan.version,
          installedVersion: plan.installedVersion,
          filename: plan.filename,
          size: plan.size,
          sha512: plan.sha512,
          url: plan.url,
        },
        null,
        2,
      )}\n`,
    )
    fs.renameSync(temporaryInstallDir, plan.installDir)
  } finally {
    if (fs.existsSync(extractionDir)) {
      scopedRemove(extractionDir, plan.versionDir)
    }
    if (fs.existsSync(temporaryInstallDir)) {
      scopedRemove(temporaryInstallDir, plan.installRoot)
    }
  }

  if (!installLooksComplete(plan)) {
    throw new Error(
      `Installed export templates failed validation: ${plan.installDir}`,
    )
  }
  return { ...plan, source: 'download' }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.print) {
    console.log(
      JSON.stringify(resolveOfficialGodotTemplateSetupPlan(options), null, 2),
    )
    return
  }

  const result = await setupOfficialGodotExportTemplates(options)
  console.log(
    `[setup-godot-templates] ${result.version} (${result.source}) at ${result.installDir}`,
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  await main()
}
