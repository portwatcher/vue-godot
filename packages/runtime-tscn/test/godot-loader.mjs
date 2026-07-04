const GODOT_MOCK_URL = 'mock:runtime-tscn-godot'

export function resolve(specifier, context, nextResolve) {
  if (specifier === 'godot') {
    return { url: GODOT_MOCK_URL, shortCircuit: true }
  }
  return nextResolve(specifier, context)
}

export function load(url, context, nextLoad) {
  if (url === GODOT_MOCK_URL) {
    return {
      format: 'module',
      shortCircuit: true,
      source: `
        let nextCallableId = 1

        function nameObject(value) {
          return {
            toString() {
              return String(value)
            },
          }
        }

        export class Callable {
          constructor(value) {
            if (value instanceof Callable) {
              this.id = value.id
              this.target = value.target
              this.handler = value.handler
              return
            }

            this.id = value?.id ?? nextCallableId++
            this.target = value?.target
            this.handler = value?.handler
          }

          static create(target, handler) {
            return new Callable({ id: nextCallableId++, target, handler })
          }
        }

        export class Node {
          constructor(name = 'Node') {
            this.name = String(name)
            this.parent = null
            this.children = []
            this.meta = new Map()
            this.connections = new Map()
            this.connectCalls = []
            this.disconnectCalls = []
            this.queuedFree = false
            this.visible = true
          }

          has_method(name) {
            return typeof this[name] === 'function'
          }

          set(key, value) {
            this[key] = value
          }

          get(key) {
            return this[key]
          }

          add_child(child) {
            if (child.parent && child.parent !== this) {
              child.parent.remove_child(child)
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
              throw new Error('child is not in parent')
            }
            this.children.splice(fromIndex, 1)
            this.children.splice(toIndex, 0, child)
          }

          get_parent() {
            return this.parent
          }

          get_index() {
            return this.parent ? this.parent.children.indexOf(this) : -1
          }

          get_child_count() {
            return this.children.length
          }

          get_child(index) {
            return this.children[index] ?? null
          }

          queue_free() {
            this.queuedFree = true
          }

          set_meta(key, value) {
            this.meta.set(String(key), value)
          }

          get_meta(key) {
            return this.meta.get(String(key))
          }

          is_inside_tree() {
            return this.parent !== null
          }

          get_name() {
            return nameObject(this.name)
          }

          get_path() {
            const names = []
            let current = this
            while (current) {
              names.unshift(current.name)
              current = current.parent
            }
            return nameObject('/' + names.join('/'))
          }

          connect(signalName, callable) {
            const signal = String(signalName)
            const byId = this.connections.get(signal) ?? new Map()
            if (byId.has(callable.id)) {
              throw new Error('duplicate connection')
            }
            byId.set(callable.id, callable)
            this.connections.set(signal, byId)
            this.connectCalls.push({ signalName: signal, callableId: callable.id })
          }

          disconnect(signalName, callable) {
            const signal = String(signalName)
            const byId = this.connections.get(signal)
            if (!byId?.has(callable.id)) {
              throw new Error('missing connection')
            }
            byId.delete(callable.id)
            this.disconnectCalls.push({ signalName: signal, callableId: callable.id })
          }
        }

        export class Label extends Node {
          constructor(name = 'Label') {
            super(name)
            this.text = ''
          }
        }

        export const ClassDB = {
          can_instantiate() {
            return true
          },
          instantiate(tag) {
            return tag === 'Label' ? new Label(tag) : new Node(tag)
          },
        }
      `,
    }
  }

  return nextLoad(url, context)
}
