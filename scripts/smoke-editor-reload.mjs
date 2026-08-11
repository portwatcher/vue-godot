import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  assertGeneratedOutputIgnoredByGodot,
  assertStableViteChunkNames,
  godotCommandArguments,
  assertNoGodotScriptLoadErrors,
  assertOfficialGodotExecutable,
  assertVueSourceIgnoredByGodot,
  createPackedPackageOverrides,
  installBuiltRuntime,
  nodeCommand,
  npmCommand,
  requireBuiltCli,
  resolveGodotCommand,
  run,
  runGodotImport,
  runGodotProjectUntilMarker,
  startNpmDevWatch,
  stopProcess,
  waitFor,
} from './smoke-utils.mjs'

const SMOKE_PREFIX = '[smoke-editor-reload]'
const PLUGIN_MARKER = '[vue-godot-editor-reload-smoke]'
const MODULE_MARKER_PREFIX = '[vue-godot-editor-module-smoke]'
const PLAY_MARKER_PREFIX = '[vue-godot-editor-play-smoke]'
const EDITOR_TIMEOUT_MS = 90_000
const INITIAL_SCENE_MARKER = `editor scene initial ${Date.now()}`
const UPDATED_SCENE_MARKER = `editor scene rebuilt ${Date.now()}`

function writeSmokeApp(projectDir, marker) {
  fs.writeFileSync(
    path.join(projectDir, 'vue/src/App.vue'),
    `<template>
  <div
    :style="{
      flexDirection: 'column',
      gap: 12,
      padding: 24,
      width: 680,
      backgroundColor: '#1f2937',
    }"
  >
    <span :style="{ fontSize: 34, color: '#f8fafc' }">${marker}</span>
    <button @click="count++">Clicked {{ count }} times</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>
`,
  )

  fs.writeFileSync(
    path.join(projectDir, 'vue/src/main.ts'),
    `import { installBrowserAPIs } from '@vue-godot/browser'
import { createApp } from '@vue-godot/runtime-tscn'
import { htmlPlugin } from '@vue-godot/html'
import { VBoxContainer } from 'godot'
import App from './App.vue'

const SMOKE_MARKER = ${JSON.stringify(marker)}

console.log(${JSON.stringify(MODULE_MARKER_PREFIX)} + ' ' + SMOKE_MARKER)

installBrowserAPIs()

export default class Root extends VBoxContainer {
  private app: ReturnType<typeof createApp> | null = null

  _ready() {
    this.app?.unmount()
    const app = createApp(App)
    app.use(htmlPlugin)
    app.mount(this)
    this.app = app
    console.log(${JSON.stringify(PLAY_MARKER_PREFIX)} + ' ' + SMOKE_MARKER)
    this.get_tree().quit(0)
  }

  _exit_tree() {
    this.app?.unmount()
    this.app = null
  }
}
`,
  )
}

function writeEditorReloadPlugin(projectDir) {
  const addonDir = path.join(projectDir, 'addons/vue_godot_editor_reload_smoke')
  fs.mkdirSync(addonDir, { recursive: true })

  fs.writeFileSync(
    path.join(addonDir, 'plugin.cfg'),
    `[plugin]
name="Vue Godot Editor Reload Smoke"
description="Generated editor reload smoke"
author="vue-godot"
version="1.0"
script="plugin.gd"
`,
  )

  fs.writeFileSync(
    path.join(addonDir, 'plugin.gd'),
    `@tool
extends EditorPlugin

const MARKER := "${PLUGIN_MARKER}"
const WATCHED_CHUNK := "res://dist/chunks/main.js"

var fs: EditorFileSystem
var scan_timer: Timer
var content_hash := ""

func _enter_tree() -> void:
\tfs = EditorInterface.get_resource_filesystem()
\tcontent_hash = FileAccess.get_sha256(WATCHED_CHUNK)
\tscan_timer = Timer.new()
\tscan_timer.wait_time = 0.25
\tscan_timer.timeout.connect(_scan)
\tadd_child(scan_timer)
\tscan_timer.start()

\tprint(MARKER + " ready")

func _scan() -> void:
\tvar next_hash := FileAccess.get_sha256(WATCHED_CHUNK)
\tif next_hash.is_empty() or next_hash == content_hash:
\t\treturn
\tcontent_hash = next_hash
\tfs.update_file(WATCHED_CHUNK)
\tfs.scan()
\tprint(MARKER + " noticed rebuilt chunk " + content_hash)
`,
  )

  fs.appendFileSync(
    path.join(projectDir, 'project.godot'),
    `
[editor_plugins]

enabled=PackedStringArray("res://addons/vue_godot_editor_reload_smoke/plugin.cfg")
`,
  )
}

async function runEditorReloadSmoke(godot, projectDir) {
  let output = ''
  let wroteUpdatedSource = false
  let observedUpdatedModule = false

  const child = spawn(
    godot,
    godotCommandArguments(['--headless', '--editor', '--path', projectDir]),
    {
      cwd: projectDir,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  )

  const result = await new Promise((resolve, reject) => {
    let didSettle = false

    function settle(error, value) {
      if (didSettle) {
        return
      }
      didSettle = true
      clearTimeout(timeout)
      if (error) {
        reject(error)
        return
      }
      resolve(value)
    }

    const timeout = setTimeout(() => {
      child.kill('SIGTERM')
      settle(
        new Error(
          ['Timed out waiting for Godot editor reload markers', output]
            .filter(Boolean)
            .join('\n'),
        ),
      )
    }, EDITOR_TIMEOUT_MS)

    function handleOutput(chunk) {
      const text = String(chunk)
      output += text
      process.stdout.write(text)

      const initialModuleLog = `${MODULE_MARKER_PREFIX} ${INITIAL_SCENE_MARKER}`
      if (!wroteUpdatedSource && output.includes(initialModuleLog)) {
        wroteUpdatedSource = true
        writeSmokeApp(projectDir, UPDATED_SCENE_MARKER)
        console.log(
          `${SMOKE_PREFIX} wrote source marker ${JSON.stringify(
            UPDATED_SCENE_MARKER,
          )}`,
        )
      }

      const updatedModuleLog = `${MODULE_MARKER_PREFIX} ${UPDATED_SCENE_MARKER}`
      if (output.includes(updatedModuleLog)) {
        observedUpdatedModule = true
        child.kill('SIGTERM')
      }
    }

    child.stdout.setEncoding('utf-8')
    child.stderr.setEncoding('utf-8')
    child.stdout.on('data', handleOutput)
    child.stderr.on('data', handleOutput)
    child.on('error', (error) => settle(error))
    child.on('close', (code, signal) => {
      if (observedUpdatedModule) {
        settle(null, { code, signal })
        return
      }
      settle(
        new Error(
          [
            'Godot editor exited before the rebuilt module marker was observed',
            `status=${code ?? signal ?? 'unknown'}`,
            output,
          ]
            .filter(Boolean)
            .join('\n'),
        ),
      )
    })
  }).finally(async () => {
    await stopProcess(child)
  })

  assertNoGodotScriptLoadErrors(output, 'Godot editor reload smoke')
  console.log(
    `${SMOKE_PREFIX} editor process exited ${result.code ?? result.signal}`,
  )
}

const godot = resolveGodotCommand()
if (!godot) {
  console.log(
    `${SMOKE_PREFIX} skipped: set GODOT_BIN or install a godot/godot4 executable`,
  )
  process.exit(0)
}
assertOfficialGodotExecutable(godot)

const cliPath = requireBuiltCli()
const workspaceDir = fs.mkdtempSync(
  path.join(os.tmpdir(), 'vue-godot-editor-reload-smoke-'),
)
const packDir = path.join(workspaceDir, 'packs')
const projectDir = path.join(workspaceDir, 'html-app')
fs.mkdirSync(packDir)

const packageOverrides = createPackedPackageOverrides(packDir, {
  runtimeArtifacts: 'required',
})
const env = {
  ...process.env,
  VUE_GODOT_PACKAGE_OVERRIDES: JSON.stringify(packageOverrides),
}

console.log(`${SMOKE_PREFIX} workspace: ${workspaceDir}`)
run(nodeCommand, [cliPath, 'create', projectDir, '-f', '--html'], {
  env,
  stdio: 'inherit',
})
installBuiltRuntime(projectDir)
assertVueSourceIgnoredByGodot(projectDir)
assertGeneratedOutputIgnoredByGodot(projectDir)

writeSmokeApp(projectDir, INITIAL_SCENE_MARKER)
run(npmCommand, ['run', 'build'], {
  cwd: projectDir,
  env,
  stdio: 'inherit',
})
assertStableViteChunkNames(projectDir)
writeEditorReloadPlugin(projectDir)
runGodotImport(godot, projectDir)
await runGodotProjectUntilMarker(
  godot,
  projectDir,
  `${PLAY_MARKER_PREFIX} ${INITIAL_SCENE_MARKER}`,
  'editor reload initial scene run',
)
const watcher = startNpmDevWatch(projectDir, env)
try {
  await waitFor(
    () =>
      watcher.state.exited ||
      /built in \d/.test(watcher.state.stdout + watcher.state.stderr),
    'initial generated app Vite watch build',
  )
  if (watcher.state.exited) {
    throw new Error(
      [
        'Generated app watcher exited before editor reload smoke',
        watcher.state.stdout,
        watcher.state.stderr,
      ]
        .filter(Boolean)
        .join('\n'),
    )
  }

  await runEditorReloadSmoke(godot, projectDir)
  assertStableViteChunkNames(projectDir)
  await runGodotProjectUntilMarker(
    godot,
    projectDir,
    `${PLAY_MARKER_PREFIX} ${UPDATED_SCENE_MARKER}`,
    'editor reload rebuilt scene run',
  )
} finally {
  await watcher.stop()
}

console.log(`${SMOKE_PREFIX} generated HTML app editor reload smoke passed`)
