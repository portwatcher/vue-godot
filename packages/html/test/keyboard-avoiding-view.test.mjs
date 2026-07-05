import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'
import { h } from '@vue/runtime-core'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Div, KeyboardAvoidingView } = await import('../dist/index.js')
const {
  resolveKeyboardAvoidanceHeight,
} = await import('../dist/utils/keyboardAvoiding.js')

function setDisplayServerState(state) {
  globalThis.__vueGodotHtmlMockDisplayServer = {
    safeArea: {
      position: { x: 0, y: 0 },
      size: { x: 1000, y: 1000 },
    },
    windowSize: { x: 1000, y: 1000 },
    screenSize: { x: 1000, y: 1000 },
    virtualKeyboardHeight: 0,
    ...state,
  }
}

function renderKeyboardAvoidingView(props = {}, children = []) {
  const render = KeyboardAvoidingView.setup(props, {
    slots: {
      default: () => children,
    },
  })

  return render()
}

test('resolves keyboard avoidance height with offset and enabled state', () => {
  assert.equal(resolveKeyboardAvoidanceHeight(320, 20, true), 300)
  assert.equal(resolveKeyboardAvoidanceHeight(20, 80, true), 0)
  assert.equal(resolveKeyboardAvoidanceHeight(320, 20, false), 0)
})

test('KeyboardAvoidingView adds keyboard height to bottom padding by default', () => {
  setDisplayServerState({
    virtualKeyboardHeight: 320,
  })

  const child = h('LineEdit', { text: 'name' })
  const vnode = renderKeyboardAvoidingView(
    {
      keyboardVerticalOffset: 20,
      style: {
        width: 360,
        backgroundColor: '#0f172a',
        padding: 6,
      },
      contentStyle: {
        flexDirection: 'column',
        gap: 8,
      },
    },
    [child],
  )

  assert.equal(vnode.type, 'PanelContainer')
  assert.equal(vnode.props['custom_minimum_size:x'], 360)
  assert.equal(
    vnode.props['theme_override_styles/panel'].__kind,
    'style-box-flat',
  )

  const margin = vnode.children[0]
  assert.equal(margin.type, 'MarginContainer')
  assert.equal(margin.props['theme_override_constants/margin_top'], 6)
  assert.equal(margin.props['theme_override_constants/margin_right'], 6)
  assert.equal(margin.props['theme_override_constants/margin_bottom'], 306)
  assert.equal(margin.props['theme_override_constants/margin_left'], 6)
  assert.equal(margin.children[0].type, Div)
  assert.deepEqual(margin.children[0].props.style, {
    flexDirection: 'column',
    gap: 8,
  })
  assert.deepEqual(margin.children[0].children, [child])
})

test('KeyboardAvoidingView can shift the view for position behavior', () => {
  setDisplayServerState({
    virtualKeyboardHeight: null,
  })

  const vnode = renderKeyboardAvoidingView({
    behavior: 'position',
    fallbackKeyboardHeight: 80,
    keyboardVerticalOffset: 10,
    style: {
      paddingBottom: 4,
    },
  })

  assert.equal(vnode.type, 'MarginContainer')
  assert.equal(vnode.props['position:y'], -70)
  assert.equal(vnode.props['theme_override_constants/margin_top'], 0)
  assert.equal(vnode.props['theme_override_constants/margin_right'], 0)
  assert.equal(vnode.props['theme_override_constants/margin_bottom'], 4)
  assert.equal(vnode.props['theme_override_constants/margin_left'], 0)
})

test('KeyboardAvoidingView can shrink an explicit height', () => {
  setDisplayServerState({
    virtualKeyboardHeight: 120,
  })

  const vnode = renderKeyboardAvoidingView({
    behavior: 'height',
    style: {
      height: 400,
      padding: 2,
    },
  })

  assert.equal(vnode.type, 'MarginContainer')
  assert.equal(vnode.props['custom_minimum_size:y'], 280)
  assert.equal(vnode.props.clip_contents, true)
  assert.equal(vnode.props['theme_override_constants/margin_bottom'], 2)
})

test('KeyboardAvoidingView ignores keyboard height when disabled', () => {
  setDisplayServerState({
    virtualKeyboardHeight: 140,
  })

  const vnode = renderKeyboardAvoidingView({
    enabled: false,
    style: {
      padding: 3,
    },
  })

  assert.equal(vnode.props['theme_override_constants/margin_top'], 3)
  assert.equal(vnode.props['theme_override_constants/margin_right'], 3)
  assert.equal(vnode.props['theme_override_constants/margin_bottom'], 3)
  assert.equal(vnode.props['theme_override_constants/margin_left'], 3)
})
