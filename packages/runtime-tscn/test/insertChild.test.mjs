import test from 'node:test'
import assert from 'node:assert/strict'

import { insertChildBeforeAnchor } from '../dist/insertChild.js'

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
    if (child.parent === this) {
      return
    }
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

test('appends when anchor is null', () => {
  const parent = new FakeNode('parent')
  const a = new FakeNode('a')
  const b = new FakeNode('b')

  insertChildBeforeAnchor(a, parent, null)
  insertChildBeforeAnchor(b, parent, null)

  assert.deepEqual(childNames(parent), ['a', 'b'])
})

test('inserts before anchor', () => {
  const parent = new FakeNode('parent')
  const a = new FakeNode('a')
  const c = new FakeNode('c')
  const b = new FakeNode('b')

  insertChildBeforeAnchor(a, parent, null)
  insertChildBeforeAnchor(c, parent, null)
  insertChildBeforeAnchor(b, parent, c)

  assert.deepEqual(childNames(parent), ['a', 'b', 'c'])
})

test('reorders correctly when moving an existing child before an anchor', () => {
  const parent = new FakeNode('parent')
  const a = new FakeNode('a')
  const b = new FakeNode('b')
  const c = new FakeNode('c')

  insertChildBeforeAnchor(a, parent, null)
  insertChildBeforeAnchor(b, parent, null)
  insertChildBeforeAnchor(c, parent, null)

  insertChildBeforeAnchor(a, parent, c)

  assert.deepEqual(childNames(parent), ['b', 'a', 'c'])
})

test('reorders correctly when moving an existing child to the end', () => {
  const parent = new FakeNode('parent')
  const a = new FakeNode('a')
  const b = new FakeNode('b')
  const c = new FakeNode('c')

  insertChildBeforeAnchor(a, parent, null)
  insertChildBeforeAnchor(b, parent, null)
  insertChildBeforeAnchor(c, parent, null)

  insertChildBeforeAnchor(a, parent, null)

  assert.deepEqual(childNames(parent), ['b', 'c', 'a'])
})
