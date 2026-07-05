import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import zlib from 'node:zlib'
import {
  extractCiRunUrls,
  extractReleasePreflightWarningCount,
} from './create-release-evidence.mjs'
import {
  downloadGitHubActionsArtifactZip,
  fetchGitHubActionsRun,
  fetchGitHubActionsRunArtifacts,
  isRecord,
  validateGitHubActionsRunMetadata,
} from './release-evidence-utils.mjs'
import { normalizeCommitSha, repoRoot, run } from './release-utils.mjs'

export const releasePreflightSummaryArtifactName = 'release-preflight-summary'
export const releasePreflightSummaryEntryNames = [
  'release/release-preflight-summary.json',
  'release-preflight-summary.json',
]
export const defaultReleasePreflightSummaryOutput =
  'release/release-preflight-summary.json'

function usage() {
  console.log(`Usage: node scripts/download-release-preflight-summary.mjs [options]

Downloads the release-preflight-summary artifact from a successful Release
Preflight GitHub Actions run and writes the summary JSON used by
npm run release:evidence -- --release-preflight-summary.

Options:
  --ci-evidence <file>   JSON written by npm run release:ci -- --output with
                         --include-release-preflight.
  --run-url <url>        Release Preflight workflow run URL.
  --commit <sha>         Expected release commit. Default: current HEAD.
  --output <file>        Summary JSON output path.
                         Default: ${defaultReleasePreflightSummaryOutput}.
  --help                 Show this help.

Example:
  npm run release:preflight-summary -- \\
    --ci-evidence release/ci-runs.json \\
    --output release/release-preflight-summary.json
`)
}

function parseArgs(argv) {
  const options = {
    ciEvidencePath: null,
    runUrl: null,
    commit: null,
    output: defaultReleasePreflightSummaryOutput,
  }

  const valueOptions = [
    ['--ci-evidence', 'ciEvidencePath'],
    ['--run-url', 'runUrl'],
    ['--commit', 'commit'],
    ['--output', 'output'],
  ]

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
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

  options.commit = normalizeCommitSha(options.commit, '--commit')
  return options
}

function currentCommit() {
  const result = run('git', ['rev-parse', 'HEAD'])
  if (result.status !== 0) {
    throw new Error(`Unable to read current git commit\n${result.stderr}`)
  }
  return result.stdout.trim()
}

function resolveOutputPath(filePath) {
  return path.resolve(repoRoot, filePath)
}

function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch (error) {
    throw new Error(
      `Unable to read JSON from ${path.relative(repoRoot, filePath)}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }
}

function writeJson(filePath, data) {
  const resolved = resolveOutputPath(filePath)
  fs.mkdirSync(path.dirname(resolved), { recursive: true })
  fs.writeFileSync(resolved, `${JSON.stringify(data, null, 2)}\n`)
  console.log(
    `[release-preflight-summary] wrote ${path.relative(repoRoot, resolved)}`,
  )
}

function runTime(artifact) {
  for (const key of ['updated_at', 'created_at']) {
    const timestamp = Date.parse(artifact[key])
    if (Number.isFinite(timestamp)) {
      return timestamp
    }
  }
  return 0
}

function artifactId(artifact) {
  return Number.isInteger(artifact.id) ? artifact.id : 0
}

export function selectReleasePreflightSummaryArtifact(artifacts) {
  return artifacts
    .filter(
      (artifact) =>
        isRecord(artifact) &&
        artifact.name === releasePreflightSummaryArtifactName &&
        artifact.expired !== true &&
        Number.isInteger(artifact.id),
    )
    .sort((left, right) => {
      const timeDelta = runTime(right) - runTime(left)
      return timeDelta === 0 ? artifactId(right) - artifactId(left) : timeDelta
    })[0]
}

function findEndOfCentralDirectory(zipBuffer) {
  const minOffset = Math.max(0, zipBuffer.length - 65_557)
  for (let offset = zipBuffer.length - 22; offset >= minOffset; offset--) {
    if (zipBuffer.readUInt32LE(offset) === 0x06054b50) {
      return offset
    }
  }

  throw new Error('Artifact ZIP did not include an end-of-central-directory')
}

function readZipEntries(zipBuffer) {
  const buffer = Buffer.isBuffer(zipBuffer) ? zipBuffer : Buffer.from(zipBuffer)
  const endOfCentralDirectory = findEndOfCentralDirectory(buffer)
  const entryCount = buffer.readUInt16LE(endOfCentralDirectory + 10)
  const centralDirectoryOffset = buffer.readUInt32LE(endOfCentralDirectory + 16)
  const entries = new Map()
  let offset = centralDirectoryOffset

  for (let index = 0; index < entryCount; index++) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error('Artifact ZIP central directory is invalid')
    }

    const flags = buffer.readUInt16LE(offset + 8)
    const compression = buffer.readUInt16LE(offset + 10)
    const compressedSize = buffer.readUInt32LE(offset + 20)
    const fileNameLength = buffer.readUInt16LE(offset + 28)
    const extraLength = buffer.readUInt16LE(offset + 30)
    const commentLength = buffer.readUInt16LE(offset + 32)
    const localHeaderOffset = buffer.readUInt32LE(offset + 42)
    const nameStart = offset + 46
    const name = buffer
      .subarray(nameStart, nameStart + fileNameLength)
      .toString('utf-8')

    if ((flags & 0x01) !== 0) {
      throw new Error(`Artifact ZIP entry ${name} is encrypted`)
    }

    if (compressedSize === 0xffffffff || localHeaderOffset === 0xffffffff) {
      throw new Error(
        `Artifact ZIP entry ${name} uses unsupported ZIP64 fields`,
      )
    }

    if (buffer.readUInt32LE(localHeaderOffset) !== 0x04034b50) {
      throw new Error(`Artifact ZIP entry ${name} has an invalid local header`)
    }

    const localFileNameLength = buffer.readUInt16LE(localHeaderOffset + 26)
    const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28)
    const dataStart =
      localHeaderOffset + 30 + localFileNameLength + localExtraLength
    const dataEnd = dataStart + compressedSize
    const compressed = buffer.subarray(dataStart, dataEnd)
    let data
    if (compression === 0) {
      data = compressed
    } else if (compression === 8) {
      data = zlib.inflateRawSync(compressed)
    } else {
      throw new Error(
        `Artifact ZIP entry ${name} uses unsupported compression ${compression}`,
      )
    }

    if (!name.endsWith('/')) {
      entries.set(name, data)
    }

    offset += 46 + fileNameLength + extraLength + commentLength
  }

  return entries
}

export function extractReleasePreflightSummaryFromZip(zipBuffer) {
  const entries = readZipEntries(zipBuffer)
  for (const entryName of releasePreflightSummaryEntryNames) {
    const entry = entries.get(entryName)
    if (entry) {
      return entry.toString('utf-8')
    }
  }

  throw new Error(
    `Artifact ZIP did not include ${releasePreflightSummaryEntryNames.join(
      ' or ',
    )}`,
  )
}

export function extractReleasePreflightRunUrl(ciResult, commit) {
  const ciEvidence = extractCiRunUrls(ciResult, commit, {
    requireReleasePreflight: true,
  })

  return {
    runUrl: ciEvidence.releasePreflightRunUrl,
    errors: ciEvidence.errors,
  }
}

function mergeRunUrl(explicitRunUrl, evidenceRunUrl) {
  if (explicitRunUrl && evidenceRunUrl && explicitRunUrl !== evidenceRunUrl) {
    throw new Error('--run-url does not match --ci-evidence Release Preflight')
  }
  return explicitRunUrl ?? evidenceRunUrl
}

function readCiEvidenceRunUrl(options, commit) {
  if (!options.ciEvidencePath) {
    return null
  }

  const ciEvidencePath = resolveOutputPath(options.ciEvidencePath)
  const ciResult = readJsonFile(ciEvidencePath)
  const ciEvidence = extractReleasePreflightRunUrl(ciResult, commit)
  if (ciEvidence.errors.length > 0) {
    throw new Error(ciEvidence.errors.join('\n'))
  }
  return ciEvidence.runUrl
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (!options.runUrl && !options.ciEvidencePath) {
    throw new Error('Missing required option: --run-url or --ci-evidence')
  }

  const commit = options.commit ?? currentCommit()
  const evidenceRunUrl = readCiEvidenceRunUrl(options, commit)
  const runUrl = mergeRunUrl(options.runUrl, evidenceRunUrl)
  if (!runUrl) {
    throw new Error('Missing Release Preflight run URL')
  }

  const releasePreflightRun = await fetchGitHubActionsRun(runUrl)
  const runErrors = validateGitHubActionsRunMetadata(releasePreflightRun, {
    label: 'Release Preflight',
    workflowName: 'Release Preflight',
    commit,
    conclusion: 'success',
  })
  if (runErrors.length > 0) {
    throw new Error(runErrors.join('\n'))
  }

  const artifact = selectReleasePreflightSummaryArtifact(
    await fetchGitHubActionsRunArtifacts(runUrl),
  )
  if (!artifact) {
    throw new Error(
      `Release Preflight run did not include a ${releasePreflightSummaryArtifactName} artifact`,
    )
  }

  const zipBuffer = await downloadGitHubActionsArtifactZip(artifact.id)
  const summaryText = extractReleasePreflightSummaryFromZip(zipBuffer)
  let summary
  try {
    summary = JSON.parse(summaryText)
  } catch (error) {
    throw new Error(
      `Release preflight summary artifact did not contain valid JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }

  const summaryEvidence = extractReleasePreflightWarningCount(summary, commit)
  if (summaryEvidence.errors.length > 0) {
    throw new Error(summaryEvidence.errors.join('\n'))
  }

  writeJson(options.output, summary)
}

const entryPoint = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (import.meta.url === entryPoint) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
}
