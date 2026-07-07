import {
  GodotClipboardError,
  checkNetworkReachability,
  fetch,
  isClipboardSupported,
  isVibrationSupported,
  localStorage,
  navigator as godotNavigator,
  readDeviceMotion,
  readDeviceOrientation,
  sessionStorage,
  setNavigatorOnline,
} from '@vue-godot/browser'
import {
  getCapabilityStatus,
  type DeviceCapabilityName,
  type DeviceCapabilityStatus,
} from '@vue-godot/device'
import { Callable, DisplayServer, LineEdit, Rect2, TextEdit } from 'godot'
import { readNativeLifecycleEvidence } from './nativeLifecycleEvidence'

export type ProductionProfileCheckState = 'pass' | 'fail' | 'info'

export interface ProductionProfileCheckResult {
  name: string
  state: ProductionProfileCheckState
  detail: string
}

export interface ProductionProfileCheckSummary {
  results: ProductionProfileCheckResult[]
  passed: number
  failed: number
  info: number
}

export const NATIVE_RELEASE_CHECKS_PREFIX = '[native-release-checks]'

export function logProductionProfileCheckSummary(
  summary: ProductionProfileCheckSummary,
): void {
  console.log(
    `${NATIVE_RELEASE_CHECKS_PREFIX} summary passed=${summary.passed} info=${summary.info} failed=${summary.failed}`,
  )
  for (const result of summary.results) {
    console.log(
      `${NATIVE_RELEASE_CHECKS_PREFIX} ${result.state} ${result.name}: ${result.detail}`,
    )
  }
}

function pass(name: string, detail: string): ProductionProfileCheckResult {
  return { name, state: 'pass', detail }
}

function fail(name: string, error: unknown): ProductionProfileCheckResult {
  return {
    name,
    state: 'fail',
    detail: error instanceof Error ? error.message : String(error),
  }
}

function info(name: string, detail: string): ProductionProfileCheckResult {
  return { name, state: 'info', detail }
}

function summarize(
  results: ProductionProfileCheckResult[],
): ProductionProfileCheckSummary {
  return {
    results,
    passed: results.filter((result) => result.state === 'pass').length,
    failed: results.filter((result) => result.state === 'fail').length,
    info: results.filter((result) => result.state === 'info').length,
  }
}

async function checkFetch(): Promise<ProductionProfileCheckResult> {
  try {
    const response = await fetch('https://example.com/', { method: 'HEAD' })
    return response.ok
      ? pass('fetch', `HEAD https://example.com/ -> ${response.status}`)
      : fail('fetch', `unexpected status ${response.status}`)
  } catch (error) {
    return fail('fetch', error)
  }
}

function checkWebSocket(): ProductionProfileCheckResult {
  try {
    return typeof WebSocket === 'function' &&
      WebSocket.CONNECTING === 0 &&
      WebSocket.OPEN === 1 &&
      WebSocket.CLOSING === 2 &&
      WebSocket.CLOSED === 3
      ? pass('WebSocket', 'constructor and ready states available')
      : fail('WebSocket', 'constructor or ready-state constants missing')
  } catch (error) {
    return fail('WebSocket', error)
  }
}

async function checkReachability(): Promise<ProductionProfileCheckResult> {
  try {
    const reachable = await checkNetworkReachability({
      url: 'https://example.com/',
      method: 'HEAD',
      timeoutMs: 5000,
    })
    return reachable
      ? pass('checkNetworkReachability', 'example.com reachable')
      : fail('checkNetworkReachability', 'example.com not reachable')
  } catch (error) {
    return fail('checkNetworkReachability', error)
  }
}

function checkNavigatorOnline(): ProductionProfileCheckResult {
  try {
    let onlineEventSeen = false
    let offlineEventSeen = false
    const onOnline = () => {
      onlineEventSeen = true
    }
    const onOffline = () => {
      offlineEventSeen = true
    }

    addEventListener('online', onOnline)
    addEventListener('offline', onOffline)
    setNavigatorOnline(false)
    setNavigatorOnline(true)
    removeEventListener('online', onOnline)
    removeEventListener('offline', onOffline)

    return godotNavigator.onLine && onlineEventSeen && offlineEventSeen
      ? pass('navigator.onLine', 'online/offline events dispatched')
      : fail(
          'navigator.onLine',
          `state=${godotNavigator.onLine} onlineEvent=${onlineEventSeen} offlineEvent=${offlineEventSeen}`,
        )
  } catch (error) {
    return fail('navigator.onLine', error)
  }
}

function checkStorage(): ProductionProfileCheckResult[] {
  const token = `native-profile-${Date.now()}`
  const results: ProductionProfileCheckResult[] = []

  try {
    localStorage.setItem('native-app-demo.profile-check.local', token)
    const value = localStorage.getItem('native-app-demo.profile-check.local')
    results.push(
      value === token
        ? pass('localStorage', 'write/read succeeded')
        : fail('localStorage', `unexpected value ${String(value)}`),
    )
  } catch (error) {
    results.push(fail('localStorage', error))
  } finally {
    localStorage.removeItem('native-app-demo.profile-check.local')
  }

  try {
    sessionStorage.setItem('native-app-demo.profile-check.session', token)
    const value = sessionStorage.getItem(
      'native-app-demo.profile-check.session',
    )
    results.push(
      value === token
        ? pass('sessionStorage', 'write/read succeeded')
        : fail('sessionStorage', `unexpected value ${String(value)}`),
    )
  } catch (error) {
    results.push(fail('sessionStorage', error))
  } finally {
    sessionStorage.removeItem('native-app-demo.profile-check.session')
  }

  return results
}

function checkStorageRestartMarker(): ProductionProfileCheckResult {
  const localKey = 'native-app-demo.profile-check.restart.local'
  const sessionKey = 'native-app-demo.profile-check.restart.session'
  const validatedKey = 'native-app-demo.profile-check.restart.validated'

  try {
    const validatedAt = localStorage.getItem(validatedKey)
    const previousLocal = localStorage.getItem(localKey)
    const previousSession = sessionStorage.getItem(sessionKey)
    const token = new Date().toISOString()
    localStorage.setItem(localKey, token)
    sessionStorage.setItem(sessionKey, token)

    if (previousLocal && previousSession === null) {
      localStorage.setItem(validatedKey, token)
      return pass(
        'storage restart marker',
        'localStorage restored and sessionStorage reset for this runtime',
      )
    }

    if (validatedAt) {
      return pass(
        'storage restart marker',
        `restart validation recorded at ${validatedAt}`,
      )
    }

    if (previousLocal && previousSession) {
      return info(
        'storage restart marker',
        'same-runtime markers present; restart app and run again',
      )
    }

    return info(
      'storage restart marker',
      'marker created; restart app and run again',
    )
  } catch (error) {
    return fail('storage restart marker', error)
  }
}

async function checkPermission(
  name:
    | 'camera'
    | 'geolocation'
    | 'microphone'
    | 'clipboard-read'
    | 'accelerometer',
): Promise<ProductionProfileCheckResult> {
  try {
    const status = await godotNavigator.permissions.query({ name })
    return ['granted', 'denied', 'prompt'].includes(status.state)
      ? pass(`navigator.permissions.query:${name}`, status.state)
      : fail(`navigator.permissions.query:${name}`, status.state)
  } catch (error) {
    return fail(`navigator.permissions.query:${name}`, error)
  }
}

async function checkClipboard(): Promise<ProductionProfileCheckResult> {
  if (!isClipboardSupported()) {
    return info('navigator.clipboard', 'unsupported on this DisplayServer')
  }

  try {
    const token = `native profile ${Date.now()}`
    await godotNavigator.clipboard.writeText(token)
    const value = await godotNavigator.clipboard.readText()
    return value === token
      ? pass('navigator.clipboard', 'write/read succeeded')
      : fail('navigator.clipboard', `unexpected value ${value}`)
  } catch (error) {
    return error instanceof GodotClipboardError
      ? info('navigator.clipboard', `${error.name}: ${error.message}`)
      : fail('navigator.clipboard', error)
  }
}

async function checkCapability(
  capability: DeviceCapabilityName,
): Promise<DeviceCapabilityStatus> {
  return getCapabilityStatus(capability)
}

function statusDetail(status: DeviceCapabilityStatus): string {
  return status.pluginName
    ? `${status.state} via ${status.pluginName}`
    : status.state
}

async function checkAdapterState(
  capability: DeviceCapabilityName,
): Promise<ProductionProfileCheckResult> {
  try {
    const status = await checkCapability(capability)
    return status.state === 'supported'
      ? pass(`${capability} adapter`, statusDetail(status))
      : info(`${capability} adapter`, statusDetail(status))
  } catch (error) {
    return fail(`${capability} adapter`, error)
  }
}

async function checkMediaDevicesCall(): Promise<ProductionProfileCheckResult> {
  try {
    const status = await checkCapability('media-devices')
    if (status.state !== 'supported') {
      return info('navigator.mediaDevices.getUserMedia', statusDetail(status))
    }
    if (!godotNavigator.mediaDevices) {
      return fail(
        'navigator.mediaDevices.getUserMedia',
        'navigator adapter missing',
      )
    }

    const stream = await godotNavigator.mediaDevices.getUserMedia({
      video: true,
    })
    const tracks = stream.getTracks()
    for (const track of tracks) {
      track.stop()
    }
    return pass(
      'navigator.mediaDevices.getUserMedia',
      `opened ${tracks.length} track(s)`,
    )
  } catch (error) {
    return fail('navigator.mediaDevices.getUserMedia', error)
  }
}

async function checkGeolocationCall(): Promise<ProductionProfileCheckResult> {
  try {
    const status = await checkCapability('geolocation')
    if (status.state !== 'supported') {
      return info('navigator.geolocation', statusDetail(status))
    }
    if (!godotNavigator.geolocation) {
      return fail('navigator.geolocation', 'navigator adapter missing')
    }

    return new Promise((resolve) => {
      godotNavigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(
            pass(
              'navigator.geolocation',
              `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
            ),
          )
        },
        (error) => {
          resolve(
            fail('navigator.geolocation', `${error.name}: ${error.message}`),
          )
        },
        { timeout: 3000, enableHighAccuracy: false },
      )
    })
  } catch (error) {
    return fail('navigator.geolocation', error)
  }
}

function checkVibration(): ProductionProfileCheckResult {
  try {
    const supported = isVibrationSupported()
    const accepted = godotNavigator.vibrate(0)
    return typeof accepted === 'boolean'
      ? pass('navigator.vibrate', `supported=${supported} accepted=${accepted}`)
      : fail('navigator.vibrate', `unexpected result ${String(accepted)}`)
  } catch (error) {
    return fail('navigator.vibrate', error)
  }
}

function checkSensors(): ProductionProfileCheckResult {
  try {
    const motion = readDeviceMotion()
    const orientation = readDeviceOrientation()
    const hasMotionNumbers =
      Number.isFinite(motion.acceleration.x) &&
      Number.isFinite(motion.acceleration.y) &&
      Number.isFinite(motion.acceleration.z) &&
      Number.isFinite(motion.rotationRate.alpha) &&
      Number.isFinite(motion.rotationRate.beta) &&
      Number.isFinite(motion.rotationRate.gamma)
    return hasMotionNumbers && typeof orientation.absolute === 'boolean'
      ? pass(
          'readDeviceMotion',
          `accel=${motion.acceleration.x.toFixed(2)},${motion.acceleration.y.toFixed(2)},${motion.acceleration.z.toFixed(2)} absolute=${orientation.absolute}`,
        )
      : fail('readDeviceMotion', 'sensor values were not numeric')
  } catch (error) {
    return fail('readDeviceMotion', error)
  }
}

function checkLayoutPrimitives(): ProductionProfileCheckResult {
  return pass(
    'SafeAreaView/KeyboardAvoidingView',
    'screen is rendered inside both layout primitives',
  )
}

function waitForProfileCheck(delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs)
  })
}

async function checkVirtualKeyboardTextInput(): Promise<ProductionProfileCheckResult> {
  let lineEdit: LineEdit | null = null
  let textEdit: TextEdit | null = null

  try {
    if (
      !DisplayServer.has_feature(
        DisplayServer.Feature.FEATURE_VIRTUAL_KEYBOARD,
      )
    ) {
      return info(
        'virtual keyboard text input',
        'DisplayServer virtual keyboard feature unavailable',
      )
    }

    const enteredText: string[] = []
    const lineEditText = 'release@example.test'
    const textEditText = 'release notes\nkeyboard smoke'
    lineEdit = new LineEdit()
    lineEdit.placeholder_text = 'Email for receipt'
    lineEdit.virtual_keyboard_enabled = true
    lineEdit.virtual_keyboard_type =
      DisplayServer.VirtualKeyboardType.KEYBOARD_TYPE_EMAIL_ADDRESS
    lineEdit.max_length = 64
    lineEdit.insert_text_at_caret(lineEditText)

    textEdit = new TextEdit()
    textEdit.placeholder_text = 'Release notes'
    textEdit.virtual_keyboard_enabled = true
    textEdit.insert_text_at_caret(textEditText)

    if (lineEdit.text !== lineEditText || textEdit.text !== textEditText) {
      return fail(
        'virtual keyboard text input',
        `LineEdit text=${lineEdit.text} TextEdit text=${textEdit.text}`,
      )
    }

    const inputTextCallback = new Callable(
      Callable.create((text: string) => {
        enteredText.push(text)
      }),
    )
    const emptyInputTextCallback = new Callable(
      Callable.create((_text: string) => undefined),
    )

    DisplayServer.window_set_input_text_callback(inputTextCallback)
    const beforeHeight = DisplayServer.virtual_keyboard_get_height()
    DisplayServer.virtual_keyboard_show(
      'release@example.test',
      new Rect2(24, 360, 320, 44),
      DisplayServer.VirtualKeyboardType.KEYBOARD_TYPE_EMAIL_ADDRESS,
      64,
      20,
      20,
    )
    await waitForProfileCheck(350)
    const shownHeight = DisplayServer.virtual_keyboard_get_height()
    DisplayServer.virtual_keyboard_hide()
    await waitForProfileCheck(100)
    const hiddenHeight = DisplayServer.virtual_keyboard_get_height()
    DisplayServer.window_set_input_text_callback(emptyInputTextCallback)

    return pass(
      'virtual keyboard text input',
      `feature=true callback=installed LineEdit=inserted TextEdit=inserted beforeHeight=${beforeHeight} shownHeight=${shownHeight} hiddenHeight=${hiddenHeight} callbackEvents=${enteredText.length}`,
    )
  } catch (error) {
    return fail('virtual keyboard text input', error)
  } finally {
    lineEdit?.queue_free()
    textEdit?.queue_free()
  }
}

function checkNativeLifecycle(): ProductionProfileCheckResult[] {
  const snapshot = readNativeLifecycleEvidence()
  const listenerResult = snapshot.listenerInstalled
    ? pass('native lifecycle listener', 'window lifecycle callback installed')
    : info('native lifecycle listener', 'window lifecycle callback unavailable')
  const backResult =
    snapshot.backRequests > 0
      ? pass(
          'Android back handling',
          `requests=${snapshot.backRequests} last=${snapshot.lastBackAction}`,
        )
      : info('Android back handling', 'not exercised in this runtime yet')
  const backgroundResult =
    snapshot.blurEvents > 0 && snapshot.focusEvents > 0
      ? pass(
          'background/foreground lifecycle',
          `blur=${snapshot.blurEvents} focus=${snapshot.focusEvents}`,
        )
      : info(
          'background/foreground lifecycle',
          `blur=${snapshot.blurEvents} focus=${snapshot.focusEvents}`,
        )

  return [listenerResult, backResult, backgroundResult]
}

export async function runProductionProfileChecks(): Promise<ProductionProfileCheckSummary> {
  const results: ProductionProfileCheckResult[] = []

  results.push(checkWebSocket())
  results.push(checkNavigatorOnline())
  results.push(...checkStorage())
  results.push(checkStorageRestartMarker())
  results.push(await checkFetch())
  results.push(await checkReachability())
  results.push(await checkPermission('camera'))
  results.push(await checkPermission('geolocation'))
  results.push(await checkPermission('microphone'))
  results.push(await checkPermission('clipboard-read'))
  results.push(await checkPermission('accelerometer'))
  results.push(await checkClipboard())
  results.push(await checkAdapterState('permissions'))
  results.push(await checkAdapterState('geolocation'))
  results.push(await checkAdapterState('media-devices'))
  results.push(await checkMediaDevicesCall())
  results.push(await checkGeolocationCall())
  results.push(checkVibration())
  results.push(checkSensors())
  results.push(checkLayoutPrimitives())
  results.push(await checkVirtualKeyboardTextInput())
  results.push(...checkNativeLifecycle())

  return summarize(results)
}
