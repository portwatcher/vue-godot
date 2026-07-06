import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  missingProductionProfileSelectedApis,
  passOnlyRealDeviceChecks,
  realDeviceWorksheetFields,
  requiredRealDeviceChecks,
  selectedApiRequiredCheckMap,
  unknownRealDeviceSelectedApis,
} from './real-device-evidence.mjs'
import {
  checkPlatformEvidenceCommand,
  checkRealDeviceEvidenceCommand,
  defaultPlatformEvidencePath,
  recordPlatformEvidenceCommand,
  releaseEvidenceCommand,
  productionProfilePlatformEvidenceCommand,
} from './release-handoff-commands.mjs'
import { isRecord } from './release-evidence-utils.mjs'
import { normalizeCommitSha, repoRoot } from './release-utils.mjs'

function usage() {
  console.log(`Usage: node scripts/check-platform-evidence.mjs [options]

Audits release/platform-evidence.json before final real-device evidence is
assembled. This checks the Android/iOS worksheet fields, required check names,
production-profile selected APIs, pass-only checks, selected-API checks, and
missing device-test outcomes.

Options:
  --platform-evidence <file>       Worksheet path. Default: ${defaultPlatformEvidencePath}
  --summary-output <file>          Write machine-readable audit JSON.
  --expected-commit <sha>          Full tested release-candidate commit SHA for
                                  generated nextActions command hints.
  --allow-open                     Exit 0 while worksheet gaps remain.
  --allow-non-production-profile   Do not require the maintained production
                                  selected API set.
  --help                           Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    allowNonProductionProfile: false,
    allowOpen: false,
    expectedCommit: null,
    platformEvidencePath: defaultPlatformEvidencePath,
    summaryOutput: null,
  }

  const valueOptions = [
    ['--expected-commit', 'expectedCommit'],
    ['--platform-evidence', 'platformEvidencePath'],
    ['--summary-output', 'summaryOutput'],
  ]

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
    }

    if (arg === '--allow-open') {
      options.allowOpen = true
      continue
    }

    if (arg === '--allow-non-production-profile') {
      options.allowNonProductionProfile = true
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

  return options
}

function describePath(filePath) {
  return path.relative(repoRoot, filePath) || filePath
}

function readWorksheet(filePath) {
  if (!fs.existsSync(filePath)) {
    return {
      evidence: null,
      errors: [`Platform evidence worksheet not found: ${filePath}`],
    }
  }

  try {
    return {
      evidence: JSON.parse(fs.readFileSync(filePath, 'utf-8')),
      errors: [],
    }
  } catch (error) {
    return {
      evidence: null,
      errors: [
        `Platform evidence worksheet is not valid JSON: ${
          error instanceof Error ? error.message : String(error)
        }`,
      ],
    }
  }
}

function uniqueStrings(values) {
  return [
    ...new Set(
      values
        .filter((value) => typeof value === 'string')
        .map((value) => value.trim())
        .filter((value) => value.length > 0),
    ),
  ]
}

function duplicateStrings(values) {
  if (!Array.isArray(values)) {
    return []
  }

  const seen = new Set()
  const duplicates = new Set()
  for (const value of values) {
    if (typeof value !== 'string') {
      continue
    }
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      continue
    }
    if (seen.has(trimmed)) {
      duplicates.add(trimmed)
    }
    seen.add(trimmed)
  }
  return [...duplicates]
}

function checkStringArray(record, key, label, errors) {
  const value = record[key]
  if (!Array.isArray(value)) {
    errors.push(`${label}.${key} must be a string array`)
    return []
  }

  const invalid = value.filter(
    (item) => typeof item !== 'string' || item.trim().length === 0,
  )
  if (invalid.length > 0) {
    errors.push(`${label}.${key} must contain only non-empty strings`)
  }

  return uniqueStrings(value)
}

function checkRequiredString(record, key, label, errors) {
  if (typeof record[key] !== 'string' || record[key].trim().length === 0) {
    errors.push(`${label}.${key} must be a non-empty string`)
    return key
  }
  return null
}

function missingExpectedValues(actual, expected) {
  const actualSet = new Set(actual)
  return expected.filter((value) => !actualSet.has(value))
}

function extraValues(actual, expected) {
  const expectedSet = new Set(expected)
  return actual.filter((value) => !expectedSet.has(value))
}

function checkWorksheetArrayField(record, key, expected, label, errors) {
  const actual = checkStringArray(record, key, label, errors)
  const missing = missingExpectedValues(actual, expected)
  const extra = extraValues(actual, expected)
  if (missing.length > 0) {
    errors.push(`${label}.${key} is missing ${missing.join(', ')}`)
  }
  if (extra.length > 0) {
    errors.push(`${label}.${key} contains unexpected ${extra.join(', ')}`)
  }
  return actual
}

function selectedApiRequiredChecksObject(selectedApis, platform) {
  return Object.fromEntries(selectedApiRequiredCheckMap(selectedApis, platform))
}

function checkSelectedApiRequiredChecks(record, selectedApis, platform, errors) {
  const label = `${platform}.selectedApiRequiredChecks`
  const expected = selectedApiRequiredChecksObject(selectedApis, platform)
  const actual = record.selectedApiRequiredChecks

  if (!isRecord(actual)) {
    errors.push(`${label} must be an object generated from selectedApis`)
    return {
      actual: {},
      expected,
    }
  }

  for (const [check, apiNames] of Object.entries(expected)) {
    const actualApiNames = Array.isArray(actual[check])
      ? uniqueStrings(actual[check])
      : []
    const missing = missingExpectedValues(actualApiNames, apiNames)
    const extra = extraValues(actualApiNames, apiNames)

    if (!Array.isArray(actual[check])) {
      errors.push(`${label}.${check} must be a string array`)
      continue
    }
    if (missing.length > 0) {
      errors.push(`${label}.${check} is missing ${missing.join(', ')}`)
    }
    if (extra.length > 0) {
      errors.push(`${label}.${check} contains unexpected ${extra.join(', ')}`)
    }
  }

  for (const check of Object.keys(actual)) {
    if (!(check in expected)) {
      errors.push(`${label} contains unexpected ${check}`)
    }
  }

  return {
    actual,
    expected,
  }
}

function checkSkippedChecks(record, platform, errors) {
  const skippedChecks = isRecord(record.skippedChecks)
    ? record.skippedChecks
    : null

  if (!skippedChecks) {
    errors.push(`${platform}.skippedChecks must be an object`)
    return {
      invalidSkippedChecks: [],
      skippedCheckNames: [],
    }
  }

  const invalidSkippedChecks = []
  const skippedCheckNames = Object.keys(skippedChecks)
  for (const check of skippedCheckNames) {
    const reason = skippedChecks[check]
    if (typeof reason !== 'string' || reason.trim().length === 0) {
      invalidSkippedChecks.push(check)
      errors.push(
        `${platform}.skippedChecks.${check} must be a non-empty release-specific reason`,
      )
    }
  }

  return {
    invalidSkippedChecks,
    skippedCheckNames,
  }
}

function auditPlatformWorksheet(record, platform, options = {}) {
  const errors = []
  const requiredChecks = requiredRealDeviceChecks[platform]
  const passOnlyChecks = passOnlyRealDeviceChecks[platform]
  const status = {
    completedCheckCount: 0,
    completedChecks: [],
    duplicatePassedChecks: [],
    errorCount: 0,
    errors,
    missingFields: [],
    missingProductionProfileApis: [],
    mustPassChecks: [],
    mustPassMissingChecks: [],
    passedChecks: [],
    ready: false,
    remainingChecks: [],
    requiredCheckCount: requiredChecks.length,
    requiredChecks: [...requiredChecks],
    selectedApiRequiredChecks: {},
    selectedApiRequiredMissingChecks: [],
    selectedApis: [],
    skippedCheckNames: [],
    skippableMissingChecks: [],
    unknownPassedChecks: [],
    unknownSelectedApis: [],
    unknownSkippedChecks: [],
    worksheetErrors: [],
  }

  if (!isRecord(record)) {
    errors.push(`${platform} evidence must be an object`)
    status.errorCount = errors.length
    return status
  }

  for (const key of [
    'artifact',
    'exportPreset',
    'deviceModel',
    'osVersion',
    'orientation',
    'locale',
  ]) {
    const missingField = checkRequiredString(record, key, platform, errors)
    if (missingField) {
      status.missingFields.push(missingField)
    }
  }

  status.selectedApis = checkStringArray(record, 'selectedApis', platform, errors)
  status.unknownSelectedApis = unknownRealDeviceSelectedApis(status.selectedApis)
  for (const apiName of status.unknownSelectedApis) {
    errors.push(`${platform}.selectedApis contains unknown API ${apiName}`)
  }

  if (!options.allowNonProductionProfile) {
    status.missingProductionProfileApis =
      missingProductionProfileSelectedApis(status.selectedApis)
    if (status.missingProductionProfileApis.length > 0) {
      errors.push(
        `${platform}.selectedApis must include production profile API(s): ${status.missingProductionProfileApis.join(', ')}`,
      )
    }
  }

  const worksheetErrors = []
  checkWorksheetArrayField(
    record,
    'requiredChecks',
    requiredChecks,
    platform,
    worksheetErrors,
  )
  checkWorksheetArrayField(
    record,
    'passOnlyChecks',
    passOnlyChecks,
    platform,
    worksheetErrors,
  )
  const selectedApiWorksheet = checkSelectedApiRequiredChecks(
    record,
    status.selectedApis,
    platform,
    worksheetErrors,
  )
  status.selectedApiRequiredChecks = selectedApiWorksheet.expected
  status.worksheetErrors = worksheetErrors
  errors.push(...worksheetErrors)

  status.passedChecks = checkStringArray(record, 'passedChecks', platform, errors)
  status.duplicatePassedChecks = duplicateStrings(record.passedChecks ?? [])
  for (const check of status.duplicatePassedChecks) {
    errors.push(`${platform}.passedChecks contains duplicate ${check}`)
  }

  const skipped = checkSkippedChecks(record, platform, errors)
  status.skippedCheckNames = skipped.skippedCheckNames

  status.unknownPassedChecks = extraValues(status.passedChecks, requiredChecks)
  status.unknownSkippedChecks = extraValues(
    status.skippedCheckNames,
    requiredChecks,
  )
  for (const check of status.unknownPassedChecks) {
    errors.push(`${platform}.passedChecks contains unknown check ${check}`)
  }
  for (const check of status.unknownSkippedChecks) {
    errors.push(`${platform}.skippedChecks contains unknown check ${check}`)
  }

  const passedSet = new Set(status.passedChecks)
  const skippedSet = new Set(
    status.skippedCheckNames.filter(
      (check) => !skipped.invalidSkippedChecks.includes(check),
    ),
  )
  const selectedApiMustPassChecks = Object.keys(status.selectedApiRequiredChecks)
  status.mustPassChecks = uniqueStrings([
    ...passOnlyChecks,
    ...selectedApiMustPassChecks,
  ])
  const mustPassSet = new Set(status.mustPassChecks)

  for (const check of requiredChecks) {
    if (passedSet.has(check) || skippedSet.has(check)) {
      status.completedChecks.push(check)
    } else {
      status.remainingChecks.push(check)
      errors.push(
        `${platform}.${check} must be recorded in passedChecks or skippedChecks`,
      )
    }

    if (!passedSet.has(check) && mustPassSet.has(check)) {
      status.mustPassMissingChecks.push(check)
    }
  }

  for (const check of passOnlyChecks) {
    if (!passedSet.has(check)) {
      errors.push(`${platform}.${check} must be in passedChecks`)
    }
  }

  for (const [check, apiNames] of Object.entries(
    status.selectedApiRequiredChecks,
  )) {
    if (!passedSet.has(check)) {
      status.selectedApiRequiredMissingChecks.push(check)
      errors.push(
        `${platform}.${check} must be in passedChecks because selectedApis includes ${apiNames.join(', ')}`,
      )
    }
  }

  status.skippableMissingChecks = status.remainingChecks.filter(
    (check) => !mustPassSet.has(check),
  )
  status.completedCheckCount = status.completedChecks.length
  status.errorCount = errors.length
  status.ready = errors.length === 0
  return status
}

function worksheetProgress(status) {
  if (!status) {
    return null
  }

  return {
    ready: status.ready,
    selectedApiCount: status.selectedApis.length,
    missingFieldCount: status.missingFields.length,
    completedCheckCount: status.completedCheckCount,
    requiredCheckCount: status.requiredCheckCount,
    remainingCheckCount: status.remainingChecks.length,
    mustPassMissingCheckCount: status.mustPassMissingChecks.length,
    skippableMissingCheckCount: status.skippableMissingChecks.length,
  }
}

function formatPlatformLabel(platform) {
  return platform === 'ios' ? 'iOS' : 'Android'
}

function formatProgressPart(platform, status) {
  if (!status) {
    return `${formatPlatformLabel(platform)}: worksheet missing`
  }

  if (status.ready) {
    return `${formatPlatformLabel(platform)}: ready`
  }

  return [
    `${formatPlatformLabel(platform)}: ${status.missingFields.length} metadata field(s) missing`,
    `${status.remainingChecks.length}/${status.requiredCheckCount} required check(s) unresolved`,
    `${status.mustPassMissingChecks.length} must-pass check(s) missing`,
  ].join(', ')
}

export function formatPlatformEvidenceProgress(summary) {
  if (!isRecord(summary?.platforms)) {
    return 'Platform worksheet status is unavailable.'
  }

  return ['android', 'ios']
    .map((platform) => formatProgressPart(platform, summary.platforms[platform]))
    .join('; ')
}

export function auditPlatformEvidence(evidence, options = {}) {
  const errors = []
  const summary = {
    errorCount: 0,
    errors,
    evidencePresent: Boolean(evidence),
    platforms: {
      android: null,
      ios: null,
    },
    progress: {
      android: null,
      ios: null,
    },
    ready: false,
  }

  if (!isRecord(evidence)) {
    errors.push('Platform evidence worksheet must be a JSON object')
    summary.errorCount = errors.length
    return summary
  }

  for (const field of realDeviceWorksheetFields) {
    if (field in evidence) {
      errors.push(
        `top-level ${field} is not valid; worksheet fields belong under android and ios`,
      )
    }
  }

  summary.platforms.android = auditPlatformWorksheet(
    evidence.android,
    'android',
    options,
  )
  summary.platforms.ios = auditPlatformWorksheet(evidence.ios, 'ios', options)
  errors.push(
    ...summary.platforms.android.errors,
    ...summary.platforms.ios.errors,
  )

  summary.errorCount = errors.length
  summary.ready = errors.length === 0
  summary.progress = {
    android: worksheetProgress(summary.platforms.android),
    ios: worksheetProgress(summary.platforms.ios),
  }
  return summary
}

export function readPlatformEvidenceAudit(
  platformEvidencePath = defaultPlatformEvidencePath,
  options = {},
) {
  const resolved = path.resolve(repoRoot, platformEvidencePath)
  const { evidence, errors: readErrors } = readWorksheet(resolved)
  const summary = auditPlatformEvidence(evidence, {
    allowNonProductionProfile: options.allowNonProductionProfile,
  })
  summary.path = describePath(resolved)
  summary.readErrors = readErrors
  summary.errorCount += readErrors.length
  summary.errors.push(...readErrors)
  summary.ready = summary.ready && readErrors.length === 0
  return summary
}

function collectNextActions(summary, options) {
  const commit = options.expectedCommit
  const actions = []
  if (!summary.evidencePresent) {
    actions.push({
      id: 'create-platform-evidence',
      title: 'Create the Android/iOS platform evidence worksheet',
      detail:
        'Generate the maintained production-profile worksheet before device testing.',
      commands: [productionProfilePlatformEvidenceCommand(commit)],
    })
    return actions
  }

  if (!summary.ready) {
    const progress = formatPlatformEvidenceProgress(summary)
    actions.push({
      id: 'complete-platform-evidence',
      title: 'Finish Android and iOS worksheet evidence',
      detail: [
        'Fill missing metadata and record every required check as passedChecks or skippedChecks.',
        'passOnlyChecks and selectedApiRequiredChecks must be in passedChecks.',
        progress,
      ].join(' '),
      commands: [
        recordPlatformEvidenceCommand('android', commit, {
          platformEvidencePath: options.platformEvidencePath,
          summaryOutput: options.summaryOutput ?? 'release/platform-evidence-summary.json',
        }),
        recordPlatformEvidenceCommand('ios', commit, {
          platformEvidencePath: options.platformEvidencePath,
          summaryOutput: options.summaryOutput ?? 'release/platform-evidence-summary.json',
        }),
        checkPlatformEvidenceCommand(commit, {
          allowOpen: true,
          platformEvidencePath: options.platformEvidencePath,
          summaryOutput: options.summaryOutput ?? 'release/platform-evidence-summary.json',
        }),
      ],
    })
    return actions
  }

  actions.push({
    id: 'assemble-real-device-evidence',
    title: 'Assemble final real-device evidence',
    detail:
      'The worksheet is complete enough to normalize into release/real-device-evidence.json.',
    commands: [
      'npm run check',
      releaseEvidenceCommand(commit, {
        platformEvidencePath: options.platformEvidencePath,
      }),
      checkRealDeviceEvidenceCommand(commit),
    ],
  })
  return actions
}

function writeSummary(outputPath, summary) {
  if (!outputPath) {
    return
  }

  const resolved = path.resolve(repoRoot, outputPath)
  fs.mkdirSync(path.dirname(resolved), { recursive: true })
  fs.writeFileSync(resolved, `${JSON.stringify(summary, null, 2)}\n`)
  console.log(`[platform-evidence] wrote ${describePath(resolved)}`)
}

function printBlockers(summary) {
  if (summary.ready) {
    console.log('[platform-evidence] ready')
    return
  }

  console.log('[platform-evidence] blockers')
  for (const error of summary.errors) {
    console.log(`- ${error}`)
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const summary = readPlatformEvidenceAudit(options.platformEvidencePath, {
    allowNonProductionProfile: options.allowNonProductionProfile,
  })
  summary.nextActions = collectNextActions(summary, {
    expectedCommit: options.expectedCommit,
    platformEvidencePath: options.platformEvidencePath,
    summaryOutput: options.summaryOutput,
  })

  writeSummary(options.summaryOutput, summary)
  printBlockers(summary)

  if (!summary.ready) {
    if (options.allowOpen) {
      console.log('[platform-evidence] open gates remain (--allow-open)')
      return
    }
    process.exit(1)
  }
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
