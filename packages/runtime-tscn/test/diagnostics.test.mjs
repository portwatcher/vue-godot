import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-loader.mjs', import.meta.url).href)

const [{ nodeOps }, { patchProp }, { ClassDB, Node }] = await Promise.all([
  import('../dist/nodeOps.js'),
  import('../dist/patchProp.js'),
  import('godot'),
])

function captureWarnings(run) {
  const warnings = []
  const originalWarn = console.warn
  console.warn = (...args) => {
    warnings.push(args)
  }

  try {
    run()
  } finally {
    console.warn = originalWarn
  }

  return warnings
}

test('warns when a Vue tag cannot be instantiated as a Godot class', () => {
  ClassDB.supportedTags = new Set(['Label'])

  try {
    const warnings = captureWarnings(() => {
      const node = nodeOps.createElement('MissingPanel', false, false, null)
      assert.equal(node.constructor.name, 'Node')
    })

    assert.equal(warnings.length, 1)
    assert.match(String(warnings[0][0]), /Unsupported Godot node class "MissingPanel"/)
    assert.match(String(warnings[0][0]), /Falling back to a generic Node/)
    assert.match(String(warnings[0][0]), /ClassDB availability/)
  } finally {
    ClassDB.reset()
  }
})

test('warns with node and Vue event prop when signal connection fails', () => {
  const node = new Node('Button')
  node.connect = () => {
    throw new Error('unsupported signal pressed')
  }

  const warnings = captureWarnings(() => {
    patchProp(node, 'onPressed', undefined, () => undefined)
  })

  assert.equal(warnings.length, 1)
  assert.match(String(warnings[0][0]), /Unable to connect signal "pressed" on Button/)
  assert.match(String(warnings[0][0]), /Vue event prop "onPressed"/)
  assert.match(String(warnings[0][0]), /expected Godot signal/)
  assert.match(warnings[0][1].message, /unsupported signal pressed/)
})
