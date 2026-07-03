// ---------------------------------------------------------------------------
// fetch() polyfill for GodotJS
// ---------------------------------------------------------------------------
// Built on Godot's HTTPClient (RefCounted — no scene-tree required).
//
// The HTTPClient needs manual polling via poll(). We use
// `Engine.get_main_loop().create_timer()` to yield between polls,
// giving the engine a chance to process network I/O without blocking.
//
// If the SceneTree is unavailable (e.g. during early init) we fall back
// to `HTTPClient.blocking_mode_enabled = true` which blocks the main
// thread but at least works.
// ---------------------------------------------------------------------------

import { Engine, HTTPClient, SceneTree, TLSOptions } from 'godot'
import { GodotHeaders } from './headers.js'
import {
  GodotRequest,
  type GodotRequestInit,
  type GodotRequestInput,
} from './request.js'
import { GodotResponse } from './response.js'
import { GodotURL } from './url.js'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GodotFetchInit = GodotRequestInit

// HTTPClient.Status enum values (from typings — numeric constants)
const Status = {
  STATUS_DISCONNECTED: 0,
  STATUS_RESOLVING: 1,
  STATUS_CANT_RESOLVE: 2,
  STATUS_CONNECTING: 3,
  STATUS_CANT_CONNECT: 4,
  STATUS_CONNECTED: 5,
  STATUS_REQUESTING: 6,
  STATUS_BODY: 7,
  STATUS_CONNECTION_ERROR: 8,
  STATUS_TLS_HANDSHAKE_ERROR: 9,
} as const

// HTTPClient.Method enum values
const Method = {
  GET: 0,
  HEAD: 1,
  POST: 2,
  PUT: 3,
  DELETE: 4,
  OPTIONS: 5,
  TRACE: 6,
  CONNECT: 7,
  PATCH: 8,
} as const

const METHOD_MAP: Record<string, number> = {
  GET: Method.GET,
  HEAD: Method.HEAD,
  POST: Method.POST,
  PUT: Method.PUT,
  DELETE: Method.DELETE,
  OPTIONS: Method.OPTIONS,
  TRACE: Method.TRACE,
  CONNECT: Method.CONNECT,
  PATCH: Method.PATCH,
}

// Common HTTP status text
const STATUS_TEXT: Record<number, string> = {
  200: 'OK',
  201: 'Created',
  204: 'No Content',
  301: 'Moved Permanently',
  302: 'Found',
  304: 'Not Modified',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
}

const MAX_REDIRECTS = 20

function redirectMethodFor(responseCode: number, method: string): string {
  if (responseCode === 303) {
    return 'GET'
  }
  if ((responseCode === 301 || responseCode === 302) && method === 'POST') {
    return 'GET'
  }
  return method
}

// ---------------------------------------------------------------------------
// Async delay helper
// ---------------------------------------------------------------------------

/**
 * Non-blocking delay using SceneTree.create_timer().
 * Falls back to a resolved promise (busy-poll) if no tree is available.
 */
async function asyncDelay(ms: number): Promise<void> {
  try {
    const mainLoop = Engine.get_main_loop()
    if (mainLoop && mainLoop instanceof SceneTree) {
      const timer = (mainLoop as SceneTree).create_timer(ms / 1000.0)
      await timer.timeout.as_promise()
      return
    }
  } catch {
    // SceneTree not available
  }
  // Fallback: yield to microtask queue
  return new Promise<void>((resolve) => {
    // If setTimeout is available (some GodotJS builds), use it.
    const g: Record<string, unknown> = globalThis
    if (typeof g['setTimeout'] === 'function') {
      ;(g['setTimeout'] as (cb: () => void, ms: number) => void)(resolve, ms)
    } else {
      // Promise resolve is at least a microtask yield
      resolve()
    }
  })
}

// ---------------------------------------------------------------------------
// Core fetch implementation
// ---------------------------------------------------------------------------

async function fetchInternal(
  request: GodotRequest,
  redirectCount: number,
): Promise<GodotResponse> {
  const signal = request.signal

  if (signal?.aborted) {
    throw signal.reason ?? new Error('The operation was aborted.')
  }

  const parsed = new GodotURL(request.url)
  const isHttps = parsed.protocol === 'https:'
  const defaultPort = isHttps ? 443 : 80
  const port = parsed.port ? parseInt(parsed.port, 10) : defaultPort
  const method = request.method
  const godotMethod = METHOD_MAP[method] ?? Method.GET

  // Build headers
  const headers = new GodotHeaders(request.headers)

  if (!headers.has('host')) {
    headers.set('host', parsed.host)
  }

  const headerArray = headers.toGodotArray()

  // Create HTTPClient
  const client = new HTTPClient()
  const tlsOptions = isHttps ? TLSOptions.client() : undefined

  // Connect
  const connectErr = client.connect_to_host(parsed.hostname, port, tlsOptions)
  if (connectErr !== 0) {
    throw new TypeError(`fetch: connect_to_host failed (error ${connectErr})`)
  }

  // Poll until connected
  while (true) {
    signal?.throwIfAborted()
    client.poll()
    const status = client.get_status()

    if (status === Status.STATUS_CONNECTED) break
    if (status === Status.STATUS_CANT_RESOLVE) {
      throw new TypeError(`fetch: DNS resolution failed for ${parsed.hostname}`)
    }
    if (status === Status.STATUS_CANT_CONNECT) {
      throw new TypeError(`fetch: connection refused to ${parsed.host}`)
    }
    if (
      status === Status.STATUS_CONNECTION_ERROR ||
      status === Status.STATUS_TLS_HANDSHAKE_ERROR
    ) {
      throw new TypeError(`fetch: connection error (status ${status})`)
    }

    await asyncDelay(10)
  }

  // Send request
  const requestPath = (parsed.pathname || '/') + parsed.search
  let requestErr: number
  const bodyBytes = request.hasBody ? await request.arrayBuffer() : null

  if (bodyBytes !== null) {
    requestErr = client.request_raw(
      godotMethod,
      requestPath,
      headerArray,
      bodyBytes,
    )
  } else {
    requestErr = client.request(godotMethod, requestPath, headerArray)
  }

  if (requestErr !== 0) {
    throw new TypeError(`fetch: request failed (error ${requestErr})`)
  }

  // Poll until response headers arrive
  while (true) {
    signal?.throwIfAborted()
    client.poll()
    const status = client.get_status()

    if (status === Status.STATUS_BODY || client.has_response()) break
    if (
      status === Status.STATUS_CONNECTION_ERROR ||
      status === Status.STATUS_DISCONNECTED
    ) {
      throw new TypeError('fetch: connection lost while waiting for response')
    }

    await asyncDelay(10)
  }

  // Read response headers
  const responseCode = client.get_response_code()
  const rawHeaders = client.get_response_headers()
  const headerStrings: string[] = []
  for (let i = 0; i < rawHeaders.size(); i++) {
    headerStrings.push(rawHeaders.get_indexed(i))
  }
  const responseHeaders = GodotHeaders.fromGodotArray(headerStrings)

  // Handle redirects
  if (
    (responseCode === 301 ||
      responseCode === 302 ||
      responseCode === 303 ||
      responseCode === 307 ||
      responseCode === 308) &&
    request.redirect !== 'manual'
  ) {
    if (request.redirect === 'error') {
      throw new TypeError('fetch: redirect response (redirect mode = error)')
    }
    if (redirectCount >= MAX_REDIRECTS) {
      throw new TypeError('fetch: too many redirects')
    }

    const location = responseHeaders.get('location')
    if (location) {
      client.close()
      const redirectUrl = new GodotURL(location, request.url).href
      const redirectMethod = redirectMethodFor(responseCode, method)
      const redirectBody =
        redirectMethod === 'GET' ||
        redirectMethod === 'HEAD' ||
        bodyBytes === null
          ? undefined
          : (bodyBytes.slice(0) as ArrayBuffer)
      return fetchInternal(
        new GodotRequest(redirectUrl, {
          method: redirectMethod,
          headers: request.headers,
          body: redirectBody,
          signal: request.signal,
          redirect: request.redirect,
        }),
        redirectCount + 1,
      )
    }
  }

  // Read body
  const chunks: Uint8Array[] = []

  while (client.get_status() === Status.STATUS_BODY) {
    signal?.throwIfAborted()
    client.poll()
    const chunk = client.read_response_body_chunk()
    if (chunk && chunk.size() > 0) {
      // PackedByteArray → ArrayBuffer → Uint8Array
      chunks.push(new Uint8Array(chunk.to_array_buffer()))
    }

    if (client.get_status() === Status.STATUS_BODY) {
      await asyncDelay(1)
    }
  }

  client.close()

  // Merge chunks
  const totalLength = chunks.reduce((s, c) => s + c.byteLength, 0)
  const body = new Uint8Array(totalLength)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }

  return new GodotResponse(body.buffer as ArrayBuffer, {
    status: responseCode,
    statusText: STATUS_TEXT[responseCode] ?? '',
    headers: responseHeaders,
    url: request.url,
    redirected: redirectCount > 0,
  })
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * `fetch()` implementation for GodotJS.
 *
 * Built on Godot's `HTTPClient` — works without adding nodes to the
 * scene tree. Supports GET, POST, PUT, DELETE, etc., redirects, headers,
 * body, and abort signals.
 *
 * Usage:
 *   import { fetch } from '@vue-godot/browser'
 *   const res = await fetch('https://api.example.com/data')
 *   const json = await res.json()
 */
export async function fetch(
  input: GodotRequestInput,
  init?: GodotFetchInit,
): Promise<GodotResponse> {
  return fetchInternal(new GodotRequest(input, init), 0)
}
