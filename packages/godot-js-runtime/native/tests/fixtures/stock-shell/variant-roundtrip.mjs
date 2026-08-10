import {
  AABB,
  Array as GodotArray,
  Basis,
  Callable,
  Color,
  Dictionary,
  Node,
  NodePath,
  Object as GodotObject,
  PackedByteArray,
  PackedColorArray,
  PackedFloat32Array,
  PackedFloat64Array,
  PackedInt32Array,
  PackedInt64Array,
  PackedStringArray,
  PackedVector2Array,
  PackedVector3Array,
  PackedVector4Array,
  Plane,
  Projection,
  Quaternion,
  Rect2,
  Rect2i,
  RID,
  StringName,
  Timer,
  Transform2D,
  Transform3D,
  Variant,
  Vector2,
  Vector2i,
  Vector3,
  Vector3i,
  Vector4,
  Vector4i,
  typeof as godotTypeof,
} from 'godot'

function assertVariant(condition, message) {
  if (!condition) {
    throw new Error(`Variant round-trip failed: ${message}`)
  }
}

const objectValue = new Node()
const signalOwner = new Timer()
let callbackCalls = 0
const callableValue = Callable.create(() => {
  callbackCalls += 1
  return 17
})
const arrayValue = new GodotArray([1, 'nested-array'])
const dictionaryValue = new Dictionary({ answer: 42 })

assertVariant(objectValue instanceof GodotObject, 'Object class export')
assertVariant(
  new Vector2(new Vector2i(7, 9)).x === 7,
  'same-arity Vector2 overload dispatch',
)
assertVariant(
  godotTypeof(new Quaternion(new Basis())) === Variant.Type.TYPE_QUATERNION,
  'same-arity Quaternion overload dispatch',
)

const cases = [
  ['NIL', null, Variant.Type.TYPE_NIL],
  ['BOOL', true, Variant.Type.TYPE_BOOL],
  ['INT', 42, Variant.Type.TYPE_INT],
  ['INT_BIGINT', 9007199254740993n, Variant.Type.TYPE_INT],
  ['FLOAT', 1.25, Variant.Type.TYPE_FLOAT],
  ['STRING', '日本語-🙂', Variant.Type.TYPE_STRING],
  ['VECTOR2', new Vector2(1, 2), Variant.Type.TYPE_VECTOR2],
  ['VECTOR2I', new Vector2i(1, 2), Variant.Type.TYPE_VECTOR2I],
  ['RECT2', new Rect2(1, 2, 3, 4), Variant.Type.TYPE_RECT2],
  ['RECT2I', new Rect2i(1, 2, 3, 4), Variant.Type.TYPE_RECT2I],
  ['VECTOR3', new Vector3(1, 2, 3), Variant.Type.TYPE_VECTOR3],
  ['VECTOR3I', new Vector3i(1, 2, 3), Variant.Type.TYPE_VECTOR3I],
  ['TRANSFORM2D', new Transform2D(), Variant.Type.TYPE_TRANSFORM2D],
  ['VECTOR4', new Vector4(1, 2, 3, 4), Variant.Type.TYPE_VECTOR4],
  ['VECTOR4I', new Vector4i(1, 2, 3, 4), Variant.Type.TYPE_VECTOR4I],
  ['PLANE', new Plane(1, 2, 3, 4), Variant.Type.TYPE_PLANE],
  ['QUATERNION', new Quaternion(0, 0, 0, 1), Variant.Type.TYPE_QUATERNION],
  ['AABB', new AABB(), Variant.Type.TYPE_AABB],
  ['BASIS', new Basis(), Variant.Type.TYPE_BASIS],
  ['TRANSFORM3D', new Transform3D(), Variant.Type.TYPE_TRANSFORM3D],
  ['PROJECTION', new Projection(), Variant.Type.TYPE_PROJECTION],
  ['COLOR', new Color(0.1, 0.2, 0.3, 1), Variant.Type.TYPE_COLOR],
  ['STRING_NAME', new StringName('名前'), Variant.Type.TYPE_STRING_NAME],
  ['NODE_PATH', new NodePath('/root/ノード'), Variant.Type.TYPE_NODE_PATH],
  ['RID', new RID(), Variant.Type.TYPE_RID],
  ['OBJECT', objectValue, Variant.Type.TYPE_OBJECT],
  ['CALLABLE', callableValue, Variant.Type.TYPE_CALLABLE],
  ['SIGNAL', signalOwner.timeout, Variant.Type.TYPE_SIGNAL],
  ['DICTIONARY', dictionaryValue, Variant.Type.TYPE_DICTIONARY],
  ['ARRAY', arrayValue, Variant.Type.TYPE_ARRAY],
  [
    'PACKED_BYTE_ARRAY',
    new PackedByteArray([0, 127, 255]),
    Variant.Type.TYPE_PACKED_BYTE_ARRAY,
  ],
  [
    'PACKED_INT32_ARRAY',
    new PackedInt32Array([-2147483648, 2147483647]),
    Variant.Type.TYPE_PACKED_INT32_ARRAY,
  ],
  [
    'PACKED_INT64_ARRAY',
    new PackedInt64Array([-9223372036854775808n, 9223372036854775807n]),
    Variant.Type.TYPE_PACKED_INT64_ARRAY,
  ],
  [
    'PACKED_FLOAT32_ARRAY',
    new PackedFloat32Array([1.25, -2.5]),
    Variant.Type.TYPE_PACKED_FLOAT32_ARRAY,
  ],
  [
    'PACKED_FLOAT64_ARRAY',
    new PackedFloat64Array([Math.PI, -Math.E]),
    Variant.Type.TYPE_PACKED_FLOAT64_ARRAY,
  ],
  [
    'PACKED_STRING_ARRAY',
    new PackedStringArray(['日本語', '🙂']),
    Variant.Type.TYPE_PACKED_STRING_ARRAY,
  ],
  [
    'PACKED_VECTOR2_ARRAY',
    new PackedVector2Array([new Vector2(1, 2)]),
    Variant.Type.TYPE_PACKED_VECTOR2_ARRAY,
  ],
  [
    'PACKED_VECTOR3_ARRAY',
    new PackedVector3Array([new Vector3(1, 2, 3)]),
    Variant.Type.TYPE_PACKED_VECTOR3_ARRAY,
  ],
  [
    'PACKED_COLOR_ARRAY',
    new PackedColorArray([new Color(1, 0.5, 0.25, 1)]),
    Variant.Type.TYPE_PACKED_COLOR_ARRAY,
  ],
  [
    'PACKED_VECTOR4_ARRAY',
    new PackedVector4Array([new Vector4(1, 2, 3, 4)]),
    Variant.Type.TYPE_PACKED_VECTOR4_ARRAY,
  ],
]

const observedTypes = new Set()
for (const [name, value, expectedType] of cases) {
  const transport = new GodotArray([value])
  const roundTripped = transport[0]
  const actualType = godotTypeof(roundTripped)
  assertVariant(
    actualType === expectedType,
    `${name} expected type ${String(expectedType)}, received ${String(actualType)}`,
  )
  observedTypes.add(actualType)
  if (
    expectedType === Variant.Type.TYPE_OBJECT ||
    expectedType === Variant.Type.TYPE_ARRAY ||
    expectedType === Variant.Type.TYPE_DICTIONARY
  ) {
    assertVariant(roundTripped === value, `${name} preserves wrapper identity`)
  }
  if (name === 'INT_BIGINT') {
    assertVariant(
      roundTripped === value,
      'unsafe 64-bit integer preserves bigint',
    )
  }
  if (name === 'STRING') {
    assertVariant(roundTripped === value, 'Unicode string preserves content')
  }
}

assertVariant(
  observedTypes.size === Variant.Type.TYPE_MAX,
  `covered ${String(observedTypes.size)} of ${String(Variant.Type.TYPE_MAX)} Variant types`,
)
assertVariant(
  new GodotArray([undefined])[0] === null,
  'undefined input converts to NIL/null output',
)

let nestedValue = '深い値'
for (let depth = 0; depth < 32; depth += 1) {
  nestedValue = new Dictionary({
    depth,
    nested: new GodotArray([nestedValue]),
  })
}
for (let depth = 31; depth >= 0; depth -= 1) {
  assertVariant(nestedValue.depth === depth, `nested depth ${String(depth)}`)
  nestedValue = nestedValue.nested[0]
}
assertVariant(nestedValue === '深い値', 'deep nested Unicode leaf')

callableValue.call()
assertVariant(
  callbackCalls === 1,
  'Callable remains invocable after round-trip',
)

signalOwner.free()
objectValue.free()

console.log(
  `[godotjs] PHASE3_VARIANT_MATRIX PASS ${String(observedTypes.size)} types`,
)
