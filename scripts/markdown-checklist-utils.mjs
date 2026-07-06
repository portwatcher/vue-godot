function identity(value) {
  return value
}

function formatIssueBlock(
  value,
  {
    continuationIndent = '    ',
    firstIndent = '  - ',
    normalizeLine = identity,
  } = {},
) {
  const lines = String(value)
    .split(/\r?\n/)
    .map((line) => normalizeLine(line).trim())
    .filter((line) => line.length > 0)

  if (lines.length === 0) {
    return []
  }

  const [first, ...rest] = lines
  return [
    `${firstIndent}${first}`,
    ...rest.map((line) => `${continuationIndent}${line}`),
  ]
}

export function formatIssueBulletLines(
  values,
  { limit = Infinity, normalizeLine = identity } = {},
) {
  if (!Array.isArray(values) || values.length === 0) {
    return ['- none']
  }

  const selectedValues = Number.isFinite(limit) ? values.slice(0, limit) : values
  const issues = selectedValues.flatMap((value) =>
    formatIssueBlock(value, {
      continuationIndent: '  ',
      firstIndent: '- ',
      normalizeLine,
    }),
  )
  const remaining = values.length - selectedValues.length
  if (remaining > 0) {
    issues.push(`- ... ${remaining} more`)
  }

  return issues.length === 0 ? ['- none'] : issues
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
