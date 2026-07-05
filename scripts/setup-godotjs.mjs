import fs from 'node:fs'
import https from 'node:https'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { resolveGodotBin } from './smoke-utils.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..')

export const pinnedGodotJsRelease = 'GodotJS_1.0.0-2'
export const defaultGodotJsCacheDir = '.cache/godotjs'

const defaultAssetByPlatformArch = new Map([
  ['darwin:arm64', 'prebuilt_macos_arm64_v8'],
  ['linux:x64', 'prebuilt_linux_x64_v8'],
  ['win32:x64', 'prebuilt_windows_x64_v8'],
])

function usage() {
  console.log(`Usage: node scripts/setup-godotjs.mjs [options]

Downloads the pinned GodotJS editor bundle into .cache/godotjs and prints or
exports a GODOT_BIN path usable by the smoke scripts.

Options:
  --release <tag>       GodotJS release tag. Default: ${pinnedGodotJsRelease}
  --asset <name>        Release asset without .zip. Defaults by platform.
  --cache-dir <path>    Cache directory. Default: ${defaultGodotJsCacheDir}
  --github-env <path>   Append GODOTJS_RELEASE, GODOTJS_ASSET, and GODOT_BIN.
  --print-bin           Print only the resolved Godot executable path.
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

export function godotJsReleaseAssetUrl(release, asset) {
  return `https://github.com/ialex32x/GodotJS-Build/releases/download/${release}/${asset}.zip`
}

export function resolveGodotJsSetupPlan(options = {}) {
  const release = options.release ?? pinnedGodotJsRelease
  const asset =
    options.asset ??
    defaultGodotJsAssetForPlatform(options.platform, options.arch)
  const cacheDir = path.resolve(
    repoRoot,
    options.cacheDir ?? defaultGodotJsCacheDir,
  )
  const assetDir = path.join(cacheDir, release, asset)
  const archivePath = path.join(assetDir, `${asset}.zip`)

  return {
    release,
    asset,
    cacheDir,
    assetDir,
    archivePath,
    url: godotJsReleaseAssetUrl(release, asset),
  }
}

function parseArgs(argv) {
  const valueOptions = [
    ['--release', 'release'],
    ['--asset', 'asset'],
    ['--cache-dir', 'cacheDir'],
    ['--github-env', 'githubEnv'],
    ['--platform', 'platform'],
    ['--arch', 'arch'],
  ]
  const options = {
    release: undefined,
    asset: undefined,
    cacheDir: undefined,
    githubEnv: undefined,
    printBin: false,
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

    if (arg === '--dry-run') {
      options.dryRun = true
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

  return options
}

function createLogger(options) {
  return (message) => {
    if (options.printBin) {
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

  if (!fs.existsSync(plan.archivePath) && !findGodotBin(plan.assetDir)) {
    const tempArchivePath = `${plan.archivePath}.tmp`
    fs.rmSync(tempArchivePath, { force: true })
    await downloadFile(plan.url, tempArchivePath, log)
    fs.renameSync(tempArchivePath, plan.archivePath)
  }

  if (!findGodotBin(plan.assetDir)) {
    log(`[setup-godotjs] extracting ${path.relative(repoRoot, plan.archivePath)}`)
    assertCommandSucceeded(
      extractArchive(plan.archivePath, plan.assetDir),
      'GodotJS archive extraction',
    )
  }

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

  const godotBin = await setupGodotJs(options)
  if (options.printBin) {
    console.log(godotBin)
  } else {
    console.log(`[setup-godotjs] GODOT_BIN=${godotBin}`)
  }
}

const entryPoint = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (import.meta.url === entryPoint) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
}
