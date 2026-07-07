import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  defaultReleaseHandoffReportPath,
  defaultDeviceTestPrereqsSummaryPath,
  defaultPlatformEvidencePath,
  defaultRealDeviceEvidencePath,
  defaultReleaseCiEvidencePath,
  defaultReleasePreflightChecklistPath,
  defaultReleasePreflightSummaryPath,
  defaultReleaseReadinessEvidencePath,
  formatReleaseCommandBlock,
  formatHandoffCommand,
  hasCommandPlaceholders,
  releaseHandoffReportFormatVersion,
  releaseHandoffReportStateHash,
} from './release-handoff-commands.mjs'
import {
  formatCommandFailure,
  normalizeCommitSha,
  repoRoot,
} from './release-utils.mjs'
import { formatIssueBulletLines } from './markdown-checklist-utils.mjs'
import { formatDevicePrereqDiagnosticLines } from './device-prereq-diagnostics.mjs'

function usage() {
  console.log(`Usage: node scripts/release-handoff-report.mjs [options]

Writes a Markdown release handoff from the existing release-readiness audit.
This report does not create or modify evidence; it summarizes current blockers,
platform worksheet gaps, CI evidence, and next commands for Android/iOS release
device testing.

Options:
  --expected-commit <sha>          Full tested release-candidate commit SHA.
  --output <file>                  Write Markdown to a file. Defaults to stdout.
  --check                          Verify the output file is current without
                                  writing it. Defaults to ${defaultReleaseHandoffReportPath}
                                  when --output is omitted.
  --readiness-summary <file>       Render an existing release-readiness summary
                                  instead of running the strict audit.
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
    check: false,
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

    if (arg === '--check') {
      options.check = true
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

  options.expectedCommit = normalizeCommitSha(
    options.expectedCommit,
    '--expected-commit',
  )
  if (!options.expectedCommit && !options.readinessSummaryPath) {
    options.expectedCommit = inferExpectedCommitFromCiEvidence(options)
  }

  return options
}

function inferExpectedCommitFromCiEvidence(options) {
  const ciEvidence = readJsonOptional(
    options.ciEvidencePath ?? defaultReleaseCiEvidencePath,
  )
  if (!isRecord(ciEvidence)) {
    return null
  }

  const evidence = isRecord(ciEvidence.evidence) ? ciEvidence.evidence : {}
  const commit = ciEvidence.commit ?? evidence.commit
  if (
    typeof ciEvidence.commit === 'string' &&
    typeof evidence.commit === 'string' &&
    ciEvidence.commit !== evidence.commit
  ) {
    return null
  }

  try {
    return normalizeCommitSha(commit, 'CI evidence commit')
  } catch {
    return null
  }
}

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function repoPath(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.resolve(repoRoot, filePath)
}

function repoRelativePath(filePath) {
  return path.relative(repoRoot, repoPath(filePath)).split(path.sep).join('/')
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
  if (result.status !== 0 && !fs.existsSync(summaryPath)) {
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

function optionalText(value) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return 'none'
  }

  return value.trim()
}

function reportTextLine(value) {
  const normalizedRoot = repoRoot.split(path.sep).join('/')
  return String(value)
    .replaceAll(`${repoRoot}${path.sep}`, '')
    .replaceAll(`${normalizedRoot}/`, '')
    .replaceAll(repoRoot, '.')
    .replaceAll(normalizedRoot, '.')
}

function reportText(value) {
  return reportTextLine(value).replace(/\s*\n\s*/g, '; ')
}

function limitedBullets(values, limit = 12) {
  return formatIssueBulletLines(values, {
    limit,
    normalizeLine: reportTextLine,
  })
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
    selectedApis.length > 0 ? `; selected APIs: ${selectedApis.join(', ')}` : ''
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

function renderDevicePrereqDiagnostics(summary) {
  return formatDevicePrereqDiagnosticLines(summary.devicePrereqs, {
    countMissing: '0',
    formatPath: (value) => `\`${value}\``,
    pathFallback: defaultDeviceTestPrereqsSummaryPath,
  })
}

function platformLines(platform, status) {
  if (!isRecord(status)) {
    return [`### ${platformLabel(platform)}`, '', '- Status: missing']
  }

  const confirmationIssue =
    typeof status.passRemainingConfirmationIssue === 'string' &&
    status.passRemainingConfirmationIssue.trim().length > 0
      ? [
          `- Batch confirmation issue: ${status.passRemainingConfirmationIssue.trim()}`,
        ]
      : []
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
    `- Batch confirmation: ${optionalText(status.passRemainingConfirmation)}`,
    ...confirmationIssue,
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

function displayEvidenceValue(value) {
  if (typeof value === 'boolean') {
    return String(value)
  }
  if (Number.isInteger(value)) {
    return String(value)
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim()
  }
  return 'missing'
}

function evidenceErrorLines(label, errors) {
  const values = Array.isArray(errors) ? errors : []
  return [`- ${label}:`, ...limitedBullets(values)]
}

function renderReleasePreflightEvidence(summary) {
  const status = isRecord(summary.releaseReadinessEvidence)
    ? summary.releaseReadinessEvidence
    : {}
  const evidence = isRecord(status.evidence) ? status.evidence : {}

  return [
    '## Release Preflight Evidence',
    '',
    `- Status: ${statusText(status.ready)} (${status.errorCount ?? 0} blocker(s))`,
    `- Readiness evidence path: \`${status.path ?? defaultReleaseReadinessEvidencePath}\``,
    `- Summary JSON: \`${defaultReleasePreflightSummaryPath}\``,
    `- Summary checklist: \`${defaultReleasePreflightChecklistPath}\``,
    `- Evidence present: ${status.evidencePresent === true ? 'yes' : 'no'}`,
    `- Release commit: ${displayEvidenceValue(evidence.commit)}`,
    `- Run URL: ${displayEvidenceValue(evidence.releasePreflightRunUrl)}`,
    `- Run commit: ${displayEvidenceValue(evidence.releasePreflightRunCommit)}`,
    `- Run conclusion: ${displayEvidenceValue(
      evidence.releasePreflightRunConclusion,
    )}`,
    `- Local-only: ${displayEvidenceValue(evidence.releasePreflightLocalOnly)}`,
    `- Skipped Check: ${displayEvidenceValue(
      evidence.releasePreflightSkipCheck,
    )}`,
    `- Skipped Godot: ${displayEvidenceValue(
      evidence.releasePreflightSkipGodot,
    )}`,
    `- Skipped serious examples: ${displayEvidenceValue(
      evidence.releasePreflightSkipSeriousExamples,
    )}`,
    `- Failure count: ${displayEvidenceValue(
      evidence.releasePreflightFailureCount,
    )}`,
    `- Warning count: ${displayEvidenceValue(
      evidence.releasePreflightWarningCount,
    )}`,
    ...evidenceErrorLines('Read errors', status.readErrors),
    ...evidenceErrorLines('Validation errors', status.validationErrors),
    ...evidenceErrorLines('Run verification errors', status.runErrors),
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
    lines.push(...formatReleaseCommandBlock(action.commands))
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

  const outputRelativePath = repoRelativePath(outputPath)
  const blockers = Array.isArray(summary.blockers) ? summary.blockers : []
  let removedSelfOutputDirtyLine = false
  const preparedBlockers = blockers.flatMap((blocker) => {
    const preparedBlocker = removeSelfOutputDirtyLine(
      blocker,
      outputRelativePath,
    )
    if (preparedBlocker.removed) {
      removedSelfOutputDirtyLine = true
    }
    return preparedBlocker.blocker ? [preparedBlocker.blocker] : []
  })
  const cleanWorktreeStillDirty = preparedBlockers.some(isCleanWorktreeBlocker)

  const actions = Array.isArray(summary.nextActions)
    ? summary.nextActions.filter((action) => {
        if (!isRecord(action)) {
          return true
        }
        if (action.id === 'release-handoff-report') {
          return false
        }
        if (
          removedSelfOutputDirtyLine &&
          !cleanWorktreeStillDirty &&
          action.id === 'clean-worktree'
        ) {
          return false
        }
        return true
      })
    : summary.nextActions

  return {
    ...summary,
    blockerCount: removedSelfOutputDirtyLine
      ? preparedBlockers.length
      : summary.blockerCount,
    blockers: preparedBlockers,
    checks:
      removedSelfOutputDirtyLine && isRecord(summary.checks)
        ? {
            ...summary.checks,
            cleanWorktree: !cleanWorktreeStillDirty,
          }
        : summary.checks,
    localGit:
      removedSelfOutputDirtyLine && isRecord(summary.localGit)
        ? {
            ...summary.localGit,
            dirtyWorktree: cleanWorktreeStillDirty,
          }
        : summary.localGit,
    nextActions: actions,
    ready: removedSelfOutputDirtyLine
      ? preparedBlockers.length === 0
      : summary.ready,
  }
}

function dirtyStatusPath(line) {
  const text = String(line).trim()
  const match = text.match(/^(?:[ MADRCU?!]{1,2}\s+)?(.+)$/)
  const dirtyPath = match ? match[1] : text
  const renamedPath = dirtyPath.includes(' -> ')
    ? dirtyPath.split(' -> ').at(-1)
    : dirtyPath

  return String(renamedPath).replace(/^"|"$/g, '')
}

function isCleanWorktreeBlocker(blocker) {
  return (
    typeof blocker === 'string' &&
    blocker.split('\n')[0] ===
      'working tree must be clean for final release readiness'
  )
}

function removeSelfOutputDirtyLine(blocker, outputRelativePath) {
  if (typeof blocker !== 'string') {
    return { blocker, removed: false }
  }

  const [title, ...statusLines] = blocker.split('\n')
  if (
    title !== 'working tree must be clean for final release readiness' ||
    statusLines.length === 0
  ) {
    return { blocker, removed: false }
  }

  const keptStatusLines = statusLines.filter(
    (line) => dirtyStatusPath(line) !== outputRelativePath,
  )
  const removed = keptStatusLines.length !== statusLines.length
  if (!removed) {
    return { blocker, removed: false }
  }
  if (keptStatusLines.length === 0) {
    return { blocker: null, removed: true }
  }

  return { blocker: [title, ...keptStatusLines].join('\n'), removed: true }
}

function renderFinalTodoProofs(summary) {
  const requirements = Array.isArray(summary.finalTodoRequirements)
    ? summary.finalTodoRequirements
    : []
  const waiting = requirements.filter(
    (requirement) => requirement.ready !== true,
  )

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
    `- Handoff format: ${releaseHandoffReportFormatVersion}`,
    `- Handoff state: ${releaseHandoffReportStateHash(summary)}`,
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
    ...renderDevicePrereqDiagnostics(summary),
    '',
    ...renderPlatformEvidence(summary),
    '',
    ...renderReleasePreflightEvidence(summary),
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

function releaseHandoffWriteCommand(options, outputPath) {
  const args = ['npm', 'run', 'release:handoff', '--']
  const pushOption = (name, value) => {
    if (value) {
      args.push(name, value)
    }
  }

  pushOption('--expected-commit', options.expectedCommit)
  args.push('--output', outputPath)
  pushOption('--readiness-summary', options.readinessSummaryPath)
  pushOption('--ci-evidence', options.ciEvidencePath)
  pushOption('--platform-evidence', options.platformEvidencePath)
  pushOption('--real-device-path', options.realDeviceEvidencePath)
  pushOption('--readiness-path', options.readinessEvidencePath)

  return formatHandoffCommand(args)
}

function checkOutput(outputPath, markdown, options) {
  const targetPath = outputPath ?? defaultReleaseHandoffReportPath
  const resolved = repoPath(targetPath)
  const expected = `${markdown}\n`

  if (!fs.existsSync(resolved)) {
    throw new Error(
      `[release-handoff] ${path.relative(repoRoot, resolved)} is missing`,
    )
  }

  const actual = fs.readFileSync(resolved, 'utf-8')
  if (actual !== expected) {
    const command = releaseHandoffWriteCommand(options, targetPath)
    throw new Error(
      `[release-handoff] ${path.relative(repoRoot, resolved)} is stale; run ${command}`,
    )
  }

  console.log(
    `[release-handoff] ${path.relative(repoRoot, resolved)} is current`,
  )
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const summary = prepareReleaseHandoffSummary(
    runReadinessSummary(options),
    options.check
      ? (options.output ?? defaultReleaseHandoffReportPath)
      : options.output,
  )
  const markdown = renderReleaseHandoff(summary)
  if (options.check) {
    checkOutput(options.output, markdown, options)
    return
  }

  writeOutput(options.output, markdown)
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
