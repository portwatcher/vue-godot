import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import {
  ciEvidenceCommands,
  collectCheckedTodoEvidenceBlockers,
  collectFinalTodoStructureBlockers,
  collectFinalTodoRequirementStatuses,
  collectPackageDescriptionWarningHits,
  collectReleaseToolingBlockers,
  collectReleaseWorkflowBlockers,
  collectTodoItems,
  collectUncheckedTodoItems,
  formatFinalTodoRequirementStatus,
  formatReleaseReadinessChecklist,
  isReleaseHandoffReportCurrent,
  validateInitialCiEvidence,
  validateReleaseReadinessEvidence,
} from '../scripts/release-readiness.mjs'
import {
  defaultReleaseHandoffReportPath,
  releaseHandoffReportFormatVersion,
} from '../scripts/release-handoff-commands.mjs'
import { shellQuote } from '../scripts/release-utils.mjs'

function runReadiness(args = []) {
  return spawnSync(process.execPath, ['scripts/release-readiness.mjs', ...args], {
    cwd: process.cwd(),
    encoding: 'utf-8',
  })
}

function readCommittedReleaseCiEvidence() {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'release/ci-runs.json'), 'utf-8'),
  )
}

function currentGitCommit() {
  const result = spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd: process.cwd(),
    encoding: 'utf-8',
  })
  assert.equal(result.status, 0)
  return result.stdout.trim()
}

function differentCommitSha(commit) {
  const fallbackCommit = '0000000000000000000000000000000000000000'
  if (commit !== fallbackCommit) {
    return fallbackCommit
  }
  return '1111111111111111111111111111111111111111'
}

function writeSyntheticCiEvidenceForCommit(ciEvidence, commit, outputPath) {
  const syntheticEvidence = JSON.parse(JSON.stringify(ciEvidence))
  syntheticEvidence.commit = commit
  syntheticEvidence.evidence.commit = commit
  for (const workflow of Object.values(syntheticEvidence.evidence.workflows)) {
    workflow.runCommit = commit
  }
  if (syntheticEvidence.localGit) {
    syntheticEvidence.localGit.currentHead = commit
    syntheticEvidence.localGit.commitIsHead = true
    syntheticEvidence.localGit.upstreamCommit = commit
    syntheticEvidence.localGit.upstreamMatchesCommit = true
    syntheticEvidence.localGit.dirtyWorktree = false
  }
  fs.writeFileSync(outputPath, `${JSON.stringify(syntheticEvidence, null, 2)}\n`)
}

test('release readiness rejects non-SHA expected commits', () => {
  const result = runReadiness([
    '--allow-open',
    '--expected-commit',
    'release-candidate',
  ])

  assert.equal(result.status, 1)
  assert.match(
    `${result.stdout}\n${result.stderr}`,
    /--expected-commit must be a full 40-character git commit SHA/,
  )
})

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

test('release readiness reports final TODO proof status', () => {
  const todoItems = collectTodoItems(
    [
      '- [x] Android export with selected device APIs has been tested.',
      '- [ ] iOS export with selected device APIs has been tested.',
    ].join('\n'),
    'TODO.test.md',
  )

  const statuses = collectFinalTodoRequirementStatuses(todoItems, {
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
  })
  const androidStatus = statuses.find((status) =>
    status.text.startsWith('Android export'),
  )
  const iosStatus = statuses.find((status) =>
    status.text.startsWith('iOS export'),
  )
  const ciStatus = statuses.find((status) =>
    status.text.startsWith('CI passes'),
  )

  assert.deepEqual(androidStatus, {
    text: 'Android export with selected device APIs has been tested.',
    proof: 'androidRealDeviceEvidenceReady',
    ready: true,
    checked: true,
    file: 'TODO.test.md',
    line: 1,
    itemCount: 1,
    reason:
      'Android real-device evidence must validate the selected API export checks',
  })
  assert.equal(iosStatus?.ready, false)
  assert.equal(iosStatus?.checked, false)
  assert.equal(iosStatus?.line, 2)
  assert.equal(ciStatus?.itemCount, 0)
  assert.equal(ciStatus?.file, null)
  assert.equal(ciStatus?.line, null)
  assert.match(
    formatFinalTodoRequirementStatus(androidStatus),
    /TODO\.test\.md:1 checked; androidRealDeviceEvidenceReady ready/,
  )
  assert.match(
    formatFinalTodoRequirementStatus(iosStatus),
    /TODO\.test\.md:2 unchecked; iosRealDeviceEvidenceReady waiting/,
  )
  assert.match(
    formatFinalTodoRequirementStatus(ciStatus),
    /missing final TODO item; ciEvidenceReady waiting/,
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

test('release readiness checklist renders final proof and next actions', () => {
  const summary = {
    allowOpen: true,
    blockerCount: 3,
    blockers: [
      'Android evidence missing',
      'Release Preflight missing',
      'Real device evidence missing\nCreate release/real-device-evidence.json after Android/iOS testing\nRun the verification command',
    ],
    checks: {
      androidRealDeviceEvidence: false,
      cleanWorktree: true,
      initialCiEvidence: true,
      iosRealDeviceEvidence: false,
      packageDescriptionWarningsRemoved: true,
      platformEvidence: false,
      publicSurface: true,
      publicWarningMarkersRemoved: false,
      realDeviceEvidence: false,
      releaseReadinessEvidence: false,
      strictCiEvidence: false,
    },
    commit: '0123456789abcdef0123456789abcdef01234567',
    finalTodoRequirements: [
      {
        checked: true,
        file: 'TODO.md',
        itemCount: 1,
        line: 24,
        proof: 'checkCiEvidenceReady',
        ready: true,
        reason:
          'committed release/ci-runs.json evidence must verify a successful Check workflow run',
        text: '`npm run check` passes locally and in CI.',
      },
      {
        checked: false,
        file: 'TODO.md',
        itemCount: 1,
        line: 389,
        proof: 'androidRealDeviceEvidenceReady',
        ready: false,
        reason:
          'Android real-device evidence must validate the selected API export checks',
        text: 'Android export with selected device APIs has been tested.',
      },
    ],
    initialCiEvidence: {
      expectedCommit: '0123456789abcdef0123456789abcdef01234567',
      path: 'release/ci-runs.json',
    },
    nextActions: [
      {
        blockedBy: ['real-device-evidence'],
        commands: ['npm run check'],
        detail: 'Run the local check first.',
        id: 'release-preflight-evidence',
        title: 'Collect Release Preflight evidence',
      },
      {
        commands: [
          'npm run check',
          'npm run release:record-platform-evidence -- --platform android --artifact <android-apk-aab-or-hosted-build-id>',
          'npm run release:evidence -- --commit 0123456789abcdef0123456789abcdef01234567',
        ],
        detail: 'Record hosted device results.',
        id: 'real-device-evidence',
        title: 'Complete real-device evidence',
      },
    ],
    packageDescriptionWarnings: [],
    platformEvidence: {
      errorCount: 69,
      path: 'release/platform-evidence.json',
    },
    ready: false,
    realDeviceEvidence: {
      androidReady: false,
      errorCount: 1,
      iosReady: false,
      path: 'release/real-device-evidence.json',
    },
    releaseHandoffReport: {
      current: false,
    },
    releaseReadinessEvidence: {
      errorCount: 1,
      path: 'release/release-readiness-evidence.json',
    },
    releaseToolingBlockers: [],
    releaseWorkflowBlockers: [],
    warningMarkers: ['README.md: root README production warning'],
  }

  const checklist = formatReleaseReadinessChecklist(summary)

  assert.match(checklist, /# Release Readiness Checklist/)
  assert.match(checklist, /- Status: waiting/)
  assert.match(checklist, /\[x\] TODO\.md:24 checked: checkCiEvidenceReady ready/)
  assert.match(
    checklist,
    /\[ \] TODO\.md:389 unchecked: androidRealDeviceEvidenceReady waiting/,
  )
  assert.match(checklist, /\[ \] Real-device evidence/)
  assert.match(checklist, /Android evidence missing/)
  assert.match(
    checklist,
    /  - Real device evidence missing\n    Create release\/real-device-evidence\.json after Android\/iOS testing\n    Run the verification command/,
  )
  assert.match(checklist, /Blocked by: real-device-evidence/)
  assert.match(checklist, /```bash\nnpm run check\n```/)
  assert.match(
    checklist,
    /### Complete real-device evidence[\s\S]*Commands with `<\.\.\.>` placeholders must be edited before running/,
  )
  assert.match(
    checklist,
    /#### Ready To Run[\s\S]*npm run check[\s\S]*#### Replace Placeholders First[\s\S]*<android-apk-aab-or-hosted-build-id>/,
  )
  assert.match(
    checklist,
    /#### Run After Device Evidence Is Recorded[\s\S]*npm run release:evidence -- --commit 0123456789abcdef0123456789abcdef01234567/,
  )
})

test('release readiness requires release tooling scripts', () => {
  assert.deepEqual(
    collectReleaseToolingBlockers({
      scripts: {
        check:
          'npm run build && npm run test && npm run smoke:cli && npm run check:serious-examples && npm run bench:performance',
        'check:device-prereqs': 'node scripts/check-device-test-prereqs.mjs',
        'check:public-surface': 'node scripts/public-surface-audit.mjs',
        'check:platform-evidence':
          'node scripts/check-platform-evidence.mjs',
        'check:real-device-evidence':
          'node scripts/check-real-device-evidence.mjs',
        'check:serious-examples':
          'node scripts/check-serious-example-apps.mjs',
        'release:ci': 'node scripts/check-release-ci-runs.mjs',
        'release:platform-evidence':
          'node scripts/create-platform-evidence.mjs',
        'release:record-platform-evidence':
          'node scripts/record-platform-evidence.mjs',
        'release:evidence': 'node scripts/create-release-evidence.mjs',
        'release:preflight-summary':
          'node scripts/download-release-preflight-summary.mjs',
        'release:finalize-readiness':
          'node scripts/finalize-release-readiness.mjs',
        'release:handoff': 'node scripts/release-handoff-report.mjs',
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
  assert.match(output, /check:platform-evidence/)
  assert.match(output, /check:real-device-evidence/)
  assert.match(output, /release:ci as node scripts\/check-release-ci-runs\.mjs/)
  assert.match(output, /release:evidence/)
  assert.match(output, /release:finalize-readiness/)
  assert.match(output, /release:handoff/)
  assert.match(output, /release:preflight-summary/)
  assert.match(output, /release:preflight as node scripts\/release-preflight\.mjs/)
  assert.match(output, /check script must run npm run check:serious-examples/)
})

test('release readiness requires release workflow wiring', () => {
  assert.deepEqual(collectReleaseWorkflowBlockers(), [])

  const blockers = collectReleaseWorkflowBlockers((file) => {
    if (file === '.github/workflows/check.yml') {
      return ['name: Check', 'workflow_dispatch:', 'node-version: 24'].join(
        '\n',
      )
    }
    if (file === '.github/workflows/godot-smoke.yml') {
      return [
        'name: Godot Smoke',
        'workflow_dispatch:',
        'node-version: 24',
        './.github/actions/setup-godotjs',
        'npm run smoke:godot',
      ].join('\n')
    }
    throw new Error('missing workflow')
  })
  const output = blockers.join('\n')

  assert.match(output, /\.github\/workflows\/check\.yml/)
  assert.match(output, /npm run check/)
  assert.match(output, /\.github\/workflows\/godot-smoke\.yml/)
  assert.match(output, /npm run smoke:generated-godot/)
  assert.match(output, /npm run smoke:editor-reload/)
  assert.match(output, /\.github\/workflows\/release-preflight\.yml/)
  assert.match(output, /unable to read Release Preflight workflow/)
})

test('release readiness requires Release Preflight expected commit wiring', () => {
  const blockers = collectReleaseWorkflowBlockers((file) => {
    if (file === '.github/workflows/check.yml') {
      return [
        'name: Check',
        'workflow_dispatch:',
        'actions/checkout@v6',
        'actions/setup-node@v6',
        'node-version: 24',
        'npm install -g npm@^11.15.0',
        'npm ci',
        'npm run check',
      ].join('\n')
    }
    if (file === '.github/workflows/godot-smoke.yml') {
      return [
        'name: Godot Smoke',
        'workflow_dispatch:',
        'actions/checkout@v6',
        'actions/setup-node@v6',
        'node-version: 24',
        './.github/actions/setup-godotjs',
        'npm install -g npm@^11.15.0',
        'npm ci',
        'npm run build',
        'npm run smoke:godot',
        'npm run smoke:generated-godot',
        'npm run smoke:editor-reload',
        'xvfb-run',
      ].join('\n')
    }
    if (file === '.github/actions/setup-godotjs/action.yml') {
      return [
        'actions/cache@v5',
        'node scripts/setup-godotjs.mjs',
        '--github-env "$GITHUB_ENV"',
      ].join('\n')
    }
    return [
      'name: Release Preflight',
      'workflow_dispatch:',
      'real_device_evidence_path',
      'node-version: 24',
      'actions/checkout@v6',
      'actions/setup-node@v6',
      'id-token: write',
      './.github/actions/setup-godotjs',
      'VUE_GODOT_REAL_DEVICE_EVIDENCE',
      'npm install -g npm@^11.15.0',
      'npm ci',
      'npm run release:preflight',
      '--summary-output release/release-preflight-summary.json',
      'actions/upload-artifact@v4',
      'release-preflight-summary',
      'xvfb-run',
    ].join('\n')
  })
  const output = blockers.join('\n')

  assert.match(output, /\.github\/workflows\/release-preflight\.yml/)
  assert.match(output, /expected_commit/)
  assert.match(output, /--expected-commit "\$\{\{ inputs\.expected_commit \}\}"/)
})

test('release readiness validates initial CI evidence for Check and Godot Smoke', () => {
  const commit = '0123456789abcdef0123456789abcdef01234567'
  const evidence = {
    ready: true,
    commit,
    commitFound: true,
    requiredWorkflowNames: ['Check', 'Godot Smoke'],
    passedWorkflowNames: ['Check', 'Godot Smoke'],
    missingWorkflowNames: [],
    checks: {
      checkWorkflow: true,
      commitFound: true,
      godotSmokeWorkflow: true,
    },
    evidence: {
      commit,
      workflows: {
        Check: {
          runUrl:
            'https://github.com/portwatcher/vue-godot/actions/runs/28752207158',
          runCommit: commit,
          runConclusion: 'success',
        },
        'Godot Smoke': {
          runUrl:
            'https://github.com/portwatcher/vue-godot/actions/runs/28752356926',
          runCommit: commit,
          runConclusion: 'success',
        },
      },
    },
  }

  assert.deepEqual(validateInitialCiEvidence(evidence, commit), [])

  evidence.missingWorkflowNames = ['Godot Smoke']
  assert.match(
    validateInitialCiEvidence(evidence, commit).join('\n'),
    /missing required workflow\(s\): Godot Smoke/,
  )

  const staleRunEvidence = JSON.parse(JSON.stringify(evidence))
  staleRunEvidence.missingWorkflowNames = []
  staleRunEvidence.evidence.workflows.Check.runCommit =
    differentCommitSha(commit)
  assert.match(
    validateInitialCiEvidence(staleRunEvidence, commit).join('\n'),
    new RegExp(`CI evidence Check\\.runCommit must match ${commit}`),
  )
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
  const ciEvidence = readCommittedReleaseCiEvidence()
  const result = runReadiness([
    '--allow-open',
    '--expected-commit',
    ciEvidence.commit,
  ])
  const output = `${result.stdout}\n${result.stderr}`

  assert.equal(result.status, 0)
  assert.doesNotMatch(output, /TODO\.md:24 `npm run check` passes locally/)
  assert.match(output, /real-device evidence missing/)
  assert.match(
    output,
    /check:real-device-evidence[\s\S]*real-device-evidence-summary\.json[\s\S]*real-device-evidence-checklist\.md[\s\S]*--verify-runs/,
  )
  assert.match(
    output,
    /check:platform-evidence[\s\S]*platform-evidence-checklist\.md[\s\S]*--allow-open/,
  )
  assert.match(output, /release-readiness evidence missing/)
  assert.match(output, /final TODO proof status/)
  assert.match(output, /TODO\.md:24 checked; checkCiEvidenceReady ready/)
  assert.match(
    output,
    /TODO\.md:25 checked; godotSmokeCiEvidenceReady ready/,
  )
  assert.match(
    output,
    /TODO\.md:389 unchecked; androidRealDeviceEvidenceReady waiting/,
  )
  assert.match(output, /public warning markers still present/)
  assert.match(output, /open gates remain/)
})

test('release readiness suggests expected commit for committed CI evidence', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-readiness-'))
  const summaryPath = path.join(tempDir, 'release-readiness-summary.json')
  const ciEvidencePath = path.join(tempDir, 'ci-runs.json')
  const ciEvidence = readCommittedReleaseCiEvidence()
  const headCommit = currentGitCommit()
  const testedCommit = differentCommitSha(headCommit)
  writeSyntheticCiEvidenceForCommit(ciEvidence, testedCommit, ciEvidencePath)

  try {
    const result = runReadiness([
      '--allow-open',
      '--ci-evidence',
      ciEvidencePath,
      '--summary-output',
      summaryPath,
    ])
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))
    const output = `${result.stdout}\n${result.stderr}`

    assert.equal(result.status, 0)
    assert.equal(summary.commit, headCommit)
    assert.notEqual(summary.commit, testedCommit)
    assert.equal(summary.initialCiEvidence.ready, false)
    assert.equal(summary.initialCiEvidence.commit, testedCommit)
    assert.equal(summary.initialCiEvidence.path, ciEvidencePath)
    assert.equal(summary.initialCiEvidence.validForCommit, testedCommit)
    assert.ok(
      summary.initialCiEvidence.errors.some((error) =>
        error.includes(`CI evidence commit must match ${summary.commit}`),
      ),
    )

    const expectedCommitAction = summary.nextActions.find(
      (action) => action.id === 'expected-commit',
    )
    assert.ok(expectedCommitAction)
    assert.ok(
      expectedCommitAction.commands.includes(
        `npm run release:readiness -- --allow-open --expected-commit ${testedCommit} --ci-evidence ${ciEvidencePath} --summary-output release/release-readiness-summary.json --checklist-output release/release-readiness-checklist.md`,
      ),
    )
    assert.match(output, /tested release commit evidence found/)
    assert.match(
      output,
      new RegExp(
        `ci-runs\\.json validates ${testedCommit}, not ${headCommit}`,
      ),
    )
    assert.ok(
      output.includes(
        `npm run release:readiness -- --allow-open --expected-commit ${testedCommit} --ci-evidence ${ciEvidencePath} --summary-output release/release-readiness-summary.json --checklist-output release/release-readiness-checklist.md`,
      ),
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
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

test('release readiness explains evidence commits for tested release candidates', () => {
  const result = runReadiness([
    '--allow-open',
    '--real-device-path',
    'docs/real-device-evidence.example.json',
    '--readiness-path',
    'docs/release-readiness-evidence.example.json',
  ])
  const output = `${result.stdout}\n${result.stderr}`

  assert.equal(result.status, 0)
  assert.match(output, /must match expected release commit/)
  assert.match(output, /--expected-commit <release-candidate-sha>/)
})

test('release readiness writes a machine-readable blocker summary', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-readiness-'))
  const summaryPath = path.join(tempDir, 'release-readiness-summary.json')
  const checklistPath = path.join(tempDir, 'release-readiness-checklist.md')
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
      '--checklist-output',
      checklistPath,
    ])
    const output = `${result.stdout}\n${result.stderr}`
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))
    const checklist = fs.readFileSync(checklistPath, 'utf-8')

    assert.equal(result.status, 0)
    assert.match(output, /wrote .*release-readiness-summary\.json/)
    assert.match(output, /wrote .*release-readiness-checklist\.md/)
    assert.equal(summary.commit, exampleCommit)
    assert.equal(summary.allowOpen, true)
    assert.equal(summary.localGit.commitIsHead, false)
    assert.equal(summary.ready, false)
    assert.ok(summary.blockerCount > 0)
    assert.equal(summary.warningMarkerCount, 8)
    assert.equal(summary.packageDescriptionWarningCount, 0)
    assert.deepEqual(summary.packageDescriptionWarnings, [])
    assert.equal(summary.releaseToolingBlockerCount, 0)
    assert.deepEqual(summary.releaseToolingBlockers, [])
    assert.equal(summary.releaseWorkflowBlockerCount, 0)
    assert.deepEqual(summary.releaseWorkflowBlockers, [])
    assert.deepEqual(summary.realDeviceEvidence, {
      androidErrors: [],
      androidReady: true,
      errorCount: 0,
      evidencePresent: true,
      iosErrors: [],
      iosReady: true,
      metadataErrors: [],
      metadataReady: true,
      path: 'docs/real-device-evidence.example.json',
      readErrors: [],
      ready: true,
      runErrors: [],
    })
    assert.deepEqual(summary.releaseReadinessEvidence, {
      evidence: {
        commit: exampleCommit,
        releasePreflightFailureCount: 0,
        releasePreflightLocalOnly: false,
        releasePreflightRunCommit: exampleCommit,
        releasePreflightRunConclusion: 'success',
        releasePreflightRunUrl:
          'https://github.com/portwatcher/vue-godot/actions/runs/0000000003',
        releasePreflightRunWorkflowName: 'Release Preflight',
        releasePreflightSkipCheck: false,
        releasePreflightSkipGodot: false,
        releasePreflightSkipSeriousExamples: false,
        releasePreflightWarningCount: 0,
      },
      errorCount: 0,
      evidencePresent: true,
      path: 'docs/release-readiness-evidence.example.json',
      readErrors: [],
      ready: true,
      runErrors: [],
      validationErrors: [],
    })
    assert.equal(summary.platformEvidence.evidencePresent, true)
    assert.equal(summary.platformEvidence.ready, false)
    assert.equal(summary.platformEvidence.path, 'release/platform-evidence.json')
    assert.ok(summary.platformEvidence.errorCount > 0)
    assert.ok(Array.isArray(summary.nextActions))
    const ciEvidenceAction = summary.nextActions.find(
      (action) => action.id === 'ci-evidence',
    )
    assert.ok(ciEvidenceAction)
    assert.equal(ciEvidenceAction.commands[0], 'npm run check')
    assert.ok(
      ciEvidenceAction.commands.some((command) =>
        command.startsWith('git push'),
      ),
    )
    assert.ok(
      ciEvidenceAction.commands.includes(
        `npm run release:ci -- --commit ${exampleCommit} --wait --output release/ci-runs.json`,
      ),
    )
    assert.ok(
      ciEvidenceAction.commands.some((command) =>
        command.includes(
          '--dispatch-missing --wait --ref <release-candidate-branch-or-tag>',
        ),
      ),
    )
    assert.ok(
      ciEvidenceAction.commands.every(
        (command) => !command.includes('--include-release-preflight'),
      ),
    )
    const releasePreflightAction = summary.nextActions.find(
      (action) => action.id === 'release-preflight-evidence',
    )
    assert.ok(releasePreflightAction)
    assert.equal('blockedBy' in releasePreflightAction, false)
    assert.equal(releasePreflightAction.commands[0], 'npm run check')
    const releaseCiWaitIndex = releasePreflightAction.commands.indexOf(
      `npm run release:ci -- --commit ${exampleCommit} --wait --output release/ci-runs.json`,
    )
    const releaseCiDispatchIndex = releasePreflightAction.commands.indexOf(
      `GH_TOKEN="$(gh auth token)" npm run release:ci -- --commit ${exampleCommit} --dispatch-missing --wait --ref <release-candidate-branch-or-tag> --output release/ci-runs.json`,
    )
    const preflightWaitIndex = releasePreflightAction.commands.indexOf(
      `npm run release:ci -- --commit ${exampleCommit} --include-release-preflight --release-preflight-run-commit "$(git rev-parse HEAD)" --wait --output release/ci-runs.json`,
    )
    const preflightDispatchIndex = releasePreflightAction.commands.indexOf(
      `GH_TOKEN="$(gh auth token)" npm run release:ci -- --commit ${exampleCommit} --include-release-preflight --release-preflight-run-commit "$(git rev-parse HEAD)" --dispatch-missing --wait --ref <evidence-branch-or-tag> --real-device-evidence-path docs/real-device-evidence.example.json --output release/ci-runs.json`,
    )
    assert.ok(releaseCiWaitIndex > 0)
    assert.ok(releaseCiDispatchIndex > releaseCiWaitIndex)
    assert.ok(preflightWaitIndex > releaseCiDispatchIndex)
    assert.ok(preflightDispatchIndex > preflightWaitIndex)
    assert.ok(
      releasePreflightAction.commands.includes(
        `GH_TOKEN="$(gh auth token)" npm run release:preflight-summary -- --ci-evidence release/ci-runs.json --commit ${exampleCommit} --output release/release-preflight-summary.json --checklist-output release/release-preflight-checklist.md`,
      ),
    )
    assert.ok(
      releasePreflightAction.commands.includes(
        'git add release/ci-runs.json release/release-preflight-summary.json release/release-preflight-checklist.md docs/real-device-evidence.example.json docs/release-readiness-evidence.example.json',
      ),
    )
    assert.ok(
      releasePreflightAction.commands.includes(
        'git commit -m "Add release readiness evidence"',
      ),
    )
    assert.ok(releasePreflightAction.commands.includes('git push'))
    assert.ok(
      releasePreflightAction.commands.includes(
        `npm run release:readiness -- --summary-output release/release-readiness-summary.json --checklist-output release/release-readiness-checklist.md --expected-commit ${exampleCommit} --real-device-path docs/real-device-evidence.example.json --readiness-path docs/release-readiness-evidence.example.json`,
      ),
    )
    assert.ok(
      summary.nextActions.some(
        (action) => {
          if (action.id !== 'final-warning-removal') {
            return false
          }

          if ('blockedBy' in action) {
            return false
          }

          const readinessSummaryIndex = action.commands.indexOf(
            `npm run release:readiness -- --summary-output /tmp/vue-godot-readiness.json --checklist-output /tmp/vue-godot-readiness.md --expected-commit ${exampleCommit} --real-device-path docs/real-device-evidence.example.json --readiness-path docs/release-readiness-evidence.example.json`,
          )
          const finalizerIndex = action.commands.indexOf(
            'npm run release:finalize-readiness -- --summary /tmp/vue-godot-readiness.json',
          )
          const checkIndex = action.commands.indexOf('npm run check')
          const gitAddIndex = action.commands.indexOf(
            'git add TODO.md README.md docs/compatibility.md docs/production.md docs/real-device-release.md',
          )
          const gitCommitIndex = action.commands.indexOf(
            'git commit -m "Finalize production readiness"',
          )
          const gitPushIndex = action.commands.indexOf('git push')
          const finalReadinessIndex = action.commands.indexOf(
            `npm run release:readiness -- --summary-output release/release-readiness-summary.json --checklist-output release/release-readiness-checklist.md --expected-commit ${exampleCommit} --real-device-path docs/real-device-evidence.example.json --readiness-path docs/release-readiness-evidence.example.json`,
          )

          return (
            readinessSummaryIndex >= 0 &&
            finalizerIndex === readinessSummaryIndex + 1 &&
            checkIndex === finalizerIndex + 1 &&
            gitAddIndex === checkIndex + 1 &&
            gitCommitIndex === gitAddIndex + 1 &&
            gitPushIndex === gitCommitIndex + 1 &&
            finalReadinessIndex === gitPushIndex + 1
          )
        },
      ),
    )
    assert.equal(summary.finalTodoRequirements.length, 10)
    assert.ok(
      summary.finalTodoRequirements.some(
        (status) =>
          status.text === '`npm run check` passes locally and in CI.' &&
          status.proof === 'checkCiEvidenceReady' &&
          status.checked === true &&
          status.ready === false,
      ),
    )
    assert.ok(
      summary.finalTodoRequirements.some(
        (status) =>
          status.text ===
            'Android export with selected device APIs has been tested.' &&
          status.proof === 'androidRealDeviceEvidenceReady' &&
          status.ready === true,
      ),
    )
    assert.ok(
      summary.finalTodoRequirements.every(
        (status) =>
          typeof status.checked === 'boolean' &&
          typeof status.itemCount === 'number' &&
          typeof status.reason === 'string',
      ),
    )
    assert.equal(summary.todo.unchecked, 8)
    assert.equal(summary.todo.uncheckedItems.length, 8)
    assert.ok(
      summary.todo.uncheckedItems.every(
        (item) =>
          item.text !== '`npm run check` passes locally and in CI.' &&
          item.text !==
            'Godot smoke, generated Godot smoke, and editor reload smoke pass in CI for every release candidate.',
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
    assert.equal(summary.checks.checkedFinalTodosBackedByEvidence, false)
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
    assert.equal(summary.checks.releaseWorkflows, true)
    assert.equal(summary.checks.releaseReadinessEvidence, true)
    assert.equal(summary.checks.platformEvidence, false)
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
    assert.match(checklist, /# Release Readiness Checklist/)
    assert.match(checklist, /- Status: waiting/)
    assert.match(checklist, new RegExp(`- Expected commit: ${exampleCommit}`))
    assert.match(checklist, /## Final TODO Proof/)
    assert.match(checklist, /Check\/Godot Smoke CI evidence/)
    assert.match(checklist, /## Blocking Issues/)
    assert.match(checklist, /root README production warning/)
    assert.match(checklist, /## Next Actions/)
    assert.match(checklist, /release:finalize-readiness/)
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('release readiness summary includes missing evidence next actions', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-readiness-'))
  const summaryPath = path.join(tempDir, 'release-readiness-summary.json')
  const ciEvidence = readCommittedReleaseCiEvidence()
  const ciEvidencePath = path.join(tempDir, 'custom ci runs.json')
  const platformEvidencePath = path.join(
    tempDir,
    'custom platform evidence.json',
  )
  const realDevicePath = path.join(
    tempDir,
    'missing real-device evidence.json',
  )
  const readinessPath = path.join(
    tempDir,
    'missing release-readiness evidence.json',
  )
  const ciCommandPath = ciEvidencePath
  const platformCommandPath = path.relative(process.cwd(), platformEvidencePath)
  const realDeviceCommandPath = path.relative(process.cwd(), realDevicePath)
  const readinessCommandPath = path.relative(process.cwd(), readinessPath)

  try {
    fs.copyFileSync(
      path.join(process.cwd(), 'release/ci-runs.json'),
      ciEvidencePath,
    )
    fs.copyFileSync(
      path.join(process.cwd(), 'release/platform-evidence.json'),
      platformEvidencePath,
    )
    const result = runReadiness([
      '--allow-open',
      '--expected-commit',
      ciEvidence.commit,
      '--ci-evidence',
      ciEvidencePath,
      '--platform-evidence',
      platformEvidencePath,
      '--real-device-path',
      realDevicePath,
      '--readiness-path',
      readinessPath,
      '--summary-output',
      summaryPath,
    ])
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))

    assert.equal(result.status, 0)
    assert.equal(summary.checks.initialCiEvidence, true)
    assert.equal(summary.initialCiEvidence.path, ciEvidencePath)
    assert.equal(summary.platformEvidence.evidencePresent, true)
    assert.equal(summary.platformEvidence.ready, false)
    assert.equal(summary.platformEvidence.path, platformCommandPath)
    assert.ok(
      summary.platformEvidence.errors.some((error) =>
        error.includes('android.artifact must be a non-empty string'),
      ),
    )
    assert.equal(summary.realDeviceEvidence.evidencePresent, false)
    assert.equal(summary.realDeviceEvidence.ready, false)
    assert.equal(summary.realDeviceEvidence.androidReady, false)
    assert.equal(summary.realDeviceEvidence.iosReady, false)
    assert.equal(summary.realDeviceEvidence.errorCount, 1)
    assert.ok(
      summary.realDeviceEvidence.readErrors.some((error) =>
        error.includes('missing real-device evidence.json'),
      ),
    )
    assert.equal(summary.releaseReadinessEvidence.evidencePresent, false)
    assert.equal(summary.releaseReadinessEvidence.ready, false)
    assert.equal(summary.releaseReadinessEvidence.errorCount, 1)
    assert.ok(
      summary.releaseReadinessEvidence.readErrors.some((error) =>
        error.includes('missing release-readiness evidence.json'),
      ),
    )
    const realDeviceAction = summary.nextActions.find(
      (action) => action.id === 'real-device-evidence',
    )
    assert.ok(realDeviceAction)
    assert.match(realDeviceAction.detail, /Android: 6 metadata field\(s\) missing/)
    assert.match(
      realDeviceAction.detail,
      /tested release commit\.\nAndroid: 6 metadata field\(s\) missing/,
    )
    assert.match(realDeviceAction.detail, /iOS: 6 metadata field\(s\) missing/)
    assert.ok(
      realDeviceAction.platformCheckDetails.some(
        (detail) =>
          detail.platform === 'android' &&
          detail.check === 'cold-launch' &&
          detail.description.includes('Install the exported build'),
      ),
    )
    assert.ok(
      realDeviceAction.platformCheckDetails.some(
        (detail) =>
          detail.check === 'network-if-selected' &&
          detail.mustPass === true &&
          detail.selectedApis.includes('fetch') &&
          detail.selectedApis.includes('WebSocket'),
      ),
    )
    assert.ok(
      realDeviceAction.platformCheckDetails.some(
        (detail) =>
          detail.platform === 'ios' &&
          detail.check === 'deep-links-share-notifications-if-selected' &&
          detail.mustPass === false &&
          detail.description.includes('Verify cold-start'),
      ),
    )
    assert.equal(realDeviceAction.commands[0], 'npm run check')
    assert.equal(
      realDeviceAction.commands[1],
      'npm run check:device-prereqs -- --summary-output release/device-test-prereqs-summary.json --allow-missing',
    )
    assert.equal(
      realDeviceAction.commands[2],
      `npm run release:preflight -- --local --skip-check --skip-godot --expected-commit ${summary.commit} --summary-output /tmp/vue-godot-local-preflight-summary.json`,
    )
    assert.ok(
      realDeviceAction.commands.every(
        (command) =>
          !command.includes('npm run release:platform-evidence --'),
      ),
    )
    assert.ok(
      realDeviceAction.commands.includes(
        `npm run release:record-platform-evidence -- --platform android --platform-evidence ${shellQuote(platformCommandPath)} --list-checks --summary-output release/platform-evidence-summary.json --expected-commit ${summary.commit}`,
      ),
    )
    assert.ok(
      realDeviceAction.commands.includes(
        `npm run release:record-platform-evidence -- --platform android --platform-evidence ${shellQuote(platformCommandPath)} --artifact <android-apk-aab-or-hosted-build-id> --evidence-url <android-non-local-device-evidence-url> --export-preset 'Android Release' --device <android-device-model> --os <android-os-version> --orientation <tested-orientations> --locale <tested-locale> --pass cold-launch --summary-output release/platform-evidence-summary.json --expected-commit ${summary.commit}`,
      ),
    )
    assert.ok(
      realDeviceAction.commands.includes(
        `npm run release:record-platform-evidence -- --platform android --platform-evidence ${shellQuote(platformCommandPath)} --artifact <android-apk-aab-or-hosted-build-id> --evidence-url <android-non-local-device-evidence-url> --export-preset 'Android Release' --device <android-device-model> --os <android-os-version> --orientation <tested-orientations> --locale <tested-locale> --pass-remaining --pass-remaining-confirmation <confirm-all-remaining-must-pass-checks-after-testing> --summary-output release/platform-evidence-summary.json --expected-commit ${summary.commit}`,
      ),
    )
    assert.ok(
      realDeviceAction.commands.includes(
        `npm run release:record-platform-evidence -- --platform ios --platform-evidence ${shellQuote(platformCommandPath)} --list-checks --summary-output release/platform-evidence-summary.json --expected-commit ${summary.commit}`,
      ),
    )
    assert.ok(
      realDeviceAction.commands.includes(
        `npm run release:record-platform-evidence -- --platform ios --platform-evidence ${shellQuote(platformCommandPath)} --artifact <ios-archive-testflight-or-hosted-build-id> --evidence-url <ios-non-local-device-evidence-url> --export-preset 'iOS Release' --device <ios-device-model> --os <ios-version> --orientation <tested-orientations> --locale <tested-locale> --pass cold-launch --summary-output release/platform-evidence-summary.json --expected-commit ${summary.commit}`,
      ),
    )
    assert.ok(
      realDeviceAction.commands.includes(
        `npm run release:record-platform-evidence -- --platform ios --platform-evidence ${shellQuote(platformCommandPath)} --artifact <ios-archive-testflight-or-hosted-build-id> --evidence-url <ios-non-local-device-evidence-url> --export-preset 'iOS Release' --device <ios-device-model> --os <ios-version> --orientation <tested-orientations> --locale <tested-locale> --pass-remaining --pass-remaining-confirmation <confirm-all-remaining-must-pass-checks-after-testing> --skip 'deep-links-share-notifications-if-selected=<skip-reason-if-not-selected>' --summary-output release/platform-evidence-summary.json --expected-commit ${summary.commit}`,
      ),
    )
    assert.ok(
      realDeviceAction.commands.includes(
        `npm run check:platform-evidence -- --platform-evidence ${shellQuote(platformCommandPath)} --summary-output release/platform-evidence-summary.json --checklist-output release/platform-evidence-checklist.md --allow-open --expected-commit ${summary.commit}`,
      ),
    )
    assert.ok(
      realDeviceAction.commands.includes(
        `npm run check:platform-evidence -- --platform-evidence ${shellQuote(platformCommandPath)} --expected-commit ${summary.commit}`,
      ),
    )
    assert.ok(
      realDeviceAction.commands.every(
        (command) => !command.includes('npm run release:ci --'),
      ),
    )
    assert.ok(
      realDeviceAction.commands.includes(
        `npm run release:evidence -- --platform-evidence ${shellQuote(platformCommandPath)} --ci-evidence ${shellQuote(ciCommandPath)} --commit ${summary.commit} --real-device-output ${shellQuote(realDeviceCommandPath)}`,
      ),
    )
    assert.ok(
      realDeviceAction.commands.includes(
        `npm run check:real-device-evidence -- --path ${shellQuote(realDeviceCommandPath)} --platform-evidence ${shellQuote(platformCommandPath)} --ci-evidence ${shellQuote(ciCommandPath)} --summary-output release/real-device-evidence-summary.json --checklist-output release/real-device-evidence-checklist.md --verify-runs --expected-commit ${summary.commit}`,
      ),
    )
    assert.ok(
      [
        `cp ${shellQuote(platformCommandPath)} release/platform-evidence.json`,
        `cp ${shellQuote(ciCommandPath)} release/ci-runs.json`,
        `cp ${shellQuote(realDeviceCommandPath)} release/real-device-evidence.json`,
        'git add release/platform-evidence.json release/ci-runs.json release/real-device-evidence.json',
      ].every((command) => realDeviceAction.commands.includes(command)),
    )
    assert.ok(
      realDeviceAction.commands.includes(
        'git commit -m "Add real-device release evidence"',
      ),
    )
    assert.ok(realDeviceAction.commands.includes('git push'))

    const handoffAction = summary.nextActions.find(
      (action) => action.id === 'release-handoff-report',
    )
    assert.ok(handoffAction)
    assert.equal('blockedBy' in handoffAction, false)
    assert.equal(
      summary.releaseHandoffReport.path,
      defaultReleaseHandoffReportPath,
    )
    assert.equal(
      summary.releaseHandoffReport.formatVersion,
      releaseHandoffReportFormatVersion,
    )
    assert.match(summary.releaseHandoffReport.stateHash, /^[0-9a-f]{16}$/)
    assert.equal(summary.releaseHandoffReport.current, false)
    assert.equal(
      summary.releaseHandoffReport.command,
      `npm run release:handoff -- --expected-commit ${summary.commit} --output release/release-handoff.md --ci-evidence ${shellQuote(ciCommandPath)} --platform-evidence ${shellQuote(platformCommandPath)} --real-device-path ${shellQuote(realDeviceCommandPath)} --readiness-path ${shellQuote(readinessCommandPath)}`,
    )
    assert.equal(
      handoffAction.commands[0],
      `npm run release:handoff -- --expected-commit ${summary.commit} --output release/release-handoff.md --ci-evidence ${shellQuote(ciCommandPath)} --platform-evidence ${shellQuote(platformCommandPath)} --real-device-path ${shellQuote(realDeviceCommandPath)} --readiness-path ${shellQuote(readinessCommandPath)}`,
    )
    assert.equal(
      handoffAction.commands[1],
      `npm run release:handoff -- --check --expected-commit ${summary.commit} --output release/release-handoff.md --ci-evidence ${shellQuote(ciCommandPath)} --platform-evidence ${shellQuote(platformCommandPath)} --real-device-path ${shellQuote(realDeviceCommandPath)} --readiness-path ${shellQuote(readinessCommandPath)}`,
    )

    const releasePreflightAction = summary.nextActions.find(
      (action) => action.id === 'release-preflight-evidence',
    )
    assert.ok(releasePreflightAction)
    assert.deepEqual(releasePreflightAction.blockedBy, [
      'real-device-evidence',
    ])
    assert.equal(releasePreflightAction.commands[0], 'npm run check')
    assert.equal(
      releasePreflightAction.commands[1],
      `npm run check:real-device-evidence -- --path ${shellQuote(realDeviceCommandPath)} --platform-evidence ${shellQuote(platformCommandPath)} --ci-evidence ${shellQuote(ciCommandPath)} --summary-output release/real-device-evidence-summary.json --checklist-output release/real-device-evidence-checklist.md --verify-runs --expected-commit ${summary.commit}`,
    )
    assert.ok(
      releasePreflightAction.commands.every(
        (command) => !command.includes('--ref <release-candidate-branch-or-tag>'),
      ),
    )
    assert.ok(
      releasePreflightAction.commands.some((command) =>
        command.includes('--ref <evidence-branch-or-tag>'),
      ),
    )
    assert.ok(
      releasePreflightAction.commands.some((command) =>
        command.includes(
          '--real-device-evidence-path release/real-device-evidence.json',
        ),
      ),
    )
    assert.ok(
      releasePreflightAction.commands.some((command) =>
        command.includes(`--output ${shellQuote(ciCommandPath)}`),
      ),
    )
    assert.ok(
      releasePreflightAction.commands.includes(
        `GH_TOKEN="$(gh auth token)" npm run release:preflight-summary -- --ci-evidence ${shellQuote(ciCommandPath)} --commit ${summary.commit} --output release/release-preflight-summary.json --checklist-output release/release-preflight-checklist.md`,
      ),
    )
    assert.ok(
      releasePreflightAction.commands.some((command) =>
        command.includes(
          '--release-preflight-run-commit "$(git rev-parse HEAD)"',
        ),
      ),
    )
    assert.ok(
      releasePreflightAction.commands.some((command) =>
        command.includes(
          `--readiness-output ${shellQuote(readinessCommandPath)}`,
        ),
      ),
    )
    assert.ok(
      releasePreflightAction.commands.includes(
        `npm run release:evidence -- --platform-evidence ${shellQuote(platformCommandPath)} --ci-evidence ${shellQuote(ciCommandPath)} --commit ${summary.commit} --real-device-output ${shellQuote(realDeviceCommandPath)} --release-preflight-summary release/release-preflight-summary.json --readiness-output ${shellQuote(readinessCommandPath)}`,
      ),
    )
    assert.ok(
      [
        `cp ${shellQuote(ciCommandPath)} release/ci-runs.json`,
        `cp ${shellQuote(realDeviceCommandPath)} release/real-device-evidence.json`,
        `cp ${shellQuote(readinessCommandPath)} release/release-readiness-evidence.json`,
        'git add release/ci-runs.json release/release-preflight-summary.json release/release-preflight-checklist.md release/real-device-evidence.json release/release-readiness-evidence.json',
      ].every((command) => releasePreflightAction.commands.includes(command)),
    )
    assert.ok(
      releasePreflightAction.commands.includes(
        'git commit -m "Add release readiness evidence"',
      ),
    )
    assert.ok(releasePreflightAction.commands.includes('git push'))
    assert.ok(
      releasePreflightAction.commands.includes(
        `npm run release:readiness -- --summary-output release/release-readiness-summary.json --checklist-output release/release-readiness-checklist.md --expected-commit ${summary.commit}`,
      ),
    )
    const finalWarningAction = summary.nextActions.find(
      (action) => action.id === 'final-warning-removal',
    )
    assert.ok(finalWarningAction)
    assert.match(
      finalWarningAction.detail,
      /generated commands then run npm run check/,
    )
    assert.doesNotMatch(finalWarningAction.detail, /then stages and commits/)
    assert.deepEqual(finalWarningAction.blockedBy, [
      'real-device-evidence',
      'release-preflight-evidence',
    ])
    assert.ok(
      finalWarningAction.commands.includes(
        `npm run release:readiness -- --summary-output /tmp/vue-godot-readiness.json --checklist-output /tmp/vue-godot-readiness.md --expected-commit ${summary.commit} --ci-evidence ${shellQuote(ciCommandPath)} --platform-evidence ${shellQuote(platformCommandPath)} --real-device-path ${shellQuote(realDeviceCommandPath)} --readiness-path ${shellQuote(readinessCommandPath)}`,
      ),
    )
    assert.ok(
      finalWarningAction.commands.includes(
        `npm run release:readiness -- --summary-output release/release-readiness-summary.json --checklist-output release/release-readiness-checklist.md --expected-commit ${summary.commit} --ci-evidence ${shellQuote(ciCommandPath)} --platform-evidence ${shellQuote(platformCommandPath)} --real-device-path ${shellQuote(realDeviceCommandPath)} --readiness-path ${shellQuote(readinessCommandPath)}`,
      ),
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('release readiness reuses committed initial CI evidence in next actions', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-readiness-'))
  const summaryPath = path.join(tempDir, 'release-readiness-summary.json')
  const realDevicePath = path.join(tempDir, 'missing-real-device-evidence.json')
  const readinessPath = path.join(
    tempDir,
    'missing-release-readiness-evidence.json',
  )
  const realDeviceCommandPath = path.relative(process.cwd(), realDevicePath)
  const readinessCommandPath = path.relative(process.cwd(), readinessPath)
  const ciEvidence = readCommittedReleaseCiEvidence()

  try {
    const result = runReadiness([
      '--allow-open',
      '--expected-commit',
      ciEvidence.commit,
      '--real-device-path',
      realDevicePath,
      '--readiness-path',
      readinessPath,
      '--summary-output',
      summaryPath,
    ])
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))

    assert.equal(result.status, 0)
    assert.equal(summary.checks.initialCiEvidence, true)
    assert.equal(
      summary.finalTodoRequirements.find(
        (status) => status.proof === 'checkCiEvidenceReady',
      )?.ready,
      true,
    )
    assert.equal(
      summary.finalTodoRequirements.find(
        (status) => status.proof === 'godotSmokeCiEvidenceReady',
      )?.ready,
      true,
    )
    assert.equal(
      summary.nextActions.some((action) => action.id === 'ci-evidence'),
      false,
    )

    const realDeviceAction = summary.nextActions.find(
      (action) => action.id === 'real-device-evidence',
    )
    assert.ok(realDeviceAction)
    assert.ok(
      realDeviceAction.commands.every(
        (command) => !command.includes('npm run release:ci --'),
      ),
    )

    const handoffAction = summary.nextActions.find(
      (action) => action.id === 'release-handoff-report',
    )
    assert.ok(handoffAction)
    assert.equal(
      handoffAction.commands[0],
      `npm run release:handoff -- --expected-commit ${ciEvidence.commit} --output release/release-handoff.md --real-device-path ${shellQuote(realDeviceCommandPath)} --readiness-path ${shellQuote(readinessCommandPath)}`,
    )
    assert.equal(
      handoffAction.commands[1],
      `npm run release:handoff -- --check --expected-commit ${ciEvidence.commit} --output release/release-handoff.md --real-device-path ${shellQuote(realDeviceCommandPath)} --readiness-path ${shellQuote(readinessCommandPath)}`,
    )

    const releasePreflightAction = summary.nextActions.find(
      (action) => action.id === 'release-preflight-evidence',
    )
    assert.ok(releasePreflightAction)
    assert.deepEqual(releasePreflightAction.blockedBy, [
      'real-device-evidence',
    ])
    assert.ok(
      releasePreflightAction.commands.every(
        (command) =>
          command.includes('--include-release-preflight') ||
          !command.includes('npm run release:ci --'),
      ),
    )
    assert.ok(
      releasePreflightAction.commands.includes(
        `npm run check:real-device-evidence -- --path ${shellQuote(realDeviceCommandPath)} --summary-output release/real-device-evidence-summary.json --checklist-output release/real-device-evidence-checklist.md --verify-runs --expected-commit ${ciEvidence.commit}`,
      ),
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('release readiness matches default handoff action to report currentness', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-readiness-'))
  const summaryPath = path.join(tempDir, 'release-readiness-summary.json')
  const ciEvidence = readCommittedReleaseCiEvidence()

  try {
    const result = runReadiness([
      '--allow-open',
      '--expected-commit',
      ciEvidence.commit,
      '--summary-output',
      summaryPath,
    ])
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))

    assert.equal(result.status, 0)
    assert.equal(summary.checks.initialCiEvidence, true)
    const reportIsCurrent = isReleaseHandoffReportCurrent(
      ciEvidence.commit,
      {},
      {
        stateHash: summary.releaseHandoffReport.stateHash,
      },
    )
    assert.equal(
      summary.releaseHandoffReport.path,
      defaultReleaseHandoffReportPath,
    )
    assert.equal(
      summary.releaseHandoffReport.formatVersion,
      releaseHandoffReportFormatVersion,
    )
    assert.match(summary.releaseHandoffReport.stateHash, /^[0-9a-f]{16}$/)
    assert.equal(summary.releaseHandoffReport.current, reportIsCurrent)
    assert.equal(
      isReleaseHandoffReportCurrent(ciEvidence.commit, {}, {
        stateHash: summary.releaseHandoffReport.stateHash,
      }),
      reportIsCurrent,
    )
    assert.equal(
      summary.releaseHandoffReport.command,
      `npm run release:handoff -- --expected-commit ${ciEvidence.commit} --output release/release-handoff.md`,
    )
    assert.equal(
      summary.nextActions.some(
        (action) => action.id === 'release-handoff-report',
      ),
      !reportIsCurrent,
    )
    assert.ok(
      summary.nextActions.some((action) => action.id === 'real-device-evidence'),
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('release handoff report currentness rejects stale commits and commands', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-readiness-'))
  const reportPath = path.join(tempDir, 'release-handoff.md')
  const commit = '1234567890abcdef1234567890abcdef12345678'
  const command = `npm run release:handoff -- --expected-commit ${commit} --output release/release-handoff.md`
  const stateHash = '0123456789abcdef'

  try {
    fs.writeFileSync(
      reportPath,
      [
        '# Release Handoff',
        '',
        `- Release candidate commit: \`${commit}\``,
        `- Handoff format: ${releaseHandoffReportFormatVersion}`,
        `- Handoff state: ${stateHash}`,
        '',
        '## Next Actions',
        '',
        '```bash',
        command,
        '```',
        '',
      ].join('\n'),
    )

    assert.equal(
      isReleaseHandoffReportCurrent(commit, {}, { reportPath, stateHash }),
      true,
    )
    assert.equal(
      isReleaseHandoffReportCurrent(commit, {}, {
        reportPath,
        stateHash: 'fedcba9876543210',
      }),
      false,
    )
    assert.equal(
      isReleaseHandoffReportCurrent(
        'ffffffffffffffffffffffffffffffffffffffff',
        {},
        { reportPath, stateHash },
      ),
      false,
    )

    fs.writeFileSync(
      reportPath,
      [
        '# Release Handoff',
        '',
        `- Release candidate commit: \`${commit}\``,
        `- Handoff format: ${releaseHandoffReportFormatVersion}`,
        '',
        '## Next Actions',
        '',
        '```bash',
        command,
        '```',
        '',
      ].join('\n'),
    )
    assert.equal(
      isReleaseHandoffReportCurrent(commit, {}, { reportPath, stateHash }),
      false,
    )

    fs.writeFileSync(
      reportPath,
      [
        '# Release Handoff',
        '',
        `- Release candidate commit: \`${commit}\``,
        `- Handoff state: ${stateHash}`,
        '',
        '## Next Actions',
        '',
        '```bash',
        command,
        '```',
        '',
      ].join('\n'),
    )
    assert.equal(
      isReleaseHandoffReportCurrent(commit, {}, { reportPath, stateHash }),
      false,
    )

    fs.writeFileSync(
      reportPath,
      [
        '# Release Handoff',
        '',
        `- Release candidate commit: \`${commit}\``,
        `- Handoff format: ${releaseHandoffReportFormatVersion}`,
        `- Handoff state: ${stateHash}`,
        '',
        '## Next Actions',
        '',
        '### Complete Android and iOS real-device export evidence',
        '',
      ].join('\n'),
    )
    assert.equal(
      isReleaseHandoffReportCurrent(commit, {}, { reportPath, stateHash }),
      true,
    )
    assert.equal(
      isReleaseHandoffReportCurrent(
        commit,
        { realDeviceEvidencePath: 'custom/real-device-evidence.json' },
        { reportPath, stateHash },
      ),
      false,
    )

    fs.writeFileSync(
      reportPath,
      [
        '# Release Handoff',
        '',
        `- Release candidate commit: \`${commit}\``,
        `- Handoff format: ${releaseHandoffReportFormatVersion}`,
        `- Handoff state: ${stateHash}`,
        '',
        '## Next Actions',
        '',
        '```bash',
        `npm run release:handoff -- --expected-commit ${commit} --output stale/handoff.md`,
        '```',
        '',
      ].join('\n'),
    )
    assert.equal(
      isReleaseHandoffReportCurrent(commit, {}, { reportPath, stateHash }),
      false,
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('release readiness CI evidence commands quote local branch names', () => {
  assert.deepEqual(
    ciEvidenceCommands('0123456789abcdef0123456789abcdef01234567', {
      currentBranch: "release candidate's branch",
      upstreamRef: null,
    }),
    [
      'npm run check',
      "git push --set-upstream origin 'release candidate'\\''s branch'",
      'npm run release:ci -- --commit 0123456789abcdef0123456789abcdef01234567 --wait --output release/ci-runs.json',
      'GH_TOKEN="$(gh auth token)" npm run release:ci -- --commit 0123456789abcdef0123456789abcdef01234567 --dispatch-missing --wait --ref <release-candidate-branch-or-tag> --output release/ci-runs.json',
    ],
  )
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

test('release readiness allows Release Preflight to run on evidence commits', () => {
  const evidence = JSON.parse(
    fs.readFileSync('docs/release-readiness-evidence.example.json', 'utf-8'),
  )
  evidence.releasePreflightRunCommit =
    'abcdef0123456789abcdef0123456789abcdef01'

  assert.deepEqual(
    validateReleaseReadinessEvidence(
      evidence,
      '0123456789abcdef0123456789abcdef01234567',
    ),
    [],
  )
})

test('release readiness evidence requires full commit SHAs', () => {
  const evidence = JSON.parse(
    fs.readFileSync('docs/release-readiness-evidence.example.json', 'utf-8'),
  )
  evidence.commit = 'release-candidate'
  evidence.releasePreflightRunCommit = 'main'

  const errors = validateReleaseReadinessEvidence(evidence).join('\n')

  assert.match(
    errors,
    /releaseReadiness\.commit must be a full 40-character git commit SHA/,
  )
  assert.match(
    errors,
    /releaseReadiness\.releasePreflightRunCommit must be a full 40-character git commit SHA/,
  )
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

test('release readiness rejects incomplete production profile device evidence', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-readiness-'))
  const realDevicePath = path.join(tempDir, 'real-device-evidence.json')
  const evidence = JSON.parse(
    fs.readFileSync('docs/real-device-evidence.example.json', 'utf-8'),
  )
  evidence.android.selectedApis = evidence.android.selectedApis.filter(
    (apiName) => apiName !== 'navigator.clipboard',
  )

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
      /android\.selectedApis must include production profile API\(s\): navigator\.clipboard/,
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})
