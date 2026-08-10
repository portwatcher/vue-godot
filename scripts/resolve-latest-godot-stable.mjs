import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  compareStableGodotTags,
  parseStableGodotTag,
} from '../packages/godot-js-runtime/scripts/godot-version.mjs'

export { compareStableGodotTags, parseStableGodotTag }

const scriptPath = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(scriptPath), '..')
const editorCatalogPath = path.join(
  repoRoot,
  'scripts/official-godot-releases.json',
)
const templateCatalogPath = path.join(
  repoRoot,
  'scripts/official-godot-export-templates.json',
)
const runtimePackagePath = path.join(
  repoRoot,
  'packages/godot-js-runtime/package.json',
)
const sourceReleasesUrl =
  'https://api.github.com/repos/godotengine/godot/releases?per_page=100'
const buildsReleaseBaseUrl =
  'https://api.github.com/repos/godotengine/godot-builds/releases/tags'

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function verifiedReleaseAsset(release, name) {
  if (!Array.isArray(release.assets)) {
    throw new Error('Godot builds release does not contain an assets array')
  }
  const asset = release.assets.find((candidate) => candidate?.name === name)
  if (!isRecord(asset)) {
    throw new Error(`Godot builds release is missing ${name}`)
  }
  if (!Number.isSafeInteger(asset.size) || asset.size <= 0) {
    throw new Error(`Godot release asset ${name} has an invalid size`)
  }
  if (
    typeof asset.digest !== 'string' ||
    !/^sha256:[0-9a-f]{64}$/i.test(asset.digest)
  ) {
    throw new Error(`Godot release asset ${name} lacks an official SHA-256`)
  }
  const expectedUrl = `https://github.com/godotengine/godot-builds/releases/download/${release.tag_name}/${name}`
  if (asset.browser_download_url !== expectedUrl) {
    throw new Error(`Godot release asset ${name} has an unexpected URL`)
  }
  return {
    filename: name,
    size: asset.size,
    sha256: asset.digest.slice('sha256:'.length).toLowerCase(),
    url: asset.browser_download_url,
  }
}

export function createStableGodotReleaseMetadata(sourceRelease, buildsRelease) {
  if (!isRecord(sourceRelease) || !isRecord(buildsRelease)) {
    throw new Error('Official Godot release responses must be objects')
  }
  if (
    sourceRelease.draft === true ||
    sourceRelease.prerelease === true ||
    buildsRelease.draft === true ||
    buildsRelease.prerelease === true
  ) {
    throw new Error('Refusing to resolve a draft or prerelease Godot build')
  }
  const version = sourceRelease.tag_name
  parseStableGodotTag(version)
  if (buildsRelease.tag_name !== version) {
    throw new Error(
      `Godot source/build release mismatch: ${String(version)} versus ${String(buildsRelease.tag_name)}`,
    )
  }

  const assetNames = {
    linux: `Godot_v${version}_linux.x86_64.zip`,
    macos: `Godot_v${version}_macos.universal.zip`,
    windows: `Godot_v${version}_win64.exe.zip`,
    templates: `Godot_v${version}_export_templates.tpz`,
  }
  const linux = verifiedReleaseAsset(buildsRelease, assetNames.linux)
  const macos = verifiedReleaseAsset(buildsRelease, assetNames.macos)
  const windows = verifiedReleaseAsset(buildsRelease, assetNames.windows)
  const templates = verifiedReleaseAsset(buildsRelease, assetNames.templates)
  const installedVersion = version.replace(/-stable$/, '.stable')

  return {
    schemaVersion: 1,
    version,
    installedVersion,
    publishedAt:
      typeof sourceRelease.published_at === 'string'
        ? sourceRelease.published_at
        : null,
    sourceReleaseUrl: `https://github.com/godotengine/godot/releases/tag/${version}`,
    editors: {
      'linux-x86_64': {
        filename: linux.filename,
        sha256: linux.sha256,
        executable: `Godot_v${version}_linux.x86_64`,
      },
      'macos-universal': {
        filename: macos.filename,
        sha256: macos.sha256,
        executable: 'Godot.app/Contents/MacOS/Godot',
      },
      'windows-x86_64': {
        filename: windows.filename,
        sha256: windows.sha256,
        executable: `Godot_v${version}_win64_console.exe`,
      },
    },
    exportTemplates: {
      filename: templates.filename,
      installedVersion,
      sha256: templates.sha256,
      size: templates.size,
    },
  }
}

export function validateStableGodotReleaseMetadata(metadata) {
  if (
    !isRecord(metadata) ||
    metadata.schemaVersion !== 1 ||
    !isRecord(metadata.editors) ||
    !isRecord(metadata.exportTemplates)
  ) {
    throw new Error('Latest stable Godot metadata is invalid')
  }
  const version = metadata.version
  parseStableGodotTag(version)
  const installedVersion = version.replace(/-stable$/, '.stable')
  if (metadata.installedVersion !== installedVersion) {
    throw new Error('Latest stable Godot installed version is inconsistent')
  }
  if (
    metadata.sourceReleaseUrl !==
    `https://github.com/godotengine/godot/releases/tag/${version}`
  ) {
    throw new Error('Latest stable Godot source release URL is invalid')
  }

  const expectedEditors = {
    'linux-x86_64': {
      filename: `Godot_v${version}_linux.x86_64.zip`,
      executable: `Godot_v${version}_linux.x86_64`,
    },
    'macos-universal': {
      filename: `Godot_v${version}_macos.universal.zip`,
      executable: 'Godot.app/Contents/MacOS/Godot',
    },
    'windows-x86_64': {
      filename: `Godot_v${version}_win64.exe.zip`,
      executable: `Godot_v${version}_win64_console.exe`,
    },
  }
  if (
    Object.keys(metadata.editors).sort().join('\0') !==
    Object.keys(expectedEditors).sort().join('\0')
  ) {
    throw new Error('Latest stable Godot editor platforms are incomplete')
  }
  for (const [platform, expected] of Object.entries(expectedEditors)) {
    const editor = metadata.editors[platform]
    if (
      !isRecord(editor) ||
      editor.filename !== expected.filename ||
      editor.executable !== expected.executable ||
      typeof editor.sha256 !== 'string' ||
      !/^[0-9a-f]{64}$/.test(editor.sha256)
    ) {
      throw new Error(
        `Latest stable Godot editor metadata is invalid: ${platform}`,
      )
    }
  }

  const templates = metadata.exportTemplates
  if (
    templates.filename !== `Godot_v${version}_export_templates.tpz` ||
    templates.installedVersion !== installedVersion ||
    typeof templates.sha256 !== 'string' ||
    !/^[0-9a-f]{64}$/.test(templates.sha256) ||
    !Number.isSafeInteger(templates.size) ||
    templates.size <= 0
  ) {
    throw new Error('Latest stable Godot export-template metadata is invalid')
  }
  return metadata
}

function sortedCatalog(catalog) {
  return Object.fromEntries(
    Object.entries(catalog).sort(([left], [right]) =>
      compareStableGodotTags(left, right),
    ),
  )
}

export function mergeStableGodotReleaseMetadata(
  metadata,
  editorCatalog,
  templateCatalog,
) {
  validateStableGodotReleaseMetadata(metadata)
  if (!isRecord(editorCatalog) || !isRecord(templateCatalog)) {
    throw new Error('Official Godot catalogs must be objects')
  }
  return {
    editorCatalog: sortedCatalog({
      ...editorCatalog,
      [metadata.version]: metadata.editors,
    }),
    templateCatalog: sortedCatalog({
      ...templateCatalog,
      [metadata.version]: metadata.exportTemplates,
    }),
  }
}

export function stableCompatibilityReleaseTag(runtimeVersion, godotVersion) {
  if (
    typeof runtimeVersion !== 'string' ||
    !/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(runtimeVersion)
  ) {
    throw new Error(`Invalid runtime version: ${String(runtimeVersion)}`)
  }
  parseStableGodotTag(godotVersion)
  return `godot-js-runtime-v${runtimeVersion}-godot-${godotVersion.replace(/-stable$/, '')}`
}

async function fetchJson(url, token, fetchImplementation = fetch) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'vue-godot-stable-release-monitor',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  const response = await fetchImplementation(url, { headers })
  if (!response.ok) {
    throw new Error(
      `GitHub release lookup failed: HTTP ${String(response.status)} ${response.statusText}`,
    )
  }
  return response.json()
}

export async function resolveLatestStableGodotRelease(options = {}) {
  const token =
    options.token ?? process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN
  const sourceReleases = await fetchJson(
    sourceReleasesUrl,
    token,
    options.fetchImplementation,
  )
  if (!Array.isArray(sourceReleases)) {
    throw new Error('Official Godot releases response must be an array')
  }
  const sourceRelease = sourceReleases
    .filter(
      (release) =>
        isRecord(release) &&
        release.draft !== true &&
        release.prerelease !== true &&
        typeof release.tag_name === 'string' &&
        /^\d+\.\d+(?:\.\d+)?-stable$/.test(release.tag_name),
    )
    .sort((left, right) =>
      compareStableGodotTags(right.tag_name, left.tag_name),
    )[0]
  if (!sourceRelease) {
    throw new Error('Official Godot releases contain no stable release')
  }
  const buildsRelease = await fetchJson(
    `${buildsReleaseBaseUrl}/${encodeURIComponent(sourceRelease.tag_name)}`,
    token,
    options.fetchImplementation,
  )
  return createStableGodotReleaseMetadata(sourceRelease, buildsRelease)
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

function appendGitHubOutput(filePath, values) {
  const lines = Object.entries(values).map(([name, value]) => {
    const text = String(value)
    if (/[\r\n]/.test(text)) {
      throw new Error(`GitHub output ${name} contains a newline`)
    }
    return `${name}=${text}`
  })
  fs.appendFileSync(filePath, `${lines.join('\n')}\n`)
}

function parseArgs(argv) {
  const options = {
    metadata: undefined,
    output: undefined,
    githubOutput: undefined,
    writeCatalogs: false,
  }
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === '--write-catalogs') {
      options.writeCatalogs = true
      continue
    }
    if (
      argument === '--metadata' ||
      argument === '--output' ||
      argument === '--github-output'
    ) {
      const value = argv[++index]
      if (!value) throw new Error(`${argument} requires a path`)
      options[
        argument === '--metadata'
          ? 'metadata'
          : argument === '--output'
            ? 'output'
            : 'githubOutput'
      ] = path.resolve(value)
      continue
    }
    if (argument === '--help' || argument === '-h') {
      console.log(`Usage: node scripts/resolve-latest-godot-stable.mjs [options]

Resolve the latest official stable Godot editor and export-template assets.

Options:
  --metadata <path>       Read previously resolved metadata instead of GitHub.
  --output <path>         Write resolved metadata to a JSON file.
  --github-output <path>  Append workflow outputs for the resolved release.
  --write-catalogs        Merge the release into the checked-in setup catalogs.
  --help                  Show this help.
`)
      process.exit(0)
    }
    throw new Error(`Unknown option: ${argument}`)
  }
  return options
}

async function runCli() {
  const options = parseArgs(process.argv.slice(2))
  const metadata = options.metadata
    ? readJson(options.metadata)
    : await resolveLatestStableGodotRelease()
  validateStableGodotReleaseMetadata(metadata)

  if (options.writeCatalogs) {
    const merged = mergeStableGodotReleaseMetadata(
      metadata,
      readJson(editorCatalogPath),
      readJson(templateCatalogPath),
    )
    writeJson(editorCatalogPath, merged.editorCatalog)
    writeJson(templateCatalogPath, merged.templateCatalog)
  }
  if (options.output) {
    writeJson(options.output, metadata)
  }

  const runtimeVersion = readJson(runtimePackagePath).version
  const releaseTag = stableCompatibilityReleaseTag(
    runtimeVersion,
    metadata.version,
  )
  if (options.githubOutput) {
    appendGitHubOutput(options.githubOutput, {
      version: metadata.version,
      installed_version: metadata.installedVersion,
      runtime_version: runtimeVersion,
      release_tag: releaseTag,
    })
  }
  if (!options.output) {
    console.log(JSON.stringify(metadata, null, 2))
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    await runCli()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}
