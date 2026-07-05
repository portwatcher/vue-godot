import { shellQuote } from './release-utils.mjs'

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

function shellArg(value) {
  const text = String(value)
  if (text === currentHeadCommitCommand || /^<[^>]+>$/.test(text)) {
    return text
  }

  return shellQuote(text)
}

function shellCommand(args) {
  return args.map((arg) => shellArg(arg)).join(' ')
}

export function releaseCommitLabel(commit) {
  return commit ?? releaseCandidateCommitPlaceholder
}

export function productionProfilePlatformEvidenceCommand(commit) {
  return shellCommand([
    'npm',
    'run',
    'release:platform-evidence',
    '--',
    '--production-profile',
    '--commit',
    releaseCommitLabel(commit),
  ])
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

  const command = shellCommand(args)
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

  return shellCommand(args)
}

export function checkRealDeviceEvidenceCommand(commit) {
  return shellCommand([
    'npm',
    'run',
    'check:real-device-evidence',
    '--',
    '--expected-commit',
    releaseCommitLabel(commit),
  ])
}
