export type GodotPropertyTarget = {
  has_method(method: string): boolean
  set?: (key: string, value: unknown) => void
  get?: (key: string) => unknown
}

type GodotPropertyGetter = GodotPropertyTarget & {
  get: (key: string) => unknown
}

type GodotPropertySetter = GodotPropertyTarget & {
  set: (key: string, value: unknown) => void
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

function hasGodotGetter(el: GodotPropertyTarget): el is GodotPropertyGetter {
  return el.has_method('get') && typeof el.get === 'function'
}

function hasGodotSetter(el: GodotPropertyTarget): el is GodotPropertySetter {
  return el.has_method('set') && typeof el.set === 'function'
}

function formatError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return String(error)
}

function tryReadGodotProperty(
  el: GodotPropertyGetter,
  key: string,
  warn: (message: string) => void,
): { ok: true; value: unknown } | { ok: false } {
  try {
    return { ok: true, value: el.get(key) }
  } catch (error) {
    warn(
      `[vue-godot] Unable to read current value for prop "${key}" before update; reset on removal will be unavailable: ${formatError(error)}`,
    )
    return { ok: false }
  }
}

function trySetGodotProperty(
  el: GodotPropertySetter,
  key: string,
  value: unknown,
  warn: (message: string) => void,
): boolean {
  try {
    el.set(key, value)
    return true
  } catch (error) {
    warn(
      `[vue-godot] Unable to set prop "${key}"; the Godot property may be unsupported for this node or the value may be invalid: ${formatError(error)}`,
    )
    return false
  }
}

export function patchGodotProperty(
  el: GodotPropertyTarget,
  key: string,
  next: unknown,
  warn: (message: string) => void = console.warn,
) {
  if (!hasGodotSetter(el)) {
    warn(`object has no method "set"`)
    Reflect.set(el, key, next)
    return
  }

  const defaults = getCachedDefaults(el as object)

  if (next != null) {
    if (!defaults.has(key) && hasGodotGetter(el)) {
      const currentValue = tryReadGodotProperty(el, key, warn)
      if (currentValue.ok) {
        defaults.set(key, currentValue.value)
      }
    }
    trySetGodotProperty(el, key, next, warn)
    return
  }

  if (defaults.has(key)) {
    trySetGodotProperty(el, key, defaults.get(key), warn)
    return
  }

  warn(
    `[vue-godot] Unable to reset prop "${key}" generically; no cached default value is available`,
  )
}
