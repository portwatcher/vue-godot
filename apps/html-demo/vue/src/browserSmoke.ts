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
    const blob = new Blob(['hello'], { type: 'text/plain' })
    results.push(pass('Blob', `size=${blob.size} ok`))
  } catch (error) {
    results.push(failFromError('Blob', error))
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
