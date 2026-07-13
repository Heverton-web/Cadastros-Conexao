# Testes Super Admin ERP Conexão — Design Doc

## Visão Geral

Duas camadas de teste:

1. **Vitest (Unit/Integration)** — Rápido, mockado, sem browser. ~30 testes passando.
2. **Playwright (E2E)** — Browser real, sem mocks. 7 scripts soltos.

## Stack

- **Test Runner:** Vitest v4.1.9 + jsdom
- **UI Test:** Testing Library (`@testing-library/react`)
- **E2E:** Playwright v1.61.0
- **Visual:** Storybook + Chromatic
- **Acessibilidade:** jest-axe
- **Performance:** k6
- **Contrato:** MSW

## Arquitetura de Mocks

```
src/__tests__/
  mocks/
    supabase.ts   → createMockSupabase(), MockQueryBuilder
    auth.ts       → profile factories
    store.ts      → zustand mocks
  test-utils.tsx  → renderWithProviders()
```

`mockQueryBuilder` é um objeto thenable encadeável:

```ts
const mock = {
  select: () => mock,
  insert: () => mock,
  eq: () => mock,
  single: () => mock,
  then: (resolve) => resolve({ data: [], error: null }),
};
```

## DIAGRAMA: Fluxo de Testes

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Componente   │────>│ Test Vitest     │────>│ Supabase     │
│  ou Serviço   │     │ (mockado)       │     │ MockQuery    │
└──────────────┘     └─────────────────┘     └──────────────┘

┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Página      │────>│ Playwright      │────>│ Supabase     │
│  Real        │     │ (browser real)  │     │ (real)       │
└──────────────┘     └─────────────────┘     └──────────────┘
```

## Convenções

- Descritores em PT-BR
- `describe('ModuleService')`, `describe('Module Permissions')`
- `beforeAll` → registerModule
- Inline `vi.mock` factory

## Test Runner Dashboard

Rota `/global/testes` usa Vite middleware plugin para executar `vitest --reporter=json` via `execSync`.
