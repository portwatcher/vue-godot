import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const pinnedApiPath = path.join(
  packageRoot,
  'native/third_party/godot-cpp/gdextension/extension_api.json',
)
const defaultOutputDirectory = path.join(packageRoot, 'typings')
const generatorVersion = 1

const primitiveBuiltinTypes = new Map([
  ['Nil', 'null'],
  ['bool', 'boolean'],
  ['int', 'Integer'],
  ['float', 'number'],
  ['String', 'string'],
])
const integerNumberMetadata = new Set([
  'int8',
  'uint8',
  'int16',
  'uint16',
  'int32',
  'uint32',
  'char16',
  'char32',
])
const reservedWords = new Set([
  'abstract',
  'any',
  'as',
  'asserts',
  'async',
  'await',
  'bigint',
  'boolean',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'constructor',
  'continue',
  'debugger',
  'declare',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'from',
  'function',
  'get',
  'global',
  'if',
  'implements',
  'import',
  'in',
  'infer',
  'instanceof',
  'interface',
  'is',
  'keyof',
  'let',
  'module',
  'namespace',
  'never',
  'new',
  'null',
  'number',
  'object',
  'of',
  'package',
  'private',
  'protected',
  'public',
  'readonly',
  'require',
  'return',
  'satisfies',
  'set',
  'static',
  'string',
  'super',
  'switch',
  'symbol',
  'this',
  'throw',
  'true',
  'try',
  'type',
  'typeof',
  'undefined',
  'unique',
  'unknown',
  'using',
  'var',
  'void',
  'while',
  'with',
  'yield',
])
const packedTypedArrays = new Map([
  ['PackedByteArray', 'Uint8Array'],
  ['PackedInt32Array', 'Int32Array'],
  ['PackedInt64Array', 'BigInt64Array'],
  ['PackedFloat32Array', 'Float32Array'],
  ['PackedFloat64Array', 'Float64Array'],
])

function fail(message) {
  throw new Error(`[generate-types] ${message}`)
}

function parseArguments(arguments_) {
  const options = {
    apiPath: pinnedApiPath,
    checkOnly: false,
    godotPath: undefined,
    outputDirectory: defaultOutputDirectory,
  }
  for (let index = 0; index < arguments_.length; ++index) {
    const argument = arguments_[index]
    if (argument === '--check') {
      options.checkOnly = true
      continue
    }
    if (
      argument === '--api' ||
      argument === '--godot' ||
      argument === '--out-dir'
    ) {
      const value = arguments_[++index]
      if (!value) fail(`${argument} requires a path`)
      if (argument === '--api') options.apiPath = path.resolve(value)
      if (argument === '--godot') options.godotPath = path.resolve(value)
      if (argument === '--out-dir')
        options.outputDirectory = path.resolve(value)
      continue
    }
    if (argument === '--help') {
      console.log(`Usage: node scripts/generate-types.mjs [options]

Options:
  --api <extension_api.json>  Generate from an existing stock API dump
  --godot <executable>        Ask stock Godot to dump its extension API
  --out-dir <directory>       Output directory (default: typings)
  --check                     Fail if checked-in declarations are stale
`)
      process.exit(0)
    }
    fail(`unknown argument ${argument}`)
  }
  if (options.godotPath && options.apiPath !== pinnedApiPath) {
    fail('--api and --godot are mutually exclusive')
  }
  return options
}

function dumpStockGodotApi(godotPath) {
  if (!fs.existsSync(godotPath))
    fail(`Godot executable does not exist: ${godotPath}`)
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'godot-js-runtime-typegen-'),
  )
  try {
    const result = spawnSync(
      godotPath,
      ['--headless', '--dump-extension-api'],
      {
        cwd: temporaryDirectory,
        encoding: 'utf-8',
        maxBuffer: 16 * 1024 * 1024,
      },
    )
    if (result.error) fail(`could not run stock Godot: ${result.error.message}`)
    if (result.status !== 0) {
      fail(
        `stock Godot API dump failed with exit code ${result.status}: ${result.stderr || result.stdout}`,
      )
    }
    const apiPath = path.join(temporaryDirectory, 'extension_api.json')
    if (!fs.existsSync(apiPath)) {
      fail('stock Godot did not create extension_api.json')
    }
    return fs.readFileSync(apiPath, 'utf-8')
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true })
  }
}

function readApiSource(options) {
  if (options.godotPath) return dumpStockGodotApi(options.godotPath)
  if (!fs.existsSync(options.apiPath)) {
    fail(`extension API does not exist: ${options.apiPath}`)
  }
  return fs.readFileSync(options.apiPath, 'utf-8')
}

function sha256(contents) {
  return crypto.createHash('sha256').update(contents).digest('hex')
}

function compareNames(left, right) {
  return left.name.localeCompare(right.name, 'en')
}

function sorted(values) {
  return [...(values ?? [])].sort(compareNames)
}

function identifier(value) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(value)
}

function memberName(value) {
  return identifier(value) && !reservedWords.has(value)
    ? value
    : JSON.stringify(value)
}

function argumentName(value, index, usedNames) {
  let name =
    identifier(value) && !reservedWords.has(value)
      ? value
      : `${value.replace(/[^A-Za-z0-9_$]/g, '_') || 'argument'}_`
  if (!/^[A-Za-z_$]/.test(name)) name = `argument_${index}`
  while (usedNames.has(name)) name += '_'
  usedNames.add(name)
  return name
}

function enumType(value) {
  return value.replace(/^(?:enum|bitfield)::/, '')
}

function typedArrayElement(value) {
  const encoded = value.slice('typedarray::'.length)
  const decoded = encoded.includes(':')
    ? encoded.slice(encoded.lastIndexOf(':') + 1)
    : encoded
  return decoded || 'GodotVariant'
}

function unionType(value, context) {
  const members = value
    .split(',')
    .filter((member) => member && !member.startsWith('-'))
    .map((member) => godotType(member, undefined, context))
  return members.length > 0 ? [...new Set(members)].join(' | ') : 'GodotVariant'
}

function pointerType(value) {
  const normalized = value.replace(/^const\s+/, '').trim()
  const base = normalized.replace(/\*+$/, '').trim()
  const pointerDepth = normalized.length - normalized.replace(/\*+$/, '').length
  const primitivePointers = new Map([
    ['uint8_t', 'Uint8Array'],
    ['int32_t', 'Int32Array'],
    ['float', 'Float32Array'],
  ])
  if (pointerDepth === 1 && primitivePointers.has(base)) {
    return `${primitivePointers.get(base)} | NativePointer<${godotType(base)}>`
  }
  if (base === 'void' || pointerDepth > 1) return 'NativePointer'
  return `NativePointer<${godotType(base)}>`
}

function godotType(value, metadata, context = {}) {
  if (!value) return 'void'
  if (value.includes(',')) return unionType(value, context)
  if (value.startsWith('enum::') || value.startsWith('bitfield::')) {
    return enumType(value)
  }
  if (value.startsWith('typedarray::')) {
    const element = typedArrayElement(value)
    return `Array<${godotType(element)}>`
  }
  if (value.includes('*')) return pointerType(value)
  if (value === 'Variant') {
    if (context.owner === 'Array' && context.arrayElement)
      return context.arrayElement
    return 'GodotVariant'
  }
  if (value === 'Array')
    return `Array<${context.arrayElement ?? 'GodotVariant'}>`
  if (value === 'Dictionary') return 'Dictionary'
  if (value === 'bool') return 'boolean'
  if (value === 'float' || value === 'double' || value === 'real_t')
    return 'number'
  if (value === 'int') {
    return integerNumberMetadata.has(metadata) ? 'number' : 'Integer'
  }
  if (/^(?:u?int(?:8|16|32)_t|char(?:16|32)_t)$/.test(value)) return 'number'
  if (/^(?:u?int64_t|ObjectID)$/.test(value)) return 'Integer'
  if (value === 'String') return 'string'
  if (value === 'void') return 'void'
  return value.replaceAll('::', '.')
}

function methodReturnType(method, context) {
  return godotType(
    method.return_value?.type ?? method.return_type,
    method.return_value?.meta,
    context,
  )
}

function godotArgumentType(value, metadata, context) {
  const type = godotType(value, metadata, context)
  if (value === 'StringName' || value === 'NodePath') return `${type} | string`
  if (value === 'Callable') {
    return `${type} | ((...args: GodotVariant[]) => GodotVariant)`
  }
  return type
}

function renderArguments(arguments_, isVararg, context) {
  const values = arguments_ ?? []
  const usedNames = new Set()
  const rendered = values.map((argument, index) => {
    const name = argumentName(
      argument.name || `argument_${index}`,
      index,
      usedNames,
    )
    const optional = Object.hasOwn(argument, 'default_value') ? '?' : ''
    return `${name}${optional}: ${godotArgumentType(argument.type, argument.meta, context)}`
  })
  if (isVararg) {
    let restName = 'args'
    while (usedNames.has(restName)) restName += '_'
    rendered.push(`...${restName}: GodotVariant[]`)
  }
  return rendered.join(', ')
}

function renderMethod(method, options = {}) {
  const context = options.context ?? {}
  const staticPrefix = options.isStatic ? 'static ' : ''
  const name = memberName(method.name)
  const arguments_ = renderArguments(
    method.arguments,
    method.is_vararg,
    context,
  )
  const returnType = methodReturnType(method, context)
  return `    ${staticPrefix}${name}(${arguments_}): ${returnType}`
}

function renderEnum(value, indent = '  ') {
  const lines = [`${indent}export enum ${value.name} {`]
  for (const member of [...(value.values ?? [])].sort(
    (left, right) => left.value - right.value || compareNames(left, right),
  )) {
    lines.push(`${indent}  ${memberName(member.name)} = ${member.value},`)
  }
  lines.push(`${indent}}`)
  return lines.join('\n')
}

function renderNamespace(owner, enums) {
  if (!enums || enums.length === 0) return ''
  const lines = [`  export namespace ${owner} {`]
  for (const value of sorted(enums)) {
    lines.push(renderEnum(value, '    '))
  }
  lines.push('  }')
  return lines.join('\n')
}

function documentationUrl(name, version) {
  const slug = name.replaceAll('_', '').toLowerCase()
  return `https://docs.godotengine.org/en/${version}/classes/class_${slug}.html`
}

function builtinGenerics(name) {
  if (name === 'Array') return '<Element = GodotVariant>'
  if (name === 'Dictionary') return '<Key = GodotVariant, Value = GodotVariant>'
  if (name === 'Callable') {
    return '<Arguments extends readonly unknown[] = readonly GodotVariant[], Result = GodotVariant>'
  }
  if (name === 'Signal') {
    return '<Arguments extends readonly unknown[] = readonly GodotVariant[]>'
  }
  return ''
}

function builtinContext(name) {
  return name === 'Array'
    ? { owner: name, arrayElement: 'Element' }
    : { owner: name }
}

function renderBuiltin(value, docsVersion) {
  const context = builtinContext(value.name)
  const lines = [
    '  /**',
    `   * Godot ${value.name} value type.`,
    `   * @see ${documentationUrl(value.name, docsVersion)}`,
    '   */',
    `  export class ${value.name}${builtinGenerics(value.name)} {`,
  ]
  for (const constructor of value.constructors ?? []) {
    lines.push(
      `    constructor(${renderArguments(constructor.arguments, false, context)})`,
    )
  }
  lines.push(
    `    static is_instance(value: unknown): value is ${value.name}${
      value.name === 'Array'
        ? '<GodotVariant>'
        : value.name === 'Dictionary'
          ? '<GodotVariant, GodotVariant>'
          : value.name === 'Callable'
            ? '<readonly GodotVariant[], GodotVariant>'
            : value.name === 'Signal'
              ? '<readonly GodotVariant[]>'
              : ''
    }`,
  )
  if (value.indexing_return_type && value.name !== 'Dictionary') {
    lines.push(
      `    [index: number]: ${godotType(value.indexing_return_type, undefined, context)}`,
    )
  }
  for (const member of sorted(value.members)) {
    lines.push(
      `    ${memberName(member.name)}: ${godotType(member.type, member.meta, context)}`,
    )
  }
  for (const method of sorted(value.methods)) {
    if (value.name === 'Callable' && method.name === 'create') continue
    lines.push(
      renderMethod(method, { context, isStatic: Boolean(method.is_static) }),
    )
  }
  if (value.name === 'Callable') {
    lines.push(
      '    static create<Arguments extends readonly unknown[], Result>(',
      '      callback: (...args: Arguments) => Result,',
      '    ): Callable<Arguments, Result>',
      '    static create<Arguments extends readonly unknown[], Result>(',
      '      target: Object | GodotVariant,',
      '      callback: (...args: Arguments) => Result,',
      '    ): Callable<Arguments, Result>',
      '    call(...args: Arguments): Result',
    )
  }
  if (value.name === 'Signal') {
    lines.push(
      '    connect(callable: Callable<Arguments, GodotVariant>, flags?: Integer): Error',
      '    disconnect(callable: Callable<Arguments, GodotVariant>): void',
      '    emit(...args: Arguments): void',
      '    as_promise(): Promise<Arguments extends readonly [] ? void : Arguments[0]>',
    )
  }
  if (value.name === 'Dictionary') {
    lines.push(
      '    get(key: Key, defaultValue?: Value): Value',
      '    get_or_add(key: Key, defaultValue?: Value): Value',
      '    set(key: Key, value: Value): boolean',
      '    keys(): Array<Key>',
      '    values(): Array<Value>',
    )
  }
  if (packedTypedArrays.has(value.name)) {
    lines.push(`    toTypedArray(): ${packedTypedArrays.get(value.name)}`)
  } else if (value.name.startsWith('Packed')) {
    lines.push('    toTypedArray(): GodotVariant[]')
  }
  if (value.name === 'PackedByteArray')
    lines.push('    to_array_buffer(): ArrayBuffer')
  for (const constant of sorted(value.constants)) {
    lines.push(
      `    static readonly ${memberName(constant.name)}: ${
        constant.type ? godotType(constant.type) : 'Integer'
      }`,
    )
  }
  lines.push('  }')
  const namespace = renderNamespace(value.name, value.enums)
  if (namespace) lines.push(namespace)
  return lines.join('\n')
}

function renderClass(value, singletonNames, docsVersion) {
  const singleton = singletonNames.has(value.name)
  const classPrefix =
    !value.is_instantiable || singleton ? 'abstract class' : 'class'
  const inheritance = value.inherits ? ` extends ${value.inherits}` : ''
  const lines = [
    '  /**',
    `   * Godot ${value.name}${singleton ? ' singleton' : ' class'}.`,
    `   * @see ${documentationUrl(value.name, docsVersion)}`,
    '   */',
    `  export ${classPrefix} ${value.name}${inheritance} {`,
  ]
  if (value.is_instantiable && !singleton) lines.push('    constructor()')
  if (!singleton) {
    lines.push(`    static is_instance(value: unknown): value is ${value.name}`)
  }
  for (const property of sorted(value.properties)) {
    const readonlyPrefix = property.setter ? '' : 'readonly '
    lines.push(
      `    ${readonlyPrefix}${memberName(property.name)}: ${godotType(property.type)}`,
    )
    if (singleton) {
      lines.push(
        `    static ${readonlyPrefix}${memberName(property.name)}: ${godotType(property.type)}`,
      )
    }
  }
  for (const signal of sorted(value.signals)) {
    const signalArguments = (signal.arguments ?? [])
      .map((argument) => godotType(argument.type, argument.meta))
      .join(', ')
    const signalType = `Signal<readonly [${signalArguments}]>`
    lines.push(`    readonly ${memberName(signal.name)}: ${signalType}`)
    if (singleton)
      lines.push(
        `    static readonly ${memberName(signal.name)}: ${signalType}`,
      )
  }
  for (const method of sorted(value.methods)) {
    lines.push(renderMethod(method, { isStatic: Boolean(method.is_static) }))
    if (singleton && !method.is_static) {
      lines.push(renderMethod(method, { isStatic: true }))
    }
  }
  for (const constant of sorted(value.constants)) {
    lines.push(`    static readonly ${memberName(constant.name)}: Integer`)
  }
  lines.push('  }')
  const namespace = renderNamespace(value.name, value.enums)
  if (namespace) lines.push(namespace)
  return lines.join('\n')
}

function renderGlobalEnums(enums) {
  const direct = []
  const nested = new Map()
  for (const value of sorted(enums)) {
    const separator = value.name.indexOf('.')
    if (separator < 0) {
      direct.push(value)
      continue
    }
    const owner = value.name.slice(0, separator)
    const enumName = value.name.slice(separator + 1)
    const members = nested.get(owner) ?? []
    members.push({ ...value, name: enumName })
    nested.set(owner, members)
  }
  const lines = direct.map((value) => renderEnum(value))
  for (const owner of [...nested.keys()].sort()) {
    lines.push(renderNamespace(owner, nested.get(owner)))
  }
  return lines.join('\n')
}

function renderNativeStructures(values) {
  return sorted(values)
    .map(
      (value) =>
        `  /** Opaque public GDExtension native structure (${value.format}). */\n  export interface ${value.name} {\n    readonly __godotNativeStructure: ${JSON.stringify(value.name)}\n  }`,
    )
    .join('\n')
}

function renderUtilityFunction(value) {
  const arguments_ = renderArguments(value.arguments, value.is_vararg, {})
  const returnType = methodReturnType(value, {})
  if (identifier(value.name) && !reservedWords.has(value.name)) {
    return `  export function ${value.name}(${arguments_}): ${returnType}`
  }
  const localName = `__godot_${value.name.replace(/[^A-Za-z0-9_$]/g, '_')}`
  return `  const ${localName}: (${arguments_}) => ${returnType}\n  export { ${localName} as ${value.name} }`
}

function renderGodotDeclaration(api, apiHash) {
  const docsVersion = `${api.header.version_major}.${api.header.version_minor}`
  const singletonNames = new Set(
    (api.singletons ?? []).map((value) => value.name),
  )
  const builtins = sorted(api.builtin_classes)
  const lines = [
    '// Generated by scripts/generate-types.mjs. Do not edit.',
    `// ${api.header.version_full_name}; extension_api.json sha256 ${apiHash}.`,
    `// API documentation links target the Godot ${docsVersion} class reference.`,
    '',
    "declare module 'godot' {",
    '  export type Integer = number | bigint',
    '  export type GodotVariant = unknown',
    '  export interface NativePointer<Value = unknown> {',
    '    readonly __godotNativePointer?: Value',
    '  }',
    '  export interface GodotPrimitiveConstructor<Value> {',
    '    (value?: GodotVariant): Value',
    '    new (value?: GodotVariant): Value',
    '    is_instance(value: unknown): value is Value',
    '  }',
    '',
  ]
  for (const value of builtins.filter(
    (builtin) => !primitiveBuiltinTypes.has(builtin.name),
  )) {
    lines.push(renderBuiltin(value, docsVersion), '')
  }
  lines.push(renderNativeStructures(api.native_structures), '')
  lines.push(renderGlobalEnums(api.global_enums), '')
  for (const value of sorted(api.classes)) {
    lines.push(renderClass(value, singletonNames, docsVersion), '')
  }
  for (const value of sorted(api.utility_functions)) {
    lines.push(renderUtilityFunction(value))
  }
  for (const value of sorted(api.global_constants)) {
    lines.push(
      `  export const ${memberName(value.name)}: ${godotType(value.type)}`,
    )
  }
  lines.push('}', '')
  return lines.join('\n')
}

function renderGodotJsDeclaration(api, apiHash) {
  return `// Generated by scripts/generate-types.mjs. Do not edit.
// ${api.header.version_full_name}; extension_api.json sha256 ${apiHash}.

declare module 'godot-js' {
  export type RuntimeFeature =
    | 'commonjs'
    | 'esm'
    | 'godot-binding'
    | 'godot-variant-bridge'
    | 'json-modules'
    | 'promise-jobs'
    | 'quickjs-ng'
    | 'resource-modules'
    | 'source-maps'

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

  export type DefinedScript<ScriptClass extends GodotScriptClass> = ScriptClass & {
    readonly [key: symbol]: Readonly<ScriptMetadata>
  }

  export function runtimeVersion(): string
  export function quickJSVersion(): string
  export function runtimeFeatures(): RuntimeFeature[]
  export function hasFeature(feature: RuntimeFeature | string): boolean
  export function collectGarbage(): void
  export function defineScript<ScriptClass extends GodotScriptClass>(
    scriptClass: ScriptClass,
    metadata: ScriptMetadata,
  ): DefinedScript<ScriptClass>
  export function getScriptMetadata(
    value: unknown,
  ): Readonly<ScriptMetadata> | undefined
}
`
}

function renderGodotJsbDeclaration(api, apiHash) {
  return `// Generated by scripts/generate-types.mjs. Do not edit.
// ${api.header.version_full_name}; extension_api.json sha256 ${apiHash}.
// Compatibility is intentionally limited to the migration surface below.

declare module 'godot-jsb' {
  import type { Callable, GodotVariant, Object, PackedByteArray } from 'godot'

  /** @deprecated Prefer Callable.create(). */
  export function callable<Arguments extends readonly unknown[], Result>(
    callback: (...args: Arguments) => Result,
  ): Callable<Arguments, Result>
  /** @deprecated Prefer Callable.create(). */
  export function callable<Arguments extends readonly unknown[], Result>(
    target: Object | GodotVariant,
    callback: (...args: Arguments) => Result,
  ): Callable<Arguments, Result>
  /** @deprecated Prefer PackedByteArray.to_array_buffer(). */
  export function to_array_buffer(packed: PackedByteArray): ArrayBuffer
  export const version: string
  export const impl: 'QuickJS-ng'
}
`
}

function renderIndexDeclaration() {
  return `// Generated by scripts/generate-types.mjs. Do not edit.
/// <reference path="./godot.d.ts" />
/// <reference path="./godot-js.d.ts" />
/// <reference path="./godot-jsb.d.ts" />
`
}

function writeOrCheck(filePath, contents, checkOnly) {
  const relativePath = path.relative(packageRoot, filePath)
  if (checkOnly) {
    if (!fs.existsSync(filePath)) {
      fail(`${relativePath} is missing; run npm run gen:types`)
    }
    if (!Buffer.from(fs.readFileSync(filePath)).equals(Buffer.from(contents))) {
      fail(`${relativePath} is stale; run npm run gen:types`)
    }
    return
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, contents)
}

const options = parseArguments(process.argv.slice(2))
const apiSource = readApiSource(options)
const apiHash = sha256(apiSource)
let api
try {
  api = JSON.parse(apiSource)
} catch (error) {
  fail(`extension API is not valid JSON: ${error.message}`)
}
if (
  !api.header ||
  !Array.isArray(api.classes) ||
  !Array.isArray(api.builtin_classes)
) {
  fail('extension API is missing required stock Godot sections')
}
if (
  api.header.version_major < 4 ||
  (api.header.version_major === 4 && api.header.version_minor < 4)
) {
  fail(
    `Godot ${api.header.version_major}.${api.header.version_minor} is below the 4.4 minimum`,
  )
}

const generatedFiles = new Map([
  ['godot.d.ts', renderGodotDeclaration(api, apiHash)],
  ['godot-js.d.ts', renderGodotJsDeclaration(api, apiHash)],
  ['godot-jsb.d.ts', renderGodotJsbDeclaration(api, apiHash)],
  ['index.d.ts', renderIndexDeclaration()],
])
const manifest = {
  schemaVersion: 1,
  generatorVersion,
  godotVersion: `${api.header.version_major}.${api.header.version_minor}.${api.header.version_patch}`,
  apiSha256: apiHash,
  counts: {
    builtins: api.builtin_classes.length,
    classes: api.classes.length,
    globalEnums: api.global_enums.length,
    nativeStructures: api.native_structures.length,
    singletons: api.singletons.length,
    utilityFunctions: api.utility_functions.length,
  },
  files: Object.fromEntries(
    [...generatedFiles].map(([name, contents]) => [name, sha256(contents)]),
  ),
}
generatedFiles.set('manifest.json', `${JSON.stringify(manifest, null, 2)}\n`)

for (const [name, contents] of generatedFiles) {
  writeOrCheck(
    path.join(options.outputDirectory, name),
    contents,
    options.checkOnly,
  )
}

console.log(
  `[generate-types] ${options.checkOnly ? 'verified' : 'generated'} ${api.classes.length} classes, ${api.builtin_classes.length} built-ins, ${api.singletons.length} singletons, and ${api.utility_functions.length} utilities from Godot ${manifest.godotVersion} (${apiHash.slice(0, 12)})`,
)
