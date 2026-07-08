import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const {
  clearHtmlCssWarningsForTests,
  createHtmlStyleContext,
  createHtmlStyleSheet,
  defineHtmlTheme,
  normalizeHtmlClassList,
  resolveHtmlComponentStyle,
} = await import('../dist/index.js')

test('normalizes string, array, and object class inputs', () => {
  assert.deepEqual(
    normalizeHtmlClassList('card primary', ['primary', { disabled: false }], {
      selected: true,
    }),
    ['card', 'primary', 'selected'],
  )
})

test('resolves theme defaults, stylesheet rules, state rules, and inline overrides', () => {
  const theme = defineHtmlTheme({
    tokens: {
      color: {
        primary: '#2563eb',
      },
    },
    components: {
      Button: {
        base: {
          minHeight: 44,
          color: '#111827',
        },
        states: {
          disabled: {
            opacity: 0.5,
          },
        },
      },
    },
  })
  const stylesheet = createHtmlStyleSheet(`
    :root {
      --button-bg: var(--color-primary);
      --button-radius: 8px;
    }

    Button {
      background-color: #f8fafc;
      border-radius: 4px;
    }

    .primary {
      background-color: var(--button-bg);
      border-radius: var(--button-radius);
    }

    button.primary:hover {
      opacity: 0.8;
      background-color: #1d4ed8;
    }
  `)
  const context = createHtmlStyleContext({
    theme,
    stylesheets: [stylesheet],
  })

  const resolved = resolveHtmlComponentStyle(context, {
    componentName: 'Button',
    class: ['primary'],
    inlineStyle: {
      opacity: 1,
    },
    state: {
      hover: true,
    },
  })

  assert.deepEqual(resolved.classList, ['primary'])
  assert.equal(resolved.style.minHeight, 44)
  assert.equal(resolved.style.color, '#111827')
  assert.equal(resolved.style.backgroundColor, '#1d4ed8')
  assert.equal(resolved.style.borderRadius, 8)
  assert.equal(resolved.style.opacity, 1)
  assert.equal(resolved.stateStyles.hover.backgroundColor, '#1d4ed8')
  assert.equal(resolved.stateStyles.hover.opacity, 1)
})

test('default style presets are opt-in and inline style remains strongest', () => {
  const none = resolveHtmlComponentStyle(createHtmlStyleContext(), {
    componentName: 'Button',
  })
  assert.equal(none.style, undefined)

  const native = resolveHtmlComponentStyle(
    createHtmlStyleContext({ defaultStyles: 'native-app' }),
    {
      componentName: 'Button',
      inlineStyle: {
        backgroundColor: '#000000',
      },
    },
  )

  assert.equal(native.style.minHeight, 44)
  assert.equal(native.style.backgroundColor, '#000000')
  assert.equal(native.style.borderRadius, 8)
})

test('unsupported CSS diagnostics warn once and unsupported properties are omitted', () => {
  clearHtmlCssWarningsForTests()
  const warnings = []
  const originalWarn = console.warn
  console.warn = (message) => {
    warnings.push(String(message))
  }

  try {
    const stylesheet = createHtmlStyleSheet(
      `
        .toolbar > Button { color: red; }
        .card {
          position: sticky;
          padding: 12px;
        }
      `,
      { source: 'app.css' },
    )
    const context = createHtmlStyleContext({ stylesheets: [stylesheet] })

    const first = resolveHtmlComponentStyle(context, {
      componentName: 'Div',
      class: 'card',
    })
    const second = resolveHtmlComponentStyle(context, {
      componentName: 'Div',
      class: 'card',
    })

    assert.equal(first.style.padding, 12)
    assert.equal(first.style.position, undefined)
    assert.equal(second.style.padding, 12)
    assert.equal(warnings.length, 2)
    assert.match(warnings[0], /Unsupported selector/)
    assert.match(warnings[1], /Unsupported property "position"/)
  } finally {
    console.warn = originalWarn
    clearHtmlCssWarningsForTests()
  }
})
