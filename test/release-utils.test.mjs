import assert from 'node:assert/strict'
import test from 'node:test'

import {
  isFullCommitSha,
  normalizeCommitSha,
  shellQuote,
} from '../scripts/release-utils.mjs'

const commit = '0123456789abcdef0123456789abcdef01234567'

test('normalizeCommitSha accepts optional and full SHA values', () => {
  assert.equal(isFullCommitSha(commit), true)
  assert.equal(isFullCommitSha(commit.toUpperCase()), true)
  assert.equal(isFullCommitSha(` ${commit} `), false)
  assert.equal(isFullCommitSha(commit.slice(0, 12)), false)
  assert.equal(normalizeCommitSha(null), null)
  assert.equal(normalizeCommitSha(` ${commit} `), commit)
  assert.equal(normalizeCommitSha(commit.toUpperCase()), commit.toUpperCase())
})

test('normalizeCommitSha rejects branch names, short SHAs, and blank values', () => {
  assert.throws(
    () => normalizeCommitSha('release-candidate'),
    /--commit must be a full 40-character git commit SHA/,
  )
  assert.throws(
    () => normalizeCommitSha(commit.slice(0, 12), '--expected-commit'),
    /--expected-commit must be a full 40-character git commit SHA/,
  )
  assert.throws(
    () => normalizeCommitSha('   ', '--expected-commit'),
    /--expected-commit requires a value/,
  )
})

test('shellQuote leaves safe tokens readable and quotes shell-sensitive values', () => {
  assert.equal(shellQuote('develop'), 'develop')
  assert.equal(shellQuote('release/candidate-1'), 'release/candidate-1')
  assert.equal(shellQuote('release candidate'), "'release candidate'")
  assert.equal(shellQuote("release'candidate"), "'release'\\''candidate'")
  assert.equal(shellQuote('release;candidate'), "'release;candidate'")
})
