import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { readHtmlComponentNames } from './utils/html-components.mjs'

const repoRoot = process.cwd()
const appSource = fs.readFileSync(
  path.join(repoRoot, 'apps/html-demo/vue/src/App.vue'),
  'utf-8',
)
const browserSmokeSource = fs.readFileSync(
  path.join(repoRoot, 'apps/html-demo/vue/src/browserSmoke.ts'),
  'utf-8',
)

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

test('html-demo renders every registered html component', () => {
  for (const componentName of readHtmlComponentNames(repoRoot)) {
    assert.match(
      appSource,
      new RegExp(`<${escapeRegExp(componentName)}\\b`),
      `Expected apps/html-demo to render <${componentName}>`,
    )
  }
})

test('html-demo exercises Audio with a real source and playback props', () => {
  assert.match(appSource, /const demoAudioDataUri =/)
  assert.match(appSource, /<Audio[\s\S]*:src="demoAudioDataUri"/)
  assert.match(appSource, /<Audio[\s\S]*:autoplay="true"/)
  assert.match(appSource, /<Audio[\s\S]*@ended="onAudioEnded"/)
  assert.doesNotMatch(appSource, /Audio \(no src in demo\)/)
})

test('html-demo wires browser and device smoke coverage into the app', () => {
  assert.match(appSource, /runBrowserSmokeTests/)
  assert.match(appSource, /Browser API smoke tests/)

  for (const smokeName of [
    'device capability registry',
    'device capability errors',
    'device adapter guards',
    'device geolocation adapter',
    'device media devices adapter',
  ]) {
    assert.match(
      browserSmokeSource,
      new RegExp(`'${escapeRegExp(smokeName)}'`),
      `Expected browser smoke runner to cover ${smokeName}`,
    )
  }
})
