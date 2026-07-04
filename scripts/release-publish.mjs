import path from 'node:path'
import {
  compareVersions,
  formatCommandFailure,
  isTrustedPublishingEnvironment,
  npmCommand,
  parseNpmJson,
  readJson,
  releasePackageConfigsInPublishOrder,
  repoRoot,
  run,
} from './release-utils.mjs'

const packageConfigs = releasePackageConfigsInPublishOrder()

function usage() {
  console.log(`Usage: npm run release:publish -- [options]

Dry-run is the default and never publishes:
  npm run release:publish

Real publishing is only supported in the GitHub Actions trusted-publishing
environment and requires an explicit confirmation flag:
  npm run release:publish -- --yes

Options:
  --yes              Perform real npm publish commands.
  --tag <tag>        npm dist-tag to publish with. Default: latest.
  --skip-preflight   Skip the real-publish preflight gate.
  --skip-public-smoke
                     Skip post-publish public CLI smoke.
  --help             Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    yes: false,
    tag: 'latest',
    skipPreflight: false,
    skipPublicSmoke: false,
  }

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
    }

    if (arg === '--yes') {
      options.yes = true
      continue
    }

    if (arg === '--skip-preflight') {
      options.skipPreflight = true
      continue
    }

    if (arg === '--skip-public-smoke') {
      options.skipPublicSmoke = true
      continue
    }

    if (arg === '--tag') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--tag requires a value')
      }
      options.tag = value
      continue
    }

    if (arg.startsWith('--tag=')) {
      options.tag = arg.slice('--tag='.length)
      continue
    }

    throw new Error(`Unknown option: ${arg}`)
  }

  return options
}

function runRequired(command, commandArgs, options = {}) {
  const result = run(command, commandArgs, options)
  if (result.status !== 0) {
    throw new Error(formatCommandFailure(command, commandArgs, result))
  }
  return result
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

  throw new Error(
    [
      `Unable to read registry version for ${packageName}`,
      result.stdout,
      result.stderr,
    ]
      .filter(Boolean)
      .join('\n'),
  )
}

function assertCleanWorktree() {
  const result = run('git', ['status', '--porcelain'])
  if (result.status !== 0) {
    throw new Error(`Unable to read git status\n${result.stderr}`)
  }
  if (result.stdout.trim()) {
    throw new Error(
      [
        'Refusing to publish from a dirty working tree.',
        result.stdout.trim(),
      ].join('\n'),
    )
  }
}

function assertTrustedPublishingEnvironment() {
  if (isTrustedPublishingEnvironment()) {
    console.log(
      '[release-publish] GitHub Actions trusted publishing environment detected; npm publish will authenticate with OIDC',
    )
    return
  }

  throw new Error(
    [
      'Refusing to publish outside the GitHub Actions trusted-publishing environment.',
      'Push a v* tag or run the Publish workflow instead.',
    ].join('\n'),
  )
}

function packageCandidates() {
  const candidates = []

  for (const config of packageConfigs) {
    const pkg = readJson(path.join(config.dir, 'package.json'))
    const registryVersion = readRegistryVersion(config.name)

    if (!registryVersion) {
      console.log(
        `[release-publish] ${config.name}@${pkg.version} is not published yet`,
      )
      candidates.push({ ...config, version: pkg.version })
      continue
    }

    const comparison = compareVersions(pkg.version, registryVersion)
    if (comparison < 0) {
      throw new Error(
        `${config.name}: local version ${pkg.version} is older than registry ${registryVersion}`,
      )
    }

    if (comparison > 0) {
      console.log(
        `[release-publish] ${config.name}@${pkg.version} is newer than registry ${registryVersion}`,
      )
      candidates.push({ ...config, version: pkg.version })
      continue
    }

    console.log(
      `[release-publish] ${config.name}@${pkg.version} already matches the registry`,
    )
  }

  return candidates
}

function publishPackage(candidate, options) {
  const args = ['publish', '--access', 'public', '--tag', options.tag]

  if (!options.yes) {
    args.push('--dry-run')
  }

  console.log(
    `[release-publish] ${options.yes ? 'publishing' : 'dry-run'} ${candidate.name}@${candidate.version}`,
  )

  runRequired(npmCommand, args, {
    cwd: path.join(repoRoot, candidate.dir),
    stdio: 'inherit',
  })
}

function runPreflight() {
  console.log('[release-publish] running release preflight')
  runRequired(npmCommand, ['run', 'release:preflight'], {
    stdio: 'inherit',
  })
}

function runPublicSmoke(cliVersion) {
  console.log('[release-publish] running public CLI smoke')
  runRequired(npmCommand, ['run', 'smoke:public-cli'], {
    env: {
      ...process.env,
      VUE_GODOT_PUBLIC_CLI_SPEC: `@vue-godot/cli@${cliVersion}`,
    },
    stdio: 'inherit',
  })
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const dryRun = !options.yes

  if (dryRun) {
    console.log('[release-publish] dry-run mode; pass --yes to publish')
  } else {
    assertTrustedPublishingEnvironment()
    assertCleanWorktree()
    if (!options.skipPreflight) {
      runPreflight()
    }
  }

  const candidates = packageCandidates()
  if (candidates.length === 0) {
    console.log('[release-publish] nothing to publish')
    return
  }

  for (const candidate of candidates) {
    publishPackage(candidate, options)
  }

  if (dryRun) {
    console.log(
      '[release-publish] dry-run passed; push a v* tag or run the Publish workflow to publish',
    )
    return
  }

  if (!options.skipPublicSmoke) {
    const cli = readJson('packages/cli/package.json')
    runPublicSmoke(cli.version)
  }

  console.log('[release-publish] publish flow complete')
}

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
