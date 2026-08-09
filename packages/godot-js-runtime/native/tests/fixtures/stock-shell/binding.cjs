const {
  Array: GodotArray,
  ClassDB,
  Dictionary,
  Vector3,
  typeof: godotTypeof,
  Variant,
} = require('godot')

const vector = new Vector3(3, 4, 5)
const values = new GodotArray([vector])
const dictionary = new Dictionary({ values })

if (!ClassDB.class_exists('Node')) {
  throw new Error('CommonJS ClassDB binding failed')
}
if (dictionary.values !== values || values[0].z !== 5) {
  throw new Error('CommonJS container binding failed')
}
if (godotTypeof(vector) !== Variant.Type.TYPE_VECTOR3) {
  throw new Error('CommonJS utility binding failed')
}

console.log('[godot-js-runtime] PHASE3_COMMONJS_BINDING PASS')
module.exports = { passed: true }
