import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  knownRealDeviceSelectedApis,
  passOnlyRealDeviceChecks,
  productionProfileSelectedApis,
  requiredRealDeviceChecks,
  selectedApiRequiredCheckMap,
  unknownRealDeviceSelectedApis,
} from './real-device-evidence.mjs'
import {
  checkRealDeviceEvidenceCommand,
  initialReleaseCiCommands,
  releaseEvidenceCommand,
} from './release-handoff-commands.mjs'
import { repoRoot } from './release-utils.mjs'

const defaultOutput = 'release/platform-evidence.json'

function usage() {
  console.log(`Usage: node scripts/create-platform-evidence.mjs [options]

Creates a starter Android/iOS platform evidence JSON file for real-device
release testing. The generated file is intentionally not release-ready: fill
artifact/device details and move each requiredChecks entry into passedChecks or
skippedChecks with a release-specific reason after testing.
Checks listed in passOnlyChecks and selectedApiRequiredChecks must be recorded
in passedChecks.
The top-level nextActions array records the follow-up commands for assembling
final real-device evidence after the worksheet is complete.

Options:
  --output <file>                  Output path. Default: ${defaultOutput}
  --selected-api <name>            Add a selected API. Can be repeated.
  --selected-apis <csv>            Add comma-separated selected APIs.
                                  Unknown selected API names fail validation.
  --production-profile             Add the maintained production-profile
                                  selected API set used by release evidence.
  --android-artifact <name>        Android APK/AAB or hosted build identifier.
  --ios-artifact <name>            iOS archive, TestFlight, or hosted build identifier.
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
    androidArtifact: '',
    iosArtifact: '',
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
    ['--android-export-preset', 'androidExportPreset'],
    ['--ios-export-preset', 'iosExportPreset'],
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

function selectedApiRequiredChecks(selectedApis, platform) {
  return Object.fromEntries(selectedApiRequiredCheckMap(selectedApis, platform))
}

function buildPlatformTemplate(platform, options) {
  const isAndroid = platform === 'android'
  const selectedApis = options.selectedApis
  return {
    artifact: isAndroid ? options.androidArtifact : options.iosArtifact,
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
}

function buildNextActions(platformEvidencePath) {
  return [
    {
      id: 'complete-platform-evidence',
      title: 'Fill Android and iOS device evidence fields',
      detail:
        'Record artifact IDs, export presets, device models, OS versions, orientation, locale, selected APIs, and real test outcomes before assembling final evidence.',
      commands: [],
    },
    {
      id: 'record-required-checks',
      title: 'Move worksheet checks into passedChecks or skippedChecks',
      detail:
        'Every requiredChecks entry must move to passedChecks or skippedChecks with a release-specific reason; passOnlyChecks and selectedApiRequiredChecks must move to passedChecks.',
      commands: [],
    },
    {
      id: 'assemble-real-device-evidence',
      title: 'Assemble and validate final real-device evidence',
      detail:
        'After CI runs exist for the tested release candidate, generate release/real-device-evidence.json from this worksheet.',
      commands: [
        'npm run check',
        ...initialReleaseCiCommands(),
        releaseEvidenceCommand(null, { platformEvidencePath }),
        checkRealDeviceEvidenceCommand(null),
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
    androidExportPreset: options.androidExportPreset ?? 'Android Release',
    iosExportPreset: options.iosExportPreset ?? 'iOS Release',
    androidDevice: options.androidDevice ?? '',
    iosDevice: options.iosDevice ?? '',
    androidOs: options.androidOs ?? '',
    iosOs: options.iosOs ?? '',
    orientation: options.orientation ?? '',
    locale: options.locale ?? '',
    output: options.output ?? defaultOutput,
    selectedApis,
  }

  return {
    nextActions: buildNextActions(normalized.output),
    android: buildPlatformTemplate('android', normalized),
    ios: buildPlatformTemplate('ios', normalized),
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
