import fs from 'node:fs'
import path from 'node:path'
import {
  describeRealDeviceEvidencePath,
  readRealDeviceEvidence,
  resolveRealDeviceEvidencePath,
  validateRealDeviceEvidence,
} from './real-device-evidence.mjs'
import {
  checkPlatformEvidenceCommand,
  checkRealDeviceEvidenceCommand,
  commitEvidenceFileCommands,
  defaultPlatformEvidencePath,
  defaultRealDeviceEvidencePath,
  defaultReleaseCiEvidencePath,
  initialReleaseCiCommands,
  productionProfilePlatformEvidenceCommand,
  recordPlatformEvidenceCommand,
  releaseEvidenceCommand,
} from './release-handoff-commands.mjs'
import {
  collectPlatformEvidenceRemainingCheckDetails,
  collectPlatformEvidenceSkippableMissingChecks,
  formatPlatformEvidenceProgress,
  formatPlatformEvidenceRemaining,
  readPlatformEvidenceAudit,
} from './check-platform-evidence.mjs'
import { readInitialCiEvidenceStatus } from './release-ci-evidence.mjs'
import {
  currentReleasePackageVersions,
  normalizeCommitSha,
  repoRoot,
} from './release-utils.mjs'

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
    summaryOutput: null,
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
      const progress = formatPlatformEvidenceProgress(platformEvidence)
      const remaining = formatPlatformEvidenceRemaining(platformEvidence).join(
        ' ',
      )
      const platformCheckDetails =
        collectPlatformEvidenceRemainingCheckDetails(platformEvidence)
      platformEvidenceCommands.push({
        id: 'complete-platform-evidence',
        title: 'Complete Android/iOS platform evidence worksheet',
        detail: [
          'The worksheet exists; fill missing metadata and record every required check as passedChecks or skippedChecks before final evidence assembly.',
          progress,
          remaining,
        ].join(' '),
        ...(platformCheckDetails.length > 0 ? { platformCheckDetails } : {}),
        commands: [
          recordPlatformEvidenceCommand(
            'android',
            expectedCommit,
            customPlatformEvidenceCommandOptions(summary, {
              skipChecks: collectPlatformEvidenceSkippableMissingChecks(
                platformEvidence,
                'android',
              ),
              summaryOutput: 'release/platform-evidence-summary.json',
            }),
          ),
          recordPlatformEvidenceCommand(
            'ios',
            expectedCommit,
            customPlatformEvidenceCommandOptions(summary, {
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
          checkRealDeviceEvidenceCommand(expectedCommit, pathOptions),
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
        checkRealDeviceEvidenceCommand(expectedCommit, pathOptions),
        ...realDeviceEvidenceCommitCommands(summary),
      ],
    },
  ]
}

function writeSummary(options, summary) {
  if (!options.summaryOutput) {
    return
  }

  const resolved = path.resolve(repoRoot, options.summaryOutput)
  const output = {
    ...summary,
    nextActions: collectNextActions(summary),
  }
  fs.mkdirSync(path.dirname(resolved), { recursive: true })
  fs.writeFileSync(resolved, `${JSON.stringify(output, null, 2)}\n`)
  console.log(`[real-device-evidence] wrote ${path.relative(repoRoot, resolved)}`)
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const evidencePath = options.evidencePath ?? resolveRealDeviceEvidencePath()
  const { evidence, errors: readErrors } = readRealDeviceEvidence(evidencePath)
  const summary = {
    evidencePath: describeRealDeviceEvidencePath(evidencePath),
    evidencePresent: Boolean(evidence),
    expectedCommit: options.expectedCommit ?? null,
    initialCiEvidence: null,
    initialCiEvidencePath: options.ciEvidencePath,
    initialCiEvidenceReady: false,
    optional: options.optional,
    platformEvidence: null,
    platformEvidencePath: options.platformEvidencePath,
    platformEvidenceReady: false,
    ready: false,
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
    const message = readErrors.join('\n')
    summary.errors = [...readErrors]
    summary.errorCount = summary.errors.length
    writeSummary(options, summary)
    if (options.optional) {
      console.warn(`[real-device-evidence] warning: ${message}`)
      return
    }
    throw new Error(message)
  }

  const errors = validateRealDeviceEvidence(evidence, {
    expectedCommit: options.expectedCommit,
    expectedPackageVersions: currentReleasePackageVersions(),
    requireProductionProfile: true,
  })

  if (errors.length > 0) {
    summary.errors = [...errors]
    summary.errorCount = errors.length
    writeSummary(options, summary)
    throw new Error(errors.join('\n'))
  }

  summary.ready = true
  writeSummary(options, summary)
  console.log(
    `[real-device-evidence] passed ${describeRealDeviceEvidencePath(evidencePath)}`,
  )
}

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
