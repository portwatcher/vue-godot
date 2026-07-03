import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-loader.mjs', import.meta.url).href)

const {
  GodotAbortController,
  GodotBlob,
  GodotHeaders,
  GodotResponse,
  GodotTextDecoder,
  GodotTextEncoder,
  GodotURL,
  atob,
  btoa,
  createHistoryAndLocation,
  createObjectURL,
  getGlobalEventTarget,
  resolveObjectURL,
  revokeObjectURL,
} = await import('../dist/index.js')

test('base64 helpers round-trip binary strings', () => {
  const encoded = btoa('hello')

  assert.equal(encoded, 'aGVsbG8=')
  assert.equal(atob(encoded), 'hello')
  assert.throws(() => btoa('✓'), /Latin1/)
})

test('text encoder and decoder round-trip unicode text', () => {
  const encoded = new GodotTextEncoder().encode('hello π')
  const decoded = new GodotTextDecoder().decode(encoded)

  assert.equal(decoded, 'hello π')
})

test('GodotBlob merges parts and supports object URLs', async () => {
  const blob = new GodotBlob(['he', new Uint8Array([108, 108, 111])], {
    type: 'text/plain',
  })

  assert.equal(blob.size, 5)
  assert.equal(blob.type, 'text/plain')
  assert.equal(await blob.text(), 'hello')

  const url = createObjectURL(blob)
  assert.equal(resolveObjectURL(url), blob)
  revokeObjectURL(url)
  assert.equal(resolveObjectURL(url), undefined)
})

test('GodotURL parses absolute and relative URLs', () => {
  const absolute = new GodotURL('https://user:pass@example.com:8443/a?q=1#h')

  assert.equal(absolute.protocol, 'https:')
  assert.equal(absolute.username, 'user')
  assert.equal(absolute.password, 'pass')
  assert.equal(absolute.host, 'example.com:8443')
  assert.equal(absolute.pathname, '/a')
  assert.equal(absolute.search, '?q=1')
  assert.equal(absolute.hash, '#h')

  const relative = new GodotURL('../next', 'https://example.com/app/page')
  assert.equal(relative.href, 'https://example.com/app/../next')
})

test('GodotHeaders stores case-insensitive values and serializes for Godot', () => {
  const headers = new GodotHeaders({ 'Content-Type': 'text/plain' })
  headers.append('X-Test', 'a')
  headers.append('x-test', 'b')

  assert.equal(headers.get('content-type'), 'text/plain')
  assert.equal(headers.get('X-Test'), 'a, b')
  assert.deepEqual(headers.toGodotArray(), [
    'content-type: text/plain',
    'x-test: a',
    'x-test: b',
  ])
})

test('GodotResponse exposes body helpers and enforces bodyUsed', async () => {
  const body = new GodotTextEncoder().encode('{"ok":true}').buffer
  const response = new GodotResponse(body, {
    status: 200,
    headers: new GodotHeaders({ 'content-type': 'application/json' }),
  })

  assert.equal(response.ok, true)
  assert.deepEqual(await response.json(), { ok: true })
  assert.equal(response.bodyUsed, true)
  await assert.rejects(() => response.text(), /already been consumed/)

  const clone = new GodotResponse(body, {
    status: 404,
    headers: new GodotHeaders(),
  }).clone()
  assert.equal(clone.ok, false)
  assert.equal(await clone.text(), '{"ok":true}')
})

test('history and location stay linked and dispatch popstate on traversal', async () => {
  const { history, location } = createHistoryAndLocation(
    'https://example.com/start',
  )
  const events = []
  const target = getGlobalEventTarget()
  const listener = (event) => events.push(event.state)
  target.addEventListener('popstate', listener)

  history.pushState({ page: 1 }, '', '/one')
  history.pushState({ page: 2 }, '', '/two')
  assert.equal(history.length, 3)
  assert.equal(location.pathname, '/two')

  history.back()
  await Promise.resolve()

  assert.equal(location.pathname, '/one')
  assert.deepEqual(events, [{ page: 1 }])

  target.removeEventListener('popstate', listener)
})

test('AbortController aborts once and notifies listeners', () => {
  const controller = new GodotAbortController()
  let calls = 0

  controller.signal.addEventListener('abort', () => {
    calls++
  })
  controller.abort('done')
  controller.abort('again')

  assert.equal(controller.signal.aborted, true)
  assert.equal(controller.signal.reason, 'done')
  assert.equal(calls, 1)
  assert.throws(() => controller.signal.throwIfAborted(), /done/)
})
