import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

export function readHtmlComponentNames(repoRoot = process.cwd()) {
  const pluginSource = fs.readFileSync(
    path.join(repoRoot, 'packages/html/src/plugin.ts'),
    'utf-8',
  )
  const match = pluginSource.match(
    /const components: Record<string, Component> = \{([\s\S]*?)\n\}/,
  )
  assert.ok(match, 'Unable to locate @vue-godot/html component registry')

  return match[1]
    .split('\n')
    .map((line) => line.trim().replace(/,$/, ''))
    .filter((line) => /^[A-Z][A-Za-z0-9]*$/.test(line))
    .sort()
}
