const {
  Array: GodotArray,
  ClassDB,
  Dictionary,
  Node,
  Vector3,
  typeof: godotTypeof,
  Variant,
} = require('godot')
const compatibility = require('godot-jsb')

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
if (
  compatibility.impl !== 'QuickJS-ng' ||
  compatibility.callable(() => 17).call() !== 17
) {
  throw new Error('CommonJS godot-jsb compatibility failed')
}

console.log('[godotjs] PHASE3_COMMONJS_BINDING PASS')
module.exports = class CommonJsBindingProbe extends Node {}
