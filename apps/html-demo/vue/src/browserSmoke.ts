export interface BrowserSmokeResult {
  name: string
  ok: boolean
  detail: string
}

export interface BrowserSmokeOptions {
  fetchUrl?: string
  fetchText?: string
}

function pass(name: string, detail: string): BrowserSmokeResult {
  return { name, ok: true, detail }
}

function fail(name: string, detail: string): BrowserSmokeResult {
  return { name, ok: false, detail }
}

function failFromError(name: string, error: unknown): BrowserSmokeResult {
  return fail(name, error instanceof Error ? error.message : String(error))
}

export function formatBrowserSmokeResults(
  results: readonly BrowserSmokeResult[],
): string {
  return results
    .map((result) =>
      result.ok
        ? `${result.name}: ${result.detail}`
        : `${result.name}: FAIL ${result.detail}`,
    )
    .join(' | ')
}

export function assertBrowserSmokeResults(
  results: readonly BrowserSmokeResult[],
): void {
  const failures = results.filter((result) => !result.ok)
  if (failures.length === 0) {
    return
  }

  throw new Error(formatBrowserSmokeResults(failures))
}

export async function runBrowserSmokeTests(
  options: BrowserSmokeOptions = {},
): Promise<BrowserSmokeResult[]> {
  const results: BrowserSmokeResult[] = []

  try {
    const url = new URL('https://example.com/path?q=1#hash')
    results.push(pass('URL', `host=${url.host} ok`))
  } catch (error) {
    results.push(failFromError('URL', error))
  }

  try {
    const params = new URLSearchParams('a=1&space=hello+world')
    params.append('b', '2')
    results.push(
      params.get('space') === 'hello world' && params.get('b') === '2'
        ? pass('URLSearchParams', 'ok')
        : fail('URLSearchParams', params.toString()),
    )
  } catch (error) {
    results.push(failFromError('URLSearchParams', error))
  }

  try {
    const blob = new Blob(['hello'], { type: 'text/plain' })
    results.push(pass('Blob', `size=${blob.size} ok`))
  } catch (error) {
    results.push(failFromError('Blob', error))
  }

  try {
    const file = new File(['hello'], 'hello.txt', {
      type: 'text/plain',
      lastModified: 123,
    })
    results.push(
      file.name === 'hello.txt' && file.size === 5
        ? pass('File', 'ok')
        : fail('File', `${file.name} size=${file.size}`),
    )
  } catch (error) {
    results.push(failFromError('File', error))
  }

  try {
    const form = new FormData()
    form.append('name', 'demo')
    form.append('file', new File(['data'], 'demo.txt', { type: 'text/plain' }))
    results.push(
      form.get('name') === 'demo' && form.get('file') instanceof File
        ? pass('FormData', 'ok')
        : fail('FormData', 'missing entries'),
    )
  } catch (error) {
    results.push(failFromError('FormData', error))
  }

  try {
    const reader = new FileReader()
    const text = await new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        resolve(String(reader.result))
      }
      reader.onerror = () => {
        reject(reader.error)
      }
      reader.readAsText(new Blob(['hello']))
    })
    results.push(
      text === 'hello' ? pass('FileReader', 'ok') : fail('FileReader', text),
    )
  } catch (error) {
    results.push(failFromError('FileReader', error))
  }

  try {
    const encoded = btoa('hello')
    const decoded = atob(encoded)
    results.push(
      decoded === 'hello'
        ? pass('base64', 'ok')
        : fail('base64', `decoded=${decoded}`),
    )
  } catch (error) {
    results.push(failFromError('base64', error))
  }

  try {
    const encoded = new TextEncoder().encode('test')
    const decoded = new TextDecoder().decode(encoded)
    results.push(
      decoded === 'test'
        ? pass('encoding', 'ok')
        : fail('encoding', `decoded=${decoded}`),
    )
  } catch (error) {
    results.push(failFromError('encoding', error))
  }

  try {
    const headers = new Headers()
    headers.set('x-test', 'value')
    results.push(
      headers.get('x-test') === 'value'
        ? pass('Headers', 'ok')
        : fail('Headers', 'missing x-test'),
    )
  } catch (error) {
    results.push(failFromError('Headers', error))
  }

  try {
    const request = new Request('https://example.com/api', {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: 'ok',
    })
    const body = await request.text()
    results.push(
      request.method === 'POST' && body === 'ok'
        ? pass('Request', 'ok')
        : fail('Request', `${request.method} ${body}`),
    )
  } catch (error) {
    results.push(failFromError('Request', error))
  }

  try {
    const controller = new AbortController()
    results.push(
      pass('AbortController', `aborted=${controller.signal.aborted} ok`),
    )
  } catch (error) {
    results.push(failFromError('AbortController', error))
  }

  try {
    const online = navigator.onLine
    const listener = () => undefined
    addEventListener('online', listener)
    removeEventListener('online', listener)
    results.push(
      typeof online === 'boolean'
        ? pass('navigator.onLine', `online=${online} ok`)
        : fail('navigator.onLine', typeof online),
    )
  } catch (error) {
    results.push(failFromError('navigator.onLine', error))
  }

  try {
    localStorage.setItem('vue-godot-smoke', 'local')
    const value = localStorage.getItem('vue-godot-smoke')
    localStorage.removeItem('vue-godot-smoke')
    results.push(
      value === 'local'
        ? pass('localStorage', 'ok')
        : fail('localStorage', String(value)),
    )
  } catch (error) {
    results.push(failFromError('localStorage', error))
  }

  try {
    sessionStorage.setItem('vue-godot-smoke', 'session')
    const value = sessionStorage.getItem('vue-godot-smoke')
    sessionStorage.removeItem('vue-godot-smoke')
    results.push(
      value === 'session'
        ? pass('sessionStorage', 'ok')
        : fail('sessionStorage', String(value)),
    )
  } catch (error) {
    results.push(failFromError('sessionStorage', error))
  }

  try {
    let microtaskRan = false
    await new Promise<void>((resolve) => {
      queueMicrotask(() => {
        microtaskRan = true
        resolve()
      })
    })
    results.push(
      microtaskRan
        ? pass('queueMicrotask', 'ok')
        : fail('queueMicrotask', 'no-op'),
    )
  } catch (error) {
    results.push(failFromError('queueMicrotask', error))
  }

  try {
    const outcome = await new Promise<string>((resolve) => {
      const cancelled = setTimeout(() => {
        resolve('cancelled')
      }, 0)
      clearTimeout(cancelled)
      setTimeout(() => {
        resolve('timeout')
      }, 0)
    })
    results.push(
      outcome === 'timeout'
        ? pass('setTimeout', 'ok')
        : fail('setTimeout', outcome),
    )
  } catch (error) {
    results.push(failFromError('setTimeout', error))
  }

  try {
    let count = 0
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        count++
        if (count === 2) {
          clearInterval(interval)
          resolve()
        }
      }, 0)
    })
    results.push(
      count === 2
        ? pass('setInterval', 'ok')
        : fail('setInterval', String(count)),
    )
  } catch (error) {
    results.push(failFromError('setInterval', error))
  }

  try {
    let cancelled = false
    const cancelledFrame = requestAnimationFrame(() => {
      cancelled = true
    })
    cancelAnimationFrame(cancelledFrame)

    const timestamp = await new Promise<number>((resolve) => {
      requestAnimationFrame(resolve)
    })

    results.push(
      !cancelled && Number.isFinite(timestamp)
        ? pass('requestAnimationFrame', 'ok')
        : fail(
            'requestAnimationFrame',
            `cancelled=${cancelled} time=${timestamp}`,
          ),
    )
  } catch (error) {
    results.push(failFromError('requestAnimationFrame', error))
  }

  try {
    performance.clearMarks('smoke-start')
    performance.clearMarks('smoke-end')
    performance.clearMeasures('smoke-span')
    performance.mark('smoke-start')
    performance.mark('smoke-end')
    const measure = performance.measure(
      'smoke-span',
      'smoke-start',
      'smoke-end',
    )
    results.push(
      typeof performance.now() === 'number' && measure.duration >= 0
        ? pass('performance', 'ok')
        : fail('performance', `duration=${measure.duration}`),
    )
  } catch (error) {
    results.push(failFromError('performance', error))
  }

  try {
    const blob = new Blob(['data'])
    const objectUrl = URL.createObjectURL(blob)
    URL.revokeObjectURL(objectUrl)
    results.push(pass('ObjectURL', 'ok'))
  } catch (error) {
    results.push(failFromError('ObjectURL', error))
  }

  try {
    const encoded = new TextEncoder().encode('ok').buffer
    const response = new Response(encoded, {
      status: 200,
      headers: new Headers({ 'content-type': 'text/plain' }),
    })
    results.push(
      response.ok ? pass('Response', 'ok') : fail('Response', 'not ok'),
    )
  } catch (error) {
    results.push(failFromError('Response', error))
  }

  try {
    const previousHref = location.href
    history.pushState({ demo: true }, '', '/html-demo')
    const moved = location.pathname === '/html-demo'
    history.replaceState(null, '', previousHref)
    results.push(moved ? pass('History', 'ok') : fail('History', location.href))
  } catch (error) {
    results.push(failFromError('History', error))
  }

  if (options.fetchUrl) {
    try {
      const request = new Request(options.fetchUrl, {
        headers: { 'x-vue-godot-smoke': 'fetch-request' },
      })
      const response = await fetch(request)
      const text = await response.text()
      if (!response.ok) {
        results.push(fail('fetch(Request)', `status=${response.status}`))
      } else if (options.fetchText && text !== options.fetchText) {
        results.push(fail('fetch(Request)', `body=${text}`))
      } else {
        results.push(pass('fetch(Request)', `status=${response.status} ok`))
      }
    } catch (error) {
      results.push(failFromError('fetch(Request)', error))
    }
  }

  return results
}
