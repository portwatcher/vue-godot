import { RendererOptions } from '@vue/runtime-core'
import { Callable, Node } from 'godot'

type TSCNRendererOptions = RendererOptions<Node, Node>

export const patchProp: TSCNRendererOptions['patchProp'] = function (
  el: Node,
  key: string,
  prev: any,
  next: any,
) {
  if (key.startsWith('on')) {
    const signalName = key.slice(2).replace(/^[A-Z]/, (s) => s.toLowerCase())
    const prevHandler = prev as Function | null
    const nextHandler = next as Function | null

    // Disconnect previous handler
    if (prevHandler && typeof prevHandler === 'function') {
      try {
        const callableToDisconnect = Callable.create(
          el,
          prevHandler as (...args: any[]) => any,
        )
        el.disconnect(signalName, callableToDisconnect as any)
      } catch (e) {
        console.warn(
          `[vue-godot] Error trying to disconnect signal "${signalName}" on ${
            el.get_path()?.toString() || el.get_name().toString()
          }:`,
          e,
        )
      }
    }

    // Connect new handler
    if (nextHandler && typeof nextHandler === 'function') {
      try {
        const callableToConnect = Callable.create(
          el,
          nextHandler as (...args: any[]) => any,
        )
        el.connect(signalName, callableToConnect as any)
      } catch (e) {
        console.warn(
          `[vue-godot] Error trying to connect signal "${signalName}" on ${
            el.get_path()?.toString() || el.get_name().toString()
          }:`,
          e,
        )
      }
    }
  } else if (el.has_method('set')) {
    el.set(key, next) // Universal Godot setter
  } else {
    console.warn(`object ${el.get_path()} has no method "set"`)
    ;(el as any)[key] = next
  }
}
