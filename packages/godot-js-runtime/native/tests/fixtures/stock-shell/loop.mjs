import { hasFeature } from 'godot-js'
import { Node } from 'godot'

if (!hasFeature('promise-jobs')) {
  throw new Error('Reload-loop runtime is missing Promise jobs')
}

Promise.resolve().then(() => {
  console.log('[godot-js-runtime] PHASE2_LOOP_PROMISE PASS')
})

export default class ReloadLoopProbe extends Node {}
