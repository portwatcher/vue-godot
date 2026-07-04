import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-loader.mjs', import.meta.url).href)

const [
  { createApp },
  { h, nextTick, onMounted, onUnmounted },
  { ClassDB, Node },
] = await Promise.all([
  import('../dist/index.js'),
  import('@vue/runtime-core'),
  import('godot'),
])

test('editor-style reload unmounts the previous app before remounting', async () => {
  const root = new Node('root')
  let currentApp = null

  function reload(label) {
    currentApp?.unmount()
    currentApp = createApp({
      render() {
        return h('Label', { text: label })
      },
    })
    currentApp.mount(root)
  }

  reload('first')
  await nextTick()
  const firstLabel = root.children[0]
  assert.equal(firstLabel.text, 'first')

  reload('second')
  await nextTick()

  assert.equal(root.children.length, 1)
  assert.equal(root.children[0].text, 'second')
  assert.notEqual(root.children[0], firstLabel)
  assert.equal(firstLabel.queuedFree, true)

  currentApp.unmount()
  await nextTick()
  assert.deepEqual(root.children, [])
})

test('scene-exit unmount runs Vue cleanup and frees the rendered subtree', async () => {
  const root = new Node('root')
  const events = []
  const app = createApp({
    setup() {
      onMounted(() => events.push('mounted'))
      onUnmounted(() => events.push('unmounted'))
      return () =>
        h('PanelContainer', null, [
          h('Label', { text: 'scene child' }),
          h('VBoxContainer'),
        ])
    },
  })

  app.mount(root)
  await nextTick()

  const subtree = root.children[0]
  const nestedChildren = [...subtree.children]
  assert.deepEqual(events, ['mounted'])
  assert.equal(root.children.length, 1)

  app.unmount()
  await nextTick()

  assert.deepEqual(events, ['mounted', 'unmounted'])
  assert.deepEqual(root.children, [])
  assert.equal(subtree.queuedFree, true)
  assert.ok(nestedChildren.every((child) => child.queuedFree))
})

test('nested apps can unmount independently inside a Godot subtree', async () => {
  const root = new Node('root')
  const outerApp = createApp({
    render() {
      return h('PanelContainer', { dataRole: 'outer-mount' })
    },
  })

  outerApp.mount(root)
  await nextTick()

  const nestedRoot = root.children[0]
  const innerApp = createApp({
    render() {
      return h('Label', { text: 'inner app' })
    },
  })

  innerApp.mount(nestedRoot)
  await nextTick()

  const innerLabel = nestedRoot.children[0]
  assert.equal(root.children[0], nestedRoot)
  assert.equal(nestedRoot.children.length, 1)
  assert.equal(innerLabel.text, 'inner app')

  innerApp.unmount()
  await nextTick()

  assert.equal(root.children[0], nestedRoot)
  assert.deepEqual(nestedRoot.children, [])
  assert.equal(innerLabel.queuedFree, true)

  outerApp.unmount()
  await nextTick()

  assert.deepEqual(root.children, [])
  assert.equal(nestedRoot.queuedFree, true)
})

test('failed mounts leave the root reusable for a later successful app', async () => {
  const root = new Node('root')
  ClassDB.throwOnInstantiateTags = new Set(['BrokenNode'])

  try {
    const brokenApp = createApp({
      render() {
        return h('BrokenNode')
      },
    })

    assert.throws(() => brokenApp.mount(root), /Cannot instantiate BrokenNode/)
    await nextTick()
    assert.deepEqual(root.children, [])
  } finally {
    ClassDB.reset()
  }

  const recoveredApp = createApp({
    render() {
      return h('Label', { text: 'recovered' })
    },
  })

  recoveredApp.mount(root)
  await nextTick()

  assert.equal(root.children.length, 1)
  assert.equal(root.children[0].text, 'recovered')

  recoveredApp.unmount()
  await nextTick()
  assert.deepEqual(root.children, [])
})
