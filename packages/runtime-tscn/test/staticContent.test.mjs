import test from 'node:test'
import assert from 'node:assert/strict'

import {
  insertStaticContentNode,
  supportsPlainTextStaticContent,
} from '../dist/staticContent.js'

class FakeNode {
  constructor(name) {
    this.name = name
    this.parent = null
    this.children = []
  }

  get_parent() {
    return this.parent
  }

  get_index() {
    if (!this.parent) return -1
    return this.parent.children.indexOf(this)
  }

  get_child_count() {
    return this.children.length
  }

  add_child(child) {
    if (child.parent && child.parent !== this) {
      throw new Error(`child ${child.name} already has a different parent`)
    }
    if (child.parent === this) return
    child.parent = this
    this.children.push(child)
  }

  remove_child(child) {
    const index = this.children.indexOf(child)
    if (index >= 0) {
      this.children.splice(index, 1)
      child.parent = null
    }
  }

  move_child(child, toIndex) {
    const fromIndex = this.children.indexOf(child)
    if (fromIndex < 0) {
      throw new Error(`child ${child.name} is not in parent ${this.name}`)
    }
    this.children.splice(fromIndex, 1)
    this.children.splice(toIndex, 0, child)
  }
}

function childNames(parent) {
  return parent.children.map((child) => child.name)
}

test('supportsPlainTextStaticContent only accepts plain text strings', () => {
  assert.equal(supportsPlainTextStaticContent('hello'), true)
  assert.equal(supportsPlainTextStaticContent(''), false)
  assert.equal(supportsPlainTextStaticContent('<div></div>'), false)
  assert.equal(supportsPlainTextStaticContent('&amp;'), false)
})

test('insertStaticContentNode inserts a text node and returns matching anchors', () => {
  const parent = new FakeNode('parent')
  const anchor = new FakeNode('anchor')
  parent.add_child(anchor)

  const [start, end] = insertStaticContentNode('hello', parent, anchor, {
    createTextNode: (text) => new FakeNode(`text:${text}`),
    createPlaceholderNode: (content) => new FakeNode(`placeholder:${content}`),
  })

  assert.equal(start, end)
  assert.deepEqual(childNames(parent), ['text:hello', 'anchor'])
})

test('insertStaticContentNode inserts a placeholder for unsupported markup content', () => {
  const parent = new FakeNode('parent')

  const [start, end] = insertStaticContentNode('<div>hello</div>', parent, null, {
    createTextNode: (text) => new FakeNode(`text:${text}`),
    createPlaceholderNode: (content) => new FakeNode(`placeholder:${content}`),
  })

  assert.equal(start, end)
  assert.deepEqual(childNames(parent), ['placeholder:<div>hello</div>'])
})
