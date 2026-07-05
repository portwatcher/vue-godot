import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const repoRoot = process.cwd()

function readDoc(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf-8')
}

test('real device release checklist covers required Android and iOS gates', () => {
  const checklist = readDoc('docs/real-device-release.md')

  for (const pattern of [
    /^# Real Device Release Checklist/m,
    /^## Required Evidence/m,
    /^## Common Gate/m,
    /^## Android Release Smoke/m,
    /^## iOS Release Smoke/m,
    /npm run check/,
    /npm run check:serious-examples/,
    /npm run release:preflight[\s\S]*validates real-device evidence/,
    /npm audit --audit-level=moderate/,
    /npm run release:preflight/,
    /VUE_GODOT_REAL_DEVICE_EVIDENCE/,
    /real-device-evidence\.example\.json/,
    /GitHub Actions run URL[\s\S]*portwatcher\/vue-godot/,
    /workflow name `Check`/,
    /workflow name `Godot Smoke`/,
    /Release Preflight/,
    /Godot Smoke workflow/,
    /APK\/AAB/,
    /archive, TestFlight, or hosted-device build identifier/,
    /export_presets\.cfg/,
    /dist\/chunks\/\*\.js/,
    /permission prompts and denied states/,
    /adapter states/,
    /missing plugin/,
    /export misconfiguration/,
    /successful native operation/,
    /SafeAreaView/,
    /KeyboardAvoidingView/,
    /Android back handling/,
    /safe area, virtual keyboard, rotation, and text input/,
    /background and foreground/i,
    /deep links[\s\S]*share sheets[\s\S]*notification\s+delivery/,
  ]) {
    assert.match(checklist, pattern)
  }

  assert.match(
    checklist,
    /Run these before platform-specific device checks:[\s\S]*release:preflight -- --local/,
  )
  assert.match(
    checklist,
    /Run non-local `npm run release:preflight`[\s\S]*only after `release\/real-device-evidence\.json` is generated and committed/,
  )
  assert.match(
    checklist,
    /Non-local preflight fails when real-device\s+evidence is missing/,
  )
  assert.doesNotMatch(
    checklist,
    /Run this before platform-specific checks:[\s\S]*npm run release:preflight` without local-only skips/,
  )
})

test('release preflight enforces serious example app readiness', () => {
  const preflight = readDoc('scripts/release-preflight.mjs')
  const production = readDoc('docs/production.md')
  const readme = readDoc('README.md')
  const packageJson = JSON.parse(readDoc('package.json'))

  for (const pattern of [
    /checkSeriousExampleApps/,
    /check:serious-examples/,
    /skip-serious-examples/,
    /Serious example app check failed/,
  ]) {
    assert.match(preflight, pattern)
  }

  assert.match(production, /serious example app readiness/i)
  assert.match(production, /--skip-serious-examples/)
  assert.match(readme, /serious example app gate fails/i)
  assert.match(readme, /--skip-serious-examples/)
  assert.equal(
    packageJson.scripts['check:serious-examples'],
    'node scripts/check-serious-example-apps.mjs',
  )
  assert.match(packageJson.scripts.check, /npm run check:serious-examples/)
})

test('release preflight validates package export targets in tarballs', () => {
  const preflight = readDoc('scripts/release-preflight.mjs')
  const production = readDoc('docs/production.md')
  const readme = readDoc('README.md')

  for (const pattern of [
    /collectPackageExportFiles/,
    /packageJson\.exports/,
    /collectPackageExportFiles\(packageJson\.exports\)/,
    /package tarball missing \$\{expectedFile\}/,
    /checkDependencyAudit/,
    /audit.*--audit-level=moderate/,
  ]) {
    assert.match(preflight, pattern)
  }

  assert.match(production, /dependency audit status/)
  assert.match(readme, /dependency audit reports moderate-or-higher advisories/)
  assert.match(readme, /dependency audit status/)
})

test('release preflight enforces real device evidence', () => {
  const preflight = readDoc('scripts/release-preflight.mjs')
  const realDeviceEvidence = readDoc('scripts/real-device-evidence.mjs')
  const platformEvidenceHelper = readDoc('scripts/create-platform-evidence.mjs')
  const releaseCi = readDoc('scripts/check-release-ci-runs.mjs')
  const evidenceHelper = readDoc('scripts/create-release-evidence.mjs')
  const preflightSummaryHelper = readDoc(
    'scripts/download-release-preflight-summary.mjs',
  )
  const checklist = readDoc('docs/real-device-release.md')
  const production = readDoc('docs/production.md')
  const readme = readDoc('README.md')
  const packageJson = JSON.parse(readDoc('package.json'))
  const workflow = readDoc('.github/workflows/publish.yml')
  const checkWorkflow = readDoc('.github/workflows/check.yml')
  const godotSmokeWorkflow = readDoc('.github/workflows/godot-smoke.yml')
  const preflightWorkflow = readDoc('.github/workflows/release-preflight.yml')
  const example = JSON.parse(readDoc('docs/real-device-evidence.example.json'))

  for (const pattern of [
    /checkRealDeviceEvidence/,
    /currentReleasePackageVersions/,
    /readRealDeviceEvidence/,
    /validateRealDeviceEvidence/,
    /verifyRealDeviceEvidenceRuns/,
    /realDeviceEvidenceEnvVar/,
    /Real device evidence missing/,
    /Real device CI run evidence could not be verified/,
    /summary-output/,
    /expectedReleaseCommit/,
    /--expected-commit/,
    /buildPreflightSummary/,
  ]) {
    assert.match(preflight, pattern)
  }

  for (const pattern of [
    /passOnlyRealDeviceChecks/,
    /realDeviceWorksheetFields/,
    /selectedApiRequiredRealDeviceChecks/,
    /selectedApiRequiredCheckMap/,
    /platform-evidence worksheet field/,
    /must be in passedChecks because selectedApis includes/,
    /must be in passedChecks/,
  ]) {
    assert.match(realDeviceEvidence, pattern)
  }

  assert.match(platformEvidenceHelper, /passOnlyChecks/)
  assert.match(platformEvidenceHelper, /selectedApiRequiredChecks/)
  assert.match(platformEvidenceHelper, /selectedApiRequiredCheckMap/)
  assert.match(platformEvidenceHelper, /nextActions/)

  for (const pattern of [
    /release-preflight-summary/,
    /extractReleasePreflightWarningCount/,
    /passOnlyChecks/,
    /selectedApiRequiredChecks/,
    /Release preflight summary commit must match/,
    /Release preflight summary .*non-local/,
    /Release preflight summary .*must be false/,
    /Release preflight summary contains \$\{warningCount\} warning/,
    /Release preflight summary contains \$\{failureCount\} failure/,
    /validateRealDevicePlatformEvidence/,
    /collectCiSummaryStatusErrors/,
    /releasePreflightRunCommit/,
    /CI evidence ready must be true/,
    /CI evidence checks must be an object/,
    /missingWorkflowNames includes required workflow/,
    /Release Preflight/,
  ]) {
    assert.match(evidenceHelper, pattern)
  }

  for (const pattern of [
    /releasePreflightSummaryArtifactName/,
    /fetchGitHubActionsRunArtifacts/,
    /downloadGitHubActionsArtifactZip/,
    /extractReleasePreflightSummaryFromZip/,
    /extractReleasePreflightRunUrl/,
  ]) {
    assert.match(preflightSummaryHelper, pattern)
  }

  for (const pattern of [
    /include-release-preflight/,
    /releasePreflightWorkflowName/,
    /releaseCiWorkflowDispatches/,
    /expectedCommitInputName/,
    /releasePreflightRunCommit/,
    /dispatchGitHubActionsWorkflow/,
    /fetchGitHubCommitSha/,
    /dispatch-missing/,
    /validateWorkflowDispatchRef/,
    /collectWorkflowDispatchRefErrors/,
    /multiple target commits/,
    /fetchGitHubCommitExists/,
    /was not found on GitHub/,
    /requiredWorkflowNames/,
    /missingWorkflowNames/,
    /collectLocalGitReleaseState/,
    /collectReleaseCiHints/,
    /local git hints/,
    /checkWorkflow/,
    /godotSmokeWorkflow/,
    /Release Preflight/,
  ]) {
    assert.match(releaseCi, pattern)
  }

  assert.equal(
    packageJson.scripts['check:real-device-evidence'],
    'node scripts/check-real-device-evidence.mjs',
  )
  assert.equal(
    packageJson.scripts['release:ci'],
    'node scripts/check-release-ci-runs.mjs',
  )
  assert.equal(
    packageJson.scripts['release:platform-evidence'],
    'node scripts/create-platform-evidence.mjs',
  )
  assert.equal(
    packageJson.scripts['release:evidence'],
    'node scripts/create-release-evidence.mjs',
  )
  assert.equal(
    packageJson.scripts['release:preflight-summary'],
    'node scripts/download-release-preflight-summary.mjs',
  )
  assert.match(production, /check:real-device-evidence/)
  assert.match(production, /real-device-evidence-summary\.json/)
  assert.match(production, /validation status, errors, and `nextActions`/)
  assert.match(
    production,
    /missing-evidence assembly and invalid-evidence regeneration\s+hints begin with `npm run check` before release CI wait\/dispatch/,
  )
  assert.match(production, /resolve command placeholders to `--expected-commit`/)
  assert.match(production, /release:ci/)
  assert.match(
    production,
    /Release commit options \(`--commit`, `--expected-commit`, and\s+`--release-preflight-run-commit`\) require full 40-character git commit SHAs/,
  )
  assert.match(production, /--include-release-preflight/)
  assert.match(production, /--dispatch-missing/)
  assert.match(production, /--wait/)
  assert.match(production, /GH_TOKEN="\$\(gh auth token\)"/)
  assert.match(production, /resolves to the same commit on GitHub/)
  assert.match(production, /commit is not found on GitHub/)
  assert.match(production, /required\/passed\/missing workflow/)
  assert.match(production, /structured workflow\s+checks/)
  assert.match(production, /local Git branch\/upstream diagnostics/)
  assert.match(production, /hints\s+for unpushed commits or stale upstreams/)
  assert.match(production, /`nextActions` command hints/)
  assert.match(production, /pushing or dispatching missing workflows/)
  assert.match(production, /Node 24/)
  assert.match(production, /npm@\^11\.15\.0/)
  assert.match(production, /release:platform-evidence/)
  assert.match(production, /--production-profile/)
  assert.match(production, /production-profile selected API set/)
  assert.match(production, /Final release evidence must include every production-profile API/)
  assert.match(production, /passOnlyChecks/)
  assert.match(production, /selectedApiRequiredChecks/)
  assert.match(production, /Selected API names are validated/)
  assert.match(production, /selected APIs must be recorded in `passedChecks`/)
  assert.match(production, /top-level `nextActions` section/)
  assert.match(production, /release CI wait\/dispatch commands/)
  assert.match(production, /final evidence assembly commands/)
  assert.match(production, /worksheet fields/)
  assert.match(
    production,
    /requiredChecks[\s\S]*passOnlyChecks[\s\S]*selectedApiRequiredChecks/,
  )
  assert.match(production, /release:evidence/)
  assert.match(
    production,
    /rejects not-ready or\s+inconsistent structured CI summaries/,
  )
  assert.match(
    production,
    /validates normalized\s+platform evidence before fetching GitHub run metadata/,
  )
  assert.match(production, /--commit <release-candidate-sha>/)
  assert.match(
    production,
    /tested release commit rather than\s+current `HEAD`/,
  )
  assert.match(
    production,
    /separate\s+Android\/iOS real-device\s+evidence\s+status/,
  )
  assert.match(production, /local Git state/)
  assert.match(production, /local\s+`npm run check`/)
  assert.match(
    production,
    /initial CI, real-device, and Release Preflight evidence\s+actions begin with `npm run check`/,
  )
  assert.match(
    production,
    /initial CI action captures Check and Godot Smoke[\s\S]*Release Preflight is\s+captured later after real-device evidence is committed/,
  )
  assert.match(production, /--real-device-evidence-path/)
  assert.match(production, /--release-preflight-run-commit/)
  assert.match(production, /expected_commit/)
  assert.match(
    production,
    /includes the `--dispatch-missing`, `--release-preflight-run-commit`, and\s+`--real-device-evidence-path` inputs/,
  )
  assert.match(production, /workflow-dispatch-only preflight\s+workflow/)
  assert.match(
    production,
    /final warning-removal action runs `npm run check` after the finalizer/,
  )
  assert.match(production, /git commit -m "Add real-device release evidence"/)
  assert.match(production, /git commit -m "Add release readiness evidence"/)
  assert.match(production, /git add TODO\.md README\.md docs\/compatibility\.md docs\/production\.md docs\/real-device-release\.md/)
  assert.match(production, /git commit -m "Finalize production readiness"/)
  assert.match(production, /before pushing or dispatching missing workflows/)
  assert.match(production, /initial CI evidence\s+collection/)
  assert.match(production, /push\/dispatch commands/)
  assert.match(production, /resolves evidence and finalizer commands/)
  assert.match(production, /tested release commit/)
  assert.match(production, /`nextActions` command hints/)
  assert.match(production, /package description warning/)
  assert.match(production, /release:preflight-summary/)
  assert.match(production, /--release-preflight-summary/)
  assert.match(production, /release-preflight-summary/)
  assert.match(
    production,
    /dispatch those workflows first from a release-candidate ref[\s\S]*dispatch Release Preflight from the evidence ref/,
  )
  assert.match(production, /did not use local-only mode/)
  assert.match(production, /did not skip release\s+gates/)
  assert.match(production, /VUE_GODOT_REAL_DEVICE_EVIDENCE/)
  assert.match(production, /GitHub\s+Actions metadata/)
  assert.match(readme, /check:real-device-evidence/)
  assert.match(readme, /real-device-evidence-summary\.json/)
  assert.match(readme, /validation status, errors, and `nextActions`/)
  assert.match(
    readme,
    /missing-evidence assembly and invalid-evidence regeneration hints begin with `npm run check` before release CI wait\/dispatch/,
  )
  assert.match(readme, /resolve command placeholders to `--expected-commit`/)
  assert.match(readme, /release:ci/)
  assert.match(
    readme,
    /Release commit options \(`--commit`, `--expected-commit`, and `--release-preflight-run-commit`\) require full 40-character git commit SHAs/,
  )
  assert.match(readme, /--include-release-preflight/)
  assert.match(readme, /--dispatch-missing/)
  assert.match(readme, /--wait/)
  assert.match(readme, /GH_TOKEN="\$\(gh auth token\)"/)
  assert.match(readme, /resolve to the same commit on GitHub/)
  assert.match(readme, /commit was not found on GitHub/)
  assert.match(readme, /required\/passed\/missing workflow/)
  assert.match(readme, /structured workflow\s+checks/)
  assert.match(readme, /local Git branch\/upstream diagnostics/)
  assert.match(readme, /hints for unpushed commits or stale upstreams/)
  assert.match(readme, /`nextActions` command hints/)
  assert.match(readme, /running `npm run check` before pushing/)
  assert.match(readme, /pushing or dispatching missing workflows/)
  assert.match(readme, /Node 24/)
  assert.match(readme, /npm@\^11\.15\.0/)
  assert.match(readme, /--ci-evidence/)
  assert.match(readme, /--summary-output/)
  assert.match(readme, /--release-preflight-summary/)
  assert.match(
    readme,
    /rejects not-ready or inconsistent structured CI summaries/,
  )
  assert.match(
    readme,
    /validates the normalized platform evidence before fetching GitHub run metadata/,
  )
  assert.match(readme, /--commit <release-candidate-sha>/)
  assert.match(
    readme,
    /tested release commit rather than current `HEAD`/,
  )
  assert.match(readme, /separate Android\/iOS real-device evidence status/)
  assert.match(readme, /local Git state/)
  assert.match(readme, /local `npm run check`/)
  assert.match(
    readme,
    /initial CI, real-device, and Release Preflight evidence actions begin with `npm run check`/,
  )
  assert.match(
    readme,
    /initial CI action captures Check and Godot Smoke, while Release Preflight is captured later after real-device evidence is committed/,
  )
  assert.match(readme, /--real-device-evidence-path/)
  assert.match(readme, /--release-preflight-run-commit/)
  assert.match(readme, /expected_commit/)
  assert.match(
    readme,
    /includes the `--dispatch-missing`, `--release-preflight-run-commit`, and `--real-device-evidence-path` inputs/,
  )
  assert.match(readme, /workflow-dispatch-only preflight\s+workflow/)
  assert.match(
    readme,
    /final warning-removal action runs `npm run check` after the finalizer/,
  )
  assert.match(readme, /git commit -m "Add real-device release evidence"/)
  assert.match(readme, /git commit -m "Add release readiness evidence"/)
  assert.match(readme, /git commit -m "Finalize production readiness"/)
  assert.match(readme, /initial CI evidence collection/)
  assert.match(readme, /push\/dispatch commands/)
  assert.match(readme, /resolves evidence and finalizer commands/)
  assert.match(readme, /tested release commit/)
  assert.match(readme, /`nextActions` command hints/)
  assert.match(readme, /package description warning/)
  assert.match(
    readme,
    /rejects local-only, skipped, failed, or warning-bearing preflight summaries/,
  )
  assert.match(readme, /release:platform-evidence/)
  assert.match(readme, /--production-profile/)
  assert.match(readme, /production-profile selected API set/)
  assert.match(readme, /Final release evidence must include every production-profile API/)
  assert.match(readme, /passOnlyChecks/)
  assert.match(readme, /selectedApiRequiredChecks/)
  assert.match(readme, /Selected API names are validated/)
  assert.match(readme, /must be in `passedChecks`/)
  assert.match(readme, /top-level `nextActions` section/)
  assert.match(readme, /release CI wait\/dispatch commands/)
  assert.match(readme, /final evidence assembly commands/)
  assert.match(readme, /worksheet fields/)
  assert.match(
    readme,
    /requiredChecks[\s\S]*passOnlyChecks[\s\S]*selectedApiRequiredChecks/,
  )
  assert.match(readme, /release:evidence/)
  assert.match(readme, /release:preflight-summary/)
  assert.match(readme, /real-device-evidence\.json/)
  assert.match(readme, /GitHub Actions metadata/)
  assert.match(checklist, /release:ci/)
  assert.match(
    checklist,
    /Release commit options \(`--commit`, `--expected-commit`,\s+and `--release-preflight-run-commit`\) require full 40-character git commit SHAs/,
  )
  assert.match(checklist, /real-device-evidence-summary\.json/)
  assert.match(checklist, /validation status, errors, and `nextActions`/)
  assert.match(
    checklist,
    /missing-evidence assembly and invalid-evidence\s+regeneration hints begin with `npm run check` before release CI wait\/dispatch/,
  )
  assert.match(checklist, /ci-runs\.json/)
  assert.match(checklist, /--include-release-preflight/)
  assert.match(checklist, /--dispatch-missing/)
  assert.match(checklist, /--wait/)
  assert.match(checklist, /GH_TOKEN="\$\(gh auth token\)"/)
  assert.match(checklist, /resolve to the same commit on GitHub/)
  assert.match(checklist, /commit\s+was not found on GitHub/)
  assert.match(checklist, /required\/passed\/missing workflow/)
  assert.match(checklist, /structured workflow\s+checks/)
  assert.match(checklist, /local Git branch\/upstream diagnostics/)
  assert.match(checklist, /hints for unpushed commits or\s+stale upstreams/)
  assert.match(checklist, /`nextActions` command hints/)
  assert.match(checklist, /running `npm run check` before\s+pushing/)
  assert.match(checklist, /pushing or dispatching missing\s+workflows/)
  assert.match(checklist, /--ci-evidence/)
  assert.match(checklist, /--release-preflight-summary/)
  assert.match(
    checklist,
    /rejects not-ready or inconsistent structured CI summaries/,
  )
  assert.match(
    checklist,
    /validates the normalized platform evidence before fetching GitHub run\s+metadata/,
  )
  assert.match(checklist, /--commit <release-candidate-sha>/)
  assert.match(checklist, /follow-up evidence commit/)
  assert.match(checklist, /tested release\s+commit recorded in evidence/)
  assert.match(
    checklist,
    /separate\s+Android\/iOS real-device\s+evidence\s+status/,
  )
  assert.match(checklist, /local Git state/)
  assert.match(checklist, /local `npm run check`/)
  assert.match(
    checklist,
    /initial CI, real-device, and Release Preflight evidence actions[\s\S]*begin\s+with `npm run check`/,
  )
  assert.match(
    checklist,
    /initial CI\s+action captures Check and Godot Smoke[\s\S]*Release Preflight is captured later\s+after real-device evidence is committed/,
  )
  assert.match(checklist, /--real-device-evidence-path/)
  assert.match(checklist, /--release-preflight-run-commit/)
  assert.match(checklist, /expected_commit/)
  assert.match(
    checklist,
    /includes the\s+`--dispatch-missing`, `--release-preflight-run-commit`, and\s+`--real-device-evidence-path` inputs/,
  )
  assert.match(checklist, /workflow-dispatch-only preflight\s+workflow/)
  assert.match(
    checklist,
    /final\s+warning-removal action runs\s+`npm run check` after the finalizer/,
  )
  assert.match(checklist, /git commit -m "Add real-device release evidence"/)
  assert.match(checklist, /git commit -m "Add release readiness evidence"/)
  assert.match(checklist, /git add TODO\.md README\.md docs\/compatibility\.md docs\/production\.md docs\/real-device-release\.md/)
  assert.match(checklist, /git commit -m "Finalize production readiness"/)
  assert.match(checklist, /initial CI evidence\s+collection/)
  assert.match(checklist, /push\/dispatch commands/)
  assert.match(checklist, /resolves evidence and\s+finalizer commands/)
  assert.match(checklist, /tested\s+release commit/)
  assert.match(checklist, /`nextActions` command hints/)
  assert.match(checklist, /unchecked TODO item details/)
  assert.match(checklist, /final TODO proof status/)
  assert.match(checklist, /CI workflow wiring status/)
  assert.match(checklist, /release tooling\/workflow blocker\s+lists/)
  assert.match(checklist, /local\/skip flags/)
  assert.match(checklist, /local-only/)
  assert.match(checklist, /skipped/)
  assert.match(checklist, /warning-bearing/)
  assert.match(checklist, /release-preflight-summary/)
  assert.match(checklist, /release:preflight-summary/)
  assert.match(
    checklist,
    /dispatch those workflows first from a\s+release-candidate ref[\s\S]*dispatch Release Preflight from the evidence ref/,
  )
  assert.match(checklist, /release-readiness-summary/)
  assert.match(checklist, /--expected-commit <release-candidate-sha>/)
  assert.match(checklist, /follow-up evidence commit/)
  assert.match(checklist, /release:platform-evidence/)
  assert.match(checklist, /--production-profile/)
  assert.match(checklist, /fetch[\s\S]*WebSocket[\s\S]*navigator\.permissions\.query/)
  assert.match(checklist, /Final release evidence must include every production-profile API/)
  assert.match(checklist, /passOnlyChecks/)
  assert.match(checklist, /selectedApiRequiredChecks/)
  assert.match(checklist, /top-level `nextActions`/)
  assert.match(checklist, /release CI wait\/dispatch commands/)
  assert.match(checklist, /local `npm run check`/)
  assert.match(checklist, /final evidence\s+assembly commands/)
  assert.match(checklist, /worksheet fields/)
  assert.match(
    checklist,
    /requiredChecks[\s\S]*passOnlyChecks[\s\S]*selectedApiRequiredChecks/,
  )
  assert.match(checklist, /selected API set/)
  assert.match(checklist, /Selected API\s+names are validated/)
  assert.match(checklist, /Conditional\s+checks for\s+selected APIs/)
  assert.match(workflow, /real_device_evidence_path/)
  assert.match(workflow, /VUE_GODOT_REAL_DEVICE_EVIDENCE/)
  assert.match(checkWorkflow, /workflow_dispatch/)
  assert.match(checkWorkflow, /node-version: 24/)
  assert.match(checkWorkflow, /npm@\^11\.15\.0/)
  assert.match(godotSmokeWorkflow, /workflow_dispatch/)
  assert.match(godotSmokeWorkflow, /node-version: 24/)
  assert.match(godotSmokeWorkflow, /npm@\^11\.15\.0/)
  assert.match(production, /Release Preflight/)
  assert.match(readme, /Release Preflight/)
  assert.match(preflightWorkflow, /name: Release Preflight/)
  assert.match(preflightWorkflow, /id-token: write/)
  assert.match(preflightWorkflow, /npm run release:preflight/)
  assert.match(preflightWorkflow, /summary-output/)
  assert.match(preflightWorkflow, /expected_commit/)
  assert.match(preflightWorkflow, /--expected-commit/)
  assert.match(preflightWorkflow, /actions\/upload-artifact@v4/)
  assert.match(preflightWorkflow, /release-preflight-summary/)
  assert.match(preflightWorkflow, /VUE_GODOT_REAL_DEVICE_EVIDENCE/)
  assert.equal(example.checkRunConclusion, 'success')
  assert.equal(example.godotSmokeRunConclusion, 'success')
  assert.equal(example.checkRunWorkflowName, 'Check')
  assert.equal(example.godotSmokeRunWorkflowName, 'Godot Smoke')
  assert.equal(example.checkRunCommit, example.commit)
  assert.equal(example.godotSmokeRunCommit, example.commit)
  assert.equal('releasePreflightRunUrl' in example, false)
})

test('release readiness audit documents final removal blockers', () => {
  const readiness = readDoc('scripts/release-readiness.mjs')
  const finalizer = readDoc('scripts/finalize-release-readiness.mjs')
  const production = readDoc('docs/production.md')
  const readme = readDoc('README.md')
  const todo = readDoc('TODO.md')
  const packageJson = JSON.parse(readDoc('package.json'))
  const example = JSON.parse(
    readDoc('docs/release-readiness-evidence.example.json'),
  )

  for (const pattern of [
    /release-readiness evidence missing/,
    /collectTodoItems/,
    /collectUncheckedTodoItems/,
    /collectFinalTodoStructureBlockers/,
    /collectCheckedTodoEvidenceBlockers/,
    /formatFinalTodoRequirementStatus/,
    /collectReleaseToolingBlockers/,
    /collectReleaseWorkflowBlockers/,
    /checkCleanWorktree/,
    /collectPublicSurfaceAuditErrors/,
    /currentReleasePackageVersions/,
    /validateRealDeviceEvidence/,
    /release-evidence-utils/,
    /releasePreflightLocalOnly/,
    /releasePreflightSkipGodot/,
    /must be false/,
    /releasePreflightFailureCount must be 0/,
    /releasePreflightWarningCount must be 0/,
    /final release checklist must include/,
    /is checked, but/,
    /working tree must be clean for final release readiness/,
    /public warning markers still present/,
    /final TODO proof status/,
    /root README final-removal wording/,
    /summary-output/,
    /uncheckedItems/,
    /finalTodoRequirements/,
    /releaseToolingBlockers/,
    /releaseWorkflowBlockers/,
    /checkedFinalTodosBackedByEvidence/,
    /collectReadinessNextActions/,
    /nextActions/,
    /releaseTooling/,
    /releaseWorkflows/,
    /strictCiEvidence/,
    /writeReadinessSummary/,
  ]) {
    assert.match(readiness, pattern)
  }

  for (const pattern of [
    /validateFinalizationSummary/,
    /applyReleaseReadinessFinalization/,
    /strict mode without --allow-open/,
    /evidence-backed final TODO proof\s+status/,
    /finalization source text drift/,
    /working tree must be clean before final release readiness finalization/,
    /collectWarningMarkerHits/,
    /--expected-commit <release-candidate-sha>/,
    /npm run check/,
    /git add \${finalizationFiles\.join\(' '\)}/,
    /git commit -m "Finalize production readiness"/,
    /release:finalize-readiness -- --summary/,
  ]) {
    assert.match(finalizer, pattern)
  }

  assert.equal(
    packageJson.scripts['check:public-surface'],
    'node scripts/public-surface-audit.mjs',
  )
  assert.equal(
    packageJson.scripts['check:serious-examples'],
    'node scripts/check-serious-example-apps.mjs',
  )
  assert.match(packageJson.scripts.check, /npm run check:serious-examples/)
  assert.equal(
    packageJson.scripts['release:readiness'],
    'node scripts/release-readiness.mjs',
  )
  assert.equal(
    packageJson.scripts['release:finalize-readiness'],
    'node scripts/finalize-release-readiness.mjs',
  )
  assert.match(production, /check:public-surface/)
  assert.match(production, /release:readiness/)
  assert.match(production, /release:finalize-readiness/)
  assert.match(production, /\/tmp\/vue-godot-readiness\.json/)
  assert.match(production, /release-readiness-summary/)
  assert.match(production, /--expected-commit <release-candidate-sha>/)
  assert.match(production, /tested commit instead of the evidence commit/)
  assert.match(production, /reports final-removal blockers and\s+final TODO proof status/)
  assert.match(production, /TODO counts/)
  assert.match(production, /unchecked\s+TODO item details/)
  assert.match(production, /final TODO proof status/)
  assert.match(production, /CI workflow wiring/)
  assert.match(production, /release tooling\/workflow\s+blocker lists/)
  assert.match(production, /structured readiness check status/)
  assert.match(production, /`nextActions` command hints/)
  assert.match(production, /release tooling\s+script wiring/)
  assert.match(production, /prematurely checked final TODO boxes/)
  assert.match(production, /source text drift/)
  assert.match(production, /dirty\s+worktree/)
  assert.match(readme, /check:public-surface/)
  assert.match(production, /GitHub Actions run URLs for/)
  assert.match(production, /Release Preflight/)
  assert.match(production, /Godot Smoke/)
  assert.match(production, /release-readiness-evidence\.example\.json/)
  assert.match(readme, /release:readiness/)
  assert.match(readme, /release:finalize-readiness/)
  assert.match(readme, /\/tmp\/vue-godot-readiness\.json/)
  assert.match(readme, /release-readiness-summary/)
  assert.match(readme, /release-readiness-evidence\.json/)
  assert.match(
    readme,
    /dispatch those workflows first from a release-candidate ref[\s\S]*dispatch Release Preflight from the evidence ref/,
  )
  assert.match(readme, /--expected-commit <release-candidate-sha>/)
  assert.match(readme, /tested commit instead of the evidence commit/)
  assert.match(readme, /final-readiness blockers and final TODO proof status/)
  assert.match(readme, /TODO counts/)
  assert.match(readme, /unchecked TODO item details/)
  assert.match(readme, /final TODO proof status/)
  assert.match(readme, /CI workflow wiring/)
  assert.match(readme, /release tooling\/workflow blocker lists/)
  assert.match(readme, /structured readiness check status/)
  assert.match(readme, /`nextActions` command hints/)
  assert.match(readme, /release tooling script wiring/)
  assert.match(readme, /prematurely checked final TODO boxes/)
  assert.match(readme, /source text drift/)
  assert.match(readme, /dirty\s+worktree/)
  assert.match(readDoc('docs/real-device-release.md'), /release:finalize-readiness/)
  assert.match(readDoc('docs/real-device-release.md'), /source text drift/)
  assert.match(todo, /release:readiness/)
  assert.equal(example.releasePreflightRunConclusion, 'success')
  assert.equal(example.releasePreflightRunWorkflowName, 'Release Preflight')
  assert.equal(example.releasePreflightLocalOnly, false)
  assert.equal(example.releasePreflightSkipCheck, false)
  assert.equal(example.releasePreflightSkipGodot, false)
  assert.equal(example.releasePreflightSkipSeriousExamples, false)
  assert.equal(example.releasePreflightFailureCount, 0)
  assert.equal(example.releasePreflightWarningCount, 0)
  assert.equal(example.releasePreflightRunCommit, example.commit)
})

test('Godot smoke gate covers serious example apps', () => {
  const smokeScript = readDoc('scripts/smoke-godot.mjs')
  const preflight = readDoc('scripts/release-preflight.mjs')
  const workflow = readDoc('.github/workflows/godot-smoke.yml')
  const setupAction = readDoc('.github/actions/setup-godotjs/action.yml')
  const setupScript = readDoc('scripts/setup-godotjs.mjs')
  const readme = readDoc('README.md')
  const packageJson = JSON.parse(readDoc('package.json'))

  for (const pattern of [
    /exampleSmokeApps/,
    /native-app-demo/,
    /game-ui-demo/,
    /\$\{app\.id\} smoke passed/,
  ]) {
    assert.match(smokeScript, pattern)
  }

  for (const pattern of [
    /\[smoke-godot\] native-app-demo smoke passed/,
    /\[smoke-godot\] game-ui-demo smoke passed/,
  ]) {
    assert.match(preflight, pattern)
  }

  for (const pattern of [
    /apps\/native-app-demo\/\*\*/,
    /apps\/game-ui-demo\/\*\*/,
  ]) {
    assert.match(workflow, pattern)
  }

  assert.match(readme, /serious example apps/)
  assert.match(readme, /native-app-demo/)
  assert.match(readme, /game-ui-demo/)
  assert.equal(
    packageJson.scripts['setup:godotjs'],
    'node scripts/setup-godotjs.mjs',
  )
  assert.match(readme, /setup:godotjs -- --print-bin/)
  assert.match(readme, /scripts\/setup-godotjs\.mjs/)
  assert.match(setupAction, /scripts\/setup-godotjs\.mjs/)
  assert.match(setupAction, /--github-env "\$GITHUB_ENV"/)
  assert.match(setupScript, /GodotJS_1\.0\.0-2/)
  assert.match(setupScript, /prebuilt_linux_x64_v8/)
})

test('release documentation links the real device checklist', () => {
  const linkedDocs = [
    'README.md',
    'docs/production.md',
    'docs/platforms/android.md',
    'docs/platforms/ios.md',
  ]

  for (const relativePath of linkedDocs) {
    assert.match(
      readDoc(relativePath),
      /real device release checklist/i,
      `${relativePath} must link the real device release checklist`,
    )
  }
})

test('serious example app criteria are documented and linked', () => {
  const criteria = readDoc('docs/example-apps.md')

  for (const pattern of [
    /^# Serious Example App Criteria/m,
    /^## Design Scope/m,
    /SDK reference examples/,
    /implementation-focused/,
    /^## Native App Demo/m,
    /multi-screen routing/,
    /network loading, failure, retry, and reachability\/offline states/,
    /permission query\/request-denied flows/,
    /^## Game UI Demo/m,
    /Godot scene with Vue-rendered HUD or menu UI/,
    /controller, keyboard, and touch-oriented navigation paths/,
    /pause, settings, and inventory or loadout workflows/,
    /^## Verification/m,
    /test\/fixture-apps\.test\.mjs/,
    /npm run check/,
  ]) {
    assert.match(criteria, pattern)
  }

  for (const relativePath of ['README.md', 'docs/production.md', 'TODO.md']) {
    assert.match(
      readDoc(relativePath),
      /docs\/example-apps\.md|example-apps\.md|example app criteria/i,
      `${relativePath} must link the serious example app criteria`,
    )
  }
})
