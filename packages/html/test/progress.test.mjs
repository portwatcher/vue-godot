import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { ActivityIndicator, Progress } = await import('../dist/index.js')

function renderProgress(props = {}) {
  const render = Progress.setup(props, {})
  return render()
}

function renderActivityIndicator(props = {}) {
  const render = ActivityIndicator.setup(props, {})
  return render()
}

test('Progress renders a determinate Godot ProgressBar by default', () => {
  const vnode = renderProgress({})

  assert.equal(vnode.type, 'ProgressBar')
  assert.equal(vnode.props.min_value, 0)
  assert.equal(vnode.props.max_value, 100)
  assert.equal(vnode.props.value, 0)
  assert.equal(vnode.props.indeterminate, false)
  assert.equal(vnode.props.show_percentage, false)
  assert.equal(vnode.props.fill_mode, 0)
})

test('Progress maps range, fill, percentage, indeterminate, and style props', () => {
  const vnode = renderProgress({
    value: 35,
    min: 10,
    max: 50,
    step: 5,
    indeterminate: true,
    showPercentage: true,
    fill: 'bottom-to-top',
    style: {
      width: 240,
      height: 18,
      display: 'none',
      opacity: 0.75,
    },
  })

  assert.equal(vnode.props.min_value, 10)
  assert.equal(vnode.props.max_value, 50)
  assert.equal(vnode.props.value, 35)
  assert.equal(vnode.props.step, 5)
  assert.equal(vnode.props.indeterminate, true)
  assert.equal(vnode.props.show_percentage, true)
  assert.equal(vnode.props.fill_mode, 3)
  assert.equal(vnode.props['custom_minimum_size:x'], 240)
  assert.equal(vnode.props['custom_minimum_size:y'], 18)
  assert.equal(vnode.props.visible, false)
  assert.equal(vnode.props.modulate.__kind, 'color')
  assert.equal(vnode.props.modulate.a, 0.75)
})

test('ActivityIndicator renders an active indeterminate ProgressBar', () => {
  const vnode = renderActivityIndicator({
    size: 32,
    fill: 'top-to-bottom',
  })

  assert.equal(vnode.type, 'ProgressBar')
  assert.equal(vnode.props.min_value, 0)
  assert.equal(vnode.props.max_value, 100)
  assert.equal(vnode.props.value, 0)
  assert.equal(vnode.props.indeterminate, true)
  assert.equal(vnode.props.show_percentage, false)
  assert.equal(vnode.props.fill_mode, 2)
  assert.equal(vnode.props['custom_minimum_size:x'], 32)
  assert.equal(vnode.props['custom_minimum_size:y'], 32)
})

test('ActivityIndicator hides and pauses when inactive', () => {
  const vnode = renderActivityIndicator({
    active: false,
    size: 24,
    style: {
      width: 48,
      height: 12,
    },
  })

  assert.equal(vnode.props.indeterminate, false)
  assert.equal(vnode.props.visible, false)
  assert.equal(vnode.props['custom_minimum_size:x'], 48)
  assert.equal(vnode.props['custom_minimum_size:y'], 12)
})
