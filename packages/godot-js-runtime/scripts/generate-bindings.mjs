import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const apiPath = path.join(
  packageRoot,
  'native/third_party/godot-cpp/gdextension/extension_api.json',
)
const lockPath = path.join(packageRoot, 'native/deps.lock.json')
const headerPath = path.join(
  packageRoot,
  'native/include/godot_js_runtime/generated/binding_metadata.gen.hpp',
)
const sourcePath = path.join(
  packageRoot,
  'native/src/generated/binding_metadata.gen.cpp',
)
const exportsPath = path.join(
  packageRoot,
  'native/generated/binding_exports.json',
)
const checkOnly = process.argv.includes('--check')

function fail(message) {
  throw new Error(`[generate-bindings] ${message}`)
}

function requiredFile(filePath, setupHint) {
  if (!fs.existsSync(filePath)) {
    fail(`${path.relative(packageRoot, filePath)} is missing; ${setupHint}`)
  }
  return fs.readFileSync(filePath, 'utf-8')
}

function writeOrCheck(filePath, contents) {
  if (checkOnly) {
    const relativePath = path.relative(packageRoot, filePath)
    if (!fs.existsSync(filePath)) {
      fail(`${relativePath} is missing; run npm run generate:bindings`)
    }
    const current = fs.readFileSync(filePath, 'utf-8')
    if (!Buffer.from(current).equals(Buffer.from(contents))) {
      fail(`${relativePath} is stale; run npm run generate:bindings`)
    }
    return
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, contents)
}

function cppString(value) {
  return JSON.stringify(value ?? '')
}

function cppBool(value) {
  return value ? 'true' : 'false'
}

function compareNames(left, right) {
  if (left.name < right.name) return -1
  if (left.name > right.name) return 1
  return 0
}

function sortByName(values) {
  return [...(values ?? [])].sort(compareNames)
}

function methodFlags(method) {
  return (
    (method.is_static ? 1 : 0) |
    (method.is_vararg ? 2 : 0) |
    (method.is_virtual ? 4 : 0) |
    (method.is_const ? 8 : 0)
  )
}

function addArguments(target, values) {
  const argumentList = values ?? []
  const offset = target.length
  let requiredCount = 0
  for (const argument of argumentList) {
    const hasDefault = Object.hasOwn(argument, 'default_value')
    if (!hasDefault) requiredCount += 1
    target.push({
      name: argument.name,
      type: argument.type,
      hasDefault,
    })
  }
  return { offset, count: argumentList.length, requiredCount }
}

function appendEnum(ownerKind, ownerIndex, value, enums, enumValues) {
  const values = [...(value.values ?? [])].sort(
    (left, right) => left.value - right.value || compareNames(left, right),
  )
  const valuesOffset = enumValues.length
  for (const enumValue of values) {
    enumValues.push({ name: enumValue.name, value: enumValue.value })
  }
  enums.push({
    name: value.name,
    ownerKind,
    ownerIndex,
    isBitfield: Boolean(value.is_bitfield),
    valuesOffset,
    valuesCount: values.length,
  })
}

function appendMethod(ownerKind, ownerIndex, value, methods, argumentsTable) {
  const argumentRange = addArguments(argumentsTable, value.arguments)
  methods.push({
    name: value.name,
    returnType: value.return_value?.type ?? value.return_type ?? '',
    ownerKind,
    ownerIndex,
    hash: value.hash ?? 0,
    flags: methodFlags(value),
    ...argumentRange,
  })
}

function appendConstructor(ownerIndex, value, constructors, argumentsTable) {
  const argumentRange = addArguments(argumentsTable, value.arguments)
  constructors.push({ ownerIndex, ...argumentRange })
}

function renderArray(type, name, rows, renderRow) {
  const renderedRows = rows.map((row) => `\t${renderRow(row)},`).join('\n')
  return `const ${type} ${name}[] = {\n${renderedRows}\n};\nconst std::size_t ${name}_COUNT = sizeof(${name}) / sizeof(${name}[0]);`
}

const apiSource = requiredFile(
  apiPath,
  'run npm run bootstrap:native before regenerating bindings',
)
const dependencyLock = JSON.parse(
  requiredFile(lockPath, 'restore the pinned native dependency lock'),
)
const api = JSON.parse(apiSource)
const apiVersion = `${api.header.version_major}.${api.header.version_minor}.${api.header.version_patch}`
if (
  api.header.version_major !== 4 ||
  api.header.version_minor !== 4 ||
  api.header.version_patch !== 1 ||
  api.header.version_status !== 'stable'
) {
  fail(`expected the pinned Godot 4.4.1 stable API, received ${apiVersion}`)
}
const godotCppCommit = dependencyLock.dependencies?.godotCpp?.commit
if (!/^[0-9a-f]{40}$/.test(godotCppCommit ?? '')) {
  fail('deps.lock.json does not contain a full pinned godot-cpp commit')
}
const apiSha256 = crypto.createHash('sha256').update(apiSource).digest('hex')

const argumentsTable = []
const methods = []
const constructors = []
const properties = []
const signals = []
const constants = []
const enums = []
const enumValues = []
const builtinMembers = []
const builtinConstants = []

const classes = sortByName(api.classes).map((value, classIndex) => {
  const methodsOffset = methods.length
  for (const method of sortByName(value.methods)) {
    appendMethod(0, classIndex, method, methods, argumentsTable)
  }
  const propertiesOffset = properties.length
  for (const property of sortByName(value.properties)) {
    properties.push({
      ownerIndex: classIndex,
      name: property.name,
      type: property.type ?? 'Variant',
      getter: property.getter ?? '',
      setter: property.setter ?? '',
      index: property.index ?? -1,
    })
  }
  const signalsOffset = signals.length
  for (const signal of sortByName(value.signals)) {
    const argumentRange = addArguments(argumentsTable, signal.arguments)
    signals.push({
      ownerIndex: classIndex,
      name: signal.name,
      ...argumentRange,
    })
  }
  const constantsOffset = constants.length
  for (const constant of sortByName(value.constants)) {
    constants.push({
      ownerKind: 0,
      ownerIndex: classIndex,
      name: constant.name,
      value: constant.value,
    })
  }
  const enumsOffset = enums.length
  for (const enumValue of sortByName(value.enums)) {
    appendEnum(0, classIndex, enumValue, enums, enumValues)
  }
  return {
    name: value.name,
    inherits: value.inherits ?? '',
    apiType: value.api_type,
    instantiable: Boolean(value.is_instantiable),
    refcounted: Boolean(value.is_refcounted),
    methodsOffset,
    methodsCount: methods.length - methodsOffset,
    propertiesOffset,
    propertiesCount: properties.length - propertiesOffset,
    signalsOffset,
    signalsCount: signals.length - signalsOffset,
    constantsOffset,
    constantsCount: constants.length - constantsOffset,
    enumsOffset,
    enumsCount: enums.length - enumsOffset,
  }
})

const builtins = api.builtin_classes.map((value, builtinIndex) => {
  const methodsOffset = methods.length
  for (const method of sortByName(value.methods)) {
    appendMethod(1, builtinIndex, method, methods, argumentsTable)
  }
  const constructorsOffset = constructors.length
  for (const constructor of [...(value.constructors ?? [])].sort(
    (left, right) => left.index - right.index,
  )) {
    appendConstructor(builtinIndex, constructor, constructors, argumentsTable)
  }
  const membersOffset = builtinMembers.length
  for (const member of sortByName(value.members)) {
    builtinMembers.push({
      ownerIndex: builtinIndex,
      name: member.name,
      type: member.type,
    })
  }
  const constantsOffset = builtinConstants.length
  for (const constant of sortByName(value.constants)) {
    builtinConstants.push({ ownerIndex: builtinIndex, name: constant.name })
  }
  const enumsOffset = enums.length
  for (const enumValue of sortByName(value.enums)) {
    appendEnum(1, builtinIndex, enumValue, enums, enumValues)
  }
  return {
    name: value.name,
    variantType: builtinIndex,
    indexingReturnType: value.indexing_return_type ?? '',
    keyed: Boolean(value.is_keyed),
    hasDestructor: Boolean(value.has_destructor),
    methodsOffset,
    methodsCount: methods.length - methodsOffset,
    constructorsOffset,
    constructorsCount: constructors.length - constructorsOffset,
    membersOffset,
    membersCount: builtinMembers.length - membersOffset,
    constantsOffset,
    constantsCount: builtinConstants.length - constantsOffset,
    enumsOffset,
    enumsCount: enums.length - enumsOffset,
  }
})

const globalEnumsOffset = enums.length
for (const enumValue of sortByName(api.global_enums)) {
  appendEnum(2, 0, enumValue, enums, enumValues)
}

const utilityMethodsOffset = methods.length
const utilities = sortByName(api.utility_functions).map(
  (value, utilityIndex) => {
    appendMethod(2, utilityIndex, value, methods, argumentsTable)
    return {
      name: value.name,
      methodIndex: methods.length - 1,
      category: value.category,
    }
  },
)

const classIndexByName = new Map(
  classes.map((value, index) => [value.name, index]),
)
const builtinIndexByName = new Map(
  builtins.map((value, index) => [value.name, index]),
)
const singletons = sortByName(api.singletons).map((value) => ({
  name: value.name,
  type: value.type,
  classIndex: classIndexByName.get(value.type) ?? -1,
}))
const singletonIndexByName = new Map(
  singletons.map((value, index) => [value.name, index]),
)
const utilityIndexByName = new Map(
  utilities.map((value, index) => [value.name, index]),
)

const exportMap = new Map()
for (const [name, index] of classIndexByName) {
  exportMap.set(name, { name, kind: 'class', index })
}
for (const [name, index] of singletonIndexByName) {
  exportMap.set(name, { name, kind: 'singleton', index })
}
for (const [name, index] of builtinIndexByName) {
  if (!['Nil', 'bool', 'int', 'float', 'String'].includes(name)) {
    exportMap.set(name, { name, kind: 'builtin', index })
  }
}
for (const [name, index] of utilityIndexByName) {
  exportMap.set(name, { name, kind: 'utility', index })
}
const topLevelGlobalEnums = enums
  .slice(globalEnumsOffset)
  .map((value, index) => ({ value, index: globalEnumsOffset + index }))
for (const entry of topLevelGlobalEnums) {
  const rootName = entry.value.name.split('.')[0]
  if (entry.value.name.includes('.')) {
    if (!exportMap.has(rootName)) {
      exportMap.set(rootName, {
        name: rootName,
        kind: 'enum-namespace',
        index: 0,
      })
    }
  } else {
    exportMap.set(entry.value.name, {
      name: entry.value.name,
      kind: 'global-enum',
      index: entry.index,
    })
  }
}

const exportKindIndex = {
  class: 0,
  singleton: 1,
  builtin: 2,
  utility: 3,
  'global-enum': 4,
  'enum-namespace': 5,
}
const exportKindName = [
  'CLASS',
  'SINGLETON',
  'BUILTIN',
  'UTILITY',
  'GLOBAL_ENUM',
  'ENUM_NAMESPACE',
]
const exportsList = [...exportMap.values()].sort(compareNames)
const generatedBanner = `// Generated by scripts/generate-bindings.mjs. Do not edit.\n// Godot ${apiVersion}; godot-cpp ${godotCppCommit}; extension_api.json sha256 ${apiSha256}.\n// clang-format off`

const arrayTypes = {
  ARGUMENTS: 'BindingArgument',
  METHODS: 'BindingMethod',
  CONSTRUCTORS: 'BindingConstructor',
  PROPERTIES: 'BindingProperty',
  SIGNALS: 'BindingSignal',
  CONSTANTS: 'BindingConstant',
  ENUM_VALUES: 'BindingEnumValue',
  ENUMS: 'BindingEnum',
  BUILTIN_MEMBERS: 'BindingBuiltinMember',
  BUILTIN_CONSTANTS: 'BindingBuiltinConstant',
  CLASSES: 'BindingClass',
  BUILTINS: 'BindingBuiltin',
  SINGLETONS: 'BindingSingleton',
  UTILITIES: 'BindingUtility',
  EXPORTS: 'BindingExport',
}
const declarations = Object.entries(arrayTypes)
  .map(
    ([name, type]) =>
      `extern const ${type} ${name}[];\nextern const std::size_t ${name}_COUNT;`,
  )
  .join('\n')

const header = `${generatedBanner}
#ifndef GODOT_JS_RUNTIME_GENERATED_BINDING_METADATA_GEN_HPP
#define GODOT_JS_RUNTIME_GENERATED_BINDING_METADATA_GEN_HPP

#include <cstddef>
#include <cstdint>

namespace godot_js_runtime::generated {

enum class BindingOwnerKind : std::uint8_t { CLASS = 0, BUILTIN = 1, UTILITY = 2 };
enum class BindingExportKind : std::uint8_t { CLASS = 0, SINGLETON = 1, BUILTIN = 2, UTILITY = 3, GLOBAL_ENUM = 4, ENUM_NAMESPACE = 5 };

struct BindingArgument { const char *name; const char *type; bool has_default; };
struct BindingMethod { const char *name; const char *return_type; BindingOwnerKind owner_kind; std::uint32_t owner_index; std::uint32_t hash; std::uint32_t flags; std::uint32_t arguments_offset; std::uint16_t arguments_count; std::uint16_t required_arguments_count; };
struct BindingConstructor { std::uint32_t owner_index; std::uint32_t arguments_offset; std::uint16_t arguments_count; std::uint16_t required_arguments_count; };
struct BindingProperty { std::uint32_t owner_index; const char *name; const char *type; const char *getter; const char *setter; std::int32_t index; };
struct BindingSignal { std::uint32_t owner_index; const char *name; std::uint32_t arguments_offset; std::uint16_t arguments_count; std::uint16_t required_arguments_count; };
struct BindingConstant { BindingOwnerKind owner_kind; std::uint32_t owner_index; const char *name; std::int64_t value; };
struct BindingEnumValue { const char *name; std::int64_t value; };
struct BindingEnum { const char *name; BindingOwnerKind owner_kind; std::uint32_t owner_index; bool is_bitfield; std::uint32_t values_offset; std::uint32_t values_count; };
struct BindingBuiltinMember { std::uint32_t owner_index; const char *name; const char *type; };
struct BindingBuiltinConstant { std::uint32_t owner_index; const char *name; };
struct BindingClass { const char *name; const char *inherits; const char *api_type; bool is_instantiable; bool is_refcounted; std::uint32_t methods_offset; std::uint32_t methods_count; std::uint32_t properties_offset; std::uint32_t properties_count; std::uint32_t signals_offset; std::uint32_t signals_count; std::uint32_t constants_offset; std::uint32_t constants_count; std::uint32_t enums_offset; std::uint32_t enums_count; };
struct BindingBuiltin { const char *name; std::uint32_t variant_type; const char *indexing_return_type; bool is_keyed; bool has_destructor; std::uint32_t methods_offset; std::uint32_t methods_count; std::uint32_t constructors_offset; std::uint32_t constructors_count; std::uint32_t members_offset; std::uint32_t members_count; std::uint32_t constants_offset; std::uint32_t constants_count; std::uint32_t enums_offset; std::uint32_t enums_count; };
struct BindingSingleton { const char *name; const char *type; std::int32_t class_index; };
struct BindingUtility { const char *name; std::uint32_t method_index; const char *category; };
struct BindingExport { const char *name; BindingExportKind kind; std::uint32_t index; };

extern const char GODOT_API_VERSION[];
extern const char GODOT_CPP_COMMIT[];
extern const char EXTENSION_API_SHA256[];
extern const std::uint32_t GLOBAL_ENUMS_OFFSET;
extern const std::uint32_t UTILITY_METHODS_OFFSET;
${declarations}

} // namespace godot_js_runtime::generated

// clang-format on
#endif // GODOT_JS_RUNTIME_GENERATED_BINDING_METADATA_GEN_HPP
`

const sourceSections = [
  renderArray(
    'BindingArgument',
    'ARGUMENTS',
    argumentsTable,
    (value) =>
      `{ ${cppString(value.name)}, ${cppString(value.type)}, ${cppBool(value.hasDefault)} }`,
  ),
  renderArray(
    'BindingMethod',
    'METHODS',
    methods,
    (value) =>
      `{ ${cppString(value.name)}, ${cppString(value.returnType)}, BindingOwnerKind::${['CLASS', 'BUILTIN', 'UTILITY'][value.ownerKind]}, ${value.ownerIndex}U, ${value.hash}U, ${value.flags}U, ${value.offset}U, ${value.count}U, ${value.requiredCount}U }`,
  ),
  renderArray(
    'BindingConstructor',
    'CONSTRUCTORS',
    constructors,
    (value) =>
      `{ ${value.ownerIndex}U, ${value.offset}U, ${value.count}U, ${value.requiredCount}U }`,
  ),
  renderArray(
    'BindingProperty',
    'PROPERTIES',
    properties,
    (value) =>
      `{ ${value.ownerIndex}U, ${cppString(value.name)}, ${cppString(value.type)}, ${cppString(value.getter)}, ${cppString(value.setter)}, ${value.index} }`,
  ),
  renderArray(
    'BindingSignal',
    'SIGNALS',
    signals,
    (value) =>
      `{ ${value.ownerIndex}U, ${cppString(value.name)}, ${value.offset}U, ${value.count}U, ${value.requiredCount}U }`,
  ),
  renderArray(
    'BindingConstant',
    'CONSTANTS',
    constants,
    (value) =>
      `{ BindingOwnerKind::${['CLASS', 'BUILTIN', 'UTILITY'][value.ownerKind]}, ${value.ownerIndex}U, ${cppString(value.name)}, ${Math.trunc(value.value)}LL }`,
  ),
  renderArray(
    'BindingEnumValue',
    'ENUM_VALUES',
    enumValues,
    (value) => `{ ${cppString(value.name)}, ${Math.trunc(value.value)}LL }`,
  ),
  renderArray(
    'BindingEnum',
    'ENUMS',
    enums,
    (value) =>
      `{ ${cppString(value.name)}, BindingOwnerKind::${['CLASS', 'BUILTIN', 'UTILITY'][value.ownerKind]}, ${value.ownerIndex}U, ${cppBool(value.isBitfield)}, ${value.valuesOffset}U, ${value.valuesCount}U }`,
  ),
  renderArray(
    'BindingBuiltinMember',
    'BUILTIN_MEMBERS',
    builtinMembers,
    (value) =>
      `{ ${value.ownerIndex}U, ${cppString(value.name)}, ${cppString(value.type)} }`,
  ),
  renderArray(
    'BindingBuiltinConstant',
    'BUILTIN_CONSTANTS',
    builtinConstants,
    (value) => `{ ${value.ownerIndex}U, ${cppString(value.name)} }`,
  ),
  renderArray(
    'BindingClass',
    'CLASSES',
    classes,
    (value) =>
      `{ ${cppString(value.name)}, ${cppString(value.inherits)}, ${cppString(value.apiType)}, ${cppBool(value.instantiable)}, ${cppBool(value.refcounted)}, ${value.methodsOffset}U, ${value.methodsCount}U, ${value.propertiesOffset}U, ${value.propertiesCount}U, ${value.signalsOffset}U, ${value.signalsCount}U, ${value.constantsOffset}U, ${value.constantsCount}U, ${value.enumsOffset}U, ${value.enumsCount}U }`,
  ),
  renderArray(
    'BindingBuiltin',
    'BUILTINS',
    builtins,
    (value) =>
      `{ ${cppString(value.name)}, ${value.variantType}U, ${cppString(value.indexingReturnType)}, ${cppBool(value.keyed)}, ${cppBool(value.hasDestructor)}, ${value.methodsOffset}U, ${value.methodsCount}U, ${value.constructorsOffset}U, ${value.constructorsCount}U, ${value.membersOffset}U, ${value.membersCount}U, ${value.constantsOffset}U, ${value.constantsCount}U, ${value.enumsOffset}U, ${value.enumsCount}U }`,
  ),
  renderArray(
    'BindingSingleton',
    'SINGLETONS',
    singletons,
    (value) =>
      `{ ${cppString(value.name)}, ${cppString(value.type)}, ${value.classIndex} }`,
  ),
  renderArray(
    'BindingUtility',
    'UTILITIES',
    utilities,
    (value) =>
      `{ ${cppString(value.name)}, ${value.methodIndex}U, ${cppString(value.category)} }`,
  ),
  renderArray('BindingExport', 'EXPORTS', exportsList, (value) => {
    const kindIndex = exportKindIndex[value.kind]
    return `{ ${cppString(value.name)}, BindingExportKind::${exportKindName[kindIndex]}, ${value.index}U }`
  }),
]

const source = `${generatedBanner}
#include "godot_js_runtime/generated/binding_metadata.gen.hpp"

namespace godot_js_runtime::generated {

const char GODOT_API_VERSION[] = ${cppString(apiVersion)};
const char GODOT_CPP_COMMIT[] = ${cppString(godotCppCommit)};
const char EXTENSION_API_SHA256[] = ${cppString(apiSha256)};
const std::uint32_t GLOBAL_ENUMS_OFFSET = ${globalEnumsOffset}U;
const std::uint32_t UTILITY_METHODS_OFFSET = ${utilityMethodsOffset}U;

${sourceSections.join('\n\n')}

} // namespace godot_js_runtime::generated
// clang-format on
`

const exportsManifest = `${JSON.stringify(
  {
    schemaVersion: 1,
    godotVersion: apiVersion,
    godotCppCommit,
    extensionApiSha256: apiSha256,
    counts: {
      classes: classes.length,
      builtins: builtins.length,
      singletons: singletons.length,
      utilities: utilities.length,
      globalEnums: api.global_enums.length,
      methods: methods.length,
      properties: properties.length,
      signals: signals.length,
      exports: exportsList.length,
    },
    exports: exportsList.map(({ name, kind }) => ({ name, kind })),
  },
  null,
  2,
)}\n`

writeOrCheck(headerPath, header)
writeOrCheck(sourcePath, source)
writeOrCheck(exportsPath, exportsManifest)

console.log(
  `[generate-bindings] ${checkOnly ? 'verified' : 'generated'} ${classes.length} classes, ${builtins.length} builtins, ${singletons.length} singletons, ${utilities.length} utilities, and ${exportsList.length} module exports from Godot ${apiVersion}`,
)
