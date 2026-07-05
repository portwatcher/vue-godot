import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const {
  A,
  ActivityIndicator,
  Div,
  Progress,
  ScrollView,
  Switch,
  htmlPlugin,
  htmlTags,
} = await import('../dist/index.js')

test('htmlTags includes every lowercase component tag', () => {
  assert.ok(htmlTags.includes('a'))
  assert.ok(htmlTags.includes('activityindicator'))
  assert.ok(htmlTags.includes('div'))
  assert.ok(htmlTags.includes('button'))
  assert.ok(htmlTags.includes('progress'))
  assert.ok(htmlTags.includes('scrollview'))
  assert.ok(htmlTags.includes('switch'))
  assert.ok(htmlTags.includes('video'))
})

test('htmlPlugin registers PascalCase and lowercase components', () => {
  const registered = new Map()
  const app = {
    component(name, component) {
      registered.set(name, component)
      return this
    },
  }

  htmlPlugin.install(app)

  assert.equal(registered.get('A'), A)
  assert.equal(registered.get('a'), A)
  assert.equal(registered.get('ActivityIndicator'), ActivityIndicator)
  assert.equal(registered.get('activityindicator'), ActivityIndicator)
  assert.equal(registered.get('Div'), Div)
  assert.equal(registered.get('div'), Div)
  assert.equal(registered.get('Progress'), Progress)
  assert.equal(registered.get('progress'), Progress)
  assert.equal(registered.get('ScrollView'), ScrollView)
  assert.equal(registered.get('scrollview'), ScrollView)
  assert.equal(registered.get('Switch'), Switch)
  assert.equal(registered.get('switch'), Switch)
})
