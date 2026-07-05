import { Callable, DisplayServer, OS } from 'godot'
import {
  isDeepLinkAdapter,
  isNotificationAdapter,
  isShareAdapter,
} from './adapterGuards.js'
import type {
  NativeNotificationOptions,
  NativeOpenUrlEvent,
  NativeShareData,
} from './adapters.js'
import { createDeviceCapabilityError } from './errors.js'
import { deviceCapabilities, requireCapability } from './registry.js'
import { packedStringArrayToStrings } from './utils/packedStringArray.js'
import {
  getDisplayServerName,
  hasDisplayServerFeature,
} from './utils/displayServer.js'

const GODOT_OK = 0

export const GodotFeatureTags = {
  Android: 'android',
  Debug: 'debug',
  Desktop: 'pc',
  Editor: 'editor',
  IOS: 'ios',
  Linux: 'linux',
  MacOS: 'macos',
  Mobile: 'mobile',
  Release: 'release',
  Template: 'template',
  Web: 'web',
  Windows: 'windows',
} as const

export type GodotFeatureTag =
  (typeof GodotFeatureTags)[keyof typeof GodotFeatureTags]

export const DEFAULT_PLATFORM_FEATURE_TAGS: readonly GodotFeatureTag[] = [
  GodotFeatureTags.Windows,
  GodotFeatureTags.MacOS,
  GodotFeatureTags.Linux,
  GodotFeatureTags.Android,
  GodotFeatureTags.IOS,
  GodotFeatureTags.Web,
  GodotFeatureTags.Desktop,
  GodotFeatureTags.Mobile,
  GodotFeatureTags.Editor,
  GodotFeatureTags.Template,
  GodotFeatureTags.Debug,
  GodotFeatureTags.Release,
]

export type GodotAppLifecycleEventType =
  | 'back-request'
  | 'blur'
  | 'dpi-change'
  | 'focus'
  | 'mouse-enter'
  | 'mouse-exit'
  | 'quit-request'
  | 'titlebar-change'

export interface GodotAppLifecycleEvent {
  type: GodotAppLifecycleEventType
  windowEvent: DisplayServer.WindowEvent
  windowId: number
  timestamp: number
}

export type GodotAppLifecycleHandler = (
  event: GodotAppLifecycleEvent,
) => void

export interface GodotAppLifecycleOptions {
  windowId?: number
}

export interface GodotAppLifecycleSubscription {
  disconnect(): void
}

export interface GodotPlatformInfo {
  commandLineArgs: string[]
  displayServerName: string
  distributionName: string
  features: Record<string, boolean>
  isDebugBuild: boolean
  isSandboxed: boolean
  isUserFileSystemPersistent: boolean
  locale: string
  localeLanguage: string
  modelName: string
  name: string
  userArguments: string[]
  version: string
}

export interface GodotPlatformInfoOptions {
  featureTags?: readonly string[]
}

export interface GodotOpenUrlSubscription {
  disconnect(): void
}

export type GodotOpenUrlHandler = (event: NativeOpenUrlEvent) => void

interface WindowLifecycleDispatcher {
  callable: Callable
  handlers: Set<GodotAppLifecycleHandler>
}

const windowLifecycleDispatchers = new Map<number, WindowLifecycleDispatcher>()

function safeString(read: () => string): string {
  try {
    return String(read())
  } catch {
    return ''
  }
}

function safeBoolean(read: () => boolean): boolean {
  try {
    return Boolean(read())
  } catch {
    return false
  }
}

function safePackedStrings(read: () => unknown): string[] {
  try {
    return packedStringArrayToStrings(read())
  } catch {
    return []
  }
}

function normalizeWindowId(windowId: number | undefined): number {
  return typeof windowId === 'number' && Number.isFinite(windowId)
    ? Math.trunc(windowId)
    : 0
}

function normalizeOpenUrlEvent(event: NativeOpenUrlEvent): NativeOpenUrlEvent {
  return {
    url: String(event.url),
    ...(event.source ? { source: String(event.source) } : {}),
  }
}

function normalizeShareData(data: NativeShareData): NativeShareData {
  return {
    ...(data.title !== undefined ? { title: String(data.title) } : {}),
    ...(data.text !== undefined ? { text: String(data.text) } : {}),
    ...(data.url !== undefined ? { url: String(data.url) } : {}),
    ...(data.files !== undefined
      ? { files: data.files.map((file) => String(file)) }
      : {}),
    ...('data' in data ? { data: data.data } : {}),
  }
}

function dispatchWindowLifecycleEvent(
  windowId: number,
  windowEvent: DisplayServer.WindowEvent,
): void {
  const dispatcher = windowLifecycleDispatchers.get(windowId)
  const type = toAppLifecycleEventType(windowEvent)
  if (!dispatcher || !type) {
    return
  }

  const event: GodotAppLifecycleEvent = {
    type,
    windowEvent,
    windowId,
    timestamp: Date.now(),
  }

  for (const handler of dispatcher.handlers) {
    handler(event)
  }
}

function installWindowLifecycleDispatcher(
  windowId: number,
): WindowLifecycleDispatcher | null {
  const existing = windowLifecycleDispatchers.get(windowId)
  if (existing) {
    return existing
  }

  const callable = new Callable(
    Callable.create((windowEvent: DisplayServer.WindowEvent) => {
      dispatchWindowLifecycleEvent(windowId, windowEvent)
    }),
  )

  try {
    DisplayServer.window_set_window_event_callback(callable, windowId)
  } catch {
    return null
  }

  const dispatcher = {
    callable,
    handlers: new Set<GodotAppLifecycleHandler>(),
  }
  windowLifecycleDispatchers.set(windowId, dispatcher)
  return dispatcher
}

function clearWindowLifecycleDispatcher(windowId: number): void {
  windowLifecycleDispatchers.delete(windowId)
  try {
    DisplayServer.window_set_window_event_callback(
      new Callable(
        Callable.create(
          (_windowEvent: DisplayServer.WindowEvent) => undefined,
        ),
      ),
      windowId,
    )
  } catch {
    return
  }
}

export function getOSName(): string {
  return safeString(() => OS.get_name())
}

export function getOSDistributionName(): string {
  return safeString(() => OS.get_distribution_name())
}

export function getOSVersion(): string {
  return safeString(() => OS.get_version())
}

export function getDeviceModelName(): string {
  return safeString(() => OS.get_model_name())
}

export function getCommandLineArguments(): string[] {
  return safePackedStrings(() => OS.get_cmdline_args())
}

export function getCommandLineUserArguments(): string[] {
  return safePackedStrings(() => OS.get_cmdline_user_args())
}

export function getLocale(): string {
  return safeString(() => OS.get_locale())
}

export function getLocaleLanguage(): string {
  return safeString(() => OS.get_locale_language())
}

export function hasOSFeature(tagName: string): boolean {
  try {
    return OS.has_feature(String(tagName))
  } catch {
    return false
  }
}

export function readOSFeatureMap(
  featureTags: readonly string[] = DEFAULT_PLATFORM_FEATURE_TAGS,
): Record<string, boolean> {
  const features: Record<string, boolean> = {}
  for (const tagName of featureTags) {
    features[String(tagName)] = hasOSFeature(tagName)
  }
  return features
}

export function isDebugBuild(): boolean {
  return safeBoolean(() => OS.is_debug_build())
}

export function isSandboxed(): boolean {
  return safeBoolean(() => OS.is_sandboxed())
}

export function isUserFileSystemPersistent(): boolean {
  return safeBoolean(() => OS.is_userfs_persistent())
}

export function readPlatformInfo(
  options: GodotPlatformInfoOptions = {},
): GodotPlatformInfo {
  return {
    commandLineArgs: getCommandLineArguments(),
    displayServerName: getDisplayServerName(),
    distributionName: getOSDistributionName(),
    features: readOSFeatureMap(
      options.featureTags ?? DEFAULT_PLATFORM_FEATURE_TAGS,
    ),
    isDebugBuild: isDebugBuild(),
    isSandboxed: isSandboxed(),
    isUserFileSystemPersistent: isUserFileSystemPersistent(),
    locale: getLocale(),
    localeLanguage: getLocaleLanguage(),
    modelName: getDeviceModelName(),
    name: getOSName(),
    userArguments: getCommandLineUserArguments(),
    version: getOSVersion(),
  }
}

export { getDisplayServerName, hasDisplayServerFeature }

export function openExternalUrl(uri: string): boolean {
  try {
    return Number(OS.shell_open(String(uri))) === GODOT_OK
  } catch {
    return false
  }
}

export function isWindowLifecycleSupported(): boolean {
  try {
    return typeof DisplayServer.window_set_window_event_callback === 'function'
  } catch {
    return false
  }
}

export function toAppLifecycleEventType(
  windowEvent: DisplayServer.WindowEvent,
): GodotAppLifecycleEventType | null {
  switch (windowEvent) {
    case DisplayServer.WindowEvent.WINDOW_EVENT_MOUSE_ENTER:
      return 'mouse-enter'
    case DisplayServer.WindowEvent.WINDOW_EVENT_MOUSE_EXIT:
      return 'mouse-exit'
    case DisplayServer.WindowEvent.WINDOW_EVENT_FOCUS_IN:
      return 'focus'
    case DisplayServer.WindowEvent.WINDOW_EVENT_FOCUS_OUT:
      return 'blur'
    case DisplayServer.WindowEvent.WINDOW_EVENT_CLOSE_REQUEST:
      return 'quit-request'
    case DisplayServer.WindowEvent.WINDOW_EVENT_GO_BACK_REQUEST:
      return 'back-request'
    case DisplayServer.WindowEvent.WINDOW_EVENT_DPI_CHANGE:
      return 'dpi-change'
    case DisplayServer.WindowEvent.WINDOW_EVENT_TITLEBAR_CHANGE:
      return 'titlebar-change'
    default:
      return null
  }
}

export function onAppLifecycleEvent(
  handler: GodotAppLifecycleHandler,
  options: GodotAppLifecycleOptions = {},
): GodotAppLifecycleSubscription | null {
  const windowId = normalizeWindowId(options.windowId)
  const dispatcher = installWindowLifecycleDispatcher(windowId)
  if (!dispatcher) {
    return null
  }

  dispatcher.handlers.add(handler)
  let connected = true

  return {
    disconnect() {
      if (!connected) {
        return
      }

      connected = false
      dispatcher.handlers.delete(handler)
      if (dispatcher.handlers.size === 0) {
        clearWindowLifecycleDispatcher(windowId)
      }
    },
  }
}

export function getRegisteredDeepLinkAdapter() {
  const adapter = deviceCapabilities.getAdapter('deep-links')
  return isDeepLinkAdapter(adapter) ? adapter : null
}

export async function readInitialOpenUrl(): Promise<string | null> {
  const adapter = getRegisteredDeepLinkAdapter()
  if (!adapter?.getInitialUrl) {
    return null
  }

  await requireCapability('deep-links')
  const url = await adapter.getInitialUrl()
  return typeof url === 'string' && url.length > 0 ? url : null
}

export function onOpenUrl(
  handler: GodotOpenUrlHandler,
): GodotOpenUrlSubscription | null {
  const adapter = getRegisteredDeepLinkAdapter()
  if (!adapter?.subscribeUrlOpen) {
    return null
  }

  const subscription = adapter.subscribeUrlOpen((event) => {
    handler(normalizeOpenUrlEvent(event))
  })

  if (typeof subscription === 'function') {
    return { disconnect: subscription }
  }

  return subscription
}

export function getRegisteredShareAdapter() {
  const adapter = deviceCapabilities.getAdapter('share')
  return isShareAdapter(adapter) ? adapter : null
}

export async function share(data: NativeShareData): Promise<void> {
  const adapter = getRegisteredShareAdapter()
  if (!adapter) {
    throw createDeviceCapabilityError('missing-plugin', 'share', {
      message:
        'No share adapter is registered. Register a @vue-godot/device ShareAdapter before using native share sheets.',
    })
  }

  await requireCapability('share')
  await adapter.share(normalizeShareData(data))
}

export function getRegisteredNotificationAdapter() {
  const adapter = deviceCapabilities.getAdapter('notifications')
  return isNotificationAdapter(adapter) ? adapter : null
}

export async function showNativeNotification(
  title: string,
  options: NativeNotificationOptions = {},
): Promise<void> {
  const adapter = getRegisteredNotificationAdapter()
  if (!adapter) {
    throw createDeviceCapabilityError('missing-plugin', 'notifications', {
      message:
        'No notifications adapter is registered. Register a @vue-godot/device NotificationAdapter before showing native notifications.',
    })
  }

  await requireCapability('notifications')
  await adapter.notify(String(title), options)
}
