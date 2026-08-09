import {
  hasFeature,
  collectGarbage,
  quickJSVersion,
  runtimeFeatures,
  runtimeVersion,
} from 'godot-js'
import settings from './settings.json'
import { moduleMarker } from './module.mjs'
import './variant-roundtrip.mjs'
import {
  Array as GodotArray,
  AudioStreamGenerator,
  AudioStreamPlayer,
  Callable,
  ClassDB,
  Color,
  Dictionary,
  JSON,
  Label,
  Node,
  OS,
  ProjectSettings,
  PackedByteArray,
  PackedInt64Array,
  Side,
  StringName,
  Timer,
  Variant,
  Vector2,
  is_instance_valid,
  instance_from_id,
  typeof as godotTypeof,
} from 'godot'

function assertBinding(condition, message) {
  if (!condition) {
    throw new Error(`Godot binding contract failed: ${message}`)
  }
}

const label = new Label()
assertBinding(label instanceof Label, 'Label constructor identity')
assertBinding(label instanceof Node, 'Label inherits Node')
assertBinding(is_instance_valid(label), 'live-object validity utility')
const labelInstanceId = label.get_instance_id()
assertBinding(
  instance_from_id(labelInstanceId) === label,
  'instance ID lookup preserves wrapper identity',
)
label.text = 'こんにちは JavaScript'
assertBinding(
  label.text === 'こんにちは JavaScript',
  'Unicode property round-trip',
)
assertBinding(ClassDB.class_exists('Label'), 'ClassDB singleton method')
const dynamicLabel = ClassDB.instantiate('Label')
assertBinding(
  dynamicLabel instanceof Label,
  'ClassDB preserves runtime wrapper type',
)

const vector = new Vector2(12.5, -4)
assertBinding(vector.x === 12.5 && vector.y === -4, 'Vector2 fields')
vector.y = 8.25
assertBinding(vector.y === 8.25, 'Vector2 mutable field')
assertBinding(vector[0] === 12.5 && vector[1] === 8.25, 'Vector2 indexed reads')
vector[1] = -6.5
assertBinding(vector.y === -6.5, 'Vector2 indexed write')
const color = new Color(0.25, 0.5, 0.75, 1)
assertBinding(color.a === 1, 'Color constructor and field')
const name = new StringName('runtime-名前')
assertBinding(String(name) === 'runtime-名前', 'StringName conversion')

const array = new GodotArray([1, 'two', vector])
assertBinding(array.size() === 3, 'nested Array construction')
assertBinding(array.get(2).x === 12.5, 'nested value wrapper conversion')
assertBinding(array[0] === 1, 'Array bracket read')
array[1] = 'updated'
assertBinding(array.get(1) === 'updated', 'Array bracket write')
assertBinding(
  Object.keys(array).join(',') === '0,1,2',
  'Array index enumeration',
)
const dictionary = new Dictionary({ answer: 42, nested: [1, 2, 3] })
assertBinding(
  dictionary.get('answer') === 42,
  'Dictionary construction and keyed read',
)
assertBinding(
  dictionary.get('nested').size() === 3,
  'nested Dictionary Array value',
)
assertBinding(dictionary.answer === 42, 'Dictionary property read')
dictionary.extra = 'value'
assertBinding(dictionary.get('extra') === 'value', 'Dictionary property write')
assertBinding(
  Object.keys(dictionary).includes('answer') &&
    Object.keys(dictionary).includes('extra'),
  'Dictionary key enumeration',
)

const identityArray = new GodotArray([dictionary])
assertBinding(identityArray[0] === dictionary, 'Dictionary wrapper identity')
const nestedIdentity = new GodotArray([array])
assertBinding(nestedIdentity[0] === array, 'Array wrapper identity')

const streamPlayer = new AudioStreamPlayer()
const stream = new AudioStreamGenerator()
streamPlayer.stream = stream
assertBinding(streamPlayer.stream === stream, 'RefCounted wrapper identity')
streamPlayer.free()

const bytes = new PackedByteArray(new Uint8Array([1, 2, 255]))
const bytesCopy = new Uint8Array(bytes.to_array_buffer())
assertBinding(
  bytesCopy.length === 3 && bytesCopy[0] === 1 && bytesCopy[2] === 255,
  'PackedByteArray copy API',
)
assertBinding(bytes[2] === 255, 'packed array indexed read')
const wideIntegers = new PackedInt64Array([9007199254740993n])
assertBinding(
  wideIntegers.get(0) === 9007199254740993n,
  'unsafe 64-bit integer returns bigint',
)

let callbackCount = 0
const callable = Callable.create(() => {
  callbackCount += 1
})
assertBinding(callable.is_valid(), 'JavaScript Callable is valid')
callable.call()
assertBinding(callbackCount === 1, 'Callable crosses Godot callback boundary')
const timer = new Timer()
timer.timeout.connect(callable)
assertBinding(timer.timeout.is_connected(callable), 'Signal retains Callable')
timer.timeout.disconnect(callable)
assertBinding(
  !timer.timeout.is_connected(callable),
  'Signal disconnect releases connection',
)
const shutdownCallable = Callable.create(() => {})
ProjectSettings.settings_changed.connect(shutdownCallable)
assertBinding(
  ProjectSettings.settings_changed.is_connected(shutdownCallable),
  'Runtime tracks singleton signal connections for shutdown',
)
let callbackExceptionReached = false
const throwingCallable = Callable.create(() => {
  callbackExceptionReached = true
  throw new Error('PHASE3_EXPECTED_CALLBACK_EXCEPTION')
})
let callbackBoundaryError = ''
try {
  throwingCallable.call()
} catch (error) {
  callbackBoundaryError = String(error)
}
assertBinding(
  callbackExceptionReached,
  'JavaScript callback exception reached boundary',
)
assertBinding(
  callbackBoundaryError.includes('Callable.call') &&
    callbackBoundaryError.includes('failed'),
  'JavaScript callback exception becomes a structured Godot call error',
)

assertBinding(typeof OS.get_name() === 'string', 'OS singleton method')
assertBinding(
  JSON.stringify(new Dictionary({ static_call: true })).includes('static_call'),
  'static class method dispatch',
)
assertBinding(typeof Side.SIDE_LEFT === 'number', 'global enum export')
assertBinding(
  typeof Variant.Type.TYPE_VECTOR2 === 'number',
  'Variant enum namespace',
)
assertBinding(
  godotTypeof(vector) === Variant.Type.TYPE_VECTOR2,
  'utility dispatch',
)

let structuredCallError = ''
try {
  label.set_text(vector)
} catch (error) {
  structuredCallError = String(error)
}
assertBinding(
  structuredCallError.includes(
    "Label.set_text argument 0 ('text') expected String",
  ),
  'structured argument conversion error',
)

function stressBindingOwnership() {
  for (let index = 0; index < 2048; index += 1) {
    const node = new Node()
    node.name = `stress-${String(index)}`
    node.free()
  }
  for (let index = 0; index < 256; index += 1) {
    const resourcePlayer = new AudioStreamPlayer()
    const resource = new AudioStreamGenerator()
    resourcePlayer.stream = resource
    assertBinding(
      resourcePlayer.stream === resource,
      'stress resource identity',
    )

    const values = new GodotArray([index, `値-${String(index)}`])
    const valuesByName = new Dictionary({ index, values })
    assertBinding(
      valuesByName.values === values,
      'stress nested container identity',
    )

    const signalOwner = new Timer()
    const callback = Callable.create(() => index)
    signalOwner.timeout.connect(callback)
    assertBinding(
      signalOwner.timeout.is_connected(callback),
      'stress signal connect',
    )
    signalOwner.timeout.disconnect(callback)
    assertBinding(
      !signalOwner.timeout.is_connected(callback),
      'stress signal disconnect',
    )

    signalOwner.free()
    resourcePlayer.free()
  }
}

stressBindingOwnership()
collectGarbage()

timer.free()
dynamicLabel.free()
label.free()
assertBinding(!is_instance_valid(label), 'freed-object validity utility')
assertBinding(
  instance_from_id(labelInstanceId) === null,
  'freed instance ID lookup returns null',
)
let invalidObjectError = ''
try {
  label.get_class()
} catch (error) {
  invalidObjectError = String(error)
}
assertBinding(
  invalidObjectError.includes('freed Godot object'),
  'invalid-object guard',
)

console.log(
  '[godot-js-runtime] PHASE3_BINDING PASS classdb properties variants callable signals identity errors gc-stress',
)

if (runtimeVersion() !== '0.0.0-development') {
  throw new Error(`Unexpected runtime version: ${runtimeVersion()}`)
}
if (quickJSVersion() !== '0.15.0') {
  throw new Error(`Unexpected QuickJS-ng version: ${quickJSVersion()}`)
}
if (!hasFeature('resource-modules') || !hasFeature('promise-jobs')) {
  throw new Error(`Missing runtime features: ${runtimeFeatures().join(',')}`)
}
if (settings.marker !== 'resource-json' || moduleMarker !== 'relative-esm') {
  throw new Error('Resource-backed ESM or JSON loading failed')
}

Promise.resolve().then(() => {
  console.log(
    `[godot-js-runtime] PHASE2_MODULE_PROMISE PASS ${moduleMarker} ${settings.marker}`,
  )
})
