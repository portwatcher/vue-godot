import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  requiredRealDeviceChecks,
  validateRealDeviceEvidence,
} from './real-device-evidence.mjs'
import {
  fetchGitHubActionsRun,
  isRecord,
  validateGitHubActionsRunMetadata,
} from './release-evidence-utils.mjs'
import {
  currentReleasePackageVersions,
  repoRoot,
  run,
} from './release-utils.mjs'
import { validateReleaseReadinessEvidence } from './release-readiness.mjs'

const defaultGodotJsVersion = 'GodotJS 1.0.0-2 / Godot 4.4.x'
const optionFlags = {
  platformEvidencePath: '--platform-evidence',
  checkRunUrl: '--check-run-url',
  godotSmokeRunUrl: '--godot-smoke-run-url',
  realDeviceOutput: '--real-device-output',
  releasePreflightRunUrl: '--release-preflight-run-url',
  releasePreflightWarningCount: '--release-preflight-warning-count',
  readinessOutput: '--readiness-output',
}

function usage() {
  console.log(`Usage: node scripts/create-release-evidence.mjs [options]

Assembles release evidence JSON from actual Android/iOS platform evidence and
verified GitHub Actions run URLs. This helper never fabricates device results:
pass --platform-evidence with android and ios objects after device testing.

Options:
  --platform-evidence <file>       JSON with { "android": {...}, "ios": {...} }.
  --check-run-url <url>            Successful Check workflow run URL.
  --godot-smoke-run-url <url>      Successful Godot Smoke workflow run URL.
  --real-device-output <file>      Write real-device evidence JSON.
  --release-preflight-run-url <url>
                                  Successful Release Preflight workflow run URL.
  --release-preflight-warning-count <count>
                                  Warning count from release preflight output.
  --readiness-output <file>        Write release-readiness evidence JSON.
  --commit <sha>                   Evidence commit. Default: current HEAD.
  --godot-js-version <label>       GodotJS version label.
                                  Default: ${defaultGodotJsVersion}
  --help                           Show this help.

Example:
  npm run release:evidence -- \\
    --platform-evidence release/platform-evidence.json \\
    --check-run-url https://github.com/portwatcher/vue-godot/actions/runs/1 \\
    --godot-smoke-run-url https://github.com/portwatcher/vue-godot/actions/runs/2 \\
    --real-device-output release/real-device-evidence.json
`)
}

function parseArgs(argv) {
  const options = {
    platformEvidencePath: null,
    checkRunUrl: null,
    godotSmokeRunUrl: null,
    realDeviceOutput: null,
    releasePreflightRunUrl: null,
    releasePreflightWarningCount: null,
    readinessOutput: null,
    commit: null,
    godotJsVersion: defaultGodotJsVersion,
  }

  const valueOptions = [
    ['--platform-evidence', 'platformEvidencePath'],
    ['--check-run-url', 'checkRunUrl'],
    ['--godot-smoke-run-url', 'godotSmokeRunUrl'],
    ['--real-device-output', 'realDeviceOutput'],
    ['--release-preflight-run-url', 'releasePreflightRunUrl'],
    ['--release-preflight-warning-count', 'releasePreflightWarningCount'],
    ['--readiness-output', 'readinessOutput'],
    ['--commit', 'commit'],
    ['--godot-js-version', 'godotJsVersion'],
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

function readPlatformEvidence(filePath) {
  const evidence = readJsonFile(filePath)
  if (
    !isRecord(evidence) ||
    !isRecord(evidence.android) ||
    !isRecord(evidence.ios)
  ) {
    throw new Error(
      `${path.relative(
        repoRoot,
        filePath,
      )} must contain android and ios evidence objects`,
    )
  }

  return {
    android: evidence.android,
    ios: evidence.ios,
  }
}

function assertRequiredOptions(options, names) {
  for (const name of names) {
    if (!options[name]) {
      throw new Error(`Missing required option: ${optionFlags[name] ?? name}`)
    }
  }
}

function parseWarningCount(value) {
  if (value == null) {
    throw new Error(
      '--release-preflight-warning-count is required when writing readiness evidence',
    )
  }

  const count = Number(value)
  if (!Number.isInteger(count) || count < 0) {
    throw new Error(
      '--release-preflight-warning-count must be a non-negative integer',
    )
  }
  return count
}

async function readSuccessfulRun(runUrl, workflowName, commit, label) {
  const actionRun = await fetchGitHubActionsRun(runUrl)
  const errors = validateGitHubActionsRunMetadata(actionRun, {
    label,
    workflowName,
    commit,
    conclusion: 'success',
  })

  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }

  return actionRun
}

function writeJson(filePath, data) {
  const resolved = resolveOutputPath(filePath)
  fs.mkdirSync(path.dirname(resolved), { recursive: true })
  fs.writeFileSync(resolved, `${JSON.stringify(data, null, 2)}\n`)
  console.log(`[release-evidence] wrote ${path.relative(repoRoot, resolved)}`)
}

export function buildRealDeviceEvidence(options) {
  return {
    commit: options.commit,
    packageVersions: options.packageVersions,
    godotJsVersion: options.godotJsVersion,
    checkRunUrl: options.checkRunUrl,
    checkRunWorkflowName: options.checkRun.name,
    checkRunCommit: options.checkRun.head_sha,
    checkRunConclusion: options.checkRun.conclusion,
    godotSmokeRunUrl: options.godotSmokeRunUrl,
    godotSmokeRunWorkflowName: options.godotSmokeRun.name,
    godotSmokeRunCommit: options.godotSmokeRun.head_sha,
    godotSmokeRunConclusion: options.godotSmokeRun.conclusion,
    android: options.platformEvidence.android,
    ios: options.platformEvidence.ios,
  }
}

export function buildReleaseReadinessEvidence(options) {
  return {
    commit: options.commit,
    releasePreflightRunUrl: options.releasePreflightRunUrl,
    releasePreflightRunWorkflowName: options.releasePreflightRun.name,
    releasePreflightRunCommit: options.releasePreflightRun.head_sha,
    releasePreflightRunConclusion: options.releasePreflightRun.conclusion,
    releasePreflightWarningCount: options.releasePreflightWarningCount,
  }
}

function validateGeneratedRealDeviceEvidence(evidence, commit, packageVersions) {
  const errors = validateRealDeviceEvidence(evidence, {
    expectedCommit: commit,
    expectedPackageVersions: packageVersions,
  })
  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }
}

function validateGeneratedReleaseReadinessEvidence(evidence, commit) {
  const errors = validateReleaseReadinessEvidence(evidence, commit)
  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  assertRequiredOptions(options, [
    'platformEvidencePath',
    'checkRunUrl',
    'godotSmokeRunUrl',
    'realDeviceOutput',
  ])

  if (
    options.readinessOutput ||
    options.releasePreflightRunUrl ||
    options.releasePreflightWarningCount != null
  ) {
    assertRequiredOptions(options, [
      'releasePreflightRunUrl',
      'releasePreflightWarningCount',
      'readinessOutput',
    ])
  }

  const commit = options.commit ?? currentCommit()
  const packageVersions = currentReleasePackageVersions()
  const platformEvidencePath = resolveOutputPath(options.platformEvidencePath)
  const platformEvidence = readPlatformEvidence(platformEvidencePath)
  const checkRun = await readSuccessfulRun(
    options.checkRunUrl,
    'Check',
    commit,
    'evidence.checkRunUrl',
  )
  const godotSmokeRun = await readSuccessfulRun(
    options.godotSmokeRunUrl,
    'Godot Smoke',
    commit,
    'evidence.godotSmokeRunUrl',
  )

  const realDeviceEvidence = buildRealDeviceEvidence({
    commit,
    packageVersions,
    godotJsVersion: options.godotJsVersion,
    checkRunUrl: options.checkRunUrl,
    checkRun,
    godotSmokeRunUrl: options.godotSmokeRunUrl,
    godotSmokeRun,
    platformEvidence,
  })
  validateGeneratedRealDeviceEvidence(realDeviceEvidence, commit, packageVersions)

  let readinessEvidence = null
  if (options.releasePreflightRunUrl) {
    const releasePreflightRun = await readSuccessfulRun(
      options.releasePreflightRunUrl,
      'Release Preflight',
      commit,
      'releaseReadiness.releasePreflightRunUrl',
    )
    const releasePreflightWarningCount = parseWarningCount(
      options.releasePreflightWarningCount,
    )
    const readinessEvidence = buildReleaseReadinessEvidence({
      commit,
      releasePreflightRunUrl: options.releasePreflightRunUrl,
      releasePreflightRun,
      releasePreflightWarningCount,
    })
    validateGeneratedReleaseReadinessEvidence(readinessEvidence, commit)
  }

  writeJson(options.realDeviceOutput, realDeviceEvidence)
  if (readinessEvidence) {
    writeJson(options.readinessOutput, readinessEvidence)
  }
}

const entryPoint = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (import.meta.url === entryPoint) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    console.error(
      `\nRequired Android checks: ${requiredRealDeviceChecks.android.join(', ')}`,
    )
    console.error(
      `Required iOS checks: ${requiredRealDeviceChecks.ios.join(', ')}`,
    )
    process.exit(1)
  })
}
