import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Textarea } = await import('../dist/components/Textarea.js')

function renderTextarea(props = {}) {
  const emitted = []
  const render = Textarea.setup(props, {
    emit: (event, ...args) => emitted.push({ event, args }),
    slots: {},
  })

  return { vnode: render(), emitted }
}

test('renders a TextEdit with model value and placeholder', () => {
  const { vnode } = renderTextarea({
    modelValue: 'Line one',
    placeholder: 'Notes...',
  })

  assert.equal(vnode.type, 'TextEdit')
  assert.equal(vnode.props.text, 'Line one')
  assert.equal(vnode.props.placeholder_text, 'Notes...')
})

test('emits model updates from the mounted TextEdit node', () => {
  const { vnode, emitted } = renderTextarea({ modelValue: 'Old value' })

  vnode.props.onVnodeMounted({ el: { text: 'New value' } })
  vnode.props.onTextChanged()

  assert.deepEqual(emitted, [
    { event: 'update:modelValue', args: ['New value'] },
  ])
})

test('suppresses model updates when disabled or readonly', () => {
  const disabled = renderTextarea({ disabled: true })
  const readonly = renderTextarea({ readonly: true })

  disabled.vnode.props.onVnodeMounted({ el: { text: 'Disabled edit' } })
  disabled.vnode.props.onTextChanged()
  readonly.vnode.props.onVnodeMounted({ el: { text: 'Readonly edit' } })
  readonly.vnode.props.onTextChanged()

  assert.equal(disabled.vnode.props.editable, false)
  assert.equal(readonly.vnode.props.editable, false)
  assert.deepEqual(disabled.emitted, [])
  assert.deepEqual(readonly.emitted, [])
})

test('maps rows, cols, style, touch target, and accessibility props', () => {
  const { vnode } = renderTextarea({
    rows: 3,
    cols: 20,
    minTouchTarget: 96,
    title: 'Profile notes',
    style: {
      fontSize: 16,
      color: '#00ff00',
      opacity: 0.5,
      display: 'none',
    },
  })

  assert.equal(vnode.props['custom_minimum_size:x'], 192)
  assert.equal(vnode.props['custom_minimum_size:y'], 96)
  assert.equal(vnode.props.visible, false)
  assert.equal(vnode.props.tooltip_text, 'Profile notes')

  const fontColor = vnode.props['theme_override_colors/font_color']
  assert.equal(fontColor.__mock, true)
  assert.equal(fontColor.__kind, 'color')
  assert.equal(fontColor.g, 1)

  const modulate = vnode.props.modulate
  assert.equal(modulate.__mock, true)
  assert.equal(modulate.__kind, 'color')
  assert.equal(modulate.a, 0.5)
})
