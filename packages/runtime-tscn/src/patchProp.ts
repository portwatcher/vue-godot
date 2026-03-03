import { RendererOptions } from '@vue/runtime-core'
import { Callable, Node } from 'godot'
import { patchGodotProperty } from './propertyPatch'
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
        Callable.create(target, handler as (...args: unknown[]) => unknown),
      connect: (target, signalName, callable) =>
        target.connect(signalName, new Callable(callable)),
      disconnect: (target, signalName, callable) =>
        target.disconnect(signalName, new Callable(callable)),
      onError: (phase, signalName, error) => {
        console.warn(
          `[vue-godot] Error trying to ${phase} signal "${signalName}" on ${
            el.get_path()?.toString() || el.get_name().toString()
          }:`,
          error,
        )
      },
    })
  } else {
    const targetName = el.get_path()?.toString() || el.get_name().toString()
    patchGodotProperty(el, key, next, (message) => {
      if (message === `object has no method "set"`) {
        console.warn(`object ${targetName} has no method "set"`)
        return
      }
      console.warn(`${message} on ${targetName}`)
    })
  }
}
