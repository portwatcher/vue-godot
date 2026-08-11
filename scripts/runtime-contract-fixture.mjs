import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { nodeCommand, repoRoot, run } from './smoke-utils.mjs'

const scriptPath = fileURLToPath(import.meta.url)

export const runtimeContractFixtureDir = path.join(
  repoRoot,
  'test/fixtures/godot-js-runtime-contract',
)

const outputContractPath = path.join(
  runtimeContractFixtureDir,
  'output-contract.json',
)
const tscPath = path.join(repoRoot, 'node_modules/typescript/bin/tsc')
const vitePath = path.join(repoRoot, 'node_modules/vite/bin/vite.js')

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function normalizePath(filePath) {
  return filePath.split(path.sep).join('/')
}

function listFiles(directory) {
  const files = []

  function visit(currentDirectory) {
    for (const entry of fs.readdirSync(currentDirectory, {
      withFileTypes: true,
    })) {
      const entryPath = path.join(currentDirectory, entry.name)
      if (entry.isDirectory()) {
        visit(entryPath)
      } else if (entry.isFile()) {
        files.push(normalizePath(path.relative(directory, entryPath)))
      }
    }
  }

  visit(directory)
  return files.sort()
}

export function buildRuntimeContractFixture() {
  run(nodeCommand, [
    tscPath,
    '-p',
    path.join(runtimeContractFixtureDir, 'tsconfig.json'),
  ], { stdio: 'inherit' })
  run(nodeCommand, [
    vitePath,
    'build',
    '--config',
    path.join(runtimeContractFixtureDir, 'tooling/vite.config.ts'),
  ], { stdio: 'inherit' })
}

export function verifyRuntimeContractBundle() {
  const contract = readJson(outputContractPath)
  const distDir = path.join(runtimeContractFixtureDir, 'dist')
  const files = listFiles(distDir)

  for (const requiredFile of contract.requiredFiles) {
    if (!files.includes(requiredFile)) {
      throw new Error(
        `Runtime contract bundle is missing required file: ${requiredFile}`,
      )
    }
  }

  for (const patternSource of contract.forbiddenFilePatterns) {
    const pattern = new RegExp(patternSource)
    const invalidFile = files.find((filePath) => pattern.test(filePath))
    if (invalidFile) {
      throw new Error(
        `Runtime contract bundle contains forbidden file ${invalidFile} matching ${pattern}`,
      )
    }
  }

  const entrySource = fs.readFileSync(
    path.join(distDir, contract.entryFile),
    'utf-8',
  )
  for (const entryPattern of contract.entryPatterns) {
    const pattern = new RegExp(entryPattern.source)
    if (!pattern.test(entrySource)) {
      throw new Error(
        `Runtime contract entry is missing ${entryPattern.description}: ${pattern}`,
      )
    }
  }

  return { contract, files }
}

function runCli() {
  const args = new Set(process.argv.slice(2))
  if (!args.has('--build')) {
    throw new Error('Usage: node scripts/runtime-contract-fixture.mjs --build')
  }

  buildRuntimeContractFixture()
  const { files } = verifyRuntimeContractBundle()
  console.log(
    `[runtime-contract] CommonJS bundle verified (${files.join(', ')})`,
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    runCli()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}
