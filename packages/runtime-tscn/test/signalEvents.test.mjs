import test from 'node:test'
import assert from 'node:assert/strict'

import {
  patchSignalHandlers,
  vueEventKeyToGodotSignalName,
} from '../dist/signalEvents.js'

function createHarness() {
  let nextCallableId = 1
  const active = new Map()
  const calls = []
  const target = {}

  const ops = {
    createCallable(_target, handler) {
      return { id: nextCallableId++, handler }
    },
    connect(_target, signalName, callable) {
      const bySignal = active.get(signalName) ?? new Set()
      if (bySignal.has(callable)) {
        throw new Error(`duplicate callable connect: ${callable.id}`)
      }
      bySignal.add(callable)
      active.set(signalName, bySignal)
      calls.push({ type: 'connect', signalName, callableId: callable.id })
    },
    disconnect(_target, signalName, callable) {
      const bySignal = active.get(signalName)
      assert.ok(bySignal?.has(callable), `missing callable ${callable.id}`)
      bySignal.delete(callable)
      calls.push({ type: 'disconnect', signalName, callableId: callable.id })
    },
  }

  return { target, ops, calls, active }
}

test('normalizes Vue event prop keys to Godot snake_case signals', () => {
  assert.equal(vueEventKeyToGodotSignalName('onPressed'), 'pressed')
  assert.equal(vueEventKeyToGodotSignalName('onTextChanged'), 'text_changed')
  assert.equal(vueEventKeyToGodotSignalName('onTreeExiting'), 'tree_exiting')
  assert.equal(vueEventKeyToGodotSignalName('onURLChanged'), 'url_changed')
})

test('supports replacing and removing a single handler using stored callables', () => {
  const { target, ops, calls } = createHarness()
  const handlerA = () => {}
  const handlerB = () => {}

  patchSignalHandlers(target, 'onTextChanged', handlerA, ops)
  patchSignalHandlers(target, 'onTextChanged', handlerB, ops)
  patchSignalHandlers(target, 'onTextChanged', null, ops)

  assert.deepEqual(calls, [
    { type: 'connect', signalName: 'text_changed', callableId: 1 },
    { type: 'disconnect', signalName: 'text_changed', callableId: 1 },
    { type: 'connect', signalName: 'text_changed', callableId: 2 },
    { type: 'disconnect', signalName: 'text_changed', callableId: 2 },
  ])
})

test('supports arrays of handlers and avoids duplicate live connections across updates', () => {
  const { target, ops, calls, active } = createHarness()
  const a = () => {}
  const b = () => {}
  const c = () => {}

  patchSignalHandlers(target, 'onTextChanged', [a, b], ops)
  assert.equal(active.get('text_changed')?.size, 2)

  patchSignalHandlers(target, 'onTextChanged', [b, c], ops)
  assert.equal(active.get('text_changed')?.size, 2)

  patchSignalHandlers(target, 'onTextChanged', undefined, ops)
  assert.equal(active.get('text_changed')?.size ?? 0, 0)

  assert.deepEqual(
    calls.map((call) => `${call.type}:${call.signalName}:${call.callableId}`),
    [
      'connect:text_changed:1',
      'connect:text_changed:2',
      'disconnect:text_changed:1',
      'disconnect:text_changed:2',
      'connect:text_changed:3',
      'connect:text_changed:4',
      'disconnect:text_changed:3',
      'disconnect:text_changed:4',
    ],
  )
})

