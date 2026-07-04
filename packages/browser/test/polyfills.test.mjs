import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-loader.mjs', import.meta.url).href)

const {
  deviceCapabilities,
  registerDeviceCapability,
} = await import('@vue-godot/device')

const {
  GodotAbortController,
  GodotBlob,
  GodotClipboard,
  GodotDeviceMotionEvent,
  GodotDeviceOrientationEvent,
  GodotGeolocation,
  GodotGeolocationCoordinates,
  GodotGeolocationPosition,
  GodotGeolocationPositionError,
  GodotHeaders,
  GodotMediaDevices,
  GodotMediaDevicesError,
  GodotMediaStream,
  GodotMediaStreamTrack,
  GodotRequest,
  GodotResponse,
  GodotTextDecoder,
  GodotTextEncoder,
  GodotWebSocket,
  GodotURL,
  GodotURLSearchParams,
  atob,
  btoa,
  cancelAnimationFrame: godotCancelAnimationFrame,
  clearInterval: godotClearInterval,
  clearTimeout: godotClearTimeout,
  createHistoryAndLocation,
  createObjectURL,
  geolocation: godotGeolocation,
  getGlobalEventTarget,
  getRegisteredMediaDevicesAdapter,
  getRegisteredGeolocationAdapter,
  mediaDevices: godotMediaDevices,
  readDeviceMotion,
  readDeviceOrientation,
  GodotFile,
  GodotFileReader,
  GodotFormData,
  GodotNavigator,
  GodotPermissionStatus,
  GodotPermissions,
  GodotStorage,
  clipboard: godotClipboard,
  checkNetworkReachability,
  configureNetworkReachability,
  createLocalStorage,
  createSessionStorage,
  performance: godotPerformance,
  queueMicrotask: godotQueueMicrotask,
  requestAnimationFrame: godotRequestAnimationFrame,
  resolveObjectURL,
  revokeObjectURL,
  navigator: godotNavigator,
  setNavigatorOnline,
  setInterval: godotSetInterval,
  setTimeout: godotSetTimeout,
  startDeviceSensorEvents,
  stopDeviceSensorEvents,
  vibrate: godotVibrate,
} = await import('../dist/index.js')

function resetMockHttp(responses) {
  globalThis.__vueGodotBrowserMockHttp = {
    requests: [],
    responses: [...responses],
  }
  return globalThis.__vueGodotBrowserMockHttp
}

function resetMockDisplayServer(options = {}) {
  globalThis.__vueGodotBrowserMockDisplayServer = {
    clipboard: options.clipboard ?? '',
    features: new Set(options.features ?? [5]),
  }
  return globalThis.__vueGodotBrowserMockDisplayServer
}

function resetMockInput(options = {}) {
  globalThis.__vueGodotBrowserMockInput = {
    accelerometer: options.accelerometer ?? { x: 0, y: 0, z: 0 },
    gravity: options.gravity ?? { x: 0, y: 0, z: 0 },
    gyroscope: options.gyroscope ?? { x: 0, y: 0, z: 0 },
    magnetometer: options.magnetometer ?? { x: 0, y: 0, z: 0 },
    vibrations: [],
    throwOnVibrate: options.throwOnVibrate ?? false,
  }
  return globalThis.__vueGodotBrowserMockInput
}

function resetMockOS(options = {}) {
  globalThis.__vueGodotBrowserMockOS = {
    grantedPermissions: options.grantedPermissions ?? [],
    userFsPersistent: options.userFsPersistent ?? true,
  }
  return globalThis.__vueGodotBrowserMockOS
}

function resetMockWebSocket(options = {}) {
  globalThis.__vueGodotBrowserMockWebSocket = {
    peers: [],
    connectError: options.connectError ?? 0,
    sendError: options.sendError ?? 0,
    openOnPoll: options.openOnPoll ?? true,
  }
  return globalThis.__vueGodotBrowserMockWebSocket
}

const mockGeolocationPosition = {
  coords: {
    latitude: 35.681236,
    longitude: 139.767125,
    accuracy: 12,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  timestamp: 1234,
}

function createMockMediaStream() {
  const stoppedTracks = []
  const tracks = [
    {
      id: 'audio-1',
      kind: 'audio',
      label: 'Microphone',
      stop() {
        stoppedTracks.push('audio-1')
      },
    },
    {
      id: 'video-1',
      kind: 'video',
      label: 'Camera',
      stop() {
        stoppedTracks.push('video-1')
      },
    },
  ]

  return {
    stoppedTracks,
    stream: {
      id: 'stream-1',
      getTracks() {
        return tracks
      },
    },
  }
}

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

test('GodotFile exposes file metadata and inherits Blob readers', async () => {
  const file = new GodotFile(['hello'], 'greeting.txt', {
    type: 'text/plain',
    lastModified: 123,
  })

  assert.equal(file.name, 'greeting.txt')
  assert.equal(file.type, 'text/plain')
  assert.equal(file.lastModified, 123)
  assert.equal(file.size, 5)
  assert.equal(await file.text(), 'hello')
})

test('GodotFormData stores duplicate values and serializes multipart bodies', async () => {
  const form = new GodotFormData()
  const file = new GodotFile(['file-body'], 'upload.txt', {
    type: 'text/plain',
  })

  form.append('name', 'first')
  form.append('name', 'second')
  form.append('upload', file)
  form.set('name', 'final')

  assert.equal(form.get('name'), 'final')
  assert.deepEqual(form.getAll('name'), ['final'])
  assert.equal(form.get('upload'), file)
  assert.deepEqual(
    [...form].map(([name]) => name),
    ['name', 'upload'],
  )

  const body = new GodotTextDecoder().decode(
    await form._toMultipartArrayBuffer(),
  )
  assert.match(
    form._getMultipartContentType(),
    /^multipart\/form-data; boundary=/,
  )
  assert.match(body, /Content-Disposition: form-data; name="name"/)
  assert.match(
    body,
    /Content-Disposition: form-data; name="upload"; filename="upload.txt"/,
  )
  assert.match(body, /Content-Type: text\/plain/)
  assert.match(body, /file-body/)
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

test('GodotStorage implements Web Storage methods', () => {
  const storage = createSessionStorage()

  storage.setItem('count', 1)
  storage.setItem('enabled', true)

  assert.equal(storage.length, 2)
  assert.equal(storage.getItem('count'), '1')
  assert.equal(storage.getItem('enabled'), 'true')
  assert.equal(storage.key(0), 'count')
  assert.equal(storage.key(10), null)

  storage.removeItem('count')
  assert.equal(storage.getItem('count'), null)

  storage.clear()
  assert.equal(storage.length, 0)
  assert.ok(storage instanceof GodotStorage)
})

test('localStorage persists through the Godot user:// backend', () => {
  globalThis.__vueGodotBrowserMockFiles = new Map()
  const path = 'user://storage-test.json'
  const first = createLocalStorage(path)
  first.setItem('token', 'abc')

  const second = createLocalStorage(path)

  assert.equal(second.getItem('token'), 'abc')
  second.removeItem('token')

  const third = createLocalStorage(path)
  assert.equal(third.getItem('token'), null)
})

test('navigator.onLine changes dispatch online and offline events', () => {
  const target = getGlobalEventTarget()
  const events = []
  const onOnline = () => events.push('online')
  const onOffline = () => events.push('offline')

  target.addEventListener('online', onOnline)
  target.addEventListener('offline', onOffline)

  setNavigatorOnline(true)
  setNavigatorOnline(false)
  setNavigatorOnline(false)
  setNavigatorOnline(true)

  target.removeEventListener('online', onOnline)
  target.removeEventListener('offline', onOffline)

  assert.ok(godotNavigator instanceof GodotNavigator)
  assert.equal(godotNavigator.onLine, true)
  assert.deepEqual(events, ['offline', 'online'])
})

test('checkNetworkReachability probes configured URL and updates navigator state', async () => {
  const http = resetMockHttp([
    {
      status: 204,
      headers: {},
      body: '',
    },
    {
      status: 503,
      headers: {},
      body: '',
    },
  ])
  configureNetworkReachability({
    url: 'https://status.example.com/health',
    method: 'GET',
    timeoutMs: 250,
    expectedStatus: [200, 204],
  })

  const first = await checkNetworkReachability()
  const second = await checkNetworkReachability()

  assert.equal(first, true)
  assert.equal(second, false)
  assert.equal(godotNavigator.onLine, false)
  assert.equal(http.requests.length, 2)
  assert.equal(http.requests[0].methodName, 'GET')
  assert.equal(http.requests[0].hostname, 'status.example.com')
  assert.equal(http.requests[0].path, '/health')
})

test('navigator.permissions.query reports mapped permission states', async () => {
  resetMockDisplayServer()
  resetMockOS({
    grantedPermissions: [
      'android.permission.CAMERA',
      'android.permission.ACCESS_COARSE_LOCATION',
    ],
  })

  const camera = await godotNavigator.permissions.query({ name: 'camera' })
  const microphone = await godotNavigator.permissions.query({
    name: 'microphone',
  })
  const geolocation = await godotNavigator.permissions.query({
    name: 'geolocation',
  })
  const clipboardRead = await godotNavigator.permissions.query({
    name: 'clipboard-read',
  })
  const accelerometer = await godotNavigator.permissions.query({
    name: 'accelerometer',
  })

  assert.ok(godotNavigator.permissions instanceof GodotPermissions)
  assert.ok(camera instanceof GodotPermissionStatus)
  assert.equal(camera.name, 'camera')
  assert.equal(camera.state, 'granted')
  assert.equal(microphone.state, 'prompt')
  assert.equal(geolocation.state, 'granted')
  assert.equal(clipboardRead.state, 'granted')
  assert.equal(accelerometer.state, 'granted')
})

test('navigator.permissions.query denies unavailable capabilities and rejects unknown names', async () => {
  resetMockDisplayServer({ features: [] })
  resetMockOS({ userFsPersistent: false })

  const clipboardRead = await godotNavigator.permissions.query({
    name: 'clipboard-read',
  })
  const persistentStorage = await godotNavigator.permissions.query({
    name: 'persistent-storage',
  })

  assert.equal(clipboardRead.state, 'denied')
  assert.equal(persistentStorage.state, 'denied')
  await assert.rejects(
    () => godotNavigator.permissions.query({ name: 'screen-wake-lock' }),
    TypeError,
  )
})

test('navigator.geolocation is exposed only when an adapter is registered', () => {
  deviceCapabilities.clear()

  assert.equal(godotNavigator.geolocation, undefined)
  assert.equal(getRegisteredGeolocationAdapter(), null)

  const unregister = registerDeviceCapability({
    capability: 'geolocation',
    pluginName: 'mock-location',
    isSupported() {
      return true
    },
    async getCurrentPosition() {
      return mockGeolocationPosition
    },
    watchPosition() {
      return 1
    },
    clearWatch() {},
  })

  try {
    assert.equal(godotNavigator.geolocation, godotGeolocation)
    assert.ok(godotGeolocation instanceof GodotGeolocation)
    assert.equal(getRegisteredGeolocationAdapter()?.pluginName, 'mock-location')
  } finally {
    unregister()
    deviceCapabilities.clear()
  }
})

test('navigator.geolocation delegates getCurrentPosition to the registered adapter', async () => {
  deviceCapabilities.clear()
  let receivedOptions = null

  const unregister = registerDeviceCapability({
    capability: 'geolocation',
    pluginName: 'mock-location',
    isSupported() {
      return true
    },
    async getCurrentPosition(options) {
      receivedOptions = options
      return mockGeolocationPosition
    },
    watchPosition() {
      return 1
    },
    clearWatch() {},
  })

  try {
    const position = await new Promise((resolve, reject) => {
      godotNavigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 500,
      })
    })

    assert.ok(position instanceof GodotGeolocationPosition)
    assert.ok(position.coords instanceof GodotGeolocationCoordinates)
    assert.equal(position.coords.latitude, 35.681236)
    assert.equal(position.coords.longitude, 139.767125)
    assert.equal(position.coords.altitude, null)
    assert.equal(position.timestamp, 1234)
    assert.deepEqual(receivedOptions, {
      enableHighAccuracy: true,
      timeout: 500,
    })
  } finally {
    unregister()
    deviceCapabilities.clear()
  }
})

test('navigator.geolocation watches positions and clears adapter watches', async () => {
  deviceCapabilities.clear()
  const clearedWatchIds = []
  let receivedOptions = null

  const unregister = registerDeviceCapability({
    capability: 'geolocation',
    pluginName: 'mock-location',
    isSupported() {
      return true
    },
    async getCurrentPosition() {
      return mockGeolocationPosition
    },
    watchPosition(onPosition, _onError, options) {
      receivedOptions = options
      onPosition(mockGeolocationPosition)
      return 42
    },
    clearWatch(watchId) {
      clearedWatchIds.push(watchId)
    },
  })

  try {
    const positions = []
    const watchId = godotNavigator.geolocation.watchPosition(
      (position) => {
        positions.push(position)
      },
      null,
      { maximumAge: 1000 },
    )

    await new Promise((resolve) => setTimeout(resolve, 0))
    godotNavigator.geolocation.clearWatch(watchId)

    assert.equal(positions.length, 1)
    assert.ok(positions[0] instanceof GodotGeolocationPosition)
    assert.deepEqual(receivedOptions, { maximumAge: 1000 })
    assert.deepEqual(clearedWatchIds, [42])
  } finally {
    unregister()
    deviceCapabilities.clear()
  }
})

test('navigator.geolocation maps capability failures to browser error codes', async () => {
  deviceCapabilities.clear()

  const missingPluginError = await new Promise((resolve) => {
    godotGeolocation.getCurrentPosition(
      () => {
        resolve(null)
      },
      resolve,
    )
  })

  assert.ok(missingPluginError instanceof GodotGeolocationPositionError)
  assert.equal(
    missingPluginError.code,
    GodotGeolocationPositionError.POSITION_UNAVAILABLE,
  )

  const unregister = registerDeviceCapability({
    capability: 'geolocation',
    pluginName: 'mock-location',
    getStatus() {
      return {
        capability: 'geolocation',
        state: 'permission-denied',
        message: 'Location permission denied.',
      }
    },
    async getCurrentPosition() {
      return mockGeolocationPosition
    },
    watchPosition() {
      return 1
    },
    clearWatch() {},
  })

  try {
    const permissionError = await new Promise((resolve) => {
      godotGeolocation.getCurrentPosition(
        () => {
          resolve(null)
        },
        resolve,
      )
    })

    assert.ok(permissionError instanceof GodotGeolocationPositionError)
    assert.equal(
      permissionError.code,
      GodotGeolocationPositionError.PERMISSION_DENIED,
    )
    assert.equal(permissionError.message, 'Location permission denied.')
  } finally {
    unregister()
    deviceCapabilities.clear()
  }

  const timeoutAdapter = {
    capability: 'geolocation',
    pluginName: 'mock-location',
    isSupported() {
      return true
    },
    async getCurrentPosition() {
      throw new Error('Location timeout.')
    },
    watchPosition() {
      return 1
    },
    clearWatch() {},
  }
  const unregisterTimeout = registerDeviceCapability(timeoutAdapter)

  try {
    const timeoutError = await new Promise((resolve) => {
      godotGeolocation.getCurrentPosition(
        () => {
          resolve(null)
        },
        resolve,
      )
    })

    assert.ok(timeoutError instanceof GodotGeolocationPositionError)
    assert.equal(timeoutError.code, GodotGeolocationPositionError.TIMEOUT)
  } finally {
    unregisterTimeout()
    deviceCapabilities.clear()
  }
})

test('navigator.mediaDevices is exposed only when an adapter is registered', () => {
  deviceCapabilities.clear()

  assert.equal(godotNavigator.mediaDevices, undefined)
  assert.equal(getRegisteredMediaDevicesAdapter(), null)

  const unregister = registerDeviceCapability({
    capability: 'media-devices',
    pluginName: 'mock-media',
    isSupported() {
      return true
    },
    async getUserMedia() {
      return createMockMediaStream().stream
    },
  })

  try {
    assert.equal(godotNavigator.mediaDevices, godotMediaDevices)
    assert.ok(godotMediaDevices instanceof GodotMediaDevices)
    assert.equal(getRegisteredMediaDevicesAdapter()?.pluginName, 'mock-media')
  } finally {
    unregister()
    deviceCapabilities.clear()
  }
})

test('navigator.mediaDevices.getUserMedia wraps adapter streams and tracks', async () => {
  deviceCapabilities.clear()
  let receivedConstraints = null
  const mock = createMockMediaStream()

  const unregister = registerDeviceCapability({
    capability: 'media-devices',
    pluginName: 'mock-media',
    isSupported() {
      return true
    },
    async getUserMedia(constraints) {
      receivedConstraints = constraints
      return mock.stream
    },
  })

  try {
    const stream = await godotNavigator.mediaDevices.getUserMedia({
      audio: true,
      video: { facingMode: 'user' },
    })
    const tracks = stream.getTracks()
    const audioTracks = stream.getAudioTracks()
    const videoTracks = stream.getVideoTracks()

    assert.ok(stream instanceof GodotMediaStream)
    assert.equal(stream.id, 'stream-1')
    assert.equal(stream.active, true)
    assert.equal(tracks.length, 2)
    assert.ok(tracks[0] instanceof GodotMediaStreamTrack)
    assert.equal(audioTracks.length, 1)
    assert.equal(videoTracks.length, 1)
    assert.equal(stream.getTrackById('video-1'), videoTracks[0])
    assert.equal(stream.getTrackById('missing'), null)
    assert.deepEqual(receivedConstraints, {
      audio: true,
      video: { facingMode: 'user' },
    })

    tracks[0].stop()
    assert.equal(tracks[0].readyState, 'ended')
    tracks[0].stop()
    tracks[1].stop()
    assert.deepEqual(mock.stoppedTracks, ['audio-1', 'video-1'])
    assert.equal(stream.active, false)
  } finally {
    unregister()
    deviceCapabilities.clear()
  }
})

test('navigator.mediaDevices.getUserMedia validates constraints', async () => {
  await assert.rejects(
    () => godotMediaDevices.getUserMedia({}),
    (error) =>
      error instanceof TypeError &&
      error.message.includes('audio and/or video'),
  )
})

test('navigator.mediaDevices.getUserMedia maps adapter failures', async () => {
  deviceCapabilities.clear()

  await assert.rejects(
    () => godotMediaDevices.getUserMedia({ video: true }),
    (error) =>
      error instanceof GodotMediaDevicesError &&
      error.name === 'NotFoundError',
  )

  const unregisterDenied = registerDeviceCapability({
    capability: 'media-devices',
    pluginName: 'mock-media',
    getStatus() {
      return {
        capability: 'media-devices',
        state: 'permission-denied',
        message: 'Camera permission denied.',
      }
    },
    async getUserMedia() {
      return createMockMediaStream().stream
    },
  })

  try {
    await assert.rejects(
      () => godotMediaDevices.getUserMedia({ video: true }),
      (error) =>
        error instanceof GodotMediaDevicesError &&
        error.name === 'NotAllowedError' &&
        error.message === 'Camera permission denied.',
    )
  } finally {
    unregisterDenied()
    deviceCapabilities.clear()
  }

  const unregisterExport = registerDeviceCapability({
    capability: 'media-devices',
    pluginName: 'mock-media',
    getStatus() {
      return {
        capability: 'media-devices',
        state: 'export-misconfiguration',
        message: 'CAMERA export permission is missing.',
      }
    },
    async getUserMedia() {
      return createMockMediaStream().stream
    },
  })

  try {
    await assert.rejects(
      () => godotMediaDevices.getUserMedia({ video: true }),
      (error) =>
        error instanceof GodotMediaDevicesError &&
        error.name === 'NotReadableError' &&
        error.message === 'CAMERA export permission is missing.',
    )
  } finally {
    unregisterExport()
    deviceCapabilities.clear()
  }
})

test('navigator.clipboard reads and writes DisplayServer text clipboard', async () => {
  const displayServer = resetMockDisplayServer()

  await godotNavigator.clipboard.writeText('hello clipboard')

  assert.ok(godotNavigator.clipboard instanceof GodotClipboard)
  assert.equal(godotNavigator.clipboard, godotClipboard)
  assert.equal(displayServer.clipboard, 'hello clipboard')
  assert.equal(await godotNavigator.clipboard.readText(), 'hello clipboard')
})

test('navigator.clipboard rejects when DisplayServer clipboard is unsupported', async () => {
  resetMockDisplayServer({ features: [] })

  await assert.rejects(() => godotClipboard.readText(), {
    name: 'NotSupportedError',
  })
  await assert.rejects(() => godotClipboard.writeText('blocked'), {
    name: 'NotSupportedError',
  })
})

test('navigator.vibrate delegates to Input.vibrate_handheld', async () => {
  const input = resetMockInput()

  assert.equal(godotNavigator.vibrate([5, 5, 10]), true)
  assert.deepEqual(input.vibrations, [{ durationMs: 5, amplitude: -1 }])

  await new Promise((resolve) => globalThis.setTimeout(resolve, 20))

  assert.deepEqual(input.vibrations, [
    { durationMs: 5, amplitude: -1 },
    { durationMs: 10, amplitude: -1 },
  ])
})

test('navigator.vibrate validates patterns and cancels pending vibration', async () => {
  const input = resetMockInput()

  assert.equal(godotVibrate(-1), false)
  assert.deepEqual(input.vibrations, [])

  assert.equal(godotNavigator.vibrate([1, 50, 1]), true)
  assert.equal(godotNavigator.vibrate(0), true)

  await new Promise((resolve) => globalThis.setTimeout(resolve, 60))

  assert.deepEqual(input.vibrations, [
    { durationMs: 1, amplitude: -1 },
    { durationMs: 0, amplitude: -1 },
  ])
})

test('navigator.vibrate returns false when Godot vibration fails', () => {
  resetMockInput({ throwOnVibrate: true })

  assert.equal(godotNavigator.vibrate(5), false)
})

test('device sensor helpers read motion and orientation values', () => {
  resetMockInput({
    accelerometer: { x: 1, y: 2, z: 3 },
    gravity: { x: 0, y: 0, z: 9.8 },
    gyroscope: { x: Math.PI / 2, y: Math.PI, z: Math.PI * 2 },
    magnetometer: { x: 0, y: 1, z: 0 },
  })

  const motion = readDeviceMotion(25)
  const orientation = readDeviceOrientation()

  assert.deepEqual(motion.acceleration, { x: 1, y: 2, z: 3 })
  assert.deepEqual(motion.accelerationIncludingGravity, {
    x: 1,
    y: 2,
    z: 12.8,
  })
  assert.equal(motion.rotationRate.beta, 90)
  assert.equal(motion.rotationRate.gamma, 180)
  assert.equal(motion.rotationRate.alpha, 360)
  assert.equal(motion.interval, 25)
  assert.equal(orientation.alpha, 90)
  assert.equal(orientation.beta, -0)
  assert.equal(orientation.gamma, 0)
  assert.equal(orientation.absolute, true)
})

test('device sensor events dispatch on the global event target', () => {
  resetMockInput({
    accelerometer: { x: 1, y: 0, z: 0 },
    gravity: { x: 0, y: 0, z: 9.8 },
    magnetometer: { x: 1, y: 0, z: 0 },
  })

  const target = getGlobalEventTarget()
  const events = []
  const onMotion = (event) => {
    events.push(event)
  }
  const onOrientation = (event) => {
    events.push(event)
  }

  target.addEventListener('devicemotion', onMotion)
  target.addEventListener('deviceorientation', onOrientation)
  startDeviceSensorEvents({ intervalMs: 20 })
  stopDeviceSensorEvents()
  target.removeEventListener('devicemotion', onMotion)
  target.removeEventListener('deviceorientation', onOrientation)

  assert.equal(events.length, 2)
  assert.ok(events[0] instanceof GodotDeviceMotionEvent)
  assert.ok(events[1] instanceof GodotDeviceOrientationEvent)
  assert.equal(events[0].acceleration.x, 1)
  assert.equal(events[1].alpha, 0)
})

test('GodotWebSocket opens, sends, receives, and closes', async () => {
  const socketState = resetMockWebSocket()
  const events = []
  const socket = new GodotWebSocket('wss://example.com/socket', ['chat'])
  socket.binaryType = 'arraybuffer'
  socket.onopen = () => {
    events.push('open')
  }
  socket.onmessage = (event) => {
    events.push(event.data)
  }
  socket.onclose = (event) => {
    events.push(`close:${event.code}:${event.reason}`)
  }

  await new Promise((resolve) => globalThis.setTimeout(resolve, 20))

  const peer = socketState.peers[0]
  assert.equal(socket.readyState, socket.OPEN)
  assert.equal(socket.protocol, 'chat')
  assert.equal(peer.url, 'wss://example.com/socket')
  assert.equal(Boolean(peer.tlsOptions), true)

  socket.send('hello')
  socket.send(new Uint8Array([1, 2, 3]))
  peer.queueText('reply')
  peer.queueBinary([4, 5, 6])

  await new Promise((resolve) => globalThis.setTimeout(resolve, 20))

  socket.close(1000, 'done')
  await new Promise((resolve) => globalThis.setTimeout(resolve, 20))

  assert.deepEqual(peer.sent, [
    { type: 'text', message: 'hello' },
    { type: 'binary', writeMode: 1, bytes: [1, 2, 3] },
  ])
  assert.equal(events[0], 'open')
  assert.equal(events[1], 'reply')
  assert.ok(events[2] instanceof ArrayBuffer)
  assert.deepEqual([...new Uint8Array(events[2])], [4, 5, 6])
  assert.equal(events[3], 'close:1000:done')
  assert.equal(socket.readyState, socket.CLOSED)
})

test('GodotWebSocket validates URLs and reports send errors', async () => {
  assert.throws(() => new GodotWebSocket('https://example.com'), /ws: or wss:/)

  resetMockWebSocket({ connectError: 42 })
  const failedSocket = new GodotWebSocket('ws://example.com/fail')
  let failedClose = null
  failedSocket.onclose = (event) => {
    failedClose = event
  }

  assert.equal(failedSocket.readyState, failedSocket.CONNECTING)
  await new Promise((resolve) => globalThis.setTimeout(resolve, 20))
  assert.equal(failedClose?.code, 1006)
  assert.match(failedClose?.reason, /connect_to_url failed/)
  assert.equal(failedSocket.readyState, failedSocket.CLOSED)

  resetMockWebSocket({ sendError: 7 })
  const socket = new GodotWebSocket('ws://example.com/socket')
  let closed = null
  socket.onclose = (event) => {
    closed = event
  }

  await new Promise((resolve) => globalThis.setTimeout(resolve, 20))
  socket.send('will fail')

  assert.equal(closed?.code, 1006)
  assert.equal(socket.readyState, socket.CLOSED)
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

test('GodotFileReader reads Blob content and emits load events', async () => {
  const reader = new GodotFileReader()
  const events = []
  reader.onloadstart = () => events.push('loadstart')
  reader.onload = () => events.push('load')
  reader.onloadend = () => events.push('loadend')

  await new Promise((resolve, reject) => {
    reader.addEventListener('loadend', resolve)
    reader.addEventListener('error', () => reject(reader.error))
    reader.readAsDataURL(new GodotBlob(['hello'], { type: 'text/plain' }))
  })

  assert.equal(reader.readyState, reader.DONE)
  assert.equal(reader.result, 'data:text/plain;base64,aGVsbG8=')
  assert.deepEqual(events, ['loadstart', 'load', 'loadend'])

  const textReader = new GodotFileReader()
  await new Promise((resolve, reject) => {
    textReader.onloadend = resolve
    textReader.onerror = () => reject(textReader.error)
    textReader.readAsText(new GodotBlob(['hello']))
  })
  assert.equal(textReader.result, 'hello')
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
