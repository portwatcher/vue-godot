import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(new URL('./godot-loader.mjs', import.meta.url).href)

const [{ createApp }, { h, nextTick, onUnmounted, ref }, { Node }] =
  await Promise.all([
    import('../dist/index.js'),
    import('@vue/runtime-core'),
    import('godot'),
  ])

function childNames(parent) {
  return parent.children.map((child) => child.name)
}

function labelChildren(root) {
  const container = root.children[0]
  return container?.children ?? []
}

test('mounts and unmounts repeatedly without retaining child nodes', async () => {
  for (let index = 0; index < 100; index++) {
    const root = new Node(`root-${index}`)
    const app = createApp({
      render() {
        return h('PanelContainer', null, [
          h('Label', { text: `run-${index}` }),
          h('Label', null, `text-${index}`),
        ])
      },
    })

    app.mount(root)
    await nextTick()

    assert.deepEqual(childNames(root), ['PanelContainer'])
    assert.equal(root.children[0].children.length, 2)
    assert.equal(root.children[0].children[1].text, `text-${index}`)

    const mountedChild = root.children[0]
    app.unmount()
    await nextTick()

    assert.deepEqual(root.children, [])
    assert.equal(mountedChild.queuedFree, true)
  }
})

test('repeated navigation releases inactive screen subtrees', async () => {
  const root = new Node('root')
  const route = ref('home')
  const unmountedRoutes = []
  const ScreenBody = {
    props: ['name'],
    setup(props) {
      onUnmounted(() => {
        unmountedRoutes.push(props.name)
      })

      return () =>
        h('PanelContainer', { screenName: props.name }, [
          h('VBoxContainer', null, [
            h('Label', { text: `title-${props.name}` }),
            h('Label', { text: `body-${props.name}` }),
          ]),
        ])
    },
  }
  const app = createApp({
    setup() {
      return () => h(ScreenBody, { key: route.value, name: route.value })
    },
  })

  app.mount(root)
  await nextTick()

  let previousScreen = root.children[0]
  const releasedScreens = []
  const navigationRoutes = []
  for (let cycle = 0; cycle < 6; cycle++) {
    navigationRoutes.push(
      'settings',
      'inventory',
      'pause',
      'home',
      'settings',
      'credits',
      'home',
    )
  }

  for (const nextRoute of navigationRoutes) {
    route.value = nextRoute
    await nextTick()

    const currentScreen = root.children[0]
    assert.equal(root.children.length, 1)
    assert.equal(currentScreen.screenName, nextRoute)
    assert.notEqual(currentScreen, previousScreen)
    assert.equal(previousScreen.queuedFree, true)
    assert.ok(previousScreen.children.every((child) => child.queuedFree))

    releasedScreens.push(previousScreen)
    previousScreen = currentScreen
  }

  assert.deepEqual(unmountedRoutes, ['home', ...navigationRoutes.slice(0, -1)])
  assert.ok(releasedScreens.every((screen) => screen.queuedFree))

  app.unmount()
  await nextTick()

  assert.deepEqual(root.children, [])
  assert.equal(previousScreen.queuedFree, true)
  assert.ok(previousScreen.children.every((child) => child.queuedFree))
})

test('handles large keyed reorders, prop removal resets, and event replacement', async () => {
  const root = new Node('root')
  const items = ref(Array.from({ length: 90 }, (_, index) => index))
  const hidden = ref(true)
  const version = ref(0)

  const app = createApp({
    setup() {
      return () =>
        h(
          'VBoxContainer',
          null,
          items.value.map((id) =>
            h(
              'Label',
              {
                key: id,
                dataId: id,
                visible: hidden.value ? false : undefined,
                onPressed: () => `version-${version.value}-item-${id}`,
              },
              `item-${id}`,
            ),
          ),
        )
    },
  })

  app.mount(root)
  await nextTick()

  const firstRenderLabels = labelChildren(root)
  assert.equal(firstRenderLabels.length, 90)
  assert.deepEqual(
    firstRenderLabels.map((node) => node.dataId),
    items.value,
  )
  assert.ok(firstRenderLabels.every((node) => node.visible === false))
  assert.ok(
    firstRenderLabels.every(
      (node) => node.connections.get('pressed')?.size === 1,
    ),
  )

  const nodesById = new Map(firstRenderLabels.map((node) => [node.dataId, node]))

  items.value = [...items.value].reverse()
  hidden.value = false
  version.value += 1
  await nextTick()

  const reversedLabels = labelChildren(root)
  assert.deepEqual(
    reversedLabels.map((node) => node.dataId),
    items.value,
  )
  assert.ok(reversedLabels.every((node) => node.visible === true))
  assert.ok(
    reversedLabels.every(
      (node) => node.connections.get('pressed')?.size === 1,
    ),
  )
  assert.equal(reversedLabels[0], nodesById.get(89))
  assert.equal(reversedLabels.at(-1), nodesById.get(0))
  assert.ok(
    reversedLabels.some((node) =>
      node.disconnectCalls.some((call) => call.signalName === 'pressed'),
    ),
  )

  for (let cycle = 0; cycle < 12; cycle++) {
    const rotated = [...items.value.slice(7), ...items.value.slice(0, 7)]
    items.value = cycle % 2 === 0 ? rotated : rotated.reverse()
    hidden.value = cycle % 3 === 0
    version.value += 1
    await nextTick()

    const labels = labelChildren(root)
    assert.equal(labels.length, 90)
    assert.deepEqual(
      labels.map((node) => node.dataId),
      items.value,
    )
    assert.ok(
      labels.every(
        (node) => node.connections.get('pressed')?.size === 1,
      ),
    )
    assert.ok(
      labels.every((node) => node.visible === (hidden.value ? false : true)),
    )
  }

  app.unmount()
  await nextTick()
  assert.deepEqual(root.children, [])
})
