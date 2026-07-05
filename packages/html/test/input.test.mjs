import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Input } = await import('../dist/index.js')

function renderInput(props = {}, emitted = []) {
  const render = Input.setup(props, {
    emit: (event, value) => {
      emitted.push([event, value])
    },
  })

  return render()
}

test('Input checkbox maps label, checked state, and updates model value', () => {
  const emitted = []
  const vnode = renderInput(
    {
      type: 'checkbox',
      modelValue: true,
      label: 'Accept terms',
    },
    emitted,
  )

  assert.equal(vnode.type, 'CheckBox')
  assert.equal(vnode.props.button_pressed, true)
  assert.equal(vnode.props.toggle_mode, true)
  assert.equal(vnode.props.text, 'Accept terms')

  vnode.props.onToggled(false)
  assert.deepEqual(emitted, [['update:modelValue', false]])
})

test('Input radio checks against value and emits only when toggled on', () => {
  const emitted = []
  const vnode = renderInput(
    {
      type: 'radio',
      modelValue: 'pro',
      name: 'plan',
      value: 'pro',
      label: 'Pro',
    },
    emitted,
  )

  assert.equal(vnode.type, 'CheckBox')
  assert.equal(vnode.props.button_pressed, true)
  assert.equal(vnode.props.toggle_mode, true)
  assert.equal(vnode.props.text, 'Pro')
  assert.equal(vnode.props.button_group.__kind, 'button-group')

  vnode.props.onToggled(false)
  assert.deepEqual(emitted, [])

  vnode.props.onToggled(true)
  assert.deepEqual(emitted, [['update:modelValue', 'pro']])
})

test('Input radio reuses a ButtonGroup for the same name', () => {
  const first = renderInput({
    type: 'radio',
    modelValue: 'basic',
    name: 'tier',
    value: 'basic',
  })
  const second = renderInput({
    type: 'radio',
    modelValue: 'basic',
    name: 'tier',
    value: 'pro',
  })

  assert.equal(first.props.button_pressed, true)
  assert.equal(second.props.button_pressed, false)
  assert.equal(first.props.button_group, second.props.button_group)
})
