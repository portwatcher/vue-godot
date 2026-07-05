import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  compareVersions,
  currentReleasePackageVersions,
  expectedRange,
  formatCommandFailure,
  isTrustedPublishingEnvironment,
  npmCommand,
  parseNpmJson as parseNpmJsonStrict,
  readJson,
  releasePackageConfigs as packageConfigs,
  repoRoot,
  run,
} from './release-utils.mjs'
import {
  describeRealDeviceEvidencePath,
  readRealDeviceEvidence,
  realDeviceEvidenceEnvVar,
  resolveRealDeviceEvidencePath,
  validateRealDeviceEvidence,
  verifyRealDeviceEvidenceRuns,
} from './real-device-evidence.mjs'

function usage() {
  console.log(`Usage: node scripts/release-preflight.mjs [options]

Options:
  --local                         Treat release-environment blockers as warnings.
  --skip-check                    Skip npm run check.
  --skip-godot                    Skip Godot smoke checks.
  --skip-serious-examples         Skip serious example app readiness checks.
  --expected-commit <sha>         Tested release commit. Default: current HEAD.
  --summary-output <file>         Write machine-readable preflight summary JSON.
  --help                          Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    localOnly: false,
    skipCheck: false,
    skipGodot: false,
    skipSeriousExamples: false,
    expectedCommit: null,
    summaryOutput: null,
  }

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
    }
    if (arg === '--local') {
      options.localOnly = true
      continue
    }
    if (arg === '--skip-check') {
      options.skipCheck = true
      continue
    }
    if (arg === '--skip-godot') {
      options.skipGodot = true
      continue
    }
    if (arg === '--skip-serious-examples') {
      options.skipSeriousExamples = true
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

const options = parseArgs(process.argv.slice(2))
const localOnly = options.localOnly
const skipCheck = options.skipCheck
const skipGodot = options.skipGodot
const skipSeriousExamples = options.skipSeriousExamples
let cachedExpectedCommit = null

const failures = []
const warnings = []

function logStep(title) {
  console.log(`\n[release-preflight] ${title}`)
}

function runRequired(command, commandArgs, options = {}) {
  const result = run(command, commandArgs, options)
  if (result.status !== 0) {
    failures.push(formatCommandFailure(command, commandArgs, result))
  }
  return result
}

function assertEqual(label, actual, expected) {
  if (actual !== expected) {
    failures.push(`${label}: expected ${expected}, found ${actual}`)
  }
}

function checkPackageMetadata(packagesByName) {
  logStep('checking package metadata')

  for (const config of packageConfigs) {
    const pkg = packagesByName.get(config.name)
    if (!pkg) {
      failures.push(`Missing local package metadata for ${config.name}`)
      continue
    }

    assertEqual(
      `${config.name} publishConfig.access`,
      pkg.publishConfig?.access,
      'public',
    )

    if (!Array.isArray(pkg.files) || !pkg.files.includes('dist')) {
      failures.push(`${config.name} package.json must include "dist" in files`)
    }

    if (!String(pkg.main ?? '').startsWith('./dist/')) {
      failures.push(`${config.name} main must point at ./dist`)
    }
    if (!String(pkg.types ?? '').startsWith('./dist/')) {
      failures.push(`${config.name} types must point at ./dist`)
    }
  }

  const browser = packagesByName.get('@vue-godot/browser')
  const device = packagesByName.get('@vue-godot/device')
  const html = packagesByName.get('@vue-godot/html')
  const runtime = packagesByName.get('@vue-godot/runtime-tscn')
  const cli = packagesByName.get('@vue-godot/cli')

  if (html && browser) {
    assertEqual(
      '@vue-godot/html dependency @vue-godot/browser',
      html.dependencies?.['@vue-godot/browser'],
      expectedRange(browser.version),
    )
  }
  if (browser && device) {
    assertEqual(
      '@vue-godot/browser dependency @vue-godot/device',
      browser.dependencies?.['@vue-godot/device'],
      expectedRange(device.version),
    )
  }
  if (html && runtime) {
    assertEqual(
      '@vue-godot/html peer dependency @vue-godot/runtime-tscn',
      html.peerDependencies?.['@vue-godot/runtime-tscn'],
      '>=0.0.1',
    )
  }

  if (cli && runtime && browser && device && html) {
    console.log(
      `[release-preflight] local versions: cli ${cli.version}, runtime ${runtime.version}, browser ${browser.version}, device ${device.version}, html ${html.version}`,
    )
  }
}

async function checkGeneratedPackageSpecs(packagesByName) {
  logStep('checking CLI-generated package specs')

  const integratePath = path.join(repoRoot, 'packages/cli/dist/integrate.js')
  if (!fs.existsSync(integratePath)) {
    failures.push(
      'packages/cli/dist/integrate.js not found; run npm run build first',
    )
    return
  }

  const integrate = await import(pathToFileURL(integratePath).href)
  const generated = integrate.newPackageJson('release-preflight', true)
  const deps = generated.dependencies ?? {}
  const devDeps = generated.devDependencies ?? {}

  for (const packageName of [
    '@vue-godot/browser',
    '@vue-godot/device',
    '@vue-godot/html',
    '@vue-godot/runtime-tscn',
  ]) {
    const pkg = packagesByName.get(packageName)
    if (pkg) {
      assertEqual(
        `generated dependency ${packageName}`,
        deps[packageName],
        expectedRange(pkg.version),
      )
    }
  }

  const cli = packagesByName.get('@vue-godot/cli')
  if (cli) {
    assertEqual(
      'generated devDependency @vue-godot/cli',
      devDeps['@vue-godot/cli'],
      expectedRange(cli.version),
    )
  }
}

function parseNpmJson(stdout, label) {
  try {
    return parseNpmJsonStrict(stdout, label)
  } catch (error) {
    failures.push(error instanceof Error ? error.message : String(error))
    return null
  }
}

function collectPackageExportFiles(exportsField) {
  const files = new Set()

  function visit(value) {
    if (typeof value === 'string') {
      if (value.startsWith('./')) {
        files.add(value.slice(2))
      }
      return
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        visit(entry)
      }
      return
    }

    if (value != null && typeof value === 'object') {
      for (const entry of Object.values(value)) {
        visit(entry)
      }
    }
  }

  visit(exportsField)
  return [...files].sort()
}

function checkPackDryRun() {
  logStep('checking npm pack dry-run contents')

  for (const config of packageConfigs) {
    const packageDir = path.join(repoRoot, config.dir)
    const packageJson = readJson(path.join(config.dir, 'package.json'))
    const result = runRequired(npmCommand, ['pack', '--dry-run', '--json'], {
      cwd: packageDir,
    })
    if (result.status !== 0) continue

    const parsed = parseNpmJson(result.stdout, `${config.name} npm pack`)
    const pack = Array.isArray(parsed) ? parsed[0] : null
    if (!pack) {
      failures.push(
        `${config.name}: npm pack JSON did not include package data`,
      )
      continue
    }

    const files = new Set((pack.files ?? []).map((entry) => entry.path))
    const expectedFiles = new Set([
      ...config.expectedFiles,
      ...collectPackageExportFiles(packageJson.exports),
    ])
    for (const expectedFile of expectedFiles) {
      if (!files.has(expectedFile)) {
        failures.push(`${config.name}: package tarball missing ${expectedFile}`)
      }
    }

    console.log(
      `[release-preflight] ${config.name} dry-run tarball ${pack.filename} includes ${files.size} files`,
    )
  }
}

function readRegistryVersion(packageName) {
  const result = run(npmCommand, ['view', packageName, 'version', '--json'])
  if (result.status === 0) {
    const parsed = parseNpmJson(result.stdout, `${packageName} npm view`)
    return typeof parsed === 'string' ? parsed : null
  }

  if (
    result.stderr.includes('E404') ||
    result.stdout.includes('"code": "E404"')
  ) {
    return null
  }

  failures.push(
    [
      `Unable to read registry version for ${packageName}`,
      result.stdout,
      result.stderr,
    ]
      .filter(Boolean)
      .join('\n'),
  )
  return null
}

function checkRegistry(packagesByName) {
  logStep('checking npm registry state')

  let publishNeeded = false

  for (const config of packageConfigs) {
    const pkg = packagesByName.get(config.name)
    if (!pkg) continue

    const registryVersion = readRegistryVersion(config.name)
    if (!registryVersion) {
      publishNeeded = true
      console.log(
        `[release-preflight] ${config.name}@${pkg.version} is not published yet`,
      )
      continue
    }

    const comparison = compareVersions(pkg.version, registryVersion)
    if (comparison < 0) {
      failures.push(
        `${config.name}: local version ${pkg.version} is older than registry ${registryVersion}`,
      )
    } else if (comparison > 0) {
      publishNeeded = true
      console.log(
        `[release-preflight] ${config.name}@${pkg.version} is newer than registry ${registryVersion}`,
      )
    } else {
      console.log(
        `[release-preflight] ${config.name}@${pkg.version} already matches the registry`,
      )
    }
  }

  return publishNeeded
}

function checkPublishEnvironment(publishNeeded) {
  logStep('checking publish environment')

  if (isTrustedPublishingEnvironment()) {
    console.log(
      '[release-preflight] GitHub Actions trusted publishing environment detected; npm publish will authenticate with OIDC',
    )
    return
  }

  if (!publishNeeded) {
    console.log(
      '[release-preflight] no packages need publishing; trusted publishing is not required',
    )
    return
  }

  const message =
    'Packages are missing from or newer than the registry; publishing must run through the GitHub Actions Publish workflow with npm trusted publishing.'

  if (!localOnly) {
    failures.push(message)
  } else {
    warnings.push(message)
  }
}

function checkGodotSmoke() {
  if (skipGodot) {
    const message = 'Godot smoke skipped by --skip-godot'
    if (localOnly) {
      warnings.push(message)
    } else {
      failures.push(message)
    }
    return
  }

  logStep('checking Godot smoke')

  const result = run(npmCommand, ['run', 'smoke:godot'])
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`
  process.stdout.write(result.stdout ?? '')
  process.stderr.write(result.stderr ?? '')

  if (result.status !== 0) {
    failures.push(`npm run smoke:godot failed\n${output}`)
    return
  }

  if (output.includes('[smoke-godot] skipped:')) {
    const message =
      'Godot smoke skipped; set GODOT_BIN or install godot/godot4.'
    if (localOnly) {
      warnings.push(message)
    } else {
      failures.push(message)
    }
    return
  }

  for (const marker of [
    '[smoke-godot] html-demo lifecycle smoke passed',
    '[smoke-godot] native-app-demo smoke passed',
    '[smoke-godot] game-ui-demo smoke passed',
  ]) {
    if (!output.includes(marker)) {
      failures.push(`Godot smoke completed without marker: ${marker}`)
    }
  }

  const generatedResult = run(npmCommand, ['run', 'smoke:generated-godot'])
  const generatedOutput = `${generatedResult.stdout ?? ''}\n${generatedResult.stderr ?? ''}`
  process.stdout.write(generatedResult.stdout ?? '')
  process.stderr.write(generatedResult.stderr ?? '')

  if (generatedResult.status !== 0) {
    failures.push(`npm run smoke:generated-godot failed\n${generatedOutput}`)
    return
  }

  if (generatedOutput.includes('[smoke-generated-godot] skipped:')) {
    const message =
      'Generated Godot smoke skipped; set GODOT_BIN or install godot/godot4.'
    if (localOnly) {
      warnings.push(message)
    } else {
      failures.push(message)
    }
    return
  }

  if (
    !generatedOutput.includes(
      '[smoke-generated-godot] generated HTML app Godot smoke passed',
    )
  ) {
    failures.push('Generated Godot smoke completed without the pass marker')
  }

  const editorResult = run(npmCommand, ['run', 'smoke:editor-reload'])
  const editorOutput = `${editorResult.stdout ?? ''}\n${editorResult.stderr ?? ''}`
  process.stdout.write(editorResult.stdout ?? '')
  process.stderr.write(editorResult.stderr ?? '')

  if (editorResult.status !== 0) {
    failures.push(`npm run smoke:editor-reload failed\n${editorOutput}`)
    return
  }

  if (editorOutput.includes('[smoke-editor-reload] skipped:')) {
    const message =
      'Editor reload smoke skipped; set GODOT_BIN or install godot/godot4.'
    if (localOnly) {
      warnings.push(message)
    } else {
      failures.push(message)
    }
    return
  }

  if (
    !editorOutput.includes(
      '[smoke-editor-reload] generated HTML app editor reload smoke passed',
    )
  ) {
    failures.push('Editor reload smoke completed without the pass marker')
  }
}

function checkSeriousExampleApps() {
  if (skipSeriousExamples) {
    const message =
      'Serious example app check skipped by --skip-serious-examples'
    if (localOnly) {
      warnings.push(message)
    } else {
      failures.push(message)
    }
    return
  }

  logStep('checking serious example apps')

  const result = run(npmCommand, ['run', 'check:serious-examples'])
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`
  process.stdout.write(result.stdout ?? '')
  process.stderr.write(result.stderr ?? '')

  if (result.status === 0) {
    return
  }

  if (localOnly) {
    warnings.push(
      'Serious example app check failed; run npm run check:serious-examples for details.',
    )
  } else {
    failures.push(`Serious example app check failed\n${output}`)
  }
}

function checkDependencyAudit() {
  logStep('checking dependency audit')
  runRequired(npmCommand, ['audit', '--audit-level=moderate'], {
    stdio: 'inherit',
  })
}

function readCurrentCommit() {
  const result = run('git', ['rev-parse', 'HEAD'])
  if (result.status !== 0) {
    failures.push(`Unable to read current git commit\n${result.stderr}`)
    return null
  }
  return result.stdout.trim()
}

function expectedReleaseCommit() {
  if (cachedExpectedCommit !== null) {
    return cachedExpectedCommit
  }
  cachedExpectedCommit = options.expectedCommit ?? readCurrentCommit()
  return cachedExpectedCommit
}

function recordRealDeviceEvidenceIssue(message) {
  if (localOnly) {
    warnings.push(message)
  } else {
    failures.push(message)
  }
}

async function checkRealDeviceEvidence() {
  logStep('checking real device evidence')

  const evidencePath = resolveRealDeviceEvidencePath(process.env)
  const relativePath = describeRealDeviceEvidencePath(evidencePath)
  const { evidence, errors: readErrors } = readRealDeviceEvidence(evidencePath)

  if (!evidence) {
    recordRealDeviceEvidenceIssue(
      [
        `Real device evidence missing at ${relativePath}.`,
        `Create release/real-device-evidence.json or set ${realDeviceEvidenceEnvVar}=path/to/evidence.json after completing docs/real-device-release.md.`,
        readErrors.join('\n'),
      ]
        .filter(Boolean)
        .join('\n'),
    )
    return
  }

  const currentCommit = expectedReleaseCommit()
  const errors = validateRealDeviceEvidence(evidence, {
    expectedCommit: currentCommit ?? undefined,
    expectedPackageVersions: currentReleasePackageVersions(),
    requireProductionProfile: true,
  })

  if (errors.length > 0) {
    recordRealDeviceEvidenceIssue(
      [`Real device evidence is incomplete: ${relativePath}`, ...errors].join(
        '\n',
      ),
    )
    return
  }

  const runErrors = await verifyRealDeviceEvidenceRuns(evidence)
  if (runErrors.length > 0) {
    recordRealDeviceEvidenceIssue(
      [
        `Real device CI run evidence could not be verified: ${relativePath}`,
        ...runErrors,
      ].join('\n'),
    )
    return
  }

  console.log(
    `[release-preflight] real device evidence passed: ${relativePath}`,
  )
}

function buildPreflightSummary() {
  return {
    commit: expectedReleaseCommit(),
    localOnly,
    skipCheck,
    skipGodot,
    skipSeriousExamples,
    warningCount: warnings.length,
    failureCount: failures.length,
    warnings: [...warnings],
    failures: [...failures],
  }
}

function writePreflightSummary() {
  if (!options.summaryOutput) {
    return
  }

  const resolved = path.resolve(repoRoot, options.summaryOutput)
  fs.mkdirSync(path.dirname(resolved), { recursive: true })
  fs.writeFileSync(
    resolved,
    `${JSON.stringify(buildPreflightSummary(), null, 2)}\n`,
  )
  console.log(
    `[release-preflight] wrote ${path.relative(repoRoot, resolved)}`,
  )
}

function printSummary() {
  try {
    writePreflightSummary()
  } catch (error) {
    failures.push(
      `Unable to write release preflight summary: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }

  if (warnings.length > 0) {
    console.log('\n[release-preflight] warnings')
    for (const warning of warnings) {
      console.log(`- ${warning}`)
    }
  }

  if (failures.length > 0) {
    console.error('\n[release-preflight] failures')
    for (const failure of failures) {
      console.error(`- ${failure}`)
    }
    process.exit(1)
  }

  console.log('\n[release-preflight] passed')
}

async function main() {
  const packagesByName = new Map(
    packageConfigs.map((config) => [
      config.name,
      readJson(path.join(config.dir, 'package.json')),
    ]),
  )

  if (!skipCheck) {
    logStep('running local quality gate')
    runRequired(npmCommand, ['run', 'check'], { stdio: 'inherit' })
  }

  checkPackageMetadata(packagesByName)
  await checkGeneratedPackageSpecs(packagesByName)
  checkPackDryRun()
  const publishNeeded = checkRegistry(packagesByName)
  checkPublishEnvironment(publishNeeded)
  checkDependencyAudit()
  checkSeriousExampleApps()
  checkGodotSmoke()
  await checkRealDeviceEvidence()
  printSummary()
}

await main()
