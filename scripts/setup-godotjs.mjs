import fs from 'node:fs'
import https from 'node:https'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { resolveGodotBin } from './smoke-utils.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..')

export const pinnedGodotJsRelease = 'GodotJS_1.0.0-2'
export const defaultGodotJsReleaseRepo = 'ialex32x/GodotJS-Build'
export const defaultGodotJsCacheDir = '.cache/godotjs'

const defaultAssetByPlatformArch = new Map([
  ['darwin:arm64', 'prebuilt_macos_arm64_v8'],
  ['linux:x64', 'prebuilt_linux_x64_v8'],
  ['win32:x64', 'prebuilt_windows_x64_v8'],
])

function usage() {
  console.log(`Usage: node scripts/setup-godotjs.mjs [options]

Downloads the pinned GodotJS editor or export-template bundle into .cache/godotjs
and prints or exports the resolved path.

Options:
  --release <tag>       GodotJS release tag. Default: ${pinnedGodotJsRelease}
  --release-repo <repo> GitHub release repo. Default: ${defaultGodotJsReleaseRepo}
  --asset <name>        Release asset without .zip. Defaults by platform.
  --asset-kind <kind>   Asset kind: editor or templates. Default: editor.
  --cache-dir <path>    Cache directory. Default: ${defaultGodotJsCacheDir}
  --github-env <path>   Append setup variables for GitHub Actions.
  --install-templates   Copy a template asset into Godot's export_templates dir.
  --template-version <v> Export template version dir to install into.
  --templates-root <p>  Export templates root. Defaults to the Godot user dir.
  --godot-bin <path>    Godot executable used to infer --template-version.
  --print-bin           Print only the resolved Godot executable path.
  --print-dir           Print only the template asset or install directory.
  --dry-run             Print the resolved setup plan as JSON without I/O.
  --platform <name>     Override platform for planning/tests.
  --arch <name>         Override architecture for planning/tests.
  --help                Show this help.
`)
}

export function defaultGodotJsAssetForPlatform(
  platform = process.platform,
  arch = process.arch,
) {
  const key = `${platform}:${arch}`
  const asset = defaultAssetByPlatformArch.get(key)
  if (!asset) {
    throw new Error(
      `No pinned GodotJS asset is configured for ${key}; pass --asset explicitly.`,
    )
  }
  return asset
}

export function godotJsReleaseAssetUrl(
  release,
  asset,
  releaseRepo = defaultGodotJsReleaseRepo,
) {
  return `https://github.com/${releaseRepo}/releases/download/${release}/${asset}.zip`
}

export function defaultGodotExportTemplatesRoot(
  platform = process.platform,
  env = process.env,
  homeDir = os.homedir(),
) {
  if (platform === 'darwin') {
    return path.join(
      homeDir,
      'Library',
      'Application Support',
      'Godot',
      'export_templates',
    )
  }

  if (platform === 'linux') {
    return path.join(
      env.XDG_DATA_HOME ?? path.join(homeDir, '.local', 'share'),
      'godot',
      'export_templates',
    )
  }

  if (platform === 'win32') {
    return path.join(
      env.APPDATA ?? path.join(homeDir, 'AppData', 'Roaming'),
      'Godot',
      'export_templates',
    )
  }

  throw new Error(
    `No Godot export template directory is configured for ${platform}; pass --templates-root explicitly.`,
  )
}

function normalizeGodotJsAssetKind(assetKind = 'editor') {
  if (assetKind === 'editor' || assetKind === 'templates') {
    return assetKind
  }

  throw new Error(
    `Unsupported GodotJS asset kind: ${assetKind}; expected editor or templates.`,
  )
}

export function resolveGodotJsSetupPlan(options = {}) {
  const release = options.release ?? pinnedGodotJsRelease
  const releaseRepo = options.releaseRepo ?? defaultGodotJsReleaseRepo
  const asset =
    options.asset ??
    defaultGodotJsAssetForPlatform(options.platform, options.arch)
  const assetKind = normalizeGodotJsAssetKind(options.assetKind)
  const cacheDir = path.resolve(
    repoRoot,
    options.cacheDir ?? defaultGodotJsCacheDir,
  )
  const assetDir = path.join(cacheDir, release, asset)
  const archivePath = path.join(assetDir, `${asset}.zip`)

  return {
    release,
    releaseRepo,
    asset,
    assetKind,
    cacheDir,
    assetDir,
    archivePath,
    url: godotJsReleaseAssetUrl(release, asset, releaseRepo),
  }
}

function parseArgs(argv) {
  const valueOptions = [
    ['--release', 'release'],
    ['--release-repo', 'releaseRepo'],
    ['--asset', 'asset'],
    ['--asset-kind', 'assetKind'],
    ['--cache-dir', 'cacheDir'],
    ['--github-env', 'githubEnv'],
    ['--template-version', 'templateVersion'],
    ['--templates-root', 'templatesRoot'],
    ['--godot-bin', 'godotBin'],
    ['--platform', 'platform'],
    ['--arch', 'arch'],
  ]
  const options = {
    release: undefined,
    asset: undefined,
    assetKind: undefined,
    cacheDir: undefined,
    githubEnv: undefined,
    templateVersion: undefined,
    templatesRoot: undefined,
    godotBin: undefined,
    installTemplates: false,
    printBin: false,
    printDir: false,
    dryRun: false,
    platform: undefined,
    arch: undefined,
  }

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
    }

    if (arg === '--print-bin') {
      options.printBin = true
      continue
    }

    if (arg === '--print-dir') {
      options.printDir = true
      continue
    }

    if (arg === '--dry-run') {
      options.dryRun = true
      continue
    }

    if (arg === '--install-templates') {
      options.installTemplates = true
      continue
    }

    let handled = false
    for (const [name, key] of valueOptions) {
      if (arg === name) {
        const value = argv[++index]
        if (!value) {
          throw new Error(`${name} requires a value`)
        }
        options[key] = value
        handled = true
        break
      }

      if (arg.startsWith(`${name}=`)) {
        options[key] = arg.slice(name.length + 1)
        handled = true
        break
      }
    }

    if (handled) {
      continue
    }

    throw new Error(`Unknown option: ${arg}`)
  }

  options.assetKind = normalizeGodotJsAssetKind(options.assetKind)

  if (options.printBin && options.printDir) {
    throw new Error('--print-bin and --print-dir cannot be used together')
  }

  if (options.printBin && options.assetKind !== 'editor') {
    throw new Error('--print-bin requires --asset-kind editor')
  }

  if (options.printDir && options.assetKind !== 'templates') {
    throw new Error('--print-dir requires --asset-kind templates')
  }

  if (options.installTemplates && options.assetKind !== 'templates') {
    throw new Error('--install-templates requires --asset-kind templates')
  }

  return options
}

function createLogger(options) {
  return (message) => {
    if (options.printBin || options.printDir) {
      console.error(message)
    } else {
      console.log(message)
    }
  }
}

function findGodotBin(assetDir) {
  try {
    return resolveGodotBin(assetDir)
  } catch {
    return null
  }
}

function hasExtractedAssetEntries(plan) {
  let entries
  try {
    entries = fs.readdirSync(plan.assetDir)
  } catch {
    return false
  }

  const archiveName = path.basename(plan.archivePath)
  const tempArchiveName = `${archiveName}.tmp`
  return entries.some(
    (entry) => entry !== archiveName && entry !== tempArchiveName,
  )
}

function listTemplateAssetEntries(plan) {
  let entries
  try {
    entries = fs.readdirSync(plan.assetDir, { withFileTypes: true })
  } catch {
    return []
  }

  const archiveName = path.basename(plan.archivePath)
  const tempArchiveName = `${archiveName}.tmp`
  return entries
    .map((entry) => entry.name)
    .filter((entry) => entry !== archiveName && entry !== tempArchiveName)
    .sort()
}

function listTemplateInstallEntries(plan) {
  const entries = listTemplateAssetEntries(plan)
  if (entries.length !== 1) {
    return {
      entries,
      sourceDir: plan.assetDir,
    }
  }

  const onlyEntry = entries[0]
  const nestedDir = path.join(plan.assetDir, onlyEntry)
  let stat
  try {
    stat = fs.statSync(nestedDir)
  } catch {
    return {
      entries,
      sourceDir: plan.assetDir,
    }
  }

  if (!stat.isDirectory()) {
    return {
      entries,
      sourceDir: plan.assetDir,
    }
  }

  return {
    entries: fs.readdirSync(nestedDir).sort(),
    sourceDir: nestedDir,
  }
}

async function ensureAssetArchiveExtracted(plan, log, isReady) {
  if (!fs.existsSync(plan.archivePath) && !isReady()) {
    const tempArchivePath = `${plan.archivePath}.tmp`
    fs.rmSync(tempArchivePath, { force: true })
    await downloadFile(plan.url, tempArchivePath, log)
    fs.renameSync(tempArchivePath, plan.archivePath)
  }

  if (!isReady()) {
    log(
      `[setup-godotjs] extracting ${path.relative(repoRoot, plan.archivePath)}`,
    )
    assertCommandSucceeded(
      extractArchive(plan.archivePath, plan.assetDir),
      'GodotJS archive extraction',
    )
  }
}

function probeGodotVersion(godotBin) {
  const version = spawnSync(godotBin, ['--version'], {
    encoding: 'utf-8',
  })
  assertCommandSucceeded(version, 'GodotJS version probe')
  return version.stdout.trim().split(/\s+/)[0]
}

function resolveTemplateVersion(options) {
  const templateVersion = options.templateVersion?.trim()
  if (templateVersion) {
    return templateVersion
  }

  const godotBinInput = options.godotBin ?? process.env.GODOT_BIN
  if (!godotBinInput) {
    throw new Error(
      '--install-templates requires --template-version, --godot-bin, or GODOT_BIN to infer the Godot export template version.',
    )
  }

  return probeGodotVersion(resolveGodotBin(godotBinInput))
}

export function installGodotJsTemplateAsset(plan, options = {}) {
  const templateVersion = resolveTemplateVersion(options)
  const templatesRoot = path.resolve(
    repoRoot,
    options.templatesRoot ??
      defaultGodotExportTemplatesRoot(process.platform, process.env),
  )
  const templatesDir = path.join(templatesRoot, templateVersion)
  const { entries, sourceDir } = listTemplateInstallEntries(plan)

  if (entries.length === 0) {
    throw new Error(
      `Unable to locate extracted template files in ${path.relative(repoRoot, plan.assetDir)}`,
    )
  }

  fs.mkdirSync(templatesDir, { recursive: true })
  for (const entry of entries) {
    fs.cpSync(path.join(sourceDir, entry), path.join(templatesDir, entry), {
      force: true,
      recursive: true,
    })
  }
  fs.writeFileSync(
    path.join(templatesDir, 'version.txt'),
    `${templateVersion}\n`,
  )

  return {
    entries,
    templatesDir,
    templatesRoot,
    templateVersion,
  }
}

function downloadFileOnce(url, destination, log) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      const statusCode = response.statusCode ?? 0
      const location = response.headers.location

      if (
        statusCode >= 300 &&
        statusCode < 400 &&
        typeof location === 'string'
      ) {
        response.resume()
        downloadFileOnce(new URL(location, url).href, destination, log).then(
          resolve,
          reject,
        )
        return
      }

      if (statusCode !== 200) {
        response.resume()
        reject(new Error(`Download failed with HTTP ${statusCode}: ${url}`))
        return
      }

      const file = fs.createWriteStream(destination)
      file.on('error', reject)
      response.on('error', reject)
      file.on('finish', () => {
        file.close(resolve)
      })
      response.pipe(file)
    })

    request.on('error', reject)
    request.setTimeout(120_000, () => {
      request.destroy(new Error(`Timed out downloading ${url}`))
    })

    log(`[setup-godotjs] downloading ${url}`)
  })
}

async function downloadFile(url, destination, log, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await downloadFileOnce(url, destination, log)
      return
    } catch (error) {
      fs.rmSync(destination, { force: true })
      if (attempt === attempts) {
        throw error
      }

      log(
        `[setup-godotjs] download failed; retrying (${attempt}/${attempts}): ${
          error instanceof Error ? error.message : String(error)
        }`,
      )
    }
  }
}

function extractArchive(archivePath, assetDir) {
  if (process.platform === 'win32') {
    return spawnSync(
      'powershell.exe',
      [
        '-NoProfile',
        '-Command',
        'Expand-Archive -LiteralPath $args[0] -DestinationPath $args[1] -Force',
        archivePath,
        assetDir,
      ],
      { encoding: 'utf-8' },
    )
  }

  return spawnSync('unzip', ['-q', '-o', archivePath, '-d', assetDir], {
    encoding: 'utf-8',
  })
}

function assertCommandSucceeded(result, label) {
  if (result.status === 0) {
    return
  }

  throw new Error(
    [
      `${label} failed (${result.status ?? result.signal ?? 'unknown'})`,
      result.stdout,
      result.stderr,
    ]
      .filter(Boolean)
      .join('\n'),
  )
}

function appendGitHubEnv(filePath, values) {
  const lines = Object.entries(values).map(([key, value]) => `${key}=${value}`)
  fs.appendFileSync(filePath, `${lines.join('\n')}\n`)
}

export async function setupGodotJs(options = {}) {
  const plan = resolveGodotJsSetupPlan(options)
  const log = createLogger(options)

  fs.mkdirSync(plan.assetDir, { recursive: true })

  if (plan.assetKind === 'templates') {
    await ensureAssetArchiveExtracted(plan, log, () =>
      hasExtractedAssetEntries(plan),
    )

    let installedTemplates = null
    if (options.installTemplates) {
      installedTemplates = installGodotJsTemplateAsset(plan, options)
      log(
        `[setup-godotjs] installed ${installedTemplates.entries.length} template file(s) to ${installedTemplates.templatesDir}`,
      )
    }

    if (options.githubEnv) {
      appendGitHubEnv(options.githubEnv, {
        GODOTJS_RELEASE: plan.release,
        GODOTJS_RELEASE_REPO: plan.releaseRepo,
        GODOTJS_ASSET: plan.asset,
        GODOTJS_ASSET_DIR: plan.assetDir,
        ...(installedTemplates
          ? {
              GODOTJS_EXPORT_TEMPLATES_DIR: installedTemplates.templatesDir,
              GODOTJS_EXPORT_TEMPLATE_VERSION:
                installedTemplates.templateVersion,
            }
          : {}),
      })
    }

    return installedTemplates?.templatesDir ?? plan.assetDir
  }

  await ensureAssetArchiveExtracted(plan, log, () =>
    Boolean(findGodotBin(plan.assetDir)),
  )

  const godotBin = findGodotBin(plan.assetDir)
  if (!godotBin) {
    throw new Error(
      `Unable to locate a Godot executable in ${path.relative(repoRoot, plan.assetDir)}`,
    )
  }

  fs.chmodSync(godotBin, 0o755)

  if (options.githubEnv) {
    appendGitHubEnv(options.githubEnv, {
      GODOTJS_RELEASE: plan.release,
      GODOTJS_RELEASE_REPO: plan.releaseRepo,
      GODOTJS_ASSET: plan.asset,
      GODOT_BIN: godotBin,
    })
  }

  const version = spawnSync(godotBin, ['--version'], {
    encoding: 'utf-8',
  })
  assertCommandSucceeded(version, 'GodotJS version probe')
  log(`[setup-godotjs] ${version.stdout.trim()}`)

  return godotBin
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  if (options.dryRun) {
    console.log(JSON.stringify(resolveGodotJsSetupPlan(options), null, 2))
    return
  }

  const resolvedPath = await setupGodotJs(options)
  if (options.printBin) {
    console.log(resolvedPath)
  } else if (options.printDir) {
    console.log(resolvedPath)
  } else if (options.assetKind === 'templates' && options.installTemplates) {
    console.log(`[setup-godotjs] GODOTJS_EXPORT_TEMPLATES_DIR=${resolvedPath}`)
  } else if (options.assetKind === 'templates') {
    console.log(`[setup-godotjs] GODOTJS_ASSET_DIR=${resolvedPath}`)
  } else {
    console.log(`[setup-godotjs] GODOT_BIN=${resolvedPath}`)
  }
}

const entryPoint = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (import.meta.url === entryPoint) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
}
