import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { diagnoseProject } from '../dist/doctor.js'

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-cli-doctor-'))
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
}

function writeJson(filePath, value) {
  writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

test('exports-only diagnostics warn for detected camera export settings', () => {
  const tempDir = createTempDir()
  try {
    writeFile(
      path.join(tempDir, 'vue/src/App.vue'),
      '<template><CameraView></CameraView></template>\n',
    )

    const report = diagnoseProject({
      targetDir: tempDir,
      exportsOnly: true,
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 1)
    assert.ok(
      report.checks.some(
        (check) => check.label === 'Detected export-sensitive APIs',
      ),
    )
    assert.ok(
      report.checks.some((check) => check.label === 'export_presets.cfg not found'),
    )
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})

test('project diagnostics accept a minimal generated project shape', () => {
  const tempDir = createTempDir()
  try {
    writeJson(path.join(tempDir, 'package.json'), {
      scripts: {
        build: 'vite build -c vue/vite.config.ts',
        'gen:types': 'vue-godot gen-types',
      },
      dependencies: {
        '@vue-godot/runtime-tscn': '^0.0.2',
        '@vue/runtime-core': '^3.5.14',
      },
      devDependencies: {
        '@vue-godot/cli': '^0.0.3',
        vite: '^6.3.5',
      },
    })
    writeFile(path.join(tempDir, 'project.godot'), 'config_version=5\n')
    writeFile(
      path.join(tempDir, 'vue/vite.config.ts'),
      'export default { plugins: [{ template: { compilerOptions: { isNativeTag: () => false } } }] }\n',
    )
    writeFile(
      path.join(tempDir, 'vue/src/main.ts'),
      "import { createApp } from '@vue-godot/runtime-tscn'\n",
    )
    writeFile(path.join(tempDir, 'vue/.gdignore'), '')
    writeFile(path.join(tempDir, 'gen/.gdignore'), '')
    writeFile(path.join(tempDir, 'typings/.gdignore'), '')
    writeFile(path.join(tempDir, 'typings/godot0.gen.d.ts'), '')
    writeFile(path.join(tempDir, 'typings/godot.vue-components.gen.d.ts'), '')
    writeFile(path.join(tempDir, 'dist/app.js'), '')

    const report = diagnoseProject({
      targetDir: tempDir,
      nodeVersion: '20.0.0',
    })

    assert.equal(report.errorCount, 0)
    assert.ok(
      report.checks.some((check) => check.label === 'Node.js version is supported'),
    )
    assert.ok(
      report.checks.some((check) => check.label === 'node_modules not found'),
    )
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})
