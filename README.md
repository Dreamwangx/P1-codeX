# Enterprise Mobile Starter (React Native)

This branch switches the mobile stack to **React Native** and provides a Week 1-8 level scaffold equivalent to the previous WebView/Capacitor baseline.

## What is included
- Monorepo structure and TypeScript baseline.
- RN app scaffold under `apps/mobile-rn`.
- Bridge layer (scan/push/ble) with timeout and capability checks.
- HTTP/Auth infrastructure with trace id and token refresh single-flight.
- Push/BLE service orchestration.
- Telemetry (logger/error/perf), feature flags, and layout helpers.
- CI checks: `npm test` + `npm run typecheck`.

## Quick links
- RN setup and debug guide: `docs/rn/local-dev-debug-rn.md`
- RN architecture: `docs/rn/architecture-rn.md`
- Next phase plan (RN): `docs/rn/next-phase-plan-rn.md`
