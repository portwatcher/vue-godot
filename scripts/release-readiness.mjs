import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  defaultRealDeviceEvidencePath,
  describeRealDeviceEvidencePath,
  readRealDeviceEvidence,
  realDeviceEvidenceEnvVar,
  resolveRealDeviceEvidencePath,
  validateRealDeviceEvidenceMetadata,
  validateRealDevicePlatformEvidence,
  verifyRealDeviceEvidenceRuns,
} from './real-device-evidence.mjs'
import {
  assertExactString,
  assertGitHubActionsRunUrl,
  hasNonEmptyString,
  isRecord,
  verifyGitHubActionsRunUrl,
} from './release-evidence-utils.mjs'
import {
  formatChecklistLine as checklistLine,
  formatChecklistValue as displayValue,
  formatIssueLines,
} from './markdown-checklist-utils.mjs'
import {
  collectDevicePrereqDiagnostics,
  formatDevicePrereqDiagnosticLines,
} from './device-prereq-diagnostics.mjs'
import { readInitialCiEvidenceStatus } from './release-ci-evidence.mjs'

export { validateInitialCiEvidence } from './release-ci-evidence.mjs'
import { collectPublicSurfaceAuditErrors } from './public-surface-audit.mjs'
import { collectLocalGitReleaseState } from './check-release-ci-runs.mjs'
import {
  collectPlatformEvidenceCommandMetadata,
  collectPlatformEvidencePassChecks,
  collectPlatformEvidenceRemainingCheckDetails,
  collectPlatformEvidenceSkippableMissingChecks,
  formatPlatformEvidenceRemainingBlock,
  readPlatformEvidenceAudit,
} from './check-platform-evidence.mjs'
import { finalizationFiles } from './release-finalization-files.mjs'
import {
  checkPlatformEvidenceCommand,
  checkDevicePrereqsCommand,
  checkRealDeviceEvidenceCommand,
  commitEvidenceFileCommands,
  currentHeadCommitCommand,
  defaultDeviceTestPrereqsSummaryPath,
  defaultPlatformEvidenceChecklistPath,
  defaultPlatformEvidencePath,
  defaultRealDeviceEvidenceChecklistPath,
  defaultRealDeviceEvidenceSummaryPath,
  defaultReleaseCiEvidencePath,
  defaultReleaseHandoffReportPath,
  defaultReleasePreflightChecklistPath,
  defaultReleasePreflightSummaryPath,
  defaultReleaseReadinessChecklistPath,
  defaultReleaseReadinessEvidencePath,
  defaultReleaseReadinessSummaryPath,
  formatReleaseCommandBlock,
  formatHandoffCommand,
  hasCommandPlaceholders,
  initialReleaseCiCommands,
  localReleasePreflightCommand,
  productionProfilePlatformEvidenceCommand,
  recordPlatformEvidenceListChecksCommand,
  recordPlatformEvidenceCommands,
  releaseEvidenceCommand,
  releaseCommitLabel,
  releaseHandoffReportFormatVersion,
  releaseHandoffReportStateHash,
  releasePreflightCiCommands,
  releasePreflightSummaryCommand,
  repoLocalEvidencePath,
} from './release-handoff-commands.mjs'
import {
  currentReleasePackageVersions,
  isFullCommitSha,
  normalizeCommitSha,
  readJson,
  releasePackageConfigs,
  repoRoot,
  run,
  shellQuote,
} from './release-utils.mjs'

const releaseReadinessEvidenceEnvVar = 'VUE_GODOT_RELEASE_READINESS_EVIDENCE'

export const releaseWarningMarkers = [
  {
    file: 'README.md',
    label: 'root README production warning',
    pattern: /experimental and not production ready yet/i,
  },
  {
    file: 'README.md',
    label: 'root README preview wording',
    pattern: /preview\/experimental language/i,
  },
  {
    file: 'README.md',
    label: 'root README final-removal wording',
    pattern: /experimental\/not-production-ready text/i,
  },
  {
    file: 'docs/compatibility.md',
    label: 'compatibility docs experimental warning',
    pattern: /project is still experimental/i,
  },
  {
    file: 'docs/production.md',
    label: 'production docs experimental warning',
    pattern: /Vue Godot is still experimental/i,
  },
  {
    file: 'docs/production.md',
    label: 'production docs final-removal warning',
    pattern: /experimental\/not-production-ready language/i,
  },
  {
    file: 'docs/production.md',
    label: 'production docs alpha-quality warning',
    pattern: /preview\/alpha-quality/i,
  },
  {
    file: 'docs/real-device-release.md',
    label: 'real-device docs preview-quality warning',
    pattern: /preview-quality/i,
  },
]

const packageDescriptionWarningMarkers = [
  {
    label: 'package description not-production-ready wording',
    pattern: /not production ready/i,
  },
  {
    label: 'package description experimental wording',
    pattern: /experimental/i,
  },
  {
    label: 'package description alpha wording',
    pattern: /\balpha\b/i,
  },
]

function usage() {
  console.log(`Usage: node scripts/release-readiness.mjs [options]

Options:
  --allow-open                  Print blockers but exit 0.
  --ci-evidence <file>          Read initial Check/Godot Smoke CI evidence from
                                a specific file. Defaults to ${defaultReleaseCiEvidencePath}.
  --device-prereqs-summary <file>
                                Read diagnostic device prerequisite status from
                                a specific file. Defaults to ${defaultDeviceTestPrereqsSummaryPath}.
  --platform-evidence <file>    Read Android/iOS platform worksheet evidence
                                from a specific file. Defaults to ${defaultPlatformEvidencePath}.
  --real-device-path <file>     Read Android/iOS evidence from a specific file.
                                Defaults to ${realDeviceEvidenceEnvVar} or ${defaultRealDeviceEvidencePath}.
  --readiness-path <file>       Read release-readiness evidence from a specific file.
                                Defaults to ${releaseReadinessEvidenceEnvVar} or ${defaultReleaseReadinessEvidencePath}.
  --expected-commit <sha>       Require evidence files to match this release
                                commit. Defaults to the current git commit.
                                Use this when evidence files are committed
                                after testing a release-candidate commit.
  --summary-output <file>       Write machine-readable readiness blockers JSON.
  --checklist-output <file>     Write a Markdown checklist with readiness
                                blockers, final TODO proof, and next commands.
  --help                        Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    allowOpen: false,
    checklistOutput: null,
    ciEvidencePath: null,
    devicePrereqsSummaryPath: null,
    expectedCommit: null,
    platformEvidencePath: null,
    realDevicePath: null,
    readinessPath: null,
    summaryOutput: null,
  }

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
    }

    if (arg === '--allow-open') {
      options.allowOpen = true
      continue
    }

    if (arg === '--ci-evidence') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--ci-evidence requires a value')
      }
      options.ciEvidencePath = path.resolve(repoRoot, value)
      continue
    }

    if (arg === '--checklist-output') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--checklist-output requires a value')
      }
      options.checklistOutput = value
      continue
    }

    if (arg.startsWith('--checklist-output=')) {
      options.checklistOutput = arg.slice('--checklist-output='.length)
      continue
    }

    if (arg.startsWith('--ci-evidence=')) {
      options.ciEvidencePath = path.resolve(
        repoRoot,
        arg.slice('--ci-evidence='.length),
      )
      continue
    }

    if (arg === '--device-prereqs-summary') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--device-prereqs-summary requires a value')
      }
      options.devicePrereqsSummaryPath = path.resolve(repoRoot, value)
      continue
    }

    if (arg.startsWith('--device-prereqs-summary=')) {
      options.devicePrereqsSummaryPath = path.resolve(
        repoRoot,
        arg.slice('--device-prereqs-summary='.length),
      )
      continue
    }

    if (arg === '--expected-commit') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--expected-commit requires a value')
      }
      options.expectedCommit = normalizeCommitSha(value, '--expected-commit')
      continue
    }

    if (arg.startsWith('--expected-commit=')) {
      options.expectedCommit = normalizeCommitSha(
        arg.slice('--expected-commit='.length),
        '--expected-commit',
      )
      continue
    }

    if (arg === '--platform-evidence') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--platform-evidence requires a value')
      }
      options.platformEvidencePath = path.resolve(repoRoot, value)
      continue
    }

    if (arg.startsWith('--platform-evidence=')) {
      options.platformEvidencePath = path.resolve(
        repoRoot,
        arg.slice('--platform-evidence='.length),
      )
      continue
    }

    if (arg === '--real-device-path') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--real-device-path requires a value')
      }
      options.realDevicePath = path.resolve(repoRoot, value)
      continue
    }

    if (arg.startsWith('--real-device-path=')) {
      options.realDevicePath = path.resolve(
        repoRoot,
        arg.slice('--real-device-path='.length),
      )
      continue
    }

    if (arg === '--readiness-path') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--readiness-path requires a value')
      }
      options.readinessPath = path.resolve(repoRoot, value)
      continue
    }

    if (arg.startsWith('--readiness-path=')) {
      options.readinessPath = path.resolve(
        repoRoot,
        arg.slice('--readiness-path='.length),
      )
      continue
    }

    if (arg === '--summary-output') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--summary-output requires a value')
      }
      options.summaryOutput = value
      continue
    }

    if (arg.startsWith('--summary-output=')) {
      options.summaryOutput = arg.slice('--summary-output='.length)
      continue
    }

    throw new Error(`Unknown option: ${arg}`)
  }

  return options
}

function relative(filePath) {
  return path.relative(repoRoot, filePath) || filePath
}

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf-8')
}

function currentCommit(blockers) {
  const result = run('git', ['rev-parse', 'HEAD'])
  if (result.status !== 0) {
    blockers.push(`Unable to read current git commit\n${result.stderr}`)
    return null
  }
  return result.stdout.trim()
}

function checkCleanWorktree(blockers) {
  const result = run('git', ['status', '--porcelain'])
  if (result.status !== 0) {
    blockers.push(`Unable to read git worktree status\n${result.stderr}`)
    return false
  }

  const status = result.stdout.trim()
  if (status.length > 0) {
    blockers.push(
      ['working tree must be clean for final release readiness', status].join(
        '\n',
      ),
    )
    return false
  }

  return true
}

export function collectTodoItems(source, file = 'TODO.md') {
  return source.split(/\r?\n/).flatMap((line, index) => {
    const match = line.match(/^\s*- \[([ xX])\] (.+)$/)
    if (!match) {
      return []
    }
    return [
      {
        checked: match[1].toLowerCase() === 'x',
        file,
        line: index + 1,
        text: match[2],
      },
    ]
  })
}

function readTodoItems() {
  return collectTodoItems(readText('TODO.md'))
}

export function collectUncheckedTodoItems(todoItems) {
  return todoItems
    .filter((item) => !item.checked)
    .map((item) => `${item.file}:${item.line} ${item.text}`)
}

function resolveReadinessEvidencePath(options) {
  if (options.readinessPath) {
    return options.readinessPath
  }

  return path.resolve(
    repoRoot,
    process.env[releaseReadinessEvidenceEnvVar] ||
      defaultReleaseReadinessEvidencePath,
  )
}

function readJsonEvidence(evidencePath) {
  if (!fs.existsSync(evidencePath)) {
    return {
      evidence: null,
      errors: [`Release-readiness evidence file not found: ${evidencePath}`],
    }
  }

  try {
    return {
      evidence: JSON.parse(fs.readFileSync(evidencePath, 'utf-8')),
      errors: [],
    }
  } catch (error) {
    return {
      evidence: null,
      errors: [
        `Release-readiness evidence file is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
      ],
    }
  }
}

function assertCommitSha(record, key, errors, label) {
  if (!hasNonEmptyString(record, key)) {
    errors.push(`${label}.${key} must be a non-empty string`)
    return
  }

  if (!isFullCommitSha(record[key])) {
    errors.push(`${label}.${key} must be a full 40-character git commit SHA`)
  }
}

export function validateReleaseReadinessEvidence(evidence, expectedCommit) {
  const errors = []

  if (!isRecord(evidence)) {
    return ['Release-readiness evidence must be a JSON object']
  }

  for (const key of ['commit', 'releasePreflightRunCommit']) {
    assertCommitSha(evidence, key, errors, 'releaseReadiness')
  }
  if (!hasNonEmptyString(evidence, 'releasePreflightRunConclusion')) {
    errors.push(
      'releaseReadiness.releasePreflightRunConclusion must be a non-empty string',
    )
  }

  assertGitHubActionsRunUrl(
    evidence,
    'releasePreflightRunUrl',
    errors,
    'releaseReadiness',
  )
  assertExactString(
    evidence,
    'releasePreflightRunWorkflowName',
    'Release Preflight',
    errors,
    'releaseReadiness',
  )

  if (evidence.releasePreflightRunConclusion !== 'success') {
    errors.push(
      'releaseReadiness.releasePreflightRunConclusion must be "success"',
    )
  }

  for (const key of [
    'releasePreflightLocalOnly',
    'releasePreflightSkipCheck',
    'releasePreflightSkipGodot',
    'releasePreflightSkipSeriousExamples',
  ]) {
    if (evidence[key] !== false) {
      errors.push(`releaseReadiness.${key} must be false`)
    }
  }

  if (evidence.releasePreflightFailureCount !== 0) {
    errors.push('releaseReadiness.releasePreflightFailureCount must be 0')
  }

  if (evidence.releasePreflightWarningCount !== 0) {
    errors.push('releaseReadiness.releasePreflightWarningCount must be 0')
  }

  if (
    expectedCommit &&
    hasNonEmptyString(evidence, 'commit') &&
    evidence.commit !== expectedCommit
  ) {
    errors.push(
      [
        `releaseReadiness.commit must match expected release commit ${expectedCommit}`,
        'If this evidence was committed after testing a release-candidate commit, rerun the readiness check with --expected-commit <release-candidate-sha>.',
      ].join('\n'),
    )
  }

  return errors
}

export const finalTodoEvidenceRequirements = [
  {
    text: '`npm run check` passes locally and in CI.',
    proof: 'checkCiEvidenceReady',
    reason:
      'committed release/ci-runs.json evidence must verify a successful Check workflow run',
  },
  {
    text: 'Godot smoke, generated Godot smoke, and editor reload smoke pass in CI for every release candidate.',
    proof: 'godotSmokeCiEvidenceReady',
    reason:
      'committed release/ci-runs.json evidence must verify a successful Godot Smoke workflow run',
  },
  {
    text: 'Android and iOS export smoke apps run on real, hosted, emulator, or simulator targets for the production profile.',
    proof: 'realDeviceEvidenceReady',
    reason: 'real-device evidence must validate for both Android and iOS',
  },
  {
    text: 'The wording "not production ready", "alpha", and "experimental" is removed only after all criteria above are satisfied.',
    proof: 'warningWordingReady',
    reason:
      'public warning wording must remain until every readiness blocker is resolved',
  },
  {
    text: 'Android export with selected device APIs has been tested.',
    proof: 'androidRealDeviceEvidenceReady',
    reason:
      'Android real-device evidence must validate the selected API export checks',
  },
  {
    text: 'iOS export with selected device APIs has been tested.',
    proof: 'iosRealDeviceEvidenceReady',
    reason:
      'iOS real-device evidence must validate the selected API export checks',
  },
  {
    text: 'CI passes on a clean commit.',
    proof: 'ciEvidenceReady',
    reason:
      'strict release-readiness must verify a clean worktree and successful Check, Godot Smoke, and Release Preflight evidence',
  },
  {
    text: 'Release preflight passes without warnings in the release environment.',
    proof: 'releaseReadinessEvidenceReady',
    reason:
      'release-readiness evidence and workflow wiring must validate a warning-free Release Preflight run',
  },
  {
    text: 'All public READMEs match the final support claims.',
    proof: 'publicReadmesReady',
    reason:
      'public-surface docs must pass and README warning markers must be removed',
  },
  {
    text: 'The root README warning is removed in the same commit that marks this checklist complete.',
    proof: 'rootReadmeWarningReady',
    reason: 'root README warning markers must be removed',
  },
]

function finalTodoProofsByName(proofs) {
  return {
    androidRealDeviceEvidenceReady: proofs.androidRealDeviceEvidenceReady,
    checkCiEvidenceReady: proofs.checkCiEvidenceReady,
    ciEvidenceReady: proofs.ciEvidenceReady,
    godotSmokeCiEvidenceReady: proofs.godotSmokeCiEvidenceReady,
    iosRealDeviceEvidenceReady: proofs.iosRealDeviceEvidenceReady,
    publicReadmesReady: proofs.publicReadmesReady,
    realDeviceEvidenceReady: proofs.realDeviceEvidenceReady,
    releaseReadinessEvidenceReady: proofs.releaseReadinessEvidenceReady,
    rootReadmeWarningReady: proofs.rootReadmeWarningReady,
    warningWordingReady: proofs.warningWordingReady,
  }
}

export function collectFinalTodoRequirementStatuses(todoItems, proofs) {
  const proofByName = finalTodoProofsByName(proofs)

  return finalTodoEvidenceRequirements.map((requirement) => {
    const matches = todoItems.filter((item) => item.text === requirement.text)
    const item = matches[0] ?? null

    return {
      text: requirement.text,
      proof: requirement.proof,
      ready: proofByName[requirement.proof] === true,
      checked: item?.checked === true,
      file: item?.file ?? null,
      line: item?.line ?? null,
      itemCount: matches.length,
      reason: requirement.reason,
    }
  })
}

export function formatFinalTodoRequirementStatus(status) {
  const location =
    status.file && status.line != null
      ? `${status.file}:${status.line}`
      : 'missing final TODO item'
  const proofState = status.ready ? 'ready' : 'waiting'

  if (status.itemCount === 0) {
    return `${location}; ${status.proof} ${proofState}: ${status.reason}`
  }

  const todoState =
    status.itemCount === 1
      ? status.checked
        ? 'checked'
        : 'unchecked'
      : `${status.itemCount} matching TODO items`

  return `${location} ${todoState}; ${status.proof} ${proofState}: ${status.reason}`
}

export function collectCheckedTodoEvidenceBlockers(todoItems, proofs) {
  const proofByName = finalTodoProofsByName(proofs)

  return finalTodoEvidenceRequirements.flatMap((requirement) => {
    const item = todoItems.find(
      (candidate) => candidate.text === requirement.text,
    )
    if (!item?.checked || proofByName[requirement.proof]) {
      return []
    }

    return [
      `${item.file}:${item.line} ${item.text} is checked, but ${requirement.reason}.`,
    ]
  })
}

export function collectFinalTodoStructureBlockers(
  todoItems,
  file = todoItems[0]?.file ?? 'TODO.md',
) {
  return finalTodoEvidenceRequirements.flatMap((requirement) => {
    const matches = todoItems.filter((item) => item.text === requirement.text)
    if (matches.length === 0) {
      return [
        `${file}: final release checklist must include "${requirement.text}"`,
      ]
    }

    if (matches.length > 1) {
      return [
        `${file}: final release checklist item appears ${matches.length} times: "${requirement.text}"`,
      ]
    }

    return []
  })
}

const releaseToolingScriptRequirements = [
  ['check:public-surface', 'node scripts/public-surface-audit.mjs'],
  ['check:device-prereqs', 'node scripts/check-device-test-prereqs.mjs'],
  ['check:platform-evidence', 'node scripts/check-platform-evidence.mjs'],
  ['check:real-device-evidence', 'node scripts/check-real-device-evidence.mjs'],
  ['check:serious-examples', 'node scripts/check-serious-example-apps.mjs'],
  ['release:ci', 'node scripts/check-release-ci-runs.mjs'],
  ['release:platform-evidence', 'node scripts/create-platform-evidence.mjs'],
  [
    'release:record-platform-evidence',
    'node scripts/record-platform-evidence.mjs',
  ],
  ['release:evidence', 'node scripts/create-release-evidence.mjs'],
  [
    'release:preflight-summary',
    'node scripts/download-release-preflight-summary.mjs',
  ],
  ['release:finalize-readiness', 'node scripts/finalize-release-readiness.mjs'],
  ['release:handoff', 'node scripts/release-handoff-report.mjs'],
  ['release:readiness', 'node scripts/release-readiness.mjs'],
  ['release:preflight', 'node scripts/release-preflight.mjs'],
]

export function collectReleaseToolingBlockers(packageJson) {
  const blockers = []
  const scripts = isRecord(packageJson?.scripts) ? packageJson.scripts : {}

  for (const [
    scriptName,
    expectedCommand,
  ] of releaseToolingScriptRequirements) {
    if (scripts[scriptName] !== expectedCommand) {
      blockers.push(
        `package.json must expose ${scriptName} as ${expectedCommand}`,
      )
    }
  }

  if (!String(scripts.check ?? '').includes('npm run check:serious-examples')) {
    blockers.push(
      'package.json check script must run npm run check:serious-examples',
    )
  }

  return blockers
}

const releaseWorkflowRequirements = [
  {
    file: '.github/workflows/check.yml',
    label: 'Check workflow',
    snippets: [
      'name: Check',
      'workflow_dispatch:',
      'actions/checkout@v6',
      'actions/setup-node@v6',
      'node-version: 24',
      'npm install -g npm@^11.15.0',
      'npm ci',
      'npm run check',
    ],
  },
  {
    file: '.github/workflows/godot-smoke.yml',
    label: 'Godot Smoke workflow',
    snippets: [
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
    ],
  },
  {
    file: '.github/workflows/release-preflight.yml',
    label: 'Release Preflight workflow',
    snippets: [
      'name: Release Preflight',
      'workflow_dispatch:',
      'real_device_evidence_path',
      'expected_commit',
      'actions/checkout@v6',
      'actions/setup-node@v6',
      'node-version: 24',
      'id-token: write',
      './.github/actions/setup-godotjs',
      'VUE_GODOT_REAL_DEVICE_EVIDENCE',
      'npm install -g npm@^11.15.0',
      'npm ci',
      'npm run release:preflight',
      '--expected-commit "${{ inputs.expected_commit }}"',
      '--summary-output release/release-preflight-summary.json',
      'actions/upload-artifact@v4',
      'release-preflight-summary',
      'xvfb-run',
    ],
  },
  {
    file: '.github/actions/setup-godotjs/action.yml',
    label: 'Setup GodotJS action',
    snippets: [
      'actions/cache@v5',
      'node scripts/setup-godotjs.mjs',
      '--github-env "$GITHUB_ENV"',
    ],
  },
]

export function collectReleaseWorkflowBlockers(readWorkflow = readText) {
  const blockers = []

  for (const requirement of releaseWorkflowRequirements) {
    let source
    try {
      source = readWorkflow(requirement.file)
    } catch (error) {
      blockers.push(
        `${requirement.file}: unable to read ${requirement.label}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      )
      continue
    }

    for (const snippet of requirement.snippets) {
      if (!source.includes(snippet)) {
        blockers.push(
          `${requirement.file}: ${requirement.label} must include ${snippet}`,
        )
      }
    }
  }

  return blockers
}

async function checkRealDeviceEvidence(blockers, options, expectedCommit) {
  const evidencePath =
    options.realDevicePath ?? resolveRealDeviceEvidencePath(process.env)
  const { evidence, errors: readErrors } = readRealDeviceEvidence(evidencePath)
  const status = {
    androidReady: false,
    androidErrors: [],
    errorCount: 0,
    evidencePresent: Boolean(evidence),
    iosReady: false,
    iosErrors: [],
    metadataErrors: [],
    metadataReady: false,
    path: describeRealDeviceEvidencePath(evidencePath),
    ready: false,
    readErrors: [...readErrors],
    runErrors: [],
  }

  if (!evidence) {
    status.errorCount = readErrors.length
    const checkCommand = checkRealDeviceEvidenceCommand(expectedCommit, {
      ...(options.realDevicePath
        ? { realDeviceEvidencePath: options.realDevicePath }
        : {}),
      checklistOutput: defaultRealDeviceEvidenceChecklistPath,
      summaryOutput: defaultRealDeviceEvidenceSummaryPath,
      verifyRuns: true,
    })
    blockers.push(
      [
        `real-device evidence missing at ${describeRealDeviceEvidencePath(
          evidencePath,
        )}`,
        `Create ${describeRealDeviceEvidencePath(
          evidencePath,
        )} after completing docs/real-device-release.md, then run ${checkCommand}.`,
        readErrors.join('\n'),
      ]
        .filter(Boolean)
        .join('\n'),
    )
    return status
  }

  const metadataErrors = validateRealDeviceEvidenceMetadata(evidence, {
    expectedCommit,
    expectedPackageVersions: currentReleasePackageVersions(),
  })
  const androidErrors = validateRealDevicePlatformEvidence(
    evidence,
    'android',
    {
      requireProductionProfile: true,
    },
  )
  const iosErrors = validateRealDevicePlatformEvidence(evidence, 'ios', {
    requireProductionProfile: true,
  })
  const errors = [...metadataErrors, ...androidErrors, ...iosErrors]
  status.metadataErrors = metadataErrors
  status.androidErrors = androidErrors
  status.iosErrors = iosErrors
  status.metadataReady = metadataErrors.length === 0
  status.androidReady = status.metadataReady && androidErrors.length === 0
  status.iosReady = status.metadataReady && iosErrors.length === 0

  if (errors.length > 0) {
    status.errorCount = errors.length
    blockers.push(
      [
        `real-device evidence is incomplete: ${relative(evidencePath)}`,
        ...errors,
      ]
        .filter(Boolean)
        .join('\n'),
    )
    return status
  }

  if (!options.allowOpen) {
    const runErrors = await verifyRealDeviceEvidenceRuns(evidence)
    if (runErrors.length > 0) {
      status.runErrors = runErrors
      status.errorCount = runErrors.length
      status.metadataReady = false
      status.androidReady = false
      status.iosReady = false
      blockers.push(
        [
          `real-device CI run evidence could not be verified: ${relative(
            evidencePath,
          )}`,
          ...runErrors,
        ].join('\n'),
      )
      return status
    }
  }

  status.ready = true
  return status
}

async function checkReleaseReadinessEvidence(
  blockers,
  options,
  expectedCommit,
) {
  const evidencePath = resolveReadinessEvidencePath(options)
  const { evidence, errors: readErrors } = readJsonEvidence(evidencePath)
  const status = {
    evidence: null,
    errorCount: 0,
    evidencePresent: Boolean(evidence),
    path: relative(evidencePath),
    ready: false,
    readErrors: [...readErrors],
    runErrors: [],
    validationErrors: [],
  }

  if (!evidence) {
    status.errorCount = readErrors.length
    blockers.push(
      [
        `release-readiness evidence missing at ${relative(evidencePath)}`,
        'Create it after the Release Preflight workflow passes without warnings.',
        readErrors.join('\n'),
      ]
        .filter(Boolean)
        .join('\n'),
    )
    return status
  }

  status.evidence = {
    commit: evidence.commit ?? null,
    releasePreflightRunUrl: evidence.releasePreflightRunUrl ?? null,
    releasePreflightRunWorkflowName:
      evidence.releasePreflightRunWorkflowName ?? null,
    releasePreflightRunCommit: evidence.releasePreflightRunCommit ?? null,
    releasePreflightRunConclusion:
      evidence.releasePreflightRunConclusion ?? null,
    releasePreflightLocalOnly: evidence.releasePreflightLocalOnly ?? null,
    releasePreflightSkipCheck: evidence.releasePreflightSkipCheck ?? null,
    releasePreflightSkipGodot: evidence.releasePreflightSkipGodot ?? null,
    releasePreflightSkipSeriousExamples:
      evidence.releasePreflightSkipSeriousExamples ?? null,
    releasePreflightFailureCount: evidence.releasePreflightFailureCount ?? null,
    releasePreflightWarningCount: evidence.releasePreflightWarningCount ?? null,
  }

  const errors = validateReleaseReadinessEvidence(evidence, expectedCommit)
  status.validationErrors = errors
  if (errors.length > 0) {
    status.errorCount = errors.length
    blockers.push(
      [
        `release-readiness evidence is incomplete: ${relative(evidencePath)}`,
        ...errors,
      ].join('\n'),
    )
    return status
  }

  if (!options.allowOpen) {
    const runErrors = await verifyGitHubActionsRunUrl(
      evidence.releasePreflightRunUrl,
      {
        label: 'releaseReadiness.releasePreflightRunUrl',
        workflowName: 'Release Preflight',
        commit: evidence.releasePreflightRunCommit,
        conclusion: 'success',
      },
    )
    if (runErrors.length > 0) {
      status.runErrors = runErrors
      status.errorCount = runErrors.length
      blockers.push(
        [
          `release-readiness CI run evidence could not be verified: ${relative(
            evidencePath,
          )}`,
          ...runErrors,
        ].join('\n'),
      )
      return status
    }
  }

  status.ready = true
  return status
}

export function collectWarningMarkerHits(readFile = readText) {
  return releaseWarningMarkers.flatMap((marker) => {
    const source = readFile(marker.file)
    if (!marker.pattern.test(source)) {
      return []
    }
    return [`${marker.file}: ${marker.label}`]
  })
}

function checkWarningMarkerState(blockers, markersStillPresent) {
  if (blockers.length > 0) {
    for (const marker of releaseWarningMarkers) {
      const source = readText(marker.file)
      if (!marker.pattern.test(source)) {
        blockers.push(
          `${marker.file}: keep ${marker.label} until release-readiness blockers are resolved`,
        )
      }
    }
    return markersStillPresent
  }

  for (const marker of markersStillPresent) {
    blockers.push(`${marker} must be removed in the final readiness commit`)
  }
  return markersStillPresent
}

function packageDescriptionEntries() {
  return [
    { file: 'package.json', description: readJson('package.json').description },
    ...releasePackageConfigs.map((config) => {
      const file = `${config.dir}/package.json`
      return {
        file,
        description: readJson(file).description,
      }
    }),
  ]
}

export function collectPackageDescriptionWarningHits(
  entries = packageDescriptionEntries(),
) {
  return entries.flatMap((entry) => {
    const description =
      typeof entry.description === 'string' ? entry.description : ''
    return packageDescriptionWarningMarkers.flatMap((marker) => {
      if (!marker.pattern.test(description)) {
        return []
      }
      return [`${entry.file}: ${marker.label}`]
    })
  })
}

function checkPublicSurface(blockers) {
  const errors = collectPublicSurfaceAuditErrors()
  if (errors.length === 0) {
    return true
  }

  blockers.push(['public surface audit failed', ...errors].join('\n'))
  return false
}

function releaseReadinessCommand(commit, pathOptions = {}, options = {}) {
  const args = ['npm', 'run', 'release:readiness', '--']

  if (options.allowOpen) {
    args.push('--allow-open')
  }
  if (options.summaryOutput && !options.allowOpen) {
    args.push('--summary-output', options.summaryOutput)
  }
  if (options.checklistOutput && !options.allowOpen) {
    args.push('--checklist-output', options.checklistOutput)
  }
  args.push('--expected-commit', releaseCommitLabel(commit))
  if (pathOptions.ciEvidencePath) {
    args.push('--ci-evidence', pathOptions.ciEvidencePath)
  }
  if (pathOptions.platformEvidencePath) {
    args.push('--platform-evidence', pathOptions.platformEvidencePath)
  }
  if (pathOptions.realDeviceEvidencePath) {
    args.push('--real-device-path', pathOptions.realDeviceEvidencePath)
  }
  if (pathOptions.readinessEvidencePath) {
    args.push('--readiness-path', pathOptions.readinessEvidencePath)
  }

  if (options.summaryOutput && options.allowOpen) {
    args.push('--summary-output', options.summaryOutput)
  }
  if (options.checklistOutput && options.allowOpen) {
    args.push('--checklist-output', options.checklistOutput)
  }

  return formatHandoffCommand(args)
}

function releaseHandoffCommand(commit, pathOptions = {}, options = {}) {
  const args = [
    'npm',
    'run',
    'release:handoff',
    '--',
    ...(options.check ? ['--check'] : []),
    '--expected-commit',
    releaseCommitLabel(commit),
    '--output',
    options.output ?? defaultReleaseHandoffReportPath,
  ]

  if (pathOptions.ciEvidencePath) {
    args.push('--ci-evidence', pathOptions.ciEvidencePath)
  }
  if (pathOptions.platformEvidencePath) {
    args.push('--platform-evidence', pathOptions.platformEvidencePath)
  }
  if (pathOptions.realDeviceEvidencePath) {
    args.push('--real-device-path', pathOptions.realDeviceEvidencePath)
  }
  if (pathOptions.readinessEvidencePath) {
    args.push('--readiness-path', pathOptions.readinessEvidencePath)
  }

  return formatHandoffCommand(args)
}

export function isReleaseHandoffReportCurrent(
  commit,
  pathOptions = {},
  options = {},
) {
  const reportPath = path.resolve(
    repoRoot,
    options.reportPath ?? defaultReleaseHandoffReportPath,
  )
  if (!fs.existsSync(reportPath)) {
    return false
  }

  const source = fs.readFileSync(reportPath, 'utf-8')
  const expectedCommitLine = `- Release candidate commit: \`${releaseCommitLabel(
    commit,
  )}\``
  const expectedFormatLine = `- Handoff format: ${releaseHandoffReportFormatVersion}`
  const expectedStateLine = options.stateHash
    ? `- Handoff state: ${options.stateHash}`
    : null
  const expectedHandoffCommand = releaseHandoffCommand(
    commit,
    pathOptions,
    options,
  )
  const handoffCommandPattern = 'npm run release:handoff --'
  const usesDefaultEvidencePaths = Object.keys(pathOptions).length === 0
  return (
    source.includes(expectedCommitLine) &&
    source.includes(expectedFormatLine) &&
    (!expectedStateLine || source.includes(expectedStateLine)) &&
    source.includes('## Next Actions') &&
    (source.includes(expectedHandoffCommand) ||
      (usesDefaultEvidencePaths && !source.includes(handoffCommandPattern)))
  )
}

function collectReleaseHandoffReportStatus(
  commit,
  pathOptions = {},
  options = {},
) {
  const stateHash = options.stateHash ?? null
  return {
    path: defaultReleaseHandoffReportPath,
    formatVersion: releaseHandoffReportFormatVersion,
    stateHash,
    current: isReleaseHandoffReportCurrent(commit, pathOptions, {
      stateHash,
    }),
    command: releaseHandoffCommand(commit, pathOptions),
  }
}

function collectPathOptions(
  initialCiEvidence,
  realDeviceEvidence,
  releaseReadinessEvidence,
  platformEvidence,
) {
  const options = {}
  if (
    initialCiEvidence?.path &&
    initialCiEvidence.path !== defaultReleaseCiEvidencePath
  ) {
    options.ciEvidencePath = initialCiEvidence.path
  }
  if (
    realDeviceEvidence?.path &&
    realDeviceEvidence.path !== defaultRealDeviceEvidencePath
  ) {
    options.realDeviceEvidencePath = realDeviceEvidence.path
  }
  if (
    releaseReadinessEvidence?.path &&
    releaseReadinessEvidence.path !== defaultReleaseReadinessEvidencePath
  ) {
    options.readinessEvidencePath = releaseReadinessEvidence.path
  }
  if (
    platformEvidence?.path &&
    platformEvidence.path !== defaultPlatformEvidencePath
  ) {
    options.platformEvidencePath = platformEvidence.path
  }
  return options
}

function initialCiCommandOptions(pathOptions) {
  return pathOptions.ciEvidencePath
    ? { output: pathOptions.ciEvidencePath }
    : {}
}

function realDeviceEvidenceCommandOptions(pathOptions) {
  return {
    ...(pathOptions.ciEvidencePath
      ? { ciEvidencePath: pathOptions.ciEvidencePath }
      : {}),
    ...(pathOptions.platformEvidencePath
      ? { platformEvidencePath: pathOptions.platformEvidencePath }
      : {}),
    ...(pathOptions.realDeviceEvidencePath
      ? { realDeviceEvidencePath: pathOptions.realDeviceEvidencePath }
      : {}),
  }
}

function releaseReadinessEvidenceCommandOptions(pathOptions) {
  return {
    ...realDeviceEvidenceCommandOptions(pathOptions),
    releasePreflightSummaryPath: defaultReleasePreflightSummaryPath,
    readinessEvidencePath:
      pathOptions.readinessEvidencePath ?? defaultReleaseReadinessEvidencePath,
  }
}

function repoLocalCommandPathOptions(pathOptions) {
  const options = {}
  const pathMappings = [
    ['ciEvidencePath', defaultReleaseCiEvidencePath],
    ['platformEvidencePath', defaultPlatformEvidencePath],
    ['realDeviceEvidencePath', defaultRealDeviceEvidencePath],
    ['readinessEvidencePath', defaultReleaseReadinessEvidencePath],
  ]

  for (const [key, defaultPath] of pathMappings) {
    const filePath = pathOptions[key]
    if (!filePath) continue

    const repoLocalPath = repoLocalEvidencePath(filePath, defaultPath)
    if (repoLocalPath !== defaultPath) {
      options[key] = repoLocalPath
    }
  }

  return options
}

export function ciEvidenceCommands(commit, localGit, options = {}) {
  const pushCommand =
    localGit?.currentBranch && !localGit.upstreamRef
      ? `git push --set-upstream origin ${shellQuote(localGit.currentBranch)}`
      : 'git push'

  return [
    'npm run check',
    pushCommand,
    ...initialReleaseCiCommands(commit, {
      output: options.ciEvidencePath ?? defaultReleaseCiEvidencePath,
    }),
  ]
}

function collectReadinessNextActions(
  checks,
  commit,
  localGit,
  initialCiEvidence,
  realDeviceEvidence,
  releaseReadinessEvidence,
  platformEvidence,
  options = {},
) {
  const actions = []
  const pathOptions = collectPathOptions(
    initialCiEvidence,
    realDeviceEvidence,
    releaseReadinessEvidence,
    platformEvidence,
  )
  const ciEvidencePath =
    pathOptions.ciEvidencePath ?? defaultReleaseCiEvidencePath
  const platformEvidencePath =
    pathOptions.platformEvidencePath ?? defaultPlatformEvidencePath
  const realDeviceEvidencePath =
    pathOptions.realDeviceEvidencePath ?? defaultRealDeviceEvidencePath
  const readinessEvidencePath =
    pathOptions.readinessEvidencePath ?? defaultReleaseReadinessEvidencePath
  const initialCiOptions = initialCiCommandOptions(pathOptions)
  const realDeviceCommandOptions = realDeviceEvidenceCommandOptions(pathOptions)
  const repoLocalPathOptions = repoLocalCommandPathOptions(pathOptions)
  const repoLocalRealDeviceEvidencePath = repoLocalEvidencePath(
    realDeviceEvidencePath,
    defaultRealDeviceEvidencePath,
  )
  const realDeviceEvidenceBlocked =
    !checks.realDeviceEvidence ||
    !checks.androidRealDeviceEvidence ||
    !checks.iosRealDeviceEvidence

  function withBlockedBy(action, dependencies) {
    return dependencies.length > 0
      ? {
          ...action,
          blockedBy: dependencies,
        }
      : action
  }

  if (!checks.cleanWorktree) {
    actions.push({
      id: 'clean-worktree',
      title: 'Commit or remove local changes before strict readiness',
      detail:
        'Strict release readiness requires the release evidence and final wording changes to be checked from a clean worktree.',
      commands: ['git status --short'],
    })
  }

  if (
    !checks.initialCiEvidence &&
    initialCiEvidence?.validForCommit &&
    initialCiEvidence.validForCommit !== commit
  ) {
    actions.push({
      id: 'expected-commit',
      title: 'Run readiness against the tested release commit',
      detail:
        'The checked-in or supplied CI evidence is valid for an earlier release-candidate commit; pass --expected-commit when release evidence is committed after that candidate.',
      commands: [
        releaseReadinessCommand(initialCiEvidence.validForCommit, pathOptions, {
          allowOpen: true,
          checklistOutput: defaultReleaseReadinessChecklistPath,
          summaryOutput: defaultReleaseReadinessSummaryPath,
        }),
      ],
    })
  }

  if (!checks.initialCiEvidence) {
    actions.push({
      id: 'ci-evidence',
      title: 'Collect initial CI evidence for the tested release commit',
      detail:
        'Run the local check, push the release-candidate commit, wait for Check and Godot Smoke, then write release/ci-runs.json for real-device evidence assembly. Release Preflight is collected later after real-device evidence is committed.',
      commands: ciEvidenceCommands(commit, localGit, {
        ciEvidencePath,
      }),
    })
  }

  if (
    !checks.realDeviceEvidence ||
    !checks.androidRealDeviceEvidence ||
    !checks.iosRealDeviceEvidence
  ) {
    const platformEvidenceCommands = []
    const platformEvidenceRemaining = platformEvidence?.ready
      ? ''
      : formatPlatformEvidenceRemainingBlock(platformEvidence)
    const platformCheckDetails =
      platformEvidence?.ready || !platformEvidence
        ? []
        : collectPlatformEvidenceRemainingCheckDetails(platformEvidence)
    if (!platformEvidence?.evidencePresent) {
      platformEvidenceCommands.push(
        productionProfilePlatformEvidenceCommand(
          commit,
          pathOptions.platformEvidencePath
            ? { output: pathOptions.platformEvidencePath }
            : {},
        ),
      )
    } else if (!platformEvidence.ready) {
      const recordCommandsForPlatform = (platform) => {
        const status = platformEvidence.platforms?.[platform]
        if (isRecord(status) && status.ready) {
          return [
            recordPlatformEvidenceListChecksCommand(platform, commit, {
              platformEvidencePath,
              summaryOutput: 'release/platform-evidence-summary.json',
            }),
          ]
        }

        return recordPlatformEvidenceCommands(platform, commit, {
          ...collectPlatformEvidenceCommandMetadata(platformEvidence, platform),
          checks: collectPlatformEvidencePassChecks(platformEvidence, platform),
          platformEvidencePath,
          skipChecks: collectPlatformEvidenceSkippableMissingChecks(
            platformEvidence,
            platform,
          ),
          summaryOutput: 'release/platform-evidence-summary.json',
        })
      }
      platformEvidenceCommands.push(
        ...recordCommandsForPlatform('android'),
        ...recordCommandsForPlatform('ios'),
      )
      platformEvidenceCommands.push(
        checkPlatformEvidenceCommand(commit, {
          allowOpen: true,
          checklistOutput: defaultPlatformEvidenceChecklistPath,
          platformEvidencePath,
          summaryOutput: 'release/platform-evidence-summary.json',
        }),
      )
    } else {
      platformEvidenceCommands.push(
        checkPlatformEvidenceCommand(commit, {
          platformEvidencePath,
        }),
      )
    }

    if (
      !isReleaseHandoffReportCurrent(commit, pathOptions, {
        stateHash: options.handoffStateHash,
      })
    ) {
      actions.push({
        id: 'release-handoff-report',
        title: 'Write Android/iOS tester handoff',
        detail:
          'Render the current allow-open readiness audit as Markdown so device testers can see the exact platform gaps, dependencies, and commands for this release candidate.',
        commands: [
          releaseHandoffCommand(commit, pathOptions),
          releaseHandoffCommand(commit, pathOptions, { check: true }),
        ],
      })
    }

    actions.push({
      id: 'real-device-evidence',
      title: 'Complete Android and iOS real-device export evidence',
      detail: [
        'Run the local check and selected API export checks on real, hosted, emulator, or simulator targets, record the evidence URL in the platform worksheet, then assemble and validate release/real-device-evidence.json for the tested release commit.',
        'The device prereq summary records local tooling availability and configured or partially configured hosted-provider environment variable names for handoff diagnostics only; final evidence still needs non-local device run URLs, artifact IDs, and device metadata.',
        platformEvidenceRemaining,
      ]
        .filter(Boolean)
        .join('\n'),
      ...(platformCheckDetails.length > 0 ? { platformCheckDetails } : {}),
      commands: [
        'npm run check',
        checkDevicePrereqsCommand({
          allowMissing: true,
          summaryOutput: defaultDeviceTestPrereqsSummaryPath,
        }),
        localReleasePreflightCommand(commit, {
          skipCheck: true,
          skipGodot: true,
          summaryOutput: '/tmp/vue-godot-local-preflight-summary.json',
        }),
        ...platformEvidenceCommands,
        ...(checks.initialCiEvidence
          ? []
          : initialReleaseCiCommands(commit, initialCiOptions)),
        ...(platformEvidence?.ready
          ? []
          : [checkPlatformEvidenceCommand(commit, { platformEvidencePath })]),
        releaseEvidenceCommand(commit, realDeviceCommandOptions),
        checkRealDeviceEvidenceCommand(commit, {
          checklistOutput: defaultRealDeviceEvidenceChecklistPath,
          ...realDeviceCommandOptions,
          summaryOutput: defaultRealDeviceEvidenceSummaryPath,
          verifyRuns: true,
        }),
        ...commitEvidenceFileCommands(
          [
            [platformEvidencePath, defaultPlatformEvidencePath],
            [ciEvidencePath, defaultReleaseCiEvidencePath],
            [realDeviceEvidencePath, defaultRealDeviceEvidencePath],
          ],
          'Add real-device release evidence',
          { push: true },
        ),
      ],
    })
  }

  if (!checks.strictCiEvidence || !checks.releaseReadinessEvidence) {
    actions.push(
      withBlockedBy(
        {
          id: 'release-preflight-evidence',
          title: 'Collect CI and warning-free Release Preflight evidence',
          detail:
            'Run the local check after the tested release candidate and real-device evidence are pushed, refresh Check and Godot Smoke from the release-candidate ref when CI evidence is still missing, then dispatch Release Preflight from the current evidence commit ref and write release-readiness evidence.',
          commands: [
            'npm run check',
            checkRealDeviceEvidenceCommand(commit, {
              checklistOutput: defaultRealDeviceEvidenceChecklistPath,
              ...realDeviceCommandOptions,
              summaryOutput: defaultRealDeviceEvidenceSummaryPath,
              verifyRuns: true,
            }),
            ...(checks.initialCiEvidence
              ? []
              : initialReleaseCiCommands(commit, initialCiOptions)),
            ...releasePreflightCiCommands(commit, {
              output: ciEvidencePath,
              realDeviceEvidencePath: repoLocalRealDeviceEvidencePath,
              releasePreflightRunCommit: currentHeadCommitCommand,
            }),
            releasePreflightSummaryCommand(commit, {
              ...pathOptions,
              checklistOutput: defaultReleasePreflightChecklistPath,
              output: defaultReleasePreflightSummaryPath,
              withGitHubToken: true,
            }),
            releaseEvidenceCommand(
              commit,
              releaseReadinessEvidenceCommandOptions(pathOptions),
            ),
            ...commitEvidenceFileCommands(
              [
                [ciEvidencePath, defaultReleaseCiEvidencePath],
                [
                  defaultReleasePreflightSummaryPath,
                  defaultReleasePreflightSummaryPath,
                ],
                [
                  defaultReleasePreflightChecklistPath,
                  defaultReleasePreflightChecklistPath,
                ],
                [realDeviceEvidencePath, defaultRealDeviceEvidencePath],
                [readinessEvidencePath, defaultReleaseReadinessEvidencePath],
              ],
              'Add release readiness evidence',
              { push: true },
            ),
            releaseReadinessCommand(commit, repoLocalPathOptions, {
              checklistOutput: defaultReleaseReadinessChecklistPath,
              summaryOutput: defaultReleaseReadinessSummaryPath,
            }),
          ],
        },
        realDeviceEvidenceBlocked ? ['real-device-evidence'] : [],
      ),
    )
  }

  if (!checks.publicSurface) {
    actions.push({
      id: 'public-surface',
      title: 'Fix public README, compatibility, template, or demo drift',
      detail:
        'Public surface documentation must match the final support claims before warning wording is removed.',
      commands: ['npm run check:public-surface'],
    })
  }

  if (
    !checks.publicWarningMarkersRemoved ||
    !checks.packageDescriptionWarningsRemoved ||
    !checks.rootReadmeWarningsRemoved
  ) {
    const dependencies = []
    if (realDeviceEvidenceBlocked) {
      dependencies.push('real-device-evidence')
    }
    if (!checks.releaseReadinessEvidence) {
      dependencies.push('release-preflight-evidence')
    }
    if (!checks.publicSurface) {
      dependencies.push('public-surface')
    }

    actions.push(
      withBlockedBy(
        {
          id: 'final-warning-removal',
          title: 'Remove public warning wording through the guarded finalizer',
          detail:
            'Only run the finalizer after strict release readiness evidence is complete; it applies the final TODO checks and removes public warning wording. The generated commands then run npm run check, stage those edits, commit them, push, and run the final strict readiness check.',
          commands: [
            releaseReadinessCommand(commit, pathOptions, {
              checklistOutput: '/tmp/vue-godot-readiness.md',
              summaryOutput: '/tmp/vue-godot-readiness.json',
            }),
            'npm run release:finalize-readiness -- --summary /tmp/vue-godot-readiness.json',
            'npm run check',
            `git add ${finalizationFiles.join(' ')}`,
            'git commit -m "Finalize production readiness"',
            'git push',
            releaseReadinessCommand(commit, pathOptions, {
              checklistOutput: defaultReleaseReadinessChecklistPath,
              summaryOutput: defaultReleaseReadinessSummaryPath,
            }),
          ],
        },
        dependencies,
      ),
    )
  }

  return actions
}

function printExpectedCommitHint(
  options,
  expectedCommit,
  checks,
  initialCiEvidence,
  realDeviceEvidence,
  releaseReadinessEvidence,
  platformEvidence,
) {
  if (
    options.expectedCommit ||
    checks.initialCiEvidence ||
    !initialCiEvidence?.validForCommit ||
    initialCiEvidence.validForCommit === expectedCommit
  ) {
    return
  }

  const pathOptions = collectPathOptions(
    initialCiEvidence,
    realDeviceEvidence,
    releaseReadinessEvidence,
    platformEvidence,
  )
  console.log('\n[release-readiness] tested release commit evidence found')
  console.log(
    `- ${initialCiEvidence.path} validates ${initialCiEvidence.validForCommit}, not ${expectedCommit}.`,
  )
  console.log(
    `- ${releaseReadinessCommand(
      initialCiEvidence.validForCommit,
      pathOptions,
      {
        allowOpen: true,
        checklistOutput: defaultReleaseReadinessChecklistPath,
        summaryOutput: defaultReleaseReadinessSummaryPath,
      },
    )}`,
  )
}

function formatFinalTodoChecklistLine(status) {
  const location =
    status.file && status.line != null
      ? `${status.file}:${status.line}`
      : 'missing final TODO item'
  const todoState =
    status.itemCount === 1
      ? status.checked
        ? 'checked'
        : 'unchecked'
      : `${displayValue(status.itemCount)} matching TODO items`
  const proofState = status.ready ? 'ready' : 'waiting'

  return checklistLine(
    status.ready === true && status.checked === true,
    `${location} ${todoState}`,
    `${status.proof} ${proofState}; ${status.reason}`,
  )
}

function formatActionLines(action) {
  const lines = [`### ${action.title ?? action.id ?? 'Action'}`, '']
  if (typeof action.detail === 'string' && action.detail.trim()) {
    lines.push(action.detail.trim(), '')
  }
  if (Array.isArray(action.blockedBy) && action.blockedBy.length > 0) {
    lines.push(`Blocked by: ${action.blockedBy.join(', ')}`, '')
  }
  const commands = Array.isArray(action.commands) ? action.commands : []
  if (hasCommandPlaceholders(commands)) {
    lines.push(
      'Commands with `<...>` placeholders must be edited before running; unresolved placeholders are not valid release evidence or dispatch inputs.',
      '',
    )
  }
  lines.push(
    ...formatReleaseCommandBlock(commands, {
      emptyText: '- no commands',
      headingLevel: 4,
    }),
    '',
  )
  return lines
}

export function formatReleaseReadinessChecklist(summary) {
  const checks = isRecord(summary.checks) ? summary.checks : {}
  const devicePrereqs = isRecord(summary.devicePrereqs)
    ? summary.devicePrereqs
    : {}
  const finalTodoRequirements = Array.isArray(summary.finalTodoRequirements)
    ? summary.finalTodoRequirements
    : []
  const nextActions = Array.isArray(summary.nextActions)
    ? summary.nextActions
    : []
  const releaseHandoffReport = isRecord(summary.releaseHandoffReport)
    ? summary.releaseHandoffReport
    : {}
  const realDeviceEvidence = isRecord(summary.realDeviceEvidence)
    ? summary.realDeviceEvidence
    : {}
  const releaseReadinessEvidence = isRecord(summary.releaseReadinessEvidence)
    ? summary.releaseReadinessEvidence
    : {}
  const platformEvidence = isRecord(summary.platformEvidence)
    ? summary.platformEvidence
    : {}
  const initialCiEvidence = isRecord(summary.initialCiEvidence)
    ? summary.initialCiEvidence
    : {}

  const lines = [
    '# Release Readiness Checklist',
    '',
    `- Status: ${summary.ready ? 'ready' : 'waiting'}`,
    `- Expected commit: ${displayValue(summary.commit)}`,
    `- Allow open: ${displayValue(summary.allowOpen)}`,
    `- Blockers: ${displayValue(summary.blockerCount)}`,
    `- Release handoff: ${
      releaseHandoffReport.current === true ? 'current' : 'needs update'
    }`,
    '',
    '## Final TODO Proof',
    '',
  ]

  if (finalTodoRequirements.length === 0) {
    lines.push('- [ ] Final TODO proof status: missing')
  } else {
    lines.push(
      ...finalTodoRequirements.map((status) =>
        formatFinalTodoChecklistLine(status),
      ),
    )
  }

  lines.push(
    '',
    '## Release Gates',
    '',
    checklistLine(
      checks.cleanWorktree === true,
      'Clean worktree',
      displayValue(checks.cleanWorktree),
    ),
    checklistLine(
      checks.initialCiEvidence === true,
      'Check/Godot Smoke CI evidence',
      `${displayValue(initialCiEvidence.path)} for ${displayValue(
        initialCiEvidence.expectedCommit ?? summary.commit,
      )}`,
    ),
    checklistLine(
      checks.platformEvidence === true,
      'Platform worksheet',
      `${displayValue(platformEvidence.path)} with ${displayValue(
        platformEvidence.errorCount,
      )} blocker(s)`,
    ),
    checklistLine(
      checks.realDeviceEvidence === true,
      'Real-device evidence',
      `${displayValue(realDeviceEvidence.path)} with ${displayValue(
        realDeviceEvidence.errorCount,
      )} blocker(s)`,
    ),
    checklistLine(
      checks.androidRealDeviceEvidence === true,
      'Android selected APIs',
      displayValue(realDeviceEvidence.androidReady),
    ),
    checklistLine(
      checks.iosRealDeviceEvidence === true,
      'iOS selected APIs',
      displayValue(realDeviceEvidence.iosReady),
    ),
    checklistLine(
      checks.releaseReadinessEvidence === true,
      'Release Preflight evidence',
      `${displayValue(releaseReadinessEvidence.path)} with ${displayValue(
        releaseReadinessEvidence.errorCount,
      )} blocker(s)`,
    ),
    checklistLine(
      checks.publicSurface === true,
      'Public surface docs',
      displayValue(checks.publicSurface),
    ),
    checklistLine(
      checks.publicWarningMarkersRemoved === true,
      'Public warning wording removed',
      displayValue(checks.publicWarningMarkersRemoved),
    ),
    checklistLine(
      checks.packageDescriptionWarningsRemoved === true,
      'Package warning wording removed',
      displayValue(checks.packageDescriptionWarningsRemoved),
    ),
    checklistLine(
      checks.strictCiEvidence === true,
      'Strict CI evidence',
      displayValue(checks.strictCiEvidence),
    ),
    '',
    ...formatDevicePrereqDiagnosticLines(devicePrereqs),
    '',
    '## Blocking Issues',
    '',
    ...formatIssueLines('Blockers', summary.blockers),
    ...formatIssueLines('Warning markers', summary.warningMarkers),
    ...formatIssueLines(
      'Package description warnings',
      summary.packageDescriptionWarnings,
    ),
    ...formatIssueLines(
      'Release tooling blockers',
      summary.releaseToolingBlockers,
    ),
    ...formatIssueLines(
      'Release workflow blockers',
      summary.releaseWorkflowBlockers,
    ),
    '',
    '## Next Actions',
    '',
  )

  if (nextActions.length === 0) {
    lines.push('- none')
  } else {
    for (const action of nextActions) {
      lines.push(...formatActionLines(action))
    }
  }

  return `${lines.join('\n')}\n`
}

function writeReadinessSummary(
  options,
  expectedCommit,
  blockers,
  warningMarkers,
  packageDescriptionWarnings,
  releaseToolingBlockers,
  releaseWorkflowBlockers,
  finalTodoRequirementStatuses,
  checks,
  todoItems,
  realDeviceEvidence,
  releaseReadinessEvidence,
  initialCiEvidence,
  platformEvidence,
  devicePrereqs,
) {
  if (!options.summaryOutput && !options.checklistOutput) {
    return
  }

  const localGit = expectedCommit
    ? collectLocalGitReleaseState(expectedCommit)
    : null
  const pathOptions = collectPathOptions(
    initialCiEvidence,
    realDeviceEvidence,
    releaseReadinessEvidence,
    platformEvidence,
  )
  const releaseHandoffReport = collectReleaseHandoffReportStatus(
    expectedCommit,
    pathOptions,
    {
      stateHash: releaseHandoffReportStateHash({
        blockers,
        checks,
        commit: expectedCommit,
        finalTodoRequirements: finalTodoRequirementStatuses,
        devicePrereqs,
        initialCiEvidence,
        platformEvidence,
        realDeviceEvidence,
        releaseReadinessEvidence,
      }),
    },
  )
  const checkedTodoItems = todoItems.filter((item) => item.checked)
  const uncheckedTodoItems = todoItems.filter((item) => !item.checked)
  const summary = {
    commit: expectedCommit,
    allowOpen: options.allowOpen,
    localGit,
    ready: blockers.length === 0,
    blockerCount: blockers.length,
    warningMarkerCount: warningMarkers.length,
    packageDescriptionWarningCount: packageDescriptionWarnings.length,
    releaseToolingBlockerCount: releaseToolingBlockers.length,
    releaseWorkflowBlockerCount: releaseWorkflowBlockers.length,
    todo: {
      total: todoItems.length,
      checked: checkedTodoItems.length,
      unchecked: uncheckedTodoItems.length,
      uncheckedItems: uncheckedTodoItems.map((item) => ({
        file: item.file,
        line: item.line,
        text: item.text,
      })),
    },
    checks: { ...checks },
    devicePrereqs: { ...devicePrereqs },
    realDeviceEvidence: { ...realDeviceEvidence },
    releaseReadinessEvidence: { ...releaseReadinessEvidence },
    initialCiEvidence: { ...initialCiEvidence },
    platformEvidence: { ...platformEvidence },
    releaseHandoffReport,
    nextActions: collectReadinessNextActions(
      checks,
      expectedCommit,
      localGit,
      initialCiEvidence,
      realDeviceEvidence,
      releaseReadinessEvidence,
      platformEvidence,
      { handoffStateHash: releaseHandoffReport.stateHash },
    ),
    finalTodoRequirements: finalTodoRequirementStatuses.map((status) => ({
      ...status,
    })),
    blockers: [...blockers],
    warningMarkers: [...warningMarkers],
    packageDescriptionWarnings: [...packageDescriptionWarnings],
    releaseToolingBlockers: [...releaseToolingBlockers],
    releaseWorkflowBlockers: [...releaseWorkflowBlockers],
  }

  if (options.summaryOutput) {
    const resolved = path.resolve(repoRoot, options.summaryOutput)
    fs.mkdirSync(path.dirname(resolved), { recursive: true })
    fs.writeFileSync(resolved, `${JSON.stringify(summary, null, 2)}\n`)
    console.log(`[release-readiness] wrote ${relative(resolved)}`)
  }

  if (options.checklistOutput) {
    const resolved = path.resolve(repoRoot, options.checklistOutput)
    fs.mkdirSync(path.dirname(resolved), { recursive: true })
    fs.writeFileSync(resolved, formatReleaseReadinessChecklist(summary))
    console.log(`[release-readiness] wrote ${relative(resolved)}`)
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const todoItems = readTodoItems()
  const blockers = collectUncheckedTodoItems(todoItems)
  const expectedCommit = options.expectedCommit ?? currentCommit(blockers)

  const cleanWorktreeReady = checkCleanWorktree(blockers)
  const realDeviceEvidenceStatus = await checkRealDeviceEvidence(
    blockers,
    options,
    expectedCommit ?? undefined,
  )
  const devicePrereqDiagnostics = collectDevicePrereqDiagnostics(options)
  const platformEvidenceStatus = readPlatformEvidenceAudit(
    options.platformEvidencePath ?? defaultPlatformEvidencePath,
  )
  const realDeviceEvidenceReady = realDeviceEvidenceStatus.ready
  const realDeviceEvidenceMetadataReady = realDeviceEvidenceStatus.metadataReady
  const androidRealDeviceEvidenceReady = realDeviceEvidenceStatus.androidReady
  const iosRealDeviceEvidenceReady = realDeviceEvidenceStatus.iosReady
  const releaseReadinessEvidenceStatus = await checkReleaseReadinessEvidence(
    blockers,
    options,
    expectedCommit ?? undefined,
  )
  const releaseReadinessEvidenceReady = releaseReadinessEvidenceStatus.ready

  const packageJson = readJson('package.json')
  const releaseToolingBlockers = collectReleaseToolingBlockers(packageJson)
  blockers.push(...releaseToolingBlockers)
  const releaseWorkflowBlockers = collectReleaseWorkflowBlockers()
  blockers.push(...releaseWorkflowBlockers)
  const releaseWorkflowsReady = releaseWorkflowBlockers.length === 0
  const initialCiEvidenceStatus = readInitialCiEvidenceStatus(
    options.ciEvidencePath ?? defaultReleaseCiEvidencePath,
    expectedCommit,
  )
  const initialCiEvidenceReady =
    releaseWorkflowsReady && initialCiEvidenceStatus.ready

  const publicSurfaceReady = checkPublicSurface(blockers)

  const warningMarkers = collectWarningMarkerHits()
  const packageDescriptionWarnings = collectPackageDescriptionWarningHits()
  for (const marker of packageDescriptionWarnings) {
    blockers.push(`${marker} must be removed before final release readiness`)
  }
  const rootReadmeWarningReady = !warningMarkers.some((marker) =>
    marker.startsWith('README.md:'),
  )
  const strictCiEvidenceReady =
    !options.allowOpen &&
    realDeviceEvidenceReady &&
    releaseReadinessEvidenceReady &&
    releaseWorkflowsReady
  const finalTodoStructureBlockers =
    collectFinalTodoStructureBlockers(todoItems)
  blockers.push(...finalTodoStructureBlockers)

  const checkedFinalTodoProofs = {
    androidRealDeviceEvidenceReady,
    checkCiEvidenceReady: initialCiEvidenceReady,
    ciEvidenceReady:
      cleanWorktreeReady &&
      realDeviceEvidenceReady &&
      releaseReadinessEvidenceReady &&
      releaseWorkflowsReady &&
      !options.allowOpen,
    godotSmokeCiEvidenceReady: initialCiEvidenceReady,
    iosRealDeviceEvidenceReady,
    publicReadmesReady: publicSurfaceReady && rootReadmeWarningReady,
    realDeviceEvidenceReady,
    releaseReadinessEvidenceReady:
      releaseReadinessEvidenceReady && releaseWorkflowsReady,
    rootReadmeWarningReady,
    warningWordingReady:
      blockers.length === 0 &&
      warningMarkers.length === 0 &&
      packageDescriptionWarnings.length === 0,
  }
  const checkedFinalTodoEvidenceBlockers = collectCheckedTodoEvidenceBlockers(
    todoItems,
    checkedFinalTodoProofs,
  )
  const finalTodoRequirementStatuses = collectFinalTodoRequirementStatuses(
    todoItems,
    checkedFinalTodoProofs,
  )
  blockers.push(...checkedFinalTodoEvidenceBlockers)

  checkWarningMarkerState(blockers, warningMarkers)
  const checks = {
    androidRealDeviceEvidence: androidRealDeviceEvidenceReady,
    checkedFinalTodosBackedByEvidence:
      checkedFinalTodoEvidenceBlockers.length === 0,
    cleanWorktree: cleanWorktreeReady,
    finalTodoStructure: finalTodoStructureBlockers.length === 0,
    iosRealDeviceEvidence: iosRealDeviceEvidenceReady,
    initialCiEvidence: initialCiEvidenceReady,
    publicSurface: publicSurfaceReady,
    publicWarningMarkersRemoved: warningMarkers.length === 0,
    packageDescriptionWarningsRemoved: packageDescriptionWarnings.length === 0,
    realDeviceEvidence: realDeviceEvidenceReady,
    realDeviceEvidenceMetadata: realDeviceEvidenceMetadataReady,
    releaseTooling: releaseToolingBlockers.length === 0,
    releaseWorkflows: releaseWorkflowsReady,
    releaseReadinessEvidence: releaseReadinessEvidenceReady,
    platformEvidence: platformEvidenceStatus.ready,
    rootReadmeWarningsRemoved: rootReadmeWarningReady,
    strictCiEvidence: strictCiEvidenceReady,
  }
  try {
    writeReadinessSummary(
      options,
      expectedCommit,
      blockers,
      warningMarkers,
      packageDescriptionWarnings,
      releaseToolingBlockers,
      releaseWorkflowBlockers,
      finalTodoRequirementStatuses,
      checks,
      todoItems,
      realDeviceEvidenceStatus,
      releaseReadinessEvidenceStatus,
      initialCiEvidenceStatus,
      platformEvidenceStatus,
      devicePrereqDiagnostics,
    )
  } catch (error) {
    blockers.push(
      `Unable to write release readiness output: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }

  if (blockers.length === 0) {
    console.log('[release-readiness] ready')
    return
  }

  console.log('[release-readiness] blockers')
  for (const blocker of blockers) {
    console.log(`- ${blocker}`)
  }

  console.log('\n[release-readiness] final TODO proof status')
  for (const status of finalTodoRequirementStatuses) {
    console.log(`- ${formatFinalTodoRequirementStatus(status)}`)
  }

  printExpectedCommitHint(
    options,
    expectedCommit,
    checks,
    initialCiEvidenceStatus,
    realDeviceEvidenceStatus,
    releaseReadinessEvidenceStatus,
    platformEvidenceStatus,
  )

  if (warningMarkers.length > 0) {
    console.log('\n[release-readiness] public warning markers still present')
    for (const marker of warningMarkers) {
      console.log(`- ${marker}`)
    }
  }

  if (packageDescriptionWarnings.length > 0) {
    console.log('\n[release-readiness] package description warning markers')
    for (const marker of packageDescriptionWarnings) {
      console.log(`- ${marker}`)
    }
  }

  if (!platformEvidenceStatus.ready) {
    console.log('\n[release-readiness] platform evidence worksheet open')
    console.log(
      `- ${platformEvidenceStatus.path}: ${platformEvidenceStatus.errorCount} blocker(s)`,
    )
    console.log(
      `- ${checkPlatformEvidenceCommand(expectedCommit, {
        allowOpen: true,
        checklistOutput: defaultPlatformEvidenceChecklistPath,
        summaryOutput: 'release/platform-evidence-summary.json',
      })}`,
    )
  }

  if (options.allowOpen) {
    console.log('\n[release-readiness] open gates remain (--allow-open)')
    return
  }

  console.log('\n[release-readiness] not ready')
  process.exit(1)
}

const entryPoint = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (import.meta.url === entryPoint) {
  try {
    await main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}
