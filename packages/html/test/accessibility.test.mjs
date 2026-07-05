import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { A, Button, Img, Input, Pressable } = await import('../dist/index.js')
const { resolveAccessibilityTooltipText } = await import(
  '../dist/utils/accessibility.js'
)

function renderA(props = {}, children = []) {
  const render = A.setup(props, {
    emit: () => {},
    slots: {
      default: () => children,
    },
  })

  return render()
}

function renderButton(props = {}, children = []) {
  const render = Button.setup(props, {
    emit: () => {},
    slots: {
      default: () => children,
    },
  })

  return render()
}

function renderInput(props = {}) {
  const render = Input.setup(props, {
    emit: () => {},
  })

  return render()
}

function renderImg(props = {}) {
  const render = Img.setup(props)

  return render()
}

function renderPressable(props = {}) {
  const render = Pressable.setup(props, {
    emit: () => {},
    slots: {
      default: () => [],
    },
  })

  return render()
}

test('resolves accessibility labels and hints into tooltip text', () => {
  assert.equal(
    resolveAccessibilityTooltipText({
      accessibilityLabel: 'Save',
      accessibilityHint: 'Writes changes',
    }),
    'Save\nWrites changes',
  )
  assert.equal(
    resolveAccessibilityTooltipText(
      {
        ariaLabel: 'Ignored',
        'aria-label': 'Also ignored',
      },
      { label: 'Fallback' },
    ),
    'Ignored',
  )
  assert.equal(
    resolveAccessibilityTooltipText(
      {
        title: 'Fallback title',
      },
      { hint: 'Fallback hint' },
    ),
    'Fallback title',
  )
})

test('Button maps aria-label and hint props to tooltip_text', () => {
  const vnode = renderButton(
    {
      'aria-label': 'Save changes',
      accessibilityHint: 'Press to write settings',
    },
    ['Save'],
  )

  assert.equal(vnode.props.tooltip_text, 'Save changes\nPress to write settings')
})

test('Input and Pressable map accessibility metadata to tooltip_text', () => {
  const input = renderInput({
    type: 'range',
    accessibilityLabel: 'Volume',
    title: 'Use left and right to adjust',
  })
  const pressable = renderPressable({
    accessibilityLabel: 'Inventory item',
    accessibilityHint: 'Press to equip',
  })

  assert.equal(input.type, 'HSlider')
  assert.equal(input.props.tooltip_text, 'Volume\nUse left and right to adjust')
  assert.equal(pressable.type, 'PanelContainer')
  assert.equal(pressable.props.tooltip_text, 'Inventory item\nPress to equip')
})

test('A preserves href fallback tooltip and explicit accessibility override', () => {
  const linked = renderA({ href: 'https://godotengine.org' }, ['Godot'])
  const labeled = renderA(
    {
      href: 'https://godotengine.org',
      accessibilityLabel: 'Godot website',
    },
    ['Godot'],
  )
  const disabled = renderA(
    {
      href: 'https://godotengine.org',
      disabled: true,
    },
    ['Godot'],
  )

  assert.equal(linked.props.tooltip_text, 'https://godotengine.org')
  assert.equal(
    labeled.props.tooltip_text,
    'Godot website\nhttps://godotengine.org',
  )
  assert.equal('tooltip_text' in disabled.props, false)
})

test('Img uses alt text as accessibility fallback label', () => {
  const plain = renderImg({ alt: 'Status chart' })
  const hinted = renderImg({
    alt: 'Status chart',
    accessibilityHint: 'Shows the latest score',
  })

  assert.equal(plain.props.tooltip_text, 'Status chart')
  assert.equal(hinted.props.tooltip_text, 'Status chart\nShows the latest score')
})
