import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  defaultReleaseHandoffReportPath,
  defaultPlatformEvidencePath,
  defaultRealDeviceEvidencePath,
  defaultReleaseCiEvidencePath,
  defaultReleaseReadinessEvidencePath,
} from './release-handoff-commands.mjs'
import {
  formatCommandFailure,
  normalizeCommitSha,
  repoRoot,
} from './release-utils.mjs'

function usage() {
  console.log(`Usage: node scripts/release-handoff-report.mjs [options]

Writes a Markdown release handoff from the existing release-readiness audit.
This report does not create or modify evidence; it summarizes current blockers,
platform worksheet gaps, CI evidence, and next commands for Android/iOS release
device testing.

Options:
  --expected-commit <sha>          Full tested release-candidate commit SHA.
  --output <file>                  Write Markdown to a file. Defaults to stdout.
  --readiness-summary <file>       Render an existing release-readiness summary
                                  instead of running the allow-open audit.
  --ci-evidence <file>             CI evidence path passed to readiness.
                                  Default: ${defaultReleaseCiEvidencePath}
  --platform-evidence <file>       Platform worksheet path passed to readiness.
                                  Default: ${defaultPlatformEvidencePath}
  --real-device-path <file>        Real-device evidence path passed to readiness.
                                  Default: ${defaultRealDeviceEvidencePath}
  --readiness-path <file>          Release-readiness evidence path passed to readiness.
                                  Default: ${defaultReleaseReadinessEvidencePath}
  --help                           Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    ciEvidencePath: null,
    expectedCommit: null,
    output: null,
    platformEvidencePath: null,
    readinessEvidencePath: null,
    readinessSummaryPath: null,
    realDeviceEvidencePath: null,
  }

  const valueOptions = [
    ['--ci-evidence', 'ciEvidencePath'],
    ['--expected-commit', 'expectedCommit'],
    ['--output', 'output'],
    ['--platform-evidence', 'platformEvidencePath'],
    ['--readiness-path', 'readinessEvidencePath'],
    ['--readiness-summary', 'readinessSummaryPath'],
    ['--real-device-path', 'realDeviceEvidencePath'],
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

  options.expectedCommit = normalizeCommitSha(
    options.expectedCommit,
    '--expected-commit',
  )

  return options
}

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function repoPath(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.resolve(repoRoot, filePath)
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(repoPath(filePath), 'utf-8'))
}

function readJsonOptional(filePath) {
  if (!filePath) {
    return null
  }

  try {
    return readJson(filePath)
  } catch {
    return null
  }
}

function runReadinessSummary(options) {
  if (options.readinessSummaryPath) {
    return readJson(options.readinessSummaryPath)
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-handoff-'))
  const summaryPath = path.join(tempDir, 'release-readiness-summary.json')
  const args = [
    'scripts/release-readiness.mjs',
    '--allow-open',
    '--summary-output',
    summaryPath,
  ]

  if (options.expectedCommit) {
    args.push('--expected-commit', options.expectedCommit)
  }
  if (options.ciEvidencePath) {
    args.push('--ci-evidence', options.ciEvidencePath)
  }
  if (options.platformEvidencePath) {
    args.push('--platform-evidence', options.platformEvidencePath)
  }
  if (options.realDeviceEvidencePath) {
    args.push('--real-device-path', options.realDeviceEvidencePath)
  }
  if (options.readinessEvidencePath) {
    args.push('--readiness-path', options.readinessEvidencePath)
  }

  const result = spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: 'utf-8',
  })
  if (result.status !== 0) {
    throw new Error(formatCommandFailure(process.execPath, args, result))
  }

  return readJson(summaryPath)
}

function statusText(value) {
  return value === true ? 'ready' : 'waiting'
}

function inlineList(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return 'none'
  }

  return values.map((value) => `\`${String(value)}\``).join(', ')
}

function statusList(status, key) {
  const value = status[key]
  return Array.isArray(value) ? value : []
}

function reportText(value) {
  const normalizedRoot = repoRoot.split(path.sep).join('/')
  return String(value)
    .replaceAll(`${repoRoot}${path.sep}`, '')
    .replaceAll(`${normalizedRoot}/`, '')
    .replaceAll(repoRoot, '.')
    .replaceAll(normalizedRoot, '.')
    .replace(/\s*\n\s*/g, '; ')
}

function limitedBullets(values, limit = 12) {
  if (!Array.isArray(values) || values.length === 0) {
    return ['- none']
  }

  const lines = values
    .slice(0, limit)
    .map((value) => `- ${reportText(value)}`)
  const remaining = values.length - limit
  if (remaining > 0) {
    lines.push(`- ... ${remaining} more`)
  }
  return lines
}

function platformLabel(platform) {
  if (platform === 'ios') {
    return 'iOS'
  }
  if (platform === 'android') {
    return 'Android'
  }
  return 'Platform'
}

function commandBlock(commands) {
  if (!Array.isArray(commands) || commands.length === 0) {
    return ['No commands recorded.']
  }

  return ['```bash', ...commands, '```']
}

function hasCommandPlaceholders(commands) {
  return (
    Array.isArray(commands) &&
    commands.some(
      (command) =>
        typeof command === 'string' && /<[^>\n]+>/.test(command.trim()),
    )
  )
}

function checkDetailText(detail) {
  const check = String(detail.check ?? 'unknown-check')
  const state = detail.mustPass === true ? 'must pass' : 'skippable'
  const selectedApis = Array.isArray(detail.selectedApis)
    ? detail.selectedApis
        .filter((apiName) => typeof apiName === 'string')
        .map((apiName) => apiName.trim())
        .filter((apiName) => apiName.length > 0)
    : []
  const selectedApiText =
    selectedApis.length > 0
      ? `; selected APIs: ${selectedApis.join(', ')}`
      : ''
  const description =
    typeof detail.description === 'string' && detail.description.trim()
      ? detail.description.trim()
      : check
  return `\`${check}\` (${state}${selectedApiText}): ${description}`
}

function actionCheckDetailLines(action) {
  const details = Array.isArray(action.platformCheckDetails)
    ? action.platformCheckDetails.filter(isRecord)
    : []
  if (details.length === 0) {
    return []
  }

  return [
    'Remaining check details:',
    ...details.map((detail) => {
      const label =
        typeof detail.platformLabel === 'string' && detail.platformLabel.trim()
          ? detail.platformLabel.trim()
          : platformLabel(detail.platform)
      return `- ${label} ${checkDetailText(detail)}`
    }),
  ]
}

function ciEvidenceLines(summary) {
  const ciEvidencePath = summary.initialCiEvidence?.path
  const ciEvidence = readJsonOptional(ciEvidencePath)
  const workflows = isRecord(ciEvidence?.evidence?.workflows)
    ? ciEvidence.evidence.workflows
    : null
  const lines = [
    `- Status: ${statusText(summary.initialCiEvidence?.ready)}`,
    `- Path: \`${ciEvidencePath ?? defaultReleaseCiEvidencePath}\``,
  ]

  if (!workflows) {
    return lines
  }

  for (const workflowName of ['Check', 'Godot Smoke', 'Release Preflight']) {
    const workflow = workflows[workflowName]
    if (!isRecord(workflow)) {
      continue
    }

    const runUrl = typeof workflow.runUrl === 'string' ? workflow.runUrl : null
    const conclusion =
      typeof workflow.runConclusion === 'string'
        ? workflow.runConclusion
        : 'unknown'
    lines.push(
      `- ${workflowName}: ${runUrl ?? 'missing run URL'} (${conclusion})`,
    )
  }

  return lines
}

function platformLines(platform, status) {
  if (!isRecord(status)) {
    return [`### ${platformLabel(platform)}`, '', '- Status: missing']
  }

  const details = Array.isArray(status.remainingCheckDetails)
    ? status.remainingCheckDetails.filter(isRecord)
    : []
  const detailLines =
    details.length > 0
      ? [
          '- Remaining check details:',
          ...details.map((detail) => `  - ${checkDetailText(detail)}`),
        ]
      : []

  return [
    `### ${platformLabel(platform)}`,
    '',
    `- Status: ${statusText(status.ready)} (${status.errorCount ?? 0} blocker(s))`,
    `- Required checks complete: ${status.completedCheckCount ?? 0}/${status.requiredCheckCount ?? 0}`,
    `- Metadata gaps: ${inlineList(status.missingFields)}`,
    `- Must-pass remaining: ${inlineList(status.mustPassMissingChecks)}`,
    `- Skippable remaining: ${inlineList(status.skippableMissingChecks)}`,
    `- Duplicate passed checks: ${inlineList(statusList(status, 'duplicatePassedChecks'))}`,
    `- Invalid skipped reasons: ${inlineList(statusList(status, 'invalidSkippedChecks'))}`,
    `- Contradictory pass/skip checks: ${inlineList(statusList(status, 'passedSkippedChecks'))}`,
    `- Unknown passed checks: ${inlineList(statusList(status, 'unknownPassedChecks'))}`,
    `- Unknown skipped checks: ${inlineList(statusList(status, 'unknownSkippedChecks'))}`,
    `- Unknown selected APIs: ${inlineList(statusList(status, 'unknownSelectedApis'))}`,
    `- Worksheet drift: ${inlineList(statusList(status, 'worksheetErrors'))}`,
    ...detailLines,
  ]
}

function renderPlatformEvidence(summary) {
  const platformEvidence = isRecord(summary.platformEvidence)
    ? summary.platformEvidence
    : {}
  const platforms = isRecord(platformEvidence.platforms)
    ? platformEvidence.platforms
    : {}

  return [
    '## Platform Evidence',
    '',
    `- Status: ${statusText(platformEvidence.ready)} (${platformEvidence.errorCount ?? 0} blocker(s))`,
    `- Path: \`${platformEvidence.path ?? defaultPlatformEvidencePath}\``,
    '',
    ...platformLines('android', platforms.android),
    '',
    ...platformLines('ios', platforms.ios),
  ]
}

function renderNextActions(summary) {
  const actions = Array.isArray(summary.nextActions) ? summary.nextActions : []
  const lines = ['## Next Actions', '']

  if (actions.length === 0) {
    lines.push('No next actions recorded.')
    return lines
  }

  for (const action of actions) {
    lines.push(`### ${action.title ?? action.id ?? 'Action'}`)
    lines.push('')
    if (Array.isArray(action.blockedBy) && action.blockedBy.length > 0) {
      lines.push(`Blocked by: ${inlineList(action.blockedBy)}`)
      lines.push('')
    }
    if (typeof action.detail === 'string' && action.detail.length > 0) {
      lines.push(action.detail)
      lines.push('')
    }
    const checkDetailLines = actionCheckDetailLines(action)
    if (checkDetailLines.length > 0) {
      lines.push(...checkDetailLines)
      lines.push('')
    }
    if (hasCommandPlaceholders(action.commands)) {
      lines.push(
        'Commands with `<...>` placeholders must be edited before running; unresolved placeholders are not valid release evidence or dispatch inputs.',
      )
      lines.push('')
    }
    lines.push(...commandBlock(action.commands))
    lines.push('')
  }

  return lines
}

export function prepareReleaseHandoffSummary(summary, outputPath) {
  if (
    !outputPath ||
    path.resolve(repoRoot, outputPath) !==
      path.resolve(repoRoot, defaultReleaseHandoffReportPath)
  ) {
    return summary
  }

  const actions = Array.isArray(summary.nextActions)
    ? summary.nextActions.filter(
        (action) =>
          !isRecord(action) || action.id !== 'release-handoff-report',
      )
    : summary.nextActions

  return {
    ...summary,
    nextActions: actions,
  }
}

function renderFinalTodoProofs(summary) {
  const requirements = Array.isArray(summary.finalTodoRequirements)
    ? summary.finalTodoRequirements
    : []
  const waiting = requirements.filter((requirement) => requirement.ready !== true)

  return [
    '## Final TODO Proofs',
    '',
    `- Ready: ${requirements.length - waiting.length}/${requirements.length}`,
    ...limitedBullets(
      waiting.map(
        (requirement) =>
          `${requirement.file}:${requirement.line} ${requirement.text} (${requirement.proof} waiting)`,
      ),
    ),
  ]
}

export function renderReleaseHandoff(summary) {
  const checks = isRecord(summary.checks) ? summary.checks : {}
  const commit = summary.commit ?? 'unknown'
  const blockers = Array.isArray(summary.blockers) ? summary.blockers : []

  return [
    '# Release Handoff',
    '',
    `- Release candidate commit: \`${commit}\``,
    `- Overall readiness: ${summary.ready === true ? 'ready' : 'open'} (${summary.blockerCount ?? blockers.length} blocker(s))`,
    `- Real-device evidence: ${statusText(checks.realDeviceEvidence)}`,
    `- Android evidence: ${statusText(checks.androidRealDeviceEvidence)}`,
    `- iOS evidence: ${statusText(checks.iosRealDeviceEvidence)}`,
    `- Release Preflight evidence: ${statusText(checks.releaseReadinessEvidence)}`,
    `- Public warning removal: ${statusText(checks.publicWarningMarkersRemoved)}`,
    '',
    '## Current Blockers',
    '',
    ...limitedBullets(blockers),
    '',
    '## CI Evidence',
    '',
    ...ciEvidenceLines(summary),
    '',
    ...renderPlatformEvidence(summary),
    '',
    ...renderFinalTodoProofs(summary),
    '',
    ...renderNextActions(summary),
  ].join('\n')
}

function writeOutput(outputPath, markdown) {
  if (!outputPath) {
    console.log(markdown)
    return
  }

  const resolved = repoPath(outputPath)
  fs.mkdirSync(path.dirname(resolved), { recursive: true })
  fs.writeFileSync(resolved, `${markdown}\n`)
  console.log(`[release-handoff] wrote ${path.relative(repoRoot, resolved)}`)
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const summary = prepareReleaseHandoffSummary(
    runReadinessSummary(options),
    options.output,
  )
  writeOutput(options.output, renderReleaseHandoff(summary))
}

const entryPoint = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (import.meta.url === entryPoint) {
  try {
    main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}
