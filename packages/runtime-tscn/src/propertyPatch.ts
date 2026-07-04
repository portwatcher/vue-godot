export type GodotPropertyTarget = {
  has_method(method: string): boolean
  set?: (key: string, value: unknown) => void
  get?: (key: string) => unknown
}

const initialPropValues = new WeakMap<object, Map<string, unknown>>()

function getCachedDefaults(target: object) {
  let defaults = initialPropValues.get(target)
  if (!defaults) {
    defaults = new Map<string, unknown>()
    initialPropValues.set(target, defaults)
  }
  return defaults
}

export function patchGodotProperty(
  el: GodotPropertyTarget,
  key: string,
  next: unknown,
  warn: (message: string) => void = console.warn,
) {
  if (!el.has_method('set') || typeof el.set !== 'function') {
    warn(`object has no method "set"`)
    Reflect.set(el, key, next)
    return
  }

  const defaults = getCachedDefaults(el as object)

  if (next != null) {
    if (!defaults.has(key) && el.has_method('get') && typeof el.get === 'function') {
      defaults.set(key, el.get(key))
    }
    el.set(key, next)
    return
  }

  if (defaults.has(key)) {
    el.set(key, defaults.get(key))
    return
  }

  warn(
    `[vue-godot] Unable to reset prop "${key}" generically; no cached default value is available`,
  )
}
