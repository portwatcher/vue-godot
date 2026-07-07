import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  auditPlatformEvidence,
  collectPlatformEvidenceCommandMetadata,
  collectPlatformEvidencePassChecks,
  collectPlatformEvidenceRemainingCheckDetails,
  collectPlatformEvidenceSkippableMissingChecks,
  formatPlatformEvidenceRemainingBlock,
} from './check-platform-evidence.mjs'
import {
  knownRealDeviceSelectedApis,
  passOnlyRealDeviceChecks,
  productionProfileSelectedApis,
  requiredRealDeviceChecks,
  isValidRealDeviceTestTarget,
  realDeviceTestTargets,
  selectedApiRequiredCheckMap,
  unknownRealDeviceSelectedApis,
} from './real-device-evidence.mjs'
import {
  checkPlatformEvidenceCommand,
  checkRealDeviceEvidenceCommand,
  defaultPlatformEvidenceChecklistPath,
  defaultRealDeviceEvidenceChecklistPath,
  defaultRealDeviceEvidenceSummaryPath,
  defaultReleaseCiEvidencePath,
  initialReleaseCiCommands,
  recordPlatformEvidenceCommands,
  releaseEvidenceCommand,
} from './release-handoff-commands.mjs'
import { isReleaseEvidenceUrl } from './release-evidence-utils.mjs'
import { readInitialCiEvidenceStatus } from './release-ci-evidence.mjs'
import {
  normalizeCommitSha,
  repoRoot,
  uniqueStrings,
} from './release-utils.mjs'

const defaultOutput = 'release/platform-evidence.json'

function usage() {
  console.log(`Usage: node scripts/create-platform-evidence.mjs [options]

Creates a starter Android/iOS platform evidence JSON file for release target
testing. The generated file is intentionally not release-ready: fill
artifact/evidence URL/export-preset/device details and move each requiredChecks
entry into passedChecks or skippedChecks with a release-specific reason after
real-device, hosted-device, emulator, or simulator testing.
Checks listed in passOnlyChecks and selectedApiRequiredChecks must be recorded
in passedChecks.
The top-level nextActions array records the follow-up commands for recording
target results, auditing worksheet progress, and assembling final real-device
evidence after the worksheet is complete. It also includes audited progress and
exact remaining metadata, must-pass, and skippable check names.

Options:
  --output <file>                  Output path. Default: ${defaultOutput}
  --selected-api <name>            Add a selected API. Can be repeated.
  --selected-apis <csv>            Add comma-separated selected APIs.
                                  Unknown selected API names fail validation.
  --production-profile             Add the maintained production-profile
                                  selected API set used by release evidence.
  --commit <sha>                   Full tested release-candidate commit SHA
                                  for nextActions command hints.
  --ci-evidence <file>             CI evidence file for nextActions reuse.
                                  Default: ${defaultReleaseCiEvidencePath}.
  --android-artifact <name>        Android APK/AAB or hosted build identifier.
  --ios-artifact <name>            iOS archive, TestFlight, or hosted build identifier.
  --android-evidence-url <url>     Android non-local device test run, lab session, or signed evidence URL.
  --ios-evidence-url <url>         iOS non-local device test run, lab session, or signed evidence URL.
  --android-test-target <target>   Android target class: ${realDeviceTestTargets.join(', ')}.
  --ios-test-target <target>       iOS target class: ${realDeviceTestTargets.join(', ')}.
  --android-export-preset <name>   Android export preset. Default: Android Release.
  --ios-export-preset <name>       iOS export preset. Default: iOS Release.
  --android-device <model>         Tested Android device model.
  --ios-device <model>             Tested iOS device model.
  --android-os <version>           Tested Android OS version.
  --ios-os <version>               Tested iOS version.
  --orientation <value>            Tested orientation coverage.
  --locale <value>                 Tested locale.
  --help                           Show this help.
`)
}

function addSelectedApis(options, value) {
  for (const api of value.split(',')) {
    const normalized = api.trim()
    if (normalized.length > 0) {
      options.selectedApis.push(normalized)
    }
  }
}

function parseArgs(argv) {
  const options = {
    output: defaultOutput,
    selectedApis: [],
    productionProfile: false,
    commit: null,
    ciEvidencePath: defaultReleaseCiEvidencePath,
    androidArtifact: '',
    iosArtifact: '',
    androidEvidenceUrl: '',
    iosEvidenceUrl: '',
    androidTestTarget: '',
    iosTestTarget: '',
    androidExportPreset: 'Android Release',
    iosExportPreset: 'iOS Release',
    androidDevice: '',
    iosDevice: '',
    androidOs: '',
    iosOs: '',
    orientation: '',
    locale: '',
  }

  const valueOptions = [
    ['--output', 'output'],
    ['--android-artifact', 'androidArtifact'],
    ['--ios-artifact', 'iosArtifact'],
    ['--android-evidence-url', 'androidEvidenceUrl'],
    ['--ios-evidence-url', 'iosEvidenceUrl'],
    ['--android-test-target', 'androidTestTarget'],
    ['--ios-test-target', 'iosTestTarget'],
    ['--android-export-preset', 'androidExportPreset'],
    ['--ios-export-preset', 'iosExportPreset'],
    ['--commit', 'commit'],
    ['--ci-evidence', 'ciEvidencePath'],
    ['--android-device', 'androidDevice'],
    ['--ios-device', 'iosDevice'],
    ['--android-os', 'androidOs'],
    ['--ios-os', 'iosOs'],
    ['--orientation', 'orientation'],
    ['--locale', 'locale'],
  ]

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
    }

    if (arg === '--selected-api' || arg === '--selected-apis') {
      const value = argv[++index]
      if (!value) {
        throw new Error(`${arg} requires a value`)
      }
      addSelectedApis(options, value)
      continue
    }

    if (arg === '--production-profile') {
      options.productionProfile = true
      continue
    }

    if (arg.startsWith('--selected-api=')) {
      addSelectedApis(options, arg.slice('--selected-api='.length))
      continue
    }

    if (arg.startsWith('--selected-apis=')) {
      addSelectedApis(options, arg.slice('--selected-apis='.length))
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

  return options
}

function selectedApiRequiredChecks(selectedApis, platform) {
  return Object.fromEntries(selectedApiRequiredCheckMap(selectedApis, platform))
}

function assertOptionalEvidenceUrl(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return
  }
  if (!isReleaseEvidenceUrl(value)) {
    throw new Error(`${label} requires a non-local http(s) URL`)
  }
}

function assertOptionalTestTarget(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return
  }
  if (!isValidRealDeviceTestTarget(value)) {
    throw new Error(
      `${label} must be one of ${realDeviceTestTargets.join(', ')}`,
    )
  }
}

function buildPlatformTemplate(platform, options) {
  const isAndroid = platform === 'android'
  const selectedApis = options.selectedApis
  const template = {
    artifact: isAndroid ? options.androidArtifact : options.iosArtifact,
    evidenceUrl: isAndroid
      ? options.androidEvidenceUrl
      : options.iosEvidenceUrl,
    exportPreset: isAndroid
      ? options.androidExportPreset
      : options.iosExportPreset,
    deviceModel: isAndroid ? options.androidDevice : options.iosDevice,
    osVersion: isAndroid ? options.androidOs : options.iosOs,
    orientation: options.orientation,
    locale: options.locale,
    selectedApis,
    passedChecks: [],
    skippedChecks: {},
    requiredChecks: [...requiredRealDeviceChecks[platform]],
    passOnlyChecks: [...passOnlyRealDeviceChecks[platform]],
    selectedApiRequiredChecks: selectedApiRequiredChecks(
      selectedApis,
      platform,
    ),
  }
  const testTarget = isAndroid
    ? options.androidTestTarget
    : options.iosTestTarget
  if (typeof testTarget === 'string' && testTarget.trim().length > 0) {
    template.testTarget = testTarget.trim()
  }
  return template
}

function buildNextActions(platformEvidencePath, commit, options = {}) {
  const ciEvidencePath = options.ciEvidencePath ?? defaultReleaseCiEvidencePath
  const realDeviceCheckOptions = {
    ...(platformEvidencePath !== defaultOutput ? { platformEvidencePath } : {}),
    ...(ciEvidencePath !== defaultReleaseCiEvidencePath
      ? { ciEvidencePath }
      : {}),
    verifyRuns: true,
  }
  const initialCiEvidenceReady = options.initialCiEvidence?.ready === true
  const ciEvidenceCommands = initialCiEvidenceReady
    ? []
    : initialReleaseCiCommands(commit, { output: ciEvidencePath })
  const ciEvidenceDetail = initialCiEvidenceReady
    ? 'Committed CI evidence already validates Check and Godot Smoke for the tested release candidate; generate release/real-device-evidence.json from this worksheet after device testing.'
    : 'After CI runs exist for the tested release candidate, generate release/real-device-evidence.json from this worksheet.'
  const platformEvidenceSummaryPath = 'release/platform-evidence-summary.json'
  const platformEvidenceChecklistPath = defaultPlatformEvidenceChecklistPath
  const platformAudit = options.platformAudit
  const platformCheckDetails = platformAudit
    ? collectPlatformEvidenceRemainingCheckDetails(platformAudit)
    : []
  const platformAuditDetail = platformAudit?.ready
    ? ''
    : platformAudit
      ? formatPlatformEvidenceRemainingBlock(platformAudit)
      : ''

  return [
    {
      id: 'complete-platform-evidence',
      title: 'Fill Android and iOS device evidence fields',
      detail: [
        'Record artifact IDs, evidence URLs, export presets, device models, OS versions, orientation, locale, selected APIs, and target test outcomes before assembling final evidence.',
        platformAuditDetail,
      ]
        .filter(Boolean)
        .join('\n'),
      ...(platformCheckDetails.length > 0 ? { platformCheckDetails } : {}),
      commands: [
        ...recordPlatformEvidenceCommands('android', commit, {
          ...collectPlatformEvidenceCommandMetadata(platformAudit, 'android'),
          checks: collectPlatformEvidencePassChecks(platformAudit, 'android'),
          platformEvidencePath,
          skipChecks: collectPlatformEvidenceSkippableMissingChecks(
            platformAudit,
            'android',
          ),
          summaryOutput: platformEvidenceSummaryPath,
        }),
        ...recordPlatformEvidenceCommands('ios', commit, {
          ...collectPlatformEvidenceCommandMetadata(platformAudit, 'ios'),
          checks: collectPlatformEvidencePassChecks(platformAudit, 'ios'),
          platformEvidencePath,
          skipChecks: collectPlatformEvidenceSkippableMissingChecks(
            platformAudit,
            'ios',
          ),
          summaryOutput: platformEvidenceSummaryPath,
        }),
      ],
    },
    {
      id: 'record-required-checks',
      title: 'Move worksheet checks into passedChecks or skippedChecks',
      detail: [
        'Every requiredChecks entry must move to passedChecks or skippedChecks with a release-specific reason; passOnlyChecks and selectedApiRequiredChecks must move to passedChecks.',
        platformAuditDetail,
      ]
        .filter(Boolean)
        .join('\n'),
      commands: [
        checkPlatformEvidenceCommand(commit, {
          allowOpen: true,
          checklistOutput: platformEvidenceChecklistPath,
          platformEvidencePath,
          summaryOutput: platformEvidenceSummaryPath,
        }),
      ],
    },
    {
      id: 'assemble-real-device-evidence',
      title: 'Assemble and validate final real-device evidence',
      detail: ciEvidenceDetail,
      commands: [
        'npm run check',
        ...ciEvidenceCommands,
        checkPlatformEvidenceCommand(commit, {
          platformEvidencePath,
        }),
        releaseEvidenceCommand(commit, {
          ciEvidencePath,
          platformEvidencePath,
        }),
        checkRealDeviceEvidenceCommand(commit, {
          checklistOutput: defaultRealDeviceEvidenceChecklistPath,
          ...realDeviceCheckOptions,
          summaryOutput: defaultRealDeviceEvidenceSummaryPath,
        }),
      ],
    },
  ]
}

export function buildPlatformEvidenceTemplate(options = {}) {
  const selectedApis = uniqueStrings([
    ...(options.productionProfile ? productionProfileSelectedApis : []),
    ...(options.selectedApis ?? []),
  ])
  const unknownSelectedApis = unknownRealDeviceSelectedApis(selectedApis)
  if (unknownSelectedApis.length > 0) {
    throw new Error(
      [
        `Unknown selected API(s): ${unknownSelectedApis.join(', ')}`,
        `Known selected APIs: ${knownRealDeviceSelectedApis.join(', ')}`,
      ].join('\n'),
    )
  }

  const normalized = {
    androidArtifact: options.androidArtifact ?? '',
    iosArtifact: options.iosArtifact ?? '',
    androidEvidenceUrl: options.androidEvidenceUrl ?? '',
    iosEvidenceUrl: options.iosEvidenceUrl ?? '',
    androidTestTarget: options.androidTestTarget ?? '',
    iosTestTarget: options.iosTestTarget ?? '',
    androidExportPreset: options.androidExportPreset ?? 'Android Release',
    iosExportPreset: options.iosExportPreset ?? 'iOS Release',
    androidDevice: options.androidDevice ?? '',
    iosDevice: options.iosDevice ?? '',
    androidOs: options.androidOs ?? '',
    iosOs: options.iosOs ?? '',
    orientation: options.orientation ?? '',
    locale: options.locale ?? '',
    output: options.output ?? defaultOutput,
    ciEvidencePath: options.ciEvidencePath ?? defaultReleaseCiEvidencePath,
    commit: normalizeCommitSha(options.commit, '--commit'),
    productionProfile: Boolean(options.productionProfile),
    selectedApis,
  }
  assertOptionalEvidenceUrl(
    normalized.androidEvidenceUrl,
    'android.evidenceUrl',
  )
  assertOptionalEvidenceUrl(normalized.iosEvidenceUrl, 'ios.evidenceUrl')
  assertOptionalTestTarget(normalized.androidTestTarget, 'android.testTarget')
  assertOptionalTestTarget(normalized.iosTestTarget, 'ios.testTarget')

  const initialCiEvidence = readInitialCiEvidenceStatus(
    normalized.ciEvidencePath,
    normalized.commit,
  )
  const android = buildPlatformTemplate('android', normalized)
  const ios = buildPlatformTemplate('ios', normalized)
  const platformAudit = auditPlatformEvidence(
    { android, ios },
    { allowNonProductionProfile: !normalized.productionProfile },
  )

  return {
    initialCiEvidence,
    nextActions: buildNextActions(normalized.output, normalized.commit, {
      ciEvidencePath: normalized.ciEvidencePath,
      initialCiEvidence,
      platformAudit,
    }),
    android,
    ios,
  }
}

function writeJson(filePath, data) {
  const resolved = path.resolve(repoRoot, filePath)
  fs.mkdirSync(path.dirname(resolved), { recursive: true })
  fs.writeFileSync(resolved, `${JSON.stringify(data, null, 2)}\n`)
  console.log(`[platform-evidence] wrote ${path.relative(repoRoot, resolved)}`)
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const evidence = buildPlatformEvidenceTemplate(options)
  writeJson(options.output, evidence)
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
