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
import { collectPublicSurfaceAuditErrors } from './public-surface-audit.mjs'
import { collectLocalGitReleaseState } from './check-release-ci-runs.mjs'
import { finalizationFiles } from './release-finalization-files.mjs'
import {
  checkRealDeviceEvidenceCommand,
  defaultReleasePreflightSummaryPath,
  defaultReleaseReadinessEvidencePath,
  initialReleaseCiCommands,
  productionProfilePlatformEvidenceCommand,
  releaseEvidenceCommand,
  releaseCommitLabel,
  releasePreflightRunCommitPlaceholder,
  releasePreflightCiCommands,
} from './release-handoff-commands.mjs'
import {
  currentReleasePackageVersions,
  readJson,
  releasePackageConfigs,
  repoRoot,
  run,
} from './release-utils.mjs'

const releaseReadinessEvidenceEnvVar =
  'VUE_GODOT_RELEASE_READINESS_EVIDENCE'

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
  --real-device-path <file>     Read Android/iOS evidence from a specific file.
                                Defaults to ${realDeviceEvidenceEnvVar} or ${defaultRealDeviceEvidencePath}.
  --readiness-path <file>       Read release-readiness evidence from a specific file.
                                Defaults to ${releaseReadinessEvidenceEnvVar} or ${defaultReleaseReadinessEvidencePath}.
  --expected-commit <sha>       Require evidence files to match this release
                                commit. Defaults to the current git commit.
                                Use this when evidence files are committed
                                after testing a release-candidate commit.
  --summary-output <file>       Write machine-readable readiness blockers JSON.
  --help                        Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    allowOpen: false,
    expectedCommit: null,
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

    if (arg === '--expected-commit') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--expected-commit requires a value')
      }
      options.expectedCommit = value
      continue
    }

    if (arg.startsWith('--expected-commit=')) {
      options.expectedCommit = arg.slice('--expected-commit='.length)
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
      [
        'working tree must be clean for final release readiness',
        status,
      ].join('\n'),
    )
    return false
  }

  return true
}

export function collectTodoItems(source, file = 'TODO.md') {
  return source
    .split(/\r?\n/)
    .flatMap((line, index) => {
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

export function validateReleaseReadinessEvidence(evidence, expectedCommit) {
  const errors = []

  if (!isRecord(evidence)) {
    return ['Release-readiness evidence must be a JSON object']
  }

  for (const key of [
    'commit',
    'releasePreflightRunCommit',
    'releasePreflightRunConclusion',
  ]) {
    if (!hasNonEmptyString(evidence, key)) {
      errors.push(`releaseReadiness.${key} must be a non-empty string`)
    }
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
      'Check workflow evidence and workflow wiring must be verified in a strict release-readiness run',
  },
  {
    text: 'Godot smoke, generated Godot smoke, and editor reload smoke pass in CI for every release candidate.',
    proof: 'godotSmokeCiEvidenceReady',
    reason:
      'Godot Smoke workflow evidence and workflow wiring must be verified in a strict release-readiness run',
  },
  {
    text: 'Android and iOS export smoke apps run on real or hosted devices for the production profile.',
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
    const item = todoItems.find((candidate) => candidate.text === requirement.text)
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
  ['check:real-device-evidence', 'node scripts/check-real-device-evidence.mjs'],
  ['check:serious-examples', 'node scripts/check-serious-example-apps.mjs'],
  ['release:ci', 'node scripts/check-release-ci-runs.mjs'],
  ['release:platform-evidence', 'node scripts/create-platform-evidence.mjs'],
  ['release:evidence', 'node scripts/create-release-evidence.mjs'],
  [
    'release:preflight-summary',
    'node scripts/download-release-preflight-summary.mjs',
  ],
  [
    'release:finalize-readiness',
    'node scripts/finalize-release-readiness.mjs',
  ],
  ['release:readiness', 'node scripts/release-readiness.mjs'],
  ['release:preflight', 'node scripts/release-preflight.mjs'],
]

export function collectReleaseToolingBlockers(packageJson) {
  const blockers = []
  const scripts = isRecord(packageJson?.scripts) ? packageJson.scripts : {}

  for (const [scriptName, expectedCommand] of releaseToolingScriptRequirements) {
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
      'node-version: 24',
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
  const notReady = {
    androidReady: false,
    iosReady: false,
    metadataReady: false,
    ready: false,
  }

  if (!evidence) {
    blockers.push(
      [
        `real-device evidence missing at ${describeRealDeviceEvidencePath(
          evidencePath,
        )}`,
        `Create ${describeRealDeviceEvidencePath(
          evidencePath,
        )} after completing docs/real-device-release.md, then run npm run check:real-device-evidence.`,
        readErrors.join('\n'),
      ]
        .filter(Boolean)
        .join('\n'),
    )
    return notReady
  }

  const metadataErrors = validateRealDeviceEvidenceMetadata(evidence, {
    expectedCommit,
    expectedPackageVersions: currentReleasePackageVersions(),
  })
  const androidErrors = validateRealDevicePlatformEvidence(evidence, 'android', {
    requireProductionProfile: true,
  })
  const iosErrors = validateRealDevicePlatformEvidence(evidence, 'ios', {
    requireProductionProfile: true,
  })
  const errors = [...metadataErrors, ...androidErrors, ...iosErrors]
  let metadataReady = metadataErrors.length === 0
  const androidReady = metadataReady && androidErrors.length === 0
  const iosReady = metadataReady && iosErrors.length === 0

  if (errors.length > 0) {
    blockers.push(
      [`real-device evidence is incomplete: ${relative(evidencePath)}`, ...errors]
        .filter(Boolean)
        .join('\n'),
    )
    return {
      androidReady,
      iosReady,
      metadataReady,
      ready: false,
    }
  }

  if (!options.allowOpen) {
    const runErrors = await verifyRealDeviceEvidenceRuns(evidence)
    if (runErrors.length > 0) {
      metadataReady = false
      blockers.push(
        [
          `real-device CI run evidence could not be verified: ${relative(
            evidencePath,
          )}`,
          ...runErrors,
        ].join('\n'),
      )
      return {
        androidReady: false,
        iosReady: false,
        metadataReady,
        ready: false,
      }
    }
  }

  return {
    androidReady,
    iosReady,
    metadataReady,
    ready: true,
  }
}

async function checkReleaseReadinessEvidence(blockers, options, expectedCommit) {
  const evidencePath = resolveReadinessEvidencePath(options)
  const { evidence, errors: readErrors } = readJsonEvidence(evidencePath)

  if (!evidence) {
    blockers.push(
      [
        `release-readiness evidence missing at ${relative(evidencePath)}`,
        'Create it after the Release Preflight workflow passes without warnings.',
        readErrors.join('\n'),
      ]
        .filter(Boolean)
        .join('\n'),
    )
    return false
  }

  const errors = validateReleaseReadinessEvidence(evidence, expectedCommit)
  if (errors.length > 0) {
    blockers.push(
      [
        `release-readiness evidence is incomplete: ${relative(evidencePath)}`,
        ...errors,
      ].join('\n'),
    )
    return false
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
      blockers.push(
        [
          `release-readiness CI run evidence could not be verified: ${relative(
            evidencePath,
          )}`,
          ...runErrors,
        ].join('\n'),
      )
      return false
    }
  }

  return true
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

function ciEvidenceCommands(commit, localGit) {
  const pushCommand =
    localGit?.currentBranch && !localGit.upstreamRef
      ? `git push --set-upstream origin ${localGit.currentBranch}`
      : 'git push'

  return [
    'npm run check',
    pushCommand,
    ...initialReleaseCiCommands(commit),
  ]
}

function collectReadinessNextActions(checks, commit, localGit) {
  const actions = []
  const releaseCommit = releaseCommitLabel(commit)

  if (!checks.cleanWorktree) {
    actions.push({
      id: 'clean-worktree',
      title: 'Commit or remove local changes before strict readiness',
      detail:
        'Strict release readiness requires the release evidence and final wording changes to be checked from a clean worktree.',
      commands: ['git status --short'],
    })
  }

  if (!checks.strictCiEvidence) {
    actions.push({
      id: 'ci-evidence',
      title: 'Collect initial CI evidence for the tested release commit',
      detail:
        'Run the local check, push the release-candidate commit, wait for Check and Godot Smoke, then write release/ci-runs.json for real-device evidence assembly. Release Preflight is collected later after real-device evidence is committed.',
      commands: ciEvidenceCommands(commit, localGit),
    })
  }

  if (
    !checks.realDeviceEvidence ||
    !checks.androidRealDeviceEvidence ||
    !checks.iosRealDeviceEvidence
  ) {
    actions.push({
      id: 'real-device-evidence',
      title: 'Complete Android and iOS real-device export evidence',
      detail:
        'Run the local check and selected API export checks on real or hosted devices, then assemble and validate release/real-device-evidence.json for the tested release commit.',
      commands: [
        'npm run check',
        productionProfilePlatformEvidenceCommand,
        ...initialReleaseCiCommands(commit),
        releaseEvidenceCommand(commit),
        checkRealDeviceEvidenceCommand(commit),
      ],
    })
  }

  if (!checks.strictCiEvidence || !checks.releaseReadinessEvidence) {
    actions.push({
      id: 'release-preflight-evidence',
      title: 'Collect CI and warning-free Release Preflight evidence',
      detail:
        'Run the local check after the tested release candidate and real-device evidence are pushed, capture Check, Godot Smoke, and Release Preflight runs, dispatching Release Preflight when needed, then write release-readiness evidence.',
      commands: [
        'npm run check',
        ...releasePreflightCiCommands(commit, {
          releasePreflightRunCommit: releasePreflightRunCommitPlaceholder,
        }),
        'GH_TOKEN="$(gh auth token)" npm run release:preflight-summary -- --ci-evidence release/ci-runs.json --output release/release-preflight-summary.json',
        releaseEvidenceCommand(commit, {
          releasePreflightSummaryPath: defaultReleasePreflightSummaryPath,
          readinessEvidencePath: defaultReleaseReadinessEvidencePath,
        }),
        `npm run release:readiness -- --expected-commit ${releaseCommit}`,
      ],
    })
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
    actions.push({
      id: 'final-warning-removal',
      title: 'Remove public warning wording through the guarded finalizer',
      detail:
        'Only run the finalizer after strict release readiness evidence is complete; it applies the final TODO checks, removes public warning wording, then stages and commits those edits before the final strict readiness check.',
      commands: [
        `npm run release:readiness -- --summary-output /tmp/vue-godot-readiness.json --expected-commit ${releaseCommit}`,
        'npm run release:finalize-readiness -- --summary /tmp/vue-godot-readiness.json',
        'npm run check',
        `git add ${finalizationFiles.join(' ')}`,
        'git commit -m "Finalize production readiness"',
        `npm run release:readiness -- --expected-commit ${releaseCommit}`,
      ],
    })
  }

  return actions
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
) {
  if (!options.summaryOutput) {
    return
  }

  const resolved = path.resolve(repoRoot, options.summaryOutput)
  const localGit = expectedCommit
    ? collectLocalGitReleaseState(expectedCommit)
    : null
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
    nextActions: collectReadinessNextActions(checks, expectedCommit, localGit),
    finalTodoRequirements: finalTodoRequirementStatuses.map((status) => ({
      ...status,
    })),
    blockers: [...blockers],
    warningMarkers: [...warningMarkers],
    packageDescriptionWarnings: [...packageDescriptionWarnings],
    releaseToolingBlockers: [...releaseToolingBlockers],
    releaseWorkflowBlockers: [...releaseWorkflowBlockers],
  }

  fs.mkdirSync(path.dirname(resolved), { recursive: true })
  fs.writeFileSync(resolved, `${JSON.stringify(summary, null, 2)}\n`)
  console.log(`[release-readiness] wrote ${relative(resolved)}`)
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
  const realDeviceEvidenceReady = realDeviceEvidenceStatus.ready
  const realDeviceEvidenceMetadataReady =
    realDeviceEvidenceStatus.metadataReady
  const androidRealDeviceEvidenceReady =
    realDeviceEvidenceStatus.androidReady
  const iosRealDeviceEvidenceReady = realDeviceEvidenceStatus.iosReady
  const releaseReadinessEvidenceReady = await checkReleaseReadinessEvidence(
    blockers,
    options,
    expectedCommit ?? undefined,
  )

  const packageJson = readJson('package.json')
  const releaseToolingBlockers = collectReleaseToolingBlockers(packageJson)
  blockers.push(...releaseToolingBlockers)
  const releaseWorkflowBlockers = collectReleaseWorkflowBlockers()
  blockers.push(...releaseWorkflowBlockers)
  const releaseWorkflowsReady = releaseWorkflowBlockers.length === 0

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
    checkCiEvidenceReady: strictCiEvidenceReady && releaseWorkflowsReady,
    ciEvidenceReady:
      cleanWorktreeReady &&
      realDeviceEvidenceReady &&
      releaseReadinessEvidenceReady &&
      releaseWorkflowsReady &&
      !options.allowOpen,
    godotSmokeCiEvidenceReady: strictCiEvidenceReady && releaseWorkflowsReady,
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
    publicSurface: publicSurfaceReady,
    publicWarningMarkersRemoved: warningMarkers.length === 0,
    packageDescriptionWarningsRemoved:
      packageDescriptionWarnings.length === 0,
    realDeviceEvidence: realDeviceEvidenceReady,
    realDeviceEvidenceMetadata: realDeviceEvidenceMetadataReady,
    releaseTooling: releaseToolingBlockers.length === 0,
    releaseWorkflows: releaseWorkflowsReady,
    releaseReadinessEvidence: releaseReadinessEvidenceReady,
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
    )
  } catch (error) {
    blockers.push(
      `Unable to write release readiness summary: ${
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
