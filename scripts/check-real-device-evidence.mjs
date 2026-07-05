import path from 'node:path'
import {
  describeRealDeviceEvidencePath,
  readRealDeviceEvidence,
  resolveRealDeviceEvidencePath,
  validateRealDeviceEvidence,
} from './real-device-evidence.mjs'
import { repoRoot } from './release-utils.mjs'

function usage() {
  console.log(`Usage: node scripts/check-real-device-evidence.mjs [options]

Options:
  --path <file>       Read evidence from a specific JSON file.
  --expected-commit <sha>
                      Require evidence.commit to match the given commit.
  --optional          Treat a missing evidence file as a warning.
  --help              Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    evidencePath: null,
    expectedCommit: null,
    optional: false,
  }

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
    }

    if (arg === '--optional') {
      options.optional = true
      continue
    }

    if (arg === '--path') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--path requires a value')
      }
      options.evidencePath = path.resolve(repoRoot, value)
      continue
    }

    if (arg.startsWith('--path=')) {
      options.evidencePath = path.resolve(repoRoot, arg.slice('--path='.length))
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

    throw new Error(`Unknown option: ${arg}`)
  }

  return options
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const evidencePath = options.evidencePath ?? resolveRealDeviceEvidencePath()
  const { evidence, errors: readErrors } = readRealDeviceEvidence(evidencePath)

  if (!evidence) {
    const message = readErrors.join('\n')
    if (options.optional) {
      console.warn(`[real-device-evidence] warning: ${message}`)
      return
    }
    throw new Error(message)
  }

  const errors = validateRealDeviceEvidence(evidence, {
    expectedCommit: options.expectedCommit,
  })

  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }

  console.log(
    `[real-device-evidence] passed ${describeRealDeviceEvidencePath(evidencePath)}`,
  )
}

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
