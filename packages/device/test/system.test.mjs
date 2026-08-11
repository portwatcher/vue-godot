import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-loader.mjs', import.meta.url).href)

const {
  DeviceCapabilityError,
  deviceCapabilities,
  isDeepLinkAdapter,
  isNotificationAdapter,
  isShareAdapter,
  packedStringArrayToStrings,
  registerDeviceCapability,
} = await import('../dist/index.js')

const {
  getDisplayServerName,
  getOSName,
  hasOSFeature,
  isWindowLifecycleSupported,
  onAppLifecycleEvent,
  onOpenUrl,
  openExternalUrl,
  readInitialOpenUrl,
  readPlatformInfo,
  share,
  showNativeNotification,
  toAppLifecycleEventType,
} = await import('../dist/system.js')

function resetDisplayServer(state = {}) {
  globalThis.__vueGodotDeviceMockDisplayServer = {
    clipboard: '',
    clipboardImage: null,
    displayServerName: 'mock-display',
    features: new Set([5, 18]),
    primaryClipboard: '',
    throwOnClipboard: false,
    throwOnWindowCallbacks: false,
    windowCallbackCalls: [],
    windowCallbacks: new Map(),
    ...state,
  }
}

function resetOS(state = {}) {
  globalThis.__vueGodotDeviceMockOS = {
    cmdlineArgs: ['--editor', '--', 'ignored'],
    cmdlineUserArgs: ['--profile=demo'],
    debugBuild: true,
    distributionName: 'Mock Linux',
    features: new Set(['linux', 'pc', 'debug']),
    locale: 'en_US',
    localeLanguage: 'en',
    modelName: 'MockDevice',
    name: 'Linux',
    sandboxed: false,
    shellOpenCalls: [],
    shellOpenResult: 0,
    userfsPersistent: true,
    version: '6.0.0',
    ...state,
  }
}

test('packed string normalization supports stock indexed wrappers', () => {
  const stockValue = {
    0: 'alpha',
    1: 'beta',
    size: () => 2,
  }

  assert.deepEqual(packedStringArrayToStrings(stockValue), ['alpha', 'beta'])
})

test('system helpers read platform and feature information from Godot OS', () => {
  resetDisplayServer()
  resetOS()

  const info = readPlatformInfo({
    featureTags: ['linux', 'android', 'debug'],
  })

  assert.equal(getOSName(), 'Linux')
  assert.equal(getDisplayServerName(), 'mock-display')
  assert.equal(hasOSFeature('linux'), true)
  assert.equal(hasOSFeature('android'), false)
  assert.deepEqual(info.features, {
    linux: true,
    android: false,
    debug: true,
  })
  assert.deepEqual(info.commandLineArgs, ['--editor', '--', 'ignored'])
  assert.deepEqual(info.userArguments, ['--profile=demo'])
  assert.equal(info.isDebugBuild, true)
  assert.equal(info.isUserFileSystemPersistent, true)
})

test('openExternalUrl delegates to OS.shell_open and reports failure', () => {
  resetOS()

  assert.equal(openExternalUrl('https://example.com'), true)
  assert.deepEqual(globalThis.__vueGodotDeviceMockOS.shellOpenCalls, [
    'https://example.com',
  ])

  resetOS({ shellOpenResult: 1 })
  assert.equal(openExternalUrl('bad://url'), false)
})

test('window lifecycle callbacks normalize Godot window events', () => {
  resetDisplayServer()

  assert.equal(isWindowLifecycleSupported(), true)
  assert.equal(toAppLifecycleEventType(2), 'focus')
  assert.equal(toAppLifecycleEventType(999), null)

  const events = []
  const subscription = onAppLifecycleEvent((event) => {
    events.push(event)
  })

  assert.notEqual(subscription, null)
  const callback =
    globalThis.__vueGodotDeviceMockDisplayServer.windowCallbacks.get(0)
  callback.handler(2)
  callback.handler(3)
  callback.handler(4)
  callback.handler(5)

  assert.deepEqual(
    events.map((event) => event.type),
    ['focus', 'blur', 'quit-request', 'back-request'],
  )
  assert.equal(events[0].windowId, 0)

  subscription.disconnect()
  const replacement =
    globalThis.__vueGodotDeviceMockDisplayServer.windowCallbacks.get(0)
  replacement.handler(2)
  assert.equal(events.length, 4)
})

test('window lifecycle callbacks report unavailable DisplayServer hooks', () => {
  resetDisplayServer({
    throwOnWindowCallbacks: true,
  })

  assert.equal(
    onAppLifecycleEvent(() => undefined),
    null,
  )
})

test('share helper delegates to registered share adapters', async () => {
  deviceCapabilities.clear()
  const calls = []
  const adapter = {
    capability: 'share',
    pluginName: 'mock-share',
    isSupported() {
      return true
    },
    async share(data) {
      calls.push(data)
    },
  }

  assert.equal(isShareAdapter(adapter), true)
  const unregister = registerDeviceCapability(adapter)

  try {
    await share({
      files: ['user://report.txt'],
      text: 'Report ready',
      title: 'Report',
      url: 'https://example.com/report',
    })
    assert.deepEqual(calls, [
      {
        files: ['user://report.txt'],
        text: 'Report ready',
        title: 'Report',
        url: 'https://example.com/report',
      },
    ])
  } finally {
    unregister()
    deviceCapabilities.clear()
  }

  await assert.rejects(
    share({ text: 'missing adapter' }),
    (error) =>
      error instanceof DeviceCapabilityError &&
      error.code === 'missing-plugin' &&
      error.capability === 'share',
  )
})

test('deep link helpers delegate to registered deep link adapters', async () => {
  deviceCapabilities.clear()
  const events = []
  let openUrlHandler = null
  let disconnected = false
  const adapter = {
    capability: 'deep-links',
    pluginName: 'mock-links',
    isSupported() {
      return true
    },
    async getInitialUrl() {
      return 'myapp://launch'
    },
    subscribeUrlOpen(handler) {
      openUrlHandler = handler
      return {
        disconnect() {
          disconnected = true
        },
      }
    },
  }

  assert.equal(isDeepLinkAdapter(adapter), true)
  const unregister = registerDeviceCapability(adapter)

  try {
    assert.equal(await readInitialOpenUrl(), 'myapp://launch')
    const subscription = onOpenUrl((event) => {
      events.push(event)
    })
    assert.notEqual(subscription, null)
    openUrlHandler({ source: 'runtime', url: 'myapp://details/1' })
    assert.deepEqual(events, [
      {
        source: 'runtime',
        url: 'myapp://details/1',
      },
    ])

    subscription.disconnect()
    assert.equal(disconnected, true)
  } finally {
    unregister()
    deviceCapabilities.clear()
  }
})

test('native notification helper delegates to registered notification adapters', async () => {
  deviceCapabilities.clear()
  const calls = []
  const adapter = {
    capability: 'notifications',
    pluginName: 'mock-notifications',
    isSupported() {
      return true
    },
    async notify(title, options) {
      calls.push({ options, title })
    },
  }

  assert.equal(isNotificationAdapter(adapter), true)
  const unregister = registerDeviceCapability(adapter)

  try {
    await showNativeNotification('Build complete', {
      body: 'Artifacts are ready.',
      data: { id: 1 },
    })
    assert.deepEqual(calls, [
      {
        options: {
          body: 'Artifacts are ready.',
          data: { id: 1 },
        },
        title: 'Build complete',
      },
    ])
  } finally {
    unregister()
    deviceCapabilities.clear()
  }
})
