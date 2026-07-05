import fs from 'node:fs'
import path from 'node:path'
import {
  assertExactString,
  assertGitHubActionsRunUrl,
  hasNonEmptyString,
  isRecord,
  verifyGitHubActionsRunUrl,
} from './release-evidence-utils.mjs'
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

export const passOnlyRealDeviceChecks = {
  android: [
    'cold-launch',
    'no-godotjs-load-diagnostics',
    'storage-restart',
    'android-back-handling',
    'background-foreground',
  ],
  ios: [
    'cold-launch',
    'no-godotjs-load-diagnostics',
    'plist-entitlements',
    'storage-restart',
    'background-foreground',
  ],
}

export const realDeviceWorksheetFields = [
  'requiredChecks',
  'passOnlyChecks',
  'selectedApiRequiredChecks',
]

export const selectedApiRequiredRealDeviceChecks = {
  fetch: {
    all: ['network-if-selected'],
  },
  WebSocket: {
    all: ['network-if-selected'],
  },
  checkNetworkReachability: {
    all: ['network-if-selected'],
  },
  'navigator.onLine': {
    all: ['network-if-selected'],
  },
  localStorage: {
    all: ['storage-restart'],
  },
  sessionStorage: {
    all: ['storage-restart'],
  },
  'navigator.geolocation': {
    all: [
      'permission-prompts-if-selected',
      'adapter-states-if-selected',
      'hardware-adapters-if-selected',
    ],
  },
  'navigator.mediaDevices.getUserMedia': {
    all: [
      'permission-prompts-if-selected',
      'adapter-states-if-selected',
      'hardware-adapters-if-selected',
    ],
  },
  CameraView: {
    all: [
      'permission-prompts-if-selected',
      'adapter-states-if-selected',
      'hardware-adapters-if-selected',
    ],
  },
  Notification: {
    all: ['permission-prompts-if-selected', 'adapter-states-if-selected'],
    ios: ['deep-links-share-notifications-if-selected'],
  },
  NotificationAdapter: {
    all: ['permission-prompts-if-selected', 'adapter-states-if-selected'],
    ios: ['deep-links-share-notifications-if-selected'],
  },
  showNativeNotification: {
    all: ['permission-prompts-if-selected', 'adapter-states-if-selected'],
    ios: ['deep-links-share-notifications-if-selected'],
  },
  DeepLinkAdapter: {
    all: ['adapter-states-if-selected'],
    ios: ['deep-links-share-notifications-if-selected'],
  },
  readInitialOpenUrl: {
    all: ['adapter-states-if-selected'],
    ios: ['deep-links-share-notifications-if-selected'],
  },
  onOpenUrl: {
    all: ['adapter-states-if-selected'],
    ios: ['deep-links-share-notifications-if-selected'],
  },
  ShareAdapter: {
    all: ['adapter-states-if-selected'],
    ios: ['deep-links-share-notifications-if-selected'],
  },
  share: {
    all: ['adapter-states-if-selected'],
    ios: ['deep-links-share-notifications-if-selected'],
  },
  'navigator.vibrate': {
    android: ['permission-prompts-if-selected'],
  },
  SafeAreaView: {
    android: ['safe-area-keyboard'],
    ios: ['safe-area-keyboard-rotation-text-input'],
  },
  KeyboardAvoidingView: {
    android: ['safe-area-keyboard'],
    ios: ['safe-area-keyboard-rotation-text-input'],
  },
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

function assertString(record, key, errors, label) {
  if (!hasNonEmptyString(record, key)) {
    errors.push(`${label}.${key} must be a non-empty string`)
  }
}

function assertSuccessConclusion(record, key, errors, label) {
  if (record[key] !== 'success') {
    errors.push(`${label}.${key} must be "success"`)
  }
}

function selectedApiChecks(apiName, platform) {
  const requirements = selectedApiRequiredRealDeviceChecks[apiName]
  if (!isRecord(requirements)) {
    return []
  }

  return [
    ...(Array.isArray(requirements.all) ? requirements.all : []),
    ...(Array.isArray(requirements[platform]) ? requirements[platform] : []),
  ]
}

export function selectedApiRequiredCheckMap(selectedApis, platform) {
  const checks = new Map()
  for (const apiName of selectedApis) {
    for (const check of selectedApiChecks(apiName, platform)) {
      const apiNames = checks.get(check) ?? []
      apiNames.push(apiName)
      checks.set(check, apiNames)
    }
  }

  return checks
}

function validateCheckNames(platform, passedChecks, skippedChecks, errors) {
  const requiredChecks = new Set(requiredRealDeviceChecks[platform])
  for (const check of passedChecks) {
    if (!requiredChecks.has(check)) {
      errors.push(`${platform}.passedChecks contains unknown check ${check}`)
    }
  }

  for (const check of Object.keys(skippedChecks)) {
    if (!requiredChecks.has(check)) {
      errors.push(`${platform}.skippedChecks contains unknown check ${check}`)
    }
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

  for (const field of realDeviceWorksheetFields) {
    if (field in platformEvidence) {
      errors.push(
        `${platform}.${field} is a platform-evidence worksheet field; remove it from final real-device evidence with npm run release:evidence`,
      )
    }
  }

  const selectedApisValid =
    Array.isArray(platformEvidence.selectedApis) &&
    platformEvidence.selectedApis.length > 0 &&
    platformEvidence.selectedApis.every(
      (api) => typeof api === 'string' && api.trim() !== '',
    )

  if (
    !Array.isArray(platformEvidence.selectedApis) ||
    platformEvidence.selectedApis.length === 0 ||
    platformEvidence.selectedApis.some(
      (api) => typeof api !== 'string' || api.trim() === '',
    )
  ) {
    errors.push(`${platform}.selectedApis must be a non-empty string array`)
  }
  const selectedApis = selectedApisValid
    ? [...new Set(platformEvidence.selectedApis.map((api) => api.trim()))]
    : []

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

  validateCheckNames(platform, passedChecks, skippedChecks, errors)

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

  for (const check of passOnlyRealDeviceChecks[platform]) {
    if (!passedChecks.has(check)) {
      errors.push(`${platform}.${check} must be in passedChecks`)
    }
  }

  const selectedApiChecks = selectedApiRequiredCheckMap(selectedApis, platform)
  for (const [check, apiNames] of selectedApiChecks) {
    if (!passedChecks.has(check)) {
      errors.push(
        `${platform}.${check} must be in passedChecks because selectedApis includes ${apiNames.join(', ')}`,
      )
    }
  }
}

export function validateRealDeviceEvidenceMetadata(evidence, options = {}) {
  const errors = []

  if (!isRecord(evidence)) {
    return ['Real device evidence must be a JSON object']
  }

  assertString(evidence, 'commit', errors, 'evidence')
  assertString(evidence, 'godotJsVersion', errors, 'evidence')
  assertGitHubActionsRunUrl(evidence, 'checkRunUrl', errors, 'evidence')
  assertExactString(
    evidence,
    'checkRunWorkflowName',
    'Check',
    errors,
    'evidence',
  )
  assertString(evidence, 'checkRunCommit', errors, 'evidence')
  assertSuccessConclusion(evidence, 'checkRunConclusion', errors, 'evidence')
  assertGitHubActionsRunUrl(evidence, 'godotSmokeRunUrl', errors, 'evidence')
  assertExactString(
    evidence,
    'godotSmokeRunWorkflowName',
    'Godot Smoke',
    errors,
    'evidence',
  )
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
    const expectedPackageVersions = isRecord(options.expectedPackageVersions)
      ? options.expectedPackageVersions
      : null

    for (const config of releasePackageConfigs) {
      if (!hasNonEmptyString(evidence.packageVersions, config.name)) {
        errors.push(
          `evidence.packageVersions.${config.name} must be a non-empty string`,
        )
        continue
      }

      const expectedVersion = expectedPackageVersions?.[config.name]
      if (
        typeof expectedVersion === 'string' &&
        evidence.packageVersions[config.name] !== expectedVersion
      ) {
        errors.push(
          `evidence.packageVersions.${config.name} must match current package version ${expectedVersion}`,
        )
      }
    }
  }

  return errors
}

export function validateRealDevicePlatformEvidence(evidence, platform) {
  if (!isRecord(evidence)) {
    return ['Real device evidence must be a JSON object']
  }

  if (!['android', 'ios'].includes(platform)) {
    return [`Unknown real-device evidence platform: ${platform}`]
  }

  const errors = []
  validatePlatformEvidence(evidence, platform, errors)
  return errors
}

export function validateRealDeviceEvidence(evidence, options = {}) {
  const errors = validateRealDeviceEvidenceMetadata(evidence, options)
  if (!isRecord(evidence)) {
    return errors
  }

  errors.push(
    ...validateRealDevicePlatformEvidence(evidence, 'android'),
    ...validateRealDevicePlatformEvidence(evidence, 'ios'),
  )

  return errors
}

export async function verifyRealDeviceEvidenceRuns(evidence, options = {}) {
  const specs = [
    {
      urlKey: 'checkRunUrl',
      workflowName: 'Check',
      label: 'evidence.checkRunUrl',
    },
    {
      urlKey: 'godotSmokeRunUrl',
      workflowName: 'Godot Smoke',
      label: 'evidence.godotSmokeRunUrl',
    },
  ]
  const errors = []

  for (const spec of specs) {
    errors.push(
      ...(await verifyGitHubActionsRunUrl(
        evidence[spec.urlKey],
        {
          label: spec.label,
          workflowName: spec.workflowName,
          commit: evidence.commit,
          conclusion: 'success',
        },
        options,
      )),
    )
  }

  return errors
}

export function describeRealDeviceEvidencePath(evidencePath) {
  return path.relative(repoRoot, evidencePath) || evidencePath
}
