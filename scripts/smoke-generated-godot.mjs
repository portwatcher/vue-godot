import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  assertOfficialGodotExecutable,
  assertGeneratedOutputIgnoredByGodot,
  assertStableViteChunkNames,
  assertVueSourceIgnoredByGodot,
  createPackedPackageOverrides,
  directoryContainsText,
  installBuiltRuntime,
  nodeCommand,
  npmCommand,
  requireBuiltCli,
  resolveGodotCommand,
  run,
  runGodotImport,
  runGodotProjectUntilMarker,
  startNpmDevWatch,
  waitFor,
} from './smoke-utils.mjs'

const SMOKE_MARKER_PREFIX = '[vue-godot-generated-smoke]'
const INITIAL_MARKER = `generated initial ${Date.now()}`
const UPDATED_MARKER = `generated rebuilt ${Date.now()}`

function writeSmokeApp(projectDir, marker) {
  const appVuePath = path.join(projectDir, 'vue/src/App.vue')
  fs.writeFileSync(
    appVuePath,
    `<template>
  <div :style="{ flexDirection: 'column', gap: 8, padding: 12 }">
    <span :style="{ fontSize: 20, color: '#f8fafc' }">{{ marker }}</span>
    <button @click="count++">Clicked {{ count }} times</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const marker = ${JSON.stringify(marker)}
const count = ref(0)

onMounted(() => {
  console.log(${JSON.stringify(SMOKE_MARKER_PREFIX)} + ' ' + marker)
})
</script>
`,
  )
}

const godot = resolveGodotCommand()
if (!godot) {
  console.log(
    '[smoke-generated-godot] skipped: set GODOT_BIN or install a godot/godot4 executable',
  )
  process.exit(0)
}
assertOfficialGodotExecutable(godot)

const cliPath = requireBuiltCli()
const workspaceDir = fs.mkdtempSync(
  path.join(os.tmpdir(), 'vue-godot-generated-godot-smoke-'),
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

console.log(`[smoke-generated-godot] workspace: ${workspaceDir}`)
run(nodeCommand, [cliPath, 'create', projectDir, '-f', '--html'], {
  env,
  stdio: 'inherit',
})
installBuiltRuntime(projectDir)
assertVueSourceIgnoredByGodot(projectDir)
assertGeneratedOutputIgnoredByGodot(projectDir)

writeSmokeApp(projectDir, INITIAL_MARKER)
run(npmCommand, ['run', 'build'], {
  cwd: projectDir,
  env,
  stdio: 'inherit',
})
assertStableViteChunkNames(projectDir)
runGodotImport(godot, projectDir)
await runGodotProjectUntilMarker(
  godot,
  projectDir,
  `${SMOKE_MARKER_PREFIX} ${INITIAL_MARKER}`,
  'generated initial Godot run',
)

const watcher = startNpmDevWatch(projectDir)
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
        'Generated app watcher exited before rebuild',
        watcher.state.stdout,
        watcher.state.stderr,
      ]
        .filter(Boolean)
        .join('\n'),
    )
  }

  writeSmokeApp(projectDir, UPDATED_MARKER)
  await waitFor(
    () => directoryContainsText(path.join(projectDir, 'dist'), UPDATED_MARKER),
    'generated app watch rebuild output',
  )
  assertStableViteChunkNames(projectDir)
} finally {
  await watcher.stop()
}

await runGodotProjectUntilMarker(
  godot,
  projectDir,
  `${SMOKE_MARKER_PREFIX} ${UPDATED_MARKER}`,
  'generated rebuilt Godot run',
)
console.log('[smoke-generated-godot] generated HTML app Godot smoke passed')
