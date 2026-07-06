import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import zlib from 'node:zlib'

import {
  extractReleasePreflightRunUrl,
  extractReleasePreflightSummaryFromZip,
  formatReleasePreflightSummaryChecklist,
  releasePreflightSummaryArtifactName,
  selectReleasePreflightSummaryArtifact,
} from '../scripts/download-release-preflight-summary.mjs'

const commit = '0123456789abcdef0123456789abcdef01234567'
const evidenceCommit = 'abcdef0123456789abcdef0123456789abcdef01'

test('release preflight summary rejects non-SHA commit inputs', () => {
  const result = spawnSync(
    process.execPath,
    [
      'scripts/download-release-preflight-summary.mjs',
      '--run-url',
      'https://github.com/portwatcher/vue-godot/actions/runs/1',
      '--commit',
      'release-candidate',
    ],
    { cwd: process.cwd(), encoding: 'utf-8' },
  )

  assert.equal(result.status, 1)
  assert.match(
    `${result.stdout}\n${result.stderr}`,
    /--commit must be a full 40-character git commit SHA/,
  )
})

test('release preflight summary rejects non-SHA preflight run commit inputs', () => {
  const result = spawnSync(
    process.execPath,
    [
      'scripts/download-release-preflight-summary.mjs',
      '--run-url',
      'https://github.com/portwatcher/vue-godot/actions/runs/1',
      '--release-preflight-run-commit',
      'evidence-branch',
    ],
    { cwd: process.cwd(), encoding: 'utf-8' },
  )

  assert.equal(result.status, 1)
  assert.match(
    `${result.stdout}\n${result.stderr}`,
    /--release-preflight-run-commit must be a full 40-character git commit SHA/,
  )
})

test('release preflight summary rejects conflicting preflight run commits', () => {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vue-godot-preflight-summary-'),
  )
  const ciEvidencePath = path.join(tempDir, 'ci-runs.json')

  try {
    fs.writeFileSync(
      ciEvidencePath,
      `${JSON.stringify({
        evidence: {
          commit,
          workflows: {
            Check: {
              runUrl:
                'https://github.com/portwatcher/vue-godot/actions/runs/1',
            },
            'Godot Smoke': {
              runUrl:
                'https://github.com/portwatcher/vue-godot/actions/runs/2',
            },
            'Release Preflight': {
              runUrl:
                'https://github.com/portwatcher/vue-godot/actions/runs/3',
              runCommit: evidenceCommit,
            },
          },
        },
        errors: [],
      })}\n`,
    )

    const result = spawnSync(
      process.execPath,
      [
        'scripts/download-release-preflight-summary.mjs',
        '--ci-evidence',
        ciEvidencePath,
        '--commit',
        commit,
        '--release-preflight-run-commit',
        commit,
      ],
      { cwd: process.cwd(), encoding: 'utf-8' },
    )

    assert.equal(result.status, 1)
    assert.match(
      `${result.stdout}\n${result.stderr}`,
      /--release-preflight-run-commit does not match --ci-evidence Release Preflight/,
    )
    assert.doesNotMatch(`${result.stdout}\n${result.stderr}`, /GitHub API/)
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

function zipEntry(name, contents) {
  const nameBuffer = Buffer.from(name)
  const source = Buffer.from(contents)
  const compressed = zlib.deflateRawSync(source)
  const localHeader = Buffer.alloc(30)
  localHeader.writeUInt32LE(0x04034b50, 0)
  localHeader.writeUInt16LE(20, 4)
  localHeader.writeUInt16LE(8, 8)
  localHeader.writeUInt32LE(compressed.length, 18)
  localHeader.writeUInt32LE(source.length, 22)
  localHeader.writeUInt16LE(nameBuffer.length, 26)

  const localFile = Buffer.concat([localHeader, nameBuffer, compressed])
  const centralDirectory = Buffer.alloc(46)
  centralDirectory.writeUInt32LE(0x02014b50, 0)
  centralDirectory.writeUInt16LE(20, 4)
  centralDirectory.writeUInt16LE(20, 6)
  centralDirectory.writeUInt16LE(8, 10)
  centralDirectory.writeUInt32LE(compressed.length, 20)
  centralDirectory.writeUInt32LE(source.length, 24)
  centralDirectory.writeUInt16LE(nameBuffer.length, 28)

  const centralDirectoryFile = Buffer.concat([centralDirectory, nameBuffer])
  const endOfCentralDirectory = Buffer.alloc(22)
  endOfCentralDirectory.writeUInt32LE(0x06054b50, 0)
  endOfCentralDirectory.writeUInt16LE(1, 8)
  endOfCentralDirectory.writeUInt16LE(1, 10)
  endOfCentralDirectory.writeUInt32LE(centralDirectoryFile.length, 12)
  endOfCentralDirectory.writeUInt32LE(localFile.length, 16)

  return Buffer.concat([localFile, centralDirectoryFile, endOfCentralDirectory])
}

test('release preflight summary artifact selection prefers the latest unexpired artifact', () => {
  const selected = selectReleasePreflightSummaryArtifact([
    {
      id: 1,
      name: releasePreflightSummaryArtifactName,
      expired: false,
      updated_at: '2026-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'other-artifact',
      expired: false,
      updated_at: '2026-01-01T02:00:00Z',
    },
    {
      id: 3,
      name: releasePreflightSummaryArtifactName,
      expired: true,
      updated_at: '2026-01-01T03:00:00Z',
    },
    {
      id: 4,
      name: releasePreflightSummaryArtifactName,
      expired: false,
      updated_at: '2026-01-01T01:00:00Z',
    },
  ])

  assert.equal(selected.id, 4)
})

test('release preflight summary artifact extraction reads the uploaded summary JSON', () => {
  const summary = {
    commit,
    localOnly: false,
    skipCheck: false,
    skipGodot: false,
    skipSeriousExamples: false,
    warningCount: 0,
    failureCount: 0,
    warnings: [],
    failures: [],
  }
  const zipBuffer = zipEntry(
    'release/release-preflight-summary.json',
    JSON.stringify(summary),
  )

  assert.deepEqual(
    JSON.parse(extractReleasePreflightSummaryFromZip(zipBuffer)),
    summary,
  )
})

test('release preflight summary artifact extraction accepts flattened artifact paths', () => {
  const summary = {
    commit,
    warningCount: 0,
    failureCount: 0,
    warnings: [],
    failures: [],
  }
  const zipBuffer = zipEntry(
    'release-preflight-summary.json',
    JSON.stringify(summary),
  )

  assert.deepEqual(
    JSON.parse(extractReleasePreflightSummaryFromZip(zipBuffer)),
    summary,
  )
})

test('release preflight summary checklist renders gate status and evidence commands', () => {
  const runUrl = 'https://github.com/portwatcher/vue-godot/actions/runs/3'
  const summary = {
    commit,
    localOnly: false,
    skipCheck: false,
    skipGodot: false,
    skipSeriousExamples: false,
    warningCount: 0,
    failureCount: 0,
    warnings: [],
    failures: [],
  }

  const checklist = formatReleasePreflightSummaryChecklist(summary, {
    artifactId: 9,
    artifactName: releasePreflightSummaryArtifactName,
    checklistOutput: 'release/release-preflight-checklist.md',
    ciEvidencePath: 'release/ci-runs.json',
    commit,
    runCommit: evidenceCommit,
    runConclusion: 'success',
    runUrl,
    summaryOutput: 'release/release-preflight-summary.json',
    workflowName: 'Release Preflight',
  })

  assert.match(checklist, /# Release Preflight Evidence Checklist/)
  assert.match(checklist, /- Status: ready/)
  assert.match(checklist, /\[x\] Non-local preflight: localOnly=false/)
  assert.match(checklist, /\[x\] No release preflight warnings: warningCount=0/)
  assert.match(checklist, new RegExp(`Release Preflight run URL: ${runUrl}`))
  assert.match(
    checklist,
    /release:preflight-summary -- --ci-evidence release\/ci-runs\.json/,
  )
  assert.match(
    checklist,
    /--checklist-output release\/release-preflight-checklist\.md/,
  )
  assert.match(checklist, /release:evidence/)
  assert.match(checklist, /--release-preflight-summary release\/release-preflight-summary\.json/)
  assert.match(checklist, /release:readiness/)
})

test('release preflight summary run URL can be read from CI evidence', () => {
  const runUrl = 'https://github.com/portwatcher/vue-godot/actions/runs/3'
  assert.deepEqual(
    extractReleasePreflightRunUrl(
      {
        evidence: {
          commit,
          workflows: {
            Check: {
              runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
            },
            'Godot Smoke': {
              runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/2',
            },
            'Release Preflight': {
              runUrl,
            },
          },
        },
        errors: [],
      },
      commit,
    ),
    {
      runUrl,
      runCommit: null,
      errors: [],
    },
  )
})

test('release preflight summary run commit can be read from CI evidence', () => {
  const runUrl = 'https://github.com/portwatcher/vue-godot/actions/runs/3'
  assert.deepEqual(
    extractReleasePreflightRunUrl(
      {
        evidence: {
          commit,
          workflows: {
            Check: {
              runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/1',
            },
            'Godot Smoke': {
              runUrl: 'https://github.com/portwatcher/vue-godot/actions/runs/2',
            },
            'Release Preflight': {
              runUrl,
              runCommit: evidenceCommit,
            },
          },
        },
        errors: [],
      },
      commit,
    ),
    {
      runUrl,
      runCommit: evidenceCommit,
      errors: [],
    },
  )
})
