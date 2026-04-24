# React Native Architecture (Week 1-8 scaffold)

## Layers
1. App bootstrap/context
2. Service orchestration (push/ble/auth)
3. Infra services (http/auth/token store)
4. Bridge abstraction layer
5. Native bridge adapter (placeholder for NativeModule/TurboModule)

## Core principles
- Contract-first bridge method definitions.
- Unified result/error model across bridge and http.
- Feature-flag based runtime initialization.
- Long-term maintainability through clear boundaries.
