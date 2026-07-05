import https from 'node:https'

const githubRepoOwner = 'portwatcher'
const githubRepoName = 'vue-godot'
const githubActionsRunUrlSource = `https://github.com/${githubRepoOwner}/${githubRepoName}/actions/runs/`

export const githubActionsRunUrlPattern =
  /^https:\/\/github\.com\/portwatcher\/vue-godot\/actions\/runs\/[0-9]+(?:\/[A-Za-z0-9_./?=&%-]+)?$/

export class GitHubApiError extends Error {
  constructor(statusCode, body) {
    super(`GitHub API returned HTTP ${statusCode}${body ? `: ${body}` : ''}`)
    this.name = 'GitHubApiError'
    this.statusCode = statusCode
    this.body = body
  }
}

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

export function assertExactString(record, key, expected, errors, label) {
  if (record[key] !== expected) {
    errors.push(`${label}.${key} must be "${expected}"`)
  }
}

export function extractGitHubActionsRunId(runUrl) {
  if (typeof runUrl !== 'string') {
    return null
  }

  const match = runUrl.match(
    /^https:\/\/github\.com\/portwatcher\/vue-godot\/actions\/runs\/([0-9]+)(?:\/[A-Za-z0-9_./?=&%-]+)?$/,
  )
  return match?.[1] ?? null
}

export function githubTokenFromEnv(env = process.env) {
  const token = env.GITHUB_TOKEN || env.GH_TOKEN
  return typeof token === 'string' && token.trim().length > 0 ? token : null
}

function requestJson(url, options = {}) {
  const token = options.token ?? githubTokenFromEnv()
  const userAgent = options.userAgent ?? 'vue-godot-release-evidence'

  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': userAgent,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
      (response) => {
        const chunks = []
        response.setEncoding('utf-8')
        response.on('error', reject)
        response.on('data', (chunk) => {
          chunks.push(chunk)
        })
        response.on('end', () => {
          const body = chunks.join('')
          const statusCode = response.statusCode ?? 0
          if (statusCode < 200 || statusCode >= 300) {
            reject(new GitHubApiError(statusCode, body))
            return
          }

          try {
            resolve(JSON.parse(body))
          } catch (error) {
            reject(
              new Error(
                `GitHub API returned invalid JSON: ${
                  error instanceof Error ? error.message : String(error)
                }`,
              ),
            )
          }
        })
      },
    )

    request.on('error', reject)
    request.setTimeout(30_000, () => {
      request.destroy(new Error(`Timed out reading ${url}`))
    })
  })
}

export async function fetchGitHubActionsRun(runUrl, options = {}) {
  const runId = extractGitHubActionsRunId(runUrl)
  if (!runId) {
    throw new Error(
      `GitHub Actions run URL must start with ${githubActionsRunUrlSource}`,
    )
  }

  const apiBaseUrl = options.apiBaseUrl ?? 'https://api.github.com'
  const apiUrl = `${apiBaseUrl}/repos/${githubRepoOwner}/${githubRepoName}/actions/runs/${runId}`
  return await requestJson(apiUrl, options)
}

export async function fetchGitHubActionsRunsForCommit(commit, options = {}) {
  if (typeof commit !== 'string' || commit.trim().length === 0) {
    throw new Error('Commit must be a non-empty string')
  }

  const apiBaseUrl = options.apiBaseUrl ?? 'https://api.github.com'
  const apiUrl = `${apiBaseUrl}/repos/${githubRepoOwner}/${githubRepoName}/actions/runs?head_sha=${encodeURIComponent(
    commit,
  )}&per_page=100`
  const response = await requestJson(apiUrl, options)
  if (!isRecord(response) || !Array.isArray(response.workflow_runs)) {
    throw new Error('GitHub API response did not include workflow_runs')
  }

  return response.workflow_runs
}

export async function fetchGitHubCommitExists(commit, options = {}) {
  if (typeof commit !== 'string' || commit.trim().length === 0) {
    throw new Error('Commit must be a non-empty string')
  }

  const apiBaseUrl = options.apiBaseUrl ?? 'https://api.github.com'
  const apiUrl = `${apiBaseUrl}/repos/${githubRepoOwner}/${githubRepoName}/commits/${encodeURIComponent(
    commit,
  )}`

  try {
    await requestJson(apiUrl, options)
    return true
  } catch (error) {
    if (
      error instanceof GitHubApiError &&
      (error.statusCode === 404 || error.statusCode === 422)
    ) {
      return false
    }
    throw error
  }
}

export function validateGitHubActionsRunMetadata(run, expected) {
  const errors = []
  const label = expected.label ?? 'GitHub Actions run'

  if (!isRecord(run)) {
    return [`${label} metadata must be a JSON object`]
  }

  if (run.status !== 'completed') {
    errors.push(`${label} status must be "completed"`)
  }

  if (run.name !== expected.workflowName) {
    errors.push(`${label} workflow name must be "${expected.workflowName}"`)
  }

  if (run.head_sha !== expected.commit) {
    errors.push(`${label} commit must be ${expected.commit}`)
  }

  if (run.conclusion !== expected.conclusion) {
    errors.push(`${label} conclusion must be "${expected.conclusion}"`)
  }

  return errors
}

export async function verifyGitHubActionsRunUrl(runUrl, expected, options = {}) {
  const label = expected.label ?? 'GitHub Actions run'
  if (!extractGitHubActionsRunId(runUrl)) {
    return [
      `${label} must be a GitHub Actions run URL for ${githubRepoOwner}/${githubRepoName}`,
    ]
  }

  let run
  try {
    run = await fetchGitHubActionsRun(runUrl, options)
  } catch (error) {
    return [
      `${label} metadata could not be read from GitHub: ${
        error instanceof Error ? error.message : String(error)
      }`,
    ]
  }

  return validateGitHubActionsRunMetadata(run, expected)
}
