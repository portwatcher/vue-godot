import path from 'node:path'
import {
  compareVersions,
  formatCommandFailure,
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

Real publishing requires an explicit confirmation flag:
  npm run release:publish -- --yes [--otp <code>]

Options:
  --yes              Perform real npm publish commands.
  --tag <tag>        npm dist-tag to publish with. Default: latest.
  --otp <code>       npm one-time password for accounts requiring 2FA.
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
    otp: null,
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

    if (arg === '--otp') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--otp requires a value')
      }
      options.otp = value
      continue
    }

    if (arg.startsWith('--otp=')) {
      options.otp = arg.slice('--otp='.length)
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
    [`Unable to read registry version for ${packageName}`, result.stdout, result.stderr]
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

function assertNpmAuth() {
  const result = run(npmCommand, ['whoami'])
  if (result.status !== 0) {
    throw new Error(
      [
        'npm authentication is required for real publishing.',
        result.stderr.trim(),
      ]
        .filter(Boolean)
        .join('\n'),
    )
  }
  console.log(`[release-publish] npm user: ${result.stdout.trim()}`)
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
  const args = [
    'publish',
    '--access',
    'public',
    '--tag',
    options.tag,
  ]

  if (!options.yes) {
    args.push('--dry-run')
  }

  if (options.otp) {
    args.push('--otp', options.otp)
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

const options = parseArgs(process.argv.slice(2))
const dryRun = !options.yes

if (dryRun) {
  console.log('[release-publish] dry-run mode; pass --yes to publish')
} else {
  assertCleanWorktree()
  assertNpmAuth()
  if (!options.skipPreflight) {
    runPreflight()
  }
}

const candidates = packageCandidates()
if (candidates.length === 0) {
  console.log('[release-publish] nothing to publish')
  process.exit(0)
}

for (const candidate of candidates) {
  publishPackage(candidate, options)
}

if (dryRun) {
  console.log(
    '[release-publish] dry-run passed; rerun with --yes after release:preflight and npm auth are ready',
  )
  process.exit(0)
}

if (!options.skipPublicSmoke) {
  const cli = readJson('packages/cli/package.json')
  runPublicSmoke(cli.version)
}

console.log('[release-publish] publish flow complete')
