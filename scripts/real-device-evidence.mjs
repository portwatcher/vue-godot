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
    'clipboard-if-selected',
    'permission-prompts-if-selected',
    'adapter-states-if-selected',
    'hardware-adapters-if-selected',
    'haptics-if-selected',
    'audio-input-if-selected',
    'sensors-if-selected',
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
    'clipboard-if-selected',
    'permission-prompts-if-selected',
    'adapter-states-if-selected',
    'hardware-adapters-if-selected',
    'haptics-if-selected',
    'audio-input-if-selected',
    'sensors-if-selected',
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

const networkSelectedChecks = ['network-if-selected']
const storageSelectedChecks = ['storage-restart']
const clipboardSelectedChecks = ['clipboard-if-selected']
const pluginHardwareSelectedChecks = [
  'permission-prompts-if-selected',
  'adapter-states-if-selected',
  'hardware-adapters-if-selected',
]
const notificationSelectedChecks = [
  'permission-prompts-if-selected',
  'adapter-states-if-selected',
]
const adapterStateSelectedChecks = ['adapter-states-if-selected']
const iosDeepLinkShareNotificationChecks = [
  'deep-links-share-notifications-if-selected',
]
const hapticsSelectedChecks = ['haptics-if-selected']
const androidHapticsSelectedChecks = ['permission-prompts-if-selected']
const audioInputSelectedChecks = [
  'permission-prompts-if-selected',
  'audio-input-if-selected',
]
const audioInputProbeSelectedChecks = ['audio-input-if-selected']
const sensorsSelectedChecks = ['sensors-if-selected']

export const selectedApiRequiredRealDeviceChecks = {
  fetch: {
    all: networkSelectedChecks,
  },
  WebSocket: {
    all: networkSelectedChecks,
  },
  checkNetworkReachability: {
    all: networkSelectedChecks,
  },
  'navigator.onLine': {
    all: networkSelectedChecks,
  },
  localStorage: {
    all: storageSelectedChecks,
  },
  sessionStorage: {
    all: storageSelectedChecks,
  },
  'navigator.clipboard': {
    all: clipboardSelectedChecks,
  },
  'navigator.clipboard.readText': {
    all: clipboardSelectedChecks,
  },
  'navigator.clipboard.writeText': {
    all: clipboardSelectedChecks,
  },
  isClipboardSupported: {
    all: clipboardSelectedChecks,
  },
  isPrimaryClipboardSupported: {
    all: clipboardSelectedChecks,
  },
  '@vue-godot/device/clipboard': {
    all: clipboardSelectedChecks,
  },
  hasClipboardText: {
    all: clipboardSelectedChecks,
  },
  readClipboardText: {
    all: clipboardSelectedChecks,
  },
  writeClipboardText: {
    all: clipboardSelectedChecks,
  },
  hasClipboardImage: {
    all: clipboardSelectedChecks,
  },
  readClipboardImage: {
    all: clipboardSelectedChecks,
  },
  readPrimaryClipboardText: {
    all: clipboardSelectedChecks,
  },
  writePrimaryClipboardText: {
    all: clipboardSelectedChecks,
  },
  'navigator.geolocation': {
    all: pluginHardwareSelectedChecks,
  },
  '@vue-godot/device/geolocation': {
    all: pluginHardwareSelectedChecks,
  },
  GeolocationAdapter: {
    all: pluginHardwareSelectedChecks,
  },
  createGeolocationAdapter: {
    all: pluginHardwareSelectedChecks,
  },
  'navigator.mediaDevices.getUserMedia': {
    all: pluginHardwareSelectedChecks,
  },
  MediaStream: {
    all: pluginHardwareSelectedChecks,
  },
  '@vue-godot/device/media-devices': {
    all: pluginHardwareSelectedChecks,
  },
  MediaDevicesAdapter: {
    all: pluginHardwareSelectedChecks,
  },
  createMediaDevicesAdapter: {
    all: pluginHardwareSelectedChecks,
  },
  CameraView: {
    all: pluginHardwareSelectedChecks,
  },
  Notification: {
    all: notificationSelectedChecks,
    ios: iosDeepLinkShareNotificationChecks,
  },
  NotificationAdapter: {
    all: notificationSelectedChecks,
    ios: iosDeepLinkShareNotificationChecks,
  },
  showNativeNotification: {
    all: notificationSelectedChecks,
    ios: iosDeepLinkShareNotificationChecks,
  },
  DeepLinkAdapter: {
    all: adapterStateSelectedChecks,
    ios: iosDeepLinkShareNotificationChecks,
  },
  readInitialOpenUrl: {
    all: adapterStateSelectedChecks,
    ios: iosDeepLinkShareNotificationChecks,
  },
  onOpenUrl: {
    all: adapterStateSelectedChecks,
    ios: iosDeepLinkShareNotificationChecks,
  },
  ShareAdapter: {
    all: adapterStateSelectedChecks,
    ios: iosDeepLinkShareNotificationChecks,
  },
  share: {
    all: adapterStateSelectedChecks,
    ios: iosDeepLinkShareNotificationChecks,
  },
  'navigator.vibrate': {
    all: hapticsSelectedChecks,
    android: androidHapticsSelectedChecks,
  },
  isVibrationSupported: {
    all: hapticsSelectedChecks,
    android: androidHapticsSelectedChecks,
  },
  '@vue-godot/device/haptics': {
    all: hapticsSelectedChecks,
    android: androidHapticsSelectedChecks,
  },
  isHandheldVibrationSupported: {
    all: hapticsSelectedChecks,
    android: androidHapticsSelectedChecks,
  },
  vibrateHandheld: {
    all: hapticsSelectedChecks,
    android: androidHapticsSelectedChecks,
  },
  startJoypadVibration: {
    all: hapticsSelectedChecks,
  },
  stopJoypadVibration: {
    all: hapticsSelectedChecks,
  },
  readJoypadVibration: {
    all: hapticsSelectedChecks,
  },
  '@vue-godot/device/microphone': {
    all: audioInputSelectedChecks,
  },
  listAudioInputDevices: {
    all: audioInputProbeSelectedChecks,
  },
  createMicrophoneStream: {
    all: audioInputSelectedChecks,
  },
  createMicrophonePlayer: {
    all: audioInputSelectedChecks,
  },
  createAudioCaptureEffect: {
    all: audioInputSelectedChecks,
  },
  attachAudioCaptureEffect: {
    all: audioInputSelectedChecks,
  },
  readAudioCaptureFrames: {
    all: audioInputProbeSelectedChecks,
  },
  '@vue-godot/device/sensors': {
    all: sensorsSelectedChecks,
  },
  readAccelerometer: {
    all: sensorsSelectedChecks,
  },
  readGravity: {
    all: sensorsSelectedChecks,
  },
  readGyroscope: {
    all: sensorsSelectedChecks,
  },
  readMagnetometer: {
    all: sensorsSelectedChecks,
  },
  readDeviceMotion: {
    all: sensorsSelectedChecks,
  },
  readDeviceOrientation: {
    all: sensorsSelectedChecks,
  },
  DeviceMotionEvent: {
    all: sensorsSelectedChecks,
  },
  DeviceOrientationEvent: {
    all: sensorsSelectedChecks,
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

export const knownRealDeviceSelectedApis = [
  ...Object.keys(selectedApiRequiredRealDeviceChecks),
  'navigator.permissions',
].sort()

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

export function unknownRealDeviceSelectedApis(selectedApis) {
  const knownApis = new Set(knownRealDeviceSelectedApis)
  return [
    ...new Set(
      selectedApis
        .filter((apiName) => typeof apiName === 'string')
        .map((apiName) => apiName.trim())
        .filter((apiName) => !knownApis.has(apiName))
        .filter((apiName) => apiName.length > 0),
    ),
  ]
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

  for (const apiName of unknownRealDeviceSelectedApis(selectedApis)) {
    errors.push(`${platform}.selectedApis contains unknown API ${apiName}`)
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
      [
        `evidence.commit must match expected release commit ${options.expectedCommit}`,
        'If this evidence was committed after testing a release-candidate commit, rerun the readiness check with --expected-commit <release-candidate-sha>.',
      ].join('\n'),
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
