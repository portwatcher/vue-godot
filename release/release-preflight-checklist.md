# Release Preflight Evidence Checklist

- Status: ready
- Release commit: 68f88b1254ba76795a848f14f8ed616ec489dfec
- Release Preflight run URL: https://github.com/portwatcher/vue-godot/actions/runs/28879322532
- Release Preflight run commit: aa0651b3ea285a42b2f9b11ef7fdb5d5cbdd0890
- Release Preflight conclusion: success
- Release Preflight workflow: Release Preflight
- Artifact: release-preflight-summary
- Artifact id: 8143442145
- Summary JSON: release/release-preflight-summary.json
- Checklist: release/release-preflight-checklist.md

## Gate Status

- [x] Non-local preflight: localOnly=false
- [x] Check gate ran: skipCheck=false
- [x] Godot gate ran: skipGodot=false
- [x] Serious examples gate ran: skipSeriousExamples=false
- [x] No release preflight failures: failureCount=0
- [x] No release preflight warnings: warningCount=0

## Evidence Commands

```bash
GH_TOKEN="$(gh auth token)" npm run release:preflight-summary -- --ci-evidence release/ci-runs.json --commit 68f88b1254ba76795a848f14f8ed616ec489dfec --release-preflight-run-commit aa0651b3ea285a42b2f9b11ef7fdb5d5cbdd0890 --output release/release-preflight-summary.json --checklist-output release/release-preflight-checklist.md
npm run release:evidence -- --platform-evidence release/platform-evidence.json --ci-evidence release/ci-runs.json --commit 68f88b1254ba76795a848f14f8ed616ec489dfec --real-device-output release/real-device-evidence.json --release-preflight-summary release/release-preflight-summary.json --readiness-output release/release-readiness-evidence.json
npm run release:readiness -- --expected-commit 68f88b1254ba76795a848f14f8ed616ec489dfec
```

If the summary was downloaded with `--run-url`, final readiness evidence still needs Check and Godot Smoke run metadata from `--ci-evidence` or the explicit `release:evidence` run URL options.
