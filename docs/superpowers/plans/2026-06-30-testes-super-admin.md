# Plano de Implementação — Testes Super Admin ERP Conexão

## 7 Fases

### Fase 1: Expandir Unit/Integration (Vitest)

- 8 módulos (crm, funis, hub, linktree, mapas, nps, rotas, empresas-core): 3 arquivos cada (services, permissions, module)
- Cadastros services
- Auth provider tests

### Fase 2: Testes de Componente (Testing Library)

- Button, AlertDialog, PageHeader, PermissionBadge, ModuleCard, LoadingState, EmptyState, BuscaGlobal

### Fase 3: Expandir E2E (Playwright)

- playwright.config.ts + migrar specs existentes
- CRUD Cadastros, CRM, Despesas, Rotas
- UI Permissions, Company Selector, Error States

### Fase 4: Expandir Storybook

- Decorators (QueryClient, Auth)
- Stories para shadcn/ui + layout + shared components

### Fase 5: MSW Contract Tests

- Handlers Supabase + APIs externas
- Contract tests para CRUD + CEP + Evolution

### Fase 6: Acessibilidade (jest-axe)

- Páginas principais: login, dashboard, form, modal, sidebar, table

### Fase 7: Smoke Tests

- Login, global routes, CRUD básico

## Comandos

```bash
npm run test        # Todos os testes Vitest
npm run lint        # Lint
npm run build       # Build produção
cd tests && npx playwright test  # E2E
```

## Ordem

F1 → F2 → F3 → F6 → F5 → F4 → F7 (com paralelismo F1 + doc)
