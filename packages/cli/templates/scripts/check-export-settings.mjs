#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const sourceRoots = ['vue', 'src'].map((entry) => path.join(projectRoot, entry))
const exportPresetsPath = path.join(projectRoot, 'export_presets.cfg')

const featureRules = [
  {
    id: 'network',
    label: 'network requests, WebSocket, or reachability probes',
    patterns: [
      /\bfetch\s*\(/,
      /\bWebSocket\b/,
      /\bcheckNetworkReachability\b/,
      /\bconfigureNetworkReachability\b/,
    ],
    android: [
      {
        label: 'android.permission.INTERNET',
        markers: ['android.permission.INTERNET', 'permissions/internet=true'],
      },
    ],
    ios: [],
  },
  {
    id: 'vibration',
    label: 'handheld vibration',
    patterns: [
      /\bnavigator\.vibrate\b/,
      /\bvibrate\s*\(/,
      /\bisVibrationSupported\b/,
    ],
    android: [
      {
        label: 'android.permission.VIBRATE',
        markers: ['android.permission.VIBRATE', 'permissions/vibrate=true'],
      },
    ],
    ios: [],
  },
  {
    id: 'geolocation',
    label: 'geolocation',
    patterns: [
      /\bnavigator\.geolocation\b/,
      /\bgeolocation\b/,
      /capability\s*:\s*['"]geolocation['"]/,
    ],
    android: [
      {
        label:
          'android.permission.ACCESS_FINE_LOCATION or android.permission.ACCESS_COARSE_LOCATION',
        markers: [
          'android.permission.ACCESS_FINE_LOCATION',
          'android.permission.ACCESS_COARSE_LOCATION',
          'permissions/access_fine_location=true',
          'permissions/access_coarse_location=true',
        ],
      },
    ],
    ios: ['NSLocationWhenInUseUsageDescription'],
  },
  {
    id: 'camera',
    label: 'camera capture',
    patterns: [
      /\bgetUserMedia\s*\(/,
      /\bCameraView\b/,
      /capability\s*:\s*['"]camera['"]/,
      /capability\s*:\s*['"]media-devices['"]/,
    ],
    android: [
      {
        label: 'android.permission.CAMERA',
        markers: ['android.permission.CAMERA', 'permissions/camera=true'],
      },
    ],
    ios: ['NSCameraUsageDescription'],
  },
  {
    id: 'microphone',
    label: 'microphone capture',
    patterns: [
      /\bgetUserMedia\s*\(/,
      /audio\s*:\s*true/,
      /capability\s*:\s*['"]microphone['"]/,
      /capability\s*:\s*['"]media-devices['"]/,
    ],
    android: [
      {
        label: 'android.permission.RECORD_AUDIO',
        markers: [
          'android.permission.RECORD_AUDIO',
          'permissions/record_audio=true',
        ],
      },
    ],
    ios: ['NSMicrophoneUsageDescription'],
  },
  {
    id: 'notifications',
    label: 'native notifications',
    patterns: [
      /\bNotification\b/,
      /capability\s*:\s*['"]notifications['"]/,
    ],
    android: [
      {
        label: 'android.permission.POST_NOTIFICATIONS',
        markers: [
          'android.permission.POST_NOTIFICATIONS',
          'permissions/post_notifications=true',
        ],
      },
    ],
    ios: [],
  },
]

const textExtensions = new Set([
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.ts',
  '.tsx',
  '.vue',
])

function walkTextFiles(root) {
  if (!fs.existsSync(root)) {
    return []
  }

  const files = []
  const entries = fs.readdirSync(root, { withFileTypes: true })

  for (const entry of entries) {
    const absolutePath = path.join(root, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') {
        continue
      }
      files.push(...walkTextFiles(absolutePath))
      continue
    }

    if (entry.isFile() && textExtensions.has(path.extname(entry.name))) {
      files.push(absolutePath)
    }
  }

  return files
}

function readSourceCorpus() {
  const chunks = []
  for (const root of sourceRoots) {
    for (const filePath of walkTextFiles(root)) {
      chunks.push(fs.readFileSync(filePath, 'utf-8'))
    }
  }
  return chunks.join('\n')
}

function detectFeatures(source) {
  return featureRules.filter((rule) =>
    rule.patterns.some((pattern) => pattern.test(source)),
  )
}

function findMissingRequirements(exportPresets, requirements) {
  return requirements
    .filter((requirement) =>
      requirement.markers.every((marker) => !exportPresets.includes(marker)),
    )
    .map((requirement) => requirement.label)
}

const source = readSourceCorpus()
const selectedFeatures = detectFeatures(source)

if (selectedFeatures.length === 0) {
  console.log('[vue-godot] No export-sensitive APIs detected in vue/ or src/.')
  process.exit(0)
}

console.log(
  `[vue-godot] Detected export-sensitive APIs: ${selectedFeatures
    .map((feature) => feature.label)
    .join(', ')}`,
)

if (!fs.existsSync(exportPresetsPath)) {
  console.warn(
    '[vue-godot] No export_presets.cfg found. Create Godot export presets before release and configure permissions for detected APIs.',
  )
  process.exit(0)
}

const exportPresets = fs.readFileSync(exportPresetsPath, 'utf-8')
let warningCount = 0

for (const feature of selectedFeatures) {
  const missingAndroid = findMissingRequirements(exportPresets, feature.android)
  const missingIos = feature.ios.filter(
    (token) => !exportPresets.includes(token),
  )

  if (missingAndroid.length > 0) {
    warningCount += 1
    console.warn(
      `[vue-godot] ${feature.label}: missing Android export permission(s): ${missingAndroid.join(', ')}`,
    )
  }

  if (missingIos.length > 0) {
    warningCount += 1
    console.warn(
      `[vue-godot] ${feature.label}: missing iOS plist key(s): ${missingIos.join(', ')}`,
    )
  }
}

if (warningCount === 0) {
  console.log('[vue-godot] Export settings include the detected API markers.')
}
