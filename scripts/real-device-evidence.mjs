import fs from 'node:fs'
import path from 'node:path'
import { releasePackageConfigs, repoRoot } from './release-utils.mjs'

export const realDeviceEvidenceEnvVar = 'VUE_GODOT_REAL_DEVICE_EVIDENCE'
export const defaultRealDeviceEvidencePath = 'release/real-device-evidence.json'

export const requiredRealDeviceChecks = {
  android: [
    'cold-launch',
    'no-godotjs-load-diagnostics',
    'storage-restart',
    'network-if-selected',
    'permission-prompts-if-selected',
    'adapter-states-if-selected',
    'hardware-adapters-if-selected',
    'safe-area-keyboard',
    'android-back-handling',
    'background-foreground',
  ],
  ios: [
    'cold-launch',
    'no-godotjs-load-diagnostics',
    'plist-entitlements',
    'storage-restart',
    'network-if-selected',
    'permission-prompts-if-selected',
    'adapter-states-if-selected',
    'hardware-adapters-if-selected',
    'safe-area-keyboard-rotation-text-input',
    'background-foreground',
    'deep-links-share-notifications-if-selected',
  ],
}

export function resolveRealDeviceEvidencePath(env = process.env) {
  const configured = env[realDeviceEvidenceEnvVar]
  return path.resolve(repoRoot, configured || defaultRealDeviceEvidencePath)
}

export function readRealDeviceEvidence(evidencePath) {
  if (!fs.existsSync(evidencePath)) {
    return {
      evidence: null,
      errors: [`Real device evidence file not found: ${evidencePath}`],
    }
  }

  try {
    return {
      evidence: JSON.parse(fs.readFileSync(evidencePath, 'utf-8')),
      errors: [],
    }
  } catch (error) {
    return {
      evidence: null,
      errors: [
        `Real device evidence file is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
      ],
    }
  }
}

function isRecord(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}

function hasNonEmptyString(record, key) {
  return typeof record[key] === 'string' && record[key].trim().length > 0
}

function hasUrlString(record, key) {
  return hasNonEmptyString(record, key) && /^https?:\/\//.test(record[key])
}

function assertString(record, key, errors, label) {
  if (!hasNonEmptyString(record, key)) {
    errors.push(`${label}.${key} must be a non-empty string`)
  }
}

function assertUrl(record, key, errors, label) {
  if (!hasUrlString(record, key)) {
    errors.push(`${label}.${key} must be an http(s) URL`)
  }
}

function assertSuccessConclusion(record, key, errors, label) {
  if (record[key] !== 'success') {
    errors.push(`${label}.${key} must be "success"`)
  }
}

function validatePlatformEvidence(evidence, platform, errors) {
  const platformEvidence = evidence[platform]
  if (!isRecord(platformEvidence)) {
    errors.push(`${platform} evidence must be an object`)
    return
  }

  for (const key of [
    'artifact',
    'exportPreset',
    'deviceModel',
    'osVersion',
    'orientation',
    'locale',
  ]) {
    assertString(platformEvidence, key, errors, platform)
  }

  if (
    !Array.isArray(platformEvidence.selectedApis) ||
    platformEvidence.selectedApis.length === 0 ||
    platformEvidence.selectedApis.some(
      (api) => typeof api !== 'string' || api.trim() === '',
    )
  ) {
    errors.push(`${platform}.selectedApis must be a non-empty string array`)
  }

  const passedChecks = new Set(
    Array.isArray(platformEvidence.passedChecks)
      ? platformEvidence.passedChecks.filter(
          (check) => typeof check === 'string',
        )
      : [],
  )
  const skippedChecks = isRecord(platformEvidence.skippedChecks)
    ? platformEvidence.skippedChecks
    : {}

  for (const check of requiredRealDeviceChecks[platform]) {
    const skipReason = skippedChecks[check]
    const hasSkipReason =
      typeof skipReason === 'string' && skipReason.trim().length > 0
    if (!passedChecks.has(check) && !hasSkipReason) {
      errors.push(
        `${platform} must pass ${check} or document a skippedChecks.${check} reason`,
      )
    }
  }
}

export function validateRealDeviceEvidence(evidence, options = {}) {
  const errors = []

  if (!isRecord(evidence)) {
    return ['Real device evidence must be a JSON object']
  }

  assertString(evidence, 'commit', errors, 'evidence')
  assertString(evidence, 'godotJsVersion', errors, 'evidence')
  assertUrl(evidence, 'checkRunUrl', errors, 'evidence')
  assertString(evidence, 'checkRunCommit', errors, 'evidence')
  assertSuccessConclusion(evidence, 'checkRunConclusion', errors, 'evidence')
  assertUrl(evidence, 'godotSmokeRunUrl', errors, 'evidence')
  assertString(evidence, 'godotSmokeRunCommit', errors, 'evidence')
  assertSuccessConclusion(
    evidence,
    'godotSmokeRunConclusion',
    errors,
    'evidence',
  )

  if (
    options.expectedCommit &&
    hasNonEmptyString(evidence, 'commit') &&
    evidence.commit !== options.expectedCommit
  ) {
    errors.push(
      `evidence.commit must match current commit ${options.expectedCommit}`,
    )
  }

  if (hasNonEmptyString(evidence, 'commit')) {
    for (const key of ['checkRunCommit', 'godotSmokeRunCommit']) {
      if (
        hasNonEmptyString(evidence, key) &&
        evidence[key] !== evidence.commit
      ) {
        errors.push(`${key} must match evidence.commit ${evidence.commit}`)
      }
    }
  }

  if (!isRecord(evidence.packageVersions)) {
    errors.push('evidence.packageVersions must be an object')
  } else {
    for (const config of releasePackageConfigs) {
      if (!hasNonEmptyString(evidence.packageVersions, config.name)) {
        errors.push(
          `evidence.packageVersions.${config.name} must be a non-empty string`,
        )
      }
    }
  }

  validatePlatformEvidence(evidence, 'android', errors)
  validatePlatformEvidence(evidence, 'ios', errors)

  return errors
}

export function describeRealDeviceEvidencePath(evidencePath) {
  return path.relative(repoRoot, evidencePath) || evidencePath
}
