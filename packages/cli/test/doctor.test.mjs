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
      report.checks.some(
        (check) => check.label === 'export_presets.cfg not found',
      ),
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
        'install:runtime': 'godot-js-runtime install --project .',
        'verify:runtime': 'godot-js-runtime verify --project .',
        'setup:runtime': 'npm run install:runtime && npm run gen:types',
      },
      dependencies: {
        '@vue-godot/runtime-tscn': '^0.0.2',
        '@vue/runtime-core': '^3.5.14',
        'godot-js-runtime': '^0.0.1',
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
    writeFile(path.join(tempDir, 'typings/godot.d.ts'), '')
    writeFile(path.join(tempDir, 'typings/godot-js.d.ts'), '')
    writeFile(path.join(tempDir, 'typings/godot-jsb.d.ts'), '')
    writeFile(path.join(tempDir, 'typings/index.d.ts'), '')
    writeFile(path.join(tempDir, 'typings/manifest.json'), '{}\n')
    writeFile(path.join(tempDir, 'typings/godot.vue-components.gen.d.ts'), '')
    writeFile(path.join(tempDir, 'dist/app.js'), '')

    const report = diagnoseProject({
      targetDir: tempDir,
      nodeVersion: '20.0.0',
    })

    assert.equal(report.errorCount, 0)
    assert.ok(
      report.checks.some(
        (check) => check.label === 'Node.js version is supported',
      ),
    )
    assert.ok(
      report.checks.some((check) => check.label === 'node_modules not found'),
    )
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})

test('migration diagnostics distinguish small, medium, and rewrite areas', () => {
  const tempDir = createTempDir()
  try {
    writeJson(path.join(tempDir, 'package.json'), {
      scripts: {
        build: 'vite build -c vue/vite.config.ts',
        'gen:types': 'vue-godot gen-types',
        'install:runtime': 'godot-js-runtime install --project .',
        'verify:runtime': 'godot-js-runtime verify --project .',
        'setup:runtime': 'npm run install:runtime && npm run gen:types',
      },
      dependencies: {
        '@vue-godot/browser': '^0.0.2',
        '@vue-godot/device': '^0.0.2',
        '@vue-godot/html': '^0.0.2',
        '@vue-godot/runtime-tscn': '^0.0.2',
        '@vue/runtime-core': '^3.5.14',
        'godot-js-runtime': '^0.0.1',
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
    writeJson(path.join(tempDir, 'vue/tsconfig.json'), {
      vueCompilerOptions: {
        plugins: ['@vue-godot/html/volar-plugin'],
      },
    })
    writeFile(
      path.join(tempDir, 'vue/src/App.vue'),
      `<template>
  <div class="card">
    <button>Save</button>
  </div>
</template>

<script setup lang="ts">
document.querySelector('#save')
const selected: HTMLElement | null = null
</script>
`,
    )
    writeFile(
      path.join(tempDir, 'vue/src/app.css'),
      `.card > button {
  position: fixed;
  box-shadow: 0 2px 8px black;
}

@keyframes spin {
  from { opacity: 0; }
  to { opacity: 1; }
}
`,
    )

    const report = diagnoseProject({
      targetDir: tempDir,
      migration: true,
      nodeVersion: '20.0.0',
    })
    const audit = report.checks.find((check) =>
      check.label.startsWith('Migration audit:'),
    )

    assert.ok(audit)
    assert.equal(audit.status, 'warning')
    assert.equal(audit.label, 'Migration audit: rewrite')
    assert.ok(
      audit.details.some((detail) => detail === 'Small-change areas: 3.'),
    )
    assert.ok(audit.details.some((detail) => detail === 'Medium areas: 3.'))
    assert.ok(audit.details.some((detail) => detail === 'Rewrite areas: 2.'))
    assert.ok(
      audit.details.some((detail) =>
        detail.includes('vue/src/app.css:1 Selector ".card > button"'),
      ),
    )
    assert.ok(
      audit.details.some((detail) =>
        detail.includes('CSS property "position"'),
      ),
    )
    assert.ok(
      audit.details.some((detail) =>
        detail.includes('CSS property "box-shadow"'),
      ),
    )
    assert.ok(
      audit.details.some((detail) =>
        detail.includes('Unsupported CSS at-rule "@keyframes spin"'),
      ),
    )
    assert.ok(
      audit.details.some((detail) => detail.includes('Direct DOM querying')),
    )
    assert.ok(
      audit.details.some((detail) =>
        detail.includes('Browser DOM types or observers'),
      ),
    )
    assert.ok(
      audit.details.some((detail) =>
        detail.includes('Browser tag <div> can map to <Div>'),
      ),
    )
    assert.ok(
      audit.details.some((detail) =>
        detail.includes('Browser tag <button> can map to <Button>'),
      ),
    )
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
})
