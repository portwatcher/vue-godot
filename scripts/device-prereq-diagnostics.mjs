import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { isRecord } from './release-evidence-utils.mjs'
import { defaultDeviceTestPrereqsSummaryPath } from './release-handoff-commands.mjs'
import { repoRoot } from './release-utils.mjs'
import { splitIssueLines } from './markdown-checklist-utils.mjs'

function relative(filePath) {
  const relativePath = path.relative(repoRoot, filePath)
  return relativePath.length > 0 ? relativePath : '.'
}

function stringList(values) {
  if (!Array.isArray(values)) {
    return []
  }

  return values
    .filter((value) => typeof value === 'string')
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
}

function devicePrereqPlatformStatus(summary, platform) {
  const status = isRecord(summary?.[platform]) ? summary[platform] : null
  if (!status) {
    return null
  }

  const blockers = stringList(status.blockers)
  const warnings = stringList(status.warnings)
  const devices = Array.isArray(status.devices) ? status.devices : []
  const command =
    typeof status.command === 'string' && status.command.trim().length > 0
      ? status.command.trim()
      : null

  return {
    blockerCount: blockers.length,
    blockers,
    command,
    deviceCount: devices.length,
    ready: status.ready === true,
    warningCount: warnings.length,
    warnings,
  }
}

function optionalString(value) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : null
}

function nullableBoolean(value) {
  if (typeof value === 'boolean') {
    return value
  }

  return null
}

function exportTemplatePlatformStatus(summary, platform) {
  const exportTemplates = isRecord(summary.exportTemplates)
    ? summary.exportTemplates
    : {}
  const status = isRecord(exportTemplates[platform])
    ? exportTemplates[platform]
    : null
  if (!status) {
    return null
  }

  const blockers = stringList(status.blockers)
  const warnings = stringList(status.warnings)
  const notes = stringList(status.notes)
  const missingFiles = stringList(status.missingFiles)

  return {
    asset: optionalString(status.asset),
    availableInPinnedRelease: nullableBoolean(status.availableInPinnedRelease),
    blockerCount: blockers.length,
    blockers,
    candidateCount: Number.isInteger(status.candidateCount)
      ? status.candidateCount
      : null,
    installedFiles: stringList(status.installedFiles),
    installCommand: optionalString(status.installCommand),
    missingFiles,
    missingFileCount: missingFiles.length,
    notes,
    pinnedRelease: optionalString(status.pinnedRelease),
    ready: status.ready === true,
    requiredFiles: stringList(status.requiredFiles),
    templateVersion: optionalString(status.templateVersion),
    templatesDir: optionalString(status.templatesDir),
    templatesRoot: optionalString(status.templatesRoot),
    warningCount: warnings.length,
    warnings,
  }
}

function exportTemplateDiagnostics(summary) {
  return {
    android: exportTemplatePlatformStatus(summary, 'android'),
    ios: exportTemplatePlatformStatus(summary, 'ios'),
  }
}

function toolchainCommands(values) {
  if (!Array.isArray(values)) {
    return []
  }

  return values.filter(isRecord).map((command) => ({
    command: optionalString(command.command),
    detail: optionalString(command.detail),
    id: optionalString(command.id),
    label: optionalString(command.label) ?? 'unknown command',
    ready: command.ready === true,
    status: Number.isInteger(command.status) ? command.status : null,
  }))
}

function toolchainPlatformStatus(summary, platform) {
  const toolchains = isRecord(summary.toolchains) ? summary.toolchains : {}
  const status = isRecord(toolchains[platform]) ? toolchains[platform] : null
  if (!status) {
    return null
  }

  const blockers = stringList(status.blockers)
  const warnings = stringList(status.warnings)
  const commands = toolchainCommands(status.commands)

  return {
    blockerCount: blockers.length,
    blockers,
    buildToolsDir: optionalString(status.buildToolsDir),
    buildToolsVersion: optionalString(status.buildToolsVersion),
    commandCount: commands.length,
    commands,
    developerDir: optionalString(status.developerDir),
    ready: status.ready === true,
    sdkRoot: optionalString(status.sdkRoot),
    sdkRootSource: optionalString(status.sdkRootSource),
    warningCount: warnings.length,
    warnings,
    xcodeVersion: optionalString(status.xcodeVersion),
  }
}

function toolchainDiagnostics(summary) {
  return {
    android: toolchainPlatformStatus(summary, 'android'),
    ios: toolchainPlatformStatus(summary, 'ios'),
  }
}

function providerText(provider, key, fallback) {
  const value = provider[key]
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : fallback
}

function normalizeHostedDeviceProviders(summary) {
  const hostedProviders = isRecord(summary.hostedProviders)
    ? summary.hostedProviders
    : {}
  const providers = Array.isArray(hostedProviders.providers)
    ? hostedProviders.providers.filter(isRecord)
    : []

  return {
    anyConfigured: hostedProviders.anyConfigured === true,
    configuredProviders: providers
      .filter((provider) => provider.configured === true)
      .map((provider) => ({
        configuredEnv: stringList(provider.configuredEnv),
        id: providerText(provider, 'id', 'unknown-provider'),
        label: providerText(provider, 'label', 'Unknown provider'),
      })),
    partialProviders: providers
      .filter((provider) => provider.partiallyConfigured === true)
      .map((provider) => ({
        id: providerText(provider, 'id', 'unknown-provider'),
        label: providerText(provider, 'label', 'Unknown provider'),
        missingEnv: stringList(provider.missingEnv),
        partialEnv: stringList(provider.partialEnv),
      })),
    providerCount: providers.length,
  }
}

export function collectDevicePrereqDiagnostics(options) {
  const configuredPath =
    options.devicePrereqsSummaryPath ?? defaultDeviceTestPrereqsSummaryPath
  const resolvedPath = path.resolve(repoRoot, configuredPath)
  const diagnostic = {
    android: null,
    diagnosticOnly: true,
    exportTemplates: {
      android: null,
      ios: null,
    },
    hostedProviders: {
      anyConfigured: false,
      configuredProviders: [],
      partialProviders: [],
      providerCount: 0,
    },
    ios: null,
    path: relative(resolvedPath),
    readErrors: [],
    ready: null,
    selectedPlatforms: [],
    summaryPresent: false,
    toolchains: {
      android: null,
      ios: null,
    },
  }

  if (!fs.existsSync(resolvedPath)) {
    return diagnostic
  }

  diagnostic.summaryPresent = true
  let summary
  try {
    summary = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'))
  } catch (error) {
    diagnostic.ready = false
    diagnostic.readErrors.push(
      `Device prereq summary is not valid JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    return diagnostic
  }

  if (!isRecord(summary)) {
    diagnostic.ready = false
    diagnostic.readErrors.push('Device prereq summary must be a JSON object')
    return diagnostic
  }

  diagnostic.ready = summary.ready === true
  diagnostic.selectedPlatforms = stringList(summary.selectedPlatforms)
  diagnostic.android = devicePrereqPlatformStatus(summary, 'android')
  diagnostic.ios = devicePrereqPlatformStatus(summary, 'ios')
  diagnostic.exportTemplates = exportTemplateDiagnostics(summary)
  diagnostic.hostedProviders = normalizeHostedDeviceProviders(summary)
  diagnostic.toolchains = toolchainDiagnostics(summary)
  return diagnostic
}

export function devicePrereqStatusText(value) {
  if (value === true) {
    return 'ready'
  }
  if (value === false) {
    return 'waiting'
  }
  return 'not recorded'
}

export function devicePrereqProviderLabel(provider) {
  if (!isRecord(provider)) {
    return 'unknown provider'
  }

  if (typeof provider.label === 'string' && provider.label.trim().length > 0) {
    return provider.label.trim()
  }

  if (typeof provider.id === 'string' && provider.id.trim().length > 0) {
    return provider.id.trim()
  }

  return 'unknown provider'
}

function formatDiagnosticValue(value) {
  if (typeof value === 'boolean') {
    return value ? 'yes' : 'no'
  }

  if (Number.isInteger(value)) {
    return String(value)
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim()
  }

  return 'missing'
}

function formatDiagnosticCount(value, missing) {
  return Number.isInteger(value) ? String(value) : missing
}

function inlineDiagnosticList(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return 'none'
  }

  return values.map((value) => `\`${String(value)}\``).join(', ')
}

function providerEnvValues(provider, key) {
  return isRecord(provider) ? provider[key] : []
}

function formatConfiguredProvider(provider) {
  return `${devicePrereqProviderLabel(provider)} (${inlineDiagnosticList(
    providerEnvValues(provider, 'configuredEnv'),
  )})`
}

function formatPartialProvider(provider) {
  return `${devicePrereqProviderLabel(provider)} (set: ${inlineDiagnosticList(
    providerEnvValues(provider, 'partialEnv'),
  )}; missing: ${inlineDiagnosticList(providerEnvValues(provider, 'missingEnv'))})`
}

function formatNestedDiagnosticIssues(label, values) {
  const lines = splitIssueLines(values)
  if (lines.length === 0) {
    return []
  }

  return [`  - ${label}:`, ...lines.map((line) => `    - ${line}`)]
}

function formatReadErrorLines(values) {
  const lines = splitIssueLines(values)
  if (lines.length === 0) {
    return ['- Read errors: none']
  }

  return ['- Read errors:', ...lines.map((line) => `  - ${line}`)]
}

function portableLocalPath(value) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null
  }

  const trimmed = value.trim()
  const homeDir = os.homedir()
  if (!homeDir) {
    return trimmed
  }

  if (trimmed === homeDir) {
    return '~'
  }

  const relativeToHome = path.relative(homeDir, trimmed)
  if (!relativeToHome.startsWith('..') && !path.isAbsolute(relativeToHome)) {
    return `~/${relativeToHome.split(path.sep).join('/')}`
  }

  return trimmed
}

function formatPlatformDiagnosticLines(label, status, { countMissing }) {
  if (!isRecord(status)) {
    return [`- ${label}: not recorded`]
  }

  const command =
    typeof status.command === 'string' && status.command.trim().length > 0
      ? status.command.trim()
      : null
  const lines = [
    [
      `- ${label}: ${devicePrereqStatusText(status.ready)}`,
      ` (${formatDiagnosticCount(status.blockerCount, countMissing)} blocker(s),`,
      ` ${formatDiagnosticCount(status.warningCount, countMissing)} warning(s),`,
      ` ${formatDiagnosticCount(status.deviceCount, countMissing)} device(s))`,
    ].join(''),
  ]

  if (command) {
    lines.push(`  - Command: \`${command}\``)
  }

  lines.push(
    ...formatNestedDiagnosticIssues('Blockers', status.blockers),
    ...formatNestedDiagnosticIssues('Warnings', status.warnings),
  )

  return lines
}

function exportTemplateStatusText(status) {
  if (!isRecord(status)) {
    return null
  }

  if (status.ready === true) {
    return 'ready'
  }

  if (status.availableInPinnedRelease === false) {
    return 'unavailable'
  }

  return 'waiting'
}

function formatCommandDiagnosticLine(command) {
  const state = command.ready ? 'ready' : 'waiting'
  const renderedCommand = command.command ? ` (\`${command.command}\`)` : ''
  const detail = command.detail ? ` - ${command.detail}` : ''
  return `    - ${command.label}: ${state}${renderedCommand}${detail}`
}

function formatToolchainDiagnosticLines(label, status, { formatPath }) {
  if (!isRecord(status)) {
    return []
  }

  const lines = [
    [
      `- ${label}: ${devicePrereqStatusText(status.ready)}`,
      ` (${formatDiagnosticCount(status.blockerCount, 'missing')} blocker(s),`,
      ` ${formatDiagnosticCount(status.warningCount, 'missing')} warning(s),`,
      ` ${formatDiagnosticCount(status.commandCount, 'missing')} command(s))`,
    ].join(''),
  ]

  const sdkRoot = portableLocalPath(status.sdkRoot)
  if (sdkRoot) {
    lines.push(`  - SDK root: ${formatPath(sdkRoot)}`)
  }
  if (status.sdkRootSource) {
    lines.push(`  - SDK root source: \`${status.sdkRootSource}\``)
  }
  if (status.buildToolsVersion) {
    lines.push(`  - Build-tools version: \`${status.buildToolsVersion}\``)
  }
  const buildToolsDir = portableLocalPath(status.buildToolsDir)
  if (buildToolsDir) {
    lines.push(`  - Build-tools dir: ${formatPath(buildToolsDir)}`)
  }
  const developerDir = portableLocalPath(status.developerDir)
  if (developerDir) {
    lines.push(`  - Developer dir: ${formatPath(developerDir)}`)
  }
  if (status.xcodeVersion) {
    lines.push(`  - Xcode version: \`${status.xcodeVersion}\``)
  }
  if (Array.isArray(status.commands) && status.commands.length > 0) {
    lines.push(
      '  - Commands:',
      ...status.commands.map(formatCommandDiagnosticLine),
    )
  }

  lines.push(
    ...formatNestedDiagnosticIssues('Blockers', status.blockers),
    ...formatNestedDiagnosticIssues('Warnings', status.warnings),
  )

  return lines
}

function formatExportTemplateDiagnosticLines(label, status, { formatPath }) {
  const state = exportTemplateStatusText(status)
  if (state === null) {
    return []
  }

  const lines = [
    [
      `- ${label}: ${state}`,
      ` (${formatDiagnosticCount(status.blockerCount, 'missing')} blocker(s),`,
      ` ${formatDiagnosticCount(status.warningCount, 'missing')} warning(s),`,
      ` ${formatDiagnosticCount(status.missingFileCount, 'missing')} missing file(s))`,
    ].join(''),
  ]

  if (status.pinnedRelease) {
    lines.push(`  - Pinned release: \`${status.pinnedRelease}\``)
  }
  if (status.asset) {
    lines.push(`  - Asset: \`${status.asset}\``)
  }
  const templatesRoot = portableLocalPath(status.templatesRoot)
  if (templatesRoot) {
    lines.push(`  - Templates root: ${formatPath(templatesRoot)}`)
  }
  const templatesDir = portableLocalPath(status.templatesDir)
  if (templatesDir) {
    lines.push(`  - Templates dir: ${formatPath(templatesDir)}`)
  }
  if (status.templateVersion) {
    lines.push(`  - Template version: \`${status.templateVersion}\``)
  }
  if (Array.isArray(status.missingFiles) && status.missingFiles.length > 0) {
    lines.push(
      `  - Missing files: ${inlineDiagnosticList(status.missingFiles)}`,
    )
  }
  if (status.installCommand) {
    lines.push(`  - Install command: \`${status.installCommand}\``)
  }

  lines.push(
    ...formatNestedDiagnosticIssues('Notes', status.notes),
    ...formatNestedDiagnosticIssues('Blockers', status.blockers),
    ...formatNestedDiagnosticIssues('Warnings', status.warnings),
  )

  return lines
}

export function formatDevicePrereqDiagnosticLines(
  devicePrereqs,
  {
    countMissing = 'missing',
    formatPath = formatDiagnosticValue,
    pathFallback = null,
  } = {},
) {
  const diagnostics = isRecord(devicePrereqs) ? devicePrereqs : {}
  const hostedProviders = isRecord(diagnostics.hostedProviders)
    ? diagnostics.hostedProviders
    : {}
  const configuredProviders = Array.isArray(hostedProviders.configuredProviders)
    ? hostedProviders.configuredProviders
    : []
  const partialProviders = Array.isArray(hostedProviders.partialProviders)
    ? hostedProviders.partialProviders
    : []
  const summaryPath = diagnostics.path ?? pathFallback

  return [
    '## Device Prereq Diagnostics',
    '',
    '- Diagnostic only: yes; this is not release evidence',
    `- Summary path: ${formatPath(summaryPath)}`,
    `- Summary present: ${formatDiagnosticValue(diagnostics.summaryPresent)}`,
    `- Status: ${devicePrereqStatusText(diagnostics.ready)}`,
    `- Selected platforms: ${inlineDiagnosticList(
      diagnostics.selectedPlatforms,
    )}`,
    ...formatPlatformDiagnosticLines('Android', diagnostics.android, {
      countMissing,
    }),
    ...formatPlatformDiagnosticLines('iOS', diagnostics.ios, {
      countMissing,
    }),
    ...formatToolchainDiagnosticLines(
      'Android toolchain',
      diagnostics.toolchains?.android,
      { formatPath },
    ),
    ...formatToolchainDiagnosticLines(
      'iOS toolchain',
      diagnostics.toolchains?.ios,
      { formatPath },
    ),
    ...formatExportTemplateDiagnosticLines(
      'Android export templates',
      diagnostics.exportTemplates?.android,
      { formatPath },
    ),
    ...formatExportTemplateDiagnosticLines(
      'iOS export templates',
      diagnostics.exportTemplates?.ios,
      { formatPath },
    ),
    `- Hosted provider env configured: ${
      configuredProviders.length > 0
        ? configuredProviders.map(formatConfiguredProvider).join('; ')
        : 'none'
    }`,
    `- Hosted provider env partial: ${
      partialProviders.length > 0
        ? partialProviders.map(formatPartialProvider).join('; ')
        : 'none'
    }`,
    ...formatReadErrorLines(diagnostics.readErrors),
  ]
}
