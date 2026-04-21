# Release Runbook (Phase 1)

## Pre-release checklist
1. Ensure `npm run typecheck` passes.
2. Run smoke tests: `npm test`.
3. Verify feature flags default values for target environment.
4. Confirm push token registration success on iOS and Android test devices.
5. Confirm BLE permission + scan baseline success on iOS and Android test devices.

## Rollout strategy
- Stage 1: Internal QA only.
- Stage 2: 10% employee beta via feature flag.
- Stage 3: 50% rollout with crash/error budget gating.
- Stage 4: 100% rollout and post-release monitoring for 24h.

## Rollback strategy
- Disable `bleEnabled` / `pushEnabled` with remote feature flags.
- Revert web static assets to previous build.
- If needed, ship hotfix native build for plugin-level regressions.
