import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const {
  A,
  ActivityIndicator,
  Dialog,
  Div,
  Modal,
  Overlay,
  Pressable,
  Progress,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Switch,
  VirtualList,
  htmlPlugin,
  htmlTags,
} = await import('../dist/index.js')

test('htmlTags includes every lowercase component tag', () => {
  assert.ok(htmlTags.includes('a'))
  assert.ok(htmlTags.includes('activityindicator'))
  assert.ok(htmlTags.includes('dialog'))
  assert.ok(htmlTags.includes('div'))
  assert.ok(htmlTags.includes('button'))
  assert.ok(htmlTags.includes('keyboardavoidingview'))
  assert.ok(htmlTags.includes('modal'))
  assert.ok(htmlTags.includes('overlay'))
  assert.ok(htmlTags.includes('pressable'))
  assert.ok(htmlTags.includes('progress'))
  assert.ok(htmlTags.includes('safeareaview'))
  assert.ok(htmlTags.includes('scrollview'))
  assert.ok(htmlTags.includes('switch'))
  assert.ok(htmlTags.includes('video'))
  assert.ok(htmlTags.includes('virtuallist'))
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
  assert.equal(registered.get('Dialog'), Dialog)
  assert.equal(registered.get('dialog'), Dialog)
  assert.equal(registered.get('Div'), Div)
  assert.equal(registered.get('div'), Div)
  assert.equal(registered.get('KeyboardAvoidingView'), KeyboardAvoidingView)
  assert.equal(registered.get('keyboardavoidingview'), KeyboardAvoidingView)
  assert.equal(registered.get('Modal'), Modal)
  assert.equal(registered.get('modal'), Modal)
  assert.equal(registered.get('Overlay'), Overlay)
  assert.equal(registered.get('overlay'), Overlay)
  assert.equal(registered.get('Pressable'), Pressable)
  assert.equal(registered.get('pressable'), Pressable)
  assert.equal(registered.get('Progress'), Progress)
  assert.equal(registered.get('progress'), Progress)
  assert.equal(registered.get('SafeAreaView'), SafeAreaView)
  assert.equal(registered.get('safeareaview'), SafeAreaView)
  assert.equal(registered.get('ScrollView'), ScrollView)
  assert.equal(registered.get('scrollview'), ScrollView)
  assert.equal(registered.get('Switch'), Switch)
  assert.equal(registered.get('switch'), Switch)
  assert.equal(registered.get('VirtualList'), VirtualList)
  assert.equal(registered.get('virtuallist'), VirtualList)
})
