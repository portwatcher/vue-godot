import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  auditPlatformEvidence,
  collectPlatformEvidenceNextActions,
  formatPlatformEvidenceProgress,
  formatPlatformEvidenceRemaining,
} from './check-platform-evidence.mjs'
import { isRecord } from './release-evidence-utils.mjs'
import { defaultPlatformEvidencePath } from './release-handoff-commands.mjs'
import {
  describeRealDeviceCheck,
  isReleaseEvidencePlaceholder,
  passOnlyRealDeviceChecks,
  requiredRealDeviceChecks,
  selectedApiRequiredCheckMap,
  unknownRealDeviceSelectedApis,
} from './real-device-evidence.mjs'
import { normalizeCommitSha, repoRoot, uniqueStrings } from './release-utils.mjs'

const platforms = ['android', 'ios']

function usage() {
  console.log(`Usage: node scripts/record-platform-evidence.mjs [options]

Records one Android or iOS real-device test result batch into the platform
evidence worksheet. This is an incremental helper; it does not make evidence
release-ready unless every required field and check has actually been recorded.

Options:
  --platform <android|ios>         Platform to update. Required.
  --platform-evidence <file>       Worksheet path. Default: ${defaultPlatformEvidencePath}
  --artifact <name>                APK/AAB, archive, TestFlight, or hosted build id.
  --export-preset <name>           Godot export preset tested.
  --device <model>                 Tested device model.
  --os <version>                   Tested OS version.
  --orientation <value>            Tested orientation coverage.
  --locale <value>                 Tested locale.
  --pass <check[,check...]>        Record required check(s) in passedChecks.
  --pass-remaining                 Record every remaining must-pass check in
                                  passedChecks. Skippable checks still need
                                  --pass or --skip.
  --pass-remaining-confirmation <note>
                                  Required with --pass-remaining. Use a
                                  release-specific note confirming the
                                  remaining must-pass checks passed on the
                                  tested device or hosted device run.
  --passed-check <check[,check...]> Alias for --pass.
  --skip <check=reason>            Record a skippable required check with reason.
                                  Can be repeated. ":" is also accepted.
  --list-checks                    Print valid check names, descriptions, and
                                  current worksheet outcome state without
                                  modifying the worksheet. With --platform,
                                  only prints that platform; otherwise prints
                                  both Android and iOS.
  --summary-output <file>          Write machine-readable audit JSON after update.
  --expected-commit <sha>          Full tested release-candidate commit SHA for
                                  summary metadata.
  --dry-run                        Print/write summary without modifying worksheet.
  --help                           Show this help.
`)
}

function addCsv(values, value) {
  for (const part of value.split(',')) {
    const trimmed = part.trim()
    if (trimmed.length > 0) {
      values.push(trimmed)
    }
  }
}

function parseSkipSpec(value) {
  const equalsIndex = value.indexOf('=')
  const colonIndex = value.indexOf(':')
  const separatorIndex =
    equalsIndex === -1
      ? colonIndex
      : colonIndex === -1
        ? equalsIndex
        : Math.min(equalsIndex, colonIndex)

  if (separatorIndex === -1) {
    throw new Error('--skip requires check=reason')
  }

  const check = value.slice(0, separatorIndex).trim()
  const reason = value.slice(separatorIndex + 1).trim()
  if (check.length === 0 || reason.length === 0) {
    throw new Error('--skip requires a non-empty check and reason')
  }
  if (isReleaseEvidencePlaceholder(reason)) {
    throw new Error(`--skip ${check} requires a real reason, not ${reason}`)
  }
  return [check, reason]
}

function parseArgs(argv) {
  const options = {
    dryRun: false,
    expectedCommit: null,
    listChecks: false,
    platform: null,
    platformEvidencePath: defaultPlatformEvidencePath,
    summaryOutput: null,
    updates: {},
    passedChecks: [],
    passRemaining: false,
    passRemainingConfirmation: null,
    skippedChecks: {},
  }

  const valueOptions = [
    ['--platform', 'platform'],
    ['--platform-evidence', 'platformEvidencePath'],
    ['--summary-output', 'summaryOutput'],
    ['--expected-commit', 'expectedCommit'],
    ['--artifact', 'artifact'],
    ['--export-preset', 'exportPreset'],
    ['--device', 'deviceModel'],
    ['--os', 'osVersion'],
    ['--orientation', 'orientation'],
    ['--locale', 'locale'],
  ]

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
    }

    if (arg === '--dry-run') {
      options.dryRun = true
      continue
    }

    if (arg === '--list-checks') {
      options.listChecks = true
      continue
    }

    if (arg === '--pass-remaining') {
      options.passRemaining = true
      continue
    }

    if (arg === '--pass-remaining-confirmation') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--pass-remaining-confirmation requires a value')
      }
      options.passRemainingConfirmation = value
      continue
    }

    if (arg.startsWith('--pass-remaining-confirmation=')) {
      options.passRemainingConfirmation = arg.slice(
        '--pass-remaining-confirmation='.length,
      )
      continue
    }

    if (arg === '--pass' || arg === '--passed-check') {
      const value = argv[++index]
      if (!value) {
        throw new Error(`${arg} requires a value`)
      }
      addCsv(options.passedChecks, value)
      continue
    }

    if (arg.startsWith('--pass=')) {
      addCsv(options.passedChecks, arg.slice('--pass='.length))
      continue
    }

    if (arg.startsWith('--passed-check=')) {
      addCsv(options.passedChecks, arg.slice('--passed-check='.length))
      continue
    }

    if (arg === '--skip' || arg === '--skipped-check') {
      const value = argv[++index]
      if (!value) {
        throw new Error(`${arg} requires a value`)
      }
      const [check, reason] = parseSkipSpec(value)
      options.skippedChecks[check] = reason
      continue
    }

    if (arg.startsWith('--skip=')) {
      const [check, reason] = parseSkipSpec(arg.slice('--skip='.length))
      options.skippedChecks[check] = reason
      continue
    }

    if (arg.startsWith('--skipped-check=')) {
      const [check, reason] = parseSkipSpec(
        arg.slice('--skipped-check='.length),
      )
      options.skippedChecks[check] = reason
      continue
    }

    let handled = false
    for (const [name, key] of valueOptions) {
      if (arg === name) {
        const value = argv[++index]
        if (!value) {
          throw new Error(`${name} requires a value`)
        }
        if (key in options) {
          options[key] = value
        } else {
          options.updates[key] = value
        }
        handled = true
        break
      }

      if (arg.startsWith(`${name}=`)) {
        const value = arg.slice(name.length + 1)
        if (key in options) {
          options[key] = value
        } else {
          options.updates[key] = value
        }
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

  if (options.platform !== null && !platforms.includes(options.platform)) {
    throw new Error('--platform must be android or ios')
  }

  const hasUpdates =
    Object.keys(options.updates).length > 0 ||
    options.passedChecks.length > 0 ||
    options.passRemaining ||
    Object.keys(options.skippedChecks).length > 0

  if (options.listChecks) {
    if (hasUpdates || options.passRemainingConfirmation !== null) {
      throw new Error(
        '--list-checks cannot be combined with metadata, --pass, --pass-remaining, or --skip updates',
      )
    }
    return options
  }

  if (!platforms.includes(options.platform)) {
    throw new Error('--platform must be android or ios')
  }

  if (!hasUpdates) {
    throw new Error(
      'Provide at least one metadata field, --pass, --pass-remaining, or --skip update',
    )
  }

  if (options.passRemaining) {
    if (
      typeof options.passRemainingConfirmation !== 'string' ||
      options.passRemainingConfirmation.trim().length === 0
    ) {
      throw new Error(
        '--pass-remaining requires --pass-remaining-confirmation with a release-specific confirmation note',
      )
    }
    if (isReleaseEvidencePlaceholder(options.passRemainingConfirmation)) {
      throw new Error(
        `--pass-remaining-confirmation requires a real confirmation note, not ${options.passRemainingConfirmation}`,
      )
    }
  } else if (options.passRemainingConfirmation !== null) {
    throw new Error(
      '--pass-remaining-confirmation can only be used with --pass-remaining',
    )
  }

  return options
}

function readJson(filePath) {
  const resolved = path.resolve(repoRoot, filePath)
  if (!fs.existsSync(resolved)) {
    throw new Error(`Platform evidence worksheet not found: ${resolved}`)
  }
  return JSON.parse(fs.readFileSync(resolved, 'utf-8'))
}

function writeJson(filePath, data) {
  const resolved = path.resolve(repoRoot, filePath)
  fs.mkdirSync(path.dirname(resolved), { recursive: true })
  fs.writeFileSync(resolved, `${JSON.stringify(data, null, 2)}\n`)
}

function orderedChecks(platform, checks) {
  const selected = new Set(checks)
  return requiredRealDeviceChecks[platform].filter((check) =>
    selected.has(check),
  )
}

function validateCheckNames(platform, checks, label) {
  const valid = new Set(requiredRealDeviceChecks[platform])
  const unknown = checks.filter((check) => !valid.has(check))
  if (unknown.length > 0) {
    throw new Error(
      `${label} contains unknown ${platform} check(s): ${unknown.join(', ')}`,
    )
  }
}

function selectedApiMustPassChecks(platform, platformEvidence) {
  const selectedApis = Array.isArray(platformEvidence.selectedApis)
    ? uniqueStrings(platformEvidence.selectedApis)
    : []
  const unknownSelectedApis = unknownRealDeviceSelectedApis(selectedApis)
  if (unknownSelectedApis.length > 0) {
    throw new Error(
      `${platform}.selectedApis contains unknown API(s): ${unknownSelectedApis.join(', ')}`,
    )
  }
  return [
    ...new Set([
      ...passOnlyRealDeviceChecks[platform],
      ...Object.keys(
        Object.fromEntries(selectedApiRequiredCheckMap(selectedApis, platform)),
      ),
    ]),
  ]
}

export function recordPlatformEvidence(evidence, options) {
  const platform = options.platform
  if (!isRecord(evidence)) {
    throw new Error('Platform evidence worksheet must be a JSON object')
  }
  if (!isRecord(evidence[platform])) {
    throw new Error(`${platform} evidence must be an object`)
  }

  const platformEvidence = { ...evidence[platform] }
  const passedChecks = uniqueStrings([
    ...(Array.isArray(platformEvidence.passedChecks)
      ? platformEvidence.passedChecks
      : []),
  ])
  if (!Array.isArray(platformEvidence.passedChecks)) {
    throw new Error(`${platform}.passedChecks must be a string array`)
  }
  if (!isRecord(platformEvidence.skippedChecks)) {
    throw new Error(`${platform}.skippedChecks must be an object`)
  }

  const explicitPassedChecks = uniqueStrings(options.passedChecks ?? [])
  const newSkippedChecks = Object.keys(options.skippedChecks)
  validateCheckNames(platform, explicitPassedChecks, '--pass')
  validateCheckNames(platform, newSkippedChecks, '--skip')

  const conflictingChecks = explicitPassedChecks.filter((check) =>
    newSkippedChecks.includes(check),
  )
  if (conflictingChecks.length > 0) {
    throw new Error(
      `Checks cannot be both passed and skipped: ${conflictingChecks.join(', ')}`,
    )
  }

  const mustPassChecks = new Set(
    selectedApiMustPassChecks(platform, platformEvidence),
  )
  const invalidSkippedChecks = newSkippedChecks.filter((check) =>
    mustPassChecks.has(check),
  )
  if (invalidSkippedChecks.length > 0) {
    throw new Error(
      `${platform} check(s) must be recorded in passedChecks, not skippedChecks: ${invalidSkippedChecks.join(', ')}`,
    )
  }

  const passRemainingChecks = options.passRemaining
    ? requiredRealDeviceChecks[platform].filter((check) => {
        if (!mustPassChecks.has(check)) {
          return false
        }
        if (explicitPassedChecks.includes(check)) {
          return false
        }
        if (newSkippedChecks.includes(check)) {
          return false
        }
        return typeof platformEvidence.skippedChecks[check] !== 'string'
      })
    : []
  const newPassedChecks = uniqueStrings([
    ...explicitPassedChecks,
    ...passRemainingChecks,
  ])

  for (const [key, value] of Object.entries(options.updates)) {
    if (isReleaseEvidencePlaceholder(value)) {
      throw new Error(`${platform}.${key} requires a real value, not ${value}`)
    }
    platformEvidence[key] = value
  }
  if (options.passRemaining) {
    platformEvidence.passRemainingConfirmation =
      options.passRemainingConfirmation.trim()
  }

  const passedSet = new Set(passedChecks)
  const skippedChecks = { ...platformEvidence.skippedChecks }
  for (const check of newPassedChecks) {
    passedSet.add(check)
    delete skippedChecks[check]
  }
  for (const [check, reason] of Object.entries(options.skippedChecks)) {
    skippedChecks[check] = reason
    passedSet.delete(check)
  }

  platformEvidence.passedChecks = orderedChecks(platform, passedSet)
  platformEvidence.skippedChecks = Object.fromEntries(
    requiredRealDeviceChecks[platform]
      .filter((check) => typeof skippedChecks[check] === 'string')
      .map((check) => [check, skippedChecks[check]]),
  )

  return {
    ...evidence,
    [platform]: platformEvidence,
  }
}

function writeSummary(filePath, summary) {
  if (!filePath) {
    return
  }
  const resolved = path.resolve(repoRoot, filePath)
  writeJson(filePath, summary)
  console.log(`[platform-evidence] wrote ${path.relative(repoRoot, resolved)}`)
}

function formatPlatformLabel(platform) {
  return platform === 'ios' ? 'iOS' : 'Android'
}

function formatCheckQualifiers(platform, check, status) {
  const qualifiers = []
  const passOnly = passOnlyRealDeviceChecks[platform].includes(check)
  const selectedApis = Array.isArray(status.selectedApiRequiredChecks[check])
    ? status.selectedApiRequiredChecks[check]
    : []

  if (status.mustPassChecks.includes(check)) {
    qualifiers.push('must pass')
  } else {
    qualifiers.push('skippable')
  }
  if (passOnly) {
    qualifiers.push('pass-only')
  }
  if (selectedApis.length > 0) {
    qualifiers.push(`selected APIs: ${selectedApis.join(', ')}`)
  }
  if (status.passedChecks.includes(check)) {
    qualifiers.push('outcome: passed')
  } else if (status.skippedCheckNames.includes(check)) {
    qualifiers.push('outcome: skipped')
  } else {
    qualifiers.push('outcome: remaining')
  }

  return qualifiers.join('; ')
}

function printCheckList(summary, selectedPlatform) {
  const platformsToPrint = selectedPlatform ? [selectedPlatform] : platforms

  for (const platform of platformsToPrint) {
    const status = summary.platforms?.[platform]
    if (!status) {
      continue
    }

    console.log(
      `[platform-evidence] ${formatPlatformLabel(platform)} required checks`,
    )
    if (status.selectedApis.length > 0) {
      console.log(
        `[platform-evidence] selected APIs: ${status.selectedApis.join(', ')}`,
      )
    }
    for (const check of requiredRealDeviceChecks[platform]) {
      console.log(
        [
          `[platform-evidence] - ${check}`,
          `(${formatCheckQualifiers(platform, check, status)})`,
          describeRealDeviceCheck(platform, check),
        ].join(' '),
      )
    }
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const evidence = readJson(options.platformEvidencePath)
  if (options.listChecks) {
    const summary = auditPlatformEvidence(evidence)
    summary.path = path.relative(
      repoRoot,
      path.resolve(repoRoot, options.platformEvidencePath),
    )
    summary.expectedCommit = options.expectedCommit
    printCheckList(summary, options.platform)
    writeSummary(options.summaryOutput, summary)
    return
  }

  const updated = recordPlatformEvidence(evidence, options)
  const summary = auditPlatformEvidence(updated)
  summary.path = path.relative(
    repoRoot,
    path.resolve(repoRoot, options.platformEvidencePath),
  )
  summary.updatedPlatform = options.platform
  summary.dryRun = options.dryRun
  summary.expectedCommit = options.expectedCommit
  summary.passRemaining = options.passRemaining
  summary.passRemainingConfirmation = options.passRemaining
    ? options.passRemainingConfirmation.trim()
    : null
  summary.nextActions = collectPlatformEvidenceNextActions(summary, {
    expectedCommit: options.expectedCommit,
    platformEvidencePath: options.platformEvidencePath,
    summaryOutput: options.summaryOutput,
  })

  if (!options.dryRun) {
    writeJson(options.platformEvidencePath, updated)
    console.log(`[platform-evidence] updated ${summary.path}`)
  } else {
    console.log(`[platform-evidence] dry run for ${summary.path}`)
  }
  console.log(`[platform-evidence] ${formatPlatformEvidenceProgress(summary)}`)
  for (const line of formatPlatformEvidenceRemaining(summary)) {
    console.log(`[platform-evidence] ${line}`)
  }
  writeSummary(options.summaryOutput, summary)
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
