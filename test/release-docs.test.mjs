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
  const realDeviceEvidenceCheck = readDoc('scripts/check-real-device-evidence.mjs')
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

  for (const pattern of [
    /--ci-evidence/,
    /--platform-evidence/,
    /usesCustomCiEvidencePath/,
    /usesCustomEvidencePath/,
    /usesCustomPlatformEvidencePath/,
  ]) {
    assert.match(realDeviceEvidenceCheck, pattern)
  }

  assert.match(platformEvidenceHelper, /passOnlyChecks/)
  assert.match(platformEvidenceHelper, /selectedApiRequiredChecks/)
  assert.match(platformEvidenceHelper, /selectedApiRequiredCheckMap/)
  assert.match(platformEvidenceHelper, /nextActions/)
  assert.match(platformEvidenceHelper, /formatPlatformEvidenceProgress/)
  assert.match(platformEvidenceHelper, /formatPlatformEvidenceRemaining/)

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
    /releasePreflightRunCommit/,
    /--release-preflight-run-commit/,
    /does not match --ci-evidence Release Preflight/,
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
    packageJson.scripts['check:platform-evidence'],
    'node scripts/check-platform-evidence.mjs',
  )
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
    packageJson.scripts['release:record-platform-evidence'],
    'node scripts/record-platform-evidence.mjs',
  )
  assert.equal(
    packageJson.scripts['release:evidence'],
    'node scripts/create-release-evidence.mjs',
  )
  assert.equal(
    packageJson.scripts['release:preflight-summary'],
    'node scripts/download-release-preflight-summary.mjs',
  )
  assert.equal(
    packageJson.scripts['release:handoff'],
    'node scripts/release-handoff-report.mjs',
  )
  assert.match(production, /check:real-device-evidence/)
  assert.match(production, /check:platform-evidence/)
  assert.match(production, /platform-evidence-summary\.json/)
  assert.match(production, /real-device-evidence-summary\.json/)
  assert.match(
    production,
    /validation status, errors, initial CI evidence status, platform worksheet\s+status with compact per-platform progress counts, malformed outcome counts,\s+exact remaining\s+must-pass\/skippable check names, and structured check\s+descriptions, plus `nextActions`/,
  )
  assert.match(production, /[Mm]issing-evidence assembly/)
  assert.match(
    production,
    /invalid-evidence regeneration\s+hints\s+begin with\s+`npm run check`/,
  )
  assert.match(
    production,
    /platform worksheet audit before final\s+evidence\s+assembly or regeneration/,
  )
  assert.match(production, /still-needed release\s+CI\s+wait\/dispatch/)
  assert.match(
    production,
    /Pass `--ci-evidence <file>` or\s+`--platform-evidence <file>`/,
  )
  assert.match(
    production,
    /resolve\s+command placeholders\s+to\s+`--expected-commit`/,
  )
  assert.match(production, /release:ci/)
  assert.match(
    production,
    /Release commit options \(`--commit`, `--expected-commit`, and\s+`--release-preflight-run-commit`\) require full 40-character git commit SHAs/,
  )
  assert.match(production, /--include-release-preflight/)
  assert.match(
    production,
    /--release-preflight-run-commit "\$\(git rev-parse HEAD\)"/,
  )
  assert.doesNotMatch(
    production,
    /--release-preflight-run-commit <evidence-commit-sha>/,
  )
  assert.match(production, /--dispatch-missing/)
  assert.match(production, /--wait/)
  assert.match(production, /GH_TOKEN="\$\(gh auth token\)"/)
  assert.match(production, /resolves to the same commit on GitHub/)
  assert.match(production, /commit is not found on GitHub/)
  assert.match(production, /required\/passed\/missing workflow/)
  assert.match(production, /structured workflow\s+checks/)
  assert.match(production, /local Git branch\/upstream diagnostics/)
  assert.match(production, /same workflow evidence/)
  assert.match(production, /evidence-only commits do not churn/)
  assert.match(production, /hints\s+for unpushed commits or stale upstreams/)
  assert.match(production, /`nextActions` command hints/)
  assert.match(production, /pushing or dispatching missing workflows/)
  assert.match(production, /Node 24/)
  assert.match(production, /npm@\^11\.15\.0/)
  assert.match(production, /release:platform-evidence/)
  assert.match(production, /release:record-platform-evidence/)
  assert.match(production, /command templates before the strict\s+worksheet audit/)
  assert.match(production, /--platform android/)
  assert.match(production, /--platform ios/)
  assert.match(production, /--pass-remaining/)
  assert.match(production, /--pass-remaining-confirmation/)
  assert.match(production, /remaining must-pass checks/)
  assert.match(
    production,
    /generated handoff commands include skip and\s+pass-remaining confirmation placeholders/,
  )
  assert.match(production, /placeholder confirmation notes/)
  assert.match(production, /`passedChecks`[\s\S]*non-empty string array/)
  assert.match(production, /`skippedChecks`[\s\S]*non-empty\s+release-specific reasons/)
  assert.match(production, /A check\s+must not appear in both/)
  assert.match(
    production,
    /Markdown handoff\s+flags command blocks that\s+still contain `<\.\.\.>` placeholders/,
  )
  assert.match(
    production,
    /refuses to\s+skip\s+pass-only or selected-API-required\s+checks/,
  )
  assert.match(
    production,
    /When\s+`--summary-output`\s+is\s+supplied[\s\S]*recorder\s+writes the\s+updated\s+audit\s+and\s+follow-up `nextActions`/,
  )
  assert.match(production, /--production-profile/)
  assert.match(production, /production-profile selected API set/)
  assert.match(
    production,
    /[Tt]he worksheet reads `release\/ci-runs\.json` by default[\s\S]*`--ci-evidence <file>`[\s\S]*records an `initialCiEvidence` status object[\s\S]*duplicate Check\/Godot Smoke collection\s+commands/,
  )
  assert.match(production, /Final release evidence must include every production-profile API/)
  assert.match(production, /passOnlyChecks/)
  assert.match(production, /selectedApiRequiredChecks/)
  assert.match(production, /navigator\.mediaDevices\.getUserMedia/)
  assert.match(
    production,
    /audio-input-if-selected[\s\S]*must-pass Android and iOS worksheet check/,
  )
  assert.match(production, /Selected API names are validated/)
  assert.match(production, /selected APIs must be recorded in `passedChecks`/)
  assert.match(production, /top-level `nextActions` section/)
  assert.match(production, /audited progress/)
  assert.match(production, /exact\s+remaining metadata\/must-pass\/skippable gap names and structured `platformCheckDetails` descriptions/)
  assert.match(production, /release\s+CI\s+wait\/dispatch commands/)
  assert.match(production, /allow-open worksheet audit\s+command/)
  assert.match(production, /final\s+evidence\s+assembly commands/)
  assert.match(production, /worksheet fields/)
  assert.match(
    production,
    /requiredChecks[\s\S]*passOnlyChecks[\s\S]*selectedApiRequiredChecks[\s\S]*initialCiEvidence[\s\S]*nextActions/,
  )
  assert.match(production, /release:evidence/)
  assert.match(
    production,
    /rejects not-ready or\s+inconsistent structured CI summaries/,
  )
  assert.match(
    production,
    /malformed `passedChecks` arrays[\s\S]*malformed `skippedChecks` reason maps[\s\S]*checks recorded as both passed and\s+skipped/,
  )
  assert.match(production, /malformed workflow run commit SHAs/)
  assert.match(
    production,
    /validates normalized\s+platform evidence\s+before fetching GitHub run metadata/,
  )
  assert.match(
    production,
    /full 40-character commit SHAs for the tested release commit and workflow run\s+commits/,
  )
  assert.match(production, /--commit <release-candidate-sha>/)
  assert.match(
    production,
    /tested release commit rather than\s+current `HEAD`/,
  )
  assert.match(
    production,
    /separate\s+Android\/iOS\s+real-device\s+evidence\s+status/,
  )
  assert.match(production, /local Git state/)
  assert.match(production, /local\s+`npm run check`/)
  assert.match(
    production,
    /release:handoff[\s\S]*release\/release-handoff\.md[\s\S]*Markdown handoff/,
  )
  assert.match(
    production,
    /per-platform metadata\/check gaps,\s+malformed outcome details/,
  )
  assert.match(
    production,
    /real-device evidence is open[\s\S]*`nextActions` include that handoff command before the device-evidence action[\s\S]*missing or stale/,
  )
  assert.match(
    production,
    /`blockedBy` list[\s\S]*real-device evidence before Release Preflight/,
  )
  assert.match(
    production,
    /initial CI, real-device, and\s+Release Preflight evidence\s+actions begin with `npm run check`/,
  )
  assert.match(
    production,
    /initial CI action captures Check and Godot Smoke[\s\S]*Release Preflight is\s+captured later after real-device evidence is committed/,
  )
  assert.match(
    production,
    /release\/ci-runs\.json`[\s\S]*`--ci-evidence <file>`[\s\S]*already validates Check and Godot Smoke[\s\S]*omits the\s+duplicate\s+Check\/Godot Smoke collection commands/,
  )
  assert.match(
    production,
    /checked-in or\s+supplied CI evidence is valid for a different tested release commit[\s\S]*`expected-commit`\s+`nextActions` entry[\s\S]*npm run release:readiness -- --allow-open --expected-commit/,
  )
  assert.match(
    production,
    /`--ci-evidence <file>`,\s+`--platform-evidence <file>`,\s+`--real-device-path <file>`,\s+or `--readiness-path <file>`[\s\S]*path inside the Git worktree[\s\S]*generated `nextActions` keep that path[\s\S]*release CI refreshes[\s\S]*final strict readiness checks/,
  )
  assert.match(
    production,
    /initial CI evidence is\s+still missing[\s\S]*refreshes Check and Godot\s+Smoke from the release-candidate ref[\s\S]*Release Preflight from\s+the current evidence commit ref[\s\S]*--release-preflight-run-commit "\$\(git rev-parse HEAD\)"/,
  )
  assert.doesNotMatch(
    production,
    /--release-preflight-run-commit <evidence-commit-sha>/,
  )
  assert.match(production, /--real-device-evidence-path/)
  assert.match(production, /--release-preflight-run-commit/)
  assert.match(production, /--ref <release-candidate-branch-or-tag>/)
  assert.match(production, /--ref <evidence-branch-or-tag>/)
  assert.match(production, /expected_commit/)
  assert.match(
    production,
    /includes the\s+`--dispatch-missing`,\s+`--release-preflight-run-commit`,\s+and\s+`--real-device-evidence-path` inputs/,
  )
  assert.match(production, /workflow-dispatch-only preflight\s+workflow/)
  assert.match(
    production,
    /final\s+warning-removal action\s+runs\s+`npm run check` after the finalizer/,
  )
  assert.match(production, /git commit -m "Add real-device release evidence"/)
  assert.match(
    production,
    /outside the Git worktree[\s\S]*copy it into the standard `release\/` evidence file/,
  )
  assert.match(production, /reuses an existing platform worksheet/)
  assert.match(
    production,
    /release:record-platform-evidence` command templates/,
  )
  assert.match(
    production,
    /includes Android\/iOS metadata-field counts, malformed outcome counts,\s+required-check counts, and exact remaining must-pass\/skippable check names in\s+its detail[\s\S]*attaches\s+`platformCheckDetails` with descriptions and selected API context[\s\S]*only\s+emits\s+`npm run release:platform-evidence -- --production-profile` when the worksheet\s+is missing/,
  )
  assert.match(production, /strict platform worksheet\s+audit/)
  assert.match(production, /git commit -m "Add release readiness evidence"/)
  assert.match(production, /git add TODO\.md README\.md docs\/compatibility\.md docs\/production\.md docs\/real-device-release\.md/)
  assert.match(production, /git commit -m "Finalize production readiness"/)
  assert.match(production, /before pushing or dispatching missing workflows/)
  assert.match(production, /initial CI evidence\s+collection/)
  assert.match(production, /push\/dispatch\s+commands/)
  assert.match(production, /resolves evidence and finalizer commands/)
  assert.match(production, /tested release commit/)
  assert.match(production, /`nextActions` command hints/)
  assert.match(production, /package description warning/)
  assert.match(production, /release:preflight-summary/)
  assert.match(production, /--release-preflight-summary/)
  assert.match(production, /release-preflight-summary/)
  assert.match(
    production,
    /release:preflight-summary[\s\S]*--commit <release-candidate-sha>/,
  )
  assert.match(
    production,
    /validates the summary JSON against the\s+tested release commit[\s\S]*workflow run against the\s+`Release Preflight` run commit/,
  )
  assert.match(production, /--release-preflight-run-commit/)
  assert.match(
    production,
    /dispatch those workflows first from a release-candidate ref[\s\S]*dispatch Release Preflight from the evidence ref/,
  )
  assert.match(production, /did not use local-only mode/)
  assert.match(production, /did not skip release\s+gates/)
  assert.match(production, /VUE_GODOT_REAL_DEVICE_EVIDENCE/)
  assert.match(production, /GitHub\s+Actions metadata/)
  assert.match(readme, /check:real-device-evidence/)
  assert.match(readme, /check:platform-evidence/)
  assert.match(readme, /platform-evidence-summary\.json/)
  assert.match(readme, /real-device-evidence-summary\.json/)
  assert.match(
    readme,
    /validation status, errors, initial CI evidence status, platform worksheet status with compact per-platform progress counts, malformed outcome counts,\s+exact remaining\s+must-pass\/skippable check names, and structured check descriptions, plus `nextActions`/,
  )
  assert.match(readme, /[Mm]issing-evidence assembly/)
  assert.match(
    readme,
    /invalid-evidence regeneration\s+hints\s+begin with `npm run check`/,
  )
  assert.match(
    readme,
    /platform worksheet audit before final\s+evidence\s+assembly or regeneration/,
  )
  assert.match(readme, /still-needed release\s+CI\s+wait\/dispatch/)
  assert.match(
    readme,
    /pass `--ci-evidence <file>` or `--platform-evidence <file>`/,
  )
  assert.match(readme, /resolve\s+command placeholders\s+to\s+`--expected-commit`/)
  assert.match(readme, /release:ci/)
  assert.match(
    readme,
    /Release commit options \(`--commit`, `--expected-commit`, and `--release-preflight-run-commit`\) require full 40-character git commit SHAs/,
  )
  assert.match(readme, /--include-release-preflight/)
  assert.match(
    readme,
    /--release-preflight-run-commit "\$\(git rev-parse HEAD\)"[\s\S]*from the evidence commit/,
  )
  assert.doesNotMatch(
    readme,
    /--release-preflight-run-commit <evidence-commit-sha>/,
  )
  assert.match(readme, /--dispatch-missing/)
  assert.match(readme, /--wait/)
  assert.match(readme, /GH_TOKEN="\$\(gh auth token\)"/)
  assert.match(readme, /resolve to the same commit on GitHub/)
  assert.match(readme, /commit was not found on GitHub/)
  assert.match(readme, /required\/passed\/missing workflow/)
  assert.match(readme, /structured workflow\s+checks/)
  assert.match(readme, /local Git branch\/upstream diagnostics/)
  assert.match(readme, /same workflow evidence/)
  assert.match(readme, /evidence-only commits do not churn/)
  assert.match(readme, /hints for unpushed commits or stale upstreams/)
  assert.match(readme, /`nextActions` command hints/)
  assert.match(readme, /running `npm run check` before pushing/)
  assert.match(readme, /pushing or dispatching missing workflows/)
  assert.match(readme, /Node 24/)
  assert.match(readme, /npm@\^11\.15\.0/)
  assert.match(readme, /--ci-evidence/)
  assert.match(readme, /--summary-output/)
  assert.match(
    readme,
    /When\s+`--summary-output`\s+is\s+supplied[\s\S]*recorder\s+writes the\s+updated\s+audit\s+and\s+follow-up `nextActions`/,
  )
  assert.match(readme, /--release-preflight-summary/)
  assert.match(
    readme,
    /rejects not-ready or inconsistent structured CI summaries/,
  )
  assert.match(readme, /malformed workflow run commit SHAs/)
  assert.match(
    readme,
    /validates the normalized platform evidence before fetching GitHub run metadata/,
  )
  assert.match(readme, /full 40-character evidence commit and workflow run SHAs/)
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
    /initial CI, real-device, and\s+Release Preflight evidence actions begin with `npm run check`/,
  )
  assert.match(
    readme,
    /release:handoff[\s\S]*release\/release-handoff\.md[\s\S]*Markdown handoff/,
  )
  assert.match(
    readme,
    /per-platform metadata\/check gaps, malformed outcome details/,
  )
  assert.match(
    readme,
    /real-device evidence is open[\s\S]*`nextActions` include the same handoff command before the device-evidence action[\s\S]*missing or stale/,
  )
  assert.match(
    readme,
    /`blockedBy` dependencies[\s\S]*next commands/,
  )
  assert.match(
    readme,
    /initial CI action captures Check and Godot Smoke, while Release Preflight is captured later after real-device evidence is committed/,
  )
  assert.match(
    readme,
    /release\/ci-runs\.json`[\s\S]*already validates Check and Godot Smoke[\s\S]*omits the duplicate Check\/Godot Smoke collection commands/,
  )
  assert.match(
    readme,
    /checked-in or supplied CI evidence is valid for a different tested release commit[\s\S]*`expected-commit` `nextActions` entry[\s\S]*npm run release:readiness -- --allow-open --expected-commit/,
  )
  assert.match(
    readme,
    /`--ci-evidence <file>`, `--platform-evidence <file>`, `--real-device-path <file>`, or `--readiness-path <file>`[\s\S]*path inside the Git worktree[\s\S]*generated `nextActions` keep that path[\s\S]*release CI refreshes[\s\S]*final strict readiness checks/,
  )
  assert.match(
    readme,
    /initial CI evidence is still missing[\s\S]*refreshes Check and Godot Smoke from the release-candidate ref[\s\S]*Release Preflight from the current evidence commit ref[\s\S]*--release-preflight-run-commit "\$\(git rev-parse HEAD\)"/,
  )
  assert.doesNotMatch(
    readme,
    /--release-preflight-run-commit <evidence-commit-sha>/,
  )
  assert.match(readme, /--real-device-evidence-path/)
  assert.match(readme, /--release-preflight-run-commit/)
  assert.match(
    readme,
    /validates the summary JSON against the tested release commit[\s\S]*workflow run against the recorded Release Preflight run commit/,
  )
  assert.match(readme, /--ref <release-candidate-branch-or-tag>/)
  assert.match(readme, /--ref <evidence-branch-or-tag>/)
  assert.match(readme, /expected_commit/)
  assert.match(
    readme,
    /includes the\s+`--dispatch-missing`,\s+`--release-preflight-run-commit`,\s+and\s+`--real-device-evidence-path` inputs/,
  )
  assert.match(readme, /workflow-dispatch-only preflight\s+workflow/)
  assert.match(
    readme,
    /final\s+warning-removal action\s+runs\s+`npm run check` after the finalizer/,
  )
  assert.match(readme, /git commit -m "Add real-device release evidence"/)
  assert.match(
    readme,
    /outside the Git worktree[\s\S]*copy it into the standard `release\/` evidence file/,
  )
  assert.match(readme, /reuses an existing platform worksheet/)
  assert.match(readme, /release:record-platform-evidence` command templates/)
  assert.match(
    readme,
    /includes Android\/iOS metadata-field counts, malformed outcome counts, required-check counts, and exact remaining check names in its detail[\s\S]*attaches `platformCheckDetails` with descriptions and selected API context[\s\S]*only emits `npm run release:platform-evidence -- --production-profile` when the worksheet is missing/,
  )
  assert.match(readme, /strict platform worksheet audit/)
  assert.match(readme, /git commit -m "Add release readiness evidence"/)
  assert.match(readme, /git commit -m "Finalize production readiness"/)
  assert.match(readme, /initial CI evidence collection/)
  assert.match(readme, /push\/dispatch\s+commands/)
  assert.match(readme, /resolves evidence and finalizer commands/)
  assert.match(readme, /tested release commit/)
  assert.match(readme, /`nextActions` command hints/)
  assert.match(readme, /package description warning/)
  assert.match(
    readme,
    /rejects local-only, skipped, failed, or warning-bearing preflight summaries/,
  )
  assert.match(readme, /release:platform-evidence/)
  assert.match(readme, /release:record-platform-evidence/)
  assert.match(readme, /command templates/)
  assert.match(readme, /worksheet audit/)
  assert.match(readme, /--platform android/)
  assert.match(readme, /--platform ios/)
  assert.match(readme, /--pass-remaining/)
  assert.match(readme, /--pass-remaining-confirmation/)
  assert.match(readme, /remaining must-pass checks/)
  assert.match(
    readme,
    /generated handoff commands include skip and\s+pass-remaining confirmation placeholders/,
  )
  assert.match(readme, /placeholder confirmation notes/)
  assert.match(readme, /`passedChecks`[\s\S]*non-empty string array/)
  assert.match(readme, /`skippedChecks`[\s\S]*non-empty\s+release-specific reasons/)
  assert.match(readme, /A check must not appear in both/)
  assert.match(
    readme,
    /Markdown handoff\s+flags command blocks that\s+still contain `<\.\.\.>` placeholders/,
  )
  assert.match(readme, /rejects unknown checks/)
  assert.match(readme, /refuses to\s+skip pass-only or selected-API-required checks/)
  assert.match(
    readme,
    /When\s+`--summary-output`\s+is\s+supplied[\s\S]*recorder\s+writes the\s+updated\s+audit\s+and\s+follow-up `nextActions`/,
  )
  assert.match(readme, /--production-profile/)
  assert.match(readme, /production-profile selected API set/)
  assert.match(
    readme,
    /worksheet reads `release\/ci-runs\.json` by default[\s\S]*`--ci-evidence <file>`[\s\S]*records an `initialCiEvidence` status object[\s\S]*duplicate Check\/Godot Smoke collection commands/,
  )
  assert.match(readme, /Final release evidence must include every\s+production-profile API/)
  assert.match(readme, /passOnlyChecks/)
  assert.match(readme, /selectedApiRequiredChecks/)
  assert.match(readme, /navigator\.mediaDevices\.getUserMedia/)
  assert.match(
    readme,
    /audio-input-if-selected[\s\S]*must-pass production worksheet check/,
  )
  assert.match(readme, /Selected API names are\s+validated/)
  assert.match(readme, /must be in `passedChecks`/)
  assert.match(readme, /top-level `nextActions` section/)
  assert.match(readme, /audited progress/)
  assert.match(readme, /malformed outcome counts/)
  assert.match(readme, /exact remaining metadata\/must-pass\/skippable gap names/)
  assert.match(readme, /release\s+CI\s+wait\/dispatch commands/)
  assert.match(readme, /worksheet\s+audit\s+command/)
  assert.match(readme, /final evidence\s+assembly commands/)
  assert.match(readme, /worksheet fields/)
  assert.match(
    readme,
    /requiredChecks[\s\S]*passOnlyChecks[\s\S]*selectedApiRequiredChecks[\s\S]*initialCiEvidence[\s\S]*nextActions/,
  )
  assert.match(readme, /release:evidence/)
  assert.match(readme, /release:preflight-summary/)
  assert.match(readme, /release:preflight-summary[\s\S]*--commit <release-candidate-sha>/)
  assert.match(readme, /when using `--run-url` manually/)
  assert.match(readme, /recorded Release Preflight run commit/)
  assert.match(readme, /real-device-evidence\.json/)
  assert.match(readme, /GitHub Actions metadata/)
  assert.match(checklist, /release:ci/)
  assert.match(
    checklist,
    /Release commit options \(`--commit`,\s+`--expected-commit`, and `--release-preflight-run-commit`\) require full\s+40-character git commit SHAs/,
  )
  assert.match(checklist, /real-device-evidence-summary\.json/)
  assert.match(
    checklist,
    /validation status, errors, initial CI evidence status, platform\s+worksheet status with compact per-platform progress counts, malformed outcome\s+counts,\s+exact remaining\s+must-pass\/skippable check names, and structured check\s+descriptions, plus\s+`nextActions`/,
  )
  assert.match(checklist, /[Mm]issing-evidence\s+assembly/)
  assert.match(
    checklist,
    /invalid-evidence\s+regeneration\s+hints\s+begin with\s+`npm run check`/,
  )
  assert.match(
    checklist,
    /platform worksheet audit before final\s+evidence\s+assembly or\s+regeneration/,
  )
  assert.match(checklist, /still-needed release\s+CI\s+wait\/dispatch/)
  assert.match(
    checklist,
    /Pass `--ci-evidence <file>` or\s+`--platform-evidence <file>`/,
  )
  assert.match(checklist, /ci-runs\.json/)
  assert.match(checklist, /--include-release-preflight/)
  assert.match(
    checklist,
    /--release-preflight-run-commit "\$\(git rev-parse HEAD\)"/,
  )
  assert.doesNotMatch(
    checklist,
    /--release-preflight-run-commit <evidence-commit-sha>/,
  )
  assert.match(checklist, /--dispatch-missing/)
  assert.match(checklist, /--wait/)
  assert.match(checklist, /GH_TOKEN="\$\(gh auth token\)"/)
  assert.match(checklist, /resolve to the same commit on GitHub/)
  assert.match(checklist, /commit\s+was not found on GitHub/)
  assert.match(checklist, /required\/passed\/missing workflow/)
  assert.match(checklist, /structured workflow\s+checks/)
  assert.match(checklist, /local Git branch\/upstream diagnostics/)
  assert.match(checklist, /same workflow evidence/)
  assert.match(checklist, /evidence-only commits\s+do not churn/)
  assert.match(checklist, /hints for unpushed commits or\s+stale upstreams/)
  assert.match(checklist, /`nextActions` command hints/)
  assert.match(checklist, /running `npm run check` before\s+pushing/)
  assert.match(checklist, /pushing or dispatching missing\s+workflows/)
  assert.match(checklist, /--ci-evidence/)
  assert.match(
    checklist,
    /When\s+`--summary-output`\s+is\s+supplied[\s\S]*recorder\s+writes the\s+updated\s+audit\s+and\s+follow-up `nextActions`/,
  )
  assert.match(checklist, /--release-preflight-summary/)
  assert.match(
    checklist,
    /rejects not-ready or inconsistent structured CI summaries/,
  )
  assert.match(checklist, /malformed workflow run commit SHAs/)
  assert.match(
    checklist,
    /validates the normalized platform evidence before fetching GitHub run\s+metadata/,
  )
  assert.match(
    checklist,
    /full 40-character\s+tested commit SHA[\s\S]*full 40-character run commit SHAs/,
  )
  assert.match(checklist, /--commit <release-candidate-sha>/)
  assert.match(checklist, /follow-up evidence commit/)
  assert.match(checklist, /tested release\s+commit recorded in evidence/)
  assert.match(
    checklist,
    /separate\s+Android\/iOS\s+real-device\s+evidence\s+status/,
  )
  assert.match(checklist, /local Git state/)
  assert.match(checklist, /local `npm run check`/)
  assert.match(
    checklist,
    /initial CI, real-device, and\s+Release Preflight evidence actions[\s\S]*begin\s+with `npm run check`/,
  )
  assert.match(
    checklist,
    /release:handoff[\s\S]*release\/release-handoff\.md[\s\S]*Markdown handoff/,
  )
  assert.match(
    checklist,
    /per-platform metadata\/check gaps,\s+malformed outcome details/,
  )
  assert.match(
    checklist,
    /real-device evidence is open[\s\S]*`nextActions` include that handoff command before the device-evidence action[\s\S]*missing or stale/,
  )
  assert.match(
    checklist,
    /initial CI\s+action captures Check and Godot Smoke[\s\S]*Release Preflight is captured later\s+after real-device evidence is committed/,
  )
  assert.match(
    checklist,
    /release\/ci-runs\.json`[\s\S]*already[\s\S]*validates Check and Godot Smoke[\s\S]*omits the duplicate Check\/Godot Smoke\s+collection commands/,
  )
  assert.match(
    checklist,
    /checked-in or supplied CI evidence is valid for a different[\s\S]*tested release commit[\s\S]*`expected-commit`\s+`nextActions` entry[\s\S]*npm run release:readiness -- --allow-open --expected-commit/,
  )
  assert.match(
    checklist,
    /`--ci-evidence <file>`,\s+`--platform-evidence <file>`,\s+`--real-device-path <file>`,\s+or `--readiness-path <file>`[\s\S]*path inside the Git worktree[\s\S]*generated `nextActions` keep that path[\s\S]*release CI refreshes[\s\S]*final strict readiness checks/,
  )
  assert.match(
    checklist,
    /initial CI evidence is still\s+missing[\s\S]*refreshes Check and Godot Smoke\s+from the\s+release-candidate ref[\s\S]*Release Preflight from the\s+evidence ref[\s\S]*--release-preflight-run-commit "\$\(git rev-parse HEAD\)"/,
  )
  assert.doesNotMatch(
    checklist,
    /--release-preflight-run-commit <evidence-commit-sha>/,
  )
  assert.match(checklist, /--real-device-evidence-path/)
  assert.match(checklist, /--release-preflight-run-commit/)
  assert.match(checklist, /--ref <release-candidate-branch-or-tag>/)
  assert.match(checklist, /--ref <evidence-branch-or-tag>/)
  assert.match(checklist, /expected_commit/)
  assert.match(
    checklist,
    /includes the\s+`--dispatch-missing`,\s+`--release-preflight-run-commit`,\s+and\s+`--real-device-evidence-path` inputs/,
  )
  assert.match(checklist, /workflow-dispatch-only preflight\s+workflow/)
  assert.match(
    checklist,
    /final\s+warning-removal action\s+runs\s+`npm run check` after the finalizer/,
  )
  assert.match(checklist, /git commit -m "Add real-device release evidence"/)
  assert.match(
    checklist,
    /outside the Git worktree[\s\S]*copy it into\s+the standard `release\/` evidence file/,
  )
  assert.match(checklist, /reuses an existing platform worksheet/)
  assert.match(checklist, /release:record-platform-evidence` command templates/)
  assert.match(
    checklist,
    /includes Android\/iOS metadata-field counts, malformed outcome counts,\s+required-check counts, and exact remaining must-pass\/skippable check names in\s+its detail[\s\S]*attaches\s+`platformCheckDetails` with descriptions and selected API context[\s\S]*only emits\s+`npm run release:platform-evidence -- --production-profile` when the worksheet\s+is missing/,
  )
  assert.match(checklist, /strict platform worksheet audit/)
  assert.match(checklist, /git commit -m "Add release readiness evidence"/)
  assert.match(checklist, /git add TODO\.md README\.md docs\/compatibility\.md docs\/production\.md docs\/real-device-release\.md/)
  assert.match(checklist, /git commit -m "Finalize production readiness"/)
  assert.match(checklist, /initial CI evidence\s+collection/)
  assert.match(checklist, /push\/dispatch\s+commands/)
  assert.match(checklist, /resolves evidence and\s+finalizer commands/)
  assert.match(checklist, /tested\s+release commit/)
  assert.match(checklist, /`nextActions` command hints/)
  assert.match(checklist, /unchecked TODO item details/)
  assert.match(checklist, /final TODO proof status/)
  assert.match(checklist, /CI workflow wiring status/)
  assert.match(
    checklist,
    /platform worksheet audit\s+status with compact per-platform progress counts, malformed outcome counts,\s+exact remaining\s+must-pass\/skippable check names, and structured check\s+descriptions/,
  )
  assert.match(checklist, /release tooling\/workflow blocker\s+lists/)
  assert.match(checklist, /local\/skip flags/)
  assert.match(checklist, /local-only/)
  assert.match(checklist, /skipped/)
  assert.match(checklist, /warning-bearing/)
  assert.match(checklist, /release-preflight-summary/)
  assert.match(checklist, /release:preflight-summary/)
  assert.match(
    checklist,
    /release:preflight-summary[\s\S]*--commit <release-candidate-sha>/,
  )
  assert.match(
    checklist,
    /validates the summary commit[\s\S]*workflow run against the\s+`Release Preflight` run commit/,
  )
  assert.match(checklist, /--release-preflight-run-commit/)
  assert.match(
    checklist,
    /dispatch those workflows first from a\s+release-candidate ref[\s\S]*dispatch Release Preflight from the evidence ref/,
  )
  assert.match(checklist, /release-readiness-summary/)
  assert.match(checklist, /--expected-commit <release-candidate-sha>/)
  assert.match(checklist, /follow-up evidence commit/)
  assert.match(checklist, /release:platform-evidence/)
  assert.match(checklist, /release:record-platform-evidence/)
  assert.match(checklist, /command\s+templates before the strict worksheet audit/)
  assert.match(checklist, /--platform android/)
  assert.match(checklist, /--platform ios/)
  assert.match(checklist, /--export-preset <android-export-preset>/)
  assert.match(checklist, /--export-preset <ios-export-preset>/)
  assert.match(
    checklist,
    /--pass cold-launch,no-godotjs-load-diagnostics,audio-input-if-selected/,
  )
  assert.match(checklist, /--skip deep-links-share-notifications-if-selected/)
  assert.match(checklist, /--pass-remaining/)
  assert.match(checklist, /--pass-remaining-confirmation/)
  assert.match(checklist, /remaining must-pass checks/)
  assert.match(
    checklist,
    /generated handoff commands include skip and\s+pass-remaining confirmation placeholders/,
  )
  assert.match(checklist, /placeholder confirmation notes/)
  assert.match(checklist, /`passedChecks`[\s\S]*non-empty\s+string array/)
  assert.match(checklist, /`skippedChecks`[\s\S]*non-empty\s+release-specific reasons/)
  assert.match(checklist, /A check must not appear in both/)
  assert.match(
    checklist,
    /Markdown handoff flags command blocks\s+that\s+still contain `<\.\.\.>` placeholders/,
  )
  assert.match(checklist, /preserves existing and newly supplied/)
  assert.match(
    checklist,
    /refuses to put pass-only or\s+selected-API-required checks/,
  )
  assert.match(
    checklist,
    /When\s+`--summary-output`\s+is\s+supplied[\s\S]*recorder[\s\S]*writes the\s+updated\s+audit\s+and\s+follow-up `nextActions`/,
  )
  assert.match(checklist, /check:platform-evidence/)
  assert.match(checklist, /platform-evidence-summary\.json/)
  assert.match(checklist, /--production-profile/)
  assert.match(
    checklist,
    /[Ii]t reads\s+`release\/ci-runs\.json` by default[\s\S]*`--ci-evidence <file>`[\s\S]*records an `initialCiEvidence` status object[\s\S]*duplicate Check\/Godot Smoke collection\s+commands/,
  )
  assert.match(checklist, /fetch[\s\S]*WebSocket[\s\S]*navigator\.permissions\.query/)
  assert.match(checklist, /Final release evidence must include every production-profile API/)
  assert.match(checklist, /passOnlyChecks/)
  assert.match(checklist, /selectedApiRequiredChecks/)
  assert.match(checklist, /navigator\.mediaDevices\.getUserMedia/)
  assert.match(
    checklist,
    /audio-input-if-selected[\s\S]*must-pass Android and iOS device check/,
  )
  assert.match(checklist, /top-level `nextActions`/)
  assert.match(checklist, /audited progress/)
  assert.match(
    checklist,
    /malformed outcome counts[\s\S]*exact remaining metadata\/must-pass\/skippable gap names and structured `platformCheckDetails` descriptions/,
  )
  assert.match(checklist, /release\s+CI\s+wait\/dispatch commands/)
  assert.match(checklist, /worksheet\s+audit command/)
  assert.match(checklist, /local `npm run check`/)
  assert.match(checklist, /final evidence\s+assembly commands/)
  assert.match(checklist, /worksheet fields/)
  assert.match(
    checklist,
    /requiredChecks[\s\S]*passOnlyChecks[\s\S]*selectedApiRequiredChecks[\s\S]*initialCiEvidence[\s\S]*nextActions/,
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
    /readPlatformEvidenceAudit/,
    /platformEvidence/,
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
  assert.match(production, /structured readiness check and evidence status/)
  assert.match(
    production,
    /release\s+handoff report currentness\/format\/state status/,
  )
  assert.match(
    production,
    /platform worksheet audit status with compact per-platform progress\s+counts plus exact remaining must-pass\/skippable check names and structured check descriptions/,
  )
  assert.match(production, /metadata,\s+platform, and read\s+errors/)
  assert.match(production, /release-readiness evidence status/)
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
  assert.match(
    readme,
    /platform worksheet audit status with compact per-platform progress counts, malformed outcome counts, exact remaining must-pass\/skippable check names, and structured check descriptions/,
  )
  assert.match(readme, /release tooling\/workflow blocker lists/)
  assert.match(readme, /structured readiness check and evidence status/)
  assert.match(readme, /release handoff report currentness\/format\/state status/)
  assert.match(readme, /metadata\/platform\/read errors/)
  assert.match(readme, /release-readiness evidence status/)
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
