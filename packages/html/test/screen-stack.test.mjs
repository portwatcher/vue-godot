import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'
import { h } from '@vue/runtime-core'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Div, Screen, ScreenStack } = await import('../dist/index.js')

function defaultSlotChildren(vnode) {
  return typeof vnode.children?.default === 'function'
    ? vnode.children.default()
    : vnode.children
}

function renderScreen(props = {}, children = []) {
  const render = Screen.setup(props, {
    slots: {
      default: () => children,
    },
  })

  return render()
}

function createScreenStackRenderer(props = {}, slots = {}, emitted = []) {
  const render = ScreenStack.setup(props, {
    slots,
    emit: (event, value) => {
      emitted.push(value === undefined ? [event] : [event, value])
    },
  })

  return render
}

test('Screen renders a full-parent Control with column content by default', () => {
  const child = h('Label', { text: 'Home' })
  const vnode = renderScreen(
    {
      style: {
        width: 320,
        height: 180,
        opacity: 0.75,
      },
      contentStyle: {
        gap: 8,
      },
    },
    [child],
  )

  assert.equal(vnode.type, 'Control')
  assert.equal(vnode.props.visible, true)
  assert.equal(vnode.props.anchor_right, 1)
  assert.equal(vnode.props.anchor_bottom, 1)
  assert.equal(vnode.props.offset_left, 0)
  assert.equal(vnode.props.offset_top, 0)
  assert.equal(vnode.props.offset_right, 0)
  assert.equal(vnode.props.offset_bottom, 0)
  assert.equal(vnode.props['custom_minimum_size:x'], 320)
  assert.equal(vnode.props['custom_minimum_size:y'], 180)
  assert.equal(vnode.props.modulate.__kind, 'color')
  assert.equal(vnode.props.modulate.a, 0.75)
  assert.equal(vnode.children[0].type, Div)
  assert.deepEqual(vnode.children[0].props.style, {
    flexDirection: 'column',
    gap: 8,
  })
  assert.deepEqual(defaultSlotChildren(vnode.children[0]), [child])
})

test('Screen supports background panels, hidden state, and non-full layout', () => {
  const vnode = renderScreen({
    visible: false,
    fullRect: false,
    style: {
      backgroundColor: '#111827',
    },
  })

  assert.equal(vnode.type, 'PanelContainer')
  assert.equal(vnode.props.visible, false)
  assert.equal(vnode.props.anchor_right, undefined)
  assert.equal(
    vnode.props['theme_override_styles/panel'].__kind,
    'style-box-flat',
  )
})

test('ScreenStack renders the active named route slot with navigation props', () => {
  const emitted = []
  const routes = [
    { name: 'home', title: 'Home' },
    { name: 'settings', title: 'Settings' },
  ]
  let slotProps = null
  const render = createScreenStackRenderer(
    {
      routes,
      initialRouteName: 'home',
      fullRect: false,
      style: {
        backgroundColor: '#0f172a',
      },
      contentStyle: {
        gap: 6,
      },
    },
    {
      home: (props) => {
        slotProps = props
        return [h('Label', { text: props.route.title })]
      },
      settings: (props) => {
        slotProps = props
        return [h('Label', { text: props.route.title })]
      },
    },
    emitted,
  )

  let vnode = render()
  let screenChildren = defaultSlotChildren(vnode)

  assert.equal(vnode.type, Screen)
  assert.equal(slotProps.routeName, 'home')
  assert.equal(slotProps.index, 0)
  assert.equal(slotProps.canGoBack, false)
  assert.equal(vnode.props.fullRect, false)
  assert.deepEqual(vnode.props.style, { backgroundColor: '#0f172a' })
  assert.deepEqual(vnode.props.contentStyle, { gap: 6 })
  assert.equal(screenChildren[0].props.text, 'Home')

  slotProps.navigate('settings')
  vnode = render()
  screenChildren = defaultSlotChildren(vnode)

  assert.equal(slotProps.routeName, 'settings')
  assert.equal(slotProps.index, 1)
  assert.equal(slotProps.canGoBack, true)
  assert.equal(screenChildren[0].props.text, 'Settings')
  assert.deepEqual(emitted, [
    ['update:modelValue', 'settings'],
    ['navigate', routes[1]],
  ])

  slotProps.back()
  vnode = render()
  screenChildren = defaultSlotChildren(vnode)

  assert.equal(slotProps.routeName, 'home')
  assert.equal(slotProps.canGoBack, false)
  assert.equal(screenChildren[0].props.text, 'Home')
  assert.deepEqual(emitted.slice(2), [
    ['update:modelValue', 'home'],
    ['back', routes[0]],
  ])
})

test('ScreenStack falls back to default slot and ignores unknown routes', () => {
  const emitted = []
  const routes = [{ name: 'home' }]
  let slotProps = null
  const render = createScreenStackRenderer(
    {
      routes,
      modelValue: 'missing',
    },
    {
      default: (props) => {
        slotProps = props
        return [h('Label', { text: props.routeName })]
      },
    },
    emitted,
  )

  let vnode = render()
  let screenChildren = defaultSlotChildren(vnode)

  assert.equal(slotProps.routeName, 'home')
  assert.equal(screenChildren[0].props.text, 'home')

  slotProps.navigate('missing')
  vnode = render()
  screenChildren = defaultSlotChildren(vnode)

  assert.equal(slotProps.routeName, 'home')
  assert.equal(screenChildren[0].props.text, 'home')
  assert.deepEqual(emitted, [])
})
