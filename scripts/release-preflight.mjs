import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(__filename), '..')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const args = new Set(process.argv.slice(2))
const localOnly = args.has('--local')
const skipCheck = args.has('--skip-check')
const skipGodot = args.has('--skip-godot')

const packageConfigs = [
  {
    name: '@vue-godot/runtime-tscn',
    dir: 'packages/runtime-tscn',
    expectedFiles: ['dist/index.js', 'dist/index.d.ts'],
  },
  {
    name: '@vue-godot/cli',
    dir: 'packages/cli',
    expectedFiles: [
      'dist/index.js',
      'dist/index.d.ts',
      'dist/cli.js',
      'templates/vue/vite.config.ts',
      'templates/godot/project.godot',
    ],
  },
  {
    name: '@vue-godot/browser',
    dir: 'packages/browser',
    expectedFiles: ['dist/index.js', 'dist/index.d.ts'],
  },
  {
    name: '@vue-godot/html',
    dir: 'packages/html',
    expectedFiles: ['dist/index.js', 'dist/index.d.ts'],
  },
]

const failures = []
const warnings = []

function logStep(title) {
  console.log(`\n[release-preflight] ${title}`)
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf-8'))
}

function run(command, commandArgs, options = {}) {
  return spawnSync(command, commandArgs, {
    cwd: options.cwd ?? repoRoot,
    env: options.env ?? process.env,
    encoding: 'utf-8',
    stdio: options.stdio ?? 'pipe',
  })
}

function runRequired(command, commandArgs, options = {}) {
  const result = run(command, commandArgs, options)
  if (result.status !== 0) {
    const rendered = [command, ...commandArgs].join(' ')
    failures.push(
      [
        `Command failed (${result.status ?? result.signal ?? 'unknown'}): ${rendered}`,
        result.stdout,
        result.stderr,
      ]
        .filter(Boolean)
        .join('\n'),
    )
  }
  return result
}

function compareVersions(left, right) {
  const leftParts = left.split('.').map((part) => Number(part))
  const rightParts = right.split('.').map((part) => Number(part))
  for (let index = 0; index < Math.max(leftParts.length, rightParts.length); index++) {
    const leftValue = leftParts[index] ?? 0
    const rightValue = rightParts[index] ?? 0
    if (leftValue > rightValue) return 1
    if (leftValue < rightValue) return -1
  }
  return 0
}

function expectedRange(version) {
  return `^${version}`
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

    assertEqual(`${config.name} publishConfig.access`, pkg.publishConfig?.access, 'public')

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
  if (html && runtime) {
    assertEqual(
      '@vue-godot/html peer dependency @vue-godot/runtime-tscn',
      html.peerDependencies?.['@vue-godot/runtime-tscn'],
      '>=0.0.1',
    )
  }

  if (cli && runtime && browser && html) {
    console.log(
      `[release-preflight] local versions: cli ${cli.version}, runtime ${runtime.version}, browser ${browser.version}, html ${html.version}`,
    )
  }
}

async function checkGeneratedPackageSpecs(packagesByName) {
  logStep('checking CLI-generated package specs')

  const integratePath = path.join(repoRoot, 'packages/cli/dist/integrate.js')
  if (!fs.existsSync(integratePath)) {
    failures.push('packages/cli/dist/integrate.js not found; run npm run build first')
    return
  }

  const integrate = await import(pathToFileURL(integratePath).href)
  const generated = integrate.newPackageJson('release-preflight', true)
  const deps = generated.dependencies ?? {}
  const devDeps = generated.devDependencies ?? {}

  for (const packageName of [
    '@vue-godot/browser',
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
    return JSON.parse(stdout)
  } catch {
    failures.push(`${label}: npm did not return valid JSON\n${stdout}`)
    return null
  }
}

function checkPackDryRun() {
  logStep('checking npm pack dry-run contents')

  for (const config of packageConfigs) {
    const packageDir = path.join(repoRoot, config.dir)
    const result = runRequired(npmCommand, ['pack', '--dry-run', '--json'], {
      cwd: packageDir,
    })
    if (result.status !== 0) continue

    const parsed = parseNpmJson(result.stdout, `${config.name} npm pack`)
    const pack = Array.isArray(parsed) ? parsed[0] : null
    if (!pack) {
      failures.push(`${config.name}: npm pack JSON did not include package data`)
      continue
    }

    const files = new Set((pack.files ?? []).map((entry) => entry.path))
    for (const expectedFile of config.expectedFiles) {
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

  if (result.stderr.includes('E404') || result.stdout.includes('"code": "E404"')) {
    return null
  }

  failures.push(
    [`Unable to read registry version for ${packageName}`, result.stdout, result.stderr]
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

function checkNpmAuth(publishNeeded) {
  logStep('checking npm auth')

  const result = run(npmCommand, ['whoami'])
  if (result.status === 0) {
    console.log(`[release-preflight] npm user: ${result.stdout.trim()}`)
    return
  }

  const message = [
    'npm authentication is required before publishing packages that are missing or newer than the registry.',
    result.stderr.trim(),
  ]
    .filter(Boolean)
    .join('\n')

  if (publishNeeded && !localOnly) {
    failures.push(message)
  } else {
    warnings.push(message)
  }
}

function checkGodotSmoke() {
  if (skipGodot) {
    warnings.push('Godot smoke skipped by --skip-godot')
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
    const message = 'Godot smoke skipped; set GODOT_BIN or install godot/godot4.'
    if (localOnly) {
      warnings.push(message)
    } else {
      failures.push(message)
    }
    return
  }

  if (!output.includes('[smoke-godot] html-demo lifecycle smoke passed')) {
    failures.push('Godot smoke completed without the lifecycle pass marker')
  }
}

function printSummary() {
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
  checkNpmAuth(publishNeeded)
  checkGodotSmoke()
  printSummary()
}

await main()
