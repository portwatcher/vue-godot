import { RendererOptions } from '@vue/runtime-core'
import { Callable, Node } from 'godot'
import { patchGodotProperty } from './propertyPatch.js'
import { patchSignalHandlers } from './signalEvents.js'

type TSCNRendererOptions = RendererOptions<Node, Node>

/**
 * Return a human-readable identifier for a node, safe to call even
 * when the node has not been added to the scene tree yet.
 *
 * `Node.get_path()` prints a Godot-level error when the node is not
 * in a tree, so we guard with `is_inside_tree()` first.
 */
function safeNodeName(node: Node): string {
  if (node.is_inside_tree()) {
    return node.get_path()?.toString() ?? node.get_name().toString()
  }
  return node.get_name().toString()
}

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
          `[vue-godot] Error trying to ${phase} signal "${signalName}" on ${safeNodeName(el)}:`,
          error,
        )
      },
    })
  } else {
    patchGodotProperty(el, key, next, (message) => {
      const targetName = safeNodeName(el)
      if (message === `object has no method "set"`) {
        console.warn(`object ${targetName} has no method "set"`)
        return
      }
      console.warn(`${message} on ${targetName}`)
    })
  }
}
