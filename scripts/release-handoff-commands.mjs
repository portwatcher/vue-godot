export const releaseCandidateCommitPlaceholder = '<release-candidate-sha>'
export const releaseDispatchRefPlaceholder = '<branch-or-tag>'
export const defaultReleaseCiEvidencePath = 'release/ci-runs.json'
export const defaultRealDeviceEvidencePath = 'release/real-device-evidence.json'

export function releaseCommitLabel(commit) {
  return commit ?? releaseCandidateCommitPlaceholder
}

export function releaseCiCommand(commit, options = {}) {
  const args = ['npm run release:ci --', '--commit', releaseCommitLabel(commit)]

  if (options.includeReleasePreflight) {
    args.push('--include-release-preflight')
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

  const command = args.join(' ')
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
      ref: options.ref ?? releaseDispatchRefPlaceholder,
      wait: true,
      withGitHubToken: true,
    }),
  ]
}

export function releasePreflightCiCommands(commit, options = {}) {
  const output = options.output ?? defaultReleaseCiEvidencePath
  return [
    releaseCiCommand(commit, {
      includeReleasePreflight: true,
      output,
      wait: true,
    }),
    releaseCiCommand(commit, {
      dispatchMissing: true,
      includeReleasePreflight: true,
      output,
      realDeviceEvidencePath:
        options.realDeviceEvidencePath ?? defaultRealDeviceEvidencePath,
      ref: options.ref ?? releaseDispatchRefPlaceholder,
      wait: true,
      withGitHubToken: true,
    }),
  ]
}
