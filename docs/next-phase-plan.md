# Next Phase Plan (Week 9-12)

## Week 9: Offline-first baseline
- Add IndexedDB cache abstraction and sync queue.
- Define conflict resolution strategy by business domain.

## Week 10: Bridge contract governance
- Introduce contract schemas in `packages/bridge-contract`.
- Add contract tests for method params/result/error.

## Week 11: Auth hardening
- Move token storage from localStorage to secure storage plugin.
- Add session risk controls (device binding, logout broadcast).

## Week 12: CI/CD hardening
- Add lint/unit tests gate.
- Add Android/iOS packaging jobs and nightly e2e smoke pipeline.
