import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'
import { Fragment, createRenderer, h } from '@vue/runtime-core'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Div } = await import('../dist/components/Div.js')

function createHostNode(type) {
  return {
    type,
    props: {},
    children: [],
    parent: null,
    text: '',
  }
}

function insertChild(child, parent, anchor) {
  child.parent = parent
  if (!anchor) {
    parent.children.push(child)
    return
  }
  const index = parent.children.indexOf(anchor)
  if (index < 0) {
    parent.children.push(child)
    return
  }
  parent.children.splice(index, 0, child)
}

const renderer = createRenderer({
  patchProp(el, key, _prev, next) {
    if (next == null) {
      delete el.props[key]
      return
    }
    el.props[key] = next
  },
  insert(child, parent, anchor) {
    insertChild(child, parent, anchor)
  },
  remove(child) {
    const parent = child.parent
    if (!parent) {
      return
    }
    const index = parent.children.indexOf(child)
    if (index >= 0) {
      parent.children.splice(index, 1)
    }
    child.parent = null
  },
  createElement(type) {
    return createHostNode(type)
  },
  createText(text) {
    const node = createHostNode('#text')
    node.text = text
    return node
  },
  createComment(text) {
    const node = createHostNode('#comment')
    node.text = text
    return node
  },
  setText(node, text) {
    node.text = text
  },
  setElementText(node, text) {
    node.text = text
    node.children = []
  },
  parentNode(node) {
    return node.parent
  },
  nextSibling(node) {
    const parent = node.parent
    if (!parent) {
      return null
    }
    const index = parent.children.indexOf(node)
    return index >= 0 ? (parent.children[index + 1] ?? null) : null
  },
  querySelector() {
    return null
  },
  setScopeId() {},
  cloneNode(node) {
    const cloned = createHostNode(node.type)
    cloned.props = { ...node.props }
    cloned.children = [...node.children]
    cloned.text = node.text
    return cloned
  },
  insertStaticContent(content, parent, anchor) {
    const node = createHostNode('#static')
    node.text = content
    insertChild(node, parent, anchor)
    return [node, node]
  },
})

function renderRoot(component) {
  const root = createHostNode('root')
  const app = renderer.createApp(component)
  app.mount(root)
  return root.children[0]
}

test('integrates Div child mapping through nested Fragment/array slot trees', () => {
  const tree = renderRoot({
    render() {
      return h(
        Div,
        {
          style: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          },
        },
        {
          default: () => [
            h(Fragment, null, [
              h('Control', { style: { flex: 1 } }),
              [h('Control')],
            ]),
          ],
        },
      )
    },
  })

  assert.equal(tree.type, 'HBoxContainer')
  assert.equal(tree.props.alignment, 2)
  const controls = tree.children.filter((child) => child.type === 'Control')
  assert.equal(controls.length, 2)
  assert.equal(controls[0].props.size_flags_horizontal, 3)
  assert.equal(controls[0].props.size_flags_stretch_ratio, 1)
  assert.equal(controls[0].props.size_flags_vertical, 4)
  assert.equal(controls[1].props.size_flags_vertical, 4)
})

test('integrates padding wrapper and custom minimum size props', () => {
  const tree = renderRoot({
    render() {
      return h(
        Div,
        {
          style: {
            flexDirection: 'column',
            padding: 8,
            paddingLeft: 16,
            width: 180,
            minWidth: 200,
            maxWidth: 190,
            height: '40px',
          },
        },
        {
          default: () => [h('Control', { style: { flex: 2 } })],
        },
      )
    },
  })

  assert.equal(tree.type, 'MarginContainer')
  assert.equal(tree.props['theme_override_constants/margin_top'], 8)
  assert.equal(tree.props['theme_override_constants/margin_right'], 8)
  assert.equal(tree.props['theme_override_constants/margin_bottom'], 8)
  assert.equal(tree.props['theme_override_constants/margin_left'], 16)

  assert.equal(tree.children.length, 1)
  const container = tree.children[0]
  assert.equal(container.type, 'VBoxContainer')
  assert.equal(container.props['custom_minimum_size:x'], 190)
  assert.equal(container.props['custom_minimum_size:y'], 40)
  assert.equal(container.children[0].props.size_flags_vertical, 3)
  assert.equal(container.children[0].props.size_flags_stretch_ratio, 2)
})
