import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const require = createRequire(import.meta.url)
const packageDir = dirname(
  fileURLToPath(new URL('../package.json', import.meta.url)),
)
const tscBin = require.resolve('typescript/bin/tsc')

const tsc = spawnSync(
  process.execPath,
  [tscBin, '-p', packageDir],
  {
    cwd: packageDir,
    stdio: 'inherit',
  },
)

if (tsc.status !== 0) {
  process.exit(tsc.status ?? 1)
}

mkdirSync(join(packageDir, 'dist'), { recursive: true })
copyFileSync(
  join(packageDir, 'types/globals.d.ts'),
  join(packageDir, 'dist/globals.d.ts'),
)
writeFileSync(join(packageDir, 'dist/globals.js'), 'export {};\n')
