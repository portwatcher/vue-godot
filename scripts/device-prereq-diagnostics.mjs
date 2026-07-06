import fs from 'node:fs'
import path from 'node:path'
import { isRecord } from './release-evidence-utils.mjs'
import { defaultDeviceTestPrereqsSummaryPath } from './release-handoff-commands.mjs'
import { repoRoot } from './release-utils.mjs'

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
  diagnostic.hostedProviders = normalizeHostedDeviceProviders(summary)
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
