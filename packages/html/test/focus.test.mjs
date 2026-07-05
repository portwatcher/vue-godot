import assert from 'node:assert/strict'
import test from 'node:test'
import { register } from 'node:module'
import { createTextVNode, h } from '@vue/runtime-core'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { Button, Input, Option, Select, Textarea } = await import(
  '../dist/index.js'
)
const {
  createFocusContainmentController,
  focusGodotControl,
  readCurrentFocusOwner,
} = await import('../dist/utils/focus.js')

function renderButton(props = {}, children = []) {
  const render = Button.setup(props, {
    emit: () => {},
    slots: {
      default: () => children,
    },
  })

  return render()
}

function renderInput(props = {}) {
  const render = Input.setup(props, {
    emit: () => {},
  })

  return render()
}

function renderTextarea(props = {}, emitted = []) {
  const render = Textarea.setup(props, {
    emit: (event, value) => {
      emitted.push([event, value])
    },
  })

  return render()
}

function renderSelect(props = {}) {
  const render = Select.setup(props, {
    emit: () => {},
    slots: {
      default: () => [
        h(Option, { value: 'apple' }, {
          default: () => [createTextVNode('Apple')],
        }),
        h(Option, { value: 'banana' }, {
          default: () => [createTextVNode('Banana')],
        }),
      ],
    },
  })

  return render()
}

test('focusGodotControl uses grab_focus or Object.call fallback', () => {
  let grabbed = 0
  const calls = []

  focusGodotControl({
    grab_focus: () => {
      grabbed += 1
    },
  })
  focusGodotControl({
    call: (method) => {
      calls.push(method)
      return null
    },
  })

  assert.equal(grabbed, 1)
  assert.deepEqual(calls, ['grab_focus'])
})

test('readCurrentFocusOwner reads the owner from a Godot viewport', () => {
  const owner = { id: 'opener' }

  assert.equal(
    readCurrentFocusOwner({
      get_viewport: () => ({
        gui_get_focus_owner: () => owner,
      }),
    }),
    owner,
  )
  assert.equal(readCurrentFocusOwner({}), null)
})

test('focus containment traps focus on open and restores it on close', () => {
  const controller = createFocusContainmentController()
  const calls = []
  const opener = {
    grab_focus: () => {
      calls.push('opener')
    },
  }
  const root = {
    get_viewport: () => ({
      gui_get_focus_owner: () => opener,
    }),
    grab_focus: () => {
      calls.push('root')
    },
  }
  const openProps = {}

  controller.apply(
    openProps,
    { trapFocus: true, restoreFocus: true },
    { open: true, selfLoopTraversal: true },
  )

  assert.equal(openProps.focus_mode, 2)
  assert.equal(openProps.focus_next, '.')
  assert.equal(openProps.focus_previous, '.')
  assert.equal(openProps.focus_neighbor_left, '.')
  assert.equal(openProps.focus_neighbor_top, '.')
  assert.equal(openProps.focus_neighbor_right, '.')
  assert.equal(openProps.focus_neighbor_bottom, '.')

  openProps.onVnodeMounted({ el: root })
  assert.deepEqual(calls, ['root'])

  const closedProps = {}
  controller.apply(
    closedProps,
    { trapFocus: true, restoreFocus: true },
    { open: false, selfLoopTraversal: true },
  )

  assert.equal('focus_next' in closedProps, false)
  closedProps.onVnodeUpdated({ el: root })
  assert.deepEqual(calls, ['root', 'opener'])
})

test('Button and Input install auto-focus vnode hooks', () => {
  const button = renderButton({ autofocus: true }, ['Save'])
  const input = renderInput({ type: 'text', autoFocus: true })
  let buttonFocused = false
  let inputFocused = false

  button.props.onVnodeMounted({
    el: {
      grab_focus: () => {
        buttonFocused = true
      },
    },
  })
  input.props.onVnodeMounted({
    el: {
      grab_focus: () => {
        inputFocused = true
      },
    },
  })

  assert.equal(buttonFocused, true)
  assert.equal(inputFocused, true)
})

test('focusable controls map focus traversal node paths', () => {
  const button = renderButton({
    focusNext: '../Next',
    focusPrevious: '  ../Previous  ',
    focusNeighborLeft: '../Left',
    focusNeighborTop: '',
    focusNeighborRight: '../Right',
    focusNeighborBottom: '   ',
  })

  assert.equal(button.props.focus_next, '../Next')
  assert.equal(button.props.focus_previous, '../Previous')
  assert.equal(button.props.focus_neighbor_left, '../Left')
  assert.equal(button.props.focus_neighbor_right, '../Right')
  assert.equal('focus_neighbor_top' in button.props, false)
  assert.equal('focus_neighbor_bottom' in button.props, false)
})

test('disabled controls do not install auto-focus vnode hooks', () => {
  const button = renderButton({ disabled: true, autoFocus: true }, ['Save'])
  const input = renderInput({
    type: 'text',
    disabled: true,
    autoFocus: true,
  })

  assert.equal('onVnodeMounted' in button.props, false)
  assert.equal('onVnodeMounted' in input.props, false)
})

test('Select keeps item sync when auto-focus composes mounted hooks', () => {
  const vnode = renderSelect({
    modelValue: 'banana',
    autoFocus: true,
  })
  let focused = false
  const calls = []

  vnode.props.onVnodeMounted({
    el: {
      call: (method, ...args) => {
        calls.push([method, ...args])
        return null
      },
      grab_focus: () => {
        focused = true
      },
    },
  })

  assert.deepEqual(calls, [
    ['clear'],
    ['add_item', 'Apple', 0],
    ['add_item', 'Banana', 1],
    ['select', 1],
  ])
  assert.equal(focused, true)
})

test('Textarea keeps model updates when auto-focus composes mounted hooks', () => {
  const emitted = []
  const vnode = renderTextarea({ autoFocus: true }, emitted)
  const textEdit = {
    text: 'line one\nline two',
    focused: false,
    grab_focus() {
      this.focused = true
    },
  }

  vnode.props.onVnodeMounted({ el: textEdit })
  vnode.props.onTextChanged()

  assert.equal(textEdit.focused, true)
  assert.deepEqual(emitted, [['update:modelValue', 'line one\nline two']])
})
