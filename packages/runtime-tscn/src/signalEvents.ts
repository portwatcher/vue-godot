type EventHandler = (...args: unknown[]) => unknown

interface ListenerRecord<TCallable> {
  callable: TCallable
  handler: EventHandler
}

interface SignalPatchOps<TTarget extends object, TCallable> {
  createCallable: (target: TTarget, handler: EventHandler) => TCallable
  connect: (target: TTarget, signalName: string, callable: TCallable) => void
  disconnect: (target: TTarget, signalName: string, callable: TCallable) => void
  onError?: (
    phase: 'connect' | 'disconnect',
    signalName: string,
    error: unknown,
  ) => void
}

const signalListeners = new WeakMap<
  object,
  Map<string, ListenerRecord<unknown>[]>
>()

function normalizeHandlers(value: unknown): EventHandler[] {
  if (typeof value === 'function') {
    return [value as EventHandler]
  }

  if (Array.isArray(value)) {
    return value.filter((handler): handler is EventHandler => {
      return typeof handler === 'function'
    })
  }

  return []
}

function getListenerMap(
  target: object,
): Map<string, ListenerRecord<unknown>[]> {
  let listenerMap = signalListeners.get(target)
  if (!listenerMap) {
    listenerMap = new Map()
    signalListeners.set(target, listenerMap)
  }
  return listenerMap
}

export function vueEventKeyToGodotSignalName(key: string): string {
  const eventName = key.startsWith('on') ? key.slice(2) : key
  if (!eventName) return ''

  return eventName
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/-/g, '_')
    .toLowerCase()
}

export function patchSignalHandlers<TTarget extends object, TCallable>(
  target: TTarget,
  eventKey: string,
  nextValue: unknown,
  ops: SignalPatchOps<TTarget, TCallable>,
): void {
  const signalName = vueEventKeyToGodotSignalName(eventKey)
  const listenerMap = getListenerMap(target)
  const previousRecords = (listenerMap.get(eventKey) ??
    []) as ListenerRecord<TCallable>[]

  for (const record of previousRecords) {
    try {
      ops.disconnect(target, signalName, record.callable)
    } catch (error) {
      ops.onError?.('disconnect', signalName, error)
    }
  }

  const nextHandlers = normalizeHandlers(nextValue)
  if (nextHandlers.length === 0) {
    listenerMap.delete(eventKey)
    return
  }

  const nextRecords: ListenerRecord<TCallable>[] = []
  for (const handler of nextHandlers) {
    try {
      const callable = ops.createCallable(target, handler)
      ops.connect(target, signalName, callable)
      nextRecords.push({ handler, callable })
    } catch (error) {
      ops.onError?.('connect', signalName, error)
    }
  }

  if (nextRecords.length > 0) {
    listenerMap.set(eventKey, nextRecords)
  } else {
    listenerMap.delete(eventKey)
  }
}

export function clearSignalHandlers<TTarget extends object, TCallable>(
  target: TTarget,
  ops: SignalPatchOps<TTarget, TCallable>,
): void {
  const listenerMap = signalListeners.get(target)
  if (!listenerMap) {
    return
  }

  for (const [eventKey, untypedRecords] of listenerMap) {
    const signalName = vueEventKeyToGodotSignalName(eventKey)
    const records = untypedRecords as ListenerRecord<TCallable>[]
    for (const record of records) {
      try {
        ops.disconnect(target, signalName, record.callable)
      } catch (error) {
        ops.onError?.('disconnect', signalName, error)
      }
    }
  }

  listenerMap.clear()
  signalListeners.delete(target)
}
