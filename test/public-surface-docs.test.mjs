import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import {
  collectHtmlTagMirrorErrors,
  collectPublicSurfaceAuditErrors,
} from '../scripts/public-surface-audit.mjs'

const repoRoot = process.cwd()

function readDoc(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf-8')
}

function assertPatterns(relativePath, patterns) {
  const source = readDoc(relativePath)

  for (const pattern of patterns) {
    assert.match(
      source,
      pattern,
      `${relativePath} must include ${pattern.toString()}`,
    )
  }
}

function assertNoPatterns(relativePath, patterns) {
  const source = readDoc(relativePath)

  for (const pattern of patterns) {
    assert.doesNotMatch(
      source,
      pattern,
      `${relativePath} must not include ${pattern.toString()}`,
    )
  }
}

test('public surface audit passes for package READMEs, docs, templates, and demos', () => {
  assert.deepEqual(collectPublicSurfaceAuditErrors(), [])
})

test('public surface audit detects stale htmlTags mirrors', () => {
  const source = [
    'const htmlTags = [',
    "  'div',",
    "  'div',",
    "  'legacytag',",
    ']',
  ].join('\n')

  const errors = collectHtmlTagMirrorErrors('fixture/vite.config.ts', source, [
    'button',
    'div',
    'span',
  ]).join('\n')

  assert.match(errors, /htmlTags contains duplicate div/)
  assert.match(errors, /htmlTags is missing button, span/)
  assert.match(errors, /htmlTags contains unexpected legacytag/)
})

test('root README describes Vue rendering into native Godot scenes', () => {
  assertPatterns('README.md', [
    /Write native apps and Godot game UI using Vue\.js\./,
    /renders Vue Single File Components into Godot's native scene tree/,
  ])
})

test('public docs do not include retired preview warning wording', () => {
  assertNoPatterns('README.md', [
    /experimental and not production ready yet/,
    /preview\/experimental/,
  ])
  assertNoPatterns('docs/compatibility.md', [/project is still experimental/])
})
