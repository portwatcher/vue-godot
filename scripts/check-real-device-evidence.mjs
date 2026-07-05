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
  defaultPlatformEvidencePath,
  defaultReleaseCiEvidencePath,
  initialReleaseCiCommands,
  productionProfilePlatformEvidenceCommand,
  releaseEvidenceCommand,
} from './release-handoff-commands.mjs'
import {
  formatPlatformEvidenceProgress,
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
    evidencePath: null,
    expectedCommit: null,
    optional: false,
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

function collectNextActions(summary) {
  if (summary.ready) {
    return []
  }
  const expectedCommit = summary.expectedCommit

  if (summary.evidencePresent === false) {
    const ciEvidenceCommands = summary.initialCiEvidenceReady
      ? []
      : initialReleaseCiCommands(expectedCommit)
    const platformEvidence = summary.platformEvidence
    const platformEvidenceCommands = []
    if (!platformEvidence?.evidencePresent) {
      platformEvidenceCommands.push({
        id: 'create-platform-evidence',
        title: 'Create and fill Android/iOS platform evidence',
        detail:
          'Start from the platform evidence worksheet, run the selected API export checks on real or hosted devices, and record pass/skip outcomes.',
        commands: [productionProfilePlatformEvidenceCommand(expectedCommit)],
      })
    } else if (!platformEvidence.ready) {
      const progress = formatPlatformEvidenceProgress(platformEvidence)
      platformEvidenceCommands.push({
        id: 'complete-platform-evidence',
        title: 'Complete Android/iOS platform evidence worksheet',
        detail: [
          'The worksheet exists; fill missing metadata and record every required check as passedChecks or skippedChecks before final evidence assembly.',
          progress,
        ].join(' '),
        commands: [
          checkPlatformEvidenceCommand(expectedCommit, {
            allowOpen: true,
            summaryOutput: 'release/platform-evidence-summary.json',
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
          checkPlatformEvidenceCommand(expectedCommit),
          releaseEvidenceCommand(expectedCommit),
          checkRealDeviceEvidenceCommand(expectedCommit),
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
        checkPlatformEvidenceCommand(expectedCommit),
        releaseEvidenceCommand(expectedCommit),
        checkRealDeviceEvidenceCommand(expectedCommit),
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
    initialCiEvidencePath: defaultReleaseCiEvidencePath,
    initialCiEvidenceReady: false,
    optional: options.optional,
    platformEvidence: null,
    platformEvidencePath: defaultPlatformEvidencePath,
    platformEvidenceReady: false,
    ready: false,
    errorCount: 0,
    errors: [],
  }
  const initialCiEvidence = readInitialCiEvidenceStatus(
    defaultReleaseCiEvidencePath,
    summary.expectedCommit,
  )
  summary.initialCiEvidence = initialCiEvidence
  summary.initialCiEvidenceReady = initialCiEvidence.ready
  summary.platformEvidence = readPlatformEvidenceAudit(defaultPlatformEvidencePath)
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
