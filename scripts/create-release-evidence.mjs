import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  requiredRealDeviceChecks,
  validateRealDeviceEvidence,
  validateRealDevicePlatformEvidence,
} from './real-device-evidence.mjs'
import {
  fetchGitHubActionsRun,
  hasGitHubActionsRunUrl,
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

function followUpEvidenceCommitHint(commit) {
  return `If this evidence is generated from a follow-up evidence commit, rerun release:evidence with --commit ${commit}.`
}

const optionFlags = {
  platformEvidencePath: '--platform-evidence',
  ciEvidencePath: '--ci-evidence',
  checkRunUrl: '--check-run-url',
  godotSmokeRunUrl: '--godot-smoke-run-url',
  realDeviceOutput: '--real-device-output',
  releasePreflightRunUrl: '--release-preflight-run-url',
  releasePreflightWarningCount: '--release-preflight-warning-count',
  releasePreflightSummaryPath: '--release-preflight-summary',
  readinessOutput: '--readiness-output',
}

function usage() {
  console.log(`Usage: node scripts/create-release-evidence.mjs [options]

Assembles release evidence JSON from actual Android/iOS platform evidence and
verified GitHub Actions run URLs. This helper never fabricates device results:
pass --platform-evidence with android and ios objects after device testing.

Options:
  --platform-evidence <file>       JSON with { "android": {...}, "ios": {...} }.
  --ci-evidence <file>             JSON written by npm run release:ci -- --output.
  --check-run-url <url>            Successful Check workflow run URL.
  --godot-smoke-run-url <url>      Successful Godot Smoke workflow run URL.
  --real-device-output <file>      Write real-device evidence JSON.
  --release-preflight-run-url <url>
                                  Successful Release Preflight workflow run URL.
  --release-preflight-warning-count <count>
                                  Optional consistency check for the summary warning count.
  --release-preflight-summary <file>
                                  Required for readiness evidence. JSON written by
                                  release:preflight -- --summary-output.
  --readiness-output <file>        Write release-readiness evidence JSON.
  --commit <sha>                   Tested release commit. Default: current HEAD.
                                  Use the release-candidate SHA when writing
                                  evidence from a follow-up evidence commit.
  --godot-js-version <label>       GodotJS version label.
                                  Default: ${defaultGodotJsVersion}
  --help                           Show this help.

Example:
  npm run release:evidence -- \\
    --platform-evidence release/platform-evidence.json \\
    --ci-evidence release/ci-runs.json \\
    --real-device-output release/real-device-evidence.json
`)
}

function parseArgs(argv) {
  const options = {
    platformEvidencePath: null,
    ciEvidencePath: null,
    checkRunUrl: null,
    godotSmokeRunUrl: null,
    realDeviceOutput: null,
    releasePreflightRunUrl: null,
    releasePreflightWarningCount: null,
    releasePreflightSummaryPath: null,
    readinessOutput: null,
    commit: null,
    godotJsVersion: defaultGodotJsVersion,
  }

  const valueOptions = [
    ['--platform-evidence', 'platformEvidencePath'],
    ['--ci-evidence', 'ciEvidencePath'],
    ['--check-run-url', 'checkRunUrl'],
    ['--godot-smoke-run-url', 'godotSmokeRunUrl'],
    ['--real-device-output', 'realDeviceOutput'],
    ['--release-preflight-run-url', 'releasePreflightRunUrl'],
    ['--release-preflight-warning-count', 'releasePreflightWarningCount'],
    ['--release-preflight-summary', 'releasePreflightSummaryPath'],
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

  const platformEvidence = {
    android: normalizePlatformEvidence(evidence.android),
    ios: normalizePlatformEvidence(evidence.ios),
  }

  const errors = [
    ...validateRealDevicePlatformEvidence(platformEvidence, 'android'),
    ...validateRealDevicePlatformEvidence(platformEvidence, 'ios'),
  ]
  if (errors.length > 0) {
    throw new Error(
      [
        `${path.relative(repoRoot, filePath)} platform evidence is incomplete`,
        ...errors,
      ].join('\n'),
    )
  }

  return platformEvidence
}

export function normalizePlatformEvidence(evidence) {
  const { requiredChecks, passOnlyChecks, selectedApiRequiredChecks, ...platformEvidence } = evidence
  return platformEvidence
}

function workflowRunUrl(ciEvidence, workflowName, errors, options = {}) {
  const required = options.required ?? true
  if (!isRecord(ciEvidence.workflows)) {
    errors.push('CI evidence must include evidence.workflows')
    return null
  }

  const workflow = ciEvidence.workflows[workflowName]
  if (!isRecord(workflow)) {
    if (required) {
      errors.push(`CI evidence missing ${workflowName} workflow run`)
    }
    return null
  }

  if (!hasGitHubActionsRunUrl(workflow, 'runUrl')) {
    errors.push(
      `CI evidence ${workflowName}.runUrl must be a GitHub Actions run URL for portwatcher/vue-godot`,
    )
    return null
  }

  return workflow.runUrl
}

function collectCiSummaryStatusErrors(ciResult, options = {}) {
  const errors = []
  const statusFieldNames = [
    'ready',
    'commitFound',
    'requiredWorkflowNames',
    'passedWorkflowNames',
    'missingWorkflowNames',
    'checks',
  ]
  const hasStructuredStatus = statusFieldNames.some(
    (fieldName) => fieldName in ciResult,
  )
  if (!hasStructuredStatus) {
    return errors
  }

  const requiredWorkflowNames = ['Check', 'Godot Smoke']
  if (options.requireReleasePreflight === true) {
    requiredWorkflowNames.push('Release Preflight')
  }

  if (ciResult.ready !== true) {
    errors.push('CI evidence ready must be true')
  }

  if (ciResult.commitFound !== true) {
    errors.push('CI evidence commitFound must be true')
  }

  if (!isRecord(ciResult.checks)) {
    errors.push('CI evidence checks must be an object')
  } else {
    const requiredChecks = [
      ['commitFound', 'commitFound'],
      ['checkWorkflow', 'Check'],
      ['godotSmokeWorkflow', 'Godot Smoke'],
    ]
    if (options.requireReleasePreflight === true) {
      requiredChecks.push([
        'releasePreflightWorkflow',
        'Release Preflight',
      ])
    }

    for (const [checkName, workflowName] of requiredChecks) {
      if (ciResult.checks[checkName] !== true) {
        errors.push(
          `CI evidence checks.${checkName} must be true for ${workflowName}`,
        )
      }
    }
  }

  for (const [fieldName, label] of [
    ['requiredWorkflowNames', 'required workflow'],
    ['passedWorkflowNames', 'passed workflow'],
  ]) {
    const workflowNames = ciResult[fieldName]
    if (!Array.isArray(workflowNames)) {
      errors.push(`CI evidence ${fieldName} must be an array`)
      continue
    }

    for (const workflowName of requiredWorkflowNames) {
      if (!workflowNames.includes(workflowName)) {
        errors.push(
          `CI evidence ${fieldName} must include ${label} ${workflowName}`,
        )
      }
    }
  }

  const missingWorkflowNames = ciResult.missingWorkflowNames
  if (!Array.isArray(missingWorkflowNames)) {
    errors.push('CI evidence missingWorkflowNames must be an array')
  } else {
    const missingRequiredWorkflowNames = requiredWorkflowNames.filter(
      (workflowName) => missingWorkflowNames.includes(workflowName),
    )
    if (missingRequiredWorkflowNames.length > 0) {
      errors.push(
        [
          'CI evidence missingWorkflowNames includes required workflow(s):',
          missingRequiredWorkflowNames.join(', '),
        ].join(' '),
      )
    }
  }

  return errors
}

export function extractCiRunUrls(ciResult, commit, options = {}) {
  const errors = []
  if (!isRecord(ciResult)) {
    errors.push('CI evidence must be a JSON object')
    return { checkRunUrl: null, godotSmokeRunUrl: null, errors }
  }

  const ciEvidence = isRecord(ciResult.evidence) ? ciResult.evidence : ciResult
  if (!isRecord(ciEvidence)) {
    errors.push('CI evidence must include an evidence object')
    return { checkRunUrl: null, godotSmokeRunUrl: null, errors }
  }

  if (Array.isArray(ciResult.errors)) {
    const unresolvedErrors = ciResult.errors.filter(
      (error) => typeof error === 'string' && error.trim().length > 0,
    )
    if (unresolvedErrors.length > 0) {
      errors.push(
        ['CI evidence contains unresolved errors:', ...unresolvedErrors].join(
          '\n',
        ),
      )
    }
  }
  errors.push(...collectCiSummaryStatusErrors(ciResult, options))

  if (ciEvidence.commit !== commit) {
    errors.push(
      [
        `CI evidence commit must match expected release commit ${commit}.`,
        followUpEvidenceCommitHint(commit),
      ].join('\n'),
    )
  }

  const checkRunUrl = workflowRunUrl(ciEvidence, 'Check', errors)
  const godotSmokeRunUrl = workflowRunUrl(ciEvidence, 'Godot Smoke', errors)
  const releasePreflightRunUrl = workflowRunUrl(
    ciEvidence,
    'Release Preflight',
    errors,
    { required: options.requireReleasePreflight === true },
  )
  return { checkRunUrl, godotSmokeRunUrl, releasePreflightRunUrl, errors }
}

function mergeRunUrlOption(name, explicitUrl, evidenceUrl) {
  if (explicitUrl && evidenceUrl && explicitUrl !== evidenceUrl) {
    throw new Error(
      `${optionFlags[name]} does not match ${optionFlags.ciEvidencePath}`,
    )
  }
  return explicitUrl ?? evidenceUrl
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
      '--release-preflight-summary must include a warning count when writing readiness evidence',
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

export function extractReleasePreflightWarningCount(summary, commit) {
  const errors = []
  if (!isRecord(summary)) {
    errors.push('Release preflight summary must be a JSON object')
    return {
      warningCount: null,
      failureCount: null,
      localOnly: null,
      skipCheck: null,
      skipGodot: null,
      skipSeriousExamples: null,
      errors,
    }
  }

  if (summary.commit !== commit) {
    errors.push(
      [
        `Release preflight summary commit must match expected release commit ${commit}.`,
        followUpEvidenceCommitHint(commit),
      ].join('\n'),
    )
  }

  if (summary.localOnly !== false) {
    errors.push(
      'Release preflight summary must come from a non-local release preflight run',
    )
  }

  for (const key of ['skipCheck', 'skipGodot', 'skipSeriousExamples']) {
    if (summary[key] !== false) {
      errors.push(`Release preflight summary ${key} must be false`)
    }
  }

  const warningCount = summary.warningCount
  if (!Number.isInteger(warningCount) || warningCount < 0) {
    errors.push(
      'Release preflight summary warningCount must be a non-negative integer',
    )
  } else if (warningCount !== 0) {
    const summaryWarnings = Array.isArray(summary.warnings)
      ? summary.warnings.filter(
          (warning) => typeof warning === 'string' && warning.trim().length > 0,
        )
      : []
    errors.push(
      [
        `Release preflight summary contains ${warningCount} warning(s)`,
        ...summaryWarnings,
      ].join('\n'),
    )
  }

  const failureCount = summary.failureCount
  if (!Number.isInteger(failureCount) || failureCount < 0) {
    errors.push(
      'Release preflight summary failureCount must be a non-negative integer',
    )
  } else if (failureCount !== 0) {
    const summaryFailures = Array.isArray(summary.failures)
      ? summary.failures.filter(
          (failure) => typeof failure === 'string' && failure.trim().length > 0,
        )
      : []
    errors.push(
      [
        `Release preflight summary contains ${failureCount} failure(s)`,
        ...summaryFailures,
      ].join('\n'),
    )
  }

  return {
    warningCount:
      Number.isInteger(warningCount) && warningCount >= 0 ? warningCount : null,
    failureCount:
      Number.isInteger(failureCount) && failureCount >= 0 ? failureCount : null,
    localOnly: summary.localOnly === false ? false : null,
    skipCheck: summary.skipCheck === false ? false : null,
    skipGodot: summary.skipGodot === false ? false : null,
    skipSeriousExamples:
      summary.skipSeriousExamples === false ? false : null,
    errors,
  }
}

function mergeWarningCountOption(explicitValue, summaryCount) {
  const explicitCount =
    explicitValue == null ? null : parseWarningCount(explicitValue)
  if (
    explicitCount != null &&
    summaryCount != null &&
    explicitCount !== summaryCount
  ) {
    throw new Error(
      '--release-preflight-warning-count does not match --release-preflight-summary',
    )
  }
  return explicitCount ?? summaryCount
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
    releasePreflightLocalOnly: options.releasePreflightLocalOnly,
    releasePreflightSkipCheck: options.releasePreflightSkipCheck,
    releasePreflightSkipGodot: options.releasePreflightSkipGodot,
    releasePreflightSkipSeriousExamples:
      options.releasePreflightSkipSeriousExamples,
    releasePreflightFailureCount: options.releasePreflightFailureCount,
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
    'realDeviceOutput',
  ])

  const wantsReadinessEvidence =
    options.readinessOutput ||
    options.releasePreflightRunUrl ||
    options.releasePreflightWarningCount != null ||
    options.releasePreflightSummaryPath

  if (wantsReadinessEvidence) {
    assertRequiredOptions(options, ['readinessOutput'])
    if (!options.releasePreflightRunUrl && !options.ciEvidencePath) {
      throw new Error(
        'Missing required option: --release-preflight-run-url or --ci-evidence with Release Preflight',
      )
    }
    if (!options.releasePreflightSummaryPath) {
      throw new Error('Missing required option: --release-preflight-summary')
    }
  }

  const commit = options.commit ?? currentCommit()
  const packageVersions = currentReleasePackageVersions()
  let releasePreflightSummary = null
  if (options.releasePreflightSummaryPath) {
    const releasePreflightSummaryPath = resolveOutputPath(
      options.releasePreflightSummaryPath,
    )
    const summary = readJsonFile(releasePreflightSummaryPath)
    releasePreflightSummary = extractReleasePreflightWarningCount(
      summary,
      commit,
    )
    if (releasePreflightSummary.errors.length > 0) {
      throw new Error(releasePreflightSummary.errors.join('\n'))
    }
    options.releasePreflightWarningCount = mergeWarningCountOption(
      options.releasePreflightWarningCount,
      releasePreflightSummary.warningCount,
    )
  }

  if (options.ciEvidencePath) {
    const ciEvidencePath = resolveOutputPath(options.ciEvidencePath)
    const ciResult = readJsonFile(ciEvidencePath)
    const ciEvidence = extractCiRunUrls(ciResult, commit, {
      requireReleasePreflight:
        wantsReadinessEvidence && !options.releasePreflightRunUrl,
    })
    if (ciEvidence.errors.length > 0) {
      throw new Error(ciEvidence.errors.join('\n'))
    }
    options.checkRunUrl = mergeRunUrlOption(
      'checkRunUrl',
      options.checkRunUrl,
      ciEvidence.checkRunUrl,
    )
    options.godotSmokeRunUrl = mergeRunUrlOption(
      'godotSmokeRunUrl',
      options.godotSmokeRunUrl,
      ciEvidence.godotSmokeRunUrl,
    )
    if (ciEvidence.releasePreflightRunUrl) {
      options.releasePreflightRunUrl = mergeRunUrlOption(
        'releasePreflightRunUrl',
        options.releasePreflightRunUrl,
        ciEvidence.releasePreflightRunUrl,
      )
    }
  }
  assertRequiredOptions(options, ['checkRunUrl', 'godotSmokeRunUrl'])
  if (wantsReadinessEvidence) {
    assertRequiredOptions(options, ['releasePreflightRunUrl'])
  }

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
    if (!releasePreflightSummary) {
      throw new Error('Missing required option: --release-preflight-summary')
    }

    const releasePreflightRun = await readSuccessfulRun(
      options.releasePreflightRunUrl,
      'Release Preflight',
      commit,
      'releaseReadiness.releasePreflightRunUrl',
    )
    const releasePreflightWarningCount = parseWarningCount(
      options.releasePreflightWarningCount,
    )
    readinessEvidence = buildReleaseReadinessEvidence({
      commit,
      releasePreflightRunUrl: options.releasePreflightRunUrl,
      releasePreflightRun,
      releasePreflightLocalOnly: releasePreflightSummary.localOnly,
      releasePreflightSkipCheck: releasePreflightSummary.skipCheck,
      releasePreflightSkipGodot: releasePreflightSummary.skipGodot,
      releasePreflightSkipSeriousExamples:
        releasePreflightSummary.skipSeriousExamples,
      releasePreflightFailureCount: releasePreflightSummary.failureCount,
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
