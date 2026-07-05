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

function requestGitHubApi(url, options = {}) {
  const token = options.token ?? githubTokenFromEnv()
  const userAgent = options.userAgent ?? 'vue-godot-release-evidence'
  const method = options.method ?? 'GET'
  const requestBody = options.body == null ? null : JSON.stringify(options.body)

  return new Promise((resolve, reject) => {
    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': userAgent,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'X-GitHub-Api-Version': '2022-11-28',
    }

    if (requestBody != null) {
      headers['Content-Type'] = 'application/json'
      headers['Content-Length'] = Buffer.byteLength(requestBody)
    }

    const request = https.request(
      url,
      {
        method,
        headers,
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

          if (body.trim().length === 0) {
            resolve(null)
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
    if (requestBody != null) {
      request.write(requestBody)
    }
    request.end()
  })
}

function requestGitHubApiBuffer(url, options = {}, redirectCount = 0) {
  const token = options.token ?? githubTokenFromEnv()
  const userAgent = options.userAgent ?? 'vue-godot-release-evidence'
  const method = options.method ?? 'GET'
  const requestBody = options.body == null ? null : JSON.stringify(options.body)

  return new Promise((resolve, reject) => {
    const headers = {
      Accept: options.accept ?? 'application/vnd.github+json',
      'User-Agent': userAgent,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'X-GitHub-Api-Version': '2022-11-28',
    }

    if (requestBody != null) {
      headers['Content-Type'] = 'application/json'
      headers['Content-Length'] = Buffer.byteLength(requestBody)
    }

    const request = https.request(
      url,
      {
        method,
        headers,
      },
      (response) => {
        const statusCode = response.statusCode ?? 0
        const location = response.headers.location
        if (
          statusCode >= 300 &&
          statusCode < 400 &&
          typeof location === 'string'
        ) {
          response.resume()
          if (redirectCount >= 5) {
            reject(new Error(`Too many redirects reading ${url}`))
            return
          }

          const redirectUrl = new URL(location, url).toString()
          requestGitHubApiBuffer(
            redirectUrl,
            { ...options, token: '' },
            redirectCount + 1,
          )
            .then(resolve)
            .catch(reject)
          return
        }

        const chunks = []
        response.on('error', reject)
        response.on('data', (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
        })
        response.on('end', () => {
          const body = Buffer.concat(chunks)
          if (statusCode < 200 || statusCode >= 300) {
            reject(new GitHubApiError(statusCode, body.toString('utf-8')))
            return
          }

          resolve(body)
        })
      },
    )

    request.on('error', reject)
    request.setTimeout(30_000, () => {
      request.destroy(new Error(`Timed out reading ${url}`))
    })
    if (requestBody != null) {
      request.write(requestBody)
    }
    request.end()
  })
}

async function requestJson(url, options = {}) {
  const response = await requestGitHubApi(url, options)
  if (response == null) {
    throw new Error('GitHub API returned an empty response')
  }
  return response
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

export async function fetchGitHubActionsRunArtifacts(runUrl, options = {}) {
  const runId = extractGitHubActionsRunId(runUrl)
  if (!runId) {
    throw new Error(
      `GitHub Actions run URL must start with ${githubActionsRunUrlSource}`,
    )
  }

  const apiBaseUrl = options.apiBaseUrl ?? 'https://api.github.com'
  const apiUrl = `${apiBaseUrl}/repos/${githubRepoOwner}/${githubRepoName}/actions/runs/${runId}/artifacts?per_page=100`
  const response = await requestJson(apiUrl, options)
  if (!isRecord(response) || !Array.isArray(response.artifacts)) {
    throw new Error('GitHub API response did not include artifacts')
  }

  return response.artifacts
}

export async function downloadGitHubActionsArtifactZip(
  artifactId,
  options = {},
) {
  if (!Number.isInteger(artifactId) || artifactId <= 0) {
    throw new Error('Artifact id must be a positive integer')
  }

  const apiBaseUrl = options.apiBaseUrl ?? 'https://api.github.com'
  const apiUrl = `${apiBaseUrl}/repos/${githubRepoOwner}/${githubRepoName}/actions/artifacts/${artifactId}/zip`
  return await requestGitHubApiBuffer(apiUrl, {
    ...options,
    accept: 'application/vnd.github+json',
  })
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
  return (await fetchGitHubCommitSha(commit, options)) != null
}

export async function fetchGitHubCommitSha(ref, options = {}) {
  if (typeof ref !== 'string' || ref.trim().length === 0) {
    throw new Error('Git reference must be a non-empty string')
  }

  const apiBaseUrl = options.apiBaseUrl ?? 'https://api.github.com'
  const apiUrl = `${apiBaseUrl}/repos/${githubRepoOwner}/${githubRepoName}/commits/${encodeURIComponent(
    ref,
  )}`

  try {
    const response = await requestJson(apiUrl, options)
    if (!isRecord(response) || !hasNonEmptyString(response, 'sha')) {
      throw new Error('GitHub commit response did not include sha')
    }
    return response.sha
  } catch (error) {
    if (
      error instanceof GitHubApiError &&
      (error.statusCode === 404 || error.statusCode === 422)
    ) {
      return null
    }
    throw error
  }
}

export async function dispatchGitHubActionsWorkflow(
  workflowId,
  ref,
  inputs = {},
  options = {},
) {
  if (typeof workflowId !== 'string' || workflowId.trim().length === 0) {
    throw new Error('Workflow id must be a non-empty string')
  }
  if (typeof ref !== 'string' || ref.trim().length === 0) {
    throw new Error('Workflow dispatch ref must be a non-empty string')
  }
  if (!isRecord(inputs)) {
    throw new Error('Workflow dispatch inputs must be a JSON object')
  }

  const token = options.token ?? githubTokenFromEnv()
  if (!token) {
    throw new Error(
      'GITHUB_TOKEN or GH_TOKEN is required to dispatch GitHub Actions workflows',
    )
  }

  const apiBaseUrl = options.apiBaseUrl ?? 'https://api.github.com'
  const apiUrl = `${apiBaseUrl}/repos/${githubRepoOwner}/${githubRepoName}/actions/workflows/${encodeURIComponent(
    workflowId,
  )}/dispatches`
  const body = {
    ref,
    ...(Object.keys(inputs).length > 0 ? { inputs } : {}),
  }
  await requestGitHubApi(apiUrl, {
    ...options,
    token,
    method: 'POST',
    body,
  })
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

export async function verifyGitHubActionsRunUrl(
  runUrl,
  expected,
  options = {},
) {
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
