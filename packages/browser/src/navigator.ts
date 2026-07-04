// ---------------------------------------------------------------------------
// Navigator and network reachability polyfills for GodotJS
// ---------------------------------------------------------------------------

import { GodotAbortController } from './abort.js'
import { clipboard, type GodotClipboard } from './clipboard.js'
import { GodotEvent } from './event-target.js'
import { fetch } from './fetch.js'
import { getGlobalEventTarget } from './history.js'
import {
  clearTimeout as clearGodotTimeout,
  setTimeout as setGodotTimeout,
} from './timing.js'
import {
  vibrate,
  type GodotVibrationPattern,
} from './vibration.js'

export interface GodotNetworkReachabilityOptions {
  url?: string
  method?: 'GET' | 'HEAD'
  timeoutMs?: number
  expectedStatus?: number | readonly number[]
}

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
