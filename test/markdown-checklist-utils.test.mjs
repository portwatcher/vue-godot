import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  formatChecklistLine,
  formatChecklistValue,
  formatIssueLines,
  splitIssueLines,
} from '../scripts/markdown-checklist-utils.mjs'

test('formatChecklistLine renders checked and unchecked Markdown rows', () => {
  assert.equal(formatChecklistLine(true, 'CI', 'passed'), '- [x] CI: passed')
  assert.equal(
    formatChecklistLine(false, 'Evidence', 'missing'),
    '- [ ] Evidence: missing',
  )
})

test('formatChecklistValue renders release checklist scalar values', () => {
  assert.equal(formatChecklistValue(true), 'yes')
  assert.equal(formatChecklistValue(false), 'no')
  assert.equal(formatChecklistValue(3), '3')
  assert.equal(
    formatChecklistValue('  release/ci-runs.json  '),
    'release/ci-runs.json',
  )
  assert.equal(formatChecklistValue(null), 'missing')
})

test('formatChecklistValue supports preflight checklist value variants', () => {
  assert.equal(
    formatChecklistValue(true, {
      booleanStyle: 'true-false',
      missing: '(missing)',
    }),
    'true',
  )
  assert.equal(
    formatChecklistValue('  kept  ', {
      missing: '(not recorded)',
      trimString: false,
    }),
    '  kept  ',
  )
  assert.equal(
    formatChecklistValue(false, {
      includeBooleans: false,
      missing: '(not recorded)',
    }),
    '(not recorded)',
  )
})

test('splitIssueLines and formatIssueLines preserve multiline blockers', () => {
  assert.deepEqual(splitIssueLines(['first\n second ', '', 'third']), [
    'first',
    'second',
    'third',
  ])
  assert.deepEqual(formatIssueLines('Blockers', ['first\nsecond']), [
    '- Blockers:',
    '  - first',
    '    second',
  ])
})
