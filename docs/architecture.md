# Enterprise Mobile Architecture (Week 1-8)

## Layered Architecture
1. Presentation layer (Vue pages/components)
2. Application layer (use-case orchestration)
3. Domain layer (business rules)
4. Infra-Web layer (http, cache, observability)
5. Infra-Bridge layer (capability contract, adapter)
6. Native layer (Capacitor + iOS/Android plugin implementation)

## Key Boundaries
- Pages cannot call Capacitor plugins directly.
- All native capabilities must go through `bridge/client.ts` and plugin wrappers.
- All remote APIs must go through `services/http/httpClient.ts`.
- Bootstrap orchestration initializes auth, push, BLE, and global telemetry.

## Week 5-8 extension highlights
- Push capability abstraction with register/token/subscription flow.
- BLE capability abstraction with permission + scan/connect/disconnect.
- Device layout helpers for phone/tablet mode split.
- Feature flags and release runbook for controlled rollout.

## Long-term maintainability controls
- Contract-first bridge/types.
- Unified error model and trace id.
- Auth refresh single-flight to avoid token stampede.
- Feature-flag-first rollout with rollback levers.
