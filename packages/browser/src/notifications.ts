import {
  createDeviceCapabilityError,
  deviceCapabilities,
  getCapabilityStatus,
  isDeviceCapabilityError,
  requireCapability,
  type NativeNotificationOptions,
  type NotificationAdapter,
} from '@vue-godot/device'
import { GodotEvent, GodotEventTarget } from './event-target.js'

export type GodotNotificationPermission = 'default' | 'denied' | 'granted'
export type GodotNotificationErrorName =
  | 'NotAllowedError'
  | 'NotFoundError'
  | 'NotReadableError'
export type GodotNotificationPermissionCallback = (
  permission: GodotNotificationPermission,
) => void
export type GodotNotificationEventHandler = (event: GodotEvent) => void
export type GodotNotificationErrorHandler = (
  event: GodotNotificationErrorEvent,
) => void

export interface GodotNotificationOptions extends NativeNotificationOptions {
  badge?: string
  body?: string
  data?: unknown
  dir?: 'auto' | 'ltr' | 'rtl'
  icon?: string
  image?: string
  lang?: string
  renotify?: boolean
  requireInteraction?: boolean
  silent?: boolean
  tag?: string
  timestamp?: number
  vibrate?: number | readonly number[]
}

export class GodotNotificationError extends Error {
  readonly cause?: unknown

  constructor(
    name: GodotNotificationErrorName,
    message: string,
    options: { cause?: unknown } = {},
  ) {
    super(message)
    this.name = name
    this.cause = options.cause
    Object.setPrototypeOf(this, GodotNotificationError.prototype)
  }
}

export class GodotNotificationErrorEvent extends GodotEvent {
  readonly error: GodotNotificationError

  constructor(error: GodotNotificationError) {
    super('error')
    this.error = error
  }
}

let notificationPermission: GodotNotificationPermission = 'default'

function isNotificationAdapter(value: unknown): value is NotificationAdapter {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<NotificationAdapter>
  return (
    candidate.capability === 'notifications' &&
    typeof candidate.notify === 'function'
  )
}

export function getRegisteredNotificationAdapter(): NotificationAdapter | null {
  const adapter = deviceCapabilities.getAdapter('notifications')
  return isNotificationAdapter(adapter) ? adapter : null
}

function requireRegisteredNotificationAdapter(): NotificationAdapter {
  const adapter = getRegisteredNotificationAdapter()
  if (adapter) {
    return adapter
  }

  throw createDeviceCapabilityError('missing-plugin', 'notifications', {
    message:
      'No notifications adapter is registered. Register a @vue-godot/device NotificationAdapter before using Notification.',
  })
}

async function requireSupportedNotificationAdapter(): Promise<NotificationAdapter> {
  const adapter = requireRegisteredNotificationAdapter()
  await requireCapability('notifications')
  return adapter
}

function permissionForCapabilityState(
  state: Awaited<ReturnType<typeof getCapabilityStatus>>['state'],
): GodotNotificationPermission {
  switch (state) {
    case 'supported':
      return 'granted'
    case 'permission-denied':
      return 'denied'
    case 'export-misconfiguration':
    case 'missing-plugin':
    case 'unsupported-platform':
      return 'default'
  }
}

function permissionForError(error: GodotNotificationError): GodotNotificationPermission {
  return error.name === 'NotAllowedError' ? 'denied' : 'default'
}

async function refreshNotificationPermission(): Promise<GodotNotificationPermission> {
  const status = await getCapabilityStatus('notifications')
  notificationPermission = permissionForCapabilityState(status.state)
  return notificationPermission
}

function toNotificationError(error: unknown): GodotNotificationError {
  if (error instanceof GodotNotificationError) {
    return error
  }

  const deviceError = isDeviceCapabilityError(error) ? error : null
  if (deviceError?.code === 'permission-denied') {
    return new GodotNotificationError('NotAllowedError', deviceError.message, {
      cause: error,
    })
  }

  if (deviceError?.code === 'export-misconfiguration') {
    return new GodotNotificationError('NotReadableError', deviceError.message, {
      cause: error,
    })
  }

  return new GodotNotificationError(
    'NotFoundError',
    error instanceof Error
      ? error.message
      : 'No native notification adapter is available.',
    { cause: error },
  )
}

function toNativeNotificationOptions(
  options: GodotNotificationOptions,
): NativeNotificationOptions {
  const nativeOptions: NativeNotificationOptions = {}

  if (options.body !== undefined) {
    nativeOptions.body = String(options.body)
  }
  if (options.title !== undefined) {
    nativeOptions.title = String(options.title)
  }
  if ('data' in options) {
    nativeOptions.data = options.data
  }

  return nativeOptions
}

export class GodotNotification extends GodotEventTarget {
  static readonly maxActions = 0

  static get permission(): GodotNotificationPermission {
    return notificationPermission
  }

  static async requestPermission(
    deprecatedCallback?: GodotNotificationPermissionCallback,
  ): Promise<GodotNotificationPermission> {
    const permission = await refreshNotificationPermission()
    deprecatedCallback?.(permission)
    return permission
  }

  static async show(
    title: string,
    options: GodotNotificationOptions = {},
  ): Promise<GodotNotification> {
    const notification = new GodotNotification(title, options)
    await notification.delivery
    if (notification.lastError) {
      throw notification.lastError
    }
    return notification
  }

  readonly title: string
  readonly body: string
  readonly data: unknown
  readonly dir: 'auto' | 'ltr' | 'rtl'
  readonly icon: string
  readonly image: string
  readonly lang: string
  readonly tag: string

  onclick: GodotNotificationEventHandler | null = null
  onclose: GodotNotificationEventHandler | null = null
  onerror: GodotNotificationErrorHandler | null = null
  onshow: GodotNotificationEventHandler | null = null

  private readonly delivery: Promise<void>
  private lastError: GodotNotificationError | null = null
  private closed = false

  constructor(title: string, options: GodotNotificationOptions = {}) {
    super()
    this.title = String(title)
    this.body = options.body === undefined ? '' : String(options.body)
    this.data = options.data
    this.dir = options.dir ?? 'auto'
    this.icon = options.icon ?? ''
    this.image = options.image ?? ''
    this.lang = options.lang ?? ''
    this.tag = options.tag ?? ''
    this.delivery = this.deliver(options)
  }

  close(): void {
    if (this.closed) {
      return
    }

    this.closed = true
    this.dispatchNotificationEvent('close')
  }

  private async deliver(options: GodotNotificationOptions): Promise<void> {
    try {
      const adapter = await requireSupportedNotificationAdapter()
      await adapter.notify(this.title, toNativeNotificationOptions(options))
      notificationPermission = 'granted'
      if (!this.closed) {
        this.dispatchNotificationEvent('show')
      }
    } catch (error) {
      const notificationError = toNotificationError(error)
      this.lastError = notificationError
      notificationPermission = permissionForError(notificationError)
      if (!this.closed) {
        this.dispatchNotificationError(notificationError)
      }
    }
  }

  private dispatchNotificationEvent(type: string): void {
    const event = new GodotEvent(type)
    switch (type) {
      case 'click':
        this.onclick?.(event)
        break
      case 'close':
        this.onclose?.(event)
        break
      case 'show':
        this.onshow?.(event)
        break
    }
    this.dispatchEvent(event)
  }

  private dispatchNotificationError(error: GodotNotificationError): void {
    const event = new GodotNotificationErrorEvent(error)
    this.onerror?.(event)
    this.dispatchEvent(event)
  }
}
