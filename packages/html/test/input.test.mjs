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

test('Input text maps value, placeholder, max length, style, and updates', () => {
  const emitted = []
  const vnode = renderInput(
    {
      type: 'text',
      modelValue: 'Ada',
      placeholder: 'Your name',
      maxLength: 32,
      minTouchTarget: 64,
      title: 'Name input',
      style: `
        width: 120px;
        height: 24px;
        color: #ff0000;
        opacity: 0.5;
        display: none;
      `,
    },
    emitted,
  )

  assert.equal(vnode.type, 'LineEdit')
  assert.equal(vnode.props.text, 'Ada')
  assert.equal(vnode.props.placeholder_text, 'Your name')
  assert.equal(vnode.props.max_length, 32)
  assert.equal(vnode.props['custom_minimum_size:x'], 120)
  assert.equal(vnode.props['custom_minimum_size:y'], 64)
  assert.equal(vnode.props.visible, false)
  assert.equal(vnode.props.tooltip_text, 'Name input')

  const fontColor = vnode.props['theme_override_colors/font_color']
  assert.equal(fontColor.__mock, true)
  assert.equal(fontColor.__kind, 'color')
  assert.equal(fontColor.r, 1)

  const modulate = vnode.props.modulate
  assert.equal(modulate.__mock, true)
  assert.equal(modulate.__kind, 'color')
  assert.equal(modulate.a, 0.5)

  vnode.props.onTextChanged('Grace')
  assert.deepEqual(emitted, [['update:modelValue', 'Grace']])
})

test('Input password enables secret mode and readonly suppresses updates', () => {
  const emitted = []
  const vnode = renderInput(
    {
      type: 'password',
      modelValue: 'secret',
      placeholder: 'Password',
      readonly: true,
    },
    emitted,
  )

  assert.equal(vnode.type, 'LineEdit')
  assert.equal(vnode.props.text, 'secret')
  assert.equal(vnode.props.secret, true)
  assert.equal(vnode.props.placeholder_text, 'Password')
  assert.equal(vnode.props.editable, false)

  vnode.props.onTextChanged('changed')
  assert.deepEqual(emitted, [])
})

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

test('Input range maps value, bounds, step, and updates model value', () => {
  const emitted = []
  const vnode = renderInput(
    {
      type: 'range',
      modelValue: 25,
      min: 0,
      max: 100,
      step: 5,
    },
    emitted,
  )

  assert.equal(vnode.type, 'HSlider')
  assert.equal(vnode.props.value, 25)
  assert.equal(vnode.props.min_value, 0)
  assert.equal(vnode.props.max_value, 100)
  assert.equal(vnode.props.step, 5)

  vnode.props.onValueChanged(30)
  assert.deepEqual(emitted, [['update:modelValue', 30]])
})

test('Input disabled controls suppress model updates', () => {
  const emitted = []
  const text = renderInput({ type: 'text', disabled: true }, emitted)
  const checkbox = renderInput({ type: 'checkbox', disabled: true }, emitted)
  const radio = renderInput(
    { type: 'radio', disabled: true, value: 'pro' },
    emitted,
  )
  const range = renderInput({ type: 'range', disabled: true }, emitted)

  assert.equal(text.props.editable, false)
  assert.equal(checkbox.props.disabled, true)
  assert.equal(radio.props.disabled, true)
  assert.equal(range.props.disabled, true)

  text.props.onTextChanged('ignored')
  checkbox.props.onToggled(true)
  radio.props.onToggled(true)
  range.props.onValueChanged(42)

  assert.deepEqual(emitted, [])
})

test('Input falls back unsupported types to text behavior', () => {
  const emitted = []
  const vnode = renderInput(
    {
      type: 'email',
      modelValue: 'ada@example.com',
      placeholder: 'Email',
      maxLength: 64,
    },
    emitted,
  )

  assert.equal(vnode.type, 'LineEdit')
  assert.equal(vnode.props.text, 'ada@example.com')
  assert.equal(vnode.props.placeholder_text, 'Email')
  assert.equal(vnode.props.max_length, 64)

  vnode.props.onTextChanged('grace@example.com')
  assert.deepEqual(emitted, [['update:modelValue', 'grace@example.com']])
})
