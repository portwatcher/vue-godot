import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'
import { h } from '@vue/runtime-core'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Span } = await import('../dist/components/Span.js')

function renderSpan(props = {}, children = []) {
  const render = Span.setup(props, {
    slots: {
      default: () => children,
    },
  })

  return render()
}

test('renders a Label with flattened slot text', () => {
  const vnode = renderSpan({}, [
    h('span', null, ['Hello ', h('strong', null, 'Godot')]),
    h('span', null, '!'),
  ])

  assert.equal(vnode.type, 'Label')
  assert.equal(vnode.props.text, 'Hello Godot!')
})

test('maps text style, sizing, visibility, and opacity props', () => {
  const vnode = renderSpan(
    {
      style: `
        font-size: 20px;
        font-weight: bold;
        color: #336699;
        text-align: right;
        text-transform: uppercase;
        overflow-wrap: break-word;
        overflow: hidden;
        width: 150px;
        height: 24px;
        display: none;
        opacity: 0.4;
      `,
    },
    [h('span', null, 'Styled text')],
  )

  assert.equal(vnode.props['theme_override_font_sizes/font_size'], 20)
  assert.equal(vnode.props['theme_override_fonts/font'].__kind, 'font-variation')
  assert.equal(vnode.props.horizontal_alignment, 2)
  assert.equal(vnode.props.uppercase, true)
  assert.equal(vnode.props.autowrap_mode, 3)
  assert.equal(vnode.props.clip_text, true)
  assert.equal(vnode.props['custom_minimum_size:x'], 150)
  assert.equal(vnode.props['custom_minimum_size:y'], 24)
  assert.equal(vnode.props.visible, false)

  const fontColor = vnode.props['theme_override_colors/font_color']
  assert.equal(fontColor.__mock, true)
  assert.equal(fontColor.__kind, 'color')
  assert.equal(fontColor.r, 0.2)
  assert.equal(fontColor.g, 0.4)
  assert.equal(fontColor.b, 0.6)

  const modulate = vnode.props.modulate
  assert.equal(modulate.__mock, true)
  assert.equal(modulate.__kind, 'color')
  assert.equal(modulate.a, 0.4)
})

test('maps accessibility labels and hints to tooltip text', () => {
  const vnode = renderSpan({
    'aria-label': 'Status',
    accessibilityHint: 'Updated automatically',
  })

  assert.equal(vnode.props.tooltip_text, 'Status\nUpdated automatically')
})
