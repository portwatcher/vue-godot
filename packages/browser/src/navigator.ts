// ---------------------------------------------------------------------------
// Navigator and network reachability polyfills for the Godot JavaScript Runtime
// ---------------------------------------------------------------------------

import { OS } from 'godot'
import {
  deviceCapabilities,
  packedStringArrayToStrings,
  type DevicePermissionState,
  type PermissionAdapter,
} from '@vue-godot/device'
import { GodotAbortController } from './abort.js'
import {
  clipboard,
  isClipboardSupported,
  type GodotClipboard,
} from './clipboard.js'
import { GodotEvent, GodotEventTarget } from './event-target.js'
import { fetch } from './fetch.js'
import {
  geolocation,
  getRegisteredGeolocationAdapter,
  type GodotGeolocation,
} from './geolocation.js'
import { getGlobalEventTarget } from './history.js'
import {
  getRegisteredMediaDevicesAdapter,
  mediaDevices,
  type GodotMediaDevices,
} from './media-devices.js'
import {
  clearTimeout as clearGodotTimeout,
  setTimeout as setGodotTimeout,
} from './timing.js'
import { vibrate, type GodotVibrationPattern } from './vibration.js'

export interface GodotNetworkReachabilityOptions {
  url?: string
  method?: 'GET' | 'HEAD'
  timeoutMs?: number
  expectedStatus?: number | readonly number[]
}

export type GodotPermissionState = 'granted' | 'denied' | 'prompt'
export type GodotPermissionName =
  | 'accelerometer'
  | 'camera'
  | 'clipboard-read'
  | 'clipboard-write'
  | 'geolocation'
  | 'gyroscope'
  | 'magnetometer'
  | 'microphone'
  | 'notifications'
  | 'persistent-storage'

export interface GodotPermissionDescriptor {
  name: string
}

export type GodotPermissionChangeHandler = (event: GodotEvent) => void

const DEFAULT_REACHABILITY_OPTIONS: Required<GodotNetworkReachabilityOptions> =
  {
    url: 'https://example.com/',
    method: 'HEAD',
    timeoutMs: 5000,
    expectedStatus: [200, 204, 301, 302, 304],
  }

let reachabilityOptions: Required<GodotNetworkReachabilityOptions> = {
  ...DEFAULT_REACHABILITY_OPTIONS,
}

const RuntimePermissionMap = {
  camera: ['android.permission.CAMERA'],
  geolocation: [
    'android.permission.ACCESS_FINE_LOCATION',
    'android.permission.ACCESS_COARSE_LOCATION',
  ],
  microphone: ['android.permission.RECORD_AUDIO'],
  notifications: ['android.permission.POST_NOTIFICATIONS'],
} as const

const ClipboardPermissionNames = new Set<string>([
  'clipboard-read',
  'clipboard-write',
])
const SensorPermissionNames = new Set<string>([
  'accelerometer',
  'gyroscope',
  'magnetometer',
])

type RuntimePermissionName = keyof typeof RuntimePermissionMap

function normalizeOptions(
  options: GodotNetworkReachabilityOptions = {},
): Required<GodotNetworkReachabilityOptions> {
  return {
    url: options.url ?? reachabilityOptions.url,
    method: options.method ?? reachabilityOptions.method,
    timeoutMs: Math.max(1, options.timeoutMs ?? reachabilityOptions.timeoutMs),
    expectedStatus:
      options.expectedStatus ?? reachabilityOptions.expectedStatus,
  }
}

function isExpectedStatus(
  status: number,
  expected: number | readonly number[],
): boolean {
  return Array.isArray(expected)
    ? expected.includes(status)
    : status === expected
}

function isRuntimePermissionName(name: string): name is RuntimePermissionName {
  return Object.prototype.hasOwnProperty.call(RuntimePermissionMap, name)
}

function isPermissionAdapter(value: unknown): value is PermissionAdapter {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<PermissionAdapter>
  return (
    candidate.capability === 'permissions' &&
    typeof candidate.queryPermission === 'function'
  )
}

export function getRegisteredPermissionAdapter(): PermissionAdapter | null {
  const adapter = deviceCapabilities.getAdapter('permissions')
  return isPermissionAdapter(adapter) ? adapter : null
}

function readGrantedPermissionSet(): Set<string> {
  try {
    return new Set(packedStringArrayToStrings(OS.get_granted_permissions()))
  } catch {
    return new Set()
  }
}

function isUserFsPersistent(): boolean {
  try {
    return OS.is_userfs_persistent()
  } catch {
    return false
  }
}

function queryPermissionState(name: string): GodotPermissionState | null {
  if (ClipboardPermissionNames.has(name)) {
    return isClipboardSupported() ? 'granted' : 'denied'
  }

  if (SensorPermissionNames.has(name)) {
    return 'granted'
  }

  if (name === 'persistent-storage') {
    return isUserFsPersistent() ? 'granted' : 'denied'
  }

  if (!isRuntimePermissionName(name)) {
    return null
  }

  const granted = readGrantedPermissionSet()
  return RuntimePermissionMap[name].some((permission) =>
    granted.has(permission),
  )
    ? 'granted'
    : 'prompt'
}

function mapDevicePermissionState(
  state: DevicePermissionState,
): GodotPermissionState | null {
  switch (state) {
    case 'granted':
    case 'denied':
    case 'prompt':
      return state
    case 'unknown':
      return null
  }
}

async function queryAdapterPermissionState(
  name: string,
): Promise<GodotPermissionState | null> {
  const adapter = getRegisteredPermissionAdapter()
  if (!adapter) {
    return null
  }

  try {
    return mapDevicePermissionState(await adapter.queryPermission({ name }))
  } catch {
    return null
  }
}

export class GodotPermissionStatus extends GodotEventTarget {
  readonly name: string
  onchange: GodotPermissionChangeHandler | null = null

  private _state: GodotPermissionState

  constructor(name = '', state: GodotPermissionState = 'prompt') {
    super()
    this.name = name
    this._state = state
  }

  get state(): GodotPermissionState {
    return this._state
  }

  /** @internal */
  _setState(state: GodotPermissionState): void {
    if (this._state === state) {
      return
    }

    this._state = state
    const event = new GodotEvent('change')
    this.onchange?.(event)
    this.dispatchEvent(event)
  }
}

export class GodotPermissions {
  async query(
    descriptor: GodotPermissionDescriptor,
  ): Promise<GodotPermissionStatus> {
    const name = String(descriptor.name)
    const state =
      (await queryAdapterPermissionState(name)) ?? queryPermissionState(name)
    if (state === null) {
      throw new TypeError(`Unsupported permission name: ${name}`)
    }

    return new GodotPermissionStatus(name, state)
  }
}

export const permissions = new GodotPermissions()

/**
 * Minimal `Navigator` implementation.
 *
 * The `onLine` value starts optimistically as `true`, matching browsers. It is
 * updated by explicit reachability checks or by tests/adapters using
 * `setNavigatorOnline()`.
 */
export class GodotNavigator {
  private _online = true

  readonly clipboard: GodotClipboard = clipboard
  readonly permissions: GodotPermissions = permissions

  get geolocation(): GodotGeolocation | undefined {
    return getRegisteredGeolocationAdapter() ? geolocation : undefined
  }

  get mediaDevices(): GodotMediaDevices | undefined {
    return getRegisteredMediaDevicesAdapter() ? mediaDevices : undefined
  }

  get onLine(): boolean {
    return this._online
  }

  vibrate(pattern: GodotVibrationPattern): boolean {
    return vibrate(pattern)
  }

  /** @internal */
  _setOnline(online: boolean): void {
    if (this._online === online) {
      return
    }

    this._online = online
    getGlobalEventTarget().dispatchEvent(
      new GodotEvent(online ? 'online' : 'offline'),
    )
  }
}

export const navigator = new GodotNavigator()

export function configureNetworkReachability(
  options: GodotNetworkReachabilityOptions,
): void {
  reachabilityOptions = normalizeOptions(options)
}

export function getNetworkReachabilityOptions(): Required<GodotNetworkReachabilityOptions> {
  return { ...reachabilityOptions }
}

export function setNavigatorOnline(online: boolean): void {
  navigator._setOnline(Boolean(online))
}

export async function checkNetworkReachability(
  options: GodotNetworkReachabilityOptions = {},
): Promise<boolean> {
  const resolvedOptions = normalizeOptions(options)
  const controller = new GodotAbortController()
  const timeout = setGodotTimeout(() => {
    controller.abort(new Error('Network reachability probe timed out.'))
  }, resolvedOptions.timeoutMs)

  try {
    const response = await fetch(resolvedOptions.url, {
      method: resolvedOptions.method,
      signal: controller.signal,
    })
    const online = isExpectedStatus(
      response.status,
      resolvedOptions.expectedStatus,
    )
    setNavigatorOnline(online)
    return online
  } catch {
    setNavigatorOnline(false)
    return false
  } finally {
    clearGodotTimeout(timeout)
  }
}
