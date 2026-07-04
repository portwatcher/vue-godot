export {}

declare global {
  type AbortController = import('../dist/abort.js').GodotAbortController
  type AbortSignal = import('../dist/abort.js').GodotAbortSignal
  type Blob = import('../dist/blob.js').GodotBlob
  type BlobPart = ArrayBuffer | Uint8Array | string | Blob
  type BodyInit = import('../dist/body.js').GodotBodyInit
  type CloseEvent = import('../dist/websocket.js').GodotCloseEvent
  type DeviceMotionEvent =
    import('../dist/device-sensors.js').GodotDeviceMotionEvent
  type DeviceOrientationEvent =
    import('../dist/device-sensors.js').GodotDeviceOrientationEvent
  type Event = import('../dist/event-target.js').GodotEvent
  type EventTarget = import('../dist/event-target.js').GodotEventTarget
  type File = import('../dist/file.js').GodotFile
  type FileReader = import('../dist/file-reader.js').GodotFileReader
  type FormData = import('../dist/form-data.js').GodotFormData
  type Headers = import('../dist/headers.js').GodotHeaders
  type History = import('../dist/history.js').GodotHistory
  type Location = import('../dist/history.js').GodotLocation
  type MediaDevices = import('../dist/media-devices.js').GodotMediaDevices
  type MediaStream = import('../dist/media-devices.js').GodotMediaStream
  type MediaStreamTrack =
    import('../dist/media-devices.js').GodotMediaStreamTrack
  type MessageEvent = import('../dist/websocket.js').GodotMessageEvent
  type Navigator = import('../dist/navigator.js').GodotNavigator
  type Notification = import('../dist/notifications.js').GodotNotification
  type NotificationOptions =
    import('../dist/notifications.js').GodotNotificationOptions
  type NotificationPermission =
    import('../dist/notifications.js').GodotNotificationPermission
  type PermissionDescriptor =
    import('../dist/navigator.js').GodotPermissionDescriptor
  type PermissionName = import('../dist/navigator.js').GodotPermissionName
  type PermissionState = import('../dist/navigator.js').GodotPermissionState
  type PermissionStatus = import('../dist/navigator.js').GodotPermissionStatus
  type Permissions = import('../dist/navigator.js').GodotPermissions
  type PopStateEvent = import('../dist/history.js').PopStateEvent
  type Request = import('../dist/request.js').GodotRequest
  type RequestInfo = import('../dist/request.js').GodotRequestInput
  type RequestInit = import('../dist/request.js').GodotRequestInit
  type RequestRedirect = import('../dist/request.js').GodotRequestRedirect
  type Response = import('../dist/response.js').GodotResponse
  type Storage = import('../dist/storage.js').GodotStorage
  type TextDecoder = import('../dist/encoding.js').GodotTextDecoder
  type TextEncoder = import('../dist/encoding.js').GodotTextEncoder
  type URL = import('../dist/url.js').GodotURL
  type URLSearchParams = import('../dist/url-search-params.js').GodotURLSearchParams
  type WebSocket = import('../dist/websocket.js').GodotWebSocket

  var AbortController: typeof import('../dist/abort.js').GodotAbortController
  var AbortSignal: typeof import('../dist/abort.js').GodotAbortSignal
  var Blob: typeof import('../dist/blob.js').GodotBlob
  var CloseEvent: typeof import('../dist/websocket.js').GodotCloseEvent
  var DeviceMotionEvent:
    typeof import('../dist/device-sensors.js').GodotDeviceMotionEvent
  var DeviceOrientationEvent:
    typeof import('../dist/device-sensors.js').GodotDeviceOrientationEvent
  var File: typeof import('../dist/file.js').GodotFile
  var FileReader: typeof import('../dist/file-reader.js').GodotFileReader
  var FormData: typeof import('../dist/form-data.js').GodotFormData
  var Headers: typeof import('../dist/headers.js').GodotHeaders
  var History: typeof import('../dist/history.js').GodotHistory
  var Location: typeof import('../dist/history.js').GodotLocation
  var MediaDevices: typeof import('../dist/media-devices.js').GodotMediaDevices
  var MediaStream: typeof import('../dist/media-devices.js').GodotMediaStream
  var MediaStreamTrack:
    typeof import('../dist/media-devices.js').GodotMediaStreamTrack
  var MessageEvent: typeof import('../dist/websocket.js').GodotMessageEvent
  var Navigator: typeof import('../dist/navigator.js').GodotNavigator
  var Notification: typeof import('../dist/notifications.js').GodotNotification
  var PermissionStatus:
    typeof import('../dist/navigator.js').GodotPermissionStatus
  var Permissions: typeof import('../dist/navigator.js').GodotPermissions
  var PopStateEvent: typeof import('../dist/history.js').PopStateEvent
  var Request: typeof import('../dist/request.js').GodotRequest
  var Response: typeof import('../dist/response.js').GodotResponse
  var Storage: typeof import('../dist/storage.js').GodotStorage
  var TextDecoder: typeof import('../dist/encoding.js').GodotTextDecoder
  var TextEncoder: typeof import('../dist/encoding.js').GodotTextEncoder
  var URL: typeof import('../dist/url.js').GodotURL
  var URLSearchParams:
    typeof import('../dist/url-search-params.js').GodotURLSearchParams
  var WebSocket: typeof import('../dist/websocket.js').GodotWebSocket

  var history: import('../dist/history.js').GodotHistory
  var localStorage: import('../dist/storage.js').GodotStorage
  var location: import('../dist/history.js').GodotLocation
  var navigator: import('../dist/navigator.js').GodotNavigator
  var performance: import('../dist/timing.js').GodotPerformance
  var sessionStorage: import('../dist/storage.js').GodotStorage

  function addEventListener(
    type: string,
    listener: (event: import('../dist/event-target.js').GodotEvent) => void,
  ): void
  function atob(data: string): string
  function btoa(data: string): string
  function cancelAnimationFrame(handle: number): void
  function clearInterval(handle: number): void
  function clearTimeout(handle: number): void
  function dispatchEvent(
    event: import('../dist/event-target.js').GodotEvent,
  ): boolean
  function fetch(
    input: import('../dist/request.js').GodotRequestInput,
    init?: import('../dist/fetch.js').GodotFetchInit,
  ): Promise<import('../dist/response.js').GodotResponse>
  function queueMicrotask(callback: () => void): void
  function removeEventListener(
    type: string,
    listener: (event: import('../dist/event-target.js').GodotEvent) => void,
  ): void
  function requestAnimationFrame(
    callback: import('../dist/timing.js').GodotAnimationFrameCallback,
  ): number
  function setInterval(
    handler: import('../dist/timing.js').GodotTimerHandler,
    timeout?: number,
    ...args: unknown[]
  ): number
  function setTimeout(
    handler: import('../dist/timing.js').GodotTimerHandler,
    timeout?: number,
    ...args: unknown[]
  ): number
}
