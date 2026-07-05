import assert from 'node:assert/strict'
import test from 'node:test'
import { register } from 'node:module'
import { h } from '@vue/runtime-core'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { A } = await import('../dist/components/A.js')
const {
  clearFontFamilyRegistryForTests,
  clearFontLoaderCacheForTests,
  registerFontFamily,
} = await import('../dist/utils/fontLoader.js')

test.beforeEach(() => {
  clearFontFamilyRegistryForTests()
  clearFontLoaderCacheForTests()
})

function renderA(props = {}, slotChildren = []) {
  const emitted = []
  const render = A.setup(props, {
    emit: (event, ...args) => emitted.push({ event, args }),
    slots: {
      default: () => slotChildren,
    },
  })

  return { vnode: render(), emitted }
}

test('renders a Godot LinkButton with text and href uri', () => {
  const { vnode } = renderA({ href: 'https://example.com' }, [
    h('span', null, 'Example'),
  ])

  assert.equal(vnode.type, 'LinkButton')
  assert.equal(vnode.props.text, 'Example')
  assert.equal(vnode.props.uri, 'https://example.com')
  assert.equal(vnode.props.tooltip_text, 'https://example.com')
})

test('does not set uri when disabled', () => {
  const { vnode } = renderA({ href: 'https://example.com', disabled: true }, [
    'Disabled',
  ])

  assert.equal(vnode.props.disabled, true)
  assert.equal(vnode.props.uri, undefined)
})

test('accepts target as a browser-compatibility prop without mapping it to Godot', () => {
  const { vnode } = renderA(
    {
      href: 'https://example.com',
      target: '_blank',
    },
    ['External'],
  )

  assert.equal(vnode.props.uri, 'https://example.com')
  assert.equal('target' in vnode.props, false)
})

test('forwards pressed signal as click event', () => {
  const { vnode, emitted } = renderA({}, ['Click'])

  vnode.props.onPressed()

  assert.deepEqual(emitted, [{ event: 'click', args: [] }])
})

test('maps common text control styles', () => {
  registerFontFamily('Demo Sans', './fonts/DemoSans.ttf')
  const { vnode } = renderA(
    {
      style: {
        width: '120px',
        height: '32px',
        fontFamily: 'Demo Sans, sans-serif',
        fontSize: 18,
        color: '#ff0000',
        opacity: 0.5,
      },
    },
    ['Styled'],
  )

  assert.equal(vnode.props['custom_minimum_size:x'], 120)
  assert.equal(vnode.props['custom_minimum_size:y'], 32)
  assert.equal(
    vnode.props['theme_override_fonts/font'].path,
    'res://fonts/DemoSans.ttf',
  )
  assert.equal(vnode.props['theme_override_font_sizes/font_size'], 18)
  const fontColor = vnode.props['theme_override_colors/font_color']
  assert.equal(fontColor.__mock, true)
  assert.equal(fontColor.__kind, 'color')
  assert.equal(fontColor.r, 1)
  assert.equal(fontColor.g, 0)
  assert.equal(fontColor.b, 0)
  assert.equal(fontColor.a, 1)
  const modulate = vnode.props.modulate
  assert.equal(modulate.__mock, true)
  assert.equal(modulate.__kind, 'color')
  assert.equal(modulate.r, 1)
  assert.equal(modulate.g, 1)
  assert.equal(modulate.b, 1)
  assert.equal(modulate.a, 0.5)
})

test('accepts CSS color formats for text control color', () => {
  const { vnode } = renderA(
    {
      style: {
        color: 'rgb(0 128 255 / 50%)',
      },
    },
    ['Styled'],
  )

  const fontColor = vnode.props['theme_override_colors/font_color']
  assert.equal(fontColor.__mock, true)
  assert.equal(fontColor.__kind, 'color')
  assert.equal(fontColor.r, 0)
  assert.equal(fontColor.g, 0.5019607843137255)
  assert.equal(fontColor.b, 1)
  assert.equal(fontColor.a, 0.5)
})

test('maps bold fontWeight to a Godot FontVariation override', () => {
  const { vnode } = renderA(
    {
      style: {
        fontWeight: 'bold',
      },
    },
    ['Bold'],
  )

  const font = vnode.props['theme_override_fonts/font']
  assert.equal(font.__mock, true)
  assert.equal(font.__kind, 'font-variation')
  assert.equal(font.variation_embolden, 0.7)
})

test('does not emit a font override for normal fontWeight', () => {
  const { vnode } = renderA(
    {
      style: {
        fontWeight: 'normal',
      },
    },
    ['Normal'],
  )

  assert.equal('theme_override_fonts/font' in vnode.props, false)
})
