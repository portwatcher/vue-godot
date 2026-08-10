import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { generateEnvDtsSource, generateSource } from '../dist/index.js'

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-cli-gen-types-'))
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
}

test('generateSource emits method-filtered GlobalComponents without any', () => {
  const tempDir = createTempDir()
  try {
    writeFile(
      path.join(tempDir, 'godot0.gen.d.ts'),
      `declare module "godot" {
  export class Node<T = unknown> {}
  export class Control<T = unknown> extends Node<T> {
    disabled: boolean
    grab_focus(): void
  }
  export class Button<T = unknown> extends Control<T> {
    text: string
    pressed(): void
  }
}
`,
    )

    const source = generateSource({
      typingsDir: tempDir,
      outFile: path.join(tempDir, 'godot.vue-components.gen.d.ts'),
    })

    assert.match(
      source,
      /type GodotMethod = \(\.\.\.args: never\[\]\) => unknown/,
    )
    assert.match(source, /declare module "@vue\/runtime-core"/)
    assert.match(source, /declare module "vue"/)
    assert.match(
      source,
      /Button: new \(\) => \{ \$props: VueGodotComponentProps<import\("godot"\)\.Button> \}/,
    )
    assert.doesNotMatch(source, /\bany\b/)
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})

test('generateSource consumes standalone stock-Godot class declarations', () => {
  const tempDir = createTempDir()
  try {
    writeFile(
      path.join(tempDir, 'godot.d.ts'),
      `declare module 'godot' {
  export class Node {}
  export class CanvasItem extends Node {}
  export class Control extends CanvasItem {}
  export class BaseButton extends Control {}
  export class Button extends BaseButton {}
}
`,
    )

    const source = generateSource({
      typingsDir: tempDir,
      outFile: path.join(tempDir, 'godot.vue-components.gen.d.ts'),
    })

    assert.match(source, /Control: new \(\)/)
    assert.match(source, /BaseButton: new \(\)/)
    assert.match(source, /Button: new \(\)/)
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})

test('generateEnvDtsSource emits a Vue SFC shim without any', () => {
  const source = generateEnvDtsSource()

  assert.match(source, /DefineComponent</)
  assert.match(source, /Record<string, unknown>/)
  assert.doesNotMatch(source, /\bany\b/)
})
