import { RendererOptions } from '@vue/runtime-core'
import { Callable, Node } from 'godot'
import { patchSignalHandlers } from './signalEvents'

type TSCNRendererOptions = RendererOptions<Node, Node>

export const patchProp: TSCNRendererOptions['patchProp'] = function (
  el: Node,
  key: string,
  prev: any,
  next: any,
) {
  if (key.startsWith('on')) {
    patchSignalHandlers(el, key, next, {
      createCallable: (target, handler) =>
        Callable.create(target, handler as (...args: any[]) => any),
      connect: (target, signalName, callable) =>
        target.connect(signalName, callable as any),
      disconnect: (target, signalName, callable) =>
        target.disconnect(signalName, callable as any),
      onError: (phase, signalName, error) => {
        console.warn(
          `[vue-godot] Error trying to ${phase} signal "${signalName}" on ${
            el.get_path()?.toString() || el.get_name().toString()
          }:`,
          error,
        )
      },
    })
  } else if (el.has_method('set')) {
    el.set(key, next) // Universal Godot setter
  } else {
    console.warn(`object ${el.get_path()} has no method "set"`)
    ;(el as any)[key] = next
  }
}
