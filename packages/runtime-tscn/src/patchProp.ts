import { RendererOptions } from '@vue/runtime-core'
import { Callable, Node } from 'godot'
import { patchGodotProperty } from './propertyPatch.js'
import { clearSignalHandlers, patchSignalHandlers } from './signalEvents.js'

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

function createGodotSignalCallable(
  target: Node,
  handler: (...args: unknown[]) => unknown,
) {
  return Callable.create(target, handler)
}

type GodotSignalCallable = ReturnType<typeof createGodotSignalCallable>

function signalPatchOperations(el: Node, eventKey: string) {
  return {
    createCallable: createGodotSignalCallable,
    connect: (
      target: Node,
      signalName: string,
      callable: GodotSignalCallable,
    ) => target.connect(signalName, new Callable(callable)),
    disconnect: (
      target: Node,
      signalName: string,
      callable: GodotSignalCallable,
    ) => target.disconnect(signalName, new Callable(callable)),
    onError: (
      phase: 'connect' | 'disconnect',
      signalName: string,
      error: unknown,
    ) => {
      console.warn(
        `[vue-godot] Unable to ${phase} signal "${signalName}" on ${safeNodeName(el)} from Vue event prop "${eventKey}". Check that this Godot class defines the signal and that the event name maps to the expected Godot signal:`,
        error,
      )
    },
  }
}

export function clearGodotSignalHandlers(el: Node): void {
  clearSignalHandlers(el, signalPatchOperations(el, '<unmount>'))
}

export const patchProp: TSCNRendererOptions['patchProp'] = function (
  el: Node,
  key: string,
  _prev: unknown,
  next: unknown,
) {
  if (key.startsWith('on')) {
    patchSignalHandlers(el, key, next, signalPatchOperations(el, key))
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
