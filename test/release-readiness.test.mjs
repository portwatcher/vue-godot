import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import {
  collectCheckedTodoEvidenceBlockers,
  collectFinalTodoStructureBlockers,
  collectPackageDescriptionWarningHits,
  collectReleaseToolingBlockers,
  collectTodoItems,
  collectUncheckedTodoItems,
} from '../scripts/release-readiness.mjs'

function runReadiness(args = []) {
  return spawnSync(process.execPath, ['scripts/release-readiness.mjs', ...args], {
    cwd: process.cwd(),
    encoding: 'utf-8',
  })
}

test('release readiness flags checked final TODO items without matching evidence', () => {
  const todoItems = collectTodoItems(
    [
      '- [x] Android export with selected device APIs has been tested.',
      '- [ ] iOS export with selected device APIs has been tested.',
      '- [x] Release preflight passes without warnings in the release environment.',
      '- [x] All public READMEs match the final support claims.',
      '- [x] The root README warning is removed in the same commit that marks this checklist complete.',
    ].join('\n'),
    'TODO.test.md',
  )

  assert.deepEqual(collectUncheckedTodoItems(todoItems), [
    'TODO.test.md:2 iOS export with selected device APIs has been tested.',
  ])

  const blockers = collectCheckedTodoEvidenceBlockers(todoItems, {
    androidRealDeviceEvidenceReady: false,
    checkCiEvidenceReady: false,
    ciEvidenceReady: false,
    godotSmokeCiEvidenceReady: false,
    iosRealDeviceEvidenceReady: false,
    publicReadmesReady: false,
    realDeviceEvidenceReady: false,
    releaseReadinessEvidenceReady: false,
    rootReadmeWarningReady: false,
    warningWordingReady: false,
  })
  const output = blockers.join('\n')

  assert.match(output, /TODO\.test\.md:1 Android export/)
  assert.match(
    output,
    /Android real-device evidence must validate the selected API export checks/,
  )
  assert.match(output, /TODO\.test\.md:3 Release preflight/)
  assert.match(output, /warning-free Release Preflight run/)
  assert.match(output, /TODO\.test\.md:4 All public READMEs/)
  assert.match(output, /public-surface docs must pass/)
  assert.match(output, /TODO\.test\.md:5 The root README warning/)
  assert.match(output, /root README warning markers must be removed/)
})

test('release readiness accepts checked final TODO items when evidence is proven', () => {
  const todoItems = collectTodoItems(
    [
      '- [x] Android export with selected device APIs has been tested.',
      '- [x] iOS export with selected device APIs has been tested.',
      '- [x] CI passes on a clean commit.',
      '- [x] Release preflight passes without warnings in the release environment.',
    ].join('\n'),
  )

  assert.deepEqual(
    collectCheckedTodoEvidenceBlockers(todoItems, {
      androidRealDeviceEvidenceReady: true,
      checkCiEvidenceReady: true,
      ciEvidenceReady: true,
      godotSmokeCiEvidenceReady: true,
      iosRealDeviceEvidenceReady: true,
      publicReadmesReady: true,
      realDeviceEvidenceReady: true,
      releaseReadinessEvidenceReady: true,
      rootReadmeWarningReady: true,
      warningWordingReady: true,
    }),
    [],
  )
})

test('release readiness backs platform TODO items with platform evidence', () => {
  const todoItems = collectTodoItems(
    [
      '- [x] Android export with selected device APIs has been tested.',
      '- [x] iOS export with selected device APIs has been tested.',
    ].join('\n'),
    'TODO.test.md',
  )

  const output = collectCheckedTodoEvidenceBlockers(todoItems, {
    androidRealDeviceEvidenceReady: true,
    checkCiEvidenceReady: false,
    ciEvidenceReady: false,
    godotSmokeCiEvidenceReady: false,
    iosRealDeviceEvidenceReady: false,
    publicReadmesReady: false,
    realDeviceEvidenceReady: false,
    releaseReadinessEvidenceReady: false,
    rootReadmeWarningReady: false,
    warningWordingReady: false,
  }).join('\n')

  assert.doesNotMatch(output, /Android export/)
  assert.match(output, /TODO\.test\.md:2 iOS export/)
  assert.match(
    output,
    /iOS real-device evidence must validate the selected API export checks/,
  )
})

test('release readiness requires the final TODO evidence checklist shape', () => {
  const todoItems = collectTodoItems(
    [
      '- [ ] `npm run check` passes locally and in CI.',
      '- [ ] `npm run check` passes locally and in CI.',
      '- [ ] Godot smoke, generated Godot smoke, and editor reload smoke pass in CI for every release candidate.',
      '- [ ] Android and iOS export smoke apps run on real or hosted devices for the production profile.',
      '- [ ] The wording "not production ready", "alpha", and "experimental" is removed only after all criteria above are satisfied.',
      '- [ ] Android export with selected device APIs has been tested.',
      '- [ ] iOS export with selected device APIs has been tested.',
      '- [ ] CI passes on a clean commit.',
      '- [ ] Release preflight passes without warnings in the release environment.',
      '- [ ] The root README warning is removed in the same commit that marks this checklist complete.',
    ].join('\n'),
    'TODO.test.md',
  )
  const blockers = collectFinalTodoStructureBlockers(
    todoItems,
    'TODO.test.md',
  )
  const output = blockers.join('\n')

  assert.match(
    output,
    /appears 2 times: "`npm run check` passes locally and in CI\."/,
  )
  assert.match(
    output,
    /must include "All public READMEs match the final support claims\."/,
  )
})

test('release readiness requires release tooling scripts', () => {
  assert.deepEqual(
    collectReleaseToolingBlockers({
      scripts: {
        check:
          'npm run build && npm run test && npm run smoke:cli && npm run check:serious-examples && npm run bench:performance',
        'check:public-surface': 'node scripts/public-surface-audit.mjs',
        'check:real-device-evidence':
          'node scripts/check-real-device-evidence.mjs',
        'check:serious-examples':
          'node scripts/check-serious-example-apps.mjs',
        'release:ci': 'node scripts/check-release-ci-runs.mjs',
        'release:platform-evidence':
          'node scripts/create-platform-evidence.mjs',
        'release:evidence': 'node scripts/create-release-evidence.mjs',
        'release:preflight-summary':
          'node scripts/download-release-preflight-summary.mjs',
        'release:readiness': 'node scripts/release-readiness.mjs',
        'release:preflight': 'node scripts/release-preflight.mjs',
      },
    }),
    [],
  )

  const blockers = collectReleaseToolingBlockers({
    scripts: {
      check: 'npm run build',
      'release:ci': 'node scripts/renamed-release-ci.mjs',
    },
  })
  const output = blockers.join('\n')

  assert.match(output, /check:public-surface/)
  assert.match(output, /check:real-device-evidence/)
  assert.match(output, /release:ci as node scripts\/check-release-ci-runs\.mjs/)
  assert.match(output, /release:evidence/)
  assert.match(output, /release:preflight-summary/)
  assert.match(output, /release:preflight as node scripts\/release-preflight\.mjs/)
  assert.match(output, /check script must run npm run check:serious-examples/)
})

test('release readiness scans package descriptions for final warning wording', () => {
  assert.deepEqual(
    collectPackageDescriptionWarningHits([
      {
        file: 'packages/alpha/package.json',
        description: 'Experimental alpha adapter',
      },
      {
        file: 'packages/stable/package.json',
        description: 'Stable adapter contracts',
      },
      {
        file: 'packages/not-ready/package.json',
        description: 'Not production ready plugin bridge',
      },
    ]),
    [
      'packages/alpha/package.json: package description experimental wording',
      'packages/alpha/package.json: package description alpha wording',
      'packages/not-ready/package.json: package description not-production-ready wording',
    ],
  )
})

test('release readiness reports current blockers without failing when allowed open', () => {
  const result = runReadiness(['--allow-open'])
  const output = `${result.stdout}\n${result.stderr}`

  assert.equal(result.status, 0)
  assert.match(output, /`npm run check` passes locally and in CI/)
  assert.match(output, /real-device evidence missing/)
  assert.match(output, /release-readiness evidence missing/)
  assert.match(output, /public warning markers still present/)
  assert.match(output, /open gates remain/)
})

test('release readiness fails in strict mode while final gates are open', () => {
  const result = runReadiness()
  const output = `${result.stdout}\n${result.stderr}`

  assert.equal(result.status, 1)
  assert.match(output, /not ready/)
  assert.match(output, /release-readiness evidence missing/)
})

test('release readiness accepts checked-in evidence examples for schema coverage', () => {
  const exampleCommit = '0123456789abcdef0123456789abcdef01234567'
  const result = runReadiness([
    '--allow-open',
    '--real-device-path',
    'docs/real-device-evidence.example.json',
    '--readiness-path',
    'docs/release-readiness-evidence.example.json',
    '--expected-commit',
    exampleCommit,
  ])
  const output = `${result.stdout}\n${result.stderr}`

  assert.equal(result.status, 0)
  assert.doesNotMatch(output, /evidence missing/)
  assert.doesNotMatch(output, /must match current commit/)
  assert.match(output, /`npm run check` passes locally and in CI/)
})

test('release readiness writes a machine-readable blocker summary', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-readiness-'))
  const summaryPath = path.join(tempDir, 'release-readiness-summary.json')
  const exampleCommit = '0123456789abcdef0123456789abcdef01234567'

  try {
    const result = runReadiness([
      '--allow-open',
      '--real-device-path',
      'docs/real-device-evidence.example.json',
      '--readiness-path',
      'docs/release-readiness-evidence.example.json',
      '--expected-commit',
      exampleCommit,
      '--summary-output',
      summaryPath,
    ])
    const output = `${result.stdout}\n${result.stderr}`
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))

    assert.equal(result.status, 0)
    assert.match(output, /wrote .*release-readiness-summary\.json/)
    assert.equal(summary.commit, exampleCommit)
    assert.equal(summary.allowOpen, true)
    assert.equal(summary.ready, false)
    assert.ok(summary.blockerCount > 0)
    assert.equal(summary.warningMarkerCount, 8)
    assert.equal(summary.packageDescriptionWarningCount, 0)
    assert.deepEqual(summary.packageDescriptionWarnings, [])
    assert.equal(summary.todo.unchecked, 10)
    assert.equal(summary.todo.uncheckedItems.length, 10)
    assert.ok(
      summary.todo.uncheckedItems.some(
        (item) =>
          item.file === 'TODO.md' &&
          item.text === '`npm run check` passes locally and in CI.',
      ),
    )
    assert.ok(
      summary.todo.uncheckedItems.some(
        (item) =>
          item.file === 'TODO.md' &&
          item.text ===
            'Android export with selected device APIs has been tested.',
      ),
    )
    assert.equal(summary.checks.androidRealDeviceEvidence, true)
    assert.equal(summary.checks.checkedFinalTodosBackedByEvidence, true)
    assert.equal(typeof summary.checks.cleanWorktree, 'boolean')
    if (!summary.checks.cleanWorktree) {
      assert.ok(
        summary.blockers.some((blocker) =>
          blocker.includes('working tree must be clean'),
        ),
      )
    }
    assert.equal(summary.checks.finalTodoStructure, true)
    assert.equal(summary.checks.iosRealDeviceEvidence, true)
    assert.equal(summary.checks.publicSurface, true)
    assert.equal(summary.checks.publicWarningMarkersRemoved, false)
    assert.equal(summary.checks.packageDescriptionWarningsRemoved, true)
    assert.equal(summary.checks.realDeviceEvidence, true)
    assert.equal(summary.checks.realDeviceEvidenceMetadata, true)
    assert.equal(summary.checks.releaseTooling, true)
    assert.equal(summary.checks.releaseReadinessEvidence, true)
    assert.equal(summary.checks.rootReadmeWarningsRemoved, false)
    assert.equal(summary.checks.strictCiEvidence, false)
    assert.ok(
      summary.blockers.some((blocker) =>
        blocker.includes('`npm run check` passes locally and in CI'),
      ),
    )
    assert.ok(
      summary.warningMarkers.some((marker) =>
        marker.includes('README.md: root README production warning'),
      ),
    )
    assert.ok(
      summary.warningMarkers.some((marker) =>
        marker.includes('README.md: root README final-removal wording'),
      ),
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('release readiness reports a dirty worktree blocker', () => {
  const markerPath = path.join(process.cwd(), '.release-readiness-dirty-test')
  fs.writeFileSync(markerPath, 'dirty\n')

  try {
    const result = runReadiness(['--allow-open'])
    const output = `${result.stdout}\n${result.stderr}`

    assert.equal(result.status, 0)
    assert.match(output, /working tree must be clean for final release readiness/)
    assert.match(output, /\.release-readiness-dirty-test/)
  } finally {
    fs.rmSync(markerPath, { force: true })
  }
})

test('release readiness requires a GitHub Actions preflight run URL for this repo', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-readiness-'))
  const readinessPath = path.join(tempDir, 'release-readiness.json')

  fs.writeFileSync(
    readinessPath,
    JSON.stringify(
      {
        commit: '0123456789abcdef0123456789abcdef01234567',
        releasePreflightRunUrl: 'https://example.com/actions/runs/3',
        releasePreflightRunWorkflowName: 'Release Preflight',
        releasePreflightRunCommit:
          '0123456789abcdef0123456789abcdef01234567',
        releasePreflightRunConclusion: 'success',
        releasePreflightLocalOnly: false,
        releasePreflightSkipCheck: false,
        releasePreflightSkipGodot: false,
        releasePreflightSkipSeriousExamples: false,
        releasePreflightFailureCount: 0,
        releasePreflightWarningCount: 0,
      },
      null,
      2,
    ),
  )

  try {
    const result = runReadiness([
      '--allow-open',
      '--real-device-path',
      'docs/real-device-evidence.example.json',
      '--readiness-path',
      readinessPath,
      '--expected-commit',
      '0123456789abcdef0123456789abcdef01234567',
    ])
    const output = `${result.stdout}\n${result.stderr}`

    assert.equal(result.status, 0)
    assert.match(
      output,
      /releasePreflightRunUrl must be a GitHub Actions run URL for portwatcher\/vue-godot/,
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('release readiness requires the Release Preflight workflow name', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-readiness-'))
  const readinessPath = path.join(tempDir, 'release-readiness.json')
  const evidence = JSON.parse(
    fs.readFileSync('docs/release-readiness-evidence.example.json', 'utf-8'),
  )
  evidence.releasePreflightRunWorkflowName = 'Check'

  fs.writeFileSync(readinessPath, JSON.stringify(evidence, null, 2))

  try {
    const result = runReadiness([
      '--allow-open',
      '--real-device-path',
      'docs/real-device-evidence.example.json',
      '--readiness-path',
      readinessPath,
      '--expected-commit',
      '0123456789abcdef0123456789abcdef01234567',
    ])
    const output = `${result.stdout}\n${result.stderr}`

    assert.equal(result.status, 0)
    assert.match(
      output,
      /releasePreflightRunWorkflowName must be "Release Preflight"/,
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('release readiness requires completed non-local preflight summary evidence', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-readiness-'))
  const readinessPath = path.join(tempDir, 'release-readiness.json')
  const evidence = JSON.parse(
    fs.readFileSync('docs/release-readiness-evidence.example.json', 'utf-8'),
  )
  evidence.releasePreflightLocalOnly = true
  evidence.releasePreflightSkipCheck = true
  evidence.releasePreflightSkipGodot = true
  evidence.releasePreflightSkipSeriousExamples = true
  evidence.releasePreflightFailureCount = 1
  evidence.releasePreflightWarningCount = 1

  fs.writeFileSync(readinessPath, JSON.stringify(evidence, null, 2))

  try {
    const result = runReadiness([
      '--allow-open',
      '--real-device-path',
      'docs/real-device-evidence.example.json',
      '--readiness-path',
      readinessPath,
      '--expected-commit',
      '0123456789abcdef0123456789abcdef01234567',
    ])
    const output = `${result.stdout}\n${result.stderr}`

    assert.equal(result.status, 0)
    assert.match(output, /releasePreflightLocalOnly must be false/)
    assert.match(output, /releasePreflightSkipCheck must be false/)
    assert.match(output, /releasePreflightSkipGodot must be false/)
    assert.match(output, /releasePreflightSkipSeriousExamples must be false/)
    assert.match(output, /releasePreflightFailureCount must be 0/)
    assert.match(output, /releasePreflightWarningCount must be 0/)
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('release readiness rejects stale real-device package versions', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-readiness-'))
  const realDevicePath = path.join(tempDir, 'real-device-evidence.json')
  const evidence = JSON.parse(
    fs.readFileSync('docs/real-device-evidence.example.json', 'utf-8'),
  )
  evidence.packageVersions['@vue-godot/html'] = '9.9.9'

  fs.writeFileSync(realDevicePath, JSON.stringify(evidence, null, 2))

  try {
    const result = runReadiness([
      '--allow-open',
      '--real-device-path',
      realDevicePath,
      '--readiness-path',
      'docs/release-readiness-evidence.example.json',
      '--expected-commit',
      '0123456789abcdef0123456789abcdef01234567',
    ])
    const output = `${result.stdout}\n${result.stderr}`

    assert.equal(result.status, 0)
    assert.match(
      output,
      /packageVersions\.@vue-godot\/html must match current package version/,
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})
