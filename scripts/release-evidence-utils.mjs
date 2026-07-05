export const githubActionsRunUrlPattern =
  /^https:\/\/github\.com\/portwatcher\/vue-godot\/actions\/runs\/[0-9]+(?:\/[A-Za-z0-9_./?=&%-]+)?$/

export function isRecord(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}

export function hasNonEmptyString(record, key) {
  return typeof record[key] === 'string' && record[key].trim().length > 0
}

export function hasGitHubActionsRunUrl(record, key) {
  return (
    hasNonEmptyString(record, key) &&
    githubActionsRunUrlPattern.test(record[key])
  )
}

export function assertGitHubActionsRunUrl(record, key, errors, label) {
  if (!hasGitHubActionsRunUrl(record, key)) {
    errors.push(
      `${label}.${key} must be a GitHub Actions run URL for portwatcher/vue-godot`,
    )
  }
}
