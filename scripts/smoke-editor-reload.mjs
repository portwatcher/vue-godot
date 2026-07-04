import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  assertGeneratedOutputIgnoredByGodot,
  assertNoGodotScriptLoadErrors,
  assertVueSourceIgnoredByGodot,
  createPackedPackageOverrides,
  nodeCommand,
  npmCommand,
  requireBuiltCli,
  resolveGodotCommand,
  run,
  runGodotImport,
  stopProcess,
} from './smoke-utils.mjs'

const SMOKE_PREFIX = '[smoke-editor-reload]'
const PLUGIN_MARKER = '[vue-godot-editor-reload-smoke]'
const EDITOR_TIMEOUT_MS = 90_000
const RELOAD_TOKENS = [
  `editor reload ${Date.now()} first`,
  `editor reload ${Date.now()} second`,
]

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
const TARGET := "res://dist/app.js"

var fs: EditorFileSystem
var scan_timer: Timer
var ready_timer: Timer
var ticks := 0

func _enter_tree() -> void:
\tfs = EditorInterface.get_resource_filesystem()
\tready_timer = Timer.new()
\tready_timer.one_shot = true
\tready_timer.wait_time = 2.0
\tready_timer.timeout.connect(_mark_ready)
\tadd_child(ready_timer)
\tready_timer.start()

\tscan_timer = Timer.new()
\tscan_timer.wait_time = 0.25
\tscan_timer.timeout.connect(_scan)
\tadd_child(scan_timer)

func _mark_ready() -> void:
\tprint(MARKER + " ready")
\tscan_timer.start()

func _scan() -> void:
\tticks += 1
\tfs.update_file(TARGET)
\tfs.scan()
\tif ticks > 240:
\t\tpush_error(MARKER + " timed out waiting for reload")
\t\tget_tree().quit(1)
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

function appendReloadToken(projectDir, token) {
  fs.appendFileSync(
    path.join(projectDir, 'dist/app.js'),
    `\nconsole.log(${JSON.stringify(token)});\n`,
  )
  console.log(`${SMOKE_PREFIX} wrote ${JSON.stringify(token)}`)
}

async function runEditorReloadSmoke(godot, projectDir) {
  let output = ''
  let nextTokenIndex = 0
  let ready = false
  let observedAllTokens = false

  const child = spawn(godot, ['--headless', '--editor', '--path', projectDir], {
    cwd: projectDir,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

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

    function writeNextToken() {
      const token = RELOAD_TOKENS[nextTokenIndex]
      if (!token) {
        return
      }
      appendReloadToken(projectDir, token)
    }

    function handleOutput(chunk) {
      const text = String(chunk)
      output += text
      process.stdout.write(text)

      if (!ready && output.includes(`${PLUGIN_MARKER} ready`)) {
        ready = true
        writeNextToken()
      }

      const expectedToken = RELOAD_TOKENS[nextTokenIndex]
      if (!expectedToken || !output.includes(`[JS] ${expectedToken}`)) {
        return
      }

      nextTokenIndex += 1
      if (nextTokenIndex === RELOAD_TOKENS.length) {
        observedAllTokens = true
        child.kill('SIGTERM')
        return
      }

      setTimeout(writeNextToken, 500)
    }

    child.stdout.setEncoding('utf-8')
    child.stderr.setEncoding('utf-8')
    child.stdout.on('data', handleOutput)
    child.stderr.on('data', handleOutput)
    child.on('error', (error) => settle(error))
    child.on('close', (code, signal) => {
      if (observedAllTokens) {
        settle(null, { code, signal })
        return
      }
      settle(
        new Error(
          [
            'Godot editor exited before all reload markers were observed',
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

const cliPath = requireBuiltCli()
const workspaceDir = fs.mkdtempSync(
  path.join(os.tmpdir(), 'vue-godot-editor-reload-smoke-'),
)
const packDir = path.join(workspaceDir, 'packs')
const projectDir = path.join(workspaceDir, 'html-app')
fs.mkdirSync(packDir)

const packageOverrides = createPackedPackageOverrides(packDir)
const env = {
  ...process.env,
  VUE_GODOT_PACKAGE_OVERRIDES: JSON.stringify(packageOverrides),
}

console.log(`${SMOKE_PREFIX} workspace: ${workspaceDir}`)
run(nodeCommand, [cliPath, 'create', projectDir, '-f', '--html'], {
  env,
  stdio: 'inherit',
})
assertVueSourceIgnoredByGodot(projectDir)
assertGeneratedOutputIgnoredByGodot(projectDir)

run(npmCommand, ['run', 'build'], {
  cwd: projectDir,
  env,
  stdio: 'inherit',
})
writeEditorReloadPlugin(projectDir)
runGodotImport(godot, projectDir)
await runEditorReloadSmoke(godot, projectDir)

console.log(`${SMOKE_PREFIX} generated HTML app editor reload smoke passed`)
