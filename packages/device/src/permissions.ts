import { Callable, Engine, OS } from 'godot'
import type { Signal } from 'godot'
import { packedStringArrayToStrings } from './utils/packedStringArray.js'

export const AndroidPermissions = {
  Camera: 'android.permission.CAMERA',
  RecordAudio: 'android.permission.RECORD_AUDIO',
  AccessFineLocation: 'android.permission.ACCESS_FINE_LOCATION',
  AccessCoarseLocation: 'android.permission.ACCESS_COARSE_LOCATION',
  PostNotifications: 'android.permission.POST_NOTIFICATIONS',
} as const

export type AndroidPermissionName =
  (typeof AndroidPermissions)[keyof typeof AndroidPermissions]

export interface GodotPermissionResult {
  name: string
  granted: boolean
}

export type GodotPermissionResultHandler = (
  result: GodotPermissionResult,
) => void

export interface GodotPermissionResultSource {
  readonly on_request_permissions_result: Signal<readonly [string, boolean]>
}

export interface GodotPermissionResultSubscription {
  disconnect(): void
}

export function listGrantedPermissions(): string[] {
  try {
    return packedStringArrayToStrings(OS.get_granted_permissions())
  } catch {
    return []
  }
}

export function isPermissionGranted(name: string): boolean {
  return listGrantedPermissions().includes(name)
}

export function requestPermission(name: string): boolean {
  try {
    return OS.request_permission(name)
  } catch {
    return false
  }
}

export function requestDangerousPermissions(): boolean {
  try {
    return OS.request_permissions()
  } catch {
    return false
  }
}

export function revokeGrantedPermissions(): void {
  try {
    OS.revoke_granted_permissions()
  } catch {
    return
  }
}

export function onPermissionResult(
  handler: GodotPermissionResultHandler,
  source: GodotPermissionResultSource = Engine.get_main_loop(),
): GodotPermissionResultSubscription {
  const callable: Callable<readonly [string, boolean], void> = Callable.create(
    (name: string, granted: boolean) => {
      handler({ name: String(name), granted: Boolean(granted) })
    },
  )
  source.on_request_permissions_result.connect(callable)

  let connected = true
  return {
    disconnect() {
      if (!connected) {
        return
      }

      connected = false
      source.on_request_permissions_result.disconnect(callable)
    },
  }
}
