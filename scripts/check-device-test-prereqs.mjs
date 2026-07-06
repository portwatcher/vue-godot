import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { repoRoot } from './release-utils.mjs'

const platforms = ['android', 'ios']

const hostedDeviceProviderEnvSets = [
  {
    id: 'browserstack',
    label: 'BrowserStack App Automate',
    requiredEnvSets: [['BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY']],
  },
  {
    id: 'sauce-labs',
    label: 'Sauce Labs Real Device Cloud',
    requiredEnvSets: [['SAUCE_USERNAME', 'SAUCE_ACCESS_KEY']],
  },
  {
    id: 'firebase-test-lab',
    label: 'Firebase Test Lab',
    requiredEnvSets: [
      ['GOOGLE_APPLICATION_CREDENTIALS', 'GCLOUD_PROJECT'],
      ['GOOGLE_APPLICATION_CREDENTIALS', 'GOOGLE_CLOUD_PROJECT'],
      ['FIREBASE_TOKEN', 'GCLOUD_PROJECT'],
      ['FIREBASE_TOKEN', 'GOOGLE_CLOUD_PROJECT'],
    ],
  },
  {
    id: 'aws-device-farm',
    label: 'AWS Device Farm',
    requiredEnvSets: [
      ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION'],
    ],
  },
  {
    id: 'lambdatest',
    label: 'LambdaTest Real Device Cloud',
    requiredEnvSets: [
      ['LT_USERNAME', 'LT_ACCESS_KEY'],
      ['LAMBDATEST_USERNAME', 'LAMBDATEST_ACCESS_KEY'],
    ],
  },
  {
    id: 'kobiton',
    label: 'Kobiton',
    requiredEnvSets: [
      ['KOBITON_USERNAME', 'KOBITON_API_KEY'],
      ['KOBITON_USERNAME', 'KOBITON_ACCESS_KEY'],
    ],
  },
]

function usage() {
  console.log(`Usage: node scripts/check-device-test-prereqs.mjs [options]

Checks whether the local machine has enough Android/iOS tooling and attached
real devices to run the release smoke checks. Hosted real-device providers can
still satisfy release evidence; this command diagnoses local prerequisites and
common hosted-provider environment variables without treating them as evidence.

Options:
  --platform <android|ios|all>  Platform to check. Default: all.
  --summary-output <file>       Write machine-readable JSON status.
  --allow-missing               Exit 0 even when local tooling/devices are
                                missing. Useful in handoff commands.
  --json                        Print machine-readable JSON to stdout.
  --help                        Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    allowMissing: false,
    json: false,
    platform: 'all',
    summaryOutput: null,
  }

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
    }

    if (arg === '--allow-missing') {
      options.allowMissing = true
      continue
    }

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--platform') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--platform requires a value')
      }
      options.platform = value
      continue
    }

    if (arg.startsWith('--platform=')) {
      options.platform = arg.slice('--platform='.length)
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

    throw new Error(`Unknown option: ${arg}`)
  }

  if (![...platforms, 'all'].includes(options.platform)) {
    throw new Error('--platform must be android, ios, or all')
  }

  return options
}

function defaultRunCommand(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf-8' })
  return {
    errorCode: result.error?.code ?? null,
    status: result.status,
    stderr: result.stderr ?? '',
    stdout: result.stdout ?? '',
  }
}

function commandMissing(result) {
  return result.errorCode === 'ENOENT'
}

function formatCommandFailure(command, result) {
  const message = result.stderr.trim() || result.stdout.trim()
  return message.length > 0
    ? `${command} failed: ${message}`
    : `${command} failed with status ${result.status ?? 'unknown'}`
}

function envHasValue(env, name) {
  return typeof env[name] === 'string' && env[name].trim().length > 0
}

export function collectHostedDeviceProviderStatus(env = process.env) {
  const providers = hostedDeviceProviderEnvSets.map((provider) => {
    const envSetStatuses = provider.requiredEnvSets.map((envSet) => {
      const presentEnv = envSet.filter((name) => envHasValue(env, name))
      const missingEnv = envSet.filter((name) => !envHasValue(env, name))
      return {
        complete: missingEnv.length === 0,
        missingEnv,
        presentEnv,
      }
    })
    const configuredEnv =
      envSetStatuses.find((envSetStatus) => envSetStatus.complete)
        ?.presentEnv ?? null
    const partialEnvSet =
      configuredEnv === null
        ? (envSetStatuses
            .filter((envSetStatus) => envSetStatus.presentEnv.length > 0)
            .sort(
              (left, right) =>
                right.presentEnv.length - left.presentEnv.length ||
                left.missingEnv.length - right.missingEnv.length,
            )[0] ?? null)
        : null

    return {
      configured: configuredEnv !== null,
      configuredEnv: configuredEnv ?? [],
      id: provider.id,
      label: provider.label,
      missingEnv: partialEnvSet?.missingEnv ?? [],
      partiallyConfigured: partialEnvSet !== null,
      partialEnv: partialEnvSet?.presentEnv ?? [],
      requiredEnvSets: provider.requiredEnvSets,
    }
  })

  return {
    anyConfigured: providers.some((provider) => provider.configured),
    providers,
  }
}

export function parseAdbDevices(output) {
  const devices = []
  for (const line of String(output).split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('List of devices attached')) {
      continue
    }

    const [serial, state, ...detailParts] = trimmed.split(/\s+/)
    if (!serial || !state) {
      continue
    }
    devices.push({
      details: detailParts.join(' '),
      serial,
      state,
    })
  }
  return devices
}

export function isAndroidEmulatorDevice(device) {
  const serial = String(device?.serial ?? '').toLowerCase()
  const details = String(device?.details ?? '').toLowerCase()
  return (
    serial.startsWith('emulator-') ||
    /\bdevice:emu/.test(details) ||
    /\bmodel:sdk/.test(details) ||
    /\bproduct:sdk/.test(details)
  )
}

export function parseXctraceDevices(output) {
  const devices = []
  let section = null

  for (const line of String(output).split(/\r?\n/)) {
    const trimmed = line.trim()
    const sectionMatch = trimmed.match(/^==\s+(.+?)\s+==$/)
    if (sectionMatch) {
      section = sectionMatch[1]
      continue
    }

    if (section !== 'Devices' || !trimmed) {
      continue
    }
    if (!/\b(iPhone|iPad|iPod)\b/i.test(trimmed)) {
      continue
    }

    const identifierMatch = trimmed.match(/\(([^()]+)\)\s*$/)
    devices.push({
      identifier: identifierMatch?.[1] ?? null,
      name: identifierMatch
        ? trimmed.slice(0, identifierMatch.index).trim()
        : trimmed,
    })
  }

  return devices
}

function checkAndroid(runCommand) {
  const result = runCommand('adb', ['devices', '-l'])
  const blockers = []
  const warnings = []
  let devices = []

  if (commandMissing(result)) {
    blockers.push(
      'adb not found; install Android platform-tools or use a hosted real Android device.',
    )
  } else if (result.status !== 0) {
    blockers.push(formatCommandFailure('adb devices -l', result))
  } else {
    devices = parseAdbDevices(result.stdout)
    const readyDevices = devices.filter(
      (device) => device.state === 'device' && !isAndroidEmulatorDevice(device),
    )
    const unavailableDevices = devices.filter(
      (device) => device.state !== 'device',
    )
    const emulatorDevices = devices.filter(
      (device) => device.state === 'device' && isAndroidEmulatorDevice(device),
    )
    if (readyDevices.length === 0) {
      blockers.push(
        'No authorized physical Android devices reported by adb; connect and authorize a real device or use hosted real-device evidence.',
      )
    }
    for (const device of unavailableDevices) {
      warnings.push(`Android device ${device.serial} is ${device.state}.`)
    }
    for (const device of emulatorDevices) {
      warnings.push(
        `Android device ${device.serial} appears to be an emulator; release smoke requires a real or hosted Android device.`,
      )
    }
  }

  return {
    blockers,
    command: 'adb devices -l',
    devices,
    ready: blockers.length === 0,
    warnings,
  }
}

function checkIos(runCommand) {
  const result = runCommand('xcrun', ['xctrace', 'list', 'devices'])
  const blockers = []
  let devices = []

  if (commandMissing(result)) {
    blockers.push(
      'xcrun not found; install Xcode command line tools or use hosted real Apple-device evidence.',
    )
  } else if (result.status !== 0) {
    blockers.push(formatCommandFailure('xcrun xctrace list devices', result))
  } else {
    devices = parseXctraceDevices(result.stdout)
    if (devices.length === 0) {
      blockers.push(
        'No physical iPhone, iPad, or iPod devices reported by xcrun xctrace; connect a trusted device or use hosted real Apple-device evidence.',
      )
    }
  }

  return {
    blockers,
    command: 'xcrun xctrace list devices',
    devices,
    ready: blockers.length === 0,
    warnings: [],
  }
}

export function collectDeviceTestPrereqStatus(options = {}) {
  const runCommand = options.runCommand ?? defaultRunCommand
  const env = options.env ?? process.env
  const selectedPlatforms =
    options.platform && options.platform !== 'all'
      ? [options.platform]
      : platforms

  const summary = {
    android: null,
    blockers: [],
    ios: null,
    ready: false,
    selectedPlatforms,
  }

  if (selectedPlatforms.includes('android')) {
    summary.android = checkAndroid(runCommand)
  }
  if (selectedPlatforms.includes('ios')) {
    summary.ios = checkIos(runCommand)
  }

  summary.blockers = selectedPlatforms.flatMap(
    (platform) => summary[platform]?.blockers ?? [],
  )
  summary.ready = summary.blockers.length === 0
  summary.hostedDeviceEvidenceAccepted = true
  summary.hostedProviders = collectHostedDeviceProviderStatus(env)
  summary.note =
    'Hosted real-device runs satisfy the release gate when the final evidence records artifact ids, device metadata, and non-local http(s) evidence URLs.'

  return summary
}

function formatProviderRequiredEnvSets(provider) {
  return provider.requiredEnvSets
    .map((envSet) => envSet.join(' + '))
    .join(' or ')
}

export function formatHostedProviderStatus(status) {
  const configuredProviders = status.providers.filter(
    (provider) => provider.configured,
  )
  const partialProviders = status.providers.filter(
    (provider) => provider.partiallyConfigured,
  )
  const partialProviderLines = partialProviders.map(
    (provider) =>
      `[device-prereqs] hosted provider env partial: ${provider.label} (set: ${provider.partialEnv.join(', ')}; missing: ${provider.missingEnv.join(', ')})`,
  )
  if (configuredProviders.length === 0) {
    return [
      '[device-prereqs] hosted provider env: none detected',
      ...partialProviderLines,
      ...status.providers.map(
        (provider) =>
          `[device-prereqs] hosted provider env option: ${provider.label} (${formatProviderRequiredEnvSets(provider)})`,
      ),
    ]
  }

  return [
    ...configuredProviders.map(
      (provider) =>
        `[device-prereqs] hosted provider env: ${provider.label} (${provider.configuredEnv.join(', ')})`,
    ),
    ...partialProviderLines,
  ]
}

function formatPlatformStatus(label, status) {
  if (!status) {
    return []
  }

  const lines = [
    `[device-prereqs] ${label}: ${status.ready ? 'ready' : 'waiting'}`,
    `[device-prereqs] ${label} command: ${status.command}`,
  ]
  if (status.devices.length > 0) {
    for (const device of status.devices) {
      const name = device.name ?? device.serial
      const detail = device.details || device.identifier || device.state || ''
      lines.push(
        `[device-prereqs] ${label} device: ${[name, detail]
          .filter(Boolean)
          .join(' ')}`,
      )
    }
  }
  for (const warning of status.warnings) {
    lines.push(`[device-prereqs] warning: ${warning}`)
  }
  for (const blocker of status.blockers) {
    lines.push(`[device-prereqs] blocker: ${blocker}`)
  }
  return lines
}

function printText(summary) {
  const lines = [
    `[device-prereqs] status: ${summary.ready ? 'ready' : 'waiting'}`,
    ...formatPlatformStatus('Android', summary.android),
    ...formatPlatformStatus('iOS', summary.ios),
    ...formatHostedProviderStatus(summary.hostedProviders),
  ]
  if (!summary.ready) {
    lines.push(`[device-prereqs] ${summary.note}`)
  }
  console.log(lines.join('\n'))
}

function writeSummary(filePath, summary) {
  if (!filePath) {
    return
  }
  const resolved = path.resolve(repoRoot, filePath)
  fs.mkdirSync(path.dirname(resolved), { recursive: true })
  fs.writeFileSync(resolved, `${JSON.stringify(summary, null, 2)}\n`)
  console.log(`[device-prereqs] wrote ${path.relative(repoRoot, resolved)}`)
}

function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const summary = collectDeviceTestPrereqStatus({
      platform: options.platform,
    })
    writeSummary(options.summaryOutput, summary)
    if (options.json) {
      console.log(JSON.stringify(summary, null, 2))
    } else {
      printText(summary)
    }

    if (!summary.ready && !options.allowMissing) {
      process.exitCode = 1
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[device-prereqs] ${message}`)
    process.exitCode = 1
  }
}

const entryPoint = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (import.meta.url === entryPoint) {
  main()
}
