import assert from 'node:assert/strict'
import test from 'node:test'

import {
  parseColorChannels,
  parseHexColor,
} from '../dist/utils/colorParser.js'

test('parses hex colors including shorthand alpha', () => {
  assert.equal(parseHexColor('#f00'), '1,0,0,1')
  assert.equal(parseHexColor('#00ff0080'), '0,1,0,0.5019607843137255')
  assert.equal(parseHexColor('#0f08'), '0,1,0,0.5333333333333333')
})

test('parses named CSS colors', () => {
  assert.equal(parseHexColor('red'), '1,0,0,1')
  assert.equal(parseHexColor(' RebeccaPurple '), '0.4,0.2,0.6,1')
  assert.equal(parseHexColor('transparent'), '0,0,0,0')
})

test('parses rgb and rgba colors', () => {
  assert.equal(parseHexColor('rgb(255, 128, 0)'), '1,0.5019607843137255,0,1')
  assert.equal(parseHexColor('rgba(255, 0, 0, 0.25)'), '1,0,0,0.25')
  assert.equal(parseHexColor('rgb(100% 0% 50% / 25%)'), '1,0,0.5,0.25')
})

test('parses hsl and hsla colors', () => {
  assert.equal(parseHexColor('hsl(120, 100%, 25%)'), '0,0.5,0,1')
  assert.equal(parseHexColor('hsla(240 100% 50% / 0.5)'), '0,0,1,0.5')
  assert.equal(parseHexColor('hsl(0.5turn 100% 50%)'), '0,1,1,1')
})

test('returns normalized channels for Godot Color construction', () => {
  assert.deepEqual(parseColorChannels('rgba(0, 128, 255, 0.75)'), {
    r: 0,
    g: 0.5019607843137255,
    b: 1,
    a: 0.75,
  })
})

test('rejects unsupported or invalid color values', () => {
  assert.equal(parseHexColor('currentColor'), null)
  assert.equal(parseHexColor('#ggg'), null)
  assert.equal(parseHexColor('rgb(300 0 0)'), null)
  assert.equal(parseHexColor('rgb(0 0 0 / 2)'), null)
  assert.equal(parseHexColor('hsl(0 50 50)'), null)
})
