import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const repoRoot = process.cwd()
const browserSmokePath = path.join(
  repoRoot,
  'apps/html-demo/vue/src/browserSmoke.ts',
)
const browserSmokeSource = fs.readFileSync(browserSmokePath, 'utf-8')

const expectedSmokeNames = [
  'URL',
  'URLSearchParams',
  'Blob',
  'File',
  'FormData',
  'FileReader',
  'base64',
  'encoding',
  'Headers',
  'Request',
  'WebSocket',
  'AbortController',
  'navigator.onLine',
  'navigator online events',
  'network reachability helpers',
  'navigator.permissions.query',
  'navigator.geolocation',
  'navigator.mediaDevices',
  'Notification',
  'clipboard support probe',
  'navigator.clipboard.readText',
  'vibration support probe',
  'navigator.vibrate',
  'device sensor helpers',
  'device sensors',
  'device capability registry',
  'device capability errors',
  'device adapter guards',
  'localStorage',
  'sessionStorage',
  'queueMicrotask',
  'setTimeout',
  'setInterval',
  'requestAnimationFrame',
  'performance',
  'ObjectURL',
  'Response',
  'History',
  'fetch(Request)',
  'network reachability probe',
]

function readRequiredSmokeNames() {
  const match = browserSmokeSource.match(
    /export const requiredBrowserSmokeNames = \[([\s\S]*?)\] as const/,
  )
  assert.ok(match, 'Expected requiredBrowserSmokeNames export')

  return [...match[1].matchAll(/'([^']+)'/g)].map((entry) => entry[1])
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

test('html-demo browser smoke registry covers supported API smoke names', () => {
  const smokeNames = readRequiredSmokeNames()

  assert.deepEqual([...smokeNames].sort(), [...expectedSmokeNames].sort())
  assert.equal(new Set(smokeNames).size, smokeNames.length)

  for (const name of smokeNames) {
    assert.match(
      browserSmokeSource,
      new RegExp(
        `(?:pass|fail|failFromError)\\('${escapeRegExp(name)}'[),]`,
      ),
      `Expected browser smoke implementation for ${name}`,
    )
  }

  assert.match(
    browserSmokeSource,
    /assertRequiredBrowserSmokeCoverage\(results\)/,
  )
})
