import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  defaultRealDeviceEvidencePath,
  describeRealDeviceEvidencePath,
  readRealDeviceEvidence,
  realDeviceEvidenceEnvVar,
  resolveRealDeviceEvidencePath,
  validateRealDeviceEvidence,
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
import {
  currentReleasePackageVersions,
  readJson,
  repoRoot,
  run,
} from './release-utils.mjs'

const releaseReadinessEvidenceEnvVar =
  'VUE_GODOT_RELEASE_READINESS_EVIDENCE'
const defaultReleaseReadinessEvidencePath =
  'release/release-readiness-evidence.json'

const releaseWarningMarkers = [
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

function usage() {
  console.log(`Usage: node scripts/release-readiness.mjs [options]

Options:
  --allow-open                  Print blockers but exit 0.
  --real-device-path <file>     Read Android/iOS evidence from a specific file.
                                Defaults to ${realDeviceEvidenceEnvVar} or ${defaultRealDeviceEvidencePath}.
  --readiness-path <file>       Read release-readiness evidence from a specific file.
                                Defaults to ${releaseReadinessEvidenceEnvVar} or ${defaultReleaseReadinessEvidencePath}.
  --expected-commit <sha>       Require evidence files to match this commit.
                                Defaults to the current git commit.
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
    hasNonEmptyString(evidence, 'commit') &&
    hasNonEmptyString(evidence, 'releasePreflightRunCommit') &&
    evidence.releasePreflightRunCommit !== evidence.commit
  ) {
    errors.push(
      `releaseReadiness.releasePreflightRunCommit must match commit ${evidence.commit}`,
    )
  }

  if (
    expectedCommit &&
    hasNonEmptyString(evidence, 'commit') &&
    evidence.commit !== expectedCommit
  ) {
    errors.push(
      `releaseReadiness.commit must match current commit ${expectedCommit}`,
    )
  }

  return errors
}

const finalTodoEvidenceRequirements = [
  {
    text: '`npm run check` passes locally and in CI.',
    proof: 'checkCiEvidenceReady',
    reason:
      'Check workflow evidence must be verified in a strict release-readiness run',
  },
  {
    text: 'Godot smoke, generated Godot smoke, and editor reload smoke pass in CI for every release candidate.',
    proof: 'godotSmokeCiEvidenceReady',
    reason:
      'Godot Smoke workflow evidence must be verified in a strict release-readiness run',
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
    proof: 'realDeviceEvidenceReady',
    reason: 'real-device evidence must validate the Android export checks',
  },
  {
    text: 'iOS export with selected device APIs has been tested.',
    proof: 'realDeviceEvidenceReady',
    reason: 'real-device evidence must validate the iOS export checks',
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
      'release-readiness evidence must validate a warning-free Release Preflight run',
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

export function collectCheckedTodoEvidenceBlockers(todoItems, proofs) {
  const proofByName = {
    checkCiEvidenceReady: proofs.checkCiEvidenceReady,
    ciEvidenceReady: proofs.ciEvidenceReady,
    godotSmokeCiEvidenceReady: proofs.godotSmokeCiEvidenceReady,
    publicReadmesReady: proofs.publicReadmesReady,
    realDeviceEvidenceReady: proofs.realDeviceEvidenceReady,
    releaseReadinessEvidenceReady: proofs.releaseReadinessEvidenceReady,
    rootReadmeWarningReady: proofs.rootReadmeWarningReady,
    warningWordingReady: proofs.warningWordingReady,
  }

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

async function checkRealDeviceEvidence(blockers, options, expectedCommit) {
  const evidencePath =
    options.realDevicePath ?? resolveRealDeviceEvidencePath(process.env)
  const { evidence, errors: readErrors } = readRealDeviceEvidence(evidencePath)

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
    return false
  }

  const errors = validateRealDeviceEvidence(evidence, {
    expectedCommit,
    expectedPackageVersions: currentReleasePackageVersions(),
  })
  if (errors.length > 0) {
    blockers.push(
      [`real-device evidence is incomplete: ${relative(evidencePath)}`, ...errors]
        .filter(Boolean)
        .join('\n'),
    )
    return false
  }

  if (!options.allowOpen) {
    const runErrors = await verifyRealDeviceEvidenceRuns(evidence)
    if (runErrors.length > 0) {
      blockers.push(
        [
          `real-device CI run evidence could not be verified: ${relative(
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
        commit: evidence.commit,
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

function collectWarningMarkerHits() {
  return releaseWarningMarkers.flatMap((marker) => {
    const source = readText(marker.file)
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

function checkPublicSurface(blockers) {
  const errors = collectPublicSurfaceAuditErrors()
  if (errors.length === 0) {
    return true
  }

  blockers.push(['public surface audit failed', ...errors].join('\n'))
  return false
}

function writeReadinessSummary(
  options,
  expectedCommit,
  blockers,
  warningMarkers,
  checks,
  todoItems,
) {
  if (!options.summaryOutput) {
    return
  }

  const resolved = path.resolve(repoRoot, options.summaryOutput)
  const summary = {
    commit: expectedCommit,
    allowOpen: options.allowOpen,
    ready: blockers.length === 0,
    blockerCount: blockers.length,
    warningMarkerCount: warningMarkers.length,
    todo: {
      total: todoItems.length,
      checked: todoItems.filter((item) => item.checked).length,
      unchecked: todoItems.filter((item) => !item.checked).length,
    },
    checks: { ...checks },
    blockers: [...blockers],
    warningMarkers: [...warningMarkers],
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
  const realDeviceEvidenceReady = await checkRealDeviceEvidence(
    blockers,
    options,
    expectedCommit ?? undefined,
  )
  const releaseReadinessEvidenceReady = await checkReleaseReadinessEvidence(
    blockers,
    options,
    expectedCommit ?? undefined,
  )

  const packageJson = readJson('package.json')

  if (
    packageJson.scripts?.['check:public-surface'] !==
    'node scripts/public-surface-audit.mjs'
  ) {
    blockers.push(
      'package.json must expose check:public-surface as node scripts/public-surface-audit.mjs',
    )
  }

  if (
    packageJson.scripts?.['check:serious-examples'] !==
    'node scripts/check-serious-example-apps.mjs'
  ) {
    blockers.push(
      'package.json must expose check:serious-examples as node scripts/check-serious-example-apps.mjs',
    )
  }

  if (
    !String(packageJson.scripts?.check ?? '').includes(
      'npm run check:serious-examples',
    )
  ) {
    blockers.push(
      'package.json check script must run npm run check:serious-examples',
    )
  }

  if (
    packageJson.scripts?.['release:readiness'] !==
    'node scripts/release-readiness.mjs'
  ) {
    blockers.push(
      'package.json must expose release:readiness as node scripts/release-readiness.mjs',
    )
  }

  const publicSurfaceReady = checkPublicSurface(blockers)

  const warningMarkers = collectWarningMarkerHits()
  const rootReadmeWarningReady = !warningMarkers.some((marker) =>
    marker.startsWith('README.md:'),
  )
  const strictCiEvidenceReady =
    !options.allowOpen && realDeviceEvidenceReady && releaseReadinessEvidenceReady
  const finalTodoStructureBlockers =
    collectFinalTodoStructureBlockers(todoItems)
  blockers.push(...finalTodoStructureBlockers)

  const checkedFinalTodoProofs = {
    checkCiEvidenceReady: strictCiEvidenceReady,
    ciEvidenceReady:
      cleanWorktreeReady &&
      realDeviceEvidenceReady &&
      releaseReadinessEvidenceReady &&
      !options.allowOpen,
    godotSmokeCiEvidenceReady: strictCiEvidenceReady,
    publicReadmesReady: publicSurfaceReady && rootReadmeWarningReady,
    realDeviceEvidenceReady,
    releaseReadinessEvidenceReady,
    rootReadmeWarningReady,
    warningWordingReady: blockers.length === 0 && warningMarkers.length === 0,
  }
  const checkedFinalTodoEvidenceBlockers = collectCheckedTodoEvidenceBlockers(
    todoItems,
    checkedFinalTodoProofs,
  )
  blockers.push(...checkedFinalTodoEvidenceBlockers)

  checkWarningMarkerState(blockers, warningMarkers)
  const checks = {
    checkedFinalTodosBackedByEvidence:
      checkedFinalTodoEvidenceBlockers.length === 0,
    cleanWorktree: cleanWorktreeReady,
    finalTodoStructure: finalTodoStructureBlockers.length === 0,
    publicSurface: publicSurfaceReady,
    publicWarningMarkersRemoved: warningMarkers.length === 0,
    realDeviceEvidence: realDeviceEvidenceReady,
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

  if (warningMarkers.length > 0) {
    console.log('\n[release-readiness] public warning markers still present')
    for (const marker of warningMarkers) {
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
