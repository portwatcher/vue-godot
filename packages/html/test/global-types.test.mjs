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
            godot: ['../../packages/godot-js-runtime/typings/godot.d.ts'],
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
import { registerStyleKeyframes } from '@vue-godot/html'
import type { GlobalComponents as RuntimeGlobalComponents } from '@vue/runtime-core'
import type { HtmlStyle, HtmlStyleInput } from '@vue-godot/html'

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

const htmlStyle: HtmlStyle = {
  flexDirection: 'row',
  gap: 8,
  width: '50%',
  transform: 'translateY(2px)',
  animationName: 'pulse',
  animationDuration: '400ms',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
  animationDirection: 'normal',
  transitionProperty: ['opacity', 'transform'],
  transitionDuration: ['120ms', 0.2],
  transitionTimingFunction: 'ease-out',
}
const divStyle: NonNullable<DivProps['style']> = htmlStyle
const cssStyle: NonNullable<DivProps['style']> =
  'flex-direction: row; gap: 8px; width: 50%; transform: translateY(2px)'
const styleArray: NonNullable<LowercaseDivProps['style']> = [
  cssStyle,
  htmlStyle,
]
const styleInput: HtmlStyleInput = styleArray
const lowercaseStyle: NonNullable<LowercaseDivProps['style']> = styleInput
const unregisterKeyframes = registerStyleKeyframes('pulse', [
  { offset: 0, style: { opacity: 0.5, transform: 'scale(1)' } },
  { offset: 1, style: { opacity: 1, transform: 'scale(1.1)' } },
])
const disabled: boolean | undefined = ({} as ButtonProps).disabled
const inputModel: string | number | boolean | undefined =
  ({} as InputProps).modelValue

// @ts-expect-error unsupported CSS properties are not part of HtmlStyle
const badStyle: HtmlStyle = { position: 'absolute' }

void lowercaseStyle
void cssStyle
void styleArray
void styleInput
void unregisterKeyframes
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
