import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { generateEnvDtsSource, generateSource } from '../dist/index.js'

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)

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
      path.join(tempDir, 'godot.d.ts'),
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

test('generateSource follows transitive stock-Godot class inheritance', () => {
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

test('generateSource omits component names owned by an optional renderer', () => {
  const tempDir = createTempDir()
  try {
    writeFile(
      path.join(tempDir, 'godot.d.ts'),
      `declare module 'godot' {
  export class Node {}
  export class Control extends Node {}
  export class Button extends Control {}
  export class ColorRect extends Control {}
}
`,
    )

    const source = generateSource({
      typingsDir: tempDir,
      outFile: path.join(tempDir, 'godot.vue-components.gen.d.ts'),
      excludeComponents: ['button'],
    })

    assert.match(source, /Control: new \(\)/)
    assert.match(source, /ColorRect: new \(\)/)
    assert.doesNotMatch(source, /^\s+Button: new \(\)/m)
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

test('gen-types generates standalone declarations before Vue components', () => {
  const tempDir = createTempDir()
  try {
    writeFile(path.join(tempDir, 'project.godot'), 'config_version=5\n')
    writeFile(path.join(tempDir, 'vue/src/main.ts'), '')
    const result = spawnSync(
      process.execPath,
      [path.join(packageRoot, 'dist/cli.js'), 'gen-types'],
      { cwd: tempDir, encoding: 'utf-8' },
    )
    assert.equal(result.status, 0, result.stderr)
    for (const relativePath of [
      'typings/godot.d.ts',
      'typings/godot-js.d.ts',
      'typings/godot-jsb.d.ts',
      'typings/index.d.ts',
      'typings/manifest.json',
      'typings/godot.vue-components.gen.d.ts',
      'vue/src/env.d.ts',
    ]) {
      assert.equal(fs.existsSync(path.join(tempDir, relativePath)), true)
    }
    assert.match(result.stdout, /generated 5 declaration file/i)
    assert.match(result.stdout, /Control-derived component types/)
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})

test('gen-types detects HTML projects and avoids global component collisions', () => {
  const tempDir = createTempDir()
  try {
    writeFile(path.join(tempDir, 'project.godot'), 'config_version=5\n')
    writeFile(path.join(tempDir, 'vue/src/main.ts'), '')
    writeFile(
      path.join(tempDir, 'package.json'),
      JSON.stringify({ dependencies: { '@vue-godot/html': '*' } }),
    )
    const result = spawnSync(
      process.execPath,
      [path.join(packageRoot, 'dist/cli.js'), 'gen-types'],
      { cwd: tempDir, encoding: 'utf-8' },
    )
    assert.equal(result.status, 0, result.stderr)
    const source = fs.readFileSync(
      path.join(tempDir, 'typings/godot.vue-components.gen.d.ts'),
      'utf-8',
    )
    assert.match(source, /ColorRect: new \(\)/)
    assert.doesNotMatch(source, /^\s+Button: new \(\)/m)
    assert.doesNotMatch(source, /^\s+Label: new \(\)/m)
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})
