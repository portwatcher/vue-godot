import assert from 'node:assert/strict'
import test from 'node:test'
import {
  commonJsBundleBanner,
  defineScript,
  getScriptMetadata,
  isRuntimeManifest,
  minimumGodotVersion,
  runtimeName,
  runtimePackageName,
} from '../dist/index.js'

test('public identity is standalone and Godot 4.4 compatible', () => {
  assert.equal(runtimeName, 'Godot JavaScript Runtime')
  assert.equal(runtimePackageName, 'godot-js-runtime')
  assert.equal(minimumGodotVersion, '4.4')
  assert.equal(commonJsBundleBanner, '/*! godot-js-runtime:format=commonjs */')
})

test('defineScript attaches canonical metadata without decorators', () => {
  class Player {}
  const defined = defineScript(Player, {
    properties: {
      speed: { type: 'float', default: 240 },
    },
    signals: {
      moved: [{ name: 'distance', type: 'float' }],
    },
  })

  assert.equal(defined, Player)
  assert.deepEqual(getScriptMetadata(Player), {
    properties: {
      speed: { type: 'float', default: 240 },
    },
    signals: {
      moved: [{ name: 'distance', type: 'float' }],
    },
  })
  assert.equal(getScriptMetadata(null), undefined)
})

test('runtime manifest guard rejects incomplete or invalid artifacts', () => {
  const manifest = {
    schemaVersion: 2,
    runtimeName,
    packageName: runtimePackageName,
    version: '0.0.1',
    gitCommit: '0123456789abcdef',
    godotMinimum: minimumGodotVersion,
    dependencies: [],
    archives: [],
    artifacts: [],
  }
  assert.equal(isRuntimeManifest(manifest), true)
  assert.equal(
    isRuntimeManifest({
      ...manifest,
      artifacts: [
        {
          name: 'bad',
          target: 'macos',
          size: -1,
          sha256: 'bad',
          archive: null,
          url: null,
        },
      ],
    }),
    false,
  )
})
