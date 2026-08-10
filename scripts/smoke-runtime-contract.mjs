import {
  buildRuntimeContractFixture,
  runtimeContractFixtureDir,
  verifyRuntimeContractBundle,
} from './runtime-contract-fixture.mjs'
import {
  assertNoGodotScriptLoadErrors,
  assertOfficialGodotExecutable,
  godotCommandArguments,
  installBuiltRuntime,
  resolveGodotCommand,
  runAsync,
} from './smoke-utils.mjs'

const args = new Set(process.argv.slice(2))
const expectMissingRuntime = args.has('--expect-missing-runtime')
const unknownArgs = [...args].filter(
  (argument) => argument !== '--expect-missing-runtime',
)

if (unknownArgs.length > 0) {
  console.error(`Unknown option(s): ${unknownArgs.join(', ')}`)
  process.exit(1)
}

const PASS_MARKER = '[godot-js-runtime-contract] PASS'
const EXIT_MARKER = '[godot-js-runtime-contract] EXIT'

function printResult(result) {
  if (result.stdout) {
    process.stdout.write(result.stdout)
  }
  if (result.stderr) {
    process.stderr.write(result.stderr)
  }
}

function combinedOutput(result) {
  return `${result.stdout ?? ''}\n${result.stderr ?? ''}`
}

async function runSuccessSmoke(godot) {
  const importResult = await runAsync(
    godot,
    godotCommandArguments([
      '--headless',
      '--path',
      runtimeContractFixtureDir,
      '--import',
      '--quit',
    ]),
    { timeout: 60_000 },
  )
  printResult(importResult)
  assertNoGodotScriptLoadErrors(
    combinedOutput(importResult),
    'runtime contract import',
  )

  const result = await runAsync(
    godot,
    ['--headless', '--path', runtimeContractFixtureDir, '--quit-after', '600'],
    {
      env: {
        ...process.env,
        GODOT_JS_RUNTIME_CONTRACT: 'phase-0-baseline',
      },
      timeout: 30_000,
    },
  )
  printResult(result)

  const output = combinedOutput(result)
  assertNoGodotScriptLoadErrors(output, 'runtime contract smoke')
  for (const marker of [PASS_MARKER, EXIT_MARKER]) {
    if (!output.includes(marker)) {
      throw new Error(`Runtime contract smoke did not print marker: ${marker}`)
    }
  }
}

async function runMissingRuntimeSmoke(godot, contract) {
  const result = await runAsync(
    godot,
    ['--headless', '--path', runtimeContractFixtureDir, '--quit-after', '60'],
    { allowFailure: true, timeout: 15_000 },
  )
  printResult(result)

  const output = combinedOutput(result)
  if (output.includes(PASS_MARKER)) {
    throw new Error('Missing-runtime control unexpectedly executed JavaScript')
  }
  if (
    !contract.missingRuntimePatterns.some((pattern) => output.includes(pattern))
  ) {
    throw new Error(
      [
        'Missing-runtime control failed for an unrecognized reason.',
        `Expected one of: ${contract.missingRuntimePatterns.join(', ')}`,
      ].join('\n'),
    )
  }

  console.log('[runtime-contract] missing-runtime failure verified')
}

try {
  buildRuntimeContractFixture()
  const { contract } = verifyRuntimeContractBundle()
  const godot = resolveGodotCommand()

  if (!godot) {
    if (expectMissingRuntime) {
      throw new Error(
        'The missing-runtime control requires GODOT_BIN or a stock Godot executable.',
      )
    }
    console.log(
      '[runtime-contract] skipped runtime launch: set GODOT_BIN to a Godot executable',
    )
    process.exit(0)
  }

  if (expectMissingRuntime) {
    await runMissingRuntimeSmoke(godot, contract)
  } else {
    assertOfficialGodotExecutable(godot)
    installBuiltRuntime(runtimeContractFixtureDir)
    await runSuccessSmoke(godot)
    console.log('[runtime-contract] runtime contract passed')
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
