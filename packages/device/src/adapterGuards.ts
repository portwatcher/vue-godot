import type {
  DeepLinkAdapter,
  NotificationAdapter,
  SecureStorageAdapter,
  ShareAdapter,
} from './adapters.js'

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isDeepLinkAdapter(value: unknown): value is DeepLinkAdapter {
  return (
    isObject(value) &&
    value.capability === 'deep-links' &&
    (typeof value.getInitialUrl === 'function' ||
      typeof value.subscribeUrlOpen === 'function')
  )
}

export function isNotificationAdapter(
  value: unknown,
): value is NotificationAdapter {
  return (
    isObject(value) &&
    value.capability === 'notifications' &&
    typeof value.notify === 'function'
  )
}

export function isShareAdapter(value: unknown): value is ShareAdapter {
  return (
    isObject(value) &&
    value.capability === 'share' &&
    typeof value.share === 'function'
  )
}

export function isSecureStorageAdapter(
  value: unknown,
): value is SecureStorageAdapter {
  return (
    isObject(value) &&
    value.capability === 'secure-storage' &&
    typeof value.getItem === 'function' &&
    typeof value.setItem === 'function' &&
    typeof value.removeItem === 'function'
  )
}
