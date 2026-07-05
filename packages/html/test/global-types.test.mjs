import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const require = createRequire(import.meta.url)
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const fixtureDir = join(repoRoot, '.cache/html-global-types')
const tscBin = require.resolve('typescript/bin/tsc')

test('html package exposes typed PascalCase and lowercase GlobalComponents', () => {
  rmSync(fixtureDir, { recursive: true, force: true })
  mkdirSync(fixtureDir, { recursive: true })

  writeFileSync(
    join(fixtureDir, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          moduleResolution: 'bundler',
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          lib: ['ES2020', 'DOM'],
          paths: {
            godot: ['../../packages/runtime-tscn/typings/godot.mix.d.ts'],
          },
        },
        include: ['index.ts'],
      },
      null,
      2,
    ),
  )

  writeFileSync(
    join(fixtureDir, 'index.ts'),
    `import '@vue-godot/html'
import type { GlobalComponents as RuntimeGlobalComponents } from '@vue/runtime-core'
import type { HtmlStyle } from '@vue-godot/html'

type Assert<T extends true> = T
type HasKey<T, K extends PropertyKey> = K extends keyof T ? true : false
type ComponentProps<C> = C extends new (...args: never[]) => { $props: infer P }
  ? P
  : never

type RuntimeHasPascal = Assert<HasKey<RuntimeGlobalComponents, 'Div'>>
type RuntimeHasLowercase = Assert<HasKey<RuntimeGlobalComponents, 'div'>>

type DivProps = ComponentProps<RuntimeGlobalComponents['Div']>
type LowercaseDivProps = ComponentProps<RuntimeGlobalComponents['div']>
type ButtonProps = ComponentProps<RuntimeGlobalComponents['Button']>
type InputProps = ComponentProps<RuntimeGlobalComponents['Input']>

const divStyle: NonNullable<DivProps['style']> = {
  flexDirection: 'row',
  gap: 8,
  width: '50%',
  transform: 'translateY(2px)',
  transitionProperty: ['opacity', 'transform'],
  transitionDuration: ['120ms', 0.2],
  transitionTimingFunction: 'ease-out',
}
const htmlStyle: HtmlStyle = divStyle
const lowercaseStyle: NonNullable<LowercaseDivProps['style']> = htmlStyle
const disabled: boolean | undefined = ({} as ButtonProps).disabled
const inputModel: string | number | boolean | undefined =
  ({} as InputProps).modelValue

// @ts-expect-error unsupported CSS properties are not part of HtmlStyle
const badStyle: HtmlStyle = { position: 'absolute' }

void lowercaseStyle
void disabled
void inputModel
void badStyle
`,
  )

  const result = spawnSync(process.execPath, [tscBin, '-p', fixtureDir], {
    cwd: repoRoot,
    encoding: 'utf8',
  })

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
