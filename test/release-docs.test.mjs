import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const repoRoot = process.cwd()

function readDoc(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf-8')
}

test('real device release checklist covers required Android and iOS gates', () => {
  const checklist = readDoc('docs/real-device-release.md')

  for (const pattern of [
    /^# Real Device Release Checklist/m,
    /^## Required Evidence/m,
    /^## Common Gate/m,
    /^## Android Release Smoke/m,
    /^## iOS Release Smoke/m,
    /npm run check/,
    /npm audit --audit-level=moderate/,
    /npm run release:preflight/,
    /Godot Smoke workflow/,
    /APK\/AAB/,
    /archive, TestFlight, or hosted-device build identifier/,
    /export_presets\.cfg/,
    /dist\/chunks\/\*\.js/,
    /permission prompts and denied states/,
    /adapter states/,
    /missing plugin/,
    /export misconfiguration/,
    /successful native operation/,
    /SafeAreaView/,
    /KeyboardAvoidingView/,
    /Android back handling/,
    /safe area, virtual keyboard, rotation, and text input/,
    /background and foreground/i,
    /deep links[\s\S]*share sheets[\s\S]*notification\s+delivery/,
  ]) {
    assert.match(checklist, pattern)
  }
})

test('release documentation links the real device checklist', () => {
  const linkedDocs = [
    'README.md',
    'docs/production.md',
    'docs/platforms/android.md',
    'docs/platforms/ios.md',
  ]

  for (const relativePath of linkedDocs) {
    assert.match(
      readDoc(relativePath),
      /real device release checklist/i,
      `${relativePath} must link the real device release checklist`,
    )
  }
})

test('serious example app criteria are documented and linked', () => {
  const criteria = readDoc('docs/example-apps.md')

  for (const pattern of [
    /^# Serious Example App Criteria/m,
    /^## Required Design Context/m,
    /target audience and usage context/,
    /primary jobs the user is trying to complete/,
    /brand personality and interface tone/,
    /^## Native App Demo/m,
    /multi-screen routing/,
    /network loading, failure, retry, and reachability\/offline states/,
    /permission query\/request-denied flows/,
    /^## Game UI Demo/m,
    /Godot scene with Vue-rendered HUD or menu UI/,
    /controller, keyboard, and touch-oriented navigation paths/,
    /pause, settings, and inventory or loadout workflows/,
    /^## Verification/m,
    /test\/fixture-apps\.test\.mjs/,
    /npm run check/,
  ]) {
    assert.match(criteria, pattern)
  }

  for (const relativePath of ['README.md', 'docs/production.md', 'TODO.md']) {
    assert.match(
      readDoc(relativePath),
      /docs\/example-apps\.md|example-apps\.md|example app criteria/i,
      `${relativePath} must link the serious example app criteria`,
    )
  }
})
