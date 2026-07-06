import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { repoRoot } from './release-utils.mjs'
import {
  defaultGodotExportTemplatesRoot,
  pinnedGodotJsRelease,
} from './setup-godotjs.mjs'

const platforms = ['android', 'ios']
const androidExportTemplateAsset = 'prebuilt_android_v8'
export const requiredAndroidExportTemplateFiles = Object.freeze([
  'android_debug.apk',
  'android_release.apk',
  'android_source.zip',
  'godot-lib.template_debug.aar',
  'godot-lib.template_release.aar',
  'version.txt',
])

const androidExportTemplateInstallCommand =
  'npm run setup:godotjs -- --asset prebuilt_android_v8 --asset-kind templates --install-templates --godot-bin "$(npm run -s setup:godotjs -- --print-bin)" --print-dir'
const androidSdkEnvNames = ['ANDROID_HOME', 'ANDROID_SDK_ROOT']
const defaultAndroidSdkRootCandidates = [
  '/opt/homebrew/share/android-commandlinetools',
  '/usr/local/share/android-commandlinetools',
]

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
  --template-version <version>  Check Android export templates under this
                                Godot export-template version directory.
  --templates-root <dir>        Godot export_templates root. Defaults to the
                                current platform's Godot user data directory.
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
    templateVersion: null,
    templatesRoot: null,
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

    if (arg === '--template-version') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--template-version requires a value')
      }
      options.templateVersion = value
      continue
    }

    if (arg.startsWith('--template-version=')) {
      options.templateVersion = arg.slice('--template-version='.length)
      continue
    }

    if (arg === '--templates-root') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--templates-root requires a value')
      }
      options.templatesRoot = value
      continue
    }

    if (arg.startsWith('--templates-root=')) {
      options.templatesRoot = arg.slice('--templates-root='.length)
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

function commandOutput(result) {
  return `${result.stderr ?? ''}\n${result.stdout ?? ''}`.trim()
}

function firstOutputLine(result) {
  return (
    commandOutput(result)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => line.length > 0) ?? ''
  )
}

function xctraceUtilityMissing(result) {
  return /unable to find utility "xctrace"/i.test(commandOutput(result))
}

const fullXcodeInstallGuidance =
  'Install Xcode.app from the App Store (app id 497799835), resume any paused App Store download when prompted, or install from Apple Developer downloads with an Apple ID.'

function collectXcodeSelectionBlockers(runCommand) {
  const blockers = []
  const selected = runCommand('xcode-select', ['-p'])
  if (commandMissing(selected)) {
    blockers.push(
      'xcode-select not found; install full Xcode or use hosted real Apple-device evidence.',
    )
    return blockers
  }

  if (selected.status !== 0) {
    blockers.push(formatCommandFailure('xcode-select -p', selected))
    return blockers
  }

  const developerDir = selected.stdout.trim()
  if (/CommandLineTools(?:\/|$)/.test(developerDir)) {
    blockers.push(
      `Full Xcode is not selected; active developer directory is ${developerDir}. ${fullXcodeInstallGuidance} Then run sudo xcode-select -s /Applications/Xcode.app/Contents/Developer, or use hosted real Apple-device evidence.`,
    )
  }

  if (!fs.existsSync('/Applications/Xcode.app')) {
    blockers.push(
      `Full Xcode.app was not found at /Applications/Xcode.app; ${fullXcodeInstallGuidance} Then rerun the iOS device prerequisite check.`,
    )
  }

  return blockers
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
    if (xctraceUtilityMissing(result)) {
      blockers.push(...collectXcodeSelectionBlockers(runCommand))
    }
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

function selectedPlatformList(options = {}) {
  return (
    options.selectedPlatforms ??
    (options.platform && options.platform !== 'all'
      ? [options.platform]
      : platforms)
  )
}

function commandProbe(
  runCommand,
  { args, command, id, label, successStatuses },
) {
  const result = runCommand(command, args)
  const renderedCommand = [command, ...args].join(' ')
  if (commandMissing(result)) {
    return {
      command: renderedCommand,
      detail: null,
      id,
      label,
      ready: false,
      status: null,
    }
  }

  return {
    command: renderedCommand,
    detail: firstOutputLine(result) || null,
    id,
    label,
    ready: successStatuses.includes(result.status),
    status: result.status,
  }
}

function newestVersionName(left, right) {
  return right.localeCompare(left, undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

function directoryExists(dir) {
  try {
    return fs.statSync(dir).isDirectory()
  } catch {
    return false
  }
}

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile()
  } catch {
    return false
  }
}

function detectAndroidSdkRoot(env = process.env, candidates = []) {
  const envCandidates = androidSdkEnvNames
    .map((name) => ({
      path: env[name],
      source: name,
    }))
    .filter(
      (candidate) =>
        typeof candidate.path === 'string' && candidate.path.trim().length > 0,
    )

  const fallbackCandidates = [
    ...candidates.map((candidate) => ({
      path: candidate,
      source: 'candidate',
    })),
    ...defaultAndroidSdkRootCandidates.map((candidate) => ({
      path: candidate,
      source: 'discovered',
    })),
  ]

  for (const candidate of [...envCandidates, ...fallbackCandidates]) {
    const resolved = path.resolve(candidate.path)
    if (
      directoryExists(path.join(resolved, 'build-tools')) ||
      directoryExists(path.join(resolved, 'platform-tools')) ||
      directoryExists(path.join(resolved, 'cmdline-tools'))
    ) {
      return {
        source: candidate.source,
        value: resolved,
      }
    }
  }

  return {
    source: null,
    value: null,
  }
}

function collectAndroidBuildTools(sdkRoot) {
  if (!sdkRoot) {
    return {
      buildToolsDir: null,
      buildToolsVersion: null,
      missingFiles: ['apksigner', 'zipalign'],
      ready: false,
    }
  }

  const buildToolsRoot = path.join(sdkRoot, 'build-tools')
  let entries
  try {
    entries = fs.readdirSync(buildToolsRoot, { withFileTypes: true })
  } catch {
    return {
      buildToolsDir: null,
      buildToolsVersion: null,
      missingFiles: ['apksigner', 'zipalign'],
      ready: false,
    }
  }

  const versions = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(newestVersionName)

  for (const version of versions) {
    const buildToolsDir = path.join(buildToolsRoot, version)
    const missingFiles = ['apksigner', 'zipalign'].filter(
      (file) => !fileExists(path.join(buildToolsDir, file)),
    )
    if (missingFiles.length === 0) {
      return {
        buildToolsDir,
        buildToolsVersion: version,
        missingFiles,
        ready: true,
      }
    }
  }

  return {
    buildToolsDir: versions[0] ? path.join(buildToolsRoot, versions[0]) : null,
    buildToolsVersion: versions[0] ?? null,
    missingFiles: ['apksigner', 'zipalign'],
    ready: false,
  }
}

function collectAndroidToolchainStatus(runCommand, options = {}) {
  const blockers = []
  const warnings = []
  const sdkRootStatus = detectAndroidSdkRoot(
    options.env,
    options.androidSdkRootCandidates ?? [],
  )
  const buildTools = collectAndroidBuildTools(sdkRootStatus.value)
  const commands = [
    commandProbe(runCommand, {
      args: ['version'],
      command: 'adb',
      id: 'adb',
      label: 'Android Debug Bridge',
      successStatuses: [0],
    }),
    commandProbe(runCommand, {
      args: ['--version'],
      command: 'apksigner',
      id: 'apksigner',
      label: 'APK signer',
      successStatuses: [0],
    }),
    commandProbe(runCommand, {
      args: [],
      command: 'zipalign',
      id: 'zipalign',
      label: 'Zip align',
      successStatuses: [0, 1, 2],
    }),
  ]

  for (const command of commands) {
    if (!command.ready) {
      blockers.push(
        `${command.label} not found or not runnable via ${command.command}.`,
      )
    }
  }

  if (!sdkRootStatus.value) {
    blockers.push(
      'Android SDK root not found; set ANDROID_HOME or ANDROID_SDK_ROOT, or install Android command-line tools.',
    )
  }

  if (!buildTools.ready) {
    blockers.push(
      `Android SDK build-tools are missing ${buildTools.missingFiles.join(', ')}.`,
    )
  }

  if (
    !androidSdkEnvNames.some((name) =>
      envHasValue(options.env ?? process.env, name),
    )
  ) {
    warnings.push(
      'ANDROID_HOME or ANDROID_SDK_ROOT is not set; configure Godot Android export settings with the SDK root before local exports.',
    )
  }

  return {
    blockers,
    buildToolsDir: buildTools.buildToolsDir,
    buildToolsVersion: buildTools.buildToolsVersion,
    commands,
    ready: blockers.length === 0,
    sdkRoot: sdkRootStatus.value,
    sdkRootSource: sdkRootStatus.source,
    warnings,
  }
}

function collectIosToolchainStatus(runCommand) {
  const blockers = []
  const warnings = []
  const commands = []
  let developerDir = null
  let xcodeVersion = null

  const selected = commandProbe(runCommand, {
    args: ['-p'],
    command: 'xcode-select',
    id: 'xcode-select',
    label: 'Xcode selection',
    successStatuses: [0],
  })
  commands.push(selected)
  if (selected.ready) {
    developerDir = selected.detail
    if (/CommandLineTools(?:\/|$)/.test(developerDir ?? '')) {
      blockers.push(
        `Full Xcode is not selected; active developer directory is ${developerDir}.`,
      )
    }
  } else {
    blockers.push('xcode-select is not available or failed.')
  }

  const xcodebuild = commandProbe(runCommand, {
    args: ['-version'],
    command: 'xcodebuild',
    id: 'xcodebuild',
    label: 'Xcode build tools',
    successStatuses: [0],
  })
  commands.push(xcodebuild)
  if (xcodebuild.ready) {
    xcodeVersion = xcodebuild.detail
  } else {
    blockers.push('xcodebuild is not available or failed.')
  }

  const xctrace = commandProbe(runCommand, {
    args: ['--find', 'xctrace'],
    command: 'xcrun',
    id: 'xctrace',
    label: 'xctrace',
    successStatuses: [0],
  })
  commands.push(xctrace)
  if (!xctrace.ready) {
    blockers.push('xcrun cannot locate xctrace.')
  }

  const devicectl = commandProbe(runCommand, {
    args: ['--find', 'devicectl'],
    command: 'xcrun',
    id: 'devicectl',
    label: 'devicectl',
    successStatuses: [0],
  })
  commands.push(devicectl)
  if (!devicectl.ready) {
    blockers.push('xcrun cannot locate devicectl.')
  }

  if (!fs.existsSync('/Applications/Xcode.app')) {
    warnings.push(
      `Full Xcode.app was not found at /Applications/Xcode.app. ${fullXcodeInstallGuidance}`,
    )
  }

  return {
    blockers,
    commands,
    developerDir,
    ready: blockers.length === 0,
    warnings,
    xcodeVersion,
  }
}

export function collectLocalToolchainStatus(options = {}) {
  const runCommand = options.runCommand ?? defaultRunCommand
  const selectedPlatforms = selectedPlatformList(options)

  return {
    android: selectedPlatforms.includes('android')
      ? collectAndroidToolchainStatus(runCommand, options)
      : null,
    ios: selectedPlatforms.includes('ios')
      ? collectIosToolchainStatus(runCommand)
      : null,
  }
}

function readTrimmedFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8').trim()
  } catch {
    return null
  }
}

function checkTemplateFileSet(templatesDir, requiredFiles) {
  const installedFiles = []
  const missingFiles = []

  for (const file of requiredFiles) {
    if (fs.existsSync(path.join(templatesDir, file))) {
      installedFiles.push(file)
    } else {
      missingFiles.push(file)
    }
  }

  return {
    installedFiles,
    missingFiles,
  }
}

function inspectAndroidExportTemplateDir(templatesDir) {
  const { installedFiles, missingFiles } = checkTemplateFileSet(
    templatesDir,
    requiredAndroidExportTemplateFiles,
  )
  const versionText = readTrimmedFile(path.join(templatesDir, 'version.txt'))
  const inferredTemplateVersion =
    versionText && versionText.length > 0
      ? versionText
      : path.basename(templatesDir)

  return {
    installedFiles,
    missingFiles,
    ready: missingFiles.length === 0,
    templateVersion: inferredTemplateVersion,
    templatesDir,
  }
}

function listAndroidExportTemplateCandidates(templatesRoot) {
  let entries
  try {
    entries = fs.readdirSync(templatesRoot, { withFileTypes: true })
  } catch {
    return []
  }

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) =>
      inspectAndroidExportTemplateDir(path.join(templatesRoot, entry.name)),
    )
    .sort(
      (left, right) =>
        Number(right.ready) - Number(left.ready) ||
        right.installedFiles.length - left.installedFiles.length ||
        left.templateVersion.localeCompare(right.templateVersion),
    )
}

function resolveTemplatesRoot(options) {
  if (options.templatesRoot) {
    return path.resolve(repoRoot, options.templatesRoot)
  }

  return defaultGodotExportTemplatesRoot(
    options.hostPlatform ?? process.platform,
    options.env ?? process.env,
    options.homeDir,
  )
}

function collectAndroidExportTemplateStatus(options = {}) {
  const blockers = []
  const warnings = []
  let templatesRoot

  try {
    templatesRoot = resolveTemplatesRoot(options)
  } catch (error) {
    return {
      asset: androidExportTemplateAsset,
      blockers: [
        error instanceof Error
          ? error.message
          : `Unable to resolve Godot export templates root: ${String(error)}`,
      ],
      installCommand: androidExportTemplateInstallCommand,
      installedFiles: [],
      missingFiles: [...requiredAndroidExportTemplateFiles],
      pinnedRelease: pinnedGodotJsRelease,
      ready: false,
      requiredFiles: [...requiredAndroidExportTemplateFiles],
      templateVersion: options.templateVersion?.trim() || null,
      templatesDir: null,
      templatesRoot: null,
      warnings,
    }
  }

  const requestedTemplateVersion = options.templateVersion?.trim() || null
  let inspected = null
  let candidateCount = 0
  if (requestedTemplateVersion) {
    inspected = inspectAndroidExportTemplateDir(
      path.join(templatesRoot, requestedTemplateVersion),
    )
  } else {
    const candidates = listAndroidExportTemplateCandidates(templatesRoot)
    candidateCount = candidates.length
    inspected = candidates[0] ?? null
  }

  if (!inspected) {
    blockers.push(
      `No Android GodotJS export template directory found under ${templatesRoot}.`,
    )
  } else if (!inspected.ready) {
    blockers.push(
      `Android GodotJS export templates are incomplete in ${inspected.templatesDir}; missing ${inspected.missingFiles.join(', ')}.`,
    )
  }

  if (blockers.length > 0) {
    warnings.push(
      `Install the pinned Android templates with: ${androidExportTemplateInstallCommand}`,
    )
  }

  return {
    asset: androidExportTemplateAsset,
    blockers,
    candidateCount,
    installCommand: androidExportTemplateInstallCommand,
    installedFiles: inspected?.installedFiles ?? [],
    missingFiles: inspected?.missingFiles ?? [
      ...requiredAndroidExportTemplateFiles,
    ],
    pinnedRelease: pinnedGodotJsRelease,
    ready: blockers.length === 0,
    requiredFiles: [...requiredAndroidExportTemplateFiles],
    templateVersion: inspected?.templateVersion ?? requestedTemplateVersion,
    templatesDir: inspected?.templatesDir ?? null,
    templatesRoot,
    warnings,
  }
}

function collectIosExportTemplateStatus() {
  return {
    asset: null,
    availableInPinnedRelease: false,
    blockers: [],
    missingFiles: [],
    notes: [
      `Pinned GodotJS release ${pinnedGodotJsRelease} does not publish an iOS export-template asset; use hosted real Apple-device evidence with a matching build pipeline or provide custom iOS templates.`,
    ],
    pinnedRelease: pinnedGodotJsRelease,
    ready: false,
    requiredFiles: [],
    templateVersion: null,
    templatesDir: null,
    templatesRoot: null,
    warnings: [],
  }
}

export function collectExportTemplateStatus(options = {}) {
  const selectedPlatforms = selectedPlatformList(options)

  return {
    android: selectedPlatforms.includes('android')
      ? collectAndroidExportTemplateStatus(options)
      : null,
    ios: selectedPlatforms.includes('ios')
      ? collectIosExportTemplateStatus()
      : null,
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
    exportTemplates: null,
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
  summary.exportTemplates = collectExportTemplateStatus({
    env,
    homeDir: options.homeDir,
    hostPlatform: options.hostPlatform,
    selectedPlatforms,
    templateVersion: options.templateVersion,
    templatesRoot: options.templatesRoot,
  })
  summary.toolchains =
    options.includeToolchains === false
      ? null
      : collectLocalToolchainStatus({
          androidSdkRootCandidates: options.androidSdkRootCandidates,
          env,
          platform: options.platform,
          runCommand,
          selectedPlatforms,
        })

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

function exportTemplateState(status) {
  if (status.ready) {
    return 'ready'
  }

  if (status.availableInPinnedRelease === false) {
    return 'unavailable'
  }

  return 'waiting'
}

function formatExportTemplateStatus(label, status) {
  if (!status) {
    return []
  }

  const lines = [
    `[device-prereqs] ${label} export templates: ${exportTemplateState(status)}`,
    `[device-prereqs] ${label} export templates pinned release: ${status.pinnedRelease}`,
  ]

  if (status.asset) {
    lines.push(
      `[device-prereqs] ${label} export templates asset: ${status.asset}`,
    )
  }
  if (status.templatesRoot) {
    lines.push(
      `[device-prereqs] ${label} export templates root: ${status.templatesRoot}`,
    )
  }
  if (status.templatesDir) {
    lines.push(
      `[device-prereqs] ${label} export templates dir: ${status.templatesDir}`,
    )
  }
  if (status.templateVersion) {
    lines.push(
      `[device-prereqs] ${label} export templates version: ${status.templateVersion}`,
    )
  }
  if (status.missingFiles?.length > 0) {
    lines.push(
      `[device-prereqs] ${label} export templates missing files: ${status.missingFiles.join(', ')}`,
    )
  }
  for (const note of status.notes ?? []) {
    lines.push(`[device-prereqs] export template note: ${note}`)
  }
  for (const warning of status.warnings ?? []) {
    lines.push(`[device-prereqs] export template warning: ${warning}`)
  }
  for (const blocker of status.blockers ?? []) {
    lines.push(`[device-prereqs] export template blocker: ${blocker}`)
  }

  return lines
}

function formatToolchainStatus(label, status) {
  if (!status) {
    return []
  }

  const lines = [
    `[device-prereqs] ${label} toolchain: ${status.ready ? 'ready' : 'waiting'}`,
  ]

  if (status.sdkRoot) {
    lines.push(`[device-prereqs] ${label} SDK root: ${status.sdkRoot}`)
  }
  if (status.sdkRootSource) {
    lines.push(
      `[device-prereqs] ${label} SDK root source: ${status.sdkRootSource}`,
    )
  }
  if (status.buildToolsVersion) {
    lines.push(
      `[device-prereqs] ${label} build-tools version: ${status.buildToolsVersion}`,
    )
  }
  if (status.buildToolsDir) {
    lines.push(
      `[device-prereqs] ${label} build-tools dir: ${status.buildToolsDir}`,
    )
  }
  if (status.developerDir) {
    lines.push(
      `[device-prereqs] ${label} developer dir: ${status.developerDir}`,
    )
  }
  if (status.xcodeVersion) {
    lines.push(
      `[device-prereqs] ${label} Xcode version: ${status.xcodeVersion}`,
    )
  }
  for (const command of status.commands ?? []) {
    lines.push(
      `[device-prereqs] ${label} toolchain command: ${command.label} ${command.ready ? 'ready' : 'waiting'} (${command.command})${command.detail ? ` - ${command.detail}` : ''}`,
    )
  }
  for (const warning of status.warnings ?? []) {
    lines.push(`[device-prereqs] toolchain warning: ${warning}`)
  }
  for (const blocker of status.blockers ?? []) {
    lines.push(`[device-prereqs] toolchain blocker: ${blocker}`)
  }

  return lines
}

function printText(summary) {
  const lines = [
    `[device-prereqs] status: ${summary.ready ? 'ready' : 'waiting'}`,
    ...formatPlatformStatus('Android', summary.android),
    ...formatPlatformStatus('iOS', summary.ios),
    ...formatToolchainStatus('Android', summary.toolchains?.android),
    ...formatToolchainStatus('iOS', summary.toolchains?.ios),
    ...formatExportTemplateStatus('Android', summary.exportTemplates?.android),
    ...formatExportTemplateStatus('iOS', summary.exportTemplates?.ios),
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
      templateVersion: options.templateVersion,
      templatesRoot: options.templatesRoot,
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
