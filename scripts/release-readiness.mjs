import fs from 'node:fs'
import path from 'node:path'
import {
  defaultRealDeviceEvidencePath,
  describeRealDeviceEvidencePath,
  readRealDeviceEvidence,
  realDeviceEvidenceEnvVar,
  resolveRealDeviceEvidencePath,
  validateRealDeviceEvidence,
} from './real-device-evidence.mjs'
import {
  assertExactString,
  assertGitHubActionsRunUrl,
  hasNonEmptyString,
  isRecord,
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
  --help                        Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    allowOpen: false,
    expectedCommit: null,
    realDevicePath: null,
    readinessPath: null,
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
    return
  }

  const status = result.stdout.trim()
  if (status.length > 0) {
    blockers.push(
      [
        'working tree must be clean for final release readiness',
        status,
      ].join('\n'),
    )
  }
}

function collectUncheckedTodoItems() {
  return readText('TODO.md')
    .split(/\r?\n/)
    .flatMap((line, index) => {
      const match = line.match(/^\s*- \[ \] (.+)$/)
      if (!match) {
        return []
      }
      return [`TODO.md:${index + 1} ${match[1]}`]
    })
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

function validateReleaseReadinessEvidence(evidence, expectedCommit) {
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

function checkRealDeviceEvidence(blockers, options, expectedCommit) {
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
    return
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
  }
}

function checkReleaseReadinessEvidence(blockers, options, expectedCommit) {
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
    return
  }

  const errors = validateReleaseReadinessEvidence(evidence, expectedCommit)
  if (errors.length > 0) {
    blockers.push(
      [
        `release-readiness evidence is incomplete: ${relative(evidencePath)}`,
        ...errors,
      ].join('\n'),
    )
  }
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

function checkWarningMarkerState(blockers) {
  const markersStillPresent = collectWarningMarkerHits()

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
    return
  }

  blockers.push(['public surface audit failed', ...errors].join('\n'))
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const blockers = collectUncheckedTodoItems()
  const expectedCommit = options.expectedCommit ?? currentCommit(blockers)

  checkCleanWorktree(blockers)
  checkRealDeviceEvidence(blockers, options, expectedCommit ?? undefined)
  checkReleaseReadinessEvidence(blockers, options, expectedCommit ?? undefined)

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
    packageJson.scripts?.['release:readiness'] !==
    'node scripts/release-readiness.mjs'
  ) {
    blockers.push(
      'package.json must expose release:readiness as node scripts/release-readiness.mjs',
    )
  }

  checkPublicSurface(blockers)

  const warningMarkers = checkWarningMarkerState(blockers)

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

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
