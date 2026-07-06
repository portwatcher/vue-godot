import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  describeRealDeviceEvidencePath,
  readRealDeviceEvidence,
  resolveRealDeviceEvidencePath,
  validateRealDeviceEvidenceMetadata,
  validateRealDevicePlatformEvidence,
  verifyRealDeviceEvidenceRuns,
} from './real-device-evidence.mjs'
import {
  checkPlatformEvidenceCommand,
  checkRealDeviceEvidenceCommand,
  commitEvidenceFileCommands,
  defaultPlatformEvidenceChecklistPath,
  defaultPlatformEvidencePath,
  defaultRealDeviceEvidenceChecklistPath,
  defaultRealDeviceEvidencePath,
  defaultRealDeviceEvidenceSummaryPath,
  defaultReleaseCiEvidencePath,
  initialReleaseCiCommands,
  productionProfilePlatformEvidenceCommand,
  recordPlatformEvidenceCommands,
  releaseEvidenceCommand,
} from './release-handoff-commands.mjs'
import {
  collectPlatformEvidenceCommandMetadata,
  collectPlatformEvidencePassChecks,
  collectPlatformEvidenceRemainingCheckDetails,
  collectPlatformEvidenceSkippableMissingChecks,
  formatPlatformEvidenceRemainingBlock,
  readPlatformEvidenceAudit,
} from './check-platform-evidence.mjs'
import { readInitialCiEvidenceStatus } from './release-ci-evidence.mjs'
import {
  currentReleasePackageVersions,
  normalizeCommitSha,
  repoRoot,
} from './release-utils.mjs'
import {
  formatChecklistLine as checklistLine,
  formatChecklistValue as displayValue,
  formatIssueLines,
} from './markdown-checklist-utils.mjs'

function usage() {
  console.log(`Usage: node scripts/check-real-device-evidence.mjs [options]

Options:
  --path <file>       Read evidence from a specific JSON file.
  --ci-evidence <file>
                      Read initial CI evidence from a specific JSON file.
                      Default: ${defaultReleaseCiEvidencePath}
  --platform-evidence <file>
                      Read platform worksheet status from a specific JSON file.
                      Default: ${defaultPlatformEvidencePath}
  --expected-commit <sha>
                      Require evidence.commit to match the given commit.
  --summary-output <file>
                      Write machine-readable validation status JSON.
  --checklist-output <file>
                      Write a tester-facing Markdown checklist with the same
                      validation status and follow-up commands.
  --verify-runs       Query GitHub Actions and require the recorded Check and
                      Godot Smoke runs to be completed successful runs for the
                      tested release commit.
  --optional          Treat a missing evidence file as a warning.
  --help              Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    ciEvidencePath: defaultReleaseCiEvidencePath,
    evidencePath: null,
    expectedCommit: null,
    optional: false,
    platformEvidencePath: defaultPlatformEvidencePath,
    checklistOutput: null,
    summaryOutput: null,
    verifyRuns: false,
  }

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
    }

    if (arg === '--optional') {
      options.optional = true
      continue
    }

    if (arg === '--verify-runs') {
      options.verifyRuns = true
      continue
    }

    if (arg === '--summary-output') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--summary-output requires a value')
      }
      options.summaryOutput = value
      continue
    }

    if (arg.startsWith('--summary-output=')) {
      options.summaryOutput = arg.slice('--summary-output='.length)
      continue
    }

    if (arg === '--checklist-output') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--checklist-output requires a value')
      }
      options.checklistOutput = value
      continue
    }

    if (arg.startsWith('--checklist-output=')) {
      options.checklistOutput = arg.slice('--checklist-output='.length)
      continue
    }

    if (arg === '--path') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--path requires a value')
      }
      options.evidencePath = path.resolve(repoRoot, value)
      continue
    }

    if (arg.startsWith('--path=')) {
      options.evidencePath = path.resolve(repoRoot, arg.slice('--path='.length))
      continue
    }

    if (arg === '--ci-evidence') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--ci-evidence requires a value')
      }
      options.ciEvidencePath = value
      continue
    }

    if (arg.startsWith('--ci-evidence=')) {
      options.ciEvidencePath = arg.slice('--ci-evidence='.length)
      continue
    }

    if (arg === '--platform-evidence') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--platform-evidence requires a value')
      }
      options.platformEvidencePath = value
      continue
    }

    if (arg.startsWith('--platform-evidence=')) {
      options.platformEvidencePath = arg.slice('--platform-evidence='.length)
      continue
    }

    if (arg === '--expected-commit') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--expected-commit requires a value')
      }
      options.expectedCommit = normalizeCommitSha(value, '--expected-commit')
      continue
    }

    if (arg.startsWith('--expected-commit=')) {
      options.expectedCommit = normalizeCommitSha(
        arg.slice('--expected-commit='.length),
        '--expected-commit',
      )
      continue
    }

    throw new Error(`Unknown option: ${arg}`)
  }

  return options
}

function customPathCommandOptions(summary) {
  const options = {}
  if (summary.usesCustomEvidencePath) {
    options.realDeviceEvidencePath = summary.evidencePath
  }
  if (summary.usesCustomPlatformEvidencePath) {
    options.platformEvidencePath = summary.platformEvidencePath
  }
  if (summary.usesCustomCiEvidencePath) {
    options.ciEvidencePath = summary.initialCiEvidencePath
  }
  return options
}

function customPlatformEvidenceCommandOptions(summary, extra = {}) {
  return {
    ...(summary.usesCustomPlatformEvidencePath
      ? { platformEvidencePath: summary.platformEvidencePath }
      : {}),
    ...extra,
  }
}

function customCiEvidenceCommandOptions(summary) {
  return summary.usesCustomCiEvidencePath
    ? { output: summary.initialCiEvidencePath }
    : {}
}

function realDeviceEvidenceCommitCommands(summary) {
  return commitEvidenceFileCommands(
    [
      [summary.platformEvidencePath, defaultPlatformEvidencePath],
      [summary.initialCiEvidencePath, defaultReleaseCiEvidencePath],
      [summary.evidencePath, defaultRealDeviceEvidencePath],
    ],
    'Add real-device release evidence',
    { push: true },
  )
}

function outputSummary(summary) {
  return {
    ...summary,
    nextActions: collectNextActions(summary),
  }
}

function collectNextActions(summary) {
  if (summary.ready) {
    return []
  }
  const expectedCommit = summary.expectedCommit
  const pathOptions = customPathCommandOptions(summary)

  if (summary.evidencePresent === false) {
    const ciEvidenceCommands = summary.initialCiEvidenceReady
      ? []
      : initialReleaseCiCommands(
          expectedCommit,
          customCiEvidenceCommandOptions(summary),
        )
    const platformEvidence = summary.platformEvidence
    const platformEvidenceCommands = []
    if (!platformEvidence?.evidencePresent) {
      platformEvidenceCommands.push({
        id: 'create-platform-evidence',
        title: 'Create and fill Android/iOS platform evidence',
        detail:
          'Start from the platform evidence worksheet, run the selected API export checks on real or hosted devices, and record pass/skip outcomes.',
        commands: [
          productionProfilePlatformEvidenceCommand(
            expectedCommit,
            summary.usesCustomPlatformEvidencePath
              ? { output: summary.platformEvidencePath }
              : {},
          ),
        ],
      })
    } else if (!platformEvidence.ready) {
      const remaining = formatPlatformEvidenceRemainingBlock(platformEvidence)
      const platformCheckDetails =
        collectPlatformEvidenceRemainingCheckDetails(platformEvidence)
      platformEvidenceCommands.push({
        id: 'complete-platform-evidence',
        title: 'Complete Android/iOS platform evidence worksheet',
        detail: [
          'The worksheet exists; fill missing metadata and record every required check as passedChecks or skippedChecks before final evidence assembly.',
          remaining,
        ].join('\n'),
        ...(platformCheckDetails.length > 0 ? { platformCheckDetails } : {}),
        commands: [
          ...recordPlatformEvidenceCommands(
            'android',
            expectedCommit,
            customPlatformEvidenceCommandOptions(summary, {
              ...collectPlatformEvidenceCommandMetadata(
                platformEvidence,
                'android',
              ),
              checks: collectPlatformEvidencePassChecks(
                platformEvidence,
                'android',
              ),
              skipChecks: collectPlatformEvidenceSkippableMissingChecks(
                platformEvidence,
                'android',
              ),
              summaryOutput: 'release/platform-evidence-summary.json',
            }),
          ),
          ...recordPlatformEvidenceCommands(
            'ios',
            expectedCommit,
            customPlatformEvidenceCommandOptions(summary, {
              ...collectPlatformEvidenceCommandMetadata(
                platformEvidence,
                'ios',
              ),
              checks: collectPlatformEvidencePassChecks(
                platformEvidence,
                'ios',
              ),
              skipChecks: collectPlatformEvidenceSkippableMissingChecks(
                platformEvidence,
                'ios',
              ),
              summaryOutput: 'release/platform-evidence-summary.json',
            }),
          ),
          checkPlatformEvidenceCommand(expectedCommit, {
            allowOpen: true,
            ...customPlatformEvidenceCommandOptions(summary, {
              checklistOutput: defaultPlatformEvidenceChecklistPath,
              summaryOutput: 'release/platform-evidence-summary.json',
            }),
          }),
        ],
      })
    }
    const assembleDetail = summary.initialCiEvidenceReady
      ? 'After completing platform evidence, write release/real-device-evidence.json using the already validated Check/Godot Smoke CI evidence.'
      : 'After the tested release candidate has CI runs and completed platform evidence, write release/real-device-evidence.json.'

    return [
      ...platformEvidenceCommands,
      {
        id: 'assemble-real-device-evidence',
        title: 'Assemble final real-device evidence after device testing',
        detail: assembleDetail,
        commands: [
          'npm run check',
          ...ciEvidenceCommands,
          checkPlatformEvidenceCommand(
            expectedCommit,
            customPlatformEvidenceCommandOptions(summary),
          ),
          releaseEvidenceCommand(expectedCommit, pathOptions),
          checkRealDeviceEvidenceCommand(expectedCommit, {
            checklistOutput: defaultRealDeviceEvidenceChecklistPath,
            ...pathOptions,
            summaryOutput: defaultRealDeviceEvidenceSummaryPath,
            verifyRuns: true,
          }),
          ...realDeviceEvidenceCommitCommands(summary),
        ],
      },
    ]
  }

  return [
    {
      id: 'fix-real-device-evidence',
      title: 'Fix real-device evidence validation errors',
      detail:
        'Run the local check, then use the reported validation errors to update platform evidence or regenerate final evidence for the tested release commit.',
      commands: [
        'npm run check',
        checkPlatformEvidenceCommand(
          expectedCommit,
          customPlatformEvidenceCommandOptions(summary),
        ),
        releaseEvidenceCommand(expectedCommit, pathOptions),
        checkRealDeviceEvidenceCommand(expectedCommit, {
          checklistOutput: defaultRealDeviceEvidenceChecklistPath,
          ...pathOptions,
          summaryOutput: defaultRealDeviceEvidenceSummaryPath,
          verifyRuns: true,
        }),
        ...realDeviceEvidenceCommitCommands(summary),
      ],
    },
  ]
}

function platformLabel(platform) {
  if (platform === 'android') {
    return 'Android'
  }
  if (platform === 'ios') {
    return 'iOS'
  }
  return platform
}

function platformProgressLine(summary, platform) {
  const status = summary.platformEvidence?.platforms?.[platform]
  if (!status) {
    return checklistLine(
      false,
      platformLabel(platform),
      'platform worksheet status missing',
    )
  }

  const completed = status.completedCheckCount ?? 0
  const required = status.requiredCheckCount ?? 0
  const blockerCount = status.errorCount ?? 0
  return checklistLine(
    status.ready === true,
    platformLabel(platform),
    `${completed}/${required} required checks complete; ${blockerCount} blocker(s)`,
  )
}

export function formatRealDeviceEvidenceChecklist(summary) {
  const status = outputSummary(summary)
  const lines = [
    '# Real Device Evidence Checklist',
    '',
    `- Status: ${status.ready ? 'ready' : 'waiting'}`,
    `- Expected commit: ${displayValue(status.expectedCommit)}`,
    `- Real-device evidence: ${status.evidencePath}`,
    `- Platform evidence: ${status.platformEvidencePath}`,
    `- CI evidence: ${status.initialCiEvidencePath}`,
    `- Run verification requested: ${displayValue(
      status.runVerificationRequested,
    )}`,
    '',
    '## Evidence Status',
    '',
    checklistLine(
      status.evidencePresent === true,
      'Evidence file exists',
      displayValue(status.evidencePath),
    ),
    checklistLine(
      status.initialCiEvidenceReady === true,
      'Check/Godot Smoke CI evidence',
      `${displayValue(status.initialCiEvidencePath)} for ${displayValue(
        status.initialCiEvidence?.expectedCommit ?? status.expectedCommit,
      )}`,
    ),
    checklistLine(
      status.platformEvidenceReady === true,
      'Platform worksheet',
      `${displayValue(status.platformEvidencePath)} with Android/iOS production checks`,
    ),
    checklistLine(
      status.metadataReady === true,
      'Metadata',
      `${status.metadataErrors.length} blocker(s)`,
    ),
    checklistLine(
      status.androidReady === true,
      'Android evidence',
      `${status.androidErrors.length} blocker(s)`,
    ),
    checklistLine(
      status.iosReady === true,
      'iOS evidence',
      `${status.iosErrors.length} blocker(s)`,
    ),
    checklistLine(
      status.runErrors.length === 0,
      'GitHub run verification',
      `${status.runErrors.length} blocker(s)`,
    ),
    '',
    '## Platform Worksheet Progress',
    '',
    platformProgressLine(status, 'android'),
    platformProgressLine(status, 'ios'),
    '',
    '## Blocking Issues',
    '',
    ...formatIssueLines(
      'Read errors',
      status.evidencePresent ? [] : status.errors,
    ),
    ...formatIssueLines('Metadata errors', status.metadataErrors),
    ...formatIssueLines('Android errors', status.androidErrors),
    ...formatIssueLines('iOS errors', status.iosErrors),
    ...formatIssueLines('Run verification errors', status.runErrors),
    '',
    '## Next Actions',
    '',
  ]

  if (status.nextActions.length === 0) {
    lines.push('- none')
  } else {
    for (const action of status.nextActions) {
      lines.push(`### ${action.title ?? action.id ?? 'Action'}`, '')
      if (typeof action.detail === 'string' && action.detail.trim()) {
        lines.push(action.detail.trim(), '')
      }
      lines.push('```bash', ...action.commands, '```', '')
    }
  }

  return `${lines.join('\n')}\n`
}

function writeSummary(options, summary) {
  if (!options.summaryOutput && !options.checklistOutput) {
    return
  }

  const output = outputSummary(summary)
  if (options.summaryOutput) {
    const resolved = path.resolve(repoRoot, options.summaryOutput)
    fs.mkdirSync(path.dirname(resolved), { recursive: true })
    fs.writeFileSync(resolved, `${JSON.stringify(output, null, 2)}\n`)
    console.log(
      `[real-device-evidence] wrote ${path.relative(repoRoot, resolved)}`,
    )
  }
  if (options.checklistOutput) {
    const resolved = path.resolve(repoRoot, options.checklistOutput)
    fs.mkdirSync(path.dirname(resolved), { recursive: true })
    fs.writeFileSync(resolved, formatRealDeviceEvidenceChecklist(summary))
    console.log(
      `[real-device-evidence] wrote ${path.relative(repoRoot, resolved)}`,
    )
  }
}

export async function buildRealDeviceEvidenceSummary(
  options,
  verifyRuns = verifyRealDeviceEvidenceRuns,
) {
  const evidencePath = options.evidencePath ?? resolveRealDeviceEvidencePath()
  const { evidence, errors: readErrors } = readRealDeviceEvidence(evidencePath)
  const summary = {
    androidErrors: [],
    androidReady: false,
    evidencePath: describeRealDeviceEvidencePath(evidencePath),
    evidencePresent: Boolean(evidence),
    expectedCommit: options.expectedCommit ?? null,
    iosErrors: [],
    iosReady: false,
    initialCiEvidence: null,
    initialCiEvidencePath: options.ciEvidencePath,
    initialCiEvidenceReady: false,
    metadataErrors: [],
    metadataReady: false,
    optional: options.optional,
    platformEvidence: null,
    platformEvidencePath: options.platformEvidencePath,
    platformEvidenceReady: false,
    ready: false,
    runErrors: [],
    runVerificationRequested: options.verifyRuns,
    usesCustomCiEvidencePath:
      options.ciEvidencePath !== defaultReleaseCiEvidencePath,
    usesCustomEvidencePath: options.evidencePath !== null,
    usesCustomPlatformEvidencePath:
      options.platformEvidencePath !== defaultPlatformEvidencePath,
    errorCount: 0,
    errors: [],
  }
  const initialCiEvidence = readInitialCiEvidenceStatus(
    options.ciEvidencePath,
    summary.expectedCommit,
  )
  summary.initialCiEvidence = initialCiEvidence
  summary.initialCiEvidencePath = initialCiEvidence.path
  summary.initialCiEvidenceReady = initialCiEvidence.ready
  summary.platformEvidence = readPlatformEvidenceAudit(options.platformEvidencePath)
  summary.platformEvidenceReady = summary.platformEvidence.ready

  if (!evidence) {
    summary.errors = [...readErrors]
    summary.errorCount = summary.errors.length
    return summary
  }

  const metadataErrors = validateRealDeviceEvidenceMetadata(evidence, {
    expectedCommit: options.expectedCommit,
    expectedPackageVersions: currentReleasePackageVersions(),
  })
  const androidErrors = validateRealDevicePlatformEvidence(
    evidence,
    'android',
    {
      requireProductionProfile: true,
    },
  )
  const iosErrors = validateRealDevicePlatformEvidence(evidence, 'ios', {
    requireProductionProfile: true,
  })
  const errors = [...metadataErrors, ...androidErrors, ...iosErrors]
  summary.metadataErrors = metadataErrors
  summary.androidErrors = androidErrors
  summary.iosErrors = iosErrors
  summary.metadataReady = metadataErrors.length === 0
  summary.androidReady = summary.metadataReady && androidErrors.length === 0
  summary.iosReady = summary.metadataReady && iosErrors.length === 0

  if (errors.length > 0) {
    summary.errors = [...errors]
    summary.errorCount = errors.length
    return summary
  }

  if (options.verifyRuns) {
    const runErrors = await verifyRuns(evidence)
    if (runErrors.length > 0) {
      summary.runErrors = runErrors
      summary.errors = [...runErrors]
      summary.errorCount = runErrors.length
      return summary
    }
  }

  summary.ready = true
  return summary
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const evidencePath = options.evidencePath ?? resolveRealDeviceEvidencePath()
  const summary = await buildRealDeviceEvidenceSummary(options)
  writeSummary(options, summary)
  if (!summary.ready) {
    const message = summary.errors.join('\n')
    if (!summary.evidencePresent && options.optional) {
      console.warn(`[real-device-evidence] warning: ${message}`)
      return
    }
    throw new Error(message)
  }

  console.log(
    `[real-device-evidence] passed ${describeRealDeviceEvidencePath(evidencePath)}`,
  )
}

const entryPoint = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (import.meta.url === entryPoint) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
}
