import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const require = createRequire(import.meta.url)
const repoRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../..',
)
const fixtureDir = join(repoRoot, '.cache/browser-globals-types')
const tscBin = require.resolve('typescript/bin/tsc')

test('browser globals type entrypoint supports non-DOM Godot projects', () => {
  rmSync(fixtureDir, { recursive: true, force: true })
  mkdirSync(fixtureDir, { recursive: true })

  writeFileSync(
    join(fixtureDir, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          moduleResolution: 'bundler',
          strict: true,
          noEmit: true,
          lib: ['ES2020'],
          types: [],
        },
        include: ['index.ts'],
      },
      null,
      2,
    ),
  )

  writeFileSync(
    join(fixtureDir, 'index.ts'),
    `import '@vue-godot/browser/globals'

const blob: Blob = new Blob(['ok'], { type: 'text/plain' })
const file: File = new File([blob], 'ok.txt')
const request: Request = new Request('https://example.com', {
  method: 'POST',
  body: blob,
})
const responsePromise: Promise<Response> = fetch(request)
const encoded: string = btoa('ok')
const decoded: string = atob(encoded)
const timeoutId: number = setTimeout(() => undefined, 1)
clearTimeout(timeoutId)
const intervalId: number = setInterval(() => undefined, 1)
clearInterval(intervalId)
queueMicrotask(() => undefined)
const frameId: number = requestAnimationFrame((timestamp) => {
  const value: number = timestamp
  void value
})
cancelAnimationFrame(frameId)

const permission: PermissionStatus = await navigator.permissions.query({
  name: 'camera',
})
const online: boolean = navigator.onLine
const geolocation = navigator.geolocation
const mediaDevices = navigator.mediaDevices
const stream = await mediaDevices?.getUserMedia({ video: true })
const tracks: MediaStreamTrack[] = stream?.getVideoTracks() ?? []
const notificationPermission: NotificationPermission =
  await Notification.requestPermission()
const notification: Notification = await Notification.show('Hello', {
  body: notificationPermission,
})

addEventListener('online', (event) => {
  event.preventDefault()
})
dispatchEvent(new PopStateEvent('popstate', { state: { ok: true } }))
const url: URL = new URL('/a', 'https://example.com')
const params: URLSearchParams = new URLSearchParams(url.search)
localStorage.setItem('k', 'v')
sessionStorage.clear()
const socket: WebSocket = new WebSocket('wss://example.com')
const bytes: Uint8Array = new TextEncoder().encode('ok')
const text: string = new TextDecoder().decode(bytes)
const form = new FormData()
const reader = new FileReader()
const controller = new AbortController()
const historyState: unknown = history.state
const href: string = location.href
const now: number = performance.now()

void file
void responsePromise
void encoded
void decoded
void permission
void online
void geolocation
void tracks
void notification
void params
void socket
void text
void form
void reader
void controller
void historyState
void href
void now
`,
  )

  const result = spawnSync(
    process.execPath,
    [tscBin, '-p', fixtureDir],
    {
      cwd: repoRoot,
      encoding: 'utf8',
    },
  )

  assert.equal(
    result.status,
    0,
    `${result.stdout}\n${result.stderr}`,
  )
})
