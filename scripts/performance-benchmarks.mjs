import assert from 'node:assert/strict'
import { register } from 'node:module'
import { performance } from 'node:perf_hooks'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

register(new URL('./performance-godot-loader.mjs', import.meta.url).href)

const scriptPath = fileURLToPath(import.meta.url)

export const requiredBenchmarkIds = [
  'startup-time',
  'first-vue-render',
  'large-tree-update',
  'large-list-scroll',
  'media-asset-loading',
  'fetch-websocket-throughput',
  'repeated-mount-unmount',
  'editor-reload-stability',
]

function elapsedSince(startedAt) {
  return performance.now() - startedAt
}

function formatMs(value) {
  return `${value.toFixed(2)}ms`
}

function resetMockHttp(responses) {
  globalThis.__vueGodotPerformanceMockHttp = {
    requests: [],
    responses: [...responses],
  }
  return globalThis.__vueGodotPerformanceMockHttp
}

function resetMockWebSocket() {
  globalThis.__vueGodotPerformanceMockWebSocket = {
    peers: [],
    connectError: 0,
    sendError: 0,
    openOnPoll: true,
  }
  return globalThis.__vueGodotPerformanceMockWebSocket
}

async function loadRuntimeModules() {
  return Promise.all([
    import('../packages/runtime-tscn/dist/index.js'),
    import('@vue/runtime-core'),
    import('godot'),
  ])
}

async function benchmarkStartupTime() {
  const startedAt = performance.now()
  const cacheBust = `?benchmark=${Date.now()}-${Math.random()}`
  await import(new URL(`../packages/runtime-tscn/dist/index.js${cacheBust}`, import.meta.url))

  return {
    durationMs: elapsedSince(startedAt),
    iterations: 1,
  }
}

async function benchmarkFirstVueRender() {
  const [{ createApp }, { h, nextTick }, { Node }] = await loadRuntimeModules()
  const root = new Node('first-render-root')
  const app = createApp({
    render() {
      return h('PanelContainer', null, [
        h('Label', { text: 'Ready' }),
        h('Label', { text: 'Interactive' }),
      ])
    },
  })

  const startedAt = performance.now()
  app.mount(root)
  await nextTick()
  const durationMs = elapsedSince(startedAt)

  assert.equal(root.children.length, 1)
  assert.equal(root.children[0].children.length, 2)

  app.unmount()
  await nextTick()

  return {
    durationMs,
    iterations: 1,
  }
}

async function benchmarkLargeTreeUpdate() {
  const [{ createApp }, { h, nextTick, ref }, { Node }] =
    await loadRuntimeModules()
  const root = new Node('large-tree-root')
  const items = ref(Array.from({ length: 1_000 }, (_, index) => index))
  const version = ref(0)
  const app = createApp({
    setup() {
      return () =>
        h(
          'VBoxContainer',
          null,
          items.value.map((item) =>
            h('Label', { key: item, item }, `row-${item}-v${version.value}`),
          ),
        )
    },
  })

  app.mount(root)
  await nextTick()

  const startedAt = performance.now()
  items.value = [...items.value].reverse()
  version.value += 1
  await nextTick()
  const durationMs = elapsedSince(startedAt)

  assert.equal(root.children[0].children.length, 1_000)
  assert.equal(root.children[0].children[0].item, 999)

  app.unmount()
  await nextTick()

  return {
    durationMs,
    iterations: items.value.length,
  }
}

async function benchmarkLargeListScroll() {
  const { resolveVirtualListRange } = await import(
    '../packages/html/dist/utils/virtualList.js'
  )
  const iterations = 20_000
  let renderedRows = 0
  const startedAt = performance.now()

  for (let index = 0; index < iterations; index++) {
    const range = resolveVirtualListRange({
      itemCount: 100_000,
      itemHeight: 44,
      viewportHeight: 720,
      scrollOffset: index * 31,
      overscan: 6,
    })
    renderedRows += range.renderedCount
  }

  assert.ok(renderedRows > 0)
  return {
    durationMs: elapsedSince(startedAt),
    iterations,
  }
}

async function benchmarkMediaAssetLoading() {
  const [
    { createTextureFromBuffer },
    { createAudioStreamFromBuffer },
    { createStreamFromBuffer },
  ] = await Promise.all([
    import('../packages/html/dist/utils/textureLoader.js'),
    import('../packages/html/dist/utils/audioStreamLoader.js'),
    import('../packages/html/dist/utils/streamLoader.js'),
  ])
  const encoder = new TextEncoder()
  const imageBuffer = encoder.encode(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"></svg>',
  ).buffer
  const audioBuffer = new Uint8Array(16_384).fill(7).buffer
  const videoBuffer = new Uint8Array(64_000).fill(11).buffer
  const iterations = 250
  let loaded = 0
  const startedAt = performance.now()

  for (let index = 0; index < iterations; index++) {
    if (createTextureFromBuffer(imageBuffer, 'image/svg+xml')) {
      loaded += 1
    }
    if (createAudioStreamFromBuffer(audioBuffer, 'audio/ogg')) {
      loaded += 1
    }
    if (createStreamFromBuffer(videoBuffer, 'video/ogg')) {
      loaded += 1
    }
  }

  assert.equal(loaded, iterations * 3)
  return {
    durationMs: elapsedSince(startedAt),
    iterations: iterations * 3,
  }
}

async function waitForWebSocketOpen(socket) {
  const startedAt = performance.now()
  while (socket.readyState === socket.CONNECTING) {
    if (elapsedSince(startedAt) > 500) {
      throw new Error('Timed out waiting for benchmark WebSocket to open')
    }
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
}

async function benchmarkFetchWebSocketThroughput() {
  const [{ fetch }, { GodotWebSocket }] = await Promise.all([
    import('../packages/browser/dist/fetch.js'),
    import('../packages/browser/dist/websocket.js'),
  ])
  const fetchCount = 120
  const socketSendCount = 240
  const http = resetMockHttp(
    Array.from({ length: fetchCount }, (_, index) => ({
      status: 200,
      headers: { 'content-type': 'text/plain' },
      body: `ok-${index}`,
    })),
  )
  const socketState = resetMockWebSocket()
  const startedAt = performance.now()

  for (let index = 0; index < fetchCount; index++) {
    const response = await fetch(`https://api.example.test/items/${index}`)
    assert.equal(response.status, 200)
    assert.equal(await response.text(), `ok-${index}`)
  }

  const socket = new GodotWebSocket('ws://socket.example.test')
  await waitForWebSocketOpen(socket)
  for (let index = 0; index < socketSendCount; index++) {
    socket.send(`message-${index}`)
  }
  socket.close()

  assert.equal(http.requests.length, fetchCount)
  assert.equal(socketState.peers.length, 1)
  assert.equal(socketState.peers[0].sent.length, socketSendCount)

  return {
    durationMs: elapsedSince(startedAt),
    iterations: fetchCount + socketSendCount,
  }
}

async function benchmarkRepeatedMountUnmount() {
  const [{ createApp }, { h, nextTick }, { Node }] = await loadRuntimeModules()
  const root = new Node('repeated-mount-root')
  const cycles = 200
  const startedAt = performance.now()

  for (let index = 0; index < cycles; index++) {
    const app = createApp({
      render() {
        return h('VBoxContainer', null, [
          h('Label', { text: `cycle-${index}` }),
          h('Label', { text: `value-${index}` }),
        ])
      },
    })

    app.mount(root)
    await nextTick()

    const mountedRoot = root.children[0]
    const children = [...mountedRoot.children]
    assert.equal(root.children.length, 1)
    assert.equal(children.length, 2)
    assert.equal(children[0].text, `cycle-${index}`)

    app.unmount()
    await nextTick()

    assert.deepEqual(root.children, [])
    assert.equal(mountedRoot.queuedFree, true)
    for (const child of children) {
      assert.equal(child.queuedFree, true)
    }
  }

  return {
    durationMs: elapsedSince(startedAt),
    iterations: cycles,
  }
}

async function benchmarkEditorReloadStability() {
  const [{ createApp }, { h, nextTick }, { Node }] = await loadRuntimeModules()
  const root = new Node('editor-reload-root')
  let currentApp = null
  let previousNode = null
  const reloads = 100
  const startedAt = performance.now()

  for (let index = 0; index < reloads; index++) {
    currentApp?.unmount()
    if (previousNode) {
      assert.equal(previousNode.queuedFree, true)
    }

    currentApp = createApp({
      render() {
        return h('Label', { text: `reload-${index}` })
      },
    })
    currentApp.mount(root)
    await nextTick()

    assert.equal(root.children.length, 1)
    assert.equal(root.children[0].text, `reload-${index}`)
    previousNode = root.children[0]
  }

  currentApp?.unmount()
  await nextTick()
  assert.deepEqual(root.children, [])
  assert.equal(previousNode.queuedFree, true)

  return {
    durationMs: elapsedSince(startedAt),
    iterations: reloads,
  }
}

export const benchmarkDefinitions = [
  {
    id: 'startup-time',
    label: 'Startup time',
    thresholdMs: 1_000,
    run: benchmarkStartupTime,
  },
  {
    id: 'first-vue-render',
    label: 'First Vue render',
    thresholdMs: 250,
    run: benchmarkFirstVueRender,
  },
  {
    id: 'large-tree-update',
    label: 'Large tree update',
    thresholdMs: 750,
    run: benchmarkLargeTreeUpdate,
  },
  {
    id: 'large-list-scroll',
    label: 'Large list scroll',
    thresholdMs: 250,
    run: benchmarkLargeListScroll,
  },
  {
    id: 'media-asset-loading',
    label: 'Image/video/audio loading',
    thresholdMs: 1_000,
    run: benchmarkMediaAssetLoading,
  },
  {
    id: 'fetch-websocket-throughput',
    label: 'Fetch/WebSocket throughput',
    thresholdMs: 1_000,
    run: benchmarkFetchWebSocketThroughput,
  },
  {
    id: 'repeated-mount-unmount',
    label: 'Repeated mount/unmount',
    thresholdMs: 1_000,
    run: benchmarkRepeatedMountUnmount,
  },
  {
    id: 'editor-reload-stability',
    label: 'Editor reload stability',
    thresholdMs: 1_000,
    run: benchmarkEditorReloadStability,
  },
]

export function validateBenchmarkCoverage(definitions = benchmarkDefinitions) {
  const ids = new Set(definitions.map((definition) => definition.id))
  const missing = requiredBenchmarkIds.filter((id) => !ids.has(id))
  if (missing.length > 0) {
    throw new Error(
      `Performance benchmark coverage is missing: ${missing.join(', ')}`,
    )
  }
}

export async function runPerformanceBenchmarks(
  definitions = benchmarkDefinitions,
) {
  validateBenchmarkCoverage(definitions)

  const results = []
  for (const definition of definitions) {
    const result = await definition.run()
    const durationMs = result.durationMs
    const thresholdMs = definition.thresholdMs
    const passed = durationMs <= thresholdMs
    results.push({
      id: definition.id,
      label: definition.label,
      durationMs,
      thresholdMs,
      iterations: result.iterations,
      passed,
    })
  }

  return results
}

function renderResults(results) {
  for (const result of results) {
    const status = result.passed ? 'ok' : 'fail'
    console.log(
      [
        `[performance] ${status} ${result.id}`,
        `${formatMs(result.durationMs)} <= ${formatMs(result.thresholdMs)}`,
        `iterations=${result.iterations}`,
      ].join(' | '),
    )
  }
}

function assertResultsPassed(results) {
  const failures = results.filter((result) => !result.passed)
  if (failures.length === 0) {
    return
  }

  throw new Error(
    [
      'Performance benchmark budget exceeded',
      ...failures.map(
        (failure) =>
          `- ${failure.id}: ${formatMs(failure.durationMs)} > ${formatMs(
            failure.thresholdMs,
          )}`,
      ),
    ].join('\n'),
  )
}

async function main() {
  const results = await runPerformanceBenchmarks()
  renderResults(results)
  assertResultsPassed(results)
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  await main()
}
