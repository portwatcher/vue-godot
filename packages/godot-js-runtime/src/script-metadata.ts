export type GodotScriptClass<Instance extends object = object> = abstract new (
  ...args: never[]
) => Instance

export interface ScriptPropertyMetadata {
  readonly type: string
  readonly default?: unknown
  readonly hint?: Readonly<Record<string, unknown>>
}

export interface ScriptSignalArgument {
  readonly name: string
  readonly type: string
}

export interface ScriptMetadata {
  readonly properties?: Readonly<Record<string, ScriptPropertyMetadata>>
  readonly signals?: Readonly<Record<string, readonly ScriptSignalArgument[]>>
  readonly tool?: boolean
  readonly rpc?: Readonly<Record<string, Readonly<Record<string, unknown>>>>
}

export const scriptMetadataSymbol = Symbol.for(
  'godot-js-runtime.script-metadata',
)

export type DefinedScript<ScriptClass extends GodotScriptClass> =
  ScriptClass & {
    readonly [scriptMetadataSymbol]: Readonly<ScriptMetadata>
  }

export function defineScript<ScriptClass extends GodotScriptClass>(
  scriptClass: ScriptClass,
  metadata: ScriptMetadata,
): DefinedScript<ScriptClass> {
  const frozenMetadata = Object.freeze({ ...metadata })
  Object.defineProperty(scriptClass, scriptMetadataSymbol, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: frozenMetadata,
  })
  return scriptClass as DefinedScript<ScriptClass>
}

export function getScriptMetadata(
  value: unknown,
): Readonly<ScriptMetadata> | undefined {
  if ((typeof value !== 'function' && typeof value !== 'object') || !value) {
    return undefined
  }
  const metadata = Reflect.get(value, scriptMetadataSymbol)
  return typeof metadata === 'object' && metadata !== null
    ? (metadata as Readonly<ScriptMetadata>)
    : undefined
}
