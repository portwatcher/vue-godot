import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const appsDir = path.join(repoRoot, 'apps')
const markerContents =
  '# Keep installed JavaScript packages out of Godot resource scans.\n'

let created = 0
for (const entry of fs.readdirSync(appsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) {
    continue
  }
  const projectDir = path.join(appsDir, entry.name)
  if (
    !fs.existsSync(path.join(projectDir, 'package.json')) ||
    !fs.existsSync(path.join(projectDir, 'project.godot'))
  ) {
    continue
  }

  const markerPath = path.join(projectDir, 'node_modules', '.gdignore')
  fs.mkdirSync(path.dirname(markerPath), { recursive: true })
  if (fs.existsSync(markerPath)) {
    continue
  }
  fs.writeFileSync(markerPath, markerContents)
  created += 1
}

console.log(
  `[godot-scan-ignores] ${created === 0 ? 'verified' : `created ${created}`} app node_modules marker${created === 1 ? '' : 's'}`,
)
