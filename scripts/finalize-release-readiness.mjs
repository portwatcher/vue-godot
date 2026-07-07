import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  collectWarningMarkerHits,
  finalTodoEvidenceRequirements,
} from './release-readiness.mjs'
import { isRecord } from './release-evidence-utils.mjs'
import { finalizationFiles } from './release-finalization-files.mjs'
import { repoRoot, run } from './release-utils.mjs'

const defaultSummaryPath = 'release/release-readiness-summary.json'

const evidenceProofsRequiredBeforeFinalization = [
  'androidRealDeviceEvidenceReady',
  'checkCiEvidenceReady',
  'ciEvidenceReady',
  'godotSmokeCiEvidenceReady',
  'iosRealDeviceEvidenceReady',
  'realDeviceEvidenceReady',
  'releaseReadinessEvidenceReady',
]

const requiredReadyChecks = [
  'androidRealDeviceEvidence',
  'checkedFinalTodosBackedByEvidence',
  'cleanWorktree',
  'finalTodoStructure',
  'iosRealDeviceEvidence',
  'packageDescriptionWarningsRemoved',
  'publicSurface',
  'realDeviceEvidence',
  'realDeviceEvidenceMetadata',
  'releaseReadinessEvidence',
  'releaseTooling',
  'releaseWorkflows',
  'strictCiEvidence',
]

const textReplacements = [
  {
    label: 'TODO readiness status wording',
    file: 'TODO.md',
    before: [
      '- The project is not yet production ready because Release Preflight evidence,',
      '  final public support-claim docs, and public warning wording removal are still',
      '  incomplete.',
    ].join('\n'),
    after: [
      '- Release Preflight evidence, final public support-claim docs, and public',
      '  warning wording removal are complete for the production readiness gate.',
    ].join('\n'),
  },
  {
    label: 'root README experimental warning',
    file: 'README.md',
    before:
      'This project is experimental and not production ready yet. Follow [@juryxiong](https://x.com/juryxiong) for updates.\n\n',
    after: '',
  },
  {
    label: 'root README example coverage wording',
    file: 'README.md',
    before: [
      'Production-readiness examples are tracked by the',
      '[example app criteria](./docs/example-apps.md) before the project can remove',
      'preview/experimental language.',
    ].join('\n'),
    after: [
      'Example app coverage is tracked by the',
      '[example app criteria](./docs/example-apps.md).',
    ].join('\n'),
  },
  {
    label: 'root README final support wording',
    file: 'README.md',
    before: 'before experimental/not-production-ready text is removed.',
    after: 'before the final support claim is published.',
  },
  {
    label: 'compatibility experimental qualifier',
    file: 'docs/compatibility.md',
    before: [
      'This is the source of truth for Vue Godot API and component compatibility. The',
      'project is still experimental; a `supported` entry means the listed subset is',
      'implemented and tested, not that the full browser, DOM, or native platform spec',
      'is complete.',
    ].join('\n'),
    after: [
      'This is the source of truth for Vue Godot API and component compatibility. A',
      '`supported` entry means the listed subset is implemented and tested, not that',
      'the full browser, DOM, or native platform spec is complete.',
    ].join('\n'),
  },
  {
    label: 'production guide experimental intro',
    file: 'docs/production.md',
    before: [
      'Vue Godot is still experimental. Use this guide as the release checklist for',
      'apps built on the current packages and for future package release candidates.',
    ].join('\n'),
    after: [
      'Use this guide as the release checklist for apps built on the current packages',
      'and for future package release candidates.',
    ].join('\n'),
  },
  {
    label: 'production guide gate intro',
    file: 'docs/production.md',
    before: [
      'Before removing experimental/not-production-ready language, the repository still',
      'needs:',
    ].join('\n'),
    after: 'For production release candidates, keep these gates green:',
  },
  {
    label: 'production guide preview qualifier',
    file: 'docs/production.md',
    before: [
      'Until those are complete, treat release builds as preview/alpha-quality and',
      'document app-specific risk explicitly.',
    ].join('\n'),
    after:
      'Keep release records explicit about the evidence used for each candidate.',
  },
  {
    label: 'real-device release preview qualifier',
    file: 'docs/real-device-release.md',
    before:
      'the repository remains preview-quality for those device capabilities.',
    after:
      'the release record remains incomplete for those device capabilities.',
  },
]

function usage() {
  console.log(`Usage: node scripts/finalize-release-readiness.mjs [options]

Applies the final TODO checkboxes and public warning wording removal after a
strict release-readiness summary proves the evidence-backed final TODO proof
status is ready. Generate the summary without --allow-open, preferably outside
the repo, using the pushed release-candidate SHA when evidence was committed in
a follow-up commit:

  npm run release:readiness -- --summary-output /tmp/vue-godot-readiness.json --expected-commit <release-candidate-sha>
  npm run release:finalize-readiness -- --summary /tmp/vue-godot-readiness.json
  npm run check
  git add ${finalizationFiles.join(' ')}
  git commit -m "Finalize production readiness"
  npm run release:readiness -- --expected-commit <release-candidate-sha>

Options:
  --summary <file>    Strict release-readiness summary JSON.
                      Default: ${defaultSummaryPath}
  --dry-run           Validate and print changed files without writing.
  --help              Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    dryRun: false,
    summaryPath: defaultSummaryPath,
  }

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
    }

    if (arg === '--dry-run') {
      options.dryRun = true
      continue
    }

    if (arg === '--summary') {
      const value = argv[++index]
      if (!value) {
        throw new Error('--summary requires a value')
      }
      options.summaryPath = value
      continue
    }

    if (arg.startsWith('--summary=')) {
      options.summaryPath = arg.slice('--summary='.length)
      continue
    }

    throw new Error(`Unknown option: ${arg}`)
  }

  return options
}

function readJson(filePath) {
  const resolved = path.resolve(repoRoot, filePath)
  return JSON.parse(fs.readFileSync(resolved, 'utf-8'))
}

function statusByProof(summary) {
  const statuses = Array.isArray(summary.finalTodoRequirements)
    ? summary.finalTodoRequirements
    : []
  return new Map(
    statuses
      .filter((status) => isRecord(status) && typeof status.proof === 'string')
      .map((status) => [status.proof, status]),
  )
}

function expectedTodoBlockers(summary) {
  const statuses = Array.isArray(summary.finalTodoRequirements)
    ? summary.finalTodoRequirements
    : []

  return new Set(
    statuses.flatMap((status) => {
      if (
        !isRecord(status) ||
        status.checked === true ||
        typeof status.file !== 'string' ||
        typeof status.line !== 'number' ||
        typeof status.text !== 'string'
      ) {
        return []
      }

      return [`${status.file}:${status.line} ${status.text}`]
    }),
  )
}

export function validateFinalizationSummary(summary) {
  const errors = []

  if (!isRecord(summary)) {
    return ['release-readiness summary must be a JSON object']
  }

  if (summary.allowOpen !== false) {
    errors.push(
      'release-readiness summary must come from strict mode without --allow-open',
    )
  }

  if (!Array.isArray(summary.finalTodoRequirements)) {
    errors.push('summary.finalTodoRequirements must be an array')
  }

  if (!isRecord(summary.checks)) {
    errors.push('summary.checks must be an object')
  } else {
    for (const check of requiredReadyChecks) {
      if (summary.checks[check] !== true) {
        errors.push(`summary.checks.${check} must be true`)
      }
    }
  }

  const byProof = statusByProof(summary)
  for (const requirement of finalTodoEvidenceRequirements) {
    const status = byProof.get(requirement.proof)
    if (!isRecord(status)) {
      errors.push(`summary.finalTodoRequirements missing ${requirement.proof}`)
      continue
    }

    if (status.text !== requirement.text) {
      errors.push(`summary ${requirement.proof} text does not match TODO.md`)
    }

    if (status.itemCount !== 1) {
      errors.push(`summary ${requirement.proof} must match exactly one TODO item`)
    }

    if (status.file !== 'TODO.md') {
      errors.push(`summary ${requirement.proof} must point at TODO.md`)
    }
  }

  for (const proof of evidenceProofsRequiredBeforeFinalization) {
    const status = byProof.get(proof)
    if (!isRecord(status) || status.ready !== true) {
      errors.push(`summary ${proof} must be ready before finalization`)
    }
  }

  if (summary.packageDescriptionWarningCount !== 0) {
    errors.push('package description warning markers must be removed first')
  }

  const blockers = Array.isArray(summary.blockers) ? summary.blockers : null
  const expectedBlockers = expectedTodoBlockers(summary)
  if (!blockers) {
    errors.push('summary.blockers must be an array')
  } else {
    const seenBlockers = new Set()
    for (const blocker of blockers) {
      if (typeof blocker !== 'string' || !expectedBlockers.has(blocker)) {
        errors.push(`unexpected release-readiness blocker: ${String(blocker)}`)
        continue
      }

      if (seenBlockers.has(blocker)) {
        errors.push(`duplicate release-readiness blocker: ${blocker}`)
      }
      seenBlockers.add(blocker)
    }

    for (const blocker of expectedBlockers) {
      if (!seenBlockers.has(blocker)) {
        errors.push(`summary.blockers missing ${blocker}`)
      }
    }
  }

  return errors
}

function readFinalizationSources() {
  return Object.fromEntries(
    finalizationFiles.map((file) => [
      file,
      fs.readFileSync(path.join(repoRoot, file), 'utf-8'),
    ]),
  )
}

function applyTextReplacement(source, replacement) {
  if (source.includes(replacement.before)) {
    return {
      error: null,
      source: source.replace(replacement.before, replacement.after),
    }
  }

  if (replacement.after !== '' && source.includes(replacement.after)) {
    return { error: null, source }
  }

  return {
    error: `${replacement.file}: finalization source text drift for ${replacement.label}`,
    source,
  }
}

function checkFinalTodoItems(source, summary) {
  let output = source
  const byProof = statusByProof(summary)

  for (const requirement of finalTodoEvidenceRequirements) {
    const status = byProof.get(requirement.proof)
    const unchecked = `- [ ] ${requirement.text}`
    const checked = `- [x] ${requirement.text}`

    if (!isRecord(status) || status.checked === true) {
      continue
    }

    if (!output.includes(unchecked)) {
      throw new Error(`TODO.md does not contain unchecked item: ${requirement.text}`)
    }

    output = output.replace(unchecked, checked)
  }

  return output
}

export function applyReleaseReadinessFinalization(sources, summary) {
  const errors = validateFinalizationSummary(summary)
  if (errors.length > 0) {
    return {
      changedFiles: [],
      errors,
      sources,
    }
  }

  const nextSources = { ...sources }
  nextSources['TODO.md'] = checkFinalTodoItems(nextSources['TODO.md'], summary)

  for (const replacement of textReplacements) {
    const result = applyTextReplacement(
      nextSources[replacement.file],
      replacement,
    )
    nextSources[replacement.file] = result.source
    if (result.error) {
      errors.push(result.error)
    }
  }

  const warningHits = collectWarningMarkerHits((file) => nextSources[file] ?? '')
  if (warningHits.length > 0) {
    errors.push(
      [
        'public warning markers would remain after finalization',
        ...warningHits,
      ].join('\n'),
    )
  }

  return {
    changedFiles: finalizationFiles.filter(
      (file) => nextSources[file] !== sources[file],
    ),
    errors,
    sources: nextSources,
  }
}

function collectDirtyWorktreePaths(summaryPath) {
  const result = run('git', ['status', '--porcelain'])
  if (result.status !== 0) {
    throw new Error(`Unable to read git worktree status\n${result.stderr}`)
  }

  const allowedSummaryPath = path.relative(
    repoRoot,
    path.resolve(repoRoot, summaryPath),
  )

  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => line.slice(3))
    .filter((file) => file !== allowedSummaryPath)
}

function writeFinalizationSources(sources, changedFiles) {
  for (const file of changedFiles) {
    fs.writeFileSync(path.join(repoRoot, file), sources[file])
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const dirtyPaths = collectDirtyWorktreePaths(options.summaryPath)
  if (dirtyPaths.length > 0) {
    throw new Error(
      [
        'working tree must be clean before final release readiness finalization',
        ...dirtyPaths,
      ].join('\n'),
    )
  }

  const summary = readJson(options.summaryPath)
  const sources = readFinalizationSources()
  const result = applyReleaseReadinessFinalization(sources, summary)

  if (result.errors.length > 0) {
    throw new Error(result.errors.join('\n'))
  }

  if (options.dryRun) {
    console.log(
      `[release-finalize] dry run would update ${result.changedFiles.length} file(s)`,
    )
    for (const file of result.changedFiles) {
      console.log(`- ${file}`)
    }
    return
  }

  writeFinalizationSources(result.sources, result.changedFiles)
  console.log(
    `[release-finalize] updated ${result.changedFiles.length} file(s)`,
  )
  for (const file of result.changedFiles) {
    console.log(`- ${file}`)
  }
}

const entryPoint = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (import.meta.url === entryPoint) {
  try {
    main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}
