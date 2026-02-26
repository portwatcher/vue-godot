import test from 'node:test'
import assert from 'node:assert/strict'

import { patchGodotProperty } from '../dist/propertyPatch.js'

function createTarget(initial = {}) {
  const state = { ...initial }
  const calls = []

  return {
    state,
    calls,
    target: {
      has_method(name) {
        return name === 'set' || name === 'get'
      },
      get(key) {
        calls.push({ type: 'get', key, value: state[key] })
        return state[key]
      },
      set(key, value) {
        calls.push({ type: 'set', key, value })
        state[key] = value
      },
    },
  }
}

test('restores cached initial value when prop is removed with undefined', () => {
  const { target, state, calls } = createTarget({ visible: true })
  const warnings = []

  patchGodotProperty(target, 'visible', false, (message) => warnings.push(message))
  patchGodotProperty(target, 'visible', undefined, (message) => warnings.push(message))

  assert.equal(state.visible, true)
  assert.deepEqual(calls, [
    { type: 'get', key: 'visible', value: true },
    { type: 'set', key: 'visible', value: false },
    { type: 'set', key: 'visible', value: true },
  ])
  assert.deepEqual(warnings, [])
})

test('restores cached initial value when prop is removed with null', () => {
  const { target, state } = createTarget({ modulate: 'white' })

  patchGodotProperty(target, 'modulate', 'red')
  patchGodotProperty(target, 'modulate', null)

  assert.equal(state.modulate, 'white')
})

test('warns and skips reset when no cached default is available', () => {
  const calls = []
  const target = {
    has_method(name) {
      return name === 'set'
    },
    set(key, value) {
      calls.push({ key, value })
    },
  }
  const warnings = []

  patchGodotProperty(target, 'position', undefined, (message) => warnings.push(message))

  assert.deepEqual(calls, [])
  assert.equal(warnings.length, 1)
  assert.match(warnings[0], /Unable to reset prop "position"/)
})

