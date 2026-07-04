import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-loader.mjs', import.meta.url).href)

const {
  GodotAbortController,
  GodotBlob,
  GodotHeaders,
  GodotRequest,
  GodotResponse,
  GodotTextDecoder,
  GodotTextEncoder,
  GodotURL,
  GodotURLSearchParams,
  atob,
  btoa,
  cancelAnimationFrame: godotCancelAnimationFrame,
  clearInterval: godotClearInterval,
  clearTimeout: godotClearTimeout,
  createHistoryAndLocation,
  createObjectURL,
  getGlobalEventTarget,
  performance: godotPerformance,
  queueMicrotask: godotQueueMicrotask,
  requestAnimationFrame: godotRequestAnimationFrame,
  resolveObjectURL,
  revokeObjectURL,
  setInterval: godotSetInterval,
  setTimeout: godotSetTimeout,
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

test('GodotURLSearchParams preserves duplicates and syncs with GodotURL', () => {
  const params = new GodotURLSearchParams('a=1&a=2&space=hello+world')

  assert.equal(params.get('a'), '1')
  assert.deepEqual(params.getAll('a'), ['1', '2'])
  assert.equal(params.get('space'), 'hello world')

  params.set('a', '3')
  params.append('symbol', 'π value')
  assert.equal(params.toString(), 'a=3&space=hello+world&symbol=%CF%80+value')

  const url = new GodotURL('https://example.com/path?first=1&first=2')
  url.searchParams.set('first', '3')
  url.searchParams.append('next', 'ok')

  assert.equal(url.search, '?first=3&next=ok')
  assert.equal(url.href, 'https://example.com/path?first=3&next=ok')

  url.search = '?fresh=yes'
  assert.deepEqual([...url.searchParams], [['fresh', 'yes']])
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

test('GodotRequest normalizes init and exposes body helpers', async () => {
  const controller = new GodotAbortController()
  const request = new GodotRequest('https://example.com/api', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: '{"ok":true}',
    redirect: 'manual',
    signal: controller.signal,
  })

  assert.equal(request.method, 'POST')
  assert.equal(request.url, 'https://example.com/api')
  assert.equal(request.headers.get('content-type'), 'application/json')
  assert.equal(request.redirect, 'manual')
  assert.equal(request.signal, controller.signal)
  assert.equal(request.bodyUsed, false)
  assert.deepEqual(await request.json(), { ok: true })
  assert.equal(request.bodyUsed, true)
  assert.throws(() => request.clone(), /already been consumed/)
})

test('GodotRequest clones request bodies before consumption', async () => {
  const original = new GodotRequest('https://example.com/upload', {
    method: 'PUT',
    body: new Uint8Array([111, 107]),
  })
  const clone = original.clone()

  assert.equal(await clone.text(), 'ok')
  assert.equal(original.bodyUsed, false)
  assert.equal(await original.text(), 'ok')
})

test('GodotRequest snapshots mutable init bodies', async () => {
  const body = new Uint8Array([111, 107])
  const request = new GodotRequest('https://example.com/upload', {
    method: 'POST',
    body,
  })

  body[0] = 120

  assert.equal(await request.text(), 'ok')
})

test('GodotRequest clones an existing request with init overrides', async () => {
  const original = new GodotRequest('https://example.com/upload', {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'ok',
  })
  const request = new GodotRequest(original, {
    method: 'PUT',
    headers: { 'x-request': 'copy' },
  })

  assert.equal(request.method, 'PUT')
  assert.equal(request.url, original.url)
  assert.equal(request.headers.get('content-type'), null)
  assert.equal(request.headers.get('x-request'), 'copy')
  assert.equal(await request.text(), 'ok')
  assert.equal(original.bodyUsed, false)
})

test('GodotRequest rejects GET and HEAD bodies', () => {
  assert.throws(
    () => new GodotRequest('https://example.com', { body: 'nope' }),
    /GET\/HEAD/,
  )
  assert.throws(
    () =>
      new GodotRequest('https://example.com', {
        method: 'HEAD',
        body: 'nope',
      }),
    /GET\/HEAD/,
  )
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

test('timer and microtask polyfills schedule and cancel callbacks', async () => {
  const order = []
  godotQueueMicrotask(() => {
    order.push('microtask')
  })
  await Promise.resolve()
  assert.deepEqual(order, ['microtask'])

  const cancelledTimeout = godotSetTimeout(() => {
    order.push('cancelled-timeout')
  }, 0)
  godotClearTimeout(cancelledTimeout)

  await new Promise((resolve) => {
    godotSetTimeout(
      (value) => {
        order.push(value)
        resolve()
      },
      0,
      'timeout',
    )
  })

  let intervalId = 0
  await new Promise((resolve) => {
    intervalId = godotSetInterval(() => {
      order.push('interval')
      if (order.filter((value) => value === 'interval').length === 2) {
        godotClearInterval(intervalId)
        resolve()
      }
    }, 0)
  })

  await new Promise((resolve) => globalThis.setTimeout(resolve, 5))

  assert.deepEqual(order, ['microtask', 'timeout', 'interval', 'interval'])
})

test('requestAnimationFrame returns timestamps and can be cancelled', async () => {
  let cancelled = false
  const cancelledFrame = godotRequestAnimationFrame(() => {
    cancelled = true
  })
  godotCancelAnimationFrame(cancelledFrame)

  const timestamp = await new Promise((resolve) => {
    godotRequestAnimationFrame(resolve)
  })

  await new Promise((resolve) => globalThis.setTimeout(resolve, 20))

  assert.equal(cancelled, false)
  assert.equal(typeof timestamp, 'number')
  assert.ok(timestamp >= 0)
})

test('performance polyfill records marks and measures', () => {
  godotPerformance.clearMarks()
  godotPerformance.clearMeasures()

  const start = godotPerformance.mark('start', { startTime: 5 })
  godotPerformance.mark('end', { startTime: 15, detail: { phase: 'done' } })
  const measure = godotPerformance.measure('span', 'start', 'end')
  const fixed = godotPerformance.measure('fixed', {
    start: 20,
    duration: 7,
    detail: 'manual',
  })

  assert.equal(start.entryType, 'mark')
  assert.equal(measure.duration, 10)
  assert.equal(fixed.startTime, 20)
  assert.equal(fixed.duration, 7)
  assert.equal(godotPerformance.getEntriesByType('mark').length, 2)
  assert.equal(godotPerformance.getEntriesByName('span')[0], measure)

  godotPerformance.clearMarks('start')
  assert.equal(godotPerformance.getEntriesByName('start').length, 0)
  assert.equal(godotPerformance.getEntriesByName('end').length, 1)
})
