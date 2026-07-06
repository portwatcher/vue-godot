import crypto from 'node:crypto'
import path from 'node:path'
import { repoRoot, shellQuote } from './release-utils.mjs'

export const releaseCandidateCommitPlaceholder = '<release-candidate-sha>'
export const releasePreflightRunCommitPlaceholder = '<evidence-commit-sha>'
export const currentHeadCommitCommand = '"$(git rev-parse HEAD)"'
export const releaseDispatchRefPlaceholder = '<branch-or-tag>'
export const releaseCandidateDispatchRefPlaceholder =
  '<release-candidate-branch-or-tag>'
export const evidenceDispatchRefPlaceholder = '<evidence-branch-or-tag>'
export const defaultPlatformEvidencePath = 'release/platform-evidence.json'
export const defaultReleaseCiEvidencePath = 'release/ci-runs.json'
export const defaultRealDeviceEvidencePath = 'release/real-device-evidence.json'
export const defaultReleasePreflightSummaryPath =
  'release/release-preflight-summary.json'
export const defaultReleaseReadinessEvidencePath =
  'release/release-readiness-evidence.json'
export const defaultReleaseHandoffReportPath = 'release/release-handoff.md'
export const releaseHandoffReportFormatVersion = 2

function stableJson(value) {
  if (Array.isArray(value)) {
    return value.map(stableJson)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stableJson(value[key])]),
    )
  }

  return value
}

export function releaseHandoffReportStateHash(summary) {
  const state = {
    blockers: Array.isArray(summary?.blockers) ? summary.blockers : [],
    checks:
      summary?.checks && typeof summary.checks === 'object'
        ? summary.checks
        : {},
    commit: summary?.commit ?? null,
    finalTodoRequirements: Array.isArray(summary?.finalTodoRequirements)
      ? summary.finalTodoRequirements
      : [],
    initialCiEvidence:
      summary?.initialCiEvidence && typeof summary.initialCiEvidence === 'object'
        ? summary.initialCiEvidence
        : {},
    platformEvidence:
      summary?.platformEvidence && typeof summary.platformEvidence === 'object'
        ? summary.platformEvidence
        : {},
    realDeviceEvidence:
      summary?.realDeviceEvidence &&
      typeof summary.realDeviceEvidence === 'object'
        ? summary.realDeviceEvidence
        : {},
    releaseReadinessEvidence:
      summary?.releaseReadinessEvidence &&
      typeof summary.releaseReadinessEvidence === 'object'
        ? summary.releaseReadinessEvidence
        : {},
  }

  return crypto
    .createHash('sha256')
    .update(JSON.stringify(stableJson(state)))
    .digest('hex')
    .slice(0, 16)
}

function shellArg(value) {
  const text = String(value)
  if (text === currentHeadCommitCommand || /^<[^>]+>$/.test(text)) {
    return text
  }

  return shellQuote(text)
}

function uniqueNonEmptyStrings(values) {
  if (!Array.isArray(values)) {
    return []
  }

  return [
    ...new Set(
      values
        .filter((value) => typeof value === 'string')
        .map((value) => value.trim())
        .filter((value) => value.length > 0),
    ),
  ]
}

export function formatHandoffCommand(args) {
  return args.map((arg) => shellArg(arg)).join(' ')
}

export function releaseCommitLabel(commit) {
  return commit ?? releaseCandidateCommitPlaceholder
}

export function productionProfilePlatformEvidenceCommand(commit, options = {}) {
  const args = [
    'npm',
    'run',
    'release:platform-evidence',
    '--',
    '--production-profile',
    '--commit',
    releaseCommitLabel(commit),
  ]

  if (options.output) {
    args.push('--output', options.output)
  }

  return formatHandoffCommand(args)
}

export function checkPlatformEvidenceCommand(commit, options = {}) {
  const args = [
    'npm',
    'run',
    'check:platform-evidence',
    '--',
    '--platform-evidence',
    options.platformEvidencePath ?? defaultPlatformEvidencePath,
  ]

  if (options.summaryOutput) {
    args.push('--summary-output', options.summaryOutput)
  }

  if (options.allowOpen) {
    args.push('--allow-open')
  }

  args.push('--expected-commit', releaseCommitLabel(commit))

  return formatHandoffCommand(args)
}

export function recordPlatformEvidenceCommand(platform, commit, options = {}) {
  const platformName = platform === 'ios' ? 'ios' : 'android'
  const artifactPlaceholder =
    platformName === 'ios'
      ? '<ios-archive-testflight-or-hosted-build-id>'
      : '<android-apk-aab-or-hosted-build-id>'
  const exportPresetPlaceholder =
    platformName === 'ios' ? '<ios-export-preset>' : '<android-export-preset>'
  const devicePlaceholder =
    platformName === 'ios' ? '<ios-device-model>' : '<android-device-model>'
  const osPlaceholder =
    platformName === 'ios' ? '<ios-version>' : '<android-os-version>'
  const args = [
    'npm',
    'run',
    'release:record-platform-evidence',
    '--',
    '--platform',
    platformName,
    '--platform-evidence',
    options.platformEvidencePath ?? defaultPlatformEvidencePath,
    '--artifact',
    artifactPlaceholder,
    '--export-preset',
    exportPresetPlaceholder,
    '--device',
    devicePlaceholder,
    '--os',
    osPlaceholder,
    '--orientation',
    '<tested-orientations>',
    '--locale',
    '<tested-locale>',
    '--pass-remaining',
    '--pass-remaining-confirmation',
    '<confirm-all-remaining-must-pass-checks-after-testing>',
  ]

  for (const check of uniqueNonEmptyStrings(options.skipChecks)) {
    args.push('--skip', `${check}=<skip-reason-if-not-selected>`)
  }

  args.push(
    '--summary-output',
    options.summaryOutput ?? 'release/platform-evidence-summary.json',
    '--expected-commit',
    releaseCommitLabel(commit),
  )

  return formatHandoffCommand(args)
}

export function releaseCiCommand(commit, options = {}) {
  const args = [
    'npm',
    'run',
    'release:ci',
    '--',
    '--commit',
    releaseCommitLabel(commit),
  ]

  if (options.includeReleasePreflight) {
    args.push('--include-release-preflight')
  }
  if (
    options.releasePreflightRunCommit &&
    options.releasePreflightRunCommit !== releaseCommitLabel(commit) &&
    options.includeReleasePreflight
  ) {
    args.push('--release-preflight-run-commit', options.releasePreflightRunCommit)
  }
  if (options.dispatchMissing) {
    args.push('--dispatch-missing')
  }
  if (options.wait) {
    args.push('--wait')
  }
  if (options.ref) {
    args.push('--ref', options.ref)
  }
  if (options.realDeviceEvidencePath && options.includeReleasePreflight) {
    args.push('--real-device-evidence-path', options.realDeviceEvidencePath)
  }
  if (options.output) {
    args.push('--output', options.output)
  }

  const command = formatHandoffCommand(args)
  return options.withGitHubToken
    ? `GH_TOKEN="$(gh auth token)" ${command}`
    : command
}

export function initialReleaseCiCommands(commit, options = {}) {
  const output = options.output ?? defaultReleaseCiEvidencePath
  return [
    releaseCiCommand(commit, {
      output,
      wait: true,
    }),
    releaseCiCommand(commit, {
      dispatchMissing: true,
      output,
      ref: options.ref ?? releaseCandidateDispatchRefPlaceholder,
      wait: true,
      withGitHubToken: true,
    }),
  ]
}

export function releasePreflightCiCommands(commit, options = {}) {
  const output = options.output ?? defaultReleaseCiEvidencePath
  const releasePreflightRunCommit = options.releasePreflightRunCommit
  const usesEvidenceCommit =
    releasePreflightRunCommit != null &&
    releasePreflightRunCommit !== releaseCommitLabel(commit)
  const dispatchRef =
    options.ref ??
    (usesEvidenceCommit
      ? evidenceDispatchRefPlaceholder
      : releaseDispatchRefPlaceholder)
  return [
    releaseCiCommand(commit, {
      includeReleasePreflight: true,
      output,
      releasePreflightRunCommit,
      wait: true,
    }),
    releaseCiCommand(commit, {
      dispatchMissing: true,
      includeReleasePreflight: true,
      output,
      realDeviceEvidencePath:
        options.realDeviceEvidencePath ?? defaultRealDeviceEvidencePath,
      ref: dispatchRef,
      releasePreflightRunCommit,
      wait: true,
      withGitHubToken: true,
    }),
  ]
}

export function releaseEvidenceCommand(commit, options = {}) {
  const args = [
    'npm',
    'run',
    'release:evidence',
    '--',
    '--platform-evidence',
    options.platformEvidencePath ?? defaultPlatformEvidencePath,
    '--ci-evidence',
    options.ciEvidencePath ?? defaultReleaseCiEvidencePath,
    '--commit',
    releaseCommitLabel(commit),
    '--real-device-output',
    options.realDeviceEvidencePath ?? defaultRealDeviceEvidencePath,
  ]

  if (options.releasePreflightSummaryPath) {
    args.push(
      '--release-preflight-summary',
      options.releasePreflightSummaryPath,
    )
  }

  if (options.readinessEvidencePath) {
    args.push('--readiness-output', options.readinessEvidencePath)
  }

  return formatHandoffCommand(args)
}

export function checkRealDeviceEvidenceCommand(commit, options = {}) {
  const args = [
    'npm',
    'run',
    'check:real-device-evidence',
    '--',
  ]

  if (options.realDeviceEvidencePath) {
    args.push('--path', options.realDeviceEvidencePath)
  }
  if (options.platformEvidencePath) {
    args.push('--platform-evidence', options.platformEvidencePath)
  }
  if (options.ciEvidencePath) {
    args.push('--ci-evidence', options.ciEvidencePath)
  }

  args.push(
    '--expected-commit',
    releaseCommitLabel(commit),
  )

  return formatHandoffCommand(args)
}

export function commitEvidenceCommands(files, message, options = {}) {
  const commands = [
    `git add ${files.map((file) => shellQuote(file)).join(' ')}`,
    `git commit -m "${message}"`,
  ]

  if (options.push) {
    commands.push('git push')
  }

  return commands
}

export function isRepoLocalPath(filePath) {
  const relative = path.relative(repoRoot, path.resolve(repoRoot, filePath))
  return (
    relative === '' ||
    (!relative.startsWith('..') && !path.isAbsolute(relative))
  )
}

export function repoLocalEvidencePath(filePath, defaultPath) {
  if (!isRepoLocalPath(filePath)) {
    return defaultPath
  }

  return path.relative(repoRoot, path.resolve(repoRoot, filePath)) || filePath
}

export function copyOutsideRepoEvidenceCommands(files) {
  return files
    .filter(([source]) => !isRepoLocalPath(source))
    .map(
      ([source, target]) =>
        `cp ${shellQuote(source)} ${shellQuote(target)}`,
    )
}

export function commitEvidenceFileCommands(files, message, options = {}) {
  return [
    ...copyOutsideRepoEvidenceCommands(files),
    ...commitEvidenceCommands(
      files.map(([source, target]) => repoLocalEvidencePath(source, target)),
      message,
      options,
    ),
  ]
}
