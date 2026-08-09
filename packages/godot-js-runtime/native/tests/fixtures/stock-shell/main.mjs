import {
  hasFeature,
  quickJSVersion,
  runtimeFeatures,
  runtimeVersion,
} from 'godot-js'
import settings from './settings.json'
import { moduleMarker } from './module.mjs'

if (runtimeVersion() !== '0.0.0-development') {
  throw new Error(`Unexpected runtime version: ${runtimeVersion()}`)
}
if (quickJSVersion() !== '0.15.0') {
  throw new Error(`Unexpected QuickJS-ng version: ${quickJSVersion()}`)
}
if (!hasFeature('resource-modules') || !hasFeature('promise-jobs')) {
  throw new Error(`Missing runtime features: ${runtimeFeatures().join(',')}`)
}
if (settings.marker !== 'resource-json' || moduleMarker !== 'relative-esm') {
  throw new Error('Resource-backed ESM or JSON loading failed')
}

Promise.resolve().then(() => {
  console.log(
    `[godot-js-runtime] PHASE2_MODULE_PROMISE PASS ${moduleMarker} ${settings.marker}`,
  )
})
