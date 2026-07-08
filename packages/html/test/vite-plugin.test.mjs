import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

const { vueGodotHtmlCss } = await import('../dist/vite.js')

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-html-vite-'))
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
}

test('Vite plugin rewrites CSS imports into html stylesheet registration modules', async () => {
  const tempDir = createTempDir()
  try {
    const cssPath = path.join(tempDir, 'src', 'app.css')
    writeFile(
      cssPath,
      `
        .card {
          padding: 12px;
        }
      `,
    )

    const plugin = vueGodotHtmlCss()
    plugin.configResolved({ root: tempDir })
    const resolved = await plugin.resolveId.call(
      {
        resolve: async (source, importer) => ({
          id: path.resolve(path.dirname(importer), source),
        }),
        warn: () => {},
      },
      './app.css',
      path.join(tempDir, 'src', 'main.ts'),
    )

    assert.equal(resolved, `\0vue-godot-html-css:${cssPath}`)

    const warnings = []
    const code = plugin.load.call(
      {
        resolve: async () => null,
        warn: (message) => warnings.push(String(message)),
      },
      resolved,
    )

    assert.equal(warnings.length, 0)
    assert.match(code, /registerHtmlStyleSheet/)
    assert.match(code, /src\/app\.css/)
    assert.match(code, /export default \{\}/)

    const transformed = plugin.transform.call(
      {
        resolve: async () => null,
        warn: (message) => warnings.push(String(message)),
      },
      '',
      cssPath,
    )

    assert.match(transformed, /registerHtmlStyleSheet/)
    assert.match(transformed, /src\/app\.css/)
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})

test('Vite plugin emits source-located CSS diagnostics and module class maps', async () => {
  const tempDir = createTempDir()
  try {
    const cssPath = path.join(tempDir, 'src', 'panel.module.css')
    writeFile(
      cssPath,
      `
        .panel > Button {
          color: red;
        }

        .primary-action {
          position: sticky;
          padding: 8px;
        }
      `,
    )

    const plugin = vueGodotHtmlCss()
    plugin.configResolved({ root: tempDir })
    const warnings = []
    const code = plugin.load.call(
      {
        resolve: async () => null,
        warn: (message) => warnings.push(String(message)),
      },
      `\0vue-godot-html-css:${cssPath}`,
    )

    assert.equal(warnings.length, 2)
    assert.match(warnings[0], /Unsupported selector/)
    assert.match(warnings[0], /src\/panel\.module\.css:2/)
    assert.match(warnings[1], /Unsupported property "position"/)
    assert.match(warnings[1], /src\/panel\.module\.css:6/)
    assert.match(code, /"primary-action":"primary-action"/)
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})
