import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import {
  applyReleaseReadinessFinalization,
  validateFinalizationSummary,
} from '../scripts/finalize-release-readiness.mjs'
import {
  collectFinalTodoRequirementStatuses,
  collectTodoItems,
  collectWarningMarkerHits,
} from '../scripts/release-readiness.mjs'

const repoRoot = process.cwd()
const finalizationFiles = [
  'TODO.md',
  'README.md',
  'docs/compatibility.md',
  'docs/production.md',
  'docs/real-device-release.md',
]

function readSources() {
  return Object.fromEntries(
    finalizationFiles.map((file) => [
      file,
      fs.readFileSync(path.join(repoRoot, file), 'utf-8'),
    ]),
  )
}

function prefinalSources() {
  const sources = readSources()

  sources['TODO.md'] = sources['TODO.md']
    .replace(
      [
        '- Release Preflight evidence, final public support-claim docs, and public',
        '  warning wording removal are complete for the production readiness gate.',
      ].join('\n'),
      [
        '- The project is not yet production ready because Release Preflight evidence,',
        '  final public support-claim docs, and public warning wording removal are still',
        '  incomplete.',
      ].join('\n'),
    )
    .replace(
      '- [x] The wording "not production ready", "alpha", and "experimental" is removed only after all criteria above are satisfied.',
      '- [ ] The wording "not production ready", "alpha", and "experimental" is removed only after all criteria above are satisfied.',
    )
    .replace(
      '- [x] CI passes on a clean commit.',
      '- [ ] CI passes on a clean commit.',
    )
    .replace(
      '- [x] Release preflight passes without warnings in the release environment.',
      '- [ ] Release preflight passes without warnings in the release environment.',
    )
    .replace(
      '- [x] All public READMEs match the final support claims.',
      '- [ ] All public READMEs match the final support claims.',
    )
    .replace(
      '- [x] The root README warning is removed in the same commit that marks this checklist complete.',
      '- [ ] The root README warning is removed in the same commit that marks this checklist complete.',
    )

  sources['README.md'] = sources['README.md']
    .replace(
      'See the [compatibility checklist](./docs/compatibility.md)',
      [
        'This project is experimental and not production ready yet. Follow [@juryxiong](https://x.com/juryxiong) for updates.',
        '',
        'See the [compatibility checklist](./docs/compatibility.md)',
      ].join('\n'),
    )
    .replace(
      [
        'Example app coverage is tracked by the',
        '[example app criteria](./docs/example-apps.md).',
      ].join('\n'),
      [
        'Production-readiness examples are tracked by the',
        '[example app criteria](./docs/example-apps.md) before the project can remove',
        'preview/experimental language.',
      ].join('\n'),
    )
    .replace(
      'before the final support claim is published.',
      'before experimental/not-production-ready text is removed.',
    )

  sources['docs/compatibility.md'] = sources['docs/compatibility.md'].replace(
    [
      'This is the source of truth for Vue Godot API and component compatibility. A',
      '`supported` entry means the listed subset is implemented and tested, not that',
      'the full browser, DOM, or native platform spec is complete.',
    ].join('\n'),
    [
      'This is the source of truth for Vue Godot API and component compatibility. The',
      'project is still experimental; a `supported` entry means the listed subset is',
      'implemented and tested, not that the full browser, DOM, or native platform spec',
      'is complete.',
    ].join('\n'),
  )

  sources['docs/production.md'] = sources['docs/production.md']
    .replace(
      [
        'Use this guide as the release checklist for apps built on the current packages',
        'and for future package release candidates.',
      ].join('\n'),
      [
        'Vue Godot is still experimental. Use this guide as the release checklist for',
        'apps built on the current packages and for future package release candidates.',
      ].join('\n'),
    )
    .replace(
      'For production release candidates, keep these gates green:',
      [
        'Before removing experimental/not-production-ready language, the repository still',
        'needs:',
      ].join('\n'),
    )
    .replace(
      'Keep release records explicit about the evidence used for each candidate.',
      [
        'Until those are complete, treat release builds as preview/alpha-quality and',
        'document app-specific risk explicitly.',
      ].join('\n'),
    )

  sources['docs/real-device-release.md'] = sources[
    'docs/real-device-release.md'
  ].replace(
    'the release record remains incomplete for those device capabilities.',
    'the repository remains preview-quality for those device capabilities.',
  )

  return sources
}

function readyFinalizationSummary(sources = prefinalSources()) {
  const todoItems = collectTodoItems(sources['TODO.md'])
  const finalTodoRequirements = collectFinalTodoRequirementStatuses(todoItems, {
    androidRealDeviceEvidenceReady: true,
    checkCiEvidenceReady: true,
    ciEvidenceReady: true,
    godotSmokeCiEvidenceReady: true,
    iosRealDeviceEvidenceReady: true,
    publicReadmesReady: false,
    realDeviceEvidenceReady: true,
    releaseReadinessEvidenceReady: true,
    rootReadmeWarningReady: false,
    warningWordingReady: false,
  })

  return {
    allowOpen: false,
    blockers: finalTodoRequirements
      .filter((status) => status.checked !== true)
      .map((status) => `${status.file}:${status.line} ${status.text}`),
    checks: {
      androidRealDeviceEvidence: true,
      checkedFinalTodosBackedByEvidence: true,
      cleanWorktree: true,
      finalTodoStructure: true,
      iosRealDeviceEvidence: true,
      packageDescriptionWarningsRemoved: true,
      publicSurface: true,
      realDeviceEvidence: true,
      realDeviceEvidenceMetadata: true,
      releaseReadinessEvidence: true,
      releaseTooling: true,
      releaseWorkflows: true,
      strictCiEvidence: true,
    },
    finalTodoRequirements,
    packageDescriptionWarningCount: 0,
  }
}

test('release readiness finalizer rejects unsafe summaries', () => {
  const allowOpenSummary = {
    ...readyFinalizationSummary(),
    allowOpen: true,
  }
  assert.match(
    validateFinalizationSummary(allowOpenSummary).join('\n'),
    /strict mode without --allow-open/,
  )

  const missingEvidenceSummary = {
    ...readyFinalizationSummary(),
    checks: {
      ...readyFinalizationSummary().checks,
      realDeviceEvidence: false,
    },
    finalTodoRequirements: readyFinalizationSummary().finalTodoRequirements.map(
      (status) =>
        status.proof === 'realDeviceEvidenceReady'
          ? { ...status, ready: false }
          : status,
    ),
  }
  const missingEvidenceErrors =
    validateFinalizationSummary(missingEvidenceSummary).join('\n')

  assert.match(missingEvidenceErrors, /checks\.realDeviceEvidence must be true/)
  assert.match(
    missingEvidenceErrors,
    /realDeviceEvidenceReady must be ready before finalization/,
  )

  const missingBlockersSummary = {
    ...readyFinalizationSummary(),
  }
  delete missingBlockersSummary.blockers
  assert.match(
    validateFinalizationSummary(missingBlockersSummary).join('\n'),
    /summary\.blockers must be an array/,
  )

  const incompleteBlockersSummary = {
    ...readyFinalizationSummary(),
    blockers: readyFinalizationSummary().blockers.slice(1),
  }
  assert.match(
    validateFinalizationSummary(incompleteBlockersSummary).join('\n'),
    /summary\.blockers missing TODO\.md:/,
  )

  const duplicateBlockersSummary = {
    ...readyFinalizationSummary(),
    blockers: [
      ...readyFinalizationSummary().blockers,
      readyFinalizationSummary().blockers[0],
    ],
  }
  assert.match(
    validateFinalizationSummary(duplicateBlockersSummary).join('\n'),
    /duplicate release-readiness blocker: TODO\.md:/,
  )

  const summaryWithReadyCheckedTodo = readyFinalizationSummary()
  assert.ok(
    summaryWithReadyCheckedTodo.finalTodoRequirements.some(
      (status) =>
        status.text === '`npm run check` passes locally and in CI.' &&
        status.checked === true,
    ),
  )
  assert.doesNotMatch(
    summaryWithReadyCheckedTodo.blockers.join('\n'),
    /`npm run check` passes locally and in CI\./,
  )
  assert.deepEqual(
    validateFinalizationSummary(summaryWithReadyCheckedTodo),
    [],
  )
})

test('release readiness finalizer checks final TODOs and removes warning markers', () => {
  const sources = prefinalSources()
  const result = applyReleaseReadinessFinalization(
    sources,
    readyFinalizationSummary(),
  )

  assert.deepEqual(result.errors, [])
  assert.deepEqual(
    result.changedFiles,
    [
      'TODO.md',
      'README.md',
      'docs/compatibility.md',
      'docs/production.md',
      'docs/real-device-release.md',
    ],
  )
  assert.match(
    result.sources['TODO.md'],
    /- \[x\] `npm run check` passes locally and in CI\./,
  )
  assert.match(
    result.sources['TODO.md'],
    /- \[x\] The root README warning is removed in the same commit that marks this checklist complete\./,
  )
  assert.doesNotMatch(
    result.sources['README.md'],
    /experimental and not production ready yet/i,
  )
  assert.doesNotMatch(result.sources['README.md'], /preview\/experimental/)
  assert.doesNotMatch(
    result.sources['docs/production.md'],
    /preview\/alpha-quality/,
  )
  assert.deepEqual(
    collectWarningMarkerHits((file) => result.sources[file] ?? ''),
    [],
  )
})

test('release readiness finalizer rejects unexpected source text drift', () => {
  const sources = prefinalSources()
  sources['README.md'] = sources['README.md'].replace(
    [
      'Production-readiness examples are tracked by the',
      '[example app criteria](./docs/example-apps.md) before the project can remove',
      'preview/experimental language.',
    ].join('\n'),
    'Example app coverage evidence is documented separately.',
  )

  const result = applyReleaseReadinessFinalization(
    sources,
    readyFinalizationSummary(),
  )

  assert.match(
    result.errors.join('\n'),
    /README\.md: finalization source text drift for root README example coverage wording/,
  )
})

test('release readiness finalizer rejects missing delete-only warning text', () => {
  const sources = prefinalSources()
  sources['README.md'] = sources['README.md'].replace(
    'This project is experimental and not production ready yet. Follow [@juryxiong](https://x.com/juryxiong) for updates.\n\n',
    '',
  )

  const result = applyReleaseReadinessFinalization(
    sources,
    readyFinalizationSummary(),
  )

  assert.match(
    result.errors.join('\n'),
    /README\.md: finalization source text drift for root README experimental warning/,
  )
})
