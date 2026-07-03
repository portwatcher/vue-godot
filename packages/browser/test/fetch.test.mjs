import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-loader.mjs', import.meta.url).href)

const { GodotRequest, fetch } = await import('../dist/index.js')

function resetMockHttp(responses) {
  globalThis.__vueGodotBrowserMockHttp = {
    requests: [],
    responses: [...responses],
  }
  return globalThis.__vueGodotBrowserMockHttp
}

test('fetch accepts Request input without consuming the original body', async () => {
  const http = resetMockHttp([
    {
      status: 200,
      headers: { 'content-type': 'text/plain' },
      body: 'created',
    },
  ])
  const request = new GodotRequest('https://api.example.com:9443/upload?q=1', {
    method: 'POST',
    headers: { 'x-test': '1' },
    body: 'payload',
  })

  const response = await fetch(request)

  assert.equal(response.status, 200)
  assert.equal(await response.text(), 'created')
  assert.equal(request.bodyUsed, false)
  assert.equal(await request.text(), 'payload')
  assert.equal(http.requests.length, 1)
  assert.deepEqual(http.requests[0], {
    hostname: 'api.example.com',
    port: 9443,
    tls: true,
    method: 2,
    methodName: 'POST',
    path: '/upload?q=1',
    headers: ['x-test: 1', 'host: api.example.com:9443'],
    body: 'payload',
    bodyBytes: [112, 97, 121, 108, 111, 97, 100],
  })
})

test('fetch converts POST to GET and drops body for 302 redirects', async () => {
  const http = resetMockHttp([
    {
      status: 302,
      headers: { location: '/next' },
      body: '',
    },
    {
      status: 200,
      headers: { 'content-type': 'text/plain' },
      body: 'redirected',
    },
  ])

  const response = await fetch('https://example.com/start', {
    method: 'POST',
    body: 'payload',
  })

  assert.equal(response.redirected, true)
  assert.equal(response.url, 'https://example.com/next')
  assert.equal(await response.text(), 'redirected')
  assert.equal(http.requests.length, 2)
  assert.equal(http.requests[0].methodName, 'POST')
  assert.equal(http.requests[0].body, 'payload')
  assert.equal(http.requests[1].methodName, 'GET')
  assert.equal(http.requests[1].path, '/next')
  assert.equal(http.requests[1].body, '')
})
