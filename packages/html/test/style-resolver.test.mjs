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
  refreshHtmlStyleContextViewport,
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

test('resolves supported media query rules from viewport buckets', () => {
  const stylesheet = createHtmlStyleSheet(`
    .card {
      flex-direction: column;
      gap: 8px;
      padding: 20px;
    }

    @media (max-width: 480px) {
      .card {
        padding: 12px;
      }
    }

    @media screen and (min-width: 700px) and (orientation: landscape) {
      .card {
        flex-direction: row;
        gap: 16px;
      }
    }

    @media (min-height: 900px) {
      .card {
        min-height: 700px;
      }
    }
  `)
  const context = createHtmlStyleContext({
    stylesheets: [stylesheet],
    viewport: {
      width: 800,
      height: 600,
    },
  })

  const landscape = resolveHtmlComponentStyle(context, {
    componentName: 'Div',
    class: 'card',
  })

  assert.equal(landscape.style.flexDirection, 'row')
  assert.equal(landscape.style.gap, 16)
  assert.equal(landscape.style.padding, 20)
  assert.equal(landscape.style.minHeight, undefined)

  refreshHtmlStyleContextViewport(context, {
    width: 420,
    height: 800,
  })
  const phone = resolveHtmlComponentStyle(context, {
    componentName: 'Div',
    class: 'card',
  })

  assert.equal(phone.style.flexDirection, 'column')
  assert.equal(phone.style.gap, 8)
  assert.equal(phone.style.padding, 12)
  assert.equal(phone.style.minHeight, undefined)

  const phoneBucket = context.viewport.value
  refreshHtmlStyleContextViewport(context, {
    width: 430,
    height: 820,
  })
  assert.equal(context.viewport.value, phoneBucket)

  refreshHtmlStyleContextViewport(context, {
    width: 430,
    height: 920,
  })
  const tallPhone = resolveHtmlComponentStyle(context, {
    componentName: 'Div',
    class: 'card',
  })

  assert.equal(tallPhone.style.padding, 12)
  assert.equal(tallPhone.style.minHeight, 700)
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

test('unsupported media queries warn once and are omitted', () => {
  clearHtmlCssWarningsForTests()
  const warnings = []
  const originalWarn = console.warn
  console.warn = (message) => {
    warnings.push(String(message))
  }

  try {
    const stylesheet = createHtmlStyleSheet(
      `
        @media (prefers-color-scheme: dark) {
          .card {
            padding: 24px;
          }
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

    assert.equal(first.style, undefined)
    assert.equal(second.style, undefined)
    assert.equal(warnings.length, 1)
    assert.match(warnings[0], /Unsupported media feature "prefers-color-scheme"/)
  } finally {
    console.warn = originalWarn
    clearHtmlCssWarningsForTests()
  }
})
