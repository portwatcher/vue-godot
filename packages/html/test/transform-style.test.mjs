import assert from 'node:assert/strict'
import test from 'node:test'
import { register } from 'node:module'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { applyCommonControlStyleProps } = await import(
  '../dist/utils/controlStyle.js'
)
const { resolveTransformStyle } = await import(
  '../dist/utils/transformStyle.js'
)

test('resolves basic CSS transform functions', () => {
  assert.deepEqual(
    resolveTransformStyle(
      'translate(10px, 20px) translateX(5px) scale(2, 0.5) scaleY(3) rotate(90deg)',
    ),
    {
      translateX: 15,
      translateY: 20,
      scaleX: 2,
      scaleY: 1.5,
      rotation: Math.PI / 2,
    },
  )

  assert.deepEqual(resolveTransformStyle('rotate(0.5turn) translateY(-4px)'), {
    translateX: 0,
    translateY: -4,
    scaleX: 1,
    scaleY: 1,
    rotation: Math.PI,
  })
})

test('ignores unsupported or empty transform values', () => {
  assert.equal(resolveTransformStyle(undefined), null)
  assert.equal(resolveTransformStyle('none'), null)
  assert.equal(resolveTransformStyle('matrix(1, 0, 0, 1, 0, 0)'), null)
  assert.equal(resolveTransformStyle('translate(50%)'), null)
})

test('applies basic transform style to Godot control props', () => {
  const props = {
    'position:x': 4,
  }

  applyCommonControlStyleProps(
    props,
    {
      transform: 'translateX(6px) translateY(-3px) scaleX(-1) rotate(3.14159rad)',
    },
    'TransformBox',
  )

  assert.equal(props['position:x'], 10)
  assert.equal(props['position:y'], -3)
  assert.equal(props['scale:x'], -1)
  assert.equal(props.rotation, 3.14159)
})

test('applies percent sizes to Godot control anchors', () => {
  const props = {}

  applyCommonControlStyleProps(
    props,
    {
      width: '75%',
      height: '50%',
    },
    'PercentBox',
  )

  assert.equal(props.anchor_left, 0)
  assert.equal(props.anchor_right, 0.75)
  assert.equal(props.offset_left, 0)
  assert.equal(props.offset_right, 0)
  assert.equal(props.anchor_top, 0)
  assert.equal(props.anchor_bottom, 0.5)
  assert.equal(props.offset_top, 0)
  assert.equal(props.offset_bottom, 0)
})
