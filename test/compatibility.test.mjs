import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { readHtmlComponentNames } from './utils/html-components.mjs'

const repoRoot = process.cwd()
const compatibilityPath = path.join(repoRoot, 'docs/compatibility.md')
const compatibility = fs.readFileSync(compatibilityPath, 'utf-8')

const validStatuses = new Set([
  'supported',
  'partial',
  'requires-plugin',
  'planned',
  'skipped',
])

function splitMarkdownRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())
}

function parseCompatibilityRows(markdown) {
  const lines = markdown.split('\n')
  const rows = []

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    if (!line.startsWith('|')) {
      continue
    }

    const header = splitMarkdownRow(line)
    const separator = lines[index + 1] ?? ''
    const isCompatibilityTable =
      header.length === 8 &&
      header.some((cell) => /^(API|Component\/API|Feature)$/.test(cell)) &&
      header.includes('Owner') &&
      header.includes('Status') &&
      header.includes('Godot backend') &&
      /^\|\s*:?-+/.test(separator)

    if (!isCompatibilityTable) {
      continue
    }

    index += 2
    while (index < lines.length && lines[index].startsWith('|')) {
      const cells = splitMarkdownRow(lines[index])
      rows.push({
        api: cells[0],
        owner: cells[1],
        status: cells[2],
        backend: cells[3],
        platforms: cells[4],
        permissions: cells[5],
        tests: cells[6],
        caveats: cells[7],
      })
      index += 1
    }
  }

  return rows
}

const rows = parseCompatibilityRows(compatibility)
const htmlReadme = fs.readFileSync(
  path.join(repoRoot, 'packages/html/README.md'),
  'utf-8',
)

function normalize(value) {
  return value.replace(/`/g, '').toLowerCase()
}

function findRow(apiPattern, ownerPattern) {
  return rows.find((row) => {
    const apiMatches =
      typeof apiPattern === 'string'
        ? normalize(row.api).includes(apiPattern.toLowerCase())
        : apiPattern.test(normalize(row.api))
    const ownerMatches =
      ownerPattern == null ||
      (typeof ownerPattern === 'string'
        ? normalize(row.owner).includes(ownerPattern.toLowerCase())
        : ownerPattern.test(normalize(row.owner)))

    return apiMatches && ownerMatches
  })
}

function assertDocumented(apiPattern, ownerPattern, message) {
  assert.ok(
    findRow(apiPattern, ownerPattern),
    message ?? `Expected compatibility row for ${apiPattern.toString()}`,
  )
}

test('compatibility rows use the required schema and status values', () => {
  assert.ok(rows.length > 80, 'Expected a substantial compatibility matrix')

  for (const row of rows) {
    assert.ok(row.api, 'Compatibility row must name an API/component')
    assert.ok(row.owner, `Compatibility row ${row.api} must name an owner`)
    assert.ok(
      validStatuses.has(normalize(row.status)),
      `Compatibility row ${row.api} has invalid status ${row.status}`,
    )
    assert.ok(row.backend, `Compatibility row ${row.api} must name a backend`)
    assert.ok(row.platforms, `Compatibility row ${row.api} must name platforms`)
    assert.ok(row.permissions, `Compatibility row ${row.api} must name permissions`)
    assert.ok(row.tests, `Compatibility row ${row.api} must name tests`)
    assert.ok(row.caveats, `Compatibility row ${row.api} must name caveats`)
  }
})

test('compatibility strategy documents backend selection policy', () => {
  for (const pattern of [
    /Prefer best-effort web-compatible APIs/,
    /Prefer explicit `@vue-godot\/device` adapters/,
    /Do not\s+install browser-shaped globals[\s\S]*until a real adapter is\s+registered/,
    /Wrapping stable Godot modules and classes is acceptable/,
    /Wrapping stable Godot plugins or native Android\/iOS plugins is acceptable/,
    /Mark APIs as `skipped`/,
  ]) {
    assert.match(compatibility, pattern)
  }
})

test('browser compatibility rows cover shipped browser APIs by API family', () => {
  const browserApis = [
    'fetch()',
    'Request',
    'Response',
    'Headers',
    'Blob',
    'object URLs',
    'File',
    'FormData',
    'FileReader',
    'WebSocket',
    'URL',
    'URLSearchParams',
    'atob',
    'btoa',
    'TextEncoder',
    'TextDecoder',
    'AbortController',
    'Timers',
    'queueMicrotask',
    'requestAnimationFrame',
    'performance',
    'history',
    'location',
    'Global event target',
    'localStorage',
    'sessionStorage',
    'navigator.onLine',
    'online',
    'offline',
    'checkNetworkReachability()',
    'Reachability helpers',
    'navigator.permissions.query()',
    'navigator.clipboard.readText()',
    'isClipboardSupported()',
    'navigator.vibrate()',
    'isVibrationSupported()',
    'readDeviceMotion()',
    'readDeviceOrientation()',
    'Device motion/orientation events',
  ]

  for (const api of browserApis) {
    assertDocumented(api, 'browser')
  }

  const pluginBackedApis = [
    'navigator.geolocation',
    'navigator.mediaDevices.getUserMedia()',
    'MediaStream subset',
    'Notification',
  ]

  for (const api of pluginBackedApis) {
    const row = findRow(api, 'browser')
    assert.ok(row, `Expected plugin-backed browser row for ${api}`)
    assert.match(
      normalize(row.status),
      /requires-plugin|partial/,
      `${api} should be documented as plugin-backed or partial`,
    )
  }
})

test('html compatibility rows cover every registered component and tool API', () => {
  for (const componentName of readHtmlComponentNames()) {
    assertDocumented(
      `<${componentName}>`,
      'html',
      `Expected compatibility row for <${componentName}>`,
    )
  }

  for (const api of ['htmlPlugin', 'htmlTags', 'Volar plugin']) {
    assertDocumented(api, 'html')
  }
})

test('html README documents every registered component', () => {
  for (const componentName of readHtmlComponentNames()) {
    assert.match(
      htmlReadme,
      new RegExp(`<${componentName}>`),
      `Expected packages/html/README.md to document <${componentName}>`,
    )
  }
})

test('html accessibility docs match the checked-in GodotJS bindings', () => {
  const typingsDir = path.join(repoRoot, 'packages/runtime-tscn/typings')
  const typingFiles = fs
    .readdirSync(typingsDir)
    .filter((name) => /^godot\d+\.gen\.d\.ts$/.test(name))
  assert.ok(typingFiles.length > 0, 'Expected generated Godot typings')

  const generatedTypings = typingFiles
    .map((name) => fs.readFileSync(path.join(typingsDir, name), 'utf-8'))
    .join('\n')

  assert.doesNotMatch(
    generatedTypings,
    /\b(?:get|set)\s+(?:accessibility_|accessible_|aria_)?role\b|\b(?:get|set)\s+accessibility_/i,
    'If GodotJS exposes portable accessibility bindings, revisit the documented unsupported status.',
  )
  assert.match(
    compatibility,
    /accessibility-tree integration are not exposed on the\s+current GodotJS baseline/,
  )
  assert.match(htmlReadme, /does not expose ARIA-style labels/)
})

test('device compatibility rows cover core registry, adapters, and submodules', () => {
  const deviceApis = [
    'DeviceCapabilityRegistry',
    'registerDeviceCapability()',
    'isSupported()',
    'requireCapability()',
    'DeviceCapabilityError',
    'Plugin adapter interfaces',
    'Adapter type guards',
    '@vue-godot/device/geolocation',
    '@vue-godot/device/media-devices',
    '@vue-godot/device/clipboard',
    '@vue-godot/device/haptics',
    '@vue-godot/device/microphone',
    '@vue-godot/device/permissions',
    '@vue-godot/device/sensors',
    '@vue-godot/device/system',
    'openExternalUrl()',
    'DeepLinkAdapter',
    'ShareAdapter',
    'NotificationAdapter',
  ]

  for (const api of deviceApis) {
    assertDocumented(api, 'device')
  }
})

test('runtime and CLI compatibility rows cover shipped integration commands', () => {
  const integrationRows = [
    ['Vue custom renderer', 'runtime-tscn'],
    ['Godot signal event mapping', 'runtime-tscn'],
    ['Prop removal/reset semantics', 'runtime-tscn'],
    ['Static text insertion', 'runtime-tscn'],
    ['vue-godot create', 'cli'],
    ['vue-godot create --html', 'cli'],
    ['vue-godot integrate', 'cli'],
    ['vue-godot gen-types', 'cli'],
    ['vue-godot doctor', 'cli'],
    ['@vue-godot/browser/globals', 'browser'],
  ]

  for (const [api, owner] of integrationRows) {
    assertDocumented(api, owner)
  }
})

test('skipped browser APIs stay explicitly documented as skipped', () => {
  for (const api of [
    'DOM document',
    'Service workers',
    'Web workers',
    'IndexedDB',
    'Browser WebRTC API',
  ]) {
    const row = findRow(api, 'browser')
    assert.ok(row, `Expected skipped browser row for ${api}`)
    assert.equal(normalize(row.status), 'skipped')
  }
})
