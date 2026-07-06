function formatIssueBlock(value) {
  const lines = String(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (lines.length === 0) {
    return []
  }

  const [first, ...rest] = lines
  return [`  - ${first}`, ...rest.map((line) => `    ${line}`)]
}

export function formatIssueLines(label, values) {
  const issues = Array.isArray(values)
    ? values.flatMap((value) => formatIssueBlock(value))
    : []

  if (issues.length === 0) {
    return [`- ${label}: none`]
  }

  return [`- ${label}:`, ...issues]
}
