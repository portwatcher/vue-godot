import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import https from 'node:https'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptPath = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(scriptPath), '..')
const releasesPath = path.join(
  path.dirname(scriptPath),
  'official-godot-releases.json',
)

export const pinnedOfficialGodotVersion = '4.4.1-stable'
export const currentStableOfficialGodotVersion = '4.7.1-stable'
export const defaultOfficialGodotCacheDir = path.join(
  repoRoot,
  '.cache/godot-official',
)

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readReleaseCatalog() {
  const parsed = JSON.parse(fs.readFileSync(releasesPath, 'utf-8'))
  if (!isRecord(parsed)) {
    throw new Error('Official Godot release catalog must be an object')
  }
  return parsed
}

function platformKey(platform, arch) {
  if (platform === 'linux' && arch === 'x64') return 'linux-x86_64'
  if (platform === 'darwin' && (arch === 'arm64' || arch === 'x64')) {
    return 'macos-universal'
  }
  if (platform === 'win32' && arch === 'x64') return 'windows-x86_64'
  throw new Error(
    `No pinned official Godot editor is configured for ${platform}:${arch}`,
  )
}

export function officialGodotArtifactForPlatform(
  version,
  platform = process.platform,
  arch = process.arch,
) {
  const catalog = readReleaseCatalog()
  const versionEntry = catalog[version]
  if (!isRecord(versionEntry)) {
    throw new Error(
      `No pinned official Godot release is configured for ${version}`,
    )
  }

  const key = platformKey(platform, arch)
  const artifact = versionEntry[key]
  if (!isRecord(artifact)) {
    throw new Error(
      `No pinned official Godot ${version} artifact is configured for ${key}`,
    )
  }
  for (const field of ['filename', 'sha256', 'executable']) {
    if (typeof artifact[field] !== 'string' || artifact[field].length === 0) {
      throw new Error(
        `Official Godot catalog entry ${version}/${key} lacks ${field}`,
      )
    }
  }

  return {
    key,
    filename: artifact.filename,
    sha256: artifact.sha256,
    executable: artifact.executable,
  }
}

export function resolveOfficialGodotSetupPlan(options = {}) {
  const version = options.version ?? pinnedOfficialGodotVersion
  const platform = options.platform ?? process.platform
  const arch = options.arch ?? process.arch
  const cacheDir = path.resolve(
    options.cacheDir ?? defaultOfficialGodotCacheDir,
  )
  const artifact = officialGodotArtifactForPlatform(version, platform, arch)
  const versionDir = path.join(cacheDir, version)
  const installDir = path.join(versionDir, artifact.key)
  const archivePath = path.join(versionDir, artifact.filename)

  return {
    version,
    platform,
    arch,
    cacheDir,
    versionDir,
    installDir,
    archivePath,
    executablePath: path.join(installDir, artifact.executable),
    url: `https://github.com/godotengine/godot-builds/releases/download/${version}/${artifact.filename}`,
    sha256: options.sha256 ?? artifact.sha256,
  }
}

function usage() {
  console.log(`Usage: node scripts/setup-godot.mjs [options]

Install or resolve a checksummed official Godot editor.

Options:
  --version <tag>       Official release tag (default: ${pinnedOfficialGodotVersion}).
  --cache-dir <path>    Cache root (default: .cache/godot-official).
  --platform <name>     Override host platform for planning/tests.
  --arch <name>         Override host architecture for planning/tests.
  --sha256 <digest>     Override the catalog digest for an explicit release.
  --godot-bin <path>    Use an existing official executable instead of downloading.
  --github-env <path>   Append GODOT_BIN to a GitHub Actions environment file.
  --print-bin           Print only the resolved executable path after setup.
  --print               Print the download plan without changing the filesystem.
  --help                Show this help.

GODOT_BIN is accepted as the default for --godot-bin.
`)
}

function parseArgs(argv) {
  const options = {
    version: undefined,
    cacheDir: undefined,
    platform: undefined,
    arch: undefined,
    sha256: undefined,
    godotBin: process.env.GODOT_BIN,
    githubEnv: undefined,
    printBin: false,
    print: false,
  }

  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === '--help' || argument === '-h') {
      usage()
      process.exit(0)
    }
    if (argument === '--print-bin') {
      options.printBin = true
      continue
    }
    if (argument === '--print') {
      options.print = true
      continue
    }
    if (
      argument === '--version' ||
      argument === '--cache-dir' ||
      argument === '--platform' ||
      argument === '--arch' ||
      argument === '--sha256' ||
      argument === '--godot-bin' ||
      argument === '--github-env'
    ) {
      const value = argv[++index]
      if (!value) throw new Error(`${argument} requires a value`)
      const fields = {
        '--version': 'version',
        '--cache-dir': 'cacheDir',
        '--platform': 'platform',
        '--arch': 'arch',
        '--sha256': 'sha256',
        '--godot-bin': 'godotBin',
        '--github-env': 'githubEnv',
      }
      options[fields[argument]] = value
      continue
    }
    throw new Error(`Unknown option: ${argument}`)
  }
  return options
}

function sha256File(filePath) {
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')
}

function assertScopedPath(targetPath, parentPath) {
  const relative = path.relative(
    path.resolve(parentPath),
    path.resolve(targetPath),
  )
  if (
    relative === '' ||
    relative === '..' ||
    relative.startsWith(`..${path.sep}`)
  ) {
    throw new Error(
      `Refusing to modify path outside ${parentPath}: ${targetPath}`,
    )
  }
}

export function scopedRemove(targetPath, parentPath) {
  assertScopedPath(targetPath, parentPath)
  fs.rmSync(targetPath, { recursive: true, force: true })
}

export function downloadFile(url, destination, redirectCount = 0) {
  if (redirectCount > 5) {
    return Promise.reject(
      new Error(`Too many redirects while downloading ${url}`),
    )
  }
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (
        response.statusCode &&
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        response.resume()
        downloadFile(
          response.headers.location,
          destination,
          redirectCount + 1,
        ).then(resolve, reject)
        return
      }
      if (response.statusCode !== 200) {
        response.resume()
        reject(
          new Error(
            `Download failed with HTTP ${response.statusCode ?? 'unknown'}: ${url}`,
          ),
        )
        return
      }

      const output = fs.createWriteStream(destination, { mode: 0o600 })
      response.pipe(output)
      output.on('finish', () => output.close(resolve))
      output.on('error', reject)
    })
    request.on('error', reject)
  })
}

export function runChecked(command, args, label, options = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf-8',
    ...options,
  })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(
      `${label} failed (${String(result.status)})\n${result.stdout ?? ''}${result.stderr ?? ''}`,
    )
  }
  return result
}

export function resolveZipExtractionCommand(plan, platform = process.platform) {
  if (platform === 'win32') {
    return {
      command: 'powershell.exe',
      arguments: [
        '-NoProfile',
        '-NonInteractive',
        '-Command',
        'Add-Type -AssemblyName System.IO.Compression.FileSystem; [IO.Compression.ZipFile]::ExtractToDirectory($env:GODOT_SETUP_ARCHIVE_PATH, $env:GODOT_SETUP_DESTINATION_PATH)',
      ],
      environment: {
        GODOT_SETUP_ARCHIVE_PATH: plan.archivePath,
        GODOT_SETUP_DESTINATION_PATH: plan.destinationPath,
      },
    }
  }
  return {
    command: 'unzip',
    arguments: ['-q', plan.archivePath, '-d', plan.destinationPath],
    environment: {},
  }
}

function extractArchive(plan) {
  if (fs.existsSync(plan.installDir)) {
    scopedRemove(plan.installDir, plan.versionDir)
  }
  fs.mkdirSync(plan.installDir, { recursive: true })
  const extraction = resolveZipExtractionCommand({
    archivePath: plan.archivePath,
    destinationPath: plan.installDir,
  })
  runChecked(
    extraction.command,
    extraction.arguments,
    'Official Godot archive extraction',
    {
      env: { ...process.env, ...extraction.environment },
    },
  )
}

function probeOfficialGodot(executablePath, expectedVersion) {
  if (!fs.existsSync(executablePath)) {
    throw new Error(`Official Godot executable is missing: ${executablePath}`)
  }
  if (process.platform !== 'win32') fs.chmodSync(executablePath, 0o755)
  const result = runChecked(
    executablePath,
    ['--version'],
    'Official Godot probe',
  )
  const version = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim()
  const numericVersion = expectedVersion?.replace(/-stable$/, '')
  const parsedVersion = version.match(/^(\d+)\.(\d+)(?:\.(\d+))?/)
  const meetsMinimum =
    parsedVersion !== null &&
    (Number(parsedVersion[1]) > 4 ||
      (Number(parsedVersion[1]) === 4 && Number(parsedVersion[2]) >= 4))
  if (
    !version.includes('official') ||
    !meetsMinimum ||
    (numericVersion !== undefined && !version.includes(numericVersion))
  ) {
    throw new Error(
      `Expected official Godot ${numericVersion ?? '4.4 or newer'}, received ${version || '<empty>'}`,
    )
  }
  return version
}

function resolveExplicitExecutable(input) {
  const resolved = path.resolve(input)
  if (!fs.existsSync(resolved)) {
    throw new Error(`GODOT_BIN does not exist: ${input}`)
  }
  const stat = fs.statSync(resolved)
  if (stat.isFile()) return resolved
  if (!stat.isDirectory()) {
    throw new Error(`GODOT_BIN must be a file or directory: ${input}`)
  }
  const candidates = [
    path.join(resolved, 'Godot'),
    path.join(resolved, 'godot'),
    path.join(resolved, 'godot4'),
    path.join(resolved, 'Godot.app/Contents/MacOS/Godot'),
  ]
  const candidate = candidates.find((entry) => fs.existsSync(entry))
  if (!candidate) {
    throw new Error(
      `GODOT_BIN directory does not contain an official Godot executable: ${input}`,
    )
  }
  return candidate
}

function writeGithubEnvironment(filePath, executablePath) {
  if (!filePath) return
  fs.appendFileSync(filePath, `GODOT_BIN=${executablePath}\n`)
}

export async function setupOfficialGodot(options = {}) {
  if (options.godotBin) {
    const executablePath = resolveExplicitExecutable(options.godotBin)
    const version = probeOfficialGodot(executablePath, options.version)
    writeGithubEnvironment(options.githubEnv, executablePath)
    return { executablePath, version, source: 'explicit' }
  }

  const plan = resolveOfficialGodotSetupPlan(options)
  fs.mkdirSync(plan.versionDir, { recursive: true })

  let archiveIsValid =
    fs.existsSync(plan.archivePath) &&
    sha256File(plan.archivePath) === plan.sha256
  if (!archiveIsValid) {
    if (fs.existsSync(plan.archivePath)) {
      scopedRemove(plan.archivePath, plan.versionDir)
    }
    const temporaryArchive = `${plan.archivePath}.download-${process.pid}`
    try {
      await downloadFile(plan.url, temporaryArchive)
      const actual = sha256File(temporaryArchive)
      if (actual !== plan.sha256) {
        throw new Error(
          `Official Godot archive checksum mismatch: expected ${plan.sha256}, received ${actual}`,
        )
      }
      fs.renameSync(temporaryArchive, plan.archivePath)
      archiveIsValid = true
    } finally {
      if (fs.existsSync(temporaryArchive)) {
        scopedRemove(temporaryArchive, plan.versionDir)
      }
    }
  }

  if (!archiveIsValid) {
    throw new Error(
      `Unable to verify official Godot archive: ${plan.archivePath}`,
    )
  }

  if (!fs.existsSync(plan.executablePath)) extractArchive(plan)
  const version = probeOfficialGodot(plan.executablePath, plan.version)
  writeGithubEnvironment(options.githubEnv, plan.executablePath)
  return { executablePath: plan.executablePath, version, source: 'download' }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.print) {
    if (options.godotBin) {
      console.log(
        JSON.stringify(
          {
            source: 'explicit',
            executablePath: resolveExplicitExecutable(options.godotBin),
          },
          null,
          2,
        ),
      )
    } else {
      console.log(
        JSON.stringify(resolveOfficialGodotSetupPlan(options), null, 2),
      )
    }
    return
  }

  const result = await setupOfficialGodot(options)
  if (options.printBin) {
    console.log(result.executablePath)
  } else {
    console.log(
      `[setup-godot] ${result.version} (${result.source}) at ${result.executablePath}`,
    )
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  await main()
}
