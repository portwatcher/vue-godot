import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'
import { h } from '@vue/runtime-core'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { SafeAreaView, Div } = await import('../dist/index.js')
const {
  computeSafeAreaInsets,
} = await import('../dist/utils/safeArea.js')

function setDisplayServerState(state) {
  globalThis.__vueGodotHtmlMockDisplayServer = {
    safeArea: {
      position: { x: 0, y: 0 },
      size: { x: 1000, y: 1000 },
    },
    windowSize: { x: 1000, y: 1000 },
    screenSize: { x: 1000, y: 1000 },
    ...state,
  }
}

function renderSafeAreaView(props = {}, children = []) {
  const render = SafeAreaView.setup(props, {
    slots: {
      default: () => children,
    },
  })

  return render()
}

test('computes insets from Godot safe area and viewport size', () => {
  assert.deepEqual(
    computeSafeAreaInsets(
      {
        position: { x: 12, y: 24 },
        size: { x: 360, y: 700 },
      },
      { x: 390, y: 780 },
    ),
    {
      top: 24,
      right: 18,
      bottom: 56,
      left: 12,
    },
  )
})

test('SafeAreaView applies safe area plus style padding inside background', () => {
  setDisplayServerState({
    safeArea: {
      position: { x: 12, y: 24 },
      size: { x: 360, y: 700 },
    },
    windowSize: { x: 390, y: 780 },
  })

  const child = h('Label', { text: 'Body' })
  const vnode = renderSafeAreaView(
    {
      style: {
        width: 390,
        backgroundColor: '#123456',
        padding: 4,
      },
      contentStyle: {
        flexDirection: 'column',
        gap: 8,
      },
    },
    [child],
  )

  assert.equal(vnode.type, 'PanelContainer')
  assert.equal(vnode.props['custom_minimum_size:x'], 390)
  assert.equal(
    vnode.props['theme_override_styles/panel'].__kind,
    'style-box-flat',
  )

  const margin = vnode.children[0]
  assert.equal(margin.type, 'MarginContainer')
  assert.equal(margin.props['theme_override_constants/margin_top'], 28)
  assert.equal(margin.props['theme_override_constants/margin_right'], 22)
  assert.equal(margin.props['theme_override_constants/margin_bottom'], 60)
  assert.equal(margin.props['theme_override_constants/margin_left'], 16)
  assert.equal(margin.children[0].type, Div)
  assert.deepEqual(margin.children[0].props.style, {
    flexDirection: 'column',
    gap: 8,
  })
  assert.deepEqual(margin.children[0].children, [child])
})

test('SafeAreaView can limit safe area edges and use fallback insets', () => {
  setDisplayServerState({
    safeArea: null,
  })

  const vnode = renderSafeAreaView({
    edges: ['top', 'left'],
    fallbackInsets: {
      top: 10,
      right: 20,
      bottom: 30,
      left: 40,
    },
    style: {
      display: 'none',
      padding: 2,
    },
  })

  assert.equal(vnode.type, 'MarginContainer')
  assert.equal(vnode.props.visible, false)
  assert.equal(vnode.props['theme_override_constants/margin_top'], 12)
  assert.equal(vnode.props['theme_override_constants/margin_right'], 2)
  assert.equal(vnode.props['theme_override_constants/margin_bottom'], 2)
  assert.equal(vnode.props['theme_override_constants/margin_left'], 42)
})
