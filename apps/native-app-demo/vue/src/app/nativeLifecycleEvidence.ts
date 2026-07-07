export type NativeLifecycleEventType = 'back-request' | 'blur' | 'focus'

export type NativeBackAction = 'navigate-home' | 'root' | 'none'

export interface NativeLifecycleEvidence {
  listenerInstalled: boolean
  backRequests: number
  blurEvents: number
  focusEvents: number
  lastBackAction: NativeBackAction
  lastEventType: NativeLifecycleEventType | 'none'
  updatedAt: string
}

const globalKey = '__vueGodotNativeAppLifecycleEvidence'

function emptyEvidence(): NativeLifecycleEvidence {
  return {
    listenerInstalled: false,
    backRequests: 0,
    blurEvents: 0,
    focusEvents: 0,
    lastBackAction: 'none',
    lastEventType: 'none',
    updatedAt: '',
  }
}

function isNativeLifecycleEvidence(
  value: unknown,
): value is NativeLifecycleEvidence {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.listenerInstalled === 'boolean' &&
    typeof candidate.backRequests === 'number' &&
    typeof candidate.blurEvents === 'number' &&
    typeof candidate.focusEvents === 'number' &&
    typeof candidate.lastBackAction === 'string' &&
    typeof candidate.lastEventType === 'string' &&
    typeof candidate.updatedAt === 'string'
  )
}

function writeNativeLifecycleEvidence(
  value: NativeLifecycleEvidence,
): NativeLifecycleEvidence {
  const globals: Record<string, unknown> = globalThis
  globals[globalKey] = value
  return value
}

export function readNativeLifecycleEvidence(): NativeLifecycleEvidence {
  const globals: Record<string, unknown> = globalThis
  const value = globals[globalKey]
  return isNativeLifecycleEvidence(value) ? value : emptyEvidence()
}

export function setNativeLifecycleListenerInstalled(
  listenerInstalled: boolean,
): NativeLifecycleEvidence {
  const current = readNativeLifecycleEvidence()
  return writeNativeLifecycleEvidence({
    ...current,
    listenerInstalled,
    updatedAt: new Date().toISOString(),
  })
}

export function recordNativeLifecycleEvent(
  type: NativeLifecycleEventType,
  backAction: NativeBackAction = 'none',
): NativeLifecycleEvidence {
  const current = readNativeLifecycleEvidence()
  return writeNativeLifecycleEvidence({
    ...current,
    backRequests:
      type === 'back-request' ? current.backRequests + 1 : current.backRequests,
    blurEvents: type === 'blur' ? current.blurEvents + 1 : current.blurEvents,
    focusEvents:
      type === 'focus' ? current.focusEvents + 1 : current.focusEvents,
    lastBackAction:
      type === 'back-request' ? backAction : current.lastBackAction,
    lastEventType: type,
    updatedAt: new Date().toISOString(),
  })
}
