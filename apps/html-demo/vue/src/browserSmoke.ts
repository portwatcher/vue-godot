import {
  GodotClipboardError,
  checkNetworkReachability,
  configureDeviceSensorEvents,
  configureNetworkReachability,
  getDeviceSensorEventOptions,
  getNetworkReachabilityOptions,
  getRegisteredGeolocationAdapter,
  getRegisteredMediaDevicesAdapter,
  getRegisteredNotificationAdapter,
  isClipboardSupported,
  isVibrationSupported,
  readDeviceMotion,
  readDeviceOrientation,
  setNavigatorOnline,
  startDeviceSensorEvents,
  stopDeviceSensorEvents,
} from '@vue-godot/browser'
import {
  DeviceCapabilityError,
  DeviceCapabilityRegistry,
  createDeviceCapabilityError,
  getCapabilityStatus,
  isDeepLinkAdapter,
  isDeviceCapabilityError,
  isNotificationAdapter,
  isShareAdapter,
  isSupported,
  normalizeDeviceCapabilityError,
  registerDeviceCapability,
  requireCapability,
  unregisterDeviceCapability,
  createGeolocationAdapter,
  createMediaDevicesAdapter,
  type DeviceCapabilityAdapter,
} from '@vue-godot/device'

export interface BrowserSmokeResult {
  name: string
  ok: boolean
  detail: string
}

export interface BrowserSmokeOptions {
  fetchUrl?: string
  fetchText?: string
}

export const requiredBrowserSmokeNames = [
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
  'device geolocation adapter',
  'device media devices adapter',
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
] as const

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

function assertRequiredBrowserSmokeCoverage(
  results: BrowserSmokeResult[],
): void {
  const seen = new Set(results.map((result) => result.name))
  const missing = requiredBrowserSmokeNames.filter((name) => !seen.has(name))

  if (missing.length > 0) {
    results.push(fail('browser smoke coverage', missing.join(', ')))
  }
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
    results.push(
      typeof WebSocket === 'function' &&
        WebSocket.CONNECTING === 0 &&
        WebSocket.OPEN === 1
        ? pass('WebSocket', 'constructor ok')
        : fail('WebSocket', 'missing constructor'),
    )
  } catch (error) {
    results.push(failFromError('WebSocket', error))
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
    let onlineSeen = false
    let offlineSeen = false
    const onlineListener = () => {
      onlineSeen = true
    }
    const offlineListener = () => {
      offlineSeen = true
    }

    addEventListener('online', onlineListener)
    addEventListener('offline', offlineListener)
    setNavigatorOnline(false)
    setNavigatorOnline(true)
    removeEventListener('online', onlineListener)
    removeEventListener('offline', offlineListener)

    results.push(
      onlineSeen && offlineSeen && navigator.onLine
        ? pass('navigator online events', 'ok')
        : fail(
            'navigator online events',
            `online=${onlineSeen} offline=${offlineSeen} state=${navigator.onLine}`,
          ),
    )
  } catch (error) {
    results.push(failFromError('navigator online events', error))
  }

  try {
    const previous = getNetworkReachabilityOptions()
    configureNetworkReachability({
      url: 'https://example.com/vue-godot-reachability-smoke',
      method: 'GET',
      expectedStatus: 204,
      timeoutMs: 1234,
    })
    const configured = getNetworkReachabilityOptions()
    configureNetworkReachability(previous)

    results.push(
      configured.url.endsWith('/vue-godot-reachability-smoke') &&
        configured.method === 'GET' &&
        configured.expectedStatus === 204 &&
        configured.timeoutMs === 1234
        ? pass('network reachability helpers', 'ok')
        : fail('network reachability helpers', JSON.stringify(configured)),
    )
  } catch (error) {
    results.push(failFromError('network reachability helpers', error))
  }

  try {
    const status = await navigator.permissions.query({ name: 'camera' })
    results.push(
      ['granted', 'denied', 'prompt'].includes(status.state)
        ? pass('navigator.permissions.query', `camera=${status.state} ok`)
        : fail('navigator.permissions.query', status.state),
    )
  } catch (error) {
    results.push(failFromError('navigator.permissions.query', error))
  }

  try {
    const navigatorGeolocation = Reflect.get(navigator, 'geolocation')
    const hasNavigatorGeolocation =
      typeof navigatorGeolocation === 'object' &&
      navigatorGeolocation !== null &&
      typeof (navigatorGeolocation as { getCurrentPosition?: unknown })
        .getCurrentPosition === 'function'

    if (hasNavigatorGeolocation) {
      results.push(pass('navigator.geolocation', 'registered ok'))
    } else if (!getRegisteredGeolocationAdapter()) {
      results.push(pass('navigator.geolocation', 'missing adapter reported ok'))
    } else {
      results.push(fail('navigator.geolocation', 'adapter not installed'))
    }
  } catch (error) {
    results.push(failFromError('navigator.geolocation', error))
  }

  try {
    const navigatorMediaDevices = Reflect.get(navigator, 'mediaDevices')
    const hasNavigatorMediaDevices =
      typeof navigatorMediaDevices === 'object' &&
      navigatorMediaDevices !== null &&
      typeof (navigatorMediaDevices as { getUserMedia?: unknown })
        .getUserMedia === 'function'

    if (hasNavigatorMediaDevices) {
      results.push(pass('navigator.mediaDevices', 'registered ok'))
    } else if (!getRegisteredMediaDevicesAdapter()) {
      results.push(pass('navigator.mediaDevices', 'missing adapter reported ok'))
    } else {
      results.push(fail('navigator.mediaDevices', 'adapter not installed'))
    }
  } catch (error) {
    results.push(failFromError('navigator.mediaDevices', error))
  }

  try {
    const notificationCtor = Reflect.get(globalThis, 'Notification')
    const hasNotification =
      typeof notificationCtor === 'function' &&
      typeof (notificationCtor as { requestPermission?: unknown })
        .requestPermission === 'function'

    if (hasNotification) {
      results.push(pass('Notification', 'registered ok'))
    } else if (!getRegisteredNotificationAdapter()) {
      results.push(pass('Notification', 'missing adapter reported ok'))
    } else {
      results.push(fail('Notification', 'adapter not installed'))
    }
  } catch (error) {
    results.push(failFromError('Notification', error))
  }

  try {
    if (isClipboardSupported()) {
      const text = await navigator.clipboard.readText()
      results.push(
        pass('navigator.clipboard.readText', `length=${text.length} ok`),
      )
    } else {
      results.push(
        pass('navigator.clipboard.readText', 'unsupported reported ok'),
      )
    }
  } catch (error) {
    results.push(
      error instanceof GodotClipboardError && error.code === 'not-supported'
        ? pass('navigator.clipboard.readText', 'unsupported reported ok')
        : failFromError('navigator.clipboard.readText', error),
    )
  }

  try {
    const supported = isClipboardSupported()
    results.push(
      typeof supported === 'boolean' &&
        Reflect.get(navigator.clipboard, 'supported') === supported
        ? pass('clipboard support probe', `supported=${supported} ok`)
        : fail('clipboard support probe', String(supported)),
    )
  } catch (error) {
    results.push(failFromError('clipboard support probe', error))
  }

  try {
    const supported = isVibrationSupported()
    results.push(
      typeof supported === 'boolean'
        ? pass('vibration support probe', `supported=${supported} ok`)
        : fail('vibration support probe', String(supported)),
    )
  } catch (error) {
    results.push(failFromError('vibration support probe', error))
  }

  try {
    const accepted = navigator.vibrate(0)
    results.push(
      typeof accepted === 'boolean'
        ? pass('navigator.vibrate', `accepted=${accepted} ok`)
        : fail('navigator.vibrate', typeof accepted),
    )
  } catch (error) {
    results.push(failFromError('navigator.vibrate', error))
  }

  try {
    const previous = getDeviceSensorEventOptions()
    configureDeviceSensorEvents({
      intervalMs: 120,
      motion: true,
      orientation: true,
    })
    const configured = getDeviceSensorEventOptions()
    configureDeviceSensorEvents(previous)

    results.push(
      configured.intervalMs === 120 &&
        configured.motion === true &&
        configured.orientation === true
        ? pass('device sensor helpers', 'ok')
        : fail('device sensor helpers', JSON.stringify(configured)),
    )
  } catch (error) {
    results.push(failFromError('device sensor helpers', error))
  }

  try {
    const motion = readDeviceMotion()
    const orientation = readDeviceOrientation()
    let motionEventSeen = false
    const listener = () => {
      motionEventSeen = true
    }
    addEventListener('devicemotion', listener)
    startDeviceSensorEvents({ intervalMs: 100, orientation: false })
    stopDeviceSensorEvents()
    removeEventListener('devicemotion', listener)
    results.push(
      typeof motion.acceleration.x === 'number' &&
        typeof orientation.absolute === 'boolean' &&
        motionEventSeen
        ? pass('device sensors', 'ok')
        : fail('device sensors', 'missing sensor data'),
    )
  } catch (error) {
    results.push(failFromError('device sensors', error))
  }

  try {
    const capability = 'html-demo-device-smoke'
    const missingCapability = 'html-demo-device-missing'
    const adapter = {
      capability,
      pluginName: 'html-demo',
      getStatus: () => ({
        capability,
        state: 'supported',
        pluginName: 'html-demo',
      }),
    } satisfies DeviceCapabilityAdapter<typeof capability>

    const registry = new DeviceCapabilityRegistry()
    const unregisterLocal = registry.register(adapter)
    registerDeviceCapability(adapter)

    try {
      const localRequired = await registry.requireCapability(capability)
      const sharedSupported = await isSupported(capability)
      const sharedStatus = await getCapabilityStatus(capability)
      const sharedRequired = await requireCapability(capability)
      const missingStatus = await registry.getStatus(missingCapability)
      const removedShared = unregisterDeviceCapability(capability, adapter)

      results.push(
        localRequired.state === 'supported' &&
          sharedSupported &&
          sharedStatus.state === 'supported' &&
          sharedRequired.state === 'supported' &&
          missingStatus.state === 'missing-plugin' &&
          removedShared
          ? pass('device capability registry', 'ok')
          : fail(
              'device capability registry',
              JSON.stringify({
                local: localRequired.state,
                sharedSupported,
                shared: sharedStatus.state,
                required: sharedRequired.state,
                missing: missingStatus.state,
                removedShared,
              }),
            ),
      )
    } finally {
      unregisterDeviceCapability(capability, adapter)
      unregisterLocal()
    }
  } catch (error) {
    results.push(failFromError('device capability registry', error))
  }

  try {
    const typedError = createDeviceCapabilityError(
      'permission-denied',
      'geolocation',
      { message: 'Demo permission denied' },
    )
    const normalizedTyped = normalizeDeviceCapabilityError(
      'geolocation',
      typedError,
    )
    const normalizedUnknown = normalizeDeviceCapabilityError(
      'camera',
      new Error('Camera probe failed'),
    )
    let missingCode = ''

    try {
      await new DeviceCapabilityRegistry().requireCapability('camera')
    } catch (error) {
      if (isDeviceCapabilityError(error)) {
        missingCode = error.code
      }
    }

    results.push(
      typedError instanceof DeviceCapabilityError &&
        isDeviceCapabilityError(typedError) &&
        normalizedTyped === typedError &&
        normalizedUnknown instanceof DeviceCapabilityError &&
        normalizedUnknown.code === 'unsupported-platform' &&
        missingCode === 'missing-plugin'
        ? pass('device capability errors', 'ok')
        : fail(
            'device capability errors',
            `normalized=${normalizedUnknown.code} missing=${missingCode}`,
          ),
    )
  } catch (error) {
    results.push(failFromError('device capability errors', error))
  }

  try {
    const deepLinkAdapter = {
      capability: 'deep-links',
      pluginName: 'html-demo',
      getInitialUrl: () => 'vue-godot://demo',
    }
    const notificationAdapter = {
      capability: 'notifications',
      pluginName: 'html-demo',
      notify: async () => undefined,
    }
    const shareAdapter = {
      capability: 'share',
      pluginName: 'html-demo',
      share: async () => undefined,
    }

    results.push(
      isDeepLinkAdapter(deepLinkAdapter) &&
        isNotificationAdapter(notificationAdapter) &&
        isShareAdapter(shareAdapter)
        ? pass('device adapter guards', 'ok')
        : fail('device adapter guards', 'guard mismatch'),
    )
  } catch (error) {
    results.push(failFromError('device adapter guards', error))
  }

  try {
    let clearedWatchId = 0
    const adapter = createGeolocationAdapter({
      pluginName: 'html-demo-geolocation',
      hasPermission() {
        return true
      },
      getCurrentPosition() {
        return {
          latitude: 35.681236,
          longitude: 139.767125,
          accuracy: 8,
          timestamp: 1234,
        }
      },
      watchPosition(onPosition) {
        onPosition({
          latitude: 35.681236,
          longitude: 139.767125,
          accuracy: 8,
          timestamp: 1235,
        })
        return 7
      },
      clearWatch(watchId) {
        clearedWatchId = watchId
      },
    })
    const status = adapter.getStatus ? await adapter.getStatus() : null
    const position = await adapter.getCurrentPosition()
    let watchedTimestamp = 0
    const watchId = adapter.watchPosition((watchedPosition) => {
      watchedTimestamp = watchedPosition.timestamp
    })
    adapter.clearWatch(watchId)

    results.push(
      status?.state === 'supported' &&
        position.coords.latitude === 35.681236 &&
        position.coords.longitude === 139.767125 &&
        watchId === 7 &&
        watchedTimestamp === 1235 &&
        clearedWatchId === 7
        ? pass('device geolocation adapter', 'ok')
        : fail(
            'device geolocation adapter',
            `status=${status?.state} watch=${watchId} cleared=${clearedWatchId}`,
          ),
    )
  } catch (error) {
    results.push(failFromError('device geolocation adapter', error))
  }

  try {
    let stoppedTrack = false
    const adapter = createMediaDevicesAdapter({
      pluginName: 'html-demo-camera',
      hasPermission() {
        return true
      },
      getUserMedia(constraints) {
        if (constraints.video !== true) {
          throw new Error('Expected video constraint')
        }
        return {
          id: 'html-demo-camera-stream',
          tracks: [
            {
              id: 'html-demo-video-track',
              kind: 'video',
              label: 'Demo Camera',
              stop() {
                stoppedTrack = true
              },
            },
          ],
        }
      },
    })
    const status = adapter.getStatus ? await adapter.getStatus() : null
    const stream = await adapter.getUserMedia({ video: true })
    const tracks = stream.getTracks()
    tracks[0]?.stop()

    results.push(
      status?.state === 'supported' &&
        stream.id === 'html-demo-camera-stream' &&
        tracks.length === 1 &&
        tracks[0]?.kind === 'video' &&
        tracks[0]?.label === 'Demo Camera' &&
        stoppedTrack
        ? pass('device media devices adapter', 'ok')
        : fail(
            'device media devices adapter',
            `status=${status?.state} tracks=${tracks.length}`,
          ),
    )
  } catch (error) {
    results.push(failFromError('device media devices adapter', error))
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

    try {
      const reachable = await checkNetworkReachability({
        url: options.fetchUrl,
        method: 'GET',
        expectedStatus: 200,
        timeoutMs: 5000,
      })
      results.push(
        reachable && navigator.onLine
          ? pass('network reachability probe', 'ok')
          : fail(
              'network reachability probe',
              `reachable=${reachable} online=${navigator.onLine}`,
            ),
      )
    } catch (error) {
      results.push(failFromError('network reachability probe', error))
    }

    assertRequiredBrowserSmokeCoverage(results)
  }

  return results
}
