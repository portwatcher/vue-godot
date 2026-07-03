import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'
import {
  createRenderer,
  createTextVNode,
  h,
  nextTick,
} from '@vue/runtime-core'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Option, Select } = await import('../dist/components/Select.js')
const { Textarea } = await import('../dist/components/Textarea.js')

function createHostNode(type) {
  const node = {
    type,
    props: {},
    children: [],
    parent: null,
    text: '',
  }

  if (type === 'OptionButton') {
    node.calls = []
    node.call = (method, ...args) => {
      node.calls.push([method, ...args])
      return null
    }
  }

  return node
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

test('syncs OptionButton items through Godot Object.call()', async () => {
  const root = createHostNode('root')
  const app = renderer.createApp({
    render() {
      return h(
        Select,
        { modelValue: 'banana' },
        {
          default: () => [
            h(Option, { value: 'apple' }, {
              default: () => [createTextVNode('Apple')],
            }),
            h(Option, { value: 'banana' }, {
              default: () => [createTextVNode('Banana')],
            }),
          ],
        },
      )
    },
  })

  app.mount(root)
  await nextTick()

  const optionButton = root.children[0]
  assert.equal(optionButton.type, 'OptionButton')
  assert.deepEqual(optionButton.calls, [
    ['clear'],
    ['add_item', 'Apple', 0],
    ['add_item', 'Banana', 1],
    ['select', 1],
  ])
})

test('reads Textarea text from vnode host node on text_changed', async () => {
  const updates = []
  const root = createHostNode('root')
  const app = renderer.createApp({
    render() {
      return h(Textarea, {
        modelValue: '',
        'onUpdate:modelValue': (value) => updates.push(value),
      })
    },
  })

  app.mount(root)
  await nextTick()

  const textEdit = root.children[0]
  assert.equal(textEdit.type, 'TextEdit')
  textEdit.text = 'line one\nline two'
  textEdit.props.onTextChanged()

  assert.deepEqual(updates, ['line one\nline two'])
})
